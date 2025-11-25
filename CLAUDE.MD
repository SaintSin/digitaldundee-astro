# Digital Dundee - Astro Site

## Project Overview

Digital Dundee is a static website built with Astro showcasing the digital technology sector in Dundee, Scotland. The site features companies, news, events, resources, and success stories related to Dundee's tech ecosystem.

**Site URL**: https://digitaldundee.netlify.app
**Repository**: Digital Dundee Astro
**Main Branch**: main
**Current Branch**: hardcore-swartz

## Tech Stack

- **Astro 5.16.0** - Static site generator with SSG/SSR support
- **MDX** - Markdown with JSX for content pages
- **Netlify** - Hosting and deployment platform
- **SCSS/Sass** - CSS preprocessor
- **Open Props** - CSS design tokens
- **TypeScript** - Type safety
- **Biome** - Fast linting and formatting
- **Partytown** - Web worker for analytics
- **Motion** - Animation library

## Project Structure

```
/
├── public/
│   ├── images/           # Static images
│   └── ...               # Other static assets
├── src/
│   ├── assets/
│   │   └── images/       # Optimized images (companies, events, etc.)
│   ├── components/
│   │   ├── cards/        # Card components (Company, Event, News, Resource, Success)
│   │   └── page/         # Layout components (Header, Footer, Basehead, etc.)
│   ├── content/          # MDX content collections
│   │   ├── companies/    # 250+ company profiles
│   │   ├── events/       # 100+ tech events
│   │   ├── news/         # 80+ news articles
│   │   ├── resources/    # 140+ resources
│   │   └── success-stories/ # Success stories
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── meet-companies.astro
│   │   ├── events/       # Events listing + pagination + detail pages
│   │   ├── news/         # News listing + pagination + detail pages
│   │   ├── resources/    # Resources listing + pagination + detail pages
│   │   └── success-stories/ # Success stories pages
│   ├── styles/
│   │   ├── compositions/ # CUBE CSS utilities
│   │   ├── _globals.scss
│   │   ├── _layout.scss
│   │   └── style.css
│   └── types/
│       └── index.ts
├── astro.config.mjs
├── tsconfig.json
├── biome.json
└── package.json
```

## Content Collections

All content is managed through Astro's content collections using MDX files:

### Companies (`src/content/companies/`)
- 250+ tech companies in Dundee
- Frontmatter: `title`, `companyUrl`, `logo`, `sector`, `serviceArea`
- Displayed on meet-companies pages with filtering

### Events (`src/content/events/`)
- 100+ tech events and meetups
- Frontmatter: `title`, `eventDate`, `eventEndDate`, `eventStartTime`, `eventEndTime`, `location`, `eventUrl`, `seo`, `imagePrimary`, `description`
- Paginated listing with individual detail pages

### News (`src/content/news/`)
- 80+ news articles about Dundee tech sector
- Frontmatter includes metadata and SEO fields
- Paginated listing with individual article pages

### Resources (`src/content/resources/`)
- 140+ resources for the tech community
- Similar structure to news and events
- Paginated listing

### Success Stories (`src/content/success-stories/`)
- Success stories from Dundee's tech ecosystem
- Individual pages for each story

## Key Features

### Pagination
- Events, news, resources, and companies all use Astro's pagination
- Pattern: `/[page].astro` for paginated routes
- Individual items: `/[id].astro` for detail pages

### Image Optimization
- Uses Astro's built-in Image component
- Images stored in `src/assets/images/`
- Responsive images with automatic optimization
- Sharp for image processing

### SEO
- Complete meta tags in Basehead component
- Open Graph and Twitter Card support
- Sitemap integration
- SEO fields in content frontmatter

### Fonts
- Google Fonts integration (Open Sans, Montserrat)
- Experimental font provider in astro.config.mjs
- CSS variables: `--font-opensans`, `--font-montserrat`

### Analytics
- Google Analytics with Partytown integration
- Partytown runs analytics in a web worker for better performance

### SVGO
- Experimental SVGO enabled for SVG optimization

## Path Aliases

Configured in `tsconfig.json`:
- `@assets/*` → `src/assets/*`
- `@components/*` → `src/components/*`
- `@data/*` → `src/data/*`
- `@images/*` → `src/assets/images/*`
- `@layouts/*` → `src/layouts/*`
- `@scripts/*` → `src/scripts/*`
- `@styles/*` → `src/styles/*`
- `@types` → `src/types`

## Available Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm run format       # Format code with Biome
npm run lint         # Lint code with Biome
npm run check        # Run Biome format + lint
npm run prettier     # Format with Prettier (alternative)
npm run clean        # Remove dist and .astro folders
npm run type-check   # Run Astro type checking
npm run test         # Run type check and Biome check
```

## CSS Architecture

Uses CUBE CSS methodology:
- **Composition Classes**: `.flow`, `.wrapper`, `.grid`
- **Utilities**: Layout and spacing utilities
- **Blocks**: Component-specific styles
- **Exceptions**: State-based variations

### Design Tokens
- Open Props for consistent design tokens
- Fluid typography and spacing (Utopia scales)
- SCSS variables in `_globals.scss`

## Development Workflow

### When Adding New Content
1. Add MDX file to appropriate `src/content/` directory
2. Follow existing frontmatter structure
3. Add images to `src/assets/images/` subdirectory
4. Reference images using relative paths from MDX

### When Creating New Pages
1. Add `.astro` file to `src/pages/`
2. Use `BaseLayout` for consistent layout
3. Define metadata for SEO
4. Use path aliases for imports

### When Styling Components
1. Follow CUBE CSS methodology
2. Use composition classes for layout
3. Add component-specific styles in component file or separate SCSS
4. Leverage Open Props tokens

## Deployment

- **Platform**: Netlify
- **Adapter**: `@astrojs/netlify`
- **Build Command**: `npm run build`
- **Output**: Static files in `./dist/`
- **Git Branch**: Deploys from `main` branch

## Important Files

- `astro.config.mjs` - Astro configuration with integrations
- `tsconfig.json` - TypeScript and path alias configuration
- `biome.json` - Biome linter/formatter settings
- `package.json` - Dependencies and scripts
- `news-dates-mapping.json` - Date mapping for news articles

## Common Tasks

### Adding a New Company
1. Create `src/content/companies/company-name.mdx`
2. Add logo to `src/assets/images/companies/`
3. Use existing company files as template
4. Include: title, companyUrl, logo, sector, serviceArea

### Adding a News Article
1. Create `src/content/news/article-slug.mdx`
2. Add featured image to `src/assets/images/news/`
3. Include SEO metadata and description
4. Content appears automatically in paginated news listing

### Adding an Event
1. Create `src/content/events/event-slug.mdx`
2. Include all date/time fields
3. Add event image to `src/assets/images/events/`
4. Event appears in chronological listing

## Notes for Claude Code

- This is a content-heavy site with 600+ MDX files
- Most content follows consistent frontmatter patterns
- Pagination is handled automatically by Astro
- Images should always use Astro's Image component
- Content collections don't require a config.ts file (using default inference)
- The site emphasizes performance with Partytown and SVGO
- Biome is preferred for TS/JS/JSON, Prettier for Astro/CSS
- This is a git worktree - changes are isolated from main repo

## Recent Changes

- Added Google Analytics with Partytown
- Success stories content work
- Sanitized success stories
- Experimental SVGO enabled
- Various content updates

## Links

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Netlify Astro Adapter](https://docs.astro.build/en/guides/deploy/netlify/)
