"use client"

import PageHeader from "@/components/common/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import { Routes } from "@/constants/routes"
import { useCreateOrder } from "@/hooks/useOrders"
import { useServices } from "@/hooks/useServices"
import { Button, Card, Form, Input, InputNumber, message, Select, Space, Switch } from "antd"
import { useRouter } from "next/navigation"

export default function CustomerCreateOrderPage() {
  const [form] = Form.useForm()
  const { data: servicesData, isLoading: servicesLoading } = useServices()
  const createOrder = useCreateOrder()
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const services = servicesData?.data || []

  const onFinish = (values: {
    serviceId: string
    quantity: number
    message: string
    ccg: boolean
  }) => {
    createOrder.mutate(
      { ...values, ccg: values.ccg ?? false },
      {
        onSuccess: () => {
          messageApi.success("Tạo đơn hàng thành công!")
          form.resetFields()
          setTimeout(() => router.push(Routes.CUSTOMER.ORDERS), 1500)
        },
        onError: (err: Error) => {
          messageApi.error(err.message || "Tạo đơn hàng thất bại")
        },
      }
    )
  }

  return (
    <PageContainer>
      {contextHolder}
      <PageHeader
        title="Tạo đơn hàng mới"
        subtitle="Điền thông tin bên dưới để tạo đơn hàng"
      />

      <Card style={{ borderRadius: 12, maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ ccg: false, quantity: 1 }}
        >
          <Form.Item
            name="serviceId"
            label="Dịch vụ"
            rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
          >
            <Select
              placeholder="Chọn dịch vụ"
              loading={servicesLoading}
              options={services.map((s: { id: string; code: string; name: string }) => ({
                label: `${s.name} (${s.code})`,
                value: s.id,
              }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} size="large" placeholder="Nhập số lượng" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung tin nhắn"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập nội dung tin nhắn SMS..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="ccg"
            label="CCG"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createOrder.isPending}
                size="large"
              >
                Tạo đơn hàng
              </Button>
              <Button size="large" onClick={() => form.resetFields()}>
                Xóa form
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}
