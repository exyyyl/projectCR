import {
  app,
  dialog,
  type BrowserWindow,
  type OpenDialogOptions,
  type SaveDialogOptions
} from 'electron'
import { randomUUID } from 'crypto'
import { readFile, stat, writeFile } from 'fs/promises'
import { extname, join } from 'path'
import { db } from './database'

const EXPORT_FORMAT = 'projectcr-crosshairs'
const EXPORT_VERSION = 1
const MAX_IMPORT_BYTES = 5 * 1024 * 1024
const MAX_IMPORT_ITEMS = 5000

type Game = 'valorant' | 'cs2'

interface TransferCrosshair {
  id: string
  game: Game
  name: string
  code: string
  color_preview: string
  created_at: string
}

interface ExportPayload {
  format: typeof EXPORT_FORMAT
  version: typeof EXPORT_VERSION
  exportedAt: string
  crosshairs: TransferCrosshair[]
}

export interface CrosshairTransferResult {
  status: 'success' | 'cancelled'
  count: number
}

export async function exportCrosshairs(
  parentWindow: BrowserWindow | null
): Promise<CrosshairTransferResult> {
  const date = new Date().toISOString().slice(0, 10)
  const options: SaveDialogOptions = {
    title: 'Экспорт прицелов',
    defaultPath: join(app.getPath('documents'), `projectcr-crosshairs-${date}.json`),
    filters: [{ name: 'JSON', extensions: ['json'] }]
  }
  const result = parentWindow
    ? await dialog.showSaveDialog(parentWindow, options)
    : await dialog.showSaveDialog(options)

  if (result.canceled || !result.filePath) return { status: 'cancelled', count: 0 }

  const filePath = extname(result.filePath).toLowerCase() === '.json'
    ? result.filePath
    : `${result.filePath}.json`
  const crosshairs = db.prepare(`
    SELECT id, game, name, code, color_preview, created_at
    FROM crosshairs
    ORDER BY created_at DESC
  `).all() as TransferCrosshair[]
  const payload: ExportPayload = {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    crosshairs
  }

  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8')
  return { status: 'success', count: crosshairs.length }
}

export async function importCrosshairs(
  parentWindow: BrowserWindow | null
): Promise<CrosshairTransferResult> {
  const options: OpenDialogOptions = {
    title: 'Импорт прицелов',
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  }
  const result = parentWindow
    ? await dialog.showOpenDialog(parentWindow, options)
    : await dialog.showOpenDialog(options)

  if (result.canceled || !result.filePaths[0]) return { status: 'cancelled', count: 0 }

  const filePath = result.filePaths[0]
  const fileStats = await stat(filePath)
  if (fileStats.size > MAX_IMPORT_BYTES) throw new Error('Файл импорта слишком большой')

  const rawPayload: unknown = JSON.parse(await readFile(filePath, 'utf8'))
  const rawItems = getImportItems(rawPayload)
  if (rawItems.length > MAX_IMPORT_ITEMS) throw new Error('В файле слишком много прицелов')

  const crosshairs = rawItems.map(normalizeCrosshair)
  const upsert = db.prepare(`
    INSERT INTO crosshairs (id, game, name, code, color_preview, created_at)
    VALUES (@id, @game, @name, @code, @color_preview, @created_at)
    ON CONFLICT(id) DO UPDATE SET
      game=excluded.game,
      name=excluded.name,
      code=excluded.code,
      color_preview=excluded.color_preview,
      created_at=excluded.created_at
  `)
  const merge = db.transaction((items: TransferCrosshair[]) => {
    for (const item of items) upsert.run(item)
  })

  merge(crosshairs)
  return { status: 'success', count: crosshairs.length }
}

function getImportItems(payload: unknown): unknown[] {
  if (!isRecord(payload)) throw new Error('Неверный формат файла')
  if (payload.format !== EXPORT_FORMAT || payload.version !== EXPORT_VERSION) {
    throw new Error('Этот файл не поддерживается')
  }
  if (!Array.isArray(payload.crosshairs)) throw new Error('В файле нет списка прицелов')
  return payload.crosshairs
}

function normalizeCrosshair(value: unknown): TransferCrosshair {
  if (!isRecord(value)) throw new Error('В файле есть повреждённая запись')
  if (value.game !== 'valorant' && value.game !== 'cs2') {
    throw new Error('В файле указана неизвестная игра')
  }

  const name = typeof value.name === 'string' ? value.name.trim() : ''
  const code = typeof value.code === 'string' ? value.code.trim() : ''
  if (!name || !code) throw new Error('В файле есть прицел без названия или кода')

  return {
    id: typeof value.id === 'string' && value.id.trim() ? value.id : randomUUID(),
    game: value.game,
    name,
    code,
    color_preview: typeof value.color_preview === 'string' ? value.color_preview : '',
    created_at: typeof value.created_at === 'string' && value.created_at
      ? value.created_at
      : new Date().toISOString()
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
