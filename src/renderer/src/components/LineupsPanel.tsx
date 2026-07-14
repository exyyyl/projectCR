import { MapPinned } from 'lucide-react'

export function LineupsPanel() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-white/25">
          <MapPinned size={28} strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">Лайнапы</h1>
        <p className="mt-2 text-sm font-medium text-white/30">Раздел находится в разработке</p>
      </div>
    </div>
  )
}
