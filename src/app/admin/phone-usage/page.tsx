/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import {
  Table,
  Button,
  Input,
  Space,
  Upload,
  message,
  Card,
  Typography,
} from "antd"
import {
  UploadOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost } from "@/utils/apiClient"
import { Routes } from "@/constants/routes"
import PageHeader from "@/components/common/PageHeader"
import PageContainer from "@/components/layout/PageContainer"
import ExcelJS from "exceljs"

const { Text } = Typography

interface PhoneUsage {
  id: string
  phoneNumber: string
  serviceId: string
  createdAt: string
  service: {
    code: string
    name: string
  }
}

interface PhoneUsageResponse {
  success: boolean
  data: {
    items: PhoneUsage[]
    pagination: {
      total: number
      page: number
      pageSize: number
    }
  }
}

export default function PhoneUsagePage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")
  const [uploading, setUploading] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["phone-usage", page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
      })
      const response = await apiGet<PhoneUsageResponse>(`${Routes.API.ADMIN.PHONE_USAGE}?${params}`)
      return response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: (items: any[]) => apiPost(Routes.API.ADMIN.PHONE_USAGE, { items }),
    onSuccess: (res: any) => {
      message.success(`Đã upload thành công ${res.data.count} bản ghi`)
      queryClient.invalidateQueries({ queryKey: ["phone-usage"] })
    },
    onError: (err: any) => {
      message.error(err.message || "Lỗi khi upload dữ liệu")
    },
    onSettled: () => setUploading(false),
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)
      
      const worksheet = workbook.getWorksheet(1)
      const items: any[] = []

      if (!worksheet) throw new Error("File không có dữ liệu")

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return // Skip header
        
        const phoneNumber = row.getCell(1).value?.toString().trim()
        const serviceCode = row.getCell(2).value?.toString().trim()

        if (phoneNumber && serviceCode) {
          items.push({ phoneNumber, serviceCode })
        }
      })

      if (items.length === 0) {
        message.warning("Không tìm thấy dữ liệu hợp lệ trong file")
        setUploading(false)
        return false
      }

      uploadMutation.mutate(items)
    } catch (error) {
      console.error("Parse error:", error)
      message.error("Lỗi khi đọc file. Vui lòng đảm bảo file đúng định dạng (Cột 1: phone, Cột 2: service code)")
      setUploading(false)
    }
    return false // Prevent antd default upload
  }

  const columns = [
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Mã dịch vụ",
      dataIndex: ["service", "code"],
      key: "serviceCode",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: ["service", "name"],
      key: "serviceName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Quản lý Phone Usage"
        subtitle="Quản lý danh sách số điện thoại đã sử dụng dịch vụ"
        extra={[
          <Button key="refresh" icon={<ReloadOutlined />} onClick={() => refetch()}>
            Làm mới
          </Button>,
          <Upload
            key="upload"
            accept=".xlsx, .xls"
            showUploadList={false}
            beforeUpload={handleFileUpload}
            disabled={uploading}
          >
            <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
              Upload File
            </Button>
          </Upload>,
        ]}
      />

      <Card>
        <Space orientation="vertical" style={{ width: "100%" }} size="large">
          <Input.Search
            placeholder="Tìm theo số điện thoại hoặc mã dịch vụ..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />

          <Table
            columns={columns}
            dataSource={data?.items || []}
            loading={isLoading}
            rowKey="id"
            pagination={{
              current: page,
              pageSize: pageSize,
              total: data?.pagination?.total || 0,
              showSizeChanger: true,
              onChange: (p, ps) => {
                setPage(p)
                setPageSize(ps)
              },
            }}
          />
          
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              * Ghi chú: File upload cần có 2 cột (Cột 1: phone, Cột 2: service code). Header dòng 1 sẽ bị bỏ qua.
            </Text>
          </div>
        </Space>
      </Card>
    </PageContainer>
  )
}
