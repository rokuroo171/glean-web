import gleanIcon from '../assets/glean-icon.png'
import PlatformMark from './PlatformMark'
import { detectPlatform } from '../lib/platform'
import { activeShower } from '../lib/showers'

// GitHub keeps these URLs stable across releases as long as asset names
// do not change
const LATEST = 'https://github.com/rokuroo171/glean/releases/latest/download'

// The link asks the Download section to open its all-platforms list, then
// the native anchor brings the visitor there
function showAllDownloads() {
  window.dispatchEvent(new Event('glean:show-all-downloads'))
}

export default function Hero() {
  const platform = detectPlatform()
  const shower = activeShower()

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
      {shower && (
        <p className="shower-note">
          The {shower} are peaking. The sky is busier than usual.
        </p>
      )}
      <div className="hero-actions">
        <a className="button-primary" href={cta.href}>
          <img src={gleanIcon} alt="" width={18} height={18} />
          {cta.label}
        </a>
        <a className="button-ghost" href="https://github.com/rokuroo171/glean">
          View source
        </a>
      </div>
      <a className="dl-options-link" href="#download" onClick={showAllDownloads}>
        All download options
      </a>
      <p className="hero-platforms">
        <PlatformMark name="windows" size={14} />
        <span>Windows</span>
        <PlatformMark name="linux" size={14} />
        <span>Linux</span>
        <PlatformMark name="apple" size={14} />
        <span>macOS</span>
        <span>free and open source, GPL-3.0</span>
      </p>
    </section>
  )
}
