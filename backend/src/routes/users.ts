import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  users,
  enrollments,
  courses,
  lessonProgress,
  submissions,
  certificates,
  lessons,
  modules,
} from "../db/schema.js"
import { eq, and, sql, desc } from "drizzle-orm"

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  settings: z.record(z.any()).optional(),
})

export async function userRoutes(app: FastifyInstance) {
  // Get current user profile
  app.get("/me", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const [user] = await app.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      // Auto-create user from Clerk
      const [newUser] = await app.db
        .insert(users)
        .values({
          id: userId,
          email: request.headers["x-user-email"] as string || "",
          name: request.headers["x-user-name"] as string || "Student",
          role: "student",
        })
        .returning()

      return reply.send({ data: newUser })
    }

    return reply.send({ data: user })
  })

  // Update profile
  app.put("/me", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = updateProfileSchema.parse(request.body)

    const [user] = await app.db
      .update(users)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning()

    if (!user) {
      return reply.status(404).send({ error: true, message: "User not found" })
    }

    return reply.send({ data: user })
  })

  // Get student stats
  app.get("/me/stats", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    // Get enrollment count
    const [{ count: totalCourses }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.userId, userId))

    // Get completed courses
    const [{ count: completedCourses }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.status, "completed"),
        ),
      )

    // Get total lessons completed
    const [{ count: lessonsCompleted }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.status, "completed"),
        ),
      )

    // Get average score
    const [{ avgScore }] = await app.db
      .select({ avgScore: sql<number>`avg(${submissions.score})` })
      .from(submissions)
      .where(eq(submissions.userId, userId))

    // Get certificates count
    const [{ count: certificatesEarned }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(certificates)
      .where(eq(certificates.userId, userId))

    // Calculate streak (simplified - check last 7 days)
    const recentActivity = await app.db
      .select({
        date: sql<string>`date(${lessonProgress.completedAt})`,
      })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.status, "completed"),
          sql`${lessonProgress.completedAt} > NOW() - INTERVAL '7 days'`,
        ),
      )
      .groupBy(sql`date(${lessonProgress.completedAt})`)
      .orderBy(desc(sql`date(${lessonProgress.completedAt})`))

    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split("T")[0]

      if (recentActivity.some((a) => a.date === dateStr)) {
        currentStreak++
      } else if (i > 0) {
        break
      }
    }

    return reply.send({
      data: {
        totalCourses,
        completedCourses,
        lessonsCompleted,
        avgScore: avgScore ? Math.round(avgScore) : 0,
        certificatesEarned,
        currentStreak,
      },
    })
  })

  // Get activity feed
  app.get("/me/activity", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { limit } = z
      .object({ limit: z.coerce.number().min(1).max(50).default(10) })
      .parse(request.query)

    // Get recent lesson completions
    const recentLessons = await app.db
      .select({
        id: lessonProgress.id,
        type: sql<string>`'lesson_completed'`,
        title: lessons.title,
        timestamp: lessonProgress.completedAt,
        metadata: sql`json_build_object('courseId', ${courses.id}, 'courseName', ${courses.title})`,
      })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .innerJoin(courses, eq(modules.courseId, courses.id))
      .where(eq(lessonProgress.userId, userId))
      .orderBy(desc(lessonProgress.completedAt))
      .limit(limit)

    return reply.send({ data: recentLessons })
  })

  // Get enrolled courses with progress
  app.get("/me/courses", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const enrolledCourses = await app.db
      .select({
        id: enrollments.id,
        status: enrollments.status,
        progress: enrollments.progress,
        enrolledAt: enrollments.enrolledAt,
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
      .orderBy(desc(enrollments.enrolledAt))

    return reply.send({ data: enrolledCourses })
  })
}
