import { create } from "zustand"
import type { ChatMessage } from "../types"

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  activeCourseId: string | null
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  setActiveCourse: (courseId: string | null) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  activeCourseId: null,

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }))
  },

  setTyping: (typing: boolean) => {
    set({ isTyping: typing })
  },

  setActiveCourse: (courseId: string | null) => {
    set({ activeCourseId: courseId })
  },

  clearMessages: () => {
    set({ messages: [] })
  },
}))
