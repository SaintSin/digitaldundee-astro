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
const resources = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx,mdoc}',
    base: 'src/content/resources',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      resourceUrl: z.string(),

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
const companies = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx,mdoc}',
    base: 'src/content/companies',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      companyUrl: z.string().url().optional(),
      logo: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      sector: z.array(z.string()),
      serviceArea: z.array(z.string()).optional(),
    }),
});
const events = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx,mdoc}',
    base: 'src/content/events',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      eventDate: z.coerce.date(),
      eventEndDate: z.coerce.date().optional(),
      eventStartTime: z.string().optional(),
      eventEndTime: z.string().optional(),
      location: z.string().optional(),
      eventUrl: z.string().url().optional(),
      seo: z.object({
        title: z.string(),
        description: z.string(),
        ogImage: z.string().optional(),
      }),
      imagePrimary: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
    }),
});

export const collections = { news, companies, events, resources };
