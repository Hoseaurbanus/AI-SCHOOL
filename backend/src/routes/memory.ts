import { FastifyInstance } from "fastify"
import { z } from "zod"
import { studentMemory } from "../db/schema.js"
import { eq, and, sql, desc } from "drizzle-orm"

const memorySchema = z.object({
  category: z.enum(["session", "lesson", "course", "profile", "history"]),
  key: z.string().min(1),
  value: z.any(),
  expiresAt: z.string().datetime().optional(),
})

const memoryCategorySchema = z.object({
  category: z.enum(["session", "lesson", "course", "profile", "history"]),
})

// Memory manager class
class MemoryManager {
  private app: FastifyInstance

  constructor(app: FastifyInstance) {
    this.app = app
  }

  // Write memory
  async write(
    userId: string,
    category: string,
    key: string,
    value: any,
    expiresAt?: Date,
  ) {
    // Check if memory exists
    const [existing] = await this.app.db
      .select()
      .from(studentMemory)
      .where(
        and(
          eq(studentMemory.userId, userId),
          eq(studentMemory.category, category as any),
          eq(studentMemory.key, key),
        ),
      )
      .limit(1)

    if (existing) {
      // Update
      const [updated] = await this.app.db
        .update(studentMemory)
        .set({
          value,
          expiresAt: expiresAt || existing.expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(studentMemory.id, existing.id))
        .returning()
      return updated
    } else {
      // Create
      const [created] = await this.app.db
        .insert(studentMemory)
        .values({
          userId,
          category: category as any,
          key,
          value,
          expiresAt,
        })
        .returning()
      return created
    }
  }

  // Read memory
  async read(userId: string, category: string, key: string) {
    const [memory] = await this.app.db
      .select()
      .from(studentMemory)
      .where(
        and(
          eq(studentMemory.userId, userId),
          eq(studentMemory.category, category as any),
          eq(studentMemory.key, key),
        ),
      )
      .limit(1)

    if (memory && memory.expiresAt && new Date(memory.expiresAt) < new Date()) {
      // Memory expired, delete it
      await this.app.db
        .delete(studentMemory)
        .where(eq(studentMemory.id, memory.id))
      return null
    }

    return memory
  }

  // Get all memories for a category
  async getByCategory(userId: string, category: string) {
    return this.app.db
      .select()
      .from(studentMemory)
      .where(
        and(
          eq(studentMemory.userId, userId),
          eq(studentMemory.category, category as any),
        ),
      )
      .orderBy(desc(studentMemory.updatedAt))
  }

  // Get recent memories across all categories
  async getRecent(userId: string, limit: number = 10) {
    return this.app.db
      .select()
      .from(studentMemory)
      .where(eq(studentMemory.userId, userId))
      .orderBy(desc(studentMemory.updatedAt))
      .limit(limit)
  }

  // Delete memory
  async delete(userId: string, category: string, key: string) {
    await this.app.db
      .delete(studentMemory)
      .where(
        and(
          eq(studentMemory.userId, userId),
          eq(studentMemory.category, category as any),
          eq(studentMemory.key, key),
        ),
      )
  }

  // Summarize memories (for context window)
  async summarize(userId: string, maxTokens: number = 2000) {
    const memories = await this.app.db
      .select()
      .from(studentMemory)
      .where(eq(studentMemory.userId, userId))
      .orderBy(desc(studentMemory.updatedAt))
      .limit(50)

    // Group by category
    const grouped: Record<string, any[]> = {}
    for (const mem of memories) {
      const cat = mem.category || "unknown"
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(mem)
    }

    // Build summary
    let summary = "Student Context:\n"

    if (grouped.profile?.length) {
      summary += "\nProfile:\n"
      for (const mem of grouped.profile.slice(0, 5)) {
        summary += `- ${mem.key}: ${JSON.stringify(mem.value)}\n`
      }
    }

    if (grouped.course?.length) {
      summary += "\nCourse Progress:\n"
      for (const mem of grouped.course.slice(0, 5)) {
        summary += `- ${mem.key}: ${JSON.stringify(mem.value)}\n`
      }
    }

    if (grouped.lesson?.length) {
      summary += "\nRecent Lessons:\n"
      for (const mem of grouped.lesson.slice(0, 5)) {
        summary += `- ${mem.key}: ${JSON.stringify(mem.value)}\n`
      }
    }

    if (grouped.history?.length) {
      summary += "\nLearning History:\n"
      for (const mem of grouped.history.slice(0, 5)) {
        summary += `- ${mem.key}: ${JSON.stringify(mem.value)}\n`
      }
    }

    return summary
  }

  // Clean expired memories
  async cleanExpired() {
    const result = await this.app.db
      .delete(studentMemory)
      .where(
        and(
          sql`${studentMemory.expiresAt} IS NOT NULL`,
          sql`${studentMemory.expiresAt} < NOW()`,
        ),
      )
    return result
  }
}

export async function memoryRoutes(app: FastifyInstance) {
  const memoryManager = new MemoryManager(app)

  // Write memory
  app.post("/", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = memorySchema.parse(request.body)

    const memory = await memoryManager.write(
      userId,
      body.category,
      body.key,
      body.value,
      body.expiresAt ? new Date(body.expiresAt) : undefined,
    )

    return reply.status(201).send({ data: memory })
  })

  // Get recent memories (must be before /:category to avoid route conflict)
  app.get("/recent/all", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { limit } = z
      .object({ limit: z.coerce.number().min(1).max(50).default(10) })
      .parse(request.query)

    const memories = await memoryManager.getRecent(userId, limit)

    return reply.send({ data: memories })
  })

  // Get summary for AI context (must be before /:category to avoid route conflict)
  app.get("/summary/context", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { contextWindow } = z
      .object({ contextWindow: z.coerce.number().min(1).max(100).default(10) })
      .parse(request.query)

    const summary = await memoryManager.getSummaryForContext(userId, contextWindow)

    return reply.send({ data: summary })
  })

  // Clean expired memories (admin only, must be before /:category)
  app.delete("/clean/expired", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const result = await memoryManager.cleanExpired()
    return reply.send({ data: { cleaned: true } })
  })

  // Get memory by category
  app.get("/:category", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { category } = memoryCategorySchema.parse(request.params)

    const memories = await memoryManager.getByCategory(userId, category)

    return reply.send({ data: memories })
  })

  // Get specific memory
  app.get("/:category/:key", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { category, key } = z
      .object({
        category: z.string(),
        key: z.string(),
      })
      .parse(request.params)

    const memory = await memoryManager.read(userId, category, key)

    if (!memory) {
      return reply
        .status(404)
        .send({ error: true, message: "Memory not found" })
    }

    return reply.send({ data: memory })
  })

  // Delete memory by category and key
  app.delete("/:category/:key", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { category, key } = z
      .object({
        category: z.string(),
        key: z.string(),
      })
      .parse(request.params)

    await memoryManager.delete(userId, category, key)

    return reply.status(204).send()
  })
}
