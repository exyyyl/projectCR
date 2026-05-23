import React from 'react'
import { Monitor, Plus } from 'lucide-react'
import { CardContainer } from '../ui/CardContainer'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { SwitchGroup } from '../ui/SwitchGroup'
import { PresetFormState } from '../../config/presetSchemas'

interface MonitorTabValorantProps {
  preset: PresetFormState
  onChange: (update: Partial<PresetFormState>) => void
}

export const MonitorTabValorant: React.FC<MonitorTabValorantProps> = ({
  preset,
  onChange
}) => {
  return (
    <>
      {/* General Monitor Setup */}
      <CardContainer title="MONITOR" icon={Monitor} onButtonClick={() => {}}>
        <InputField
          label="Monitor Model"
          value={preset.monitorModel}
          onChange={val => onChange({ monitorModel: val })}
          placeholder="e.g. Zowie XL2546K..."
          game="valorant"
        />
        <InputField
          label="Resolution"
          value={preset.resolution}
          onChange={val => onChange({ resolution: val })}
          game="valorant"
        />
        <InputField
          label="Refresh Rate"
          value={preset.monitorHz}
          onChange={val => onChange({ monitorHz: val })}
          game="valorant"
        />
        <SwitchGroup
          label="Scaling Mode"
          value={preset.scaling}
          onChange={val => onChange({ scaling: val })}
          states={[
            { value: 'native', label: 'native' },
            { value: 'stretched', label: 'stretched' },
            { value: 'black_bars', label: 'Bars' }
          ]}
          isLast={true}
        />
      </CardContainer>

      {/* COLOR SETTINGS CARD */}
      <CardContainer title="COLOR SETTINGS" icon={Monitor} onButtonClick={() => {}}>
        <SelectField
          label="MODE"
          value={preset.monitorMode}
          onChange={val => onChange({ monitorMode: val })}
          options={['FPS1', 'FPS2', 'FPS3', 'Gamer1', 'Gamer2', 'Gamer3', 'Movie', 'Standard']}
          game="valorant"
        />
        <InputField
          label="BLACK EQUALIZER"
          value={preset.blackEqualizer}
          onChange={val => onChange({ blackEqualizer: val })}
          game="valorant"
        />
        <InputField
          label="COLOR VIBRANCE"
          value={preset.colorVibrance}
          onChange={val => onChange({ colorVibrance: val })}
          game="valorant"
        />
        <InputField
          label="LOW BLUE LIGHT"
          value={preset.lowBlueLight}
          onChange={val => onChange({ lowBlueLight: val })}
          game="valorant"
        />
        <SelectField
          label="GAMMA"
          value={preset.monitorGamma}
          onChange={val => onChange({ monitorGamma: val })}
          options={['Gamma 1', 'Gamma 2', 'Gamma 3', 'Gamma 4', 'Gamma 5']}
          game="valorant"
        />
        <SelectField
          label="COLOR TEMPERATURE"
          value={preset.colorTemperature}
          onChange={val => onChange({ colorTemperature: val })}
          options={['Normal', 'Bluish', 'Reddish', 'User Define']}
          game="valorant"
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
          game="valorant"
        />
        <InputField
          label="BRIGHTNESS"
          value={preset.brightness}
          onChange={val => onChange({ brightness: val })}
          game="valorant"
        />
        <InputField
          label="CONTRAST"
          value={preset.contrast}
          onChange={val => onChange({ contrast: val })}
          game="valorant"
        />
        <InputField
          label="SHARPNESS"
          value={preset.sharpness}
          onChange={val => onChange({ sharpness: val })}
          game="valorant"
        />
        <SelectField
          label="AMA"
          value={preset.ama}
          onChange={val => onChange({ ama: val })}
          options={['Off', 'High', 'Premium']}
          game="valorant"
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
