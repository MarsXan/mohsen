// All site content lives here, taken from the resume. The 3D scene reads the same data.

export const profile = {
  name: "Mohsen Mokhtari",
  firstName: "Mohsen",
  lastName: "Mokhtari",
  title: "Mobile Developer",
  platforms: ["iOS", "Android", "Flutter", "AI & LLMs"],
  tagline: "I build iOS and Android apps, lead the teams that ship them, and work hands-on with AI and LLMs.",
  location: "Tehran, Iran",
  availability: "Open to remote",
  email: "m.balestani@gmail.com",
  phone: "+98 935 336 1996",
  phoneHref: "tel:+989353361996",
  links: {
    linkedin: "https://www.linkedin.com/in/mohsen-mokhtari",
    github: "https://github.com/MarsXan",
    stackoverflow: "https://stackoverflow.com/users/5892896/mohsen-mokhtari",
  },
}

export const about = {
  heading: "Native on both platforms. Comfortable across the stack.",
  paragraphs: [
    "I'm a mobile developer with 10+ years building Android and iOS applications and 5+ years leading cross-functional teams for companies in Australia, Italy, and Iran.",
    "I have deep native experience in Swift/SwiftUI and Kotlin/Jetpack Compose. I'm comfortable owning the full stack when needed, with Node.js/NestJS backends on Google Cloud and Firebase behind products serving 2,000,000+ users.",
    "I also have extensive hands-on experience with AI, working with LLMs and agentic coding tools such as Claude Code.",
    "I'm known for clean, testable architecture (Clean Architecture, MVVM, MVI), CI/CD automation, and mentoring developers in fast-paced agile environments.",
  ],

  stats: [
    { value: "10+", label: "years building apps" },
    { value: "5+", label: "years leading teams" },
    { value: "2M+", label: "users served" },
    { value: "3", label: "countries: Australia, Italy, Iran" },
  ],
  facts: [
    { label: "Education", value: "Master's in Computer Software Engineering, Islamic Azad University, Tehran (2017 – 2020)" },
    { label: "Languages", value: "Persian (native) · Azerbaijani (native) · English (professional)" },
    { label: "Based in", value: "Tehran, Iran (open to remote)" },
  ],
}

// One entry per phone part. `part` names the 3D layer that lights up for this card.
export type PartKey = "display" | "glass" | "frame" | "board" | "battery" | "back"

export interface SkillLayer {
  part: PartKey
  partLabel: string
  title: string
  blurb: string
  groups: { name?: string; items: string[] }[]
}

export const skillLayers: SkillLayer[] = [
  {
    part: "display",
    partLabel: "Display",
    title: "Mobile",
    blurb: "The part people touch. Native on both platforms, plus Flutter for cross-platform work.",
    groups: [
      { name: "iOS", items: ["Swift", "SwiftUI", "UIKit", "ARKit"] },
      { name: "Android", items: ["Kotlin", "Jetpack Compose", "Android Jetpack", "Navigation Component"] },
      { name: "Flutter", items: ["Dart", "RxDart"] },
    ],
  },
  {
    part: "board",
    partLabel: "Logic board",
    title: "AI & LLMs",
    blurb: "The chip that does the thinking. Extensive hands-on work with LLMs and agentic coding tools.",
    groups: [{ items: ["Claude Code", "LLMs", "AI-assisted development", "Agentic coding"] }],
  },
  {
    part: "frame",
    partLabel: "Frame",
    title: "Architecture",
    blurb: "The structure everything else hangs on.",
    groups: [
      {
        items: [
          "Clean Architecture",
          "MVVM / MVVM-C",
          "MVI",
          "VIPER",
          "Coordinator pattern",
          "Modular design",
          "Microservices",
        ],
      },
    ],
  },
  {
    part: "glass",
    partLabel: "Cover glass",
    title: "Engineering Practices",
    blurb: "What protects the product, release after release.",
    groups: [
      {
        items: [
          "CI/CD",
          "Jenkins",
          "GitLab CI",
          "Automated testing",
          "Git",
          "Code review",
          "Performance optimization",
          "Agile / Scrum",
        ],
      },
    ],
  },
  {
    part: "battery",
    partLabel: "Battery",
    title: "Full Stack",
    blurb: "What powers the apps, when the product needs more than the client.",
    groups: [
      {
        name: "Backend & Cloud",
        items: [
          "Node.js",
          "NestJS",
          "REST APIs",
          "WebSockets",
          "Firebase",
          "Google Cloud Platform",
          "Firestore",
          "Cloud Functions",
          "Cloud Storage",
          "Redis",
          "SQL & NoSQL",
        ],
      },
      { name: "Web", items: ["Angular", "TypeScript", "RxJS", "HTML5 / CSS3", "PWA", "Responsive UI"] },
    ],
  },
  {
    part: "back",
    partLabel: "Camera",
    title: "Leadership",
    blurb: "The lens that sets the direction.",
    groups: [
      {
        items: [
          "5+ years leading teams",
          "Technical direction",
          "Cross-functional delivery",
          "Mentoring developers",
        ],
      },
    ],
  },
]

// `tiles` are the floating tech tiles shown next to the phone for this job; `screen` picks the app mock on the phone.
export type TileKey =
  | "ios"
  | "swift"
  | "swiftui"
  | "arkit"
  | "android"
  | "kotlin"
  | "compose"
  | "flutter"
  | "nest"
  | "firebase"
  | "llm"
  | "claude"

export interface Job {
  title: string
  company: string
  url: string
  location: string
  period: string
  product: string
  screen: "wallet" | "ar" | "workout" | "toolbox" | "nanny" | "ride"
  tiles: TileKey[]
  description: string[]
  skills: string[]
}

export const jobs: Job[] = [
  {
    title: "Senior Mobile Engineer",
    company: "RTA (Round Table Apps)",
    url: "https://roundtableapps.com/",
    location: "Australia (Remote)",
    period: "Apr 2025 – Present",
    product: "Banking, payments, chat and games",
    screen: "wallet",
    tiles: ["ios", "swift", "swiftui"],
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
    product: "Ludovico and AR apps",
    screen: "ar",
    tiles: ["swiftui", "arkit", "compose", "nest", "firebase"],
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
    product: "Workout platform",
    screen: "workout",
    tiles: ["ios", "android", "swiftui", "compose"],
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
    product: "Android app with 5M+ downloads",
    screen: "toolbox",
    tiles: ["android"],
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
    product: "Nanny-booking platform",
    screen: "nanny",
    tiles: ["android", "ios"],
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
    product: "Taxi, courier and shopping apps",
    screen: "ride",
    tiles: ["android", "ios"],
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

export interface Project {
  title: string
  description: string
  technologies: string[]
  icon: "spade" | "heart" | "chart" | "package" | "timer" | "cloud" | "shield"
  link?: { href: string; label: string }
}

export const projects: Project[] = [
  {
    title: "FunCards",
    description:
      "Online card-game platform, starting with Hokm Master: live Persian Hokm with real players, private rooms, weekly tournaments and seasonal leaderboards. Plays on Android, iPhone and in the browser.",
    technologies: ["Android", "iOS", "Web", "Real-time multiplayer"],
    icon: "spade",
    link: { href: "https://funcards.fun/en/", label: "Visit funcards.fun" },
  },
  {
    title: "Yass",
    description:
      "Donation apps for Android, iOS, and web built with Flutter/Dart, Kotlin, and Swift, using RxDart, Firebase, and a role-based clean architecture.",
    technologies: ["Flutter", "Dart", "Kotlin", "Swift", "RxDart", "Firebase"],
    icon: "heart",
  },
  {
    title: "Crypto Arbitrage Detector",
    description:
      "Real-time arbitrage detection tool with a NestJS backend, Angular frontend, and Redis, generating live alerts on opportunities.",
    technologies: ["NestJS", "Angular", "Redis"],
    icon: "chart",
  },
  {
    title: "AirBox (Online Air Mail)",
    description:
      "Cross-platform Android/iOS app for sending and receiving packages by drone, with real-time tracking, notifications, and delivery management.",
    technologies: ["Android", "iOS", "Real-time Tracking"],
    icon: "package",
  },
  {
    title: "Time-Tracking App",
    description:
      "Time Doctor–style productivity monitor built on NestJS with WebSocket-based real-time session tracking.",
    technologies: ["NestJS", "WebSocket", "React"],
    icon: "timer",
  },
  {
    title: "Fog Computing Simulator",
    description:
      "Java/Kotlin toolkit for simulating fog/edge computing scenarios with machine-learning-based optimization.",
    technologies: ["Java", "Kotlin", "Machine Learning"],
    icon: "cloud",
  },
  {
    title: "Android Malware Detector",
    description:
      "Collaborative machine-learning project for detecting Android malware, outperforming traditional detection methods.",
    technologies: ["Android", "Machine Learning"],
    icon: "shield",
  },
]

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
]
