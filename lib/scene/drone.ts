import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { canvasTexture } from "./phone"
import type { Fonts } from "./screens"

// A small delivery drone carrying a parcel: a nod to AirBox, the drone-mail side project.
// About one unit wide before scaling.

export function createDrone(fonts: Fonts) {
  const root = new THREE.Group()
  const rig = new THREE.Group()
  root.add(rig)

  const white = new THREE.MeshPhysicalMaterial({ color: 0xf4f6fb, roughness: 0.35, metalness: 0.05, clearcoat: 0.6 })
  const blue = new THREE.MeshPhysicalMaterial({ color: 0x2f7bff, roughness: 0.3, metalness: 0.1, clearcoat: 0.8 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1e2b, roughness: 0.4, metalness: 0.6 })

  const hull = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.15, 0.32, 4, 0.07), white)
  rig.add(hull)
  const canopy = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.08, 0.2, 4, 0.04), blue)
  canopy.position.y = 0.085
  rig.add(canopy)
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), new THREE.MeshStandardMaterial({ color: 0x06080d, roughness: 0.1, metalness: 0.9 }))
  eye.position.set(0, -0.005, 0.15)
  rig.add(eye)
  const glint = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), new THREE.MeshBasicMaterial({ color: 0x8fdcff }))
  glint.position.set(0.015, 0.012, 0.192)
  rig.add(glint)

  const rotors: THREE.Group[] = []
  const blade = new THREE.BoxGeometry(0.36, 0.006, 0.036)
  const disc = new THREE.CircleGeometry(0.19, 32)
  const discMaterial = new THREE.MeshBasicMaterial({ color: 0x9fb4d8, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const x = sx * 0.36
      const z = sz * 0.27
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 0.42, 12), dark)
      arm.position.set(x / 2, 0.01, z / 2)
      arm.rotation.z = Math.PI / 2
      arm.rotation.y = -Math.atan2(z, x)
      rig.add(arm)
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 20), blue)
      motor.position.set(x, 0.03, z)
      rig.add(motor)
      const rotor = new THREE.Group()
      rotor.position.set(x, 0.085, z)
      rotor.add(new THREE.Mesh(blade, dark))
      const cross = new THREE.Mesh(blade, dark)
      cross.rotation.y = Math.PI / 2
      rotor.add(cross)
      const blur = new THREE.Mesh(disc, discMaterial)
      blur.rotation.x = -Math.PI / 2
      rotor.add(blur)
      rig.add(rotor)
      rotors.push(rotor)
    }
  }
  for (const sx of [-1, 1]) {
    const skid = new THREE.Mesh(new RoundedBoxGeometry(0.03, 0.03, 0.34, 2, 0.012), dark)
    skid.position.set(sx * 0.15, -0.14, 0)
    rig.add(skid)
    for (const sz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 8), dark)
      leg.position.set(sx * 0.15, -0.1, sz * 0.1)
      rig.add(leg)
    }
  }

  // Parcel on two strings
  const parcel = new THREE.Group()
  parcel.position.y = -0.14
  rig.add(parcel)
  const card = new THREE.MeshStandardMaterial({ color: 0xcf9d5e, roughness: 0.8, metalness: 0 })
  const crate = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.2, 0.26, 2, 0.015), card)
  crate.position.y = -0.3
  parcel.add(crate)
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.284, 0.204, 0.06), new THREE.MeshStandardMaterial({ color: 0xa9783d, roughness: 0.6 }))
  tape.position.y = -0.3
  parcel.add(tape)
  const stamp = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2, 0.1),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(256, 128, (c) => {
        c.fillStyle = "#f6efe2"
        c.fillRect(0, 0, 256, 128)
        c.fillStyle = "#0b1020"
        c.textAlign = "center"
        c.font = `800 62px ${fonts.display}`
        c.fillText("AirBox", 128, 76)
        c.font = `500 20px ${fonts.mono}`
        c.fillText("ONLINE AIR MAIL", 128, 108)
      }),
      toneMapped: false,
    }),
  )
  stamp.position.set(0, -0.3, 0.1312)
  parcel.add(stamp)
  for (const sx of [-1, 1]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.2, 6), dark)
    cord.position.set(sx * 0.09, -0.1, 0)
    parcel.add(cord)
  }

  const update = (time: number, dt: number, pointerX: number, pointerY: number) => {
    for (let i = 0; i < rotors.length; i++) rotors[i].rotation.y += dt * (38 + i * 3) * (i % 2 ? 1 : -1)
    rig.position.y = Math.sin(time * 1.6) * 0.035
    rig.rotation.z = Math.sin(time * 0.9) * 0.07 - pointerX * 0.12
    rig.rotation.x = 0.3 + Math.sin(time * 1.1) * 0.04 + pointerY * 0.1
    rig.rotation.y = -0.5 + Math.sin(time * 0.4) * 0.25 + pointerX * 0.3
    parcel.rotation.z = Math.sin(time * 1.6 - 0.9) * 0.09
    parcel.rotation.x = Math.sin(time * 1.1 - 0.7) * 0.06
  }

  return { root, update }
}

export type Drone = ReturnType<typeof createDrone>
