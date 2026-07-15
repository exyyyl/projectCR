import { BrowserWindow } from 'electron'
import { autoUpdater, type ProgressInfo, type UpdateInfo } from 'electron-updater'
import log from 'electron-log'
import { is } from '@electron-toolkit/utils'

export type UpdateStatus = 'idle' | 'available' | 'downloading' | 'downloaded' | 'error'

export interface AppUpdateState {
  status: UpdateStatus
  version: string | null
  progress: number
  error: string | null
}

const initialState: AppUpdateState = {
  status: 'idle',
  version: null,
  progress: 0,
  error: null
}

let updateState: AppUpdateState = initialState

function broadcastState(): void {
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send('update:state', updateState)
  }
}

function setState(patch: Partial<AppUpdateState>): void {
  updateState = { ...updateState, ...patch }
  broadcastState()
}

export function getUpdateState(): AppUpdateState {
  return updateState
}

export function configureUpdater(): void {
  autoUpdater.logger = log
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    log.info('Доступно обновление:', info.version)
    setState({ status: 'available', version: info.version, progress: 0, error: null })
  })

  autoUpdater.on('update-not-available', () => {
    updateState = initialState
    broadcastState()
  })

  autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    setState({ status: 'downloading', progress: Math.round(progress.percent) })
  })

  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    log.info('Обновление загружено:', info.version)
    setState({ status: 'downloaded', version: info.version, progress: 100, error: null })
  })

  autoUpdater.on('error', (error: Error) => {
    log.error('Ошибка обновления:', error)
    if (updateState.status === 'downloading') {
      setState({ status: 'error', error: error.message })
    }
  })

  if (!is.dev) {
    void autoUpdater.checkForUpdates().catch((error: Error) => {
      log.error('Не удалось проверить обновления:', error)
    })
  }
}

export async function downloadUpdate(): Promise<AppUpdateState> {
  if (updateState.status !== 'available' && updateState.status !== 'error') return updateState

  setState({ status: 'downloading', progress: 0, error: null })
  try {
    await autoUpdater.downloadUpdate()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить обновление'
    setState({ status: 'error', error: message })
  }
  return updateState
}

export function installUpdate(): boolean {
  if (updateState.status !== 'downloaded') return false
  autoUpdater.quitAndInstall(false, true)
  return true
}
