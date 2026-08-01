import { useState } from "react"
import {
  Play,
  RotateCcw,
  BookOpen,
  Sparkles,
  Code2,
  FileText,
  Eye,
} from "lucide-react"
import { exercises } from "../data/mockData"
import { useCodeExecution } from "../hooks/useCodeExecution"
import CodeEditor from "../components/coding/CodeEditor"
import PreviewPanel from "../components/coding/PreviewPanel"
import Terminal from "../components/coding/Terminal"
import type { CodeLanguage } from "../types"

export default function CodingLab() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])
  const [code, setCode] = useState(exercises[0].starterCode)
  const [language, setLanguage] = useState<CodeLanguage>(exercises[0].language)
  const { execute, isRunning, result, iframeRef } = useCodeExecution()

  const handleExerciseChange = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId)
    if (exercise) {
      setSelectedExercise(exercise)
      setCode(exercise.starterCode)
      setLanguage(exercise.language)
    }
  }

  const handleRun = async () => {
    await execute(code, language)
  }

  const handleReset = () => {
    setCode(selectedExercise.starterCode)
  }

  const languages: { id: CodeLanguage label: string icon: typeof Code2 }[] = [
    { id: "html", label: "HTML/CSS/JS", icon: Code2 },
    { id: "python", label: "Python", icon: Code2 },
    { id: "markdown", label: "Markdown", icon: FileText },
  ]

  return (
    <div className="flex flex-col h-screen" style={{ background: "#060A12" }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-4 px-4 py-3 flex-shrink-0"
        style={{
          background: "#0D1421",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <Code2 size={16} style={{ color: "#3B82F6" }} />
          </div>
          <span className="font-bold text-sm" style={{ color: "#F1F5F9" }}>
            Coding Lab
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1">
          {languages.map((lang) => {
            const Icon = lang.icon
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id)
                  const ex = exercises.find((e) => e.language === lang.id)
                  if (ex) handleExerciseChange(ex.id)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background:
                    language === lang.id
                      ? "rgba(59,130,246,0.15)"
                      : "transparent",
                  color: language === lang.id ? "#3B82F6" : "#64748B",
                  border: `1px solid ${
                    language === lang.id
                      ? "rgba(59,130,246,0.3)"
                      : "transparent"
                  }`,
                }}
              >
                <Icon size={12} />
                {lang.label}
              </button>
            )
          })}
        </div>

        {/* Exercise Selector */}
        <select
          value={selectedExercise.id}
          onChange={(e) => handleExerciseChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs"
          style={{
            background: "#060A12",
            color: "#F1F5F9",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {exercises
            .filter((e) => e.language === language)
            .map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
        </select>

        <div className="flex-1" />

        {/* Actions */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: "rgba(100,116,139,0.15)", color: "#94A3B8" }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
          style={{ background: "#3B82F6", color: "#FFFFFF" }}
        >
          <Play size={12} />
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>

      {/* Exercise Description */}
      <div
        className="px-4 py-2 flex-shrink-0"
        style={{
          background: "#0D1421",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          {selectedExercise.description}
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div
          className="w-3/5 flex flex-col"
          style={{ borderRight: "1px solid rgba(59,130,246,0.1)" }}
        >
          <CodeEditor code={code} language={language} onChange={setCode} />
        </div>

        {/* Right Panel */}
        <div className="w-2/5 flex flex-col">
          {/* Preview */}
          <div
            className="h-1/2"
            style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
          >
            <PreviewPanel
              code={code}
              language={language}
              markdownOutput={
                result?.status === "success" && language === "markdown"
                  ? result.output
                  : undefined
              }
              iframeRef={iframeRef}
            />
          </div>
          {/* Terminal */}
          <div className="h-1/2">
            <Terminal result={result} onClear={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
