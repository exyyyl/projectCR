import React from 'react'
import { Sparkles, Copy, Check, Save, RotateCcw } from 'lucide-react'
import { GAMES, GameKey } from '../../config/sensConfig'

interface RecommendedConversion {
  key: GameKey
  name: string
  sens: number
  edpi: number
  cm360: number
  color: string
}

interface StepRow {
  step: number
  lowSens: number | null
  baseSens: number | null
  highSens: number | null
  choice: 'low' | 'high' | null
  isActive: boolean
  isCompleted: boolean
}

interface ResultScreenProps {
  game: GameKey
  dpi: number
  baseSens: number
  baseEdpi: number
  baseCm360: number
  copiedId: string | null
  profileName: string
  setProfileName: (name: string) => void
  tableRows: StepRow[]
  recommendedConversions: RecommendedConversion[]
  handleCopyText: (text: string, id: string) => void
  handleSaveProfile: () => void
  handleReset: () => void
}

export function ResultScreen({
  game,
  dpi,
  baseSens,
  baseEdpi,
  baseCm360,
  copiedId,
  profileName,
  setProfileName,
  tableRows,
  recommendedConversions,
  handleCopyText,
  handleSaveProfile,
  handleReset
}: ResultScreenProps) {
  const activeGame = GAMES[game]

  return (
    <div className="flex flex-col gap-6 mb-8 shrink-0 animate-fade-in">
      {/* Success Banner Card */}
      <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Calculated Result Sens */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col justify-center">
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-3">
              <Sparkles size={16} className="text-white/50 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">ВЫЧИСЛЕННАЯ СЕНСИТИВНОСТЬ</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mono font-black text-white tracking-tight flex items-center justify-center lg:justify-start gap-4">
              {baseSens}
              <button 
                onClick={() => handleCopyText(baseSens.toString(), 'rec-sens')}
                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all self-center"
                title="Копировать значение"
              >
                {copiedId === 'rec-sens' ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              </button>
            </h1>

            <p className="text-[11px] text-white/30 font-medium mt-2 leading-relaxed">
              По результатам теста PSA это наиболее сбалансированная чувствительность для вашего стиля наводки на {dpi} DPI в игре {activeGame.name}.
            </p>

            {/* Primary Stats */}
            <div className="flex items-center gap-6 mt-6 pt-5 border-t border-white/[0.04]">
              <div>
                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5">Идеальный eDPI</div>
                <div className="text-xl font-mono font-bold text-white/80">{baseEdpi}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-0.5">360° Дистанция</div>
                <div className="text-xl font-mono font-bold text-white/80">{baseCm360} см</div>
              </div>
            </div>
          </div>

          {/* Conversion and saving options */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Save Profile Panel */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-3">Сохранить результат в историю</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder={`Например: Мой идеальный ${activeGame.name}...`}
                  className="flex-1 bg-white/[0.02] border border-white/[0.05] focus:border-white/10 rounded-xl px-4 py-3 text-[10px] font-black tracking-widest text-white placeholder-white/20 outline-none uppercase transition-all"
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={!profileName.trim()}
                  className="h-10 px-5 flex items-center justify-center gap-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <Save size={12} />
                  СОХРАНИТЬ
                </button>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={12} />
              ПРОЙТИ ТЕСТ ЗАНОВО
            </button>
          </div>

        </div>
      </div>

      {/* Conversion Grid across other games */}
      <div>
        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
          ЭКВИВАЛЕНТЫ В ДРУГИХ ИГРАХ (КОНВЕРТАЦИЯ)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {recommendedConversions.map((conv) => (
            <div key={conv.key} className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-4 flex flex-col justify-between gap-3 group hover:border-white/10 transition-all">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: conv.color }} />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{conv.name}</span>
                </div>

                <div className="text-xl font-mono font-black text-white mt-1">
                  {conv.sens}
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-white/[0.03] pt-2 text-[10px] font-mono text-white/40">
                <div>eDPI: {conv.edpi}</div>
                <div>360°: {conv.cm360} см</div>
              </div>

              <button
                onClick={() => handleCopyText(conv.sens.toString(), `conv-${conv.key}`)}
                className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-xl text-[9px] font-black uppercase tracking-wider text-white/60 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                {copiedId === `conv-${conv.key}` ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                {copiedId === `conv-${conv.key}` ? 'СКОПИРОВАНО' : 'КОПИРОВАТЬ'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Steps table representation in results */}
      <div className="mt-2 bg-white/[0.01] border border-white/[0.03] rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block">
            ХРОНОЛОГИЯ РАСЧЕТОВ ТЕСТА
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
                  <tr key={row.step} className="hover:bg-white/[0.01]">
                    <td className="py-2.5 pl-2 text-xs font-black text-white/40">
                      Шаг {row.step}
                    </td>
                    <td className="py-2.5 text-xs font-mono text-blue-400/90">
                      {row.lowSens !== null ? row.lowSens.toFixed(3) : '—'}
                    </td>
                    <td className="py-2.5 text-xs font-mono text-center text-white/70">
                      {row.baseSens !== null ? row.baseSens.toFixed(3) : '—'}
                    </td>
                    <td className="py-2.5 text-xs font-mono text-right text-red-400/90">
                      {row.highSens !== null ? row.highSens.toFixed(3) : '—'}
                    </td>
                    <td className="py-2.5 text-xs text-right pr-2">
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
