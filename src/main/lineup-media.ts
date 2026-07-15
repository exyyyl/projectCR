import { app, BrowserWindow, dialog, net, protocol } from 'electron'
import { copyFile, mkdir, unlink } from 'fs/promises'
import { randomUUID } from 'crypto'
import { basename, extname, join } from 'path'
import { pathToFileURL } from 'url'

const MEDIA_SCHEME = 'projectcr-media'
const MEDIA_HOST = 'lineups'
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

function mediaDirectory(): string {
  return join(app.getPath('userData'), 'lineup-media')
}

function fileNameFromMediaUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== `${MEDIA_SCHEME}:` || url.hostname !== MEDIA_HOST) return null

    const fileName = basename(decodeURIComponent(url.pathname))
    if (!fileName || fileName !== decodeURIComponent(url.pathname).replace(/^\//, '')) return null
    if (!ALLOWED_EXTENSIONS.has(extname(fileName).toLowerCase())) return null
    return fileName
  } catch {
    return null
  }
}

export function registerLineupMediaProtocol(): void {
  protocol.handle(MEDIA_SCHEME, (request) => {
    const fileName = fileNameFromMediaUrl(request.url)
    if (!fileName) return new Response('Not found', { status: 404 })
    return net.fetch(pathToFileURL(join(mediaDirectory(), fileName)).toString())
  })
}

export async function pickLineupImage(parentWindow: BrowserWindow | null): Promise<string | null> {
  const result = parentWindow
    ? await dialog.showOpenDialog(parentWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Изображения', extensions: ['png', 'jpg', 'jpeg', 'webp'] }]
      })
    : await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Изображения', extensions: ['png', 'jpg', 'jpeg', 'webp'] }]
      })

  if (result.canceled || !result.filePaths[0]) return null

  const source = result.filePaths[0]
  const extension = extname(source).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(extension)) return null

  await mkdir(mediaDirectory(), { recursive: true })
  const fileName = `${randomUUID()}${extension}`
  await copyFile(source, join(mediaDirectory(), fileName))
  return `${MEDIA_SCHEME}://${MEDIA_HOST}/${fileName}`
}

export async function discardLineupImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(async (url) => {
    const fileName = fileNameFromMediaUrl(url)
    if (!fileName) return
    try {
      await unlink(join(mediaDirectory(), fileName))
    } catch {
      // The file may already have been removed; cleanup remains idempotent.
    }
  }))
}
