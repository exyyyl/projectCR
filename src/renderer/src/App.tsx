import React, { useState, useEffect, useMemo } from 'react'
import { Dialog, Tabs } from '@base-ui/react'
import { CrosshairCard } from './components/CrosshairCard'
import { AddPanel } from './components/AddPanel'
import { ToastContainer, toast } from './components/Toast'
import { UpdateNotification } from './components/UpdateNotification'
import { CHANGELOG } from './config/changelog'
import { useCrosshairs } from './store/useCrosshairs'
import { Game } from './types'
import { Search, Plus, Crosshair as CrosshairIcon, Settings, ChevronDown, Users, X } from 'lucide-react'
import { SettingsPanel } from './components/SettingsPanel'
import { LineupsPanel } from './components/LineupsPanel'

type TabValue = 'crosshairs' | 'lineups' | 'settings'

const CHANGELOG_RELEASES = Object.entries(CHANGELOG).map(([version, items]) => ({ version, items }))

export default function App() {
  const { crosshairs, loading, add, remove } = useCrosshairs()
  const [tab, setTab] = useState<TabValue>('crosshairs')
  const [gameFilter, setGameFilter] = useState<'all' | Game>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setBy] = useState<'newest' | 'name' | 'game'>('newest')
  const [sortOrder, setOrder] = useState<'asc' | 'desc'>('desc')
  const [sortOpen, setSortOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

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
                    active: 'bg-white text-black shadow-[0_8px_24px_rgba(255,255,255,0.08)]',
                    inactive: 'text-white/40 hover:bg-white/[0.05] hover:text-white/80',
                    badge: 'bg-black/10 text-black/55'
                  },
                  {
                    value: 'valorant', label: 'VALORANT', count: counts.valorant,
                    active: 'bg-[#FF4655] text-white shadow-[0_8px_24px_rgba(255,70,85,0.22)]',
                    inactive: 'text-[#FF6571]/55 hover:bg-[#FF4655]/10 hover:text-[#FF6571]',
                    badge: 'bg-black/15 text-white/75'
                  },
                  {
                    value: 'cs2', label: 'CS2', count: counts.cs2,
                    active: 'bg-[#E8A530] text-black shadow-[0_8px_24px_rgba(232,165,48,0.2)]',
                    inactive: 'text-[#E8A530]/55 hover:bg-[#E8A530]/10 hover:text-[#F2B544]',
                    badge: 'bg-black/10 text-black/60'
                  },
                ] as const).map(item => {
                  const isActive = gameFilter === item.value
                  return (
                    <button
                      key={item.value}
                      onClick={() => setGameFilter(item.value)}
                      className={`flex h-9 min-w-28 items-center justify-center gap-2 rounded-xl px-4 text-[9px] font-black tracking-widest outline-none transition-all duration-200 ${isActive ? item.active : item.inactive}`}
                    >
                      {item.label}
                      <span className={`min-w-5 rounded-md px-1.5 py-0.5 text-center font-mono text-[8px] ${isActive ? item.badge : 'bg-white/[0.04] text-current opacity-55'}`}>
                        {item.count}
                      </span>
                    </button>
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
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ПОИСК..."
                  className="bg-transparent flex-1 ml-3 text-[11px] font-black tracking-[0.1em] text-white placeholder-white/10 outline-none border-none focus:ring-0"
                />
              </div>

              {/* Grouped Actions - Right Aligned */}
              <div className="flex items-center gap-2">
                {/* Integrated Sort Control */}
                <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-xl relative">
                  <button
                    onClick={() => setOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="w-10 h-10 flex items-center justify-center border-r border-white/[0.05] text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-l-xl"
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
                  </button>
                  
                  {/* Custom Select Trigger */}
                  <div className="relative">
                    <button 
                      onClick={() => setSortOpen(!sortOpen)}
                      className="flex items-center h-10 pl-4 pr-3 text-[10px] font-black text-white/60 hover:text-white transition-colors uppercase tracking-widest gap-2"
                    >
                      {sortBy === 'newest' ? 'По дате' : sortBy === 'name' ? 'По названию' : 'По игре'}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Custom Dropdown Menu */}
                    {sortOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setSortOpen(false)} 
                        />
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/[0.05] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-fade-in origin-top-right">
                          {([
                            { value: 'newest', label: 'По дате' },
                            { value: 'name', label: 'По названию' },
                            { value: 'game', label: 'По игре' }
                          ] as const).map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { setBy(opt.value); setSortOpen(false) }}
                              className={`w-full px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between
                                ${sortBy === opt.value 
                                  ? 'bg-white/5 text-white' 
                                  : 'text-white/30 hover:bg-white/[0.02] hover:text-white/60'
                                }`}
                            >
                              {opt.label}
                              {sortBy === opt.value && <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Add Icon Button */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_8px_20px_rgba(255,255,255,0.05)]"
                  title="Добавить прицел"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="min-h-0 flex-1">
                <EmptyState search={search} onClearSearch={() => setSearch('')} onAdd={() => setModalOpen(true)} />
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
          <SettingsPanel />
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
              className={`flex size-11 items-center justify-center rounded-2xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50
                ${tab === 'settings'
                  ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                  : 'text-white/30 hover:bg-white/[0.05] hover:text-white/75'
                }`}
            >
              <Settings size={16} strokeWidth={tab === 'settings' ? 2.6 : 2} />
            </Tabs.Tab>
          </Tabs.List>
        </nav>
      </Tabs.Root>

      <AddPanel 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAdd={async (name, code, game, note, tags) => { await add(name, code, game, note, tags) }} 
      />
      <ReleaseNotesModal />
      <ToastContainer />
      <UpdateNotification />
    </div>
  )
}

function ReleaseNotesModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setOpen(true)

    window.addEventListener('open-changelog', handleOpen)

    if (window.api?.window) {
      void window.api.window.getVersion().then(currentVersion => {
        const lastVersion = localStorage.getItem('last_version')

        if (lastVersion && lastVersion !== currentVersion) {
          setOpen(true)
        }

        localStorage.setItem('last_version', currentVersion)
      })
    }

    return () => window.removeEventListener('open-changelog', handleOpen)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[190] bg-black/85 backdrop-blur-md animate-fade-in" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[200] flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#090909] shadow-[0_40px_120px_rgba(0,0,0,0.85)] outline-none animate-fade-in">
          <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <Dialog.Title className="text-xl font-black tracking-[-0.025em] text-white">
              Обновления
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Изменения в версиях ProjectCR
            </Dialog.Description>
            <Dialog.Close
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 outline-none transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Закрыть обновления"
            >
              <X size={17} />
            </Dialog.Close>
          </header>

          <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
            {CHANGELOG_RELEASES.map(release => (
              <section key={release.version} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018]">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <p className="font-mono text-[12px] font-black tracking-tight text-white/75">v{release.version}</p>
                </div>

                {release.items.map(item => (
                  <article key={`${release.version}-${item.title}`} className="px-5 py-6">
                    <h3 className="text-[14px] font-bold tracking-tight text-white/85">{item.title}</h3>
                    <p className="mt-2 max-w-md text-[12px] font-medium leading-relaxed text-white/35">{item.desc}</p>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function EmptyState({ search, onClearSearch, onAdd }: { search: string; onClearSearch: () => void; onAdd: () => void }) {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      {/* Skeleton Background */}
      <div className="absolute inset-0 px-6 pt-5 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 opacity-[0.02] pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-white rounded-[2rem] border border-white/20" />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-2xl mb-8 rotate-3 hover:rotate-0 transition-transform duration-700">
          <CrosshairIcon size={40} strokeWidth={1} className="text-white/10" />
        </div>
        
        {search ? (
          <>
            <h3 className="text-white text-2xl font-black tracking-tight mb-3">Ничего не нашли</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-8">
              По запросу «<span className="text-white/60">{search}</span>» прицелов в вашей коллекции нет. Попробуйте другое слово.
            </p>
            <button 
              onClick={onClearSearch}
              className="w-full text-[11px] font-black tracking-[0.2em] text-white bg-white/5 border border-white/5 py-4 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98]"
            >
              СБРОСИТЬ ПОИСК
            </button>
          </>
        ) : (
          <>
            <h3 className="text-white text-2xl font-black tracking-tight mb-3">Коллекция пуста</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-10">
              Похоже, вы еще не добавили ни одного прицела. Время создать свою идеальную коллекцию!
            </p>
            <button 
              onClick={onAdd}
              className="group w-full flex items-center justify-center gap-3 text-[11px] font-black tracking-[0.2em] text-black bg-white py-4 rounded-2xl hover:scale-[1.02] transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <Plus size={16} strokeWidth={4} />
              ДОБАВИТЬ
            </button>
          </>
        )}
      </div>
    </div>
  )
}
