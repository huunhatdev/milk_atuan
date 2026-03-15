import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/apiAuth"
import { getAllUsers, createUser, updateUser } from "@/services/userService"
import { Role } from "@/constants/roles"

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req)
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")

    const result = await getAllUsers(page, pageSize)
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
    const { username, password, role, action, userId } = body

    // Handle update action
    if (action === "update" && userId) {
      const { isActive, serviceIds } = body
      await updateUser(userId, { isActive, serviceIds })
      return NextResponse.json({ success: true, data: null })
    }

    // Create user
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Tên đăng nhập và mật khẩu là bắt buộc" } },
        { status: 400 }
      )
    }

    const user = await createUser(username, password, role as Role)
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server"
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message } },
      { status: 500 }
    )
  }
}
