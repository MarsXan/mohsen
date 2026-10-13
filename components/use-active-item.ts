"use client"

import { type RefObject, useEffect, useState } from "react"
import { stageState } from "@/lib/scene/state"

// Tracks which [data-item] card is in focus while scrolling, and tells the 3D scene about it.
export function useActiveItem(container: RefObject<HTMLElement | null>, key: "skill" | "job") {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = container.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-item]"))
    const strip = root.querySelector<HTMLElement>("[data-strip]")
    let raf = 0

    const measure = () => {
      raf = 0
      const vh = window.innerHeight
      // On phones the sticky strip covers the top of the screen, so focus sits lower.
      const covered = strip && strip.offsetHeight > 0 ? Math.min(Math.max(strip.getBoundingClientRect().bottom, 0), vh * 0.6) : 0
      const focal = covered ? covered + (vh - covered) * 0.4 : vh * 0.5
      let best = 0
      let bestDistance = Number.POSITIVE_INFINITY
      items.forEach((item, i) => {
        const r = item.getBoundingClientRect()
        const distance = focal < r.top ? r.top - focal : focal > r.bottom ? focal - r.bottom : 0
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      stageState[key] = best
      setActive(best)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(raf)
    }
  }, [container, key])

  return active
}
