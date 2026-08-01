import Editor from "@monaco-editor/react"
import type { CodeLanguage } from "../../types"

interface CodeEditorProps {
  code: string
  language: CodeLanguage
  onChange: (code: string) => void
}

const languageMap: Record<CodeLanguage, string> = {
  html: "html",
  python: "python",
  markdown: "markdown",
}

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={languageMap[language]}
        value={code}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          automaticLayout: true,
        }}
      />
    </div>
  )
}
