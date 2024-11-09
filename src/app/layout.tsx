import type { Metadata } from "next"

import "../styles/reset.css"

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
      <body>{children}</body>
    </html>
  )
}
