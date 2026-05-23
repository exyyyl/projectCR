import React from 'react'
import { ChevronDown, Plus } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[] | SelectOption[]
  game?: 'cs2' | 'valorant'
  hasPlusButton?: boolean
  onPlusClick?: () => void
  isLast?: boolean
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  game = 'valorant',
  hasPlusButton = true,
  onPlusClick,
  isLast = false
}) => {
  const isCS2 = game === 'cs2'
  
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  return (
    <div className={`flex items-center justify-between py-1.5 ${!isLast ? 'border-b border-white/[0.01]' : ''}`}>
      <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">{label}</span>
      <div className="flex items-center">
        <div className="relative flex items-center">
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`w-44 bg-[#1B1B22] border border-white/[0.06] text-white rounded-lg px-3 py-2 text-xs outline-none cursor-pointer appearance-none pr-8 relative transition-all
              ${isCS2 
                ? 'focus:border-[#FEEF3C] text-left' 
                : 'focus:border-white/15 text-right'
              }`}
          >
            {normalizedOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#16161C] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 text-white/30 pointer-events-none" />
        </div>
        {hasPlusButton && (
          <button 
            type="button" 
            onClick={onPlusClick}
            className="w-8 h-8 border border-white/[0.06] hover:border-white/15 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/40 ml-2 transition-all"
          >
            <Plus size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
