'use client';
import Link from 'next/link';
import { useProgress } from './ProgressProvider';
import type { ChapterData } from '@/types';

interface Props {
  courseId:       string;
  chapters:       ChapterData[];
  currentChapter: string;
}

export default function Sidebar({ courseId, chapters, currentChapter }: Props) {
  const { isCompleted, bookmarks, removeBookmark } = useProgress();

  const done  = chapters.filter(c => isCompleted(courseId, c.id)).length;
  const total = chapters.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const circ  = 113.1;
  const offset = circ - (circ * pct / 100);

  const courseBookmarks = bookmarks.filter(b => b.courseId === courseId);

  return (
    <aside className="fixed top-14 left-0 w-64 h-[calc(100vh-56px)] z-40
      bg-[#fafaf9] dark:bg-[#13100d]
      border-r border-[#f2dfd3] dark:border-[#221e1a]
      flex flex-col overflow-hidden">

      {/* Progress header */}
      <div className="p-4 border-b border-[#f2dfd3] dark:border-[#221e1a]">
        <Link href={`/courses/${courseId}`}
          className="flex items-center gap-3 mb-3 group">
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#f2dfd3" strokeWidth="3.5"
                className="dark:stroke-[#221e1a]"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#8d4b00" strokeWidth="3.5"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                className="transition-all duration-700 dark:stroke-[#d97706]"/>
            </svg>
            <span className="text-[10px] font-black text-[#8d4b00] dark:text-[#e8903a]">{pct}%</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-black text-[#231a13] dark:text-[#ede4da]
              uppercase tracking-wide group-hover:text-[#8d4b00] transition-colors block">
              Course Overview
            </span>
            <span className="text-[10px] text-[#887364]">{done}/{total} Chapters</span>
          </div>
        </Link>

        {/* Day pills */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => i + 1).map(day => {
            const dayChaps = chapters.filter(c => c.day === day);
            const allDone  = dayChaps.length > 0 && dayChaps.every(c => isCompleted(courseId, c.id));
            return (
              <Link key={day} href={`/courses/${courseId}/chapters/${dayChaps[0]?.id ?? ''}`}
                className={`text-[10px] font-bold py-1 rounded text-center transition-colors
                  ${allDone
                    ? 'bg-[#8d4b00] text-white dark:bg-[#d97706] dark:text-[#231a13]'
                    : 'bg-[#f2dfd3] text-[#887364] dark:bg-[#1c1813] hover:bg-[#e9d7cb] dark:hover:bg-[#221e1a]'
                  }`}>
                D{day}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-1 text-[10px] font-black text-[#887364] uppercase tracking-widest">
          Chapters
        </div>
        <ul className="px-2 space-y-0.5">
          {chapters.map((ch, idx) => {
            const done    = isCompleted(courseId, ch.id);
            const active  = ch.id === currentChapter;
            return (
              <li key={ch.id}>
                <Link href={`/courses/${courseId}/chapters/${ch.id}`}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] transition-colors
                    ${active
                      ? 'bg-[#fff1e9] dark:bg-[#2a1000] text-[#8d4b00] dark:text-[#e8903a] font-bold border-r-2 border-[#8d4b00] dark:border-[#e8903a]'
                      : done
                        ? 'text-[#059669] dark:text-[#4ade80] hover:bg-[#f0fdf4] dark:hover:bg-[#0a1f14]'
                        : 'text-[#887364] hover:bg-[#f2dfd3] dark:hover:bg-[#1c1813] hover:text-[#231a13] dark:hover:text-[#f5f5f4]'
                    }`}>
                  <span className="material-symbols-outlined shrink-0"
                    style={{ fontSize: 15,
                      color: active ? '#8d4b00' : done ? '#059669' : '#dbc2b0' }}>
                    {done ? 'check_circle' : active ? 'menu_book' : 'radio_button_unchecked'}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] opacity-50 uppercase tracking-wider">
                      {idx + 1} · {ch.dayLabel}
                    </span>
                    <span className="truncate text-[12px]">{ch.shortTitle}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bookmarks */}
      {courseBookmarks.length > 0 && (
        <div className="border-t border-[#f2dfd3] dark:border-[#221e1a] p-2">
          <div className="px-2 py-1 text-[10px] font-black text-[#887364] uppercase tracking-widest">
            Bookmarks
          </div>
          <ul className="space-y-0.5">
            {courseBookmarks.map(bm => (
              <li key={bm.chapterId}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                  hover:bg-[#f2dfd3] dark:hover:bg-[#1c1813] group">
                <Link href={`/courses/${courseId}/chapters/${bm.chapterId}`}
                  className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="material-symbols-outlined text-[#d97706]" style={{ fontSize: 13 }}>bookmark</span>
                  <span className="text-[12px] text-[#554336] dark:text-[#a89888] truncate">{bm.title}</span>
                </Link>
                <button onClick={() => removeBookmark(courseId, bm.chapterId)}
                  className="opacity-0 group-hover:opacity-100 text-[#887364] hover:text-red-500 transition-all">
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
