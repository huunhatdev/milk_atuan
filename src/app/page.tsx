import { redirect } from "next/navigation"
import { Routes } from "@/constants/routes"

export default function HomePage() {
  redirect(Routes.LOGIN)
}
