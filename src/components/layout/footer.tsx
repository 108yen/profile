import { HTMLAttributes } from "react"
import "@/styles/footer.css"

interface FooterProps extends HTMLAttributes<HTMLElement> {}

export function Footer(props: FooterProps) {
  return (
    <div className="caption" {...props}>
      © 2024 Kazuki Shirai.
    </div>
  )
}
