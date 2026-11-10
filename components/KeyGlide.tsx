'use client'

import { useEffect } from 'react'

// The blocks the page is walked by
const BLOCKS = 'main > section, main > .curtain, footer'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
// Cubic ease-in-out
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Glide = { from: number; to: number; start: number; ms: number }

/**
 * ↓ and ↑ glide to the next or previous block with an ease-in-out curve
 * instead of the browser's fixed nudge, as on jpaste.com. Few stops, so nobody
 * has to hammer the key: the hero dives in one move onto the RBC case, each
 * scroll scene (`.scene`, see ScrollScene) plays in one move to its result,
 * the curtain stops once with the poster open. Those moves are slower,
 * so the animation they play reads. Any other tall block is walked a screen at
 * a time. A press while a glide is heading the same way is dropped, so holding
 * or hammering the key goes one stop at a time. In-page links clicked with a
 * pointer glide too (from the keyboard they keep the browser's jump, which also
 * moves focus). The wheel, trackpad and touch are left alone, and any of them
 * stops a glide. With reduced motion none of this runs. Renders nothing.
 */
export default function KeyGlide() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement
    let glide: Glide | null = null

    // Stops, and the stretches of the page whose scroll plays an animation
    const layout = () => {
      const vh = window.innerHeight
      const max = root.scrollHeight - vh
      const list = [0]
      const animated: [number, number][] = []
      for (const el of document.querySelectorAll<HTMLElement>(BLOCKS)) {
        // A section pulled up under the previous one starts after its lead
        const lead = parseFloat(getComputedStyle(el).getPropertyValue('--lead')) || 0
        const top = el.getBoundingClientRect().top + window.scrollY + lead
        const end = top + el.offsetHeight - lead - vh
        if (el.id === 'hero') {
          // Its end is where the RBC case starts: one move dives onto it
          list.push(top, end)
          animated.push([top, end])
        } else if (el.classList.contains('scene')) {
          // Only the result: one move plays the whole scene
          list.push(end)
          animated.push([top, end])
        } else if (el.classList.contains('curtain')) {
          list.push((top + end) / 2)
          animated.push([top, end])
        } else if (end > top + vh * 0.5) {
          list.push(top)
          const n = Math.ceil((end - top) / (vh * 0.85))
          for (let k = 1; k <= n; k++) list.push(top + ((end - top) * k) / n)
        } else {
          list.push(top)
        }
      }
      list.push(max)
      // Stops this close would make a press feel like it did nothing
      const sorted = list.map(y => Math.round(clamp(y, 0, max))).sort((a, b) => a - b)
      const out: number[] = []
      for (const y of sorted) {
        if (out.length > 1 && y - out[out.length - 1] <= 80) out[out.length - 1] = y
        else if (!out.length || y - out[out.length - 1] > 80) out.push(y)
      }
      return { stops: out, animated }
    }

    const stop = () => {
      if (!glide) return
      glide = null
      root.style.scrollBehavior = ''
    }

    const glideTo = (to: number, slow = false) => {
      const from = window.scrollY
      const dist = Math.abs(to - from)
      if (dist < 2) return
      const ms = slow ? clamp(800 + dist * 0.5, 1100, 2200) : clamp(420 + dist * 0.3, 520, 1500)
      const g: Glide = { from, to, start: performance.now(), ms }
      glide = g
      // The page scrolls smoothly by CSS; each step here has to land at once
      root.style.scrollBehavior = 'auto'
      const step = (now: number) => {
        if (glide !== g) return
        const t = clamp((now - g.start) / g.ms, 0, 1)
        window.scrollTo(0, g.from + (g.to - g.from) * ease(t))
        if (t < 1) requestAnimationFrame(step)
        else stop()
      }
      step(performance.now())
    }

    const walk = (dir: 1 | -1) => {
      if (glide && Math.sign(glide.to - glide.from) === dir) return
      const y = window.scrollY
      const { stops, animated } = layout()
      const next = dir > 0 ? stops.find(s => s > y + 4) : stops.filter(s => s < y - 4).pop()
      if (next === undefined) return
      const lo = Math.min(y, next)
      const hi = Math.max(y, next)
      glideTo(next, animated.some(([a, b]) => Math.max(a, lo) < Math.min(b, hi)))
    }

    const onKey = (e: KeyboardEvent) => {
      if (reduce.matches || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const t = e.target
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      e.preventDefault()
      walk(e.key === 'ArrowDown' ? 1 : -1)
    }

    const onClick = (e: MouseEvent) => {
      // detail 0: activated from the keyboard
      if (reduce.matches || e.defaultPrevented || e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null
      const id = link?.getAttribute('href')?.slice(1)
      const target = id ? document.getElementById(id) : null
      if (!target) return
      e.preventDefault()
      const max = root.scrollHeight - window.innerHeight
      glideTo(clamp(target.getBoundingClientRect().top + window.scrollY, 0, max))
      history.pushState(null, '', `#${id}`)
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    const interrupts = ['wheel', 'touchstart', 'mousedown'] as const
    for (const type of interrupts) window.addEventListener(type, stop, { passive: true })
    return () => {
      stop()
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
      for (const type of interrupts) window.removeEventListener(type, stop)
    }
  }, [])

  return null
}
