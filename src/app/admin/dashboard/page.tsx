"use client"

import { Card, Col, Row, Statistic, Typography, Table, Tag, Button } from "antd"
import {
  OrderedListOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/utils/apiClient"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/common/PageHeader"
import { Routes } from "@/constants/routes"
import { OrderStatus, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/constants/orderStatus"
import { useAdminOrders } from "@/hooks/useOrders"
import Link from "next/link"

const { Text } = Typography

interface StatsResponse {
  success: boolean
  data: { total: number; pending: number; processing: number; completed: number }
}

export default function AdminDashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => apiGet<StatsResponse>(Routes.API.ADMIN.DASHBOARD_STATS),
  })

  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders(1, 5)

  const statsValue = statsData?.data || { total: 0, pending: 0, processing: 0, completed: 0 }
  const recentOrders = ordersData?.data?.items || []

  const stats = [
    {
      title: "Tổng đơn hàng",
      icon: <OrderedListOutlined style={{ color: "#1677ff", fontSize: 24 }} />,
      color: "#e6f4ff",
      value: statsValue.total,
    },
    {
      title: "Chờ xử lý",
      icon: <ClockCircleOutlined style={{ color: "#fa8c16", fontSize: 24 }} />,
      color: "#fff7e6",
      value: statsValue.pending,
    },
    {
      title: "Đang xử lý",
      icon: <SyncOutlined style={{ color: "#1677ff", fontSize: 24 }} spin={statsValue.processing > 0} />,
      color: "#e6f4ff",
      value: statsValue.processing,
    },
    {
      title: "Hoàn thành",
      icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />,
      color: "#f6ffed",
      value: statsValue.completed,
    },
  ]

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <Text copyable>{id.slice(-8)}</Text>,
    },
    {
      title: "Khách hàng",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Dịch vụ",
      dataIndex: ["service", "name"],
      key: "service",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => (
        <Tag color={ORDER_STATUS_COLORS[status]}>
          {ORDER_STATUS_LABELS[status]}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
  ]

  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Tổng quan hệ thống" />
      
      <Row gutter={[16, 16]}>
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card
              loading={statsLoading}
              style={{
                borderRadius: 12,
                background: stat.color,
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {stat.icon}
                </div>
                <Statistic title={stat.title} value={stat.value} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        style={{ marginTop: 24, borderRadius: 12 }}
        title="Đơn hàng gần đây"
        extra={
          <Link href={Routes.ADMIN.ORDERS}>
            <Button type="link" icon={<ArrowRightOutlined />}>
              Xem tất cả
            </Button>
          </Link>
        }
      >
        <Table
          loading={ordersLoading}
          dataSource={recentOrders}
          columns={columns}
          pagination={false}
          rowKey="id"
          scroll={{ x: true }}
        />
      </Card>
    </PageContainer>
  )
}
