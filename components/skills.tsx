"use client"

import { useRef } from "react"
import { skillLayers } from "@/lib/resume"
import { useActiveItem } from "@/components/use-active-item"

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useActiveItem(ref, "skill")

  return (
    <section id="skills" data-scene="skills" className="panel-dark relative rounded-[36px] md:mx-3 md:rounded-[56px]">
      <div ref={ref} className="layer mx-auto max-w-7xl px-6 py-20 md:px-10 lg:pb-14 lg:pt-32">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16">
          <div>
            <header className="mb-8 md:mb-12">
              <p className="eyebrow text-[#8fdcff]">Skills</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">Take it apart.</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#e8ecff]/70 md:text-lg">
                Six layers of one device, and what each stands for in how I work. Scroll to open it up.
              </p>
            </header>
            <div data-strip className="strip strip-dark">
              <div data-anchor className="h-full" />
            </div>
            <ol className="space-y-4 md:space-y-5 lg:pb-[30vh]">
              {skillLayers.map((layer, i) => {
                const on = active === i
                return (
                  <li
                    key={layer.part}
                    data-item
                    data-skill-card
                    className={`rounded-[28px] border p-6 transition duration-300 md:p-7 ${
                      on
                        ? "border-[#8fdcff]/60 bg-white/[0.09] shadow-[0_0_0_1px_rgba(143,220,255,.25),0_24px_60px_-20px_rgba(47,123,255,.55)]"
                        : "border-white/10 bg-white/[0.035] opacity-60"
                    }`}
                  >
                    <p className="eyebrow flex items-center gap-3 text-[#8fdcff]">
                      <span className="text-[#e8ecff]/45">{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-px w-6 bg-[#8fdcff]/50" />
                      {layer.partLabel}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">{layer.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#e8ecff]/65 md:text-base">{layer.blurb}</p>
                    <div className={`mt-5 grid gap-4 ${layer.groups.length === 3 ? "sm:grid-cols-3" : layer.groups.length === 2 ? "sm:grid-cols-[1.5fr_1fr]" : ""}`}>
                      {layer.groups.map((group) => (
                        <div key={group.name ?? layer.title}>
                          {group.name && <p className="mb-2 font-display text-sm font-semibold text-white">{group.name}</p>}
                          <ul className="flex flex-wrap gap-2">
                            {group.items.map((item) => (
                              <li key={item} className="chip border border-white/10 bg-white/[0.07] text-[#e8ecff]/90">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="hidden lg:block">
            <div data-anchor className="sticky top-0 h-screen" />
          </div>
        </div>
      </div>
    </section>
  )
}
