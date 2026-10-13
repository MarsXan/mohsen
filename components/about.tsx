import { about } from "@/lib/resume"

export default function About() {
  return (
    <section id="about" data-scene="about" className="relative">
      <div className="layer mx-auto grid max-w-7xl gap-8 px-6 py-20 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:py-32">
        <div>
          <div data-anchor className="h-[50svh] lg:sticky lg:top-[11vh] lg:h-[78vh]" />
        </div>
        <div className="self-center">
          <p className="eyebrow text-ios">About</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            {about.heading}
          </h2>
          <div className="mt-7 max-w-2xl space-y-4 text-base leading-relaxed text-ink/75 md:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-ink/5 bg-white p-5 shadow-sm shadow-ink/5">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="gradient-text font-display text-4xl font-extrabold tracking-tight">{stat.value}</span>
                  <span className="mt-1 block text-sm leading-snug text-ink/65">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <dl className="mt-8 max-w-2xl divide-y divide-ink/10 border-y border-ink/10 text-sm md:text-base">
            {about.facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr]">
                <dt className="eyebrow pt-1 text-ink/55">{fact.label}</dt>
                <dd className="text-ink/85">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
