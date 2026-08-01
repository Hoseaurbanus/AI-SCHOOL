import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminService } from "../services/adminService"
import {
  courses,
  users,
  adminStats,
  recentTransactions,
  certificates,
  knowledgeBases,
} from "../data/mockData"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => Promise.resolve(adminStats),
  })
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: () => Promise.resolve(courses),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => Promise.resolve(users),
  })
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: () => Promise.resolve(recentTransactions),
  })
}

export function useAdminCertificates() {
  return useQuery({
    queryKey: ["admin", "certificates"],
    queryFn: () => Promise.resolve(certificates),
  })
}

export function useKnowledgeBases() {
  return useQuery({
    queryKey: ["admin", "knowledgeBases"],
    queryFn: () => Promise.resolve(knowledgeBases),
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useVerifyCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ verified: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "certificates"] })
    },
  })
}

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (kb: { name: string courseId: string }) =>
      Promise.resolve({
        id: `KB-${Date.now()}`,
        ...kb,
        documents: 0,
        lastUpdated: new Date().toISOString().slice(0, 10),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "knowledgeBases"] })
    },
  })
}

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "knowledgeBases"] })
    },
  })
}
