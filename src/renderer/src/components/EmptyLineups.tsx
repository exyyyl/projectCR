import { MapPinned, Plus, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'

interface EmptyLineupsProps {
  hasFilters: boolean
  search: string
  onReset: () => void
  onAdd: () => void
}

export function EmptyLineups({ hasFilters, search, onReset, onAdd }: EmptyLineupsProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 px-6 pb-6 pt-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-white/[0.065] bg-white/[0.022] shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
            <div className="relative aspect-[16/9] border-b border-white/[0.05] bg-[radial-gradient(circle_at_55%_48%,rgba(255,255,255,0.055),rgba(255,255,255,0.012)_48%,transparent_72%)]">
              <span className="absolute left-[31%] top-1/2 size-2 -translate-y-1/2 rounded-sm bg-white/[0.07]" />
              <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white/[0.11]" />
              <span className="absolute right-[31%] top-1/2 size-2 -translate-y-1/2 rounded-sm bg-white/[0.07]" />
            </div>
            <div className="space-y-2 p-4">
              <div className="h-2 w-2/3 rounded-full bg-white/[0.075]" />
              <div className="h-1.5 w-5/6 rounded-full bg-white/[0.045]" />
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.84)_24%,rgba(0,0,0,0.18)_68%,rgba(0,0,0,0.05)_100%)]" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
        <div className="relative mb-8 flex size-24 -rotate-3 items-center justify-center rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-2xl transition-transform duration-700 hover:rotate-0">
          <MapPinned size={38} strokeWidth={1} className="text-white/11" />
          <span className="absolute bottom-5 left-5 size-1.5 rounded-full bg-[#FF4655]/45 shadow-[0_0_9px_rgba(255,70,85,0.3)]" />
          <span className="absolute right-5 top-5 size-1.5 rounded-full bg-[#E8A530]/45 shadow-[0_0_9px_rgba(232,165,48,0.3)]" />
        </div>

        {hasFilters ? (
          <>
            <h3 className="mb-3 text-2xl font-black tracking-tight text-white">Лайнапы не найдены</h3>
            <p className="mb-8 text-sm leading-relaxed text-white/40">
              {search.trim()
                ? <>По запросу «<span className="text-white/60">{search.trim()}</span>» ничего нет. Попробуйте изменить поиск или фильтры.</>
                : 'Для выбранных фильтров пока нет лайнапов. Попробуйте другой набор параметров.'}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onReset}
              className="h-12 w-full rounded-2xl tracking-[0.18em]"
            >
              <RotateCcw size={15} strokeWidth={2.5} />
              Сбросить фильтры
            </Button>
          </>
        ) : (
          <>
            <h3 className="mb-3 text-2xl font-black tracking-tight text-white">Коллекция лайнапов пуста</h3>
            <p className="mb-10 text-sm leading-relaxed text-white/40">
              Сохраните позицию, точку наводки и результат, чтобы повторить бросок в нужный момент.
            </p>
            <Button
              type="button"
              size="lg"
              onClick={onAdd}
              className="h-12 w-full rounded-2xl tracking-[0.18em] shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <Plus size={16} strokeWidth={4} />
              Создать лайнап
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
