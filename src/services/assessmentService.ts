import { api } from "../lib/api"

export interface Assessment {
  id: string
  courseId: string
  moduleId?: string
  title: string
  description: string
  type: "quiz" | "exam" | "assignment"
  timeLimit?: number
  passingScore: number
  maxAttempts: number
  questions: AssessmentQuestion[]
  createdAt: string
}

export interface AssessmentQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "code"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

export interface AssessmentResult {
  id: string
  assessmentId: string
  userId: string
  score: number
  passed: boolean
  answers: Record<string, string>
  submittedAt: string
  feedback?: string
}

export interface StartAssessmentResponse {
  attemptId: string
  assessment: Assessment
  attemptNumber: number
}

export interface SubmitAssessmentResponse {
  resultId: string
  score: number
  passed: boolean
  feedback?: string
  questionFeedback: Array<{
    questionId: string
    correct: boolean
    feedback: string
  }>
}

export const assessmentService = {
  async getAssessments(params?: {
    courseId?: string
    moduleId?: string
  }): Promise<Assessment[]> {
    const { data } = await api.get("/assessments", { params })
    return data.data || data
  },

  async getAssessment(id: string): Promise<Assessment> {
    const { data } = await api.get(`/assessments/${id}`)
    return data.data || data
  },

  async startAssessment(id: string): Promise<StartAssessmentResponse> {
    const { data } = await api.post(`/assessments/${id}/start`)
    return data.data || data
  },

  async submitAssessment(
    id: string,
    answers: Record<string, string>
  ): Promise<SubmitAssessmentResponse> {
    const { data } = await api.post(`/assessments/${id}/submit`, { answers })
    return data.data || data
  },

  async getMyResults(): Promise<AssessmentResult[]> {
    const { data } = await api.get("/assessments/me/results")
    return data.data || data
  },

  async getResult(resultId: string): Promise<AssessmentResult> {
    const { data } = await api.get(`/assessments/results/${resultId}`)
    return data.data || data
  },
}
