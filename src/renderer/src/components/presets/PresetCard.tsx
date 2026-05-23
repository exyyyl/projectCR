import React from 'react'
import { Sparkles, Copy, Check, Plus, Trash2, Sliders, Hash, Monitor, MousePointer, Tv } from 'lucide-react'
import { CrosshairPreview } from '../CrosshairPreview'
import { Game, UserPreset } from '../../types'

interface PresetCardProps {
  preset: UserPreset
  isAdded: boolean
  isAdding: boolean
  copiedId: string | null
  handleDeleteUserPreset: (id: string) => void
  handleCopyCode: (code: string, id: string) => void
  handleAddToVault: (id: string, name: string, code: string, game: Game, desc?: string) => void
}

export function PresetCard({
  preset,
  isAdded,
  isAdding,
  copiedId,
  handleDeleteUserPreset,
  handleCopyCode,
  handleAddToVault
}: PresetCardProps) {
  const isValorant = preset.game === 'valorant'
  const edpi = preset.sens && preset.dpi ? Math.round(preset.sens * preset.dpi) : null

  return (
    <div className="bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] rounded-[2.5rem] p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group">
      <div>
        {/* Game Badge & Delete action */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[8px] font-black tracking-[0.15em] px-2.5 py-1 rounded-full uppercase
            ${isValorant 
              ? 'bg-accent/10 text-accent border border-accent/20' 
              : 'bg-cs/10 text-cs border border-cs/20'
            }`}
          >
            {preset.game}
          </span>
          
          <button
            onClick={() => handleDeleteUserPreset(preset.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-500 hover:bg-red-500/5 transition-all"
            title="Удалить пресет"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Live SVG Preview */}
        <div className="aspect-video bg-[#030303] border border-white/[0.03] rounded-2xl flex items-center justify-center relative mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
          <div className="transform scale-[1.3] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            <CrosshairPreview 
              crosshair={{
                id: preset.id,
                game: preset.game,
                name: preset.name,
                code: preset.code,
                tags: '',
                note: '',
                color_preview: '',
                created_at: ''
              }} 
              size={60} 
            />
          </div>
        </div>

        {/* Preset Name */}
        <h3 className="text-sm font-black text-white leading-tight mb-3 group-hover:text-white transition-colors">{preset.name}</h3>
        
        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl text-[10px] font-mono">
          <div className="flex items-center gap-1 text-white/30">
            <Sliders size={10} />
            <span>Сенс:</span>
            <strong className="text-white/70 ml-auto font-bold">{preset.sens ?? '—'}</strong>
          </div>
          <div className="flex items-center gap-1 text-white/30">
            <Hash size={10} />
            <span>DPI:</span>
            <strong className="text-white/70 ml-auto font-bold">{preset.dpi ?? '—'}</strong>
          </div>
          <div className="flex items-center gap-1 text-white/30">
            <Sparkles size={10} />
            <span>eDPI:</span>
            <strong className="text-white/70 ml-auto font-bold">{edpi ?? '—'}</strong>
          </div>
          <div className="flex items-center gap-1 text-white/30">
            <Monitor size={10} />
            <span>Экран:</span>
            <strong className="text-white/70 ml-auto font-bold truncate max-w-[55px]" title={preset.resolution}>{preset.resolution ?? '—'}</strong>
          </div>
          {preset.pollingRate && (
            <div className="flex items-center gap-1 text-white/30">
              <MousePointer size={10} />
              <span>Мышь:</span>
              <strong className="text-white/70 ml-auto font-bold">{preset.pollingRate}Гц</strong>
            </div>
          )}
          {preset.monitorHz && (
            <div className="flex items-center gap-1 text-white/30">
              <Tv size={10} />
              <span>Экран:</span>
              <strong className="text-white/70 ml-auto font-bold">{preset.monitorHz}Гц</strong>
            </div>
          )}
        </div>

        {/* Notes */}
        {preset.desc && (
          <p className="text-[10px] text-white/35 font-medium leading-relaxed mb-4">{preset.desc}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleCopyCode(preset.code, preset.id)}
          className="flex-1 h-10 flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/10 rounded-xl text-white/50 hover:text-white text-[9px] font-black tracking-widest uppercase transition-all"
          title="Скопировать код"
        >
          {copiedId === preset.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copiedId === preset.id ? 'СКОПИРОВАН' : 'КОД'}
        </button>

        <button
          onClick={() => handleAddToVault(preset.id, preset.name, preset.code, preset.game, preset.desc)}
          disabled={isAdded || isAdding}
          className={`flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
            ${isAdded
              ? 'bg-green-500/10 border border-green-500/20 text-green-400 opacity-60 cursor-default'
              : 'bg-white hover:scale-[1.03] active:scale-[0.97] text-black shadow-lg shadow-white/[0.02]'
            }`}
        >
          {isAdded ? (
            <>
              <Check size={12} strokeWidth={3} />
              В СЕЙФЕ
            </>
          ) : (
            <>
              <Plus size={12} strokeWidth={3} />
              {isAdding ? 'ДОБАВЛЕНИЕ...' : 'В СЕЙФ'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
