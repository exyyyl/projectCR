import React from 'react'
import { ArrowLeft, RotateCcw, Copy, Check, Sparkles } from 'lucide-react'
import { GAMES, GameKey } from '../../config/sensConfig'

interface StepRow {
  step: number
  lowSens: number | null
  baseSens: number | null
  highSens: number | null
  choice: 'low' | 'high' | null
  isActive: boolean
  isCompleted: boolean
}

interface TestingScreenProps {
  step: number
  game: GameKey
  dpi: number
  baseSens: number
  currentLowSens: number
  currentHighSens: number
  copiedId: string | null
  tableRows: StepRow[]
  handleStepBack: () => void
  handleReset: () => void
  handleSelectChoice: (choice: 'low' | 'high') => void
  handleCopyText: (text: string, id: string) => void
}

export function TestingScreen({
  step,
  game,
  dpi,
  baseSens,
  currentLowSens,
  currentHighSens,
  copiedId,
  tableRows,
  handleStepBack,
  handleReset,
  handleSelectChoice,
  handleCopyText
}: TestingScreenProps) {
  const activeGame = GAMES[game]

  return (
    <div className="flex flex-col gap-6 mb-8 shrink-0 animate-fade-in">
      {/* Top Wizard Bar */}
      <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleStepBack}
            className="w-10 h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] flex items-center justify-center text-white/60 hover:text-white transition-all"
            title="Назад на шаг"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tight">Шаг {step} из 7</h3>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.15em] mt-0.5">
              Приближение к идеальной точке
            </p>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 7 }).map((_, idx) => {
            const stepNum = idx + 1
            const isActive = step === stepNum
            const isCompleted = step > stepNum
            return (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300
                  ${isActive ? 'w-10 bg-white' : isCompleted ? 'w-4 bg-white/40' : 'w-2 bg-white/10'}
                `}
              />
            )
          })}
        </div>

        <button 
          onClick={handleReset}
          className="text-[9px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
        >
          <RotateCcw size={12} />
          СБРОСИТЬ
        </button>
      </div>

      {/* Guidelines */}
      <div className="text-center max-w-2xl mx-auto px-4 py-2">
        <p className="text-xs text-white/50 leading-relaxed">
          Установите значения чувствительности в настройках игры по очереди. Протестируйте каждую в течение 1 минуты. Выберите ту, которая кажется вам более естественной для точного прицеливания.
        </p>
      </div>

      {/* Cards for Choice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: LOW Sens */}
        <div 
          onClick={() => handleSelectChoice('low')}
          className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />

          <div className="flex flex-col items-center gap-1.5 mb-6">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              НИЗКАЯ СЕНСА
            </span>
            <span className="text-[10px] text-white/30 font-medium mt-1">Ориентирована на точность и трекинг</span>
          </div>

          {/* Big value display */}
          <div className="my-8 flex items-center gap-3">
            <span className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">{currentLowSens}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCopyText(currentLowSens.toString(), `low-${step}`)
              }}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              title="Копировать"
            >
              {copiedId === `low-${step}` ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Stats calculations info */}
          <div className="w-full grid grid-cols-2 gap-4 border-t border-white/[0.03] pt-6 text-left">
            <div>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">eDPI</span>
              <span className="text-xs font-mono font-bold text-white/70">{Math.round(currentLowSens * dpi)}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">360° Дистанция</span>
              <span className="text-xs font-mono font-bold text-white/70">
                {currentLowSens > 0 ? Math.round((activeGame.const360 / (dpi * currentLowSens)) * 10) / 10 : 0} см
              </span>
            </div>
          </div>

          <div className="w-full mt-8">
            <button className="w-full py-4 bg-white/[0.03] border border-white/[0.05] group-hover:bg-white group-hover:text-black transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest">
              ВЫБРАТЬ НИЗКУЮ
            </button>
          </div>
        </div>

        {/* Card 2: HIGH Sens */}
        <div 
          onClick={() => handleSelectChoice('high')}
          className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none" />

          <div className="flex flex-col items-center gap-1.5 mb-6">
            <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.2em] bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              ВЫСОКАЯ СЕНСА
            </span>
            <span className="text-[10px] text-white/30 font-medium mt-1">Ориентирована на скорость и развороты</span>
          </div>

          {/* Big value display */}
          <div className="my-8 flex items-center gap-3">
            <span className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">{currentHighSens}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCopyText(currentHighSens.toString(), `high-${step}`)
              }}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              title="Копировать"
            >
              {copiedId === `high-${step}` ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Stats calculations info */}
          <div className="w-full grid grid-cols-2 gap-4 border-t border-white/[0.03] pt-6 text-left">
            <div>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">eDPI</span>
              <span className="text-xs font-mono font-bold text-white/70">{Math.round(currentHighSens * dpi)}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block mb-0.5">360° Дистанция</span>
              <span className="text-xs font-mono font-bold text-white/70">
                {currentHighSens > 0 ? Math.round((activeGame.const360 / (dpi * currentHighSens)) * 10) / 10 : 0} см
              </span>
            </div>
          </div>

          <div className="w-full mt-8">
            <button className="w-full py-4 bg-white/[0.03] border border-white/[0.05] group-hover:bg-white group-hover:text-black transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest">
              ВЫБРАТЬ ВЫСОКУЮ
            </button>
          </div>
        </div>

      </div>

      {/* Sensitivity step-by-step table */}
      <div className="mt-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
            ТАБЛИЦА ШАГОВ ЧУВСТВИТЕЛЬНОСТИ
          </span>
          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest block">
            Текущий шаг подсвечен оранжевым
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] pb-3">
                <th className="pb-3 text-[9px] font-black text-white/30 uppercase tracking-widest w-16">Шаг</th>
                <th className="pb-3 text-[9px] font-black text-white/30 uppercase tracking-widest">Низкая (Lower)</th>
                <th className="pb-3 text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Базовая (Base)</th>
                <th className="pb-3 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">Высокая (Higher)</th>
                <th className="pb-3 text-[9px] font-black text-white/30 uppercase tracking-widest text-right w-28">Выбор</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {tableRows.map((row) => {
                return (
                  <tr 
                    key={row.step}
                    className={`transition-all duration-200
                      ${row.isActive 
                        ? 'bg-amber-500/[0.04] border-l-2 border-amber-500 font-bold' 
                        : 'hover:bg-white/[0.01]'
                      }
                    `}
                  >
                    <td className="py-2 px-1 sm:py-2.5 sm:pl-2 text-[10px] sm:text-xs font-black text-white/40">
                      Шаг {row.step}
                    </td>
                    <td className="py-2 px-1 sm:py-2.5 text-[10px] sm:text-xs font-mono text-blue-400/90">
                      {row.lowSens !== null ? row.lowSens.toFixed(3) : '—'}
                    </td>
                    <td className={`py-2 px-1 sm:py-2.5 text-[10px] sm:text-xs font-mono text-center
                      ${row.isActive 
                        ? 'text-amber-500 sm:text-sm font-black' 
                        : row.isCompleted 
                          ? 'text-white/60' 
                          : 'text-white/20'
                      }
                    `}>
                      {row.baseSens !== null ? row.baseSens.toFixed(3) : '—'}
                    </td>
                    <td className="py-2 px-1 sm:py-2.5 text-[10px] sm:text-xs font-mono text-right text-red-400/90">
                      {row.highSens !== null ? row.highSens.toFixed(3) : '—'}
                    </td>
                    <td className="py-2 px-1 sm:py-2.5 sm:pr-2 text-[10px] sm:text-xs text-right">
                      {row.choice === 'low' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          Низкая
                        </span>
                      )}
                      {row.choice === 'high' && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-400">
                          Высокая
                        </span>
                      )}
                      {row.isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          В процессе
                        </span>
                      )}
                      {!row.isActive && !row.isCompleted && (
                        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">
                          Ожидание
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
