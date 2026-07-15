import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { mkdirSync } from 'fs'

const dbPath = join(app.getPath('userData'), 'crosshairs.db')
mkdirSync(app.getPath('userData'), { recursive: true })

export const db: Database.Database = new Database(dbPath)

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

    CREATE TABLE IF NOT EXISTS lineups (
      id TEXT PRIMARY KEY,
      game TEXT NOT NULL CHECK(game IN ('valorant', 'cs2')),
      map TEXT NOT NULL,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      side TEXT NOT NULL,
      start_position TEXT NOT NULL,
      target_position TEXT NOT NULL,
      instructions TEXT DEFAULT '',
      start_image TEXT DEFAULT '',
      aim_image TEXT DEFAULT '',
      result_image TEXT DEFAULT '',
      extra_images TEXT DEFAULT '[]',
      created_at TEXT NOT NULL
    );
  `)

  const lineupColumns = db.pragma('table_info(lineups)') as Array<{ name: string }>
  if (!lineupColumns.some((column) => column.name === 'extra_images')) {
    db.exec("ALTER TABLE lineups ADD COLUMN extra_images TEXT DEFAULT '[]'")
  }
}
