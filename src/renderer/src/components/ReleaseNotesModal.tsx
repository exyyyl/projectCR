import { useEffect, useState } from 'react'
import { Accordion, Dialog } from '@base-ui/react'
import { ChevronDown, X } from 'lucide-react'
import {
  CHANGELOG,
  type ChangelogItem,
  type ChangelogScope,
  type ChangelogSection
} from '../config/changelog'

const SECTION_META: Array<{
  value: ChangelogSection
  label: string
}> = [
  { value: 'new', label: 'Новое' },
  { value: 'fixed', label: 'Исправлено' },
  { value: 'changed', label: 'Изменено' },
  { value: 'improved', label: 'Улучшено' }
]

const SCOPE_META: Record<ChangelogScope, { label: string; className: string }> = {
  crosshairs: { label: 'Прицелы', className: 'border-sky-400/[0.18] bg-sky-400/[0.11] text-sky-200' },
  lineups: { label: 'Лайнапы', className: 'border-violet-400/[0.18] bg-violet-400/[0.11] text-violet-200' },
  ui: { label: 'UI', className: 'border-white/[0.12] bg-white/[0.07] text-white/[0.65]' },
  settings: { label: 'Настройки', className: 'border-amber-400/[0.18] bg-amber-400/[0.1] text-amber-200' },
  updates: { label: 'Обновления', className: 'border-emerald-400/[0.18] bg-emerald-400/[0.1] text-emerald-200' },
  data: { label: 'Данные', className: 'border-fuchsia-400/[0.18] bg-fuchsia-400/[0.1] text-fuchsia-200' },
  system: { label: 'Система', className: 'border-rose-400/[0.18] bg-rose-400/[0.1] text-rose-200' }
}

function ScopeBadge({ scope }: { scope: ChangelogScope }) {
  const meta = SCOPE_META[scope]
  return (
    <span className={`inline-flex h-7 w-fit shrink-0 items-center rounded-lg border px-2.5 text-[9px] font-bold ${meta.className}`}>
      {meta.label}
    </span>
  )
}

function ReleaseSection({
  value,
  label,
  items
}: (typeof SECTION_META)[number] & { items: ChangelogItem[] }) {
  if (!items.length) return null

  return (
    <Accordion.Item value={value} className="border-t border-white/[0.055] first:border-t-0">
      <Accordion.Header>
        <Accordion.Trigger className="group grid h-14 w-full grid-cols-[112px_32px_minmax(0,1fr)_20px] items-center gap-3 px-5 text-left outline-none transition-colors hover:bg-white/[0.025] focus-visible:bg-white/[0.04] data-[panel-open]:bg-white/[0.018]">
          <span className="text-[12px] font-bold text-white/72">{label}</span>
          <span className="rounded-md bg-white/[0.045] px-2 py-1 font-mono text-[9px] font-semibold text-white/28">
            {items.length}
          </span>
          <span />
          <ChevronDown size={15} className="justify-self-end text-white/22 transition-transform duration-200 group-data-[panel-open]:rotate-180 group-data-[panel-open]:text-white/55" />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Panel className="changelog-panel">
        <ul className="space-y-0 px-5 pb-4">
          {items.map(item => (
            <li key={`${item.scope}-${item.text}`} className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-3 border-t border-white/[0.045] py-3.5 first:border-t-0 first:pt-1">
              <ScopeBadge scope={item.scope} />
              <p className="pt-1 text-[12px] font-medium leading-[1.6] text-white/52">{item.text}</p>
            </li>
          ))}
        </ul>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

export function ReleaseNotesModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-changelog', handleOpen)

    if (window.api?.window) {
      void window.api.window.getVersion().then(currentVersion => {
        const lastVersion = localStorage.getItem('last_version')
        if (lastVersion && lastVersion !== currentVersion) setOpen(true)
        localStorage.setItem('last_version', currentVersion)
      })
    }

    return () => window.removeEventListener('open-changelog', handleOpen)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[190] bg-black/85 backdrop-blur-md animate-fade-in" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[200] flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#090A0A] shadow-[0_40px_120px_rgba(0,0,0,0.85)] outline-none animate-fade-in">
          <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <Dialog.Title className="text-lg font-extrabold tracking-[-0.025em] text-white">Обновления</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[10px] font-medium text-white/28">История изменений ProjectCR</Dialog.Description>
            </div>
            <Dialog.Close
              className="flex size-9 items-center justify-center rounded-xl text-white/35 outline-none transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Закрыть обновления"
            >
              <X size={17} />
            </Dialog.Close>
          </header>

          <div className="custom-scrollbar min-h-0 overflow-y-auto p-5 sm:p-6">
            <div className="space-y-4">
              {CHANGELOG.releases.map(release => {
                const firstSection = SECTION_META.find(section => release.sections[section.value].length)?.value

                return (
                  <section key={release.version} className="overflow-hidden rounded-2xl border border-white/[0.075] bg-white/[0.018]">
                    <div className="flex items-center gap-3 px-5 py-4">
                      <span className="rounded-lg border border-white/[0.075] bg-white/[0.035] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-white/72">
                        v{release.version}
                      </span>
                      {release.date ? <span className="text-[10px] font-medium text-white/25">{release.date}</span> : null}
                    </div>

                    <Accordion.Root defaultValue={firstSection ? [firstSection] : []} multiple>
                      {SECTION_META.map(section => (
                        <ReleaseSection
                          key={section.value}
                          {...section}
                          items={release.sections[section.value]}
                        />
                      ))}
                    </Accordion.Root>
                  </section>
                )
              })}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
