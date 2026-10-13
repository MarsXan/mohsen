"use client"

import { useEffect, useState } from "react"
import { navLinks, profile } from "@/lib/resume"

export default function Nav() {
  const [active, setActive] = useState("top")

  useEffect(() => {
    const targets = ["top", ...navLinks.map((link) => link.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    // A section becomes current when it crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 md:px-8 md:py-5">
      <a
        href="#top"
        aria-label="Back to top"
        className="pointer-events-auto grid h-11 w-11 place-items-center rounded-2xl bg-ink font-display text-sm font-extrabold tracking-tight text-white shadow-lg shadow-ink/20 ring-1 ring-white/20 transition hover:scale-105"
      >
        MM
      </a>
      <nav
        aria-label="Sections"
        className="pointer-events-auto hidden items-center gap-1 rounded-full border border-ink/5 bg-white/80 p-1.5 shadow-lg shadow-ink/10 backdrop-blur-md md:flex"
      >
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={active === link.id ? "true" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === link.id ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href={`mailto:${profile.email}`}
        className="pointer-events-auto rounded-full bg-gradient-to-r from-[#7fb2ff] to-[#49e3a4] px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-ink/15 transition hover:scale-105"
      >
        Get in touch
      </a>
    </header>
  )
}
