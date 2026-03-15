"use client"

import DataTable from "@/components/common/DataTable"
import PageHeader from "@/components/common/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus } from "@/constants/orderStatus"
import { Routes } from "@/constants/routes"
import { Order, useOrders } from "@/hooks/useOrders"
import { EyeOutlined } from "@ant-design/icons"
import { Button, Select, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import Link from "next/link"
import { useState } from "react"

export default function CustomerOrdersPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>()
  const { data, isLoading } = useOrders(page, 20, statusFilter)

  const orders: Order[] = data?.data?.items || []
  const pagination = data?.data?.pagination

  const columns: ColumnsType<Order> = [
    { title: "ID", dataIndex: "id", key: "id", render: (v) => v.slice(-8) },
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
        <Link href={`${Routes.CUSTOMER.ORDERS}/${record.id}`}>
          <Button icon={<EyeOutlined />} size="small" />
        </Link>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Đơn hàng của tôi"
        subtitle="Lịch sử tạo đơn hàng"
        extra={
          <Select
            placeholder="Lọc trạng thái"
            allowClear
            style={{ width: 180 }}
            options={Object.values(OrderStatus).map((s) => ({
              label: ORDER_STATUS_LABELS[s],
              value: s,
            }))}
            onChange={(v) => setStatusFilter(v)}
          />
        }
      />

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
