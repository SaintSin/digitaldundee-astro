// @ts-check

import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import { defineConfig, svgoOptimizer } from 'astro/config';
import icon from 'astro-icon';
import llmsTxt from 'astro-llms-md';

import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },

  image: {
    responsiveStyles: true,
  },

  integrations: [
    sitemap(),
    icon(),
    mdx(),
    llmsTxt({
      name: 'Digital Dundee',
      description:
        'Digital Dundee is a portal for people and businesses in digital, creative and tech in Dundee and the wider Tay Cities region.',
      excludeSelectors: ['aside', 'form', '[data-llms-ignore]'],
      // Paginated listing pages (/news/2 etc.) just repeat the index
      exclude: [
        'events/[0-9]*/**',
        'news/[0-9]*/**',
        'resources/[0-9]*/**',
        'meet-companies/[0-9]*/**',
      ],
    }),
    robotsTxt(),
  ],
  site: 'https://digitaldundee.netlify.app',
  adapter: netlify(),
});
