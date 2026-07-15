import { Select } from '@base-ui/react/select'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface LineupSelectOption<T extends string> {
  value: T
  label: string
}

interface LineupSelectProps<T extends string> {
  value: T
  options: ReadonlyArray<LineupSelectOption<T>>
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}

export function LineupSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className
}: LineupSelectProps<T>) {
  return (
    <Select.Root
      value={value}
      items={options}
      onValueChange={(nextValue) => {
        if (nextValue !== null) onChange(nextValue as T)
      }}
      modal={false}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        className={cn(
          'group flex h-12 w-full items-center justify-between gap-3 rounded-[14px] border border-white/[0.075] bg-[#0B0C0C] px-4 text-left text-[12px] font-semibold text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] outline-none transition-[border-color,background-color,color,box-shadow] duration-200 hover:border-white/[0.14] hover:bg-[#0E0F0F] hover:text-white focus-visible:ring-2 focus-visible:ring-[#C7F5E5]/30 data-[popup-open]:border-[#C7F5E5]/25 data-[popup-open]:bg-[#101111] data-[popup-open]:text-white data-[popup-open]:shadow-[0_0_0_1px_rgba(199,245,229,0.04)]',
          className
        )}
      >
        <Select.Value className="truncate" />
        <Select.Icon className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.055] bg-white/[0.025] text-white/28 transition-colors group-data-[popup-open]:border-[#C7F5E5]/15 group-data-[popup-open]:bg-[#C7F5E5]/[0.06] group-data-[popup-open]:text-[#C7F5E5]/75">
          <ChevronsUpDown size={13} strokeWidth={2.1} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner side="bottom" align="start" sideOffset={8} alignItemWithTrigger={false} className="z-[210]">
          <Select.Popup className="max-h-64 min-w-[var(--anchor-width)] overflow-hidden rounded-2xl border border-white/[0.095] bg-[#0C0D0D]/[0.98] p-1.5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.82)] outline-none backdrop-blur-xl animate-select-in">
            <Select.List className="custom-scrollbar max-h-60 space-y-0.5 overflow-y-auto">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex min-h-10 cursor-default items-center justify-between gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-[11px] font-semibold text-white/48 outline-none transition-[background-color,color] duration-150 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-[#C7F5E5] before:opacity-0 data-[highlighted]:bg-white/[0.05] data-[highlighted]:text-white/90 data-[selected]:bg-[#C7F5E5]/[0.065] data-[selected]:pl-3.5 data-[selected]:text-[#E8FFF7] data-[selected]:before:opacity-100"
                >
                  <Select.ItemText className="truncate">{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[#C7F5E5]/12 bg-[#C7F5E5]/[0.07] text-[#C7F5E5]">
                    <Check size={12} strokeWidth={2.7} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
