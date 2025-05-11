import type { Metadata } from "next"

import "@/styles/reset.css"
import "@/styles/layout.css"
import { AnalyticsScript } from "@/components/google-analytics"
import { Blackhole, Footer } from "@/components/layout"

export const metadata: Metadata = {
  description: "Web engineer, security specialist",
  icons: [
    {
      rel: "icon",
      sizes: "48x48",
      type: "image/x-icon",
      url: "./favicon.ico",
    },
  ],
  metadataBase: new URL("https://108yen.github.io/profile"),
  openGraph: {
    description: "Web engineer, security specialist",
    images: [
      {
        type: "image/png",
        url: "/android-chrome-512x512.png",
      },
    ],
    siteName: "Profile of Kazuki Shirai",
    title: "Kazuki Shirai",
    type: "website",
  },
  title: "Kazuki Shirai",
  twitter: {
    card: "summary",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <AnalyticsScript debugMode={!process.env.PROD} />
      </head>

      <body>
        <div className="stack">
          <Blackhole className="background" />

          <div className="container">{children}</div>

          <Footer />
        </div>
      </body>
    </html>
  )
}
