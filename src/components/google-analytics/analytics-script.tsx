"use client"
import Script from "next/script"

interface AnalyticsScriptProps {
  debugMode: boolean
}

export function AnalyticsScript({ debugMode = false }: AnalyticsScriptProps) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                ${debugMode ? `debug_mode: true,` : ""}
            });
        `}
      </Script>
    </>
  )
}
