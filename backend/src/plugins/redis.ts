import Redis from "ioredis"
import { FastifyInstance } from "fastify"
import { config } from "../lib/config.js"
import { logger } from "../lib/logger.js"

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis | null
  }
}

export async function redisPlugin(app: FastifyInstance) {
  if (!config.redisUrl) {
    logger.info("Cache plugin disabled (no Redis)")
    app.decorate("redis", null)
    return
  }

  try {
    const isTls = config.redisUrl.startsWith("rediss://")

    const redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null
        const delay = Math.min(times * 100, 3000)
        return delay
      },
      enableOfflineQueue: false,
      ...(isTls ? { tls: {} } : {}),
    })

    redis.on("error", (error) => {
      logger.warn("Redis error (non-critical): " + error.message)
    })

    redis.on("connect", () => {
      logger.info("✅ Redis connected")
    })

    await redis.ping()

    app.decorate("redis", redis)

    app.addHook("onClose", async () => {
      await redis.quit()
      logger.info("Redis connection closed")
    })
  } catch (error) {
    logger.warn("Redis unavailable, continuing without cache")
    app.decorate("redis", null)
  }
}
