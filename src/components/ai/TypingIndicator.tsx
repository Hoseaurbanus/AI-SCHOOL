import { Brain } from "lucide-react"

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(139,92,246,0.15)" }}
      >
        <Brain size={16} style={{ color: "#8B5CF6" }} />
      </div>

      <div
        className="rounded-2xl rounded-bl-md px-4 py-3"
        style={{
          background: "#0D1421",
          border: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#8B5CF6",
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span className="text-xs ml-2" style={{ color: "#64748B" }}>
            AI is thinking...
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
