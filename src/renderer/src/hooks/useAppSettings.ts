import { useCallback, useEffect, useState } from 'react'
import type { AppSettings } from '../types'

const DEFAULT_SETTINGS: AppSettings = {
  launchAtStartup: false,
  runInBackground: false
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!window.api?.settings) {
      setLoading(false)
      return
    }

    void window.api.settings.get()
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [])

  const updateSetting = useCallback(async <Key extends keyof AppSettings>(
    key: Key,
    value: AppSettings[Key]
  ) => {
    if (!window.api?.settings) {
      setSettings(previous => ({ ...previous, [key]: value }))
      return
    }

    const nextSettings = await window.api.settings.update({ [key]: value })
    setSettings(nextSettings)
  }, [])

  return { settings, loading, updateSetting }
}
