import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Camera, Check, ImagePlus, MapPinned, Plus, Sparkles, Trash2, X
} from 'lucide-react'
import {
  getLineupMaps,
  getLineupKindOptions,
  LINEUP_SIDES,
  loadCustomLineupMaps,
  loadCustomLineupKinds,
  lineupKindLabel
} from '../config/lineups'
import type { Game, Lineup, LineupKind, LineupSide } from '../types'
import type { NewLineup } from '../store/useLineups'
import { LineupSelect } from './ui/LineupSelect'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { FieldLabel, SectionLabel } from './ui/field-label'

interface AddLineupPanelProps {
  open: boolean
  onClose: () => void
  lineup?: Lineup | null
  onSave: (lineup: NewLineup) => Promise<Lineup>
}

type ImageKey = 'start_image' | 'aim_image' | 'result_image'

const EMPTY_IMAGES: Record<ImageKey, string> = {
  start_image: '',
  aim_image: '',
  result_image: ''
}

const IMAGE_SLOTS: Array<{ key: ImageKey; label: string; hint: string }> = [
  { key: 'start_image', label: 'Позиция', hint: 'Где стоять' },
  { key: 'aim_image', label: 'Наводка', hint: 'Куда целиться' },
  { key: 'result_image', label: 'Результат', hint: 'Куда прилетает' }
]

const MAX_LINEUP_IMAGES = 10

function pickBrowserImage(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/webp'

    input.addEventListener('cancel', () => resolve(null), { once: true })
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)

      const reader = new FileReader()
      reader.onerror = () => resolve(null)
      reader.onload = () => {
        const image = new Image()
        image.onerror = () => resolve(null)
        image.onload = () => {
          const maxSide = 1280
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.width * scale))
          canvas.height = Math.max(1, Math.round(image.height * scale))
          const context = canvas.getContext('2d')
          if (!context) return resolve(null)
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/webp', 0.82))
        }
        image.src = String(reader.result)
      }
      reader.readAsDataURL(file)
    }, { once: true })

    input.click()
  })
}

export function AddLineupPanel({ open, onClose, lineup, onSave }: AddLineupPanelProps) {
  const [game, setGame] = useState<Game>('valorant')
  const [map, setMap] = useState('')
  const [name, setName] = useState('')
  const [kind, setKind] = useState<LineupKind>('smoke')
  const [side, setSide] = useState<LineupSide>('both')
  const [instructions, setInstructions] = useState('')
  const [images, setImages] = useState(EMPTY_IMAGES)
  const [extraImages, setExtraImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [customMaps, setCustomMaps] = useState(loadCustomLineupMaps)
  const [customKinds, setCustomKinds] = useState(loadCustomLineupKinds)
  const pendingNewImages = useRef(new Set<string>())
  const isEditing = Boolean(lineup)
  const availableMaps = useMemo(() => {
    const maps = getLineupMaps(game, customMaps)
    return map && !maps.includes(map) ? [...maps, map] : maps
  }, [game, customMaps, map])
  const mapOptions = useMemo(
    () => availableMaps.map((mapName) => ({ value: mapName, label: mapName })),
    [availableMaps]
  )
  const imageCount = Object.values(images).filter(Boolean).length + extraImages.length
  const availableKinds = useMemo(() => {
    const options = getLineupKindOptions(customKinds)
    return options.some((option) => option.value === kind)
      ? options
      : [...options, { value: kind, label: lineupKindLabel(kind) }]
  }, [customKinds, kind])

  useEffect(() => {
    if (!open) return
    const nextGame = lineup?.game ?? 'valorant'
    const nextCustomMaps = loadCustomLineupMaps()
    setGame(nextGame)
    setMap(lineup?.map ?? getLineupMaps(nextGame, nextCustomMaps)[0] ?? '')
    setName(lineup?.name ?? '')
    setKind(lineup?.kind ?? 'smoke')
    setSide(lineup?.side ?? 'both')
    setInstructions(lineup?.instructions ?? '')
    setImages(lineup ? {
      start_image: lineup.start_image,
      aim_image: lineup.aim_image,
      result_image: lineup.result_image
    } : EMPTY_IMAGES)
    setExtraImages(lineup?.extra_images ?? [])
    pendingNewImages.current.clear()
    setCustomMaps(nextCustomMaps)
    setCustomKinds(loadCustomLineupKinds())
    setError('')
  }, [open, lineup])

  const reset = () => {
    setGame('valorant')
    setMap('')
    setName('')
    setKind('smoke')
    setSide('both')
    setInstructions('')
    setImages(EMPTY_IMAGES)
    setExtraImages([])
    pendingNewImages.current.clear()
    setError('')
  }

  const closeAndCleanup = async () => {
    if (saving) return
    const pendingImages = Array.from(pendingNewImages.current)
    if (pendingImages.length && window.api?.lineups) {
      await window.api.lineups.discardImages(pendingImages)
    }
    reset()
    onClose()
  }

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') void closeAndCleanup()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const pickImage = async (key: ImageKey) => {
    if (!images[key] && imageCount >= MAX_LINEUP_IMAGES) return
    const selected = window.api?.lineups
      ? await window.api.lineups.pickImage()
      : await pickBrowserImage()
    if (!selected) return

    const previous = images[key]
    if (previous && pendingNewImages.current.has(previous)) {
      if (window.api?.lineups) await window.api.lineups.discardImages([previous])
      pendingNewImages.current.delete(previous)
    }
    pendingNewImages.current.add(selected)
    setImages((current) => ({ ...current, [key]: selected }))
  }

  const removeImage = async (key: ImageKey) => {
    const selected = images[key]
    if (selected && pendingNewImages.current.has(selected)) {
      if (window.api?.lineups) await window.api.lineups.discardImages([selected])
      pendingNewImages.current.delete(selected)
    }
    setImages((current) => ({ ...current, [key]: '' }))
  }

  const addExtraImage = async () => {
    if (imageCount >= MAX_LINEUP_IMAGES) return
    const selected = window.api?.lineups
      ? await window.api.lineups.pickImage()
      : await pickBrowserImage()
    if (!selected) return

    pendingNewImages.current.add(selected)
    setExtraImages((current) => [...current, selected])
  }

  const removeExtraImage = async (url: string) => {
    if (pendingNewImages.current.has(url)) {
      if (window.api?.lineups) await window.api.lineups.discardImages([url])
      pendingNewImages.current.delete(url)
    }
    setExtraImages((current) => current.filter((image) => image !== url))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !map.trim()) {
      setError('Заполните название и карту')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSave({
        game,
        map: map.trim(),
        name: name.trim(),
        kind,
        side,
        start_position: '',
        target_position: '',
        instructions: instructions.trim(),
        ...images,
        extra_images: extraImages
      })
      pendingNewImages.current.clear()
      reset()
      onClose()
    } catch {
      setError('Не удалось сохранить лайнап')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm" onClick={() => void closeAndCleanup()} />
      <aside className="fixed inset-y-0 right-0 z-[81] flex w-[min(680px,92vw)] flex-col border-l border-white/[0.07] bg-[#080808] shadow-[-32px_0_80px_rgba(0,0,0,0.65)] animate-slide-in-right">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white text-black">
              <MapPinned size={18} strokeWidth={2.5} />
            </div>
            <h2 className="text-[15px] font-black tracking-tight text-white">{isEditing ? 'Изменить лайнап' : 'Новый лайнап'}</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => void closeAndCleanup()}
            className="size-9"
            aria-label="Закрыть"
          >
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-7 p-6">
            <section>
              <SectionLabel icon={Sparkles}>Контекст</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Игра</FieldLabel>
                  <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-black p-1">
                    {(['valorant', 'cs2'] as const).map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={game === value ? value : 'ghost'}
                        size="sm"
                        onClick={() => {
                          setGame(value)
                          setMap(getLineupMaps(value, customMaps)[0] ?? '')
                        }}
                        className="w-full"
                      >
                        {value === 'valorant' ? 'Valorant' : 'CS2'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Карта</FieldLabel>
                  <LineupSelect
                    value={map}
                    options={mapOptions}
                    onChange={setMap}
                    ariaLabel="Карта"
                  />
                </div>
              </div>

              <label className="mt-3 block">
                <FieldLabel>Название</FieldLabel>
                <Input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Например: дым на Heaven"
                  maxLength={80}
                  className="h-12 px-4 text-[13px]"
                />
              </label>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Тип</FieldLabel>
                  <LineupSelect
                    value={kind}
                    options={availableKinds}
                    onChange={setKind}
                    ariaLabel="Тип лайнапа"
                  />
                </div>
                <div>
                  <FieldLabel>Сторона</FieldLabel>
                  <LineupSelect
                    value={side}
                    options={LINEUP_SIDES}
                    onChange={setSide}
                    ariaLabel="Сторона"
                  />
                </div>
              </div>
            </section>

            <section>
              <SectionLabel icon={Camera}>
                Кадры
                <span className="ml-auto rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 font-mono text-[8px] tracking-normal text-white/28">
                  {imageCount} / {MAX_LINEUP_IMAGES}
                </span>
              </SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {IMAGE_SLOTS.map((slot) => (
                  <div key={slot.key} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-white/[0.1] bg-black">
                    {images[slot.key] ? (
                      <>
                        <img src={images[slot.key]} alt={slot.label} className="h-full w-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/80 to-transparent px-2.5 pb-2 pt-7">
                          <span className="text-[9px] font-black uppercase tracking-wider text-white">{slot.label}</span>
                          <button type="button" onClick={() => void removeImage(slot.key)} className="flex size-7 items-center justify-center rounded-lg bg-black/70 text-white/55 hover:text-red-400" aria-label={`Удалить кадр ${slot.label}`}><Trash2 size={13} /></button>
                        </div>
                      </>
                    ) : (
                      <button type="button" disabled={imageCount >= MAX_LINEUP_IMAGES} onClick={() => void pickImage(slot.key)} className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-white/25 transition-colors hover:bg-white/[0.025] hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-30">
                        <ImagePlus size={19} />
                        <span className="text-[9px] font-black uppercase tracking-wider">{slot.label}</span>
                        <span className="text-[9px] text-white/20">{slot.hint}</span>
                      </button>
                    )}
                  </div>
                ))}

                {extraImages.map((url, index) => (
                  <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-black">
                    <img src={url} alt={`Дополнительный кадр ${index + 1}`} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/80 to-transparent px-2.5 pb-2 pt-7">
                      <span className="text-[9px] font-black uppercase tracking-wider text-white">Фото {index + 4}</span>
                      <button type="button" onClick={() => void removeExtraImage(url)} className="flex size-7 items-center justify-center rounded-lg bg-black/70 text-white/55 hover:text-red-400" aria-label={`Удалить фото ${index + 4}`}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}

                {imageCount < MAX_LINEUP_IMAGES ? (
                  <button
                    type="button"
                    onClick={() => void addExtraImage()}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.012] text-white/25 outline-none transition-colors hover:border-white/[0.18] hover:bg-white/[0.03] hover:text-white/65 focus-visible:ring-2 focus-visible:ring-white/35"
                  >
                    <Plus size={19} />
                    <span className="text-[9px] font-black uppercase tracking-wider">Ещё фото</span>
                  </button>
                ) : null}
              </div>
            </section>

            <label className="block">
              <FieldLabel>Как выполнить</FieldLabel>
              <textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                placeholder="Опишите положение, ориентир и способ броска..."
                rows={4}
                maxLength={1200}
                className="w-full resize-none rounded-xl border border-white/[0.07] bg-black px-4 py-3 text-[12px] font-medium leading-relaxed text-white outline-none placeholder:text-white/18 focus:border-white/20"
              />
            </label>
          </div>

          <div className="sticky bottom-0 flex items-center gap-3 border-t border-white/[0.06] bg-[#080808]/95 px-6 py-4 backdrop-blur-xl">
            <div className="min-w-0 flex-1 text-[11px] font-medium text-red-400/80">{error}</div>
            <Button type="button" variant="ghost" size="lg" onClick={() => void closeAndCleanup()}>Отмена</Button>
            <Button disabled={saving} type="submit" size="lg">
              <Check size={15} strokeWidth={3} /> {saving ? 'Сохраняем' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </aside>
    </>
  )
}
