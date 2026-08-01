import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  assessmentService,
  type Assessment,
  type AssessmentResult,
} from "../services/assessmentService"

export function useAssessments(params?: { courseId?: string; moduleId?: string }) {
  return useQuery({
    queryKey: ["assessments", params],
    queryFn: () => assessmentService.getAssessments(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ["assessments", id],
    queryFn: () => assessmentService.getAssessment(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useStartAssessment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => assessmentService.startAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
    },
  })
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      answers,
    }: {
      id: string
      answers: Record<string, string>
    }) => assessmentService.submitAssessment(id, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] })
      queryClient.invalidateQueries({ queryKey: ["assessmentResults"] })
    },
  })
}

export function useMyAssessmentResults() {
  return useQuery({
    queryKey: ["assessmentResults"],
    queryFn: () => assessmentService.getMyResults(),
    staleTime: 5 * 60 * 1000,
  })
}
