import React, { useEffect, useMemo, useState } from 'react'
import { Dialog } from '@base-ui/react'
import { Check, Copy, Focus, Maximize2, Pencil, X } from 'lucide-react'
import { Crosshair } from '../types'
import { getCS2Color, getValorantColor, parseCS2Code, parseValorantCode } from '../lib/crosshair-parser'
import { CrosshairPreview } from './CrosshairPreview'
import valorantIceboxScene from '../assets/game-scenes/valorant/icebox-yard.jpg'
import valorantLotusScene from '../assets/game-scenes/valorant/lotus-rotunda.jpg'
import valorantBreezeScene from '../assets/game-scenes/valorant/breeze-site.jpg'
import cs2OverpassScene from '../assets/game-scenes/cs2/overpass-toilets.jpg'
import cs2NukeScene from '../assets/game-scenes/cs2/nuke-ramp.jpg'
import cs2DustScene from '../assets/game-scenes/cs2/dust2-doors.jpg'

interface Props {
  crosshair: Crosshair
  open: boolean
  onClose: () => void
  onCopyCode: (code: string) => void
  onEdit: () => void
}

const SCENES_BY_GAME = {
  valorant: [
    { id: 'icebox-yard', name: 'Icebox', image: valorantIceboxScene },
    { id: 'lotus-rotunda', name: 'Lotus', image: valorantLotusScene },
    { id: 'breeze-site', name: 'Breeze', image: valorantBreezeScene },
  ],
  cs2: [
    { id: 'overpass', name: 'Overpass', image: cs2OverpassScene },
    { id: 'nuke', name: 'Nuke', image: cs2NukeScene },
    { id: 'dust2', name: 'Dust II', image: cs2DustScene },
  ],
} as const

export function CrosshairDetails({ crosshair, open, onClose, onCopyCode, onEdit }: Props) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [zoom, setZoom] = useState<1 | 3>(1)
  const [copied, setCopied] = useState(false)
  const scenes = SCENES_BY_GAME[crosshair.game]
  const scene = scenes[sceneIndex] ?? scenes[0]
  const details = useMemo(() => getDetails(crosshair), [crosshair])
  const parameterRows: Array<[string, string]> = [
    ['Игра', crosshair.game === 'valorant' ? 'Valorant' : 'CS2'],
    ['Цвет', details.color.toUpperCase()],
    ...details.rows
  ]

  useEffect(() => {
    if (open) setZoom(1)
  }, [open])

  const copyCode = () => {
    onCopyCode(crosshair.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md animate-fade-in" />
        <Dialog.Popup className="fixed inset-4 z-[100] flex min-h-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#080808] shadow-[0_40px_120px_rgba(0,0,0,0.8)] outline-none animate-fade-in">
          <Dialog.Close
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-[#0B0B0B]/90 text-white/35 backdrop-blur-md transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Закрыть"
          >
            <X size={18} />
          </Dialog.Close>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-6">
              <Dialog.Title className="min-w-0 truncate text-lg font-black tracking-tight text-white">
                {crosshair.name}
              </Dialog.Title>

              <div className="ml-5 flex items-center">
                <div className="flex rounded-xl border border-white/[0.07] bg-black/40 p-1">
                  {([1, 3] as const).map(value => (
                    <button
                      key={value}
                      onClick={() => setZoom(value)}
                      className={`flex h-8 items-center gap-2 rounded-lg px-3 text-[10px] font-black uppercase tracking-wider transition-all ${
                        zoom === value ? 'bg-white text-black' : 'text-white/35 hover:bg-white/5 hover:text-white'
                      }`}
                      title={value === 1 ? 'Референсный игровой размер' : 'Увеличенный просмотр'}
                    >
                      {value === 1 ? <Focus size={13} /> : <Maximize2 size={13} />}
                      {value === 1 ? '1:1' : '×3'}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 p-5">
              <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
                <img
                  src={scene.image}
                  alt={scene.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/5" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <CrosshairPreview crosshair={crosshair} size={240} magnification={zoom} />
                </div>

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-20">
                  <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-white" />
                  <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-white" />
                  <span className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white" />
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2 rounded-2xl border border-white/10 bg-black/65 p-2 backdrop-blur-xl">
                  {scenes.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSceneIndex(index)}
                      className={`group relative h-14 w-24 overflow-hidden rounded-xl border transition-all ${
                        scene.id === item.id ? 'border-white/80 ring-2 ring-white/15' : 'border-white/10 hover:border-white/35'
                      }`}
                      title={item.name}
                    >
                      <img src={item.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-[8px] font-black uppercase tracking-wider text-white/75">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>

          <aside className="flex w-[300px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0B0B0B] px-5 pb-5 pt-16">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/20">Код прицела</p>
              <button
                onClick={copyCode}
                className="mt-2 flex w-full items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-left transition-colors hover:border-white/15 hover:bg-white/[0.045]"
              >
                <span className="min-w-0 flex-1 break-all font-mono text-[10px] leading-relaxed text-white/55">{crosshair.code}</span>
                {copied ? <Check className="mt-0.5 shrink-0 text-emerald-400" size={14} /> : <Copy className="mt-0.5 shrink-0 text-white/25" size={14} />}
              </button>
            </div>

            <div className="mt-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/20">Параметры</p>
              <dl className="mt-2 overflow-hidden rounded-xl border border-white/[0.06]">
                {parameterRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2.5 last:border-0">
                    <dt className="text-[10px] font-medium text-white/30">{label}</dt>
                    <dd className="flex items-center gap-2 font-mono text-[10px] font-bold text-white/65">
                      {label === 'Игра' ? (
                        <span
                          className="rounded-md border px-2 py-1 font-sans text-[9px] font-black uppercase tracking-[0.12em]"
                          style={{
                            color: crosshair.game === 'valorant' ? '#FF6571' : '#F2B544',
                            background: crosshair.game === 'valorant' ? '#FF465512' : '#E8A53012',
                            borderColor: crosshair.game === 'valorant' ? '#FF46552E' : '#E8A5302E'
                          }}
                        >
                          {value}
                        </span>
                      ) : label === 'Цвет' ? (
                        <span
                          className="flex items-center gap-2 rounded-md border border-white/10 px-2 py-1 text-white/70"
                          style={{
                            background: `${details.color}12`,
                            boxShadow: `inset 0 0 0 1px ${details.color}24`
                          }}
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-white/25 shadow-[0_0_8px_rgba(255,255,255,0.12)]"
                            style={{ background: details.color }}
                            aria-hidden="true"
                          />
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <button
              type="button"
              onClick={onEdit}
              className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] text-[9px] font-black uppercase tracking-[0.14em] text-white/55 transition-colors hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
            >
              <Pencil size={14} /> Изменить
            </button>

          </aside>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function getDetails(crosshair: Crosshair): { color: string; rows: Array<[string, string]> } {
  if (crosshair.game === 'cs2') {
    const parsed = parseCS2Code(crosshair.code)
    if (!parsed) return { color: '#FFFFFF', rows: [['Статус', 'Некорректный код']] }
    return {
      color: getCS2Color(parsed),
      rows: [
        ['Длина', String(parsed.length)],
        ['Толщина', String(parsed.thickness)],
        ['Отступ', String(parsed.gap)],
        ['Обводка', parsed.outlineEnabled ? String(parsed.outline) : 'Выкл.'],
        ['Точка', parsed.centerDotEnabled ? 'Вкл.' : 'Выкл.'],
        ['T-форма', parsed.tStyleEnabled ? 'Вкл.' : 'Выкл.'],
        ['Прозрачность', parsed.alphaEnabled ? `${Math.round(parsed.alpha / 2.55)}%` : '100%'],
      ],
    }
  }

  const parsed = parseValorantCode(crosshair.code)
  return {
    color: getValorantColor(parsed),
    rows: [
      ['Внутренние линии', parsed.innerEnabled ? 'Вкл.' : 'Выкл.'],
      ['Длина', String(parsed.innerLength)],
      ['Толщина', String(parsed.innerThickness)],
      ['Отступ', String(parsed.innerOffset)],
      ['Внешние линии', parsed.outerEnabled ? 'Вкл.' : 'Выкл.'],
      ['Точка', parsed.dotEnabled ? `Вкл. · ${parsed.dotSize}` : 'Выкл.'],
      ['Обводка', parsed.outlineEnabled ? String(parsed.outlineThickness) : 'Выкл.'],
    ],
  }
}
