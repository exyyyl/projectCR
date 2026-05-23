import { useState, useEffect, useMemo, useCallback } from 'react'
import { SavedSensProfile, StepHistory, GAMES, GameKey, STEP_MULTIPLIERS } from '../config/sensConfig'
import { toast } from '../components/Toast'

export function usePsaTest() {
  // Screens: 'setup' | 'testing' | 'result'
  const [screen, setScreen] = useState<'setup' | 'testing' | 'result'>('setup')
  
  // Setup inputs
  const [game, setGame] = useState<GameKey>('cs2')
  const [dpi, setDpi] = useState<number>(800)
  const [startSens, setStartSens] = useState<number>(1.5)
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState<boolean>(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)

  // Testing Wizard state
  const [step, setStep] = useState<number>(1)
  const [baseSens, setBaseSens] = useState<number>(1.5)
  const [history, setHistory] = useState<StepHistory[]>([])

  // Results & Saving state
  const [profileName, setProfileName] = useState<string>('')
  const [savedProfiles, setSavedProfiles] = useState<SavedSensProfile[]>([])
  
  // Copy to clipboard tracking
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Load saved profiles on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('psa_sens_profiles')
      if (saved) {
        setSavedProfiles(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load PSA profiles', e)
    }
  }, [])

  // Mathematical variables for current testing step based on standard PSA multipliers
  const currentLowSens = useMemo(() => {
    const mult = STEP_MULTIPLIERS[step - 1]?.low ?? 0.95
    const val = baseSens * mult
    return Math.max(0.001, Math.round(val * 1000) / 1000)
  }, [baseSens, step])

  const currentHighSens = useMemo(() => {
    const mult = STEP_MULTIPLIERS[step - 1]?.high ?? 1.05
    const val = baseSens * mult
    return Math.max(0.001, Math.round(val * 1000) / 1000)
  }, [baseSens, step])

  // Complete table rows memo for displaying all steps
  const tableRows = useMemo(() => {
    const rows: {
      step: number;
      lowSens: number | null;
      baseSens: number | null;
      highSens: number | null;
      choice: 'low' | 'high' | null;
      isActive: boolean;
      isCompleted: boolean;
    }[] = []
    
    // 1. Add completed rows from history
    for (let i = 0; i < history.length; i++) {
      const h = history[i]
      rows.push({
        step: h.step,
        lowSens: h.lowSens,
        baseSens: h.baseSens,
        highSens: h.highSens,
        choice: h.choice,
        isActive: false,
        isCompleted: true
      })
    }
    
    // 2. Add current active row if we are in testing screen and step <= 7
    if (screen === 'testing' && step <= 7) {
      rows.push({
        step,
        lowSens: currentLowSens,
        baseSens,
        highSens: currentHighSens,
        choice: null,
        isActive: true,
        isCompleted: false
      })
    }
    
    // 3. Pad the rest up to 7 steps
    const remaining = 7 - rows.length
    for (let i = 0; i < remaining; i++) {
      const nextStepNum = rows.length + 1
      rows.push({
        step: nextStepNum,
        lowSens: null,
        baseSens: null,
        highSens: null,
        choice: null,
        isActive: false,
        isCompleted: false
      })
    }
    
    return rows
  }, [history, step, baseSens, currentLowSens, currentHighSens, screen])

  // Helper values for current base sens
  const baseCm360 = useMemo(() => {
    const activeGame = GAMES[game]
    return baseSens > 0 ? Math.round((activeGame.const360 / (dpi * baseSens)) * 10) / 10 : 0
  }, [baseSens, game, dpi])

  const baseEdpi = useMemo(() => {
    return Math.round(baseSens * dpi)
  }, [baseSens, dpi])

  // Convert recommended sens to other games
  const recommendedConversions = useMemo(() => {
    if (screen !== 'result') return []
    const srcMult = GAMES[game].mult
    const baseCS2Sens = baseSens / srcMult // Convert to base CS2

    return Object.entries(GAMES).map(([key, item]) => {
      const rawSens = baseCS2Sens * item.mult
      const convertedSens = Math.round(rawSens * 10000) / 10000
      const edpi = Math.round(convertedSens * dpi)
      const cm360 = convertedSens > 0 ? Math.round((item.const360 / (dpi * convertedSens)) * 10) / 10 : 0

      return {
        key: key as GameKey,
        name: item.name,
        sens: convertedSens,
        edpi,
        cm360,
        color: item.color
      }
    })
  }, [baseSens, game, dpi, screen])

  // Start PSA Test
  const handleStartTest = useCallback(() => {
    if (startSens <= 0 || dpi <= 0) {
      toast('Пожалуйста, введите корректные значения!')
      return
    }
    setBaseSens(startSens)
    setStep(1)
    setHistory([])
    setScreen('testing')
  }, [startSens, dpi])

  // Handle Choice (User chooses Lower or Higher sens)
  const handleSelectChoice = useCallback((choice: 'low' | 'high') => {
    const chosenVal = choice === 'low' ? currentLowSens : currentHighSens
    
    // Log history
    const logItem: StepHistory = {
      step,
      baseSens,
      lowSens: currentLowSens,
      highSens: currentHighSens,
      choice
    }
    const nextHistory = [...history, logItem]
    setHistory(nextHistory)

    // Calculate new base: midpoint between baseSens and the chosen direction
    const nextBase = Math.round(((baseSens + chosenVal) / 2) * 1000) / 1000

    if (step >= 7) {
      // Test finished! Go to result
      setBaseSens(nextBase)
      setScreen('result')
      setProfileName(`Идеальная ${GAMES[game].name}`)
      toast('Тест завершен! Найден идеальный прицел.')
    } else {
      setBaseSens(nextBase)
      setStep(prev => prev + 1)
    }
  }, [step, baseSens, currentLowSens, currentHighSens, history, game])

  // Go Back one step in testing wizard
  const handleStepBack = useCallback(() => {
    if (history.length === 0) {
      setScreen('setup')
      return
    }
    const prevHistory = [...history]
    const popped = prevHistory.pop()!
    setHistory(prevHistory)
    setBaseSens(popped.baseSens)
    setStep(popped.step)
  }, [history])

  // Reset/Restart Test entirely
  const handleReset = useCallback(() => {
    setScreen('setup')
    setStep(1)
    setHistory([])
  }, [])

  // Save Calculated Profile
  const handleSaveProfile = useCallback(() => {
    if (!profileName.trim()) return

    const newProfile: SavedSensProfile = {
      id: Date.now().toString(),
      name: profileName.trim(),
      game: GAMES[game].name,
      sens: baseSens,
      dpi,
      edpi: baseEdpi,
      cm360: baseCm360,
      date: new Date().toLocaleDateString('ru-RU')
    }

    const updated = [newProfile, ...savedProfiles]
    setSavedProfiles(updated)
    localStorage.setItem('psa_sens_profiles', JSON.stringify(updated))
    setProfileName('')
    toast('Профиль сохранен!')
  }, [profileName, game, baseSens, dpi, baseEdpi, baseCm360, savedProfiles])

  // Delete saved profile
  const handleDeleteProfile = useCallback((id: string) => {
    const updated = savedProfiles.filter(p => p.id !== id)
    setSavedProfiles(updated)
    localStorage.setItem('psa_sens_profiles', JSON.stringify(updated))
    toast('Профиль удален')
  }, [savedProfiles])

  // Copy sensitivity to clipboard
  const handleCopyText = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast('Скопировано в буфер обмена!')
  }, [])

  return {
    screen,
    setScreen,
    game,
    setGame,
    dpi,
    setDpi,
    startSens,
    setStartSens,
    isGameDropdownOpen,
    setIsGameDropdownOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
    step,
    baseSens,
    history,
    profileName,
    setProfileName,
    savedProfiles,
    copiedId,
    currentLowSens,
    currentHighSens,
    tableRows,
    baseCm360,
    baseEdpi,
    recommendedConversions,
    handleStartTest,
    handleSelectChoice,
    handleStepBack,
    handleReset,
    handleSaveProfile,
    handleDeleteProfile,
    handleCopyText
  }
}
