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
  compressHTML: false, // the compressor drops the space between text and a following link

  // Live-site URLs that moved or were renamed here
  redirects: {
    '/innovate/about-tay5g': '/tay5g/about-tay5g',
    '/innovate/tay5g-news': '/tay5g/tay5g-news',
    '/be-dundee/get-service': '/be-dundee/get-services',
    '/contact-us': '/contact',
    '/privacy': '/privacy-policy',
  },
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
      // llms-full.txt would be ~600KB; llms.txt plus per-page .md is enough
      generateLlmsFullTxt: false,
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
    robotsTxt({
      policy: [
        { userAgent: '*', allow: '/' },
        // AI search and assistant crawlers are welcome: they send referrals
        { userAgent: 'GPTBot', allow: '/' },
        { userAgent: 'ChatGPT-User', allow: '/' },
        { userAgent: 'OAI-SearchBot', allow: '/' },
        { userAgent: 'ClaudeBot', allow: '/' },
        { userAgent: 'Claude-User', allow: '/' },
        { userAgent: 'Claude-SearchBot', allow: '/' },
        { userAgent: 'anthropic-ai', allow: '/' }, // deprecated, kept for backward compatibility
        { userAgent: 'Google-Extended', allow: '/' },
        { userAgent: 'PerplexityBot', allow: '/' },
        { userAgent: 'Applebot-Extended', allow: '/' },
        { userAgent: 'meta-externalagent', allow: '/' },
        { userAgent: 'Amazonbot', allow: '/' },
        { userAgent: 'DuckAssistBot', allow: '/' },
        { userAgent: 'MistralAI-User', allow: '/' },
        { userAgent: 'Cohere-AI', allow: '/' },
        { userAgent: 'Bytespider', disallow: '/' },
      ],
    }),
  ],
  site: 'https://digitaldundee.netlify.app',
  adapter: netlify(),
});
