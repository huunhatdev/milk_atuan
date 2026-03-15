import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/apiAuth"
import prisma from "@/lib/prisma"
import { OrderStatus } from "@/constants/orderStatus"

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as OrderStatus | undefined

    const where = status ? { status } : {}

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
        service: { select: { code: true, name: true } },
      },
    })

    // Build CSV content
    const headers = ["Order ID", "Customer Username", "Service Code", "Quantity", "Message", "CCG", "Status", "Created At"]
    const rows = orders.map((o) => [
      o.id,
      o.user.username,
      o.service.code,
      o.quantity.toString(),
      `"${o.message.replace(/"/g, '""')}"`,
      o.ccg ? "Yes" : "No",
      o.status,
      new Date(o.createdAt).toISOString(),
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${status || "all"}-${Date.now()}.csv"`,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
