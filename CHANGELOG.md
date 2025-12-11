# Changelog

All notable changes to the Digital Dundee Astro project.

## 2025-12-11

### JSON-LD Structured Data Implementation

#### Added
- **Schema.org type definitions** (`/src/types/index.ts`)
  - GovernmentOrganization
  - Organization
  - NewsArticle
  - Event
  - CollectionPage
  - BreadcrumbList
  - Person, Place, PostalAddress, ContactPoint, etc.

- **Schema utilities** (`/src/utils/schema.ts`)
  - `digitalDundeeOrganization` - complete organization schema with contact details
  - `generateBreadcrumbs()` - automatic breadcrumb generation from pathname
  - `BREADCRUMB_LABELS` - custom labels for breadcrumb navigation
  - `SITE_URL` constant

- **JsonLd component** (`/src/components/page/JsonLd.astro`)
  - Renders JSON-LD script tags for structured data
  - Integrated into Basehead component

- **JSON-LD schemas added to pages:**
  - **Homepage** (`/src/pages/index.astro`) - GovernmentOrganization schema
  - **About page** (`/src/pages/about.astro`) - GovernmentOrganization schema
  - **News pages:**
    - `/src/pages/news/index.astro` - CollectionPage schema with breadcrumbs
    - `/src/pages/news/[page].astro` - CollectionPage schema with breadcrumbs
    - `/src/pages/news/[id].astro` - NewsArticle schema with author/publisher
  - **Events pages:**
    - `/src/pages/events/index.astro` - CollectionPage schema with breadcrumbs
    - `/src/pages/events/[page].astro` - CollectionPage schema with breadcrumbs
    - `/src/pages/events/[id].astro` - Event schema with dates/location/organizer
  - **Resources pages:**
    - `/src/pages/resources/index.astro` - CollectionPage schema with breadcrumbs
    - `/src/pages/resources/[page].astro` - CollectionPage schema with breadcrumbs
  - **Success Stories:**
    - `/src/pages/success-stories/index.astro` - CollectionPage schema with breadcrumbs

#### Removed
- **WebPage schema** - Removed as redundant with meta tags
  - Deleted WebPage interface from type definitions
  - Removed from Thing union type
  - Simplified homepage and about page schemas

#### Technical Decisions
- **Image fields omitted** from NewsArticle and Event schemas to avoid cache-busting issues with Astro's optimized image hashes
- **Organization schema** appears on all pages for consistent entity recognition
- **CollectionPage** used for listing pages (news, events, resources) instead of generic WebPage
- **Breadcrumbs** auto-generated from URL pathname with custom label support

### Components

#### Added
- **RecentNews component** (`/src/components/RecentNews.astro`)
  - Displays configurable number of recent news articles (default: 6)
  - Sorted by date descending
  - Optional heading
  - Uses thirds grid layout

- **UpcomingEvents component** (`/src/components/UpcomingEvents.astro`)
  - Displays configurable number of upcoming events (default: 6)
  - Filtered by date (only future events)
  - Sorted chronologically (earliest first)
  - Uses EventCard component

### SEO & Performance
- Structured data now follows Schema.org best practices
- GovernmentOrganization type for Digital Dundee entity
- Rich snippets support for news articles and events
- Breadcrumb navigation for better site structure understanding
