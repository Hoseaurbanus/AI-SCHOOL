import { FastifyInstance } from "fastify"
import { z } from "zod"
import { submissions, lessons } from "../db/schema.js"
import { eq, and, desc, sql } from "drizzle-orm"

const submissionParamSchema = z.object({
  id: z.string().uuid(),
})

const createSubmissionSchema = z.object({
  lessonId: z.string().uuid(),
  type: z.enum(["code", "assignment", "project"]),
  content: z.string().min(1),
  language: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

const gradeSubmissionSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().min(1),
  rubricScores: z.record(z.number()).optional(),
})

// Rubric definitions
const rubrics: Record<string, {
  name: string
  criteria: string[]
  weights: number[]
}> = {
  code: {
    name: "Code Quality",
    criteria: [
      "Correctness - Code runs without errors",
      "Functionality - Meets requirements",
      "Code Style - Follows best practices",
      "Readability - Clear variable names and structure",
      "Efficiency - No unnecessary operations",
    ],
    weights: [30, 25, 20, 15, 10],
  },
  assignment: {
    name: "Assignment Quality",
    criteria: [
      "Completeness - All parts addressed",
      "Accuracy - Information is correct",
      "Depth - Thorough analysis",
      "Presentation - Well-organized",
      "References - Proper citations",
    ],
    weights: [25, 25, 20, 15, 15],
  },
  project: {
    name: "Project Quality",
    criteria: [
      "Functionality - Features work correctly",
      "Code Quality - Clean, maintainable code",
      "Design - Good UX/UI",
      "Documentation - Clear README and comments",
      "Testing - Adequate test coverage",
    ],
    weights: [30, 25, 20, 15, 10],
  },
}

// AI grading with test cases
async function gradeWithAI(
  app: FastifyInstance,
  content: string,
  language: string | undefined,
  type: string,
) {
  const rubric = rubrics[type] || rubrics.code

  const messages = [
    {
      role: "system" as const,
      content: `You are an expert code grader for Smugflex AI Academy.
Grade the submission based on the following rubric:
${rubric.criteria.map((c, i) => `${i + 1}. ${c} (${rubric.weights[i]}%)`).join("\n")}

Provide:
1. Score (0-100)
2. Detailed feedback for each criterion
3. Overall feedback
4. Suggestions for improvement

Format your response as JSON:
{
  "score": <number>,
  "rubricScores": { "<criterion>": <score> },
  "feedback": "<detailed feedback>",
  "suggestions": ["<suggestion1>", "<suggestion2>"]
}`,
    },
    {
      role: "user" as const,
      content: `Grade this ${language || "code"} ${type}:\n\n${content}`,
    },
  ]

  let response = ""
  for await (const chunk of app.ai.chat({ messages })) {
    response += chunk.content
  }

  // Parse AI response
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // Fallback if JSON parsing fails
  }

  // Default response if AI fails
  return {
    score: 50,
    rubricScores: {},
    feedback:
      response || "Unable to grade automatically. Manual review required.",
    suggestions: ["Review the code and try again"],
  }
}

// Run test cases
function runTestCases(code: string, testCases: any[]) {
  const results = []

  for (const tc of testCases) {
    try {
      // Execute test case safely
      const fn = new Function(
        "input",
        `"use strict"; return (${code})(input)`,
      )
      const output = fn(tc.input)
      const passed = JSON.stringify(output) === JSON.stringify(tc.expected)

      results.push({
        id: tc.id,
        input: tc.input,
        expected: tc.expected,
        output,
        passed,
      })
    } catch (error) {
      results.push({
        id: tc.id,
        input: tc.input,
        expected: tc.expected,
        output: null,
        error: (error as Error).message,
        passed: false,
      })
    }
  }

  const passedCount = results.filter((r) => r.passed).length
  const score = Math.round((passedCount / results.length) * 100)

  return { results, score, passedCount, totalCount: results.length }
}

export async function submissionRoutes(app: FastifyInstance) {
  // Create submission
  app.post("/", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = createSubmissionSchema.parse(request.body)

    const [submission] = await app.db
      .insert(submissions)
      .values({
        userId,
        lessonId: body.lessonId,
        type: body.type,
        content: body.content,
        language: body.language,
        status: "submitted",
      })
      .returning()

    // Auto-grade with AI
    try {
      const grade = await gradeWithAI(
        app,
        body.content,
        body.language,
        body.type,
      )

      const [updated] = await app.db
        .update(submissions)
        .set({
          score: grade.score,
          feedback: grade.feedback,
          status: "graded",
        })
        .where(eq(submissions.id, submission.id))
        .returning()

      return reply.status(201).send({
        data: {
          ...updated,
          grading: grade,
        },
      })
    } catch (error) {
      // If AI grading fails, leave for manual review
      return reply.status(201).send({
        data: {
          ...submission,
          grading: null,
          message: "Submission received. Grading in progress.",
        },
      })
    }
  })

  // Get user's submissions (must be before /:id to avoid route conflict)
  app.get("/me", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { type, status } = z
      .object({
        type: z.enum(["code", "assignment", "project"]).optional(),
        status: z.enum(["submitted", "graded", "returned"]).optional(),
      })
      .parse(request.query)

    const conditions = [eq(submissions.userId, userId)]
    if (type) conditions.push(eq(submissions.type, type))
    if (status) conditions.push(eq(submissions.status, status))

    const userSubmissions = await app.db
      .select()
      .from(submissions)
      .where(and(...conditions))
      .orderBy(desc(submissions.createdAt))

    return reply.send({ data: userSubmissions })
  })

  // Get submission by ID
  app.get("/:id", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = submissionParamSchema.parse(request.params)

    const [submission] = await app.db
      .select()
      .from(submissions)
      .where(and(eq(submissions.id, id), eq(submissions.userId, userId)))
      .limit(1)

    if (!submission) {
      return reply
        .status(404)
        .send({ error: true, message: "Submission not found" })
    }

    return reply.send({ data: submission })
  })

  // Grade submission (admin/instructor)
  app.post("/:id/grade", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = submissionParamSchema.parse(request.params)
    const body = gradeSubmissionSchema.parse(request.body)

    const [submission] = await app.db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1)

    if (!submission) {
      return reply
        .status(404)
        .send({ error: true, message: "Submission not found" })
    }

    const [updated] = await app.db
      .update(submissions)
      .set({
        score: body.score,
        feedback: body.feedback,
        status: "graded",
        humanReviewed: true,
      })
      .where(eq(submissions.id, id))
      .returning()

    return reply.send({ data: updated })
  })

  // Get submissions needing review
  app.get("/admin/pending", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const pendingSubmissions = await app.db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.status, "submitted"),
          eq(submissions.humanReviewed, false),
        ),
      )
      .orderBy(submissions.createdAt)
      .limit(50)

    return reply.send({ data: pendingSubmissions })
  })

  // Get grading rubric
  app.get("/rubrics/:type", async (request, reply) => {
    const { type } = z
      .object({ type: z.enum(["code", "assignment", "project"]) })
      .parse(request.params)

    const rubric = rubrics[type]

    if (!rubric) {
      return reply
        .status(404)
        .send({ error: true, message: "Rubric not found" })
    }

    return reply.send({ data: rubric })
  })

  // Run test cases on submission
  app.post("/:id/test", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = submissionParamSchema.parse(request.params)
    const { testCases } = z
      .object({
        testCases: z.array(
          z.object({
            id: z.string(),
            input: z.any(),
            expected: z.any(),
          }),
        ),
      })
      .parse(request.body)

    const [submission] = await app.db
      .select()
      .from(submissions)
      .where(and(eq(submissions.id, id), eq(submissions.userId, userId)))
      .limit(1)

    if (!submission) {
      return reply
        .status(404)
        .send({ error: true, message: "Submission not found" })
    }

    const results = runTestCases(submission.content || "", testCases)

    return reply.send({ data: results })
  })
}
