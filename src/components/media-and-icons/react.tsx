import { SVGProps } from "react"

interface ReactIconProps extends SVGProps<SVGSVGElement> {}

export function ReactIcon(props: ReactIconProps) {
  return (
    <svg aria-hidden="true" role="img" viewBox="-10.5 -9.45 21 18.9" {...props}>
      <circle cx="0" cy="0" fill="currentColor" r="2" />
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  )
}
