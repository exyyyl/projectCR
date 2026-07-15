import * as React from 'react'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] outline-none transition-[color,background-color,border-color,transform,opacity] focus-visible:ring-2 focus-visible:ring-white/35 disabled:pointer-events-none disabled:opacity-35',
  {
    variants: {
      variant: {
        default: 'border border-white bg-white text-black shadow-[0_8px_20px_rgba(255,255,255,0.05)] hover:bg-white/90',
        secondary: 'border border-white/[0.08] bg-white/[0.035] text-white/60 hover:border-white/[0.14] hover:bg-white/[0.065] hover:text-white',
        ghost: 'border border-transparent bg-transparent text-white/35 hover:bg-white/[0.055] hover:text-white',
        destructive: 'border border-red-400/15 bg-red-400/[0.07] text-red-300/70 hover:border-red-400/25 hover:bg-red-400/[0.12] hover:text-red-300',
        valorant: 'border border-[#FF4655] bg-[#FF4655] text-white hover:bg-[#FF5B68]',
        cs2: 'border border-[#E8A530] bg-[#E8A530] text-black hover:bg-[#F0B340]'
      },
      size: {
        sm: 'h-9 rounded-lg px-3',
        default: 'h-10 px-4',
        lg: 'h-11 px-5',
        icon: 'size-10 p-0',
        'icon-sm': 'size-8 rounded-lg p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof ButtonPrimitive>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <ButtonPrimitive
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'
