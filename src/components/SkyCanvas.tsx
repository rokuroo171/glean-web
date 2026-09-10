import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  layer: number
  phase: number
  speed: number
  base: number
  gold: boolean
}

// Layer 0 is the deepest, slowest layer; layer 2 sits closest and
// moves most. Drift is in px per second, parallax in px of cursor travel
const DRIFT = [0.5, 1.0, 1.6]
const PARALLAX = [3, 7, 12]

export default function SkyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const g = el.getContext('2d')
    if (!g) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let last = 0
    let lastWidth = 0
    const drift = [0, 0, 0]
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    // Star color channels: Starlight with a rare warm Star Gold star
    const starColor = (gold: boolean) => (gold ? '232, 201, 160' : '233, 238, 246')

    const wrap = (v: number, max: number) => ((v % max) + max) % max

    const makeStars = () => {
      const count = Math.min(240, Math.floor((width * height) / 9000))
      stars = []
      for (let i = 0; i < count; i++) {
        const layer = i % 3
        const bright = Math.random()
        stars.push({
          x: Math.random(),
          y: Math.random(),
          r: layer === 2 ? 0.9 + bright * 1.3 : 0.4 + bright * 0.7,
          layer,
          phase: Math.random() * Math.PI * 2,
          speed: 0.1 + Math.random() * 0.3,
          base: 0.25 + bright * 0.55,
          gold: Math.random() < 0.05,
        })
      }
    }

    const draw = (now: number, dt: number) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, width, height)
      for (let l = 0; l < 3; l++) drift[l] += DRIFT[l] * dt

      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04

      for (const s of stars) {
        const twinkle = s.base + 0.22 * Math.sin(s.phase + (now / 1000) * s.speed)
        const px = wrap(s.x * width + drift[s.layer], width) + mouse.x * PARALLAX[s.layer]
        const py = wrap(s.y * height + drift[s.layer] * 0.6, height) + mouse.y * PARALLAX[s.layer]

        g.beginPath()
        g.fillStyle = `rgba(${starColor(s.gold)}, ${Math.max(0, twinkle).toFixed(3)})`
        g.arc(px, py, s.r, 0, Math.PI * 2)
        g.fill()

        // A few of the biggest stars get a thin atlas-style cross
        if (s.r > 1.7) {
          g.strokeStyle = `rgba(${starColor(s.gold)}, ${(twinkle * 0.4).toFixed(3)})`
          g.lineWidth = 0.5
          const arm = s.r * 3.5
          g.beginPath()
          g.moveTo(px - arm, py)
          g.lineTo(px + arm, py)
          g.moveTo(px, py - arm)
          g.lineTo(px, py + arm)
          g.stroke()
        }
      }
    }

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      width = window.innerWidth
      height = window.innerHeight
      el.width = Math.floor(width * dpr)
      el.height = Math.floor(height * dpr)
      // Star positions are fractions of the canvas, so a height-only resize
      // (mobile url bar hiding) just re-renders; reseed on width change to
      // keep the density right
      if (width !== lastWidth) {
        lastWidth = width
        makeStars()
      }
      if (reduced) draw(0, 0)
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      draw(now, dt)
      raf = requestAnimationFrame(loop)
    }

    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
    }

    const onMouseLeave = () => {
      mouse.tx = 0
      mouse.ty = 0
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) {
      // Static field: one frame, no loop, no cursor tracking
      draw(0, 0)
    } else {
      raf = requestAnimationFrame(loop)
      window.addEventListener('mousemove', onMouse)
      document.documentElement.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return <canvas ref={ref} className="sky-canvas" aria-hidden="true" />
}
