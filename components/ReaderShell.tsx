'use client';
import { useProgress } from './ProgressProvider';

export default function ReaderShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useProgress();
  return (
    <main
      className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} pt-14 pb-24 min-h-screen transition-[margin-left] duration-300 ease-in-out`}
    >
      {children}
    </main>
  );
}
