import { CheckCircle2, XCircle, Clock, Award, RotateCcw } from "lucide-react"
import type { Assessment, AssessmentResult } from "../../types"

interface ResultSummaryProps {
  result: AssessmentResult
  assessment: Assessment
  onRetry?: () => void
}

export default function ResultSummary({
  result,
  assessment,
  onRetry,
}: ResultSummaryProps) {
  const passed = result.passed

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div
        className="p-6 rounded-2xl text-center"
        style={{
          background: "#0D1421",
          border: `1px solid ${
            passed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"
          }`,
        }}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: passed
              ? "rgba(16,185,129,0.15)"
              : "rgba(239,68,68,0.15)",
          }}
        >
          {passed ? (
            <Award size={32} style={{ color: "#10B981" }} />
          ) : (
            <XCircle size={32} style={{ color: "#EF4444" }} />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#F1F5F9" }}>
          {result.score}%
        </h2>
        <p
          className="text-sm mb-1"
          style={{ color: passed ? "#10B981" : "#EF4444" }}
        >
          {passed
            ? "Congratulations! You passed!"
            : "Keep practicing! You can retry."}
        </p>
        <p className="text-xs" style={{ color: "#64748B" }}>
          Passing score: {assessment.passingScore}%
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl"
          style={{
            background: "#0D1421",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: "#3B82F6" }} />
            <span className="text-xs" style={{ color: "#64748B" }}>
              Time Taken
            </span>
          </div>
          <p className="text-lg font-bold" style={{ color: "#F1F5F9" }}>
            {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
          </p>
        </div>
        <div
          className="p-4 rounded-xl"
          style={{
            background: "#0D1421",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} style={{ color: "#10B981" }} />
            <span className="text-xs" style={{ color: "#64748B" }}>
              Questions
            </span>
          </div>
          <p className="text-lg font-bold" style={{ color: "#F1F5F9" }}>
            {assessment.questions.length}
          </p>
        </div>
      </div>

      {/* Retry Button */}
      {onRetry && !passed && (
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{
            background: "rgba(59,130,246,0.15)",
            color: "#3B82F6",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <RotateCcw size={16} />
          Retry Assessment
        </button>
      )}
    </div>
  )
}
