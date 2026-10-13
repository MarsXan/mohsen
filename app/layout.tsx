import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Sora } from "next/font/google"
import "./globals.css"

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const display = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

export const metadata: Metadata = {
  title: "Mohsen Mokhtari - Mobile Developer",
  description:
    "Portfolio of Mohsen Mokhtari, a mobile developer with 10+ years building iOS and Android applications, with hands-on AI and LLM experience.",
  generator: "Mohsen Mokhtari",
}

export const viewport: Viewport = {
  themeColor: "#f4f6fb",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
