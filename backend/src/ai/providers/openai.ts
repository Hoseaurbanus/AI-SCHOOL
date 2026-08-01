import OpenAI from 'openai';
import { AIProvider, ChatParams, ChatChunk, EmbeddingResult, ModerationResult, ModelInfo } from '../types.js';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;
  private embeddingModel: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini', embeddingModel: string = 'text-embedding-3-large') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.embeddingModel = embeddingModel;
  }

  async *chat(params: ChatParams): AsyncGenerator<ChatChunk> {
    const stream = await this.client.chat.completions.create({
      model: params.model || this.model,
      messages: params.messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        yield {
          content: delta.content,
          finishReason: chunk.choices[0]?.finish_reason ?? undefined,
        };
      }
    }
  }

  async embed(text: string): Promise<EmbeddingResult> {
    const response = await this.client.embeddings.create({
      model: this.embeddingModel,
      input: text,
    });

    return {
      embedding: response.data[0].embedding,
      model: this.embeddingModel,
      tokens: response.usage.total_tokens,
    };
  }

  async moderate(content: string): Promise<ModerationResult> {
    const response = await this.client.moderations.create({
      input: content,
    });

    const result = response.results[0];
    return {
      flagged: result.flagged,
      categories: result.categories as unknown as Record<string, boolean>,
    };
  }

  getModelInfo(): ModelInfo {
    return {
      id: this.model,
      name: this.model,
      provider: 'openai',
      maxTokens: 128000,
      costPer1kInput: 0.00015,
      costPer1kOutput: 0.0006,
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }
}
