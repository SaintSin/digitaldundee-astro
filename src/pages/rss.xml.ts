import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_URL } from '@utils/schema';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Get all content
  const news = await getCollection('news');
  const events = await getCollection('events');
  const successStories = await getCollection('success-stories');

  // Combine all items with categories and images
  const newsItems = news
    .filter((item) => item.data.title && item.data.pubDate)
    .map((item) => ({
      title: item.data.title,
      link: `/news/${item.id}`,
      description:
        item.data.excerpt || item.data.seo?.description || item.data.title,
      pubDate: item.data.pubDate,
      categories: ['News'],
      customData: item.data.imagePrimary
        ? `<enclosure url="${SITE_URL}/rss-images/news-${item.id}.jpg" type="image/jpeg" />`
        : '',
    }));

  const eventItems = events
    .filter((item) => item.data.title && item.data.eventDate)
    .map((item) => ({
      title: item.data.title,
      link: `/events/${item.id}`,
      description: item.data.description || item.data.title,
      pubDate: item.data.eventDate,
      categories: ['Events'],
      customData: item.data.imagePrimary
        ? `<enclosure url="${SITE_URL}/rss-images/event-${item.id}.jpg" type="image/jpeg" />`
        : '',
    }));

  const storyItems = successStories
    .filter((item) => item.data.title && item.data.pubDate)
    .map((item) => ({
      title: item.data.title,
      link: `/success-stories/${item.id}`,
      description: item.data.excerpt || item.data.title,
      pubDate: item.data.pubDate,
      categories: ['Success Stories'],
      customData: item.data.imagePrimary
        ? `<enclosure url="${SITE_URL}/rss-images/success-${item.id}.jpg" type="image/jpeg" />`
        : '',
    }));

  const allItems = [...newsItems, ...eventItems, ...storyItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: 'Digital Dundee',
    description:
      'Latest news, events and success stories from Digital Dundee - the tech hub for Dundee and Tay Cities',
    site: context.site || SITE_URL,
    items: allItems,
    customData: '<language>en-gb</language>',
  });
}
