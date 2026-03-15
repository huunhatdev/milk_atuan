import { NextResponse } from "next/server"
import { clearCookies } from "@/lib/cookies"

export async function POST() {
  const response = NextResponse.json({ success: true, data: null })
  clearCookies(response)
  return response
}
