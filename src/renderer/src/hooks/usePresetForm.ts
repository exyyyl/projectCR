import { useState, useEffect, useCallback } from 'react'
import { Game, UserPreset } from '../types'
import { PresetFormState, INITIAL_VALORANT_PRESET, INITIAL_CS2_PRESET, VALORANT_TEMPLATES, CS2_TEMPLATES } from '../config/presetSchemas'
import { toast } from '../components/Toast'

export function usePresetForm(
  onAddCrosshair: (name: string, code: string, game: Game, note?: string, tags?: string[]) => Promise<any>
) {
  const [userPresets, setUserPresets] = useState<UserPreset[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'config' | 'graphics' | 'monitor'>('config')
  const [presetTemplate, setPresetTemplate] = useState<string>('custom')
  const [newPreset, setNewPreset] = useState<PresetFormState>(INITIAL_VALORANT_PRESET)

  // Dropdown states
  const [gameDropdownOpen, setGameDropdownOpen] = useState(false)
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false)

  // Actions states
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [addingIds, setAddingIds] = useState<Record<string, boolean>>({})

  // Load Presets on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_game_presets')
      if (saved) {
        setUserPresets(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load presets', e)
    }
  }, [])

  // Copy Code
  const handleCopyCode = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast('Код скопирован!')
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  // Add to vault
  const handleAddToVault = useCallback(async (id: string, name: string, code: string, game: Game, desc?: string) => {
    setAddingIds(prev => ({ ...prev, [id]: true }))
    try {
      const tags = ['MY PRESET']
      await onAddCrosshair(name, code, game, desc, tags)
      toast('Прицел добавлен в вашу коллекцию!')
    } catch (err) {
      console.error(err)
      toast('Ошибка при добавлении прицела')
    } finally {
      setAddingIds(prev => ({ ...prev, [id]: false }))
    }
  }, [onAddCrosshair])

  // Reset Form
  const handleResetForm = useCallback(() => {
    setNewPreset(newPreset.game === 'cs2' ? INITIAL_CS2_PRESET : INITIAL_VALORANT_PRESET)
    setPresetTemplate('custom')
    toast('Все настройки сброшены!')
  }, [newPreset.game])

  // Apply Template
  const handleApplyTemplate = useCallback((templateVal: string, currentGame: Game) => {
    setPresetTemplate(templateVal)
    
    if (templateVal === 'custom') {
      return
    }

    if (currentGame === 'valorant') {
      if (templateVal === 'default') {
        setNewPreset(VALORANT_TEMPLATES.default)
        toast('Применен официальный шаблон VALORANT')
      } else if (templateVal === 'pro') {
        setNewPreset(VALORANT_TEMPLATES.pro)
        toast('Применен профиль TenZ (VALORANT)')
      }
    } else if (currentGame === 'cs2') {
      if (templateVal === 'default') {
        setNewPreset(CS2_TEMPLATES.default)
        toast('Применен официальный шаблон CS2')
      } else if (templateVal === 'pro') {
        setNewPreset(CS2_TEMPLATES.pro)
        toast('Применен профиль s1mple (CS2)')
      }
    }
  }, [])

  // Create Preset
  const handleCreatePreset = useCallback(() => {
    if (!newPreset.name.trim() || !newPreset.code.trim()) {
      toast('Пожалуйста, укажите имя пресета и код прицела!')
      return
    }

    const created: UserPreset = {
      id: 'up-' + Date.now(),
      name: newPreset.name.trim(),
      game: newPreset.game,
      code: newPreset.code.trim(),
      sens: newPreset.sens ? parseFloat(newPreset.sens) : undefined,
      dpi: newPreset.dpi ? parseInt(newPreset.dpi) : undefined,
      pollingRate: newPreset.pollingRate ? parseInt(newPreset.pollingRate) : undefined,
      zoomSens: newPreset.zoomSens ? parseFloat(newPreset.zoomSens) : undefined,
      resolution: (newPreset.resolutionWidth && newPreset.resolutionHeight) 
        ? `${newPreset.resolutionWidth}x${newPreset.resolutionHeight}` 
        : newPreset.resolution.trim() || undefined,
      scaling: newPreset.scaling || undefined,
      monitorHz: newPreset.monitorHz ? parseInt(newPreset.monitorHz) : undefined,
      desc: newPreset.desc.trim() || undefined,
      created_at: new Date().toISOString(),
      
      config: {
        mouse: {
          scopedSens: newPreset.scopedSens,
          rawInput: newPreset.rawInput as 'on' | 'off'
        },
        crosshairDetails: {
          color: newPreset.color,
          crosshairColor: newPreset.crosshairColor,
          outlines: newPreset.outlines as 'on' | 'off',
          centerDot: newPreset.centerDot as 'on' | 'off',
          centerDotOpacity: newPreset.centerDotOpacity,
          centerDotThickness: newPreset.centerDotThickness,
          innerLines: {
            show: newPreset.showInnerLines as 'on' | 'off',
            opacity: newPreset.innerLinesOpacity,
            length: newPreset.innerLinesLength,
            thickness: newPreset.innerLinesThickness,
            offset: newPreset.innerLinesOffset,
            movementError: newPreset.innerLinesMovementError as 'on' | 'off',
            firingError: newPreset.innerLinesFiringError as 'on' | 'off',
            firingErrorMultiplier: newPreset.innerLinesFiringErrorMultiplier
          },
          outerLines: {
            show: newPreset.showOuterLines as 'on' | 'off',
            opacity: newPreset.outerLinesOpacity,
            length: newPreset.outerLinesLength,
            thickness: newPreset.outerLinesThickness,
            offset: newPreset.outerLinesOffset,
            movementError: newPreset.outerLinesMovementError as 'on' | 'off',
            firingError: newPreset.outerLinesFiringError as 'on' | 'off',
            firingErrorMultiplier: newPreset.outerLinesFiringErrorMultiplier
          }
        },
        keybinds: {
          walk: newPreset.walk,
          crouch: newPreset.crouch,
          jump: newPreset.jump,
          use: newPreset.use,
          primary: newPreset.primaryWeapon,
          secondary: newPreset.secondaryWeapon,
          melee: newPreset.meleeWeapon,
          equipSpike: newPreset.equipSpike,
          ability1: newPreset.ability1,
          ability2: newPreset.ability2,
          ability3: newPreset.ability3,
          ultimate: newPreset.ultimate
        },
        map: {
          rotate: newPreset.rotate as 'rotate' | 'fixed',
          fixedOrientation: newPreset.fixedOrientation,
          keepCentered: newPreset.keepCentered as 'on' | 'off',
          size: newPreset.minimapSize,
          zoom: newPreset.minimapZoom,
          visionCones: newPreset.minimapVisionCones as 'on' | 'off',
          regionNames: newPreset.mapRegionNames
        },
        configFile: newPreset.configFileName || undefined,
        cs2: {
          mouseAcceleration: newPreset.cs2MouseAcceleration,
          windowsSensitivity: newPreset.cs2WindowsSensitivity,
          size: newPreset.cs2Size,
          gap: newPreset.cs2Gap,
          thickness: newPreset.cs2Thickness,
          style: newPreset.cs2Style,
          drawoutline: newPreset.cs2DrawOutline,
          dot: newPreset.cs2Dot,
          color: newPreset.cs2Color,
          alpha: newPreset.cs2Alpha,
          blueGreenRed: newPreset.cs2BlueGreenRed,
          sniperWidth: newPreset.cs2SniperWidth,
          followRecoil: newPreset.cs2FollowRecoil,
          hudScale: newPreset.cs2HudScale,
          viewmodelFov: newPreset.cs2ViewmodelFov,
          viewmodelOffsetX: newPreset.cs2ViewmodelOffsetX,
          viewmodelOffsetY: newPreset.cs2ViewmodelOffsetY,
          viewmodelOffsetZ: newPreset.cs2ViewmodelOffsetZ,
          viewmodelPresetPos: newPreset.cs2ViewmodelPresetPos,
          radarCentersPlayer: newPreset.cs2RadarCentersPlayer,
          radarIsRotating: newPreset.cs2RadarIsRotating,
          radarHudSize: newPreset.cs2RadarHudSize,
          radarMapZoom: newPreset.cs2RadarMapZoom,
          radarToggleShape: newPreset.cs2RadarToggleShape,
          launchOptions: newPreset.cs2LaunchOptions
        }
      },
      graphics: {
        quality: newPreset.graphicsQuality,
        multithreaded: newPreset.multithreaded as 'on' | 'off',
        aa: newPreset.aa,
        vsync: newPreset.vsync as 'on' | 'off',
        resolutionWidth: newPreset.resolutionWidth,
        resolutionHeight: newPreset.resolutionHeight,
        displayMode: newPreset.displayMode,
        aspectRatio: newPreset.aspectRatio,
        aspectRatioMethod: newPreset.aspectRatioMethod,
        enemyHighlightColor: newPreset.enemyHighlightColor,
        materialQuality: newPreset.materialQuality,
        textureQuality: newPreset.textureQuality,
        detailQuality: newPreset.detailQuality,
        uiQuality: newPreset.uiQuality,
        vignette: newPreset.vignette,
        nvidiaReflex: newPreset.nvidiaReflex,
        anisotropicFiltering: newPreset.anisotropicFiltering,
        improveClarity: newPreset.improveClarity as 'on' | 'off',
        experimentalSharpening: newPreset.experimentalSharpening as 'on' | 'off',
        bloom: newPreset.bloom as 'on' | 'off',
        distortion: newPreset.distortion as 'on' | 'off',
        castShadows: newPreset.castShadows as 'on' | 'off',
        cs2: newPreset.game === 'cs2' ? {
          colorMode: newPreset.cs2ColorMode,
          brightness: newPreset.cs2VideoBrightness,
          boostPlayerContrast: newPreset.cs2BoostPlayerContrast,
          vsync: newPreset.cs2Vsync,
          msaa: newPreset.cs2Msaa,
          textureFiltering: newPreset.cs2TextureFiltering,
          shadowQuality: newPreset.cs2ShadowQuality,
          modelTextureDetail: newPreset.cs2ModelTextureDetail,
          shaderDetail: newPreset.cs2ShaderDetail,
          particleDetail: newPreset.cs2ParticleDetail,
          ambientOcclusion: newPreset.cs2AmbientOcclusion,
          hdr: newPreset.cs2Hdr,
          fidelityFxFsr: newPreset.cs2FidelityFxFsr,
          nvidiaReflex: newPreset.cs2NvidiaReflex
        } : undefined
      },
      monitor: {
        model: newPreset.monitorModel,
        resolution: (newPreset.resolutionWidth && newPreset.resolutionHeight) 
          ? `${newPreset.resolutionWidth}x${newPreset.resolutionHeight}` 
          : newPreset.resolution.trim() || undefined,
        hz: newPreset.monitorHz ? parseInt(newPreset.monitorHz) : undefined,
        scaling: newPreset.scaling || undefined,
        mode: newPreset.monitorMode,
        blackEqualizer: newPreset.blackEqualizer,
        colorVibrance: newPreset.colorVibrance,
        lowBlueLight: newPreset.lowBlueLight,
        gamma: newPreset.monitorGamma,
        colorTemperature: newPreset.colorTemperature,
        dyac: newPreset.dyac,
        brightness: newPreset.brightness,
        contrast: newPreset.contrast,
        sharpness: newPreset.sharpness,
        ama: newPreset.ama
      }
    }

    const updated = [created, ...userPresets]
    setUserPresets(updated)
    localStorage.setItem('user_game_presets', JSON.stringify(updated))
    
    // Reset Form
    setNewPreset(newPreset.game === 'cs2' ? INITIAL_CS2_PRESET : INITIAL_VALORANT_PRESET)
    setPresetTemplate('custom')
    setIsModalOpen(false)
    toast('Пресет успешно добавлен!')
  }, [newPreset, userPresets])

  // Delete Preset
  const handleDeleteUserPreset = useCallback((id: string) => {
    const updated = userPresets.filter(p => p.id !== id)
    setUserPresets(updated)
    localStorage.setItem('user_game_presets', JSON.stringify(updated))
    toast('Пресет удален из вашей коллекции')
  }, [userPresets])

  // Change individual form properties
  const handleFormChange = useCallback((update: Partial<PresetFormState>) => {
    setNewPreset(prev => ({ ...prev, ...update }))
  }, [])

  return {
    userPresets,
    isModalOpen,
    setIsModalOpen,
    modalTab,
    setModalTab,
    presetTemplate,
    setPresetTemplate,
    newPreset,
    setNewPreset,
    gameDropdownOpen,
    setGameDropdownOpen,
    templateDropdownOpen,
    setTemplateDropdownOpen,
    copiedId,
    addingIds,
    handleCopyCode,
    handleAddToVault,
    handleResetForm,
    handleApplyTemplate,
    handleCreatePreset,
    handleDeleteUserPreset,
    handleFormChange
  }
}
