import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_URL } from '@utils/schema';

export async function GET(context: APIContext) {
  // Get all content
  const news = await getCollection('news');
  const events = await getCollection('events');
  const successStories = await getCollection('success-stories');

  // Combine all items with their categories and images
  const allItems = [
    ...news.map((item) => ({
      title: item.data.title,
      link: `/news/${item.id}`,
      description: item.data.excerpt || item.data.seo?.description || '',
      pubDate: item.data.pubDate,
      categories: ['News'],
      enclosure: item.data.imagePrimary
        ? {
            url: `${SITE_URL}/rss-images/news-${item.id}.jpg`,
            type: 'image/jpeg',
          }
        : undefined,
    })),
    ...events.map((item) => ({
      title: item.data.title,
      link: `/events/${item.id}`,
      description: item.data.description || `Event: ${item.data.title}`,
      pubDate: item.data.eventDate,
      categories: ['Events'],
      enclosure: item.data.imagePrimary
        ? {
            url: `${SITE_URL}/rss-images/event-${item.id}.jpg`,
            type: 'image/jpeg',
          }
        : undefined,
    })),
    ...successStories.map((item) => ({
      title: item.data.title,
      link: `/success-stories/${item.id}`,
      description: item.data.excerpt || '',
      pubDate: item.data.pubDate,
      categories: ['Success Stories'],
      enclosure: item.data.imagePrimary
        ? {
            url: `${SITE_URL}/rss-images/success-${item.id}.jpg`,
            type: 'image/jpeg',
          }
        : undefined,
    })),
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
