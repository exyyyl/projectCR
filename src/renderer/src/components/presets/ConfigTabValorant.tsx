import React from 'react'
import { Gamepad2, MousePointer, Target, Keyboard, Map, Plus } from 'lucide-react'
import { CardContainer } from '../ui/CardContainer'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { SwitchGroup } from '../ui/SwitchGroup'
import { PresetFormState } from '../../config/presetSchemas'

interface ConfigTabValorantProps {
  preset: PresetFormState
  onChange: (update: Partial<PresetFormState>) => void
}

export const ConfigTabValorant: React.FC<ConfigTabValorantProps> = ({
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
          game="valorant"
          isLast={true}
        />
      </CardContainer>

      {/* MOUSE CARD */}
      <CardContainer title="MOUSE" icon={MousePointer} onButtonClick={() => {}}>
        <InputField
          label="DPI"
          value={preset.dpi}
          onChange={val => onChange({ dpi: val })}
          game="valorant"
        />
        <InputField
          label="Sensitivity"
          value={preset.sens}
          onChange={val => onChange({ sens: val })}
          game="valorant"
        />
        <InputField
          label="Scoped Sensitivity"
          value={preset.scopedSens}
          onChange={val => onChange({ scopedSens: val })}
          game="valorant"
        />
        <InputField
          label="HZ"
          value={preset.pollingRate}
          onChange={val => onChange({ pollingRate: val })}
          game="valorant"
        />
        <SwitchGroup
          label="Raw Input Buffer"
          value={preset.rawInput}
          onChange={val => onChange({ rawInput: val })}
          states={['on', 'off']}
          hasPlusButton={true}
          isLast={true}
        />
      </CardContainer>

      {/* CROSSHAIR CARD */}
      <CardContainer title="CROSSHAIR" icon={Target} onButtonClick={() => {}}>
        <InputField
          label="Crosshair Code"
          value={preset.code}
          onChange={val => onChange({ code: val })}
          placeholder="Paste aiming code..."
          game="valorant"
        />

        {/* SECTION SUB-SUB-HEADER: PRIMARY */}
        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest border-b border-white/[0.03] pb-1 pt-2 text-left">Primary</div>

        <SelectField
          label="Color"
          value={preset.color}
          onChange={val => onChange({ color: val })}
          options={['white', 'green', 'cyan', 'red', 'yellow']}
          game="valorant"
        />
        <InputField
          label="Crosshair Color"
          value={preset.crosshairColor}
          onChange={val => onChange({ crosshairColor: val })}
          game="valorant"
        />
        <SwitchGroup
          label="Outlines"
          value={preset.outlines}
          onChange={val => onChange({ outlines: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="Center Dot"
          value={preset.centerDot}
          onChange={val => onChange({ centerDot: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <InputField
          label="Center Dot Opacity"
          value={preset.centerDotOpacity}
          onChange={val => onChange({ centerDotOpacity: val })}
          game="valorant"
        />
        <InputField
          label="Center Dot Thickness"
          value={preset.centerDotThickness}
          onChange={val => onChange({ centerDotThickness: val })}
          game="valorant"
        />

        {/* SECTION SUB-SUB-HEADER: INNER LINES */}
        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest border-b border-white/[0.03] pb-1 pt-3 text-left">Inner Lines</div>

        <SwitchGroup
          label="Show Inner Lines"
          value={preset.showInnerLines}
          onChange={val => onChange({ showInnerLines: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <InputField
          label="Opacity"
          value={preset.innerLinesOpacity}
          onChange={val => onChange({ innerLinesOpacity: val })}
          game="valorant"
        />
        <InputField
          label="Length"
          value={preset.innerLinesLength}
          onChange={val => onChange({ innerLinesLength: val })}
          game="valorant"
        />
        <InputField
          label="Thickness"
          value={preset.innerLinesThickness}
          onChange={val => onChange({ innerLinesThickness: val })}
          game="valorant"
        />
        <InputField
          label="Offset"
          value={preset.innerLinesOffset}
          onChange={val => onChange({ innerLinesOffset: val })}
          game="valorant"
        />
        <SwitchGroup
          label="Movement Error"
          value={preset.innerLinesMovementError}
          onChange={val => onChange({ innerLinesMovementError: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="Firing Error"
          value={preset.innerLinesFiringError}
          onChange={val => onChange({ innerLinesFiringError: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <InputField
          label="Firing Error Multiplier"
          value={preset.innerLinesFiringErrorMultiplier}
          onChange={val => onChange({ innerLinesFiringErrorMultiplier: val })}
          game="valorant"
        />

        {/* SECTION SUB-SUB-HEADER: OUTER LINES */}
        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest border-b border-white/[0.03] pb-1 pt-3 text-left">Outer Lines</div>

        <SwitchGroup
          label="Show Outer Lines"
          value={preset.showOuterLines}
          onChange={val => onChange({ showOuterLines: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <InputField
          label="Opacity"
          value={preset.outerLinesOpacity}
          onChange={val => onChange({ outerLinesOpacity: val })}
          game="valorant"
        />
        <InputField
          label="Length"
          value={preset.outerLinesLength}
          onChange={val => onChange({ outerLinesLength: val })}
          game="valorant"
        />
        <InputField
          label="Thickness"
          value={preset.outerLinesThickness}
          onChange={val => onChange({ outerLinesThickness: val })}
          game="valorant"
        />
        <InputField
          label="Offset"
          value={preset.outerLinesOffset}
          onChange={val => onChange({ outerLinesOffset: val })}
          game="valorant"
        />
        <SwitchGroup
          label="Movement Error"
          value={preset.outerLinesMovementError}
          onChange={val => onChange({ outerLinesMovementError: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SwitchGroup
          label="Firing Error"
          value={preset.outerLinesFiringError}
          onChange={val => onChange({ outerLinesFiringError: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <InputField
          label="Firing Error Multiplier"
          value={preset.outerLinesFiringErrorMultiplier}
          onChange={val => onChange({ outerLinesFiringErrorMultiplier: val })}
          game="valorant"
          isLast={true}
        />
      </CardContainer>

      {/* KEYBINDS CARD */}
      <CardContainer title="KEYBINDS" icon={Keyboard} onButtonClick={() => {}}>
        <InputField label="Walk" value={preset.walk} onChange={val => onChange({ walk: val })} game="valorant" />
        <InputField label="Crouch" value={preset.crouch} onChange={val => onChange({ crouch: val })} game="valorant" />
        <InputField label="Jump" value={preset.jump} onChange={val => onChange({ jump: val })} game="valorant" />
        <InputField label="Use Object" value={preset.use} onChange={val => onChange({ use: val })} game="valorant" />
        <InputField label="Primary Weapon" value={preset.primaryWeapon} onChange={val => onChange({ primaryWeapon: val })} game="valorant" />
        <InputField label="Secondary Weapon" value={preset.secondaryWeapon} onChange={val => onChange({ secondaryWeapon: val })} game="valorant" />
        <InputField label="Melee Weapon" value={preset.meleeWeapon} onChange={val => onChange({ meleeWeapon: val })} game="valorant" />
        <InputField label="Equip Spike" value={preset.equipSpike} onChange={val => onChange({ equipSpike: val })} game="valorant" />
        <InputField label="Ability 1" value={preset.ability1} onChange={val => onChange({ ability1: val })} game="valorant" />
        <InputField label="Ability 2" value={preset.ability2} onChange={val => onChange({ ability2: val })} game="valorant" />
        <InputField label="Ability 3" value={preset.ability3} onChange={val => onChange({ ability3: val })} game="valorant" />
        <InputField label="Ultimate" value={preset.ultimate} onChange={val => onChange({ ultimate: val })} game="valorant" isLast={true} />
      </CardContainer>

      {/* MAP CARD */}
      <CardContainer title="MAP" icon={Map} onButtonClick={() => {}}>
        <SwitchGroup
          label="Rotate"
          value={preset.rotate}
          onChange={val => onChange({ rotate: val })}
          states={['rotate', 'fixed']}
          hasPlusButton={true}
        />
        <SelectField
          label="Fixed Orientation"
          value={preset.fixedOrientation}
          onChange={val => onChange({ fixedOrientation: val })}
          options={['always_align', 'keep_centered', 'fixed']}
          game="valorant"
        />
        <SwitchGroup
          label="Keep Player Centered"
          value={preset.keepCentered}
          onChange={val => onChange({ keepCentered: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <InputField
          label="Minimap Size"
          value={preset.minimapSize}
          onChange={val => onChange({ minimapSize: val })}
          game="valorant"
        />
        <InputField
          label="Minimap Zoom"
          value={preset.minimapZoom}
          onChange={val => onChange({ minimapZoom: val })}
          game="valorant"
        />
        <SwitchGroup
          label="Minimap Vision Cones"
          value={preset.minimapVisionCones}
          onChange={val => onChange({ minimapVisionCones: val })}
          states={['on', 'off']}
          hasPlusButton={true}
        />
        <SelectField
          label="Map Region Names"
          value={preset.mapRegionNames}
          onChange={val => onChange({ mapRegionNames: val })}
          options={['always', 'never']}
          game="valorant"
          isLast={true}
        />
      </CardContainer>

      {/* ADD SECTION BUTTON */}
      <button 
        type="button" 
        className="w-full py-3.5 bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-white/40 hover:text-white uppercase transition-all"
      >
        <Plus size={14} />
        Add a section
      </button>

      {/* Config File Upload Section */}
      <div className="bg-[#15151A]/40 border border-white/[0.04] p-5 rounded-2xl space-y-4 animate-scale-in">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest text-left">Upload config file</div>
        
        <div className="border border-dashed border-white/10 hover:border-white/20 bg-white/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer text-center group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-[#FEEF3C] transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div>
            <span className="text-[10px] font-black text-white group-hover:text-[#FEEF3C] transition-colors uppercase tracking-widest block">Upload your config file/zip</span>
            <span className="text-[8px] text-white/20 font-medium block mt-1">File should be .cfg/.txt or .zip</span>
          </div>
        </div>
      </div>
    </>
  )
}
