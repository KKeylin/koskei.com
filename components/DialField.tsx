'use client'

import { useEffect, useRef } from 'react'

type Props = {
  rings: { r: number; size: number; line: string }[]
  dur: number
  reverse?: boolean
  /** Draw only when the canvas comes near the viewport (for dials far down the page) */
  lazy?: boolean
}

// Dial units: the dial is a 1000 × 1000 box centred on (500, 500)
const C = 500
// Longest side of the backing store: the canvas is a few times the dial's size
const MAX_SIDE = 2560
// Glyphs drawn per frame. All of them in one frame is one long raster task
// (seconds on a phone without a GPU canvas); spread over frames, the field
// fades in once it is complete
const BATCH = 30

/**
 * Text rings outside the dial's bezel, drawn once on a canvas that spins as a
 * whole. A canvas is a finished texture: rotating it and scaling it through the
 * dive never re-rasters, however much of the screen it covers. Glyphs and
 * hairlines match the SVG rings (`.dial-text`, `.dial-hairline`). Redrawn only
 * when the dial changes size.
 */
export default function DialField({ rings, dur, reverse, lazy }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const R = Math.max(...rings.map(ring => ring.r + ring.size))

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let side = 0
    let raf = 0
    let cancelled = false
    let observer: ResizeObserver | undefined

    const draw = () => {
      const css = canvas.clientWidth
      const dpr = Math.min(window.devicePixelRatio || 1, 2, MAX_SIDE / Math.max(1, css))
      const px = Math.round(css * dpr)
      if (!px || px === side) return
      side = px
      cancelAnimationFrame(raf)
      canvas.removeAttribute('data-ready')
      canvas.width = px
      canvas.height = px
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const k = px / (2 * R)
      const { color, fontFamily } = getComputedStyle(canvas)
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.textAlign = 'center'
      ctx.lineWidth = k
      ctx.setLineDash([k, 6 * k])

      let ring = 0
      let i = 0
      const batch = () => {
        raf = 0
        let budget = BATCH
        while (ring < rings.length && budget > 0) {
          const { r, size, line } = rings[ring]
          if (i === 0) {
            ctx.setTransform(1, 0, 0, 1, px / 2, px / 2)
            ctx.globalAlpha = 0.35
            ctx.beginPath()
            ctx.arc(0, 0, (r - size * 0.55) * k, 0, 2 * Math.PI)
            ctx.stroke()
          }
          // Monospace glyphs spread evenly round the circle, upright outwards,
          // clockwise from the top: what textPath with textLength does
          ctx.globalAlpha = 0.85
          ctx.font = `${size * k}px ${fontFamily}`
          const step = (2 * Math.PI) / line.length
          for (; i < line.length && budget > 0; i++, budget--) {
            ctx.setTransform(1, 0, 0, 1, px / 2, px / 2)
            ctx.rotate((i + 0.5) * step)
            ctx.fillText(line[i], 0, -r * k)
          }
          if (i === line.length) {
            ring++
            i = 0
          }
        }
        if (ring < rings.length) raf = requestAnimationFrame(batch)
        else canvas.setAttribute('data-ready', '')
      }
      batch()
    }

    const start = () => {
      draw()
      observer = new ResizeObserver(draw)
      observer.observe(canvas)
    }
    // Lazy: drawn the first time the reader gets within three screens. Drawing
    // takes ~1.6 s on a slow phone, so a closer start shows the fade-in late
    let near: IntersectionObserver | undefined
    document.fonts.load(`16px ${getComputedStyle(canvas).fontFamily}`).finally(() => {
      if (cancelled) return
      if (!lazy) return start()
      near = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        near?.disconnect()
        start()
      }, { rootMargin: '300% 0px' })
      near.observe(canvas)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      near?.disconnect()
    }
  }, [rings, R, lazy])

  const box = { left: `${(C - R) / 10}%`, top: `${(C - R) / 10}%`, width: `${R / 5}%`, height: `${R / 5}%` }
  return (
    <canvas
      ref={ref}
      className={`dial-layer dial-spin dial-field${reverse ? ' is-reverse' : ''}`}
      style={{ ...box, '--dur': `${dur}s` } as React.CSSProperties}
    />
  )
}
