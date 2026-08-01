import { FastifyInstance } from "fastify"
import { courseRoutes } from "./courses.js"
import { enrollmentRoutes } from "./enrollments.js"
import { aiRoutes } from "./ai.js"
import { userRoutes } from "./users.js"
import { assessmentRoutes } from "./assessments.js"
import { submissionRoutes } from "./submissions.js"
import { certificateRoutes } from "./certificates.js"
import { paymentRoutes } from "./payments.js"
import { ragRoutes } from "./rag.js"
import { memoryRoutes } from "./memory.js"
import { promptRoutes } from "./prompts.js"
import { codingLabRoutes } from "./coding-lab.js"
import { recommendationRoutes } from "./recommendations.js"
import { analyticsRoutes } from "./analytics.js"

export async function routes(app: FastifyInstance) {
  // Health check
  app.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    }
  })

  // Register route modules
  await app.register(courseRoutes, { prefix: "/courses" })
  await app.register(enrollmentRoutes, { prefix: "/enrollments" })
  await app.register(aiRoutes, { prefix: "/ai" })
  await app.register(userRoutes, { prefix: "/users" })
  await app.register(assessmentRoutes, { prefix: "/assessments" })
  await app.register(submissionRoutes, { prefix: "/submissions" })
  await app.register(certificateRoutes, { prefix: "/certificates" })
  await app.register(paymentRoutes, { prefix: "/payments" })
  await app.register(ragRoutes, { prefix: "/knowledge" })
  await app.register(memoryRoutes, { prefix: "/memory" })
  await app.register(promptRoutes, { prefix: "/prompts" })
  await app.register(codingLabRoutes, { prefix: "/coding" })
  await app.register(recommendationRoutes, { prefix: "/recommendations" })
  await app.register(analyticsRoutes, { prefix: "/analytics" })
}
