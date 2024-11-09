import type { Metadata } from "next"

import "@/styles/reset.css"
import "@/styles/layout.css"

import { Blackhole } from "./components/layout"

export const metadata: Metadata = {
  description: "Web engineer and security specialist",
  title: "Kazuki Shirai / 108yen",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="background">
          <Blackhole />
        </div>

        <div className="container">{children}</div>
      </body>
    </html>
  )
}
