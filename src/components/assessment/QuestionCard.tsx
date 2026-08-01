import { CheckCircle2, XCircle } from "lucide-react"
import type { Question } from "../../types"

interface QuestionCardProps {
  question: Question
  selectedAnswers: string[]
  onAnswer: (ids: string[]) => void
  showCorrect?: boolean
}

export default function QuestionCard({
  question,
  selectedAnswers,
  onAnswer,
  showCorrect,
}: QuestionCardProps) {
  const handleSelect = (optionId: string) => {
    if (showCorrect) return

    if (question.type === "multiple-select") {
      const newSelection = selectedAnswers.includes(optionId)
        ? selectedAnswers.filter((id) => id !== optionId)
        : [...selectedAnswers, optionId]
      onAnswer(newSelection)
    } else {
      onAnswer([optionId])
    }
  }

  const isCorrect = (optionId: string) =>
    question.correctAnswers.includes(optionId)
  const isSelected = (optionId: string) => selectedAnswers.includes(optionId)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}
        >
          {question.points} pts
        </span>
        <p className="text-sm leading-relaxed" style={{ color: "#F1F5F9" }}>
          {question.text}
        </p>
      </div>

      {question.code && (
        <pre
          className="p-4 rounded-xl text-xs font-mono overflow-x-auto"
          style={{
            background: "#060A12",
            color: "#94A3B8",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          {question.code}
        </pre>
      )}

      <div className="space-y-2">
        {question.options.map((option) => {
          const selected = isSelected(option.id)
          const correct = isCorrect(option.id)

          let borderColor = "rgba(59,130,246,0.1)"
          let bgColor = "transparent"

          if (showCorrect) {
            if (correct) {
              borderColor = "rgba(16,185,129,0.5)"
              bgColor = "rgba(16,185,129,0.1)"
            } else if (selected && !correct) {
              borderColor = "rgba(239,68,68,0.5)"
              bgColor = "rgba(239,68,68,0.1)"
            }
          } else if (selected) {
            borderColor = "rgba(59,130,246,0.5)"
            bgColor = "rgba(59,130,246,0.1)"
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: bgColor,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  border: `2px solid ${selected ? "#3B82F6" : "#475569"}`,
                  background: selected ? "#3B82F6" : "transparent",
                }}
              >
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm" style={{ color: "#94A3B8" }}>
                {option.text}
              </span>
              {showCorrect && correct && (
                <CheckCircle2
                  size={16}
                  className="ml-auto"
                  style={{ color: "#10B981" }}
                />
              )}
              {showCorrect && selected && !correct && (
                <XCircle
                  size={16}
                  className="ml-auto"
                  style={{ color: "#EF4444" }}
                />
              )}
            </button>
          )
        })}
      </div>

      {showCorrect && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <p style={{ color: "#94A3B8" }}>{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
