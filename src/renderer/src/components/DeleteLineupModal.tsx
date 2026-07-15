import type { Lineup } from '../types'
import { ConfirmDialog } from './ui/confirm-dialog'

interface DeleteLineupModalProps {
  lineup: Lineup | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteLineupModal({ lineup, onClose, onConfirm }: DeleteLineupModalProps) {
  return (
    <ConfirmDialog
      open={Boolean(lineup)}
      title="Удалить лайнап?"
      description={<>«{lineup?.name}» и все его кадры будут удалены без возможности восстановления.</>}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
