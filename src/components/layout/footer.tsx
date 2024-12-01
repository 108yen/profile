"use client"
import "@/styles/footer.css"
import { useApp } from "@/context"
import { HTMLAttributes } from "react"

interface FooterProps extends HTMLAttributes<HTMLElement> {}

export function Footer(props: FooterProps) {
  const { version } = useApp()

  return (
    <div className="caption" {...props}>
      {`v${version}`} ©2024 Kazuki Shirai.
    </div>
  )
}
