import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const STEAM_PATHS = [
  'C:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/cfg',
  'C:/Program Files/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/cfg'
]

function getCfgPath(): string | null {
  for (const p of STEAM_PATHS) {
    if (existsSync(p)) return p
  }
  return null
}

export const CS2Config = {
  applyCrosshair(code: string): { success: boolean; error?: string } {
    const cfgDir = getCfgPath()
    if (!cfgDir) return { success: false, error: 'CS2 not found' }

    const autoexecPath = join(cfgDir, 'autoexec.cfg')
    let content = existsSync(autoexecPath) ? readFileSync(autoexecPath, 'utf-8') : ''

    // Remove existing crosshair code line
    content = content.replace(/^cl_crosshair_reticle_type.*\n?/m, '')
    content = content.replace(/^cl_crosshairalpha.*\n?/gm, '')

    const lines = [
      `cl_crosshair_reticle_type 0`,
      `// Crosshair code: ${code}`
    ]

    // Parse CS2 code format: starts with "CSGO-" or raw params
    if (code.startsWith('CSGO-')) {
      content = content.trimEnd() + '\n' + lines.join('\n') + '\n'
    } else {
      content = content.trimEnd() + '\n' + `// CS2 crosshair: ${code}\n`
    }

    writeFileSync(autoexecPath, content, 'utf-8')
    return { success: true }
  },

  readCurrentCrosshair(): { code: string | null } {
    const cfgDir = getCfgPath()
    if (!cfgDir) return { code: null }

    const autoexecPath = join(cfgDir, 'autoexec.cfg')
    if (!existsSync(autoexecPath)) return { code: null }

    const content = readFileSync(autoexecPath, 'utf-8')
    const match = content.match(/\/\/ (?:Crosshair code|CS2 crosshair): (CSGO-[\w-]+)/)
    return { code: match ? match[1] : null }
  }
}
