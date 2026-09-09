export default function YourFiles() {
  return (
    <section id="your-files" className="block block-right">
      <h2>Your files stay yours</h2>
      <p>
        A sky is a plain folder on disk. Your notes are markdown files, and everything glean
        knows lives beside them in a small .glean folder: stats, trail data, open tabs. Sync the
        folder, grep it, back it up, read it in ten years. Leaving is just moving a folder.
      </p>
      <p>
        The same binary works as a CLI: <code>glean quick</code> captures a note from the
        terminal, <code>glean import</code> pulls in a folder of markdown from another app, and{' '}
        <code>glean list</code> and <code>glean export</code> round it out.
      </p>
    </section>
  )
}
