import React, { useState, useEffect, useMemo } from 'react'
import { Tabs } from '@base-ui/react'
import { CrosshairCard } from './components/CrosshairCard'
import { AddPanel } from './components/AddPanel'
import { ToastContainer, toast } from './components/Toast'
import { UpdateNotification } from './components/UpdateNotification'
import { CHANGELOG } from './config/changelog'
import { useCrosshairs } from './store/useCrosshairs'
import { Game } from './types'
import { Search, Plus, Crosshair as CrosshairIcon, Settings, ChevronDown } from 'lucide-react'
import { SettingsPanel } from './components/SettingsPanel'

type TabValue = 'all' | Game | 'settings'

export default function App() {
  const { crosshairs, loading, add, remove } = useCrosshairs()
  const [tab, setTab] = useState<TabValue>('all')
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
      const matchTab = tab === 'all' || c.game === tab
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
  }, [crosshairs, tab, search, sortBy, sortOrder])

  return (
    <div className="flex flex-col h-screen bg-amoled-bg text-amoled-text overflow-hidden font-sans">
      {/* Combined titlebar + navigation — single compact row */}
      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex items-center h-14 px-2 pt-2 shrink-0 drag-region bg-amoled-bg">
          {/* Left spacer (balances window controls width) */}
          <div className="w-28 shrink-0" />

          {/* Center: pill navigation */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center p-1 bg-white/[0.03] border border-white/[0.05] rounded-[20px] no-drag">
              <Tabs.List className="flex items-center gap-0.5">
                {([
                  { value: 'all', label: 'ВСЕ', count: counts.all, color: '#38BDF8' },
                  { value: 'valorant', label: 'VALORANT', count: counts.valorant, color: '#FF4655' },
                  { value: 'cs2', label: 'CS2', count: counts.cs2, color: '#E8A530' },
                ] as const).map(item => {
                  const isActive = tab === item.value
                  return (
                    <Tabs.Tab
                      key={item.value}
                      value={item.value}
                      className={`no-drag relative flex items-center h-8 px-5 rounded-[16px] text-[10px] font-black tracking-widest transition-all duration-150 outline-none gap-2
                        ${isActive
                          ? 'text-black'
                          : 'text-white/25 hover:text-white/70 hover:bg-white/[0.06]'
                        }`}
                      style={isActive ? { backgroundColor: item.color } : {}}
                    >
                      {item.label}
                      {item.count > 0 && (
                        <span className={`text-[9px] font-mono tabular-nums ${isActive ? 'opacity-40' : 'opacity-50'}`}>
                          {item.count}
                        </span>
                      )}
                    </Tabs.Tab>
                  )
                })}
              </Tabs.List>

              <div className="w-px h-5 bg-white/10 mx-1" />

              <button
                onClick={() => setTab('settings')}
                className={`no-drag w-8 h-8 flex items-center justify-center rounded-[16px] transition-all duration-200
                  ${tab === 'settings'
                    ? 'bg-white text-black'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}
                title="Настройки"
              >
                <Settings size={15} strokeWidth={tab === 'settings' ? 3 : 2} />
              </button>
            </div>
          </div>

          {/* Right: window controls */}
          <div className="w-28 shrink-0 flex items-center justify-end gap-0.5 no-drag">
            <button
              onClick={() => window.api.window.minimize()}
              className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor"><rect width="10" height="1" rx="0.5" /></svg>
            </button>
            <button
              onClick={() => window.api.window.maximize()}
              className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="8" height="8" rx="1" /></svg>
            </button>
            <button
              onClick={() => window.api.window.close()}
              className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><line x1="1" y1="1" x2="8" y2="8" /><line x1="8" y1="1" x2="1" y2="8" /></svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {(['all', 'valorant', 'cs2', 'settings'] as TabValue[]).map(tabVal => (
          <Tabs.Panel
            key={tabVal}
            value={tabVal}
            className={`flex-1 focus:outline-none relative ${tabVal === 'settings' ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
          >
            {tabVal === 'settings' ? (
              <SettingsPanel />
            ) : (
              <div className="flex flex-col h-full">
                {/* Internal Toolbar */}
                <div className="px-6 pt-5 pb-0 flex items-center gap-3 shrink-0">
                  {/* Search - Left Aligned */}
                  <div className="relative w-64 flex items-center h-10 group bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 focus-within:bg-white/[0.04] focus-within:border-white/10 transition-all duration-200">
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
                      className="bg-transparent flex-1 ml-4 text-[11px] font-black tracking-[0.1em] text-white placeholder-white/10 outline-none border-none focus:ring-0"
                    />
                  </div>

                  <div className="flex-1" />

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
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <EmptyState search={search} onClearSearch={() => setSearch('')} onAdd={() => setModalOpen(true)} />
                ) : (
                  <div className="px-6 pt-4 pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filtered.map(c => (
                      <CrosshairCard
                        key={c.id}
                        crosshair={c}
                        onDelete={async (id) => { await remove(id); toast('Удалено') }}
                        onCopyCode={(code) => { navigator.clipboard.writeText(code); toast('Код скопирован') }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Tabs.Panel>
        ))}
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
  const [version, setVersion] = useState('')


  useEffect(() => {
    if (!window.api?.window) return

    const checkVersion = async () => {
      const currentVersion = await window.api.window.getVersion()
      const lastVersion = localStorage.getItem('last_version')
      
      if (lastVersion && lastVersion !== currentVersion) {
        setVersion(currentVersion)
        setOpen(true)
      }
      
      localStorage.setItem('last_version', currentVersion)
    }
    
    checkVersion()

    const handleOpen = () => {
      window.api.window.getVersion().then(v => {
        setVersion(v)
        setOpen(true)
      })
    }

    window.addEventListener('open-changelog', handleOpen)
    return () => window.removeEventListener('open-changelog', handleOpen)
  }, [])

  if (!open) return null

  const notes = CHANGELOG[version] || CHANGELOG['0.1.2']

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Что нового?</h2>
              <p className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Версия {version}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
              <Plus size={24} className="rotate-45" onClick={() => setOpen(false)} />
            </div>
          </div>

          <div className="space-y-6 mb-10">
            {notes.map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 group-hover:bg-white transition-colors shrink-0" />
                <div>
                  <h4 className="text-[14px] font-black text-white/90 mb-1">{item.title}</h4>
                  <p className="text-[12px] text-white/40 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
          >
            ПОНЯТНО
          </button>
        </div>
      </div>
    </div>
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
