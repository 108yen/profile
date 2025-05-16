"use client"

import { LoadingEvents } from "@/utils/loadingEvents"
import "@/styles/loading.css"
import { useEffect, useState } from "react"

export function Loading() {
  const [visible, setVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const readyListener = LoadingEvents.on("blackholeReady", () => {
      setIsFading(true)

      const timer = setTimeout(() => {
        setVisible(false)
      }, 500)

      return () => clearTimeout(timer)
    })

    return () => readyListener()
  }, [])

  if (visible) {
    return (
      <div className={`loading-overlay ${isFading ? "fade-out" : ""}`}>
        <div className="loading-bar" />

        <p className="loading-text">loading...</p>
      </div>
    )
  }

  return null
}
