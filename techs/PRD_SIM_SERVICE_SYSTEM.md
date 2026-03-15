# SIM Service Management System

**Next.js (Latest) + Ant Design + MongoDB + Role-Based Access**

---

# 1. Overview

This system manages **phone numbers used to send messages for services**.

There are two roles:

* **Admin**
* **Customer**

Customers can **create orders** for services they are allowed to use.
Admins manage services, process orders, check phone usage, send messages, and export reports.

Key requirements:

* Customers can only create orders for **services assigned by admin**
* Prevent **duplicate phone usage per service**
* Admin can **export orders by status**
* UI must be **professional and simple using Ant Design**
* **All database tables include `createdAt` and `updatedAt`**

---

# 2. Tech Stack

Frontend + Backend

* Next.js **latest version (App Router)**
* TypeScript

UI

* Ant Design

State

* TanStack Query

Validation

* Zod

Database

* MongoDB

ORM

* Prisma

Auth

* JWT / NextAuth

---

# 3. Folder Structure

```
app/
 ├ admin/
 │   ├ dashboard/
 │   ├ users/
 │   ├ services/
 │   ├ orders/
 │   └ reports/
 │
 ├ customer/
 │   ├ dashboard/
 │   ├ orders/
 │   └ create-order/
 │
 ├ api/
 │   ├ auth/
 │   ├ orders/
 │   ├ services/
 │   ├ users/
 │   └ admin/
 │       ├ check-phones/
 │       └ export-orders/
 │
 ├ layout.tsx
 └ page.tsx

components/
 ├ layout/
 ├ tables/
 ├ forms/
 └ common/

lib/
 ├ prisma.ts
 ├ auth.ts
 └ utils.ts

prisma/
 └ schema.prisma
```

---

# 4. Database Schema (Prisma)

All tables include:

```
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

---

# 4.1 User

```
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId

  email     String   @unique
  password  String
  role      Role

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders    Order[]
  userServices UserService[]
}
```

Role enum:

```
enum Role {
  ADMIN
  CUSTOMER
}
```

---

# 4.2 Service

```
model Service {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId

  code      String   @unique
  name      String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders    Order[]
  usages    PhoneUsage[]
  users     UserService[]
}
```

---

# 4.3 UserService (Service Permission)

Defines which services a customer can use.

```
model UserService {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId

  userId    String   @db.ObjectId
  serviceId String   @db.ObjectId

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  service   Service  @relation(fields: [serviceId], references: [id])

  @@unique([userId, serviceId])
}
```

---

# 4.4 Order

```
model Order {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId

  userId    String   @db.ObjectId
  serviceId String   @db.ObjectId

  quantity  Int
  message   String
  ccg       Boolean

  status    OrderStatus

  startDate DateTime?
  endDate   DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  service   Service  @relation(fields: [serviceId], references: [id])

  details   OrderDetail[]
}
```

Order status:

```
enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}
```

---

# 4.5 OrderDetail

Stores successful message results.

```
model OrderDetail {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId

  orderId         String   @db.ObjectId
  serviceId       String   @db.ObjectId

  phoneNumber     String
  sourceTag       String?

  code            String?
  messageResponse String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  order           Order    @relation(fields: [orderId], references: [id])
}
```

---

# 4.6 PhoneUsage

Prevents duplicate phone usage for a service.

```
model PhoneUsage {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId

  phoneNumber String
  serviceId   String   @db.ObjectId

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  service     Service  @relation(fields: [serviceId], references: [id])

  @@unique([phoneNumber, serviceId])
}
```

---

# 5. Index Strategy

Important indexes:

PhoneUsage

```
(phoneNumber, serviceId) UNIQUE
```

Orders

```
userId
serviceId
status
```

OrderDetail

```
orderId
phoneNumber
sourceTag
```

Services

```
code UNIQUE
```

---

# 6. Business Flow

## Customer Creates Order

Steps:

1. Login
2. Load allowed services
3. Select service
4. Submit order

API:

```
POST /api/orders
```

Payload:

```
{
  serviceId,
  quantity,
  message,
  ccg
}
```

Status:

```
PENDING
```

---

# 7. Admin Order Processing

Steps:

1. Admin opens order
2. Upload phone list
3. System checks used phones
4. Send SMS
5. Save results

Check API:

```
POST /api/admin/check-phones
```

---

# 8. Export Orders (Admin)

Admin can export orders filtered by status.

Example:

```
GET /api/admin/export-orders?status=COMPLETED
```

Export formats:

* CSV
* Excel

Fields:

```
orderId
customer
service
quantity
status
createdAt
```

---

# 9. UI Design (Ant Design)

Layout:

* Sidebar
* Header
* Content

Admin Menu:

```
Dashboard
Users
Services
Orders
Reports
```

Customer Menu:

```
Dashboard
Create Order
My Orders
```

---

# 10. Main Pages

## Admin Dashboard

Cards:

```
Total Orders
Pending Orders
Processing Orders
Completed Orders
```

Charts:

* Orders per service
* Daily usage

---

## Orders Table

Columns:

```
Order ID
Customer
Service
Quantity
Status
Created Time
Action
```

---

## Create Order Page

Form:

```
Service Select
Quantity
Message
CCG Switch
```

Components:

* Select
* InputNumber
* TextArea
* Switch

---

# 11. API Endpoints

Auth

```
POST /api/auth/login
POST /api/auth/logout
```

Customer

```
GET /api/services
POST /api/orders
GET /api/orders
GET /api/orders/:id
```

Admin

```
GET /api/admin/orders
POST /api/admin/check-phones
POST /api/admin/order-success
GET /api/admin/export-orders
```

---

# 12. Task List for AI Agent

## Phase 1 — Project Setup

Tasks:

* Create Next.js latest project
* Install Ant Design
* Setup Prisma
* Setup MongoDB connection

Commands:

```
npx create-next-app@latest
npm install antd
npm install prisma
npx prisma init
```

---

## Phase 2 — Database

Tasks:

* Implement Prisma schema
* Add relations
* Add indexes

Run:

```
npx prisma generate
```

---

## Phase 3 — Authentication

Tasks:

* Login API
* JWT middleware
* Role guard

Roles:

```
ADMIN
CUSTOMER
```

---

## Phase 4 — API

Implement:

```
/api/orders
/api/orders/[id]
/api/admin/orders
/api/admin/check-phones
/api/admin/export-orders
```

---

## Phase 5 — UI Pages

Admin pages:

```
/admin/dashboard
/admin/users
/admin/services
/admin/orders
/admin/reports
```

Customer pages:

```
/customer/dashboard
/customer/orders
/customer/create-order
```

---

# 13. Future Improvements

Potential improvements:

* SMS queue worker
* CSV phone import
* Redis caching
* Analytics dashboard
* SMS retry logic
* Bulk processing
* Phone normalization

---

# Result

This document allows an AI coding agent to generate:

* Full Next.js system
* Ant Design professional UI
* MongoDB relational schema
* Role-based access
* Order export feature
* Customer order workflow
* Phone usage validation
* Standardized timestamps (`createdAt`, `updatedAt`) across all tables
