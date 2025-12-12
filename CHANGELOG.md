# Changelog

All notable changes to the Digital Dundee Astro project.

## 2025-12-12

### View Transitions

#### Added

- **Company logo view transitions** (`/src/components/cards/Company.astro`, `/src/pages/meet-companies/[id].astro`)
  - Smooth morphing animation between company card and detail page
  - Uses `transition:name` directive with unique company ID
  - Applied to company logo images

### CSS Grid System Refactor

#### Changed

- **Grid composition class** (`/src/styles/compositions/grid.css`)
  - Switched from Piccalilli's `auto-fill` approach to traditional `repeat(n, 1fr)` with media queries
  - Fixed issue where cards would expand to fill available columns
  - Cards now maintain consistent width regardless of number in row
  - **Thirds layout breakpoints:**
    - Mobile: 1 column (default)
    - ≥600px: 2 columns
    - ≥900px: 3 columns
  - **Fourths layout breakpoints:**
    - Mobile: 1 column (default)
    - ≥500px: 2 columns
    - ≥768px: 3 columns
    - ≥1024px: 4 columns
  - Added `justify-items: start` to prevent stretching

### News Archive System

#### Added

- **News archive utility functions** (`/src/utils/newsArchive.ts`)
  - `groupNewsByMonth()` - groups news articles by year-month (e.g., "202507")
  - `formatArchiveDate()` - formats archive dates for display (e.g., "July 2023")
  - `getArchiveEntries()` - returns sorted archive entries with article counts

- **NewsArchive component** (`/src/components/NewsArchive.astro`)
  - Reusable component for displaying news archive links
  - Configurable limit (default: 8 months)
  - Shows month/year with article count
  - "View More" link to full archive

- **News archive pages:**
  - `/src/pages/news-archive/index.astro` - Main archive listing page showing all months
  - `/src/pages/news-archive/[archive].astro` - Dynamic monthly archive pages (e.g., /news-archive/202507)
  - Static generation at build time
  - CollectionPage schema with breadcrumbs

- **Breadcrumb label** (`/src/utils/schema.ts`)
  - Added 'news-archive': 'News Archive' to BREADCRUMB_LABELS

### RSS Feed

#### Added

- **RSS feed endpoint** (`/src/pages/rss.xml.ts`)
  - Combined feed with news, events, and success stories
  - Category tags for each content type
  - Sorted by date descending
  - Image enclosures for RSS readers
  - Available at `/rss.xml`

- **RSS image generation script** (`/scripts/generate-rss-images.ts`)
  - Reads MDX files directly from file system (no Astro dependency)
  - Extracts image paths from frontmatter
  - Smart image resizing:
    - Maximum width: 600px
    - Only resizes images wider than 600px
    - Preserves original dimensions for smaller images
  - JPEG optimization at 85% quality
  - Outputs to `public/rss-images/` with stable filenames
  - Skips already-generated images for faster builds
  - Supports all three content types (news, events, success stories)

- **npm scripts** (`package.json`)
  - `prebuild` - Automatically runs image generation before build
  - `rss-images` - Manually generate RSS images
  - Updated `clean` script to remove `public/rss-images/`

- **Git ignore** (`.gitignore`)
  - Added `public/rss-images/` to ignore generated build artifacts

#### Technical Details

- RSS feed uses `@astrojs/rss` package
- Image enclosures use stable URLs: `/rss-images/{type}-{id}.jpg`
- 172 images generated successfully
- Script uses `tsx` for TypeScript execution
- Runs with `node --import tsx` (ESM compatible)

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
