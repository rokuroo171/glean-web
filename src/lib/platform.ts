export type Platform = 'windows' | 'macos' | 'linux' | 'other'

// Mobile browsers get 'other' on purpose: there is no mobile build of
// glean, so the page shows every platform instead of picking one
export function detectPlatform(): Platform {
  const ua = navigator.userAgent
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return 'other'
  if (/Windows/i.test(ua)) return 'windows'
  if (/Mac/i.test(ua)) return 'macos'
  if (/Linux|X11/i.test(ua)) return 'linux'
  return 'other'
}
