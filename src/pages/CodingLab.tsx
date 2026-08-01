import { useState, useEffect } from "react"
import {
  Play,
  RotateCcw,
  BookOpen,
  Code2,
  FileText,
} from "lucide-react"
import { api } from "../lib/api"
import { useCodeExecution } from "../hooks/useCodeExecution"
import CodeEditor from "../components/coding/CodeEditor"
import PreviewPanel from "../components/coding/PreviewPanel"
import Terminal from "../components/coding/Terminal"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import type { CodeLanguage } from "../types"

interface Exercise {
  id: string
  title: string
  description: string
  language: CodeLanguage
  starterCode: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function CodingLab() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<CodeLanguage>("html")
  const [loading, setLoading] = useState(true)
  const { execute, isRunning, result, iframeRef } = useCodeExecution()

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await api.get("/coding-lab/exercises")
        const items = data.data || data || []
        setExercises(items)
        if (items.length > 0) {
          setSelectedExercise(items[0])
          setCode(items[0].starterCode)
          setLanguage(items[0].language)
        }
      } catch {
        // Use empty array if API not available
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

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
    if (selectedExercise) {
      setCode(selectedExercise.starterCode)
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#060A12" }}
      >
        <LoadingSpinner size={32} />
      </div>
    )
  }

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
          <Code2 size={20} style={{ color: "#3B82F6" }} />
          <h1 className="font-bold font-display" style={{ color: "#F1F5F9" }}>
            Coding Lab
          </h1>
        </div>

        <select
          value={selectedExercise?.id || ""}
          onChange={(e) => handleExerciseChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{
            background: "#060A12",
            color: "#F1F5F9",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{
            background: "rgba(59,130,246,0.1)",
            color: "#3B82F6",
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{
            background: "#3B82F6",
            color: "#FFFFFF",
          }}
        >
          {isRunning ? (
            <LoadingSpinner size={14} />
          ) : (
            <Play size={14} />
          )}
          Run
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Instructions */}
        <div
          className="hidden lg:flex flex-col w-80 flex-shrink-0 overflow-y-auto"
          style={{
            background: "#0D1421",
            borderRight: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} style={{ color: "#8B5CF6" }} />
              <h2
                className="font-semibold font-display"
                style={{ color: "#F1F5F9" }}
              >
                Instructions
              </h2>
            </div>

            {selectedExercise && (
              <div className="space-y-4">
                <div>
                  <h3
                    className="font-medium mb-2"
                    style={{ color: "#F1F5F9" }}
                  >
                    {selectedExercise.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#94A3B8" }}>
                    {selectedExercise.description}
                  </p>
                </div>

                <div
                  className="px-3 py-2 rounded-lg text-xs"
                  style={{
                    background:
                      selectedExercise.difficulty === "beginner"
                        ? "rgba(16,185,129,0.1)"
                        : selectedExercise.difficulty === "intermediate"
                          ? "rgba(245,158,11,0.1)"
                          : "rgba(239,68,68,0.1)",
                    color:
                      selectedExercise.difficulty === "beginner"
                        ? "#10B981"
                        : selectedExercise.difficulty === "intermediate"
                          ? "#F59E0B"
                          : "#EF4444",
                  }}
                >
                  {selectedExercise.difficulty.charAt(0).toUpperCase() +
                    selectedExercise.difficulty.slice(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>

        {/* Right Panel - Preview/Terminal */}
        <div
          className="flex flex-col w-96 flex-shrink-0 overflow-hidden"
          style={{
            background: "#0D1421",
            borderLeft: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <PreviewPanel
            iframeRef={iframeRef as React.RefObject<HTMLIFrameElement>}
            isVisible={language === "html"}
          />
          <Terminal
            output={result?.output || ""}
            error={result?.error}
          />
        </div>
      </div>
    </div>
  )
}
