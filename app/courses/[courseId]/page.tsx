import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { getCourse, getCourseIds, getChapters, getSchedule } from '@/lib/courses';
import type { ChapterData, ScheduleDay } from '@/types';

export async function generateStaticParams() {
  return getCourseIds().map(courseId => ({ courseId }));
}

interface Props { params: { courseId: string } }

export default function CoursePage({ params: { courseId } }: Props) {
  let course, chapters: ChapterData[], schedule: ScheduleDay[];
  try {
    course   = getCourse(courseId);
    chapters = getChapters(courseId);
    schedule = getSchedule(courseId);
  } catch {
    notFound();
  }

  return (
    <>
      <Header courseTitle={course.title} courseId={courseId} />
      <Sidebar courseId={courseId} chapters={chapters} currentChapter="" />

      <main className="lg:ml-64 pt-14 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Course header */}
          <div className="mb-8">
            <p className="text-[11px] font-black text-[#8d4b00] uppercase tracking-widest mb-1">
              {course.subtitle}
            </p>
            <h1 className="text-3xl font-black text-[#231a13] dark:text-[#ede4da] tracking-tight mb-2">
              {course.title}
            </h1>
            <p className="font-serif text-base text-[#554336] dark:text-[#a89888] max-w-xl leading-relaxed mb-4">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: 'schedule',           label: course.duration },
                { icon: 'layers',             label: `${course.chapters} chapters` },
                { icon: 'signal_cellular_alt',label: course.level },
              ].map(({ icon, label }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                    border border-[#dbc2b0] dark:border-[#2f2923]
                    bg-white dark:bg-[#1c1813]
                    text-[12px] font-semibold text-[#554336] dark:text-[#a89888]">
                  <span className="material-symbols-outlined text-[#8d4b00] dark:text-[#e8903a]"
                    style={{ fontSize: 12 }}>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Day cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {schedule.map(day => {
              const dayChaps = day.chapterIds
                .map(id => chapters.find(c => c.id === id))
                .filter((c): c is ChapterData => !!c);
              if (!dayChaps.length) return null;

              const totalHrs = dayChaps.reduce((acc, c) => {
                const m = c.time.match(/[\d.]+/);
                return acc + (m ? parseFloat(m[0]) : 0);
              }, 0);

              return (
                <Link key={day.day} href={`/courses/${courseId}/chapters/${dayChaps[0].id}`}
                  className="group relative bg-white dark:bg-[#110e0b]
                    border border-[#e7e5e4] dark:border-[#221e1a] rounded-2xl overflow-hidden
                    hover:shadow-[0_6px_20px_rgba(141,75,0,.1)] hover:-translate-y-0.5
                    transition-all duration-150 block">

                  {/* Color bar */}
                  <div className="h-0.5" style={{ background: day.color }} />

                  <div className="p-5">
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1"
                      style={{ color: day.color }}>
                      Day {day.day}
                    </p>
                    <h3 className="text-[15px] font-bold text-[#231a13] dark:text-[#ede4da] mb-3 leading-snug">
                      {day.title}
                    </h3>
                    <div className="space-y-1.5 mb-4">
                      {dayChaps.map(ch => (
                        <div key={ch.id} className="flex items-center gap-2 text-[13px] text-[#554336] dark:text-[#a89888]">
                          <span className="material-symbols-outlined text-[#dbc2b0]" style={{ fontSize: 13 }}>
                            radio_button_unchecked
                          </span>
                          {ch.shortTitle}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-[#f2dfd3] dark:border-[#2f2923]">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#887364]">
                        <span className="material-symbols-outlined" style={{ fontSize: 11 }}>schedule</span>
                        ~{totalHrs}h
                      </span>
                      <span className="text-[11px] font-semibold text-[#887364]">
                        {dayChaps.length} {dayChaps.length === 1 ? 'chapter' : 'chapters'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
