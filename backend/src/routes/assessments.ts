import { FastifyInstance } from "fastify"
import { z } from "zod"
import { assessments, assessmentResults } from "../db/schema.js"
import { eq, and } from "drizzle-orm"

const assessmentParamSchema = z.object({
  id: z.string().uuid(),
})

const submitAssessmentSchema = z.object({
  answers: z.record(z.array(z.string())),
  timeTaken: z.number().min(0),
})

export async function assessmentRoutes(app: FastifyInstance) {
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

    return reply.send({ assessment })
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

    return reply.send({
      assessment,
      attemptNumber: previousAttempts.length + 1,
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

    questions.forEach((question: any) => {
      totalPoints += question.points
      const userAnswers = body.answers[question.id] || []
      const correctAnswers = question.correctAnswers || []

      if (
        JSON.stringify(userAnswers.sort()) ===
        JSON.stringify(correctAnswers.sort())
      ) {
        score += question.points
      }
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
      result,
      score: scorePercentage,
      passed,
      totalPoints,
      earnedPoints: score,
    })
  })

  // Get user's results
  app.get("/me/results", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const results = await app.db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, userId))

    return reply.send({ results })
  })
}
