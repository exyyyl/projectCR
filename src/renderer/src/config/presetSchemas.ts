import { Game } from '../types'

export interface PresetFormState {
  name: string
  game: Game
  code: string
  sens: string
  dpi: string
  pollingRate: string
  zoomSens: string
  resolution: string
  scaling: string
  monitorHz: string
  desc: string
  
  // VALORANT Config
  scopedSens: string
  rawInput: string
  color: string
  crosshairColor: string
  outlines: string
  centerDot: string
  centerDotOpacity: string
  centerDotThickness: string
  showInnerLines: string
  innerLinesOpacity: string
  innerLinesLength: string
  innerLinesThickness: string
  innerLinesOffset: string
  innerLinesMovementError: string
  innerLinesFiringError: string
  innerLinesFiringErrorMultiplier: string
  showOuterLines: string
  outerLinesOpacity: string
  outerLinesLength: string
  outerLinesThickness: string
  outerLinesOffset: string
  outerLinesMovementError: string
  outerLinesFiringError: string
  outerLinesFiringErrorMultiplier: string
  walk: string
  crouch: string
  jump: string
  use: string
  primaryWeapon: string
  secondaryWeapon: string
  meleeWeapon: string
  equipSpike: string
  ability1: string
  ability2: string
  ability3: string
  ultimate: string
  rotate: string
  fixedOrientation: string
  keepCentered: string
  minimapSize: string
  minimapZoom: string
  minimapVisionCones: string
  mapRegionNames: string
  
  // Graphics
  graphicsQuality: string
  multithreaded: string
  aa: string
  vsync: string
  monitorModel: string
  configFileName: string
  
  resolutionWidth: string
  resolutionHeight: string
  displayMode: string
  aspectRatio: string
  aspectRatioMethod: string
  enemyHighlightColor: string
  materialQuality: string
  textureQuality: string
  detailQuality: string
  uiQuality: string
  vignette: string
  nvidiaReflex: string
  anisotropicFiltering: string
  improveClarity: string
  experimentalSharpening: string
  bloom: string
  distortion: string
  castShadows: string
  
  // Monitor tab detailed settings
  monitorMode: string
  blackEqualizer: string
  colorVibrance: string
  lowBlueLight: string
  monitorGamma: string
  colorTemperature: string
  dyac: string
  brightness: string
  contrast: string
  sharpness: string
  ama: string
  
  // CS2 Config settings
  cs2MouseAcceleration: string
  cs2WindowsSensitivity: string
  cs2Size: string
  cs2Gap: string
  cs2Thickness: string
  cs2Style: string
  cs2DrawOutline: string
  cs2Dot: string
  cs2Color: string
  cs2Alpha: string
  cs2BlueGreenRed: string
  cs2SniperWidth: string
  cs2FollowRecoil: string
  cs2HudScale: string
  cs2ViewmodelFov: string
  cs2ViewmodelOffsetX: string
  cs2ViewmodelOffsetY: string
  cs2ViewmodelOffsetZ: string
  cs2ViewmodelPresetPos: string
  cs2RadarCentersPlayer: string
  cs2RadarIsRotating: string
  cs2RadarHudSize: string
  cs2RadarMapZoom: string
  cs2RadarToggleShape: string
  cs2LaunchOptions: string
  
  // CS2 Video settings
  cs2ColorMode: string
  cs2VideoBrightness: string
  cs2BoostPlayerContrast: string
  cs2Vsync: string
  cs2Msaa: string
  cs2TextureFiltering: string
  cs2ShadowQuality: string
  cs2ModelTextureDetail: string
  cs2ShaderDetail: string
  cs2ParticleDetail: string
  cs2AmbientOcclusion: string
  cs2Hdr: string
  cs2FidelityFxFsr: string
  cs2NvidiaReflex: string
}

export const INITIAL_VALORANT_PRESET: PresetFormState = {
  name: '',
  game: 'valorant',
  code: '',
  sens: '',
  dpi: '800',
  pollingRate: '1000',
  zoomSens: '1.0',
  resolution: '1920x1080',
  scaling: 'native',
  monitorHz: '240',
  desc: '',
  
  scopedSens: '1.0',
  rawInput: 'on',
  color: 'white',
  crosshairColor: '#ffffff',
  outlines: 'on',
  centerDot: 'off',
  centerDotOpacity: '1.0',
  centerDotThickness: '2',
  showInnerLines: 'on',
  innerLinesOpacity: '0.8',
  innerLinesLength: '6',
  innerLinesThickness: '2',
  innerLinesOffset: '3',
  innerLinesMovementError: 'off',
  innerLinesFiringError: 'off',
  innerLinesFiringErrorMultiplier: '1.0',
  showOuterLines: 'off',
  outerLinesOpacity: '0.5',
  outerLinesLength: '2',
  outerLinesThickness: '2',
  outerLinesOffset: '10',
  outerLinesMovementError: 'off',
  outerLinesFiringError: 'off',
  outerLinesFiringErrorMultiplier: '1.0',
  walk: 'shift',
  crouch: 'ctrl',
  jump: 'space',
  use: 'e',
  primaryWeapon: '1',
  secondaryWeapon: '2',
  meleeWeapon: '3',
  equipSpike: '4',
  ability1: 'q',
  ability2: 'e',
  ability3: 'c',
  ultimate: 'x',
  rotate: 'rotate',
  fixedOrientation: 'always_align',
  keepCentered: 'on',
  minimapSize: '1.2',
  minimapZoom: '0.9',
  minimapVisionCones: 'on',
  mapRegionNames: 'always',
  
  graphicsQuality: 'medium',
  multithreaded: 'on',
  aa: '4x MSAA',
  vsync: 'off',
  monitorModel: 'Zowie XL2546K',
  configFileName: '',
  
  resolutionWidth: '1920',
  resolutionHeight: '1080',
  displayMode: 'Fullscreen',
  aspectRatio: '16:9',
  aspectRatioMethod: 'Letterbox',
  enemyHighlightColor: 'Red (Deuteranopia)',
  materialQuality: 'medium',
  textureQuality: 'medium',
  detailQuality: 'medium',
  uiQuality: 'medium',
  vignette: 'off',
  nvidiaReflex: 'On + Boost',
  anisotropicFiltering: '8x',
  improveClarity: 'on',
  experimentalSharpening: 'off',
  bloom: 'off',
  distortion: 'off',
  castShadows: 'on',
  
  monitorMode: 'FPS1',
  blackEqualizer: '10',
  colorVibrance: '12',
  lowBlueLight: '0',
  monitorGamma: 'Gamma 3',
  colorTemperature: 'Normal',
  dyac: 'Premium',
  brightness: '70',
  contrast: '50',
  sharpness: '8',
  ama: 'High',
  
  cs2MouseAcceleration: '0.00',
  cs2WindowsSensitivity: '6',
  cs2Size: '3',
  cs2Gap: '-2',
  cs2Thickness: '1',
  cs2Style: '4',
  cs2DrawOutline: 'Off',
  cs2Dot: 'Off',
  cs2Color: 'Green',
  cs2Alpha: '200',
  cs2BlueGreenRed: '0 255 0',
  cs2SniperWidth: '1',
  cs2FollowRecoil: 'No',
  cs2HudScale: '0.90',
  cs2ViewmodelFov: '60',
  cs2ViewmodelOffsetX: '1',
  cs2ViewmodelOffsetY: '1',
  cs2ViewmodelOffsetZ: '-1',
  cs2ViewmodelPresetPos: '1',
  cs2RadarCentersPlayer: 'Yes',
  cs2RadarIsRotating: 'Yes',
  cs2RadarHudSize: '1.00',
  cs2RadarMapZoom: '0.70',
  cs2RadarToggleShape: 'Yes',
  cs2LaunchOptions: '-novid -tickrate 128',
  
  cs2ColorMode: 'Computer',
  cs2VideoBrightness: '80%',
  cs2BoostPlayerContrast: 'Enabled',
  cs2Vsync: 'Disabled',
  cs2Msaa: '4x MSAA',
  cs2TextureFiltering: 'Anisotropic 8x',
  cs2ShadowQuality: 'High',
  cs2ModelTextureDetail: 'Medium',
  cs2ShaderDetail: 'High',
  cs2ParticleDetail: 'Medium',
  cs2AmbientOcclusion: 'High',
  cs2Hdr: 'Quality',
  cs2FidelityFxFsr: 'Disabled (Highest Quality)',
  cs2NvidiaReflex: 'Enabled'
}

export const INITIAL_CS2_PRESET: PresetFormState = {
  ...INITIAL_VALORANT_PRESET,
  name: '',
  game: 'cs2',
  code: '',
  sens: ''
}

export const VALORANT_TEMPLATES = {
  default: {
    name: 'VALORANT Default',
    game: 'valorant' as Game,
    sens: '0.4',
    dpi: '800',
    pollingRate: '1000',
    zoomSens: '1.0',
    resolution: '1920x1080',
    scaling: 'native',
    monitorHz: '240',
    desc: 'Стандартные настройки VALORANT',
    scopedSens: '1.0',
    rawInput: 'on',
    code: '0;P;c;5;o;1;0t;1;0l;4;0o;2;0a;1;0f;0;1b;0',
    color: 'white',
    crosshairColor: '#ffffff',
    outlines: 'on',
    centerDot: 'off',
    centerDotOpacity: '1.0',
    centerDotThickness: '2',
    showInnerLines: 'on',
    innerLinesOpacity: '0.8',
    innerLinesLength: '4',
    innerLinesThickness: '2',
    innerLinesOffset: '2',
    innerLinesMovementError: 'off',
    innerLinesFiringError: 'off',
    innerLinesFiringErrorMultiplier: '1.0',
    showOuterLines: 'off',
    outerLinesOpacity: '0.5',
    outerLinesLength: '2',
    outerLinesThickness: '2',
    outerLinesOffset: '10',
    outerLinesMovementError: 'off',
    outerLinesFiringError: 'off',
    outerLinesFiringErrorMultiplier: '1.0',
    walk: 'shift',
    crouch: 'ctrl',
    jump: 'space',
    use: 'e',
    primaryWeapon: '1',
    secondaryWeapon: '2',
    meleeWeapon: '3',
    equipSpike: '4',
    ability1: 'q',
    ability2: 'e',
    ability3: 'c',
    ultimate: 'x',
    rotate: 'rotate',
    fixedOrientation: 'always_align',
    keepCentered: 'on',
    minimapSize: '1.1',
    minimapZoom: '0.9',
    minimapVisionCones: 'on',
    mapRegionNames: 'always',
    graphicsQuality: 'medium',
    multithreaded: 'on',
    aa: '4x MSAA',
    vsync: 'off',
    monitorModel: 'Zowie XL2546K',
    configFileName: '',
    resolutionWidth: '1920',
    resolutionHeight: '1080',
    displayMode: 'Fullscreen',
    aspectRatio: '16:9',
    aspectRatioMethod: 'Letterbox',
    enemyHighlightColor: 'Red',
    materialQuality: 'medium',
    textureQuality: 'medium',
    detailQuality: 'medium',
    uiQuality: 'medium',
    vignette: 'off',
    nvidiaReflex: 'On + Boost',
    anisotropicFiltering: '4x',
    improveClarity: 'on',
    experimentalSharpening: 'off',
    bloom: 'off',
    distortion: 'off',
    castShadows: 'on',
    monitorMode: 'FPS1',
    blackEqualizer: '10',
    colorVibrance: '10',
    lowBlueLight: '0',
    monitorGamma: 'Gamma 3',
    colorTemperature: 'Normal',
    dyac: 'Off',
    brightness: '80',
    contrast: '50',
    sharpness: '7',
    ama: 'High'
  },
  pro: {
    name: 'TenZ',
    game: 'valorant' as Game,
    sens: '0.3',
    dpi: '800',
    pollingRate: '1000',
    zoomSens: '1.0',
    resolution: '1920x1080',
    scaling: 'native',
    monitorHz: '360',
    desc: 'Официальные настройки игрока TenZ',
    scopedSens: '1.0',
    rawInput: 'on',
    code: '0;s;1;P;c;5;h;0;m;1;0l;4;0v;4;0o;2;0a;1;0f;0;1b;0;S;c;4;s;0.8;o;1',
    color: 'cyan',
    crosshairColor: '#00ffff',
    outlines: 'off',
    centerDot: 'off',
    centerDotOpacity: '1.0',
    centerDotThickness: '2',
    showInnerLines: 'on',
    innerLinesOpacity: '1.0',
    innerLinesLength: '4',
    innerLinesThickness: '2',
    innerLinesOffset: '2',
    innerLinesMovementError: 'off',
    innerLinesFiringError: 'off',
    innerLinesFiringErrorMultiplier: '1.0',
    showOuterLines: 'off',
    outerLinesOpacity: '0.5',
    outerLinesLength: '2',
    outerLinesThickness: '2',
    outerLinesOffset: '10',
    outerLinesMovementError: 'off',
    outerLinesFiringError: 'off',
    outerLinesFiringErrorMultiplier: '1.0',
    walk: 'l-shift',
    crouch: 'l-ctrl',
    jump: 'space',
    use: 'e',
    primaryWeapon: '1',
    secondaryWeapon: '2',
    meleeWeapon: '3',
    equipSpike: '4',
    ability1: 'c',
    ability2: 'e',
    ability3: 'q',
    ultimate: 'x',
    rotate: 'rotate',
    fixedOrientation: 'always_align',
    keepCentered: 'on',
    minimapSize: '1.2',
    minimapZoom: '0.9',
    minimapVisionCones: 'on',
    mapRegionNames: 'always',
    graphicsQuality: 'low',
    multithreaded: 'on',
    aa: 'None',
    vsync: 'off',
    monitorModel: 'Zowie XL2566K',
    configFileName: '',
    resolutionWidth: '1920',
    resolutionHeight: '1080',
    displayMode: 'Fullscreen',
    aspectRatio: '16:9',
    aspectRatioMethod: 'Letterbox',
    enemyHighlightColor: 'Yellow (Deuteranopia)',
    materialQuality: 'low',
    textureQuality: 'low',
    detailQuality: 'low',
    uiQuality: 'low',
    vignette: 'off',
    nvidiaReflex: 'On + Boost',
    anisotropicFiltering: '1x',
    improveClarity: 'on',
    experimentalSharpening: 'off',
    bloom: 'off',
    distortion: 'off',
    castShadows: 'off',
    monitorMode: 'FPS1',
    blackEqualizer: '12',
    colorVibrance: '11',
    lowBlueLight: '0',
    monitorGamma: 'Gamma 4',
    colorTemperature: 'Normal',
    dyac: 'Premium',
    brightness: '70',
    contrast: '50',
    sharpness: '8',
    ama: 'High'
  }
}

export const CS2_TEMPLATES = {
  default: {
    name: 'CS2 Default',
    game: 'cs2' as Game,
    sens: '1.5',
    dpi: '800',
    pollingRate: '1000',
    zoomSens: '1.0',
    resolution: '1920x1080',
    scaling: 'native',
    monitorHz: '240',
    desc: 'Стандартные настройки CS2',
    scopedSens: '1.0',
    rawInput: 'on',
    code: 'CSGO-k9M7w-oX9x3-4UoJy-5G3Y3-86o3B',
    color: 'green',
    crosshairColor: '#00ff00',
    outlines: 'off',
    centerDot: 'off',
    centerDotOpacity: '1.0',
    centerDotThickness: '2',
    showInnerLines: 'on',
    innerLinesOpacity: '1.0',
    innerLinesLength: '3',
    innerLinesThickness: '1.5',
    innerLinesOffset: '1',
    innerLinesMovementError: 'off',
    innerLinesFiringError: 'off',
    innerLinesFiringErrorMultiplier: '1.0',
    showOuterLines: 'off',
    outerLinesOpacity: '0.5',
    outerLinesLength: '2',
    outerLinesThickness: '2',
    outerLinesOffset: '10',
    outerLinesMovementError: 'off',
    outerLinesFiringError: 'off',
    outerLinesFiringErrorMultiplier: '1.0',
    walk: 'shift',
    crouch: 'ctrl',
    jump: 'space',
    use: 'e',
    primaryWeapon: '1',
    secondaryWeapon: '2',
    meleeWeapon: '3',
    equipSpike: '5',
    ability1: 'q',
    ability2: 'f',
    ability3: 'c',
    ultimate: 'x',
    rotate: 'rotate',
    fixedOrientation: 'always_align',
    keepCentered: 'on',
    minimapSize: '1.0',
    minimapZoom: '1.0',
    minimapVisionCones: 'on',
    mapRegionNames: 'always',
    graphicsQuality: 'high',
    multithreaded: 'on',
    aa: '4x MSAA',
    vsync: 'off',
    monitorModel: 'Zowie XL2546K',
    configFileName: '',
    resolutionWidth: '1920',
    resolutionHeight: '1080',
    displayMode: 'Fullscreen',
    aspectRatio: '16:9',
    aspectRatioMethod: 'Letterbox',
    enemyHighlightColor: 'Red',
    materialQuality: 'high',
    textureQuality: 'high',
    detailQuality: 'high',
    uiQuality: 'high',
    vignette: 'off',
    nvidiaReflex: 'On',
    anisotropicFiltering: '8x',
    improveClarity: 'on',
    experimentalSharpening: 'off',
    bloom: 'off',
    distortion: 'off',
    castShadows: 'on',
    monitorMode: 'Standard',
    blackEqualizer: '8',
    colorVibrance: '12',
    lowBlueLight: '0',
    monitorGamma: 'Gamma 3',
    colorTemperature: 'Normal',
    dyac: 'Off',
    brightness: '80',
    contrast: '50',
    sharpness: '7',
    ama: 'High',
    cs2MouseAcceleration: '0.00',
    cs2WindowsSensitivity: '6',
    cs2Size: '3',
    cs2Gap: '-2',
    cs2Thickness: '1',
    cs2Style: '4',
    cs2DrawOutline: 'Off',
    cs2Dot: 'Off',
    cs2Color: 'Green',
    cs2Alpha: '200',
    cs2BlueGreenRed: '0 255 0',
    cs2SniperWidth: '1',
    cs2FollowRecoil: 'No',
    cs2HudScale: '0.90',
    cs2ViewmodelFov: '60',
    cs2ViewmodelOffsetX: '1',
    cs2ViewmodelOffsetY: '1',
    cs2ViewmodelOffsetZ: '-1',
    cs2ViewmodelPresetPos: '1',
    cs2RadarCentersPlayer: 'Yes',
    cs2RadarIsRotating: 'Yes',
    cs2RadarHudSize: '1.00',
    cs2RadarMapZoom: '0.70',
    cs2RadarToggleShape: 'Yes',
    cs2LaunchOptions: '-novid -tickrate 128',
    cs2ColorMode: 'Computer',
    cs2VideoBrightness: '80%',
    cs2BoostPlayerContrast: 'Enabled',
    cs2Vsync: 'Disabled',
    cs2Msaa: '4x MSAA',
    cs2TextureFiltering: 'Anisotropic 8x',
    cs2ShadowQuality: 'High',
    cs2ModelTextureDetail: 'Medium',
    cs2ShaderDetail: 'High',
    cs2ParticleDetail: 'Medium',
    cs2AmbientOcclusion: 'High',
    cs2Hdr: 'Quality',
    cs2FidelityFxFsr: 'Disabled (Highest Quality)',
    cs2NvidiaReflex: 'Enabled'
  },
  pro: {
    name: 's1mple',
    game: 'cs2' as Game,
    sens: '3.09',
    dpi: '400',
    pollingRate: '1000',
    zoomSens: '1.00',
    resolution: '1280x960',
    scaling: 'stretched',
    monitorHz: '360',
    desc: 'Официальные настройки игрока s1mple',
    scopedSens: '1.00',
    rawInput: 'on',
    code: 'CSGO-3yP6K-E58oY-99tKz-855G3-86o3B',
    color: 'yellow',
    crosshairColor: '#ffff00',
    outlines: 'off',
    centerDot: 'off',
    centerDotOpacity: '1.0',
    centerDotThickness: '2',
    showInnerLines: 'on',
    innerLinesOpacity: '1.0',
    innerLinesLength: '3',
    innerLinesThickness: '1',
    innerLinesOffset: '2',
    innerLinesMovementError: 'off',
    innerLinesFiringError: 'off',
    innerLinesFiringErrorMultiplier: '1.0',
    showOuterLines: 'off',
    outerLinesOpacity: '0.5',
    outerLinesLength: '2',
    outerLinesThickness: '2',
    outerLinesOffset: '10',
    outerLinesMovementError: 'off',
    outerLinesFiringError: 'off',
    outerLinesFiringErrorMultiplier: '1.0',
    walk: 'shift',
    crouch: 'ctrl',
    jump: 'mwheeldown',
    use: 'e',
    primaryWeapon: '1',
    secondaryWeapon: '2',
    meleeWeapon: '3',
    equipSpike: '5',
    ability1: '4',
    ability2: 'f',
    ability3: 'c',
    ultimate: 'x',
    rotate: 'rotate',
    fixedOrientation: 'always_align',
    keepCentered: 'on',
    minimapSize: '1.15',
    minimapZoom: '0.85',
    minimapVisionCones: 'on',
    mapRegionNames: 'always',
    graphicsQuality: 'medium',
    multithreaded: 'on',
    aa: '8x MSAA',
    vsync: 'off',
    monitorModel: 'Zowie XL2566K',
    configFileName: '',
    resolutionWidth: '1280',
    resolutionHeight: '960',
    displayMode: 'Fullscreen',
    aspectRatio: '4:3',
    aspectRatioMethod: 'Fill',
    enemyHighlightColor: 'Red',
    materialQuality: 'low',
    textureQuality: 'medium',
    detailQuality: 'low',
    uiQuality: 'low',
    vignette: 'off',
    nvidiaReflex: 'OnLowLatency + Boost',
    anisotropicFiltering: '4x',
    improveClarity: 'on',
    experimentalSharpening: 'off',
    bloom: 'off',
    distortion: 'off',
    castShadows: 'off',
    monitorMode: 'FPS1',
    blackEqualizer: '10',
    colorVibrance: '12',
    lowBlueLight: '0',
    monitorGamma: 'Gamma 3',
    colorTemperature: 'Normal',
    dyac: 'Premium',
    brightness: '75',
    contrast: '50',
    sharpness: '8',
    ama: 'High',
    cs2MouseAcceleration: '0.00',
    cs2WindowsSensitivity: '6',
    cs2Size: '2',
    cs2Gap: '-3',
    cs2Thickness: '1',
    cs2Style: '4',
    cs2DrawOutline: 'Off',
    cs2Dot: 'Off',
    cs2Color: 'Green',
    cs2Alpha: '250',
    cs2BlueGreenRed: '0 255 0',
    cs2SniperWidth: '1',
    cs2FollowRecoil: 'No',
    cs2HudScale: '0.95',
    cs2ViewmodelFov: '68',
    cs2ViewmodelOffsetX: '2.5',
    cs2ViewmodelOffsetY: '0',
    cs2ViewmodelOffsetZ: '-1.5',
    cs2ViewmodelPresetPos: '3',
    cs2RadarCentersPlayer: 'Yes',
    cs2RadarIsRotating: 'Yes',
    cs2RadarHudSize: '1.10',
    cs2RadarMapZoom: '0.80',
    cs2RadarToggleShape: 'Yes',
    cs2LaunchOptions: '-novid -freq 360 -tickrate 128',
    cs2ColorMode: 'Computer',
    cs2VideoBrightness: '70%',
    cs2BoostPlayerContrast: 'Enabled',
    cs2Vsync: 'Disabled',
    cs2Msaa: '8x MSAA',
    cs2TextureFiltering: 'Anisotropic 4x',
    cs2ShadowQuality: 'High',
    cs2ModelTextureDetail: 'Medium',
    cs2ShaderDetail: 'High',
    cs2ParticleDetail: 'Medium',
    cs2AmbientOcclusion: 'High',
    cs2Hdr: 'Performance',
    cs2FidelityFxFsr: 'Disabled (Highest Quality)',
    cs2NvidiaReflex: 'Enabled + Boost'
  }
}
