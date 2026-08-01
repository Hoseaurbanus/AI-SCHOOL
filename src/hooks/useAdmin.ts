import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminService } from "../services/adminService"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminService.getStats(),
    staleTime: 60 * 1000,
  })
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => adminService.getCourses(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminService.getUsers(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: () => adminService.getTransactions(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminCertificates() {
  return useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: () => adminService.getCertificates(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useKnowledgeBases() {
  return useQuery({
    queryKey: ["admin", "knowledgeBases"],
    queryFn: () => adminService.getKnowledgeBases(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useVerifyCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.verifyCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "certificates"] })
    },
  })
}

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (kb: { name: string; courseId: string }) =>
      adminService.createKnowledgeBase(kb),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "knowledgeBases"] })
    },
  })
}

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteKnowledgeBase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "knowledgeBases"] })
    },
  })
}
