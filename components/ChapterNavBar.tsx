'use client';
import Link from 'next/link';
import type { ChapterNav } from '@/types';

interface Props {
  courseId:    string;
  prev:        ChapterNav | null;
  next:        ChapterNav | null;
  chapterTitle: string;
}

export default function ChapterNavBar({ courseId, prev, next, chapterTitle }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:left-64 h-[68px] z-40
      bg-[rgba(255,248,245,0.75)] dark:bg-[rgba(17,14,11,0.82)]
      backdrop-blur-2xl saturate-150
      border-t border-[rgba(219,194,176,0.45)] dark:border-[rgba(34,30,26,0.7)]
      flex items-center justify-between px-5 gap-4">

      {prev ? (
        <Link href={`/courses/${courseId}/chapters/${prev.id}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-[rgba(255,255,255,0.55)] dark:bg-[rgba(41,37,36,0.55)]
            border border-[rgba(219,194,176,0.55)] dark:border-[rgba(60,44,34,0.6)]
            text-[13px] font-bold text-[#554336] dark:text-[#ede4da]
            hover:bg-[rgba(247,229,217,0.85)] dark:hover:bg-[rgba(60,44,34,0.8)]
            hover:border-[#8d4b00] hover:text-[#231a13] dark:hover:text-[#f5f5f4]
            transition-all backdrop-blur-sm whitespace-nowrap shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_back</span>
          <span className="hidden sm:inline truncate max-w-[140px]">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      <span className="text-[12px] font-semibold text-[#887364] truncate text-center min-w-0 hidden sm:block">
        {chapterTitle}
      </span>

      {next ? (
        <Link href={`/courses/${courseId}/chapters/${next.id}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-[rgba(141,75,0,0.88)] dark:bg-[rgba(217,119,6,0.88)]
            text-[13px] font-bold text-white dark:text-[#231a13]
            hover:bg-[rgba(110,57,0,0.95)] dark:hover:bg-[rgba(180,100,6,0.95)]
            border border-transparent
            transition-all backdrop-blur-sm whitespace-nowrap shrink-0">
          <span className="hidden sm:inline truncate max-w-[140px]">{next.title}</span>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
        </Link>
      ) : (
        <Link href={`/courses/${courseId}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-[rgba(141,75,0,0.88)] dark:bg-[rgba(217,119,6,0.88)]
            text-[13px] font-bold text-white dark:text-[#231a13]
            hover:bg-[rgba(110,57,0,0.95)]
            border border-transparent transition-all backdrop-blur-sm whitespace-nowrap shrink-0">
          Back to course
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>home</span>
        </Link>
      )}
    </nav>
  );
}
