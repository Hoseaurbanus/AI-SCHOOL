import { useState } from "react"
import { ChevronLeft, ChevronRight, Send, BookOpen } from "lucide-react"
import {
  useAssessments,
  useStartAssessment,
  useSubmitAssessment,
} from "../hooks/useAssessment"
import { useCourse } from "../hooks/useCourses"
import { useSearchParams } from "react-router-dom"
import QuestionCard from "../components/assessment/QuestionCard"
import QuizProgress from "../components/assessment/QuizProgress"
import ResultSummary from "../components/assessment/ResultSummary"
import ConfirmDialog from "../components/admin/ConfirmDialog"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import type { Assessment as AssessmentType } from "../services/assessmentService"

export default function Assessment() {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get("courseId") || ""

  const { data: assessments = [], isLoading: assessmentsLoading } =
    useAssessments(courseId ? { courseId } : undefined)

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("")
  const [quizKey, setQuizKey] = useState(0)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const selectedAssessment = assessments.find(
    (a: AssessmentType) => a.id === selectedAssessmentId
  )

  const startAssessment = useStartAssessment()
  const submitAssessment = useSubmitAssessment()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const currentQuestion = selectedAssessment?.questions?.[currentIndex]
  const totalQuestions = selectedAssessment?.questions?.length || 0

  const handleStart = async (id: string) => {
    try {
      await startAssessment.mutateAsync(id)
      setSelectedAssessmentId(id)
      setQuizKey((prev) => prev + 1)
      setAnswers({})
      setCurrentIndex(0)
      setResult(null)
    } catch {
      // Error handled by mutation
    }
  }

  const handleSubmit = () => {
    setShowSubmitConfirm(true)
  }

  const confirmSubmit = async () => {
    if (!selectedAssessment) return
    try {
      const response = await submitAssessment.mutateAsync({
        id: selectedAssessment.id,
        answers,
      })
      setResult(response)
      setShowSubmitConfirm(false)
    } catch {
      setShowSubmitConfirm(false)
    }
  }

  const handleRetry = () => {
    if (selectedAssessmentId) {
      handleStart(selectedAssessmentId)
    }
  }

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
  }

  const isSubmitted = !!result

  if (assessmentsLoading) {
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
    <div className="min-h-screen" style={{ background: "#060A12" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <BookOpen size={20} style={{ color: "#8B5CF6" }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold font-display"
                style={{ color: "#F1F5F9" }}
              >
                Assessments
              </h1>
              <p className="text-xs" style={{ color: "#64748B" }}>
                Test your knowledge
              </p>
            </div>
          </div>

          {!isSubmitted && (
            <select
              value={selectedAssessmentId}
              onChange={(e) => handleStart(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: "#0D1421",
                color: "#F1F5F9",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <option value="">Select assessment</option>
              {assessments.map((a: AssessmentType) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {!selectedAssessment ? (
          <div
            className="text-center py-16 rounded-xl"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <BookOpen
              size={48}
              className="mx-auto mb-4"
              style={{ color: "#475569" }}
            />
            <p className="text-lg" style={{ color: "#64748B" }}>
              Select an assessment to begin
            </p>
          </div>
        ) : isSubmitted && result ? (
          <ResultSummary
            result={result}
            assessment={selectedAssessment}
            onRetry={handleRetry}
          />
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <QuizProgress
              current={currentIndex}
              total={totalQuestions}
              timeRemaining={timeRemaining}
            />

            {/* Question */}
            {currentQuestion && (
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "#0D1421",
                  border: "1px solid rgba(59,130,246,0.1)",
                }}
              >
                <QuestionCard
                  key={`${quizKey}-${currentIndex}`}
                  question={currentQuestion}
                  selectedAnswers={answers[currentQuestion.id] || ""}
                  onAnswer={(value: string) =>
                    setAnswer(currentQuestion.id, value)
                  }
                />
              </div>
            )}

            {/* Question Grid */}
            <div className="flex flex-wrap gap-2">
              {selectedAssessment.questions?.map(
                (q: { id: string }, i: number) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background:
                        i === currentIndex
                          ? "#3B82F6"
                          : answers[q.id]
                            ? "rgba(59,130,246,0.15)"
                            : "#0D1421",
                      color:
                        i === currentIndex
                          ? "#FFFFFF"
                          : answers[q.id]
                            ? "#3B82F6"
                            : "#64748B",
                      border: `1px solid ${
                        i === currentIndex
                          ? "#3B82F6"
                          : "rgba(59,130,246,0.1)"
                      }`,
                    }}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                style={{
                  background: "#0D1421",
                  color: "#94A3B8",
                  border: "1px solid rgba(59,130,246,0.1)",
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium"
                  style={{ background: "#3B82F6", color: "#FFFFFF" }}
                >
                  <Send size={16} />
                  Submit
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    color: "#3B82F6",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        title="Submit Assessment"
        message="Are you sure you want to submit? You cannot change your answers after submission."
        onConfirm={confirmSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  )
}
