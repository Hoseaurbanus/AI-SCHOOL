import { useQuery } from "@tanstack/react-query"
import { courseService } from "../services/courseService"

export function useCourses(params?: {
  category?: string
  level?: string
  search?: string
  sortBy?: string
}) {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseService.getCourses(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getCourseById(id),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ["courseModules", courseId],
    queryFn: () => courseService.getCourseModules(courseId),
    staleTime: 10 * 60 * 1000,
  })
}

export function useCourseReviews(courseId: string) {
  return useQuery({
    queryKey: ["courseReviews", courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
    staleTime: 5 * 60 * 1000,
  })
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ["featuredCourses"],
    queryFn: () => courseService.getFeaturedCourses(),
    staleTime: 10 * 60 * 1000,
  })
}
