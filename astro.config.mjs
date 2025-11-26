// @ts-check

import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  experimental: {
    svgo: true,
  },

  image: {
    responsiveStyles: true,
  },

  integrations: [sitemap(), icon(), mdx(), partytown()],
  site: 'https://digitaldundee.netlify.app',
  adapter: netlify(),
});
