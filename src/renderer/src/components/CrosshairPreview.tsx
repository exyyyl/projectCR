import React, { useMemo } from 'react'
import { parseValorantCode, getValorantColor, calcGap } from '../lib/crosshair-parser'
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

// ─── VALORANT ─────────────────────────────────────────────────────────────────
function valorantSVG(code: string, size: number) {
  const p = parseValorantCode(code)
  const color = getValorantColor(p)
  const cx = size / 2
  const cy = size / 2

  // Effective gaps — mirror reference calculateGap() with FIXED_GAP=4
  const innerGap = calcGap(p.innerOffset, p.innerFiringError, p.overrideFiringErrorOffset)
  const outerGap = calcGap(p.outerOffset, p.outerFiringError, p.overrideFiringErrorOffset)

  // Extent for scale calculation uses the effective gap
  const innerLen = p.innerLengthNotLinked ? p.innerVertical : p.innerLength
  const outerLen = p.outerLengthNotLinked ? p.outerVertical : p.outerLength

  const innerExtent = p.innerEnabled && p.innerLength > 0 ? innerGap + p.innerLength : 0
  const outerExtent = p.outerEnabled && p.outerLength > 0 ? outerGap + p.outerLength : 0
  const dotExtent   = p.dotEnabled ? p.dotSize / 2 : 0
  const maxExtent   = Math.max(innerExtent, outerExtent, dotExtent, 1)

  // Use a more consistent scale to avoid everything looking the same size
  // Baseline: 1 unit = 2 pixels on a 80px preview
  const baselineScale = size / 40
  
  // Only shrink if it exceeds the safe bounds (70% of preview area)
  const safeArea = size * 0.7
  const currentExtent = maxExtent * baselineScale * 2
  const shrinkFactor = currentExtent > safeArea ? safeArea / currentExtent : 1
  
  const geoScale = baselineScale * shrinkFactor

  // Outline / stroke setup
  const outlineW = p.outlineEnabled ? Math.max(0.5, p.outlineThickness * 0.5) : 0

  const elements: React.ReactNode[] = []

  // ── Outer lines ──
  if (p.outerEnabled && p.outerLength > 0 && p.outerThickness > 0) {
    const len   = p.outerLength * geoScale
    const hLen  = outerLen * geoScale       // horizontal length (may differ if not linked)
    const gap   = outerGap * geoScale
    const thick = p.outerThickness * geoScale
    
    const oOp = isNaN(p.outerOpacity) ? 0.35 : p.outerOpacity
    const outOp = isNaN(p.outlineOpacity) ? 0.5 : p.outlineOpacity

    if (outlineW > 0) {
      elements.push(
        <g key="oo" opacity={oOp * outOp}>
          {crossRects(cx, cy, len, hLen, gap, thick + outlineW * 2, '#000')}
        </g>
      )
    }
    elements.push(
      <g key="ol" opacity={oOp}>
        {crossRects(cx, cy, len, hLen, gap, thick, color)}
      </g>
    )
  }

  // ── Inner lines ──
  if (p.innerEnabled && p.innerLength > 0 && p.innerThickness > 0) {
    const len   = p.innerLength * geoScale
    const hLen  = innerLen * geoScale
    const gap   = innerGap * geoScale
    const thick = p.innerThickness * geoScale

    const iOp = isNaN(p.innerOpacity) ? 0.8 : p.innerOpacity
    const outOp = isNaN(p.outlineOpacity) ? 0.5 : p.outlineOpacity

    if (outlineW > 0) {
      elements.push(
        <g key="io" opacity={iOp * outOp}>
          {crossRects(cx, cy, len, hLen, gap, thick + outlineW * 2, '#000')}
        </g>
      )
    }
    elements.push(
      <g key="il" opacity={iOp}>
        {crossRects(cx, cy, len, hLen, gap, thick, color)}
      </g>
    )
  }

  // ── Center dot ──
  if (p.dotEnabled && p.dotSize > 0) {
    const r = Math.max(0.5, (p.dotSize / 2) * geoScale)
    const dotOp = isNaN(p.dotOpacity) ? 1 : p.dotOpacity
    const outOp = isNaN(p.outlineOpacity) ? 0.5 : p.outlineOpacity
    if (outlineW > 0) {
      elements.push(
        <circle key="do" cx={cx} cy={cy}
          r={r + outlineW}
          fill="#000"
          opacity={dotOp * outOp}
        />
      )
    }
    elements.push(
      <circle key="dc" cx={cx} cy={cy} r={r} fill={color} opacity={dotOp} />
    )
  }

  // ── Fallback: show a minimal placeholder if nothing renders ──
  if (elements.length === 0) {
    elements.push(
      <g key="fb" opacity={0.4}>
        {crossRects(cx, cy, 8, 8, 4, 1.5, '#fff')}
      </g>
    )
  }

  return <>{elements}</>
}

// Draw 4 arms of a crosshair as rects.
// len = horizontal arm length, hLen = vertical arm length (may differ when not linked)
function crossRects(
  cx: number, cy: number,
  len: number, hLen: number,
  gap: number,
  thick: number,
  fill: string
) {
  const hw = thick / 2
  return (
    <>
      {/* left */}
      <rect fill={fill} x={cx - gap - len} y={cy - hw}  width={len}  height={thick} />
      {/* right */}
      <rect fill={fill} x={cx + gap}       y={cy - hw}  width={len}  height={thick} />
      {/* top */}
      <rect fill={fill} x={cx - hw} y={cy - gap - hLen} width={thick} height={hLen} />
      {/* bottom */}
      <rect fill={fill} x={cx - hw} y={cy + gap}        width={thick} height={hLen} />
    </>
  )
}

// ─── CS2 ─────────────────────────────────────────────────────────────────────
function cs2SVG(size: number) {
  const cx = size / 2
  const cy = size / 2
  const scale = size / 28
  const len   = 6 * scale
  const gap   = 2.5 * scale
  const thick = 1.5 * scale
  const color = '#00CCCC'

  return (
    <>
      <g opacity={0.5}>{crossRects(cx, cy, len, len, gap, thick + 2, '#000')}</g>
      <g>{crossRects(cx, cy, len, len, gap, thick, color)}</g>
      <circle cx={cx} cy={cy} r={Math.max(0.8, 0.9 * scale)} fill={color} />
    </>
  )
}
