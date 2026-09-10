import SkyCanvas from '../components/SkyCanvas'

export default function NotFound() {
  return (
    <>
      <SkyCanvas />
      <main className="page nf">
        <h1>This star isn't in your sky.</h1>
        <p className="nf-sub">
          The page you asked for isn't up there. Your notes are all still glowing where you left
          them.
        </p>
        <a className="button-ghost" href="/">
          Back to the sky
        </a>
      </main>
    </>
  )
}
