/**
 * Pagination utility for content collections
 *
 * This utility provides helper functions for creating paginated routes
 * for any Astro content collection.
 */

/**
 * Default items per page
 */
export const DEFAULT_PAGE_SIZE = 12;

/**
 * Sort items by date in descending order (newest first)
 */
export function sortByDateDesc<T extends { data: { pubDate: Date } }>(
  items: T[],
): T[] {
  return items.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

/**
 * Sort items by date in ascending order (oldest first)
 */
export function sortByDateAsc<T extends { data: { pubDate: Date } }>(
  items: T[],
): T[] {
  return items.sort(
    (a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime(),
  );
}

/**
 * Sort items by title alphabetically
 */
export function sortByTitle<T extends { data: { title: string } }>(
  items: T[],
): T[] {
  return items.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

/**
 * Generate metadata for paginated pages
 */
export function getPaginatedMeta(
  baseTitle: string,
  baseDescription: string,
  currentPage: number,
  ogImage = 'generic-social-1200x630.png',
  ogAlt = 'Digital Dundee',
) {
  return {
    title: currentPage === 1 ? baseTitle : `${baseTitle} - Page ${currentPage}`,
    description: baseDescription,
    imageOG: ogImage,
    altOG: ogAlt,
  };
}
