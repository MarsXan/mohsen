import * as THREE from "three"
import type { TileKey } from "@/lib/resume"
import { canvasTexture, fitUV, roundedRect, slab } from "./phone"
import type { Fonts } from "./screens"

// Floating "app icon" tiles, one per technology, drawn like element tiles: a symbol and a name.

export const TILE_SIZE = 0.26

const SPEC: { key: TileKey; symbol: string; name: string; color: string; ink?: string }[] = [
  { key: "swift", symbol: "Sw", name: "Swift", color: "#f05138" },
  { key: "kotlin", symbol: "Kt", name: "Kotlin", color: "#7f52ff" },
  { key: "swiftui", symbol: "Ui", name: "SwiftUI", color: "#0a84ff" },
  { key: "compose", symbol: "Jc", name: "Compose", color: "#12b5a6" },
  { key: "llm", symbol: "Ai", name: "LLMs", color: "#ec4899" },
  { key: "claude", symbol: "Cc", name: "Claude Code", color: "#d97757" },
  { key: "ios", symbol: "iO", name: "iOS", color: "#1f2433" },
  { key: "android", symbol: "An", name: "Android", color: "#3ddc84", ink: "#06281a" },
  { key: "flutter", symbol: "Fl", name: "Flutter", color: "#54c5f8", ink: "#03203a" },
  { key: "arkit", symbol: "Ar", name: "ARKit", color: "#f2f4f8", ink: "#0b1020" },
  { key: "nest", symbol: "Ns", name: "NestJS", color: "#a3123a" },
  { key: "firebase", symbol: "Fb", name: "Firebase", color: "#ffa000", ink: "#2b1a00" },
]

export interface Tile {
  key: TileKey
  group: THREE.Group
  phase: number
  scale: number
}

export function createTiles(fonts: Fonts): Tile[] {
  const body = slab(TILE_SIZE, TILE_SIZE, 0.07, 0.06, 0.014)
  const faceSize = TILE_SIZE - 0.03
  const face = new THREE.ShapeGeometry(roundedRect(new THREE.Shape(), faceSize, faceSize, 0.056), 12)
  fitUV(face, faceSize, faceSize)

  return SPEC.map((spec, i) => {
    const ink = spec.ink ?? "#ffffff"
    const group = new THREE.Group()
    group.add(
      new THREE.Mesh(
        body,
        new THREE.MeshPhysicalMaterial({ color: spec.color, roughness: 0.36, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
      ),
    )
    const map = canvasTexture(256, 256, (c) => {
      c.fillStyle = spec.color
      c.fillRect(0, 0, 256, 256)
      const shine = c.createLinearGradient(0, 0, 256, 256)
      shine.addColorStop(0, "rgba(255,255,255,.28)")
      shine.addColorStop(0.55, "rgba(255,255,255,0)")
      c.fillStyle = shine
      c.fillRect(0, 0, 256, 256)
      c.fillStyle = ink
      c.textAlign = "center"
      c.font = `800 122px ${fonts.display}`
      c.fillText(spec.symbol, 128, 150)
      c.globalAlpha = 0.86
      c.font = `600 31px ${fonts.sans}`
      c.fillText(spec.name, 128, 212)
    })
    const label = new THREE.Mesh(face, new THREE.MeshStandardMaterial({ map, roughness: 0.4, metalness: 0.05 }))
    label.position.z = 0.0308
    group.add(label)
    group.scale.setScalar(0.0001)
    return { key: spec.key, group, phase: i * 1.7, scale: 0 }
  })
}
