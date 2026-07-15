# Vaishnavi Shukla — Portfolio

A premium developer portfolio built with React, TanStack Start, Tailwind CSS, and Motion. Features a particle-typography hero, custom cursor, magnetic buttons, scroll-velocity bands, interactive project showcases, and a terminal-style contact form.

**Live:**[Portfolio](https://portfolio-fawn-theta-90.vercel.app/)

## ✨ Features

- **Hero** — cursor-driven particle typography, aurora lighting, "Open to opportunities" badge, role pills, magnetic CTA
- **About** — animated counters and a looping terminal panel
- **Experience** — alternating timeline (2023 → present)
- **Skills** — tilt cards across 6 disciplines with cursor-tracking glow
- **Projects** — AgriGuardian (edge AI crop monitoring) and Data Drill (Go web-scraping platform), each with architecture flow diagrams, live-log previews, and metrics
- **AI Playground** — regex generator, JSON formatter, and color palette tools
- **Contact** — terminal-style form delivering via FormSubmit
- Custom cursor, loading screen, floating dock navigation, scroll-velocity marquees, and a signature sign-off

## 🛠 Tech Stack

| Layer      | Tools                                                    |
| ---------- | -------------------------------------------------------- |
| Framework  | React 19, TanStack Start (file-based routing, SSR)       |
| Styling    | Tailwind CSS v4, shadcn/ui (Radix primitives)            |
| Animation  | Motion (Framer Motion), custom canvas particle effects   |
| Build      | Vite, TypeScript                                          |
| Deploy     | Cloudflare (via Nitro preset)                             |

## 🚀 Getting Started

```bash
# install dependencies
npm install        # or: bun install

# start dev server
npm run dev

# production build
npm run build

# preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── routes/
│   ├── __root.tsx        # root layout, fonts, meta
│   └── index.tsx         # the entire portfolio page (hero, projects, contact…)
├── components/
│   ├── premium/          # custom animated components (Dock, TiltCard, Terminal…)
│   └── ui/               # shadcn/ui primitives + particle typography
├── styles.css            # theme tokens (oklch), keyframes, utilities
└── router.tsx            # TanStack Router setup
```

Portfolio content — projects, timeline, and skills — is defined as data arrays at the top of `src/routes/index.tsx` (`PROJECTS`, `TIMELINE`, `SKILL_GROUPS`), so updating content doesn't require touching any component code.

## 📬 Contact

- **GitHub:** [Vaishnavi1325](https://github.com/Vaishnavi1325/)
- **LinkedIn:** [vaishnavi1325](https://www.linkedin.com/in/vaishnavi1325/)

---

© 2027 Vaishnavi Shukla
