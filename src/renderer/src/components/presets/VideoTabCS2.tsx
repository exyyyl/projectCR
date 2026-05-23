import React from 'react'
import { Monitor, Cpu, Plus } from 'lucide-react'
import { CardContainer } from '../ui/CardContainer'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { SwitchGroup } from '../ui/SwitchGroup'
import { PresetFormState } from '../../config/presetSchemas'

interface VideoTabCS2Props {
  preset: PresetFormState
  onChange: (update: Partial<PresetFormState>) => void
}

export const VideoTabCS2: React.FC<VideoTabCS2Props> = ({
  preset,
  onChange
}) => {
  return (
    <>
      {/* VIDEO CARD */}
      <CardContainer title="VIDEO" icon={Monitor} onButtonClick={() => {}}>
        {/* RESOLUTION */}
        <div className="flex items-center justify-between py-1.5 border-b border-white/[0.01]">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">RESOLUTION</span>
          <div className="flex items-center">
            <input
              type="text"
              value={preset.resolutionWidth}
              onChange={e => onChange({ resolutionWidth: e.target.value })}
              className="w-20 bg-[#1B1B22] border border-white/[0.06] focus:border-[#FEEF3C] text-white rounded-lg px-2.5 py-2 text-xs text-left outline-none font-mono transition-all"
              placeholder="1920"
            />
            <span className="text-[10px] text-white/30 font-bold mx-2">x</span>
            <input
              type="text"
              value={preset.resolutionHeight}
              onChange={e => onChange({ resolutionHeight: e.target.value })}
              className="w-20 bg-[#1B1B22] border border-white/[0.06] focus:border-[#FEEF3C] text-white rounded-lg px-2.5 py-2 text-xs text-left outline-none font-mono transition-all"
              placeholder="1080"
            />
          </div>
        </div>

        <SwitchGroup
          label="ASPECT RATIO"
          value={preset.aspectRatio}
          onChange={val => onChange({ aspectRatio: val })}
          states={['4:3', '16:9', '16:10']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="SCALING MODE"
          value={preset.scaling}
          onChange={val => onChange({ scaling: val })}
          states={[
            { value: 'black_bars', label: 'Black Bars' },
            { value: 'stretched', label: 'Stretched' }
          ]}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="COLOR MODE"
          value={preset.cs2ColorMode}
          onChange={val => onChange({ cs2ColorMode: val })}
          states={['Computer', 'TV']}
          hasPlusButton={true}
        />
        <InputField
          label="BRIGHTNESS"
          value={preset.cs2VideoBrightness}
          onChange={val => onChange({ cs2VideoBrightness: val })}
          placeholder="e.g. 80%"
          game="cs2"
        />
        <SwitchGroup
          label="DISPLAY MODE"
          value={preset.displayMode}
          onChange={val => onChange({ displayMode: val })}
          states={['Fullscreen', 'Windowed']}
          hasPlusButton={true}
        />
        <SelectField
          label="REFRESH RATE"
          value={preset.monitorHz}
          onChange={val => onChange({ monitorHz: val })}
          options={['60', '144', '240', '360', '540']}
          game="cs2"
          isLast={true}
        />
      </CardContainer>

      {/* ADVANCED VIDEO CARD */}
      <CardContainer title="ADVANCED VIDEO" icon={Cpu} onButtonClick={() => {}}>
        <SwitchGroup
          label="BOOST PLAYER CONTRAST"
          value={preset.cs2BoostPlayerContrast}
          onChange={val => onChange({ cs2BoostPlayerContrast: val })}
          states={['Disabled', 'Enabled']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="WAIT FOR VERTICAL SYNC"
          value={preset.cs2Vsync}
          onChange={val => onChange({ cs2Vsync: val })}
          states={['Disabled', 'Enabled']}
          hasPlusButton={true}
        />
        <SelectField
          label="MULTISAMPLING ANTI-ALIASING MODE"
          value={preset.cs2Msaa}
          onChange={val => onChange({ cs2Msaa: val })}
          options={['None', '2x MSAA', '4x MSAA', '8x MSAA']}
          game="cs2"
        />
        <SelectField
          label="TEXTURE FILTERING MODE"
          value={preset.cs2TextureFiltering}
          onChange={val => onChange({ cs2TextureFiltering: val })}
          options={['Bilinear', 'Trilinear', 'Anisotropic 2x', 'Anisotropic 4x', 'Anisotropic 8x', 'Anisotropic 16x']}
          game="cs2"
        />
        <SelectField
          label="GLOBAL SHADOW QUALITY"
          value={preset.cs2ShadowQuality}
          onChange={val => onChange({ cs2ShadowQuality: val })}
          options={['Very Low', 'Low', 'Medium', 'High', 'Very High']}
          game="cs2"
        />
        <SelectField
          label="MODEL / TEXTURE DETAIL"
          value={preset.cs2ModelTextureDetail}
          onChange={val => onChange({ cs2ModelTextureDetail: val })}
          options={['Low', 'Medium', 'High']}
          game="cs2"
        />
        <SwitchGroup
          label="SHADER DETAIL"
          value={preset.cs2ShaderDetail}
          onChange={val => onChange({ cs2ShaderDetail: val })}
          states={['Low', 'High']}
          hasPlusButton={true}
        />
        <SelectField
          label="PARTICLE DETAIL"
          value={preset.cs2ParticleDetail}
          onChange={val => onChange({ cs2ParticleDetail: val })}
          options={['Low', 'Medium', 'High']}
          game="cs2"
        />
        <SwitchGroup
          label="AMBIENT OCCLUSION"
          value={preset.cs2AmbientOcclusion}
          onChange={val => onChange({ cs2AmbientOcclusion: val })}
          states={['Disabled', 'Medium', 'High']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="HIGH DYNAMIC RANGE"
          value={preset.cs2Hdr}
          onChange={val => onChange({ cs2Hdr: val })}
          states={['Performance', 'Quality']}
          hasPlusButton={true}
        />
        <SelectField
          label="FIDELITYFX SUPER RESOLUTION"
          value={preset.cs2FidelityFxFsr}
          onChange={val => onChange({ cs2FidelityFxFsr: val })}
          options={['Disabled (Highest Quality)', 'Ultra Quality', 'Quality', 'Balanced', 'Performance']}
          game="cs2"
        />
        <SelectField
          label="NVIDIA REFLEX LOW LATENCY"
          value={preset.cs2NvidiaReflex}
          onChange={val => onChange({ cs2NvidiaReflex: val })}
          options={['Disabled', 'Enabled', 'Enabled + Boost']}
          game="cs2"
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
      <div className="space-y-4 mt-6 animate-scale-in">
        <p className="text-[10px] text-white/40 leading-relaxed font-medium text-left">
          Upload your config file to allow people to download them.<br />
          If you need to upload multiple config files, archive them into a .zip file.
        </p>
        
        <div className="border border-dashed border-white/10 hover:border-[#FEEF3C]/20 bg-white/[0.01] hover:bg-[#FEEF3C]/[0.01] rounded-2xl p-8 flex flex-col items-center justify-center gap-3.5 transition-all duration-300 cursor-pointer text-center group min-h-[140px]">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-[#FEEF3C] group-hover:bg-[#FEEF3C]/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 9 9m-9-9v13.5" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-black text-[#FEEF3C] transition-colors tracking-widest block">Upload your config file/zip</span>
            <span className="text-[9px] text-white/30 font-semibold block mt-1 leading-none">File should be .cfg/.txt or .zip</span>
          </div>
        </div>
      </div>
    </>
  )
}
