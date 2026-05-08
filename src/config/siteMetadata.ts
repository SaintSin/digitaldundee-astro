/**
 * Site Metadata, Org Info & Social Links
 *
 * Single source of truth for SEO, JSON-LD schemas, navigation, footer, and meta tags.
 */

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
  showInComponent: boolean;
  includeInJsonLd: boolean;
}

export interface SiteAddress {
  street: string;
  locality: string;
  postalCode?: string;
  country: string;
}

export interface SiteMetadata {
  name: string;
  legalName?: string;
  description: string;
  siteUrl: string;
  logo?: string;
  defaultImage?: string;
  defaultImageAlt?: string;
  contactEmail?: string;
  phone?: string;
  measurementId?: string;
  address?: SiteAddress;
  areaServed?: string[];
  menu?: MenuItem[];
  social?: SocialLink[];
}

export const siteMetadata: SiteMetadata = {
  name: 'Digital Dundee',
  legalName: 'Digital Dundee',

  description:
    'Digital Dundee is a portal for people and businesses in digital, creative and tech in Dundee and the wider Tay Cities region.',

  siteUrl: 'https://digitaldundee.netlify.app',

  logo: '/favicon.svg',
  defaultImage: 'generic-social-1200x630.png',
  defaultImageAlt: 'Digital Dundee - Tech Hub',

  contactEmail: 'julie@digitaldundee.com',
  phone: '+44 1382 434602',

  measurementId: 'G-SYL7W0VC6S',

  address: {
    street: '50 North Lindsay Street',
    locality: 'Dundee',
    postalCode: 'DD1 1QE',
    country: 'GB',
  },

  areaServed: ['Dundee', 'Tay Cities Region'],

  menu: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' },
    {
      label: 'Be Dundee',
      href: '/be-dundee/',
      children: [
        { label: 'Careers And Jobs', href: '/be-dundee/careers-and-jobs' },
        { label: 'Collaborate', href: '/be-dundee/collaborate' },
        { label: 'Connected Dundee', href: '/be-dundee/connected-dundee' },
        { label: 'Enjoy', href: '/be-dundee/enjoy-dundee' },
        { label: 'Get Service', href: '/be-dundee/get-service' },
        { label: 'Invest in Dundee', href: '/be-dundee/invest-dundee' },
        { label: 'Locate Dundee', href: '/be-dundee/locate-dundee' },
        { label: 'Talent And Skills', href: '/be-dundee/talent-skills' },
      ],
    },
    {
      label: 'Tay5G',
      href: '/tay5g/',
      children: [{ label: 'About', href: '/tay5g/about-tay5g/' }],
    },
    { label: 'Resources', href: '/resources/' },
    { label: 'News', href: '/news/' },
    { label: 'Contact Us', href: '/contact/' },
    { label: 'Events', href: '/events/' },
    { label: 'Meet The Companies', href: '/meet-companies/' },
    { label: 'Success Stories', href: '/success-stories/' },
  ],

  social: [
    {
      name: 'Twitter / X',
      icon: 'mdi:twitter',
      url: 'https://twitter.com/digitaldundee',
      showInComponent: true,
      includeInJsonLd: true,
    },
    {
      name: 'Facebook',
      icon: 'mdi:facebook',
      url: 'https://www.facebook.com/pages/Dundee/177361495630580',
      showInComponent: true,
      includeInJsonLd: true,
    },
    {
      name: 'RSS',
      icon: 'mdi:rss',
      url: '/rss.xml',
      showInComponent: true,
      includeInJsonLd: false,
    },
  ],
};

// ---- Helper functions ----

export function getSocialLinksForDisplay(): SocialLink[] {
  return (siteMetadata.social ?? []).filter((l) => l.showInComponent);
}

export function getSocialLinksForJsonLd(): string[] {
  return (siteMetadata.social ?? [])
    .filter((l) => l.includeInJsonLd)
    .map((l) => l.url);
}
