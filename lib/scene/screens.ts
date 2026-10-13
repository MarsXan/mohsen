// 2D canvas painters for everything shown on the phone's display.
// "home", "stack", "work" and "me" are the four tabs of the phone's own app; "home" and "call" are animated.
// Each job gets a small mock of the kind of app it was.

import { jobs, profile } from "@/lib/resume"

export const SCREEN_W = 600
export const SCREEN_H = 1300

export interface Fonts {
  sans: string
  display: string
  mono: string
}

export type ScreenKey = "home" | "stack" | "work" | "me" | "call" | "wallet" | "ar" | "workout" | "toolbox" | "nanny" | "ride"

type Ctx = CanvasRenderingContext2D
type Os = "ios" | "android"

const W = SCREEN_W
const H = SCREEN_H
const INK = "#0b1020"
const BLUE = "#2f7bff"
const GREEN = "#2fd58a"

function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2)
  c.beginPath()
  c.moveTo(x + k, y)
  c.arcTo(x + w, y, x + w, y + h, k)
  c.arcTo(x + w, y + h, x, y + h, k)
  c.arcTo(x, y + h, x, y, k)
  c.arcTo(x, y, x + w, y, k)
  c.closePath()
}

function box(c: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient) {
  rr(c, x, y, w, h, r)
  c.fillStyle = fill
  c.fill()
}

function outline(c: Ctx, x: number, y: number, w: number, h: number, r: number, stroke: string | CanvasGradient, lw = 2) {
  rr(c, x, y, w, h, r)
  c.strokeStyle = stroke
  c.lineWidth = lw
  c.stroke()
}

function dot(c: Ctx, x: number, y: number, r: number, fill: string | CanvasGradient) {
  c.beginPath()
  c.arc(x, y, r, 0, Math.PI * 2)
  c.fillStyle = fill
  c.fill()
}

function linear(c: Ctx, x0: number, y0: number, x1: number, y1: number, stops: string[]) {
  const g = c.createLinearGradient(x0, y0, x1, y1)
  stops.forEach((s, i) => g.addColorStop(stops.length === 1 ? 0 : i / (stops.length - 1), s))
  return g
}

function glow(c: Ctx, x: number, y: number, r: number, color: string) {
  const g = c.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, "rgba(0,0,0,0)")
  c.fillStyle = g
  c.fillRect(x - r, y - r, r * 2, r * 2)
}

export function createScreens(fonts: Fonts) {
  const font = (weight: number, size: number, family: keyof Fonts = "sans") => `${weight} ${size}px ${fonts[family]}`

  const text = (
    c: Ctx,
    s: string,
    x: number,
    y: number,
    f: string,
    color: string | CanvasGradient,
    align: CanvasTextAlign = "left",
  ) => {
    c.font = f
    c.fillStyle = color
    c.textAlign = align
    c.textBaseline = "alphabetic"
    c.fillText(s, x, y)
  }

  // Status bar, camera cut-out and home indicator, in the style of each platform.
  const chrome = (c: Ctx, os: Os, dark: boolean) => {
    const ink = dark ? "#ffffff" : INK
    text(c, os === "ios" ? "9:41" : "10:24", 54, 64, font(600, 27), ink)
    if (os === "ios") box(c, W / 2 - 80, 28, 160, 46, 23, "#000")
    else dot(c, W / 2, 52, 16, "#000")
    const x = W - 54
    outline(c, x - 46, 42, 42, 23, 7, ink, 2)
    box(c, x - 42, 46, 30, 15, 4, ink)
    box(c, x - 2, 49, 4, 9, 2, ink)
    for (let i = 0; i < 4; i++) box(c, x - 104 + i * 10, 60 - i * 5, 6, 5 + i * 5, 2, ink)
    const iw = os === "ios" ? 190 : 130
    box(c, W / 2 - iw / 2, H - 24, iw, os === "ios" ? 8 : 6, 4, dark ? "rgba(255,255,255,.85)" : "rgba(11,16,32,.8)")
  }

  const make = () => {
    const canvas = document.createElement("canvas")
    canvas.width = W
    canvas.height = H
    return canvas
  }

  const keys: ScreenKey[] = ["home", "stack", "work", "me", "call", "wallet", "ar", "workout", "toolbox", "nanny", "ride"]
  const canvases = Object.fromEntries(keys.map((k) => [k, make()])) as Record<ScreenKey, HTMLCanvasElement>
  const ctx = (k: ScreenKey) => canvases[k].getContext("2d") as Ctx

  // ---------------------------------------------------------------- the phone's own app

  const appBackdrop = (c: Ctx) => {
    c.fillStyle = linear(c, 0, 0, 0, H, ["#0a1028", "#101a44"])
    c.fillRect(0, 0, W, H)
    glow(c, W - 40, 120, 420, "rgba(47,123,255,.42)")
    glow(c, 20, 980, 460, "rgba(47,213,138,.2)")
    chrome(c, "ios", true)
  }

  // The four tabs. Their positions are mirrored by tabAt() below, which the scene uses for taps.
  const tabBar = (c: Ctx, active: number) => {
    box(c, 36, 1120, 528, 96, 36, "rgba(255,255,255,.07)")
    for (let i = 0; i < 4; i++) {
      const x = 36 + 66 + i * 132
      const on = i === active
      if (on) box(c, x - 44, 1140, 88, 56, 28, linear(c, x - 44, 0, x + 44, 0, [BLUE, GREEN]))
      const col = on ? "#fff" : "rgba(255,255,255,.55)"
      if (i === 0) {
        // Home: a house with a door
        c.beginPath()
        c.moveTo(x - 16, 1167)
        c.lineTo(x, 1153)
        c.lineTo(x + 16, 1167)
        c.lineTo(x + 11, 1167)
        c.lineTo(x + 11, 1182)
        c.lineTo(x - 11, 1182)
        c.lineTo(x - 11, 1167)
        c.closePath()
        c.lineJoin = "round"
        c.lineWidth = 3
        c.strokeStyle = col
        c.stroke()
        c.rect(x - 3.5, 1172, 7, 10)
        c.fillStyle = col
        c.fill("evenodd")
      } else if (i === 1) {
        text(c, "</>", x, 1177, font(700, 24, "mono"), col, "center")
      } else if (i === 2) {
        for (let k = 0; k < 3; k++) box(c, x - 15, 1155 + k * 10, 30, 5, 2, col)
      } else {
        dot(c, x, 1160, 8, col)
        box(c, x - 14, 1172, 28, 10, 5, col)
      }
    }
  }

  // ---------------------------------------------------------------- home

  type Tok = [string, "k" | "t" | "s" | "n" | "p"]
  const TOKEN_COLOR = { k: "#ff7ab2", t: "#6bdfff", s: "#ffa657", n: "#d9c97c", p: "#e6e9f5" }
  const SWIFT: Tok[][] = [
    [["struct ", "k"], ["Mohsen", "t"], [": ", "p"], ["MobileDeveloper", "t"], [" {", "p"]],
    [["  let ", "k"], ["years = ", "p"], ["10", "n"]],
    [["  let ", "k"], ["ships = [.iOS, .android]", "p"]],
    [["  let ", "k"], ["ui = [", "p"], ['"SwiftUI"', "s"], [", ", "p"], ['"Compose"', "s"], ["]", "p"]],
    [["  let ", "k"], ["ai = [", "p"], ['"LLMs"', "s"], [", ", "p"], ['"Claude Code"', "s"], ["]", "p"]],
    [],
    [["  func ", "k"], ["build() -> ", "p"], ["App", "t"], [" {", "p"]],
    [["    App", "t"], ["(clean: ", "p"], ["true", "k"], [", tested: ", "p"], ["true", "k"], [")", "p"]],
    [["  }", "p"]],
    [["}", "p"]],
  ]
  const KOTLIN: Tok[][] = [
    [["class ", "k"], ["Mohsen", "t"], [" : ", "p"], ["MobileDeveloper", "t"], [" {", "p"]],
    [["  val ", "k"], ["years = ", "p"], ["10", "n"]],
    [["  val ", "k"], ["ships = listOf(iOS, Android)", "p"]],
    [["  val ", "k"], ["ui = ", "p"], ['"Compose + SwiftUI"', "s"]],
    [["  val ", "k"], ["ai = ", "p"], ['"LLMs + Claude Code"', "s"]],
    [],
    [["  fun ", "k"], ["build() = ", "p"], ["App", "t"], ["(", "p"]],
    [["    clean = ", "p"], ["true", "k"], [", tested = ", "p"], ["true", "k"]],
    [["  )", "p"]],
    [["}", "p"]],
  ]
  const count = (code: Tok[][]) => code.reduce((n, line) => n + line.reduce((m, t) => m + t[0].length, 0) + 1, 0)
  const TYPE_SPEED = 30
  const HOLD = 2.8
  const swiftTime = count(SWIFT) / TYPE_SPEED + HOLD
  const kotlinTime = count(KOTLIN) / TYPE_SPEED + HOLD

  // `complete` shows the code fully typed, for visitors who prefer no animation.
  const home = (t: number, complete = false) => {
    const c = ctx("home")
    appBackdrop(c)

    text(c, "Hello, I'm", 48, 162, font(500, 30), "rgba(255,255,255,.72)")
    text(c, "Mohsen", 44, 250, font(800, 92, "display"), linear(c, 44, 0, 420, 0, ["#7fb2ff", "#49e3a4"]))
    text(c, profile.title, 48, 306, font(600, 31), "rgba(255,255,255,.94)")
    text(c, "iOS · Android · AI", 48, 344, font(500, 23, "mono"), "rgba(255,255,255,.62)")

    const stats: [string, string][] = [
      ["10+", "years"],
      ["5+", "leading"],
      ["2M+", "users"],
    ]
    stats.forEach(([value, label], i) => {
      const x = 44 + i * 174
      box(c, x, 380, 164, 100, 24, "rgba(255,255,255,.08)")
      outline(c, x, 380, 164, 100, 24, "rgba(255,255,255,.14)", 1.5)
      text(c, value, x + 20, 428, font(700, 38, "display"), "#fff")
      text(c, label, x + 20, 460, font(500, 20), "rgba(255,255,255,.62)")
    })

    // Code card: types the same person out in Swift, then in Kotlin.
    const phase = complete ? 0 : t % (swiftTime + kotlinTime)
    const isSwift = phase < swiftTime
    const code = isSwift ? SWIFT : KOTLIN
    const shown = complete ? count(code) : Math.floor((isSwift ? phase : phase - swiftTime) * TYPE_SPEED)

    box(c, 36, 520, 528, 560, 30, "#070b1d")
    outline(c, 36, 520, 528, 560, 30, "rgba(255,255,255,.12)", 1.5)
    const tabs: [string, string, boolean][] = [
      ["Mohsen.swift", "#f05138", isSwift],
      ["Mohsen.kt", "#7f52ff", !isSwift],
    ]
    let tx = 52
    tabs.forEach(([name, color, active]) => {
      c.font = font(500, 21, "mono")
      const w = c.measureText(name).width + 62
      if (active) box(c, tx, 534, w, 44, 14, "rgba(255,255,255,.1)")
      dot(c, tx + 22, 556, 7, color)
      text(c, name, tx + 40, 563, font(500, 21, "mono"), active ? "#fff" : "rgba(255,255,255,.5)")
      tx += w + 8
    })

    let left = shown
    let cx = 64
    let cy = 634
    c.font = font(500, 22, "mono")
    for (let li = 0; li < code.length && left >= 0; li++) {
      cx = 64
      for (const [str, kind] of code[li]) {
        const part = str.slice(0, Math.max(0, left))
        text(c, part, cx, cy, font(500, 22, "mono"), TOKEN_COLOR[kind])
        cx += c.measureText(part).width
        left -= str.length
        if (left < 0) break
      }
      if (left < 0 || li === code.length - 1) break
      left -= 1
      if (left >= 0) cy += 40
    }
    if (Math.floor(t * 2.2) % 2 === 0 || left < 0) box(c, cx + 2, cy - 22, 12, 27, 2, "#7fb2ff")

    tabBar(c, 0)
  }

  // ---------------------------------------------------------------- stack, work, me

  const stack = () => {
    const c = ctx("stack")
    appBackdrop(c)
    text(c, "What I build with", 48, 152, font(500, 26), "rgba(255,255,255,.68)")
    text(c, "Stack", 44, 228, font(800, 78, "display"), "#fff")
    const rows: [string, string, string][] = [
      ["iOS", "#0a84ff", "Swift · SwiftUI · UIKit · ARKit"],
      ["Android", "#3ddc84", "Kotlin · Jetpack Compose · Jetpack"],
      ["Flutter", "#54c5f8", "Dart · RxDart"],
      ["AI", "#ec4899", "LLMs · Claude Code · Agentic coding"],
      ["Architecture", "#7f52ff", "Clean Architecture · MVVM · MVI"],
      ["Backend", "#ffa000", "Node.js · NestJS · Firebase · GCP"],
    ]
    rows.forEach(([name, color, items], i) => {
      const y = 270 + i * 136
      box(c, 36, y, 528, 122, 26, "rgba(255,255,255,.07)")
      outline(c, 36, y, 528, 122, 26, "rgba(255,255,255,.1)", 1.5)
      box(c, 58, y + 26, 8, 70, 4, color)
      text(c, name, 86, y + 54, font(700, 29, "display"), "#fff")
      text(c, items, 86, y + 92, font(500, 21), "rgba(255,255,255,.68)")
    })
    tabBar(c, 1)
  }

  const work = () => {
    const c = ctx("work")
    appBackdrop(c)
    text(c, `10+ years, ${jobs.length} roles`, 48, 152, font(500, 26), "rgba(255,255,255,.68)")
    text(c, "Work", 44, 228, font(800, 78, "display"), "#fff")
    const top = 308
    const step = 134
    box(c, 68, top, 4, step * (jobs.length - 1), 2, "rgba(255,255,255,.16)")
    jobs.forEach((job, i) => {
      const y = top + i * step
      const years = job.period.match(/\d{4}/g) ?? []
      const span = `${years[0] ?? ""} – ${/present/i.test(job.period) ? "now" : (years[1] ?? "")}`
      if (i === 0) dot(c, 70, y, 18, "rgba(73,227,164,.28)")
      dot(c, 70, y, 10, i === 0 ? GREEN : "#8a94b8")
      text(c, job.company.split(" (")[0], 106, y + 10, font(700, 29, "display"), "#fff")
      text(c, span, 564, y + 8, font(500, 20, "mono"), "rgba(255,255,255,.55)", "right")
      text(c, job.product, 106, y + 46, font(500, 21), "rgba(255,255,255,.68)")
    })
    tabBar(c, 2)
  }

  const me = () => {
    const c = ctx("me")
    appBackdrop(c)
    dot(c, W / 2, 222, 78, linear(c, 222, 144, 378, 300, [BLUE, GREEN]))
    c.save()
    c.beginPath()
    c.arc(W / 2, 222, 78, 0, Math.PI * 2)
    c.clip()
    dot(c, W / 2, 204, 26, "rgba(255,255,255,.96)")
    dot(c, W / 2, 296, 50, "rgba(255,255,255,.96)")
    c.restore()
    text(c, profile.name, W / 2, 374, font(700, 48, "display"), "#fff", "center")
    text(c, profile.title, W / 2, 416, font(500, 26), "rgba(255,255,255,.72)", "center")
    box(c, W / 2 - 132, 440, 264, 52, 26, "rgba(255,255,255,.09)")
    dot(c, W / 2 - 102, 466, 7, GREEN)
    text(c, profile.availability, W / 2 + 12, 474, font(600, 22), "#fff", "center")

    const tail = (url: string) => url.replace(/\/$/, "").split("/").pop() ?? ""
    const rows: [string, string][] = [
      ["Email", profile.email],
      ["Phone", profile.phone],
      ["LinkedIn", `in/${tail(profile.links.linkedin)}`],
      ["GitHub", tail(profile.links.github)],
      ["Stack Overflow", tail(profile.links.stackoverflow)],
    ]
    rows.forEach(([label, value], i) => {
      const y = 528 + i * 108
      box(c, 36, y, 528, 96, 24, "rgba(255,255,255,.07)")
      text(c, label.toUpperCase(), 62, y + 38, font(500, 17, "mono"), "rgba(255,255,255,.5)")
      text(c, value, 62, y + 72, font(600, 24), "#fff")
      c.strokeStyle = "rgba(255,255,255,.4)"
      c.lineWidth = 3
      c.lineCap = "round"
      c.lineJoin = "round"
      c.beginPath()
      c.moveTo(526, y + 38)
      c.lineTo(536, y + 48)
      c.lineTo(526, y + 58)
      c.stroke()
    })
    tabBar(c, 3)
  }

  // ---------------------------------------------------------------- call

  const handset = (c: Ctx, x: number, y: number, angle: number) => {
    c.save()
    c.translate(x, y)
    c.rotate(angle)
    c.strokeStyle = "#fff"
    c.lineWidth = 12
    c.lineCap = "round"
    c.beginPath()
    c.arc(0, 26, 34, Math.PI * 1.22, Math.PI * 1.78)
    c.stroke()
    box(c, -36, -2, 20, 16, 6, "#fff")
    box(c, 16, -2, 20, 16, 6, "#fff")
    c.restore()
  }

  const call = (t: number) => {
    const c = ctx("call")
    c.fillStyle = linear(c, 0, 0, 0, H, ["#071226", "#0a2b33"])
    c.fillRect(0, 0, W, H)
    glow(c, W / 2, 430, 460, "rgba(47,213,138,.22)")
    chrome(c, "ios", true)
    text(c, "New opportunity", W / 2, 196, font(500, 27), "rgba(255,255,255,.68)", "center")

    for (let i = 0; i < 3; i++) {
      const k = (t * 0.45 + i / 3) % 1
      c.beginPath()
      c.arc(W / 2, 430, 100 + k * 150, 0, Math.PI * 2)
      c.strokeStyle = `rgba(73,227,164,${(1 - k) * 0.5})`
      c.lineWidth = 3
      c.stroke()
    }
    dot(c, W / 2, 430, 100, linear(c, 200, 330, 400, 530, [BLUE, GREEN]))
    text(c, "MM", W / 2, 458, font(800, 78, "display"), "#fff", "center")

    text(c, "Mohsen Mokhtari", W / 2, 652, font(700, 52, "display"), "#fff", "center")
    text(c, profile.title, W / 2, 700, font(500, 26), "rgba(255,255,255,.72)", "center")
    box(c, W / 2 - 132, 736, 264, 54, 27, "rgba(255,255,255,.09)")
    dot(c, W / 2 - 102, 763, 7, GREEN)
    text(c, "Open to remote", W / 2 + 12, 771, font(600, 22), "#fff", "center")

    const pulse = 1 + Math.sin(t * 5) * 0.06
    dot(c, 150, 1010, 58, "#ff4d5e")
    handset(c, 150, 1010, Math.PI * 0.75)
    dot(c, 450, 1010, 58 * pulse + 14, "rgba(47,213,138,.22)")
    dot(c, 450, 1010, 58 * pulse, GREEN)
    handset(c, 450, 1006, 0)
    text(c, "Later", 150, 1112, font(500, 22), "rgba(255,255,255,.75)", "center")
    text(c, "Say hello", 450, 1112, font(600, 22), "#fff", "center")
    text(c, "m.balestani@gmail.com", W / 2, 1200, font(500, 21, "mono"), "rgba(255,255,255,.5)", "center")
  }

  // ---------------------------------------------------------------- wallet (RTA)

  const wallet = () => {
    const c = ctx("wallet")
    c.fillStyle = "#f2f4fa"
    c.fillRect(0, 0, W, H)
    chrome(c, "ios", false)
    text(c, "Good morning", 44, 142, font(500, 25), "#6b7280")
    text(c, "Wallet", 42, 204, font(700, 60, "display"), INK)

    box(c, 44, 240, 512, 310, 40, linear(c, 44, 240, 556, 550, ["#101b52", BLUE, "#37d4a0"]))
    box(c, 84, 290, 66, 50, 10, "#f4d58d")
    c.strokeStyle = "rgba(11,16,32,.35)"
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(84, 315)
    c.lineTo(150, 315)
    c.moveTo(106, 290)
    c.lineTo(106, 340)
    c.moveTo(128, 290)
    c.lineTo(128, 340)
    c.stroke()
    c.strokeStyle = "rgba(255,255,255,.85)"
    c.lineWidth = 4
    c.lineCap = "round"
    for (let i = 0; i < 3; i++) {
      c.beginPath()
      c.arc(470, 315, 12 + i * 11, -Math.PI / 3.2, Math.PI / 3.2)
      c.stroke()
    }
    text(c, "••••  ••••  ••••  4821", 84, 432, font(500, 28, "mono"), "rgba(255,255,255,.95)")
    text(c, "MOHSEN MOKHTARI", 84, 504, font(600, 20), "rgba(255,255,255,.85)")
    text(c, "09/29", 516, 504, font(600, 20), "rgba(255,255,255,.85)", "right")

    text(c, "Balance", 44, 614, font(500, 24), "#6b7280")
    text(c, "$12,480.20", 42, 676, font(700, 56, "display"), INK)

    const actions = ["Send", "Pay", "Top up"]
    actions.forEach((label, i) => {
      const x = 44 + i * 174
      box(c, x, 712, 164, 64, 32, i === 0 ? INK : "#fff")
      if (i > 0) outline(c, x, 712, 164, 64, 32, "rgba(11,16,32,.1)", 2)
      text(c, label, x + 82, 753, font(600, 23), i === 0 ? "#fff" : INK, "center")
    })

    text(c, "Recent", 44, 842, font(600, 24), INK)
    const rows: [string, string, string, string][] = [
      ["Coffee Lab", "Today · Card", "−$4.80", "#ff9f5a"],
      ["Salary", "Mon · Transfer", "+$5,200.00", GREEN],
      ["Subscriptions", "Sun · Tap to pay", "−$12.99", "#8b7bff"],
    ]
    rows.forEach(([title, sub, amount, color], i) => {
      const y = 866 + i * 100
      box(c, 44, y, 512, 86, 24, "#fff")
      dot(c, 92, y + 43, 24, color)
      text(c, title, 134, y + 38, font(600, 23), INK)
      text(c, sub, 134, y + 66, font(500, 19), "#6b7280")
      text(c, amount, 532, y + 52, font(600, 23), amount.startsWith("+") ? "#0f9d63" : INK, "right")
    })

    box(c, W / 2 - 150, 1186, 300, 56, 28, "rgba(47,123,255,.12)")
    outline(c, W / 2 - 104, 1206, 20, 18, 4, BLUE, 3)
    c.beginPath()
    c.arc(W / 2 - 94, 1206, 7, Math.PI, 0)
    c.strokeStyle = BLUE
    c.lineWidth = 3
    c.stroke()
    text(c, "Secure payments", W / 2 + 18, 1222, font(600, 21), BLUE, "center")
  }

  // ---------------------------------------------------------------- ar (Forequest)

  const ar = () => {
    const c = ctx("ar")
    c.fillStyle = linear(c, 0, 0, 0, H, ["#202a3c", "#0b0f18"])
    c.fillRect(0, 0, W, H)
    glow(c, W / 2, 620, 520, "rgba(110,168,255,.16)")

    // Floor grid in perspective
    const vx = W / 2
    const vy = 540
    c.strokeStyle = "rgba(73,227,164,.32)"
    c.lineWidth = 2
    for (let x = -1500; x <= 2100; x += 150) {
      c.beginPath()
      c.moveTo(vx + (x - vx) * 0.04, vy + 60)
      c.lineTo(x, H)
      c.stroke()
    }
    for (let i = 0; i < 9; i++) {
      const y = vy + 60 + Math.pow(i / 8, 2.1) * (H - vy - 60)
      c.beginPath()
      c.moveTo(0, y)
      c.lineTo(W, y)
      c.stroke()
    }

    // A cube placed on the floor
    const cx0 = W / 2
    const cy0 = 800
    const s = 150
    const top: [number, number][] = [
      [cx0, cy0 - s * 1.55],
      [cx0 + s * 1.05, cy0 - s * 1.05],
      [cx0, cy0 - s * 0.55],
      [cx0 - s * 1.05, cy0 - s * 1.05],
    ]
    const base = top.map(([x, y]) => [x, y + s * 1.15] as [number, number])
    const face = (pts: [number, number][], fill: string | CanvasGradient) => {
      c.beginPath()
      pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))
      c.closePath()
      c.fillStyle = fill
      c.fill()
      c.strokeStyle = "#a9f5d4"
      c.lineWidth = 3
      c.lineJoin = "round"
      c.stroke()
    }
    c.save()
    c.shadowColor = "rgba(73,227,164,.8)"
    c.shadowBlur = 26
    face([top[3], top[2], base[2], base[3]], "rgba(47,123,255,.42)")
    face([top[2], top[1], base[1], base[2]], "rgba(47,213,138,.34)")
    face(top, "rgba(127,178,255,.5)")
    c.restore()
    ;[...top, base[1], base[2], base[3]].forEach(([x, y]) => dot(c, x, y, 7, "#fff"))
    box(c, cx0 + s * 1.05 + 14, cy0 - s * 0.62, 108, 40, 20, "rgba(0,0,0,.55)")
    text(c, "0.42 m", cx0 + s * 1.05 + 68, cy0 - s * 0.62 + 28, font(500, 20, "mono"), "#fff", "center")

    // Viewfinder
    c.strokeStyle = "rgba(255,255,255,.92)"
    c.lineWidth = 5
    c.lineCap = "round"
    const m = 44
    const L = 54
    const corners: [number, number, number, number][] = [
      [m, 300, 1, 1],
      [W - m, 300, -1, 1],
      [m, 1040, 1, -1],
      [W - m, 1040, -1, -1],
    ]
    corners.forEach(([x, y, dx, dy]) => {
      c.beginPath()
      c.moveTo(x + L * dx, y)
      c.lineTo(x, y)
      c.lineTo(x, y + L * dy)
      c.stroke()
    })

    chrome(c, "ios", true)
    text(c, "Ludovico", 44, 170, font(700, 46, "display"), "#fff")
    text(c, "Place · Scale · Rotate", 46, 210, font(500, 23), "rgba(255,255,255,.7)")
    box(c, W - 298, 236, 254, 44, 22, "rgba(0,0,0,.5)")
    dot(c, W - 274, 258, 7, "#ff4d5e")
    text(c, "Tracking · 60 fps", W - 256, 265, font(500, 19, "mono"), "#fff")

    for (let i = 0; i < 3; i++) {
      const x = 56 + i * 118
      box(c, x, 1076, 96, 96, 24, "rgba(255,255,255,.12)")
      if (i === 1) outline(c, x, 1076, 96, 96, 24, linear(c, x, 0, x + 96, 0, [BLUE, GREEN]), 5)
      const g = ["#ffb347", "#7fb2ff", "#ff7ab2"][i]
      if (i === 0) dot(c, x + 48, 1124, 24, g)
      else if (i === 1) box(c, x + 26, 1102, 44, 44, 8, g)
      else {
        c.beginPath()
        c.moveTo(x + 48, 1098)
        c.lineTo(x + 74, 1148)
        c.lineTo(x + 22, 1148)
        c.closePath()
        c.fillStyle = g
        c.fill()
      }
    }
    dot(c, W - 90, 1124, 40, "rgba(255,255,255,.95)")
    dot(c, W - 90, 1124, 31, "#0b0f18")
    dot(c, W - 90, 1124, 25, "#fff")
  }

  // ---------------------------------------------------------------- workout (Boom)

  const workout = () => {
    const c = ctx("workout")
    c.fillStyle = "#0d0d12"
    c.fillRect(0, 0, W, H)
    glow(c, W / 2, 430, 380, "rgba(255,122,69,.16)")
    chrome(c, "ios", true)
    text(c, "Week 12 · Day 3", 46, 142, font(500, 24), "rgba(255,255,255,.6)")
    text(c, "Today", 42, 206, font(700, 62, "display"), "#fff")

    const rings: [number, number, string | CanvasGradient][] = [
      [150, 0.82, linear(c, 150, 280, 450, 580, ["#ff7a45", "#ff3d81"])],
      [116, 0.64, "#49e3a4"],
      [82, 0.48, "#7fb2ff"],
    ]
    c.lineCap = "round"
    rings.forEach(([r, p, color]) => {
      c.lineWidth = 27
      c.strokeStyle = "rgba(255,255,255,.08)"
      c.beginPath()
      c.arc(W / 2, 440, r, 0, Math.PI * 2)
      c.stroke()
      c.strokeStyle = color
      c.beginPath()
      c.arc(W / 2, 440, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p)
      c.stroke()
    })
    text(c, "486", W / 2, 452, font(800, 50, "display"), "#fff", "center")
    text(c, "kcal", W / 2, 482, font(500, 21), "rgba(255,255,255,.6)", "center")

    box(c, 44, 640, 512, 148, 32, "#17171f")
    dot(c, 114, 714, 40, linear(c, 74, 674, 154, 754, ["#ff7a45", "#ff3d81"]))
    c.beginPath()
    c.moveTo(104, 696)
    c.lineTo(132, 714)
    c.lineTo(104, 732)
    c.closePath()
    c.fillStyle = "#fff"
    c.fill()
    text(c, "Full body HIIT", 178, 708, font(600, 28), "#fff")
    text(c, "32:15 · 12 exercises", 178, 744, font(500, 21), "rgba(255,255,255,.6)")

    const bars = [60, 112, 82, 140, 100, 52, 122]
    const days = ["M", "T", "W", "T", "F", "S", "S"]
    bars.forEach((h, i) => {
      const x = 62 + i * 70
      box(c, x, 980 - h, 44, h, 14, i === 3 ? linear(c, 0, 980 - h, 0, 980, ["#ff7a45", "#ff3d81"]) : "rgba(255,255,255,.14)")
      text(c, days[i], x + 22, 1012, font(500, 19), i === 3 ? "#fff" : "rgba(255,255,255,.55)", "center")
    })

    text(c, "Edit clip", 46, 1070, font(600, 22), "#fff")
    text(c, "0:08 / 0:24", 554, 1070, font(500, 19, "mono"), "rgba(255,255,255,.6)", "right")
    c.save()
    rr(c, 44, 1090, 512, 92, 18)
    c.clip()
    const cells = ["#3a2a52", "#56306a", "#8a3b6f", "#c44d69", "#e8734f", "#f2a65a"]
    cells.forEach((color, i) => {
      c.fillStyle = color
      c.fillRect(44 + i * 86, 1090, 86, 92)
    })
    c.fillStyle = "rgba(0,0,0,.55)"
    c.fillRect(44, 1090, 70, 92)
    c.fillRect(440, 1090, 116, 92)
    c.restore()
    outline(c, 114, 1090, 326, 92, 14, "#ffd60a", 7)
    box(c, 250, 1080, 5, 112, 2, "#fff")
  }

  // ---------------------------------------------------------------- toolbox

  const toolbox = () => {
    const c = ctx("toolbox")
    const purple = "#6750a4"
    const on = "#1c1b1f"
    c.fillStyle = "#f7f2fb"
    c.fillRect(0, 0, W, H)
    chrome(c, "android", false)
    text(c, "Toolbox", 44, 180, font(700, 50, "display"), on)
    dot(c, 520, 162, 30, "#eaddff")
    text(c, "M", 520, 172, font(700, 26), "#21005d", "center")
    c.strokeStyle = on
    c.lineWidth = 4
    c.lineCap = "round"
    c.beginPath()
    c.arc(436, 158, 14, 0, Math.PI * 2)
    c.moveTo(447, 169)
    c.lineTo(458, 180)
    c.stroke()

    let x = 44
    ;["All", "Measure", "Convert", "Scan"].forEach((label, i) => {
      c.font = font(600, 21)
      const w = c.measureText(label).width + 44
      if (i === 0) box(c, x, 220, w, 52, 14, purple)
      else outline(c, x, 220, w, 52, 14, "rgba(28,27,31,.3)", 2)
      text(c, label, x + w / 2, 254, font(600, 21), i === 0 ? "#fff" : on, "center")
      x += w + 12
    })

    const tools: [string, string][] = [
      ["Ruler", "#ffd8e4"],
      ["Compass", "#d3e3fd"],
      ["Level", "#c4eed0"],
      ["Flashlight", "#ffe08a"],
      ["QR scan", "#eaddff"],
      ["Calculator", "#ffdbcb"],
      ["Timer", "#c4eed0"],
      ["Sound", "#d3e3fd"],
      ["Magnifier", "#ffd8e4"],
    ]
    tools.forEach(([label, bg], i) => {
      const tx = 44 + (i % 3) * 176
      const ty = 304 + Math.floor(i / 3) * 192
      box(c, tx, ty, 160, 176, 28, bg)
      const gx = tx + 80
      const gy = ty + 72
      c.strokeStyle = on
      c.fillStyle = on
      c.lineWidth = 5
      c.lineCap = "round"
      c.lineJoin = "round"
      c.beginPath()
      if (i === 0) {
        c.save()
        c.translate(gx, gy)
        c.rotate(-0.5)
        outline(c, -40, -14, 80, 28, 6, on, 5)
        for (let k = -2; k <= 2; k++) {
          c.beginPath()
          c.moveTo(k * 14, -14)
          c.lineTo(k * 14, k % 2 ? -4 : 0)
          c.stroke()
        }
        c.restore()
      } else if (i === 1) {
        c.arc(gx, gy, 32, 0, Math.PI * 2)
        c.stroke()
        c.beginPath()
        c.moveTo(gx + 14, gy - 18)
        c.lineTo(gx + 6, gy + 6)
        c.lineTo(gx - 14, gy + 18)
        c.lineTo(gx - 6, gy - 6)
        c.closePath()
        c.fill()
      } else if (i === 2) {
        outline(c, gx - 40, gy - 16, 80, 32, 16, on, 5)
        dot(c, gx + 6, gy, 9, on)
      } else if (i === 3) {
        c.moveTo(gx - 22, gy - 34)
        c.lineTo(gx + 22, gy - 34)
        c.lineTo(gx + 12, gy - 10)
        c.lineTo(gx + 12, gy + 34)
        c.lineTo(gx - 12, gy + 34)
        c.lineTo(gx - 12, gy - 10)
        c.closePath()
        c.stroke()
        dot(c, gx, gy + 8, 5, on)
      } else if (i === 4) {
        ;[
          [-32, -32],
          [10, -32],
          [-32, 10],
        ].forEach(([dx, dy]) => outline(c, gx + dx, gy + dy, 22, 22, 4, on, 5))
        box(c, gx + 10, gy + 10, 9, 9, 2, on)
        box(c, gx + 24, gy + 24, 9, 9, 2, on)
      } else if (i === 5) {
        outline(c, gx - 28, gy - 36, 56, 72, 10, on, 5)
        box(c, gx - 16, gy - 24, 32, 14, 3, on)
        for (let k = 0; k < 4; k++) dot(c, gx - 10 + (k % 2) * 20, gy + 4 + Math.floor(k / 2) * 18, 4.5, on)
      } else if (i === 6) {
        c.arc(gx, gy + 4, 30, 0, Math.PI * 2)
        c.moveTo(gx, gy + 4)
        c.lineTo(gx, gy - 14)
        c.moveTo(gx - 10, gy - 36)
        c.lineTo(gx + 10, gy - 36)
        c.stroke()
      } else if (i === 7) {
        ;[18, 40, 60, 34, 22].forEach((h, k) => box(c, gx - 36 + k * 16, gy - h / 2, 8, h, 4, on))
      } else {
        c.arc(gx - 6, gy - 6, 24, 0, Math.PI * 2)
        c.moveTo(gx + 12, gy + 12)
        c.lineTo(gx + 32, gy + 32)
        c.stroke()
      }
      text(c, label, tx + 80, ty + 148, font(600, 21), on, "center")
    })

    box(c, 44, 892, 404, 112, 28, "#eaddff")
    text(c, "5M+", 72, 964, font(700, 50, "display"), "#21005d")
    text(c, "downloads", 204, 944, font(600, 22), "#21005d")
    text(c, "on Google Play", 204, 974, font(500, 20), "rgba(33,0,93,.7)")
    box(c, 464, 906, 92, 84, 26, purple)
    text(c, "v6", 510, 960, font(700, 32, "display"), "#fff", "center")

    box(c, 0, 1134, W, 166, 0, "#efe9f7")
    ;["Tools", "Saved", "Settings"].forEach((label, i) => {
      const nx = 100 + i * 200
      if (i === 0) box(c, nx - 52, 1154, 104, 48, 24, "#d9c8f5")
      if (i === 0) box(c, nx - 12, 1167, 24, 22, 5, on)
      else if (i === 1) {
        c.beginPath()
        c.moveTo(nx - 10, 1166)
        c.lineTo(nx + 10, 1166)
        c.lineTo(nx + 10, 1192)
        c.lineTo(nx, 1184)
        c.lineTo(nx - 10, 1192)
        c.closePath()
        c.strokeStyle = on
        c.lineWidth = 4
        c.stroke()
      } else {
        c.beginPath()
        c.arc(nx, 1178, 11, 0, Math.PI * 2)
        c.strokeStyle = on
        c.lineWidth = 4
        c.stroke()
        dot(c, nx, 1178, 3.5, on)
      }
      text(c, label, nx, 1234, font(i === 0 ? 700 : 500, 20), on, "center")
    })
    chrome(c, "android", false)
  }

  // ---------------------------------------------------------------- nanny (Happy)

  const nanny = () => {
    const c = ctx("nanny")
    const coral = "#ff7a59"
    const brown = "#2b1d12"
    c.fillStyle = "#fff8f1"
    c.fillRect(0, 0, W, H)
    glow(c, W - 30, 150, 300, "rgba(255,122,89,.2)")
    chrome(c, "android", false)
    text(c, "Find a nanny", 42, 186, font(700, 52, "display"), brown)
    text(c, "Trusted sitters near you", 44, 226, font(500, 24), "#8a7768")

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    days.forEach((d, i) => {
      const x = 44 + i * 104
      const active = i === 2
      box(c, x, 258, 94, 116, 26, active ? coral : "#fff")
      if (!active) outline(c, x, 258, 94, 116, 26, "rgba(43,29,18,.1)", 2)
      text(c, d, x + 47, 300, font(500, 21), active ? "rgba(255,255,255,.9)" : "#8a7768", "center")
      text(c, String(12 + i), x + 47, 346, font(700, 34, "display"), active ? "#fff" : brown, "center")
    })

    const sitters: [string, string, string, string][] = [
      ["Emma", "4.9 · 120 bookings", "#ffd9c7", "First aid"],
      ["Olivia", "4.8 · 86 bookings", "#d7e8ff", "Infants"],
      ["Sophie", "5.0 · 64 bookings", "#d9f2df", "Homework"],
    ]
    sitters.forEach(([name, meta, bg, tag], i) => {
      const y = 404 + i * 192
      c.save()
      c.shadowColor = "rgba(43,29,18,.1)"
      c.shadowBlur = 30
      c.shadowOffsetY = 10
      box(c, 44, y, 512, 172, 32, "#fff")
      c.restore()
      dot(c, 112, y + 70, 44, bg)
      text(c, name[0], 112, y + 84, font(700, 40, "display"), brown, "center")
      text(c, name, 176, y + 62, font(600, 29), brown)
      text(c, "★", 176, y + 98, font(600, 22), "#f5a623")
      text(c, meta, 204, y + 98, font(500, 21), "#8a7768")
      c.font = font(600, 19)
      const tw = c.measureText(tag).width + 32
      box(c, 176, y + 116, tw, 38, 19, "#fff1e8")
      text(c, tag, 176 + tw / 2, y + 142, font(600, 19), "#c2532f", "center")
      box(c, 424, y + 56, 108, 56, 28, i === 0 ? coral : "#fff1e8")
      text(c, "Book", 478, y + 92, font(600, 22), i === 0 ? "#fff" : "#c2532f", "center")
    })

    text(c, "Tonight · 6:00 – 10:00 PM", 46, 1030, font(500, 23), "#8a7768")
    box(c, 44, 1056, 512, 88, 44, brown)
    text(c, "Request booking", W / 2, 1110, font(600, 26), "#fff", "center")
    for (let i = 0; i < 4; i++) {
      const nx = 96 + i * 136
      if (i === 0) dot(c, nx, 1208, 13, coral)
      else {
        c.beginPath()
        c.arc(nx, 1208, 11, 0, Math.PI * 2)
        c.strokeStyle = "rgba(43,29,18,.4)"
        c.lineWidth = 4
        c.stroke()
      }
    }
  }

  // ---------------------------------------------------------------- ride (Parsa)

  const ride = () => {
    const c = ctx("ride")
    c.fillStyle = "#e7ecf3"
    c.fillRect(0, 0, W, H)
    c.save()
    c.translate(W / 2, 520)
    c.rotate(-0.21)
    c.translate(-W / 2, -520)
    box(c, -80, 120, 250, 210, 30, "#cfe8d4")
    box(c, 380, 560, 330, 230, 30, "#cfe8d4")
    box(c, 420, -60, 320, 220, 40, "#cbe1f6")
    c.strokeStyle = "#fff"
    c.lineCap = "round"
    c.lineWidth = 30
    ;[80, 400, 720].forEach((y) => {
      c.beginPath()
      c.moveTo(-200, y)
      c.lineTo(W + 200, y)
      c.stroke()
    })
    ;[200, 380].forEach((x) => {
      c.beginPath()
      c.moveTo(x, -200)
      c.lineTo(x, 1100)
      c.stroke()
    })
    c.lineWidth = 14
    ;[240, 560, 880].forEach((y) => {
      c.beginPath()
      c.moveTo(-200, y)
      c.lineTo(W + 200, y)
      c.stroke()
    })
    ;[60, 540].forEach((x) => {
      c.beginPath()
      c.moveTo(x, -200)
      c.lineTo(x, 1100)
      c.stroke()
    })

    // Route along the main roads
    const route: [number, number][] = [
      [200, 820],
      [200, 560],
      [380, 560],
      [380, 400],
      [540, 400],
    ]
    const path = () => {
      c.beginPath()
      route.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))
    }
    c.lineJoin = "round"
    path()
    c.strokeStyle = "#fff"
    c.lineWidth = 22
    c.stroke()
    path()
    c.strokeStyle = linear(c, 200, 820, 540, 400, [BLUE, GREEN])
    c.lineWidth = 12
    c.stroke()
    dot(c, 200, 820, 20, "#fff")
    dot(c, 200, 820, 12, BLUE)
    // Car, part-way along
    c.save()
    c.translate(290, 560)
    box(c, -34, -19, 68, 38, 12, INK)
    box(c, 4, -13, 16, 26, 5, "#7fb2ff")
    c.restore()
    // Destination pin
    c.save()
    c.translate(540, 400)
    c.rotate(0.21)
    c.beginPath()
    c.moveTo(0, 0)
    c.bezierCurveTo(-34, -40, -30, -84, 0, -84)
    c.bezierCurveTo(30, -84, 34, -40, 0, 0)
    c.fillStyle = "#12b76a"
    c.fill()
    dot(c, 0, -54, 11, "#fff")
    c.restore()
    c.restore()

    chrome(c, "android", false)
    c.save()
    c.shadowColor = "rgba(11,16,32,.16)"
    c.shadowBlur = 30
    c.shadowOffsetY = 10
    box(c, 44, 104, 512, 78, 39, "#fff")
    c.restore()
    dot(c, 88, 143, 9, GREEN)
    text(c, "Where to?", 116, 152, font(600, 26), INK)
    let sx = 44
    ;["Taxi", "Courier", "Shopping"].forEach((label, i) => {
      c.font = font(600, 21)
      const w = c.measureText(label).width + 48
      box(c, sx, 202, w, 52, 26, i === 0 ? INK : "#fff")
      text(c, label, sx + w / 2, 236, font(600, 21), i === 0 ? "#fff" : INK, "center")
      sx += w + 10
    })

    c.save()
    c.shadowColor = "rgba(11,16,32,.18)"
    c.shadowBlur = 40
    c.shadowOffsetY = -8
    box(c, 0, 876, W, H - 876 + 60, 46, "#fff")
    c.restore()
    box(c, W / 2 - 30, 894, 60, 7, 4, "rgba(11,16,32,.18)")
    text(c, "Driver arriving in", 44, 956, font(500, 23), "#6b7280")
    text(c, "3 min", 42, 1024, font(700, 62, "display"), INK)
    box(c, 372, 968, 184, 58, 29, "#eef2f8")
    text(c, "24B 317", 464, 1006, font(600, 23, "mono"), INK, "center")
    box(c, 44, 1056, 512, 10, 5, "#eef2f8")
    box(c, 44, 1056, 320, 10, 5, linear(c, 44, 0, 364, 0, [BLUE, GREEN]))
    dot(c, 84, 1128, 34, "#d7e8ff")
    text(c, "R", 84, 1140, font(700, 30, "display"), INK, "center")
    text(c, "Reza", 136, 1122, font(600, 26), INK)
    text(c, "★ 4.9 · White sedan", 136, 1154, font(500, 20), "#6b7280")
    box(c, 404, 1098, 152, 60, 30, INK)
    text(c, "Contact", 480, 1137, font(600, 22), "#fff", "center")
    text(c, "Trusted by 2,000,000+ users", W / 2, 1226, font(500, 20), "#6b7280", "center")
  }

  const paintStatic = (complete = false) => {
    wallet()
    ar()
    workout()
    toolbox()
    nanny()
    ride()
    stack()
    work()
    me()
    home(0, complete)
    call(0)
  }

  return { canvases, paintStatic, home, call }
}

export type Screens = ReturnType<typeof createScreens>

// Which of the four tabs sits under a point of the screen canvas, or -1. Generous above and below the bar.
export function tabAt(x: number, y: number) {
  if (y < 1086 || y > 1262 || x < 36 || x > 564) return -1
  return Math.min(3, Math.floor((x - 36) / 132))
}
