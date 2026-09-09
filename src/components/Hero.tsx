import PlatformMark from './PlatformMark'
import { detectPlatform } from '../lib/platform'

// GitHub keeps these URLs stable across releases as long as asset names
// do not change. The releases page below is the fallback
const LATEST = 'https://github.com/rokuroo171/glean/releases/latest/download'

export default function Hero() {
  const platform = detectPlatform()

  const cta =
    platform === 'windows'
      ? { href: `${LATEST}/gleanInstaller.exe`, label: 'Download for Windows' }
      : platform === 'macos'
        ? { href: `${LATEST}/glean-arm64.app.zip`, label: 'Download for macOS' }
        : { href: `${LATEST}/glean-desktop`, label: 'Download for Linux' }

  return (
    <section id="hero" className="hero">
      <h1 className="wordmark">glean</h1>
      <p className="tagline">Every note you keep is a star in your sky.</p>
      <p className="hero-sub">
        glean is a notes app for your desktop. Revisit a note and its star brightens. Link two
        notes and a line forms. Nothing to set up, nothing to file: your sky accumulates as you
        write.
      </p>
      <div className="hero-actions">
        <a className="button-primary" href={cta.href}>
          {cta.label}
        </a>
        <a className="button-ghost" href="https://github.com/rokuroo171/glean">
          View source
        </a>
      </div>
      <p className="hero-platforms">
        <PlatformMark name="windows" size={14} /> windows{' '}
        <PlatformMark name="linux" size={14} /> linux <PlatformMark name="apple" size={14} /> mac
        os, free and open source, GPL-3.0
      </p>
    </section>
  )
}
