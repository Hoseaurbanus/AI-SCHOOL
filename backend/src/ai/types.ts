export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatChunk {
  content: string
  finishReason?: string
}

export interface ChatParams {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface EmbeddingResult {
  embedding: number[]
  model: string
  tokens: number
}

export interface ModerationResult {
  flagged: boolean
  categories: Record<string, boolean>
}

export interface ModelInfo {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPer1kInput: number
  costPer1kOutput: number
}

export interface AIProvider {
  chat(params: ChatParams): AsyncGenerator<ChatChunk>
  embed(text: string): Promise<EmbeddingResult>
  moderate(content: string): Promise<ModerationResult>
  getModelInfo(): ModelInfo
  isAvailable(): Promise<boolean>
}
