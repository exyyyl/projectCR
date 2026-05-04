import React, { useEffect } from 'react'
import { Crosshair } from '../types'
import { AlertTriangle, X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  crosshair: Crosshair
}

export function DeleteConfirmModal({ open, onClose, onConfirm, crosshair }: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, onConfirm])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-[#0A0A0A] border border-white/[0.05] rounded-3xl z-[101] shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden animate-slide-up origin-center">
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>

          <h3 className="text-lg font-black text-white tracking-tight mb-2">Удалить прицел?</h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Вы уверены, что хотите удалить <span className="text-white/70 font-bold">"{crosshair.name}"</span>? Это действие нельзя будет отменить.
          </p>
        </div>

        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-all text-[13px] font-bold"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all text-[13px] font-black shadow-[0_10px_20px_rgba(239,68,68,0.2)]"
          >
            Удалить
          </button>
        </div>
      </div>
    </>
  )
}
