import { api } from "../lib/api"

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: "active" | "completed" | "paused"
  progress: number
  enrolledAt: string
  completedAt?: string
  course?: {
    id: string
    title: string
    thumbnail?: string
    instructor?: string
  }
}

export interface EnrollmentDetail extends Enrollment {
  modules?: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      completed: boolean
      completedAt?: string
    }>
  }>
  completedLessons?: number
  totalLessons?: number
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: string
  timeSpent?: number
}

export const enrollmentService = {
  async getMyEnrollments(): Promise<Enrollment[]> {
    const { data } = await api.get("/enrollments/me")
    return data.data || data
  },

  async getEnrollment(id: string): Promise<EnrollmentDetail> {
    const { data } = await api.get(`/enrollments/${id}`)
    return data.data || data
  },

  async updateProgress(
    id: string,
    progress: Record<string, unknown>
  ): Promise<void> {
    await api.put(`/enrollments/${id}/progress`, { progress })
  },

  async completeLesson(
    enrollmentId: string,
    lessonId: string
  ): Promise<void> {
    await api.post(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`)
  },
}
