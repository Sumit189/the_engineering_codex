'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Decorates `.further-reading` links with a domain favicon and pulls the
 * sibling `.src` span inside the `<a>` so the row can lay out as a single
 * flex line: [favicon] [title] [domain] [↗].
 */
export default function FaviconEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const lis = document.querySelectorAll<HTMLLIElement>('.further-reading li');
    lis.forEach(li => {
      if (li.querySelector('.fr-favicon')) return; // already enhanced
      const link = li.querySelector<HTMLAnchorElement>('a[href]');
      if (!link) return;

      let host: string;
      try {
        host = new URL(link.href).hostname;
      } catch {
        return;
      }

      const img = document.createElement('img');
      img.className = 'fr-favicon';
      img.src = `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
      img.alt = '';
      img.width = 20;
      img.height = 20;
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.onerror = () => { img.style.visibility = 'hidden'; };
      link.prepend(img);

      // Move the sibling .src inside the link so the row lays out cleanly
      const src = li.querySelector<HTMLSpanElement>(':scope > .src');
      if (src) link.append(src);
    });
  }, [pathname]);

  return null;
}
