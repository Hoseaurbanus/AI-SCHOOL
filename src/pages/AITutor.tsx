import { useState, useRef, useEffect } from "react"
import { Brain, Send, Sparkles, Code2, BookOpen, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useChat } from "../hooks/useChat"
import ChatBubble from "../components/ai/ChatBubble"
import TypingIndicator from "../components/ai/TypingIndicator"
import { courses } from "../data/mockData"

const suggestions = [
  "Explain recursion with a real example",
  "Why is my for loop infinite?",
  "Difference between list and tuple in Python",
  "How does gradient descent work?",
  "Explain overfitting vs underfitting",
]

export default function AITutor() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, isTyping } = useChat(
    selectedCourse || undefined,
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const send = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    sendMessage(msg)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "#060A12" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "#0D1421",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(139,92,246,0.15)" }}
          >
            <Brain size={20} style={{ color: "#8B5CF6" }} />
          </div>
          <div>
            <h1 className="font-bold font-display" style={{ color: "#F1F5F9" }}>
              AI Tutor
            </h1>
            <p className="text-xs" style={{ color: "#64748B" }}>
              Always here to help you learn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: "#060A12",
              color: "#F1F5F9",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <option value="">General</option>
            {courses.slice(0, 4).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg"
            style={{ color: "#64748B" }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <Sparkles size={32} style={{ color: "#8B5CF6" }} />
            </div>
            <h2
              className="text-xl font-bold font-display mb-2"
              style={{ color: "#F1F5F9" }}
            >
              How can I help you today?
            </h2>
            <p
              className="text-sm text-center max-w-md"
              style={{ color: "#64748B" }}
            >
              I can help you understand concepts, debug code, suggest next
              steps, and quiz you on topics.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  background: "#0D1421",
                  color: "#94A3B8",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <Sparkles
                  size={12}
                  className="inline mr-1"
                  style={{ color: "#8B5CF6" }}
                />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3"
        style={{
          background: "#0D1421",
          borderTop: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "#060A12",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your course..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#F1F5F9" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg transition-all"
            style={{
              background: input.trim() ? "rgba(59,130,246,0.2)" : "transparent",
              color: input.trim() ? "#3B82F6" : "#475569",
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "#475569" }}>
          AI can make mistakes. Verify important information from official docs.
        </p>
      </div>
    </div>
  )
}
