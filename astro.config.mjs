import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Primary canonical domain. Other domains the author owns (azureblueprints.com,
// velocityengineer.com, armtemplate.com, azurebluprint.com, zerosnone.com,
// onenzeros.com, hyper-coding.com, loopingly.com) should 301-redirect to this one
// at the host platform (Vercel/Netlify/Azure) — never serve as alternate canonicals.
export default defineConfig({
  site: 'https://genaiblueprints.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Tune crawl signals per route family. Higher priority + faster
      // changefreq = stronger crawl-budget hint.
      serialize(item) {
        const url = new URL(item.url);
        const p = url.pathname;

        if (p === '/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (p === '/buy/') {
          item.priority = 0.95;
          item.changefreq = 'monthly';
        } else if (p.startsWith('/topics/') && p !== '/topics/') {
          // Individual topic pillar pages — the SEO workhorse.
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (p === '/topics/') {
          item.priority = 0.85;
          item.changefreq = 'monthly';
        } else if (p === '/preview/' || p === '/faq/' || p === '/about/' || p === '/reviews/') {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (p.startsWith('/blog/') && p !== '/blog/') {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (p === '/blog/') {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
