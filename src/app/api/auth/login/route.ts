import { NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/dto/login.dto"
import { loginUser } from "@/services/authService"
import { setCookies } from "@/lib/cookies"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 400 }
      )
    }

    const result = await loginUser(parsed.data.username, parsed.data.password)

    const response = NextResponse.json({
      success: true,
      data: { user: result.user },
    })

    setCookies(response, result.accessToken, result.refreshToken)
    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login thất bại"
    return NextResponse.json(
      { success: false, error: { code: "INVALID_CREDENTIALS", message } },
      { status: 401 }
    )
  }
}
