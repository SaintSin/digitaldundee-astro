import type { CollectionEntry } from 'astro:content';

/**
 * Groups news articles by year and month
 * Returns a Map with YYYYMM keys and arrays of articles
 */
export function groupNewsByMonth(
  news: CollectionEntry<'news'>[],
): Map<string, CollectionEntry<'news'>[]> {
  const archiveMap = new Map<string, CollectionEntry<'news'>[]>();

  news.forEach((article) => {
    const date = article.data.pubDate;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`; // e.g., "202507"

    if (!archiveMap.has(yearMonth)) {
      archiveMap.set(yearMonth, []);
    }
    archiveMap.get(yearMonth)!.push(article);
  });

  return archiveMap;
}

/**
 * Formats YYYYMM to "Month YYYY" (e.g., "202507" -> "July 2025")
 */
export function formatArchiveDate(yearMonth: string): string {
  const year = yearMonth.substring(0, 4);
  const month = yearMonth.substring(4, 6);

  const date = new Date(`${year}-${month}-01`);
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Gets archive entries sorted by date descending
 * Returns array of [yearMonth, articles, count, label]
 */
export function getArchiveEntries(news: CollectionEntry<'news'>[]) {
  const archiveMap = groupNewsByMonth(news);

  return Array.from(archiveMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // Sort descending
    .map(([yearMonth, articles]) => ({
      yearMonth,
      articles,
      count: articles.length,
      label: formatArchiveDate(yearMonth),
    }));
}
