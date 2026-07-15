import { app, shell, BrowserWindow, ipcMain, Menu, nativeImage, protocol, Tray } from 'electron'
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
import {
  discardLineupImages,
  pickLineupImage,
  registerLineupMediaProtocol
} from './lineup-media'

protocol.registerSchemesAsPrivileged([{
  scheme: 'projectcr-media',
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true }
}])

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

interface StoredLineup {
  start_image: string
  aim_image: string
  result_image: string
  extra_images: string
  [key: string]: unknown
}

function parseExtraImages(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((url): url is string => typeof url === 'string')
  if (typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((url): url is string => typeof url === 'string')
      : []
  } catch {
    return []
  }
}

function serializeLineup(lineup: Record<string, unknown>): Record<string, unknown> {
  const primaryImageCount = [lineup.start_image, lineup.aim_image, lineup.result_image]
    .filter((url) => typeof url === 'string' && Boolean(url)).length
  return {
    ...lineup,
    extra_images: JSON.stringify(
      parseExtraImages(lineup.extra_images).slice(0, Math.max(0, 10 - primaryImageCount))
    )
  }
}

function deserializeLineup(lineup: StoredLineup): Record<string, unknown> {
  const primaryImageCount = [lineup.start_image, lineup.aim_image, lineup.result_image]
    .filter(Boolean).length
  return {
    ...lineup,
    extra_images: parseExtraImages(lineup.extra_images).slice(0, Math.max(0, 10 - primaryImageCount))
  }
}

function lineupImageUrls(lineup: StoredLineup | Record<string, unknown>): string[] {
  return [
    lineup.start_image,
    lineup.aim_image,
    lineup.result_image,
    ...parseExtraImages(lineup.extra_images)
  ].filter((url): url is string => typeof url === 'string' && Boolean(url))
}

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

  registerLineupMediaProtocol()
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
      UPDATE crosshairs SET game=@game, name=@name, code=@code, color_preview=@color_preview
      WHERE id=@id
    `).run(crosshair)
    return crosshair
  })

  ipcMain.handle('crosshairs:delete', (_, id: string) => {
    db.prepare('DELETE FROM crosshairs WHERE id = ?').run(id)
    return { success: true }
  })

  ipcMain.handle('crosshairs:deleteAll', () => {
    const result = db.prepare('DELETE FROM crosshairs').run()
    return { success: true, count: result.changes }
  })

  ipcMain.handle('lineups:getAll', () => {
    try {
      return (db.prepare('SELECT * FROM lineups ORDER BY created_at DESC').all() as StoredLineup[])
        .map(deserializeLineup)
    } catch {
      return []
    }
  })

  ipcMain.handle('lineups:add', (_, lineup) => {
    const storedLineup = serializeLineup(lineup)
    db.prepare(`
      INSERT INTO lineups (
        id, game, map, name, kind, side, start_position, target_position,
        instructions, start_image, aim_image, result_image, extra_images, created_at
      ) VALUES (
        @id, @game, @map, @name, @kind, @side, @start_position, @target_position,
        @instructions, @start_image, @aim_image, @result_image, @extra_images, @created_at
      )
    `).run(storedLineup)
    return lineup
  })

  ipcMain.handle('lineups:update', async (_, lineup) => {
    const previous = db.prepare(`
      SELECT start_image, aim_image, result_image, extra_images FROM lineups WHERE id = ?
    `).get(lineup.id) as StoredLineup | undefined
    const storedLineup = serializeLineup(lineup)

    db.prepare(`
      UPDATE lineups SET
        game=@game, map=@map, name=@name, kind=@kind, side=@side,
        start_position=@start_position, target_position=@target_position,
        instructions=@instructions, start_image=@start_image,
        aim_image=@aim_image, result_image=@result_image, extra_images=@extra_images
      WHERE id=@id
    `).run(storedLineup)

    if (previous) {
      const currentImages = new Set(lineupImageUrls(lineup))
      const removedImages = lineupImageUrls(previous).filter((url) => !currentImages.has(url))
      if (removedImages.length) await discardLineupImages(removedImages)
    }

    return lineup
  })

  ipcMain.handle('lineups:delete', async (_, id: string) => {
    const lineup = db.prepare(`
      SELECT start_image, aim_image, result_image, extra_images FROM lineups WHERE id = ?
    `).get(id) as StoredLineup | undefined

    db.prepare('DELETE FROM lineups WHERE id = ?').run(id)
    if (lineup) await discardLineupImages(lineupImageUrls(lineup))
    return { success: true }
  })

  ipcMain.handle('lineups:deleteAll', async () => {
    const lineups = db.prepare(`
      SELECT start_image, aim_image, result_image, extra_images FROM lineups
    `).all() as StoredLineup[]
    const result = db.prepare('DELETE FROM lineups').run()
    await discardLineupImages(lineups.flatMap(lineupImageUrls))
    return { success: true, count: result.changes }
  })

  ipcMain.handle('lineups:pickImage', () => pickLineupImage(mainWindow))
  ipcMain.handle('lineups:discardImages', (_, urls: string[]) => {
    return discardLineupImages(Array.isArray(urls) ? urls : [])
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
