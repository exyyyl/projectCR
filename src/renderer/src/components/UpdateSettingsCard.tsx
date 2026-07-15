import { Check, Download, RefreshCw, RotateCw } from 'lucide-react'
import type { AppUpdateState } from '../types'

interface UpdateSettingsCardProps {
  state: AppUpdateState
  currentVersion: string
  onDownload: () => void
  onInstall: () => void
}

export function UpdateSettingsCard({
  state,
  currentVersion,
  onDownload,
  onInstall
}: UpdateSettingsCardProps) {
  const isIdle = state.status === 'idle'
  const isDownloading = state.status === 'downloading'
  const isDownloaded = state.status === 'downloaded'
  const title = isIdle
    ? `Версия ${currentVersion}`
    : state.status === 'available'
      ? `Доступна версия ${state.version ?? ''}`
      : isDownloading
        ? `Загрузка ${state.progress}%`
        : isDownloaded
          ? 'Обновление готово'
          : 'Не удалось обновить'

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808]">
      <div className="flex h-16 items-center justify-between gap-5 px-5">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${
            isIdle
              ? 'border-white/[0.07] bg-white/[0.035] text-white/35'
              : 'border-[#FF4655]/25 bg-[#FF4655]/10 text-[#FF6571]'
          }`}>
            {isIdle ? <Check size={16} /> : isDownloaded ? <RotateCw size={16} /> : <Download size={16} />}
          </div>
          <p className="truncate text-[13px] font-bold text-white/80">{title}</p>
        </div>

        {isIdle && (
          <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/25">Актуально</span>
        )}

        {(state.status === 'available' || state.status === 'error') && (
          <button
            type="button"
            onClick={onDownload}
            className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 text-[9px] font-black uppercase tracking-widest text-black outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {state.status === 'error' ? <RefreshCw size={14} /> : <Download size={14} />}
            {state.status === 'error' ? 'Повторить' : 'Загрузить'}
          </button>
        )}

        {isDownloaded && (
          <button
            type="button"
            onClick={onInstall}
            className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 text-[9px] font-black uppercase tracking-widest text-black outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <RotateCw size={14} />
            Установить
          </button>
        )}
      </div>

      {isDownloading && (
        <div className="h-1 bg-white/[0.04]">
          <div
            className="h-full bg-[linear-gradient(90deg,#FF4655_0%,#E8A530_100%)] transition-[width] duration-200"
            style={{ width: `${Math.max(2, state.progress)}%` }}
          />
        </div>
      )}
    </section>
  )
}
