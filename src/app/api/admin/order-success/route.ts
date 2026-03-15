import { NextRequest, NextResponse } from "next/server"
import { requireAdminToken } from "@/lib/apiAuth"
import { orderSuccessSchema } from "@/dto/orderSuccess.dto"
import { saveOrderSuccess } from "@/services/orderService"

export async function POST(req: NextRequest) {
  const { error } = requireAdminToken(req)
  if (error) return error

  try {
    const body = await req.json()
    const parsed = orderSuccessSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 400 }
      )
    }

    await saveOrderSuccess(parsed.data)
    return NextResponse.json({ success: true, data: null })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
