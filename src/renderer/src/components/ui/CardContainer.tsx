import React from 'react'
import { LucideIcon } from 'lucide-react'

interface CardContainerProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  buttonText?: string
  onButtonClick?: () => void
}

export const CardContainer: React.FC<CardContainerProps> = ({
  title,
  icon: Icon,
  children,
  buttonText = 'Add a setting field',
  onButtonClick
}) => {
  return (
    <div className="bg-[#15151A]/40 border border-white/[0.04] p-5 rounded-2xl space-y-4 animate-scale-in">
      {/* High-tech Header bar */}
      <div className="flex items-center gap-3 bg-[#1A1A22]/50 border border-white/[0.06] px-4 py-2.5 rounded-xl">
        <div className="w-6 h-6 rounded bg-white/[0.04] flex items-center justify-center text-white/50 border border-white/[0.06]">
          <Icon size={11} />
        </div>
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-sans">
          {title}
        </span>
      </div>

      {/* Card Content body */}
      <div className="space-y-3.5 pt-1">
        {children}
      </div>

      {/* Card Bottom Button (Standard Sentence Case) */}
      {onButtonClick && (
        <button 
          type="button" 
          onClick={onButtonClick}
          className="w-full py-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] hover:border-white/[0.08] rounded-xl text-[9px] font-black tracking-widest text-white/35 hover:text-white/60 transition-all mt-2"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}
