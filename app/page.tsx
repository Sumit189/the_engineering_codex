import Link from 'next/link';
import Header from '@/components/Header';
import ReadTime from '@/components/ReadTime';
import { getAllCourses, getCourseIds, getChapters } from '@/lib/courses';
import { countWords } from '@/lib/readingTime';

export default function LandingPage() {
  const courses = getAllCourses();

  // Compute total word count per course at build time
  const wordCounts: Record<string, number> = {};
  for (const id of getCourseIds()) {
    try {
      wordCounts[id] = getChapters(id).reduce((sum, ch) => sum + countWords(ch.content), 0);
    } catch { wordCounts[id] = 0; }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(141,75,0,.06) 0%, transparent 70%)' }}>
          <p className="text-[11px] font-black text-[#8d4b00] uppercase tracking-widest mb-4">
            The Engineering Codex
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#231a13] dark:text-white
            leading-[1.08] tracking-tight mb-5">
            Engineering courses<br />built for builders.
          </h1>
          <p className="font-serif text-lg text-[#554336] dark:text-[#a89888]
            max-w-xl leading-relaxed mb-10">
            Structured, deep-dive curricula for engineers who want to understand
            and operate production AI systems — not just use them.
          </p>
          <div className="flex flex-wrap gap-2 mb-16">
            {[
              { icon: 'bolt',        label: 'Hands-on code' },
              { icon: 'verified',    label: 'Production-focused' },
              { icon: 'trending_up', label: 'Beginner to advanced' },
            ].map(({ icon, label }) => (
              <span key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  border border-[#dbc2b0] dark:border-[#2f2923]
                  bg-white dark:bg-[#1c1813]
                  text-[12px] font-semibold text-[#554336] dark:text-[#a89888]">
                <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                  style={{ fontSize: 13 }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>

          {/* Courses */}
          <p className="text-[11px] font-black text-[#887364] uppercase tracking-widest mb-4">
            Available Courses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map(course => (
              <Link key={course.id} href={`/courses/${course.id}`}
                className="group relative bg-white dark:bg-[#110e0b]
                  border border-[#e7e5e4] dark:border-[#221e1a] rounded-2xl overflow-hidden
                  hover:shadow-[0_10px_32px_rgba(141,75,0,.12)] dark:hover:shadow-[0_10px_32px_rgba(0,0,0,.4)]
                  hover:-translate-y-1 transition-all duration-200
                  flex flex-col">

                {course.coverImage ? (
                  <div className="relative h-32 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.coverImage} alt={course.title}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.45) 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: course.color }} />
                  </div>
                ) : (
                  <div className="h-1" style={{ background: course.color }} />
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[11px] font-bold text-[#887364] uppercase tracking-widest mb-1">
                    {course.subtitle}
                  </div>
                  <h2 className="text-xl font-black text-[#231a13] dark:text-[#ede4da]
                    tracking-tight mb-2 group-hover:text-[#8d4b00] transition-colors">
                    {course.title}
                  </h2>
                  <p className="font-serif text-[15px] text-[#554336] dark:text-[#a89888]
                    leading-relaxed mb-4 flex-1">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {course.tags.slice(0, 5).map(tag => (
                      <span key={tag}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full
                          bg-[#f2dfd3] dark:bg-[#1c1813]
                          text-[#554336] dark:text-[#a89888]
                          border border-[#dbc2b0] dark:border-[#2f2923]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-[#f2dfd3] dark:border-[#221e1a]
                    text-[11px] font-semibold text-[#887364] dark:text-[#a89888]">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                        style={{ fontSize: 12 }}>schedule</span>
                      <ReadTime wordCount={wordCounts[course.id] ?? 0} />
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                        style={{ fontSize: 12 }}>layers</span>
                      {course.chapters} chapters
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                        style={{ fontSize: 12 }}>calendar_today</span>
                      {course.days} days
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                        style={{ fontSize: 12 }}>signal_cellular_alt</span>
                      {course.level}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
