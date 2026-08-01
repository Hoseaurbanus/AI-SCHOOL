import { Terminal as TerminalIcon, Trash2 } from "lucide-react"
import type { ExecutionResult } from "../../types"

interface TerminalProps {
  result: ExecutionResult | null
  onClear: () => void
}

export default function Terminal({ result, onClear }: TerminalProps) {
  return (
    <div className="h-full flex flex-col" style={{ background: "#060A12" }}>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: "#0D1421",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} style={{ color: "#3B82F6" }} />
          <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>
            Terminal
          </span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded"
          style={{ color: "#475569" }}
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto p-3 font-mono text-xs"
        style={{ color: "#94A3B8" }}
      >
        {result ? (
          <>
            {result.output && (
              <pre className="whitespace-pre-wrap">{result.output}</pre>
            )}
            {result.error && (
              <pre className="whitespace-pre-wrap" style={{ color: "#EF4444" }}>
                {result.error}
              </pre>
            )}
            {!result.output && !result.error && (
              <p style={{ color: "#64748B" }}>No output</p>
            )}
          </>
        ) : (
          <p style={{ color: "#475569" }}>Click "Run" to execute your code</p>
        )}
      </div>
    </div>
  )
}
