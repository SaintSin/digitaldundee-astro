import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx,mdoc}', base: 'src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      excerpt: z.string(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
        ogImage: z.string().optional(),
      }),
      imagePrimary: z.object({
        src: image(),
        alt: z.string(),
      }),
    }),
});

export const collections = { news };
