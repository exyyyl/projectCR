import React from 'react'
import { Info, Copy, Check, Trash2 } from 'lucide-react'
import { SavedSensProfile } from '../../config/sensConfig'

interface SavedProfilesListProps {
  savedProfiles: SavedSensProfile[]
  copiedId: string | null
  handleCopyText: (text: string, id: string) => void
  handleDeleteProfile: (id: string) => void
}

export function SavedProfilesList({
  savedProfiles,
  copiedId,
  handleCopyText,
  handleDeleteProfile
}: SavedProfilesListProps) {
  return (
    <div className="flex flex-col mt-4">
      <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
        СОХРАНЕННЫЕ ИДЕАЛЬНЫЕ ПРОФИЛИ ({savedProfiles.length})
      </div>

      {savedProfiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[2rem] p-8 text-center text-white/25">
          <Info size={28} strokeWidth={1.5} className="mb-3 text-white/10" />
          <p className="text-xs font-bold uppercase tracking-wider">История пуста</p>
          <p className="text-[10px] text-white/20 max-w-[240px] mt-1 font-medium leading-relaxed">
            Пройдите PSA тест до конца и сохраните результат, чтобы зафиксировать ваш профиль.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {savedProfiles.map((p) => (
            <div 
              key={p.id}
              className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.06] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group"
            >
              <div className="flex flex-col gap-0.5">
                <div className="text-xs font-black text-white uppercase tracking-wider">{p.name}</div>
                <div className="text-[9px] text-white/30 font-medium">Создан: {p.date} • Игра: {p.game}</div>
              </div>

              <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1.5 rounded-lg">
                  <span className="text-[10px] font-bold text-white/40">Сенс:</span>
                  <span className="font-bold text-white">{p.sens}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-[10px] font-bold text-white/40">DPI:</span>
                  <span className="font-bold text-white">{p.dpi}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1.5 rounded-lg">
                  <span className="text-[10px] font-bold text-white/40">eDPI:</span>
                  <span className="font-bold text-white">{p.edpi}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-[10px] font-bold text-white/40">360°:</span>
                  <span className="font-bold text-white">{p.cm360} см</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleCopyText(p.sens.toString(), p.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  title="Скопировать значение"
                >
                  {copiedId === p.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
                <button
                  onClick={() => handleDeleteProfile(p.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/5 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  title="Удалить"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
