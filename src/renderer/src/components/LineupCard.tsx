import { ArrowUpRight, Image, Pencil, Trash2 } from 'lucide-react'
import type { Lineup } from '../types'
import { lineupKindLabel } from '../config/lineups'

interface LineupCardProps {
  lineup: Lineup
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

export function LineupCard({ lineup, onOpen, onEdit, onDelete }: LineupCardProps) {
  const cover = lineup.result_image || lineup.aim_image || lineup.start_image || lineup.extra_images?.[0]
  const isValorant = lineup.game === 'valorant'

  return (
    <article className="group isolate overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A0A0A] [backface-visibility:hidden] transition-[border-color,box-shadow] duration-200 hover:border-white/[0.14] hover:shadow-[0_18px_45px_rgba(0,0,0,0.4)]">
      <button type="button" onClick={onOpen} className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40">
        <div className="relative h-40 overflow-hidden rounded-t-[15px] bg-[#0D0D0D] [backface-visibility:hidden]">
          {cover ? (
            <img src={cover} alt="" loading="lazy" className="h-full w-full transform-gpu object-cover [backface-visibility:hidden] transition-transform duration-500 group-hover:scale-[1.035]" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.055),transparent_48%)] text-white/15">
              <Image size={24} strokeWidth={1.4} />
              <span className="text-[8px] font-black uppercase tracking-[0.18em]">Без кадров</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/25" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className={`rounded-md border px-2 py-1 text-[8px] font-black uppercase tracking-[0.13em] backdrop-blur-md ${
              isValorant
                ? 'border-[#FF4655]/25 bg-[#2A0B0E]/85 text-[#FF6571]'
                : 'border-[#E8A530]/25 bg-[#271B07]/85 text-[#F2B544]'
            }`}>
              {isValorant ? 'VAL' : 'CS2'}
            </span>
            <span className="rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[8px] font-black uppercase tracking-[0.13em] text-white/65 backdrop-blur-md">
              {lineupKindLabel(lineup.kind)}
            </span>
          </div>
          <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-white/55 backdrop-blur-md transition-colors group-hover:text-white">
            <ArrowUpRight size={14} />
          </span>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-[14px] font-bold text-white">{lineup.name}</h3>
            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-white/28">{lineup.map}</span>
          </div>
        </div>
      </button>

      <div className="flex h-10 items-center border-t border-white/[0.055] bg-black/20">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-full min-w-0 flex-1 items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.13em] text-white/32 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Pencil size={13} /> Изменить
        </button>
        <div className="h-full w-px bg-white/[0.055]" />
        <button
          type="button"
          onClick={onDelete}
          className="flex h-full w-11 items-center justify-center text-white/22 transition-colors hover:bg-red-400/10 hover:text-red-400"
          aria-label={`Удалить лайнап ${lineup.name}`}
          title="Удалить"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  )
}
