import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Trash2 } from 'lucide-react'
import type { Crosshair } from '../types'
import { CrosshairPreview } from './CrosshairPreview'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { CrosshairDetails } from './CrosshairDetails'
import valorantIceboxScene from '../assets/game-scenes/valorant/icebox-yard.jpg'
import valorantLotusScene from '../assets/game-scenes/valorant/lotus-rotunda.jpg'
import valorantBreezeScene from '../assets/game-scenes/valorant/breeze-site.jpg'
import cs2OverpassScene from '../assets/game-scenes/cs2/overpass-toilets.jpg'
import cs2NukeScene from '../assets/game-scenes/cs2/nuke-ramp.jpg'
import cs2DustScene from '../assets/game-scenes/cs2/dust2-doors.jpg'

interface CrosshairCardProps {
  crosshair: Crosshair
  onDelete: (id: string) => void
  onCopyCode: (code: string) => void
}

const CARD_SCENES = {
  valorant: [
    { image: valorantIceboxScene },
    { image: valorantLotusScene },
    { image: valorantBreezeScene }
  ],
  cs2: [
    { image: cs2OverpassScene },
    { image: cs2NukeScene },
    { image: cs2DustScene }
  ]
} as const

function selectCardScene(game: Crosshair['game'], code: string) {
  const scenes = CARD_SCENES[game]
  let hash = 0
  for (let index = 0; index < code.length; index += 1) {
    hash = (hash * 31 + code.charCodeAt(index)) >>> 0
  }
  return scenes[hash % scenes.length]
}

export function CrosshairCard({ crosshair, onDelete, onCopyCode }: CrosshairCardProps) {
  const [copied, setCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const isValorant = crosshair.game === 'valorant'
  const scene = selectCardScene(crosshair.game, crosshair.code)

  const handleCopy = () => {
    onCopyCode(crosshair.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-amoled-border bg-amoled-surface transition-all duration-150 hover:-translate-y-0.5 hover:border-amoled-border-strong hover:shadow-[0_16px_32px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35"
          aria-label={`Открыть прицел ${crosshair.name}`}
        >
          <div className="relative isolate flex h-36 items-center justify-center overflow-hidden bg-[#080A0D]">
            <img
              src={scene.image}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 h-full w-full scale-[1.04] object-cover saturate-[0.78] brightness-[0.72] contrast-[0.92] transition-transform duration-500 ease-out group-hover:scale-[1.075]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,10,13,0.06)_0%,rgba(8,10,13,0.15)_52%,rgba(0,0,0,0.58)_100%)] shadow-[inset_0_-34px_42px_rgba(0,0,0,0.35)]"
            />
            <div className="relative z-10 [filter:drop-shadow(0_0_1px_rgba(0,0,0,0.95))_drop-shadow(0_2px_3px_rgba(0,0,0,0.65))]">
              <CrosshairPreview crosshair={crosshair} size={124} magnification={2.8} autoFit />
            </div>

            <span
              className="absolute left-2.5 top-2 rounded-md border border-white/10 bg-black/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
              style={{ color: isValorant ? '#FF4655' : '#E8A530' }}
            >
              {isValorant ? 'VAL' : 'CS2'}
            </span>

            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white/55 backdrop-blur-md transition-colors group-hover:text-white/85">
              Открыть
              <ArrowUpRight size={10} />
            </span>
          </div>

          <div className="flex min-h-[58px] flex-col gap-1.5 px-3 py-2.5">
            <p className="truncate text-[13px] font-medium leading-tight text-amoled-text">{crosshair.name}</p>
            <p className="truncate font-mono text-[10px] text-amoled-text-muted">{crosshair.code}</p>
          </div>
        </button>

        <div className="flex h-11 items-stretch border-t border-white/[0.06] bg-black/20">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex min-w-0 flex-1 items-center justify-center gap-2 px-3 text-[9px] font-black uppercase tracking-[0.12em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40 ${
              copied
                ? 'bg-emerald-400/10 text-emerald-300'
                : 'text-white/48 hover:bg-white/[0.055] hover:text-white'
            }`}
          >
            {copied ? <Check size={14} strokeWidth={2.6} /> : <Copy size={14} />}
            <span>{copied ? 'Скопировано' : 'Копировать'}</span>
          </button>
          <div className="w-px bg-white/[0.06]" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex w-11 shrink-0 items-center justify-center text-white/28 outline-none transition-colors hover:bg-red-400/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-400/50"
            aria-label={`Удалить прицел ${crosshair.name}`}
            title="Удалить"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </article>

      <CrosshairDetails
        crosshair={crosshair}
        open={showDetails}
        onClose={() => setShowDetails(false)}
        onCopyCode={onCopyCode}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(crosshair.id)
          setShowDeleteModal(false)
        }}
        crosshair={crosshair}
      />
    </>
  )
}
