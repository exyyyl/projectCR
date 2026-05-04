# projectCR — Style Guide

Design system reference for LLM-assisted development. All UI must follow these rules exactly.

---

## Color Palette (Tailwind tokens)

| Token | Hex | Usage |
|---|---|---|
| `amoled-bg` | `#000000` | Page / window background |
| `amoled-surface` | `#0a0a0a` | Card surface |
| `amoled-elevated` | `#111111` | Dropdowns, tooltips |
| `amoled-border` | `#1a1a1a` | Default borders |
| `amoled-border-strong` | `#2a2a2a` | Focused / hover borders |
| `amoled-muted` | `#3a3a3a` | Scrollbar, disabled |
| `amoled-text` | `#ffffff` | Primary text |
| `amoled-text-secondary` | `#a0a0a0` | Secondary labels |
| `amoled-text-muted` | `#606060` | Placeholder, icons at rest |
| `accent` | `#FF4655` | VALORANT brand, primary CTA |
| `cs` | `#E8A530` | CS2 brand |

Utility white-alpha shades used directly:
- `white/[0.02]` – subtle surface fills
- `white/[0.03]` – pill nav background
- `white/[0.05]` – border on dark surfaces
- `white/10` – dividers
- `white/20..60` – progressive text opacity

---

## Spacing System

All spacing uses **6-unit steps** (`px-6`, `pt-4`, `pb-6`). Never mix arbitrary values.

| Purpose | Class |
|---|---|
| Horizontal page padding | `px-6` |
| Top gap below header | `pt-5` |
| Section bottom padding | `pb-6` |
| Gap between toolbar items | `gap-3` |
| Gap between cards | `gap-4` |
| Card inner padding | `px-3 py-2.5` |

---

## Layout Skeleton

```
┌─────────────────── h-12 drag-region ───────────────────┐
│  [spacer w-28]  │  [pill nav — centered]  │  [controls w-28]  │
├──────────────────────────────────────────────────────────┤
│  px-6 pt-5  [search h-10]  [flex-1]  [sort h-10]  [+ h-10]  │
├──────────────────────────────────────────────────────────┤
│  px-6 pt-4 pb-6                                          │
│  grid gap-4  (2→3→4→5→6 cols responsive)                 │
└──────────────────────────────────────────────────────────┘
```

### Header bar (single row, h-12)
- Full-width `drag-region`
- Left: `w-28 shrink-0` spacer (visually balances right controls)
- Center: flex-1, pill nav centered
- Right: `w-28 shrink-0` window control buttons

### Pill navigation
- Container: `p-1 bg-white/[0.03] border border-white/[0.05] rounded-[20px]`
- Tab button active: `bg-white text-black h-8 px-5 rounded-[16px] text-[10px] font-black tracking-widest`
- Tab button inactive: `text-white/30 hover:text-white/60 hover:bg-white/[0.04]`
- Divider between tabs and icons: `w-px h-5 bg-white/10 mx-1`

### Toolbar row
- `px-6 pt-5 pb-0 flex items-center gap-3 shrink-0`
- All interactive controls: **h-10, rounded-xl**

### Cards grid
- `px-6 pt-4 pb-6 grid gap-4`
- Responsive: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`

---

## Typography

| Usage | Class |
|---|---|
| Nav / button labels | `text-[10px] font-black tracking-widest uppercase` |
| Card title | `text-[13px] font-medium` |
| Code / mono | `font-mono text-[10px]` |
| Section headings | `text-2xl font-black tracking-tight` |
| Body / descriptions | `text-sm font-medium text-white/40` |
| Tags | `.tag` component class |

Font: system `font-sans`, antialiased.

---

## Interactive Controls

### Buttons (default / ghost)
```
h-10 px-4 rounded-xl
text-[10px] font-black tracking-widest uppercase
text-white/40 hover:text-white hover:bg-white/[0.06]
transition-colors duration-200
```

### Primary CTA (white solid)
```
h-10 px-5 rounded-xl
bg-white text-black
text-[11px] font-black tracking-widest uppercase
hover:scale-[1.02] active:scale-[0.98]
shadow-[0_8px_20px_rgba(255,255,255,0.05)]
transition-all
```

### Danger button
```
text-white/20 hover:text-red-400 hover:bg-red-400/10
transition-colors
```

### Icon-only button (toolbar)
```
w-10 h-10 flex items-center justify-center rounded-xl
text-white/40 hover:text-white hover:bg-white/[0.06]
transition-colors
```

### Window control buttons
```
w-8 h-8 flex items-center justify-center rounded-lg
text-white/20 hover:text-white hover:bg-white/[0.06]
transition-colors
```
Close button: `hover:bg-red-600` instead.

---

## Cards

```tsx
// CrosshairCard
<div className="group bg-amoled-surface border border-amoled-border
                hover:border-amoled-border-strong rounded-2xl overflow-hidden
                transition-all duration-150">
  {/* Preview — always black bg */}
  <div className="flex items-center justify-center bg-black py-5 relative">
    ...
  </div>
  {/* Info */}
  <div className="px-3 py-2.5 flex flex-col gap-1.5">
    ...
  </div>
</div>
```

Game chip (top-left of preview):
- VALORANT: `color: #FF4655, background: #FF465512`
- CS2: `color: #E8A530, background: #E8A53012`
- Class: `text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded`

---

## Inputs

```
h-10 flex items-center
bg-white/[0.02] border border-white/[0.05] rounded-xl px-4
focus-within:bg-white/[0.04] focus-within:border-white/10
transition-all duration-200
```

Input text: `text-[11px] font-black tracking-[0.1em] text-white placeholder-white/10`

---

## Panels & Overlays

### Slide-in panel (right side)
```
fixed top-0 right-0 h-full w-[380px] z-50
bg-[#0A0A0A] border-l border-white/[0.06]
shadow-[-20px_0_60px_rgba(0,0,0,0.6)]
transform transition-transform 0.28s cubic-bezier(0.4,0,0.2,1)
open: translateX(0)  closed: translateX(100%)
```

Backdrop: `fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]` (opacity animated)

### Modal
```
fixed inset-0 z-[100] flex items-center justify-center p-6
bg-black/80 backdrop-blur-sm
```
Modal card: `bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)]`

---

## Animations

| Name | Keyframes | Usage |
|---|---|---|
| `fadeIn` | opacity 0→1 | Dropdowns, overlays (0.15s ease-out) |
| `slideInRight` | opacity 0→1 + translateX(20px→0) | Panel content (0.3s cubic) |
| `shimmer` | translateX(-100%→100%) | Loading skeletons |

Custom CSS classes: `.animate-fade-in`, `.animate-slide-in-right`, `.animate-shimmer`

---

## Scrollbar

```css
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 9999px; }
```

Apply `.custom-scrollbar` to scrollable containers.

---

## Game brand colors

```ts
const GAME_COLORS = {
  valorant: { label: 'VAL', color: '#FF4655', bg: '#FF465512' },
  cs2:      { label: 'CS2', color: '#E8A530', bg: '#E8A53012' },
}
```

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `px-6` for all horizontal page padding | Mix `px-8`, `px-10`, `p-8` randomly |
| Use `h-10 rounded-xl` for all toolbar controls | Use `h-12 rounded-2xl` in toolbars |
| Keep the header a single `h-12` row | Add a separate Titlebar component above nav |
| Use `gap-4` between cards | Use `gap-5` or `gap-6` in card grids |
| Animate transitions `duration-200` | Use `duration-300` inside the compact nav |
| Use `white/[0.XX]` for opacity backgrounds | Use `rgba(...)` inline styles for bg |
| Keep all text `uppercase tracking-widest font-black` in buttons | Use mixed casing in button labels |
