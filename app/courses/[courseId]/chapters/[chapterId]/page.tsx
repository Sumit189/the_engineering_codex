import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChapterNavBar from '@/components/ChapterNavBar';
import ChapterActions from '@/components/ChapterActions';
import ReadingSettings from '@/components/ReadingSettings';
import { getCourse, getCourseIds, getChapter, getChapters } from '@/lib/courses';

export async function generateStaticParams() {
  return getCourseIds().flatMap(courseId => {
    try {
      return getChapters(courseId).map(ch => ({ courseId, chapterId: ch.id }));
    } catch { return []; }
  });
}

interface Props { params: { courseId: string; chapterId: string } }

const diffStyle: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  intermediate: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  advanced:     { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
};

export default function ChapterPage({ params: { courseId, chapterId } }: Props) {
  let course, chapter, chapters;
  try {
    course   = getCourse(courseId);
    chapters = getChapters(courseId);
    chapter  = getChapter(courseId, chapterId);
  } catch {
    notFound();
  }

  const dc = diffStyle[chapter.diff] || diffStyle.beginner;

  // Extract H2s for "What you'll learn"
  const h2s = [...(chapter.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi))]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .slice(0, 6);

  return (
    <>
      <Header courseTitle={course.title} courseId={courseId} />
      <Sidebar courseId={courseId} chapters={chapters} currentChapter={chapterId} />
      <ReadingSettings />
      <ChapterNavBar
        courseId={courseId}
        prev={chapter.prev}
        next={chapter.next}
        chapterTitle={chapter.shortTitle}
      />

      <main className="lg:ml-64 pt-14 pb-24 min-h-screen">
        <div className="max-w-[720px] mx-auto px-5 py-8">

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#dbc2b0] bg-white dark:bg-[#1c1813] dark:border-[#2f2923] text-[11px] font-semibold text-[#554336] dark:text-[#a89888]">
              <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]" style={{ fontSize: 12 }}>calendar_today</span>
              {chapter.dayLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#dbc2b0] bg-white dark:bg-[#1c1813] dark:border-[#2f2923] text-[11px] font-semibold text-[#554336] dark:text-[#a89888]">
              <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]" style={{ fontSize: 12 }}>schedule</span>
              {chapter.time}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold"
              style={{ background: dc.bg, color: dc.text, borderColor: dc.border }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, color: dc.text }}>signal_cellular_alt</span>
              {chapter.diff.charAt(0).toUpperCase() + chapter.diff.slice(1)}
            </span>
          </div>

          {/* Hero */}
          <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chapter.coverImage ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'}
              alt={chapter.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-end p-6"
              style={{ background: 'linear-gradient(to top, rgba(35,26,19,.85) 0%, rgba(35,26,19,.1) 55%, transparent 100%)' }}>
              <h1 className="text-[1.75rem] md:text-[2rem] font-black text-white leading-tight"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,.35)' }}>
                {chapter.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <p className="font-serif text-[17px] italic leading-relaxed text-[#554336] dark:text-[#a89888] mb-7">
            {chapter.desc}
          </p>

          {/* What you'll learn */}
          {h2s.length > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-[#fff1e9] to-[#fdeade]
              dark:from-[#110e0b] dark:to-[#1c1813]
              border border-[#dbc2b0] dark:border-[#2f2923] rounded-2xl p-5 mb-7 before:content-['']
              before:absolute before:top-0 before:left-0 before:w-1 before:h-full
              before:bg-gradient-to-b before:from-[#8d4b00] before:to-[#d97706]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8d4b00] dark:text-[#e8903a] mb-3">
                What you will learn
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {h2s.map(h => (
                  <div key={h} className="flex items-center gap-2 text-[13px] text-[#554336] dark:text-[#ede4da]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d97706] shrink-0" />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmark (top — before reading) */}
          <ChapterActions courseId={courseId} chapterId={chapterId} title={chapter.title} position="top" />

          {/* Content */}
          <div
            className="chapter-content"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />

          {/* Mark complete (bottom — after reading) */}
          <div className="mt-10 pt-8 border-t border-[#f2dfd3] dark:border-[#221e1a]">
            <p className="text-[11px] font-bold text-[#887364] uppercase tracking-widest mb-3">
              Finished reading?
            </p>
            <ChapterActions courseId={courseId} chapterId={chapterId} title={chapter.title} position="bottom" />
          </div>
        </div>
      </main>
    </>
  );
}
