import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"
import { COOKIE_ACCESS_TOKEN } from "@/lib/cookies"

export function getAuthUser(req: NextRequest) {
  const token = req.cookies.get(COOKIE_ACCESS_TOKEN)?.value
  if (!token) return null

  try {
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

export function requireAuth(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      ),
    }
  }
  return { user, error: null }
}

export function requireAdmin(req: NextRequest) {
  const { user, error } = requireAuth(req)
  if (error) return { user: null, error }

  if (user?.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Forbidden" } },
        { status: 403 }
      ),
    }
  }

  return { user, error: null }
}

export function requireAdminToken(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY || "milk_admin_secret_token_2026"
  const authHeader = req.headers.get("Header-Authorization")

  if (authHeader !== `Bearer ${adminKey}`) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Invalid API Key" } },
        { status: 401 }
      ),
    }
  }

  return { error: null }
}
