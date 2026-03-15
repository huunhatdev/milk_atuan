import prisma from "@/lib/prisma"

export async function getAllServices(page = 1, pageSize = 50) {
  const [items, total] = await prisma.$transaction([
    prisma.service.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.service.count(),
  ])

  return { items, pagination: { page, pageSize, total } }
}

export async function getUserServices(userId: string) {
  const userServices = await prisma.userService.findMany({
    where: { userId },
    include: {
      service: true,
    },
  })

  return userServices.map((us) => us.service)
}

export async function createService(code: string, name: string) {
  const upperCode = code.toUpperCase()
  const existing = await prisma.service.findUnique({ where: { code: upperCode } })
  if (existing) throw new Error("Mã dịch vụ đã tồn tại")

  return prisma.service.create({
    data: { code: upperCode, name },
  })
}

export async function updateService(id: string, data: { code?: string; name?: string }) {
  const updateData = { ...data }
  if (updateData.code) {
    updateData.code = updateData.code.toUpperCase()
  }
  return prisma.service.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteService(id: string) {
  return prisma.service.delete({ where: { id } })
}
