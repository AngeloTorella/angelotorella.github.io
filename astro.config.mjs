import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://angelotorella.github.io',
  output: 'static',
  integrations: [tailwind()],
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
