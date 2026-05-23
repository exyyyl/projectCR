import React from 'react'
import { MousePointer, Tv, Eye } from 'lucide-react'
import { CrosshairPreview } from './CrosshairPreview'
import { Game } from '../types'

interface EsportsCardPreviewProps {
  game: Game
  name: string
  code: string
  dpi: string
  sens: string
  resolution: string
  monitorHz: string
  scaling: string
  pollingRate: string
  zoomSens: string
  walk: string
  crouch: string
}

export const EsportsCardPreview: React.FC<EsportsCardPreviewProps> = ({
  game,
  name,
  code,
  dpi,
  sens,
  resolution,
  monitorHz,
  scaling,
  pollingRate,
  zoomSens,
  walk,
  crouch
}) => {
  return (
    <div className="sticky top-0 w-full flex flex-col items-center">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-3">Live Profile Preview</span>
      
      {/* The Esports Card */}
      <div className={`w-full rounded-[2.5rem] border p-6 flex flex-col justify-between aspect-[3/4.2] relative overflow-hidden transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.8)]
        ${game === 'valorant'
          ? 'bg-gradient-to-b from-[#18090D] via-[#0E0608] to-[#040404] border-red-500/25 shadow-red-950/5'
          : 'bg-gradient-to-b from-[#18130F] via-[#0E0C0A] to-[#040404] border-amber-500/25 shadow-amber-950/5'
        }`}
      >
        {/* Game Glow Backdrop effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-40 transition-all duration-500
          ${game === 'valorant' ? 'bg-red-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} 
        />

        {/* High-tech tech corner lines */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />
        
        {/* Top Row: User Name & Game badge */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h4 className="text-[8px] font-bold text-white/30 uppercase tracking-[0.15em]">ESPORTS PROFILE</h4>
            <h3 className="text-base font-black text-white uppercase tracking-tight truncate max-w-[130px] leading-tight mt-0.5">
              {name.trim() || 'PLAYER'}
            </h3>
          </div>
          <span className={`text-[8px] font-black tracking-[0.15em] px-2.5 py-1 rounded-full uppercase border transition-all duration-300
            ${game === 'valorant'
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {game}
          </span>
        </div>

        {/* Middle: Aim Reticle Grid and Live Preview */}
        <div className="relative z-10 my-4 aspect-video bg-black/90 border border-white/[0.04] rounded-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:10px_10px] opacity-60 pointer-events-none" />
          
          {/* Crosshair preview */}
          {code.trim() ? (
            <div className="transform scale-[1.3] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <CrosshairPreview 
                crosshair={{
                  id: 'live-card-preview',
                  game,
                  name: 'Preview',
                  code: code.trim(),
                  tags: '',
                  note: '',
                  color_preview: '',
                  created_at: ''
                }} 
                size={55} 
              />
            </div>
          ) : (
            <Eye size={18} className="text-white/10 animate-pulse" />
          )}

          {/* Technical targeting corners */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20" />
        </div>

        {/* Bottom stats layout */}
        <div className="relative z-10 space-y-2.5">
          
          {/* Mouse sens row */}
          <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MousePointer size={11} className="text-white/30" />
              <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-wider">MOUSE SETUP</span>
            </div>
            <div className="flex gap-2.5 text-[9px] font-mono">
              <span className="text-white/30">DPI <strong className="text-white font-bold">{dpi || '—'}</strong></span>
              <span className="text-white/30">SENS <strong className="text-white font-bold">{sens || '—'}</strong></span>
              <span className="text-white/30">eDPI <strong className={`font-bold ${game === 'valorant' ? 'text-red-400' : 'text-amber-400'}`}>
                {sens && dpi ? Math.round(parseFloat(sens) * parseInt(dpi)) : '—'}
              </strong></span>
            </div>
          </div>

          {/* Video Resolution row */}
          <div className="bg-black/40 border border-white/[0.03] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tv size={11} className="text-white/30" />
              <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-wider">DISPLAY & RES</span>
            </div>
            <div className="flex gap-2.5 text-[8.5px] font-mono">
              <span className="text-white/30"><strong className="text-white font-bold">{resolution || '—'}</strong></span>
              <span className="text-white/30"><strong className="text-white font-bold">{monitorHz || '—'}Hz</strong></span>
              <span className="text-white/30 uppercase"><strong className="text-white font-bold">{scaling === 'black_bars' ? 'Bars' : scaling === 'stretched' ? 'Stretched' : 'Native'}</strong></span>
            </div>
          </div>

          {/* Polling & Zoom extra parameters row */}
          <div className="flex gap-2">
            <div className="flex-1 bg-black/40 border border-white/[0.03] px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[7.5px] font-mono">
              <span className="text-white/30 uppercase">POLLING</span>
              <strong className="text-white font-bold">{pollingRate} Hz</strong>
            </div>
            <div className="flex-1 bg-black/40 border border-white/[0.03] px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[7.5px] font-mono">
              <span className="text-white/30 uppercase">ZOOM SENS</span>
              <strong className="text-white font-bold">{zoomSens}</strong>
            </div>
          </div>

          {/* Keybinds mini indicator row */}
          <div className="bg-black/40 border border-white/[0.03] px-2.5 py-2 rounded-lg flex items-center justify-between text-[7.5px] font-mono">
            <span className="text-white/30 uppercase">BINDS (WALK/CROUCH)</span>
            <strong className="text-white font-bold uppercase">{walk} / {crouch}</strong>
          </div>

        </div>
      </div>
      <span className="text-[8px] text-white/20 mt-3 font-medium">Конфиг автоматически обновляется</span>
    </div>
  )
}
