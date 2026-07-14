import React, { useMemo } from 'react'
import {
  getCS2Color,
  getValorantColor,
  parseCS2Code,
  parseValorantCode,
} from '../lib/crosshair-parser'
import type { ParsedCS2Crosshair, ParsedValorantCrosshair } from '../lib/crosshair-parser'
import { Crosshair } from '../types'

interface Props {
  crosshair: Crosshair
  size?: number
  bg?: string
  magnification?: number
  autoFit?: boolean
}

interface ArmRect {
  x: number
  y: number
  width: number
  height: number
}

export function CrosshairPreview({ crosshair, size = 80, bg, magnification = 1, autoFit = false }: Props) {
  const content = useMemo(() => {
    return crosshair.game === 'cs2'
      ? renderCS2(crosshair.code, size, magnification, autoFit)
      : renderValorant(crosshair.code, size, magnification, autoFit)
  }, [autoFit, crosshair.code, crosshair.game, size, magnification])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', overflow: 'hidden' }}
      aria-label={`${crosshair.game.toUpperCase()} crosshair preview`}
    >
      {bg && <rect width={size} height={size} fill={bg} />}
      {content}
    </svg>
  )
}

function clampOpacity(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 1))
}

function fittedMagnification(
  requested: number,
  size: number,
  extents: number[],
  featureSizes: number[],
): number {
  if (extents.length === 0) return requested

  const maxExtent = Math.max(1, ...extents)
  const smallestFeature = Math.max(0.25, Math.min(...featureSizes.filter(value => value > 0)))
  const detailScale = 5 / smallestFeature
  const fitScale = (size * 0.38) / maxExtent

  return Math.max(1, Math.min(Math.max(requested, detailScale), fitScale))
}

function valorantMagnification(
  crosshair: ParsedValorantCrosshair,
  requested: number,
  size: number,
): number {
  const extents: number[] = []
  const featureSizes: number[] = []
  const outlineVisible = crosshair.outlineEnabled && crosshair.outlineOpacity > 0 && crosshair.outlineThickness > 0
  const outlineExtent = outlineVisible ? crosshair.outlineThickness : 0

  if (crosshair.dotEnabled && (crosshair.dotOpacity > 0 || outlineVisible)) {
    extents.push(crosshair.dotSize / 2 + outlineExtent)
    featureSizes.push(crosshair.dotOpacity > 0 ? crosshair.dotSize : crosshair.outlineThickness)
  }

  const addLines = (
    enabled: boolean,
    opacity: number,
    horizontalLength: number,
    verticalLength: number,
    unlinked: boolean,
    thickness: number,
    gap: number,
  ) => {
    if (!enabled || thickness <= 0 || (opacity <= 0 && !outlineVisible)) return

    const effectiveVerticalLength = unlinked ? verticalLength : horizontalLength
    const lengths = [horizontalLength, effectiveVerticalLength].filter(value => value > 0)
    if (lengths.length === 0) return

    extents.push(Math.max(0, gap) + Math.max(...lengths) + outlineExtent)
    featureSizes.push(opacity > 0 ? Math.min(thickness, ...lengths) : crosshair.outlineThickness)
  }

  addLines(
    crosshair.outerEnabled,
    crosshair.outerOpacity,
    crosshair.outerLength,
    crosshair.outerVertical,
    crosshair.outerLengthNotLinked,
    crosshair.outerThickness,
    crosshair.outerOffset,
  )
  addLines(
    crosshair.innerEnabled,
    crosshair.innerOpacity,
    crosshair.innerLength,
    crosshair.innerVertical,
    crosshair.innerLengthNotLinked,
    crosshair.innerThickness,
    crosshair.innerOffset,
  )

  return fittedMagnification(requested, size, extents, featureSizes)
}

function cs2Magnification(
  crosshair: ParsedCS2Crosshair,
  requested: number,
  size: number,
): number {
  const extents: number[] = []
  const featureSizes: number[] = []
  const outlineExtent = crosshair.outlineEnabled ? crosshair.outline : 0
  const lineThickness = Math.max(1, crosshair.thickness)

  if (crosshair.length > 0) {
    const innerEdge = Math.max(0, crosshair.gap + 4) + lineThickness / 2
    extents.push(innerEdge + crosshair.length + outlineExtent)
    featureSizes.push(Math.min(lineThickness, crosshair.length))
  }

  if (crosshair.centerDotEnabled) {
    const dotSize = Math.max(1, crosshair.thickness * 2)
    extents.push(dotSize / 2 + outlineExtent)
    featureSizes.push(dotSize)
  }

  return fittedMagnification(requested, size, extents, featureSizes)
}

function armRects(
  centerX: number,
  centerY: number,
  horizontalLength: number,
  verticalLength: number,
  gap: number,
  thickness: number,
  omitTop = false,
): ArmRect[] {
  const halfThickness = thickness / 2
  const rects: ArmRect[] = []

  if (horizontalLength > 0 && thickness > 0) {
    rects.push({
      x: centerX - gap - horizontalLength,
      y: centerY - halfThickness,
      width: horizontalLength,
      height: thickness,
    }, {
      x: centerX + gap,
      y: centerY - halfThickness,
      width: horizontalLength,
      height: thickness,
    })
  }

  if (verticalLength > 0 && thickness > 0) {
    rects.push({
      x: centerX - halfThickness,
      y: centerY + gap,
      width: thickness,
      height: verticalLength,
    })

    if (!omitTop) {
      rects.push({
        x: centerX - halfThickness,
        y: centerY - gap - verticalLength,
        width: thickness,
        height: verticalLength,
      })
    }
  }
  return rects
}

function rectNodes(rects: ArmRect[], fill: string, keyPrefix: string) {
  return rects.map((rect, index) => (
    <rect key={`${keyPrefix}-${index}`} fill={fill} {...rect} />
  ))
}

function expanded(rect: ArmRect, amount: number): ArmRect {
  return {
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
  }
}

function outlineNodes(rects: ArmRect[], amount: number, keyPrefix: string) {
  return rects.map((rect, index) => {
    const outerX = rect.x - amount
    const outerY = rect.y - amount
    const outerWidth = rect.width + amount * 2
    const outerHeight = rect.height + amount * 2
    const path = [
      `M ${outerX} ${outerY}`,
      `h ${outerWidth}`,
      `v ${outerHeight}`,
      `h ${-outerWidth}`,
      'Z',
      `M ${rect.x} ${rect.y}`,
      `h ${rect.width}`,
      `v ${rect.height}`,
      `h ${-rect.width}`,
      'Z',
    ].join(' ')

    return <path key={`${keyPrefix}-${index}`} d={path} fill="#000000" fillRule="evenodd" />
  })
}

function outlinedShape(
  rects: ArmRect[],
  color: string,
  opacity: number,
  outlineEnabled: boolean,
  outlineThickness: number,
  outlineOpacity: number,
  key: string,
  outlineStyle: 'ring' | 'backing' = 'ring',
) {
  if (outlineStyle === 'ring') {
    // Arms are composited one at a time in game. Interleaving each outline and
    // fill matters when thick, independently sized horizontal/vertical arms overlap.
    return (
      <g key={key}>
        {rects.map((rect, index) => (
          <g key={`${key}-arm-${index}`}>
            {outlineEnabled && outlineThickness > 0 && (
              <g opacity={clampOpacity(outlineOpacity)}>
                {outlineNodes([rect], outlineThickness, `${key}-outline-${index}`)}
              </g>
            )}
            <g opacity={clampOpacity(opacity)}>
              {rectNodes([rect], color, `${key}-fill-${index}`)}
            </g>
          </g>
        ))}
      </g>
    )
  }

  return (
    <g key={key}>
      {outlineEnabled && outlineThickness > 0 && (
        <g opacity={clampOpacity(outlineOpacity)}>
          {rectNodes(rects.map(rect => expanded(rect, outlineThickness)), '#000000', `${key}-outline`)}
        </g>
      )}
      <g opacity={clampOpacity(opacity)}>{rectNodes(rects, color, `${key}-fill`)}</g>
    </g>
  )
}

function circularDot(
  center: number,
  diameter: number,
  color: string,
  opacity: number,
  outlineEnabled: boolean,
  outlineThickness: number,
) {
  const radius = diameter / 2

  return (
    <g key="cs2-dot" shapeRendering="geometricPrecision">
      {outlineEnabled && outlineThickness > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius + outlineThickness / 2}
          fill="none"
          stroke="#000000"
          strokeWidth={outlineThickness}
        />
      )}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={color}
        opacity={clampOpacity(opacity)}
      />
    </g>
  )
}

function renderValorant(code: string, size: number, magnification: number, autoFit: boolean) {
  const crosshair = parseValorantCode(code)
  const color = getValorantColor(crosshair)
  const center = size / 2
  const scale = autoFit ? valorantMagnification(crosshair, magnification, size) : magnification
  const elements: React.ReactNode[] = []

  // VALORANT composites the center-dot backing before line layers. This is
  // observable when dot opacity is zero: subsequent lines reveal their fill
  // over the black dot outline instead of exposing the world behind it.
  if (crosshair.dotEnabled && crosshair.dotSize > 0) {
    const dotSize = crosshair.dotSize * scale
    const dot: ArmRect = {
      x: center - dotSize / 2,
      y: center - dotSize / 2,
      width: dotSize,
      height: dotSize,
    }
    elements.push(outlinedShape(
      [dot],
      color,
      crosshair.dotOpacity,
      crosshair.outlineEnabled,
      crosshair.outlineThickness * scale,
      crosshair.outlineOpacity,
      'dot',
      'backing',
    ))
  }

  const addLines = (
    enabled: boolean,
    horizontalLength: number,
    verticalLength: number,
    unlinked: boolean,
    gap: number,
    thickness: number,
    opacity: number,
    key: string,
  ) => {
    const effectiveVerticalLength = unlinked ? verticalLength : horizontalLength
    if (!enabled || thickness <= 0 || (horizontalLength <= 0 && effectiveVerticalLength <= 0)) return

    const rects = armRects(
      center,
      center,
      horizontalLength * scale,
      effectiveVerticalLength * scale,
      Math.max(0, gap) * scale,
      thickness * scale,
    )
    elements.push(outlinedShape(
      rects,
      color,
      opacity,
      crosshair.outlineEnabled,
      crosshair.outlineThickness * scale,
      crosshair.outlineOpacity,
      key,
    ))
  }

  // A still preview represents the resting crosshair. Movement and firing-error
  // multipliers are dynamic and therefore intentionally do not add fake gap.
  addLines(
    crosshair.outerEnabled,
    crosshair.outerLength,
    crosshair.outerVertical,
    crosshair.outerLengthNotLinked,
    crosshair.outerOffset,
    crosshair.outerThickness,
    crosshair.outerOpacity,
    'outer',
  )
  addLines(
    crosshair.innerEnabled,
    crosshair.innerLength,
    crosshair.innerVertical,
    crosshair.innerLengthNotLinked,
    crosshair.innerOffset,
    crosshair.innerThickness,
    crosshair.innerOpacity,
    'inner',
  )

  return elements
}

function renderCS2(code: string, size: number, magnification: number, autoFit: boolean) {
  const crosshair = parseCS2Code(code)
  if (!crosshair) return null

  const center = size / 2
  const scale = autoFit ? cs2Magnification(crosshair, magnification, size) : magnification
  const color = getCS2Color(crosshair)
  const opacity = crosshair.alphaEnabled ? crosshair.alpha / 255 : 1
  const thickness = Math.max(1, crosshair.thickness) * scale
  const length = crosshair.length * scale

  // cl_crosshairgap is measured from the edge of the center pixel, while
  // armRects expects a center-to-inner-edge distance. Keeping half a line of
  // clearance is what prevents size-1 / gap--4 arms from merging into a plus.
  const gap = (Math.max(0, crosshair.gap + 4) + Math.max(1, crosshair.thickness) / 2) * scale
  const rects = armRects(
    center,
    center,
    length,
    length,
    gap,
    thickness,
    crosshair.tStyleEnabled,
  )

  const elements: React.ReactNode[] = [outlinedShape(
    rects,
    color,
    opacity,
    crosshair.outlineEnabled,
    crosshair.outline * scale,
    1,
    'cs2-lines',
  )]

  if (crosshair.centerDotEnabled) {
    const dotSize = Math.max(1, crosshair.thickness * 2) * scale
    const outlineThickness = crosshair.outline * scale

    if (crosshair.thickness < 1) {
      elements.push(circularDot(
        center,
        dotSize,
        color,
        opacity,
        crosshair.outlineEnabled,
        outlineThickness,
      ))
    } else {
      const dot: ArmRect = {
        x: center - dotSize / 2,
        y: center - dotSize / 2,
        width: dotSize,
        height: dotSize,
      }
      elements.push(outlinedShape(
        [dot],
        color,
        opacity,
        crosshair.outlineEnabled,
        outlineThickness,
        1,
        'cs2-dot',
      ))
    }
  }

  return elements
}
