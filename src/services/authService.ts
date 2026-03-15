import prisma from "@/lib/prisma"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { Role } from "@/constants/roles"

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    role: Role
  }
}

export async function loginUser(username: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Tên đăng nhập hoặc mật khẩu không đúng")
  }

  if (!user.isActive) {
    throw new Error("Tài khoản của bạn đã bị khóa")
  }

  const payload = { userId: user.id, username: user.username, role: user.role as Role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, role: user.role as Role },
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken)

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) throw new Error("User không tồn tại")

  const newPayload = { userId: user.id, username: user.username, role: user.role as Role }
  const newAccessToken = signAccessToken(newPayload)

  return { accessToken: newAccessToken, user: newPayload }
}
