import { useEffect, useState } from 'react'
import gleanIcon from '../assets/glean-icon.png'
import PlatformMark from './PlatformMark'
import { detectPlatform } from '../lib/platform'

// GitHub keeps latest-release asset URLs stable as long as asset names
// do not change. The releases page below is the fallback
const LATEST = 'https://github.com/rokuroo171/glean/releases/latest/download'
const RELEASES = 'https://github.com/rokuroo171/glean/releases'

type Mark = 'windows' | 'apple' | 'linux'

function LinkRow({ mark, label, detail, href }: { mark: Mark; label: string; detail: string; href: string }) {
  return (
    <a className="dl-row" href={href}>
      <PlatformMark name={mark} size={18} />
      <span className="dl-label">{label}</span>
      <span className="dl-detail">{detail}</span>
    </a>
  )
}

function CommandRow({ label, command }: { label: string; command: string }) {
  return (
    <div className="dl-row">
      <span className="dl-mark" aria-hidden="true">
        $
      </span>
      <span className="dl-label">{label}</span>
      <code className="dl-detail">{command}</code>
    </div>
  )
}

function TbaRow({ label }: { label: string }) {
  return (
    <div className="dl-row dl-tba">
      <span className="dl-label">{label}</span>
      <span className="dl-detail">to be added</span>
    </div>
  )
}

function WindowsRows() {
  return (
    <LinkRow
      mark="windows"
      label="Windows installer"
      detail="gleanInstaller.exe"
      href={`${LATEST}/gleanInstaller.exe`}
    />
  )
}

function MacRows() {
  return (
    <>
      <LinkRow
        mark="apple"
        label="macOS, Apple silicon"
        detail="glean-arm64.app.zip"
        href={`${LATEST}/glean-arm64.app.zip`}
      />
      <TbaRow label="macOS, Intel" />
    </>
  )
}

function LinuxRows() {
  return (
    <>
      <LinkRow
        mark="linux"
        label="Linux bundle"
        detail="glean-desktop, self-extracting"
        href={`${LATEST}/glean-desktop`}
      />
      <CommandRow label="Arch Linux, AUR" command="yay -S glean-bin" />
      <TbaRow label=".deb and .rpm packages" />
    </>
  )
}

export default function Download() {
  const detected = detectPlatform()
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const open = () => setShowAll(true)
    window.addEventListener('glean:show-all-downloads', open)
    return () => window.removeEventListener('glean:show-all-downloads', open)
  }, [])

  return (
    <section id="download" className="block block-center">
      <h2>Download</h2>
      <p className="dl-badge">
        <img src={gleanIcon} alt="" width={22} height={22} />
        <span>glean v1.5.0, free and open source under GPL-3.0</span>
      </p>
      <p>v2.0.0 is in development.</p>

      {detected !== 'other' && (
        <div className="dl-primary">
          {detected === 'windows' && <WindowsRows />}
          {detected === 'macos' && <MacRows />}
          {detected === 'linux' && <LinuxRows />}
        </div>
      )}

      <button
        type="button"
        className="dl-toggle"
        aria-expanded={showAll}
        onClick={() => setShowAll(!showAll)}
      >
        <svg
          className="dl-chevron"
          viewBox="0 0 24 24"
          width={14}
          height={14}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ transform: showAll ? 'rotate(180deg)' : undefined }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        {showAll ? 'Hide all platforms' : 'All platforms'}
      </button>

      {showAll && (
        <div className="dl-all">
          <h3>Windows</h3>
          <WindowsRows />
          <h3>macOS</h3>
          <MacRows />
          <p className="dl-note">
            The macOS build ships Apple silicon only right now; the Intel build is still pending.
          </p>
          <h3>Linux</h3>
          <LinuxRows />
        </div>
      )}

      <p className="dl-fallback">
        Every installer also lives on the <a href={RELEASES}>GitHub releases page</a>.
      </p>
    </section>
  )
}
