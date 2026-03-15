import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/apiAuth"
import { createOrderSchema } from "@/dto/createOrder.dto"
import { createOrder, getOrders } from "@/services/orderService"
import { OrderStatus } from "@/constants/orderStatus"

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req)
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const status = searchParams.get("status") as OrderStatus | undefined

    const result = await getOrders(user!.userId, page, pageSize, status || undefined)
    return NextResponse.json({ success: true, data: result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { user, error } = requireAuth(req)
  if (error) return error

  try {
    const body = await req.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } },
        { status: 400 }
      )
    }

    const order = await createOrder(user!.userId, parsed.data)
    return NextResponse.json({ success: true, data: { id: order.id, status: order.status } }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    const code = message.includes("quyền") ? "SERVICE_NOT_ALLOWED" : "INTERNAL_ERROR"
    return NextResponse.json(
      { success: false, error: { code, message } },
      { status: code === "SERVICE_NOT_ALLOWED" ? 403 : 500 }
    )
  }
}
