import type { APIRoute } from 'astro';
import { getServices } from '@lib/content';
import { langs, routePath, type Route } from '@/i18n/utils';

export const GET: APIRoute = async ({ site }) => {
  // Service slugs are identical in every language, so the Spanish list drives both.
  const services = await getServices('es');
  const routes: Route[] = [
    { name: 'home' },
    { name: 'contact' },
    ...services.map(({ slug }): Route => ({ name: 'service', slug })),
  ];
  const abs = (path: string) => new URL(path, site).toString();
  const urls = routes
    .flatMap((route) =>
      langs.map((lang) => {
        const alternates = langs
          .map((alt) => `\n    <xhtml:link rel="alternate" hreflang="${alt}" href="${abs(routePath(route, alt))}"/>`)
          .join('');
        return `  <url>\n    <loc>${abs(routePath(route, lang))}</loc>${alternates}\n  </url>`;
      }),
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
