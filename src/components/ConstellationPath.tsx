import { useEffect, useState } from 'react'

// One vertex per page section, in order. Hero starts the line, the
// footer holds the last vertex
const SECTION_IDS = [
  'hero',
  'the-idea',
  'brightness',
  'lines',
  'living-sky',
  'editor',
  'your-files',
  'download',
  'footer',
]

// Vertex x as a fraction of viewport width. Sections alternate left and
// right of center, so the line weaves between them; mobile becomes a
// straight spine at a fixed left offset
const XFRACTIONS = [0.5, 0.34, 0.66, 0.34, 0.66, 0.34, 0.66, 0.5, 0.5]
const SPINE_X = 28

type Vertex = { x: number; y: number }

export default function ConstellationPath() {
  const [docSize, setDocSize] = useState({ w: 0, h: 0 })
  const [vertices, setVertices] = useState<Vertex[]>([])
  const [progress, setProgress] = useState(0)
  const [staticLine, setStaticLine] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const spineQuery = window.matchMedia('(max-width: 720px)')

    function measure() {
      const doc = document.documentElement
      const w = doc.scrollWidth
      const h = doc.scrollHeight
      const spine = spineQuery.matches
      const next: Vertex[] = []
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = spine ? SPINE_X : XFRACTIONS[i] * w
        const y = rect.top + window.scrollY + rect.height / 2
        next.push({ x, y })
      })
      setDocSize({ w, h })
      setVertices(next)
    }

    function onScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return setProgress(1)
      const seen = window.scrollY + window.innerHeight * 0.55
      setProgress(Math.min(1, Math.max(0, seen / scrollable)))
    }

    measure()
    onScroll()
    setStaticLine(reduced)
    if (reduced) setProgress(1)

    const observer = new ResizeObserver(() => {
      measure()
      onScroll()
    })
    observer.observe(document.body)
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true })
    spineQuery.addEventListener('change', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      spineQuery.removeEventListener('change', measure)
    }
  }, [])

  // Cumulative polyline length at each vertex, used to light the dots
  // in step with the drawn stroke
  function cumulativeLengths(points: Vertex[]) {
    const out: number[] = []
    let total = 0
    for (let i = 0; i < points.length; i++) {
      if (i > 0) {
        const dx = points[i].x - points[i - 1].x
        const dy = points[i].y - points[i - 1].y
        total += Math.hypot(dx, dy)
      }
      out.push(total)
    }
    return out
  }

  const d = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'}${v.x.toFixed(1)} ${v.y.toFixed(1)}`).join(' ')
  const cum = cumulativeLengths(vertices)
  const total = cum[cum.length - 1] ?? 0
  const drawn = total * progress

  return (
    <svg
      className="constellation-svg"
      width={docSize.w}
      height={docSize.h}
      viewBox={`0 0 ${docSize.w} ${docSize.h}`}
      aria-hidden="true"
    >
      <path d={d} className="constellation-base" />
      {!staticLine && (
        <path d={d} className="constellation-draw" strokeDasharray={total} strokeDashoffset={total - drawn} />
      )}
      {staticLine && <path d={d} className="constellation-draw" />}
      {vertices.map((v, i) => (
        <circle
          key={SECTION_IDS[i]}
          cx={v.x}
          cy={v.y}
          r={i === 0 || i === vertices.length - 1 ? 4.5 : 3.5}
          className={cum[i] <= drawn || staticLine ? 'vertex reached' : 'vertex'}
        />
      ))}
    </svg>
  )
}
