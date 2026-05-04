import React, { useState } from 'react'
import { Tooltip } from '@base-ui/react'
import { Crosshair } from '../types'
import { CrosshairPreview } from './CrosshairPreview'
import { DeleteConfirmModal } from './DeleteConfirmModal'

interface Props {
  crosshair: Crosshair
  onDelete: (id: string) => void
  onCopyCode: (code: string) => void
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
    <Tooltip.Provider delayDuration={400}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              onClick={onClick}
              className={`no-drag w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
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
  const tags: string[] = JSON.parse(crosshair.tags || '[]')
  const isVal = crosshair.game === 'valorant'

  const handleCopy = () => {
    onCopyCode(crosshair.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div className="group bg-amoled-surface border border-amoled-border hover:border-amoled-border-strong rounded-2xl overflow-hidden transition-all duration-150">
        {/* Preview area */}
        <div className="flex items-center justify-center bg-black py-5 relative">
          <CrosshairPreview crosshair={crosshair} size={80} />

          {/* Game chip */}
          <span
            className="absolute top-2 left-2.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              color: isVal ? '#FF4655' : '#E8A530',
              background: isVal ? '#FF465512' : '#E8A53012',
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
