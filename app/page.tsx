import About from "@/components/about"
import Contact from "@/components/contact"
import Experience from "@/components/experience"
import Hero from "@/components/hero"
import Nav from "@/components/nav"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Stage from "@/components/stage"

export default function Home() {
  return (
    <>
      <Stage />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
