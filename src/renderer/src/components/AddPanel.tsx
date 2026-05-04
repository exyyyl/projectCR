import React, { useState, useEffect, useRef } from 'react'
import { Game } from '../types'
import { detectGame, extractPreviewColor } from '../lib/crosshair-parser'
import { CrosshairPreview } from './CrosshairPreview'
import { Crosshair } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (name: string, code: string, game: Game, note: string, tags: string[]) => Promise<void>
}

export function AddPanel({ open, onClose, onAdd }: Props) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const codeRef = useRef<HTMLInputElement>(null)

  const detectedGame = detectGame(code.trim())
  const isValidCode = code.trim().length > 0 && detectedGame !== null

  const previewCrosshair: Crosshair | null = isValidCode
    ? {
        id: 'preview',
        game: detectedGame!,
        name: '',
        code: code.trim(),
        tags: '[]',
        note: '',
        color_preview: '',
        created_at: ''
      }
    : null

  // Auto-focus code input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => codeRef.current?.focus(), 150)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const reset = () => {
    setCode(''); setName(''); setNote(''); setTagInput(''); setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidCode) return setError('Введи корректный код прицела VALORANT или CS2')
    if (!name.trim()) return setError('Введи название')
    setLoading(true)
    setError('')
    try {
      const tags = tagInput.trim()
        ? tagInput.split(',').map(t => t.trim()).filter(Boolean)
        : []
      await onAdd(name.trim(), code.trim(), detectedGame!, note.trim(), tags)
      handleClose()
    } catch {
      setError('Ошибка при сохранении')
    }
    setLoading(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 transition-opacity duration-250"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-amoled-surface border-l border-amoled-border shadow-2xl"
        style={{
          width: 380,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-amoled-border shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-amoled-text">Добавить прицел</h2>
            <p className="text-[11px] text-amoled-text-muted mt-0.5">VALORANT или CS2</p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-amoled-text-muted hover:text-amoled-text hover:bg-amoled-border transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="9" y2="9" />
              <line x1="9" y1="1" x2="1" y2="9" />
            </svg>
          </button>
        </div>

        {/* Live preview */}
        <div className="px-5 py-4 border-b border-amoled-border shrink-0">
          <div className="flex items-center gap-4 bg-amoled-bg rounded-2xl px-4 py-4">
            <div className="w-16 h-16 flex items-center justify-center">
              {previewCrosshair ? (
                <CrosshairPreview crosshair={previewCrosshair} size={56} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-amoled-text-muted opacity-30">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="3" x2="12" y2="7" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <line x1="3" y1="12" x2="7" y2="12" />
                  <line x1="17" y1="12" x2="21" y2="12" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {previewCrosshair ? (
                <>
                  <p className="text-sm font-medium text-amoled-text truncate">
                    {name || 'Без названия'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        color: detectedGame === 'valorant' ? '#FF4655' : '#E8A530',
                        background: detectedGame === 'valorant' ? '#FF465515' : '#E8A53015',
                      }}
                    >
                      {detectedGame === 'valorant' ? 'VALORANT' : 'CS2'}
                    </span>
                    <span className="text-[10px] text-amoled-text-muted font-mono truncate">
                      {code.length > 22 ? code.slice(0, 22) + '…' : code}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-amoled-text-muted">
                  Введи код прицела
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form id="add-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Code */}
          <div>
            <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">
              Код прицела
            </label>
            <div className="relative">
              <input
                ref={codeRef}
                value={code}
                onChange={e => { setCode(e.target.value); setError('') }}
                placeholder="0;P;c;5;h;0;0l;4... или CSGO-xxxxx"
                className="input-base font-mono text-xs pr-20"
                spellCheck={false}
                autoComplete="off"
              />
              {code.trim() && (
                <span
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded pointer-events-none"
                  style={{
                    color: isValidCode
                      ? detectedGame === 'valorant' ? '#FF4655' : '#E8A530'
                      : '#f87171',
                    background: isValidCode
                      ? detectedGame === 'valorant' ? '#FF465515' : '#E8A53015'
                      : '#f8717115',
                  }}
                >
                  {isValidCode ? (detectedGame === 'valorant' ? 'VAL' : 'CS2') : 'Неверный'}
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">
              Название
            </label>
            <input
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="TenZ, NiKo, мой прицел..."
              className="input-base"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">
              Теги
              <span className="text-amoled-text-muted font-normal ml-1">через запятую</span>
            </label>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="pro, dot, small"
              className="input-base"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">
              Заметка
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Откуда взят, при каком DPI хорош..."
              rows={3}
              className="input-base resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Note about preview */}
          {previewCrosshair?.game === 'valorant' && (
            <p className="text-[10px] text-amoled-text-muted leading-relaxed">
              Превью показывает Primary (P) прицел. ADS/снайпер секции отображаются отдельно в игре.
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 border-t border-amoled-border shrink-0 flex gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-amoled-border text-amoled-text-secondary hover:text-amoled-text hover:border-amoled-border-strong transition-colors text-sm"
          >
            Отмена
          </button>
          <button
            type="submit"
            form="add-form"
            disabled={!isValidCode || !name.trim() || loading}
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-amoled-elevated hover:bg-amoled-border border border-amoled-border-strong text-amoled-text font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Сохраняем...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </>
  )
}
