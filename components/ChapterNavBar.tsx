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
    <nav className="fixed bottom-0 left-0 right-0 lg:left-64 h-[72px] z-40
      bg-[rgba(253,250,248,0.82)] dark:bg-[rgba(14,11,8,0.88)]
      backdrop-blur-2xl saturate-150
      border-t border-[rgba(220,196,176,0.5)] dark:border-[rgba(30,26,22,0.8)]
      flex items-center justify-between px-5 gap-4">

      {prev ? (
        <Link href={`/courses/${courseId}/chapters/${prev.id}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl
            bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(35,30,25,0.6)]
            border border-[rgba(220,196,176,0.6)] dark:border-[rgba(50,40,32,0.7)]
            text-[12.5px] font-bold text-[#554336] dark:text-[#c9bfb4]
            hover:bg-[rgba(247,232,218,0.9)] dark:hover:bg-[rgba(50,40,32,0.9)]
            hover:border-[rgba(141,75,0,.4)] hover:text-[#231a13] dark:hover:text-[#f0e6db]
            transition-all backdrop-blur-sm whitespace-nowrap shrink-0 group">
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-0.5"
            style={{ fontSize: 14 }}>arrow_back</span>
          <span className="hidden sm:inline truncate max-w-[140px]">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      <span className="text-[11.5px] font-semibold text-[#a08878] dark:text-[#5c4e44]
        truncate text-center min-w-0 hidden sm:block">
        {chapterTitle}
      </span>

      {next ? (
        <Link href={`/courses/${courseId}/chapters/${next.id}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl
            bg-gradient-to-br from-[#8d4b00] to-[#c97000]
            dark:from-[#d97706] dark:to-[#b45309]
            text-[12.5px] font-bold text-white dark:text-[#1a1209]
            hover:from-[#7a4100] hover:to-[#b36200]
            dark:hover:from-[#c97000] dark:hover:to-[#a04500]
            border border-transparent
            shadow-[0_2px_12px_rgba(141,75,0,.35)] dark:shadow-[0_2px_12px_rgba(217,119,6,.3)]
            transition-all backdrop-blur-sm whitespace-nowrap shrink-0 group">
          <span className="hidden sm:inline truncate max-w-[140px]">{next.title}</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-0.5"
            style={{ fontSize: 14 }}>arrow_forward</span>
        </Link>
      ) : (
        <Link href={`/courses/${courseId}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl
            bg-gradient-to-br from-[#8d4b00] to-[#c97000]
            dark:from-[#d97706] dark:to-[#b45309]
            text-[12.5px] font-bold text-white dark:text-[#1a1209]
            hover:from-[#7a4100] hover:to-[#b36200]
            border border-transparent
            shadow-[0_2px_12px_rgba(141,75,0,.35)]
            transition-all backdrop-blur-sm whitespace-nowrap shrink-0">
          Back to course
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>home</span>
        </Link>
      )}
    </nav>
  );
}
