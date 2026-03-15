import { NextRequest, NextResponse } from "next/server"
import { getUserServices } from "@/services/serviceService"
import { requireAuth } from "@/lib/apiAuth"

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req)
  if (error) return error

  try {
    const services = await getUserServices(user!.userId)
    return NextResponse.json({ success: true, data: services })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
