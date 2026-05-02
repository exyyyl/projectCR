import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config()
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initDatabase, db } from './database'
import { ValorantAPI } from './valorant-api'
import { CS2Config } from './cs2-config'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: '#000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.crosshair-vault')

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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Configure logging
  autoUpdater.logger = log
  log.info('App starting...')

  // For private GitHub repos, we need to provide the token
  if (process.env.GH_TOKEN) {
    autoUpdater.addAuthHeader(`token ${process.env.GH_TOKEN}`)
  }

  // Check for updates
  if (!is.dev) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info.version)
    BrowserWindow.getAllWindows()[0]?.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info?.version)
  })

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    log.info(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info.version)
    BrowserWindow.getAllWindows()[0]?.webContents.send('update-downloaded', info)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Window controls via IPC (frameless window)
ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win?.isMaximized()) win.unmaximize()
  else win?.maximize()
})
ipcMain.on('window:close', () => BrowserWindow.getFocusedWindow()?.close())
ipcMain.on('update:install', () => autoUpdater.quitAndInstall())

function registerIpcHandlers(): void {
  ipcMain.handle('crosshairs:getAll', () => {
    try {
      return db.prepare('SELECT * FROM crosshairs ORDER BY created_at DESC').all()
    } catch { return [] }
  })

  ipcMain.handle('crosshairs:add', (_, crosshair) => {
    db.prepare(`
      INSERT INTO crosshairs (id, game, name, code, tags, note, color_preview, created_at)
      VALUES (@id, @game, @name, @code, @tags, @note, @color_preview, @created_at)
    `).run(crosshair)
    return crosshair
  })

  ipcMain.handle('crosshairs:update', (_, crosshair) => {
    db.prepare(`
      UPDATE crosshairs SET name=@name, code=@code, tags=@tags, note=@note, color_preview=@color_preview
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
