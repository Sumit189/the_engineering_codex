'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Bookmark } from '@/types';

interface ProgressCtx {
  completed:    Set<string>;
  bookmarks:    Bookmark[];
  isCompleted:  (courseId: string, chapterId: string) => boolean;
  isBookmarked: (courseId: string, chapterId: string) => boolean;
  toggle:       (courseId: string, chapterId: string) => void;
  addBookmark:  (courseId: string, chapterId: string, title: string) => void;
  removeBookmark:(courseId: string, chapterId: string) => void;
}

const Ctx = createContext<ProgressCtx | null>(null);

const key = (c: string, ch: string) => `${c}::${ch}`;

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem('aibook_completed');
      const b = localStorage.getItem('aibook_bookmarks');
      if (c) setCompleted(new Set(JSON.parse(c)));
      if (b) setBookmarks(JSON.parse(b));
    } catch {}
  }, []);

  const persist = useCallback((c: Set<string>, b: Bookmark[]) => {
    localStorage.setItem('aibook_completed', JSON.stringify([...c]));
    localStorage.setItem('aibook_bookmarks', JSON.stringify(b));
  }, []);

  const isCompleted  = (cId: string, ch: string) => completed.has(key(cId, ch));
  const isBookmarked = (cId: string, ch: string) => bookmarks.some(b => b.courseId === cId && b.chapterId === ch);

  const toggle = useCallback((courseId: string, chapterId: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      const k = key(courseId, chapterId);
      next.has(k) ? next.delete(k) : next.add(k);
      persist(next, bookmarks);
      return next;
    });
  }, [bookmarks, persist]);

  const addBookmark = useCallback((courseId: string, chapterId: string, title: string) => {
    setBookmarks(prev => {
      const next = [...prev.filter(b => !(b.courseId === courseId && b.chapterId === chapterId)), { courseId, chapterId, title }];
      persist(completed, next);
      return next;
    });
  }, [completed, persist]);

  const removeBookmark = useCallback((courseId: string, chapterId: string) => {
    setBookmarks(prev => {
      const next = prev.filter(b => !(b.courseId === courseId && b.chapterId === chapterId));
      persist(completed, next);
      return next;
    });
  }, [completed, persist]);

  return (
    <Ctx.Provider value={{ completed, bookmarks, isCompleted, isBookmarked, toggle, addBookmark, removeBookmark }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider');
  return ctx;
}
