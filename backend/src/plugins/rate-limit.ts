import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"

// Rate limit configurations
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: FastifyRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

// Default rate limits per route type
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // General API
  default: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },

  // Auth routes (stricter)
  auth: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // AI routes (cost-sensitive)
  ai: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },

  // Payment routes (very strict)
  payment: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  },

  // Public routes (more lenient)
  public: {
    maxRequests: 200,
    windowMs: 60 * 1000, // 1 minute
  },
}

type RateLimitEntry = {
  count: number
  resetAt: number
}

// In-memory rate limit store (in production: use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt < now) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

// Rate limiting plugin
export async function rateLimitPlugin(app: FastifyInstance) {
  const redisAvailable = app.redis && typeof app.redis.get === "function"

  // Get rate limit config for route
  function getConfig(url: string): RateLimitConfig {
    if (url.includes("/auth/")) return rateLimitConfigs.auth
    if (url.includes("/ai/")) return rateLimitConfigs.ai
    if (url.includes("/payments/")) return rateLimitConfigs.payment
    if (
      url.includes("/courses") &&
      !url.includes("/me") &&
      !url.includes("/admin")
    ) {
      return rateLimitConfigs.public
    }
    return rateLimitConfigs.default
  }

  // Generate rate limit key
  function generateKey(
    request: FastifyRequest,
    config: RateLimitConfig,
  ): string {
    const ip = request.ip || request.socket.remoteAddress || "unknown"
    const userId = request.userId || "anonymous"
    const url = request.url.split("?")[0]

    if (config.keyGenerator) {
      return config.keyGenerator(request)
    }

    return `ratelimit:${ip}:${userId}:${url}`
  }

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

  // Check rate limit
  async function checkRateLimit(
    key: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    if (redisAvailable) {
      try {
        const current = await app.redis.incr(key)
        if (current === 1) {
          await app.redis.pexpire(key, config.windowMs)
        }

        const ttl = await app.redis.pttl(key)
        const resetAt = Date.now() + ttl

        return {
          allowed: current <= config.maxRequests,
          remaining: Math.max(0, config.maxRequests - current),
          resetAt,
        }
      } catch (error) {
        // Redis error, allow request
        return {
          allowed: true,
          remaining: config.maxRequests,
          resetAt: Date.now() + config.windowMs,
        }
      }
    }

    // Fallback to in-memory
    const now = Date.now()
    const entry = rateLimitStore.get(key)

    if (!entry || entry.resetAt < now) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      })
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: now + config.windowMs,
      }
    }

    entry.count++
    return {
      allowed: entry.count <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetAt: entry.resetAt,
    }
  }

  // Rate limit middleware
  app.addHook("onRequest", async (request, reply) => {
    const config = getConfig(request.url)
    const key = generateKey(request, config)

    const { allowed, remaining, resetAt } = await checkRateLimit(key, config)

    // Set rate limit headers
    reply.header("X-RateLimit-Limit", config.maxRequests)
    reply.header("X-RateLimit-Remaining", remaining)
    reply.header("X-RateLimit-Reset", Math.ceil(resetAt / 1000))

    if (!allowed) {
      reply.status(429).send({
        error: true,
        message: "Too many requests",
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      })
      return reply
    }
  })

  // Rate limit info endpoint
  app.get("/rate-limit/info", async (request, reply) => {
    const config = getConfig(request.url)
    const key = generateKey(request, config)

    const entry = redisAvailable
      ? await app.redis.get(key)
      : rateLimitStore.get(key)

    return reply.send({
      data: {
        limit: config.maxRequests,
        windowMs: config.windowMs,
        current: entry
          ? typeof entry === "string"
            ? JSON.parse(entry).count
            : entry.count
          : 0,
        remaining: entry
          ? Math.max(
              0,
              config.maxRequests -
                (typeof entry === "string"
                  ? JSON.parse(entry).count
                  : entry.count),
            )
          : config.maxRequests,
      },
    })
  })

  app.log.info("Rate limit plugin registered")
}
