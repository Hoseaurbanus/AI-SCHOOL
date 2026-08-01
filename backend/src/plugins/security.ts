import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"

// Security headers
const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
}

// Input sanitization
function sanitizeInput(input: string): string {
  if (typeof input !== "string") return input

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

// SQL injection detection
function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/|xp_|sp_)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /('\s*(OR|AND)\s+')/i,
    /(UNION\s+(ALL\s+)?SELECT)/i,
    /(INTO\s+(OUTFILE|DUMPFILE))/i,
    /(\bLOAD_FILE\b)/i,
    /(\bBENCHMARK\b)/i,
    /(\bSLEEP\b\s*\()/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

// XSS detection
function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
  ]

  return xssPatterns.some((pattern) => pattern.test(input))
}

// Path traversal detection
function detectPathTraversal(input: string): boolean {
  const pathPatterns = [/\.\.\//, /\.\.\\/, /%2e%2e/i, /%252e%252e/i]

  return pathPatterns.some((pattern) => pattern.test(input))
}

// Security plugin
export async function securityPlugin(app: FastifyInstance) {
  // Add security headers
  app.addHook("onSend", async (request, reply) => {
    for (const [header, value] of Object.entries(securityHeaders)) {
      reply.header(header, value)
    }

    // Add CSP header
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")

    reply.header("Content-Security-Policy", csp)

    return
  })

  // Input validation hook
  app.addHook("preHandler", async (request, reply) => {
    const body = request.body as any
    const query = request.query as any
    const params = request.params as any

    // Check all string inputs for injection attempts
    const checkObject = (obj: any, path: string) => {
      if (!obj || typeof obj !== "object") return

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
          if (detectSQLInjection(value)) {
            reply.status(400).send({
              error: true,
              message: `Invalid input detected in ${path}.${key}`,
            })
            return reply
          }

          if (detectXSS(value)) {
            reply.status(400).send({
              error: true,
              message: `Potentially malicious input detected in ${path}.${key}`,
            })
            return reply
          }

          if (detectPathTraversal(value)) {
            reply.status(400).send({
              error: true,
              message: `Invalid path detected in ${path}.${key}`,
            })
            return reply
          }
        } else if (typeof value === "object" && value !== null) {
          checkObject(value, `${path}.${key}`)
        }
      }
    }

    checkObject(body, "body")
    checkObject(query, "query")
    checkObject(params, "params")
  })

  // Request logging
  app.addHook("onResponse", async (request, reply) => {
    const { method, url, ip } = request
    const { statusCode } = reply
    const responseTime = Date.now() - (request as any).startTime || 0

    // Log slow requests
    if (responseTime > 1000) {
      app.log.warn(
        {
          method,
          url,
          statusCode,
          responseTime,
          ip,
        },
        "Slow request detected",
      )
    }

    // Log security events
    if (statusCode === 400 || statusCode === 403 || statusCode === 429) {
      app.log.warn(
        {
          method,
          url,
          statusCode,
          ip,
          userId: request.userId,
        },
        "Security event",
      )
    }
  })

  // Track request start time
  app.addHook("onRequest", async (request) => {
    ;(request as any).startTime = Date.now()
  })

  // Health check with security info
  app.get("/security/status", async (request, reply) => {
    return reply.send({
      data: {
        status: "ok",
        features: {
          securityHeaders: true,
          inputValidation: true,
          sqlInjectionDetection: true,
          xssDetection: true,
          pathTraversalDetection: true,
        },
      },
    })
  })

  app.log.info("Security plugin registered")
}

// Export sanitization functions for use in routes
export { sanitizeInput, detectSQLInjection, detectXSS, detectPathTraversal }
