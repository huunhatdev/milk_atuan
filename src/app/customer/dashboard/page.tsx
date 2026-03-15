"use client"

import PageHeader from "@/components/common/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import { OrderStatus } from "@/constants/orderStatus"
import { useOrders } from "@/hooks/useOrders"
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  OrderedListOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import { Card, Col, Row, Statistic } from "antd"

export default function CustomerDashboardPage() {
  const { data } = useOrders(1, 100)
  const orders = data?.data?.items || []

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
    processing: orders.filter((o) => o.status === OrderStatus.PROCESSING).length,
    completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
  }

  const cards = [
    { title: "Tổng đơn", icon: <OrderedListOutlined style={{ color: "#1677ff", fontSize: 24 }} />, color: "#e6f4ff", value: stats.total },
    { title: "Chờ xử lý", icon: <ClockCircleOutlined style={{ color: "#fa8c16", fontSize: 24 }} />, color: "#fff7e6", value: stats.pending },
    { title: "Đang xử lý", icon: <SyncOutlined style={{ color: "#1677ff", fontSize: 24 }} />, color: "#e6f4ff", value: stats.processing },
    { title: "Hoàn thành", icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />, color: "#f6ffed", value: stats.completed },
  ]

  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Tổng quan đơn hàng của bạn" />
      <Row gutter={[16, 16]}>
        {cards.map((c, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card style={{ borderRadius: 12, background: c.color, border: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: 12, borderRadius: 12, background: "white" }}>{c.icon}</div>
                <Statistic title={c.title} value={c.value} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  )
}
