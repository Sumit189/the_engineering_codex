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
├── public/
│   └── covers/                 # Per-chapter cover images (served at /covers/...)
│       └── [course-id]/        # One folder per course
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

## Cover Images

Every chapter has a hero image displayed at the top of its page. Images live in `public/covers/[course-slug]/` and are referenced by absolute URL path in the chapter JSON (Next.js serves `public/` at the URL root).

> **No course-level cover images.** Course cards on the landing page render with a colored top stripe (driven by the `color` field in `course.json`). Don't add `coverImage` to `course.json` — the field doesn't exist on the `CourseData` type and won't render.

### Folder Convention

```
public/covers/
├── llm-systems/
│   ├── day1-am-gpu-fundamentals.jpg
│   ├── day1-pm-quantization.jpg
│   └── ...
├── application-security/
│   ├── day1-am-security-foundations.jpg
│   └── ...
└── [course-slug]/
    └── [day-folder]-[topic-slug].jpg
```

### Adding Chapter Cover Images

```bash
# 1. Create the per-course folder
mkdir -p public/covers/[course-slug]

# 2. Download from Unsplash (use the photo ID from any unsplash.com URL)
curl -L -o public/covers/[course-slug]/[day]-[topic-slug].jpg \
  "https://images.unsplash.com/photo-[id]?auto=format&fit=crop&q=80&w=1600"
```

Then add to the chapter JSON (e.g. `courses/[course-slug]/chapters/day1-am/chapter.json`):

```json
{
  "coverImage": "/covers/[course-slug]/[day]-[topic-slug].jpg"
}
```

The renderer in `app/courses/[courseId]/chapters/[chapterId]/page.tsx` falls back to a default Unsplash URL if `coverImage` is missing, so chapters without a cover still render — but every shipped chapter should have one.

**Image guidelines:** 1600 px wide, JPEG, < 500 KB after Unsplash's `q=80&w=1600` re-encoding. Pick editorial / atmospheric shots over literal subject matter — abstract circuitry beats stock photos of people pointing at screens.

---

## Chapter JSON Schema

Each `chapter.json` file matches the `ChapterData` interface in `types/index.ts`:

```jsonc
{
  "id":         "kv-caching",                  // unique slug, kebab-case
  "day":        3,                             // 1-7 (or however many your course has)
  "dayLabel":   "DAY 3",                       // displayed in hero badge ("DAY 1 · AM" if split)
  "time":       "~4 hrs",                     // estimated reading time
  "diff":       "intermediate",                // "beginner" | "intermediate" | "advanced"
  "title":      "KV Caching, Speculative Decoding & Token Throughput",
  "shortTitle": "KV Cache & Spec Decoding",    // shown in sidebar / breadcrumb
  "desc":       "One-line summary shown under the title and on the course page.",
  "coverImage": "/covers/llm-systems/day3-kv-caching.jpg",
  "content":    "<h2>...</h2><p>...</p>",      // full chapter body as HTML string
  "prev": { "id": "vllm-trtllm",         "title": "vLLM & TRT-LLM",      "folder": "day2" },
  "next": { "id": "distributed-training", "title": "Distributed Training", "folder": "day4" }
}
```

### Available Content Blocks

The `content` field is HTML. The platform's CSS understands these conventions:

| Block | Markup | Purpose |
|---|---|---|
| Callout | `<div class="callout info\|warning\|tip\|key\|danger">...</div>` | Highlighted boxes with icon + body |
| Code block | `<div class="code-block"><div class="cb-lang">Python</div><pre>...</pre></div>` | Terminal-styled with traffic lights, syntax classes (`.kw`, `.str`, `.num`, `.cmt`, `.fn`, `.cls`, `.op`) |
| Figure + SVG | `<div class="figure"><div class="figure-svg"><svg class="svg-anim">...</svg></div><div class="figure-caption">...</div></div>` | Animated SVG diagrams (see below) |
| Table | `<div class="table-wrap"><table>...</table></div>` | Auto-styled responsive tables |
| Compare grid | `<div class="compare-grid"><div class="compare-card">...</div>...</div>` | Side-by-side option comparisons |
| Formula | `<div class="formula"><div class="f-label">Name</div>EQUATION</div>` | Highlighted equation block |
| Flashcard | `<div class="flashcard">...front/back...</div>` | Click-to-flip Q&A |
| Mnemonic | `<div class="mnemonic">...</div>` | Memory-aid block |
| Recall check | `<div class="recall">...question + <details>answer</details>...</div>` | Inline self-test |
| Further reading | `<div class="further-reading"><span class="further-reading-label">📚 Further reading</span><ul>...</ul></div>` | References with `<span class="src">domain</span>` tags |

### SVG Animation Classes

Available animation utilities (defined in `globals.css`):

- `.svg-anim` — required wrapper class on the `<svg>`
- `.pop .d-1` … `.d-6` — staggered scale-in entries (`d-N` is the delay tier)
- `.fade-up .d-N` — fade + slide-up on entry
- `.pulse .d-N` — infinite scale/opacity pulse (good for "active computation")
- `.flow` — infinite dashed-line flow on `<line>` / `<path>`
- `.draw-path .draw-slow` — stroke-dasharray draw-on animation (requires `pathLength="1"` on the path)

Native SVG `<animateMotion>` works too — see `courses/llm-systems-engineering/chapters/day1-am/chapter.json` for a multi-packet data-flow example.

---

## Authoring Chapters with Claude

Use this prompt template to draft a new chapter end-to-end. Paste it into Claude Code (or the API) inside the repo root — Claude can read existing chapters as references, fetch citations, write the JSON, design SVG animations, and download a cover image.

````markdown
You are authoring chapter `[CHAPTER-SLUG]` for the `[COURSE-SLUG]` course in
this repo. Match the editorial style and structure of existing chapters in
`courses/[COURSE-SLUG]/chapters/`.

**Topic:** [TOPIC and one-paragraph scope]

**Context to gather first (use WebSearch / WebFetch):**
1. The 3-5 most authoritative primary sources on this topic (papers, official
   docs, RFCs). Note the canonical URL and one-line summary of each.
2. Any common misconceptions or pitfalls practitioners hit in production.
3. Numbers / benchmarks worth quoting (with source).

**Then produce a chapter JSON at**
`courses/[COURSE-SLUG]/chapters/[FOLDER]/chapter.json` matching the
`ChapterData` schema in `types/index.ts`. Required fields: `id`, `day`,
`dayLabel`, `time`, `diff`, `title`, `shortTitle`, `desc`, `coverImage`,
`content`, `prev`, `next`.

**Content requirements (HTML inside the `content` field):**
- Open with a 1-paragraph hook framing the practical problem.
- Use the available content blocks documented in `README.md` — at minimum:
  one `callout key` (key takeaways), 1-2 code blocks, one table, and 2-3
  inline citations as `<a href="..." target="_blank" rel="noopener">`.
- Include **at least one animated SVG** in the `figure` wrapper. Use the
  `.svg-anim` framework classes (`pop`, `fade-up`, `pulse`, `flow`,
  `animateMotion`) — no new CSS. Reference an existing chapter for the
  pattern (e.g. `day1-am/chapter.json`'s GPU data-flow animation).
- End with a `further-reading` block linking 4-6 of the primary sources you
  gathered, each with `<span class="src">domain</span>`.

**Chapter cover image (chapter-level only — there are no course-level covers):**
1. Pick an editorial Unsplash photo that fits the chapter topic (avoid
   stock-photo clichés — prefer atmospheric / abstract / industrial shots).
2. Ensure the per-course folder exists and download into it:
   ```bash
   mkdir -p public/covers/[COURSE-SLUG]
   curl -L -o public/covers/[COURSE-SLUG]/[FOLDER]-[CHAPTER-SLUG].jpg \
     "https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=1600"
   ```
3. Set `coverImage` in the *chapter* JSON to the resulting `/covers/...` path.
   Do NOT add `coverImage` to `course.json` — it's not on the schema.

**Wire-up steps when finished:**
- Add the new chapter folder to `courses/[COURSE-SLUG]/chapters/index.json`
- Add it to the right day in `courses/[COURSE-SLUG]/chapters/schedule.json`
- Update `prev` / `next` on the surrounding chapters
- Run `npx tsc --noEmit` to confirm the JSON shape still validates

**Style guardrails:**
- Concrete > abstract. Lead with what breaks in production, then explain why.
- Cite numbers (latency, cost, throughput) — link the source.
- No filler ("In today's fast-paced world…"). Get to the technical point.
- Match the typographic rhythm of existing chapters: `<h2>` for sections,
  `<h3>` for subsections, short paragraphs, frequent callouts.
````

When iterating on an existing chapter, swap the "produce a chapter JSON" step
for "edit the existing JSON in place" and skip the wire-up steps.

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

[PolyForm Noncommercial License 1.0.0](LICENSE) — free for personal, educational, and non-commercial use. Commercial use is not permitted.
