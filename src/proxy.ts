import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"
import { COOKIE_ACCESS_TOKEN } from "@/lib/cookies"
import { Role } from "@/constants/roles"
import { Routes } from "@/constants/routes"

const ADMIN_PATHS = ["/admin"]
const CUSTOMER_PATHS = ["/customer"]
const PROTECTED_PATHS = [...ADMIN_PATHS, ...CUSTOMER_PATHS]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get(COOKIE_ACCESS_TOKEN)?.value

  if (!token) {
    return NextResponse.redirect(new URL(Routes.LOGIN, req.url))
  }

  try {
    const payload = verifyAccessToken(token)

    // Admin trying to access customer routes
    if (payload.role === Role.ADMIN && CUSTOMER_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL(Routes.ADMIN.DASHBOARD, req.url))
    }

    // Customer trying to access admin routes
    if (payload.role === Role.CUSTOMER && ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL(Routes.CUSTOMER.DASHBOARD, req.url))
    }

    return NextResponse.next()
  } catch {
    // Token expired or invalid
    return NextResponse.redirect(new URL(Routes.LOGIN, req.url))
  }
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
}
