import { findPackages } from "find-packages"
import "@/styles/footer.css"
import { HTMLAttributes } from "react"

interface FooterProps extends HTMLAttributes<HTMLElement> {}

export async function Footer(props: FooterProps) {
  const packages = await findPackages("./")
  const { version } = packages[0].manifest

  return (
    <div className="caption" {...props}>
      {`v${version}`}
      <br />
      ©2024 Kazuki Shirai.
    </div>
  )
}
