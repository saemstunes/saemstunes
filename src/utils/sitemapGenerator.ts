
import { format } from 'date-fns';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

// Static routes with their priorities
const staticRoutes: SitemapUrl[] = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/discover', priority: 0.9, changefreq: 'daily' },
  { loc: '/videos', priority: 0.9, changefreq: 'daily' },
  { loc: '/resources', priority: 0.9, changefreq: 'weekly' },
  { loc: '/learning-hub', priority: 0.9, changefreq: 'weekly' },
  { loc: '/community', priority: 0.8, changefreq: 'daily' },
  { loc: '/library', priority: 0.8, changefreq: 'daily' },
  { loc: '/music-tools', priority: 0.8, changefreq: 'weekly' },
  { loc: '/services', priority: 0.7, changefreq: 'monthly' },
  { loc: '/contact-us', priority: 0.6, changefreq: 'monthly' },
  { loc: '/support-us', priority: 0.6, changefreq: 'monthly' },
  { loc: '/follow-us', priority: 0.5, changefreq: 'monthly' },
  { loc: '/subscriptions', priority: 0.7, changefreq: 'monthly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/terms', priority: 0.3, changefreq: 'yearly' }
];

export const generateSitemap = (baseUrl: string = 'https://saemstunes.app'): string => {
  const now = format(new Date(), 'yyyy-MM-dd');
  
  const urls = staticRoutes.map(route => ({
    ...route,
    lastmod: route.lastmod || now,
    loc: `${baseUrl}${route.loc}`
  }));

  // Add dynamic routes (these would typically come from your database)
  // For now, adding some example dynamic routes
  const dynamicRoutes = [
    { loc: `${baseUrl}/videos/beginner-piano-course`, priority: 0.8, changefreq: 'weekly' as const },
    { loc: `${baseUrl}/videos/vocal-warm-ups`, priority: 0.8, changefreq: 'weekly' as const },
    { loc: `${baseUrl}/resources/music-theory-basics`, priority: 0.7, changefreq: 'monthly' as const },
    { loc: `${baseUrl}/learning-hub/piano-fundamentals`, priority: 0.8, changefreq: 'weekly' as const }
  ];

  urls.push(...dynamicRoutes.map(route => ({ ...route, lastmod: now })));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const submitSitemapToSearchEngines = async (sitemapUrl: string) => {
  try {
    // Google
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    // Bing
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log('Sitemap submitted to search engines');
  } catch (error) {
    console.error('Error submitting sitemap:', error);
  }
};
