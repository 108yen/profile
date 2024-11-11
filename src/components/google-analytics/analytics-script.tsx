"use client"
import Script from "next/script"

interface AnalyticsScriptProps {
  debugMode: boolean
}

export function AnalyticsScript({ debugMode = false }: AnalyticsScriptProps) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FYQ952FYKD"
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FYQ952FYKD', {
                page_path: window.location.pathname,
                ${debugMode ? `debug_mode: true,` : ""}
            });
        `}
      </Script>
    </>
  )
}
