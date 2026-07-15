import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

interface AppSettings {
  launchAtStartup: boolean
  runInBackground: boolean
}

interface AppUpdateState {
  status: 'idle' | 'available' | 'downloading' | 'downloaded' | 'error'
  version: string | null
  progress: number
  error: string | null
}

interface CrosshairTransferResult {
  status: 'success' | 'cancelled'
  count: number
}

contextBridge.exposeInMainWorld('api', {
  crosshairs: {
    getAll: () => ipcRenderer.invoke('crosshairs:getAll'),
    add: (c: unknown) => ipcRenderer.invoke('crosshairs:add', c),
    update: (c: unknown) => ipcRenderer.invoke('crosshairs:update', c),
    delete: (id: string) => ipcRenderer.invoke('crosshairs:delete', id),
    exportFile: (): Promise<CrosshairTransferResult> => ipcRenderer.invoke('crosshairs:export'),
    importFile: (): Promise<CrosshairTransferResult> => ipcRenderer.invoke('crosshairs:import')
  },
  valorant: {
    getStatus: () => ipcRenderer.invoke('valorant:getStatus'),
    applyCrosshair: (code: string) => ipcRenderer.invoke('valorant:applyCrosshair', code)
  },
  cs2: {
    applyCrosshair: (code: string) => ipcRenderer.invoke('cs2:applyCrosshair', code),
    readCurrentCrosshair: () => ipcRenderer.invoke('cs2:readCurrentCrosshair')
  },
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('appSettings:get'),
    update: (patch: Partial<AppSettings>): Promise<AppSettings> => ipcRenderer.invoke('appSettings:update', patch)
  },
  window: {
    getUpdateState: (): Promise<AppUpdateState> => ipcRenderer.invoke('update:getState'),
    onUpdateState: (callback: (state: AppUpdateState) => void) => {
      const listener = (_event: IpcRendererEvent, state: AppUpdateState) => callback(state)
      ipcRenderer.on('update:state', listener)
      return () => ipcRenderer.removeListener('update:state', listener)
    },
    downloadUpdate: (): Promise<AppUpdateState> => ipcRenderer.invoke('update:download'),
    installUpdate: (): Promise<boolean> => ipcRenderer.invoke('update:install'),
    getVersion: () => ipcRenderer.invoke('app:getVersion')
  }
})
