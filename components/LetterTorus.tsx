'use client'

import { useEffect, useRef } from 'react'

const WORDS = 'REACT TYPESCRIPT REDUX AG-GRID MUI MODULE-FEDERATION MICRO-FRONTENDS CONFIG-DRIVEN FEATURE-SLICED-DESIGN JEST STORYBOOK NEXT.JS WCAG 32MS '
const HIGHLIGHT = '32MS'

// Positions in WORDS that belong to the highlighted word.
const highlighted = new Set<number>()
for (let i = WORDS.indexOf(HIGHLIGHT); i !== -1; i = WORDS.indexOf(HIGHLIGHT, i + 1)) {
  for (let k = 0; k < HIGHLIGHT.length; k++) highlighted.add(i + k)
}
const GLYPHS = Array.from(new Set(WORDS.replace(/ /g, '')))

const THETA_STEP = 0.09
const PHI_STEP = 0.03
const R1 = 1
const R2 = 2
const K2 = 5
const FRAME_MS = 50
const ALPHA_LEVELS = 8

/**
 * A rotating torus made of the stack's words, after donut.c. The text is fixed
 * to the character grid so the words stay readable; the torus shows through
 * brightness. Glyphs are drawn once into an atlas and copied per cell, the
 * loop runs at 20 fps and only while the canvas is on screen. Decorative:
 * rendered aria-hidden by the parent.
 */
export default function LetterTorus() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const css = getComputedStyle(canvas)
    const root = getComputedStyle(document.documentElement)
    const ink = css.color
    const paper = root.getPropertyValue('--bg').trim()
    const night = root.getPropertyValue('--ink').trim()
    const accent = root.getPropertyValue('--accent').trim()
    const family = css.fontFamily

    const thetaN = Math.ceil((2 * Math.PI) / THETA_STEP)
    const phiN = Math.ceil((2 * Math.PI) / PHI_STEP)
    const cosT = Float32Array.from({ length: thetaN }, (_, i) => Math.cos(i * THETA_STEP))
    const sinT = Float32Array.from({ length: thetaN }, (_, i) => Math.sin(i * THETA_STEP))
    const cosP = Float32Array.from({ length: phiN }, (_, i) => Math.cos(i * PHI_STEP))
    const sinP = Float32Array.from({ length: phiN }, (_, i) => Math.sin(i * PHI_STEP))

    let cols = 0
    let rows = 0
    let cellW = 0
    let cellH = 0
    let gw = 0
    let gh = 0
    let zbuf = new Float32Array(0)
    let lum = new Float32Array(0)
    let cellGlyph = new Int16Array(0)
    let cellAccent = new Uint8Array(0)
    let atlas: HTMLCanvasElement | null = null
    let A = 1.1
    let B = 0.5

    // Atlas rows: ALPHA_LEVELS rows of light glyphs at rising opacity, then accent, then inverted blocks.
    const buildAtlas = (fontSize: number, dpr: number) => {
      gw = Math.ceil(cellW * dpr)
      gh = Math.ceil(cellH * dpr)
      atlas = document.createElement('canvas')
      atlas.width = gw * GLYPHS.length
      atlas.height = gh * (ALPHA_LEVELS + 2)
      const a = atlas.getContext('2d')
      if (!a) return
      a.font = `${fontSize * dpr}px ${family}`
      a.textBaseline = 'top'
      GLYPHS.forEach((g, i) => {
        const x = i * gw
        a.fillStyle = ink
        for (let level = 0; level < ALPHA_LEVELS; level++) {
          a.globalAlpha = 0.16 + (0.84 * (level + 1)) / ALPHA_LEVELS
          a.fillText(g, x, level * gh)
        }
        a.globalAlpha = 1
        a.fillStyle = accent
        a.fillText(g, x, ALPHA_LEVELS * gh)
        a.fillStyle = paper
        a.fillRect(x, (ALPHA_LEVELS + 1) * gh, gw, gh)
        a.fillStyle = night
        a.fillText(g, x, (ALPHA_LEVELS + 1) * gh)
      })
    }

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      const fontSize = Math.max(9, Math.round(width / 54))
      cellW = fontSize * 0.62
      cellH = fontSize * 1.08
      cols = Math.floor(width / cellW)
      rows = Math.floor(height / cellH)
      zbuf = new Float32Array(cols * rows)
      lum = new Float32Array(cols * rows)
      cellGlyph = new Int16Array(cols * rows)
      cellAccent = new Uint8Array(cols * rows)
      for (let idx = 0; idx < cols * rows; idx++) {
        const at = (((idx / cols) | 0) * 11 + (idx % cols)) % WORDS.length
        cellGlyph[idx] = WORDS[at] === ' ' ? -1 : GLYPHS.indexOf(WORDS[at])
        cellAccent[idx] = highlighted.has(at) ? 1 : 0
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildAtlas(fontSize, dpr)
    }

    const draw = () => {
      if (!atlas) return
      const w = cols * cellW
      const h = rows * cellH
      const k1 = (Math.min(w, h) * K2 * 3) / (8 * (R1 + R2))
      const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B)
      zbuf.fill(0)

      for (let j = 0; j < thetaN; j++) {
        const ct = cosT[j], st = sinT[j]
        const cx = R2 + R1 * ct
        const cy = R1 * st
        for (let i = 0; i < phiN; i++) {
          const cp = cosP[i], sp = sinP[i]
          const ooz = 1 / (K2 + cA * cx * sp + cy * sA)
          const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB
          const y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB
          const col = ((w / 2 + k1 * ooz * x) / cellW) | 0
          const row = ((h / 2 - k1 * ooz * y) / cellH) | 0
          if (col < 0 || col >= cols || row < 0 || row >= rows) continue
          const idx = row * cols + col
          if (ooz > zbuf[idx]) {
            zbuf[idx] = ooz
            lum[idx] = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp)
          }
        }
      }

      ctx.clearRect(0, 0, w + cellW, h + cellH)
      for (let idx = 0; idx < cols * rows; idx++) {
        const g = cellGlyph[idx]
        if (zbuf[idx] === 0 || g < 0) continue
        const t = Math.max(0, lum[idx]) / Math.SQRT2
        let row: number
        if (t > 0.9) row = ALPHA_LEVELS + 1
        else if (cellAccent[idx] && t > 0.45) row = ALPHA_LEVELS
        else row = Math.min(ALPHA_LEVELS - 1, (t * ALPHA_LEVELS) | 0)
        ctx.drawImage(atlas, g * gw, row * gh, gw, gh, (idx % cols) * cellW, ((idx / cols) | 0) * cellH, cellW, cellH)
      }
    }

    let raf = 0
    let last = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now - last < FRAME_MS) return
      last = now
      A += 0.045
      B += 0.024
      draw()
    }
    const start = () => {
      if (!raf && !reduce.matches) raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    io.observe(canvas)
    ro.observe(canvas)
    const onReduce = () => (reduce.matches ? stop() : start())
    reduce.addEventListener('change', onReduce)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      reduce.removeEventListener('change', onReduce)
    }
  }, [])

  return <canvas ref={ref} className="letter-torus" />
}
