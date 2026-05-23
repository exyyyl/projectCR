export type Game = 'valorant' | 'cs2'

export interface Crosshair {
  id: string
  game: Game
  name: string
  code: string
  tags: string
  note: string
  color_preview: string
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

export interface UserPreset {
  id: string
  name: string
  game: Game
  code: string
  sens?: number
  dpi?: number
  pollingRate?: number
  zoomSens?: number
  resolution?: string
  scaling?: string
  monitorHz?: number
  desc?: string
  created_at: string
  
  // Rich Konect settings config
  config?: {
    mouse?: {
      scopedSens?: string
      rawInput?: 'on' | 'off'
    }
    crosshairDetails?: {
      color?: string
      crosshairColor?: string
      outlines?: 'on' | 'off'
      centerDot?: 'on' | 'off'
      centerDotOpacity?: string
      centerDotThickness?: string
      innerLines?: {
        show?: 'on' | 'off'
        opacity?: string
        length?: string
        thickness?: string
        offset?: string
        movementError?: 'on' | 'off'
        firingError?: 'on' | 'off'
        firingErrorMultiplier?: string
      }
      outerLines?: {
        show?: 'on' | 'off'
        opacity?: string
        length?: string
        thickness?: string
        offset?: string
        movementError?: 'on' | 'off'
        firingError?: 'on' | 'off'
        firingErrorMultiplier?: string
      }
    }
    keybinds?: {
      walk?: string
      crouch?: string
      jump?: string
      use?: string
      primary?: string
      secondary?: string
      melee?: string
      equipSpike?: string
      ability1?: string
      ability2?: string
      ability3?: string
      ultimate?: string
    }
    map?: {
      rotate?: 'rotate' | 'fixed'
      fixedOrientation?: string
      keepCentered?: 'on' | 'off'
      size?: string
      zoom?: string
      visionCones?: 'on' | 'off'
      regionNames?: string
    }
    configFile?: string
    cs2?: {
      mouseAcceleration?: string
      windowsSensitivity?: string
      size?: string
      gap?: string
      thickness?: string
      style?: string
      drawoutline?: string
      dot?: string
      color?: string
      alpha?: string
      blueGreenRed?: string
      sniperWidth?: string
      followRecoil?: string
      hudScale?: string
      viewmodelFov?: string
      viewmodelOffsetX?: string
      viewmodelOffsetY?: string
      viewmodelOffsetZ?: string
      viewmodelPresetPos?: string
      radarCentersPlayer?: string
      radarIsRotating?: string
      radarHudSize?: string
      radarMapZoom?: string
      radarToggleShape?: string
      launchOptions?: string
    }
  }
  graphics?: {
    quality?: string
    multithreaded?: 'on' | 'off'
    aa?: string
    vsync?: 'on' | 'off'
    
    // Detailed Konect fields
    resolutionWidth?: string
    resolutionHeight?: string
    displayMode?: string
    aspectRatio?: string
    aspectRatioMethod?: string
    enemyHighlightColor?: string
    materialQuality?: string
    textureQuality?: string
    detailQuality?: string
    uiQuality?: string
    vignette?: string
    nvidiaReflex?: string
    anisotropicFiltering?: string
    improveClarity?: 'on' | 'off'
    experimentalSharpening?: 'on' | 'off'
    bloom?: 'on' | 'off'
    distortion?: 'on' | 'off'
    castShadows?: 'on' | 'off'
    cs2?: {
      colorMode?: string
      brightness?: string
      boostPlayerContrast?: string
      vsync?: string
      msaa?: string
      textureFiltering?: string
      shadowQuality?: string
      modelTextureDetail?: string
      shaderDetail?: string
      particleDetail?: string
      ambientOcclusion?: string
      hdr?: string
      fidelityFxFsr?: string
      nvidiaReflex?: string
    }
  }
  monitor?: {
    model?: string
    resolution?: string
    hz?: number
    scaling?: string
    
    // Detailed Konect fields
    mode?: string
    blackEqualizer?: string
    colorVibrance?: string
    lowBlueLight?: string
    gamma?: string
    colorTemperature?: string
    dyac?: string
    brightness?: string
    contrast?: string
    sharpness?: string
    ama?: string
  }
}

declare global {
  interface Window {
    api: {
      crosshairs: {
        getAll: () => Promise<Crosshair[]>
        add: (c: Crosshair) => Promise<Crosshair>
        update: (c: Crosshair) => Promise<Crosshair>
        delete: (id: string) => Promise<{ success: boolean }>
      }
      valorant: {
        getStatus: () => Promise<{ connected: boolean; gameName?: string }>
        applyCrosshair: (code: string) => Promise<{ success: boolean; error?: string }>
      }
      cs2: {
        applyCrosshair: (code: string) => Promise<{ success: boolean; error?: string }>
        readCurrentCrosshair: () => Promise<{ code: string | null }>
      }
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
        onUpdateAvailable: (callback: (info: any) => void) => () => void
        onUpdateDownloaded: (callback: (info: any) => void) => () => void
        installUpdate: () => void
        getVersion: () => Promise<string>
      }
    }
  }
}
