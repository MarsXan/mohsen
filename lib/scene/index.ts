import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { jobs, skillLayers, type PartKey } from "@/lib/resume"
import { createDrone } from "./drone"
import { clamp, damp, easeInOut, easeOut, lerp, smooth } from "./math"
import { canvasTexture, createPhone, PHONE_H, PHONE_W } from "./phone"
import { createScreens, SCREEN_H, SCREEN_W, tabAt, type Fonts, type ScreenKey } from "./screens"
import { stageState } from "./state"
import { createTiles, TILE_SIZE } from "./tiles"

// One fixed canvas behind the page. Every section has an empty [data-anchor] element that says where
// the phone should sit while that section is on screen; the scene follows those anchors as you scroll.

type SectionName = "hero" | "about" | "skills" | "experience" | "projects" | "contact"
const ORDER: SectionName[] = ["hero", "about", "skills", "experience", "projects", "contact"]
const PARTS: PartKey[] = ["glass", "display", "frame", "board", "battery", "back"]
// The phone's own app has four tabs, each a screen.
const TABS: ScreenKey[] = ["home", "stack", "work", "me"]

const FOV = 26
const CAMERA_Z = 12
const TURN = Math.PI * 2

interface Pose {
  x: number
  y: number
  scale: number
  rx: number
  ry: number
  rz: number
  explode: number
  shadow: number
  glow: number
}

interface Spot {
  x: number
  y: number
  z: number
  s: number
}

// Where each tile sits around the phone in the hero, in phone-heights from its centre.
const CONSTELLATION: [number, number, number][] = [
  [-0.43, 0.4, 0.2],
  [0.5, 0.34, -0.15],
  [-0.55, 0.06, -0.1],
  [0.53, 0.02, 0.1],
  [-0.42, -0.36, 0.2],
  [0.5, -0.34, -0.2],
  [-0.14, 0.62, -0.25],
  [0.3, 0.62, 0.1],
  [-0.2, -0.63, -0.1],
  [0.3, -0.63, 0.2],
  [-0.5, 0.66, -0.3],
  [0.62, 0.58, -0.3],
]

const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  scale: lerp(a.scale, b.scale, t),
  rx: lerp(a.rx, b.rx, t),
  ry: lerp(a.ry, b.ry, t),
  rz: lerp(a.rz, b.rz, t),
  explode: lerp(a.explode, b.explode, t),
  shadow: lerp(a.shadow, b.shadow, t),
  glow: lerp(a.glow, b.glow, t),
})

function radialTexture(inner: string, outer: string) {
  return canvasTexture(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, inner)
    g.addColorStop(1, outer)
    c.fillStyle = g
    c.fillRect(0, 0, 128, 128)
  })
}

export function createStage(canvas: HTMLCanvasElement) {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const css = getComputedStyle(document.documentElement)
  const family = (name: string, generic: string) => {
    const value = css.getPropertyValue(name).trim()
    return value ? `${value}, ${generic}` : generic
  }
  const fonts: Fonts = {
    sans: family("--font-sans", "system-ui, sans-serif"),
    display: family("--font-display", "system-ui, sans-serif"),
    mono: family("--font-mono", "ui-monospace, monospace"),
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = environment.texture
  scene.environmentIntensity = 0.85

  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 60)
  camera.position.set(0, 0, CAMERA_Z)

  const key = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(3, 5, 6)
  const rim = new THREE.DirectionalLight(0x7fb2ff, 1.4)
  rim.position.set(-5, 2, -4)
  scene.add(key, rim)

  // ---- Actors
  const screens = createScreens(fonts)
  screens.paintStatic(calm)
  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  const textures = Object.fromEntries(
    Object.entries(screens.canvases).map(([name, source]) => {
      const texture = new THREE.CanvasTexture(source)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = anisotropy
      return [name, texture]
    }),
  ) as Record<ScreenKey, THREE.CanvasTexture>

  const phone = createPhone(textures.home, fonts)
  scene.add(phone.root)

  const tiles = createTiles(fonts)
  for (const tile of tiles) scene.add(tile.group)

  const drone = createDrone(fonts)
  drone.root.scale.setScalar(0.0001)
  scene.add(drone.root)

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: radialTexture("rgba(11,16,32,.55)", "rgba(11,16,32,0)"), transparent: true, depthWrite: false, opacity: 0 }),
  )
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: radialTexture("rgba(47,123,255,.55)", "rgba(47,123,255,0)"),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    }),
  )
  shadow.renderOrder = -2
  halo.renderOrder = -3
  scene.add(shadow, halo)

  // Fonts load after first paint; redraw anything that holds text once they are in.
  let disposed = false
  const repaint = () => {
    if (disposed) return
    screens.paintStatic(calm)
    for (const texture of Object.values(textures)) texture.needsUpdate = true
  }
  if (document.fonts) {
    Promise.all([
      document.fonts.load(`800 60px ${fonts.display}`),
      document.fonts.load(`700 40px ${fonts.display}`),
      document.fonts.load(`500 24px ${fonts.sans}`),
      document.fonts.load(`600 24px ${fonts.sans}`),
      document.fonts.load(`500 22px ${fonts.mono}`),
    ])
      .then(repaint)
      .catch(() => {})
  }

  // ---- Page measurements
  const view = { w: 0, h: 0, ratio: 0, upp: 1, visH: 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z }
  let sections: { name: SectionName; el: HTMLElement; anchor: HTMLElement | null }[] = []
  let cards: HTMLElement[] = []
  const connector = document.getElementById("stage-connector")
  const connectorPath = connector?.querySelector("path") ?? null
  const connectorDot = connector?.querySelector("circle") ?? null

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    if (w !== view.w || h !== view.h || ratio !== view.ratio) {
      renderer.setPixelRatio(ratio)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      view.w = w
      view.h = h
      view.ratio = ratio
      view.upp = view.visH / h
    }
    sections = []
    for (const name of ORDER) {
      const el = document.querySelector<HTMLElement>(`[data-scene="${name}"]`)
      if (!el) continue
      const anchors = Array.from(el.querySelectorAll<HTMLElement>("[data-anchor]"))
      sections.push({ name, el, anchor: anchors.find((a) => a.offsetWidth > 0 && a.offsetHeight > 0) ?? null })
    }
    cards = Array.from(document.querySelectorAll<HTMLElement>("[data-skill-card]"))
  }

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  // Dragging the phone with the mouse spins it; on release it settles facing front again.
  const drag = { active: false, lastX: 0, lastY: 0, travel: 0, endedAt: 0, yaw: 0, pitch: 0, yawS: 0, pitchS: 0 }
  const root = document.documentElement
  const nearPhone = (x: number, y: number) => {
    if (now.scale < 0.02 || now.explode > 0.2) return false
    const height = (now.scale * PHONE_H) / view.upp
    const cx = now.x / view.upp + view.w / 2
    const cy = view.h / 2 - now.y / view.upp
    return Math.abs(x - cx) < height * 0.3 && Math.abs(y - cy) < height * 0.54
  }
  const onControl = (e: Event) => Boolean((e.target as Element | null)?.closest?.("a, button"))
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType === "touch") return
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    if (drag.active) {
      const dx = e.clientX - drag.lastX
      const dy = e.clientY - drag.lastY
      drag.travel += Math.abs(dx) + Math.abs(dy)
      drag.yaw += dx * 0.011
      drag.pitch = clamp(drag.pitch + dy * 0.005, -0.5, 0.5)
      drag.lastX = e.clientX
      drag.lastY = e.clientY
    } else {
      const over = nearPhone(e.clientX, e.clientY) && !onControl(e)
      const onTab = over && tabUnder(e.clientX, e.clientY) >= 0
      root.classList.toggle("can-tap", onTab)
      root.classList.toggle("can-grab", over && !onTab && !calm)
    }
  }
  const onDown = (e: PointerEvent) => {
    if (calm || e.pointerType === "touch" || e.button !== 0 || onControl(e) || !nearPhone(e.clientX, e.clientY)) return
    e.preventDefault()
    Object.assign(drag, { active: true, lastX: e.clientX, lastY: e.clientY, travel: 0 })
    root.classList.add("is-grabbing")
  }
  const onUp = () => {
    if (!drag.active) return
    drag.active = false
    if (drag.travel > 6) drag.endedAt = performance.now()
    drag.yaw = Math.round(drag.yaw / TURN) * TURN
    drag.pitch = 0
    root.classList.remove("is-grabbing")
  }
  // A click or tap on one of the tabs at the bottom of the phone's screen switches its app.
  const onClick = (e: MouseEvent) => {
    if (onControl(e) || performance.now() - drag.endedAt < 300) return
    const i = tabUnder(e.clientX, e.clientY)
    if (i >= 0) selectTab(i)
  }

  // ---- Screen changes: the phone spins once and comes back showing the next app.
  let shown: ScreenKey = "home"
  let queued: ScreenKey | null = null
  const spin = { active: false, t: 0, dir: 1, to: "home" as ScreenKey, swapped: false, angle: 0 }
  const showScreen = (next: ScreenKey, visible: boolean, dir: number) => {
    if (spin.active) {
      if (spin.swapped) queued = next
      else spin.to = next
      return
    }
    if (next === shown) return
    if (calm || !visible) {
      shown = next
      phone.setScreen(textures[next])
      return
    }
    Object.assign(spin, { active: true, t: 0, dir, to: next, swapped: false })
  }

  // ---- The phone's own tab bar: find the tab under a point on the page by casting a ray at the screen.
  let tab = 0
  let kick = 0
  const ray = new THREE.Raycaster()
  const aim = new THREE.Vector2()
  const tabUnder = (x: number, y: number) => {
    if (spin.active || !TABS.includes(shown) || now.scale < 0.02 || now.explode > 0.2) return -1
    aim.set((x / view.w) * 2 - 1, 1 - (y / view.h) * 2)
    ray.setFromCamera(aim, camera)
    phone.root.updateMatrixWorld(true)
    const uv = ray.intersectObject(phone.screen, false)[0]?.uv
    return uv ? tabAt(uv.x * SCREEN_W, (1 - uv.y) * SCREEN_H) : -1
  }
  const selectTab = (i: number) => {
    tab = i
    shown = TABS[i]
    phone.setScreen(textures[shown])
    kick = 1
  }

  // ---- Current (smoothed) state
  const now: Pose = { x: 0, y: 0, scale: 0.0001, rx: 0, ry: 0, rz: 0, explode: 0, shadow: 0, glow: 0 }
  const highlight = Object.fromEntries(PARTS.map((p) => [p, 0])) as Record<PartKey, number>
  const dronePos = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  let droneScale = 0
  let time = 0
  let last = performance.now()
  let lastPaint = 0
  let lastJob = stageState.job
  let started = false
  let raf = 0

  const frame = (stamp: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (stamp - last) / 1000)
    last = stamp
    time += dt
    if (!sections.length) return
    const motion = calm ? 0 : time
    pointer.sx = calm ? 0 : damp(pointer.sx, pointer.x, 5, dt)
    pointer.sy = calm ? 0 : damp(pointer.sy, pointer.y, 5, dt)

    // Where are we on the page? `s` runs 0…n-1 across the sections, easing through each boundary.
    const vh = window.innerHeight
    const focal = vh / 2
    const bandPx = vh * 0.7
    const rects = sections.map((sec) => sec.el.getBoundingClientRect())
    let s = 0
    for (let j = 0; j < sections.length - 1; j++) s += smooth(clamp((focal - (rects[j].bottom - bandPx / 2)) / bandPx))
    const a = Math.min(sections.length - 1, Math.floor(s))
    const b = Math.min(sections.length - 1, a + 1)
    const f = s - a
    const compact = view.w < 1024
    const boxes = sections.map((sec) => sec.anchor?.getBoundingClientRect() ?? null)
    const activePart = skillLayers[stageState.skill]?.part

    const poseOf = (i: number): Pose => {
      const rect = rects[i]
      const t = clamp((focal - rect.top) / Math.max(1, rect.height))
      const box = boxes[i]
      const aw = box ? box.width : view.w
      const ah = box ? box.height : vh
      const cx = box ? box.left + aw / 2 : view.w / 2
      const cy = box ? box.top + ah / 2 : vh / 2
      const x = (cx - view.w / 2) * view.upp
      const y = -(cy - view.h / 2) * view.upp
      // Phone height in px that fits the anchor, as a scale for the model.
      const fit = (kh: number, kw: number) => (Math.min(ah * kh, (aw * kw * PHONE_H) / PHONE_W) * view.upp) / PHONE_H
      const base = { x, y, explode: 0, shadow: 1, glow: 0 }
      const name = sections[i].name
      switch (name) {
        case "hero": {
          const u = clamp((t - 0.5) * 2)
          return { ...base, scale: fit(0.76, 0.6), rx: 0.1 - u * 0.2, ry: -0.5 + u * 1.2, rz: 0.07 }
        }
        case "about":
          return { ...base, scale: fit(0.72, 0.56), rx: 0.06, ry: Math.PI + 0.55 - t * 0.5, rz: 0.05 }
        case "skills": {
          const wide = aw > ah * 1.15
          const unit = wide ? Math.min((ah * 0.9) / 1.32, (aw * 0.84) / 1.62) : Math.min((ah * 0.8) / 2.15, (aw * 0.92) / 1.58)
          const open = smooth(clamp(t * 10)) * smooth(clamp((1 - t) * 10))
          return {
            ...base,
            scale: unit * view.upp,
            rx: -1.15,
            ry: TURN + (activePart === "back" ? Math.PI : 0),
            rz: (wide ? Math.PI / 2 : 0.62) + Math.sin(motion * 0.35) * 0.05,
            explode: open,
            shadow: 0,
            glow: 1,
          }
        }
        case "experience":
          return { ...base, scale: fit(compact ? 0.9 : 0.66, 0.56), rx: 0.03, ry: TURN + 0.36, rz: 0.03 }
        case "projects":
          return { ...base, scale: 0.0001, rx: -1, ry: TURN + 0.4, rz: 0, shadow: 0 }
        case "contact": {
          const ringing = !calm && time % 3.2 < 0.9 ? Math.sin(time * 42) * 0.03 : 0
          return { ...base, scale: fit(0.74, 0.6), rx: 0.02, ry: TURN - 0.32 + Math.sin(motion * 0.6) * 0.08, rz: ringing, shadow: 0, glow: 1 }
        }
      }
    }

    const target = mixPose(poseOf(a), poseOf(b), f)

    // Intro: the phone rises into place on first load.
    const intro = calm ? 1 : easeOut(clamp(time / 1.5))
    target.y -= (1 - intro) * view.visH * 0.6
    target.ry -= (1 - intro) * 2.4
    target.y += Math.sin(motion * 1.2) * 0.012 * target.scale * PHONE_H * (1 - target.explode)
    target.ry += pointer.sx * 0.22 * (1 - target.explode)
    target.rx += pointer.sy * 0.1 * (1 - target.explode)

    if (!started) {
      Object.assign(now, target)
      started = true
    }
    now.x = damp(now.x, target.x, 10, dt)
    now.y = damp(now.y, target.y, 10, dt)
    now.scale = damp(now.scale, target.scale, 7, dt)
    now.rx = damp(now.rx, target.rx, 5, dt)
    now.ry = damp(now.ry, target.ry, 5, dt)
    now.rz = damp(now.rz, target.rz, 5, dt)
    now.explode = damp(now.explode, target.explode, 5, dt)
    now.shadow = damp(now.shadow, target.shadow, 5, dt)
    now.glow = damp(now.glow, target.glow, 5, dt)

    // Which app is on the screen
    const nearest = sections[Math.round(s)].name
    const visible = now.scale > 0.02
    let want: ScreenKey = shown
    if (nearest === "experience") want = jobs[stageState.job]?.screen ?? shown
    else if (nearest === "contact") want = "call"
    else if (nearest !== "projects") want = TABS[tab]
    if (want !== (spin.active ? spin.to : shown)) showScreen(want, visible, stageState.job < lastJob ? -1 : 1)
    lastJob = stageState.job
    if (spin.active) {
      spin.t += dt / 0.8
      if (spin.t >= 0.5 && !spin.swapped) {
        spin.swapped = true
        shown = spin.to
        phone.setScreen(textures[shown])
      }
      if (spin.t >= 1) {
        spin.active = false
        spin.angle = 0
        if (queued && queued !== shown) showScreen(queued, visible, 1)
        queued = null
      } else {
        spin.angle = easeInOut(spin.t) * Math.PI * 2 * spin.dir
      }
    }
    if (!calm && visible && (shown === "home" || shown === "call") && time - lastPaint > (compact ? 0.09 : 0.05)) {
      lastPaint = time
      if (shown === "home") screens.home(time)
      else screens.call(time)
      textures[shown].needsUpdate = true
    }

    // Phone
    phone.root.position.set(now.x, now.y, 0)
    drag.yawS = damp(drag.yawS, drag.yaw, drag.active ? 20 : 4, dt)
    drag.pitchS = damp(drag.pitchS, drag.pitch, drag.active ? 20 : 4, dt)
    kick = damp(kick, 0, 8, dt)
    phone.root.rotation.set(now.rx + drag.pitchS - kick * 0.06, now.ry + spin.angle + drag.yawS, now.rz)
    phone.root.scale.setScalar(Math.max(0.0001, now.scale))
    phone.root.visible = visible
    for (const part of PARTS) highlight[part] = damp(highlight[part], part === activePart ? 1 : 0, 7, dt)
    phone.update(now.explode, highlight, compact ? 0.66 : 1)

    const unit = now.scale * PHONE_H
    shadow.position.set(now.x, now.y - unit * 0.6, -0.6)
    shadow.scale.set(unit * 0.8, unit * 0.1, 1)
    ;(shadow.material as THREE.MeshBasicMaterial).opacity = visible ? now.shadow * 0.5 * (1 - now.explode) : 0
    halo.position.set(now.x, now.y, -1.2)
    halo.scale.setScalar(unit * 2.1)
    ;(halo.material as THREE.MeshBasicMaterial).opacity = visible ? now.glow * 0.55 : 0

    // Tiles
    const count = tiles.length
    // In the hero, pull the tiles in when the phone is large compared with its column.
    const heroBox = boxes[sections.findIndex((sec) => sec.name === "hero")]
    const heroSpread = heroBox && unit > 0 ? Math.min(1, (heroBox.width * 1.05 * view.upp) / unit) : 1
    const jobTiles = jobs[stageState.job]?.tiles ?? []
    const spotOf = (name: SectionName, i: number): Spot => {
      const tile = tiles[i]
      if (compact && i >= 8 && name !== "experience") return { x: 0, y: 0, z: -0.2, s: 0 }
      if (name === "hero") {
        const [x, y, z] = CONSTELLATION[i]
        const k = compact ? 0.82 : 1
        return { x: x * k * heroSpread, y: y * (compact ? 0.92 : 1) + Math.sin(motion * 0.9 + tile.phase) * 0.02, z, s: compact ? 0.86 : 1 }
      }
      if (name === "contact") {
        // Lined up on both sides of the phone, clear of the screen.
        const row = Math.floor(i / 2)
        const rows = compact ? 4 : 6
        const side = i % 2 ? -1 : 1
        const bulge = Math.sin((Math.PI * row) / (rows - 1))
        return {
          x: side * (0.38 + bulge * 0.09),
          y: ((rows - 1) / 2 - row) * 0.17 + Math.sin(motion * 0.9 + tile.phase) * 0.012,
          z: 0.1,
          s: 0.92,
        }
      }
      if (name === "about") {
        const angle = (i / count) * Math.PI * 2 + motion * 0.22
        return { x: Math.cos(angle) * 0.42, y: Math.sin(angle) * 0.16 - Math.cos(angle) * 0.1, z: Math.sin(angle) * 0.5, s: 0.85 }
      }
      if (name === "experience") {
        const k = jobTiles.indexOf(tile.key)
        if (k < 0) return { x: 0, y: 0, z: -0.2, s: 0 }
        const rows = Math.ceil(jobTiles.length / 2)
        const side = k % 2 ? -1 : 1
        const row = Math.floor(k / 2)
        return { x: side * 0.345, y: ((rows - 1) / 2 - row) * 0.2 + side * 0.03, z: 0.12, s: 1 }
      }
      return { x: 0, y: 0, z: -0.2, s: 0 }
    }
    for (let i = 0; i < count; i++) {
      const tile = tiles[i]
      const p = spotOf(sections[a].name, i)
      const q = spotOf(sections[b].name, i)
      const size = lerp(p.s, q.s, f) * unit * 0.118 * intro
      tile.scale = damp(tile.scale, visible ? size / TILE_SIZE : 0, 6, dt)
      tmp.set(now.x + lerp(p.x, q.x, f) * unit, now.y + lerp(p.y, q.y, f) * unit, lerp(p.z, q.z, f) * unit)
      tile.group.position.x = damp(tile.group.position.x, tmp.x, 6, dt)
      tile.group.position.y = damp(tile.group.position.y, tmp.y, 6, dt)
      tile.group.position.z = damp(tile.group.position.z, tmp.z, 6, dt)
      tile.group.scale.setScalar(Math.max(0.0001, tile.scale))
      tile.group.visible = tile.scale > 0.002
      tile.group.rotation.set(
        Math.sin(motion * 0.8 + tile.phase) * 0.16 + pointer.sy * 0.12,
        Math.sin(motion * 0.6 + tile.phase * 1.7) * 0.28 + pointer.sx * 0.22,
        Math.sin(motion * 0.5 + tile.phase) * 0.07,
      )
    }

    // Drone: takes over from the phone in the projects section.
    const pi = sections.findIndex((sec) => sec.name === "projects")
    const weight = pi < 0 ? 0 : smooth(clamp(1 - Math.abs(s - pi)))
    if (pi >= 0) {
      const box = boxes[pi]
      if (box) {
        dronePos.set((box.left + box.width / 2 - view.w / 2) * view.upp, -(box.top + box.height / 2 - view.h / 2) * view.upp, 0)
        const size = Math.min(box.width * 0.62, box.height * 0.9) * view.upp
        droneScale = damp(droneScale, size * weight, 6, dt)
      } else droneScale = damp(droneScale, 0, 6, dt)
    }
    drone.root.position.x = damp(drone.root.position.x, dronePos.x, 10, dt)
    drone.root.position.y = damp(drone.root.position.y, dronePos.y, 10, dt)
    drone.root.scale.setScalar(Math.max(0.0001, droneScale))
    drone.root.visible = droneScale > 0.01
    if (drone.root.visible) drone.update(motion, calm ? 0 : dt, pointer.sx, pointer.sy)

    // Line from the active skill card to its layer (desktop only).
    if (connector && connectorPath && connectorDot) {
      const card = cards[stageState.skill]
      const layer = activePart ? phone.byKey[activePart] : null
      const on = !compact && now.explode > 0.4
      connector.style.opacity = on && card && layer ? String(clamp((now.explode - 0.4) / 0.4)) : "0"
      if (on && card && layer) {
        phone.root.updateMatrixWorld(true)
        layer.group.localToWorld(tmp.copy(layer.focus)).project(camera)
        const px = (tmp.x * 0.5 + 0.5) * view.w
        const py = (-tmp.y * 0.5 + 0.5) * view.h
        const r = card.getBoundingClientRect()
        const sx = r.right + 10
        const sy = clamp(r.top + r.height / 2, 90, vh - 60)
        const mid = sx + (px - sx) * 0.45
        connectorPath.setAttribute("d", `M${sx.toFixed(1)} ${sy.toFixed(1)} H${mid.toFixed(1)} L${px.toFixed(1)} ${py.toFixed(1)}`)
        connectorDot.setAttribute("cx", px.toFixed(1))
        connectorDot.setAttribute("cy", py.toFixed(1))
      }
    }

    renderer.render(scene, camera)
    if (canvas.dataset.ready !== "true") canvas.dataset.ready = "true"
  }

  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(document.body)
  window.addEventListener("resize", resize)
  window.addEventListener("pointermove", onPointer, { passive: true })
  window.addEventListener("pointerdown", onDown)
  window.addEventListener("pointerup", onUp)
  window.addEventListener("pointercancel", onUp)
  window.addEventListener("blur", onUp)
  window.addEventListener("click", onClick)
  raf = requestAnimationFrame(frame)

  // For checks from outside: the screen images, the current tab, and where a tab is on the page.
  ;(canvas as HTMLCanvasElement & { __stage?: unknown }).__stage = {
    screens: () => Object.fromEntries(Object.entries(screens.canvases).map(([name, c]) => [name, c.toDataURL("image/png")])),
    tab: () => tab,
    tabPoint: (i: number) => {
      const size = new THREE.Box3().setFromBufferAttribute(phone.screen.geometry.attributes.position as THREE.BufferAttribute)
      const local = new THREE.Vector3(
        ((36 + 66 + i * 132) / SCREEN_W - 0.5) * (size.max.x - size.min.x),
        (0.5 - 1168 / SCREEN_H) * (size.max.y - size.min.y),
        0,
      )
      phone.root.updateMatrixWorld(true)
      phone.screen.localToWorld(local).project(camera)
      return [(local.x * 0.5 + 0.5) * view.w, (-local.y * 0.5 + 0.5) * view.h]
    },
  }

  const dispose = () => {
    disposed = true
    cancelAnimationFrame(raf)
    observer.disconnect()
    window.removeEventListener("resize", resize)
    window.removeEventListener("pointermove", onPointer)
    window.removeEventListener("pointerdown", onDown)
    window.removeEventListener("pointerup", onUp)
    window.removeEventListener("pointercancel", onUp)
    window.removeEventListener("blur", onUp)
    window.removeEventListener("click", onClick)
    root.classList.remove("can-grab", "can-tap", "is-grabbing")
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh
      mesh.geometry?.dispose()
      const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
      for (const material of materials) {
        const map = (material as THREE.MeshBasicMaterial).map
        map?.dispose()
        material.dispose()
      }
    })
    for (const texture of Object.values(textures)) texture.dispose()
    environment.dispose()
    pmrem.dispose()
    renderer.dispose()
  }

  return { dispose }
}
