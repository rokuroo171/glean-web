// A small constellation fragment: star positions in a 300 by 150 viewbox
const FRAGMENT = [
  { x: 30, y: 110 },
  { x: 105, y: 60 },
  { x: 170, y: 95 },
  { x: 235, y: 40 },
]
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
]

export default function Lines() {
  return (
    <section id="lines" className="block block-left">
      <h2>Lines</h2>
      <p>
        While you write, wikilinks do the quiet work: mention another note with double brackets
        and a line appears between the two stars. A note that many others point to grows into a
        hub, and lines that stop being used fade, so the sky only keeps the paths you still walk.
      </p>
      <svg
        className="fragment"
        viewBox="0 0 265 150"
        width="265"
        height="150"
        aria-hidden="true"
      >
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={FRAGMENT[a].x}
            y1={FRAGMENT[a].y}
            x2={FRAGMENT[b].x}
            y2={FRAGMENT[b].y}
            className="fragment-line"
          />
        ))}
        {FRAGMENT.map((star, i) => (
          <circle key={i} cx={star.x} cy={star.y} r={i === 3 ? 5 : 3.5} className="fragment-star" />
        ))}
      </svg>
    </section>
  )
}
