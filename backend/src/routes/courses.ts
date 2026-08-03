import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  courses,
  modules,
  lessons,
  enrollments,
  lessonProgress,
} from "../db/schema.js"
import { eq, desc, like, and, sql } from "drizzle-orm"

// Query schema
const courseQuerySchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["newest", "popular", "price-low", "price-high"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
})

const courseIdParamSchema = z.object({
  id: z.string().uuid(),
})

export async function courseRoutes(app: FastifyInstance) {
  // List courses with filtering
  app.get("/", async (request, reply) => {
    const query = courseQuerySchema.parse(request.query)

    const conditions = []

    if (query.status) {
      conditions.push(eq(courses.status, query.status))
    }

    if (query.search) {
      conditions.push(like(courses.title, `%${query.search}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    let orderByClause
    switch (query.sortBy) {
      case "popular":
        orderByClause = desc(courses.createdAt)
        break
      case "price-low":
        orderByClause = courses.price
        break
      case "price-high":
        orderByClause = desc(courses.price)
        break
      default:
        orderByClause = desc(courses.createdAt)
    }

    const result = await app.db
      .select()
      .from(courses)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(query.limit)
      .offset(query.offset)

    // Get total count
    const [{ count }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(whereClause)

    return reply.send({
      data: result,
      pagination: {
        total: count,
        limit: query.limit,
        offset: query.offset,
        hasMore: count > query.offset + query.limit,
      },
    })
  })

  // Get featured courses
  app.get("/featured", async (_request, reply) => {
    const featured = await app.db
      .select()
      .from(courses)
      .where(eq(courses.status, "published"))
      .orderBy(desc(courses.createdAt))
      .limit(6)

    return reply.send({ data: featured })
  })

  // Search courses
  app.get("/search", async (request, reply) => {
    const { q } = z.object({ q: z.string().min(1) }).parse(request.query)

    const results = await app.db
      .select()
      .from(courses)
      .where(
        and(eq(courses.status, "published"), like(courses.title, `%${q}%`)),
      )
      .limit(20)

    return reply.send({ data: results })
  })

  // Get course by ID with modules and lessons
  app.get("/:id", async (request, reply) => {
    const { id } = courseIdParamSchema.parse(request.params)

    const [course] = await app.db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1)

    if (!course) {
      return reply
        .status(404)
        .send({ error: true, message: "Course not found" })
    }

    // Get modules
    const courseModules = await app.db
      .select()
      .from(modules)
      .where(eq(modules.courseId, id))
      .orderBy(modules.sortOrder)

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      courseModules.map(async (module) => {
        const moduleLessons = await app.db
          .select()
          .from(lessons)
          .where(eq(lessons.moduleId, module.id))
          .orderBy(lessons.sortOrder)

        return {
          ...module,
          lessons: moduleLessons,
        }
      }),
    )

    // Get enrollment count
    const [{ count: enrollmentCount }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.courseId, id))

    return reply.send({
      data: {
        ...course,
        modules: modulesWithLessons,
        enrollmentCount,
      },
    })
  })

  // Get course modules
  app.get("/:id/modules", async (request, reply) => {
    const { id } = courseIdParamSchema.parse(request.params)

    const courseModules = await app.db
      .select()
      .from(modules)
      .where(eq(modules.courseId, id))
      .orderBy(modules.sortOrder)

    return reply.send({ data: courseModules })
  })

  // Create course (admin/instructor only)
  app.post("/", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        currency: z.string().default("USD"),
        category: z.string().optional(),
        level: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      })
      .parse(request.body)

    const [course] = await app.db
      .insert(courses)
      .values({
        title: body.title,
        description: body.description,
        price: body.price,
        currency: body.currency,
        instructorId: request.userId,
        settings: {
          category: body.category,
          level: body.level,
          thumbnailUrl: body.thumbnailUrl,
        },
      })
      .returning()

    return reply.status(201).send({ data: course })
  })

  // Update course (admin/instructor only)
  app.put("/:id", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = courseIdParamSchema.parse(request.params)
    const body = z
      .object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        category: z.string().optional(),
        level: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      })
      .parse(request.body)

    const [course] = await app.db
      .update(courses)
      .set({
        title: body.title,
        description: body.description,
        price: body.price,
        status: body.status,
        settings: {
          category: body.category,
          level: body.level,
          thumbnailUrl: body.thumbnailUrl,
        },
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning()

    if (!course) {
      return reply
        .status(404)
        .send({ error: true, message: "Course not found" })
    }

    return reply.send({ data: course })
  })

  // Delete course (admin only)
  app.delete("/:id", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = courseIdParamSchema.parse(request.params)

    const [course] = await app.db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning()

    if (!course) {
      return reply
        .status(404)
        .send({ error: true, message: "Course not found" })
    }

    return reply.status(204).send()
  })

  // Create module (admin/instructor only)
  app.post("/:id/modules", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = courseIdParamSchema.parse(request.params)
    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
      })
      .parse(request.body)

    const [module] = await app.db
      .insert(modules)
      .values({
        courseId: id,
        title: body.title,
        description: body.description,
        sortOrder: body.sortOrder,
      })
      .returning()

    return reply.status(201).send({ data: module })
  })

  // Create lesson (admin/instructor only)
  app.post("/modules/:moduleId/lessons", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { moduleId } = z
      .object({ moduleId: z.string().uuid() })
      .parse(request.params)

    const body = z
      .object({
        title: z.string().min(1),
        content: z.string().optional(),
        contentType: z
          .enum(["lesson", "exercise", "project"])
          .default("lesson"),
        sortOrder: z.number().optional(),
        settings: z.record(z.any()).optional(),
      })
      .parse(request.body)

    const [lesson] = await app.db
      .insert(lessons)
      .values({
        moduleId,
        title: body.title,
        content: body.content,
        contentType: body.contentType,
        sortOrder: body.sortOrder,
        settings: body.settings,
      })
      .returning()

    return reply.status(201).send({ data: lesson })
  })

  // Update lesson (admin/instructor only)
  app.put("/lessons/:lessonId", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { lessonId } = z
      .object({ lessonId: z.string().uuid() })
      .parse(request.params)

    const body = z
      .object({
        title: z.string().min(1).optional(),
        content: z.string().optional(),
        contentType: z.enum(["lesson", "exercise", "project"]).optional(),
        sortOrder: z.number().optional(),
        settings: z.record(z.any()).optional(),
      })
      .parse(request.body)

    const [lesson] = await app.db
      .update(lessons)
      .set({
        title: body.title,
        content: body.content,
        contentType: body.contentType,
        sortOrder: body.sortOrder,
        settings: body.settings,
      })
      .where(eq(lessons.id, lessonId))
      .returning()

    if (!lesson) {
      return reply
        .status(404)
        .send({ error: true, message: "Lesson not found" })
    }

    return reply.send({ data: lesson })
  })
}
