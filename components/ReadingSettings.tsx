'use client';
import { useState, useEffect, useRef } from 'react';

interface Prefs {
  size:       number; // px  14–24
  lineHeight: number; // 1.4–2.2
  weight:     number; // 300 | 400 | 500
}

const DEFAULTS: Prefs = { size: 18, lineHeight: 1.85, weight: 400 };

function apply(p: Prefs) {
  const r = document.documentElement;
  r.style.setProperty('--reading-size',   `${p.size}px`);
  r.style.setProperty('--reading-lh',     String(p.lineHeight));
  r.style.setProperty('--reading-weight', String(p.weight));
}

export default function ReadingSettings() {
  const [open,  setOpen]  = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load persisted prefs
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading-prefs');
      if (saved) {
        const p = { ...DEFAULTS, ...JSON.parse(saved) } as Prefs;
        setPrefs(p);
        apply(p);
      } else {
        apply(DEFAULTS);
      }
    } catch { apply(DEFAULTS); }
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function update(patch: Partial<Prefs>) {
    setPrefs(prev => {
      const next = { ...prev, ...patch };
      apply(next);
      localStorage.setItem('reading-prefs', JSON.stringify(next));
      return next;
    });
  }

  function reset() { update(DEFAULTS); }

  const weights = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
  ];

  return (
    <div ref={panelRef} className="fixed bottom-[76px] right-4 z-50">
      {/* Settings panel */}
      {open && (
        <div className="mb-2 w-64 rounded-2xl overflow-hidden
          bg-white/90 dark:bg-[#1c1813]/90
          backdrop-blur-xl
          border border-[#e7e5e4] dark:border-[#2f2923]
          shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#887364]">
              Reading
            </span>
            <button onClick={reset}
              className="text-[11px] font-semibold text-[#887364] hover:text-[#8d4b00] dark:hover:text-[#e8903a] transition-colors">
              Reset
            </button>
          </div>

          <div className="px-4 pb-4 space-y-5">

            {/* Font size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[12px] font-semibold text-[#231a13] dark:text-[#ede4da]">Font Size</span>
                <span className="text-[11px] font-mono text-[#887364]">{prefs.size}px</span>
              </div>
              <div className="relative">
                <input type="range"
                  min={14} max={24} step={1}
                  value={prefs.size}
                  onChange={e => update({ size: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                    bg-[#f2dfd3] dark:bg-[#26211c]
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#8d4b00]
                    [&::-webkit-slider-thumb]:dark:bg-[#e8903a]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-sm"/>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#b5a898]">A</span>
                  <span className="text-[13px] font-bold text-[#b5a898]">A</span>
                </div>
              </div>
            </div>

            {/* Line spacing */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[12px] font-semibold text-[#231a13] dark:text-[#ede4da]">Line Spacing</span>
                <span className="text-[11px] font-mono text-[#887364]">{prefs.lineHeight.toFixed(2)}</span>
              </div>
              <input type="range"
                min={1.4} max={2.2} step={0.05}
                value={prefs.lineHeight}
                onChange={e => update({ lineHeight: Number(e.target.value) })}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                  bg-[#f2dfd3] dark:bg-[#26211c]
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#8d4b00]
                  [&::-webkit-slider-thumb]:dark:bg-[#e8903a]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-sm"/>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#b5a898] leading-none">Compact</span>
                <span className="text-[10px] text-[#b5a898] leading-none">Spacious</span>
              </div>
            </div>

            {/* Font weight */}
            <div>
              <span className="text-[12px] font-semibold text-[#231a13] dark:text-[#ede4da] block mb-2">
                Font Weight
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {weights.map(w => (
                  <button key={w.value} onClick={() => update({ weight: w.value })}
                    className={`py-1.5 rounded-lg text-[12px] transition-all border
                      ${prefs.weight === w.value
                        ? 'bg-[#8d4b00] dark:bg-[#e8903a] text-white dark:text-[#110e0b] border-transparent font-semibold'
                        : 'bg-transparent border-[#e7e5e4] dark:border-[#2f2923] text-[#887364] hover:border-[#8d4b00] dark:hover:border-[#e8903a]'
                      }`}
                    style={{ fontWeight: w.value }}>
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)}
        aria-label="Reading settings"
        className={`w-10 h-10 rounded-full flex items-center justify-center
          text-[13px] font-black tracking-tight font-serif
          border shadow-sm transition-all
          ${open
            ? 'bg-[#8d4b00] dark:bg-[#e8903a] text-white dark:text-[#110e0b] border-transparent shadow-md'
            : 'bg-white/85 dark:bg-[#1c1813]/85 backdrop-blur-sm border-[#dbc2b0] dark:border-[#2f2923] text-[#554336] dark:text-[#a89888] hover:border-[#8d4b00] dark:hover:border-[#e8903a]'
          }`}>
        Aa
      </button>
    </div>
  );
}
