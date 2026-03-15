import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/apiAuth"
import { getAllOrdersAdmin, updateOrderStatus } from "@/services/orderService"
import { OrderStatus } from "@/constants/orderStatus"

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const status = searchParams.get("status") as OrderStatus | undefined
    const userId = searchParams.get("userId") || undefined
    const serviceId = searchParams.get("serviceId") || undefined
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined

    const result = await getAllOrdersAdmin(page, pageSize, {
      status,
      userId,
      serviceId,
      startDate,
      endDate,
    })
    return NextResponse.json({ success: true, data: result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const body = await req.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "orderId và status là bắt buộc" } },
        { status: 400 }
      )
    }

    const order = await updateOrderStatus(orderId, status)
    return NextResponse.json({ success: true, data: order })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
