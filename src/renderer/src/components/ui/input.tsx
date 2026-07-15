import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from '../../lib/utils'

export interface InputProps extends React.ComponentPropsWithoutRef<typeof InputPrimitive> {}

export const Input = React.forwardRef<HTMLElement, InputProps>(
  ({ className, ...props }, ref) => (
    <InputPrimitive
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-xl border border-white/[0.07] bg-black px-3.5 text-[11px] font-semibold text-white outline-none transition-colors placeholder:text-white/18 focus:border-white/20 focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
