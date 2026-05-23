export interface SavedSensProfile {
  id: string
  name: string
  game: string
  sens: number
  dpi: number
  edpi: number
  cm360: number
  date: string
}

export interface StepHistory {
  step: number
  baseSens: number
  lowSens: number
  highSens: number
  choice: 'low' | 'high'
}

export const GAMES = {
  cs2: { name: 'CS2', mult: 1.0, const360: 41560, color: '#E8A530' },
  valorant: { name: 'VALORANT', mult: 1.0 / 3.18181818, const360: 13062, color: '#FF4655' },
  apex: { name: 'Apex Legends', mult: 1.0, const360: 41560, color: '#E53E3E' },
  overwatch: { name: 'Overwatch 2', mult: 10.0 / 3.0, const360: 138533, color: '#F58220' },
  r6: { name: 'Rainbow Six Siege', mult: 3.8392857, const360: 108226, color: '#005EA6' }
}

export type GameKey = keyof typeof GAMES

export const STEP_MULTIPLIERS = [
  { low: 0.5, high: 1.5 },   // Step 1
  { low: 0.5, high: 1.5 },   // Step 2
  { low: 0.6, high: 1.4 },   // Step 3
  { low: 0.7, high: 1.3 },   // Step 4
  { low: 0.8, high: 1.2 },   // Step 5
  { low: 0.9, high: 1.1 },   // Step 6
  { low: 0.95, high: 1.05 }  // Step 7
]
