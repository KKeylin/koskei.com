import Image from 'next/image'
import FadeIn from '@/components/FadeIn'
import Testimonials from '@/components/Testimonials'

function yearsLabel(startYear: number, startMonth: number, startDay: number): string {
  const now = new Date()
  let years = now.getFullYear() - startYear
  const anniversary = new Date(now.getFullYear(), startMonth - 1, startDay)
  if (now < anniversary) years--
  const isExact = now.getMonth() === startMonth - 1 && now.getDate() === startDay
  return isExact ? `${years}` : `${years}+`
}

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

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
)

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
)

export default function Home() {
  return (
    <>
      <nav>
        <a href="#hero" className="nav-logo">koskei.com</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-eyebrow">Senior Front-End Engineer</div>
        <h1><strong>Kostiantyn</strong><br />Keilin</h1>
        <p className="hero-sub">
          15+ years building enterprise-grade interfaces. Specialising in <span>React</span>, <span>TypeScript</span>, micro-frontends, and config-driven architecture.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary">Get in touch</a>
          <a href="https://github.com/KKeylin" target="_blank" rel="noopener noreferrer" className="btn btn-outline">GitHub ↗</a>
        </div>
        <div className="hero-stats">
          <div>
            <div className="stat-num">{yearsLabel(2011, 4, 15)}</div>
            <div className="stat-label">Years of experience</div>
          </div>
          <div>
            <div className="stat-num">{yearsLabel(2017, 1, 22)}</div>
            <div className="stat-label">Years in React/TS</div>
          </div>
          <div>
            <div className="stat-num">32ms</div>
            <div className="stat-label">Dashboard load (from ~2s)</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-label">01 — About</div>
        <h2>Who <strong>I am</strong></h2>
        <FadeIn className="about-grid">
          <div className="about-text">
            <p>I&apos;m a Senior Front-End Engineer with over 15 years of experience, based in <strong>Toronto, Ontario, Canada</strong>. My focus is on building scalable, maintainable enterprise UIs — the kind that stay coherent as codebases grow.</p>
            <p>I gravitate toward <strong>config-driven architecture</strong>, <strong>Feature-Sliced Design</strong>, and micro-frontend patterns. Most recently I worked on a fintech platform at <strong>RBC Capital Markets</strong> via EPAM, where I brought a critical dashboard from ~2 seconds load time down to 32ms through prioritised data fetching.</p>
            <p>I write about engineering trade-offs on <strong>Medium</strong> and <strong>LinkedIn</strong> — mostly about the stuff that doesn&apos;t fit in tutorials.</p>
            <div className="avail-badge">Open to new opportunities</div>
          </div>
          <div className="about-meta">
            <Image src="/photo.jpg" alt="Kostiantyn Keilin" width={400} height={400} className="avatar" priority />
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
              <span className="meta-val">React · TypeScript · Next.js · Redux</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Email</span>
              <span className="meta-val"><a href="mailto:keilinkostiantyn@gmail.com">keilinkostiantyn@gmail.com</a></span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Phone</span>
              <span className="meta-val">+1 905 962 1211</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-label">02 — Projects</div>
        <h2>What I&apos;ve <strong>built</strong></h2>
        <div className="projects-grid">

          <FadeIn className="project-card">
            <div>
              <div className="proj-name"><span>//</span> config-driven-testimonials</div>
              <div className="proj-desc">A React component library for rendering testimonial blocks from a config. Published on NPM. Fully typed Zod schema for runtime validation — the config drives everything, components know nothing about the source. Built in a Turborepo monorepo with a live Next.js demo and settings generator.</div>
              <div className="proj-tags">
                <span className="tag">React</span><span className="tag">TypeScript</span><span className="tag">Zod</span><span className="tag">Turborepo</span><span className="tag">Next.js</span><span className="tag">NPM</span>
              </div>
            </div>
            <div className="proj-links">
              <a href="https://config-driven-testimonials-demo.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Demo</a>
              <a href="https://github.com/KKeylin/config-driven-testimonials" target="_blank" rel="noopener noreferrer" className="proj-link"><IconGitHub />GitHub</a>
              <a href="https://www.npmjs.com/package/config-driven-testimonials" target="_blank" rel="noopener noreferrer" className="proj-link"><IconNpm />NPM</a>
              <a href="#cdt-note" className="proj-link proj-link-internal">↓ Live on this page</a>
            </div>
          </FadeIn>

          <FadeIn className="project-card">
            <div>
              <div className="proj-name"><span>//</span> slotpaste</div>
              <div className="proj-desc">A personal clipboard for form-filling. Store reusable snippets — names, addresses, boilerplate — and paste them into forms without dragging styles along. The canvas view lets you group snippets spatially, which turned out more useful than a flat list. Started as an Electron app, moved to PWA after hitting performance issues. Includes a private mode with encryption.</div>
              <div className="proj-tags">
                <span className="tag">React</span><span className="tag">TypeScript</span><span className="tag">Tailwind</span><span className="tag">PWA</span>
              </div>
            </div>
            <div className="proj-links">
              <a href="https://slotpaste.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Demo</a>
              <a href="https://github.com/KKeylin/slotpaste" target="_blank" rel="noopener noreferrer" className="proj-link"><IconGitHub />GitHub</a>
            </div>
          </FadeIn>

          <FadeIn className="project-card">
            <div>
              <div className="proj-name"><span>//</span> playshelf</div>
              <div className="proj-desc">A test-task project that became an interesting architecture experiment. Real-time sync across browser tabs, no backend — everything runs in localStorage with 300ms simulated latency. Built with Next.js and Radix UI as required by spec.</div>
              <div className="proj-tags">
                <span className="tag">Next.js</span><span className="tag">TypeScript</span><span className="tag">Radix UI</span><span className="tag">localStorage</span>
              </div>
            </div>
            <div className="proj-links">
              <a href="https://playshelf-eight.vercel.app/" target="_blank" rel="noopener noreferrer" className="proj-link"><IconExternalLink />Demo</a>
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
            <span className="company-period">2022 – 2026</span>
            <div className="company-name">EPAM Systems<small>via First Derivatives · Client: RBC Capital Markets</small></div>
            <span className="company-role">Senior FE Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">2020 – 2022</span>
            <div className="company-name">Varteq<small>Enterprise product development</small></div>
            <span className="company-role">Senior FE Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">Mar–Sep 2020</span>
            <div className="company-name">Trinetix<small>Client: Deloitte</small></div>
            <span className="company-role">FE Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">2018 – 2020</span>
            <div className="company-name">Litslink<small>Software development studio</small></div>
            <span className="company-role">FE Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">2017 – 2018</span>
            <div className="company-name">Arnit</div>
            <span className="company-role">FE Engineer</span>
          </div>
          <div className="company-row">
            <span className="company-period">2011 – 2017</span>
            <div className="company-name">Earlier experience<small>Various agencies and freelance</small></div>
            <span className="company-role">Web Developer</span>
          </div>
        </FadeIn>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="section-label">04 — Skills</div>
        <h2>What I <strong>work with</strong></h2>
        <FadeIn className="skills-grid">
          <div className="skill-group">
            <div className="skill-group-title">Core</div>
            <div className="skill-items">
              <span className="skill-item">React</span><span className="skill-item">TypeScript</span><span className="skill-item">Next.js</span><span className="skill-item">Redux</span><span className="skill-item">JavaScript</span>
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-title">UI &amp; styling</div>
            <div className="skill-items">
              <span className="skill-item">MUI</span><span className="skill-item">Tailwind</span><span className="skill-item">Radix UI</span><span className="skill-item">AG-Grid</span><span className="skill-item">Styled Components</span><span className="skill-item">CSS Modules</span>
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-title">Architecture</div>
            <div className="skill-items">
              <span className="skill-item">Micro-frontends</span><span className="skill-item">Module Federation</span><span className="skill-item">FSD</span><span className="skill-item">Config-driven</span><span className="skill-item">Turborepo</span>
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-title">Testing &amp; quality</div>
            <div className="skill-items">
              <span className="skill-item">Jest</span><span className="skill-item">React Testing Library</span><span className="skill-item">Playwright</span><span className="skill-item">axe-core</span><span className="skill-item">WCAG 2.1 / AODA</span>
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-title">Tooling &amp; infra</div>
            <div className="skill-items">
              <span className="skill-item">Vite</span><span className="skill-item">Webpack</span><span className="skill-item">Babel</span><span className="skill-item">GitHub Actions</span><span className="skill-item">Vercel</span><span className="skill-item">AWS (S3, Lambda)</span><span className="skill-item">Supabase</span><span className="skill-item">Zod</span>
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-title">Other</div>
            <div className="skill-items">
              <span className="skill-item">Angular</span><span className="skill-item">Node.js</span><span className="skill-item">Git</span><span className="skill-item">REST</span><span className="skill-item">GraphQL</span>
            </div>
          </div>
          <div className="skill-group">
            <div className="skill-group-title">Soft</div>
            <div className="skill-items">
              <span className="skill-item">Technical writing</span><span className="skill-item">Code review</span><span className="skill-item">Mentoring</span><span className="skill-item">English (C1)</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <span id="cdt-note" className="cdt-anchor" aria-hidden="true" />
        <div className="section-label">05 — Testimonials</div>
        <h2>What people <strong>say</strong></h2>
        <FadeIn>
          <Testimonials />
        </FadeIn>
        <div className="cdt-note-panel">
          <div className="cdt-note-inner">
            <div className="cdt-note-label">// config-driven-testimonials — live integration</div>
            <p>The testimonials above are rendered directly from my open-source npm package. A single JSON config drives everything — layout, content, avatars. No backend, no CMS. Drop it into any React app and it just works.</p>
            <code>npm install config-driven-testimonials</code>
          </div>
        </div>
      </section>

      {/* LINKS */}
      <section id="links">
        <div className="section-label">06 — Links</div>
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

      {/* CONTACT */}
      <section id="contact">
        <div className="section-label">07 — Contact</div>
        <h2>Let&apos;s <strong>talk</strong></h2>
        <FadeIn className="contact-inner">
          <div className="contact-text">
            <p>I&apos;m actively looking for my next role in fintech or enterprise front-end. If you&apos;re building something interesting and need someone who thinks about architecture as hard as they think about code — reach out.</p>
            <a href="mailto:keilinkostiantyn@gmail.com" className="contact-email">keilinkostiantyn@gmail.com</a>
          </div>
          <div className="contact-info">
            <div className="contact-row"><IconLocation />Toronto, Ontario · Canada</div>
            <div className="contact-row"><IconPhone />+1 905 962 1211</div>
            <div className="contact-row"><IconGlobe />koskei.com</div>
          </div>
        </FadeIn>
      </section>

      <footer>
        <span className="footer-copy">© 2026 Kostiantyn Keilin</span>
        <span className="footer-built">koskei.com</span>
      </footer>
    </>
  )
}
