import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/apiAuth"
import { getPhoneUsages, bulkUpsertPhoneUsage } from "@/services/phoneService"

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "50")
    const search = searchParams.get("search") || undefined

    const result = await getPhoneUsages(page, pageSize, search)
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
    const { items } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Danh sách items là bắt buộc" } },
        { status: 400 }
      )
    }

    const result = await bulkUpsertPhoneUsage(items)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
