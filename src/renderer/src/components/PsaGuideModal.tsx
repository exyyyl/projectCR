import React, { useState } from 'react'
import { Sparkles, X, Sliders, Info } from 'lucide-react'

interface PsaGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PsaGuideModal({ isOpen, onClose }: PsaGuideModalProps) {
  const [activeInfoTab, setActiveInfoTab] = useState<'concept' | 'steps' | 'practice' | 'styles'>('concept')
  const [simulatedStep, setSimulatedStep] = useState<number>(1)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Click outside to close trigger */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[750px] bg-[#090909] border border-white/[0.06] rounded-[2.5rem] p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col gap-5 animate-scale-up z-10 overflow-hidden">
        {/* Ambient glows inside modal */}
        <div className="absolute left-[-10%] top-[-10%] w-[40%] h-[40%] bg-amber-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-[-10%] bottom-[-10%] w-[40%] h-[40%] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500 animate-pulse" size={22} />
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Подробное руководство по методу PSA</h3>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.15em] mt-0.5">
                Perfect Sensitivity Approximation — Интерактивный подбор чувствительности
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:text-white flex items-center justify-center text-white/40 transition-all cursor-pointer outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Elegant Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-2xl relative z-10 w-fit shrink-0">
          {[
            { id: 'concept', label: '⚡ Концепция', desc: 'Суть метода' },
            { id: 'steps', label: '📐 Алгоритм', desc: 'Схождение 7 шагов' },
            { id: 'practice', label: '🎯 Практика', desc: 'Как тестировать' },
            { id: 'styles', label: '⚖️ Стили', desc: 'Low vs High' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveInfoTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl text-left transition-all duration-300 outline-none cursor-pointer flex flex-col gap-0.5
                ${activeInfoTab === t.id 
                  ? 'bg-white text-black shadow-[0_10px_25px_rgba(255,255,255,0.06)]' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
                }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider">{t.label}</span>
              <span className={`text-[8px] font-bold ${activeInfoTab === t.id ? 'text-black/50' : 'text-white/20'}`}>{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 relative z-10 flex flex-col gap-6 min-h-0">
          
          {/* Tab 1: Concept */}
          {activeInfoTab === 'concept' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fade-in w-full">
              {/* Left Column: Big Hero Glass Card */}
              <div className="md:col-span-6 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.04] rounded-[2rem] p-6 flex flex-col justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] bg-amber-500/[0.03] rounded-full blur-[60px] pointer-events-none" />
                
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                    ДНК ВАШЕГО ПРИЦЕЛИВАНИЯ
                  </span>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                    Что такое Perfect Sensitivity Approximation?
                  </h4>
                </div>

                <p className="text-xs text-white/50 leading-relaxed">
                  Метод Perfect Sensitivity Approximation (PSA) — это научно обоснованная система нахождения персональной чувствительности мыши. 
                  <br /><br />
                  Вместо того чтобы копировать настройки профессиональных игроков или подбирать параметры случайным образом, вы проходите <strong>математический тест схождения</strong> на основе рефлексов вашего тела. Метод находит уникальную точку, где скорость вашей реакции идеально гармонирует с физическим контролем.
                </p>

                <div className="border-t border-white/[0.04] pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-black">
                    7
                  </div>
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                    Простых шагов отделяют вас от идеального прицела
                  </span>
                </div>
              </div>

              {/* Right Column: Grid of feature cards */}
              <div className="md:col-span-6 flex flex-col gap-4">
                {/* Feature 1 */}
                <div className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] rounded-2xl p-5 flex gap-4 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Sliders size={14} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-white uppercase">128x Точность сведения</span>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Алгоритм последовательно делит диапазон пополам. За 7 итераций начальная область поиска сужается в 128 раз до погрешности в ±5%, отсекая весь шум.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] rounded-2xl p-5 flex gap-4 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-white uppercase">Физиологическая опора</span>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Вам не нужно гадать. Метод опирается на вашу мышечную память и врожденную моторику рук. Ваше тело само интуитивно выберет наиболее комфортную траекторию.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] rounded-2xl p-5 flex gap-4 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Info size={14} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-white uppercase">Универсальность метода</span>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Метод математически нейтрален и работает абсолютно во всех FPS-шутерах. Вычисленный идеальный прицел можно легко перенести в CS2, Valorant, Apex или Overwatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Steps Simulator */}
          {activeInfoTab === 'steps' && (
            <div className="flex flex-col gap-6 animate-fade-in w-full">
              {/* Step Selector pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Интерактивный симулятор сведения:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const stepNum = idx + 1
                    const isSimSelected = simulatedStep === stepNum
                    return (
                      <button
                        key={idx}
                        onClick={() => setSimulatedStep(stepNum)}
                        className={`px-3 py-2 rounded-lg font-mono text-xs font-black transition-all cursor-pointer outline-none border shrink-0
                          ${isSimSelected 
                            ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                            : 'bg-white/[0.02] text-white/40 border-white/[0.05] hover:text-white hover:border-white/20'
                          }`}
                      >
                        Шаг {stepNum}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* The visual convergence bar block */}
              <div className="bg-white/[0.01] border border-white/[0.03] rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">Визуальный диапазон поиска</span>
                
                {/* The convergence track */}
                <div className="w-full max-w-xl h-4 bg-white/[0.02] border border-white/[0.05] rounded-full relative flex items-center justify-center">
                  
                  {/* Interactive glowing search space bar */}
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500/20 via-amber-500/30 to-red-500/20 rounded-full border-x border-white/10 flex justify-between items-center px-0.5 transition-all duration-500 ease-out relative"
                    style={{
                      width: 
                        simulatedStep === 1 ? '100%' :
                        simulatedStep === 2 ? '80%' :
                        simulatedStep === 3 ? '60%' :
                        simulatedStep === 4 ? '42%' :
                        simulatedStep === 5 ? '28%' :
                        simulatedStep === 6 ? '15%' : '6%'
                    }}
                  >
                    {/* Low marker dot */}
                    {simulatedStep < 7 && (
                      <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-[#090909] shadow-[0_0_12px_rgba(59,130,246,1)] -ml-1.5 relative group">
                        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-blue-500 text-black font-mono font-black text-[8px] px-1.5 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">LOW</span>
                      </div>
                    )}
                    
                    {/* Center golden marker dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#090909] shadow-[0_0_15px_rgba(245,158,11,1)] mx-auto relative group">
                      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-mono font-black text-[8px] px-1.5 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">BASE</span>
                    </div>
                    
                    {/* High marker dot */}
                    {simulatedStep < 7 && (
                      <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-[#090909] shadow-[0_0_12px_rgba(239,68,68,1)] -mr-1.5 relative group">
                        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-red-500 text-black font-mono font-black text-[8px] px-1.5 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">HIGH</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between w-full max-w-xl text-[9px] font-mono font-bold text-white/20 uppercase mt-4">
                  <span>Низкая крайность</span>
                  <span>Точка схождения (Идеал)</span>
                  <span>Высокая крайность</span>
                </div>
              </div>

              {/* Step information text blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-5 flex flex-col gap-1.5">
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Текущий шаг</span>
                  <span className="text-sm font-black text-white uppercase font-mono">Шаг {simulatedStep} из 7</span>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-5 flex flex-col gap-1.5">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Величина изменения</span>
                  <span className="text-sm font-black text-white uppercase font-mono">
                    {simulatedStep === 1 ? '±50.0%' :
                     simulatedStep === 2 ? '±50.0%' :
                     simulatedStep === 3 ? '±40.0%' :
                     simulatedStep === 4 ? '±30.0%' :
                     simulatedStep === 5 ? '±20.0%' :
                     simulatedStep === 6 ? '±10.0%' : '±5.0%'}
                  </span>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-5 flex flex-col gap-1.5">
                  <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Тип итерации</span>
                  <span className="text-sm font-black text-white uppercase font-semibold">
                    {simulatedStep <= 2 ? 'Грубая калибровка' :
                     simulatedStep <= 5 ? 'Среднее схождение' : 'Ювелирный баланс'}
                  </span>
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-5">
                <p className="text-xs text-white/60 leading-relaxed">
                  {simulatedStep === 1 && 'Шаг 1 — Начальная точка калибровки. Вы сравниваете ваше базовое значение чувствительности с экстремально низким (0.5x) и экстремально высоким (1.5x) коэффициентами, чтобы задать внешние границы поиска. Это позволяет вам мгновенно понять разницу между слишком медленной и слишком быстрой скоростью прицела.'}
                  {simulatedStep === 2 && 'Шаг 2 — Закрепление границ. Базовое значение перерассчитывается в сторону выбранного вами варианта на первом шаге, но шаг коррекции всё еще равен 50%. Это необходимо для того, чтобы подтвердить направление движения и окончательно отсечь противоположную половину начального диапазона.'}
                  {simulatedStep === 3 && 'Шаг 3 — Начало плавного сведения. Коридор поиска начинает уменьшаться: шаг изменений падает до ±40%. Чувствительность приближается к вашей игровой зоне комфорта. Здесь вы начинаете отсекать значения, при которых происходят частые перелеты или недолеты при переводах.'}
                  {simulatedStep === 4 && 'Шаг 4 — Выравнивание баланса. Шаг изменений снижается до ±30%. Поиск локализован. Вы выбираете между чуть большей точностью трекинга на средних дистанциях и возможностью комфортно делать резкие развороты на 90/180 градусов.'}
                  {simulatedStep === 5 && 'Шаг 5 — Фокусировка комфорта. Шаг коррекции падает до ±20%. Разница между низким и высоким значениями становится слабо различимой при быстрых движениях. Тестируйте их с максимальным вниманием к мелкой доводке прицела.'}
                  {simulatedStep === 6 && 'Шаг 6 — Тонкая доводка. Шаг изменений уменьшается до ±10%. Вы находитесь в шаге от идеала. Различить разницу можно только по рефлексам и микромоторике пальцев при стрельбе на дальние дистанции.'}
                  {simulatedStep === 7 && 'Шаг 7 — Финальный баланс. Сведение завершено! Шаг составляет всего ±5%. Диапазон сузился в 128 раз. Выбранное на этом шаге значение формирует вашу абсолютно безупречную чувствительность, идеально синхронизированную с вашим телом.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Practice */}
          {activeInfoTab === 'practice' && (
            <div className="flex flex-col gap-6 animate-fade-in w-full">
              <div className="text-left flex flex-col gap-1">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                  ИНСТРУКЦИЯ К ТЕСТИРОВАНИЮ
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">
                  Как правильно делать выбор на каждом шаге
                </h4>
                <p className="text-xs text-white/40 mt-1">
                  На каждом шаге выставляйте значения в игре по очереди. Протестируйте оба варианта в течение 1–2 минут, выполняя следующие упражнения:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Exercise 1 */}
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-mono font-black text-xs shrink-0">
                      01
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase">Фликинг</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Резкие переводы</span>
                    </div>
                  </div>
                  
                  {/* CSS visual block representing Target */}
                  <div className="h-28 bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                      </div>
                    </div>
                    {/* Flick path lines */}
                    <div className="absolute w-px h-10 bg-white/10 rotate-45 top-6 left-12" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/60 top-4 left-10" />
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed flex-1">
                    Выбирайте статичные цели на разном расстоянии. Делайте быстрые одиночные переводы прицела (флики). 
                    <br /><br />
                    Если вы постоянно недокручиваете до мишени — текущая чувствительность слишком <strong>низкая</strong>. Если перелетаете — слишком <strong>высокая</strong>.
                  </p>
                </div>

                {/* Exercise 2 */}
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-black text-xs shrink-0">
                      02
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase">Трекинг</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Сопровождение</span>
                    </div>
                  </div>

                  {/* CSS visual block representing Track line */}
                  <div className="h-28 bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="w-32 h-1 bg-white/5 rounded-full relative flex items-center justify-between">
                      <div className="absolute w-3 h-3 rounded-full bg-blue-500/30 border border-blue-400/60 flex items-center justify-center -top-1 left-8">
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-white/15 -mt-0.5" />
                      <div className="w-2 h-2 rounded-full bg-white/15 -mt-0.5" />
                    </div>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed flex-1">
                    Выберите одну мишень. Совершайте стрейфы влево-вправо на разной скорости, пытаясь непрерывно удерживать перекрестие прицела на центре мишени.
                    <br /><br />
                    Если прицел трясет, срывает или дергает — сенса <strong>высоковата</strong>. Если вы отстаете от траектории движения цели — <strong>низковата</strong>.
                  </p>
                </div>

                {/* Exercise 3 */}
                <div className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono font-black text-xs shrink-0">
                      03
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase">Интуиция</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-wider font-semibold">Физиология</span>
                    </div>
                  </div>

                  {/* CSS visual block representing Brain/Pulse */}
                  <div className="h-28 bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-4 bg-purple-500/20 rounded-full" />
                      <div className="w-1 h-8 bg-purple-500/40 rounded-full" />
                      <div className="w-1 h-14 bg-purple-500/60 rounded-full" />
                      <div className="w-1 h-8 bg-purple-500/40 rounded-full" />
                      <div className="w-1 h-4 bg-purple-500/20 rounded-full" />
                    </div>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed flex-1">
                    Не пытайтесь сознательно подстраиваться под значения. Делайте привычные движения, к которым вы привыкли в обычных играх.
                    <br /><br />
                    Ваше тело подскажет правильное решение само. Доверяйте вашему первому рефлекторному впечатлению. Если не уверены — выбирайте ту, что дает больший контроль.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Styles */}
          {activeInfoTab === 'styles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in w-full">
              {/* LOW SENS BLOCK */}
              <div className="bg-[#0b101c] hover:bg-[#0d1526] border border-blue-500/10 rounded-[2rem] p-6 flex flex-col justify-between gap-6 transition-all duration-300">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      НИЗКАЯ ЧУВСТВИТЕЛЬНОСТЬ (LOW)
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">
                    Ориентирована на идеальный контроль и точность
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-[10px] shrink-0 font-bold">1</div>
                    <p className="text-xs text-white/60 leading-normal">
                      <strong className="text-white">Ювелирный пиксель-хантинг:</strong> Облегчает удержание перекрестия на дальних дистанциях и ведение мелких целей.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-[10px] shrink-0 font-bold">2</div>
                    <p className="text-xs text-white/60 leading-normal">
                      <strong className="text-white">Стабильный спрей:</strong> Гасит микро-дрожание ваших рук, упрощая контроль отдачи автоматического оружия.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-[10px] shrink-0 font-bold">3</div>
                    <p className="text-xs text-white/60 leading-normal">
                      <strong className="text-white">Работа всей рукой:</strong> Задействует крупные суставы (локоть, плечо). Требует большого коврика и пространства для размаха.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mt-2">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Идеально подходит для:</span>
                  <span className="text-[11px] text-white/40">Тактических шутеров (CS2, VALORANT), стрельбы на дальние дистанции, снайперского геймплея.</span>
                </div>
              </div>

              {/* HIGH SENS BLOCK */}
              <div className="bg-[#1c0d0d] hover:bg-[#261212] border border-red-500/10 rounded-[2rem] p-6 flex flex-col justify-between gap-6 transition-all duration-300">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                      ВЫСОКАЯ ЧУВСТВИТЕЛЬНОСТЬ (HIGH)
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">
                    Ориентирована на молниеносную скорость реакции
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-[10px] shrink-0 font-bold">1</div>
                    <p className="text-xs text-white/60 leading-normal">
                      <strong className="text-white">Мгновенный разворот:</strong> Позволяет за сотые доли секунды развернуться на 180° и 360° при заходе противника со спины.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-[10px] shrink-0 font-bold">2</div>
                    <p className="text-xs text-white/60 leading-normal">
                      <strong className="text-white">Динамичный трекинг:</strong> Упрощает ведение сверхбыстрых целей на близких дистанциях при частых сменах направлений.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-[10px] shrink-0 font-bold">3</div>
                    <p className="text-xs text-white/60 leading-normal">
                      <strong className="text-white">Работа кистью и пальцами:</strong> Опирается на мелкие рефлексы. Минимизирует физическую усталость руки и экономит коврик.
                    </p>
                  </div>
                </div>

                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mt-2">
                  <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-1">Идеально подходит для:</span>
                  <span className="text-[11px] text-white/40">Арена-шутеров, быстрых баттл-роялей (Apex Legends, Overwatch 2, Quake), ближнего и агрессивного боя.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer button */}
        <div className="flex justify-end pt-4 border-t border-white/[0.04] relative z-10 mt-auto shrink-0">
          <button
            onClick={onClose}
            className="px-6 h-11 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer outline-none"
          >
            Понятно, начать тест
          </button>
        </div>
      </div>
    </div>
  )
}
