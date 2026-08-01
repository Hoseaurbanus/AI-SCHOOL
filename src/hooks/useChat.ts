import { useCallback, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { aiService, streamChat } from "../services/aiService"
import { useChatStore } from "../stores/chatStore"
import type { ChatMessage } from "../types"

export function useChat(courseId?: string) {
  const { messages, addMessage, isTyping, setTyping } = useChatStore()
  const queryClient = useQueryClient()
  const [streamingContent, setStreamingContent] = useState("")

  const { data: historyData } = useQuery({
    queryKey: ["chatHistory", courseId],
    queryFn: () => aiService.getChatHistory(courseId),
    staleTime: 5 * 60 * 1000,
  })

  const sendMessage = useCallback(
    async (content: string, lessonId?: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        courseId,
        lessonId,
      }
      addMessage(userMessage)
      setTyping(true)
      setStreamingContent("")

      // Add placeholder for AI response
      const aiMessageId = `ai-${Date.now()}`
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: "ai",
        content: "",
        timestamp: new Date().toISOString(),
        courseId,
      }
      addMessage(aiMessage)

      try {
        await streamChat(content, {
          courseId,
          lessonId,
          agentType: "tutor",
          onChunk: (chunk) => {
            setStreamingContent((prev) => {
              const newContent = prev + chunk
              // Update the last AI message in the store
              const store = useChatStore.getState()
              const messages = store.messages
              const lastAiIndex = messages.findIndex(
                (m) => m.id === aiMessageId,
              )
              if (lastAiIndex !== -1) {
                const updatedMessages = [...messages]
                updatedMessages[lastAiIndex] = {
                  ...updatedMessages[lastAiIndex],
                  content: newContent,
                }
                useChatStore.setState({ messages: updatedMessages })
              }
              return newContent
            })
          },
          onDone: () => {
            setTyping(false)
            setStreamingContent("")
            queryClient.invalidateQueries({
              queryKey: ["chatHistory", courseId],
            })
          },
          onError: (error) => {
            setTyping(false)
            setStreamingContent("")
            const errorMessage: ChatMessage = {
              id: `err-${Date.now()}`,
              role: "ai",
              content:
                error || "I'm having trouble right now. Please try again.",
              timestamp: new Date().toISOString(),
            }
            addMessage(errorMessage)
          },
        })
      } catch {
        setTyping(false)
        setStreamingContent("")
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "ai",
          content: "I'm having trouble right now. Please try again.",
          timestamp: new Date().toISOString(),
        }
        addMessage(errorMessage)
      }
    },
    [addMessage, setTyping, courseId, queryClient],
  )

  return {
    messages: historyData?.data ? [...historyData.data, ...messages] : messages,
    sendMessage,
    isTyping,
    streamingContent,
  }
}
