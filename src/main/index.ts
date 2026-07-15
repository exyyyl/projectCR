import { app, shell, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initDatabase, db } from './database'
import { ValorantAPI } from './valorant-api'
import { CS2Config } from './cs2-config'
import {
  getAppSettings,
  loadAppSettings,
  updateAppSettings,
  type AppSettings
} from './app-settings'
import {
  configureUpdater,
  downloadUpdate,
  getUpdateState,
  installUpdate
} from './app-updater'
import { exportCrosshairs, importCrosshairs } from './crosshair-transfer'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

function getIconPath(): string {
  return is.dev
    ? join(process.cwd(), 'resources/icon.png')
    : join(__dirname, '../../resources/icon.png')
}

function showMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    return
  }

  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

function syncTray(): void {
  if (!getAppSettings().runInBackground) {
    tray?.destroy()
    tray = null
    return
  }

  if (tray) return
  const trayImage = nativeImage.createFromPath(getIconPath()).resize({ width: 18, height: 18 })
  tray = new Tray(trayImage)
  tray.setToolTip('ProjectCR')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Открыть ProjectCR', click: showMainWindow },
    { type: 'separator' },
    {
      label: 'Выйти',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ]))
  tray.on('click', showMainWindow)
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    title: 'projectCR',
    icon: getIconPath(),
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: 'default',
    titleBarOverlay: false,
    backgroundColor: '#000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting && getAppSettings().runInBackground) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.projectcr')
  loadAppSettings()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  try {
    initDatabase()
  } catch (e) {
    console.error('DB init failed:', e)
  }

  registerIpcHandlers()
  createWindow()
  syncTray()
  configureUpdater()

  app.on('activate', function () {
    showMainWindow()
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !getAppSettings().runInBackground) {
    app.quit()
  }
})

function registerIpcHandlers(): void {
  ipcMain.handle('app:getVersion', () => app.getVersion())
  ipcMain.handle('appSettings:get', () => getAppSettings())
  ipcMain.handle('appSettings:update', (_, patch: Partial<AppSettings>) => {
    const settings = updateAppSettings(patch)
    syncTray()
    return settings
  })
  ipcMain.handle('update:getState', () => getUpdateState())
  ipcMain.handle('update:download', () => downloadUpdate())
  ipcMain.handle('update:install', () => installUpdate())

  ipcMain.handle('crosshairs:getAll', () => {
    try {
      return db.prepare('SELECT * FROM crosshairs ORDER BY created_at DESC').all()
    } catch { return [] }
  })

  ipcMain.handle('crosshairs:export', () => exportCrosshairs(mainWindow))
  ipcMain.handle('crosshairs:import', () => importCrosshairs(mainWindow))

  ipcMain.handle('crosshairs:add', (_, crosshair) => {
    db.prepare(`
      INSERT INTO crosshairs (id, game, name, code, color_preview, created_at)
      VALUES (@id, @game, @name, @code, @color_preview, @created_at)
    `).run(crosshair)
    return crosshair
  })

  ipcMain.handle('crosshairs:update', (_, crosshair) => {
    db.prepare(`
      UPDATE crosshairs SET name=@name, code=@code, color_preview=@color_preview
      WHERE id=@id
    `).run(crosshair)
    return crosshair
  })

  ipcMain.handle('crosshairs:delete', (_, id: string) => {
    db.prepare('DELETE FROM crosshairs WHERE id = ?').run(id)
    return { success: true }
  })

  ipcMain.handle('valorant:getStatus', async () => {
    try {
      const api = new ValorantAPI()
      return await api.getStatus()
    } catch {
      return { connected: false }
    }
  })

  ipcMain.handle('valorant:applyCrosshair', async (_, code: string) => {
    try {
      const api = new ValorantAPI()
      return await api.applyCrosshair(code)
    } catch (e: unknown) {
      return { success: false, error: e instanceof Error ? e.message : 'VALORANT not running' }
    }
  })

  ipcMain.handle('cs2:applyCrosshair', async (_, code: string) => {
    return CS2Config.applyCrosshair(code)
  })

  ipcMain.handle('cs2:readCurrentCrosshair', async () => {
    return CS2Config.readCurrentCrosshair()
  })
}
