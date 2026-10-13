"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, GitlabIcon as GitHub, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0"
        style={{
          opacity: Math.min(1, scrollY / 500),
        }}
      />
      <div className="container px-4 md:px-6 z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Mohsen Mokhtari</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-2">Mobile & Web Frontend Team Lead</p>
          </motion.div>
          <motion.p
            className="max-w-[700px] text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Building iOS, Android, and web applications with Swift, Kotlin, and Angular, backed by Node.js and NestJS.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="mailto:m.balestani@gmail.com">
                <Mail className="h-4 w-4" />
                Contact Me
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="https://github.com/MarsXan" target="_blank" rel="noopener noreferrer">
                <GitHub className="h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="https://www.linkedin.com/in/mohsen-mokhtari/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }}
        >
          <ArrowDown className="h-6 w-6" />
          <span className="sr-only">Scroll down</span>
        </Button>
      </div>
    </section>
  )
}

