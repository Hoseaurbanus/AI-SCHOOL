import { api } from "../lib/api"
import type {
  Course,
  CourseModule,
  CourseReview,
  ApiResponse,
  Enrollment,
} from "../types"

export const courseService = {
  getCourses: async (params?: {
    category?: string
    level?: string
    search?: string
    sortBy?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<Course[]>> => {
    const { data } = await api.get("/courses", { params })
    return data
  },

  getCourseById: async (id: string): Promise<ApiResponse<Course>> => {
    const { data } = await api.get(`/courses/${id}`)
    return data
  },

  getCourseModules: async (
    courseId: string,
  ): Promise<ApiResponse<CourseModule[]>> => {
    const { data } = await api.get(`/courses/${courseId}/modules`)
    return data
  },

  getCourseReviews: async (
    courseId: string,
  ): Promise<ApiResponse<CourseReview[]>> => {
    const { data } = await api.get(`/courses/${courseId}/reviews`)
    return data
  },

  searchCourses: async (query: string): Promise<ApiResponse<Course[]>> => {
    const { data } = await api.get("/courses/search", { params: { q: query } })
    return data
  },

  getFeaturedCourses: async (): Promise<ApiResponse<Course[]>> => {
    const { data } = await api.get("/courses/featured")
    return data
  },

  getEnrolledCourses: async (): Promise<ApiResponse<Enrollment[]>> => {
    const { data } = await api.get("/enrollments")
    return data
  },

  enrollInCourse: async (
    courseId: string,
  ): Promise<ApiResponse<Enrollment>> => {
    const { data } = await api.post("/enrollments", { courseId })
    return data
  },
}
