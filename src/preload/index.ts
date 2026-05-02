import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  crosshairs: {
    getAll: () => ipcRenderer.invoke('crosshairs:getAll'),
    add: (c: unknown) => ipcRenderer.invoke('crosshairs:add', c),
    update: (c: unknown) => ipcRenderer.invoke('crosshairs:update', c),
    delete: (id: string) => ipcRenderer.invoke('crosshairs:delete', id)
  },
  valorant: {
    getStatus: () => ipcRenderer.invoke('valorant:getStatus'),
    applyCrosshair: (code: string) => ipcRenderer.invoke('valorant:applyCrosshair', code)
  },
  cs2: {
    applyCrosshair: (code: string) => ipcRenderer.invoke('cs2:applyCrosshair', code),
    readCurrentCrosshair: () => ipcRenderer.invoke('cs2:readCurrentCrosshair')
  },
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    onUpdateAvailable: (callback: (info: any) => void) => {
      const listener = (_event: any, info: any) => callback(info)
      ipcRenderer.on('update-available', listener)
      return () => ipcRenderer.removeListener('update-available', listener)
    },
    onUpdateDownloaded: (callback: (info: any) => void) => {
      const listener = (_event: any, info: any) => callback(info)
      ipcRenderer.on('update-downloaded', listener)
      return () => ipcRenderer.removeListener('update-downloaded', listener)
    },
    installUpdate: () => ipcRenderer.send('update:install'),
    getVersion: () => ipcRenderer.invoke('app:getVersion')
  }
})
