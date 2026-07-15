import changelogData from './changelog.json'

export type ChangelogSection = 'new' | 'fixed' | 'changed' | 'improved'
export type ChangelogScope =
  | 'crosshairs'
  | 'lineups'
  | 'ui'
  | 'settings'
  | 'updates'
  | 'data'
  | 'system'

export interface ChangelogItem {
  scope: ChangelogScope
  text: string
}

export interface ChangelogRelease {
  version: string
  date?: string
  sections: Record<ChangelogSection, ChangelogItem[]>
}

interface ChangelogFile {
  releases: ChangelogRelease[]
}

export const CHANGELOG = changelogData as ChangelogFile
