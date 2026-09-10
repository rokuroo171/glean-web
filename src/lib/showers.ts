// Shower weeks lift the meteor rate, same calendar as glean's
// Constellation.jsx: Quadrantids, Lyrids, Perseids, Orionids, Leonids,
// Geminids
export function meteorBoost(): number {
  const d = new Date()
  const month = d.getMonth()
  const dom = d.getDate()
  if (month === 0 && dom >= 1 && dom <= 5) return 4
  if (month === 3 && dom >= 21 && dom <= 23) return 3
  if (month === 7 && dom >= 9 && dom <= 13) return 4
  if (month === 9 && dom >= 20 && dom <= 22) return 3
  if (month === 10 && dom >= 16 && dom <= 18) return 3
  if (month === 11 && dom >= 4 && dom <= 17) return 4
  return 1
}

// Name of the active shower, or null on ordinary nights
export function activeShower(): string | null {
  const d = new Date()
  const month = d.getMonth()
  const dom = d.getDate()
  if (month === 0 && dom >= 1 && dom <= 5) return 'Quadrantids'
  if (month === 3 && dom >= 21 && dom <= 23) return 'Lyrids'
  if (month === 7 && dom >= 9 && dom <= 13) return 'Perseids'
  if (month === 9 && dom >= 20 && dom <= 22) return 'Orionids'
  if (month === 10 && dom >= 16 && dom <= 18) return 'Leonids'
  if (month === 11 && dom >= 4 && dom <= 17) return 'Geminids'
  return null
}
