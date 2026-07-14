// VALORANT crosshair profile codes are semicolon-delimited settings grouped by
// sections. P is the primary crosshair; A and S contain ADS/sniper settings.

const VALORANT_COLORS: Record<number, string> = {
  0: '#FFFFFF',
  1: '#00FF00',
  2: '#7FFF00',
  3: '#DFFF00',
  4: '#FFFF00',
  5: '#00FFFF',
  6: '#FF00FF',
  7: '#FF0000',
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
  innerEnabled: boolean
  innerOpacity: number
  innerLength: number
  innerVertical: number
  innerLengthNotLinked: boolean
  innerThickness: number
  innerOffset: number
  innerFiringError: boolean
  innerMovementError: boolean
  outerEnabled: boolean
  outerOpacity: number
  outerLength: number
  outerVertical: number
  outerLengthNotLinked: boolean
  outerThickness: number
  outerOffset: number
  outerFiringError: boolean
  outerMovementError: boolean
  overrideFiringErrorOffset: boolean
}

const DEFAULT_VALORANT: ParsedValorantCrosshair = {
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

function finiteNumber(value: string, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function enabled(value: string): boolean {
  return value === '1'
}

export function parseValorantCode(code: string): ParsedValorantCrosshair {
  const parsed = { ...DEFAULT_VALORANT }
  if (!isValidValorantCode(code)) return parsed

  const tokens = code.trim().split(';')
  let section = ''

  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index]
    // Section names are uppercase in exported codes. Lowercase `a` and `s`
    // are ordinary setting keys and must not be mistaken for ADS/sniper.
    if (token === 'P' || token === 'p' || token === 'A' || token === 'S' || token === 'NAME') {
      section = token === 'p' ? 'P' : token
      continue
    }

    const value = tokens[index + 1]
    if (value === undefined) break
    index += 1

    // The card preview represents the normal primary crosshair only.
    if (section !== '' && section !== 'P') continue

    const prefix = token[0]
    const lineKey = token.slice(1)
    const isInner = prefix === '0'
    const isOuter = prefix === '1'

    if (isInner || isOuter) {
      const side = isInner ? 'inner' : 'outer'
      switch (lineKey) {
        case 'b': parsed[`${side}Enabled`] = enabled(value); break
        case 'a': parsed[`${side}Opacity`] = finiteNumber(value, 1); break
        case 'l': parsed[`${side}Length`] = finiteNumber(value, 0); break
        case 'v': parsed[`${side}Vertical`] = finiteNumber(value, 0); break
        case 'g': parsed[`${side}LengthNotLinked`] = enabled(value); break
        case 't': parsed[`${side}Thickness`] = finiteNumber(value, 0); break
        case 'o': parsed[`${side}Offset`] = finiteNumber(value, 0); break
        case 'f': parsed[`${side}FiringError`] = enabled(value); break
        case 'm': parsed[`${side}MovementError`] = enabled(value); break
      }
      continue
    }

    switch (token) {
      case 'c': parsed.color = Math.trunc(finiteNumber(value, 0)); break
      case 'u': parsed.customColor = value.replace(/^#/, '').slice(0, 6).toUpperCase(); break
      case 'h': parsed.outlineEnabled = enabled(value); break
      case 't': parsed.outlineThickness = finiteNumber(value, 1); break
      case 'o': parsed.outlineOpacity = finiteNumber(value, 0.5); break
      case 'd': parsed.dotEnabled = enabled(value); break
      case 'z': parsed.dotSize = finiteNumber(value, 2); break
      case 'a': parsed.dotOpacity = finiteNumber(value, 1); break
      case 'm': parsed.overrideFiringErrorOffset = enabled(value); break
    }
  }

  return parsed
}

export function getValorantColor(crosshair: ParsedValorantCrosshair): string {
  if (crosshair.color === 8 && /^[0-9a-f]{6}$/i.test(crosshair.customColor)) {
    return `#${crosshair.customColor}`
  }
  return VALORANT_COLORS[crosshair.color] ?? '#FFFFFF'
}

// CS2 uses a 19-byte payload encoded as a 25-character Base57 value.
const CS2_DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789'
const CS2_PATTERN = /^CSGO-(?:[ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789]{5}-){4}[ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789]{5}$/

export interface ParsedCS2Crosshair {
  gap: number
  outline: number
  red: number
  green: number
  blue: number
  alpha: number
  splitDistance: number
  followRecoil: boolean
  fixedCrosshairGap: number
  color: number
  outlineEnabled: boolean
  innerSplitAlpha: number
  outerSplitAlpha: number
  splitSizeRatio: number
  thickness: number
  centerDotEnabled: boolean
  deployedWeaponGapEnabled: boolean
  alphaEnabled: boolean
  tStyleEnabled: boolean
  style: number
  length: number
}

function signedByte(value: number): number {
  return value > 127 ? value - 256 : value
}

function decodeCS2Bytes(code: string): number[] | null {
  if (!isValidCS2Code(code)) return null

  const compact = code.trim().slice(5).replaceAll('-', '')
  let value = 0n

  for (const character of [...compact].reverse()) {
    value = value * 57n + BigInt(CS2_DICTIONARY.indexOf(character))
  }

  const bytes = new Array<number>(19).fill(0)
  for (let index = bytes.length - 1; index >= 0; index -= 1) {
    bytes[index] = Number(value & 0xffn)
    value >>= 8n
  }
  return bytes
}

export function parseCS2Code(code: string): ParsedCS2Crosshair | null {
  const bytes = decodeCS2Bytes(code)
  if (!bytes) return null

  const flags = bytes[14] >> 4
  return {
    gap: signedByte(bytes[3]) / 10,
    outline: bytes[4] / 2,
    red: bytes[5],
    green: bytes[6],
    blue: bytes[7],
    alpha: bytes[8],
    splitDistance: bytes[9] & 0x7f,
    followRecoil: (bytes[9] & 0x80) !== 0,
    fixedCrosshairGap: signedByte(bytes[10]) / 10,
    color: bytes[11] & 0x07,
    outlineEnabled: (bytes[11] & 0x08) !== 0,
    innerSplitAlpha: (bytes[11] >> 4) / 10,
    outerSplitAlpha: (bytes[12] & 0x0f) / 10,
    splitSizeRatio: (bytes[12] >> 4) / 10,
    thickness: bytes[13] / 10,
    centerDotEnabled: (flags & 0x01) !== 0,
    deployedWeaponGapEnabled: (flags & 0x02) !== 0,
    alphaEnabled: (flags & 0x04) !== 0,
    tStyleEnabled: (flags & 0x08) !== 0,
    style: (bytes[14] & 0x0f) >> 1,
    length: bytes[15] / 10,
  }
}

const CS2_COLORS: Record<number, string> = {
  0: '#FF0000',
  1: '#00FF00',
  2: '#FFFF00',
  3: '#0000FF',
  4: '#00FFFF',
}

export function getCS2Color(crosshair: ParsedCS2Crosshair): string {
  if (crosshair.color !== 5 && CS2_COLORS[crosshair.color]) return CS2_COLORS[crosshair.color]
  return `#${[crosshair.red, crosshair.green, crosshair.blue]
    .map(channel => channel.toString(16).padStart(2, '0'))
    .join('')}`
}

export function isValidCS2Code(code: string): boolean {
  return typeof code === 'string' && CS2_PATTERN.test(code.trim())
}

export function isValidValorantCode(code: string): boolean {
  if (typeof code !== 'string') return false
  const normalized = code.trim()
  if (!/^\d+;/.test(normalized) || /\s/.test(normalized)) return false

  const tokens = normalized.split(';')
  return tokens.length >= 3 && tokens.every(token => /^[A-Za-z0-9.#-]*$/.test(token))
}

export function detectGame(code: string): 'valorant' | 'cs2' | null {
  if (isValidCS2Code(code)) return 'cs2'
  if (isValidValorantCode(code)) return 'valorant'
  return null
}

export function extractPreviewColor(game: 'valorant' | 'cs2', code: string): string {
  if (game === 'valorant') return getValorantColor(parseValorantCode(code))
  const parsed = parseCS2Code(code)
  return parsed ? getCS2Color(parsed) : '#FFFFFF'
}
