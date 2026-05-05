# The Engineering Codex

A structured learning platform for engineers who want to deeply understand and operate production systems — not just use them.

Each course is a focused, multi-day curriculum with hands-on content, progress tracking, bookmarks, and a reading experience built for focus.

---

## Features

- **Structured curricula** — multi-day courses broken into focused chapters
- **Progress tracking** — per-chapter completion state, persisted in localStorage
- **Bookmarks** — save chapters for quick reference
- **Reading preferences** — adjustable font size, weight, and line height
- **Dark mode** — system-aware with manual override
- **Responsive** — sidebar navigation on desktop, clean mobile layout

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | Inter, Newsreader, JetBrains Mono (via Google Fonts) |
| State | React Context + localStorage |
| Content | Static JSON files |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/your-org/the-engineering-codex.git
cd the-engineering-codex
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
the_engineering_codex/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout + metadata
│   ├── globals.css             # Global styles + chapter content CSS
│   └── courses/[courseId]/     # Course overview & chapter reader pages
├── components/                 # React components
│   ├── Header.tsx              # Top nav bar with theme toggle
│   ├── Sidebar.tsx             # Chapter list + progress circle
│   ├── ChapterNavBar.tsx       # Prev/Next chapter navigation
│   ├── ChapterActions.tsx      # Bookmark & mark-complete buttons
│   ├── ReadingSettings.tsx     # Font/line-height controls
│   └── ProgressProvider.tsx   # Global progress & bookmark context
├── courses/                    # Static course content
│   └── [course-id]/
│       ├── course.json         # Course metadata (title, tags, duration)
│       └── chapters/
│           ├── index.json      # Chapter order
│           ├── schedule.json   # Day-by-day schedule
│           └── [day]/
│               └── chapter.json  # Chapter content (HTML + metadata)
├── lib/
│   └── courses.ts              # Data access functions
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## Adding a Course

1. Create a folder under `courses/` using a kebab-case slug (e.g. `courses/distributed-systems/`).
2. Add `course.json` following the schema in `types/index.ts` (`CourseData`).
3. Create a `chapters/` subfolder with:
   - `index.json` — ordered list of chapter folder names
   - `schedule.json` — day-by-day groupings
   - One subfolder per chapter, each containing `chapter.json` (`ChapterData`)
4. Register the slug in `courses/index.json`.

Chapter content is HTML stored in the `content` field of `chapter.json`. Use semantic elements — the platform's CSS in `globals.css` handles typography, callout blocks, code blocks, and tables.

---

## Contributing

Contributions are welcome — whether that's a new course, a bug fix, a UI improvement, or a feature.

### 1. Fork & Branch

```bash
git clone https://github.com/your-org/the-engineering-codex.git
cd the-engineering-codex
git checkout -b feat/your-feature-name
```

### 2. Make Changes

Follow the patterns already in the codebase:

- Components live in `components/` and use Tailwind utility classes
- Course data is JSON — no build step required for content changes
- TypeScript strict mode is on; avoid `any`
- No new dependencies without a clear reason

### 3. Test Locally

```bash
npm run dev     # dev server with hot reload
npm run build   # verify production build passes
```

### 4. Open a Pull Request

- Keep PRs focused — one concern per PR
- Describe *what* changed and *why* in the PR body
- For new courses, include a brief outline of the curriculum

### Reporting Issues

Open a GitHub Issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser / OS if it's a visual bug

---

## License

MIT — see [LICENSE](LICENSE) for details.
