import { Check, Download, RefreshCw, RotateCw } from 'lucide-react'
import type { AppUpdateState } from '../types'
import { Button } from './ui/button'
import { Card } from './ui/card'

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
    <Card>
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
          <Button
            type="button"
            size="sm"
            onClick={onDownload}
          >
            {state.status === 'error' ? <RefreshCw size={14} /> : <Download size={14} />}
            {state.status === 'error' ? 'Повторить' : 'Загрузить'}
          </Button>
        )}

        {isDownloaded && (
          <Button
            type="button"
            size="sm"
            onClick={onInstall}
          >
            <RotateCw size={14} />
            Установить
          </Button>
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
    </Card>
  )
}
