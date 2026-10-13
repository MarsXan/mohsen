"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { jobs } from "@/lib/resume"
import { useActiveItem } from "@/components/use-active-item"

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useActiveItem(ref, "job")

  return (
    <section id="experience" data-scene="experience" className="relative">
      <div ref={ref} className="layer mx-auto max-w-7xl px-6 py-20 md:px-10 lg:pb-16 lg:pt-32">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
          <div className="hidden lg:block">
            <div data-anchor className="sticky top-0 h-screen" />
          </div>
          <div>
            <header className="mb-8 md:mb-12">
              <p className="eyebrow text-ios">Experience</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                Where I&apos;ve shipped.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
                Six roles across Australia, Italy, and Iran. The phone shows the kind of product behind each one.
              </p>
            </header>
            <div data-strip className="strip strip-light">
              <div data-anchor className="h-full" />
            </div>
            <ol className="space-y-5 lg:pb-[20vh]">
              {jobs.map((job, i) => {
                const on = active === i
                return (
                  <li
                    key={`${job.company}-${job.period}`}
                    data-item
                    className={`rounded-[28px] border bg-white p-6 transition duration-300 md:p-8 ${
                      on ? "border-ios/40 shadow-2xl shadow-ios/15" : "border-ink/5 opacity-70 shadow-sm shadow-ink/5"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <p className="eyebrow text-ink/50">{job.product}</p>
                      <p className="shrink-0 whitespace-nowrap rounded-full bg-ink/5 px-3 py-1 font-mono text-xs font-medium text-ink/75">
                        {job.period}
                      </p>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight md:text-[1.7rem]">{job.title}</h3>
                    <p className="mt-1.5 text-sm text-ink/65 md:text-base">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-ios/40 decoration-2 underline-offset-4 transition hover:decoration-ios"
                      >
                        {job.company}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>{" "}
                      · {job.location}
                    </p>
                    <ul className="mt-5 space-y-2.5 text-[0.95rem] leading-relaxed text-ink/80">
                      {job.description.map((line) => (
                        <li key={line} className="relative pl-5">
                          <span className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-gradient-to-r from-ios to-droid" />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <li key={skill} className="chip bg-ink/5 text-ink/80">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
