import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import type Redis from "ioredis"

interface CacheConfig {
  ttl: number
  prefix: string
}

const cacheConfigs: Record<string, CacheConfig> = {
  courses: { ttl: 300, prefix: "courses" },
  course: { ttl: 600, prefix: "course" },
  assessments: { ttl: 300, prefix: "assessments" },
  user: { ttl: 60, prefix: "user" },
  stats: { ttl: 120, prefix: "stats" },
  recommendations: { ttl: 180, prefix: "recommendations" },
  analytics: { ttl: 60, prefix: "analytics" },
}

function generateCacheKey(prefix: string, request: FastifyRequest): string {
  const { url, method, userId } = request
  const params = JSON.stringify(request.params)
  const query = JSON.stringify(request.query)
  return `${prefix}:${method}:${url}:${userId || "anonymous"}:${params}:${query}`
}

function getRedis(app: FastifyInstance): Redis | null {
  const r = app.redis
  if (r && typeof r.get === "function") return r
  return null
}

export async function cachePlugin(app: FastifyInstance) {
  const redis = getRedis(app)

  app.addHook("onSend", async (request, reply, payload) => {
    if (!redis) return payload

    const url = request.url
    let config: CacheConfig | undefined

    if (url.startsWith("/api/v1/courses") && request.method === "GET") {
      config = url.includes("/featured")
        ? cacheConfigs.courses
        : url.match(/\/[a-f0-9-]+$/)
          ? cacheConfigs.course
          : cacheConfigs.courses
    } else if (url.startsWith("/api/v1/assessments") && request.method === "GET") {
      config = cacheConfigs.assessments
    } else if (url.startsWith("/api/v1/recommendations") && request.method === "GET") {
      config = cacheConfigs.recommendations
    } else if (url.startsWith("/api/v1/analytics") && request.method === "GET") {
      config = cacheConfigs.analytics
    }

    if (config && reply.statusCode === 200) {
      const cacheKey = generateCacheKey(config.prefix, request)
      try {
        await redis.setex(cacheKey, config.ttl, payload as string)
      } catch {}
    }

    return payload
  })

  app.decorate("invalidateCache", async (pattern: string) => {
    if (!redis) return
    try {
      const keys = await redis.keys(`*${pattern}*`)
      if (keys.length > 0) await redis.del(...keys)
    } catch {}
  })

  app.decorate("clearCache", async () => {
    if (!redis) return
    try {
      await redis.flushdb()
    } catch {}
  })

  app.decorate("getCacheStats", async () => {
    if (!redis) return { available: false }
    try {
      const info = await redis.info("stats")
      const keyspace = await redis.info("keyspace")
      return { available: true, info, keyspace }
    } catch (error) {
      return { available: false, error: (error as Error).message }
    }
  })

  app.addHook("onRequest", async (request, reply) => {
    if (!redis) return
    if (request.method !== "GET") return
    if (request.url.includes("/admin")) return
    if (request.url.includes("/me")) return

    const url = request.url
    let config: CacheConfig | undefined

    if (url.startsWith("/api/v1/courses")) {
      config = url.includes("/featured")
        ? cacheConfigs.courses
        : url.match(/\/[a-f0-9-]+$/)
          ? cacheConfigs.course
          : cacheConfigs.courses
    } else if (url.startsWith("/api/v1/assessments")) {
      config = cacheConfigs.assessments
    } else if (url.startsWith("/api/v1/recommendations")) {
      config = cacheConfigs.recommendations
    } else if (url.startsWith("/api/v1/analytics")) {
      config = cacheConfigs.analytics
    }

    if (config) {
      const cacheKey = generateCacheKey(config.prefix, request)
      try {
        const cached = await redis.get(cacheKey)
        if (cached) {
          const data = JSON.parse(cached)
          reply.header("X-Cache", "HIT")
          reply.send(data)
          return reply
        }
        reply.header("X-Cache", "MISS")
      } catch {
        reply.header("X-Cache", "ERROR")
      }
    }
  })

  app.log.info(`Cache plugin ${redis ? "enabled" : "disabled (no Redis)"}`)
}

declare module "fastify" {
  interface FastifyInstance {
    invalidateCache: (pattern: string) => Promise<void>
    clearCache: () => Promise<void>
    getCacheStats: () => Promise<any>
  }
}
