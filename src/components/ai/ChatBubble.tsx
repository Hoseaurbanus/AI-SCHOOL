import { Brain } from "lucide-react"
import type { ChatMessage } from "../../types"
import CodeBlock from "./CodeBlock"

interface ChatBubbleProps {
  message: ChatMessage
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.15)" }}
        >
          <Brain size={16} style={{ color: "#8B5CF6" }} />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? "rounded-br-md" : "rounded-bl-md"
        }`}
        style={{
          background: isUser ? "rgba(59,130,246,0.15)" : "#0D1421",
          border: isUser
            ? "1px solid rgba(59,130,246,0.2)"
            : "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: isUser ? "#E2E8F0" : "#94A3B8" }}
        >
          {message.content}
        </p>

        {message.code && (
          <div className="mt-3">
            <CodeBlock code={message.code} />
          </div>
        )}

        <p className="text-xs mt-2" style={{ color: "#475569" }}>
          {new Date(message.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(59,130,246,0.15)" }}
        >
          <span className="text-xs font-bold" style={{ color: "#3B82F6" }}>
            U
          </span>
        </div>
      )}
    </div>
  )
}
