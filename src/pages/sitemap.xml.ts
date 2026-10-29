import type { APIRoute } from 'astro';
import { getServices } from '@lib/content';

export const GET: APIRoute = async ({ site }) => {
  const services = await getServices();
  const paths = ['/', '/contacto/',...services.map(({ id }) => `/services/${id}/`)];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site)}</loc></url>`).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
