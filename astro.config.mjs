// @ts-check

import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: {
    svgo: true,
  },

  image: {
    responsiveStyles: true,
  },

  integrations: [sitemap(), icon(), mdx(), partytown(), robotsTxt()],
  site: 'https://digitaldundee.netlify.app',
  adapter: netlify(),
});
