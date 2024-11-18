import { SVGProps } from "react"

interface GoogleAnalyticsIconProps extends SVGProps<SVGSVGElement> {}

export function GoogleAnalyticsIcon(props: GoogleAnalyticsIconProps) {
  return (
    <svg aria-hidden="true" role="img" viewBox="0 0 192 192" {...props}>
      <rect fill="none" height="192" width="192" x="0" y="0" />
      <g>
        <g>
          <path d="M130,29v132c0,14.77,10.19,23,21,23c10,0,21-7,21-23V30c0-13.54-10-22-21-22S130,17.33,130,29z" />
        </g>
        <g>
          <path d="M75,96v65c0,14.77,10.19,23,21,23c10,0,21-7,21-23V97c0-13.54-10-22-21-22S75,84.33,75,96z" />
        </g>
        <g>
          <circle cx="41" cy="163" r="21" />
        </g>
      </g>{" "}
    </svg>
  )
}
