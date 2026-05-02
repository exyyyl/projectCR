import { readFileSync } from 'fs'
import { join } from 'path'
import https from 'https'
import axios from 'axios'

const LOCKFILE_PATH = join(
  process.env['LOCALAPPDATA'] || '',
  'Riot Games',
  'Riot Client',
  'Config',
  'lockfile'
)

interface Lockfile {
  port: number
  password: string
}

function readLockfile(): Lockfile {
  const content = readFileSync(LOCKFILE_PATH, 'utf-8')
  const parts = content.split(':')
  return { port: parseInt(parts[2]), password: parts[3] }
}

const agent = new https.Agent({ rejectUnauthorized: false })

export class ValorantAPI {
  private port: number
  private auth: string

  constructor() {
    const { port, password } = readLockfile()
    this.port = port
    this.auth = Buffer.from(`riot:${password}`).toString('base64')
  }

  private get baseUrl(): string {
    return `https://127.0.0.1:${this.port}`
  }

  private headers() {
    return {
      Authorization: `Basic ${this.auth}`,
      'Content-Type': 'application/json'
    }
  }

  async getStatus(): Promise<{ connected: boolean; gameName?: string }> {
    const res = await axios.get(`${this.baseUrl}/chat/v1/session`, {
      headers: this.headers(),
      httpsAgent: agent
    })
    return {
      connected: true,
      gameName: res.data?.game_name
    }
  }

  async applyCrosshair(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current settings first
      const settingsRes = await axios.get(
        `${this.baseUrl}/player-preferences/v1/data-json/CrosshairSetting`,
        { headers: this.headers(), httpsAgent: agent }
      )

      const settings = settingsRes.data?.data ? JSON.parse(settingsRes.data.data) : {}
      settings.CrosshairType = 0

      // Parse code and apply
      const parsed = parseCrosshairCode(code)
      Object.assign(settings, parsed)

      await axios.put(
        `${this.baseUrl}/player-preferences/v1/data-json/CrosshairSetting`,
        { data: JSON.stringify(settings) },
        { headers: this.headers(), httpsAgent: agent }
      )

      return { success: true }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      return { success: false, error: msg }
    }
  }
}

function parseCrosshairCode(code: string): Record<string, unknown> {
  // Basic mapping from crosshair code to Valorant settings keys
  // Full implementation in renderer/lib/crosshair-parser.ts
  const settings: Record<string, unknown> = {}
  const parts = code.split(';')
  let i = 0
  while (i < parts.length) {
    const key = parts[i]
    const val = parts[i + 1]
    if (key === 'c') settings['CrosshairColor'] = parseInt(val)
    if (key === 't') settings['CrosshairInnerLineThickness'] = parseFloat(val)
    if (key === 'l') settings['CrosshairInnerLineLength'] = parseInt(val)
    if (key === 'o') settings['CrosshairInnerLineOffset'] = parseInt(val)
    if (key === 'a') settings['CrosshairInnerLineOpacity'] = parseFloat(val)
    i += 2
  }
  return settings
}
