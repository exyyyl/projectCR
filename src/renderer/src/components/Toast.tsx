import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ToastData {
  id: number
  msg: string
  type: 'success' | 'error'
}

let counter = 0
const listeners: Array<(t: ToastData) => void> = []

export function toast(msg: string, type: 'success' | 'error' = 'success') {
  const t = { id: ++counter, msg, type }
  listeners.forEach(fn => fn(t))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    const handler = (t: ToastData) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 2800)
    }
    listeners.push(handler)
    return () => { const i = listeners.indexOf(handler); if (i > -1) listeners.splice(i, 1) }
  }, [])

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[220] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex w-max max-w-[min(420px,calc(100vw-32px))] items-center gap-2.5 rounded-2xl border px-4 py-3 text-[12px] font-semibold shadow-[0_18px_52px_rgba(0,0,0,0.72)] animate-toast-in ${
            t.type === 'error'
              ? 'border-red-400/20 bg-[#170B0D] text-red-100'
              : 'border-white/[0.09] bg-[#111212] text-white/88'
          }`}
        >
          {t.type === 'error'
            ? <AlertCircle size={15} className="shrink-0 text-red-400" />
            : <CheckCircle2 size={15} className="shrink-0 text-emerald-300/75" />}
          {t.msg}
        </div>
      ))}
    </div>
  )
}
