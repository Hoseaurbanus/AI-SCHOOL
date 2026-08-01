import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"

// Cache configuration
interface CacheConfig {
  ttl: number // Time to live in seconds
  prefix: string
}

// Default cache configs per route type
const cacheConfigs: Record<string, CacheConfig> = {
  courses: { ttl: 300, prefix: "courses" }, // 5 minutes
  course: { ttl: 600, prefix: "course" }, // 10 minutes
  assessments: { ttl: 300, prefix: "assessments" },
  user: { ttl: 60, prefix: "user" }, // 1 minute
  stats: { ttl: 120, prefix: "stats" }, // 2 minutes
  recommendations: { ttl: 180, prefix: "recommendations" }, // 3 minutes
  analytics: { ttl: 60, prefix: "analytics" },
}

// Generate cache key from request
function generateCacheKey(prefix: string, request: FastifyRequest): string {
  const { url, method, userId } = request
  const params = JSON.stringify(request.params)
  const query = JSON.stringify(request.query)

  return `${prefix}:${method}:${url}:${userId || "anonymous"}:${params}:${query}`
}

// Cache decorator
export async function cachePlugin(app: FastifyInstance) {
  // Check if Redis is available
  const redisAvailable = app.redis && typeof app.redis.get === "function"

  // Cache middleware factory
  function createCacheMiddleware(config: CacheConfig) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!redisAvailable) return

      const cacheKey = generateCacheKey(config.prefix, request)

      try {
        const cached = await app.redis.get(cacheKey)
        if (cached) {
          const data = JSON.parse(cached)
          reply.send(data)
          return reply
        }
      } catch (error) {
        // Cache miss or error, continue
      }
    }
  }

  // Cache response interceptor
  app.addHook("onSend", async (request, reply, payload) => {
    if (!redisAvailable) return payload

    const url = request.url
    let config: CacheConfig | undefined

    // Match route to cache config
    if (url.startsWith("/api/v1/courses") && request.method === "GET") {
      config = url.includes("/featured")
        ? cacheConfigs.courses
        : url.match(/\/[a-f0-9-]+$/)
          ? cacheConfigs.course
          : cacheConfigs.courses
    } else if (
      url.startsWith("/api/v1/assessments") &&
      request.method === "GET"
    ) {
      config = cacheConfigs.assessments
    } else if (
      url.startsWith("/api/v1/recommendations") &&
      request.method === "GET"
    ) {
      config = cacheConfigs.recommendations
    } else if (
      url.startsWith("/api/v1/analytics") &&
      request.method === "GET"
    ) {
      config = cacheConfigs.analytics
    }

    if (config && reply.statusCode === 200) {
      const cacheKey = generateCacheKey(config.prefix, request)

      try {
        await app.redis.setex(cacheKey, config.ttl, payload as string)
      } catch (error) {
        // Cache write failed, continue
      }
    }

    return payload
  })

  // Invalidate cache by pattern
  app.decorate("invalidateCache", async (pattern: string) => {
    if (!redisAvailable) return

    try {
      const keys = await app.redis.keys(`*${pattern}*`)
      if (keys.length > 0) {
        await app.redis.del(...keys)
      }
    } catch (error) {
      // Cache invalidation failed
    }
  })

  // Clear all cache
  app.decorate("clearCache", async () => {
    if (!redisAvailable) return

    try {
      await app.redis.flushdb()
    } catch (error) {
      // Cache clear failed
    }
  })

  // Cache stats
  app.decorate("getCacheStats", async () => {
    if (!redisAvailable) {
      return { available: false }
    }

    try {
      const info = await app.redis.info("stats")
      const keyspace = await app.redis.info("keyspace")

      return {
        available: true,
        info,
        keyspace,
      }
    } catch (error) {
      return { available: false, error: (error as Error).message }
    }
  })

  app.addHook("onRequest", async (request, reply) => {
    const url = request.url

    // Skip cache for non-GET requests
    if (request.method !== "GET") return

    // Skip cache for admin routes
    if (url.includes("/admin")) return

    // Skip cache for user-specific routes
    if (url.includes("/me")) return

    // Check cache
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

    if (config && redisAvailable) {
      const cacheKey = generateCacheKey(config.prefix, request)

      try {
        const cached = await app.redis.get(cacheKey)
        if (cached) {
          const data = JSON.parse(cached)
          reply.header("X-Cache", "HIT")
          reply.send(data)
          return reply
        }
        reply.header("X-Cache", "MISS")
      } catch (error) {
        reply.header("X-Cache", "ERROR")
      }
    }
  })

  const status = redisAvailable ? "enabled" : "disabled (no Redis)"
  app.log.info(`Cache plugin ${status}`)
}

// Extend Fastify types
declare module "fastify" {
  interface FastifyInstance {
    invalidateCache: (pattern: string) => Promise<void>
    clearCache: () => Promise<void>
    getCacheStats: () => Promise<any>
  }
}
