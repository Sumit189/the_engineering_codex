'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useProgress } from './ProgressProvider';

interface Props {
  courseTitle?: string;
  courseId?:   string;
  progress?:   number; // 0-100
}

function Logo() {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0 drop-shadow-[0_1px_2px_rgba(141,75,0,0.25)]"
    >
      <defs>
        <linearGradient id="hdr-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#f59e0b" />
          <stop offset="55%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#8d4b00" />
        </linearGradient>
      </defs>
      {/* Spine — stacked codex pages */}
      <rect x="2" y="3" width="20" height="18" rx="4" fill="url(#hdr-logo-grad)" />
      <rect x="2" y="3" width="20" height="18" rx="4" fill="none"
        stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="6"  y1="8"  x2="18" y2="8"  stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6"  y1="12" x2="15" y2="12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6"  y1="16" x2="13" y2="16" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({ courseTitle, courseId, progress }: Props) {
  const [dark,    setDark]    = useState(false);
  const [mounted, setMounted] = useState(false);
  const { sidebarOpen, toggleSidebar } = useProgress();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const sys   = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && sys);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-50
      bg-[rgba(255,248,245,0.55)] dark:bg-[rgba(15,17,21,0.55)]
      backdrop-blur-2xl backdrop-saturate-[1.8]
      border-b border-[rgba(219,194,176,0.35)] dark:border-[rgba(255,255,255,0.06)]
      shadow-[0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]
      flex items-center justify-between px-3 gap-3">

      {/* Left — sidebar toggle + breadcrumb (course pages only) */}
      <div className="flex items-center gap-2 min-w-0 overflow-hidden">
        {courseId && mounted && (
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            className="w-8 h-8 flex items-center justify-center rounded-full shrink-0
              hover:bg-[#f2dfd3] dark:hover:bg-[#1d212a] transition-colors">
            <span className="material-symbols-outlined text-[#554336] dark:text-[#8d93a3]"
              style={{ fontSize: 20 }}>
              {sidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        )}

        {courseId ? (
          <>
            <Link href="/"
              className="flex items-center gap-2 text-[15px] font-black tracking-tight text-[#231a13] dark:text-white
                hover:text-[#8d4b00] dark:hover:text-[#fbbf24] transition-colors whitespace-nowrap shrink-0">
              <Logo />
              <span>The Engineering Codex</span>
            </Link>
            {courseTitle && (
              <>
                <span className="text-[#dbc2b0] dark:text-[#363c48] shrink-0">/</span>
                <Link href={`/courses/${courseId}`}
                  className="text-xs font-semibold text-[#887364] hover:text-[#8d4b00] dark:hover:text-[#fbbf24]
                    transition-colors truncate max-w-[200px]">
                  {courseTitle}
                </Link>
              </>
            )}
          </>
        ) : null}
      </div>

      {/* Centered title — landing page only */}
      {!courseId && (
        <Link href="/"
          aria-label="Home"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[15px] font-black tracking-tight
            text-[#231a13] dark:text-white
            hover:text-[#8d4b00] dark:hover:text-[#fbbf24] transition-colors whitespace-nowrap">
          <Logo />
          <span>The Engineering Codex</span>
        </Link>
      )}

      {/* Right controls */}
      <div className="flex items-center gap-1 shrink-0">
        {progress !== undefined && (
          <span className="text-[11px] font-black text-[#8d4b00] dark:text-[#fbbf24] uppercase tracking-wider mr-1">
            {progress}%
          </span>
        )}
        <a
          href="https://github.com/Sumit189/the_engineering_codex"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contribute on GitHub"
          title="Contribute on GitHub"
          className="w-8 h-8 flex items-center justify-center rounded-full
            hover:bg-[#f2dfd3] dark:hover:bg-[#1d212a] transition-colors cursor-pointer">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
            className="fill-[#554336] dark:fill-[#8d93a3]">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
          </svg>
        </a>
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-full
              hover:bg-[#f2dfd3] dark:hover:bg-[#1d212a] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#554336] dark:text-[#8d93a3]"
              style={{ fontSize: 19 }}>
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}
      </div>

      {/* Reading progress bar */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[rgba(242,223,209,.35)]">
          <div
            className="h-full bg-gradient-to-r from-[#8d4b00] via-[#d97706] to-[#fbbf24] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
}
