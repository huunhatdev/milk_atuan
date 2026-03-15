"use client"

import { Card, Typography, Divider, Collapse, Tag, Space, Alert } from "antd"
import { CopyOutlined, KeyOutlined, ApiOutlined, FileTextOutlined } from "@ant-design/icons"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/common/PageHeader"

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const CodeBlock = ({ code }: { code: string; language?: string }) => (
  <div style={{ position: "relative", marginBottom: 16 }}>
    <pre style={{ 
      background: "#1e1e1e", 
      color: "#d4d4d4", 
      padding: "16px", 
      borderRadius: "8px",
      overflowX: "auto",
      fontSize: "14px",
      fontFamily: "'Fira Code', 'Courier New', monospace"
    }}>
      <code>{code}</code>
    </pre>
    <div 
      onClick={() => copyToClipboard(code)}
      style={{ 
        position: "absolute", 
        top: 8, 
        right: 8, 
        color: "#fff", 
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "4px",
        background: "rgba(255,255,255,0.1)"
      }}
    >
      <CopyOutlined /> Copy
    </div>
  </div>
)

export default function AdminApiDocsPage() {
  const adminKey = "milk_admin_secret_token_2026"

  return (
    <PageContainer>
      <PageHeader 
        title="Tài liệu API (Admin)" 
        subtitle="Hướng dẫn tích hợp các API dành cho hệ thống bên thứ 3" 
      />

      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Title level={4}><KeyOutlined /> Xác thực (Authentication)</Title>
        <Paragraph>
          Tất cả các API yêu cầu xác thực qua Header <Text code>Header-Authorization</Text>.
        </Paragraph>
        <Alert
          message="Header Configuration"
          description={
            <Space orientation="vertical">
              <Text>Key: <Text strong>Header-Authorization</Text></Text>
              <Text>Value: <Text code>Bearer {adminKey}</Text></Text>
            </Space>
          }
          type="info"
          showIcon
          icon={<KeyOutlined />}
        />
      </Card>

      <Collapse defaultActiveKey={['1', '2']} expandIconPosition="end" ghost>
        <Panel 
          header={<Title level={5} style={{ margin: 0 }}><ApiOutlined /> 1. Check Phone Usage API</Title>} 
          key="1"
          style={{ background: "#fff", borderRadius: 12, marginBottom: 16, padding: "0 12px" }}
        >
          <Paragraph>Kiểm tra danh sách số điện thoại đã sử dụng dịch vụ hay chưa.</Paragraph>
          <Divider orientation="vertical"><Tag color="blue">POST</Tag> <Text code>/api/admin/check-phones</Text></Divider>
          
          <Title level={5}>Request Body</Title>
          <CodeBlock code={JSON.stringify({
  serviceCode: "VINAMILK",
  phones: ["0912345678", "0987654321"]
}, null, 2)} />

          <Title level={5}>Example cURL</Title>
          <CodeBlock code={`curl -X POST http://localhost:3000/api/admin/check-phones \\
  -H "Header-Authorization: Bearer ${adminKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "serviceCode": "VINAMILK",
    "phones": ["0912345678", "0987654321"]
  }'`} />

          <Title level={5}>Response Sample</Title>
          <CodeBlock code={JSON.stringify({
  success: true,
  data: {
    used: ["0912345678"],
    unused: ["0987654321"]
  }
}, null, 2)} />
        </Panel>

        <Panel 
          header={<Title level={5} style={{ margin: 0 }}><FileTextOutlined /> 2. Post Order Success API</Title>} 
          key="2"
          style={{ background: "#fff", borderRadius: 12, marginBottom: 16, padding: "0 12px" }}
        >
          <Paragraph>Cập nhật kết quả xử lý thành công cho một đơn hàng.</Paragraph>
          <Divider orientation="vertical"><Tag color="green">POST</Tag> <Text code>/api/admin/order-success</Text></Divider>
          
          <Title level={5}>Request Body</Title>
          <CodeBlock code={JSON.stringify({
  orderId: "order_id_here",
  phoneNumber: "0912345678",
  code: "123456",
  sourceTag: "Tên đại lý hoặc bỏ trống. vd: 'ASON'",
  messageResponse: "Mã OTP là 123456"
}, null, 2)} />

          <Title level={5}>Example cURL</Title>
          <CodeBlock code={`curl -X POST http://localhost:3000/api/admin/order-success \\
  -H "Header-Authorization: Bearer ${adminKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": "order_id_here",
    "phoneNumber": "0912345678",
    "code": "123456",
    "sourceTag": "TAG_NAME",
    "messageResponse": "Success Message"
  }'`} />

          <Title level={5}>Response Sample</Title>
          <CodeBlock code={JSON.stringify({
  success: true,
  data: null
}, null, 2)} />

          <Title level={5}>Error Samples</Title>
          <Paragraph>Lỗi Validation (400):</Paragraph>
          <CodeBlock code={JSON.stringify({
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "orderId is required"
  }
}, null, 2)} />
          
          <Paragraph>Lỗi Nghiệp vụ (500):</Paragraph>
          <CodeBlock code={JSON.stringify({
  success: false,
  error: {
    code: "INTERNAL_ERROR",
    message: "Số điện thoại này đã sử dụng dịch vụ này rồi"
  }
}, null, 2)} />
        </Panel>
      </Collapse>
    </PageContainer>
  )
}
