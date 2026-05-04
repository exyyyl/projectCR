// ─── VALORANT CROSSHAIR CODE PARSER ─────────────────────────────────────────
// Based on reverse-engineered format from genesy/crosshair-codes
//
// Code format:  0;P;key;value;key;value;...
// Sections:     P = Primary, A = ADS, S = Sniper
// Line prefix:  0x = inner lines, 1x = outer lines
//
// Key mappings (PrimaryMapping):
//   c = color index (0-8)     u = custom hex color
//   h = outlines (bool)       t = outline thickness    o = outline opacity
//   d = center dot (bool)     z = dot thickness        a = dot opacity
//   m = override firing-error offset with crosshair offset (bool)
//
// Key mappings (LineMapping, prefixed 0 or 1):
//   b = show (bool)     a = opacity      l = length
//   v = vertical len    g = length_not_linked (bool)
//   t = thickness       o = offset
//   m = movement_error (bool)   s = movement_error_multiplier
//   f = firing_error (bool)     e = firing_error_multiplier

// VALORANT preset color palette (index → hex)
const VAL_COLORS: Record<number, string> = {
  0: '#FFFFFF', // White
  1: '#00FF00', // Green
  2: '#7FFF00', // Yellow-Green
  3: '#FFFF00', // Yellow
  4: '#00FFFF', // Cyan
  5: '#FF69B4', // Pink
  6: '#FF4655', // Red
  7: '#FFFFFF', // White (custom fallback)
  8: '#FFFFFF', // Custom color (use customColor field)
}

export interface ParsedValorantCrosshair {
  color: number
  customColor: string

  outlineEnabled: boolean
  outlineThickness: number
  outlineOpacity: number

  dotEnabled: boolean
  dotOpacity: number
  dotSize: number

  // Inner lines (prefix 0)
  innerEnabled: boolean
  innerOpacity: number
  innerLength: number
  innerVertical: number          // vertical length when not linked
  innerLengthNotLinked: boolean
  innerThickness: number
  innerOffset: number
  innerFiringError: boolean
  innerMovementError: boolean

  // Outer lines (prefix 1)
  outerEnabled: boolean
  outerOpacity: number
  outerLength: number
  outerVertical: number
  outerLengthNotLinked: boolean
  outerThickness: number
  outerOffset: number
  outerFiringError: boolean
  outerMovementError: boolean

  // Global
  overrideFiringErrorOffset: boolean
}

// Defaults match genesy/crosshair-codes DEFAULT_PRIMARY_SETTINGS exactly
const DEFAULT: ParsedValorantCrosshair = {
  color: 0,
  customColor: 'FFFFFF',

  outlineEnabled: true,
  outlineThickness: 1,
  outlineOpacity: 0.5,

  dotEnabled: false,
  dotOpacity: 1,
  dotSize: 2,

  innerEnabled: true,
  innerOpacity: 0.8,
  innerLength: 6,
  innerVertical: 6,
  innerLengthNotLinked: false,
  innerThickness: 2,
  innerOffset: 3,
  innerFiringError: true,
  innerMovementError: false,

  outerEnabled: true,
  outerOpacity: 0.35,
  outerLength: 2,
  outerVertical: 2,
  outerLengthNotLinked: false,
  outerThickness: 2,
  outerOffset: 10,
  outerFiringError: true,
  outerMovementError: true,

  overrideFiringErrorOffset: false,
}

export function parseValorantCode(code: string): ParsedValorantCrosshair {
  const p: ParsedValorantCrosshair = { ...DEFAULT }
  if (!code || typeof code !== 'string') return p

  const tokens = code.split(';')
  // Skip version (tokens[0])
  
  let currentSection = '' // 'P', 'A', 'S', etc.

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token) continue

    // Section markers: single letter sections or NAME
    if (['P', 'A', 'S', 'NAME'].includes(token.toUpperCase())) {
      currentSection = token.toUpperCase()
      continue
    }

    // Key-Value pairs
    const key = token
    const val = tokens[i + 1]
    if (val === undefined) break
    i++ // Skip value in next iteration

    const num = isNaN(parseFloat(val)) ? 0 : parseFloat(val)
    const bool = val === '1'

    // We primarily care about the Primary (P) section or global tokens before any section
    if (currentSection === 'P' || currentSection === '') {
      if (key.startsWith('0')) {
        const lk = key.slice(1)
        switch (lk) {
          case 'b': p.innerEnabled = bool; break
          case 'a': p.innerOpacity = isNaN(num) ? 1 : num; break
          case 'l': p.innerLength = num; break
          case 'v': p.innerVertical = num; break
          case 'g': p.innerLengthNotLinked = bool; break
          case 't': p.innerThickness = num; break
          case 'o': p.innerOffset = num; break
          case 'f': p.innerFiringError = bool; break
          case 'm': p.innerMovementError = bool; break
        }
      } else if (key.startsWith('1')) {
        const lk = key.slice(1)
        switch (lk) {
          case 'b': p.outerEnabled = bool; break
          case 'a': p.outerOpacity = isNaN(num) ? 1 : num; break
          case 'l': p.outerLength = num; break
          case 'v': p.outerVertical = num; break
          case 'g': p.outerLengthNotLinked = bool; break
          case 't': p.outerThickness = num; break
          case 'o': p.outerOffset = num; break
          case 'f': p.outerFiringError = bool; break
          case 'm': p.outerMovementError = bool; break
        }
      } else {
        switch (key) {
          case 'c':
            p.color = isNaN(num) ? 0 : Math.floor(num)
            if (p.color !== 8) {
              p.customColor = (VAL_COLORS[p.color] ?? '#FFFFFF').replace('#', '')
            }
            break
          case 'u': p.customColor = val; break
          case 'h': p.outlineEnabled = bool; break
          case 't': p.outlineThickness = isNaN(num) ? 1 : num; break
          case 'o': p.outlineOpacity = isNaN(num) ? 0.5 : num; break
          case 'd': p.dotEnabled = bool; break
          case 'z': p.dotSize = isNaN(num) ? 2 : num; break
          case 'a': p.dotOpacity = isNaN(num) ? 1 : num; break
          case 'm': p.overrideFiringErrorOffset = bool; break
        }
      }
    }
  }

  return p
}

// Effective gap = offset + FIXED_GAP(4) when firing_error=true and not overriding
// This matches the reference calculateGap() function exactly
export function calcGap(offset: number, firingError: boolean, override: boolean): number {
  const FIXED_GAP = 4
  return offset + (firingError && !override ? FIXED_GAP : 0)
}

export function getValorantColor(p: ParsedValorantCrosshair): string {
  if (p.color === 8 && p.customColor && p.customColor.length >= 6) {
    return `#${p.customColor.slice(0, 6)}`
  }
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
  return '#00CCCC'
}
