import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { profile } from "@/lib/resume"
import { StackOverflowIcon } from "@/components/icons"

export default function Hero() {
  const socials = [
    { href: profile.links.github, label: "GitHub", icon: <Github className="h-5 w-5" /> },
    { href: profile.links.linkedin, label: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { href: profile.links.stackoverflow, label: "Stack Overflow", icon: <StackOverflowIcon className="h-5 w-5" /> },
  ]

  return (
    <section id="top" data-scene="hero" className="hero relative">
      <div className="layer mx-auto grid min-h-svh max-w-7xl grid-cols-1 content-center items-center gap-4 px-6 pb-10 pt-24 md:px-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8 lg:pb-16 2xl:max-w-[1440px]">
        <div>
          <p className="eyebrow rise flex items-center gap-2.5 text-ink/70" style={{ animationDelay: "0.05s" }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-droid opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-droid" />
            </span>
            {profile.availability} · {profile.location}
          </p>
          <h1
            className="rise mt-5 font-display text-[15vw] font-extrabold leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-8xl xl:text-[7.4rem]"
            style={{ animationDelay: "0.15s" }}
          >
            {profile.firstName}
            <br />
            <span className="gradient-text">{profile.lastName}</span>
          </h1>
          <p className="rise mt-6 font-display text-xl font-semibold tracking-tight md:text-2xl" style={{ animationDelay: "0.25s" }}>
            {profile.title}
          </p>
          <p className="rise mt-3 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg" style={{ animationDelay: "0.32s" }}>
            {profile.tagline}
          </p>
          <ul className="rise mt-5 hidden flex-wrap gap-2 sm:flex" style={{ animationDelay: "0.4s" }}>
            {profile.platforms.map((platform) => (
              <li key={platform} className="chip border border-ink/10 bg-white/70 font-mono text-ink/80 backdrop-blur">
                {platform}
              </li>
            ))}
          </ul>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.5s" }}>
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-ink/20 transition hover:-translate-y-0.5"
            >
              See my work
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="hidden items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:border-ink/30 sm:inline-flex"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>
            <div className="flex items-center gap-1 pl-1">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-full text-ink/70 transition hover:bg-ink/5 hover:text-ink"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
          <div data-anchor className="h-[44svh] lg:h-[82vh]" />
          <p className="eyebrow pointer-events-none absolute inset-x-0 bottom-0 text-center text-ink/40 lg:-bottom-8">
            <span className="hidden motion-safe:[@media(pointer:fine)]:lg:inline">Drag to spin · </span>
            Tap the tabs on its screen
          </p>
        </div>
      </div>
    </section>
  )
}
