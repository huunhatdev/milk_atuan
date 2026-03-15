/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button, Tag, Select, Space, message, Card, DatePicker } from "antd"
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useAdminOrders, useUpdateOrderStatus, Order, AdminOrderFilters } from "@/hooks/useOrders"
import { useUsers } from "@/hooks/useUsers"
import { useAdminServices } from "@/hooks/useServices"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/common/PageHeader"
import DataTable from "@/components/common/DataTable"
import { OrderStatus, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/constants/orderStatus"
import { Routes } from "@/constants/routes"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

const { RangePicker } = DatePicker

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<AdminOrderFilters>({})
  
  const { data, isLoading } = useAdminOrders(page, 20, filters)
  const { data: usersData } = useUsers()
  const { data: servicesData } = useAdminServices()
  const updateStatus = useUpdateOrderStatus()
  const [messageApi, contextHolder] = message.useMessage()

  const orders: Order[] = data?.data?.items || []
  const pagination = data?.data?.pagination
  const users = usersData?.data?.items || []
  const services = servicesData?.data?.items || []

  const handleFilterChange = (key: keyof AdminOrderFilters, value: string | OrderStatus | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleDateChange = (dates: any) => {
    setFilters(prev => ({
      ...prev,
      startDate: dates ? dates[0].format("YYYY-MM-DD") : undefined,
      endDate: dates ? dates[1].format("YYYY-MM-DD") : undefined,
    }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({})
    setPage(1)
  }

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatus.mutate(
      { orderId, status },
      {
        onSuccess: () => messageApi.success("Cập nhật trạng thái thành công"),
        onError: () => messageApi.error("Lỗi cập nhật trạng thái"),
      }
    )
  }

  const columns: ColumnsType<Order> = [
    { title: "ID", dataIndex: "id", key: "id", width: 100, render: (v) => v.slice(-8) },
    { title: "Khách hàng", dataIndex: ["user", "username"], key: "username" },
    { title: "Dịch vụ", dataIndex: ["service", "name"], key: "service" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={ORDER_STATUS_COLORS[status as OrderStatus]}>
          {ORDER_STATUS_LABELS[status as OrderStatus]}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link href={`${Routes.ADMIN.ORDERS}/${record.id}`}>
            <Button icon={<EyeOutlined />} size="small" />
          </Link>
          <Select
            value={record.status}
            size="small"
            style={{ width: 140 }}
            options={Object.values(OrderStatus).map((s) => ({
              label: ORDER_STATUS_LABELS[s],
              value: s,
            }))}
            onChange={(status) => handleStatusChange(record.id, status)}
          />
        </Space>
      ),
    },
  ]

  return (
    <PageContainer>
      {contextHolder}
      <PageHeader
        title="Quản lý đơn hàng"
        subtitle="Xem và xử lý tất cả đơn hàng"
      />

      <Card style={{ marginBottom: 16, borderRadius: 12 }} size="small">
        <Space wrap size="middle">
          <Select
            placeholder="Khách hàng"
            allowClear
            style={{ width: 200 }}
            options={users.map(u => ({ label: u.username, value: u.id }))}
            value={filters.userId}
            onChange={(v) => handleFilterChange("userId", v)}
          />
          <Select
            placeholder="Dịch vụ"
            allowClear
            style={{ width: 180 }}
            options={services.map(s => ({ label: s.name, value: s.id }))}
            value={filters.serviceId}
            onChange={(v) => handleFilterChange("serviceId", v)}
          />
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ width: 150 }}
            options={Object.values(OrderStatus).map((s) => ({
              label: ORDER_STATUS_LABELS[s],
              value: s,
            }))}
            value={filters.status}
            onChange={(v) => handleFilterChange("status", v)}
          />
          <RangePicker 
            onChange={handleDateChange}
            value={filters.startDate ? [dayjs(filters.startDate), dayjs(filters.endDate)] : null}
          />
          <Button icon={<ReloadOutlined />} onClick={resetFilters}>Reset</Button>
        </Space>
      </Card>

      <DataTable<Order>
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        rowKey="id"
        total={pagination?.total}
        page={page}
        pageSize={20}
        onPageChange={setPage}
      />
    </PageContainer>
  )
}
