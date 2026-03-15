import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@/constants/roles"

export async function getAllUsers(page = 1, pageSize = 20) {
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        userServices: {
          include: {
            service: { select: { id: true, code: true, name: true } },
          },
        },
      },
    }),
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
  ])

  return { items, pagination: { page, pageSize, total } }
}

export async function createUser(username: string, password: string, role: Role = Role.CUSTOMER) {
  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) throw new Error("Tên đăng nhập đã tồn tại")

  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: { username, password: hashedPassword, role },
    select: { id: true, username: true, role: true, createdAt: true },
  })
}

export async function updateUser(userId: string, data: { isActive?: boolean; serviceIds?: string[] }) {
  const { isActive, serviceIds } = data

  return prisma.$transaction(async (tx) => {
    if (isActive !== undefined) {
      await tx.user.update({
        where: { id: userId },
        data: { isActive },
      })
    }

    if (serviceIds !== undefined) {
      // Replace services
      await tx.userService.deleteMany({
        where: { userId },
      })

      if (serviceIds.length > 0) {
        await tx.userService.createMany({
          data: serviceIds.map((serviceId) => ({
            userId,
            serviceId,
          })),
        })
      }
    }
  })
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      userServices: {
        include: { service: true },
      },
    },
  })
}
