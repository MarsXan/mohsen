export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const smooth = (t: number) => t * t * (3 - 2 * t)

// Frame-rate independent smoothing toward a target.
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
