import React, { useEffect, useState } from 'react'

export function UpdateNotification() {
  const [updateInfo, setUpdateInfo] = useState<any>(null)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    // Listen for update available
    const unbindAvailable = window.api.window.onUpdateAvailable((info: any) => {
      setUpdateInfo(info)
    })

    // Listen for update downloaded
    const unbindDownloaded = window.api.window.onUpdateDownloaded(() => {
      setDownloaded(true)
    })

    return () => {
      unbindAvailable()
      unbindDownloaded()
    }
  }, [])

  if (!updateInfo) return null

  return (
    <div className="fixed bottom-6 right-6 z-[101] w-80 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-in-right">
      <div className="p-4 flex flex-col gap-3 relative">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-white tracking-tight">Новая версия!</h4>
            <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Обновление {updateInfo.version}</p>
          </div>
        </div>

        {/* Content */}
        {downloaded ? (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] text-white/70 leading-relaxed">
              Обновление успешно загружено. Перезапустите приложение, чтобы применить изменения.
            </p>
            <button
              onClick={() => window.api.window.installUpdate()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Установить и перезапустить
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] text-white/60">Загрузка компонентов обновления...</p>
            <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-blue-500 w-1/3 rounded-full animate-shimmer" style={{ width: '40%' }} />
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={() => setUpdateInfo(null)}
          className="absolute top-3 right-3 p-1.5 text-white/20 hover:text-white/60 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
