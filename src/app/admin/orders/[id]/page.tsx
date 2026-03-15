"use client"

import { useParams } from "next/navigation"
import { Card, Descriptions, Tag, Table, Spin, Empty, Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import Link from "next/link"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/common/PageHeader"
import { useOrderDetail } from "@/hooks/useOrders"
import { OrderStatus, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/constants/orderStatus"
import { Routes } from "@/constants/routes"


export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const { data: res, isLoading } = useOrderDetail(orderId)

  if (isLoading) {
    return (
      <PageContainer>
        <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    )
  }

  const order = res?.data

  if (!order) {
    return (
      <PageContainer>
        <Empty description="Không tìm thấy đơn hàng" />
      </PageContainer>
    )
  }

  const detailColumns = [
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Mã code",
      dataIndex: "code",
      key: "code",
      render: (v: string) => v || "-",
    },
    {
      title: "Source Tag",
      dataIndex: "sourceTag",
      key: "sourceTag",
      render: (v: string) => v || "-",
    },
    {
      title: "Phản hồi",
      dataIndex: "messageResponse",
      key: "messageResponse",
      render: (v: string) => v || "-",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => new Date(v).toLocaleString("vi-VN"),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title={`Chi tiết đơn hàng #${order.id.slice(-8)}`}
        subtitle="Thông tin chi tiết và lịch sử xử lý"
        extra={
          <Link href={Routes.ADMIN.ORDERS}>
            <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
          </Link>
        }
      />

      <Card style={{ marginBottom: 24, borderRadius: 12 }} title="Thông tin chung">
        <Descriptions bordered column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="ID đơn hàng">{order.id}</Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{order.user?.username}</Descriptions.Item>
          <Descriptions.Item label="Dịch vụ">{order.service?.name}</Descriptions.Item>
          <Descriptions.Item label="Số lượng">{order.quantity}</Descriptions.Item>
          <Descriptions.Item label="CCG">{order.ccg ? "Có" : "Không"}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={ORDER_STATUS_COLORS[order.status as OrderStatus]}>
              {ORDER_STATUS_LABELS[order.status as OrderStatus]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung/Ghi chú" span={2}>
            {order.message || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ borderRadius: 12 }} title="Danh sách chi tiết (Order Details)">
        <Table
          dataSource={order.details || []}
          columns={detailColumns}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>
    </PageContainer>
  )
}
