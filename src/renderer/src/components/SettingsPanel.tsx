import { useEffect, useState } from 'react'
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

interface SettingsPanelProps {
  updateState: AppUpdateState
  onDownloadUpdate: () => void
  onInstallUpdate: () => void
  onCrosshairsImported: () => Promise<void>
}

type TransferAction = 'export' | 'import'

export function SettingsPanel({
  updateState,
  onDownloadUpdate,
  onInstallUpdate,
  onCrosshairsImported
}: SettingsPanelProps) {
  const [version, setVersion] = useState('...')
  const [transferAction, setTransferAction] = useState<TransferAction | null>(null)
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

  return (
    <div className="custom-scrollbar h-full overflow-y-auto bg-amoled-bg animate-fade-in">
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center gap-3 px-8 py-8">
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808]">
          <SettingSwitch
            title="Автозагрузка"
            checked={settings.launchAtStartup}
            disabled={loading}
            onCheckedChange={value => void updateSetting('launchAtStartup', value)}
          />
          <div className="mx-5 h-px bg-white/[0.055]" />
          <SettingSwitch
            title="Работа в фоне"
            checked={settings.runInBackground}
            disabled={loading}
            onCheckedChange={value => void updateSetting('runInBackground', value)}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808]">
          <TransferButton
            icon={Upload}
            title="Экспортировать прицелы"
            loading={transferAction === 'export'}
            disabled={transferAction !== null}
            onClick={() => void handleExport()}
          />
          <div className="mx-5 h-px bg-white/[0.055]" />
          <TransferButton
            icon={Download}
            title="Импортировать прицелы"
            loading={transferAction === 'import'}
            disabled={transferAction !== null}
            onClick={() => void handleImport()}
          />
        </section>

        <UpdateSettingsCard
          state={updateState}
          currentVersion={version}
          onDownload={onDownloadUpdate}
          onInstall={onInstallUpdate}
        />

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open-changelog'))}
          className="group flex h-16 w-full items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-[#080808] px-5 text-left outline-none transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/35 transition-colors group-hover:text-white/60">
            <History size={16} />
          </span>
          <span className="text-[13px] font-bold text-white/80 transition-colors group-hover:text-white">
            История обновлений
          </span>
          <span className="ml-auto font-mono text-[10px] font-bold text-white/20">v{version}</span>
          <ChevronRight size={14} className="text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35" />
        </button>
      </div>
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
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex h-16 w-full items-center gap-3.5 px-5 text-left outline-none transition-colors hover:bg-white/[0.025] focus-visible:bg-white/[0.035] disabled:cursor-wait disabled:opacity-45"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/35 transition-colors group-hover:text-white/60">
        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Icon size={16} />}
      </span>
      <span className="text-[13px] font-bold text-white/80 transition-colors group-hover:text-white">
        {title}
      </span>
      <ChevronRight size={14} className="ml-auto text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35" />
    </button>
  )
}
