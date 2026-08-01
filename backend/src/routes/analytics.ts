import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  users,
  courses,
  enrollments,
  lessonProgress,
  submissions,
  assessmentResults,
  certificates,
  analyticsEvents,
} from "../db/schema.js"
import { eq, and, sql, desc } from "drizzle-orm"

// Track analytics event
async function trackEvent(
  app: FastifyInstance,
  userId: string,
  eventType: string,
  properties?: Record<string, any>,
) {
  await app.db.insert(analyticsEvents).values({
    userId,
    eventType,
    properties,
  })
}

// Get student analytics
async function getStudentAnalytics(app: FastifyInstance, userId: string) {
  // Get enrollment stats
  const [{ count: totalEnrollments }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(enrollments)
    .where(eq(enrollments.userId, userId))

  const [{ count: completedCourses }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.status, "completed")),
    )

  // Get lesson progress
  const [{ count: totalLessonsCompleted }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.status, "completed"),
      ),
    )

  // Get submission stats
  const [{ count: totalSubmissions }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(submissions)
    .where(eq(submissions.userId, userId))

  const [{ avgScore }] = await app.db
    .select({ avgScore: sql<number>`avg(${submissions.score})` })
    .from(submissions)
    .where(
      and(
        eq(submissions.userId, userId),
        sql`${submissions.score} IS NOT NULL`,
      ),
    )

  // Get assessment stats
  const [{ count: assessmentsTaken }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(assessmentResults)
    .where(eq(assessmentResults.userId, userId))

  const [{ count: assessmentsPassed }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(assessmentResults)
    .where(
      and(
        eq(assessmentResults.userId, userId),
        eq(assessmentResults.passed, true),
      ),
    )

  // Get certificates
  const [{ count: certificatesEarned }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(certificates)
    .where(eq(certificates.userId, userId))

  // Calculate learning streak
  const recentActivity = await app.db
    .select({
      date: sql<string>`date(${lessonProgress.completedAt})`,
    })
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.status, "completed"),
        sql`${lessonProgress.completedAt} > NOW() - INTERVAL '30 days'`,
      ),
    )
    .groupBy(sql`date(${lessonProgress.completedAt})`)
    .orderBy(desc(sql`date(${lessonProgress.completedAt})`))

  let currentStreak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split("T")[0]

    if (recentActivity.some((a) => a.date === dateStr)) {
      currentStreak++
    } else if (i > 0) {
      break
    }
  }

  // Get activity by day (last 7 days)
  const activityByDay = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const [{ count }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.status, "completed"),
          sql`date(${lessonProgress.completedAt}) = ${dateStr}`,
        ),
      )

    activityByDay.push({
      date: dateStr,
      lessonsCompleted: count,
    })
  }

  return {
    enrollments: {
      total: totalEnrollments,
      completed: completedCourses,
      inProgress: totalEnrollments - completedCourses,
    },
    lessons: {
      completed: totalLessonsCompleted,
    },
    submissions: {
      total: totalSubmissions,
      avgScore: avgScore ? Math.round(avgScore) : 0,
    },
    assessments: {
      taken: assessmentsTaken,
      passed: assessmentsPassed,
      passRate:
        assessmentsTaken > 0
          ? Math.round((assessmentsPassed / assessmentsTaken) * 100)
          : 0,
    },
    certificates: certificatesEarned,
    streak: currentStreak,
    activityByDay,
  }
}

// Get course analytics
async function getCourseAnalytics(app: FastifyInstance, courseId: string) {
  // Get enrollment stats
  const [{ count: totalEnrollments }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId))

  const [{ count: completedEnrollments }] = await app.db
    .select({ count: sql<number>`count(*)` })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.status, "completed"),
      ),
    )

  // Get average progress
  const [{ avgProgress }] = await app.db
    .select({
      avgProgress: sql<number>`avg((${enrollments.progress}->>'percent')::int)`,
    })
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId))

  // Get assessment stats
  const courseAssessments = await app.db
    .select({ id: sql<string>`id` })
    .from(sql`assessments`)
    .where(sql`course_id = ${courseId}`)

  const assessmentIds = courseAssessments.map((a) => a.id)

  let avgAssessmentScore = 0
  let assessmentPassRate = 0

  if (assessmentIds.length > 0) {
    const [{ avgScore }] = await app.db
      .select({ avgScore: sql<number>`avg(${assessmentResults.score})` })
      .from(assessmentResults)
      .where(sql`${assessmentResults.assessmentId} = ANY(${assessmentIds})`)

    const [{ passed }] = await app.db
      .select({ passed: sql<number>`count(*)` })
      .from(assessmentResults)
      .where(
        and(
          sql`${assessmentResults.assessmentId} = ANY(${assessmentIds})`,
          eq(assessmentResults.passed, true),
        ),
      )

    const [{ total }] = await app.db
      .select({ total: sql<number>`count(*)` })
      .from(assessmentResults)
      .where(sql`${assessmentResults.assessmentId} = ANY(${assessmentIds})`)

    avgAssessmentScore = avgScore ? Math.round(avgScore) : 0
    assessmentPassRate = total > 0 ? Math.round((passed / total) * 100) : 0
  }

  // Get enrollment trend (last 30 days)
  const enrollmentTrend = await app.db
    .select({
      date: sql<string>`date(${enrollments.enrolledAt})`,
      count: sql<number>`count(*)`,
    })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.courseId, courseId),
        sql`${enrollments.enrolledAt} > NOW() - INTERVAL '30 days'`,
      ),
    )
    .groupBy(sql`date(${enrollments.enrolledAt})`)
    .orderBy(sql`date(${enrollments.enrolledAt})`)

  return {
    enrollments: {
      total: totalEnrollments,
      completed: completedEnrollments,
      completionRate:
        totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0,
    },
    avgProgress: avgProgress ? Math.round(avgProgress) : 0,
    assessments: {
      avgScore: avgAssessmentScore,
      passRate: assessmentPassRate,
    },
    enrollmentTrend,
  }
}

export async function analyticsRoutes(app: FastifyInstance) {
  // Track event
  app.post("/events", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const body = z
      .object({
        eventType: z.string().min(1),
        properties: z.record(z.any()).optional(),
      })
      .parse(request.body)

    await trackEvent(app, userId, body.eventType, body.properties)

    return reply.status(201).send({ success: true })
  })

  // Get student analytics
  app.get("/student", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const analytics = await getStudentAnalytics(app, userId)

    return reply.send({ data: analytics })
  })

  // Get course analytics
  app.get("/course/:courseId", async (request, reply) => {
    const { courseId } = z
      .object({ courseId: z.string().uuid() })
      .parse(request.params)

    const analytics = await getCourseAnalytics(app, courseId)

    return reply.send({ data: analytics })
  })

  // Get admin analytics
  app.get("/admin", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    // Platform-wide stats
    const [{ count: totalUsers }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    const [{ count: totalCourses }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(eq(courses.status, "published"))

    const [{ count: totalEnrollments }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)

    const [{ count: totalCertificates }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(certificates)

    const [{ totalRevenue }] = await app.db
      .select({
        totalRevenue: sql<number>`COALESCE(sum(${courses.price}), 0)`,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))

    // Recent activity
    const recentUsers = await app.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5)

    const recentEnrollments = await app.db
      .select({
        id: enrollments.id,
        enrolledAt: enrollments.enrolledAt,
        courseTitle: courses.title,
        userName: users.name,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .innerJoin(users, eq(enrollments.userId, users.id))
      .orderBy(desc(enrollments.enrolledAt))
      .limit(5)

    return reply.send({
      data: {
        overview: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalCertificates,
          totalRevenue,
        },
        recentUsers,
        recentEnrollments,
      },
    })
  })

  // Get event history
  app.get("/events", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { limit, eventType } = z
      .object({
        limit: z.coerce.number().min(1).max(100).default(50),
        eventType: z.string().optional(),
      })
      .parse(request.query)

    const conditions = [eq(analyticsEvents.userId, userId)]
    if (eventType) {
      conditions.push(eq(analyticsEvents.eventType, eventType))
    }

    const events = await app.db
      .select()
      .from(analyticsEvents)
      .where(and(...conditions))
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(limit)

    return reply.send({ data: events })
  })
}
