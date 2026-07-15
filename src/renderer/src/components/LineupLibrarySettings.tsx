import { useState } from 'react'
import { Bomb, Check, MapPinned, Plus, X } from 'lucide-react'
import {
  LINEUP_KINDS,
  LINEUP_MAPS,
  loadCustomLineupKinds,
  loadCustomLineupMaps,
  removeCustomLineupKind,
  removeCustomLineupMap,
  saveCustomLineupKind,
  saveCustomLineupMap
} from '../config/lineups'
import type { Game } from '../types'
import { Button } from './ui/button'
import { Card, CardSeparator } from './ui/card'
import { Input } from './ui/input'

export function LineupLibrarySettings() {
  const [game, setGame] = useState<Game>('valorant')
  const [maps, setMaps] = useState(loadCustomLineupMaps)
  const [kinds, setKinds] = useState(loadCustomLineupKinds)
  const [mapDraft, setMapDraft] = useState('')
  const [kindDraft, setKindDraft] = useState('')

  const normalizedMap = mapDraft.trim()
  const normalizedKind = kindDraft.trim()
  const mapExists = [...LINEUP_MAPS[game], ...maps[game]]
    .some((map) => map.toLocaleLowerCase() === normalizedMap.toLocaleLowerCase())
  const kindExists = [...LINEUP_KINDS.map((kind) => kind.label), ...kinds]
    .some((kind) => kind.toLocaleLowerCase() === normalizedKind.toLocaleLowerCase())

  const addMap = () => {
    if (!normalizedMap || mapExists) return
    setMaps(saveCustomLineupMap(game, normalizedMap))
    setMapDraft('')
  }

  const addKind = () => {
    if (!normalizedKind || kindExists) return
    setKinds(saveCustomLineupKind(normalizedKind))
    setKindDraft('')
  }

  return (
    <Card>
      <div className="flex items-center gap-2 border-b border-white/[0.055] p-2">
        {(['valorant', 'cs2'] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={game === value ? value : 'ghost'}
            size="sm"
            onClick={() => setGame(value)}
            className="flex-1 rounded-xl"
          >
            {value === 'valorant' ? 'Valorant' : 'CS2'}
          </Button>
        ))}
      </div>

      <LibraryEditor
        icon={MapPinned}
        label="Свои карты"
        value={mapDraft}
        placeholder="Название карты"
        exists={mapExists}
        items={maps[game]}
        onChange={setMapDraft}
        onAdd={addMap}
        onRemove={(item) => setMaps(removeCustomLineupMap(game, item))}
      />

      <CardSeparator />

      <LibraryEditor
        icon={Bomb}
        label="Свои типы гранат"
        value={kindDraft}
        placeholder="Например: декой"
        exists={kindExists}
        items={kinds}
        onChange={setKindDraft}
        onAdd={addKind}
        onRemove={(item) => setKinds(removeCustomLineupKind(item))}
      />
    </Card>
  )
}

interface LibraryEditorProps {
  icon: typeof MapPinned
  label: string
  value: string
  placeholder: string
  exists: boolean
  items: string[]
  onChange: (value: string) => void
  onAdd: () => void
  onRemove: (item: string) => void
}

function LibraryEditor({
  icon: Icon,
  label,
  value,
  placeholder,
  exists,
  items,
  onChange,
  onAdd,
  onRemove
}: LibraryEditorProps) {
  const canAdd = Boolean(value.trim()) && !exists

  return (
    <div className="p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-white/35">
          <Icon size={14} />
        </span>
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-white/60">{label}</span>
        <span className="ml-auto rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[9px] font-bold text-white/24">{items.length}</span>
      </div>

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onAdd()
            }
          }}
          maxLength={50}
          placeholder={placeholder}
          className="min-w-0 flex-1"
        />
        <Button
          type="button"
          variant={exists && value.trim() ? 'secondary' : 'default'}
          size="icon"
          onClick={onAdd}
          disabled={!canAdd}
          className={exists && value.trim() ? 'border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300/55' : ''}
          aria-label={exists ? 'Уже добавлено' : `Добавить: ${value}`}
        >
          {exists && value.trim() ? <Check size={15} strokeWidth={2.7} /> : <Plus size={16} strokeWidth={2.7} />}
        </Button>
      </div>

      <div className="mt-3 flex min-h-7 flex-wrap gap-1.5">
        {items.length ? items.map((item) => (
          <span key={item} className="group flex h-7 items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.025] pl-2.5 pr-1 text-[9px] font-bold text-white/48 transition-colors hover:border-white/[0.12] hover:text-white/75">
            {item}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(item)}
              className="size-5 rounded-md text-white/18 hover:bg-red-400/10 hover:text-red-400"
              aria-label={`Удалить ${item}`}
            >
              <X size={11} strokeWidth={2.4} />
            </Button>
          </span>
        )) : (
          <span className="self-center text-[9px] font-medium text-white/18">Пока пусто</span>
        )}
      </div>
    </div>
  )
}
