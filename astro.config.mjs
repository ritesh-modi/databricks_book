import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Primary canonical domain. Other domains the author owns (azureblueprints.com,
// velocityengineer.com, armtemplate.com, azurebluprint.com, zerosnone.com,
// onenzeros.com, hyper-coding.com, loopingly.com) should 301-redirect to this one
// at the host platform (Vercel/Netlify) — never serve as an alternate canonical.
export default defineConfig({
  site: 'https://genaiblueprints.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
