import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/apiAuth"
import { getAllServices, createService } from "@/services/serviceService"

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const result = await getAllServices()
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
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const body = await req.json()
    const { code, name } = body

    if (!code || !name) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Code và name là bắt buộc" } },
        { status: 400 }
      )
    }

    const service = await createService(code, name)
    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
