import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_URL } from '@utils/schema';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Get all content
  const news = await getCollection('news');
  const events = await getCollection('events');
  const successStories = await getCollection('success-stories');

  // Combine all items with their categories and images
  const allItems = [
    ...news
      .filter((item) => item.data.title && item.data.pubDate)
      .map((item) => {
        const description =
          item.data.excerpt || item.data.seo?.description || item.data.title;

        const baseItem = {
          title: String(item.data.title),
          link: `/news/${item.id}`,
          description: String(description),
          pubDate: new Date(item.data.pubDate),
          categories: ['News'],
        };

        if (item.data.imagePrimary) {
          return {
            ...baseItem,
            enclosure: {
              url: `${SITE_URL}/rss-images/news-${item.id}.jpg`,
              type: 'image/jpeg',
            },
          };
        }

        return baseItem;
      }),
    ...events
      .filter((item) => item.data.title && item.data.eventDate)
      .map((item) => {
        const description = item.data.description || item.data.title;

        const baseItem = {
          title: String(item.data.title),
          link: `/events/${item.id}`,
          description: String(description),
          pubDate: new Date(item.data.eventDate),
          categories: ['Events'],
        };

        if (item.data.imagePrimary) {
          return {
            ...baseItem,
            enclosure: {
              url: `${SITE_URL}/rss-images/event-${item.id}.jpg`,
              type: 'image/jpeg',
            },
          };
        }

        return baseItem;
      }),
    ...successStories
      .filter((item) => item.data.title && item.data.pubDate)
      .map((item) => {
        const description = item.data.excerpt || item.data.title;

        const baseItem = {
          title: String(item.data.title),
          link: `/success-stories/${item.id}`,
          description: String(description),
          pubDate: new Date(item.data.pubDate),
          categories: ['Success Stories'],
        };

        if (item.data.imagePrimary) {
          return {
            ...baseItem,
            enclosure: {
              url: `${SITE_URL}/rss-images/success-${item.id}.jpg`,
              type: 'image/jpeg',
            },
          };
        }

        return baseItem;
      }),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Digital Dundee',
    description:
      'Latest news, events and success stories from Digital Dundee - the tech hub for Dundee and Tay Cities',
    site: SITE_URL,
    items: allItems,
    customData: '<language>en-gb</language>',
  });
}
