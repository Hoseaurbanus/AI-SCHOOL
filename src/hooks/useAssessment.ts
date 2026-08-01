import { useState, useEffect, useCallback } from "react"
import type { Assessment, AssessmentResult, Question } from "../types"

interface UseAssessmentReturn {
  currentQuestion: Question
  currentIndex: number
  answers: Record<string, string[]>
  setAnswer: (questionId: string, answerIds: string[]) => void
  goNext: () => void
  goPrev: () => void
  goToQuestion: (index: number) => void
  submit: () => AssessmentResult
  result: AssessmentResult | null
  timeRemaining: number
  isSubmitted: boolean
  totalQuestions: number
}

export function useAssessment(assessment: Assessment): UseAssessmentReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit * 60)

  const currentQuestion = assessment.questions[currentIndex]

  useEffect(() => {
    if (result) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [result])

  useEffect(() => {
    if (timeRemaining === 0 && !result) {
      submit()
    }
  }, [timeRemaining, result])

  const setAnswer = useCallback((questionId: string, answerIds: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIds }))
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, assessment.questions.length - 1),
    )
  }, [assessment.questions.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const calculateScore = useCallback(() => {
    let totalPoints = 0
    let earnedPoints = 0

    assessment.questions.forEach((question) => {
      totalPoints += question.points
      const selected = answers[question.id] || []
      const correct = question.correctAnswers
      const isCorrect =
        selected.length === correct.length &&
        selected.every((s) => correct.includes(s))
      if (isCorrect) earnedPoints += question.points
    })

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  }, [assessment.questions, answers])

  const submit = useCallback((): AssessmentResult => {
    const score = calculateScore()
    const assessmentResult: AssessmentResult = {
      id: `result_${Date.now()}`,
      assessmentId: assessment.id,
      userId: "usr_001",
      answers,
      score,
      passed: score >= assessment.passingScore,
      timeTaken: assessment.timeLimit * 60 - timeRemaining,
      completedAt: new Date().toISOString(),
    }
    setResult(assessmentResult)
    return assessmentResult
  }, [assessment, answers, timeRemaining, calculateScore])

  return {
    currentQuestion,
    currentIndex,
    answers,
    setAnswer,
    goNext,
    goPrev,
    goToQuestion,
    submit,
    result,
    timeRemaining,
    isSubmitted: result !== null,
    totalQuestions: assessment.questions.length,
  }
}
