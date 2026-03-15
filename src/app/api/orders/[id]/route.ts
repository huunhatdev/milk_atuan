import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/apiAuth"
import { getOrderById } from "@/services/orderService"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = requireAuth(req)
  if (error) return error

  try {
    const { id } = await params
    const order = await getOrderById(id, user!.userId)
    return NextResponse.json({ success: true, data: order })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "ORDER_NOT_FOUND", message } },
      { status: 404 }
    )
  }
}
