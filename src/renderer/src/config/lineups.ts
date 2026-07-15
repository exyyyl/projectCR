import type {
  BuiltinLineupKind,
  CustomLineupKind,
  Game,
  LineupKind,
  LineupSide
} from '../types'

export const LINEUP_MAPS: Record<Game, string[]> = {
  valorant: [
    'Abyss', 'Ascent', 'Bind', 'Breeze', 'Corrode', 'Fracture',
    'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Summit', 'Sunset'
  ],
  cs2: [
    'Ancient', 'Anubis', 'Cache', 'Dust II', 'Inferno',
    'Mirage', 'Nuke', 'Overpass', 'Train', 'Vertigo'
  ]
}

export type CustomLineupMaps = Record<Game, string[]>

const CUSTOM_MAPS_STORAGE_KEY = 'projectcr:custom-lineup-maps'

const EMPTY_CUSTOM_MAPS: CustomLineupMaps = { valorant: [], cs2: [] }

export function loadCustomLineupMaps(): CustomLineupMaps {
  try {
    const value = localStorage.getItem(CUSTOM_MAPS_STORAGE_KEY)
    if (!value) return { ...EMPTY_CUSTOM_MAPS }
    const parsed = JSON.parse(value) as Partial<CustomLineupMaps>
    return {
      valorant: Array.isArray(parsed.valorant) ? parsed.valorant.filter((map): map is string => typeof map === 'string') : [],
      cs2: Array.isArray(parsed.cs2) ? parsed.cs2.filter((map): map is string => typeof map === 'string') : []
    }
  } catch {
    return { ...EMPTY_CUSTOM_MAPS }
  }
}

export function saveCustomLineupMap(game: Game, mapName: string): CustomLineupMaps {
  const name = mapName.trim()
  const maps = loadCustomLineupMaps()
  if (!name || [...LINEUP_MAPS[game], ...maps[game]].some((map) => map.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    return maps
  }

  const next = { ...maps, [game]: [...maps[game], name].sort((a, b) => a.localeCompare(b)) }
  localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeCustomLineupMap(game: Game, mapName: string): CustomLineupMaps {
  const maps = loadCustomLineupMaps()
  const next = {
    ...maps,
    [game]: maps[game].filter((map) => map !== mapName)
  }
  localStorage.setItem(CUSTOM_MAPS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function getLineupMaps(game: Game, customMaps: CustomLineupMaps): string[] {
  return [...LINEUP_MAPS[game], ...customMaps[game]]
}

export const LINEUP_KINDS: Array<{ value: BuiltinLineupKind; label: string }> = [
  { value: 'smoke', label: 'Дым' },
  { value: 'flash', label: 'Флешка' },
  { value: 'molly', label: 'Молотов' },
  { value: 'grenade', label: 'Граната' },
  { value: 'ability', label: 'Способность' }
]

const CUSTOM_KINDS_STORAGE_KEY = 'projectcr:custom-lineup-kinds'

export function loadCustomLineupKinds(): string[] {
  try {
    const value = localStorage.getItem(CUSTOM_KINDS_STORAGE_KEY)
    if (!value) return []
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((kind): kind is string => typeof kind === 'string')
      : []
  } catch {
    return []
  }
}

export function customLineupKindValue(label: string): CustomLineupKind {
  return `custom:${encodeURIComponent(label.trim())}`
}

export function saveCustomLineupKind(label: string): string[] {
  const name = label.trim()
  const customKinds = loadCustomLineupKinds()
  const existingLabels = [...LINEUP_KINDS.map((kind) => kind.label), ...customKinds]
  if (!name || existingLabels.some((kind) => kind.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    return customKinds
  }

  const next = [...customKinds, name].sort((a, b) => a.localeCompare(b))
  localStorage.setItem(CUSTOM_KINDS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeCustomLineupKind(label: string): string[] {
  const next = loadCustomLineupKinds().filter((kind) => kind !== label)
  localStorage.setItem(CUSTOM_KINDS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function getLineupKindOptions(customKinds: string[]): Array<{ value: LineupKind; label: string }> {
  return [
    ...LINEUP_KINDS,
    ...customKinds.map((label) => ({ value: customLineupKindValue(label), label }))
  ]
}

export const LINEUP_SIDES: Array<{ value: LineupSide; label: string }> = [
  { value: 'attack', label: 'Атака' },
  { value: 'defense', label: 'Защита' },
  { value: 'both', label: 'Обе стороны' }
]

export function lineupKindLabel(kind: LineupKind): string {
  const builtIn = LINEUP_KINDS.find((item) => item.value === kind)
  if (builtIn) return builtIn.label
  if (kind === 'other') return 'Другое'
  if (kind.startsWith('custom:')) {
    try {
      return decodeURIComponent(kind.slice('custom:'.length))
    } catch {
      return kind.slice('custom:'.length)
    }
  }
  return kind
}

export function lineupSideLabel(side: LineupSide): string {
  return LINEUP_SIDES.find((item) => item.value === side)?.label ?? 'Обе стороны'
}
