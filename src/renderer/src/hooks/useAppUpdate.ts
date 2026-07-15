import { useCallback, useEffect, useState } from 'react'
import type { AppUpdateState } from '../types'

const INITIAL_UPDATE_STATE: AppUpdateState = {
  status: 'idle',
  version: null,
  progress: 0,
  error: null
}

export function useAppUpdate() {
  const [state, setState] = useState<AppUpdateState>(INITIAL_UPDATE_STATE)

  useEffect(() => {
    if (!window.api?.window) return

    void window.api.window.getUpdateState().then(setState)
    return window.api.window.onUpdateState(setState)
  }, [])

  const download = useCallback(async () => {
    if (!window.api?.window) return
    setState(previous => ({ ...previous, status: 'downloading', progress: 0, error: null }))
    setState(await window.api.window.downloadUpdate())
  }, [])

  const install = useCallback(async () => {
    if (!window.api?.window) return
    await window.api.window.installUpdate()
  }, [])

  const hasUpdate = state.status !== 'idle'
  return { state, hasUpdate, download, install }
}
