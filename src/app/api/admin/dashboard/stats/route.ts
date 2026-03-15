import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/apiAuth"
import { getDashboardStats } from "@/services/orderService"

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const stats = await getDashboardStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
