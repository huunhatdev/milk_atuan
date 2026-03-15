# PROJECT_ARCHITECTURE.md

**SIM Service Management System**

Stack:

* **Next.js (latest - App Router)**
* **Ant Design**
* **MongoDB**
* **Prisma ORM**
* **Zustand (state management)**
* **Cookie-based Auth (Access Token + Refresh Token)**

Goal:
Allow AI agents (Antigravity) to generate **90% production-ready code automatically**.

---

# 1. System Architecture

High level architecture

```
Client (Next.js + Ant Design)
        |
        | HTTP API
        |
Next.js Server (App Router API)
        |
        | Service Layer
        |
MongoDB (Prisma)
```

Additional background processing (future):

```
Phone Checking Worker
SMS Sending Worker
```

---

# 2. Project Folder Structure

Production-ready structure.

```
src
│
├ app
│   ├ admin
│   │   ├ dashboard
│   │   ├ users
│   │   ├ services
│   │   ├ orders
│   │   └ reports
│   │
│   ├ customer
│   │   ├ dashboard
│   │   ├ orders
│   │   └ create-order
│   │
│   ├ api
│   │   ├ auth
│   │   │   ├ login
│   │   │   ├ refresh
│   │   │   └ logout
│   │   │
│   │   ├ orders
│   │   ├ services
│   │   └ admin
│   │       ├ orders
│   │       ├ check-phones
│   │       └ export-orders
│   │
│   ├ layout.tsx
│   └ page.tsx
│
├ components
│   ├ layout
│   ├ tables
│   ├ forms
│   └ common
│
├ hooks
│
├ store
│   ├ authStore.ts
│   └ uiStore.ts
│
├ services
│   ├ authService.ts
│   ├ orderService.ts
│   ├ userService.ts
│   └ serviceService.ts
│
├ constants
│
├ dto
│
├ utils
│
├ lib
│   ├ prisma.ts
│   └ cookies.ts
│
└ prisma
    └ schema.prisma
```

---

# 3. Authentication Architecture

Authentication uses:

* **Access Token (short-lived)**
* **Refresh Token (long-lived)**

Stored in **cookies**.

```
Browser
  | 
  | accessToken cookie
  | refreshToken cookie
  |
Next.js API
```

---

# 4. Token Strategy

### Access Token

* lifetime: **15 minutes**
* stored in **cookie**
* used for API authorization

---

### Refresh Token

* lifetime: **7 days**
* stored in **httpOnly cookie**

---

# 5. Cookie Structure

Cookies set after login.

```
access_token
refresh_token
```

Example:

```
Set-Cookie: access_token=xxxxx
Set-Cookie: refresh_token=xxxxx; HttpOnly
```

---

# 6. Auth Flow

Login Flow

```
User Login
   |
   | POST /api/auth/login
   |
Server validates user
   |
Generate accessToken
Generate refreshToken
   |
Return cookies
```

---

### Token Refresh Flow

```
Client request API
     |
accessToken expired
     |
Call /api/auth/refresh
     |
Server validates refreshToken
     |
Generate new accessToken
```

---

# 7. Zustand Store

Zustand replaces Redux Toolkit.

Used for:

* user session
* UI state
* authentication state

Folder

```
src/store
```

---

# 8. Auth Store

File

```
store/authStore.ts
```

Example

```ts
import { create } from "zustand"

interface AuthState {
  user: any | null
  role: "ADMIN" | "CUSTOMER" | null

  setUser: (user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,

  setUser: (user) =>
    set({
      user,
      role: user.role
    }),

  logout: () =>
    set({
      user: null,
      role: null
    })
}))
```

---

# 9. Fetch Wrapper (Auto Refresh Token)

Create centralized API client.

File

```
utils/apiClient.ts
```

Example

```ts
export async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include"
  })

  if (res.status === 401) {
    await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include"
    })

    return fetch(url, {
      ...options,
      credentials: "include"
    })
  }

  return res
}
```

---

# 10. Prisma MongoDB Schema Strategy

Important rules.

Use **ObjectId**

```
@db.ObjectId
```

Example

```
id String @id @default(auto()) @map("_id") @db.ObjectId
```

---

# 11. Index Strategy

Critical indexes.

### PhoneUsage

```
(phoneNumber, serviceId) UNIQUE
```

Prevents duplicate usage.

---

### Orders

Indexes

```
userId
status
serviceId
createdAt
```

Used for:

* dashboard
* filtering

---

### OrderDetail

Indexes

```
orderId
phoneNumber
sourceTag
```

---

# 12. Phone Check Optimization

Checking phone usage must be fast.

Algorithm

```
Input phones list
      |
Query PhoneUsage
      |
Find used phones
      |
Return used + unused
```

Mongo query:

```
phoneNumber IN phones[]
AND serviceId
```

Index ensures **O(log N)** lookup.

---

# 13. Admin Order Processing Flow

```
Customer creates order
      |
Status = PENDING
      |
Admin uploads phone list
      |
System checks usage
      |
Return used phones
      |
Admin sends SMS
      |
Save success to OrderDetail
      |
Update PhoneUsage
      |
Status = COMPLETED
```

---

# 14. Reusable UI Component Strategy

Never repeat UI code.

Create reusable components.

Examples

```
components/common/DataTable.tsx
components/common/PageHeader.tsx
components/common/ConfirmButton.tsx
```

---

# 15. Table Component Pattern

Generic table wrapper.

```
<DataTable
  columns={columns}
  dataSource={orders}
  loading={loading}
/>
```

Features:

* pagination
* loading
* filters

---

# 16. Form Component Pattern

Reusable forms.

Example

```
OrderForm.tsx
UserForm.tsx
ServiceForm.tsx
```

Use AntD:

```
Form
Input
Select
Switch
InputNumber
```

---

# 17. Clean Code Rules

Mandatory rules.

---

### Rule 1

Max file length

```
300 lines
```

---

### Rule 2

Separate layers

```
UI
Hooks
Services
Database
```

---

### Rule 3

No database queries inside components.

---

### Rule 4

No business logic inside API route.

API route → Service layer.

---

# 18. DTO Validation

Use **Zod**.

Example

```
dto/createOrder.dto.ts
```

Example schema

```
z.object({
 serviceId: z.string(),
 quantity: z.number(),
 message: z.string(),
 ccg: z.boolean()
})
```

---

# 19. Export Orders Architecture

Admin exports orders.

```
Admin UI
   |
GET /api/admin/export-orders
   |
Query DB
   |
Generate CSV
   |
Return file
```

Libraries

```
json2csv
exceljs
```

---

# 20. Worker Architecture (Future)

For large SMS volume.

```
Order
  |
Queue
  |
SMS Worker
  |
Send SMS
```

Possible queue systems:

```
Redis + BullMQ
RabbitMQ
```

---

# 21. Security Rules

Mandatory rules.

### Password

Use

```
bcrypt
```

---

### Rate Limit

Protect login endpoint.

---

### Input Validation

All APIs must validate input using DTO.

---

# 22. Development Workflow (AI Agent)

Antigravity AI should generate code in this order.

Step 1

```
Next.js project
Ant Design
Prisma
MongoDB
```

---

Step 2

Create

```
constants
enums
dto
utils
```

---

Step 3

Create Prisma schema.

---

Step 4

Create services layer.

---

Step 5

Create API routes.

---

Step 6

Create Zustand store.

---

Step 7

Create UI components.

---

Step 8

Create pages.

---

# Result

With this architecture, AI agents can generate:

* production-grade **Next.js project**
* scalable **MongoDB schema**
* secure **cookie authentication**
* clean **Zustand state management**
* reusable **Ant Design UI**
* optimized **phone checking system**
* maintainable **service-layer architecture**
