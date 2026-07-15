import { ArrowRight, Download, X } from 'lucide-react'
import type { AppUpdateState } from '../types'

interface UpdateBannerProps {
  state: AppUpdateState
  onOpenSettings: () => void
  onDismiss: () => void
}

export function UpdateBanner({ state, onOpenSettings, onDismiss }: UpdateBannerProps) {
  if (state.status === 'idle') return null

  return (
    <div className="mx-6 mt-4 flex shrink-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0A0A] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] animate-fade-in">
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70">
        <Download size={16} />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[#0A0A0A] bg-[#FF4655]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-white/90">
          Доступно обновление {state.version ? `до ${state.version}` : ''}
        </p>
        <p className="mt-0.5 truncate text-[10px] font-medium text-white/35">
          Загрузить и установить его можно в общих настройках.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-[9px] font-black uppercase tracking-widest text-white/70 outline-none transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
      >
        Настройки
        <ArrowRight size={13} />
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Скрыть уведомление об обновлении"
        className="flex size-9 items-center justify-center rounded-xl text-white/25 outline-none transition-colors hover:bg-white/[0.05] hover:text-white/60 focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <X size={14} />
      </button>
    </div>
  )
}
