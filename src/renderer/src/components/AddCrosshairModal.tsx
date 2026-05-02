import React, { useState } from 'react'
import { Dialog } from '@base-ui/react'
import { Game } from '../types'
import { detectGame } from '../lib/crosshair-parser'
import { CrosshairPreview } from './CrosshairPreview'
import { Crosshair } from '../types'
import { nanoid } from '../lib/nanoid'
import { extractPreviewColor } from '../lib/crosshair-parser'

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  onAdd: (name: string, code: string, game: Game, note: string, tags: string[]) => Promise<void>
}

export function AddCrosshairModal({ open, onOpenChange, onAdd }: Props) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [note, setNote] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const detectedGame = detectGame(code.trim())
  const isValid = code.trim().length > 0 && detectedGame !== null

  const previewCrosshair: Crosshair | null = isValid ? {
    id: 'preview',
    game: detectedGame!,
    name: name || 'Preview',
    code: code.trim(),
    tags: '[]',
    note: '',
    color_preview: extractPreviewColor(detectedGame!, code.trim()),
    created_at: ''
  } : null

  const reset = () => {
    setName(''); setCode(''); setNote(''); setTagInput(''); setError('')
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return setError('Введи корректный код прицела VALORANT или CS2')
    if (!name.trim()) return setError('Введи название')
    setLoading(true); setError('')
    try {
      const tags = tagInput.trim() ? tagInput.split(',').map(t => t.trim()).filter(Boolean) : []
      await onAdd(name.trim(), code.trim(), detectedGame!, note.trim(), tags)
      handleClose()
    } catch {
      setError('Ошибка при сохранении')
    }
    setLoading(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 animate-fade-in" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-w-[90vw] bg-amoled-elevated border border-amoled-border rounded-2xl shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <Dialog.Title className="text-base font-semibold text-amoled-text mb-1">
                Добавить прицел
              </Dialog.Title>
              <Dialog.Description className="text-xs text-amoled-text-muted mb-5">
                Поддерживаются коды VALORANT и CS2 (CSGO-...)
              </Dialog.Description>

              <div className="flex gap-4">
                {/* Left: form fields */}
                <div className="flex-1 flex flex-col gap-3.5">
                  {/* Code */}
                  <div>
                    <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">
                      Код прицела
                    </label>
                    <div className="relative">
                      <input
                        value={code}
                        onChange={e => { setCode(e.target.value); setError('') }}
                        placeholder="0;P;c;5;h;0... или CSGO-xxxxx"
                        className="input-base pr-20 font-mono text-xs"
                        autoFocus
                        spellCheck={false}
                      />
                      {code.trim() && (
                        <span
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                          style={{
                            color: isValid ? (detectedGame === 'valorant' ? '#FF4655' : '#E8A530') : '#f87171',
                            backgroundColor: isValid ? (detectedGame === 'valorant' ? '#FF465515' : '#E8A53015') : '#f8717115'
                          }}
                        >
                          {isValid ? (detectedGame === 'valorant' ? 'VALORANT' : 'CS2') : 'Неверный'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">Название</label>
                    <input
                      value={name}
                      onChange={e => { setName(e.target.value); setError('') }}
                      placeholder="TenZ, NiKo style..."
                      className="input-base"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">
                      Теги <span className="text-amoled-text-muted font-normal">(через запятую)</span>
                    </label>
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="pro, small, dot"
                      className="input-base"
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-xs font-medium text-amoled-text-secondary mb-1.5">Заметка</label>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Необязательно..."
                      rows={2}
                      className="input-base resize-none"
                    />
                  </div>
                </div>

                {/* Right: live preview */}
                <div className="flex flex-col items-center justify-start gap-2 pt-6">
                  <div className="w-[88px] h-[88px] bg-amoled-bg rounded-xl flex items-center justify-center border border-amoled-border">
                    {previewCrosshair ? (
                      <CrosshairPreview crosshair={previewCrosshair} size={60} bg="#000000" />
                    ) : (
                      <span className="text-amoled-text-muted text-lg opacity-30">◎</span>
                    )}
                  </div>
                  <span className="text-[10px] text-amoled-text-muted">Превью</span>
                </div>
              </div>

              {error && (
                <p className="mt-3 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 px-6 pb-6">
              <Dialog.Close
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-amoled-border text-amoled-text-secondary hover:text-amoled-text hover:border-amoled-border-strong transition-colors text-sm"
              >
                Отмена
              </Dialog.Close>
              <button
                type="submit"
                disabled={!isValid || !name.trim() || loading}
                className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
