"use client"

import React from "react"
import { Typography, Breadcrumb } from "antd"

const { Title } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export default function PageHeader({ title, subtitle, extra, breadcrumbs }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      {breadcrumbs && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumbs.map((b) => ({ title: b.href ? <a href={b.href}>{b.label}</a> : b.label }))}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
              {subtitle}
            </Typography.Text>
          )}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  )
}
