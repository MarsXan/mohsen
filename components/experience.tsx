"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [showAll, setShowAll] = useState(false)

  const experiences = [
    {
      title: "Senior Mobile Engineer",
      company: "RTA (Round Table Apps)",
      url: "https://roundtableapps.com/",
      location: "Australia (Remote)",
      period: "Apr 2025 – Present",
      description: [
        "Build and maintain iOS applications in Swift and SwiftUI for large-scale client products, including Blossom Bank (Australia), American Express, chat applications, and mobile games.",
        "Implement real-time communication features and secure payment integrations in close collaboration with cross-functional teams.",
        "Introduced the Coordinator pattern to restructure app navigation, improving modularity, scalability, and testability.",
        "Own the CI/CD pipelines for automated testing, static code analysis, and deployment, cutting release turnaround and manual errors.",
        "Optimize UI performance and responsiveness through Swift concurrency, efficient animations, and careful memory management.",
      ],
      skills: ["Swift", "SwiftUI", "Coordinator Pattern", "Swift Concurrency", "CI/CD"],
    },
    {
      title: "Technical Team Lead / Mobile & Web Developer",
      company: "Forequest",
      url: "https://forequest.it/",
      location: "Italy (Remote)",
      period: "Apr 2023 – Apr 2025",
      description: [
        "Set the technical direction for a cross-functional team across mobile, web, and backend, from architecture decisions through release, and coordinated delivery between the teams.",
        "Led development of the Ludovico iOS app in SwiftUI; advanced animations and a smoother user experience improved user retention by 15%.",
        "Built the product's web frontend in Angular and TypeScript, sharing the same NestJS/Firebase backend and data models as the mobile apps.",
        "Designed and built the backend with NestJS and Firebase (Firestore, Cloud Functions, Storage, Analytics) on Google Cloud Platform for real-time, cloud-native data flow.",
        "Developed iOS (SwiftUI, ARKit) and Android (Jetpack Compose) AR apps, tuning rendering and UI responsiveness for smooth AR sessions.",
        "Implemented CI/CD pipelines for mobile and web, enabling continuous delivery across the stack.",
      ],
      skills: ["SwiftUI", "ARKit", "Jetpack Compose", "Angular", "TypeScript", "NestJS", "Firebase", "GCP", "CI/CD"],
    },
    {
      title: "Mobile Team Lead",
      company: "Boom",
      url: "https://www.boomlyapp.com/",
      location: "Australia (Remote)",
      period: "Sep 2021 – Sep 2023",
      description: [
        "Led iOS and Android development of a workout platform; performance work cut app load time by 35% and helped lift user engagement by 20%.",
        "Built the iOS app in SwiftUI and the Android app in Jetpack Compose on MVVM-C and MVI architectures, keeping both codebases maintainable and testable.",
        "Developed in-app image and video editing tools and image-processing features for a rich media experience.",
        "Established CI/CD pipelines to automate testing and streamline releases on both platforms.",
      ],
      skills: ["SwiftUI", "Jetpack Compose", "MVVM-C", "MVI", "CI/CD"],
    },
    {
      title: "Frontend Team Lead (Part-Time)",
      company: "Toolbox",
      url: "https://play.google.com/store/apps/details?id=ir.shahbaz.SHZToolBox_demo",
      location: "Tehran, Iran",
      period: "Jul 2022 – Sep 2023",
      description: [
        "Led the migration of the Android app (5M+ downloads on Google Play) from v5 to v6, adopting Android Jetpack and the Navigation Component to modernize the architecture and improve performance.",
        "Launched the web app and PWA versions of the product in Angular and TypeScript, extending the platform from Android-only to browser users.",
        "Set up a stable DevOps and CI environment that streamlined development and deployment.",
        "Drove new-feature development while keeping the migration seamless for existing users.",
      ],
      skills: ["Android Jetpack", "Navigation Component", "Angular", "TypeScript", "PWA", "DevOps"],
    },
    {
      title: "Mobile Team Lead",
      company: "Happy",
      url: "https://play.google.com/store/apps/details?id=io.joinhappy.android",
      location: "Australia (Remote)",
      period: "Jul 2020 – Jan 2022",
      description: [
        "Modernized the Android and iOS apps of a nanny-booking platform, noticeably improving performance and user experience.",
        "Refactored the legacy codebase, reducing maintenance overhead and setting up a scalable foundation for the app's long-term growth.",
      ],
      skills: ["Android", "iOS", "Performance Optimization", "Code Refactoring"],
    },
    {
      title: "Technical Team Lead & Mobile Developer",
      company: "Parsa",
      url: "http://parsadp.com/",
      location: "Tehran, Iran",
      period: "Jan 2015 – Jul 2020",
      description: [
        "Led development of a location-based SaaS framework that let service providers (taxi, courier, shopping) launch fully functional Android and iOS apps in under a week.",
        "Delivered online taxi and courier products on top of the framework, scaling the platform to 2,000,000+ users.",
        "Built and optimized the backend infrastructure supporting these apps for reliability and performance at scale.",
        "Led and mentored cross-functional teams through design, development, and deployment across Android and iOS.",
        "Developed the core Android solutions, improving system reliability and reducing operational costs.",
      ],
      skills: ["Android", "iOS", "Location-based Services", "SaaS", "Backend", "Team Leadership"],
    },
  ]

  // Display only the first 4 experiences initially
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 4)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
      <section id="experience" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Work Experience</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              My professional journey in mobile and web development.
            </p>
          </div>
          <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid gap-6 md:grid-cols-2"
          >
            {visibleExperiences.map((exp, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <CardTitle>{exp.title}</CardTitle>
                          <CardDescription>
                            <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {exp.company}
                            </a>{" "}
                            | {exp.location}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="shrink-0 whitespace-nowrap">
                          {exp.period}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        {exp.description.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary">
                              {skill}
                            </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}
          </motion.div>

          {!showAll && experiences.length > 4 && (
              <div className="flex justify-center mt-8">
                <Button onClick={() => setShowAll(true)} variant="outline" className="gap-2">
                  See More Experiences
                </Button>
              </div>
          )}

          {showAll && (
              <div className="flex justify-center mt-8">
                <Button onClick={() => setShowAll(false)} variant="outline" className="gap-2">
                  Show Less
                </Button>
              </div>
          )}
        </div>
      </section>
  )
}

