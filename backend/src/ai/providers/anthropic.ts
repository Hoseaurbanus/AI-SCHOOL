import Anthropic from "@anthropic-ai/sdk"
import {
  AIProvider,
  ChatMessage,
  ChatParams,
  ChatChunk,
  EmbeddingResult,
  ModerationResult,
  ModelInfo,
} from "../types.js"

export class AnthropicProvider implements AIProvider {
  private client: Anthropic
  private model: string

  constructor(apiKey: string, model: string = "claude-3-5-sonnet-20241022") {
    this.client = new Anthropic({ apiKey })
    this.model = model
  }

  async *chat(params: ChatParams): AsyncGenerator<ChatChunk> {
    // Extract system message (Anthropic handles it separately)
    const systemMessage = params.messages.find((m) => m.role === "system")
    const userMessages = params.messages.filter((m) => m.role !== "system")

    const stream = await this.client.messages.stream({
      model: params.model || this.model,
      max_tokens: params.maxTokens ?? 4096,
      temperature: params.temperature ?? 0.7,
      system: systemMessage?.content,
      messages: userMessages.map((m: ChatMessage) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    })

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield {
          content: event.delta.text,
        }
      }
    }
  }

  async embed(_text: string): Promise<EmbeddingResult> {
    // Anthropic doesn't have a native embedding API
    // We'll need to use OpenAI or another provider for embeddings
    throw new Error(
      "Anthropic does not support embeddings. Use OpenAI provider.",
    )
  }

  async moderate(_content: string): Promise<ModerationResult> {
    // Anthropic doesn't have a native moderation API
    // We'll use OpenAI for moderation
    throw new Error(
      "Anthropic does not support moderation. Use OpenAI provider.",
    )
  }

  getModelInfo(): ModelInfo {
    return {
      id: this.model,
      name: this.model,
      provider: "anthropic",
      maxTokens: 200000,
      costPer1kInput: 0.003,
      costPer1kOutput: 0.015,
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.model,
        max_tokens: 10,
        messages: [{ role: "user", content: "test" }],
      })
      return true
    } catch {
      return false
    }
  }
}
