import React from 'react'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  game?: 'cs2' | 'valorant'
  isLast?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  game = 'valorant',
  isLast = false
}) => {
  const isCS2 = game === 'cs2'
  return (
    <div className={`flex items-center justify-between py-1.5 ${!isLast ? 'border-b border-white/[0.01]' : ''}`}>
      <span className="text-[9px] font-black text-white/40 uppercase tracking-wider">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-44 bg-[#1B1B22] border border-white/[0.06] text-white rounded-lg px-3 py-2 text-xs outline-none font-mono placeholder-white/10 transition-all
          ${isCS2 
            ? 'focus:border-[#FEEF3C] text-left' 
            : 'focus:border-white/15 text-right'
          }`}
      />
    </div>
  )
}
