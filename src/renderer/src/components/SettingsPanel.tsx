import React, { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  Info, 
  Heart, 
  Code, 
  ExternalLink, 
  ShieldCheck, 
  Monitor, 
  Gamepad2, 
  User, 
  Bell, 
  Zap,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'

type Section = 'general' | 'about'

export function SettingsPanel() {
  const [activeSection, setActiveSection] = useState<Section>('general')
  const [version, setVersion] = useState('...')
  const [valStatus, setValStatus] = useState<{ connected: boolean; gameName?: string }>({ connected: false })

  // Mock settings state (for UI demonstration)
  const [settings, setSettings] = useState({
    autoApply: true,
    notifications: true,
    cs2Path: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\game\\csgo\\cfg'
  })

  useEffect(() => {
    if (window.api?.window) {
      window.api.window.getVersion().then(setVersion)
    }
    if (window.api?.valorant) {
      window.api.valorant.getStatus().then(setValStatus)
    }
  }, [])

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sections = [
    { id: 'general', label: 'Общие', icon: SettingsIcon },
    { id: 'about', label: 'О приложении', icon: Info },
  ] as const

  return (
    <div className="flex h-full min-h-[600px] bg-amoled-bg overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/[0.05] p-6 flex flex-col gap-2 shrink-0">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-200 group
              ${activeSection === section.id 
                ? 'bg-white/[0.05] text-white' 
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
              }`}
          >
            <section.icon size={18} strokeWidth={activeSection === section.id ? 2.5 : 2} />
            {section.label}
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-white/[0.05] px-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-white/10 uppercase tracking-widest">
            <Heart size={10} className="text-rose-500/50" />
            ProjectCR v{version}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-10 space-y-12">
          {activeSection === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <SettingToggle 
                  title="Уведомления" 
                  description="Показывать уведомления при применении или ошибках"
                  active={settings.notifications}
                  onClick={() => toggleSetting('notifications')}
                />
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-8 animate-fade-in">
              {/* Known Issues */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <AlertTriangle size={12} className="text-amber-500/50" />
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Известные проблемы</h3>
                </div>
                <div className="bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl p-6">
                  <div>
                    <p className="text-[13px] font-bold text-white/80">Превью прицелов работает некорректно</p>
                    <p className="text-[11px] text-white/30 mt-1">Мы работаем над исправлением движка рендеринга для корректного отображения всех типов прицелов.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard icon={Bell} title="Обновления" subtitle="Что нового в ProjectCR?" onClick={() => window.dispatchEvent(new CustomEvent('open-changelog'))} />
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Текущая версия</p>
                  <p className="text-xl font-black text-white">{version}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingToggle({ title, description, active, onClick }: { title: string; description: string; active: boolean; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer py-1" onClick={onClick}>
      <div className="space-y-1 pr-10">
        <h4 className="text-[14px] font-bold text-white/90 group-hover:text-white transition-colors">{title}</h4>
        <p className="text-xs text-white/30 leading-relaxed">{description}</p>
      </div>
      <div className={`w-10 h-5 rounded-full transition-all duration-300 relative shrink-0 ${active ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
      </div>
    </div>
  )
}

function SettingItem({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="space-y-1 pr-10">
        <h4 className="text-[14px] font-bold text-white/90">{title}</h4>
        <p className="text-xs text-white/30 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, title, subtitle, href, onClick }: { icon: any; title: string; subtitle: string; href?: string; onClick?: () => void }) {
  const content = (
    <>
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-white/90">{title}</h4>
        <p className="text-xs text-white/30">{subtitle}</p>
      </div>
      <ChevronRight size={14} className="ml-auto text-white/10 group-hover:text-white/30 transition-all" />
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.04] transition-all text-left">
      {content}
    </button>
  )
}
