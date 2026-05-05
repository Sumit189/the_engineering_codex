'use client';
import { useEffect, useId, useRef, useState } from 'react';

interface Pos { top: number; left: number }

interface Service {
  id:    'chatgpt' | 'claude' | 'gemini';
  name:  string;
  hint:  string;
  /** URL template — `{q}` is replaced with the encoded prompt. */
  url:   (q: string) => string;
  brand: string;
  Icon:  () => JSX.Element;
}

const SERVICES: Service[] = [
  {
    id:    'chatgpt',
    name:  'ChatGPT',
    hint:  'chatgpt.com',
    url:   q => `https://chatgpt.com/?q=${q}&hints=search`,
    brand: '#10a37f',
    Icon:  () => (
      // OpenAI / ChatGPT mark — official lobehub icon
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" fillRule="evenodd" aria-hidden="true">
        <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"/>
      </svg>
    ),
  },
  {
    id:    'claude',
    name:  'Claude',
    hint:  'claude.ai',
    url:   q => `https://claude.ai/new?q=${q}`,
    brand: '#D97757',
    Icon:  () => (
      // Claude / Anthropic mark — official lobehub color icon (#D97757)
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path fill="#D97757" fillRule="nonzero" d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"/>
      </svg>
    ),
  },
  {
    id:    'gemini',
    name:  'Gemini',
    hint:  'AI Mode',
    // Use Google AI Mode — Gemini-powered and the `q` param works reliably,
    // unlike the consumer Gemini app URL.
    url:   q => `https://www.google.com/search?q=${q}&udm=50`,
    brand: '#3186FF',
    Icon:  GeminiIcon,
  },
];

// Gemini four-pointed star with the official multi-gradient lobehub treatment.
// Gradient IDs are scoped (random suffix) so multiple instances don't collide.
function GeminiIcon() {
  const u = useId().replace(/:/g, '_');
  const path = "M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z";
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path d={path} fill="#3186FF"/>
      <path d={path} fill={`url(#${u}-0)`}/>
      <path d={path} fill={`url(#${u}-1)`}/>
      <path d={path} fill={`url(#${u}-2)`}/>
      <defs>
        <linearGradient id={`${u}-0`} gradientUnits="userSpaceOnUse" x1="7" x2="11" y1="15.5" y2="12">
          <stop stopColor="#08B962"/>
          <stop offset="1" stopColor="#08B962" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id={`${u}-1`} gradientUnits="userSpaceOnUse" x1="8" x2="11.5" y1="5.5" y2="11">
          <stop stopColor="#F94543"/>
          <stop offset="1" stopColor="#F94543" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id={`${u}-2`} gradientUnits="userSpaceOnUse" x1="3.5" x2="17.5" y1="13.5" y2="12">
          <stop stopColor="#FABC12"/>
          <stop offset=".46" stopColor="#FABC12" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function buildPrompt(opts: { courseTitle?: string; chapterTitle?: string; text: string }) {
  const { courseTitle, chapterTitle, text } = opts;
  const lines: string[] = [];
  if (courseTitle && chapterTitle) {
    lines.push(`I'm reading the chapter "${chapterTitle}" from the course "${courseTitle}" on The Engineering Codex.`);
  } else if (chapterTitle) {
    lines.push(`I'm reading the chapter "${chapterTitle}" on The Engineering Codex.`);
  } else if (courseTitle) {
    lines.push(`I'm reading the course "${courseTitle}" on The Engineering Codex.`);
  } else {
    lines.push(`I'm reading content on The Engineering Codex.`);
  }
  lines.push('');
  lines.push('Please explain this passage in plain language, give a concrete example, and call out anything I should be careful about:');
  lines.push('');
  lines.push(`"""${text}"""`);
  return lines.join('\n');
}

export default function AskAITooltip() {
  const [text,    setText]    = useState('');
  const [pos,     setPos]     = useState<Pos | null>(null);
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    function update() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
          setVisible(false);
          return;
        }
        const selectedText = sel.toString().trim();
        if (selectedText.length < 2) {
          setVisible(false);
          return;
        }
        const range = sel.getRangeAt(0);
        const ancestor = range.commonAncestorContainer as Node;
        // Don't show if selection is *inside* the tooltip itself
        if (tooltipRef.current && tooltipRef.current.contains(ancestor)) return;

        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        setText(selectedText);
        setPos({
          top:  rect.top + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX,
        });
        setVisible(true);
      });
    }

    function onSelectionChange() { update(); }
    function onMouseDown(e: MouseEvent) {
      // hide if clicking outside the tooltip
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) setVisible(false);
      }
    }
    function onScroll() { setVisible(false); }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setVisible(false);
    }

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  if (!visible || !pos) return null;

  // Pull course / chapter context from data attributes set on the chapter page.
  // Safe under SSR — this code only runs in `useEffect`/render after hydration.
  const ctx = typeof document !== 'undefined'
    ? (document.querySelector('[data-chapter-title]') as HTMLElement | null)
    : null;
  const courseTitle  = ctx?.dataset.courseTitle;
  const chapterTitle = ctx?.dataset.chapterTitle;

  const prompt = buildPrompt({ courseTitle, chapterTitle, text });
  const encoded = encodeURIComponent(prompt);

  function handleClick(svc: Service) {
    // Best-effort copy as fallback — if the target's URL param isn't honored,
    // the user can paste the prompt directly.
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(prompt).catch(() => {});
    }
    window.open(svc.url(encoded), '_blank', 'noopener,noreferrer');
    setVisible(false);
  }

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      style={{
        position: 'absolute',
        top:  pos.top - 8,    // 8px above selection
        left: pos.left,
        transform: 'translate(-50%, -100%)',
      }}
      className="z-[60] pointer-events-auto"
      onMouseDown={(e) => e.preventDefault() /* keep selection alive */}>
      <div className="ask-ai-card">
        <div className="ask-ai-label">Ask about this in</div>
        <div className="ask-ai-row">
          {SERVICES.map(svc => (
            <button
              key={svc.id}
              type="button"
              onClick={() => handleClick(svc)}
              className="ask-ai-btn"
              style={{ '--brand': svc.brand } as React.CSSProperties}
              title={`Open in ${svc.name} (${svc.hint})`}>
              <span className="ask-ai-ico" aria-hidden="true"><svc.Icon /></span>
              <span className="ask-ai-name">{svc.name}</span>
            </button>
          ))}
        </div>
        <div className="ask-ai-arrow" aria-hidden="true" />
      </div>

      <style jsx>{`
        .ask-ai-card {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 10px 10px;
          border-radius: 12px;
          background: #ffffff;
          color: #231a13;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow:
            0 12px 32px -10px rgba(15,12,8,0.28),
            0 4px 10px -4px rgba(15,12,8,0.18),
            0 0 0 1px rgba(0,0,0,0.04);
          animation: ask-ai-pop 140ms cubic-bezier(.2,.8,.3,1) both;
        }
        :global(.dark) .ask-ai-card {
          background: #1a1c22;
          color: #e6e8ee;
          border-color: rgba(255,255,255,0.08);
          box-shadow:
            0 12px 32px -8px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.06);
        }
        .ask-ai-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #887364;
          padding: 0 4px;
        }
        :global(.dark) .ask-ai-label { color: #8d93a3; }
        .ask-ai-row {
          display: flex;
          gap: 4px;
        }
        .ask-ai-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          background: transparent;
          color: inherit;
          border: 1px solid transparent;
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 120ms ease, color 120ms ease, border-color 120ms ease, transform 120ms ease;
        }
        .ask-ai-btn:hover {
          background: color-mix(in oklab, var(--brand) 12%, transparent);
          color: var(--brand);
          border-color: color-mix(in oklab, var(--brand) 24%, transparent);
        }
        .ask-ai-btn:active { transform: translateY(0.5px); }
        .ask-ai-ico {
          display: inline-flex;
          color: var(--brand);
        }
        .ask-ai-arrow {
          position: absolute;
          left: 50%;
          bottom: -6px;
          width: 12px; height: 12px;
          background: inherit;
          border-right: 1px solid rgba(0,0,0,0.06);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transform: translateX(-50%) rotate(45deg);
          background-color: #ffffff;
        }
        :global(.dark) .ask-ai-arrow {
          background-color: #1a1c22;
          border-right-color: rgba(255,255,255,0.08);
          border-bottom-color: rgba(255,255,255,0.08);
        }
        @keyframes ask-ai-pop {
          0%   { opacity: 0; transform: translate(-50%, calc(-100% + 4px)) scale(0.96); }
          100% { opacity: 1; transform: translate(-50%, -100%)             scale(1);    }
        }
      `}</style>
    </div>
  );
}
