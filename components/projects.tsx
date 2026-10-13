import { ArrowUpRight, CandlestickChart, CloudFog, HeartHandshake, Package, ShieldCheck, Spade, Timer } from "lucide-react"
import { projects } from "@/lib/resume"

const icons = {
  spade: Spade,
  heart: HeartHandshake,
  chart: CandlestickChart,
  package: Package,
  timer: Timer,
  cloud: CloudFog,
  shield: ShieldCheck,
}

export default function Projects() {
  return (
    <section id="projects" data-scene="projects" className="panel-tint relative rounded-[36px] md:mx-3 md:rounded-[56px]">
      <div className="layer mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
          <header>
            <p className="eyebrow text-ios">Personal projects</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">Built on my own time.</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
              Side projects across mobile, backend, and research, including an app for sending parcels by drone.
            </p>
          </header>
          <div data-anchor className="h-56 lg:h-80" />
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const Icon = icons[project.icon]
            return (
              <li
                key={project.title}
                className="flex flex-col rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-sm shadow-ink/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ios/10 md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ios to-droid text-white shadow-lg shadow-ios/25">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{project.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink/70">{project.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="chip bg-ink/5 text-ink/80">
                      {tech}
                    </li>
                  ))}
                </ul>
                {project.link && (
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1 self-start text-sm font-semibold text-ink underline decoration-ios/40 decoration-2 underline-offset-4 transition hover:decoration-ios"
                  >
                    {project.link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
