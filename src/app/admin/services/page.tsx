"use client"

import { useState } from "react"
import { Button, Modal, Form, Input, Space, message, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useAdminServices } from "@/hooks/useServices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/utils/apiClient"
import { Routes } from "@/constants/routes"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/common/PageHeader"
import DataTable from "@/components/common/DataTable"
import type { ColumnsType } from "antd/es/table"

interface Service {
  id: string
  code: string
  name: string
  createdAt: string
}

export default function AdminServicesPage() {
  const { data, isLoading } = useAdminServices()
  const [modal, setModal] = useState(false)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()

  const services = data?.data?.items || []

  const createService = useMutation({
    mutationFn: (values: { code: string; name: string }) =>
      apiPost(Routes.API.ADMIN.SERVICES, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] })
      messageApi.success("Tạo dịch vụ thành công")
      setModal(false)
      form.resetFields()
    },
    onError: (err: Error) => messageApi.error(err.message),
  })

  const columns: ColumnsType<Service> = [
    {
      title: "Mã dịch vụ",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleDateString("vi-VN"),
    },
  ]

  return (
    <PageContainer>
      {contextHolder}
      <PageHeader
        title="Quản lý dịch vụ"
        subtitle="Danh sách các dịch vụ SMS"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal(true)}>
            Thêm dịch vụ
          </Button>
        }
      />

      <DataTable<Service>
        columns={columns}
        dataSource={services as Service[]}
        loading={isLoading}
        rowKey="id"
      />

      <Modal title="Thêm dịch vụ mới" open={modal} onCancel={() => setModal(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={(v) => createService.mutate(v)}>
          <Form.Item name="code" label="Mã dịch vụ" rules={[{ required: true }]}>
            <Input placeholder="VD: SMS_OTP" />
          </Form.Item>
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true }]}>
            <Input placeholder="VD: Gửi OTP qua SMS" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={createService.isPending}>Tạo</Button>
              <Button onClick={() => setModal(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
