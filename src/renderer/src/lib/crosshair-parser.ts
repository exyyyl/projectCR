import { ValorantCrosshairParams } from '../types'

// ─── VALORANT ────────────────────────────────────────────────────────────────
// Code format: version;[P|A|S];key;value;key;value;...
// Example: 0;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0

// Color index → hex. Matches Valorant's built-in palette.
const VAL_COLORS: Record<number, string> = {
  0: '#FFFFFF', // White (custom fallback)
  1: '#00FF00', // Green
  2: '#FFFF00', // Yellow
  3: '#00FFFF', // Cyan
  4: '#FF4655', // Red/Pink
  5: '#FFFFFF', // White
  6: '#000000', // Black
  7: '#FF00FF', // Magenta
  8: '#FF8800', // Orange
}

export interface ParsedValorantCrosshair {
  // Misc
  color: number
  customColor: string // hex RRGGBBAA, e.g. "FF0000FF"
  outlineEnabled: boolean
  outlineThickness: number

  // Center dot
  dotEnabled: boolean
  dotOpacity: number
  dotSize: number

  // Inner lines (prefix 0)
  innerEnabled: boolean
  innerOpacity: number
  innerLength: number
  innerThickness: number
  innerOffset: number

  // Outer lines (prefix 1)
  outerEnabled: boolean
  outerOpacity: number
  outerLength: number
  outerThickness: number
  outerOffset: number
}

const DEFAULT: ParsedValorantCrosshair = {
  color: 0,
  customColor: '',
  outlineEnabled: false,
  outlineThickness: 1,
  dotEnabled: false,
  dotOpacity: 1,
  dotSize: 2,
  innerEnabled: true,
  innerOpacity: 1,
  innerLength: 6,
  innerThickness: 2,
  innerOffset: 3,
  outerEnabled: false,
  outerOpacity: 1,
  outerLength: 2,
  outerThickness: 2,
  outerOffset: 10,
}

export function parseValorantCode(code: string): ParsedValorantCrosshair {
  const p: ParsedValorantCrosshair = { ...DEFAULT }
  if (!code) return p

  const parts = code.split(';')
  let i = 0

  // skip version number
  if (parts[i] && /^\d+$/.test(parts[i])) i++

  while (i < parts.length) {
    const key = parts[i]

    // Section markers — only parse Primary (P) section
    if (key === 'P' || key === 'A' || key === 'S') {
      if (key !== 'P') break // stop after P section ends
      i++
      continue
    }

    const val = parts[i + 1]
    if (val === undefined) break

    const num = parseFloat(val)
    const bool = val === '1'

    switch (key) {
      // Color
      case 'c': p.color = num; break
      case 'u': p.customColor = val; break

      // Outline
      case 'h': p.outlineEnabled = bool; break
      case 't': p.outlineThickness = num; break

      // Center dot
      case 'd': p.dotEnabled = bool; break
      case 'z': p.dotSize = num; break
      case 'a': p.dotOpacity = num; break

      // Inner lines
      case '0s': p.innerEnabled = bool; break
      case '0l': p.innerLength = num; break
      case '0t': p.innerThickness = num; break
      case '0o': p.innerOffset = num; break
      case '0a': p.innerOpacity = num; break

      // Outer lines
      case '1s': p.outerEnabled = bool; break
      case '1l': p.outerLength = num; break
      case '1t': p.outerThickness = num; break
      case '1o': p.outerOffset = num; break
      case '1a': p.outerOpacity = num; break
    }

    i += 2
  }

  return p
}

export function getValorantColor(p: ParsedValorantCrosshair): string {
  if (p.customColor && p.customColor.length >= 6) {
    return `#${p.customColor.slice(0, 6)}`
  }
  return VAL_COLORS[p.color] ?? '#FFFFFF'
}

// ─── CS2 ─────────────────────────────────────────────────────────────────────

export function isValidCS2Code(code: string): boolean {
  return /^CSGO-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/.test(code)
}

export function isValidValorantCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  return /^\d+;/.test(code) && code.includes(';') && !/\s/.test(code)
}

export function detectGame(code: string): 'valorant' | 'cs2' | null {
  if (isValidCS2Code(code)) return 'cs2'
  if (isValidValorantCode(code)) return 'valorant'
  return null
}

export function extractPreviewColor(game: 'valorant' | 'cs2', code: string): string {
  if (game === 'valorant') return getValorantColor(parseValorantCode(code))
  return '#00CCCC' // default cyan for CS2
}
