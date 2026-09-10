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

type Meteor = {
  x: number
  y: number
  vx: number
  vy: number
  speed: number
  life: number
  maxLife: number
  length: number
}

type Comet = {
  x: number
  y: number
  vx: number
  vy: number
  speed: number
  life: number
  maxLife: number
  tailLength: number
}

// Layer 0 is the deepest, slowest layer; layer 2 sits closest and moves
// most. Drift is px per second, cursor parallax is px of pointer travel,
// scroll parallax is a fraction of scrollY so the sky turns as the page
// scrolls under it
const DRIFT = [0.5, 1.0, 1.6]
const PARALLAX = [3, 7, 12]
const SCROLL_PARALLAX = [0.04, 0.09, 0.16]

// Shower weeks lift the meteor rate, same calendar as glean's
// Constellation.jsx: Quadrantids, Lyrids, Perseids, Orionids, Leonids,
// Geminids
function meteorBoost(): number {
  const d = new Date()
  const month = d.getMonth()
  const dom = d.getDate()
  if (month === 0 && dom >= 1 && dom <= 5) return 4
  if (month === 3 && dom >= 21 && dom <= 23) return 3
  if (month === 7 && dom >= 9 && dom <= 13) return 4
  if (month === 9 && dom >= 20 && dom <= 22) return 3
  if (month === 10 && dom >= 16 && dom <= 18) return 3
  if (month === 11 && dom >= 4 && dom <= 17) return 4
  return 1
}

// Spawn numbers match glean's spawnMeteor and spawnComet
function spawnMeteor(w: number, h: number): Meteor {
  const fromTop = Math.random() < 0.5
  const vx = 300 + Math.random() * 300
  const vy = 200 + Math.random() * 200
  return {
    x: fromTop ? Math.random() * w : -50,
    y: fromTop ? -50 : Math.random() * h,
    vx,
    vy,
    speed: Math.hypot(vx, vy),
    life: 0,
    maxLife: 0.8 + Math.random() * 0.6,
    length: 60 + Math.random() * 80,
  }
}

function spawnComet(w: number, h: number): Comet {
  const fromTop = Math.random() < 0.5
  const vx = 100 + Math.random() * 100
  const vy = 60 + Math.random() * 80
  return {
    x: fromTop ? Math.random() * w * 0.75 : -80,
    y: fromTop ? -80 : Math.random() * h * 0.75,
    vx,
    vy,
    speed: Math.hypot(vx, vy),
    life: 0,
    maxLife: 3 + Math.random() * 2,
    tailLength: 120 + Math.random() * 100,
  }
}

export default function SkyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const g = el.getContext('2d')
    if (!g) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let meteors: Meteor[] = []
    let comets: Comet[] = []
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

    const drawMeteor = (m: Meteor) => {
      const p = m.life / m.maxLife
      const opacity = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7
      const dx = m.vx / m.speed
      const dy = m.vy / m.speed
      g.strokeStyle = '#e0d0a0'
      g.lineWidth = 2
      g.shadowColor = '#ffcc66'
      g.shadowBlur = 8
      g.globalAlpha = Math.max(0, opacity) * 0.8
      g.beginPath()
      g.moveTo(m.x - dx * m.length, m.y - dy * m.length)
      g.lineTo(m.x, m.y)
      g.stroke()
      g.shadowBlur = 0
      g.globalAlpha = 1
    }

    const drawComet = (c: Comet) => {
      const p = c.life / c.maxLife
      const opacity = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1
      const dx = c.vx / c.speed
      const dy = c.vy / c.speed
      const seg = c.tailLength / 6
      for (let i = 1; i <= 6; i++) {
        g.strokeStyle = '#e8e0d0'
        g.lineWidth = 2.4 - i * 0.32
        g.globalAlpha = Math.max(0, opacity) * (1 - i / 6)
        g.beginPath()
        g.moveTo(c.x - dx * (i - 1) * seg, c.y - dy * (i - 1) * seg)
        g.lineTo(c.x - dx * i * seg, c.y - dy * i * seg)
        g.stroke()
      }
      g.fillStyle = '#e8e0d0'
      g.globalAlpha = Math.max(0, opacity)
      g.beginPath()
      g.arc(c.x, c.y, 3, 0, Math.PI * 2)
      g.fill()
      g.globalAlpha = 1
    }

    const draw = (now: number, dt: number) => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, width, height)
      for (let l = 0; l < 3; l++) drift[l] += DRIFT[l] * dt

      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      const scroll = window.scrollY

      for (const s of stars) {
        const twinkle = s.base + 0.22 * Math.sin(s.phase + (now / 1000) * s.speed)
        const px = wrap(s.x * width + drift[s.layer], width) + mouse.x * PARALLAX[s.layer]
        const py =
          wrap(s.y * height - scroll * SCROLL_PARALLAX[s.layer] + drift[s.layer] * 0.6, height) +
          mouse.y * PARALLAX[s.layer]

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

      if (reduced) return

      meteors = meteors
        .map((m) => ({ ...m, x: m.x + m.vx * dt, y: m.y + m.vy * dt, life: m.life + dt }))
        .filter((m) => m.life < m.maxLife)
      comets = comets
        .map((c) => ({ ...c, x: c.x + c.vx * dt, y: c.y + c.vy * dt, life: c.life + dt }))
        .filter((c) => c.life < c.maxLife)

      for (const m of meteors) drawMeteor(m)
      for (const c of comets) drawComet(c)
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

    // Spawn cadence matches glean: meteors every 6 to 24 seconds divided by
    // the shower boost, comets every 25 to 70 seconds
    let meteorTimer = 0
    let cometTimer = 0
    const scheduleMeteor = () => {
      meteorTimer = window.setTimeout(() => {
        meteors = [...meteors, spawnMeteor(width, height)]
        scheduleMeteor()
      }, (6000 + Math.random() * 18000) / meteorBoost())
    }
    const scheduleComet = () => {
      cometTimer = window.setTimeout(() => {
        comets = [...comets, spawnComet(width, height)]
        scheduleComet()
      }, 25000 + Math.random() * 45000)
    }

    if (reduced) {
      // Static field: one frame, no loop, no cursor tracking, no visitors
      draw(0, 0)
    } else {
      raf = requestAnimationFrame(loop)
      window.addEventListener('mousemove', onMouse)
      document.documentElement.addEventListener('mouseleave', onMouseLeave)
      scheduleMeteor()
      scheduleComet()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      clearTimeout(meteorTimer)
      clearTimeout(cometTimer)
    }
  }, [])

  return <canvas ref={ref} className="sky-canvas" aria-hidden="true" />
}
