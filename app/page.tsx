import Header from '@/components/Header';
import CourseGrid from '@/components/CourseGrid';
import { getAllCourses, getCourseIds, getChapters, getDomains } from '@/lib/courses';
import { countWords } from '@/lib/readingTime';

export default function LandingPage() {
  const courses = getAllCourses();
  const domains = getDomains();

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
          <p className="font-serif text-lg text-[#554336] dark:text-[#8d93a3]
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
                  border border-[#dbc2b0] dark:border-[#363c48]
                  bg-white dark:bg-[#1a1c22]
                  text-[12px] font-semibold text-[#554336] dark:text-[#8d93a3]">
                <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#fbbf24]"
                  style={{ fontSize: 13 }}>{icon}</span>
                {label}
              </span>
            ))}
          </div>

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
