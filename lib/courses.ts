import fs from 'fs';
import path from 'path';
import type { CourseData, ChapterData, ScheduleDay } from '@/types';

const root = path.join(process.cwd(), 'courses');

function read<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(root, ...parts), 'utf8')) as T;
}

export function getCourseIds(): string[] {
  return read<string[]>('index.json');
}

export function getCourse(courseId: string): CourseData {
  return read<CourseData>(courseId, 'course.json');
}

export function getAllCourses(): CourseData[] {
  return getCourseIds().map(getCourse);
}

export function getChapterFolders(courseId: string): string[] {
  return read<string[]>(courseId, 'chapters', 'index.json');
}

export function getSchedule(courseId: string): ScheduleDay[] {
  return read<ScheduleDay[]>(courseId, 'chapters', 'schedule.json');
}

export function getChapters(courseId: string): ChapterData[] {
  return getChapterFolders(courseId).map(folder =>
    read<ChapterData>(courseId, 'chapters', folder, 'chapter.json')
  );
}

export function getChapter(courseId: string, chapterId: string): ChapterData {
  const ch = getChapters(courseId).find(c => c.id === chapterId);
  if (!ch) throw new Error(`Chapter not found: ${chapterId}`);
  return ch;
}
