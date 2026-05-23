import React from 'react'
import { Sparkles, Plus, X, ChevronDown } from 'lucide-react'
import { Game } from '../types'
import { EsportsCardPreview } from './EsportsCardPreview'
import { MonitorTabCS2 } from './presets/MonitorTabCS2'
import { MonitorTabValorant } from './presets/MonitorTabValorant'
import { VideoTabCS2 } from './presets/VideoTabCS2'
import { VideoTabValorant } from './presets/VideoTabValorant'
import { ConfigTabCS2 } from './presets/ConfigTabCS2'
import { ConfigTabValorant } from './presets/ConfigTabValorant'
import { PresetCard } from './presets/PresetCard'
import { usePresetForm } from '../hooks/usePresetForm'

interface Props {
  onAddCrosshair: (name: string, code: string, game: Game, note?: string, tags?: string[]) => Promise<any>
  existingCodes: string[]
}

export function PresetsPanel({ onAddCrosshair, existingCodes }: Props) {
  const {
    userPresets,
    isModalOpen,
    setIsModalOpen,
    modalTab,
    setModalTab,
    presetTemplate,
    newPreset,
    gameDropdownOpen,
    setGameDropdownOpen,
    templateDropdownOpen,
    setTemplateDropdownOpen,
    copiedId,
    addingIds,
    handleCopyCode,
    handleAddToVault,
    handleResetForm,
    handleApplyTemplate,
    handleCreatePreset,
    handleDeleteUserPreset,
    handleFormChange
  } = usePresetForm(onAddCrosshair)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden px-6 pt-5 pb-6 bg-amoled-bg text-amoled-text">
      
      {/* Create Preset Horizontal Banner (Sticky on Top) */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white/[0.01] hover:bg-white/[0.02] border border-dashed border-white/10 hover:border-white/20 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.4)] group shrink-0 mb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
            <Plus size={20} strokeWidth={3} />
          </div>
          <div className="text-left">
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Создать свой игровой пресет</h3>
            <p className="text-[10px] text-white/30 font-medium mt-1 leading-relaxed">
              Зафиксируйте свои прицелы, разрешение экрана и настройки мыши в один профиль
            </p>
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg group-hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
        >
          СОЗДАТЬ
        </button>
      </div>

      {/* Scrollable Presets Grid wrapper */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 animate-fade-in">
        {userPresets.length === 0 ? (
          <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-6 bg-white/[0.01] border border-[#ffffff]/[0.02] rounded-[2.5rem]">
            <Sparkles size={32} className="text-white/10 mb-4 animate-pulse" />
            <h4 className="text-xs font-black text-white/60 uppercase tracking-widest mb-1.5">Коллекция пресетов пуста</h4>
            <p className="text-[10px] text-white/30 max-w-[240px] leading-relaxed font-medium">
              Создайте свой первый игровой пресет, нажав на кнопку выше. Он появится здесь!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {userPresets.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isAdded={existingCodes.includes(preset.code.trim())}
                isAdding={!!addingIds[preset.id]}
                copiedId={copiedId}
                handleDeleteUserPreset={handleDeleteUserPreset}
                handleCopyCode={handleCopyCode}
                handleAddToVault={handleAddToVault}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE PRESET MODAL FORM (Konect.gg Replication) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111115] border border-white/[0.08] w-full max-w-5xl rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
            
            {/* Centered Styled Header */}
            <div className="px-8 py-5 border-b border-white/[0.05] bg-[#16161C] flex items-center justify-between shrink-0 relative">
              <div className="flex-1 flex justify-center">
                <h2 className="text-xs font-black text-white tracking-[0.25em] uppercase font-sans">SETTINGS</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Sub-header with Game & Preset template selectors */}
            <div className="px-8 py-4 bg-[#141419] border-b border-white/[0.03] shrink-0 flex flex-col gap-3">
              {/* Game Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setGameDropdownOpen(!gameDropdownOpen)
                    setTemplateDropdownOpen(false)
                  }}
                  className="w-full bg-[#1A1A22] border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-4 py-3 flex items-center justify-between text-[10px] font-black text-white outline-none tracking-widest uppercase transition-all text-left shadow-md"
                >
                  <div className="flex items-center gap-3">
                    {newPreset.game === 'cs2' ? (
                      <>
                        <div className="w-6 h-6 rounded bg-[#F15A24] flex items-center justify-center text-white border border-[#F15A24]/30 shadow-lg shadow-[#F15A24]/10 shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v4h2v-5.5l-2.1-2 1.3-4.1c.9 1.1 2.3 1.9 3.8 1.9v-2c-1.3 0-2.4-.7-3-1.7l-.9-1.5c-.4-.6-1-.9-1.7-.9-.3 0-.6.1-.9.2l-3.8 1.6v4.6h2v-3.1l1.7-.7-1.6 7.4-4.8-.8v2l6 .8z"/>
                          </svg>
                        </div>
                        <span className="tracking-[0.15em]">Counter-Strike 2</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded bg-[#FF4655] flex items-center justify-center text-white border border-[#FF4655]/30 shadow-lg shadow-[#FF4655]/10 shrink-0">
                          <Sparkles size={11} strokeWidth={2.5} />
                        </div>
                        <span className="tracking-[0.15em]">VALORANT</span>
                      </>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${gameDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {gameDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setGameDropdownOpen(false)} />
                    <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#16161C] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-40 p-1.5 animate-scale-in">
                      <button
                        type="button"
                        onClick={() => {
                          handleFormChange({ game: 'cs2' })
                          handleApplyTemplate('custom', 'cs2')
                          setGameDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-3 text-[10px] font-black tracking-widest uppercase transition-colors
                          ${newPreset.game === 'cs2' ? 'bg-white/5 text-white' : 'text-white/45 hover:bg-white/[0.02] hover:text-white'}`}
                      >
                        <div className="w-5 h-5 rounded bg-[#F15A24] flex items-center justify-center text-white">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v4h2v-5.5l-2.1-2 1.3-4.1c.9 1.1 2.3 1.9 3.8 1.9v-2c-1.3 0-2.4-.7-3-1.7l-.9-1.5c-.4-.6-1-.9-1.7-.9-.3 0-.6.1-.9.2l-3.8 1.6v4.6h2v-3.1l1.7-.7-1.6 7.4-4.8-.8v2l6 .8z"/>
                          </svg>
                        </div>
                        Counter-Strike 2
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFormChange({ game: 'valorant' })
                          handleApplyTemplate('custom', 'valorant')
                          setGameDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-3 text-[10px] font-black tracking-widest uppercase transition-colors
                          ${newPreset.game === 'valorant' ? 'bg-white/5 text-white' : 'text-white/45 hover:bg-white/[0.02] hover:text-white'}`}
                      >
                        <div className="w-5 h-5 rounded bg-[#FF4655] flex items-center justify-center text-white">
                          <Sparkles size={9} strokeWidth={3} />
                        </div>
                        VALORANT
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Template / Profile selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setTemplateDropdownOpen(!templateDropdownOpen)
                    setGameDropdownOpen(false)
                  }}
                  className="w-full bg-[#1A1A22] border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-4 py-3 flex items-center justify-between text-[10px] font-black text-white outline-none tracking-widest uppercase transition-all text-left shadow-md"
                >
                  <div className="flex items-center gap-2">
                    {presetTemplate === 'custom' ? (
                      <span className="tracking-[0.12em] text-white/80">Пользовательский профиль (Custom)</span>
                    ) : presetTemplate === 'default' ? (
                      <>
                        <span className="font-bold tracking-[0.12em]">
                          {newPreset.game === 'cs2' ? 'CS:GO' : 'VALORANT Default'}
                        </span>
                        <span className="px-2 py-0.5 bg-[#FEEF3C] text-black text-[7.5px] font-black rounded-md tracking-[0.05em] ml-1.5 shadow-md shadow-[#FEEF3C]/5 border border-[#FEEF3C]/10">
                          Official
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold tracking-[0.12em]">
                          {newPreset.game === 'cs2' ? 's1mple Setup' : 'TenZ Setup'}
                        </span>
                        <span className="px-2 py-0.5 bg-[#FEEF3C] text-black text-[7.5px] font-black rounded-md tracking-[0.05em] ml-1.5 shadow-md shadow-[#FEEF3C]/5 border border-[#FEEF3C]/10">
                          Official
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${templateDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {templateDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setTemplateDropdownOpen(false)} />
                    <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#16161C] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-40 p-1.5 animate-scale-in">
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyTemplate('custom', newPreset.game)
                          setTemplateDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-[10px] font-black tracking-widest uppercase transition-colors
                          ${presetTemplate === 'custom' ? 'bg-white/5 text-white' : 'text-white/45 hover:bg-white/[0.02] hover:text-white'}`}
                      >
                        <span>Пользовательский профиль (Custom)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyTemplate('default', newPreset.game)
                          setTemplateDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-[10px] font-black tracking-widest uppercase transition-colors
                          ${presetTemplate === 'default' ? 'bg-white/5 text-white' : 'text-white/45 hover:bg-white/[0.02] hover:text-white'}`}
                      >
                        <div className="flex items-center">
                          <span>{newPreset.game === 'cs2' ? 'CS:GO' : 'VALORANT Default'}</span>
                          <span className="px-1.5 py-0.5 bg-[#FEEF3C] text-black text-[7px] font-black rounded-md tracking-[0.05em] ml-2">Official</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyTemplate('pro', newPreset.game)
                          setTemplateDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-[10px] font-black tracking-widest uppercase transition-colors
                          ${presetTemplate === 'pro' ? 'bg-white/5 text-white' : 'text-white/45 hover:bg-white/[0.02] hover:text-white'}`}
                      >
                        <div className="flex items-center">
                          <span>{newPreset.game === 'cs2' ? 's1mple Setup' : 'TenZ Setup'}</span>
                          <span className="px-1.5 py-0.5 bg-[#FEEF3C] text-black text-[7px] font-black rounded-md tracking-[0.05em] ml-2">Official</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tab Bar Selector (matching Konect.gg screenshots) */}
            <div className="px-8 pt-4 bg-[#111115] shrink-0">
              <div className="flex bg-[#16161E] border border-white/[0.05] rounded-xl p-1 gap-1 items-center">
                {(['config', 'graphics', 'monitor'] as const).map(tab => (
                  <div key={tab} className="flex-1 relative">
                    <button
                      type="button"
                      onClick={() => setModalTab(tab)}
                      className={`w-full py-2.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all
                        ${modalTab === tab
                          ? 'bg-white text-black shadow-lg shadow-white/[0.01]'
                          : 'text-white/30 hover:text-white/50 hover:bg-white/[0.01]'
                        }`}
                    >
                      {tab === 'config' ? 'Config' : tab === 'graphics' ? 'Video' : 'Monitor'}
                    </button>
                    {modalTab === tab && (tab === 'graphics' || tab === 'monitor') && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetForm();
                        }}
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-white border border-black/10 hover:border-red-500 hover:text-red-500 flex items-center justify-center text-black shadow-md cursor-pointer z-50 transition-all active:scale-90"
                        title={tab === 'graphics' ? "Сбросить настройки видео" : "Сбросить настройки монитора"}
                      >
                        <Trash2 size={10} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Plus button inside the tab bar */}
                <button
                  type="button"
                  className="w-10 h-10 shrink-0 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded-xl border border-white/[0.03]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Main scrollable body (Grid) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left column: scrollable settings categories */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                {modalTab === 'config' && newPreset.game === 'cs2' && (
                  <ConfigTabCS2 preset={newPreset} onChange={handleFormChange} />
                )}
                {modalTab === 'config' && newPreset.game === 'valorant' && (
                  <ConfigTabValorant preset={newPreset} onChange={handleFormChange} />
                )}
                {modalTab === 'graphics' && newPreset.game === 'cs2' && (
                  <VideoTabCS2 preset={newPreset} onChange={handleFormChange} />
                )}
                {modalTab === 'graphics' && newPreset.game === 'valorant' && (
                  <VideoTabValorant preset={newPreset} onChange={handleFormChange} />
                )}
                {modalTab === 'monitor' && newPreset.game === 'cs2' && (
                  <MonitorTabCS2 preset={newPreset} onChange={handleFormChange} />
                )}
                {modalTab === 'monitor' && newPreset.game === 'valorant' && (
                  <MonitorTabValorant preset={newPreset} onChange={handleFormChange} />
                )}
              </div>

              {/* Right Column: Live Esports Card Preview */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-start">
                <EsportsCardPreview
                  game={newPreset.game}
                  name={newPreset.name}
                  code={newPreset.code}
                  dpi={newPreset.dpi}
                  sens={newPreset.sens}
                  resolution={(newPreset.resolutionWidth && newPreset.resolutionHeight)
                    ? `${newPreset.resolutionWidth}x${newPreset.resolutionHeight}`
                    : newPreset.resolution}
                  monitorHz={newPreset.monitorHz}
                  scaling={newPreset.scaling}
                  pollingRate={newPreset.pollingRate}
                  zoomSens={newPreset.zoomSens}
                  walk={newPreset.walk}
                  crouch={newPreset.crouch}
                />
              </div>

            </div>

            {/* Footer (Sticky) with distinct yellow Konect-style Save button */}
            <div className="px-8 py-5 border-t border-white/[0.05] bg-[#16161C] flex items-center justify-end shrink-0 gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.02] text-[9px] font-black tracking-[0.2em] rounded-xl text-white/40 hover:text-white/80 transition-all"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleCreatePreset}
                disabled={!newPreset.name.trim() || !newPreset.code.trim()}
                className="px-8 py-3 bg-[#FEEF3C] hover:bg-[#EEDD2B] text-black text-[10px] font-bold rounded-xl hover:scale-[1.03] active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg shadow-[#FEEF3C]/5 font-sans"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
