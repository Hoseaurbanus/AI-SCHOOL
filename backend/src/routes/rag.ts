import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knowledgeChunks, courses, lessons, modules } from "../db/schema.js"
import { eq, and, sql } from "drizzle-orm"
import { config } from "../lib/config.js"

// Ingest course content into knowledge base
async function ingestContent(
  app: FastifyInstance,
  courseId: string,
  lessonId: string,
  content: string,
  metadata: Record<string, any>,
) {
  // Generate embedding
  const embedding = await app.ai.embed(content)

  // Store in vector DB (simulated - in production use Qdrant/Pinecone)
  const vectorId = `vec_${Date.now()}_${Math.random().toString(36).slice(2)}`

  // Store metadata in PostgreSQL
  await app.db.insert(knowledgeChunks).values({
    courseId,
    lessonId,
    content,
    metadata: {
      ...metadata,
      embeddingModel: embedding.model,
      tokens: embedding.tokens,
    },
    embeddingId: vectorId,
  })

  return vectorId
}

// Search knowledge base
async function searchKnowledge(
  app: FastifyInstance,
  query: string,
  courseId?: string,
  limit: number = 5,
) {
  // Generate query embedding
  const queryEmbedding = await app.ai.embed(query)

  // In production: query vector DB for similar embeddings
  // For now: use text search as fallback
  const conditions = []

  if (courseId) {
    conditions.push(eq(knowledgeChunks.courseId, courseId))
  }

  const chunks = await app.db
    .select()
    .from(knowledgeChunks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)

  // Simple relevance scoring (in production: use cosine similarity)
  const scored = chunks
    .map((chunk) => ({
      ...chunk,
      score: calculateRelevance(query, chunk.content || ""),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored
}

// Simple relevance scoring (BM25-like)
function calculateRelevance(query: string, content: string): number {
  const queryTerms = query.toLowerCase().split(/\s+/)
  const contentLower = content.toLowerCase()
  let score = 0

  for (const term of queryTerms) {
    const regex = new RegExp(term, "gi")
    const matches = contentLower.match(regex)
    if (matches) {
      score += matches.length
    }
  }

  return score
}

export async function ragRoutes(app: FastifyInstance) {
  // Ingest course content (admin/instructor only)
  app.post("/ingest", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = z
      .object({
        courseId: z.string().uuid(),
        lessonId: z.string().uuid(),
        content: z.string().min(1),
        metadata: z.record(z.any()).optional(),
      })
      .parse(request.body)

    const vectorId = await ingestContent(
      app,
      body.courseId,
      body.lessonId,
      body.content,
      body.metadata || {},
    )

    return reply.status(201).send({ data: { vectorId } })
  })

  // Search knowledge base
  app.post("/search", async (request, reply) => {
    const body = z
      .object({
        query: z.string().min(1),
        courseId: z.string().uuid().optional(),
        limit: z.number().min(1).max(20).default(5),
      })
      .parse(request.body)

    const results = await searchKnowledge(
      app,
      body.query,
      body.courseId,
      body.limit,
    )

    return reply.send({ data: results })
  })

  // Ingest entire course
  app.post("/ingest-course/:courseId", async (request, reply) => {
    const { courseId } = z
      .object({ courseId: z.string().uuid() })
      .parse(request.params)

    // Get course content
    const [course] = await app.db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (!course) {
      return reply
        .status(404)
        .send({ error: true, message: "Course not found" })
    }

    // Get all lessons
    const courseModules = await app.db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))

    let ingestedCount = 0

    for (const module of courseModules) {
      const moduleLessons = await app.db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, module.id))

      for (const lesson of moduleLessons) {
        if (lesson.content) {
          await ingestContent(app, courseId, lesson.id, lesson.content, {
            courseName: course.title,
            moduleName: module.title,
            lessonName: lesson.title,
          })
          ingestedCount++
        }
      }
    }

    return reply.send({
      data: {
        courseId,
        lessonsIngested: ingestedCount,
      },
    })
  })
}
