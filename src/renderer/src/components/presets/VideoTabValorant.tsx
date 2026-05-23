import React from 'react'
import { Monitor, Cpu, Settings, Plus } from 'lucide-react'
import { CardContainer } from '../ui/CardContainer'
import { SelectField } from '../ui/SelectField'
import { SwitchGroup } from '../ui/SwitchGroup'
import { PresetFormState } from '../../config/presetSchemas'

interface VideoTabValorantProps {
  preset: PresetFormState
  onChange: (update: Partial<PresetFormState>) => void
}

export const VideoTabValorant: React.FC<VideoTabValorantProps> = ({
  preset,
  onChange
}) => {
  return (
    <>
      {/* DISPLAY CARD */}
      <CardContainer title="DISPLAY" icon={Monitor} onButtonClick={() => {}}>
        {/* RESOLUTION */}
        <div className="flex items-center justify-between py-1.5 border-b border-white/[0.01]">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">RESOLUTION</span>
          <div className="flex items-center">
            <input
              type="number"
              value={preset.resolutionWidth}
              onChange={e => onChange({ resolutionWidth: e.target.value })}
              className="w-20 bg-[#1B1B22] border border-white/[0.06] focus:border-white/15 text-white rounded-lg px-2.5 py-2 text-xs text-center outline-none font-mono"
              placeholder="1920"
            />
            <span className="text-[10px] text-white/30 font-bold mx-2">x</span>
            <input
              type="number"
              value={preset.resolutionHeight}
              onChange={e => onChange({ resolutionHeight: e.target.value })}
              className="w-20 bg-[#1B1B22] border border-white/[0.06] focus:border-white/15 text-white rounded-lg px-2.5 py-2 text-xs text-center outline-none font-mono"
              placeholder="1080"
            />
          </div>
        </div>

        <SwitchGroup
          label="DISPLAY MODE"
          value={preset.displayMode}
          onChange={val => onChange({ displayMode: val })}
          states={['Fullscreen', 'Windowed']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="ASPECT RATIO"
          value={preset.aspectRatio}
          onChange={val => onChange({ aspectRatio: val })}
          states={['4:3', '16:9', '16:10']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="ASPECT RATIO METHOD"
          value={preset.aspectRatioMethod}
          onChange={val => onChange({ aspectRatioMethod: val })}
          states={['Letterbox', 'Fill']}
          hasPlusButton={true}
        />
        <SelectField
          label="ENEMY HIGHLIGHT COLOR"
          value={preset.enemyHighlightColor}
          onChange={val => onChange({ enemyHighlightColor: val })}
          options={['Red', 'Purple', 'Yellow (Deuteranopia)', 'Yellow (Protanopia)']}
          game="valorant"
          isLast={true}
        />
      </CardContainer>

      {/* PERFORMANCE CARD */}
      <CardContainer title="PERFORMANCE" icon={Cpu} onButtonClick={() => {}}>
        <SwitchGroup
          label="MULTITHREADED RENDERING"
          value={preset.multithreaded}
          onChange={val => onChange({ multithreaded: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="MATERIAL QUALITY"
          value={preset.materialQuality}
          onChange={val => onChange({ materialQuality: val })}
          states={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Med' },
            { value: 'low', label: 'Low' }
          ]}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="TEXTURE QUALITY"
          value={preset.textureQuality}
          onChange={val => onChange({ textureQuality: val })}
          states={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Med' },
            { value: 'low', label: 'Low' }
          ]}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="DETAIL QUALITY"
          value={preset.detailQuality}
          onChange={val => onChange({ detailQuality: val })}
          states={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Med' },
            { value: 'low', label: 'Low' }
          ]}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="UI QUALITY"
          value={preset.uiQuality}
          onChange={val => onChange({ uiQuality: val })}
          states={[
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Med' },
            { value: 'low', label: 'Low' }
          ]}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="VIGNETTE"
          value={preset.vignette}
          onChange={val => onChange({ vignette: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="VSYNC"
          value={preset.vsync}
          onChange={val => onChange({ vsync: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SelectField
          label="NVIDIA REFLEX LOW LATENCY"
          value={preset.nvidiaReflex}
          onChange={val => onChange({ nvidiaReflex: val })}
          options={['Off', 'On', 'On + Boost']}
          game="valorant"
          isLast={true}
        />
      </CardContainer>

      {/* QUALITY CARD */}
      <CardContainer title="QUALITY" icon={Settings} onButtonClick={() => {}}>
        <SelectField
          label="ANTI-ALIASING"
          value={preset.aa}
          onChange={val => onChange({ aa: val })}
          options={['None', '2x MSAA', '4x MSAA', '8x MSAA', 'FXAA']}
          game="valorant"
        />
        <SelectField
          label="ANISOTROPIC FILTERING"
          value={preset.anisotropicFiltering}
          onChange={val => onChange({ anisotropicFiltering: val })}
          options={[
            { value: '1x', label: '1x (Bilinear)' },
            { value: '2x', label: '2x' },
            { value: '4x', label: '4x' },
            { value: '8x', label: '8x' },
            { value: '16x', label: '16x' }
          ]}
          game="valorant"
        />
        <SwitchGroup
          label="IMPROVE CLARITY"
          value={preset.improveClarity}
          onChange={val => onChange({ improveClarity: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="EXPERIMENTAL SHARPENING"
          value={preset.experimentalSharpening}
          onChange={val => onChange({ experimentalSharpening: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="BLOOM"
          value={preset.bloom}
          onChange={val => onChange({ bloom: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="DISTORTION"
          value={preset.distortion}
          onChange={val => onChange({ distortion: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="CAST SHADOWS"
          value={preset.castShadows}
          onChange={val => onChange({ castShadows: val })}
          states={['on', 'off']}
          hasPlusButton={true}
          isLast={true}
        />
      </CardContainer>

      {/* ADD SECTION BUTTON */}
      <button 
        type="button" 
        className="w-full py-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-white/40 hover:text-white transition-all"
      >
        <Plus size={14} />
        Add a section
      </button>

      {/* Config File Upload Section */}
      <div className="bg-[#15151A]/40 border border-white/[0.04] p-5 rounded-2xl space-y-4 animate-scale-in">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest text-left">Upload config file</div>
        
        <div className="border border-dashed border-white/10 hover:border-[#FEEF3C]/20 bg-white/[0.01] hover:bg-[#FEEF3C]/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer text-center group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-[#FEEF3C] transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div>
            <span className="text-[10px] font-black text-white group-hover:text-[#FEEF3C] transition-colors tracking-widest block">Upload your config file/zip</span>
            <span className="text-[8px] text-white/20 font-medium block mt-1">File should be .cfg/.txt or .zip</span>
          </div>
        </div>
      </div>
    </>
  )
}
