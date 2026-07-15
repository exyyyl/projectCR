import type { ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { AlertTriangle, LoaderCircle, X } from 'lucide-react'
import { Button, buttonVariants } from './button'
import { cn } from '../../lib/utils'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  confirming?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Удалить',
  confirming = false,
  onClose,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-fade-in" />
        <Dialog.Viewport className="fixed inset-0 z-[101] flex items-center justify-center p-6">
          <Dialog.Popup
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !confirming) onConfirm()
            }}
            className="w-[350px] overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0A0A0A] shadow-[0_32px_64px_rgba(0,0,0,0.8)] outline-none animate-dialog-in"
          >
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.08] text-red-400">
                  <AlertTriangle size={20} />
                </div>
                <Dialog.Close
                  aria-label="Закрыть"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'text-white/25')}
                >
                  <X size={16} />
                </Dialog.Close>
              </div>
              <Dialog.Title className="mb-2 text-lg font-black tracking-tight text-white">{title}</Dialog.Title>
              <Dialog.Description className="text-sm leading-relaxed text-white/40">{description}</Dialog.Description>
            </div>

            <div className="flex gap-3 px-6 pb-6 pt-2">
              <Dialog.Close className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'flex-1')}>
                Отмена
              </Dialog.Close>
              <Button type="button" variant="destructive" size="lg" onClick={onConfirm} disabled={confirming} className="flex-1 bg-red-500 text-white hover:bg-red-600">
                {confirming ? <LoaderCircle size={15} className="animate-spin" /> : null}
                {confirming ? 'Удаление…' : confirmLabel}
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
