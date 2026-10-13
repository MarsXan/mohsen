import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mohsen Mokhtari - Mobile & Web Frontend Team Lead",
  description:
    "Portfolio of Mohsen Mokhtari, a mobile and web frontend team lead with 10+ years building iOS, Android, and web applications.",
    generator: 'Mohsen Mokhtari'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'
