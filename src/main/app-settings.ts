import { app } from 'electron'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

export interface AppSettings {
  launchAtStartup: boolean
  runInBackground: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  launchAtStartup: false,
  runInBackground: false
}

let currentSettings: AppSettings = DEFAULT_SETTINGS

function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

function linuxAutostartPath(): string {
  return join(app.getPath('home'), '.config', 'autostart', 'projectcr.desktop')
}

function applyLinuxAutostart(enabled: boolean): void {
  const path = linuxAutostartPath()

  if (!enabled) {
    if (existsSync(path)) unlinkSync(path)
    return
  }

  mkdirSync(dirname(path), { recursive: true })
  const executable = process.execPath.replaceAll('"', '\\"')
  writeFileSync(path, [
    '[Desktop Entry]',
    'Type=Application',
    'Name=ProjectCR',
    `Exec="${executable}"`,
    'Terminal=false',
    'X-GNOME-Autostart-enabled=true',
    ''
  ].join('\n'))
}

export function applyLaunchAtStartup(enabled: boolean): void {
  if (process.platform === 'linux') {
    applyLinuxAutostart(enabled)
    return
  }

  app.setLoginItemSettings({ openAtLogin: enabled })
}

export function loadAppSettings(): AppSettings {
  try {
    const parsed = JSON.parse(readFileSync(settingsPath(), 'utf8')) as Partial<AppSettings>
    currentSettings = {
      launchAtStartup: parsed.launchAtStartup === true,
      runInBackground: parsed.runInBackground === true
    }
  } catch {
    currentSettings = DEFAULT_SETTINGS
  }

  applyLaunchAtStartup(currentSettings.launchAtStartup)
  return currentSettings
}

export function getAppSettings(): AppSettings {
  return currentSettings
}

export function updateAppSettings(patch: Partial<AppSettings>): AppSettings {
  currentSettings = {
    launchAtStartup: typeof patch.launchAtStartup === 'boolean'
      ? patch.launchAtStartup
      : currentSettings.launchAtStartup,
    runInBackground: typeof patch.runInBackground === 'boolean'
      ? patch.runInBackground
      : currentSettings.runInBackground
  }

  mkdirSync(dirname(settingsPath()), { recursive: true })
  writeFileSync(settingsPath(), JSON.stringify(currentSettings, null, 2))
  applyLaunchAtStartup(currentSettings.launchAtStartup)
  return currentSettings
}
