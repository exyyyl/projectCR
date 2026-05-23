import React from 'react'
import { Gamepad2, Folder, MousePointer, Target, Hand, Radio, Terminal, Plus, Trash2 } from 'lucide-react'
import { CardContainer } from '../ui/CardContainer'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { SwitchGroup } from '../ui/SwitchGroup'
import { PresetFormState } from '../../config/presetSchemas'

interface ConfigTabCS2Props {
  preset: PresetFormState
  onChange: (update: Partial<PresetFormState>) => void
}

export const ConfigTabCS2: React.FC<ConfigTabCS2Props> = ({
  preset,
  onChange
}) => {
  return (
    <>
      {/* General Setup Nickname */}
      <CardContainer title="General Profile" icon={Gamepad2} onButtonClick={() => {}}>
        <InputField
          label="Profile Nickname"
          value={preset.name}
          onChange={val => onChange({ name: val })}
          placeholder="Player name..."
          game="cs2"
          isLast={true}
        />
      </CardContainer>

      {/* CONFIG FILES */}
      <CardContainer title="CONFIG FILES" icon={Folder} onButtonClick={() => {}} />

      {/* MOUSE CARD */}
      <CardContainer title="MOUSE" icon={MousePointer} onButtonClick={() => {}}>
        <InputField
          label="DPI"
          value={preset.dpi}
          onChange={val => onChange({ dpi: val })}
          game="cs2"
        />
        <InputField
          label="Sensitivity"
          value={preset.sens}
          onChange={val => onChange({ sens: val })}
          game="cs2"
        />
        <InputField
          label="Zoom Sensitivity"
          value={preset.zoomSens}
          onChange={val => onChange({ zoomSens: val })}
          game="cs2"
        />
        <InputField
          label="HZ"
          value={preset.pollingRate}
          onChange={val => onChange({ pollingRate: val })}
          game="cs2"
        />
        <InputField
          label="RAW INPUT"
          value={preset.rawInput}
          onChange={val => onChange({ rawInput: val })}
          game="cs2"
        />
        <InputField
          label="MOUSE ACCELERATION"
          value={preset.cs2MouseAcceleration}
          onChange={val => onChange({ cs2MouseAcceleration: val })}
          game="cs2"
        />
        <InputField
          label="WINDOWS SENSITIVITY"
          value={preset.cs2WindowsSensitivity}
          onChange={val => onChange({ cs2WindowsSensitivity: val })}
          game="cs2"
          isLast={true}
        />
      </CardContainer>

      {/* CROSSHAIR CARD */}
      <CardContainer title="CROSSHAIR" icon={Target} onButtonClick={() => {}}>
        <InputField
          label="SIZE"
          value={preset.cs2Size}
          onChange={val => onChange({ cs2Size: val })}
          game="cs2"
        />
        <InputField
          label="GAP"
          value={preset.cs2Gap}
          onChange={val => onChange({ cs2Gap: val })}
          game="cs2"
        />
        <InputField
          label="THICKNESS"
          value={preset.cs2Thickness}
          onChange={val => onChange({ cs2Thickness: val })}
          game="cs2"
        />
        <InputField
          label="STYLE"
          value={preset.cs2Style}
          onChange={val => onChange({ cs2Style: val })}
          game="cs2"
        />
        <SwitchGroup
          label="DRAWOUTLINE"
          value={preset.cs2DrawOutline}
          onChange={val => onChange({ cs2DrawOutline: val })}
          states={['Off', 'On']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="DOT"
          value={preset.cs2Dot}
          onChange={val => onChange({ cs2Dot: val })}
          states={['Off', 'On']}
          hasPlusButton={true}
        />
        <InputField
          label="COLOR"
          value={preset.cs2Color}
          onChange={val => onChange({ cs2Color: val })}
          game="cs2"
        />
        <InputField
          label="ALPHA"
          value={preset.cs2Alpha}
          onChange={val => onChange({ cs2Alpha: val })}
          game="cs2"
        />
        <div className="flex items-center justify-between py-1.5 border-b border-white/[0.01]">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">BLUE, GREEN, RED</span>
          <div className="flex items-center">
            <input
              type="text"
              value={preset.cs2BlueGreenRed}
              onChange={e => onChange({ cs2BlueGreenRed: e.target.value })}
              className="w-44 bg-[#1B1B22] border border-white/[0.06] focus:border-[#FEEF3C] text-white rounded-lg px-3 py-2 text-xs text-left outline-none font-mono transition-all"
            />
            <button type="button" className="w-8 h-8 border border-white/[0.06] hover:border-white/15 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/40 ml-2 transition-all">
              <Plus size={12} />
            </button>
          </div>
        </div>
        <InputField
          label="SNIPER WIDTH"
          value={preset.cs2SniperWidth}
          onChange={val => onChange({ cs2SniperWidth: val })}
          game="cs2"
        />
        <SwitchGroup
          label="FOLLOW RECOIL"
          value={preset.cs2FollowRecoil}
          onChange={val => onChange({ cs2FollowRecoil: val })}
          states={['No', 'Yes']}
          hasPlusButton={true}
        />
        <InputField
          label="CROSSHAIR CODE"
          value={preset.code}
          onChange={val => onChange({ code: val })}
          game="cs2"
          isLast={true}
        />
      </CardContainer>

      {/* VIEWMODEL CARD */}
      <CardContainer title="VIEWMODEL" icon={Hand} onButtonClick={() => {}}>
        <InputField
          label="HUD SCALE"
          value={preset.cs2HudScale}
          onChange={val => onChange({ cs2HudScale: val })}
          game="cs2"
        />
        <InputField
          label="FOV"
          value={preset.cs2ViewmodelFov}
          onChange={val => onChange({ cs2ViewmodelFov: val })}
          game="cs2"
        />
        <InputField
          label="OFFSET X"
          value={preset.cs2ViewmodelOffsetX}
          onChange={val => onChange({ cs2ViewmodelOffsetX: val })}
          game="cs2"
        />
        <InputField
          label="OFFSET Y"
          value={preset.cs2ViewmodelOffsetY}
          onChange={val => onChange({ cs2ViewmodelOffsetY: val })}
          game="cs2"
        />
        <InputField
          label="OFFSET Z"
          value={preset.cs2ViewmodelOffsetZ}
          onChange={val => onChange({ cs2ViewmodelOffsetZ: val })}
          game="cs2"
        />
        <SwitchGroup
          label="PRESET POS"
          value={preset.cs2ViewmodelPresetPos}
          onChange={val => onChange({ cs2ViewmodelPresetPos: val })}
          states={['1', '2', '3']}
          hasPlusButton={true}
          isLast={true}
        />
      </CardContainer>

      {/* RADAR CARD */}
      <div className="bg-[#15151A]/40 border border-white/[0.04] p-5 rounded-2xl space-y-4 relative animate-scale-in">
        <button
          type="button"
          className="absolute -left-12 top-6 w-8 h-8 rounded-full bg-[#1A1A22] border border-white/10 hover:border-red-500/20 hover:bg-red-500/5 flex items-center justify-center text-white/40 hover:text-red-500 transition-all shadow-lg animate-scale-in"
          title="Удалить секцию"
        >
          <Trash2 size={13} />
        </button>

        <div className="flex items-center gap-3 bg-[#1A1A22]/50 border border-white/[0.06] px-4 py-2.5 rounded-xl">
          <div className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center text-white/50 border border-white/[0.06]">
            <Radio size={11} />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-sans">RADAR</span>
        </div>

        <div className="space-y-3.5 pt-1">
          <SwitchGroup
            label="RADAR CENTERS THE PLAYER"
            value={preset.cs2RadarCentersPlayer}
            onChange={val => onChange({ cs2RadarCentersPlayer: val })}
            states={['Yes', 'No']}
            hasPlusButton={true}
          />
          <SwitchGroup
            label="RADAR IS ROTATING"
            value={preset.cs2RadarIsRotating}
            onChange={val => onChange({ cs2RadarIsRotating: val })}
            states={['Yes', 'No']}
            hasPlusButton={true}
          />
          <InputField
            label="RADAR HUD SIZE"
            value={preset.cs2RadarHudSize}
            onChange={val => onChange({ cs2RadarHudSize: val })}
            game="cs2"
          />
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.01] relative">
            <button
              type="button"
              className="absolute -left-12 top-1.5 w-8 h-8 rounded-full bg-[#1A1A22] border border-white/10 hover:border-red-500/20 hover:bg-red-500/5 flex items-center justify-center text-white/40 hover:text-red-500 transition-all shadow-lg animate-scale-in"
              title="Удалить поле"
            >
              <Trash2 size={13} />
            </button>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">RADAR MAP ZOOM</span>
            <input
              type="text"
              value={preset.cs2RadarMapZoom}
              onChange={e => onChange({ cs2RadarMapZoom: e.target.value })}
              className="w-44 bg-[#1B1B22] border border-white/[0.06] focus:border-[#FEEF3C] text-white rounded-lg px-3 py-2 text-xs text-left outline-none font-mono transition-all"
            />
          </div>
          <SwitchGroup
            label="TOOGLE SHAPE WITH SCOREBOARD"
            value={preset.cs2RadarToggleShape}
            onChange={val => onChange({ cs2RadarToggleShape: val })}
            states={['Yes', 'No']}
            hasPlusButton={true}
            isLast={true}
          />
        </div>

        <button type="button" className="w-full py-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] rounded-xl text-[9px] font-medium tracking-wide text-white/35 hover:text-white/60 transition-all mt-2">
          Add a setting field
        </button>
      </div>

      {/* LAUNCH OPTIONS CARD */}
      <CardContainer title="LAUNCH OPTIONS" icon={Terminal} onButtonClick={() => {}}>
        <textarea
          value={preset.cs2LaunchOptions}
          onChange={e => onChange({ cs2LaunchOptions: e.target.value })}
          placeholder="e.g. -novid -tickrate 128..."
          rows={3}
          className="w-full bg-[#1B1B22] border border-white/[0.06] focus:border-[#FEEF3C] text-white rounded-lg p-3 text-xs outline-none font-mono resize-none placeholder-white/10 transition-all"
        />
      </CardContainer>

      {/* ADD SECTION BUTTON */}
      <button 
        type="button" 
        className="w-full py-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-medium tracking-wide text-white/40 hover:text-white transition-all animate-scale-in"
      >
        <Plus size={14} />
        Add a section
      </button>

      {/* Config File Upload Section */}
      <div className="space-y-3 mt-4 animate-scale-in">
        <div className="text-[10px] text-white/40 font-medium leading-relaxed px-1 text-left">
          Upload your config file to allow people to download them.<br />
          If you need to upload multiple config files, archive them into a .zip file.
        </div>
        
        <div className="border border-dashed border-white/10 hover:border-[#FEEF3C]/40 bg-white/[0.01] rounded-2xl p-8 flex flex-col items-center justify-center gap-3.5 transition-all cursor-pointer text-center group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-[#FEEF3C] transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div>
            <span className="text-[10px] font-black text-[#FEEF3C] uppercase tracking-widest block">Upload your config file/zip</span>
            <span className="text-[8px] text-white/20 font-medium block mt-1">File should be .cfg/.txt or .zip</span>
          </div>
        </div>
      </div>
    </>
  )
}
