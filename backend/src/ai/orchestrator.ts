import {
  AIProvider,
  ChatParams,
  ChatChunk,
  EmbeddingResult,
  ModerationResult,
  ModelInfo,
} from "./types.js"
import { OpenAIProvider } from "./providers/openai.js"
import { AnthropicProvider } from "./providers/anthropic.js"
import { logger } from "../lib/logger.js"

export interface AIOrchestratorConfig {
  openaiApiKey: string
  anthropicApiKey?: string
  googleApiKey?: string
  defaultModel: string
  complexModel: string
  embeddingModel: string
  maxTokens: number
  temperature: number
}

export interface ModelSelection {
  provider: string
  model: string
  reason: string
}

export interface TaskRequirements {
  quality: "low" | "medium" | "high"
  speed: "fast" | "normal" | "slow"
  cost: "cheap" | "moderate" | "expensive"
}

export class AIOrchestrator {
  private providers: Map<string, AIProvider> = new Map()
  private config: AIOrchestratorConfig
  private costTracker: Map<string, number> = new Map()

  constructor(config: AIOrchestratorConfig) {
    this.config = config
    this.initializeProviders()
  }

  private initializeProviders() {
    // Always initialize OpenAI
    const openai = new OpenAIProvider(
      this.config.openaiApiKey,
      this.config.defaultModel,
      this.config.embeddingModel,
    )
    this.providers.set("openai", openai)

    // Initialize Anthropic if API key is provided
    if (this.config.anthropicApiKey) {
      const anthropic = new AnthropicProvider(this.config.anthropicApiKey)
      this.providers.set("anthropic", anthropic)
    }

    logger.info(`Initialized ${this.providers.size} AI providers`)
  }

  // Model routing based on task requirements
  route(task: TaskRequirements): ModelSelection {
    if (task.quality === "high" && this.providers.has("anthropic")) {
      return {
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        reason: "High quality task, using best available model",
      }
    }

    if (task.cost === "cheap") {
      return {
        provider: "openai",
        model: "gpt-4o-mini",
        reason: "Cost optimization, using cheapest model",
      }
    }

    if (task.speed === "fast") {
      return {
        provider: "openai",
        model: "gpt-4o-mini",
        reason: "Speed priority, using fastest model",
      }
    }

    return {
      provider: "openai",
      model: this.config.defaultModel,
      reason: "Default routing",
    }
  }

  // Chat with fallback chain
  async *chat(params: ChatParams): AsyncGenerator<ChatChunk> {
    const taskRequirements: TaskRequirements = {
      quality: "medium",
      speed: "normal",
      cost: "moderate",
    }

    const selection = this.route(taskRequirements)
    const provider = this.providers.get(selection.provider)

    if (!provider) {
      throw new Error(`Provider ${selection.provider} not available`)
    }

    try {
      yield* provider.chat(params)
      this.trackCost(selection.provider, params.messages.length)
    } catch (error) {
      logger.error(
        error,
        `AI call failed with ${selection.provider}, trying fallback`,
      )

      // Fallback to OpenAI if primary provider fails
      if (selection.provider !== "openai") {
        const fallbackProvider = this.providers.get("openai")
        if (fallbackProvider) {
          yield* fallbackProvider.chat(params)
          this.trackCost("openai", params.messages.length)
          return
        }
      }

      throw error
    }
  }

  // Embedding (always uses OpenAI)
  async embed(text: string): Promise<EmbeddingResult> {
    const provider = this.providers.get("openai")
    if (!provider) {
      throw new Error("OpenAI provider not available for embeddings")
    }
    return provider.embed(text)
  }

  // Moderation (always uses OpenAI)
  async moderate(content: string): Promise<ModerationResult> {
    const provider = this.providers.get("openai")
    if (!provider) {
      throw new Error("OpenAI provider not available for moderation")
    }
    return provider.moderate(content)
  }

  // Get available models
  getAvailableModels(): ModelInfo[] {
    return Array.from(this.providers.values()).map((p) => p.getModelInfo())
  }

  // Check provider availability
  async checkAvailability(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()

    for (const [name, provider] of this.providers) {
      results.set(name, await provider.isAvailable())
    }

    return results
  }

  // Cost tracking
  private trackCost(provider: string, messageCount: number) {
    const current = this.costTracker.get(provider) || 0
    this.costTracker.set(provider, current + messageCount)
  }

  getCostTracker(): Map<string, number> {
    return new Map(this.costTracker)
  }
}
