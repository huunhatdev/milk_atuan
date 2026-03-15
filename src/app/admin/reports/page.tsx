"use client"

import { useState } from "react"
import { Button, Card, Select, Space, Typography } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/common/PageHeader"
import { OrderStatus, ORDER_STATUS_LABELS } from "@/constants/orderStatus"
import { Routes } from "@/constants/routes"

const { Text } = Typography

export default function AdminReportsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  const handleExport = () => {
    const params = selectedStatus ? `?status=${selectedStatus}` : ""
    window.open(`${Routes.API.ADMIN.EXPORT_ORDERS}${params}`, "_blank")
  }

  return (
    <PageContainer>
      <PageHeader
        title="Báo cáo & Xuất dữ liệu"
        subtitle="Xuất đơn hàng theo trạng thái dưới dạng CSV"
      />

      <Card style={{ borderRadius: 12, maxWidth: 500 }}>
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Text strong>Lọc theo trạng thái</Text>
            <Select
              placeholder="Tất cả trạng thái"
              allowClear
              style={{ width: "100%", marginTop: 8 }}
              options={[
                { label: "Tất cả", value: "" },
                ...Object.values(OrderStatus).map((s) => ({
                  label: ORDER_STATUS_LABELS[s],
                  value: s,
                })),
              ]}
              onChange={(v) => setSelectedStatus(v || "")}
            />
          </div>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={handleExport}
            block
          >
            Xuất CSV
          </Button>

          <Text type="secondary" style={{ fontSize: 12 }}>
            File CSV sẽ chứa: Order ID, Customer Email, Service Code, Quantity, Status, Created At
          </Text>
        </Space>
      </Card>
    </PageContainer>
  )
}
