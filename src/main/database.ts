import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { mkdirSync } from 'fs'

const dbPath = join(app.getPath('userData'), 'crosshairs.db')
mkdirSync(app.getPath('userData'), { recursive: true })

export const db = new Database(dbPath)

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS crosshairs (
      id TEXT PRIMARY KEY,
      game TEXT NOT NULL CHECK(game IN ('valorant', 'cs2')),
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      note TEXT DEFAULT '',
      color_preview TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );
  `)
}
