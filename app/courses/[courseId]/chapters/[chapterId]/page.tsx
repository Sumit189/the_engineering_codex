import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChapterNavBar from '@/components/ChapterNavBar';
import ChapterActions from '@/components/ChapterActions';
import ChapterTracker from '@/components/ChapterTracker';
import ReadTime from '@/components/ReadTime';
import ReaderShell from '@/components/ReaderShell';
import ReadingSettings from '@/components/ReadingSettings';
import { getCourse, getCourseIds, getChapter, getChapters } from '@/lib/courses';
import { countWords } from '@/lib/readingTime';

export async function generateStaticParams() {
  return getCourseIds().flatMap(courseId => {
    try {
      return getChapters(courseId).map(ch => ({ courseId, chapterId: ch.id }));
    } catch { return []; }
  });
}

interface Props { params: { courseId: string; chapterId: string } }

const diffConfig: Record<string, { color: string; label: string }> = {
  beginner:     { color: '#059669', label: 'Beginner' },
  intermediate: { color: '#d97706', label: 'Intermediate' },
  advanced:     { color: '#dc2626', label: 'Advanced' },
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

  const dc           = diffConfig[chapter.diff] || diffConfig.beginner;
  const chapterIndex = chapters.findIndex(c => c.id === chapterId) + 1;
  const wordCount    = countWords(chapter.content);

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
      {/* Records reading start time on mount */}
      <ChapterTracker courseId={courseId} chapterId={chapterId} />

      <ReaderShell>
        <div className="max-w-[760px] mx-auto px-5 py-10">

          {/* Hero — atmospheric, title-free */}
          <div className="relative w-full h-[268px] md:h-[372px] rounded-[24px] overflow-hidden mb-9
            shadow-[0_20px_60px_-8px_rgba(141,75,0,.22),0_4px_16px_rgba(0,0,0,.08)]
            dark:shadow-[0_20px_60px_rgba(0,0,0,.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chapter.coverImage ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 45%, rgba(14,9,4,.52) 100%)' }} />

            {/* Day badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-black/32 backdrop-blur-lg border border-white/18
                text-white text-[10.5px] font-bold tracking-[0.12em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {chapter.dayLabel}
              </span>
            </div>

            {/* Chapter counter */}
            <div className="absolute bottom-4 right-5">
              <span className="text-[13px] font-black tracking-tight text-white/55"
                style={{ fontVariantNumeric: 'tabular-nums' }}>
                {String(chapterIndex).padStart(2, '0')}
                <span className="opacity-50"> / </span>
                {String(chapters.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[2.1rem] md:text-[2.6rem] font-black
            text-[#1a1209] dark:text-[#f5ede4]
            leading-[1.1] tracking-[-0.025em] mb-4">
            {chapter.title}
          </h1>

          {/* Meta strip — personalized read time */}
          <div className="flex items-center mb-7 text-[12.5px] font-semibold text-[#887364]">
            <span className="flex items-center gap-1.5 pr-4">
              <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                style={{ fontSize: 13 }}>schedule</span>
              <ReadTime wordCount={wordCount} />
            </span>
            <span className="h-3.5 w-px bg-[#dbc2b0] dark:bg-[#2f2923] mr-4" />
            <span className="flex items-center gap-1.5" style={{ color: dc.color }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: dc.color }}>
                signal_cellular_alt
              </span>
              {dc.label}
            </span>
            <span className="h-3.5 w-px bg-[#dbc2b0] dark:bg-[#2f2923] mx-4" />
            <span className="text-[#b0998a] dark:text-[#5c4e44]">{wordCount.toLocaleString()} words</span>
          </div>

          {/* Description — pull quote */}
          <blockquote className="font-serif text-[18px] italic leading-[1.82]
            text-[#554336] dark:text-[#a89888] mb-9
            pl-5 border-l-[3px] border-[#d97706] dark:border-[#e8903a]">
            {chapter.desc}
          </blockquote>

          {/* What you'll learn */}
          {h2s.length > 0 && (
            <div className="relative bg-gradient-to-br from-[#fff8f3] via-[#fff1e6] to-[#fde8d4]
              dark:from-[#1a0f06] dark:via-[#1c1108] dark:to-[#201407]
              border border-[#e8d4be] dark:border-[#2a1e10]
              rounded-[20px] p-6 mb-9
              shadow-[inset_0_1px_0_rgba(255,255,255,.6)] dark:shadow-none">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8d4b00] dark:text-[#e8903a] mb-5">
                What you will learn
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6">
                {h2s.map((h, i) => (
                  <div key={h} className="flex items-start gap-3">
                    <span className="text-[10px] font-black tabular-nums shrink-0 mt-[3px]
                      text-[#d97706] dark:text-[#e8903a] opacity-60 w-4 text-right leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] text-[#4a3628] dark:text-[#d9cfc4] leading-snug">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmark (top) */}
          <ChapterActions
            courseId={courseId} chapterId={chapterId}
            title={chapter.title} wordCount={wordCount}
            position="top"
          />

          {/* Content */}
          <div className="chapter-content mt-8" dangerouslySetInnerHTML={{ __html: chapter.content }} />

          {/* Completion */}
          <div className="mt-12 pt-8 border-t border-[#eedad0] dark:border-[#221e1a]">
            <p className="text-[10px] font-black text-[#b5a898] dark:text-[#4a3e35]
              uppercase tracking-[0.14em] mb-3">
              Finished reading?
            </p>
            <ChapterActions
              courseId={courseId} chapterId={chapterId}
              title={chapter.title} wordCount={wordCount}
              position="bottom"
            />
          </div>

        </div>
      </ReaderShell>
    </>
  );
}
