"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost } from "@/utils/apiClient"
import { Routes } from "@/constants/routes"

interface User {
  id: string
  username: string
  role: string
  isActive: boolean
  createdAt: string
  userServices: { service: { id: string; code: string; name: string } }[]
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => apiGet<{ success: boolean; data: { items: User[] } }>(Routes.API.ADMIN.USERS),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { username: string; password: string; role?: string }) =>
      apiPost(Routes.API.ADMIN.USERS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, isActive, serviceIds }: { userId: string; isActive?: boolean; serviceIds?: string[] }) =>
      apiPost(Routes.API.ADMIN.USERS, { action: "update", userId, isActive, serviceIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
