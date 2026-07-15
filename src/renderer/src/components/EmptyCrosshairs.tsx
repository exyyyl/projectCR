import { Crosshair as CrosshairIcon, Plus } from 'lucide-react'

interface EmptyCrosshairsProps {
  search: string
  onClearSearch: () => void
  onAdd: () => void
}

export function EmptyCrosshairs({ search, onClearSearch, onAdd }: EmptyCrosshairsProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 px-6 pb-6 pt-5 opacity-[0.02] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] rounded-[2rem] border border-white/20 bg-white" />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
        <div className="mb-8 flex size-24 rotate-3 items-center justify-center rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-2xl transition-transform duration-700 hover:rotate-0">
          <CrosshairIcon size={40} strokeWidth={1} className="text-white/10" />
        </div>

        {search ? (
          <>
            <h3 className="mb-3 text-2xl font-black tracking-tight text-white">Ничего не нашли</h3>
            <p className="mb-8 text-sm leading-relaxed text-white/40">
              По запросу «<span className="text-white/60">{search}</span>» прицелов нет. Попробуйте другое слово.
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white outline-none transition-all hover:border-white/10 hover:bg-white/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Сбросить поиск
            </button>
          </>
        ) : (
          <>
            <h3 className="mb-3 text-2xl font-black tracking-tight text-white">Коллекция пуста</h3>
            <p className="mb-10 text-sm leading-relaxed text-white/40">
              Добавьте первый прицел, чтобы сохранить код и увидеть его точное превью.
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] outline-none transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Plus size={16} strokeWidth={4} />
              Добавить
            </button>
          </>
        )}
      </div>
    </div>
  )
}
