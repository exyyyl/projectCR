import type { Crosshair } from '../types'
import { ConfirmDialog } from './ui/confirm-dialog'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  crosshair: Crosshair
}

export function DeleteConfirmModal({ open, onClose, onConfirm, crosshair }: Props) {
  return (
    <ConfirmDialog
      open={open}
      title="Удалить прицел?"
      description={<>«{crosshair.name}» будет удалён без возможности восстановления.</>}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
