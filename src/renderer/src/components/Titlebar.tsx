import React from 'react'

export function Titlebar() {
  return (
    <div className="h-9 flex items-center justify-end px-2 drag-region shrink-0">
      <div className="flex items-center no-drag">
        <button
          onClick={() => window.api.window.minimize()}
          className="w-8 h-8 flex items-center justify-center text-amoled-text-muted hover:text-amoled-text hover:bg-amoled-surface rounded-lg transition-colors"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
            <rect width="10" height="1" rx="0.5" />
          </svg>
        </button>
        <button
          onClick={() => window.api.window.maximize()}
          className="w-8 h-8 flex items-center justify-center text-amoled-text-muted hover:text-amoled-text hover:bg-amoled-surface rounded-lg transition-colors"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="0.5" y="0.5" width="8" height="8" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => window.api.window.close()}
          className="w-8 h-8 flex items-center justify-center text-amoled-text-muted hover:text-white hover:bg-red-600 rounded-lg transition-colors"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <line x1="1" y1="1" x2="8" y2="8" />
            <line x1="8" y1="1" x2="1" y2="8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
