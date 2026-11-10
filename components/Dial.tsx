// Stopwatch-style dial for the hero: rings of text set on circles, a bezel of
// ticks and a sweeping hand, in a field of larger rings that runs past the
// bezel to the corners of the stage. Purely decorative: the parent hides it
// from assistive tech.
//
// Inside the bezel each ring is its own SVG layer, cut to the ring's own box,
// so it rotates on the compositor. The rings outside the bezel are a separate
// piece, DialOrbit: drawn once on two canvases (one per direction, see
// DialField), because as SVG layers that big Chrome re-rasters them at every
// scale of the dive. IntroScene lays the orbit under the dial in a window that
// keeps it off the copy.

import DialField from './DialField'

const C = 500

type Ring = { r: number; size: number; text: string; dur: number; reverse?: boolean; accent?: boolean }
type FieldRing = Omit<Ring, 'dur' | 'accent'>

// Past the bezel type and spacing grow by ~9% per ring. The outermost reaches
// the corners of any screen, ultrawide and phone included, once the dial is
// centred; the stage clips the rest.
const FIELD: FieldRing[] = [
  { r: 1423, size: 60, text: 'KOSTIANTYN KEILIN · SENIOR FRONT-END ENGINEER · TORONTO, ONTARIO · ', reverse: true },
  { r: 1294, size: 55, text: 'TWO HEADS ARE BETTER THAN NONE · MEET JOEJIM · ' },
  { r: 1176, size: 50, text: 'THE DASHBOARD TOOK TWO SECONDS · NOW IT TAKES 32 MS · ', reverse: true },
  { r: 1068, size: 46, text: 'SENIOR FRONT-END ENGINEER · ENTERPRISE UIS THAT STAY FAST AND COHERENT · ' },
  { r: 969, size: 42, text: 'MICRO-FRONTENDS · CONFIG-DRIVEN ARCHITECTURE · FEATURE-SLICED DESIGN · ', reverse: true },
  { r: 878, size: 39, text: 'RBC CAPITAL MARKETS · CI FINANCIAL · DELOITTE · SOPHIA GENETICS · EPAM · ' },
  { r: 794, size: 36, text: 'REACT · TYPESCRIPT · NEXT.JS · REDUX · MUI · AG-GRID · ', reverse: true },
  { r: 717, size: 33, text: 'THE NUMBERS COME FROM HABITS · NOT FROM HEROICS · ' },
  { r: 646, size: 30, text: 'TWO HEADS ARE BETTER THAN NONE · MEET JOEJIM · ', reverse: true },
  { r: 580, size: 28, text: 'THE DASHBOARD TOOK TWO SECONDS · NOW IT TAKES 32 MS · ' },
  { r: 520, size: 26, text: 'SENIOR FRONT-END ENGINEER · ENTERPRISE UIS THAT STAY FAST AND COHERENT · ', reverse: true },
]

const RINGS: Ring[] = [
  { r: 440, size: 24, text: 'KOSTIANTYN KEILIN · SENIOR FRONT-END ENGINEER · TORONTO, ONTARIO · ', dur: 140 },
  { r: 388, size: 21, text: 'REACT · TYPESCRIPT · REDUX · MUI · AG-GRID · MODULE FEDERATION · ', dur: 110, reverse: true },
  { r: 340, size: 18, text: 'MICRO-FRONTENDS · CONFIG-DRIVEN ARCHITECTURE · FEATURE-SLICED DESIGN · ', dur: 90 },
  { r: 296, size: 16, text: 'RBC CAPITAL MARKETS · CI FINANCIAL · DELOITTE · SOPHIA GENETICS · EPAM · ', dur: 75, reverse: true },
  { r: 254, size: 16, text: '~2 S → 32 MS · ', dur: 60, accent: true },
]

const circlePath = (r: number) => `M ${C},${C - r} a ${r},${r} 0 1,1 0,${2 * r} a ${r},${r} 0 1,1 0,${-2 * r}`

function ringText({ r, size, text }: FieldRing) {
  const circumference = 2 * Math.PI * r
  const reps = Math.max(1, Math.floor(circumference / (text.length * size * 0.62)))
  return { line: text.repeat(reps), length: circumference }
}

const fieldRings = (reverse: boolean) =>
  FIELD.filter(ring => !ring.reverse === !reverse).map(ring => ({ r: ring.r, size: ring.size, line: ringText(ring).line }))

const TICKS = Array.from({ length: 120 }, (_, i) => {
  const major = i % 10 === 0
  const a = (i / 120) * 2 * Math.PI
  const r1 = major ? 462 : 474
  const r2 = 488
  return {
    major,
    x1: C + r1 * Math.sin(a), y1: C - r1 * Math.cos(a),
    x2: C + r2 * Math.sin(a), y2: C - r2 * Math.cos(a),
  }
})

export default function Dial() {
  return (
    <div className="dial">
      <svg className="dial-layer" viewBox="0 0 1000 1000">
        {TICKS.map(({ major, ...coords }, i) => (
          <line key={i} {...coords} className={major ? 'dial-tick is-major' : 'dial-tick'} />
        ))}
        {RINGS.map(ring => (
          <circle key={ring.r} cx={C} cy={C} r={ring.r - ring.size * 0.55} className="dial-hairline" />
        ))}
        <circle cx={C} cy={C} r={26} className="dial-dot" />
      </svg>

      {RINGS.map((ring, i) => {
        const { line, length } = ringText(ring)
        // Box around the ring and its glyphs, in % of the dial
        const R = ring.r + ring.size
        const box = { left: `${(C - R) / 10}%`, top: `${(C - R) / 10}%`, width: `${R / 5}%`, height: `${R / 5}%` }
        return (
          <svg
            key={ring.r}
            className={`dial-layer dial-spin${ring.reverse ? ' is-reverse' : ''}`}
            style={{ ...box, '--dur': `${ring.dur}s` } as React.CSSProperties}
            viewBox={`${C - R} ${C - R} ${2 * R} ${2 * R}`}
          >
            <path id={`dial-ring-${i}`} d={circlePath(ring.r)} fill="none" />
            <text className={ring.accent ? 'dial-text is-accent' : 'dial-text'} fontSize={ring.size}>
              <textPath href={`#dial-ring-${i}`} textLength={length} lengthAdjust="spacing">
                {line}
              </textPath>
            </text>
          </svg>
        )
      })}

      <svg className="dial-layer dial-spin dial-hand" style={{ '--dur': '8s' } as React.CSSProperties} viewBox="0 0 1000 1000">
        <line x1={C} y1={C + 40} x2={C} y2={C - 430} />
        <circle cx={C} cy={C - 430} r={5} />
      </svg>
    </div>
  )
}

export function DialOrbit({ lazy }: { lazy?: boolean }) {
  return (
    <div className="dial">
      <DialField rings={fieldRings(false)} dur={260} lazy={lazy} />
      <DialField rings={fieldRings(true)} dur={300} reverse lazy={lazy} />
    </div>
  )
}
