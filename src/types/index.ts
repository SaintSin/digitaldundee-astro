// types/index.ts

/**
 * Metadata for page SEO and social sharing
 * Used by BaseLayout and Basehead components
 */
export interface MetaData {
  /** Page title - appears in browser tab and search results */
  title: string;
  /** Page description - used for SEO and social media previews */
  description: string;
  /** Open Graph image filename (stored in /public/images/social/) */
  imageOG?: string;
  /** Alt text for Open Graph image */
  altOG?: string;
  /** JSON-LD structured data schema */
  schema?: Thing | Thing[];
}

/**
 * Base Schema.org Thing type
 * See: https://schema.org/Thing
 */
export type Thing =
  | GovernmentOrganization
  | Organization
  | NewsArticle
  | Event
  | BreadcrumbList
  | CollectionPage;

/**
 * Schema.org GovernmentOrganization
 * See: https://schema.org/GovernmentOrganization
 */
export interface GovernmentOrganization {
  '@context': 'https://schema.org';
  '@type': 'GovernmentOrganization';
  '@id'?: string;
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string | string[];
  telephone?: string;
  email?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint;
  sameAs?: string[];
}

/**
 * Schema.org Organization
 * See: https://schema.org/Organization
 */
export interface Organization {
  '@context'?: 'https://schema.org';
  '@type': 'Organization';
  '@id'?: string;
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string | string[];
  sameAs?: string[];
  address?: PostalAddress;
  contactPoint?: ContactPoint;
}

/**
 * Schema.org NewsArticle
 * See: https://schema.org/NewsArticle
 */
export interface NewsArticle {
  '@context': 'https://schema.org';
  '@type': 'NewsArticle';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: Person | Organization;
  publisher?: Organization;
  url?: string;
  articleBody?: string;
}

/**
 * Schema.org Event
 * See: https://schema.org/Event
 */
export interface Event {
  '@context': 'https://schema.org';
  '@type': 'Event';
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: Place | string;
  image?: string | string[];
  organizer?: Organization;
  url?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
}

/**
 * Schema.org CollectionPage
 * See: https://schema.org/CollectionPage
 */
export interface CollectionPage {
  '@context': 'https://schema.org';
  '@type': 'CollectionPage';
  name: string;
  description?: string;
  url?: string;
  breadcrumb?: BreadcrumbList;
}

/**
 * Schema.org BreadcrumbList
 * See: https://schema.org/BreadcrumbList
 */
export interface BreadcrumbList {
  '@context'?: 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

/**
 * Schema.org ListItem
 * See: https://schema.org/ListItem
 */
export interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

/**
 * Schema.org PostalAddress
 * See: https://schema.org/PostalAddress
 */
export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

/**
 * Schema.org ContactPoint
 * See: https://schema.org/ContactPoint
 */
export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone?: string;
  email?: string;
  contactType?: string;
  url?: string;
  areaServed?: City;
}

/**
 * Schema.org Place
 * See: https://schema.org/Place
 */
export interface Place {
  '@type': 'Place';
  name?: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
}

/**
 * Schema.org GeoCoordinates
 * See: https://schema.org/GeoCoordinates
 */
export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

/**
 * Schema.org City
 * See: https://schema.org/City
 */
export interface City {
  '@type': 'City';
  name: string;
  url?: string;
}

/**
 * Schema.org Person
 * See: https://schema.org/Person
 */
export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
}
