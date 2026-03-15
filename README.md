# SIM Service Management System — Walkthrough

Hệ thống quản lý SIM Service đã được tạo hoàn chỉnh trong folder `code/`. Dưới đây là tổng hợp những gì đã được implement.

## 1. Cấu trúc project

```
code/
├── .env                          ← ⚠️ Cần điền DATABASE_URL
├── prisma/
│   └── schema.prisma             ← Schema đầy đủ: User, Service, etc.
└── src/
    ├── app/
    │   ├── page.tsx              ← Redirect → /login
    │   ├── login/page.tsx        ← Trang đăng nhập
    │   ├── admin/
    │   │   ├── dashboard/        ← Dashboard tổng quan
    │   │   ├── users/            ← Quản lý users + assign service
    │   │   ├── services/         ← Quản lý dịch vụ
    │   │   ├── orders/           ← Xem/xử lý đơn hàng
    │   │   └── reports/          ← Xuất CSV
    │   ├── customer/
    │   │   ├── dashboard/        ← Dashboard khách hàng
    │   │   ├── orders/           ← Đơn hàng của tôi
    │   │   └── create-order/     ← Tạo đơn hàng
    │   └── api/
    │       ├── auth/(login|logout|refresh)
    │       ├── orders/(route|[id])
    │       ├── services/
    │       └── admin/(orders|check-phones|order-success|export-orders|users|services)
    ├── constants/                ← roles, orderStatus, errorCodes, routes
    ├── components/
    │   ├── layout/               ← Sidebar, PageContainer
    │   ├── common/               ← PageHeader, DataTable
    │   └── providers/            ← AntdProvider, ReactQueryProvider
    ├── dto/                      ← Zod schemas (login, createOrder, checkPhones)
    ├── hooks/                    ← useOrders, useServices, useUsers
    ├── lib/                      ← prisma.ts, auth.ts, cookies.ts, apiAuth.ts
    ├── services/                 ← authService, orderService, userService, serviceService, phoneService
    ├── store/                    ← authStore (Zustand + persist), uiStore
    ├── utils/                    ← apiClient, formatDate, normalizePhone
    └── middleware.ts             ← RBAC route protection
```

## 2. Bước cần làm sau khi nhận code

> [!IMPORTANT]
> **Bắt buộc phải làm trước khi chạy project**

### Bước 1: Cập nhật [.env](file:///d:/workplace/nhat/milk/code/.env)

Mở file [.env](file:///d:/workplace/nhat/milk/code/.env) và thay thế MongoDB URL:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/sim-service?retryWrites=true&w=majority"
```

### Bước 2: Generate Prisma Client

```bash
cd d:\workplace\nhat\milk\code
npx prisma generate
```

### Bước 3: Chạy dev server

```bash
npm run dev
```

Truy cập: **http://localhost:3000** → tự redirect về `/login`

### Bước 4: Tạo admin đầu tiên

Dùng Prisma Studio hoặc MongoDB Compass để tạo user admin đầu tiên với role `ADMIN` và password đã hash bằng bcrypt.

```bash
npx prisma studio
```

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| UI | Ant Design + @ant-design/nextjs-registry |
| State | Zustand (persist) |
| Data Fetching | TanStack Query v5 |
| Validation | Zod |
| Database | MongoDB |
| ORM | Prisma |
| Auth | JWT cookies (access 15m + refresh 7d) |
| Password | bcryptjs |

## 4. API Summary

| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/login` | Public | Đăng nhập |
| POST | `/api/auth/logout` | Auth | Đăng xuất |
| POST | `/api/auth/refresh` | Public | Làm mới token |
| GET | `/api/services` | Customer | Dịch vụ của user |
| GET/POST | `/api/orders` | Customer | List/Tạo đơn hàng |
| GET | `/api/orders/[id]` | Customer | Chi tiết đơn hàng |
| GET/PATCH | `/api/admin/orders` | Admin | Quản lý đơn hàng |
| POST | `/api/admin/check-phones` | Admin | Kiểm tra phone đã dùng |
| POST | `/api/admin/order-success` | Admin | Lưu kết quả gửi SMS |
| GET | `/api/admin/export-orders` | Admin | Xuất CSV |
| GET/POST | `/api/admin/users` | Admin | Quản lý users |
| GET/POST | `/api/admin/services` | Admin | Quản lý services |
