import prisma from "@/lib/prisma"
import { OrderStatus } from "@/constants/orderStatus"
import { CreateOrderDto } from "@/dto/createOrder.dto"
import { Prisma } from "@prisma/client"

export async function createOrder(userId: string, data: CreateOrderDto) {
  // Verify user has access to this service
  const userService = await prisma.userService.findFirst({
    where: { userId, serviceId: data.serviceId },
  })

  if (!userService) {
    throw new Error("Bạn không có quyền sử dụng dịch vụ này")
  }

  const order = await prisma.order.create({
    data: {
      userId,
      serviceId: data.serviceId,
      quantity: data.quantity,
      message: data.message,
      ccg: data.ccg,
      status: OrderStatus.PENDING,
    },
    include: {
      service: { select: { code: true, name: true } },
      user: { select: { username: true } },
    },
  })

  return order
}

export async function getOrders(
  userId: string,
  page = 1,
  pageSize = 20,
  status?: OrderStatus
) {
  const where = {
    userId,
    ...(status ? { status } : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { code: true, name: true } },
      },
    }),
    prisma.order.count({ where }),
  ])

  return { items, pagination: { page, pageSize, total } }
}

export async function getOrderById(orderId: string, userId?: string) {
  const where = userId ? { id: orderId, userId } : { id: orderId }

  const order = await prisma.order.findFirst({
    where,
    include: {
      service: { select: { code: true, name: true } },
      user: { select: { username: true } },
      details: true,
    },
  })

  if (!order) throw new Error("Đơn hàng không tìm thấy")
  return order
}

export async function getAllOrdersAdmin(
  page = 1,
  pageSize = 20,
  filters: {
    status?: OrderStatus
    userId?: string
    serviceId?: string
    startDate?: string
    endDate?: string
  } = {}
) {
  const { status, userId, serviceId, startDate, endDate } = filters
  const where: Prisma.OrderWhereInput = {}
  if (status) where.status = status
  if (userId) where.userId = userId
  if (serviceId) where.serviceId = serviceId

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate)
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      where.createdAt.lte = end
    }
  }

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { code: true, name: true } },
        user: { select: { username: true } },
      },
    }),
    prisma.order.count({ where }),
  ])

  return { items, pagination: { page, pageSize, total } }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
}

export async function saveOrderSuccess(data: {
  orderId: string
  phoneNumber: string
  sourceTag?: string
  code?: string
  messageResponse?: string
}) {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    select: { serviceId: true, quantity: true },
  })

  if (!order) throw new Error("Không tìm thấy đơn hàng")

  const serviceId = order.serviceId

  // Track phone usage
  const usage = await prisma.phoneUsage.findUnique({
    where: {
      phoneNumber_serviceId: {
        phoneNumber: data.phoneNumber,
        serviceId: serviceId,
      },
    },
  })

  if (usage) {
    throw new Error("Số điện thoại này đã sử dụng dịch vụ này rồi")
  }

  // Use transaction to ensure consistency
  await prisma.$transaction(async (tx) => {
    // Save order detail
    await tx.orderDetail.create({
      data: {
         ...data,
         serviceId,
      },
    })

    // Create phone usage
    await tx.phoneUsage.create({
      data: { phoneNumber: data.phoneNumber, serviceId: serviceId },
    })

    // Check if order is completed
    const detailCount = await tx.orderDetail.count({
      where: { orderId: data.orderId },
    })

    if (detailCount >= order.quantity) {
      await tx.order.update({
        where: { id: data.orderId },
        data: { status: OrderStatus.COMPLETED },
      })
    }
  })
}

export async function getDashboardStats() {
  const [total, pending, processing, completed] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
  ])

  return { total, pending, processing, completed }
}

export async function getCustomerDashboardStats(userId: string) {
  const [total, pending, processing, completed] = await prisma.$transaction([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { userId, status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { userId, status: OrderStatus.COMPLETED } }),
  ])

  return { total, pending, processing, completed }
}
