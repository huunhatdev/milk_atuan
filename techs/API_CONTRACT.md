# API_CONTRACT & CODING_RULES

**SIM Service Management System**
Next.js + Ant Design + MongoDB + Prisma

This document defines:

* API contract
* Response format
* Error format
* RBAC rules
* Export format
* Clean code rules
* Component reuse rules
* Constants & enums structure
* Coding rules for **Antigravity AI agent**

The goal is to ensure AI-generated code is **clean, scalable, and maintainable**.

---

# 1. Global API Response Format

All APIs must return a standardized response.

### Success Response

```ts
{
  success: true,
  data: {},
  message?: string
}
```

Example:

```ts
{
  success: true,
  data: {
    id: "order_id",
    status: "PENDING"
  }
}
```

---

### Error Response

```ts
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Readable error message"
  }
}
```

Example:

```ts
{
  success: false,
  error: {
    code: "SERVICE_NOT_ALLOWED",
    message: "User is not allowed to use this service"
  }
}
```

---

# 2. Pagination Standard

List APIs must support pagination.

Query params:

```ts
?page=1
&pageSize=20
```

Response:

```ts
{
  success: true,
  data: {
    items: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 120
    }
  }
}
```

---

# 3. API Contract

## 3.1 Login

POST `/api/auth/login`

Request

```ts
{
  email: string
  password: string
}
```

Response

```ts
{
  success: true,
  data: {
    token: string,
    role: "ADMIN" | "CUSTOMER"
  }
}
```

---

# 3.2 Get Allowed Services

GET `/api/services`

Customer receives only assigned services.

Response

```ts
{
  success: true,
  data: [
    {
      id: string,
      code: string,
      name: string
    }
  ]
}
```

---

# 3.3 Create Order

POST `/api/orders`

Request

```ts
{
  serviceId: string,
  quantity: number,
  message: string,
  ccg: boolean
}
```

Response

```ts
{
  success: true,
  data: {
    id: string,
    status: "PENDING"
  }
}
```

Validation:

* service must belong to user
* quantity > 0

---

# 3.4 Get Orders

GET `/api/orders`

Query

```ts
?page
&pageSize
&status
```

Response

```ts
{
  success: true,
  data: {
    items: [],
    pagination: {}
  }
}
```

---

# 3.5 Admin Check Phones

POST `/api/admin/check-phones`

Request

```ts
{
  serviceId: string,
  phones: string[]
}
```

Response

```ts
{
  success: true,
  data: {
    used: string[],
    unused: string[]
  }
}
```

---

# 3.6 Save Send Result

POST `/api/admin/order-success`

Request

```ts
{
  orderId: string,
  serviceId: string,
  phoneNumber: string,
  sourceTag?: string,
  code?: string,
  messageResponse?: string
}
```

---

# 3.7 Export Orders

GET `/api/admin/export-orders`

Query

```ts
?status=PENDING
?status=PROCESSING
?status=COMPLETED
```

Return

CSV or Excel file.

Fields:

```ts
orderId
customerEmail
serviceCode
quantity
status
createdAt
```

---

# 4. RBAC Rules

Role Guard must protect routes.

### ADMIN

Allowed:

```
/admin/*
/api/admin/*
```

---

### CUSTOMER

Allowed:

```
/customer/*
/api/orders
/api/services
```

---

# 5. Error Codes

Create centralized error codes.

Example:

```ts
SERVICE_NOT_ALLOWED
ORDER_NOT_FOUND
PHONE_ALREADY_USED
INVALID_PHONE
UNAUTHORIZED
```

File:

```
src/constants/errorCodes.ts
```

---

# 6. Constants & Enums Structure

All constants must be centralized.

Folder:

```
src/constants
```

Example files:

```
roles.ts
orderStatus.ts
errorCodes.ts
routes.ts
```

---

### Role Enum

```ts
export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER"
}
```

---

### Order Status

```ts
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}
```

---

# 7. Clean Code Rules (Antigravity AI)

AI must follow these rules.

---

## Rule 1 — Small Components

Components must not exceed **200 lines**.

Split when needed.

Bad

```
OrderPage.tsx (800 lines)
```

Good

```
OrderTable.tsx
OrderFilters.tsx
OrderActions.tsx
```

---

## Rule 2 — Separate Logic from UI

Do not mix API logic inside UI components.

Use hooks.

Example:

```
hooks/useOrders.ts
hooks/useServices.ts
```

---

## Rule 3 — Reusable Components

Create reusable UI components.

Examples:

```
components/table/DataTable.tsx
components/form/FormInput.tsx
components/layout/PageHeader.tsx
```

---

## Rule 4 — No Hardcoded Values

Never hardcode:

* status
* role
* routes

Use constants.

Bad

```ts
if (user.role === "ADMIN")
```

Good

```ts
if (user.role === Role.ADMIN)
```

---

## Rule 5 — Service Layer

Database logic must be inside services.

Structure:

```
services/orderService.ts
services/userService.ts
services/serviceService.ts
```

API route only calls service.

---

## Rule 6 — DTO Layer

Use DTOs for validation.

Example:

```
dto/createOrder.dto.ts
dto/checkPhones.dto.ts
```

Use **zod** for validation.

---

# 8. Component Structure

```
components
 ├ layout
 │   ├ Sidebar.tsx
 │   ├ Header.tsx
 │   └ PageContainer.tsx
 │
 ├ tables
 │   ├ OrdersTable.tsx
 │   └ UsersTable.tsx
 │
 ├ forms
 │   ├ OrderForm.tsx
 │   └ PhoneCheckForm.tsx
 │
 └ common
     ├ Loading.tsx
     └ EmptyState.tsx
```

---

# 9. Ant Design Rules

Use consistent components.

Forms

```
Form
Input
Select
Switch
InputNumber
```

Tables

```
Table
Tag
Dropdown
Button
```

Layout

```
Layout
Menu
Breadcrumb
```

---

# 10. Hooks Structure

```
hooks
 ├ useAuth.ts
 ├ useOrders.ts
 ├ useServices.ts
 └ useUsers.ts
```

Hooks should handle:

* API calls
* loading
* error
* caching

Using **TanStack Query**.

---

# 11. Utility Functions

Folder:

```
utils
```

Examples:

```
formatDate.ts
normalizePhone.ts
exportCsv.ts
```

---

# 12. Export Logic

Export implemented in backend.

Steps:

1 Query orders by status
2 Transform data
3 Generate CSV
4 Return file

Libraries:

```
json2csv
exceljs
```

---

# 13. AI Agent Coding Workflow

Antigravity AI should generate code in this order:

### Step 1

Setup project

```
Next.js
Ant Design
Prisma
MongoDB
```

---

### Step 2

Create database schema.

---

### Step 3

Create constants and enums.

---

### Step 4

Create services layer.

---

### Step 5

Create API routes.

---

### Step 6

Create reusable components.

---

### Step 7

Create pages.

---

# Result

With these rules Antigravity AI can generate:

* structured Next.js project
* reusable components
* clean service architecture
* standardized APIs
* role-based access
* scalable codebase
* maintainable UI
* clear constants and enums
