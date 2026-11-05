'use client'

import { useEffect, useRef } from 'react'

type Props = {
  rings: { r: number; size: number; line: string }[]
  dur: number
  reverse?: boolean
}

// Dial units: the dial is a 1000 × 1000 box centred on (500, 500)
const C = 500
// Longest side of the backing store: the canvas is a few times the dial's size
const MAX_SIDE = 2560

/**
 * Text rings outside the dial's bezel, drawn once on a canvas that spins as a
 * whole. A canvas is a finished texture: rotating it and scaling it through the
 * dive never re-rasters, however much of the screen it covers. Glyphs and
 * hairlines match the SVG rings (`.dial-text`, `.dial-hairline`). Redrawn only
 * when the dial changes size.
 */
export default function DialField({ rings, dur, reverse }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const R = Math.max(...rings.map(ring => ring.r + ring.size))

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let side = 0
    let cancelled = false
    let observer: ResizeObserver | undefined

    const draw = () => {
      const css = canvas.clientWidth
      const dpr = Math.min(window.devicePixelRatio || 1, 2, MAX_SIDE / Math.max(1, css))
      const px = Math.round(css * dpr)
      if (!px || px === side) return
      side = px
      canvas.width = px
      canvas.height = px
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const k = px / (2 * R)
      const { color, fontFamily } = getComputedStyle(canvas)
      ctx.translate(px / 2, px / 2)
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.textAlign = 'center'
      ctx.lineWidth = k
      ctx.setLineDash([k, 6 * k])

      for (const { r, size, line } of rings) {
        ctx.globalAlpha = 0.35
        ctx.beginPath()
        ctx.arc(0, 0, (r - size * 0.55) * k, 0, 2 * Math.PI)
        ctx.stroke()

        // Monospace glyphs spread evenly round the circle, upright outwards,
        // clockwise from the top: what textPath with textLength does
        ctx.globalAlpha = 0.85
        ctx.font = `${size * k}px ${fontFamily}`
        const step = (2 * Math.PI) / line.length
        for (let i = 0; i < line.length; i++) {
          ctx.setTransform(1, 0, 0, 1, px / 2, px / 2)
          ctx.rotate((i + 0.5) * step)
          ctx.fillText(line[i], 0, -r * k)
        }
        ctx.setTransform(1, 0, 0, 1, px / 2, px / 2)
      }
      canvas.setAttribute('data-ready', '')
    }

    document.fonts.load(`16px ${getComputedStyle(canvas).fontFamily}`).finally(() => {
      if (cancelled) return
      draw()
      observer = new ResizeObserver(draw)
      observer.observe(canvas)
    })
    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [rings, R])

  const box = { left: `${(C - R) / 10}%`, top: `${(C - R) / 10}%`, width: `${R / 5}%`, height: `${R / 5}%` }
  return (
    <canvas
      ref={ref}
      className={`dial-layer dial-spin dial-field${reverse ? ' is-reverse' : ''}`}
      style={{ ...box, '--dur': `${dur}s` } as React.CSSProperties}
    />
  )
}
