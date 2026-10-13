import type { SVGProps } from "react"

// lucide has no Stack Overflow mark, so this one is drawn here: a tray with a stack of bars.
export function StackOverflowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 14v6h12v-6" />
      <path d="M8 17h6" />
      <path d="M8.3 13.2l5.9 1" />
      <path d="M9.4 9.4l5.4 2.6" />
      <path d="M11.6 5.8l4.4 4" />
    </svg>
  )
}
