import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Crosshair as CrosshairIcon, FileCode2, X } from 'lucide-react'
import type { Crosshair, Game } from '../types'
import { detectGame } from '../lib/crosshair-parser'
import { CrosshairPreview } from './CrosshairPreview'
import { Button } from './ui/button'
import { FieldLabel, SectionLabel } from './ui/field-label'
import { Input } from './ui/input'

interface Props {
  open: boolean
  onClose: () => void
  crosshair?: Crosshair | null
  onSave: (name: string, code: string, game: Game) => Promise<void>
}

export function AddPanel({ open, onClose, crosshair, onSave }: Props) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const codeRef = useRef<HTMLInputElement>(null)
  const isEditing = Boolean(crosshair)
  const detectedGame = detectGame(code.trim())
  const isValidCode = code.trim().length > 0 && detectedGame !== null

  const previewCrosshair: Crosshair | null = isValidCode
    ? {
        id: 'preview',
        game: detectedGame,
        name: '',
        code: code.trim(),
        color_preview: '',
        created_at: ''
      }
    : null

  const reset = () => {
    setCode('')
    setName('')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (!open) return
    setCode(crosshair?.code ?? '')
    setName(crosshair?.name ?? '')
    setError('')
    const focusTimer = window.setTimeout(() => codeRef.current?.focus(), 150)
    return () => window.clearTimeout(focusTimer)
  }, [open, crosshair])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isValidCode) {
      setError('Введите корректный код прицела Valorant или CS2')
      return
    }
    if (!name.trim()) {
      setError('Введите название')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onSave(name.trim(), code.trim(), detectedGame)
      handleClose()
    } catch {
      setError('Не удалось сохранить прицел')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm" onClick={handleClose} />
      <aside className="fixed inset-y-0 right-0 z-[81] flex w-[min(680px,92vw)] flex-col border-l border-white/[0.07] bg-[#080808] shadow-[-32px_0_80px_rgba(0,0,0,0.65)] animate-slide-in-right">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white text-black">
              <CrosshairIcon size={18} strokeWidth={2.5} />
            </div>
            <h2 className="text-[15px] font-black tracking-tight text-white">
              {isEditing ? 'Изменить прицел' : 'Новый прицел'}
            </h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="size-9" aria-label="Закрыть">
            <X size={18} />
          </Button>
        </div>

        <form id="crosshair-form" onSubmit={handleSubmit} className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-7 p-6">
            <section>
              <SectionLabel icon={CrosshairIcon}>Превью</SectionLabel>
              <div className="flex min-h-40 items-center gap-6 rounded-2xl border border-white/[0.07] bg-black px-6 py-5">
                <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl border border-white/[0.055] bg-[#050505]">
                  {previewCrosshair ? (
                    <CrosshairPreview crosshair={previewCrosshair} size={92} />
                  ) : (
                    <CrosshairIcon size={30} strokeWidth={1.2} className="text-white/14" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-black text-white/85">
                    {previewCrosshair ? name || 'Без названия' : 'Введите код прицела'}
                  </p>
                  {previewCrosshair ? (
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-md border px-2 py-1 text-[8px] font-black uppercase tracking-[0.13em] ${
                        detectedGame === 'valorant'
                          ? 'border-[#FF4655]/25 bg-[#FF4655]/10 text-[#FF6571]'
                          : 'border-[#E8A530]/25 bg-[#E8A530]/10 text-[#F2B544]'
                      }`}>
                        {detectedGame === 'valorant' ? 'Valorant' : 'CS2'}
                      </span>
                      <span className="truncate font-mono text-[10px] text-white/25">
                        {code.length > 34 ? `${code.slice(0, 34)}…` : code}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] font-medium leading-relaxed text-white/24">
                      Превью появится после распознавания кода.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <SectionLabel icon={FileCode2}>Данные</SectionLabel>
              <div className="space-y-3">
                <label className="block">
                  <FieldLabel>Код прицела</FieldLabel>
                  <div className="relative">
                    <Input
                      ref={codeRef}
                      value={code}
                      onChange={(event) => { setCode(event.target.value); setError('') }}
                      placeholder="0;P;c;5;h;0;0l;4... или CSGO-xxxxx"
                      className="h-12 pr-20 font-mono text-xs"
                      spellCheck={false}
                      autoComplete="off"
                    />
                    {code.trim() ? (
                      <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[8px] font-black uppercase tracking-wider ${
                        isValidCode
                          ? detectedGame === 'valorant'
                            ? 'border-[#FF4655]/20 bg-[#FF4655]/10 text-[#FF6571]'
                            : 'border-[#E8A530]/20 bg-[#E8A530]/10 text-[#F2B544]'
                          : 'border-red-400/20 bg-red-400/10 text-red-400'
                      }`}>
                        {isValidCode ? detectedGame === 'valorant' ? 'VAL' : 'CS2' : 'Неверный'}
                      </span>
                    ) : null}
                  </div>
                </label>

                <label className="block">
                  <FieldLabel>Название</FieldLabel>
                  <Input
                    value={name}
                    onChange={(event) => { setName(event.target.value); setError('') }}
                    placeholder="TenZ, NiKo, мой прицел..."
                    className="h-12"
                    maxLength={80}
                  />
                </label>
              </div>
            </section>

            {previewCrosshair?.game === 'valorant' ? (
              <p className="rounded-xl border border-white/[0.055] bg-white/[0.02] px-4 py-3 text-[10px] font-medium leading-relaxed text-white/28">
                Превью показывает основной прицел. ADS и снайперские настройки отображаются в игре отдельно.
              </p>
            ) : null}
          </div>

          <div className="sticky bottom-0 flex items-center gap-3 border-t border-white/[0.06] bg-[#080808]/95 px-6 py-4 backdrop-blur-xl">
            <div className="min-w-0 flex-1 text-[11px] font-medium text-red-400/80">{error}</div>
            <Button type="button" variant="ghost" size="lg" onClick={handleClose}>Отмена</Button>
            <Button disabled={!isValidCode || !name.trim() || loading} type="submit" size="lg">
              {loading ? 'Сохраняем' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </aside>
    </>
  )
}
