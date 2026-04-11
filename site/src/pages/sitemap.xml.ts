import type { APIRoute } from 'astro';

const pages = [
  { url: '/', priority: '1.0' },
  { url: '/catalog', priority: '0.9' },
  { url: '/about', priority: '0.7' },
  { url: '/reviews', priority: '0.7' },
];

const lastmod = new Date().toISOString().split('T')[0];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ? site.toString().replace(/\/$/, '') : 'https://spektor-v.ru';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
