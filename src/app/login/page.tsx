"use client"

import { useState } from "react"
import { Form, Input, Button, Card, Typography, message, Space } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useAuthStore } from "@/store/authStore"
import { Routes } from "@/constants/routes"
import { Role } from "@/constants/roles"
import { apiPost } from "@/utils/apiClient"

const { Title, Text } = Typography

interface LoginResponse {
  success: boolean
  data: {
    user: { id: string; username: string; role: Role }
  }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const res = await apiPost<LoginResponse>(Routes.API.AUTH.LOGIN, values)
      if (res.success) {
        setUser(res.data.user)
        if (res.data.user.role === Role.ADMIN) {
          window.location.href = Routes.ADMIN.DASHBOARD
        } else {
          window.location.href = Routes.CUSTOMER.DASHBOARD
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại"
      messageApi.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {contextHolder}
      <Card
        style={{
          width: "90%",
          maxWidth: 400,
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <Space orientation="vertical" size={24} style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
              SIM Service Manager
            </Title>
            <Text type="secondary">Đăng nhập vào hệ thống</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập" },
                { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="admin" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}
