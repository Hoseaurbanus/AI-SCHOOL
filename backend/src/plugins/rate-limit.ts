import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import type Redis from "ioredis"

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: FastifyRequest) => string
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: { maxRequests: 100, windowMs: 60 * 1000 },
  auth: { maxRequests: 10, windowMs: 15 * 60 * 1000 },
  ai: { maxRequests: 30, windowMs: 60 * 1000 },
  payment: { maxRequests: 5, windowMs: 60 * 1000 },
  public: { maxRequests: 200, windowMs: 60 * 1000 },
}

type RateLimitEntry = { count: number; resetAt: number }

const rateLimitStore = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) rateLimitStore.delete(key)
  }
}, 5 * 60 * 1000)

function getRedis(app: FastifyInstance): Redis | null {
  const r = app.redis
  if (r && typeof r.get === "function") return r
  return null
}

export async function rateLimitPlugin(app: FastifyInstance) {
  const redis = getRedis(app)

  function getConfig(url: string): RateLimitConfig {
    if (url.includes("/auth/")) return rateLimitConfigs.auth
    if (url.includes("/ai/")) return rateLimitConfigs.ai
    if (url.includes("/payments/")) return rateLimitConfigs.payment
    if (url.includes("/courses") && !url.includes("/me") && !url.includes("/admin")) {
      return rateLimitConfigs.public
    }
    return rateLimitConfigs.default
  }

  function generateKey(request: FastifyRequest, config: RateLimitConfig): string {
    const ip = request.ip || request.socket.remoteAddress || "unknown"
    const userId = request.userId || "anonymous"
    const url = request.url.split("?")[0]
    if (config.keyGenerator) return config.keyGenerator(request)
    return `ratelimit:${ip}:${userId}:${url}`
  }

  type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number }

  async function checkRateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    if (redis) {
      try {
        const current = await redis.incr(key)
        if (current === 1) await redis.pexpire(key, config.windowMs)
        const ttl = await redis.pttl(key)
        return {
          allowed: current <= config.maxRequests,
          remaining: Math.max(0, config.maxRequests - current),
          resetAt: Date.now() + ttl,
        }
      } catch {
        return { allowed: true, remaining: config.maxRequests, resetAt: Date.now() + config.windowMs }
      }
    }

    const now = Date.now()
    const entry = rateLimitStore.get(key)
    if (!entry || entry.resetAt < now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + config.windowMs })
      return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs }
    }
    entry.count++
    return {
      allowed: entry.count <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetAt: entry.resetAt,
    }
  }

  app.addHook("onRequest", async (request, reply) => {
    const config = getConfig(request.url)
    const key = generateKey(request, config)
    const { allowed, remaining, resetAt } = await checkRateLimit(key, config)

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

  app.log.info("Rate limit plugin registered")
}

declare module "fastify" {
  interface FastifyInstance {
    invalidateCache: (pattern: string) => Promise<void>
    clearCache: () => Promise<void>
    getCacheStats: () => Promise<any>
  }
}
