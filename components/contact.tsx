import { ArrowUp, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { profile } from "@/lib/resume"
import { StackOverflowIcon } from "@/components/icons"

export default function Contact() {
  const links = [
    { href: profile.links.linkedin, label: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { href: profile.links.github, label: "GitHub", icon: <Github className="h-5 w-5" /> },
    { href: profile.links.stackoverflow, label: "Stack Overflow", icon: <StackOverflowIcon className="h-5 w-5" /> },
  ]

  return (
    <section id="contact" data-scene="contact" className="panel-dark relative mt-3 rounded-t-[36px] md:mx-3 md:rounded-t-[56px]">
      <div className="layer mx-auto grid max-w-7xl items-center gap-6 px-6 pb-16 pt-20 md:px-10 lg:min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-28">
        <div data-anchor className="order-first h-[46svh] lg:order-last lg:h-[80vh]" />
        <div>
          <p className="eyebrow text-[#8fdcff]">Contact</p>
          <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.98] tracking-tight md:text-7xl">
            Let&apos;s build something <span className="gradient-text">together.</span>
          </h2>
          <p className="mt-6 flex items-center gap-2 text-base text-[#e8ecff]/75 md:text-lg">
            <MapPin className="h-5 w-5 shrink-0 text-[#8fdcff]" />
            {profile.location} ({profile.availability.toLowerCase()})
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#7fb2ff] to-[#49e3a4] px-6 py-4 text-base font-semibold text-ink shadow-xl shadow-ios/30 transition hover:-translate-y-0.5"
            >
              <Mail className="h-5 w-5" />
              {profile.email}
            </a>
            <a
              href={profile.phoneHref}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold transition hover:-translate-y-0.5 hover:border-white/40"
            >
              <Phone className="h-5 w-5" />
              {profile.phone}
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[#e8ecff]/85 transition hover:border-white/40 hover:text-white"
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="layer mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-sm text-[#e8ecff]/55 md:flex-row md:px-10">
        <p>© {new Date().getFullYear()} {profile.name}. Built with Next.js and three.js.</p>
        <a href="#top" className="inline-flex items-center gap-2 transition hover:text-white">
          Back to top
          <ArrowUp className="h-4 w-4" />
        </a>
      </footer>
    </section>
  )
}
