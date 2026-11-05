'use client'

import { useEffect, useRef } from 'react'

type Props = {
  /** Text rings around the disc */
  orbit: React.ReactNode
  /** What the disc holds */
  children: React.ReactNode
}

/**
 * The closing section, the hero's dial seen from outside: a light disc with
 * the contact details in a field of turning text rings. As the section scrolls
 * in, the disc grows and the rings pull back to size (globals.css). The rings
 * only turn while the section is on screen.
 */
export default function Finale({ orbit, children }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute('data-active', entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="contact" className="dark finale">
      <div className="finale-orbit" aria-hidden="true">{orbit}</div>
      <div className="finale-disc">{children}</div>
    </section>
  )
}
