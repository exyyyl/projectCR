import React from 'react'
import { Sliders, ArrowRight, Info, Sparkles, Check, ChevronDown } from 'lucide-react'
import { GAMES, GameKey } from '../../config/sensConfig'

interface SetupScreenProps {
  game: GameKey
  setGame: (game: GameKey) => void
  dpi: number
  setDpi: (dpi: number) => void
  startSens: number
  setStartSens: (sens: number) => void
  isGameDropdownOpen: boolean
  setIsGameDropdownOpen: (open: boolean) => void
  setIsInfoModalOpen: (open: boolean) => void
  handleStartTest: () => void
}

export function SetupScreen({
  game,
  setGame,
  dpi,
  setDpi,
  startSens,
  setStartSens,
  isGameDropdownOpen,
  setIsGameDropdownOpen,
  setIsInfoModalOpen,
  handleStartTest
}: SetupScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Left Column: Form & Info */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        
        {/* Test Setup Form Card */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2.5 mb-5">
            <Sliders className="text-white/70" size={18} />
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
              НАСТРОЙКИ ТЕСТА
            </span>
          </div>

          <div className="space-y-4">
            {/* Game Select */}
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Основная игра</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-xl px-4 py-3 text-xs font-black text-white outline-none cursor-pointer tracking-wider transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span>{GAMES[game].name}</span>
                  </div>
                  <ChevronDown size={14} className={`text-white/30 transition-transform duration-300 ${isGameDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isGameDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsGameDropdownOpen(false)} 
                    />
                    <div className="absolute left-0 right-0 mt-2 bg-[#0E0E0E]/95 backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-fade-in">
                      {Object.entries(GAMES).map(([key, item]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            const newGame = key as GameKey
                            setGame(newGame)
                            if (newGame === 'valorant') {
                              setStartSens(0.5)
                            } else if (newGame === 'cs2') {
                              setStartSens(1.5)
                            }
                            setIsGameDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-left text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between
                            ${game === key 
                              ? 'bg-white/5 text-white' 
                              : 'text-white/40 hover:bg-white/[0.02] hover:text-white/70'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                          </div>
                          {game === key && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* DPI Input */}
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">DPI мыши</label>
              <input
                type="number"
                value={dpi || ''}
                onChange={(e) => setDpi(Math.max(1, Number(e.target.value)))}
                placeholder="800"
                className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] focus:border-white/10 focus:bg-white/[0.04] rounded-xl px-4 py-3 text-xs font-black text-white outline-none transition-all tracking-wider"
              />
            </div>

            {/* Start Sens Input */}
            <div>
              <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">Начальная чувствительность</label>
              <input
                type="number"
                step="0.001"
                value={startSens || ''}
                onChange={(e) => setStartSens(Math.max(0.001, Number(e.target.value)))}
                placeholder={game === 'valorant' ? '0.5' : '1.5'}
                className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] focus:border-white/10 focus:bg-white/[0.04] rounded-xl px-4 py-3 text-xs font-black text-white outline-none transition-all tracking-wider"
              />
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full mt-8 h-12 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_12px_30px_rgba(255,255,255,0.06)] flex items-center justify-center gap-2"
          >
            НАЧАТЬ PSA ТЕСТ
            <ArrowRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Right Column: PSA Explanation Card */}
      <div className="lg:col-span-6 flex flex-col bg-white/[0.02] border border-white/[0.04] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <Info className="text-amber-500" size={18} />
            <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">
              ЧТО ТАКОЕ МЕТОД PSA?
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsInfoModalOpen(true)}
            className="text-[9px] font-black text-amber-500 hover:text-white uppercase tracking-widest bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
          >
            Подробнее
          </button>
        </div>

        <div className="space-y-4 text-xs text-white/60 leading-relaxed relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <p className="font-bold text-white mb-2">
              Perfect Sensitivity Approximation (PSA) — метод идеального приближения чувствительности.
            </p>
            <p className="mb-4">
              Это научно обоснованный математический алгоритм бисекции (деления пополам), который помогает геймерам найти оптимальное соотношение между скоростью и контролем мыши на основе мышечной памяти.
            </p>
            
            <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-4 space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white shrink-0">1</div>
                <div>
                  <span className="text-white font-bold block">Начало подбора</span>
                  <span>Вы вводите базовую чувствительность и DPI вашей мыши для старта.</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white shrink-0">2</div>
                <div>
                  <span className="text-white font-bold block">Сравнение (7 шагов)</span>
                  <span>На каждом шаге алгоритм рассчитывает два новых значения: более низкую и высокую сенсу. Вы тестируете их в игре по 1-2 минуты и выбираете наиболее комфортную.</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white shrink-0">3</div>
                <div>
                  <span className="text-white font-bold block">Идеальный баланс</span>
                  <span>С каждым выбором диапазон сужается вдвое. Через 7 шагов вы получите персональное идеальное значение чувствительности.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-4 mt-auto">
            <div className="flex items-center gap-2 text-white/40">
              <Sparkles size={12} className="text-amber-500/60" />
              <span className="text-[9px] font-black uppercase tracking-widest">Совет</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 leading-normal">
              Во время тестирования не пытайтесь искусственно подстраиваться под значения. Делайте привычные флики и трекинг целей. Ваше тело само подскажет правильный выбор.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
