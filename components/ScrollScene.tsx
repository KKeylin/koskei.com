'use client'

import { useEffect, useRef } from 'react'

type Props = {
  id?: string
  className?: string
  children: React.ReactNode
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * A section whose children react to scroll progress.
 *
 * From scroll progress (0..1) it counts `[data-count-to]` numbers and marks
 * `[data-step]` elements as reached (`data-on`) or current (`data-current`);
 * `[data-at]` elements are only switched on, never current. A tall section with
 * a sticky stage is pinned: progress runs while the stage is held. A section no
 * taller than the viewport is not pinned: progress runs while it passes
 * through the viewport.
 *
 * Under prefers-reduced-motion everything is shown at its end state.
 */
export default function ScrollScene({ id, className, children }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const counters = Array.from(el.querySelectorAll<HTMLElement>('[data-count-to]'))
    const steps = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'))
    const marks = Array.from(el.querySelectorAll<HTMLElement>('[data-at]'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let current = -1
    let frame = 0
    let last = ''

    const render = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const range = rect.height - vh
      let p = 1
      if (!reduce.matches) {
        p = range > 50
          ? clamp01(-rect.top / range)
          : clamp01((vh * 0.85 - rect.top) / (rect.height * 0.8))
      }
      const value = p.toFixed(3)
      if (value === last) return
      last = value

      for (const c of counters) {
        const from = Number(c.dataset.countFrom ?? 0)
        const to = Number(c.dataset.countTo)
        const [a, b] = (c.dataset.countRange ?? '0,1').split(',').map(Number)
        const t = clamp01((p - a) / (b - a))
        const eased = 1 - Math.pow(1 - t, 3)
        const text = String(Math.round(from + (to - from) * eased)).padStart(Number(c.dataset.countPad ?? 0), '0')
        if (c.textContent !== text) c.textContent = text
      }

      let next = -1
      steps.forEach((s, i) => {
        const on = p >= Number(s.dataset.step)
        s.toggleAttribute('data-on', on)
        if (on) next = i
      })
      if (next !== current) {
        steps[current]?.removeAttribute('data-current')
        steps[next]?.setAttribute('data-current', '')
        current = next
      }
      for (const m of marks) m.toggleAttribute('data-on', p >= Number(m.dataset.at))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }
    const reset = () => {
      last = ''
      schedule()
    }
    render()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', reset)
    reduce.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', reset)
      reduce.removeEventListener('change', reset)
    }
  }, [])

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  )
}
