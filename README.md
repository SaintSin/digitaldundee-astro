# Astro Starter Template

A modern, production-ready Astro starter template featuring CUBE CSS methodology, fluid typography, and optimized workflows.

## Features

- **Modern CSS Architecture** - CUBE CSS with composition utilities (flow, wrapper, grid)
- **Fluid Typography & Spacing** - Utopia scales for responsive design without breakpoints
- **Image Optimization** - Built-in examples of Astro's responsive image layouts
- **SEO Ready** - Complete meta tags, Open Graph, Twitter Cards, and sitemap
- **TypeScript Support** - Configured with path aliases and type definitions
- **Dual Formatter Setup** - Choose between Biome (fast) or Prettier (mature)
- **View Transitions** - Smooth client-side routing with Astro transitions
- **Developer Experience** - VS Code extensions and settings pre-configured

## Tech Stack

- **Astro 5.15+** - Static site generator
- **SCSS** - CSS preprocessor
- **Open Props** - CSS design tokens
- **Biome** - Fast linter and formatter
- **Prettier** - Mature formatter with Astro plugin
- **TypeScript** - Type safety and IntelliSense

## Project Structure

```text
/
├── public/
│   ├── images/social/        # Open Graph images
│   ├── favicon.svg
│   ├── robots.txt
│   └── manifest.webmanifest
├── src/
│   ├── assets/
│   │   └── images/           # Optimized images
│   ├── components/
│   │   └── page/            # Header, Footer, Basehead
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout wrapper
│   ├── pages/
│   │   ├── index.astro      # Homepage with examples
│   │   ├── about.astro
│   │   └── 404.astro
│   ├── styles/
│   │   ├── compositions/    # CUBE CSS utilities
│   │   ├── _globals.scss    # Design tokens
│   │   ├── _layout.scss     # Layout utilities
│   │   └── style.css        # Main stylesheet
│   └── types/
│       └── index.ts         # TypeScript definitions
├── astro.config.mjs
├── tsconfig.json            # Path aliases configured
├── biome.json               # Biome configuration
└── .prettierrc              # Prettier configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone or use as template
git clone [your-repo-url]
cd astro-starter

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Visit `http://localhost:4321` to see your site.

## Available Commands

| Command         | Action                               |
| :-------------- | :----------------------------------- |
| `pnpm install`  | Install dependencies                 |
| `pnpm dev`      | Start dev server at `localhost:4321` |
| `pnpm build`    | Build production site to `./dist/`   |
| `pnpm preview`  | Preview production build locally     |
| `pnpm format`   | Format code with Biome               |
| `pnpm lint`     | Lint code with Biome                 |
| `pnpm check`    | Run Biome format + lint              |
| `pnpm prettier` | Format with Prettier (alternative)   |

## Path Aliases

The following path aliases are configured in `tsconfig.json`:

```typescript
import Component from '@components/Component.astro';
import Layout from '@layouts/BaseLayout.astro';
import image from '@images/photo.jpg';
import '@styles/style.css';
import type { MetaData } from '@types';
```

Available aliases:

- `@assets/*` → `src/assets/*`
- `@components/*` → `src/components/*`
- `@data/*` → `src/data/*`
- `@images/*` → `src/assets/images/*`
- `@layouts/*` → `src/layouts/*`
- `@scripts/*` → `src/scripts/*`
- `@styles/*` → `src/styles/*`
- `@types` → `src/types`

## CSS System

This template uses **CUBE CSS** (Composition, Utilities, Blocks, Exceptions) methodology:

### Composition Classes

- `.flow` - Vertical rhythm with configurable spacing
- `.wrapper` - Content width constraint with padding
- `.grid` - Responsive grid with `data-layout` variants
  - `data-layout="50-50"` - Two equal columns
  - `data-layout="thirds"` - Three equal columns

### Design Tokens

Fluid typography and spacing scales from [Utopia](https://utopia.fyi/) are available as CSS custom properties in `_globals.scss`.

## Image Optimization

The template includes examples of Astro's three image layout modes:

```astro
<!-- Fixed width -->
<Image src={img} width={600} layout="fixed" />

<!-- Constrained (max-width) -->
<Image src={img} width={700} layout="constrained" />

<!-- Full width (responsive) -->
<Image src={img} layout="full-width" />
```

See `src/pages/index.astro` for working examples with a resizable container.

## Biome vs Prettier

This template includes **both** formatters:

**Biome** (Recommended for new projects)

- 🚀 Extremely fast
- 🔧 Lints + formats in one tool
- ⚡ Great for JS/TS/JSON
- ⚠️ Still maturing for CSS/Astro

**Prettier** (More mature)

- ✅ Excellent Astro file support
- ✅ Better CSS formatting
- 🐌 Slower than Biome
- 📦 Requires multiple plugins

### Choosing Your Formatter

#### Option 1: Use Biome (Default in VS Code settings)

```bash
pnpm run check
```

#### Option 2: Use Prettier

```bash
pnpm run prettier
```

#### Option 3: Remove one

- To remove Biome: Delete `biome.json` and remove from `package.json`
- To remove Prettier: Delete `.prettierrc` and remove from `package.json`

The VS Code workspace is configured to use Biome for code and Prettier for Astro/CSS files.

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Update `site` URL in `astro.config.mjs` to your production domain
- [ ] Replace placeholder content in pages (`index.astro`, `about.astro`)
- [ ] Update meta descriptions and titles for all pages
- [ ] Add real alt text to all images
- [ ] Replace social media images in `/public/images/social/`
- [ ] Update `manifest.webmanifest` if needed
- [ ] Review and customize `robots.txt`
- [ ] Test build: `pnpm build && pnpm preview`
- [ ] Run type checking: `astro check`
- [ ] Verify all links work

## SEO & Meta Tags

Each page should define metadata:

```astro
---
import Layout from '@layouts/BaseLayout.astro';
import type { MetaData } from '@types';

const meta: MetaData = {
  title: 'Page Title',
  description: 'Page description for SEO',
  imageOG: 'social-image.png', // optional
  altOG: 'Alt text for social image', // optional
};
---

<Layout metaData={meta}>
  <!-- Your content -->
</Layout>
```

## VS Code Setup

When you open this project in VS Code, you'll be prompted to install recommended extensions:

- **Astro** - Syntax highlighting and IntelliSense
- **Biome** - Fast formatting and linting
- **Prettier** - Alternative formatter

Workspace settings are pre-configured to use the right formatter for each file type.

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [CUBE CSS](https://cube.fyi/)
- [Utopia Fluid Scales](https://utopia.fyi/)
- [Open Props](https://open-props.style/)
- [Biome](https://biomejs.dev/)

## License

MIT
