import type { Metadata } from 'next';
import './globals.css';
import { ProgressProvider } from '@/components/ProgressProvider';

export const metadata: Metadata = {
  title: 'The Engineering Codex',
  description: 'Deep-dive engineering courses built for builders who want to understand and operate production systems.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fff8f5] dark:bg-[#110e0b] text-[#231a13] dark:text-[#ede4da] antialiased">
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
