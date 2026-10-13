"use client"

import { useEffect, useRef } from "react"

// Mounts the 3D scene. three.js is loaded on demand so the page text never waits for it,
// and the page still works if WebGL is unavailable.
export default function Stage() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let dispose: (() => void) | undefined
    let cancelled = false
    import("@/lib/scene")
      .then(({ createStage }) => {
        if (cancelled || !canvas.current) return
        dispose = createStage(canvas.current).dispose
      })
      .catch(() => {})
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  return (
    <div className="stage" aria-hidden="true">
      <canvas ref={canvas} />
      <svg id="stage-connector">
        <path fill="none" stroke="#8fdcff" strokeWidth="1.5" strokeDasharray="4 5" />
        <circle r="5" fill="#8fdcff" />
      </svg>
    </div>
  )
}
