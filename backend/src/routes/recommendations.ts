import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  courses,
  enrollments,
  lessonProgress,
  lessons,
  modules,
  submissions,
  assessmentResults,
  assessments,
} from "../db/schema.js"
import { eq, and, sql, desc } from "drizzle-orm"

// Skill gap analysis
async function analyzeSkillGaps(
  app: FastifyInstance,
  userId: string,
  courseId: string,
) {
  // Get all lessons in the course
  const courseModules = await app.db
    .select()
    .from(modules)
    .where(eq(modules.courseId, courseId))

  const allLessons = []
  for (const module of courseModules) {
    const moduleLessons = await app.db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, module.id))
    allLessons.push(...moduleLessons)
  }

  // Get user's progress
  const userProgress = await app.db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.status, "completed"),
      ),
    )

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId))

  // Get assessments for the course
  const courseAssessments = await app.db
    .select()
    .from(assessmentResults)
    .innerJoin(assessments, eq(assessmentResults.assessmentId, assessments.id))
    .where(
      and(
        eq(assessments.courseId, courseId),
        eq(assessmentResults.userId, userId),
      ),
    )

  // Analyze gaps
  const gaps = []
  for (const lesson of allLessons) {
    if (!completedLessonIds.has(lesson.id)) {
      gaps.push({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        status: "not_completed",
        priority: "medium",
      })
    }
  }

  // Check assessment performance
  const failedAssessments = courseAssessments.filter(
    (a) => (a.assessment_results.score || 0) < 70,
  )

  return {
    totalLessons: allLessons.length,
    completedLessons: completedLessonIds.size,
    completionPercent: Math.round(
      (completedLessonIds.size / allLessons.length) * 100,
    ),
    gaps,
    failedAssessments: failedAssessments.length,
  }
}

// Generate personalized recommendations
async function generateRecommendations(app: FastifyInstance, userId: string) {
  const recommendations = []

  // Get user's enrollments
  const userEnrollments = await app.db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, userId))

  // Get user's assessment results
  const userResults = await app.db
    .select()
    .from(assessmentResults)
    .where(eq(assessmentResults.userId, userId))
    .orderBy(desc(assessmentResults.completedAt))
    .limit(10)

  // Get user's submissions
  const userSubmissions = await app.db
    .select()
    .from(submissions)
    .where(eq(submissions.userId, userId))
    .orderBy(desc(submissions.createdAt))
    .limit(10)

  // Analyze performance
  const avgScore =
    userResults.length > 0
      ? userResults.reduce((sum, r) => sum + (r.score || 0), 0) /
        userResults.length
      : 0

  // Get weak areas from recent assessments
  const weakAreas: string[] = []
  for (const result of userResults.slice(0, 5)) {
    if (result.score && result.score < 70 && result.assessmentId) {
      // Get assessment details
      const [assessment] = await app.db
        .select()
        .from(assessments)
        .where(eq(assessments.id, result.assessmentId))
        .limit(1)

      if (assessment) {
        weakAreas.push(assessment.title)
      }
    }
  }

  // Generate course recommendations
  const enrolledCourseIds = userEnrollments.map((e) => e.courseId)

  if (enrolledCourseIds.length > 0) {
    // Get recommended courses (similar to enrolled ones)
    const recommendedCourses = await app.db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.status, "published"),
          sql`${courses.id} != ALL(${enrolledCourseIds})`,
        ),
      )
      .limit(3)

    for (const course of recommendedCourses) {
      recommendations.push({
        type: "course",
        title: course.title,
        description: course.description || "New course to explore",
        reason: "Based on your learning interests",
        courseId: course.id,
      })
    }
  }

  // Generate lesson recommendations
  for (const enrollment of userEnrollments.slice(0, 3)) {
    if (!enrollment.courseId) continue

    const skillGap = await analyzeSkillGaps(app, userId, enrollment.courseId)

    if (skillGap.gaps.length > 0) {
      const nextLesson = skillGap.gaps[0]
      recommendations.push({
        type: "lesson",
        title: `Continue: ${nextLesson.lessonTitle}`,
        description: `You have ${skillGap.gaps.length} lessons remaining`,
        reason: "Complete your current course",
        courseId: enrollment.courseId,
        lessonId: nextLesson.lessonId,
      })
    }
  }

  // Generate practice recommendations based on weak areas
  if (weakAreas.length > 0) {
    recommendations.push({
      type: "practice",
      title: "Review Weak Areas",
      description: `Focus on: ${weakAreas.join(", ")}`,
      reason: "Improve your understanding",
    })
  }

  // Add streak motivation
  if (userResults.length === 0) {
    recommendations.push({
      type: "motivation",
      title: "Start Your First Assessment",
      description: "Test your knowledge and earn certificates",
      reason: "Track your progress",
    })
  }

  return recommendations
}

export async function recommendationRoutes(app: FastifyInstance) {
  // Get personalized recommendations
  app.get("/", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const recommendations = await generateRecommendations(app, userId)

    return reply.send({ data: recommendations })
  })

  // Get skill gap analysis for a course
  app.get("/skills/:courseId", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { courseId } = z
      .object({ courseId: z.string().uuid() })
      .parse(request.params)

    const analysis = await analyzeSkillGaps(app, userId, courseId)

    return reply.send({ data: analysis })
  })

  // Get learning path for a course
  app.get("/path/:courseId", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { courseId } = z
      .object({ courseId: z.string().uuid() })
      .parse(request.params)

    // Get course modules and lessons
    const courseModules = await app.db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(modules.sortOrder)

    const path = []

    for (const module of courseModules) {
      const moduleLessons = await app.db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, module.id))
        .orderBy(lessons.sortOrder)

      const lessonStatus = await Promise.all(
        moduleLessons.map(async (lesson) => {
          const [progress] = await app.db
            .select()
            .from(lessonProgress)
            .where(
              and(
                eq(lessonProgress.userId, userId),
                eq(lessonProgress.lessonId, lesson.id),
              ),
            )
            .limit(1)

          return {
            id: lesson.id,
            title: lesson.title,
            contentType: lesson.contentType,
            status: progress?.status || "not_started",
            completedAt: progress?.completedAt,
          }
        }),
      )

      const completedCount = lessonStatus.filter(
        (l) => l.status === "completed",
      ).length

      path.push({
        moduleId: module.id,
        moduleTitle: module.title,
        totalLessons: moduleLessons.length,
        completedLessons: completedCount,
        completionPercent: Math.round(
          (completedCount / moduleLessons.length) * 100,
        ),
        lessons: lessonStatus,
      })
    }

    return reply.send({ data: path })
  })

  // Get next recommended action
  app.get("/next-action", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    // Get active enrollments
    const activeEnrollments = await app.db
      .select()
      .from(enrollments)
      .where(
        and(eq(enrollments.userId, userId), eq(enrollments.status, "active")),
      )

    if (activeEnrollments.length === 0) {
      return reply.send({
        data: {
          action: "enroll",
          message: "Start by enrolling in a course",
        },
      })
    }

    // Find next lesson to complete
    for (const enrollment of activeEnrollments) {
      if (!enrollment.courseId) continue

      const path = await analyzeSkillGaps(app, userId, enrollment.courseId)

      if (path.gaps.length > 0) {
        const nextLesson = path.gaps[0]
        return reply.send({
          data: {
            action: "continue_lesson",
            courseId: enrollment.courseId,
            lessonId: nextLesson.lessonId,
            lessonTitle: nextLesson.lessonTitle,
            message: `Continue with "${nextLesson.lessonTitle}"`,
          },
        })
      }
    }

    return reply.send({
      data: {
        action: "review",
        message:
          "All caught up! Review your completed courses or start a new one.",
      },
    })
  })
}
