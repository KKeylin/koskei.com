'use client'

import { useEffect, useRef } from 'react'

const LETTERS = 'REACTTYPESCRIPTCONFIGDRIVEN32MSMODULEFEDERATIONAGGRIDSTORYBOOK'

const hash = (x: number, y: number, s: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453
  return v - Math.floor(v)
}
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

type Props = {
  to: 'dark' | 'light'
  /**
   * Draw only one side of the seam on a transparent canvas: 'light' keeps the
   * light cells, 'dark' the dark ones. Two such canvases laid on top of each
   * other make the full band, and can be pulled apart along the jagged edge.
   */
  part?: 'light' | 'dark'
}

/**
 * A band between a light and a dark section. The dark side breaks up into
 * cells and letters as it meets the light one; the edge moves with scroll and
 * cells flicker while the band is on screen. Decorative.
 */
export default function Dissolve({ to, part }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = getComputedStyle(document.documentElement)
    const paper = root.getPropertyValue('--bg').trim()
    const night = root.getPropertyValue('--ink').trim()
    const family = getComputedStyle(canvas).fontFamily

    let width = 0
    let height = 0
    let cell = 12
    let lastKey = ''

    // Drawn at one canvas pixel per CSS pixel: the look is blocky anyway, and it
    // keeps the texture upload a quarter of the size on a retina screen.
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      cell = width < 640 ? 9 : 12
      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      ctx.font = `${Math.round(cell * 0.9)}px ${family}`
      ctx.textBaseline = 'top'
      lastKey = ''
    }

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = reduce.matches ? 0.5 : Math.min(1, Math.max(0, (vh - rect.top) / (vh + height)))
      // The edge moves in steps: blocky by design, and a redraw only when a step is crossed.
      const shift = Math.round((progress - 0.5) * 0.6 * 40) / 40
      const tick = reduce.matches ? 0 : Math.floor(time / 140)
      const key = `${shift}:${tick}`
      if (key === lastKey) return
      lastKey = key
      const cols = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)

      if (part) ctx.clearRect(0, 0, width, height)
      else {
        ctx.fillStyle = paper
        ctx.fillRect(0, 0, width, height)
      }
      for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) / rows
        const darkness = to === 'dark' ? y + shift : 1 - y - shift
        const density = smooth(darkness * 1.5 - 0.25)
        for (let c = 0; c < cols; c++) {
          const base = hash(c, r, 1)
          const n = base * 0.85 + hash(c, r, tick + Math.floor(base * 7)) * 0.15
          const letter = LETTERS[(c * 7 + r * 3) % LETTERS.length]
          const x = c * cell
          const top = r * cell
          if (n < density) {
            if (part === 'light') continue
            ctx.fillStyle = night
            ctx.fillRect(x, top, cell, cell)
            if (hash(c, r, 9) < 0.06) {
              ctx.fillStyle = paper
              ctx.fillText(letter, x + cell * 0.18, top + cell * 0.05)
            }
          } else {
            if (part === 'dark') continue
            if (part === 'light') {
              ctx.fillStyle = paper
              ctx.fillRect(x, top, cell, cell)
            }
            if (n < density + 0.07) {
              ctx.fillStyle = night
              ctx.fillText(letter, x + cell * 0.18, top + cell * 0.05)
            }
          }
        }
      }
    }

    let raf = 0
    let last = 0
    let visible = false
    let scrollFrame = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < 120) return
      last = now
      draw(now)
    }
    const onScroll = () => {
      if (!visible || scrollFrame) return
      scrollFrame = requestAnimationFrame(now => {
        scrollFrame = 0
        draw(now)
      })
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      raf = 0
      if (visible && !reduce.matches) raf = requestAnimationFrame(loop)
    })
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    io.observe(canvas)
    ro.observe(canvas)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(scrollFrame)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [to, part])

  return <canvas ref={ref} className="dissolve" aria-hidden="true" />
}
