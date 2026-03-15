"use client"

import React from "react"
import { Table, TableProps } from "antd"

interface DataTableProps<T> extends TableProps<T> {
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number, pageSize: number) => void
}

export default function DataTable<T extends object>({
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <Table
      {...tableProps}
      loading={loading}
      pagination={
        total !== undefined
          ? {
              current: page,
              pageSize: pageSize,
              total: total,
              onChange: onPageChange,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bản ghi`,
            }
          : false
      }
      scroll={{ x: "max-content" }}
    />
  )
}
