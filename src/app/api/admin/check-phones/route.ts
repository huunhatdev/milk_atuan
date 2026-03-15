import { NextRequest, NextResponse } from "next/server"
import { requireAdminToken } from "@/lib/apiAuth"
import { checkPhonesSchema } from "@/dto/checkPhones.dto"
import { checkPhoneUsage } from "@/services/phoneService"

export async function POST(req: NextRequest) {
  const { error } = requireAdminToken(req)
  if (error) return error

  try {
    const body = await req.json()
    const parsed = checkPhonesSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 400 }
      )
    }

    const result = await checkPhoneUsage(parsed.data.serviceCode, parsed.data.phones)
    return NextResponse.json({ success: true, data: result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
