import { Blackhole, Footer } from "@/components/layout"
import { PropsWithChildren } from "react"
import "@/styles/layout.css"

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="stack">
      <Blackhole className="background" />

      <div className="container">{children}</div>

      <Footer />
    </div>
  )
}
