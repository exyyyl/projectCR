import { useEffect, useState } from 'react'
import { Dialog } from '@base-ui/react'
import { X } from 'lucide-react'
import { CHANGELOG } from '../config/changelog'

const RELEASES = Object.entries(CHANGELOG).map(([version, items]) => ({ version, items }))

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
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[200] flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#090909] shadow-[0_40px_120px_rgba(0,0,0,0.85)] outline-none animate-fade-in">
          <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <Dialog.Title className="text-xl font-black tracking-[-0.025em] text-white">Обновления</Dialog.Title>
            <Dialog.Description className="sr-only">Изменения в версиях ProjectCR</Dialog.Description>
            <Dialog.Close
              className="flex size-9 items-center justify-center rounded-xl text-white/35 outline-none transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Закрыть обновления"
            >
              <X size={17} />
            </Dialog.Close>
          </header>

          <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
            {RELEASES.map(release => (
              <section key={release.version} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018]">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <p className="font-mono text-[12px] font-black tracking-tight text-white/75">v{release.version}</p>
                </div>
                {release.items.map(item => (
                  <article key={`${release.version}-${item.title}`} className="px-5 py-6">
                    <h3 className="text-[14px] font-bold tracking-tight text-white/85">{item.title}</h3>
                    <p className="mt-2 max-w-md text-[12px] font-medium leading-relaxed text-white/35">{item.desc}</p>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
