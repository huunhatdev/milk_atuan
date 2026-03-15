import { NextRequest, NextResponse } from "next/server"
import { COOKIE_REFRESH_TOKEN, setCookies } from "@/lib/cookies"
import { refreshAccessToken } from "@/services/authService"
import { signRefreshToken } from "@/lib/auth"
import { Role } from "@/constants/roles"

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(COOKIE_REFRESH_TOKEN)?.value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "No refresh token" } },
        { status: 401 }
      )
    }

    const { accessToken, user } = await refreshAccessToken(refreshToken)
    const newRefreshToken = signRefreshToken(user as { userId: string; username: string; role: Role })

    const response = NextResponse.json({ success: true, data: { user } })
    setCookies(response, accessToken, newRefreshToken)
    return response
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid refresh token" } },
      { status: 401 }
    )
  }
}
