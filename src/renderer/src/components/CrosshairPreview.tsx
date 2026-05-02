import React, { useMemo } from 'react'
import { parseValorantCode, getValorantColor } from '../lib/crosshair-parser'
import { Crosshair } from '../types'

interface Props {
  crosshair: Crosshair
  size?: number
}

export function CrosshairPreview({ crosshair, size = 80 }: Props) {
  const content = useMemo(() => {
    if (crosshair.game === 'cs2') return cs2SVG(size)
    return valorantSVG(crosshair.code, size)
  }, [crosshair.code, crosshair.game, size])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {content}
    </svg>
  )
}

// ─── Thickness helper ─────────────────────────────────────────────────────────
// Thickness is independent from geometric scale — avoids chunky lines.
// Game thickness 1-8 → preview pixel 1-3.5
function toPx(gameThick: number): number {
  return Math.max(0.8, Math.min(gameThick * 0.8 + 0.3, 3.5))
}

// ─── VALORANT ─────────────────────────────────────────────────────────────────
function valorantSVG(code: string, size: number) {
  const p = parseValorantCode(code)
  const color = getValorantColor(p)
  const cx = size / 2
  const cy = size / 2

  // Geometric scale: fit the crosshair into ~36% of the preview radius.
  // Cap so a very short crosshair doesn't become huge.
  const innerExtent = p.innerEnabled && p.innerLength > 0
    ? p.innerOffset + p.innerLength : 0
  const outerExtent = p.outerEnabled && p.outerLength > 0
    ? p.outerOffset + p.outerLength : 0
  const maxExtent = Math.max(innerExtent, outerExtent, p.dotEnabled ? p.dotSize : 0, 1)

  const targetR = size * 0.36
  const geoScale = Math.min(targetR / maxExtent, size / 18)

  const elements: React.ReactNode[] = []
  const outlineW = p.outlineEnabled ? p.outlineThickness * 0.6 + 0.8 : 0

  // ── Outer lines ──
  if (p.outerEnabled && p.outerLength > 0) {
    const len = p.outerLength * geoScale
    const gap = p.outerOffset * geoScale
    const thick = toPx(p.outerThickness)

    if (outlineW > 0) {
      elements.push(
        <g key="oo" opacity={p.outerOpacity * 0.65}>
          {crossRects(cx, cy, len, gap, thick + outlineW * 2, '#000')}
        </g>
      )
    }
    elements.push(
      <g key="ol" opacity={p.outerOpacity}>
        {crossRects(cx, cy, len, gap, thick, color)}
      </g>
    )
  }

  // ── Inner lines ──
  if (p.innerEnabled && p.innerLength > 0) {
    const len = p.innerLength * geoScale
    const gap = p.innerOffset * geoScale
    const thick = toPx(p.innerThickness)

    if (outlineW > 0) {
      elements.push(
        <g key="io" opacity={p.innerOpacity * 0.65}>
          {crossRects(cx, cy, len, gap, thick + outlineW * 2, '#000')}
        </g>
      )
    }
    elements.push(
      <g key="il" opacity={p.innerOpacity}>
        {crossRects(cx, cy, len, gap, thick, color)}
      </g>
    )
  }

  // ── Center dot ──
  if (p.dotEnabled && p.dotSize > 0) {
    const r = Math.max(0.8, p.dotSize * geoScale * 0.5)
    if (outlineW > 0) {
      elements.push(
        <circle key="do" cx={cx} cy={cy} r={r + outlineW}
          fill="#000" opacity={p.dotOpacity * 0.65} />
      )
    }
    elements.push(
      <circle key="dc" cx={cx} cy={cy} r={r}
        fill={color} opacity={p.dotOpacity} />
    )
  }

  // ── Fallback (nothing drawn) ──
  if (elements.length === 0) {
    elements.push(
      <g key="fb" opacity={0.5}>
        {crossRects(cx, cy, 8, 4, 1.2, color)}
      </g>
    )
  }

  return <>{elements}</>
}

// Draw 4 rects as cross arms
function crossRects(
  cx: number, cy: number,
  len: number, gap: number,
  thick: number, fill: string
) {
  const hw = thick / 2
  return (
    <>
      <rect fill={fill} x={cx - hw} y={cy - gap - len} width={thick} height={len} />
      <rect fill={fill} x={cx - hw} y={cy + gap}       width={thick} height={len} />
      <rect fill={fill} x={cx - gap - len} y={cy - hw} width={len}   height={thick} />
      <rect fill={fill} x={cx + gap}       y={cy - hw} width={len}   height={thick} />
    </>
  )
}

// ─── CS2 ─────────────────────────────────────────────────────────────────────
function cs2SVG(size: number) {
  const cx = size / 2
  const cy = size / 2
  const scale = size / 28
  const len = 6 * scale
  const gap = 2.5 * scale
  const thick = 1.2
  const color = '#00CCCC'

  return (
    <>
      <g opacity={0.6}>{crossRects(cx, cy, len, gap, thick + 2, '#000')}</g>
      <g>{crossRects(cx, cy, len, gap, thick, color)}</g>
      <circle cx={cx} cy={cy} r={0.9} fill={color} />
    </>
  )
}
