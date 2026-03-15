/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma"

export async function checkPhoneUsage(
  serviceCode: string,
  phones: string[]
): Promise<{ used: string[]; unused: string[] }> {
  const upperCode = serviceCode.toUpperCase()
  const service = await prisma.service.findUnique({
    where: { code: upperCode },
  })

  if (!service) {
    throw new Error("Không tìm thấy dịch vụ với mã: " + upperCode)
  }

  const usedRecords = await prisma.phoneUsage.findMany({
    where: {
      serviceId: service.id,
      phoneNumber: { in: phones },
    },
    select: { phoneNumber: true },
  })

  const usedSet = new Set(usedRecords.map((r) => r.phoneNumber))
  const used = phones.filter((p) => usedSet.has(p))
  const unused = phones.filter((p) => !usedSet.has(p))

  return { used, unused }
}

export async function markPhoneAsUsed(serviceId: string, phoneNumber: string) {
  return prisma.phoneUsage.upsert({
    where: {
      phoneNumber_serviceId: { phoneNumber, serviceId },
    },
    create: { phoneNumber, serviceId },
    update: {},
  })
}

export async function getPhoneUsages(page = 1, pageSize = 50, search?: string) {
  const where: any = {}
  if (search) {
    where.OR = [
      { phoneNumber: { contains: search } },
      { service: { code: { contains: search } } },
      { service: { name: { contains: search } } },
    ]
  }

  const [items, total] = await prisma.$transaction([
    prisma.phoneUsage.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        service: {
          select: { code: true, name: true },
        },
      },
    }),
    prisma.phoneUsage.count({ where }),
  ])

  return { items, pagination: { page, pageSize, total } }
}

export async function bulkUpsertPhoneUsage(data: { phoneNumber: string; serviceCode: string }[]) {
  // Normalize service codes to uppercase
  const normalizedData = data.map(item => ({
    ...item,
    serviceCode: item.serviceCode.toUpperCase()
  }))

  // Get all unique service codes from normalized data
  const serviceCodes = [...new Set(normalizedData.map((d) => d.serviceCode))]

  // Fetch actual service IDs
  const services = await prisma.service.findMany({
    where: { code: { in: serviceCodes } },
    select: { id: true, code: true },
  })

  const serviceMap = new Map(services.map((s) => [s.code, s.id]))

  // We can't do a single bulk upsert in Prisma MongoDB easily, so we use a transaction or parallel promises
  // For better performance, we'll use a transaction with multiple upserts
  const operations = normalizedData
    .map((item) => {
      const serviceId = serviceMap.get(item.serviceCode)
      if (!serviceId) return null
      return prisma.phoneUsage.upsert({
        where: {
          phoneNumber_serviceId: {
            phoneNumber: item.phoneNumber,
            serviceId: serviceId,
          },
        },
        create: {
          phoneNumber: item.phoneNumber,
          serviceId: serviceId,
        },
        update: {},
      })
    })
    .filter(Boolean) as any[]

  if (operations.length === 0) return { count: 0 }

  // Execute in batches to avoid overwhelming the DB
  const results = await prisma.$transaction(operations)
  return { count: results.length }
}
