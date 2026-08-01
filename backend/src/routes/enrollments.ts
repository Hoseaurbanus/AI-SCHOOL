import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  enrollments,
  courses,
  lessonProgress,
  lessons,
  modules,
} from "../db/schema.js"
import { eq, and, sql } from "drizzle-orm"

const enrollSchema = z.object({
  courseId: z.string().uuid(),
})

const enrollmentParamSchema = z.object({
  id: z.string().uuid(),
})

export async function enrollmentRoutes(app: FastifyInstance) {
  // Get user's enrollments
  app.get("/me", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const userEnrollments = await app.db
      .select({
        id: enrollments.id,
        status: enrollments.status,
        progress: enrollments.progress,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
          thumbnailUrl: sql`COALESCE(${courses.settings}->>'thumbnailUrl', '')`,
        },
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))

    return reply.send({ data: userEnrollments })
  })

  // Enroll in a course
  app.post("/", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = enrollSchema.parse(request.body)

    // Check if course exists
    const [course] = await app.db
      .select()
      .from(courses)
      .where(eq(courses.id, body.courseId))
      .limit(1)

    if (!course) {
      return reply
        .status(404)
        .send({ error: true, message: "Course not found" })
    }

    // Check if already enrolled
    const [existingEnrollment] = await app.db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, body.courseId),
        ),
      )
      .limit(1)

    if (existingEnrollment) {
      return reply
        .status(409)
        .send({ error: true, message: "Already enrolled in this course" })
    }

    // Create enrollment
    const [enrollment] = await app.db
      .insert(enrollments)
      .values({
        userId,
        courseId: body.courseId,
      })
      .returning()

    return reply.status(201).send({ data: enrollment })
  })

  // Update progress
  app.put("/:id/progress", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = enrollmentParamSchema.parse(request.params)
    const body = z
      .object({
        progress: z.record(z.any()),
      })
      .parse(request.body)

    const [enrollment] = await app.db
      .update(enrollments)
      .set({ progress: body.progress })
      .where(and(eq(enrollments.id, id), eq(enrollments.userId, userId)))
      .returning()

    if (!enrollment) {
      return reply
        .status(404)
        .send({ error: true, message: "Enrollment not found" })
    }

    return reply.send({ data: enrollment })
  })

  // Get enrollment with progress details
  app.get("/:id", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id } = enrollmentParamSchema.parse(request.params)

    const [enrollment] = await app.db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.id, id), eq(enrollments.userId, userId)))
      .limit(1)

    if (!enrollment) {
      return reply
        .status(404)
        .send({ error: true, message: "Enrollment not found" })
    }

    // Get course with modules and lessons
    const courseId = enrollment.courseId!
    const [course] = await app.db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    const courseModules = await app.db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(modules.sortOrder)

    // Get all lessons for the course
    const allLessons = await app.db
      .select({
        id: lessons.id,
        moduleId: lessons.moduleId,
        title: lessons.title,
        contentType: lessons.contentType,
      })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, courseId))

    // Get lesson progress for this user
    const userProgress = await app.db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId))

    // Calculate progress
    const completedLessons = userProgress.filter(
      (p) => p.status === "completed",
    ).length
    const totalLessons = allLessons.length
    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    return reply.send({
      data: {
        ...enrollment,
        course,
        modules: courseModules,
        totalLessons,
        completedLessons,
        progressPercent,
        lessonProgress: userProgress,
      },
    })
  })

  // Mark lesson as complete
  app.post("/:id/lessons/:lessonId/complete", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { id: enrollmentId, lessonId } = z
      .object({
        id: z.string().uuid(),
        lessonId: z.string().uuid(),
      })
      .parse(request.params)

    // Verify enrollment
    const [enrollment] = await app.db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, userId)),
      )
      .limit(1)

    if (!enrollment) {
      return reply
        .status(404)
        .send({ error: true, message: "Enrollment not found" })
    }

    // Check if progress exists
    const [existingProgress] = await app.db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.lessonId, lessonId),
        ),
      )
      .limit(1)

    if (existingProgress) {
      // Update existing progress
      await app.db
        .update(lessonProgress)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(lessonProgress.id, existingProgress.id))
    } else {
      // Create new progress
      await app.db.insert(lessonProgress).values({
        userId,
        lessonId,
        status: "completed",
        completedAt: new Date(),
      })
    }

    // Update enrollment progress
    const allLessons = await app.db
      .select({ id: lessons.id })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, enrollment.courseId!))

    const userProgress = await app.db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.status, "completed"),
        ),
      )

    const completedCount = userProgress.length
    const totalCount = allLessons.length

    await app.db
      .update(enrollments)
      .set({
        progress: {
          completedLessons: completedCount,
          totalLessons: totalCount,
          percent:
            totalCount > 0
              ? Math.round((completedCount / totalCount) * 100)
              : 0,
        },
      })
      .where(eq(enrollments.id, enrollmentId))

    return reply.send({ success: true })
  })
}
