import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  enrollmentService,
  type Enrollment,
  type EnrollmentDetail,
} from "../services/enrollmentService"

export function useMyEnrollments() {
  return useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: () => enrollmentService.getMyEnrollments(),
    staleTime: 2 * 60 * 1000,
  })
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: ["enrollments", id],
    queryFn: () => enrollmentService.getEnrollment(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      enrollmentId,
      lessonId,
    }: {
      enrollmentId: string
      lessonId: string
    }) => enrollmentService.completeLesson(enrollmentId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollments", variables.enrollmentId],
      })
      queryClient.invalidateQueries({ queryKey: ["enrollments", "me"] })
    },
  })
}

export function useUpdateProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      enrollmentId,
      progress,
    }: {
      enrollmentId: string
      progress: Record<string, unknown>
    }) => enrollmentService.updateProgress(enrollmentId, progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollments", variables.enrollmentId],
      })
    },
  })
}
