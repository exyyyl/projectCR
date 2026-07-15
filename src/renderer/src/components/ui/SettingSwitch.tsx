interface SettingSwitchProps {
  title: string
  checked: boolean
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
}

export function SettingSwitch({
  title,
  checked,
  disabled = false,
  onCheckedChange
}: SettingSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className="group flex h-16 w-full items-center justify-between gap-6 px-5 text-left outline-none transition-colors hover:bg-white/[0.025] focus-visible:bg-white/[0.035] disabled:cursor-wait disabled:opacity-50"
    >
      <span className="min-w-0 truncate text-[13px] font-bold text-white/80 transition-colors group-hover:text-white">
        {title}
      </span>

      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-all duration-200 ${
          checked
            ? 'border-white/70 bg-white shadow-[0_0_18px_rgba(255,255,255,0.1)]'
            : 'border-white/10 bg-white/[0.06]'
        }`}
      >
        <span
          className={`absolute top-1 size-3.5 rounded-full transition-transform duration-200 ${
            checked ? 'translate-x-[22px] bg-black' : 'translate-x-1 bg-white/45'
          }`}
        />
      </span>
    </button>
  )
}
