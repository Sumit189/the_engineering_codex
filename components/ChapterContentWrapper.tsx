'use client';
import { useProgress } from './ProgressProvider';

interface Props {
  courseTitle:  string;
  chapterTitle: string;
  children:     React.ReactNode;
}

/**
 * Centers the chapter article when the sidebar is hidden, and left-aligns
 * it (with breathing room to the right of the TOC) when the sidebar is open.
 * The right gutter at xl+ always reserves space for the floating Table of
 * Contents so it never collides with the article column.
 */
export default function ChapterContentWrapper({
  courseTitle, chapterTitle, children,
}: Props) {
  const { sidebarOpen } = useProgress();

  const layout = sidebarOpen
    // Sidebar open: left-align inside the sidebar-shifted main area.
    ? 'mx-auto lg:mx-0 lg:ml-12 xl:mr-[300px] 2xl:ml-20 2xl:mr-[340px]'
    // Sidebar hidden: keep article horizontally centered, but still leave
    // a right gutter at xl+ so the TOC has clean space.
    : 'mx-auto xl:mr-[300px] 2xl:mr-[340px]';

  return (
    <div
      className={`max-w-[760px] px-5 py-10 ${layout}`}
      data-course-title={courseTitle}
      data-chapter-title={chapterTitle}
    >
      {children}
    </div>
  );
}
