import * as React from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: React.ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cn('overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808]', className)}
      {...props}
    />
  )
}

export function CardSeparator({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mx-5 h-px bg-white/[0.055]', className)} {...props} />
}
