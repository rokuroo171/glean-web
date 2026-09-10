import gleanIcon from '../assets/glean-icon.png'
import PlatformMark from './PlatformMark'
import { detectPlatform } from '../lib/platform'

// GitHub keeps these URLs stable across releases as long as asset names
// do not change. The releases page below is the fallback
const LATEST = 'https://github.com/rokuroo171/glean/releases/latest/download'

const platforms = [
  { mark: 'windows', label: 'Windows', file: 'gleanInstaller.exe' },
  { mark: 'linux', label: 'Linux', file: 'glean-desktop' },
  { mark: 'apple', label: 'macOS', file: 'glean-arm64.app.zip' },
] as const

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
      <img className="hero-icon" src={gleanIcon} alt="" width={76} height={76} />
      <h1 className="wordmark">glean</h1>
      <p className="tagline">Every note you keep is a star in your sky.</p>
      <p className="hero-sub">
        glean is a notes app for your desktop. Revisit a note and its star brightens. Link two
        notes and a line forms. Nothing to set up, nothing to file: your sky accumulates as you
        write.
      </p>
      <div className="hero-actions">
        <a className="button-primary" href={cta.href}>
          <img src={gleanIcon} alt="" width={18} height={18} />
          {cta.label}
        </a>
        <a className="button-ghost" href="https://github.com/rokuroo171/glean">
          View source
        </a>
      </div>
      <p className="hero-platforms">
        {platforms.map((p) => (
          <a key={p.mark} className="hero-dl" href={`${LATEST}/${p.file}`}>
            <PlatformMark name={p.mark} size={14} />
            <span>{p.label}</span>
          </a>
        ))}
        <span>free and open source, GPL-3.0</span>
      </p>
    </section>
  )
}
