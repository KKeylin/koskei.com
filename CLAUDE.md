# CLAUDE.md — koskei.com

@.claude/instructions.md

Personal landing page for Kostiantyn (Kostya) Keilin.
Deployed at: https://koskei.com

---

## Collaboration rules (summary from instructions.md)

- **Respond in Russian** in conversation; all documentation and code comments in **English**
- **One step at a time** — one instruction, wait for confirmation, then next
- **Git is manual** — never run git commands directly; always give the exact command for manual execution
- **No Co-Authored-By** — never add to commit messages
- **No unsolicited changes** — only what the current step requires; no refactoring "while we're here"
- **Update roadmap before each commit** — mark completed items in `.claude/roadmap.md`, sync with `README.md`
- **Settled decisions stay settled** — everything in "Architectural decisions" below is closed
- **Disagree → execute → flag** — execute the instruction first, then post a 🟣-marked disagreement note explaining what and why

---

## Who I am

Senior Front-End Engineer, 15+ years total, 9+ in React/TypeScript.
Based in Welland, Ontario, Canada. Actively job-searching — targeting Senior FE /
Senior Software Engineer roles in fintech and enterprise.

**Core stack:** React, TypeScript, Next.js, Redux, MUI, AG-Grid, Module Federation  
**Key expertise:** Micro-frontends, config-driven architecture, Feature-Sliced Design, performance optimisation  
**Most recent role:** Fintech platform at RBC Capital Markets via EPAM (private repos)  
**GitHub:** https://github.com/KKeylin

---

## Project overview

Next.js (App Router) + TypeScript + React 19. Single-page site — one route (`/`),
no dynamic data, no auth. Deployed on Vercel with automatic builds from `main`.

**Purpose:** Public-facing personal site. Primary audiences:
1. Hiring managers / recruiters in fintech and enterprise
2. Technical contacts from LinkedIn / Medium
3. Anyone following up after seeing a CV or referral

---

## Repository structure

```
koskei.com/
├── app/
│   ├── globals.css      ← all styles (design tokens, layout, sections)
│   ├── icon.svg         ← favicon (Next.js auto-links via app/ convention)
│   ├── layout.tsx       ← root layout: fonts, metadata, JSON-LD
│   └── page.tsx         ← entire page content (all sections)
├── components/
│   ├── FadeIn.tsx       ← IntersectionObserver scroll-reveal wrapper
│   └── Testimonials.tsx ← config-driven-testimonials integration
├── public/
│   └── photo.jpg        ← author photo (used in About and OG tags)
├── testimonials.config.json  ← testimonials data for the widget
├── next.config.ts
├── tsconfig.json
├── CLAUDE.md        ← you are here
└── README.md
```

---

## Design system

- **Aesthetic:** Dark tech-style. Deep dark backgrounds, blue accent (`#63b3ed`), monospace labels.
- **Fonts:** Space Mono (headings, labels, mono UI) + Inter (body, descriptions). Loaded from Google Fonts.
- **Color tokens (CSS vars in `:root`):**
    - `--bg` `#0a0a0f` — page background
    - `--bg2` `#111118` — card surfaces
    - `--bg3` `#16161f` — hover / active surfaces
    - `--accent` `#63b3ed` — primary accent (blue)
    - `--green` `#34d399` — availability badge
    - `--text` `#e8e8f0` — primary text
    - `--text-dim` `#9ca3af` — body / description text
    - `--text-muted` `#6b7280` — labels, metadata
    - `--border` `rgba(255,255,255,0.07)` — default borders
- **Layout:** `max-width: 860px`, centered. Sections use `padding: 6rem 2rem`.
- **Nav:** Fixed, `backdrop-filter: blur(12px)`, hides links on mobile.
- **Animations:** IntersectionObserver fade-in on `.fade-in` elements (opacity + translateY).
- **Responsive breakpoint:** `640px` — single column, nav links hidden.

When making visual changes, preserve these tokens and the overall dark tech feel.
Do not introduce gradients, glow effects, or neon — keep it flat and sharp.

---

## Content sections

| # | ID | Heading |
|---|-----|---------|
| Hero | `#hero` | Name + tagline + stats |
| 01 | `#about` | Who I am |
| 02 | `#projects` | What I've built |
| 03 | `#experience` | Companies I've worked with |
| 04 | `#skills` | What I work with |
| 05 | `#testimonials` | What people say |
| 06 | `#links` | Find me online |
| 07 | `#contact` | Let's talk |

---

## Key personal data (keep accurate)

**Contact**
- Email: keilinkostiantyn@gmail.com
- Phone: +1 905 962 1211
- Location: Toronto, Ontario, Canada

**Profiles**
- GitHub: https://github.com/KKeylin
- LinkedIn: https://www.linkedin.com/in/kostiantyn-keilin/
- Medium: https://medium.com/@kostiantyn.keilin
- NPM: https://www.npmjs.com/~kkeylin

**Hero stats**
- 15+ years experience
- 9+ years React/TypeScript
- 32ms dashboard load (was ~2s at RBC Capital Markets — two-step prioritised fetch)

---

## Projects

### config-driven-testimonials
React component library for rendering testimonial blocks from a config file.
Turborepo monorepo, Zod schema for runtime config validation, TypeScript-first, published on NPM.
- Demo: https://config-driven-testimonials-demo.vercel.app/
- Settings generator: https://config-driven-testimonials-demo.vercel.app/editor
- GitHub: https://github.com/KKeylin/config-driven-testimonials
- NPM: https://www.npmjs.com/package/config-driven-testimonials

### slotpaste
Personal clipboard PWA for form-filling. Store reusable text snippets (names, addresses,
boilerplate) and paste into forms without carrying styles. Canvas view for spatial grouping.
Private mode with encryption. Started as Electron, migrated to PWA.
- Demo: https://slotpaste.vercel.app/
- GitHub: https://github.com/KKeylin/slotpaste

### playshelf
Test-task project: Next.js + Radix UI. Real-time sync across browser tabs with no backend —
everything in localStorage, 300ms simulated latency.
- Demo: https://playshelf-eight.vercel.app/

---

## Experience (approximate dates — verify before editing)

| Period              | Company                        | Note                          |
|---------------------|--------------------------------|-------------------------------|
| Jul 2022 – Mar 2026 | First Derivative / EPAM Systems | client: RBC Capital Markets  |
| Oct 2020 – Jan 2022 | Varteq                         | enterprise product dev        |
| Mar 2020 – Sep 2020 | Trinetix                       | client: Deloitte              |
| Nov 2018 – Mar 2020 | Litslink                       | software dev studio           |
| Jul 2017 – Oct 2018 | Arnit                          |                               |
| 2011 – 2017         | Earlier roles                  | agencies and freelance        |

---

## Deployment

Vercel, auto-deploys from `main`.
Domain: koskei.com

Build settings (Vercel default for Next.js):
- Build command: `next build`
- Output directory: `.next`
- Node version: 20+

To deploy: push to `main` — Vercel picks it up automatically.

---

## Planned iterations

### v1 (done)
- [x] Single-file HTML landing
- [x] Dark tech-style design
- [x] Mobile-responsive
- [x] Fade-in scroll animations

### v2 (done)
- [x] Migrate to Next.js App Router + TypeScript
- [x] Real photo in About section
- [x] Open Graph + Twitter Card meta tags
- [x] JSON-LD structured data (Person schema)
- [x] Testimonials section (config-driven-testimonials widget)

### v3 (next)
- [ ] Verify and fix company dates in Experience
- [ ] Add iCanProof as 4th project when it reaches MVP
- [ ] Add CV download button (PDF link) in hero or contact section
- [x] Wire up favicon via app/icon.svg (Next.js App Router convention)

### v4 (future)
- [ ] Add a /blog section pulling from Medium RSS
- [ ] Analytics (Plausible or Fathom — privacy-first)
- [ ] Dark/light mode toggle

---

## Notes for Claude

- This is a job-search asset. Copy should be confident, direct, and precise — no fluff.
- The 32ms stat is real and important — keep it prominent, don't downplay it.
- "Open to new opportunities" badge should stay visible as long as the search is active.
  When a role is found, remove it or change to "Not currently available".
- Tech stack in Skills section reflects actual production experience + current pet projects.
  Do not add technologies speculatively.
- When updating project descriptions, use the voice from the portfolio letter style:
  direct, honest, slightly informal, no AI-generated filler phrases.
- All content changes go into `app/page.tsx` (markup) and `app/globals.css` (styles).
  Testimonials data lives in `testimonials.config.json`.
