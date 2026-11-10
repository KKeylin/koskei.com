'use client'

import { useEffect, useRef } from 'react'

type Props = {
  /** Text the rows are filled with, repeated, each row starting further along */
  text: string
}

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+*'
const DURATION = 1800 // ms a wave takes to cross the field
const BAND = 90 // px: width of the bright ring
const RAGGED = 120 // px: how far each cell moves the ring's edge, so it is never a clean circle
const STEPS = 6 // brightness steps a lit cell can take
const BASE_ALPHA = 0.07
// The canvas starts above the section (over the seam, by its CSS top) and runs
// this far past the section's bottom, under the section that follows
const SPARE = 480

const hash = (i: number, s: number) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453
  return v - Math.floor(v)
}
const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * A field of barely visible text behind a dark section. A click anywhere in
 * the section sends a ragged wave out from that point: the glyphs it passes
 * light up, scramble, a few invert, and settle back. A wave also runs once
 * when the section first comes into view. Nothing animates between waves, and
 * a frame only redraws the cells whose brightness changed. Decorative.
 */
export default function GlyphField({ text }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ripples: { x: number; y: number; t0: number; reach: number }[] = []
    let width = 0
    let height = 0
    let above = 0 // px of canvas above the section
    let dpr = 1
    let cw = 8
    let ch = 18
    let cols = 0
    let rows = 0
    let glyphs = ''
    let jitter = new Float32Array(0)
    let level = new Uint8Array(0)
    let light = ''
    let dark = ''
    let raf = 0
    let ready = false
    let entered = false
    let cancelled = false

    const drawCell = (i: number, step: number, now: number) => {
      const x = (i % cols) * cw
      const y = Math.floor(i / cols) * ch
      ctx.clearRect(x, y, cw, ch)
      let glyph = glyphs[i]
      if (step === 0) {
        ctx.globalAlpha = BASE_ALPHA
        ctx.fillStyle = light
      } else {
        const v = step / STEPS
        // Lit cells mostly scramble; at the crest a few turn into solid blocks
        if (hash(i, 5) < 0.6) glyph = SCRAMBLE[Math.floor(hash(i, Math.floor(now / 60)) * SCRAMBLE.length)]
        if (step === STEPS && hash(i, 7) < 0.12) {
          ctx.globalAlpha = 1
          ctx.fillStyle = light
          ctx.fillRect(x, y + 1, cw, ch - 2)
          ctx.fillStyle = dark
        } else {
          ctx.globalAlpha = BASE_ALPHA + (1 - BASE_ALPHA) * v
          ctx.fillStyle = light
        }
      }
      if (glyph !== ' ') ctx.fillText(glyph, x, y + ch / 2)
    }

    const layout = () => {
      width = host.clientWidth
      above = -canvas.offsetTop
      height = above + host.clientHeight + SPARE
      canvas.style.height = `${height}px`
      // Whole device pixels per cell: a cell can be cleared and redrawn without seams
      dpr = window.devicePixelRatio >= 2 ? 2 : 1
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      const style = getComputedStyle(canvas)
      const size = parseFloat(style.fontSize)
      light = style.color
      dark = getComputedStyle(host).backgroundColor
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${size}px ${style.fontFamily}`
      ctx.textBaseline = 'middle'
      cw = Math.ceil(ctx.measureText('M').width)
      ch = Math.round(size * 1.5)
      cols = Math.ceil(width / cw)
      rows = Math.ceil(height / ch)
      const n = cols * rows
      let line = ''
      for (let r = 0; r < rows; r++) {
        const start = (r * 37) % text.length
        let row = ''
        while (row.length < cols + start) row += text
        line += row.slice(start, start + cols)
      }
      glyphs = line
      jitter = new Float32Array(n)
      for (let i = 0; i < n; i++) jitter[i] = (hash(i, 1) - 0.5) * RAGGED
      level = new Uint8Array(n)
      const now = performance.now()
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < n; i++) drawCell(i, 0, now)
    }

    const frame = (now: number) => {
      raf = 0
      for (let k = ripples.length - 1; k >= 0; k--) if (now - ripples[k].t0 > DURATION) ripples.splice(k, 1)
      const waves = ripples.map(({ x, y, t0, reach }) => {
        const t = Math.min(1, (now - t0) / DURATION)
        return { x, y, radius: smooth(t) * reach, fade: 1 - t * t }
      })
      for (let r = 0, i = 0; r < rows; r++) {
        const cy = (r + 0.5) * ch
        for (let c = 0; c < cols; c++, i++) {
          let v = 0
          for (const w of waves) {
            const d = Math.hypot((c + 0.5) * cw - w.x, cy - w.y) + jitter[i]
            const bell = (1 - Math.abs(d - w.radius) / BAND) * w.fade
            if (bell > v) v = bell
          }
          // Stippled: how bright a cell gets also decides whether it lights at all
          const step = v > 0 && hash(i, 3) < v * 1.4 ? Math.max(1, Math.round(v * STEPS)) : 0
          if (step !== level[i]) {
            level[i] = step
            drawCell(i, step, now)
          }
        }
      }
      if (ripples.length) raf = requestAnimationFrame(frame)
    }

    const ripple = (x: number, y: number) => {
      if (!ready || reduce.matches) return
      const reach = Math.max(Math.hypot(x, y), Math.hypot(width - x, y), Math.hypot(x, height - y), Math.hypot(width - x, height - y))
      if (ripples.length >= 4) ripples.shift()
      ripples.push({ x, y, t0: performance.now(), reach: reach + BAND + RAGGED })
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // A click from the keyboard has no pointer position: start from the element instead
      const source = event.detail === 0 && event.target instanceof Element ? event.target.getBoundingClientRect() : null
      const x = source ? source.left + source.width / 2 : event.clientX
      const y = source ? source.top + source.height / 2 : event.clientY
      ripple(x - rect.left, y - rect.top)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entered) return
      entered = true
      ripple(width * 0.3, above + host.clientHeight * 0.45)
    }, { threshold: 0.35 })
    // Lay out again once a resize settles; waves in flight carry on over the new grid
    let settle = 0
    const ro = new ResizeObserver(() => {
      if (!ready || (host.clientWidth === width && above + host.clientHeight + SPARE === height)) return
      clearTimeout(settle)
      settle = window.setTimeout(() => {
        layout()
        if (ripples.length && !raf) raf = requestAnimationFrame(frame)
      }, 120)
    })

    // Laid out the first time the reader gets within a screen and a half
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      near.disconnect()
      ready = true
      layout()
      io.observe(host)
    }, { rootMargin: '150% 0px' })
    const family = getComputedStyle(canvas).fontFamily
    document.fonts.load(`12px ${family}`).finally(() => {
      if (cancelled) return
      near.observe(host)
    })
    ro.observe(host)
    host.addEventListener('click', onClick)

    return () => {
      cancelled = true
      clearTimeout(settle)
      cancelAnimationFrame(raf)
      near.disconnect()
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('click', onClick)
    }
  }, [text])

  return <canvas ref={ref} className="glyph-field" aria-hidden="true" />
}
