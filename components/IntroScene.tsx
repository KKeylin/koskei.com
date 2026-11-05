'use client'

import { useEffect, useRef } from 'react'
import Dissolve from './Dissolve'

type Props = {
  copy: React.ReactNode
  dial: React.ReactNode
  /** Text rings around the dial, out to the stage corners */
  orbit: React.ReactNode
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Pinned hero. While the stage is held, the dark panel opens to full screen,
 * the dial grows and fades, and a disc from its centre fills the screen with
 * the next section's background. Every per-frame write is a transform, an
 * opacity or one clip-path on a solid layer, set inline on the element that
 * needs it, so scrolling never restyles or re-rasters the dial's text.
 *
 * On a phone the copy scrolls away on its own and the dark stage follows it
 * behind a pixel seam; the dive starts once the stage is pinned.
 */
export default function IntroScene({ copy, dial, orbit }: Props) {
  const root = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    const copyEl = copyRef.current
    const track = trackRef.current
    const stage = stageRef.current
    const panel = panelRef.current
    const field = fieldRef.current
    const orbitEl = orbitRef.current
    const dialEl = dialRef.current
    const reveal = revealRef.current
    const hint = hintRef.current
    if (!el || !copyEl || !track || !stage || !panel || !field || !orbitEl || !dialEl || !reveal || !hint) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = window.matchMedia('(max-width: 640px)')
    // Where scroll-driven animations exist, globals.css runs the whole scene on
    // the compositor; this effect then only pauses the dial when off screen.
    const native = CSS.supports('animation-timeline: view()')
    let frame = 0
    let last = ''
    let lastSize = -1

    const render = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      el.toggleAttribute('data-active', rect.bottom > 0 && rect.top < vh)
      if (native) return

      // Stage size, not window size: a classic scrollbar makes the window wider
      const w = stage.clientWidth
      const h = stage.clientHeight
      const mobile = narrow.matches
      let p = 0
      if (!reduce.matches) {
        const box = mobile ? track.getBoundingClientRect() : rect
        p = clamp01(-box.top / Math.max(1, box.height - h))
      }
      const key = `${mobile}:${p}`
      if (key === last) return
      last = key

      // Desktop: opening a = 0–40%, dive b = 42–100%. Phone: the dive is all of it.
      const a = mobile ? 1 : clamp01(p / 0.4)
      const b = mobile ? p : clamp01((p - 0.42) / 0.58)
      const d = mobile ? Math.min(w * 0.88, h * 0.62) : Math.min(w * 0.42, h * 0.76)
      const cx = mobile ? w / 2 : w * (0.75 - 0.25 * a)
      const cy = h / 2
      const scale = (mobile ? 1 : 1 + 0.25 * a) + 3.2 * Math.pow(b, 1.5)

      copyEl.style.opacity = mobile ? '' : String(1 - a * 1.8)
      copyEl.style.transform = mobile ? '' : `translate3d(${-a * w * 0.04}px, 0, 0)`
      hint.style.opacity = String(1 - a * 4)
      panel.style.transform = mobile ? '' : `scaleX(${0.5 + 0.5 * a})`
      // The field follows the panel's left edge; the orbit sits that much further left in it
      const shift = mobile ? 0 : (1 - a) * w / 2
      field.style.translate = mobile ? '' : `${shift}px 0`
      const opacity = String(1 - clamp01((b - 0.45) / 0.5))
      for (const [node, x] of [[dialEl, cx], [orbitEl, cx - shift]] as const) {
        if (d !== lastSize) node.style.width = `${d}px`
        node.style.transform = `translate3d(${x - d / 2}px, ${cy - d / 2}px, 0) scale(${scale})`
        node.style.opacity = opacity
      }
      lastSize = d
      reveal.style.clipPath = b > 0 ? `circle(${b * b * 95}vmax at ${cx}px ${cy}px)` : 'circle(0 at 50% 50%)'
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }
    const reset = () => {
      last = ''
      lastSize = -1
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
      <div ref={copyRef} className="intro-copy">{copy}</div>
      <div className="intro-seam" aria-hidden="true">
        <Dissolve to="dark" part="dark" />
      </div>
      <div ref={trackRef} className="intro-track">
        <div ref={stageRef} className="intro-stage">
          <div ref={panelRef} className="intro-panel" aria-hidden="true" />
          <div ref={fieldRef} className="intro-field" aria-hidden="true">
            <div ref={orbitRef} className="intro-dial intro-orbit">{orbit}</div>
          </div>
          <div ref={dialRef} className="intro-dial" aria-hidden="true">{dial}</div>
          <div ref={revealRef} className="intro-reveal" aria-hidden="true" />
          <div ref={hintRef} className="scroll-hint" aria-hidden="true">Scroll</div>
        </div>
      </div>
    </section>
  )
}
