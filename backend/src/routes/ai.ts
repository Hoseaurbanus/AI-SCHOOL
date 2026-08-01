import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  conversations,
  messages,
  courses,
  lessons,
  studentMemory,
} from "../db/schema.js"
import { eq, and, sql, desc } from "drizzle-orm"

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

// Context assembly
async function assembleContext(
  app: FastifyInstance,
  userId: string,
  courseId?: string,
  lessonId?: string,
) {
  const context: string[] = []

  // Get student memory
  const memories = await app.db
    .select()
    .from(studentMemory)
    .where(eq(studentMemory.userId, userId))
    .orderBy(desc(studentMemory.updatedAt))
    .limit(10)

  if (memories.length > 0) {
    context.push("Student Context:")
    for (const mem of memories) {
      context.push(`- ${mem.key}: ${JSON.stringify(mem.value)}`)
    }
  }

  // Get course context
  if (courseId) {
    const [course] = await app.db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (course) {
      context.push("\nCourse Context:")
      context.push(`- Course: ${course.title}`)
      context.push(`- Description: ${course.description || "N/A"}`)
    }
  }

  // Get lesson context
  if (lessonId) {
    const [lesson] = await app.db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1)

    if (lesson) {
      context.push("\nLesson Context:")
      context.push(`- Lesson: ${lesson.title}`)
      if (lesson.content) {
        // Truncate to avoid token limits
        context.push(`- Content Preview: ${lesson.content.slice(0, 500)}...`)
      }
    }
  }

  // Get recent conversation
  if (userId) {
    const recentMessages = await app.db
      .select()
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .where(eq(conversations.userId, userId))
      .orderBy(desc(messages.createdAt))
      .limit(5)

    if (recentMessages.length > 0) {
      context.push("\nRecent Conversation:")
      for (const msg of recentMessages) {
        context.push(
          `- ${msg.messages.role}: ${(msg.messages.content || "").slice(0, 100)}`,
        )
      }
    }
  }

  return context.join("\n")
}

// System prompts per agent type
const systemPrompts: Record<string, string> = {
  tutor: `You are an AI tutor for Smugflex AI Academy.
You help students learn programming concepts, debug code, and understand lessons.
Be helpful, encouraging, and educational.
If you provide code examples, format them clearly.
Keep responses concise but thorough.`,
  mentor: `You are an AI mentor for Smugflex AI Academy.
Guide students on their learning journey, provide career advice, and help them set goals.
Be supportive, insightful, and experienced.`,
  coder: `You are an expert coding assistant for Smugflex AI Academy.
Help students write, debug, and understand code.
Provide clear explanations with code examples.
Focus on best practices and learning opportunities.`,
  assessor: `You are an assessment evaluator for Smugflex AI Academy.
Evaluate student submissions fairly and provide constructive feedback.
Be encouraging while pointing out areas for improvement.`,
  coach: `You are an AI learning coach for Smugflex AI Academy.
Help students optimize their study habits, manage time, and stay motivated.
Be encouraging and provide actionable advice.`,
}

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
      // Get or create conversation
      let conversationId = body.conversationId

      if (!conversationId && request.userId) {
        const [conversation] = await app.db
          .insert(conversations)
          .values({
            userId: request.userId,
            courseId: body.courseId,
            lessonId: body.lessonId,
            agentType: body.agentType,
          })
          .returning()
        conversationId = conversation.id
      }

      // Assemble context
      const context = request.userId
        ? await assembleContext(
            app,
            request.userId,
            body.courseId,
            body.lessonId,
          )
        : ""

      // Build messages
      const messages_arr = [
        {
          role: "system" as const,
          content: `${systemPrompts[body.agentType] || systemPrompts.tutor}\n\n${context}`,
        },
        { role: "user" as const, content: body.message },
      ]

      let fullResponse = ""

      for await (const chunk of app.ai.chat({
        messages: messages_arr,
        stream: true,
      })) {
        fullResponse += chunk.content
        reply.raw.write(
          `data: ${JSON.stringify({ content: chunk.content })}\n\n`,
        )
      }

      // Save messages
      if (conversationId && request.userId) {
        await app.db.insert(messages).values({
          conversationId,
          role: "user",
          content: body.message,
        })

        await app.db.insert(messages).values({
          conversationId,
          role: "assistant",
          content: fullResponse,
        })
      }

      reply.raw.write(
        `data: ${JSON.stringify({ done: true, conversationId, fullResponse })}\n\n`,
      )
      reply.raw.end()
    } catch (error) {
      reply.raw.write(
        `data: ${JSON.stringify({ error: true, message: "AI service unavailable" })}\n\n`,
      )
      reply.raw.end()
    }
  })

  // Get chat history
  app.get("/chat/history", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { courseId, limit } = z
      .object({
        courseId: z.string().uuid().optional(),
        limit: z.coerce.number().min(1).max(100).default(50),
      })
      .parse(request.query)

    // Get conversations
    const conditions = [eq(conversations.userId, userId)]
    if (courseId) {
      conditions.push(eq(conversations.courseId, courseId))
    }

    const userConversations = await app.db
      .select()
      .from(conversations)
      .where(and(...conditions))
      .orderBy(desc(conversations.updatedAt))
      .limit(1)

    if (userConversations.length === 0) {
      return reply.send({ data: [] })
    }

    // Get messages for most recent conversation
    const chatMessages = await app.db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, userConversations[0].id))
      .orderBy(messages.createdAt)
      .limit(limit)

    return reply.send({
      data: chatMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      })),
    })
  })

  // Get AI insights
  app.get("/insights", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    // Generate insights based on student activity
    const insights = [
      {
        type: "strength",
        title: "Strong Problem Solving",
        description: "You excel at breaking down complex problems.",
      },
      {
        type: "improvement",
        title: "Error Handling",
        description: "Practice adding try-catch blocks in your code.",
      },
      {
        type: "recommendation",
        title: "Next Steps",
        description: "Try the advanced JavaScript module next.",
      },
    ]

    return reply.send({ data: insights })
  })

  // Get student stats
  app.get("/stats", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const stats = {
      totalHours: 12,
      lessonsCompleted: 8,
      currentStreak: 3,
      avgScore: 85,
      coursesEnrolled: 2,
      certificatesEarned: 0,
    }

    return reply.send({ data: stats })
  })

  // Code review
  app.post("/code/review", async (request, reply) => {
    const body = codeReviewSchema.parse(request.body)

    const messages_arr = [
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
    for await (const chunk of app.ai.chat({ messages: messages_arr })) {
      review += chunk.content
    }

    return reply.send({ data: { review } })
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
      data: {
        hint,
        attempt: body.attempt,
        maxAttempts: hintLevels.length,
      },
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

    return reply.send({ data: recommendations })
  })
}
