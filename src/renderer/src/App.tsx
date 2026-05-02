import React, { useState, useEffect, useMemo } from 'react'
import { Tabs } from '@base-ui/react'
import { Titlebar } from './components/Titlebar'
import { CrosshairCard } from './components/CrosshairCard'
import { AddPanel } from './components/AddPanel'
import { ToastContainer, toast } from './components/Toast'
import { UpdateNotification } from './components/UpdateNotification'
import { CHANGELOG } from './config/changelog'
import { useCrosshairs } from './store/useCrosshairs'
import { Crosshair, Game } from './types'
import { Search, Plus, Crosshair as CrosshairIcon } from 'lucide-react'

type TabValue = 'all' | Game

export default function App() {
  const { crosshairs, loading, add, remove } = useCrosshairs()
  const [tab, setTab] = useState<TabValue>('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const counts = useMemo(() => ({
    all: crosshairs.length,
    valorant: crosshairs.filter(c => c.game === 'valorant').length,
    cs2: crosshairs.filter(c => c.game === 'cs2').length
  }), [crosshairs])

  const filtered = useMemo(() => {
    return crosshairs.filter(c => {
      const matchTab = tab === 'all' || c.game === tab
      const q = search.toLowerCase()
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      return matchTab && matchSearch
    })
  }, [crosshairs, tab, search])

  const handleApply = async (c: Crosshair) => {
    try {
      if (c.game === 'valorant') {
        const res = await window.api.valorant.applyCrosshair(c.code)
        toast(res.success ? 'Прицел применён в VALORANT' : (res.error ?? 'VALORANT не запущен'), res.success ? 'success' : 'error')
      } else {
        const res = await window.api.cs2.applyCrosshair(c.code)
        toast(res.success ? 'Добавлено в autoexec.cfg' : (res.error ?? 'CS2 не найден'), res.success ? 'success' : 'error')
      }
    } catch {
      toast('Ошибка применения', 'error')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-amoled-bg text-amoled-text overflow-hidden font-sans">
      <Titlebar />

      {/* Modern Navigation Bar */}
      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-5 shrink-0 drag-region bg-amoled-bg">
          <Tabs.List className="flex items-center gap-2 no-drag">
            {([
              { value: 'all', label: 'ВСЕ', count: counts.all, color: '#38BDF8' }, // Subtle sky blue for All
              { value: 'valorant', label: 'VALORANT', count: counts.valorant, color: '#FF4655' },
              { value: 'cs2', label: 'CS2', count: counts.cs2, color: '#E8A530' },
            ] as const).map(item => {
              const isActive = tab === item.value
              return (
                <Tabs.Tab
                  key={item.value}
                  value={item.value}
                  className={`no-drag relative flex items-center h-10 gap-3 px-5 rounded-2xl text-[11px] font-black tracking-widest transition-all duration-300 outline-none
                    ${isActive 
                      ? 'shadow-[0_0_20px_rgba(0,0,0,0.3)]' 
                      : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                    }`}
                  style={isActive ? { 
                    backgroundColor: `${item.color}20`, 
                    color: item.color,
                    boxShadow: `0 0 25px ${item.color}15`
                  } : {}}
                >
                  {item.label}
                  {item.count > 0 && (
                    <span className="text-[10px] font-mono tabular-nums opacity-50">
                      {item.count}
                    </span>
                  )}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>

          <div className="flex items-center gap-5 no-drag">
            {/* Elegant Search Bar */}
            <div className="relative flex items-center h-10 group bg-white/[0.03] border border-white/[0.05] rounded-2xl px-4 focus-within:bg-white/[0.06] focus-within:border-white/10 transition-all duration-300">
              <Search 
                size={14} 
                className={`transition-colors duration-300 ${
                  search ? 'text-white' : 'text-white/20'
                } group-focus-within:text-white`} 
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ПОИСК ПО НАЗВАНИЮ..."
                className="bg-transparent w-40 focus:w-56 ml-3 text-[10px] font-black tracking-[0.1em] text-white placeholder-white/10 outline-none border-none focus:ring-0 transition-all duration-300"
              />
            </div>

            {/* Circle Plus Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <Plus size={20} strokeWidth={3} />
            </button>

            {/* Info Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-changelog'))}
              className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/5 text-white/40 rounded-2xl hover:bg-white/[0.05] hover:text-white/60 active:scale-95 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {(['all', 'valorant', 'cs2'] as TabValue[]).map(tabVal => (
          <Tabs.Panel
            key={tabVal}
            value={tabVal}
            className="flex-1 overflow-y-auto focus:outline-none relative"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState search={search} onClearSearch={() => setSearch('')} onAdd={() => setModalOpen(true)} />
            ) : (
              <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {filtered.map(c => (
                  <CrosshairCard
                    key={c.id}
                    crosshair={c}
                    onDelete={async (id) => { await remove(id); toast('Удалено') }}
                    onApply={handleApply}
                    onCopyCode={(code) => { navigator.clipboard.writeText(code); toast('Код скопирован') }}
                  />
                ))}
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
      <div className="absolute inset-0 p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 opacity-[0.02] pointer-events-none">
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
