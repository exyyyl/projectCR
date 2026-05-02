import React, { useState, useMemo } from 'react'
import { Tabs } from '@base-ui/react'
import { Titlebar } from './components/Titlebar'
import { CrosshairCard } from './components/CrosshairCard'
import { AddPanel } from './components/AddPanel'
import { ToastContainer, toast } from './components/Toast'
import { useCrosshairs } from './store/useCrosshairs'
import { Crosshair, Game } from './types'

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
      const matchGame = tab === 'all' || c.game === tab
      const q = search.toLowerCase()
      return !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
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
    <div className="flex flex-col h-screen bg-amoled-bg text-amoled-text overflow-hidden">
      <Titlebar />

      {/* Tab bar + toolbar */}
      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex items-center gap-0 px-4 border-b border-amoled-border shrink-0 drag-region">
          <Tabs.List className="flex items-end gap-0 no-drag mr-4">
            {([
              { value: 'all', label: 'Все', count: counts.all },
              { value: 'valorant', label: 'VALORANT', count: counts.valorant, color: '#FF4655' },
              { value: 'cs2', label: 'CS2', count: counts.cs2, color: '#E8A530' },
            ] as const).map(item => (
              <Tabs.Tab
                key={item.value}
                value={item.value}
                className={`no-drag relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors outline-none
                  data-[selected]:text-amoled-text
                  data-[selected=false]:text-amoled-text-muted
                  hover:text-amoled-text`}
              >
                {item.color && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-opacity"
                    style={{
                      backgroundColor: item.color,
                      opacity: tab === item.value ? 1 : 0.3,
                    }}
                  />
                )}
                {item.label}
                {item.count > 0 && (
                  <span className="text-[10px] text-amoled-text-muted font-mono tabular-nums">
                    {item.count}
                  </span>
                )}

                {/* Active indicator line */}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-px transition-opacity ${
                    tab === item.value ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: item.color ?? '#ffffff' }}
                />
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {/* Spacer + search + add */}
          <div className="flex-1" />

          <div className="flex items-center gap-2 no-drag py-1.5">
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amoled-text-muted pointer-events-none"
                width="11" height="11" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="1.8"
              >
                <circle cx="7" cy="7" r="5" />
                <line x1="11" y1="11" x2="14" y2="14" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="w-40 bg-amoled-surface border border-amoled-border rounded-xl pl-7 pr-3 py-1.5 text-[13px] text-amoled-text placeholder-amoled-text-muted focus:outline-none focus:border-amoled-border-strong focus:w-52 transition-all"
              />
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 bg-amoled-elevated hover:bg-amoled-surface border border-amoled-border hover:border-amoled-border-strong text-amoled-text text-[13px] font-medium px-3 py-1.5 rounded-xl transition-all"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="5" y1="1" x2="5" y2="9" />
                <line x1="1" y1="5" x2="9" y2="5" />
              </svg>
              Добавить
            </button>
          </div>
        </div>

        {/* Content */}
        {(['all', 'valorant', 'cs2'] as TabValue[]).map(tabVal => (
          <Tabs.Panel
            key={tabVal}
            value={tabVal}
            className="flex-1 overflow-y-auto focus:outline-none"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full text-amoled-text-muted text-sm">
                Загрузка...
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState search={search} onClearSearch={() => setSearch('')} onAdd={() => setModalOpen(true)} />
            ) : (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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

      <AddPanel open={modalOpen} onClose={() => setModalOpen(false)} onAdd={add} />
      <ToastContainer />
    </div>
  )
}

function EmptyState({ search, onClearSearch, onAdd }: { search: string; onClearSearch: () => void; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 pb-8">
      <div className="w-10 h-10 rounded-xl bg-amoled-surface flex items-center justify-center">
        <span className="text-amoled-text-muted text-base">◎</span>
      </div>
      {search ? (
        <>
          <p className="text-sm text-amoled-text-muted">Ничего не найдено по «{search}»</p>
          <button onClick={onClearSearch} className="text-xs text-amoled-text-secondary hover:text-amoled-text transition-colors">
            Сбросить поиск
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-amoled-text-muted">Нет прицелов</p>
          <button onClick={onAdd} className="text-xs text-amoled-text-secondary hover:text-amoled-text transition-colors">
            + Добавить первый
          </button>
        </>
      )}
    </div>
  )
}
