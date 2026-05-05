import Header from '@/components/Header';
import CourseGrid from '@/components/CourseGrid';
import HeroTerminal, { type TerminalStats } from '@/components/HeroTerminal';
import { getAllCourses, getCourseIds, getChapters, getDomains } from '@/lib/courses';
import { countWords } from '@/lib/readingTime';

const READING_WPM = 200;

export default function LandingPage() {
  const courses = getAllCourses();
  const domains = getDomains();

  // Compute per-course stats at build time
  const wordCounts: Record<string, number> = {};
  let totalChapters = 0;
  let totalWords    = 0;
  let totalSvgs     = 0;

  const perCourse = courses.map(course => {
    let chapters: ReturnType<typeof getChapters>;
    try { chapters = getChapters(course.id); } catch { chapters = []; }
    const words = chapters.reduce((s, ch) => s + countWords(ch.content), 0);
    const svgs  = chapters.reduce((s, ch) => s + (ch.content.match(/svg-anim/g)?.length ?? 0), 0);
    wordCounts[course.id] = words;
    totalChapters += chapters.length;
    totalWords    += words;
    totalSvgs     += svgs;
    return {
      id:       course.id,
      domain:   course.domain ?? 'unknown',
      title:    course.title,
      chapters: chapters.length,
      svgs,
    };
  });

  const totalHours = Math.max(1, Math.round(totalWords / READING_WPM / 60));

  const stats: TerminalStats = {
    domainCount:   domains.length,
    courseCount:   courses.length,
    chapterCount:  totalChapters,
    wordCount:     totalWords,
    svgCount:      totalSvgs,
    hours:         totalHours,
    domains:       domains.map(d => ({ id: d.id, label: d.label })),
    courses:       perCourse,
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        {/* Hero */}
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(141,75,0,.06) 0%, transparent 70%)' }}>
          <HeroTerminal stats={stats} />

          <div className="relative z-10 lg:max-w-[58%]">
            <p className="text-[11px] font-black text-[#8d4b00] uppercase tracking-widest mb-4">
              The Engineering Codex
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#231a13] dark:text-white
              leading-[1.08] tracking-tight mb-5">
              Engineering courses<br />built for builders.
            </h1>
            <p className="font-serif text-lg text-[#554336] dark:text-[#8d93a3]
              max-w-xl leading-relaxed mb-10">
              Structured, deep-dive curricula for engineers who want to understand
              and operate production AI systems — not just use them.
            </p>
          </div>
          <div className="mb-16" />

          {/* Courses */}
          <p className="text-[11px] font-black text-[#887364] uppercase tracking-widest mb-4">
            Available Courses
          </p>
          <CourseGrid courses={courses} domains={domains} wordCounts={wordCounts} />
        </div>
      </main>
    </>
  );
}
