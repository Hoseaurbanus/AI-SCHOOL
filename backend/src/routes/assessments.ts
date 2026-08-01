import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  assessments,
  assessmentResults,
  courses,
  modules,
} from "../db/schema.js"
import { eq, and, desc, sql } from "drizzle-orm"

const assessmentParamSchema = z.object({
  id: z.string().uuid(),
})

const submitAssessmentSchema = z.object({
  answers: z.record(z.array(z.string())),
  timeTaken: z.number().min(0),
})

const createAssessmentSchema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  timeLimit: z.number().min(1).optional(),
  passingScore: z.number().min(0).max(100).default(70),
  questions: z.array(
    z.object({
      id: z.string(),
      type: z.enum([
        "multiple-choice",
        "multiple-select",
        "true-false",
        "short-answer",
      ]),
      question: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswers: z.array(z.string()),
      points: z.number().min(1).default(1),
      explanation: z.string().optional(),
    }),
  ),
})

export async function assessmentRoutes(app: FastifyInstance) {
  // List assessments (optionally by course)
  app.get("/", async (request, reply) => {
    const { courseId, moduleId } = z
      .object({
        courseId: z.string().uuid().optional(),
        moduleId: z.string().uuid().optional(),
      })
      .parse(request.query)

    const conditions = []
    if (courseId) conditions.push(eq(assessments.courseId, courseId))
    if (moduleId) conditions.push(eq(assessments.moduleId, moduleId))

    const result = await app.db
      .select()
      .from(assessments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(assessments.createdAt))

    return reply.send({ data: result })
  })

  // Get assessment by ID
  app.get("/:id", async (request, reply) => {
    const { id } = assessmentParamSchema.parse(request.params)

    const [assessment] = await app.db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1)

    if (!assessment) {
      return reply
        .status(404)
        .send({ error: true, message: "Assessment not found" })
    }

    // Get course info
    const [course] = assessment.courseId
      ? await app.db
          .select()
          .from(courses)
          .where(eq(courses.id, assessment.courseId))
          .limit(1)
      : [undefined]

    return reply.send({
      data: {
        ...assessment,
        course: course ? { id: course.id, title: course.title } : undefined,
      },
    })
  })

  // Create assessment
  app.post("/", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = createAssessmentSchema.parse(request.body)

    const [assessment] = await app.db
      .insert(assessments)
      .values({
        courseId: body.courseId,
        moduleId: body.moduleId,
        title: body.title,
        description: body.description,
        timeLimit: body.timeLimit,
        passingScore: body.passingScore,
        questions: body.questions,
      })
      .returning()

    return reply.status(201).send({ data: assessment })
  })

  // Start assessment
  app.post("/:id/start", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = assessmentParamSchema.parse(request.params)

    const [assessment] = await app.db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1)

    if (!assessment) {
      return reply
        .status(404)
        .send({ error: true, message: "Assessment not found" })
    }

    // Check attempt limits
    const previousAttempts = await app.db
      .select()
      .from(assessmentResults)
      .where(
        and(
          eq(assessmentResults.assessmentId, id),
          eq(assessmentResults.userId, userId),
        ),
      )

    const maxAttempts = 3
    if (previousAttempts.length >= maxAttempts) {
      return reply.status(400).send({
        error: true,
        message: `Maximum attempts (${maxAttempts}) reached`,
      })
    }

    // Return questions without correct answers
    const questions = (assessment.questions as any[]).map((q: any) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      points: q.points,
    }))

    return reply.send({
      data: {
        assessmentId: id,
        title: assessment.title,
        description: assessment.description,
        timeLimit: assessment.timeLimit,
        questions,
        attemptNumber: previousAttempts.length + 1,
        maxAttempts,
      },
    })
  })

  // Submit assessment
  app.post("/:id/submit", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = assessmentParamSchema.parse(request.params)
    const body = submitAssessmentSchema.parse(request.body)

    const [assessment] = await app.db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1)

    if (!assessment) {
      return reply
        .status(404)
        .send({ error: true, message: "Assessment not found" })
    }

    // Grade assessment (deterministic for MCQ)
    const questions = assessment.questions as any[]
    let score = 0
    let totalPoints = 0
    const questionResults: any[] = []

    questions.forEach((question: any) => {
      totalPoints += question.points
      const userAnswers = body.answers[question.id] || []
      const correctAnswers = question.correctAnswers || []

      const isCorrect =
        JSON.stringify(userAnswers.sort()) ===
        JSON.stringify(correctAnswers.sort())

      if (isCorrect) {
        score += question.points
      }

      questionResults.push({
        questionId: question.id,
        userAnswers,
        correctAnswers,
        isCorrect,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0,
        explanation: question.explanation,
      })
    })

    const scorePercentage = Math.round((score / totalPoints) * 100)
    const passed = scorePercentage >= (assessment.passingScore || 70)

    // Save result
    const [result] = await app.db
      .insert(assessmentResults)
      .values({
        assessmentId: id,
        userId,
        answers: body.answers,
        score: scorePercentage,
        passed,
        timeTaken: body.timeTaken,
        aiConfidence: "1.00", // Deterministic grading = 100% confidence
      })
      .returning()

    return reply.send({
      data: {
        resultId: result.id,
        score: scorePercentage,
        passed,
        totalPoints,
        earnedPoints: score,
        passingScore: assessment.passingScore || 70,
        timeTaken: body.timeTaken,
        questionResults,
      },
    })
  })

  // Get user's results
  app.get("/me/results", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const results = await app.db
      .select({
        id: assessmentResults.id,
        assessmentId: assessmentResults.assessmentId,
        score: assessmentResults.score,
        passed: assessmentResults.passed,
        timeTaken: assessmentResults.timeTaken,
        completedAt: assessmentResults.completedAt,
        assessmentTitle: assessments.title,
        courseTitle: sql<string>`(SELECT title FROM courses WHERE id = ${assessments.courseId})`,
      })
      .from(assessmentResults)
      .innerJoin(
        assessments,
        eq(assessmentResults.assessmentId, assessments.id),
      )
      .where(eq(assessmentResults.userId, userId))
      .orderBy(desc(assessmentResults.completedAt))

    return reply.send({ data: results })
  })

  // Get result by ID
  app.get("/results/:resultId", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { resultId } = z
      .object({ resultId: z.string().uuid() })
      .parse(request.params)

    const [result] = await app.db
      .select()
      .from(assessmentResults)
      .where(
        and(
          eq(assessmentResults.id, resultId),
          eq(assessmentResults.userId, userId),
        ),
      )
      .limit(1)

    if (!result) {
      return reply
        .status(404)
        .send({ error: true, message: "Result not found" })
    }

    // Get assessment details
    const [assessment] = result.assessmentId
      ? await app.db
          .select()
          .from(assessments)
          .where(eq(assessments.id, result.assessmentId))
          .limit(1)
      : [undefined]

    return reply.send({
      data: {
        ...result,
        assessment: assessment
          ? {
              title: assessment.title,
              questions: assessment.questions,
              passingScore: assessment.passingScore,
            }
          : undefined,
      },
    })
  })
}
