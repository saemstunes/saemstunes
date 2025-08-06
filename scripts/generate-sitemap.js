// Simple script to generate and update sitemap.xml
// Run with: node scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Configuration
const BASE_URL = 'https://saemstunes.com'; // Updated to match your domain
const PUBLIC_DIR = path.join(__dirname, '../public');
const now = format(new Date(), 'yyyy-MM-dd');

// Static routes with priorities and change frequency
const staticRoutes = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/discover', priority: 0.9, changefreq: 'daily' },
  { loc: '/tracks', priority: 0.9, changefreq: 'weekly' },
  { loc: '/artists', priority: 0.9, changefreq: 'weekly' },
  { loc: '/videos', priority: 0.9, changefreq: 'daily' },
  { loc: '/resources', priority: 0.9, changefreq: 'weekly' },
  { loc: '/learning-hub', priority: 0.9, changefreq: 'weekly' },
  { loc: '/community', priority: 0.8, changefreq: 'daily' },
  { loc: '/library', priority: 0.9, changefreq: 'daily' },
  { loc: '/player', priority: 0.7, changefreq: 'weekly' },
  { loc: '/music-tools', priority: 0.8, changefreq: 'weekly' },
  { loc: '/services', priority: 0.7, changefreq: 'monthly' },
  { loc: '/coming-soon', priority: 0.5, changefreq: 'monthly' },
  { loc: '/contact-us', priority: 0.6, changefreq: 'monthly' },
  { loc: '/support-us', priority: 0.6, changefreq: 'monthly' },
  { loc: '/follow-us', priority: 0.5, changefreq: 'monthly' },
  { loc: '/subscriptions', priority: 0.7, changefreq: 'monthly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { loc: '/terms', priority: 0.3, changefreq: 'yearly' }
];

// Example dynamic routes - in a real application, you would generate these from your database
// You can replace this with a database query or API call to get dynamic content
const dynamicRoutes = [
  // Artist profiles
  { loc: '/artist/kendi-nkonge', priority: 0.8, changefreq: 'weekly' },
  
  // Video content
  { loc: '/videos/songwriting', priority: 0.8, changefreq: 'weekly' },
  { loc: '/videos/beginner-piano-course', priority: 0.8, changefreq: 'weekly' },
  { loc: '/videos/vocal-warm-ups', priority: 0.8, changefreq: 'weekly' },
  
  // Resources
  { loc: '/resources/i2', priority: 0.8, changefreq: 'weekly' },
  { loc: '/resources/i1', priority: 0.7, changefreq: 'monthly' },
  
  // Learning modules
  { loc: '/learning-hub/piano-fundamentals', priority: 0.8, changefreq: 'weekly' }
];

// Combine all routes
const allRoutes = [
  ...staticRoutes,
  ...dynamicRoutes
].map(route => ({
  ...route,
  lastmod: now,
  loc: `${BASE_URL}${route.loc}`
}));

// Generate XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

// Write to file
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully at public/sitemap.xml');
console.log(`Generated ${allRoutes.length} URLs in sitemap`);

// Optional: Submit sitemap to search engines
// In a real application, you would use a library like 'node-fetch' to make these requests
console.log(`\nTo submit your sitemap to search engines, run the following commands:`);
console.log(`curl -X GET "https://www.google.com/ping?sitemap=${BASE_URL}/sitemap.xml"`);
console.log(`curl -X GET "https://www.bing.com/ping?sitemap=${BASE_URL}/sitemap.xml"`);

// Optional: Log summary of routes by priority
console.log(`\nSitemap Summary:`);
console.log(`High Priority (0.9-1.0): ${allRoutes.filter(r => r.priority >= 0.9).length} URLs`);
console.log(`Medium Priority (0.7-0.8): ${allRoutes.filter(r => r.priority >= 0.7 && r.priority < 0.9).length} URLs`);
console.log(`Lower Priority (0.3-0.6): ${allRoutes.filter(r => r.priority >= 0.3 && r.priority < 0.7).length} URLs`);
