// utils/schema.ts
import { getSocialLinksForJsonLd, siteMetadata } from '@config/siteMetadata';
import type { BreadcrumbList, GovernmentOrganization, ListItem } from '@types';

export const SITE_URL = siteMetadata.siteUrl;

export const digitalDundeeOrganization: GovernmentOrganization = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  '@id': '468593356',
  name: siteMetadata.name,
  description: siteMetadata.description,
  url: SITE_URL,
  telephone: siteMetadata.phone,
  email: siteMetadata.contactEmail,
  address: siteMetadata.address
    ? {
        '@type': 'PostalAddress',
        streetAddress: siteMetadata.address.street,
        addressLocality: siteMetadata.address.locality,
        postalCode: siteMetadata.address.postalCode,
        addressCountry: siteMetadata.address.country,
      }
    : undefined,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteMetadata.phone,
    email: siteMetadata.contactEmail,
    url: SITE_URL,
    areaServed: {
      '@type': 'City',
      name: 'Dundee',
      url: 'https://www.dundeecity.gov.uk',
    },
  },
  sameAs: getSocialLinksForJsonLd(),
};

/**
 * Generate breadcrumb schema from pathname
 * @param pathname - Current page pathname (e.g., '/news/article-slug')
 * @param customLabels - Optional custom labels for path segments
 * @returns BreadcrumbList schema
 */
export function generateBreadcrumbs(
  pathname: string,
  customLabels?: Record<string, string>,
): BreadcrumbList {
  const segments = pathname.split('/').filter((segment) => segment !== '');

  const items: ListItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];

  segments.forEach((segment, index) => {
    // Skip numeric segments (like page numbers or IDs) unless custom labeled
    if (!customLabels?.[segment] && /^\d+$/.test(segment)) {
      return;
    }

    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const label =
      customLabels?.[segment] ||
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: label,
      item: `${SITE_URL}${path}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Common label mappings for breadcrumbs
 */
export const BREADCRUMB_LABELS: Record<string, string> = {
  'meet-companies': 'Companies',
  'success-stories': 'Success Stories',
  'be-dundee': 'Be Dundee',
  tay5g: 'Tay5G',
  news: 'News',
  'news-archive': 'News Archive',
  events: 'Events',
  resources: 'Resources',
  about: 'About',
  contact: 'Contact',
};
