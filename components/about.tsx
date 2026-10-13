"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Mobile and web frontend lead with 10+ years building Android, iOS, and web applications.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 text-left">
            <p>
              I'm a mobile and web frontend lead with 10+ years building Android, iOS, and web applications and 5+
              years leading cross-functional teams for companies in Australia, Italy, and Iran.
            </p>
            <p>
              I have deep native experience in Swift/SwiftUI and Kotlin/Jetpack Compose, plus production web work in
              Angular and TypeScript (web apps and PWAs). I'm comfortable owning the full stack when needed, with
              Node.js/NestJS backends on Google Cloud and Firebase behind products serving 2,000,000+ users.
            </p>
            <p>
              I'm known for clean, testable architecture (Clean Architecture, MVVM, MVI), CI/CD automation, and
              mentoring developers in fast-paced agile environments.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

