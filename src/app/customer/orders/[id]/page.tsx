"use client"

import PageHeader from "@/components/common/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus } from "@/constants/orderStatus"
import { Routes } from "@/constants/routes"
import { useCustomerOrderDetail } from "@/hooks/useOrders"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Card, Descriptions, Empty, Spin, Table, Tag } from "antd"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CustomerOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const { data: res, isLoading } = useCustomerOrderDetail(orderId)

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
        subtitle="Thông tin chi tiết xử lý"
        extra={
          <Link href={Routes.CUSTOMER.ORDERS}>
            <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
          </Link>
        }
      />

      <Card style={{ marginBottom: 24, borderRadius: 12 }} title="Thông tin chung">
        <Descriptions bordered column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Dịch vụ">{order.service?.name}</Descriptions.Item>
          <Descriptions.Item label="Số lượng">{order.quantity}</Descriptions.Item>
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

      <Card style={{ borderRadius: 12 }} title="Lịch sử xử lý">
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
