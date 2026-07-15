import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function FieldLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/30', className)}>
      {children}
    </span>
  )
}

export function SectionLabel({ icon: Icon, children, className }: { icon: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/65', className)}>
      <Icon size={14} className="text-white/35" />
      {children}
    </div>
  )
}
