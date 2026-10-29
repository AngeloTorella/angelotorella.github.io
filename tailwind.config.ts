import type { Config } from 'tailwindcss';

// Semantic palette. Actual values live as CSS variables in src/styles/global.css
// (light by default, dark via prefers-color-scheme), so components never need `dark:` variants.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'), // page background
        sunken: token('sunken'), // alternate section background
        surface: token('surface'), // cards
        ink: token('ink'), // primary text
        muted: token('muted'), // secondary text
        line: token('line'), // borders
        brand: {
          DEFAULT: token('brand'),
          strong: token('brand-strong'),
          soft: token('brand-soft'),
        },
        'on-brand': token('on-brand'),
        accent: token('accent'),
        band: token('band'), // dark call-to-action band
        'band-fg': token('band-fg'),
      },
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(20 30 28 / 0.05), 0 8px 24px -12px rgb(20 30 28 / 0.12)',
        lift: '0 2px 4px rgb(20 30 28 / 0.06), 0 18px 36px -14px rgb(20 30 28 / 0.22)',
      },
    },
  },
  plugins: [],
} satisfies Config;
