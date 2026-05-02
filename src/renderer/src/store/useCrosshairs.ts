import { useState, useEffect, useCallback } from 'react'
import { Crosshair, Game } from '../types'
import { detectGame, extractPreviewColor } from '../lib/crosshair-parser'
import { nanoid } from '../lib/nanoid'

export function useCrosshairs() {
  const [crosshairs, setCrosshairs] = useState<Crosshair[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const data = await window.api.crosshairs.getAll()
    setCrosshairs(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (name: string, code: string, game?: Game, note?: string, tags?: string[]) => {
    const detectedGame = game ?? detectGame(code) ?? 'valorant'
    const crosshair: Crosshair = {
      id: nanoid(),
      game: detectedGame,
      name,
      code: code.trim(),
      tags: JSON.stringify(tags ?? []),
      note: note ?? '',
      color_preview: extractPreviewColor(detectedGame, code),
      created_at: new Date().toISOString()
    }
    await window.api.crosshairs.add(crosshair)
    setCrosshairs(prev => [crosshair, ...prev])
    return crosshair
  }, [])

  const remove = useCallback(async (id: string) => {
    await window.api.crosshairs.delete(id)
    setCrosshairs(prev => prev.filter(c => c.id !== id))
  }, [])

  const update = useCallback(async (crosshair: Crosshair) => {
    await window.api.crosshairs.update(crosshair)
    setCrosshairs(prev => prev.map(c => c.id === crosshair.id ? crosshair : c))
  }, [])

  return { crosshairs, loading, add, remove, update, reload: load }
}
