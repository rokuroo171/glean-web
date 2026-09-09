// Visit counts come straight from glean's growth stages
const STAGES = [
  { name: 'Faint Speck', visits: '1 visit', size: 6 },
  { name: 'Dim Star', visits: '2 to 4 visits', size: 10 },
  { name: 'Steady Star', visits: '5 to 9 visits', size: 15 },
  { name: 'Bright Star', visits: '10 to 19 visits', size: 21 },
  { name: 'Brilliant Star', visits: '20+ visits', size: 28 },
]

export default function Brightness() {
  return (
    <section id="brightness" className="block block-right">
      <h2>Brightness</h2>
      <p>
        Every star is a note, and attention is what feeds it. Each time you open a note, its star
        steps up through five stages of brightness, from a faint speck to a brilliant star. The
        stars you live in glow; the ones you forgot stay small until you need them again.
      </p>
      <div className="stage-row" role="list">
        {STAGES.map((stage) => (
          <div className="stage" role="listitem" key={stage.name}>
            <span
              className="stage-star"
              style={{ width: stage.size, height: stage.size }}
              aria-hidden="true"
            />
            <span className="stage-name">{stage.name}</span>
            <span className="stage-visits">{stage.visits}</span>
          </div>
        ))}
      </div>
      <p>
        Once a day you can also give a star a wish: a small brightness boost for a note you want
        to keep in sight, separate from the counting.
      </p>
    </section>
  )
}
