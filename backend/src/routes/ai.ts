import { FastifyInstance } from "fastify"
import { z } from "zod"

// Chat schema
const chatSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
  agentType: z
    .enum(["tutor", "mentor", "coder", "assessor", "coach"])
    .default("tutor"),
})

// Code review schema
const codeReviewSchema = z.object({
  code: z.string().min(1),
  language: z.enum(["html", "css", "javascript", "python", "sql"]),
  context: z.string().optional(),
})

// Hint schema
const hintSchema = z.object({
  exerciseId: z.string().uuid(),
  attempt: z.number().min(1).max(5),
  userCode: z.string().optional(),
})

export async function aiRoutes(app: FastifyInstance) {
  // Chat with AI (streaming)
  app.post("/chat", async (request, reply) => {
    const body = chatSchema.parse(request.body)

    // Set up SSE headers
    reply.raw.setHeader("Content-Type", "text/event-stream")
    reply.raw.setHeader("Cache-Control", "no-cache")
    reply.raw.setHeader("Connection", "keep-alive")
    reply.raw.setHeader("X-Accel-Buffering", "no")

    try {
      const messages = [
        {
          role: "system" as const,
          content: `You are an AI tutor for the Smugflex AI Academy. 
          You help students learn programming concepts, debug code, and understand lessons.
          Be helpful, encouraging, and educational.
          If you provide code examples, format them clearly.
          Keep responses concise but thorough.`,
        },
        { role: "user" as const, content: body.message },
      ]

      let fullResponse = ""

      for await (const chunk of app.ai.chat({ messages, stream: true })) {
        fullResponse += chunk.content
        reply.raw.write(
          `data: ${JSON.stringify({ content: chunk.content })}\n\n`,
        )
      }

      reply.raw.write(
        `data: ${JSON.stringify({ done: true, fullResponse })}\n\n`,
      )
      reply.raw.end()
    } catch (error) {
      reply.raw.write(
        `data: ${JSON.stringify({ error: true, message: "AI service unavailable" })}\n\n`,
      )
      reply.raw.end()
    }
  })

  // Code review
  app.post("/code/review", async (request, reply) => {
    const body = codeReviewSchema.parse(request.body)

    const messages = [
      {
        role: "system" as const,
        content: `You are an expert code reviewer. Analyze the provided code for:
        - Correctness and bugs
        - Code quality and best practices
        - Performance issues
        - Security concerns
        - Readability and maintainability
        
        Provide a structured review with:
        1. Overall assessment
        2. Issues found (categorized by severity)
        3. Suggestions for improvement
        4. Fixed code examples where applicable`,
      },
      {
        role: "user" as const,
        content: `Review this ${body.language} code:\n\n\`\`\`${body.language}\n${body.code}\n\`\`\`\n\n${
          body.context ? `Context: ${body.context}` : ""
        }`,
      },
    ]

    let review = ""
    for await (const chunk of app.ai.chat({ messages })) {
      review += chunk.content
    }

    return reply.send({ review })
  })

  // Get hint
  app.post("/code/hint", async (request, reply) => {
    const body = hintSchema.parse(request.body)

    const hintLevels = [
      "Think about the concept involved. What do you know about this topic?",
      "Consider the approach. What steps would you take to solve this?",
      "Here is a hint: Try breaking the problem into smaller parts.",
      "Here is some code to get you started (partial solution).",
      "Here is the complete solution. Study it and try to understand each part.",
    ]

    const hintIndex = Math.min(body.attempt - 1, hintLevels.length - 1)
    const hint = hintLevels[hintIndex]

    return reply.send({
      hint,
      attempt: body.attempt,
      maxAttempts: hintLevels.length,
    })
  })

  // Get recommendations
  app.get("/recommendations", async (request, reply) => {
    // TODO: Implement personalized recommendations based on student progress
    const recommendations = [
      {
        type: "course",
        title: "Recommended Course",
        reason: "Based on your interests",
      },
      {
        type: "lesson",
        title: "Review Lesson",
        reason: "You struggled with this topic",
      },
      {
        type: "practice",
        title: "Practice Exercise",
        reason: "Strengthen your skills",
      },
    ]

    return reply.send({ recommendations })
  })
}
