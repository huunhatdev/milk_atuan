import { NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/services/orderService"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await getOrderById(id)
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json(
      { success: false, error: { message } },
      { status: error instanceof Error && error.message.includes("không tìm thấy") ? 404 : 500 }
    )
  }
}
