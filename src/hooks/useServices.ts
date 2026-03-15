"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/utils/apiClient"
import { Routes } from "@/constants/routes"

interface Service {
  id: string
  code: string
  name: string
}

interface ServicesResponse {
  success: boolean
  data: Service[]
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => apiGet<ServicesResponse>(Routes.API.SERVICES),
  })
}

export function useAdminServices() {
  return useQuery({
    queryKey: ["admin-services"],
    queryFn: () => apiGet<{ success: boolean; data: { items: Service[] } }>(Routes.API.ADMIN.SERVICES),
  })
}
