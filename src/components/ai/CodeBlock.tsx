import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({
  code,
  language = "python",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#0A0F1A",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: "rgba(59,130,246,0.05)",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <span className="text-xs font-medium" style={{ color: "#64748B" }}>
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: copied ? "#10B981" : "#64748B" }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code
          className="text-sm"
          style={{ color: "#E2E8F0", fontFamily: "monospace" }}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}
