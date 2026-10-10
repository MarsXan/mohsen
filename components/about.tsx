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
              Skilled Mobile Developer with extensive experience in building high-performance Android and iOS
              applications.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 text-left">
            <p>
              I specialize in building high-performance Android and iOS applications using Kotlin, Swift, and Flutter.
              With a focus on optimizing app performance and reducing development cycles, I deliver
              seamless user experiences across platforms.
            </p>
            <p>
              While my primary focus is mobile development, I also bring backend expertise, leveraging Node.js and
              NestJS to ensure robust, scalable infrastructures that support modern mobile applications. I'm known for
              mentoring developers, implementing clean architectures like MVVM, and driving innovation in fast-paced,
              agile environments.
            </p>
            <p>
              I'm passionate about creating intuitive, efficient applications that solve real-world problems and provide
              exceptional user experiences.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

