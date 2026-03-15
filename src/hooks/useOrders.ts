"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost } from "@/utils/apiClient"
import { Routes } from "@/constants/routes"
import { OrderStatus } from "@/constants/orderStatus"
import { CreateOrderDto } from "@/dto/createOrder.dto"

export interface Order {
  id: string
  serviceId: string
  quantity: number
  message: string
  ccg: boolean
  status: OrderStatus
  createdAt: string
  service: { code: string; name: string }
  user?: { username: string }
}

interface OrdersResponse {
  success: boolean
  data: {
    items: Order[]
    pagination: { page: number; pageSize: number; total: number }
  }
}

export function useOrders(page = 1, pageSize = 20, status?: OrderStatus) {
  return useQuery({
    queryKey: ["orders", page, pageSize, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
      if (status) params.append("status", status)
      return apiGet<OrdersResponse>(`${Routes.API.ORDERS}?${params}`)
    },
  })
}

export interface AdminOrderFilters {
  status?: OrderStatus
  userId?: string
  serviceId?: string
  startDate?: string
  endDate?: string
}

export function useAdminOrders(page = 1, pageSize = 20, filters: AdminOrderFilters = {}) {
  return useQuery({
    queryKey: ["admin-orders", page, pageSize, filters],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
      if (filters.status) params.append("status", filters.status)
      if (filters.userId) params.append("userId", filters.userId)
      if (filters.serviceId) params.append("serviceId", filters.serviceId)
      if (filters.startDate) params.append("startDate", filters.startDate)
      if (filters.endDate) params.append("endDate", filters.endDate)
      return apiGet<OrdersResponse>(`${Routes.API.ADMIN.ORDERS}?${params}`)
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrderDto) => apiPost(Routes.API.ORDERS, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      apiPost(Routes.API.ADMIN.ORDERS, { orderId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] })
    },
  })
}

interface OrderDetail {
  id: string
  phoneNumber: string
  code: string | null
  sourceTag: string | null
  messageResponse: string | null
  createdAt: string
}

interface SingleOrderResponse {
  success: boolean
  data: Order & { details: OrderDetail[] }
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => apiGet<SingleOrderResponse>(`${Routes.API.ADMIN.ORDERS}/${orderId}`),
    enabled: !!orderId,
  })
}

export function useCustomerOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: () => apiGet<SingleOrderResponse>(`${Routes.API.ORDERS}/${orderId}`),
    enabled: !!orderId,
  })
}
