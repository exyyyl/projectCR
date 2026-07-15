import { useMemo, useState } from 'react'
import { Tabs } from '@base-ui/react'
import { CrosshairCard } from './components/CrosshairCard'
import { AddPanel } from './components/AddPanel'
import { ToastContainer, toast } from './components/Toast'
import { UpdateBanner } from './components/UpdateBanner'
import { ReleaseNotesModal } from './components/ReleaseNotesModal'
import { EmptyCrosshairs } from './components/EmptyCrosshairs'
import { useCrosshairs } from './store/useCrosshairs'
import { extractPreviewColor } from './lib/crosshair-parser'
import { useAppUpdate } from './hooks/useAppUpdate'
import { Crosshair, Game } from './types'
import { Search, Plus, Crosshair as CrosshairIcon, Settings, Users } from 'lucide-react'
import { SettingsPanel } from './components/SettingsPanel'
import { LineupsPanel } from './components/LineupsPanel'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { LineupSelect } from './components/ui/LineupSelect'

type TabValue = 'crosshairs' | 'lineups' | 'settings'

const SORT_OPTIONS = [
  { value: 'newest', label: 'По дате' },
  { value: 'name', label: 'По названию' },
  { value: 'game', label: 'По игре' }
] as const

export default function App() {
  const { crosshairs, loading, add, remove, update, reload } = useCrosshairs()
  const { state: updateState, hasUpdate, download, install } = useAppUpdate()
  const [tab, setTab] = useState<TabValue>('crosshairs')
  const [gameFilter, setGameFilter] = useState<'all' | Game>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setBy] = useState<'newest' | 'name' | 'game'>('newest')
  const [sortOrder, setOrder] = useState<'asc' | 'desc'>('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCrosshair, setEditingCrosshair] = useState<Crosshair | null>(null)
  const [dismissedUpdate, setDismissedUpdate] = useState<string | null>(null)

  const updateKey = updateState.version ?? updateState.status
  const showUpdateBanner = hasUpdate && dismissedUpdate !== updateKey

  const counts = useMemo(() => ({
    all: crosshairs.length,
    valorant: crosshairs.filter(c => c.game === 'valorant').length,
    cs2: crosshairs.filter(c => c.game === 'cs2').length
  }), [crosshairs])

  const filtered = useMemo(() => {
    let result = crosshairs.filter(c => {
      const matchTab = gameFilter === 'all' || c.game === gameFilter
      const q = search.toLowerCase()
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      return matchTab && matchSearch
    })

    return [...result].sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      else if (sortBy === 'game') comparison = a.game.localeCompare(b.game)
      else comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
  }, [crosshairs, gameFilter, search, sortBy, sortOrder])

  return (
    <div className="flex flex-col h-screen bg-amoled-bg text-amoled-text overflow-hidden font-sans">
      {/* Combined titlebar + navigation — single compact row */}
      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        {/* Content Area */}
        <Tabs.Panel
          value="crosshairs"
          className="relative min-h-0 flex-1 overflow-hidden focus:outline-none"
        >
          <div className="flex h-full min-h-0 flex-col">
            {/* Internal Toolbar */}
            <div className="relative z-30 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/[0.045] bg-[#050505]/95 px-6 py-4 backdrop-blur-xl">
              {/* Game Sub-filters inside the Crosshairs tab */}
              <div className="flex items-center gap-1 p-1 bg-[#0A0A0A] border border-white/[0.05] rounded-2xl overflow-hidden">
                {([
                  {
                    value: 'all', label: 'ВСЕ', count: counts.all,
                    variant: 'default'
                  },
                  {
                    value: 'valorant', label: 'VALORANT', count: counts.valorant,
                    variant: 'valorant'
                  },
                  {
                    value: 'cs2', label: 'CS2', count: counts.cs2,
                    variant: 'cs2'
                  },
                ] as const).map(item => {
                  const isActive = gameFilter === item.value
                  return (
                    <Button
                      key={item.value}
                      type="button"
                      variant={isActive ? item.variant : 'ghost'}
                      size="sm"
                      onClick={() => setGameFilter(item.value)}
                      className="min-w-28 rounded-xl"
                    >
                      {item.label}
                      <span className={`min-w-5 rounded-md px-1.5 py-0.5 text-center font-mono text-[8px] ${isActive ? 'bg-black/10 opacity-65' : 'bg-white/[0.04] opacity-55'}`}>
                        {item.count}
                      </span>
                    </Button>
                  )
                })}
              </div>

              <div className="flex-1" />

              {/* Search - Right Aligned */}
              <div className="relative w-60 flex items-center h-10 group bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 focus-within:bg-white/[0.04] focus-within:border-white/10 transition-all duration-200">
                <Search 
                  size={16} 
                  className={`transition-colors duration-300 ${
                    search ? 'text-white' : 'text-white/20'
                  } group-focus-within:text-white`} 
                />
                <Input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ПОИСК..."
                  className="ml-1 min-w-0 flex-1 border-none bg-transparent px-2 text-[10px] font-black tracking-[0.1em] placeholder:text-white/10 focus:border-none focus-visible:ring-0"
                />
              </div>

              {/* Grouped Actions - Right Aligned */}
              <div className="flex items-center gap-2">
                {/* Integrated Sort Control */}
                <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="rounded-r-none border-r border-white/[0.05]"
                    title={sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
                  >
                    {sortOrder === 'asc' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/>
                      </svg>
                    )}
                  </Button>
                  <LineupSelect
                    value={sortBy}
                    options={SORT_OPTIONS}
                    onChange={setBy}
                    ariaLabel="Сортировка прицелов"
                    className="h-10 w-36 rounded-l-none border-0 bg-transparent text-[10px] font-black uppercase tracking-widest"
                  />
                </div>

                {/* Add Icon Button */}
                <Button
                  type="button"
                  size="icon"
                  onClick={() => { setEditingCrosshair(null); setModalOpen(true) }}
                  title="Добавить прицел"
                >
                  <Plus size={20} strokeWidth={3} />
                </Button>
              </div>
            </div>

            {showUpdateBanner && (
              <UpdateBanner
                state={updateState}
                onOpenSettings={() => setTab('settings')}
                onDismiss={() => setDismissedUpdate(updateKey)}
              />
            )}

            {loading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="min-h-0 flex-1">
                <EmptyCrosshairs search={search} onClearSearch={() => setSearch('')} onAdd={() => setModalOpen(true)} />
              </div>
            ) : (
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="grid grid-cols-2 content-start gap-4 px-6 pb-6 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filtered.map(c => (
                    <CrosshairCard
                      key={c.id}
                      crosshair={c}
                      onDelete={async (id) => { await remove(id); toast('Удалено') }}
                      onCopyCode={(code) => { navigator.clipboard.writeText(code); toast('Код скопирован') }}
                      onEdit={(crosshair) => { setEditingCrosshair(crosshair); setModalOpen(true) }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel
          value="lineups"
          className="flex-1 focus:outline-none relative overflow-hidden"
        >
          <LineupsPanel />
        </Tabs.Panel>

        <Tabs.Panel
          value="settings"
          className="flex-1 focus:outline-none relative overflow-hidden"
        >
          <SettingsPanel
            updateState={updateState}
            onDownloadUpdate={() => void download()}
            onInstallUpdate={() => void install()}
            onCrosshairsImported={reload}
          />
        </Tabs.Panel>

        <nav className="h-[72px] shrink-0 border-t border-white/[0.06] bg-[#050505]/95 px-6 backdrop-blur-xl">
          <Tabs.List
            aria-label="Разделы приложения"
            className="mx-auto flex h-full w-fit items-center gap-1"
          >
            {([
              { value: 'crosshairs', label: 'ПРИЦЕЛЫ', icon: CrosshairIcon },
              { value: 'lineups', label: 'ЛАЙНАПЫ', icon: Users }
            ] as const).map(item => {
              const isActive = tab === item.value
              const Icon = item.icon

              return (
                <Tabs.Tab
                  key={item.value}
                  value={item.value}
                  className={`flex h-11 min-w-36 items-center justify-center gap-2.5 rounded-2xl px-5 text-[10px] font-black tracking-[0.14em] outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50
                    ${isActive
                      ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                      : 'text-white/30 hover:bg-white/[0.05] hover:text-white/75'
                    }`}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.6 : 2} />
                  {item.label}
                </Tabs.Tab>
              )
            })}

            <div className="mx-2 h-5 w-px bg-white/[0.08]" aria-hidden="true" />

            <Tabs.Tab
              value="settings"
              aria-label="Настройки"
              title="Настройки"
              className={`relative flex size-11 items-center justify-center rounded-2xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50
                ${tab === 'settings'
                  ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                  : hasUpdate
                    ? 'bg-white/[0.055] text-white/75 shadow-[0_0_24px_rgba(255,70,85,0.12)] hover:bg-white/[0.08] hover:text-white'
                    : 'text-white/30 hover:bg-white/[0.05] hover:text-white/75'
                }`}
            >
              <Settings size={16} strokeWidth={tab === 'settings' ? 2.6 : 2} />
              {hasUpdate && (
                <span className={`absolute right-2 top-2 size-2 rounded-full ${
                  tab === 'settings'
                    ? 'border border-black/25 bg-[#FF4655]'
                    : 'border border-[#050505] bg-[#FF4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]'
                }`} />
              )}
            </Tabs.Tab>
          </Tabs.List>
        </nav>
      </Tabs.Root>

      <AddPanel
        open={modalOpen}
        crosshair={editingCrosshair}
        onClose={() => { setModalOpen(false); setEditingCrosshair(null) }}
        onSave={async (name, code, game) => {
          if (editingCrosshair) {
            await update({
              ...editingCrosshair,
              name,
              code,
              game,
              color_preview: extractPreviewColor(game, code)
            })
            toast('Прицел обновлён')
          } else {
            await add(name, code, game)
            toast('Прицел добавлен')
          }
        }}
      />
      <ReleaseNotesModal />
      <ToastContainer />
    </div>
  )
}
