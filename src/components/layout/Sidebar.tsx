"use client"

import React from "react"
import { Layout, Menu, Button, Typography, Avatar, Drawer, Grid, Tag } from "antd"
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  MenuOutlined,
  FileTextOutlined,
  PhoneOutlined,
} from "@ant-design/icons"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useUiStore } from "@/store/uiStore"
import { Routes } from "@/constants/routes"
import { Role } from "@/constants/roles"
import { apiPost } from "@/utils/apiClient"

const { Sider } = Layout
const { Text, Title } = Typography
const { useBreakpoint } = Grid

const adminMenuItems = [
  { key: Routes.ADMIN.DASHBOARD, icon: <DashboardOutlined />, label: "Dashboard" },
  { key: Routes.ADMIN.USERS, icon: <UserOutlined />, label: "Người dùng" },
  { key: Routes.ADMIN.SERVICES, icon: <AppstoreOutlined />, label: "Dịch vụ" },
  { key: Routes.ADMIN.ORDERS, icon: <OrderedListOutlined />, label: "Đơn hàng" },
  { key: Routes.ADMIN.REPORTS, icon: <BarChartOutlined />, label: "Báo cáo" },
  { key: Routes.ADMIN.PHONE_USAGE, icon: <PhoneOutlined />, label: "Phone Usage" },
  { key: Routes.ADMIN.API_DOCS, icon: <FileTextOutlined />, label: "Tài liệu API" },
]

const customerMenuItems = [
  { key: Routes.CUSTOMER.DASHBOARD, icon: <DashboardOutlined />, label: "Dashboard" },
  { key: Routes.CUSTOMER.CREATE_ORDER, icon: <PlusCircleOutlined />, label: "Tạo đơn hàng" },
  { key: Routes.CUSTOMER.ORDERS, icon: <ShoppingOutlined />, label: "Đơn hàng của tôi" },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, role, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const screens = useBreakpoint()

  const isMobile = !screens.md
  const menuItems = role === Role.ADMIN ? adminMenuItems : customerMenuItems

  const handleLogout = async () => {
    await apiPost(Routes.API.AUTH.LOGOUT, {})
    logout()
    router.push(Routes.LOGIN)
  }

  const siderBackground = "#ffffff"
  const borderColor = "#f0f0f0"

  const MenuContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "12px 0", borderRight: `1px solid ${borderColor}` }}>
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarCollapsed && !isMobile ? "center" : "flex-start",
          padding: "0 24px",
          marginBottom: 16,
        }}
      >
        <div style={{ 
          width: 36, 
          height: 36, 
          background: "linear-gradient(135deg, #4da1ff 0%, #4dffd2 100%)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(77, 161, 255, 0.2)"
        }}>
          <ShoppingOutlined style={{ color: "white", fontSize: 20 }} />
        </div>
        {(!sidebarCollapsed || isMobile) && (
          <Title level={5} style={{ color: "#262626", margin: "0 0 0 12px", whiteSpace: "nowrap", fontWeight: 600 }}>
            SIM Manager
          </Title>
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="light"
        selectedKeys={[pathname]}
        mode="inline"
        items={menuItems}
        onClick={({ key }) => {
          router.push(key)
          if (isMobile) toggleSidebar()
        }}
        style={{ 
          flex: 1, 
          borderRight: 0, 
          background: "transparent",
          padding: "0 12px"
        }}
        inlineIndent={12}
      />

      {/* User info + Logout */}
      <div
        style={{
          padding: "16px",
          margin: "0 12px",
          borderRadius: 16,
          background: "#f9f9f9",
          border: "1px solid #f0f0f0",
        }}
      >
        {(!sidebarCollapsed || isMobile) ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Avatar 
              size="large" 
              icon={<UserOutlined />} 
              style={{ 
                background: "linear-gradient(135deg, #4da1ff 0%, #4db5ff 100%)",
                boxShadow: "0 2px 8px rgba(77, 161, 255, 0.1)"
              }} 
            />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Text strong style={{ color: "#262626", display: "block", fontSize: 14 }}>
                {user?.username}
              </Text>
              <Tag variant="filled" color="blue" style={{ fontSize: 10, lineHeight: "16px", height: 16, marginTop: 4 }}>
                {role}
              </Tag>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Avatar 
              size="default" 
              icon={<UserOutlined />} 
              style={{ background: "linear-gradient(135deg, #4da1ff 0%, #4db5ff 100%)" }} 
            />
          </div>
        )}
        
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          style={{ 
            height: 38, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: sidebarCollapsed && !isMobile ? "center" : "flex-start",
            padding: sidebarCollapsed && !isMobile ? 0 : "0 12px",
            borderRadius: 8,
            fontSize: 13
          }}
        >
          {(!sidebarCollapsed || isMobile) && "Đăng xuất"}
        </Button>
      </div>

      {/* Toggle button for Desktop */}
      {!isMobile && (
        <div style={{ 
          padding: "12px 0", 
          display: "flex", 
          justifyContent: "center",
          borderTop: `1px solid ${borderColor}`,
          marginTop: 8
        }}>
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ 
              color: "#8c8c8c", 
              width: 40, 
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          />
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 101,
            boxShadow: "0 4px 12px rgba(77, 161, 255, 0.3)",
            height: 40,
            width: 40,
            borderRadius: 12,
            background: "#1677ff"
          }}
        />
        <Drawer
          placement="left"
          onClose={toggleSidebar}
          open={!sidebarCollapsed}
          styles={{ 
            body: { padding: 0, background: "#ffffff" },
            header: { display: "none" }
          }}
          size="large"
          closable={false}
        >
          {MenuContent}
        </Drawer>
      </>
    )
  }

  return (
    <Sider
      collapsible
      trigger={null}
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={240}
      style={{
        background: siderBackground,
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)"
      }}
    >
      {MenuContent}
    </Sider>
  )
}
