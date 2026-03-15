"use client"

import DataTable from "@/components/common/DataTable"
import PageHeader from "@/components/common/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import { Role } from "@/constants/roles"
import { useAdminServices } from "@/hooks/useServices"
import { useCreateUser, useUpdateUser, useUsers } from "@/hooks/useUsers"
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Modal, Select, Space, Switch, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import { useState } from "react"

interface UserRecord {
  id: string
  username: string
  role: string
  isActive: boolean
  createdAt: string
  userServices: { service: { id: string; code: string; name: string } }[]
}

export default function AdminUsersPage() {
  const { data: usersData, isLoading } = useUsers()
  const { data: servicesData } = useAdminServices()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const [createModal, setCreateModal] = useState(false)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const users: UserRecord[] = usersData?.data?.items || []
  const services = servicesData?.data?.items || []

  const columns: ColumnsType<UserRecord> = [
    { title: "Tên đăng nhập", dataIndex: "username", key: "username" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === Role.ADMIN ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={(checked) => {
            updateUser.mutate(
              { userId: record.id, isActive: checked },
              {
                onSuccess: () => messageApi.success(`Đã ${checked ? "mở khóa" : "khóa"} người dùng`),
                onError: () => messageApi.error("Lỗi khi cập nhật trạng thái"),
              }
            )
          }}
        />
      ),
    },
    {
      title: "Dịch vụ được phân công",
      key: "services",
      render: (_, record) => {
        const currentUserServiceIds = record.userServices.map(us => us.service.id);
        return (
          <Select
            mode="multiple"
            placeholder="Chọn dịch vụ"
            style={{ minWidth: 200 }}
            value={currentUserServiceIds}
            onChange={(serviceIds) => {
              updateUser.mutate(
                { userId: record.id, serviceIds },
                {
                  onSuccess: () => messageApi.success("Đã cập nhật danh sách dịch vụ"),
                  onError: () => messageApi.error("Lỗi khi cập nhật dịch vụ"),
                }
              )
            }}
            options={services.map((s) => ({ label: s.name, value: s.id }))}
          />
        );
      },
    }
  ]

  const handleCreate = async (values: { username: string; password: string }) => {
    createUser.mutate(
      { ...values, role: Role.CUSTOMER },
      {
        onSuccess: () => {
          messageApi.success("Tạo người dùng thành công")
          setCreateModal(false)
          form.resetFields()
        },
        onError: (err) => messageApi.error(err.message),
      }
    )
  }

  return (
    <PageContainer>
      {contextHolder}
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Danh sách khách hàng và phân quyền dịch vụ"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModal(true)}>
            Tạo người dùng
          </Button>
        }
      />

      <DataTable<UserRecord>
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title="Tạo người dùng mới"
        open={createModal}
        onCancel={() => setCreateModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, min: 3 }]}>
            <Input prefix={<UserAddOutlined />} placeholder="customer123" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={createUser.isPending}>
                Tạo
              </Button>
              <Button onClick={() => setCreateModal(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
