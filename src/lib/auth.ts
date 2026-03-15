import jwt from "jsonwebtoken"
import { Role } from "@/constants/roles"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-access-secret"
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret"
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m"
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d"

export interface JwtPayload {
  userId: string
  username: string
  role: Role
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as jwt.SignOptions["expiresIn"] })
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as jwt.SignOptions["expiresIn"] })
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload
}
