// Stopwatch-style dial for the hero: rings of text set on circles, a bezel of
// ticks and a sweeping hand. Each ring is its own layer so it can rotate on the
// compositor. Purely decorative: the parent hides it from assistive tech.

const C = 500

type Ring = { r: number; size: number; text: string; dur: number; reverse?: boolean; accent?: boolean }

const RINGS: Ring[] = [
  { r: 440, size: 24, text: 'KOSTIANTYN KEILIN · SENIOR FRONT-END ENGINEER · TORONTO, ONTARIO · ', dur: 140 },
  { r: 388, size: 21, text: 'REACT · TYPESCRIPT · REDUX · MUI · AG-GRID · MODULE FEDERATION · ', dur: 110, reverse: true },
  { r: 340, size: 18, text: 'MICRO-FRONTENDS · CONFIG-DRIVEN ARCHITECTURE · FEATURE-SLICED DESIGN · ', dur: 90 },
  { r: 296, size: 16, text: 'RBC CAPITAL MARKETS · CI FINANCIAL · DELOITTE · SOPHIA GENETICS · EPAM · ', dur: 75, reverse: true },
  { r: 254, size: 16, text: '~2 S → 32 MS · ', dur: 60, accent: true },
]

const circlePath = (r: number) => `M ${C},${C - r} a ${r},${r} 0 1,1 0,${2 * r} a ${r},${r} 0 1,1 0,${-2 * r}`

function ringText({ r, size, text }: Ring) {
  const circumference = 2 * Math.PI * r
  const reps = Math.max(1, Math.floor(circumference / (text.length * size * 0.62)))
  return { line: text.repeat(reps), length: circumference }
}

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
        return (
          <svg
            key={ring.r}
            className={`dial-layer dial-spin${ring.reverse ? ' is-reverse' : ''}`}
            style={{ '--dur': `${ring.dur}s` } as React.CSSProperties}
            viewBox="0 0 1000 1000"
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
