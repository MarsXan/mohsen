import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import type { PartKey } from "@/lib/resume"
import type { Fonts } from "./screens"

// The phone is built from code, as six separate layers that can be pulled apart along its depth.

export const PHONE_W = 0.78
export const PHONE_H = 1.62
const D = 0.085
const R = 0.14
const BAND = 0.022

const LINE = 0x8fdcff
const GLASS_TINT = new THREE.Color(0x10315c)

export function roundedRect<P extends THREE.Path>(path: P, w: number, h: number, r: number): P {
  const x = -w / 2
  const y = -h / 2
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  path.lineTo(x + w, y + h - r)
  path.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  path.lineTo(x + r, y + h)
  path.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  path.lineTo(x, y + r)
  path.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return path
}

// A rounded-rectangle plate, centred on the origin, `depth` thick including its bevel.
export function slab(w: number, h: number, r: number, depth: number, bevel = 0) {
  const shape = roundedRect(new THREE.Shape(), w - bevel * 2, h - bevel * 2, Math.max(0.001, r - bevel))
  const inner = depth - bevel * 2
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: inner,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 20,
  })
  geo.translate(0, 0, -inner / 2)
  return geo
}

// Stretch a texture once across the whole face instead of using shape coordinates.
export function fitUV(geo: THREE.BufferGeometry, w: number, h: number) {
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  uv.needsUpdate = true
}

export function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  draw(canvas.getContext("2d") as CanvasRenderingContext2D)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

interface Tint {
  material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial
  base: THREE.Color
}

export interface PhoneLayer {
  key: PartKey
  group: THREE.Group
  focus: THREE.Vector3
  restZ: number
  spread: number
  // How far this layer darkens while another one is in focus.
  dim: number
  tints: Tint[]
  line: THREE.LineBasicMaterial
}

export function createPhone(screenTexture: THREE.Texture, fonts: Fonts) {
  const root = new THREE.Group()
  const layers: PhoneLayer[] = []

  const addLayer = (key: PartKey, restZ: number, spread: number, focus: [number, number]) => {
    const group = new THREE.Group()
    group.position.z = restZ
    root.add(group)
    const line = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0, depthWrite: false })
    const layer: PhoneLayer = { key, group, focus: new THREE.Vector3(focus[0], focus[1], 0), restZ, spread, dim: 0.74, tints: [], line }
    layers.push(layer)
    return layer
  }

  const std = (layer: PhoneLayer, params: THREE.MeshStandardMaterialParameters) => {
    const material = new THREE.MeshStandardMaterial(params)
    layer.tints.push({ material, base: material.color.clone() })
    return material
  }

  // Blueprint outline of a rounded plate: one loop on each face.
  const loops = (layer: PhoneLayer, w: number, h: number, r: number, depth: number) => {
    const points = roundedRect(new THREE.Path(), w + 0.006, h + 0.006, r + 0.003).getPoints(10)
    for (const z of [depth / 2 + 0.002, -depth / 2 - 0.002]) {
      const geo = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, z)))
      layer.group.add(new THREE.LineLoop(geo, layer.line))
    }
  }

  const edges = (layer: PhoneLayer, mesh: THREE.Mesh) => {
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 30), layer.line))
  }

  const inW = PHONE_W - BAND * 2 - 0.004
  const inH = PHONE_H - BAND * 2 - 0.004
  const inR = R - BAND

  // ---- Cover glass: only adds reflections on top of whatever is behind it.
  const glass = addLayer("glass", D / 2 - 0.0015, 0.75, [0.2, -0.56])
  glass.dim = 0.94
  const glassMaterial = std(glass, {
    color: 0x232a40,
    metalness: 1,
    roughness: 0.08,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  glass.group.add(new THREE.Mesh(slab(inW, inH, inR, 0.006), glassMaterial))
  loops(glass, inW, inH, inR, 0.006)

  // ---- Display: a black panel with the lit screen set into it.
  const display = addLayer("display", D / 2 - 0.012, 0.45, [0, 0])
  display.group.add(
    new THREE.Mesh(slab(inW, inH, inR, 0.012), std(display, { color: 0x05070d, roughness: 0.5, metalness: 0.2 })),
  )
  const screenW = 0.708
  const screenH = 1.534
  const screenGeo = new THREE.ShapeGeometry(roundedRect(new THREE.Shape(), screenW, screenH, 0.1), 20)
  fitUV(screenGeo, screenW, screenH)
  const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false })
  display.tints.push({ material: screenMaterial, base: new THREE.Color(0xffffff) })
  const screen = new THREE.Mesh(screenGeo, screenMaterial)
  screen.position.z = 0.0066
  display.group.add(screen)
  loops(display, inW, inH, inR, 0.012)

  // ---- Frame: the metal band, with its buttons.
  const frame = addLayer("frame", 0, 0.12, [-0.37, -0.3])
  const bevel = 0.007
  const band = roundedRect(new THREE.Shape(), PHONE_W - bevel * 2, PHONE_H - bevel * 2, R - bevel)
  band.holes.push(
    roundedRect(new THREE.Path(), PHONE_W - BAND * 2 + bevel * 2, PHONE_H - BAND * 2 + bevel * 2, R - BAND + bevel),
  )
  const bandGeo = new THREE.ExtrudeGeometry(band, {
    depth: D - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 24,
  })
  bandGeo.translate(0, 0, -(D - bevel * 2) / 2)
  const metal = std(frame, { color: 0x50545f, metalness: 1, roughness: 0.26 })
  frame.group.add(new THREE.Mesh(bandGeo, metal))
  const buttons: [number, number, number][] = [
    [PHONE_W / 2 + 0.003, 0.24, 0.17],
    [-PHONE_W / 2 - 0.003, 0.36, 0.1],
    [-PHONE_W / 2 - 0.003, 0.22, 0.1],
    [-PHONE_W / 2 - 0.003, 0.5, 0.05],
  ]
  for (const [x, y, len] of buttons) {
    const button = new THREE.Mesh(new RoundedBoxGeometry(0.014, len, 0.03, 2, 0.006), metal)
    button.position.set(x, y, 0)
    frame.group.add(button)
  }
  loops(frame, PHONE_W, PHONE_H, R, D)

  // ---- Logic board
  const board = addLayer("board", -0.004, -0.2, [-0.14, 0.5])
  const pcb = new THREE.Shape()
  pcb.moveTo(-0.34, 0.74)
  pcb.lineTo(0.34, 0.74)
  pcb.lineTo(0.34, -0.74)
  pcb.lineTo(0.16, -0.74)
  pcb.lineTo(0.16, 0.16)
  pcb.lineTo(-0.34, 0.16)
  pcb.closePath()
  const pcbGeo = new THREE.ExtrudeGeometry(pcb, { depth: 0.012, bevelEnabled: false })
  pcbGeo.translate(0, 0, -0.006)
  const pcbMesh = new THREE.Mesh(pcbGeo, std(board, { color: 0x0f5a4d, roughness: 0.55, metalness: 0.25 }))
  board.group.add(pcbMesh)
  edges(board, pcbMesh)

  const chipDark = std(board, { color: 0x1b1e28, roughness: 0.4, metalness: 0.6 })
  const chipSilver = std(board, { color: 0xb9bfcc, roughness: 0.32, metalness: 1 })
  const gold = std(board, { color: 0xd9a441, roughness: 0.35, metalness: 1 })
  const part = (w: number, h: number, d: number, x: number, y: number, material: THREE.Material, outlined = true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, 0.006 + d / 2)
    board.group.add(mesh)
    if (outlined) edges(board, mesh)
    return mesh
  }
  part(0.2, 0.2, 0.022, -0.14, 0.5, chipDark)
  part(0.16, 0.11, 0.018, 0.17, 0.57, chipDark)
  part(0.1, 0.1, 0.016, 0.2, 0.36, chipDark)
  part(0.24, 0.12, 0.02, -0.14, 0.27, chipSilver)
  part(0.1, 0.14, 0.016, 0.25, 0.0, chipDark)
  part(0.1, 0.08, 0.014, 0.25, -0.2, chipSilver)
  part(0.09, 0.22, 0.018, 0.25, -0.5, gold)
  for (let i = 0; i < 6; i++) part(0.022, 0.05, 0.008, -0.29 + i * 0.045, 0.69, gold, false)
  for (let i = 0; i < 8; i++) {
    part(0.024, 0.014, 0.01, 0.02 + (i % 4) * 0.04, 0.42 + Math.floor(i / 4) * 0.035, i % 3 ? gold : chipSilver, false)
  }
  const chipLabel = new THREE.MeshBasicMaterial({
    map: canvasTexture(256, 256, (c) => {
      c.fillStyle = "#151821"
      c.fillRect(0, 0, 256, 256)
      c.strokeStyle = "rgba(255,255,255,.25)"
      c.lineWidth = 4
      c.strokeRect(14, 14, 228, 228)
      c.fillStyle = "#e8ecff"
      c.textAlign = "center"
      c.font = `800 92px ${fonts.display}`
      c.fillText("AI", 128, 150)
      c.font = `500 26px ${fonts.mono}`
      c.fillStyle = "rgba(232,236,255,.7)"
      c.fillText("LLM CORE", 128, 200)
    }),
    toneMapped: false,
  })
  board.tints.push({ material: chipLabel, base: new THREE.Color(0xffffff) })
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.19), chipLabel)
  label.position.set(-0.14, 0.5, 0.006 + 0.022 + 0.0008)
  board.group.add(label)

  // ---- Battery
  const battery = addLayer("battery", -0.004, -0.47, [-0.12, -0.31])
  const cell = new THREE.Mesh(
    new RoundedBoxGeometry(0.44, 0.82, 0.04, 3, 0.012),
    std(battery, { color: 0x23262f, roughness: 0.42, metalness: 0.55 }),
  )
  cell.position.set(-0.12, -0.31, 0)
  battery.group.add(cell)
  const cellLines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.44, 0.82, 0.04)), battery.line)
  cellLines.position.copy(cell.position)
  battery.group.add(cellLines)
  const cellLabel = new THREE.MeshBasicMaterial({
    map: canvasTexture(256, 480, (c) => {
      c.fillStyle = "#1b1e26"
      c.fillRect(0, 0, 256, 480)
      c.fillStyle = "#f3f5fb"
      c.textAlign = "left"
      c.font = `800 64px ${fonts.display}`
      c.fillText("100%", 26, 96)
      c.fillStyle = "#2a2f3b"
      c.fillRect(26, 124, 204, 26)
      c.fillStyle = "#2fd58a"
      c.fillRect(26, 124, 204, 26)
      c.fillStyle = "rgba(243,245,251,.7)"
      c.font = `500 22px ${fonts.mono}`
      c.fillText("Li-ion 4400 mAh", 26, 196)
      c.fillText("Backend: always on", 26, 230)
      c.strokeStyle = "rgba(243,245,251,.25)"
      c.lineWidth = 3
      for (let i = 0; i < 6; i++) c.strokeRect(26 + i * 36, 400, 24, 46)
    }),
    toneMapped: false,
  })
  battery.tints.push({ material: cellLabel, base: new THREE.Color(0xffffff) })
  const cellFace = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.675), cellLabel)
  cellFace.position.set(-0.12, -0.31, 0.0208)
  battery.group.add(cellFace)
  const flex = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.006), std(battery, { color: 0xd9a441, roughness: 0.4, metalness: 1 }))
  flex.position.set(0.13, -0.1, 0.0235)
  battery.group.add(flex)

  // ---- Back cover, with the camera
  const back = addLayer("back", -D / 2 + 0.0025, -0.78, [0.185, 0.575])
  const backGeo = slab(inW, inH, inR, 0.008)
  // Satin black: a mirror finish would turn white when seen edge-on in the opened-up view.
  const backMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0c0d11,
    roughness: 0.44,
    metalness: 0.25,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.7,
  })
  back.tints.push({ material: backMaterial, base: backMaterial.color.clone() })
  back.group.add(new THREE.Mesh(backGeo, backMaterial))
  loops(back, inW, inH, inR, 0.008)

  const lensBlack = std(back, { color: 0x06080d, roughness: 0.12, metalness: 0.9 })
  const lensRing = std(back, { color: 0xc8cede, roughness: 0.25, metalness: 1 })
  const island = new THREE.Mesh(slab(0.32, 0.32, 0.09, 0.022, 0.006), std(back, { color: 0x17191f, roughness: 0.3, metalness: 0.6 }))
  island.position.set(0.185, 0.575, -0.004 - 0.011)
  back.group.add(island)
  const lenses: [number, number][] = [
    [0.125, 0.635],
    [0.245, 0.515],
  ]
  for (const [x, y] of lenses) {
    // Outside: the lens you see from the back.
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.014, 40), lensBlack)
    lens.rotation.x = Math.PI / 2
    lens.position.set(x, y, -0.004 - 0.022 - 0.004)
    back.group.add(lens)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.008, 12, 40), lensRing)
    ring.position.set(x, y, -0.004 - 0.022 - 0.009)
    back.group.add(ring)
    const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.004, 32), std(back, { color: 0x1b3a7a, roughness: 0.1, metalness: 1 }))
    iris.rotation.x = Math.PI / 2
    iris.position.set(x, y, -0.004 - 0.022 - 0.012)
    back.group.add(iris)
    // Inside: the camera module that stands on the cover once the phone is opened.
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.066, 0.03, 40), lensBlack)
    barrel.rotation.x = Math.PI / 2
    barrel.position.set(x, y, 0.004 + 0.015)
    back.group.add(barrel)
    edges(back, barrel)
    const cap = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 12, 40), lensRing)
    cap.position.set(x, y, 0.004 + 0.03)
    back.group.add(cap)
  }
  const flash = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.006, 24),
    std(back, { color: 0xfff3c4, roughness: 0.4, metalness: 0, emissive: 0x554a20 }),
  )
  flash.rotation.x = Math.PI / 2
  flash.position.set(0.25, 0.64, -0.004 - 0.022 - 0.002)
  back.group.add(flash)

  const byKey = Object.fromEntries(layers.map((l) => [l.key, l])) as Record<PartKey, PhoneLayer>

  // explode: 0 assembled … 1 fully apart. highlight: 0…1 per part, the layer in focus.
  // spacing: scales the gaps between layers (tighter where there is less room).
  const update = (explode: number, highlight: Record<PartKey, number>, spacing = 1) => {
    for (const layer of layers) {
      const hl = highlight[layer.key]
      layer.group.position.z = layer.restZ + (layer.spread * spacing + hl * 0.035) * explode
      const dim = 1 - explode * layer.dim * (1 - hl)
      for (const tint of layer.tints) tint.material.color.copy(tint.base).multiplyScalar(dim)
      layer.line.opacity = explode * (0.2 + 0.8 * hl)
      layer.line.visible = explode > 0.01
    }
    glassMaterial.emissive.copy(GLASS_TINT).multiplyScalar(explode * (0.3 + 0.7 * highlight.glass))
    backMaterial.emissive.copy(GLASS_TINT).multiplyScalar(explode * highlight.back * 0.7)
  }

  const setScreen = (texture: THREE.Texture) => {
    screenMaterial.map = texture
    screenMaterial.needsUpdate = true
  }

  return { root, layers, byKey, screen, update, setScreen }
}

export type Phone = ReturnType<typeof createPhone>
