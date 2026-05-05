'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
  courseTitle?: string;
  courseId?:   string;
  progress?:   number; // 0-100
}

export default function Header({ courseTitle, courseId, progress }: Props) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      bg-[rgba(255,248,245,0.72)] dark:bg-[rgba(17,14,11,0.80)]
      backdrop-blur-xl saturate-150
      border-b border-[rgba(219,194,176,0.45)] dark:border-[rgba(60,44,34,0.45)]
      flex items-center justify-between px-5 gap-4">

      {/* Left breadcrumb */}
      <div className="flex items-center gap-3 min-w-0 overflow-hidden">
        <Link href="/"
          className="text-sm font-black tracking-tight text-[#231a13] dark:text-white
            hover:text-[#8d4b00] dark:hover:text-[#fbbf24] transition-colors whitespace-nowrap shrink-0">
          The Engineering Codex
        </Link>
        {courseTitle && courseId && (
          <>
            <span className="text-[#dbc2b0] dark:text-[#2f2923] shrink-0">/</span>
            <Link href={`/courses/${courseId}`}
              className="text-xs font-semibold text-[#887364] hover:text-[#8d4b00] dark:hover:text-[#fbbf24]
                transition-colors truncate max-w-[200px]">
              {courseTitle}
            </Link>
          </>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 shrink-0">
        {progress !== undefined && (
          <span className="text-[11px] font-black text-[#8d4b00] dark:text-[#e8903a] uppercase tracking-wider mr-1">
            {progress}%
          </span>
        )}
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full
              hover:bg-[#f2dfd3] dark:hover:bg-[#1c1813] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[#554336] dark:text-[#a89888]"
              style={{ fontSize: 19 }}>
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}
      </div>

      {/* Progress bar */}
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
