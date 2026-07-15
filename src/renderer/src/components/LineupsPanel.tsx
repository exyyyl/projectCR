import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import type { Game, Lineup, LineupKind } from '../types'
import { useLineups } from '../store/useLineups'
import { LINEUP_KINDS, lineupKindLabel } from '../config/lineups'
import { LineupCard } from './LineupCard'
import { LineupDetails } from './LineupDetails'
import { AddLineupPanel } from './AddLineupPanel'
import { DeleteLineupModal } from './DeleteLineupModal'
import { EmptyLineups } from './EmptyLineups'
import { toast } from './Toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { LineupSelect } from './ui/LineupSelect'

export function LineupsPanel() {
  const { lineups, loading, add, update, remove } = useLineups()
  const [gameFilter, setGameFilter] = useState<'all' | Game>('all')
  const [mapFilter, setMapFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState<'all' | LineupKind>('all')
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<Lineup | null>(null)
  const [selected, setSelected] = useState<Lineup | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Lineup | null>(null)

  const counts = useMemo(() => ({
    all: lineups.length,
    valorant: lineups.filter((lineup) => lineup.game === 'valorant').length,
    cs2: lineups.filter((lineup) => lineup.game === 'cs2').length
  }), [lineups])

  const maps = useMemo(() => Array.from(new Set(lineups
    .filter((lineup) => gameFilter === 'all' || lineup.game === gameFilter)
    .map((lineup) => lineup.map)
  )).sort((a, b) => a.localeCompare(b)), [lineups, gameFilter])

  const kindOptions = useMemo(() => {
    const options = new Map<LineupKind, string>(
      LINEUP_KINDS.map((kind) => [kind.value, kind.label])
    )
    lineups.forEach((lineup) => {
      if (!options.has(lineup.kind)) options.set(lineup.kind, lineupKindLabel(lineup.kind))
    })
    return Array.from(options, ([value, label]) => ({ value, label }))
  }, [lineups])
  const mapFilterOptions = useMemo(() => [
    { value: 'all', label: 'Все карты' },
    ...maps.map((map) => ({ value: map, label: map }))
  ], [maps])
  const kindFilterOptions = useMemo(() => [
    { value: 'all' as const, label: 'Все типы' },
    ...kindOptions
  ], [kindOptions])

  useEffect(() => {
    if (mapFilter !== 'all' && !maps.includes(mapFilter)) setMapFilter('all')
  }, [mapFilter, maps])

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return lineups.filter((lineup) => {
      const matchesGame = gameFilter === 'all' || lineup.game === gameFilter
      const matchesMap = mapFilter === 'all' || lineup.map === mapFilter
      const matchesKind = kindFilter === 'all' || lineup.kind === kindFilter
      const matchesSearch = !query || [lineup.name, lineup.map]
        .some((value) => value.toLocaleLowerCase().includes(query))
      return matchesGame && matchesMap && matchesKind && matchesSearch
    })
  }, [lineups, gameFilter, mapFilter, kindFilter, search])

  const setGame = (value: 'all' | Game) => {
    setGameFilter(value)
    setMapFilter('all')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-amoled-bg">
      <div className="relative z-30 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/[0.045] bg-[#050505]/95 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-1 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0A0A0A] p-1">
          {([
            { value: 'all', label: 'ВСЕ', count: counts.all, active: 'bg-white text-black' },
            { value: 'valorant', label: 'VALORANT', count: counts.valorant, active: 'bg-[#FF4655] text-white' },
            { value: 'cs2', label: 'CS2', count: counts.cs2, active: 'bg-[#E8A530] text-black' }
          ] as const).map((item) => {
            const active = gameFilter === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setGame(item.value)}
                className={`flex h-9 min-w-24 items-center justify-center gap-2 rounded-xl px-3 text-[9px] font-black tracking-widest transition-all ${active ? item.active : 'text-white/35 hover:bg-white/[0.05] hover:text-white/75'}`}
              >
                {item.label}
                <span className={`rounded-md px-1.5 py-0.5 font-mono text-[8px] ${active ? 'bg-black/10 opacity-65' : 'bg-white/[0.04] opacity-55'}`}>{item.count}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3">
          <SlidersHorizontal size={13} className="text-white/22" />
          <LineupSelect
            value={mapFilter}
            options={mapFilterOptions}
            onChange={setMapFilter}
            ariaLabel="Фильтр по карте"
            className="h-10 w-36 border-0 bg-transparent px-2 text-[9px] font-black uppercase tracking-wider"
          />
          <div className="h-4 w-px bg-white/[0.06]" />
          <LineupSelect
            value={kindFilter}
            options={kindFilterOptions}
            onChange={setKindFilter}
            ariaLabel="Фильтр по типу"
            className="h-10 w-36 border-0 bg-transparent px-2 text-[9px] font-black uppercase tracking-wider"
          />
        </div>

        <div className="flex-1" />

        <div className="group flex h-10 w-60 items-center rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 transition-colors focus-within:border-white/10 focus-within:bg-white/[0.04]">
          <Search size={16} className="text-white/20 group-focus-within:text-white/60" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ПОИСК..." className="ml-1 min-w-0 flex-1 border-none bg-transparent px-2 text-[10px] font-black tracking-[0.1em] ring-0 placeholder:text-white/10 focus:border-none focus-visible:ring-0" />
        </div>

        <Button type="button" onClick={() => { setEditing(null); setAddOpen(true) }}>
          <Plus size={17} strokeWidth={3} /> Добавить
        </Button>
      </div>

      {loading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center"><div className="size-6 animate-spin rounded-full border-2 border-white/10 border-t-white" /></div>
      ) : filtered.length ? (
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-2 content-start gap-4 px-6 pb-6 pt-4 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((lineup) => (
              <LineupCard
                key={lineup.id}
                lineup={lineup}
                onOpen={() => setSelected(lineup)}
                onEdit={() => { setEditing(lineup); setAddOpen(true) }}
                onDelete={() => setPendingDelete(lineup)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <EmptyLineups
            hasFilters={Boolean(search.trim()) || gameFilter !== 'all' || mapFilter !== 'all' || kindFilter !== 'all'}
            search={search}
            onReset={() => {
              setSearch('')
              setGameFilter('all')
              setMapFilter('all')
              setKindFilter('all')
            }}
            onAdd={() => { setEditing(null); setAddOpen(true) }}
          />
        </div>
      )}

      <AddLineupPanel
        open={addOpen}
        lineup={editing}
        onClose={() => { setAddOpen(false); setEditing(null) }}
        onSave={async (values) => {
          if (editing) {
            const saved = await update({ ...editing, ...values })
            toast('Лайнап обновлён')
            return saved
          }
          const saved = await add(values)
          toast('Лайнап добавлен')
          return saved
        }}
      />
      <LineupDetails
        lineup={selected}
        onClose={() => setSelected(null)}
        onEdit={(lineup) => {
          setSelected(null)
          setEditing(lineup)
          setAddOpen(true)
        }}
      />
      <DeleteLineupModal
        lineup={pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          void remove(pendingDelete.id).then(() => toast('Лайнап удалён'))
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
