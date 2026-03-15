import { NextResponse } from "next/server"

export const COOKIE_ACCESS_TOKEN = "access_token"
export const COOKIE_REFRESH_TOKEN = "refresh_token"

export function setCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set(COOKIE_ACCESS_TOKEN, accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  })

  response.cookies.set(COOKIE_REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  })
}

export function clearCookies(response: NextResponse) {
  response.cookies.delete(COOKIE_ACCESS_TOKEN)
  response.cookies.delete(COOKIE_REFRESH_TOKEN)
}
