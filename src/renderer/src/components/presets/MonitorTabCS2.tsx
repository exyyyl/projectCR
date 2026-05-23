import React from 'react'
import { Monitor, Plus } from 'lucide-react'
import { CardContainer } from '../ui/CardContainer'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { PresetFormState } from '../../config/presetSchemas'

interface MonitorTabCS2Props {
  preset: PresetFormState
  onChange: (update: Partial<PresetFormState>) => void
}

export const MonitorTabCS2: React.FC<MonitorTabCS2Props> = ({
  preset,
  onChange
}) => {
  return (
    <>
      {/* COLOR SETTINGS CARD */}
      <CardContainer title="COLOR SETTINGS" icon={Monitor} onButtonClick={() => {}}>
        <SelectField
          label="MODE"
          value={preset.monitorMode}
          onChange={val => onChange({ monitorMode: val })}
          options={['FPS1', 'FPS2', 'FPS3', 'Gamer1', 'Gamer2', 'Gamer3', 'Movie', 'Standard']}
          game="cs2"
        />
        <InputField
          label="BLACK EQUALIZER"
          value={preset.blackEqualizer}
          onChange={val => onChange({ blackEqualizer: val })}
          game="cs2"
        />
        <InputField
          label="COLOR VIBRANCE"
          value={preset.colorVibrance}
          onChange={val => onChange({ colorVibrance: val })}
          game="cs2"
        />
        <InputField
          label="LOW BLUE LIGHT"
          value={preset.lowBlueLight}
          onChange={val => onChange({ lowBlueLight: val })}
          game="cs2"
        />
        <SelectField
          label="GAMMA"
          value={preset.monitorGamma}
          onChange={val => onChange({ monitorGamma: val })}
          options={['Gamma 1', 'Gamma 2', 'Gamma 3', 'Gamma 4', 'Gamma 5']}
          game="cs2"
        />
        <SelectField
          label="COLOR TEMPERATURE"
          value={preset.colorTemperature}
          onChange={val => onChange({ colorTemperature: val })}
          options={['Normal', 'Bluish', 'Reddish', 'User Define']}
          game="cs2"
          isLast={true}
        />
      </CardContainer>

      {/* PICTURE CARD */}
      <CardContainer title="PICTURE" icon={Monitor} onButtonClick={() => {}}>
        <SelectField
          label="DYAC+"
          value={preset.dyac}
          onChange={val => onChange({ dyac: val })}
          options={['Off', 'High', 'Premium']}
          game="cs2"
        />
        <InputField
          label="BRIGHTNESS"
          value={preset.brightness}
          onChange={val => onChange({ brightness: val })}
          game="cs2"
        />
        <InputField
          label="CONTRAST"
          value={preset.contrast}
          onChange={val => onChange({ contrast: val })}
          game="cs2"
        />
        <InputField
          label="SHARPNESS"
          value={preset.sharpness}
          onChange={val => onChange({ sharpness: val })}
          game="cs2"
        />
        <SelectField
          label="AMA"
          value={preset.ama}
          onChange={val => onChange({ ama: val })}
          options={['Off', 'High', 'Premium']}
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
