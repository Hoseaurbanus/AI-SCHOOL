import Fastify from "fastify"
import cors from "@fastify/cors"
import { sql } from "drizzle-orm"
import { logger } from "./lib/logger.js"
import { config } from "./lib/config.js"
import { authPlugin } from "./plugins/auth.js"
import { dbPlugin } from "./plugins/db.js"
import { redisPlugin } from "./plugins/redis.js"
import { aiPlugin } from "./plugins/ai.js"
import { cachePlugin } from "./plugins/cache.js"
import { rateLimitPlugin } from "./plugins/rate-limit.js"
import { costTrackingPlugin } from "./plugins/cost-tracking.js"
import { securityPlugin } from "./plugins/security.js"
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
    trustProxy: true,
  })

  // CORS
  await app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
  })

  // Core plugins
  await app.register(dbPlugin)
  await app.register(redisPlugin)
  await app.register(authPlugin)
  await app.register(aiPlugin)

  // Scale & Optimize plugins
  await app.register(cachePlugin)
  await app.register(rateLimitPlugin)
  await app.register(costTrackingPlugin)
  await app.register(securityPlugin)

  // Health check
  app.get("/health", async () => {
    let dbHealthy = false
    try {
      await app.db.execute(sql`SELECT 1`)
      dbHealthy = true
    } catch {
      dbHealthy = false
    }

    let redisHealthy = false
    if (app.redis) {
      try {
        await app.redis.ping()
        redisHealthy = true
      } catch {
        redisHealthy = false
      }
    }

    return {
      status: dbHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? "healthy" : "unhealthy",
        redis: app.redis
          ? redisHealthy
            ? "healthy"
            : "unhealthy"
          : "not configured",
      },
    }
  })

  // Readiness check
  app.get("/ready", async (request, reply) => {
    try {
      await app.db.execute(sql`SELECT 1`)
      return { status: "ready" }
    } catch {
      reply.status(503)
      return { status: "not ready" }
    }
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
