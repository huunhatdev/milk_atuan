import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AntdProvider from "@/components/providers/AntdProvider"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIM Service Manager",
  description: "Hệ thống quản lý SIM Service",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AntdProvider>{children}</AntdProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
