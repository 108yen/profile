import { SVGProps } from "react"

interface VercelIconProps extends SVGProps<SVGSVGElement> {}

export function VercelIcon(props: VercelIconProps) {
  return (
    <svg aria-hidden="true" role="img" viewBox="0 0 74 64" {...props}>
      <path
        d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
        fill="white"
      />
    </svg>
  )
}
