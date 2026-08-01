import { api } from "../lib/api"
import type {
  ChatMessage,
  AIInsight,
  StudentStats,
  ApiResponse,
} from "../types"

export const aiService = {
  sendMessage: async (data: {
    content: string
    courseId?: string
    lessonId?: string
  }): Promise<ApiResponse<ChatMessage>> => {
    const { data: response } = await api.post("/ai/chat", {
      message: data.content,
      courseId: data.courseId,
      lessonId: data.lessonId,
      agentType: "tutor",
    })
    return response
  },

  getChatHistory: async (
    courseId?: string,
  ): Promise<ApiResponse<ChatMessage[]>> => {
    const { data } = await api.get("/ai/chat/history", { params: { courseId } })
    return data
  },

  getInsights: async (): Promise<ApiResponse<AIInsight[]>> => {
    const { data } = await api.get("/ai/insights")
    return data
  },

  getStudentStats: async (): Promise<ApiResponse<StudentStats>> => {
    const { data } = await api.get("/ai/stats")
    return data
  },

  getCodeReview: async (
    code: string,
    language: string,
  ): Promise<ApiResponse<string>> => {
    const { data } = await api.post("/ai/code/review", { code, language })
    return data
  },

  getHint: async (exerciseId: string, attempt: number, userCode?: string) => {
    const { data } = await api.post("/ai/code/hint", {
      exerciseId,
      attempt,
      userCode,
    })
    return data
  },
}

// SSE streaming for chat
export async function streamChat(
  message: string,
  options: {
    courseId?: string
    lessonId?: string
    agentType?: string
    onChunk: (chunk: string) => void
    onDone: (fullResponse: string) => void
    onError: (error: string) => void
  },
): Promise<void> {
  const token = localStorage.getItem("clerk_session_token")
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"

  const response = await fetch(`${baseUrl}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      courseId: options.courseId,
      lessonId: options.lessonId,
      agentType: options.agentType || "tutor",
    }),
  })

  if (!response.ok) {
    options.onError("Failed to connect to AI tutor")
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    options.onError("Failed to read response stream")
    return
  }

  const decoder = new TextDecoder()
  let fullResponse = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.error) {
              options.onError(data.message || "AI service error")
            } else if (data.done) {
              options.onDone(fullResponse)
            } else if (data.content) {
              fullResponse += data.content
              options.onChunk(data.content)
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
