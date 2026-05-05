'use client';
import { useState } from 'react';
import { useProgress } from './ProgressProvider';

interface Props {
  courseId:  string;
  chapterId: string;
  title:     string;
  /** 'top' renders Bookmark only. 'bottom' renders Mark Complete + Bookmark. */
  position?: 'top' | 'bottom';
}

export default function ChapterActions({ courseId, chapterId, title, position = 'bottom' }: Props) {
  const { isCompleted, isBookmarked, toggle, addBookmark, removeBookmark } = useProgress();
  const [burst, setBurst] = useState(false);

  const done       = isCompleted(courseId, chapterId);
  const bookmarked = isBookmarked(courseId, chapterId);

  function handleComplete() {
    if (!done) { setBurst(true); setTimeout(() => setBurst(false), 600); }
    toggle(courseId, chapterId);
  }

  function handleBookmark() {
    bookmarked ? removeBookmark(courseId, chapterId) : addBookmark(courseId, chapterId, title);
  }

  return (
    <div className="flex flex-wrap gap-3 my-4">
      {/* Bookmark — always visible at both positions */}
      <button onClick={handleBookmark}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[13px] font-semibold
          cursor-pointer transition-all
          ${bookmarked
            ? 'bg-[#fffbeb] border-[#fde68a] text-[#92400e] dark:bg-[#231600] dark:border-[#4a2c00] dark:text-[#e8903a]'
            : 'bg-white border-[#dbc2b0] text-[#554336] hover:border-[#8d4b00] hover:bg-[#fff1e9] dark:bg-[#1c1813] dark:border-[#2f2923] dark:text-[#a89888] dark:hover:bg-[#221e1a]'
          }`}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
          {bookmarked ? 'bookmark' : 'bookmark_border'}
        </span>
        {bookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>

      {/* Mark complete — only at bottom, after reading */}
      {position === 'bottom' && (
        <button onClick={handleComplete}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[13px] font-semibold
            cursor-pointer transition-all ${burst ? 'scale-110' : 'scale-100'}
            ${done
              ? 'bg-[#f0fdf4] border-[#86efac] text-[#166534] dark:bg-[#052e16] dark:border-[#15803d] dark:text-[#4ade80]'
              : 'bg-white border-[#dbc2b0] text-[#554336] hover:border-[#8d4b00] hover:bg-[#fff1e9] dark:bg-[#1c1813] dark:border-[#2f2923] dark:text-[#a89888] dark:hover:bg-[#221e1a]'
            }`}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            {done ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          {done ? 'Completed' : 'Mark complete'}
        </button>
      )}
    </div>
  );
}
