import Image from 'next/image'
import Dial, { DialOrbit } from '@/components/Dial'
import Dissolve from '@/components/Dissolve'
import FadeIn from '@/components/FadeIn'
import Finale from '@/components/Finale'
import GlyphField from '@/components/GlyphField'
import IntroScene from '@/components/IntroScene'
import LetterTorus from '@/components/LetterTorus'
import ScrollScene from '@/components/ScrollScene'
import Testimonials from '@/components/Testimonials'
import { TECH_ICONS } from '@/components/tech-icons'

function yearsLabel(startYear: number, startMonth: number, startDay: number): string {
  const now = new Date()
  let years = now.getFullYear() - startYear
  const anniversary = new Date(now.getFullYear(), startMonth - 1, startDay)
  if (now < anniversary) years--
  const isExact = now.getMonth() === startMonth - 1 && now.getDate() === startDay
  return isExact ? `${years}` : `${years}+`
}

// Scroll progress at which each of the 8 review rounds is crossed out, matching
// the moments the 08 → 02 counter (ease-out over 0.1–0.7) passes 7, 6 … 3.
// Rounds 1–2 survive and light up at the end.
const ROUND_MARKS = [0.7, 0.7, 0.44, 0.32, 0.25, 0.2, 0.16, 0.12]

// Skills by depth, shown as badges (with a logo where TECH_ICONS has one).
// The same names fill the faint text behind the section.
type Skill = { name: string; note?: string }
const SKILLS: { group: string; items: Skill[] }[] = [
  {
    group: 'Strong',
    items: [
      { name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'React' }, { name: 'HTML' }, { name: 'CSS' }, { name: 'SCSS' },
      { name: 'Redux', note: 'Thunk / Saga' }, { name: 'MUI' }, { name: 'AG-Grid' }, { name: 'Module Federation' },
      { name: 'Feature-Sliced Design' }, { name: 'Config-driven architecture' }, { name: 'Jest' }, { name: 'React Testing Library' },
      { name: 'Accessibility', note: 'WCAG 2.1' },
    ],
  },
  {
    group: 'Working',
    items: [
      { name: 'Next.js' }, { name: 'Tailwind' }, { name: 'Storybook' }, { name: 'GraphQL' }, { name: 'Radix UI' },
      { name: 'Playwright' }, { name: 'Zod' }, { name: 'Turborepo' }, { name: 'Webpack' }, { name: 'GitHub Actions' },
    ],
  },
  {
    group: 'Familiar',
    items: [{ name: 'Node.js', note: 'tooling, npm authoring' }, { name: 'Angular', note: 'earlier, not current' }, { name: 'SwiftUI' }],
  },
  {
    group: 'Soft',
    items: [{ name: 'Technical writing' }, { name: 'Code review' }, { name: 'Mentoring' }, { name: 'English', note: 'C1' }],
  },
]
const SKILL_TEXT = `${SKILLS.flatMap(({ items }) => items.map(({ name }) => name)).join(' · ').toUpperCase()} · `

const IconExternalLink = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M9 1h6m0 0v6m0-6L7 9" />
  </svg>
)

const IconGitHub = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

const IconNpm = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 0h16v16H0V0zm1 1v14h7V8h3v7h4V1H1z" />
  </svg>
)

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const IconMedium = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
)

const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

export default function Home() {
  return (
    <>
      <header className="site-header">
        <nav aria-label="Primary">
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
          </ul>
        </nav>
        <a href="#hero" className="nav-logo">koskei.com</a>
        <a href="#contact" className="nav-cta"><span>Get in touch</span><i aria-hidden="true">→</i></a>
      </header>

      <main>
      {/* HERO — the dial opens up and its centre becomes the next section */}
      <IntroScene
        dial={<Dial />}
        orbit={<DialOrbit />}
        copy={
          <>
            <div className="avail-badge">Open to the right opportunity</div>
            <h1>
              Senior front-end engineer.
              <span className="h1-dim">Enterprise UIs that stay fast and coherent.</span>
            </h1>
            <p className="hero-sub">
              Kostiantyn Keilin. {yearsLabel(2011, 4, 15)} years in front-end, {yearsLabel(2017, 1, 22)} in React and TypeScript. Micro-frontends and config-driven architecture, based in Toronto.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">Get in touch</a>
              <a href="#projects" className="btn btn-outline">See projects</a>
            </div>
            <div className="proof-bar">
              <span className="proof-label">Worked with</span>
              <ul>
                <li>RBC Capital Markets</li>
                <li>CI Financial</li>
                <li>Deloitte</li>
                <li>Sophia Genetics</li>
                <li>EPAM</li>
              </ul>
            </div>
          </>
        }
      />

      {/* CASE — RBC dashboard load */}
      <ScrollScene id="case-rbc" className="scene scene-rbc">
        <div className="scene-stage">
          <div className="scene-grid">
            <div className="scene-copy">
              <div className="section-label">Case · RBC Capital Markets</div>
              <h2>The dashboard took two seconds. <strong>Now it takes 32&nbsp;ms.</strong></h2>
              <p className="scene-text">The primary dashboard of a fintech platform at RBC Capital Markets. I redesigned the data fetching into two steps: the first 200 rows land in 20 ms, and the rest streams in the background without blocking the user.</p>
              <div className="scene-counter" aria-hidden="true">
                <span className="scene-num">
                  <span data-count-from="2000" data-count-to="32" data-count-range="0.05,0.72">2000</span>
                  <small>ms</small>
                </span>
                <span className="scene-num-label">Primary dashboard load <em>~2 s → 32 ms</em></span>
              </div>
              <p className="sr-only">Load time went from about 2 seconds to 32 milliseconds.</p>
            </div>

            <div className="receipt">
              <div className="receipt-head"><span>Load budget</span><span>Primary dashboard</span></div>
              <div className="receipt-group">Before</div>
              <div className="receipt-line" data-step="0.04"><span>Dashboard load</span><i /><b>~2 s</b></div>
              <div className="receipt-group">After · two-step prioritised fetch</div>
              <div className="receipt-line" data-step="0.2"><span>Step 1 · first 200 rows</span><i /><b>20 ms</b></div>
              <div className="receipt-note" data-step="0.32">The second frame at 60 Hz</div>
              <div className="receipt-line" data-step="0.44"><span>Step 2 · remaining rows</span><i /><b>Background</b></div>
              <div className="receipt-line" data-step="0.56"><span>User interaction</span><i /><b>Never blocked</b></div>
              <div className="receipt-total" data-step="0.72"><span>Dashboard load</span><b>~2 s → 32 ms</b></div>
            </div>
          </div>
        </div>
      </ScrollScene>

      {/* CASE — JoeJim, the review assistant at CI Financial */}
      <ScrollScene id="case-joejim" className="scene scene-jj">
        <div className="scene-stage">
          <div className="scene-grid">
            <div className="scene-copy">
              <div className="section-label">Tooling · CI Financial</div>
              <h2>Two heads are better than&nbsp;none. <strong>Meet JoeJim.</strong></h2>
              <p className="scene-text">A local AI pre-merge review assistant I built at CI Financial. The first version took one evening; now about 20 engineers, front end and back end, run their changes past it before merge. One head finds the problems, the other fact-checks them, and a multi-run mode measures how much the verdicts vary.</p>
              <div className="scene-counter" aria-hidden="true">
                <span className="scene-num">
                  <span data-count-from="8" data-count-to="2" data-count-pad="2" data-count-range="0.1,0.7">08</span>
                  <small>rounds</small>
                </span>
                <span className="scene-num-label">Review rounds per PR <em>typically 6–8 → 1–2</em></span>
              </div>
              <p className="sr-only">Review cycles typically dropped from 6–8 rounds to 1–2.</p>
            </div>

            <div className="receipt">
              <div className="receipt-head"><span>Pre-merge review</span><span>JoeJim™</span></div>
              <div className="receipt-line" data-step="0.04"><span>Runs</span><i /><b>Locally, before merge</b></div>
              <div className="receipt-line" data-step="0.16"><span>Head 1 · review</span><i /><b>Findings</b></div>
              <div className="receipt-line" data-step="0.28"><span>Head 2 · fact-check</span><i /><b>Its own findings</b></div>
              <div className="receipt-line" data-step="0.4"><span>Multi-run mode</span><i /><b>Verdict variance</b></div>
              <div className="receipt-line" data-step="0.52"><span>Used by</span><i /><b>~20 engineers · FE + BE</b></div>
              <div className="receipt-line" data-step="0.6"><span>First version</span><i /><b>One evening</b></div>
              <div className="receipt-total" data-step="0.7"><span>Review rounds</span><b>6–8 → 1–2*</b></div>
              <div className="receipt-fine">* Typically. Not responsible for radiation-induced code mutations. Review responsibly.</div>
            </div>

            <div className="rounds" aria-hidden="true">
              <span className="rounds-label">Rounds per PR</span>
              <div className="rounds-pills">
                {ROUND_MARKS.map((at, i) => (
                  <span key={i} className={at < 0.7 ? 'round is-cut' : 'round is-kept'} data-at={at}>Round {i + 1}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollScene>

      {/* CURTAIN — the seam into the dark section opens on a JoeJim advert, then closes */}
      <div className="curtain" aria-hidden="true">
        <div className="curtain-stage">
          <div className="curtain-show">
            <div className="curtain-poster">
              <Image
                src="/projects/joejim-poster.jpg"
                alt=""
                width={1376}
                height={768}
                sizes="(max-width: 640px) 90vw, 940px"
                className="curtain-img"
              />
            </div>
          </div>
          <div className="curtain-top">
            <div className="curtain-fill" />
            <Dissolve to="dark" part="light" />
          </div>
          <div className="curtain-bottom">
            <Dissolve to="dark" part="dark" />
            <div className="curtain-fill" />
          </div>
        </div>
      </div>

      {/* HOW I WORK — dark */}
      <section id="how" className="dark">
        <div className="dark-inner">
          <div className="how-copy">
            <div className="section-label">How I work</div>
            <h2>The numbers come from habits. <strong>Not from heroics.</strong></h2>
            <ol className="how-list">
              <li>
                <h3><span>001 /</span> Performance is a feature</h3>
                <p>~2 s to 32 ms on a fintech dashboard: the first 200 rows in 20 ms, the rest streamed in behind them.</p>
              </li>
              <li>
                <h3><span>002 /</span> Config over conditionals</h3>
                <p>A config-driven form system at RBC. An npm package where one JSON config drives everything — it renders the testimonials on this page.</p>
              </li>
              <li>
                <h3><span>003 /</span> Spec before code</h3>
                <p>jpaste started with 6,188 lines of specification and not one line of code.</p>
              </li>
              <li>
                <h3><span>004 /</span> Build it once</h3>
                <p>At Varteq a shared table component cut a new table-based page from about a week of work to about a day.</p>
              </li>
              <li>
                <h3><span>005 /</span> Leave a system behind</h3>
                <p>A UI audit at CI became the framework for unifying the interface, and the team carried it out in peak season. Storybook came back with it.</p>
              </li>
            </ol>
          </div>
          <div className="how-art" aria-hidden="true">
            <LetterTorus />
          </div>
        </div>
      </section>

      <Dissolve to="light" />

      {/* ABOUT */}
      <section id="about">
        <div className="section-label">01 — About</div>
        <h2>Who <strong>I am</strong></h2>
        <FadeIn className="about-grid">
          <div className="about-text">
            <p>I&apos;m a Senior Front-End Engineer at <strong>CI Financial</strong>, working on an internal asset-management platform for investment-fund staff. Over 15 years in front-end and over 9 in React and TypeScript, mostly on the heavier end of enterprise: fintech dashboards, real-time data grids, systems where performance isn&apos;t optional.</p>
            <p>Before that I spent nearly four years on a fintech platform at <strong>RBC Capital Markets</strong> via EPAM. The primary dashboard took about 2 seconds to load. I redesigned the data fetching so the first 200 rows arrive in 20 ms and the rest stream in the background. Load time went from ~2 s to <strong>32 ms</strong>.</p>
            <p>I gravitate toward architecture problems: micro-frontends, config-driven interfaces, Feature-Sliced Design, component libraries meant to outlast the team that built them. At CI that now includes tooling for the team itself, like <strong>JoeJim</strong>, an AI pre-merge review assistant used by about 20 engineers.</p>
            <p>I write about engineering trade-offs on <strong>Medium</strong> and <strong>LinkedIn</strong> — mostly about the stuff that doesn&apos;t fit in tutorials.</p>
          </div>
          <div className="about-meta">
            <Image src="/photo.jpg" alt="Kostiantyn Keilin" width={400} height={400} className="avatar" priority />
            <div className="meta-row">
              <span className="meta-key">Currently</span>
              <span className="meta-val">Senior Front-End Engineer · CI Financial</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Location</span>
              <span className="meta-val">Toronto, Ontario · Canada</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Focus</span>
              <span className="meta-val">Senior FE / Senior Software Engineer</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Core stack</span>
              <span className="meta-val">React · TypeScript · Redux · Module Federation</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Email</span>
              <span className="meta-val"><a href="mailto:keilinkostiantyn@gmail.com">keilinkostiantyn@gmail.com</a></span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-label">02 — Projects</div>
        <h2>What I&apos;ve <strong>built</strong></h2>
        <div className="projects-grid">

          <FadeIn className="project-card project-feature">
            <div className="feature-text">
              <div className="proj-label">Product</div>
              <div className="proj-name"><span aria-hidden="true">{'//'}</span> jpaste<small className="proj-status">In App Store review</small></div>
              <p className="feature-lead">Just click. Just paste. Save any text once, arrange it on a canvas, paste it anywhere as plain text. One universal app for Mac, iPad and iPhone.</p>
              <div className="proj-desc">It started as slotpaste, my front-end prototype: an Electron app first, then a PWA I used personally for months. jpaste is its native rebuild. I wrote 6,188 lines of specification before the first line of code, built it with AI models, put it through audits, and wrote up every working day in a public developer diary.</div>
              <ul className="feature-facts">
                <li>13 languages, one purchase for all three devices, no subscription</li>
                <li>Three privacy levels per board, up to a passphrase vault on AES-256-GCM</li>
                <li>No account, no server, no analytics: sync runs through the user&apos;s own iCloud</li>
              </ul>
              <div className="feature-stack">
                <span className="feature-stack-key">App</span>
                <span className="tag">SwiftUI</span><span className="tag">SwiftData</span><span className="tag">CloudKit</span><span className="tag">StoreKit 2</span>
              </div>
              <div className="feature-stack">
                <span className="feature-stack-key">Prototype</span>
                <span className="tag">React</span><span className="tag">TypeScript</span><span className="tag">Tailwind</span><span className="tag">PWA</span>
              </div>
            </div>
            <div className="feature-media">
              <Image
                src="/projects/jpaste-mac.jpg"
                alt="jpaste on a Mac: a light canvas board with name, address, bank and reply snippets arranged in colour groups"
                width={1600}
                height={1000}
                sizes="(max-width: 900px) 100vw, 640px"
                className="feature-shot"
              />
            </div>
            <div className="proj-links feature-links">
              <a href="https://www.jpaste.com/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />jpaste.com</a>
              <span className="proj-link is-pending" aria-disabled="true">App Store · in review</span>
              <a href="https://www.jpaste.com/diary" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Developer diary</a>
              <a href="https://medium.com/@konstantinkeylin/just-paste-it-part-0-3d68f715b38d" target="_blank" rel="noopener noreferrer" className="proj-link"><IconMedium />Diary on Medium</a>
              <a href="https://slotpaste.koskei.com/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Prototype demo</a>
              <a href="https://github.com/KKeylin/slotpaste" target="_blank" rel="noopener noreferrer" className="proj-link"><IconGitHub />Prototype on GitHub</a>
            </div>
          </FadeIn>

          <FadeIn className="project-card">
            <div>
              <div className="proj-label">Open source · npm</div>
              <div className="proj-name"><span aria-hidden="true">{'//'}</span> config-driven-testimonials</div>
              <div className="proj-desc">A React component library for rendering testimonial blocks from a config. Published on NPM. Fully typed Zod schema for runtime validation — the config drives everything, components know nothing about the source. Built in a Turborepo monorepo with a live Next.js demo and settings generator. Built to WCAG 2.1 AA, with a 100/100 Lighthouse accessibility score.</div>
              <div className="proj-tags">
                <span className="tag">React</span><span className="tag">TypeScript</span><span className="tag">Zod</span><span className="tag">Turborepo</span><span className="tag">Next.js</span><span className="tag">NPM</span>
              </div>
            </div>
            <div className="proj-links">
              <a href="https://cdt.koskei.com/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Demo</a>
              <a href="https://github.com/KKeylin/config-driven-recommendations" target="_blank" rel="noopener noreferrer" className="proj-link"><IconGitHub />GitHub</a>
              <a href="https://www.npmjs.com/package/config-driven-testimonials" target="_blank" rel="noopener noreferrer" className="proj-link"><IconNpm />NPM</a>
              <a href="#cdt-note" className="proj-link proj-link-internal">↓ Live on this page</a>
            </div>
          </FadeIn>

          <FadeIn className="project-card">
            <div>
              <div className="proj-label">Architecture experiment</div>
              <div className="proj-name"><span aria-hidden="true">{'//'}</span> playshelf</div>
              <div className="proj-desc">A take-home task that turned into an architecture experiment. Four layers — UI, hooks, store, repository. Components read the store through useSyncExternalStore, and the native storage event keeps every open tab in sync with no backend. Data lives in localStorage behind a repository with 300 ms simulated latency. Components are documented in Storybook.</div>
              <div className="proj-tags">
                <span className="tag">Next.js</span><span className="tag">TypeScript</span><span className="tag">Radix UI</span><span className="tag">Storybook</span><span className="tag">localStorage</span>
              </div>
            </div>
            <div className="proj-links">
              <a href="https://playshelf-eight.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Demo</a>
              <a href="https://github.com/KKeylin/playshelf" target="_blank" rel="noopener noreferrer" className="proj-link"><IconGitHub />GitHub</a>
              <a href="https://playshelf-storybook.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Storybook</a>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section-label">03 — Experience</div>
        <h2>Companies I&apos;ve <strong>worked with</strong></h2>
        <FadeIn className="companies-list">
          <div className="company-row">
            <span className="company-period">Jun 2026 – now</span>
            <div className="company-body">
              <div className="company-name">CI Financial<small>Internal asset-management platform for investment-fund staff</small></div>
              <ul className="company-points">
                <li><strong>JoeJim</strong>: a local AI pre-merge review assistant. First version built in one evening, now used across the engineering team (about 20 developers, front end and back end). It fact-checks its own findings and has a multi-run mode that measures verdict variance. Review cycles typically dropped from 6–8 rounds to 1–2.</li>
                <li><strong>Yoda</strong>: a tool for deep audits of complex tasks.</li>
                <li>Audited the UI against the project&apos;s component set and revived Storybook. The audit became the framework for UI unification, with execution delegated across the team in peak season.</li>
                <li>Delivered a core internal workflow in six weeks against a 6–9 month estimate.</li>
              </ul>
            </div>
            <span className="company-role">Senior Front-End Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">Jul 2022 – Mar 2026</span>
            <div className="company-body">
              <div className="company-name">EPAM Systems<small>via First Derivative · Client: RBC Capital Markets</small></div>
              <ul className="company-points">
                <li>Cut the primary dashboard load from ~2 s to 32 ms: first 200 rows in 20 ms, the rest streamed in the background.</li>
                <li>Micro-frontends on Module Federation (PSA pattern); migrated my own module from React 16.8 to 18.</li>
                <li>Built a config-driven form system and AG-Grid / MUI interfaces for real-time financial data.</li>
              </ul>
            </div>
            <span className="company-role">Senior Front-End Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">Oct 2020 – Jan 2022</span>
            <div className="company-body">
              <div className="company-name">Varteq<small>Enterprise product development</small></div>
              <ul className="company-points">
                <li>Next.js with SSR for a medical data UI.</li>
                <li>A shared table component cut building a new table-based page from about a week to about a day.</li>
                <li>Front-end architecture planning for Sophia Genetics (Next.js SSR).</li>
              </ul>
            </div>
            <span className="company-role">Front-End Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">Mar – Sep 2020</span>
            <div className="company-body">
              <div className="company-name">Trinetix<small>Client: Deloitte</small></div>
              <ul className="company-points">
                <li>Rebuilt a Deloitte internal service for 40+ engineers.</li>
                <li>90%+ unit test coverage with Jest and React Testing Library.</li>
              </ul>
            </div>
            <span className="company-role">Front-End Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">Nov 2018 – Mar 2020</span>
            <div className="company-body">
              <div className="company-name">Litslink<small>Software development studio</small></div>
              <ul className="company-points">
                <li>Sole front-end developer on Fibonacci.Jobs, taking the MVP from 30% to 70%.</li>
                <li>Accessible registration flows to WCAG 2.1 and EN 301 549; forms adapted for GDPR.</li>
              </ul>
            </div>
            <span className="company-role">Front-End Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">Jul 2017 – Oct 2018</span>
            <div className="company-body">
              <div className="company-name">Arnit</div>
            </div>
            <span className="company-role">Front-End Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">2011 – 2017</span>
            <div className="company-body">
              <div className="company-name">Earlier experience<small>Various agencies and freelance</small></div>
            </div>
            <span className="company-role">Front-End Web Developer</span>
          </div>
        </FadeIn>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <span id="cdt-note" className="cdt-anchor" aria-hidden="true" />
        <div className="section-label">04 — Testimonials</div>
        <h2>What people <strong>say</strong></h2>
        <FadeIn>
          <Testimonials />
        </FadeIn>
        <div className="cdt-note-panel">
          <div className="cdt-note-inner">
            <div className="cdt-note-label">{'// config-driven-testimonials — live integration'}</div>
            <p>The testimonials above are rendered directly from my open-source npm package. A single JSON config drives everything — layout, content, avatars. No backend, no CMS. Drop it into any React app and it just works.</p>
            <code>npm install config-driven-testimonials</code>
          </div>
        </div>
      </section>

      <Dissolve to="dark" />

      {/* SKILLS — dark, rows of badges over a field of faint text that ripples on click */}
      <section id="skills" className="dark skills">
        <GlyphField text={SKILL_TEXT} />
        <div className="dark-inner">
          <div className="skills-head">
            <div className="section-label">05 — Skills</div>
            <h2>What I <strong>work with</strong></h2>
            <p className="skills-hint" aria-hidden="true"><span className="on-pointer">Click anywhere</span><span className="on-touch">Tap anywhere</span></p>
          </div>
          <div className="skill-rows">
            {SKILLS.map(({ group, items }, i) => (
              <div key={group} className="skill-row">
                <h3 className="skill-head">
                  <span className="skill-num" aria-hidden="true">{String(i + 1).padStart(3, '0')} /</span>
                  <span className="skill-name">{group}</span>
                  <span className="skill-count" aria-hidden="true">{items.length}</span>
                </h3>
                <ul className="skill-items">
                  {items.map(({ name, note }) => {
                    const icon = TECH_ICONS[name]
                    return (
                      <li key={name} className="skill-badge" style={icon?.tint ? { '--tint': icon.tint } as React.CSSProperties : undefined}>
                        {icon && <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>}
                        {name}
                        {note && <small>{note}</small>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT — the closing disc in a field of text rings */}
      <Finale orbit={<DialOrbit />}>
        <div className="section-label">06 — Contact</div>
        <h2>Let&apos;s <strong>talk</strong></h2>
        <p className="finale-text">
          I&apos;m open to the right opportunity in fintech or enterprise front-end.
          <span className="finale-more"> If you&apos;re building something interesting and need someone who thinks about architecture as hard as they think about code — reach out.</span>
        </p>
        <a href="mailto:keilinkostiantyn@gmail.com" className="contact-email">keilinkostiantyn@gmail.com</a>
        <div className="contact-row"><IconLocation />Toronto, Ontario · Canada</div>
      </Finale>

      <Dissolve to="light" />

      {/* LINKS */}
      <section id="links">
        <div className="section-label">07 — Links</div>
        <h2>Find me <strong>online</strong></h2>
        <FadeIn className="links-grid">
          <a href="https://github.com/KKeylin" target="_blank" rel="noopener noreferrer" className="link-card">
            <div className="link-icon"><IconGitHub /></div>
            <div><span className="link-name">GitHub</span><span className="link-handle">KKeylin</span></div>
          </a>
          <a href="https://www.linkedin.com/in/kostiantyn-keilin/" target="_blank" rel="noopener noreferrer" className="link-card">
            <div className="link-icon"><IconLinkedIn /></div>
            <div><span className="link-name">LinkedIn</span><span className="link-handle">kostiantyn-keilin</span></div>
          </a>
          <a href="https://medium.com/@kostiantyn.keilin" target="_blank" rel="noopener noreferrer" className="link-card">
            <div className="link-icon"><IconMedium /></div>
            <div><span className="link-name">Medium</span><span className="link-handle">Technical articles</span></div>
          </a>
          <a href="https://www.npmjs.com/~kkeylin" target="_blank" rel="noopener noreferrer" className="link-card">
            <div className="link-icon"><IconNpm /></div>
            <div><span className="link-name">NPM</span><span className="link-handle">Published packages</span></div>
          </a>
        </FadeIn>
      </section>
      </main>

      <footer>
        <span className="footer-copy">© 2026 Kostiantyn Keilin</span>
        <span className="footer-built">koskei.com</span>
      </footer>
    </>
  )
}
