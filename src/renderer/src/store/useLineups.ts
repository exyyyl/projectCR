import { useCallback, useEffect, useState } from 'react'
import type { Lineup } from '../types'
import { nanoid } from '../lib/nanoid'

export type NewLineup = Omit<Lineup, 'id' | 'created_at'>

const BROWSER_STORAGE_KEY = 'projectcr:lineups'

function readBrowserLineups(): Lineup[] {
  try {
    const value = localStorage.getItem(BROWSER_STORAGE_KEY)
    if (!value) return []
    const parsed = JSON.parse(value) as Lineup[]
    return Array.isArray(parsed)
      ? parsed.map((lineup) => {
          const primaryImageCount = [lineup.start_image, lineup.aim_image, lineup.result_image]
            .filter(Boolean).length
          return {
            ...lineup,
            extra_images: Array.isArray(lineup.extra_images)
              ? lineup.extra_images.slice(0, Math.max(0, 10 - primaryImageCount))
              : []
          }
        })
      : []
  } catch {
    return []
  }
}

function writeBrowserLineups(lineups: Lineup[]): void {
  localStorage.setItem(BROWSER_STORAGE_KEY, JSON.stringify(lineups))
}

export function useLineups() {
  const [lineups, setLineups] = useState<Lineup[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!window.api?.lineups) {
      setLineups(readBrowserLineups())
      setLoading(false)
      return
    }

    const data = await window.api.lineups.getAll()
    setLineups(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleDataChange = () => { void load() }
    void load()
    window.addEventListener('projectcr:lineups-changed', handleDataChange)
    return () => window.removeEventListener('projectcr:lineups-changed', handleDataChange)
  }, [load])

  const add = useCallback(async (values: NewLineup) => {
    const lineup: Lineup = {
      ...values,
      id: nanoid(),
      created_at: new Date().toISOString()
    }
    if (window.api?.lineups) {
      await window.api.lineups.add(lineup)
    } else {
      writeBrowserLineups([lineup, ...readBrowserLineups()])
    }
    setLineups((current) => [lineup, ...current])
    return lineup
  }, [])

  const remove = useCallback(async (id: string) => {
    if (window.api?.lineups) {
      await window.api.lineups.delete(id)
    } else {
      writeBrowserLineups(readBrowserLineups().filter((lineup) => lineup.id !== id))
    }
    setLineups((current) => current.filter((lineup) => lineup.id !== id))
  }, [])

  const update = useCallback(async (lineup: Lineup) => {
    if (window.api?.lineups) {
      await window.api.lineups.update(lineup)
    } else {
      writeBrowserLineups(readBrowserLineups().map((item) => item.id === lineup.id ? lineup : item))
    }
    setLineups((current) => current.map((item) => item.id === lineup.id ? lineup : item))
    return lineup
  }, [])

  return { lineups, loading, add, update, remove, reload: load }
}
