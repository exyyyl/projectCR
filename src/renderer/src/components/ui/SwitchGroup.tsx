import React from 'react'
import { Plus } from 'lucide-react'

interface SwitchState {
  value: string
  label: string
}

interface SwitchGroupProps {
  label: string
  value: string
  onChange: (value: string) => void
  states: string[] | SwitchState[]
  hasPlusButton?: boolean
  onPlusClick?: () => void
  isLast?: boolean
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  label,
  value,
  onChange,
  states,
  hasPlusButton = false,
  onPlusClick,
  isLast = false
}) => {
  const normalizedStates: SwitchState[] = states.map(state => 
    typeof state === 'string' ? { value: state, label: state } : state
  )

  return (
    <div className={`flex items-center justify-between py-1.5 ${!isLast ? 'border-b border-white/[0.01]' : ''}`}>
      <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">{label}</span>
      <div className="flex items-center">
        <div className="flex rounded-lg overflow-hidden border border-white/[0.08] p-0.5 bg-[#1B1B22]">
          {normalizedStates.map(state => {
            const isActive = value === state.value
            return (
              <button
                key={state.value}
                type="button"
                onClick={() => onChange(state.value)}
                className={`w-16 py-1 text-[8px] font-black uppercase rounded-md transition-all
                  ${isActive
                    ? 'bg-white/15 text-white border border-white/5 shadow-md'
                    : 'text-white/20 hover:text-white/40'
                  }`}
              >
                {state.label}
              </button>
            )
          })}
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
