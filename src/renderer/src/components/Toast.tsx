import React, { useEffect, useState } from 'react'

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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[100] pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl animate-slide-up border ${
            t.type === 'error'
              ? 'bg-red-950 border-red-800/60 text-red-200'
              : 'bg-amoled-elevated border-amoled-border-strong text-amoled-text'
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
