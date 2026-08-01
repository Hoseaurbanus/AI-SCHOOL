import { FastifyInstance } from "fastify"
import { z } from "zod"
import { sql } from "drizzle-orm"

// Cost tracking interface
interface CostEntry {
  provider: string
  model: string
  inputTokens: number
  outputTokens: number
  cost: number
  timestamp: Date
}

type ModelPricing = {
  input: number
  output: number
}

// Model pricing (per 1K tokens)
const modelPricing: Record<string, ModelPricing> = {
  "gpt-4o": { input: 0.005, output: 0.015 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "claude-3-5-sonnet-20241022": { input: 0.003, output: 0.015 },
  "claude-3-haiku-20240307": { input: 0.00025, output: 0.00125 },
  "text-embedding-3-large": { input: 0.00013, output: 0 },
  "text-embedding-3-small": { input: 0.00002, output: 0 },
}

// In-memory cost tracker (in production: use database)
const costTracker: CostEntry[] = []

// Track cost
function trackCost(
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
) {
  const pricing = modelPricing[model] || { input: 0.001, output: 0.002 }
  const cost =
    (inputTokens / 1000) * pricing.input +
    (outputTokens / 1000) * pricing.output

  costTracker.push({
    provider,
    model,
    inputTokens,
    outputTokens,
    cost,
    timestamp: new Date(),
  })

  return cost
}

// Get cost summary
function getCostSummary(timeframe: "hour" | "day" | "week" | "month") {
  const now = new Date()
  let startTime: Date

  switch (timeframe) {
    case "hour":
      startTime = new Date(now.getTime() - 60 * 60 * 1000)
      break
    case "day":
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case "week":
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "month":
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }

  const entries = costTracker.filter((e) => e.timestamp >= startTime)

  const byProvider: Record<string, {
    cost: number
    tokens: number
    requests: number
  }> = {}
  const byModel: Record<string, {
    cost: number
    tokens: number
    requests: number
  }> = {}

  let totalCost = 0
  let totalTokens = 0

  for (const entry of entries) {
    totalCost += entry.cost
    totalTokens += entry.inputTokens + entry.outputTokens

    if (!byProvider[entry.provider]) {
      byProvider[entry.provider] = { cost: 0, tokens: 0, requests: 0 }
    }
    byProvider[entry.provider].cost += entry.cost
    byProvider[entry.provider].tokens += entry.inputTokens + entry.outputTokens
    byProvider[entry.provider].requests++

    if (!byModel[entry.model]) {
      byModel[entry.model] = { cost: 0, tokens: 0, requests: 0 }
    }
    byModel[entry.model].cost += entry.cost
    byModel[entry.model].tokens += entry.inputTokens + entry.outputTokens
    byModel[entry.model].requests++
  }

  return {
    timeframe,
    startTime,
    endTime: now,
    totalCost: Math.round(totalCost * 10000) / 10000,
    totalTokens,
    totalRequests: entries.length,
    byProvider,
    byModel,
  }
}

type BudgetAlert = {
  threshold: number
  notified: boolean
}

// Budget alerts
const budgetAlerts: BudgetAlert[] = [
  { threshold: 10, notified: false }, // $10
  { threshold: 50, notified: false }, // $50
  { threshold: 100, notified: false }, // $100
  { threshold: 500, notified: false }, // $500
]

function checkBudgetAlerts(dailyCost: number) {
  const alerts = []

  for (const alert of budgetAlerts) {
    if (dailyCost >= alert.threshold && !alert.notified) {
      alerts.push({
        threshold: alert.threshold,
        message: `Daily AI cost has exceeded $${alert.threshold}`,
        currentCost: dailyCost,
      })
      alert.notified = true
    }
  }

  return alerts
}

// Reset daily alerts at midnight
setInterval(() => {
  const now = new Date()
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    for (const alert of budgetAlerts) {
      alert.notified = false
    }
  }
}, 60 * 1000)

export async function costTrackingPlugin(app: FastifyInstance) {
  // Cost tracking hook - track AI usage
  app.addHook("onResponse", async (request, reply) => {
    const url = request.url

    // Track AI API calls
    if (url.includes("/ai/chat") || url.includes("/ai/code")) {
      // In production: extract actual token usage from response
      // For now: estimate based on request/response size
      const requestBody = request.body as any

      const estimatedInputTokens = JSON.stringify(requestBody || {}).length / 4
      const estimatedOutputTokens = 100 // Default estimate

      if (estimatedInputTokens > 0 || estimatedOutputTokens > 0) {
        trackCost(
          "openai",
          "gpt-4o-mini",
          estimatedInputTokens,
          estimatedOutputTokens,
        )
      }
    }
  })

  // Cost dashboard endpoint
  app.get("/costs", async (request, reply) => {
    const { timeframe } = z
      .object({
        timeframe: z.enum(["hour", "day", "week", "month"]).default("day"),
      })
      .parse(request.query)

    const summary = getCostSummary(timeframe)
    const alerts = checkBudgetAlerts(summary.totalCost)

    return reply.send({
      data: {
        summary,
        alerts,
        pricing: modelPricing,
      },
    })
  })

  // Cost history
  app.get("/costs/history", async (request, reply) => {
    const { limit } = z
      .object({ limit: z.coerce.number().min(1).max(1000).default(100) })
      .parse(request.query)

    const recentCosts = costTracker.slice(-limit)

    return reply.send({ data: recentCosts })
  })

  // Cost by model
  app.get("/costs/by-model", async (request, reply) => {
    const summary = getCostSummary("day")

    return reply.send({ data: summary.byModel })
  })

  // Cost by provider
  app.get("/costs/by-provider", async (request, reply) => {
    const summary = getCostSummary("day")

    return reply.send({ data: summary.byProvider })
  })

  // Budget settings
  app.get("/costs/budget", async (request, reply) => {
    return reply.send({
      data: {
        alerts: budgetAlerts.map((a) => ({
          threshold: a.threshold,
          notified: a.notified,
        })),
      },
    })
  })

  // Update budget threshold
  app.put("/costs/budget/:threshold", async (request, reply) => {
    const { threshold } = z
      .object({ threshold: z.coerce.number().min(1) })
      .parse(request.params)

    const { enabled } = z.object({ enabled: z.boolean() }).parse(request.body)

    const alert = budgetAlerts.find((a) => a.threshold === threshold)
    if (alert) {
      alert.notified = !enabled
    }

    return reply.send({ success: true })
  })

  // Track custom cost
  app.post("/costs/track", async (request, reply) => {
    const body = z
      .object({
        provider: z.string(),
        model: z.string(),
        inputTokens: z.number().min(0),
        outputTokens: z.number().min(0),
      })
      .parse(request.body)

    const cost = trackCost(
      body.provider,
      body.model,
      body.inputTokens,
      body.outputTokens,
    )

    return reply.status(201).send({ data: { cost } })
  })

  app.log.info("Cost tracking plugin registered")
}

// Export for use in AI orchestrator
export { trackCost, getCostSummary, modelPricing }
