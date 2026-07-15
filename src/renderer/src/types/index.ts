export type Game = 'valorant' | 'cs2'

export interface Crosshair {
  id: string
  game: Game
  name: string
  code: string
  color_preview: string
  created_at: string
}

export type BuiltinLineupKind = 'smoke' | 'flash' | 'molly' | 'grenade' | 'ability' | 'other'
export type CustomLineupKind = `custom:${string}`
export type LineupKind = BuiltinLineupKind | CustomLineupKind
export type LineupSide = 'attack' | 'defense' | 'both'

export interface Lineup {
  id: string
  game: Game
  map: string
  name: string
  kind: LineupKind
  side: LineupSide
  start_position: string
  target_position: string
  instructions: string
  start_image: string
  aim_image: string
  result_image: string
  extra_images: string[]
  created_at: string
}

export interface ValorantCrosshairParams {
  color: number
  outlineEnabled: boolean
  outlineThickness: number
  centerDot: boolean
  centerDotSize: number
  centerDotOpacity: number
  innerLines: boolean
  innerLineOpacity: number
  innerLineLength: number
  innerLineThickness: number
  innerLineOffset: number
  innerLineMovement: boolean
  innerLineFiring: boolean
  outerLines: boolean
  outerLineOpacity: number
  outerLineLength: number
  outerLineThickness: number
  outerLineOffset: number
  outerLineMovement: boolean
  outerLineFiring: boolean
  customColor?: string
}

export interface AppSettings {
  launchAtStartup: boolean
  runInBackground: boolean
}

export interface CrosshairTransferResult {
  status: 'success' | 'cancelled'
  count: number
}

export interface DataDeleteResult {
  success: boolean
  count: number
}

export type UpdateStatus = 'idle' | 'available' | 'downloading' | 'downloaded' | 'error'

export interface AppUpdateState {
  status: UpdateStatus
  version: string | null
  progress: number
  error: string | null
}

declare global {
  interface Window {
    api: {
      crosshairs: {
        getAll: () => Promise<Crosshair[]>
        add: (c: Crosshair) => Promise<Crosshair>
        update: (c: Crosshair) => Promise<Crosshair>
        delete: (id: string) => Promise<{ success: boolean }>
        deleteAll: () => Promise<DataDeleteResult>
        exportFile: () => Promise<CrosshairTransferResult>
        importFile: () => Promise<CrosshairTransferResult>
      }
      lineups: {
        getAll: () => Promise<Lineup[]>
        add: (lineup: Lineup) => Promise<Lineup>
        update: (lineup: Lineup) => Promise<Lineup>
        delete: (id: string) => Promise<{ success: boolean }>
        deleteAll: () => Promise<DataDeleteResult>
        pickImage: () => Promise<string | null>
        discardImages: (urls: string[]) => Promise<void>
      }
      valorant: {
        getStatus: () => Promise<{ connected: boolean; gameName?: string }>
        applyCrosshair: (code: string) => Promise<{ success: boolean; error?: string }>
      }
      cs2: {
        applyCrosshair: (code: string) => Promise<{ success: boolean; error?: string }>
        readCurrentCrosshair: () => Promise<{ code: string | null }>
      }
      settings: {
        get: () => Promise<AppSettings>
        update: (patch: Partial<AppSettings>) => Promise<AppSettings>
      }
      window: {
        getUpdateState: () => Promise<AppUpdateState>
        onUpdateState: (callback: (state: AppUpdateState) => void) => () => void
        downloadUpdate: () => Promise<AppUpdateState>
        installUpdate: () => Promise<boolean>
        getVersion: () => Promise<string>
      }
    }
  }
}
