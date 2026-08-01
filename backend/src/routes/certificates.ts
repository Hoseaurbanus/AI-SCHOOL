import { FastifyInstance } from "fastify"
import { z } from "zod"
import {
  certificates,
  courses,
  enrollments,
  assessmentResults,
  assessments,
} from "../db/schema.js"
import { eq, and, desc, sql } from "drizzle-orm"
import { createHash } from "crypto"

const certificateParamSchema = z.object({
  id: z.string().uuid(),
})

// Check if student is eligible for certificate
async function checkEligibility(
  app: FastifyInstance,
  userId: string,
  courseId: string,
) {
  // Get enrollment
  const [enrollment] = await app.db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)),
    )
    .limit(1)

  if (!enrollment) {
    return { eligible: false, reason: "Not enrolled in this course" }
  }

  // Check completion status
  const progress = enrollment.progress as any
  if (progress?.percent !== 100) {
    return {
      eligible: false,
      reason: `Course ${progress?.percent || 0}% complete`,
    }
  }

  // Check assessment scores
  const courseAssessments = await app.db
    .select()
    .from(assessments)
    .where(eq(assessments.courseId, courseId))

  if (courseAssessments.length > 0) {
    const userResults = await app.db
      .select()
      .from(assessmentResults)
      .where(
        and(
          eq(assessmentResults.userId, userId),
          sql`${assessmentResults.assessmentId} IN (SELECT id FROM assessments WHERE course_id = ${courseId})`,
        ),
      )

    // Check if all assessments passed
    for (const assessment of courseAssessments) {
      const result = userResults.find((r) => r.assessmentId === assessment.id)
      if (!result || !result.passed) {
        return {
          eligible: false,
          reason: `Assessment "${assessment.title}" not passed`,
        }
      }
    }
  }

  return { eligible: true, enrollment }
}

// Generate certificate hash
function generateHash(certificateId: string, issuedAt: Date): string {
  return createHash("sha256")
    .update(`${certificateId}-${issuedAt.toISOString()}`)
    .digest("hex")
}

export async function certificateRoutes(app: FastifyInstance) {
  // Get user's certificates
  app.get("/me", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const userCertificates = await app.db
      .select({
        id: certificates.id,
        issuedAt: certificates.issuedAt,
        hash: certificates.hash,
        verificationUrl: certificates.verificationUrl,
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
        },
      })
      .from(certificates)
      .innerJoin(courses, eq(certificates.courseId, courses.id))
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt))

    return reply.send({ data: userCertificates })
  })

  // Check eligibility for certificate
  app.get("/eligibility/:courseId", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { courseId } = z
      .object({ courseId: z.string().uuid() })
      .parse(request.params)

    const eligibility = await checkEligibility(app, userId, courseId)

    // Check if certificate already issued
    if (eligibility.eligible) {
      const [existing] = await app.db
        .select()
        .from(certificates)
        .where(
          and(
            eq(certificates.userId, userId),
            eq(certificates.courseId, courseId),
          ),
        )
        .limit(1)

      if (existing) {
        return reply.send({
          data: {
            eligible: true,
            certificateId: existing.id,
            message: "Certificate already issued",
          },
        })
      }
    }

    return reply.send({ data: eligibility })
  })

  // Issue certificate
  app.post("/issue/:courseId", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const { courseId } = z
      .object({ courseId: z.string().uuid() })
      .parse(request.params)

    // Check eligibility
    const eligibility = await checkEligibility(app, userId, courseId)

    if (!eligibility.eligible) {
      return reply.status(400).send({
        error: true,
        message: eligibility.reason,
      })
    }

    // Check if already issued
    const [existing] = await app.db
      .select()
      .from(certificates)
      .where(
        and(
          eq(certificates.userId, userId),
          eq(certificates.courseId, courseId),
        ),
      )
      .limit(1)

    if (existing) {
      return reply.send({ data: existing })
    }

    // Generate certificate
    const issuedAt = new Date()
    const [certificate] = await app.db
      .insert(certificates)
      .values({
        userId,
        courseId,
        issuedAt,
        hash: "", // Will be updated
        verificationUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify`,
      })
      .returning()

    // Generate and update hash
    const hash = generateHash(certificate.id, issuedAt)
    await app.db
      .update(certificates)
      .set({ hash })
      .where(eq(certificates.id, certificate.id))

    return reply.status(201).send({
      data: {
        ...certificate,
        hash,
      },
    })
  })

  // Verify certificate
  app.get("/verify/:id", async (request, reply) => {
    const { id } = certificateParamSchema.parse(request.params)

    const [certificate] = await app.db
      .select({
        id: certificates.id,
        issuedAt: certificates.issuedAt,
        hash: certificates.hash,
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
        },
      })
      .from(certificates)
      .innerJoin(courses, eq(certificates.courseId, courses.id))
      .where(eq(certificates.id, id))
      .limit(1)

    if (!certificate) {
      return reply.status(404).send({
        valid: false,
        message: "Certificate not found",
      })
    }

    // Verify hash
    const expectedHash = certificate.issuedAt
      ? generateHash(certificate.id, certificate.issuedAt)
      : ""

    const isValid = certificate.hash === expectedHash

    return reply.send({
      data: {
        valid: isValid,
        certificate: isValid ? certificate : null,
        message: isValid ? "Certificate is valid" : "Certificate hash mismatch",
      },
    })
  })

  // Verify by hash
  app.get("/verify/hash/:hash", async (request, reply) => {
    const { hash } = z.object({ hash: z.string() }).parse(request.params)

    const [certificate] = await app.db
      .select({
        id: certificates.id,
        issuedAt: certificates.issuedAt,
        hash: certificates.hash,
        course: {
          id: courses.id,
          title: courses.title,
        },
      })
      .from(certificates)
      .innerJoin(courses, eq(certificates.courseId, courses.id))
      .where(eq(certificates.hash, hash))
      .limit(1)

    if (!certificate) {
      return reply.status(404).send({
        valid: false,
        message: "Certificate not found",
      })
    }

    return reply.send({
      data: {
        valid: true,
        certificate,
      },
    })
  })

  // Get certificate stats
  app.get("/stats", async (request, reply) => {
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send({ error: true, message: "Unauthorized" })
    }

    const [{ count: totalCertificates }] = await app.db
      .select({ count: sql<number>`count(*)` })
      .from(certificates)
      .where(eq(certificates.userId, userId))

    const recentCertificates = await app.db
      .select({
        id: certificates.id,
        issuedAt: certificates.issuedAt,
        courseTitle: courses.title,
      })
      .from(certificates)
      .innerJoin(courses, eq(certificates.courseId, courses.id))
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt))
      .limit(5)

    return reply.send({
      data: {
        totalCertificates,
        recentCertificates,
      },
    })
  })
}
