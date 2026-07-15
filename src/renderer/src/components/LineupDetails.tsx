import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Image,
  MapPin,
  Maximize2,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  X
} from 'lucide-react'
import type { Lineup } from '../types'
import { lineupKindLabel, lineupSideLabel } from '../config/lineups'
import { Button } from './ui/button'

interface LineupDetailsProps {
  lineup: Lineup | null
  onClose: () => void
  onEdit: (lineup: Lineup) => void
}

interface LineupImage {
  url: string
  label: string
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

function LineupImageViewer({
  images,
  selectedIndex,
  onSelect,
  onClose
}: {
  images: LineupImage[]
  selectedIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{
    pointerId: number
    clientX: number
    clientY: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const hasMultipleImages = images.length > 1
  const activeImage = images[selectedIndex]

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
    setDragging(false)
  }

  const changeZoom = (nextZoom: number) => {
    const normalizedZoom = clampZoom(nextZoom)
    setZoom(normalizedZoom)
    if (normalizedZoom === 1) setOffset({ x: 0, y: 0 })
  }

  const showPrevious = () => {
    onSelect((selectedIndex - 1 + images.length) % images.length)
  }

  const showNext = () => {
    onSelect((selectedIndex + 1) % images.length)
  }

  useEffect(() => { resetView() }, [selectedIndex])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && hasMultipleImages) {
        event.preventDefault()
        showPrevious()
      }
      if (event.key === 'ArrowRight' && hasMultipleImages) {
        event.preventDefault()
        showNext()
      }
      if ((event.key === '+' || event.key === '=') && zoom < MAX_ZOOM) {
        event.preventDefault()
        changeZoom(zoom + ZOOM_STEP)
      }
      if (event.key === '-' && zoom > MIN_ZOOM) {
        event.preventDefault()
        changeZoom(zoom - ZOOM_STEP)
      }
      if (event.key === '0') resetView()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [hasMultipleImages, images.length, onClose, selectedIndex, zoom])

  if (!activeImage) return null

  return (
    <div role="dialog" aria-modal="true" aria-label="Просмотр изображения" className="fixed inset-0 z-[160] flex flex-col overflow-hidden bg-[#020202]/95 backdrop-blur-xl animate-fade-in">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-5 pb-12">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-white/76">{activeImage.label}</p>
          <p className="mt-1 font-mono text-[9px] font-semibold text-white/28">
            {selectedIndex + 1} / {images.length}
          </p>
        </div>
        <Button type="button" variant="secondary" size="icon" onClick={onClose} className="pointer-events-auto rounded-full bg-black/55 backdrop-blur-md" aria-label="Закрыть полноэкранный просмотр">
          <X size={18} />
        </Button>
      </div>

      <div
        className={`relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
        onWheel={(event) => {
          event.preventDefault()
          changeZoom(zoom + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP))
        }}
        onDoubleClick={() => changeZoom(zoom === 1 ? 2 : 1)}
        onPointerDown={(event) => {
          if (zoom === 1) return
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
          dragStart.current = {
            pointerId: event.pointerId,
            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: offset.x,
            offsetY: offset.y
          }
        }}
        onPointerMove={(event) => {
          const start = dragStart.current
          if (!start || start.pointerId !== event.pointerId) return
          setOffset({
            x: start.offsetX + event.clientX - start.clientX,
            y: start.offsetY + event.clientY - start.clientY
          })
        }}
        onPointerUp={(event) => {
          if (dragStart.current?.pointerId === event.pointerId) {
            dragStart.current = null
            setDragging(false)
          }
        }}
        onPointerCancel={() => {
          dragStart.current = null
          setDragging(false)
        }}
      >
        <img
          src={activeImage.url}
          alt={activeImage.label}
          draggable={false}
          className={`max-h-full max-w-full select-none object-contain will-change-transform ${dragging ? '' : 'transition-transform duration-150 ease-out'}`}
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}
        />
      </div>

      {hasMultipleImages ? (
        <>
          <Button type="button" variant="secondary" size="icon" onClick={showPrevious} className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 backdrop-blur-md" aria-label="Предыдущее изображение">
            <ChevronLeft size={20} />
          </Button>
          <Button type="button" variant="secondary" size="icon" onClick={showNext} className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 backdrop-blur-md" aria-label="Следующее изображение">
            <ChevronRight size={20} />
          </Button>
        </>
      ) : null}

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/[0.09] bg-[#0B0B0B]/90 p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => changeZoom(zoom - ZOOM_STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Уменьшить">
          <Minus size={15} />
        </Button>
        <span className="w-14 text-center font-mono text-[9px] font-semibold text-white/55">{Math.round(zoom * 100)}%</span>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => changeZoom(zoom + ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Увеличить">
          <Plus size={15} />
        </Button>
        <div className="mx-1 h-5 w-px bg-white/[0.08]" />
        <Button type="button" variant="ghost" size="icon-sm" onClick={resetView} disabled={zoom === 1 && offset.x === 0 && offset.y === 0} aria-label="Сбросить масштаб">
          <RotateCcw size={14} />
        </Button>
      </div>
    </div>
  )
}

export function LineupDetails({ lineup, onClose, onEdit }: LineupDetailsProps) {
  const images = useMemo(() => lineup ? [
    { url: lineup.start_image, label: 'Позиция' },
    { url: lineup.aim_image, label: 'Наводка' },
    { url: lineup.result_image, label: 'Результат' },
    ...(lineup.extra_images ?? []).map((url, index) => ({ url, label: `Фото ${index + 4}` }))
  ].filter((item) => item.url) : [], [lineup])
  const [selectedImage, setSelectedImage] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const hasMultipleImages = images.length > 1

  const showPreviousImage = () => {
    if (!images.length) return
    setSelectedImage((current) => (current - 1 + images.length) % images.length)
  }

  const showNextImage = () => {
    if (!images.length) return
    setSelectedImage((current) => (current + 1) % images.length)
  }

  useEffect(() => {
    setSelectedImage(0)
    setViewerOpen(false)
  }, [lineup?.id])
  useEffect(() => {
    if (!lineup || viewerOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && hasMultipleImages) {
        event.preventDefault()
        showPreviousImage()
      }
      if (event.key === 'ArrowRight' && hasMultipleImages) {
        event.preventDefault()
        showNextImage()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lineup, onClose, hasMultipleImages, images.length, viewerOpen])

  if (!lineup) return null
  const isValorant = lineup.game === 'valorant'

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="fixed inset-6 z-[91] flex min-h-0 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080808] shadow-[0_32px_100px_rgba(0,0,0,0.8)] animate-fade-in">
        <Button type="button" variant="secondary" size="icon" onClick={onClose} className="absolute right-4 top-4 z-10 bg-black/60 text-white/45 backdrop-blur-md" aria-label="Закрыть">
          <X size={18} />
        </Button>

        <div className="flex min-w-0 flex-1 flex-col border-r border-white/[0.06]">
          <div className="relative min-h-0 flex-1 bg-black">
            {images.length ? (
              <>
                <img src={images[selectedImage]?.url} alt={images[selectedImage]?.label} className="h-full w-full object-contain" />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => setViewerOpen(true)}
                  className="absolute right-4 top-4 rounded-full bg-black/65 text-white/65 backdrop-blur-md hover:bg-black/80"
                  aria-label="Открыть изображение на весь экран"
                >
                  <Maximize2 size={17} />
                </Button>
                {hasMultipleImages ? (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={showPreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/65 text-white/65 backdrop-blur-md hover:bg-black/80"
                      aria-label="Предыдущее изображение"
                    >
                      <ChevronLeft size={19} />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={showNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/65 text-white/65 backdrop-blur-md hover:bg-black/80"
                      aria-label="Следующее изображение"
                    >
                      <ChevronRight size={19} />
                    </Button>
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/65 px-3 py-1.5 font-mono text-[9px] font-bold text-white/55 backdrop-blur-md">
                      {selectedImage + 1} / {images.length}
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-white/16">
                <Image size={32} strokeWidth={1.3} />
                <span className="text-[9px] font-black uppercase tracking-[0.18em]">Кадры не добавлены</span>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="custom-scrollbar flex h-24 shrink-0 items-center gap-3 overflow-x-auto border-t border-white/[0.06] bg-[#060606] px-5">
              {images.map((image, index) => (
                <button key={`${image.label}-${image.url}`} type="button" onClick={() => setSelectedImage(index)} className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border transition-all ${selectedImage === index ? 'border-white/55' : 'border-white/[0.07] opacity-55 hover:opacity-90'}`}>
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent px-2 pb-1.5 pt-4 text-left text-[8px] font-black uppercase tracking-wider text-white">{image.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="custom-scrollbar flex w-[360px] min-w-0 shrink-0 flex-col overflow-x-hidden overflow-y-auto p-7 pt-16">
          <div className="mb-6 flex items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] ${isValorant ? 'border-[#FF4655]/25 bg-[#FF4655]/10 text-[#FF6571]' : 'border-[#E8A530]/25 bg-[#E8A530]/10 text-[#F2B544]'}`}>
              {isValorant ? 'Valorant' : 'CS2'}
            </span>
            <span className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/55">{lineupKindLabel(lineup.kind)}</span>
          </div>

          <h2 className="break-words text-2xl font-black leading-tight tracking-tight text-white">{lineup.name}</h2>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/32">
            <MapPin size={13} /> {lineup.map} <span className="text-white/12">/</span> {lineupSideLabel(lineup.side)}
          </div>

          <div className="mt-7">
            <span className="mb-3 block text-[8px] font-black uppercase tracking-[0.18em] text-white/22">Как выполнить</span>
            {lineup.instructions ? (
              <p className="whitespace-pre-wrap text-[13px] font-medium leading-6 text-white/58">{lineup.instructions}</p>
            ) : (
              <p className="text-[12px] font-medium text-white/22">Инструкция не добавлена</p>
            )}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => onEdit(lineup)}
            className="mt-8 w-full"
          >
            <Pencil size={14} /> Изменить
          </Button>
        </aside>
      </div>
      {viewerOpen && images.length ? (
        <LineupImageViewer
          images={images}
          selectedIndex={selectedImage}
          onSelect={setSelectedImage}
          onClose={() => setViewerOpen(false)}
        />
      ) : null}
    </>
  )
}
