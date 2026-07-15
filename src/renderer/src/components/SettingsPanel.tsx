import { useEffect, useState, type ReactNode } from 'react'
import {
  ChevronRight,
  Download,
  History,
  RefreshCw,
  Upload,
  type LucideIcon
} from 'lucide-react'
import type { AppUpdateState } from '../types'
import { useAppSettings } from '../hooks/useAppSettings'
import { toast } from './Toast'
import { SettingSwitch } from './ui/SettingSwitch'
import { UpdateSettingsCard } from './UpdateSettingsCard'
import { LineupLibrarySettings } from './LineupLibrarySettings'
import { Button } from './ui/button'
import { Card, CardSeparator } from './ui/card'
import { ConfirmDialog } from './ui/confirm-dialog'

interface SettingsPanelProps {
  updateState: AppUpdateState
  onDownloadUpdate: () => void
  onInstallUpdate: () => void
  onCrosshairsImported: () => Promise<void>
}

type TransferAction = 'export' | 'import'
type DataScope = 'crosshairs' | 'lineups' | 'all'

const DELETE_COPY: Record<DataScope, { title: string; description: string; success: string }> = {
  crosshairs: {
    title: 'Удалить все прицелы?',
    description: 'Вся коллекция прицелов будет удалена без возможности восстановления. Лайнапы и настройки останутся.',
    success: 'Все прицелы удалены'
  },
  lineups: {
    title: 'Удалить все лайнапы?',
    description: 'Все лайнапы и прикреплённые к ним изображения будут удалены. Прицелы и настройки останутся.',
    success: 'Все лайнапы удалены'
  },
  all: {
    title: 'Удалить всю коллекцию?',
    description: 'Все прицелы, лайнапы и изображения лайнапов будут удалены. Системные настройки приложения останутся.',
    success: 'Вся коллекция удалена'
  }
}

export function SettingsPanel({
  updateState,
  onDownloadUpdate,
  onInstallUpdate,
  onCrosshairsImported
}: SettingsPanelProps) {
  const [version, setVersion] = useState('...')
  const [transferAction, setTransferAction] = useState<TransferAction | null>(null)
  const [pendingDelete, setPendingDelete] = useState<DataScope | null>(null)
  const [deletingScope, setDeletingScope] = useState<DataScope | null>(null)
  const { settings, loading, updateSetting } = useAppSettings()

  useEffect(() => {
    if (window.api?.window) void window.api.window.getVersion().then(setVersion)
  }, [])

  const handleExport = async () => {
    setTransferAction('export')
    try {
      const result = await window.api.crosshairs.exportFile()
      if (result.status === 'success') toast(`Экспортировано прицелов: ${result.count}`)
    } catch {
      toast('Не удалось экспортировать прицелы', 'error')
    } finally {
      setTransferAction(null)
    }
  }

  const handleImport = async () => {
    setTransferAction('import')
    try {
      const result = await window.api.crosshairs.importFile()
      if (result.status === 'success') {
        await onCrosshairsImported()
        toast(`Импортировано прицелов: ${result.count}`)
      }
    } catch {
      toast('Не удалось импортировать этот файл', 'error')
    } finally {
      setTransferAction(null)
    }
  }

  const handleDeleteData = async (scope: DataScope) => {
    setDeletingScope(scope)
    try {
      if (scope === 'crosshairs' || scope === 'all') {
        if (window.api?.crosshairs) await window.api.crosshairs.deleteAll()
        else localStorage.removeItem('projectcr:crosshairs')
        await onCrosshairsImported()
      }

      if (scope === 'lineups' || scope === 'all') {
        if (window.api?.lineups) await window.api.lineups.deleteAll()
        else localStorage.removeItem('projectcr:lineups')
        window.dispatchEvent(new CustomEvent('projectcr:lineups-changed'))
      }

      toast(DELETE_COPY[scope].success)
      setPendingDelete(null)
    } catch {
      toast('Не удалось удалить данные', 'error')
    } finally {
      setDeletingScope(null)
    }
  }

  return (
    <div className="custom-scrollbar h-full overflow-y-auto bg-amoled-bg animate-fade-in">
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-7 px-8 py-8">
        <SettingsGroup title="Система">
          <Card>
            <SettingSwitch
              title="Автозагрузка"
              checked={settings.launchAtStartup}
              disabled={loading}
              onCheckedChange={value => void updateSetting('launchAtStartup', value)}
            />
            <CardSeparator />
            <SettingSwitch
              title="Работа в фоне"
              checked={settings.runInBackground}
              disabled={loading}
              onCheckedChange={value => void updateSetting('runInBackground', value)}
            />
          </Card>
        </SettingsGroup>

        <SettingsGroup title="Данные">
          <Card>
            <TransferButton
              icon={Upload}
              title="Экспортировать прицелы"
              loading={transferAction === 'export'}
              disabled={transferAction !== null}
              onClick={() => void handleExport()}
            />
            <CardSeparator />
            <TransferButton
              icon={Download}
              title="Импортировать прицелы"
              loading={transferAction === 'import'}
              disabled={transferAction !== null}
              onClick={() => void handleImport()}
            />
          </Card>
        </SettingsGroup>

        <SettingsGroup title="Лайнапы">
          <LineupLibrarySettings />
        </SettingsGroup>

        <SettingsGroup title="Обновления">
          <UpdateSettingsCard
            state={updateState}
            currentVersion={version}
            onDownload={onDownloadUpdate}
            onInstall={onInstallUpdate}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={() => window.dispatchEvent(new CustomEvent('open-changelog'))}
            className="group mt-3 h-16 w-full justify-start rounded-2xl bg-[#080808] px-5 text-left normal-case tracking-normal"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/35 transition-colors group-hover:text-white/60">
              <History size={16} />
            </span>
            <span className="text-[13px] font-bold text-white/80 transition-colors group-hover:text-white">
              История обновлений
            </span>
            <span className="ml-auto font-mono text-[10px] font-bold text-white/20">v{version}</span>
            <ChevronRight size={14} className="text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35" />
          </Button>
        </SettingsGroup>

        <SettingsGroup title="Хранилище">
          <Card>
            <CollectionDeleteRow
              title="Прицелы"
              description="Удалить сохранённые коды прицелов"
              onClick={() => setPendingDelete('crosshairs')}
            />
            <CardSeparator />
            <CollectionDeleteRow
              title="Лайнапы"
              description="Удалить лайнапы и прикреплённые изображения"
              onClick={() => setPendingDelete('lineups')}
            />
          </Card>

          <div className="mt-3 flex items-center gap-5 rounded-2xl border border-white/[0.07] bg-[#080808] px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-white/[0.72]">Очистить всю коллекцию</p>
              <p className="mt-1 text-[10px] font-medium leading-relaxed text-white/25">
                Прицелы, лайнапы и изображения будут удалены. Настройки сохранятся.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setPendingDelete('all')}
              className="shrink-0 px-4"
            >
              Удалить всё
            </Button>
          </div>
        </SettingsGroup>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete ? DELETE_COPY[pendingDelete].title : ''}
        description={pendingDelete ? DELETE_COPY[pendingDelete].description : ''}
        confirmLabel="Удалить"
        confirming={deletingScope !== null}
        onClose={() => { if (!deletingScope) setPendingDelete(null) }}
        onConfirm={() => { if (pendingDelete) void handleDeleteData(pendingDelete) }}
      />
    </div>
  )
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 px-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/28">{title}</h2>
      {children}
    </section>
  )
}

function CollectionDeleteRow({
  title,
  description,
  onClick
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <div className="flex min-h-[68px] items-center gap-4 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-white/[0.72]">{title}</p>
        <p className="mt-1 text-[10px] font-medium text-white/25">{description}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="px-3 text-red-300/[0.58] hover:bg-red-400/[0.07] hover:text-red-200"
      >
        Очистить
      </Button>
    </div>
  )
}

interface TransferButtonProps {
  icon: LucideIcon
  title: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}

function TransferButton({
  icon: Icon,
  title,
  loading,
  disabled,
  onClick
}: TransferButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      className="group h-16 w-full justify-start rounded-none px-5 text-left normal-case tracking-normal disabled:cursor-wait"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/35 transition-colors group-hover:text-white/60">
        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Icon size={16} />}
      </span>
      <span className="text-[13px] font-bold text-white/80 transition-colors group-hover:text-white">
        {title}
      </span>
      <ChevronRight size={14} className="ml-auto text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35" />
    </Button>
  )
}
