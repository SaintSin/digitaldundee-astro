// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Open Sans',
        cssVariable: '--font-opensans',
      },
      {
        provider: fontProviders.google(),
        name: 'Montserrat',
        cssVariable: '--font-montserrat',
        weights: ['100 900'],
      },
    ],
  },
  image: {
    responsiveStyles: true,
  },
  integrations: [sitemap(), icon(), mdx()],
  site: 'https://localhost/',
});
