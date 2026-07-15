import { useState, useEffect, useCallback } from 'react'
import { Crosshair, Game } from '../types'
import { detectGame, extractPreviewColor } from '../lib/crosshair-parser'
import { nanoid } from '../lib/nanoid'

const BROWSER_STORAGE_KEY = 'projectcr:crosshairs'

function readBrowserCrosshairs(): Crosshair[] {
  try {
    const value = localStorage.getItem(BROWSER_STORAGE_KEY)
    return value ? JSON.parse(value) as Crosshair[] : []
  } catch {
    return []
  }
}

function writeBrowserCrosshairs(crosshairs: Crosshair[]): void {
  localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(crosshairs))
}

export function useCrosshairs() {
  const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const data = window.api?.crosshairs
      ? await window.api.crosshairs.getAll()
      : readBrowserCrosshairs()
    setCrosshairs(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (name: string, code: string, game?: Game) => {
    const detectedGame = game ?? detectGame(code) ?? 'valorant'
    const crosshair: Crosshair = {
      id: nanoid(),
      game: detectedGame,
      name,
      code: code.trim(),
      color_preview: extractPreviewColor(detectedGame, code),
      created_at: new Date().toISOString()
    }
    if (window.api?.crosshairs) {
      await window.api.crosshairs.add(crosshair)
    } else {
      writeBrowserCrosshairs([crosshair, ...readBrowserCrosshairs()])
    }
    setCrosshairs(prev => [crosshair, ...prev])
    return crosshair
  }, [])

  const remove = useCallback(async (id: string) => {
    if (window.api?.crosshairs) {
      await window.api.crosshairs.delete(id)
    } else {
      writeBrowserCrosshairs(readBrowserCrosshairs().filter((crosshair) => crosshair.id !== id))
    }
    setCrosshairs(prev => prev.filter(c => c.id !== id))
  }, [])

  const update = useCallback(async (crosshair: Crosshair) => {
    if (window.api?.crosshairs) {
      await window.api.crosshairs.update(crosshair)
    } else {
      writeBrowserCrosshairs(readBrowserCrosshairs().map((item) => item.id === crosshair.id ? crosshair : item))
    }
    setCrosshairs(prev => prev.map(c => c.id === crosshair.id ? crosshair : c))
  }, [])

  return { crosshairs, loading, add, remove, update, reload: load }
}
