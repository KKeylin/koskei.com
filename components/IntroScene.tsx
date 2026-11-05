'use client'

import { useEffect, useRef } from 'react'

type Props = {
  copy: React.ReactNode
  dial: React.ReactNode
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Pinned hero. While the stage is held, the dark panel opens to full screen,
 * the dial grows and fades, and a disc from its centre fills the screen with
 * the next section's background. Every per-frame write is a transform, an
 * opacity or one clip-path on a solid layer, set inline on the element that
 * needs it, so scrolling never restyles or re-rasters the dial's text.
 */
export default function IntroScene({ copy, dial }: Props) {
  const root = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    const copyEl = copyRef.current
    const panel = panelRef.current
    const dialEl = dialRef.current
    const reveal = revealRef.current
    const hint = hintRef.current
    if (!el || !copyEl || !panel || !dialEl || !reveal || !hint) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = window.matchMedia('(max-width: 640px)')
    // Where scroll-driven animations exist, globals.css runs the whole scene on
    // the compositor; this effect then only pauses the dial when off screen.
    const native = CSS.supports('animation-timeline: view()')
    let frame = 0
    let last = -1
    let lastSize = -1

    const render = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      el.toggleAttribute('data-active', rect.bottom > 0 && rect.top < vh)
      if (native) return

      const p = reduce.matches ? 0 : clamp01(-rect.top / Math.max(1, rect.height - vh))
      if (p === last) return
      last = p
      const a = clamp01(p / 0.4)
      const b = clamp01((p - 0.42) / 0.58)

      const mobile = narrow.matches
      const d = mobile ? Math.min(vw * 0.66, vh * 0.3) : Math.min(vw * 0.42, vh * 0.76)
      const cx = mobile ? vw / 2 : vw * (0.75 - 0.25 * a)
      const cy = mobile ? vh * (0.88 - 0.38 * a) : vh / 2
      const scale = 1 + 0.25 * a + 3.2 * Math.pow(b, 1.5)

      copyEl.style.opacity = String(1 - a * 1.8)
      copyEl.style.transform = `translate3d(${-a * vw * 0.04}px, 0, 0)`
      hint.style.opacity = String(1 - a * 4)
      panel.style.transform = mobile ? `scaleY(${0.27 + 0.73 * a})` : `scaleX(${0.5 + 0.5 * a})`
      if (d !== lastSize) {
        dialEl.style.width = `${d}px`
        lastSize = d
      }
      dialEl.style.transform = `translate3d(${cx - d / 2}px, ${cy - d / 2}px, 0) scale(${scale})`
      dialEl.style.opacity = String(1 - clamp01((b - 0.45) / 0.5))
      reveal.style.clipPath = b > 0 ? `circle(${b * b * 95}vmax at ${cx}px ${cy}px)` : 'circle(0 at 50% 50%)'
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }
    const reset = () => {
      last = -1
      schedule()
    }
    render()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', reset)
    reduce.addEventListener('change', reset)
    narrow.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', reset)
      reduce.removeEventListener('change', reset)
      narrow.removeEventListener('change', reset)
    }
  }, [])

  return (
    <section ref={root} id="hero" className="intro">
      <div className="intro-stage">
        <div ref={copyRef} className="intro-copy">{copy}</div>
        <div ref={panelRef} className="intro-panel" aria-hidden="true" />
        <div ref={dialRef} className="intro-dial" aria-hidden="true">{dial}</div>
        <div ref={revealRef} className="intro-reveal" aria-hidden="true" />
        <div ref={hintRef} className="scroll-hint" aria-hidden="true">Scroll</div>
      </div>
    </section>
  )
}
