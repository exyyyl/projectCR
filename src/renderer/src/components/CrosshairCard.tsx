import React, { useState } from 'react'
import { Tooltip } from '@base-ui/react'
import { Crosshair } from '../types'
import { CrosshairPreview } from './CrosshairPreview'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { CrosshairDetails } from './CrosshairDetails'
import valorantIceboxScene from '../assets/game-scenes/valorant/icebox-yard.jpg'
import valorantLotusScene from '../assets/game-scenes/valorant/lotus-rotunda.jpg'
import valorantBreezeScene from '../assets/game-scenes/valorant/breeze-site.jpg'
import cs2OverpassScene from '../assets/game-scenes/cs2/overpass-toilets.jpg'
import cs2NukeScene from '../assets/game-scenes/cs2/nuke-ramp.jpg'
import cs2DustScene from '../assets/game-scenes/cs2/dust2-doors.jpg'

interface Props {
  crosshair: Crosshair
  onDelete: (id: string) => void
  onCopyCode: (code: string) => void
}

const CARD_SCENES = {
  valorant: [
    { image: valorantIceboxScene, label: 'Icebox · двор' },
    { image: valorantLotusScene, label: 'Lotus · ротонда' },
    { image: valorantBreezeScene, label: 'Breeze · точка' },
  ],
  cs2: [
    { image: cs2OverpassScene, label: 'Overpass' },
    { image: cs2NukeScene, label: 'Nuke' },
    { image: cs2DustScene, label: 'Dust II' },
  ],
} as const

function selectCardScene(game: Crosshair['game'], code: string) {
  const scenes = CARD_SCENES[game]
  let hash = 0
  for (let index = 0; index < code.length; index += 1) {
    hash = (hash * 31 + code.charCodeAt(index)) >>> 0
  }
  return scenes[hash % scenes.length]
}

function TipBtn({
  label,
  onClick,
  children,
  danger
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              onClick={(event) => {
                event.stopPropagation()
                onClick()
              }}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                danger
                  ? 'text-amoled-text-muted hover:text-red-400 hover:bg-red-400/10'
                  : 'text-amoled-text-muted hover:text-amoled-text hover:bg-amoled-border'
              }`}
            />
          }
        >
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className="tooltip-popup">{label}</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export function CrosshairCard({ crosshair, onDelete, onCopyCode }: Props) {
  const [copied, setCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const tags: string[] = JSON.parse(crosshair.tags || '[]')
  const isVal = crosshair.game === 'valorant'
  const scene = selectCardScene(crosshair.game, crosshair.code)

  const handleCopy = () => {
    onCopyCode(crosshair.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowDetails(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setShowDetails(true)
          }
        }}
        className="group cursor-pointer bg-amoled-surface border border-amoled-border hover:border-amoled-border-strong rounded-2xl overflow-hidden transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {/* Preview area */}
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

          {/* Game chip */}
          <span
            className="absolute left-2.5 top-2 rounded-md border border-white/10 bg-black/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
            style={{
              color: isVal ? '#FF4655' : '#E8A530',
            }}
          >
            {isVal ? 'VAL' : 'CS2'}
          </span>

          {/* Action buttons — appear on hover */}
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <TipBtn label={copied ? 'Скопировано!' : 'Копировать код'} onClick={handleCopy}>
              {copied ? (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" />
                  <path d="M2 8V2a1 1 0 011-1h6" />
                </svg>
              )}
            </TipBtn>

            <TipBtn label="Удалить" onClick={() => setShowDeleteModal(true)} danger>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="1" y1="1" x2="8" y2="8" />
                <line x1="8" y1="1" x2="1" y2="8" />
              </svg>
            </TipBtn>
          </div>

          <div className="absolute bottom-2 left-2.5 text-[7px] font-bold uppercase tracking-[0.12em] text-white/45 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {scene.label}
          </div>

          <div className="absolute bottom-2 right-2 rounded-lg border border-white/10 bg-black/55 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white/45 backdrop-blur-md transition-colors group-hover:bg-black/70 group-hover:text-white/80">
            Подробнее
          </div>
        </div>

        {/* Info */}
        <div className="px-3 py-2.5 flex flex-col gap-1.5">
          <p className="text-[13px] font-medium text-amoled-text leading-tight truncate">{crosshair.name}</p>

          <p className="font-mono text-[10px] text-amoled-text-muted truncate">{crosshair.code}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>

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
