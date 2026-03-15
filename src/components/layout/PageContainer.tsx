"use client"

import React from "react"
import { Layout, Grid } from "antd"
import Sidebar from "./Sidebar"
import { useUiStore } from "@/store/uiStore"

const { Content } = Layout
const { useBreakpoint } = Grid

interface PageContainerProps {
  children: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  const { sidebarCollapsed } = useUiStore()
  const screens = useBreakpoint()

  const isMobile = !screens.md
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 80 : 240

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.2s",
          background: "#f5f5f5",
        }}
      >
        <Content
          style={{
            margin: isMobile ? "64px 0 0 0" : "24px 16px",
            padding: isMobile ? 12 : 24,
            minHeight: isMobile ? "calc(100vh - 64px)" : "calc(100vh - 48px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
