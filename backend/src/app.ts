import Fastify from "fastify"
import cors from "@fastify/cors"
import rateLimit from "@fastify/rate-limit"
import { logger } from "./lib/logger.js"
import { config } from "./lib/config.js"
import { authPlugin } from "./plugins/auth.js"
import { dbPlugin } from "./plugins/db.js"
import { redisPlugin } from "./plugins/redis.js"
import { aiPlugin } from "./plugins/ai.js"
import { routes } from "./routes/index.js"

export async function createApp() {
  const app = Fastify({
    logger: {
      level: config.logLevel,
      transport:
        config.nodeEnv === "development"
          ? {
              target: "pino-pretty",
              options: { colorize: true },
            }
          : undefined,
    },
    bodyLimit: 10 * 1024 * 1024, // 10MB
  })

  // CORS
  await app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  })

  // Rate limiting
  await app.register(rateLimit, {
    max: config.rateLimitMaxRequests,
    timeWindow: config.rateLimitWindowMs,
  })

  // Plugins
  await app.register(dbPlugin)
  await app.register(redisPlugin)
  await app.register(authPlugin)
  await app.register(aiPlugin)

  // Health check
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() }
  })

  // API routes
  await app.register(routes, { prefix: "/api/v1" })

  // Error handler
  app.setErrorHandler(
    (error: Error & { statusCode?: number }, request, reply) => {
      logger.error(error, "Unhandled error")

      const statusCode = error.statusCode || 500
      const message =
        config.nodeEnv === "development"
          ? error.message
          : "Internal server error"

      reply.status(statusCode).send({
        error: true,
        message,
        ...(config.nodeEnv === "development" && { stack: error.stack }),
      })
    },
  )

  return app
}
