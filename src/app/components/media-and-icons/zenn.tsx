import { SVGProps } from "react"

interface ZennIconProps extends SVGProps<SVGSVGElement> {}

export function ZennIcon(props: ZennIconProps) {
  return (
    <svg aria-hidden="true" role="img" viewBox="0 0 80 80" {...props}>
      <path
        d="M2.4,83.3h17c0.9,0,1.7-0.5,2.2-1.2L68.4,5.2C69,4.2,68.3,3,67.1,3H51c-0.8,0-1.5,0.4-1.9,1.1L1.6,81.9 C1.3,82.5,1.7,83.3,2.4,83.3z"
        fillRule="evenodd"
      />
      <path
        d="M61,82.1l22.1-35.5c0.7-1.1-0.1-2.5-1.4-2.5H65.7c-0.6,0-1.2,0.3-1.5,0.8L41.5,81.2c-0.6,0.9,0.1,2.1,1.2,2.1 h16.3C59.8,83.3,60.6,82.9,61,82.1z"
        fillRule="evenodd"
      />
    </svg>
  )
}
