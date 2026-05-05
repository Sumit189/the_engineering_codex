import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#8d4b00',
        amber:     '#d97706',
        surface:   '#fff8f5',
        'surface-dim': '#e9d7cb',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
    },
  },
};

export default config;
