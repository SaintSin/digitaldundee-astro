# Changes

All notable changes to the Digital Dundee Astro project.

## 2026-10-08 (latest)

### Spacing: home page aligned with the original site

#### Changed

- **Flow composition** (`compositions/flow.css`) — Rewritten around `--flow-space` as in [My favourite 3 lines of CSS](https://bell.bz/my-favourite-3-lines-of-css/): each `.flow` defaults to one line of text (26px), and an element following a heading stays close to it. The gap above any single element is overridden on that element, with no extra wrappers. This also changes paragraph spacing on the pages that already use `.wrapper flow` (about 19px to 26px)
- **Home page** (`index.astro`) — One `.home.flow` container with flat children: 48px between sections, 32px between the intro rows and the button, 26px after headings. `RecentNews` and `UpcomingEvents` now output their heading and grid as siblings instead of a nested section; the "Get In Touch" wrapper div is gone
- **Base text** — 16px / 1.625 line height (was 17.6px / 1.5), matching the original
- **Container** — `--wrapper-max-width: 1170px` with a 15px gutter; grid gutter 30px (`--space-m`)
- **Page bottom** — `.content` has 48px bottom padding on every page, replacing the footer's top margin
- **Promo panels** — Vertical padding `--space-2xl`; white text now has a dark-grey text shadow
- **Home animation** — The second promo panel ("Making things happen") now fades in like the first (`data-animate="fade"`)

#### Fixed

- **Hero horizontal scroll** — The background video was positioned against the page, not its container, which added 80px of horizontal overflow; the container is now `position: relative`
- **Card excerpts** — The 3-line clamp had bottom padding, so the start of a 4th line showed; it is now margin
- **Card images** — Forced aspect ratios stretched non-matching images. They now use `object-fit: cover` at one ratio (1.8); the separate `.news` and `.event` ratios were removed
- **Event cards** — Bottom padding after the date

### Content: stray backticks

#### Fixed

- **Backtick used as an opening quote** — Three news articles (`dundee-computing-student-turns-teacher`, `dundee-researcher...images-impact`, `it's-not-one-thing...aphasia`) had a backtick before quoted titles such as `Computer Science for Everyone', which markdown treats as the start of inline code and broke the formatting. All 20 are now curly opening quotes (`‘`), including one in a title and image alt text

### Content: open issues worked through

#### Fixed

- **Security-rewritten links** — 17 links in 7 files (Check Point, Microsoft Safe Links, Mimecast) now go to their real destinations
- **Link text** — "Click here...", "here" and "Read more." made descriptive; 14 raw-URL link texts show the host name, as do company website links (`meet-companies/[id].astro`)
- **Broken or placeholder content** — the Challenge Fund 2 repeated paragraphs; the `/file/...` links to a video that never existed (now the YouTube URL the live page embeds); the Jet Connectivity success story (malformed link, no text); card excerpts of `In Se`, `...` and empty on five items; the 1,869-character Fox Wot I Drew paragraph (split into seven); an em-dash line (now a rule)
- **Metadata** — Be Dundee had the starter's "Welcome to Astro" title and placeholder description; Collaborate had Careers and Jobs' title and description and a "Collaborate and Jobs" hero; Enjoy Dundee's hero alt text named another page
- **Spacing typos** — missing spaces after full stops and stray spaces before commas and full stops in eight articles and pages

### Content: rendering clean-up across all pages

A scan of all 706 rendered pages found the problems below; each is fixed.

#### Fixed

- **Leaked bold markers** — `**` showed literally on 24 pages because of a space just inside a marker (`**Essential note: **`) or a marker glued to a word. Spacing around the markers was normalised in 22 content files, and one line (Abertay cyberQuarter, "Councillor Mark Flynn says") was corrected by hand. The `**` on the tourism-surge article is an intentional footnote marker and was left
- **Heading structure** — 109 listing pages jumped from the hero `h1` straight to card titles (`h3`). The listing templates now have a visually hidden `h2` ("Events, page 2", "News from May 2014", ...), and the duplicate in-body `<h1>` on Meet The Companies and Success Stories became an `h2`. In 22 content files, headings are now never more than one level below the previous one, starting from `h2`, and bold inside headings was removed
- **Empty elements** — `<p>&nbsp;</p>` on Collaborate; an empty link on Enjoy Dundee (the Visit Dundee image now links to dundee.com, with alt "Visit Dundee"); an empty image link in the InGAME article; zero-width-character paragraphs in the Digital Energy Summit event; empty list items (`- -`) in the Japan student article; and empty card excerpts rendering `<p></p>`
- **Stray "Image" labels** — 8 on the 5G Guide and Tay5G News pages (from the page generator)
- **Backticks** — the two on Talent & Skills (`world-leading’`) are now curly quotes
- **Absolute links to the old domain** — 16 links to `digitaldundee.com/...` are now relative; two used old paths (`/success-story/...`, `/event/...`) and were mapped to their pages here
- **Image alt text** — 22 content files had a filename (`Perth Tech Mornings.jpg`) or "Success story image" as alt text; it is now the item's title. Two inline images got real alt text (John Thornewill, Waracle)

### Content: merged paragraphs

#### Fixed

- **Paragraphs rendered as one block** — The migration wrote one paragraph per line with no blank line between, which markdown joins into a single paragraph (the "Dundee - computing student turns teacher" article was one block). Blank lines were added to 23 articles and checked against the live pages: every live paragraph now appears as its own paragraph here, and one deliberate line-break block (`realising-creative-concept`) is kept as a single paragraph with hard breaks. Left for review: the Phase 25 conference schedule (24 slot lines) and one event made of short schedule lines (`create-converges-animation-day`)

### Social sharing card

#### Fixed

- **Generic Open Graph image** — `public/images/social/generic-social-1200x630.png`, the fallback image for every page without its own (and so the preview when most pages are shared), was the starter template's white "Generic OG Social Media Card" placeholder. It is now a 1200x630 card using the menu's Digital | DUNDEE lockup (Open Sans, magenta pipe, semibold DUNDEE) with a "Creative · Digital · Tech" line. The source is `design/og-card.html`, with instructions for re-rendering it
- **Broken `og:image` URLs on 315 pages** — `Basehead.astro` always glued the image onto `/images/social/`, so events, resources and company pages (which pass `/_astro/...` image paths) got URLs like `/images/social//_astro/...`, and news and success stories (which passed a bare filename from `seo.ogImage`) pointed at files that do not exist. `Basehead` now accepts an image path, a full URL or a card filename, and news and success stories use their real processed image. The 40 news articles whose only image is the small `placeholder.png` use the full-size card instead. Checked in the build: all 706 pages now point at an image that exists (430 the generic card, 276 their own)

### Card images

#### Fixed

- **Cropped and magnified card images** — Cards cropped every image to one 1.8:1 box (`object-fit: cover`), which cut text off the sides of 2:1 promo graphics (Perth Tech Mornings, MedTech IP) and magnified small or wide images (the 343x52 Tayside Tech Fest banner). Card image boxes are now 3:2, and 2:1 for events, matching the shapes most images already have
- **Conditional image styling** — New `src/utils/imageFit.ts` reads each image's real dimensions at build time and sets data attributes on the card: `data-fit="contain"` for squares (under 1.2:1), portraits and very wide banners (over 2.6:1), which are shown whole instead of cropped, and `data-size="small"` for images narrower than a card (360px), which are not scaled up past their own size (`object-fit: scale-down`). Everything else is still cropped to the box. The low-resolution and inconsistent source images are logged in `ISSUES.md`

### Content replicated from the live site, menu and contact

#### Added

- **Pages** — 5G Guide, Why do 5G Trials?, Tay5G Challenge Fund, Challenge Fund 2 and Tay5G News under `/tay5g/`, rebuilt from the live pages in our own layout (their 5G styling is not copied); images saved locally and the "5G Effect" PDF hosted at `/documents/`. Also one event (Techscaler x ScotlandIS webinar) and one success story (life sciences awards) that were missing
- **`ISSUES.md`** — A record of problems found on the live site and of every content correction made, so changes against the live copy are tracked

#### Changed

- **Menu** (`siteMetadata.ts`, `HeaderNav.astro`) — Labels now match the live site ("Locate", "Innovate", "Enjoy Dundee", "Get Services", "Talent & Skills", ...), with a third level under "5G Guide" (rendered as indented links in the same dropdown and in the hamburger panel)
- **URLs** — `/be-dundee/get-service` is `/be-dundee/get-services`; redirects (in `astro.config.mjs`) for `/be-dundee/get-service`, `/innovate/about-tay5g`, `/innovate/tay5g-news`, `/contact-us` and `/privacy`
- **Contact page** — Restyled form (pill inputs, footer button style); the phone number's stray `0` is fixed; plain-text emails and phone numbers across pages are now `mailto:` and `tel:` links
- **Privacy policy** — The drafted text is replaced with the live Digital Dundee privacy statement (version 12 May 2021)

#### Fixed

- **Wrong page text** — Talent & Skills, Invest In Dundee and Locate Dundee held the Enjoy Dundee text, Connected Dundee held pasted Collaborate text, and the Tay5G landing page was a placeholder; all replaced with the live text
- **Broken images and links** — Connected Dundee and Enjoy Dundee images pointed at old Drupal paths; the home page "Get In Touch" linked to a 404 (`contact-us`)
- **Email typo** — `tay5g@dundeecity.gv.uk` on Tay5G Challenge Fund 2 is now `tay5g@dundeecity.gov.uk` (logged in `ISSUES.md`)

### Header and navigation

#### Changed

- **Full-width header** (`Header.astro`) — The header row is no longer capped at the 1170px container. Brand and nav share one row, with `--space-s-l` side padding; brand is `--step-2` (was `--step-1`) and nav links `--step--2` (they were `calc(var(--step--2) * 0.75)`, about 9.6px)
- **Content-measured hamburger** (`HeaderNav.astro`) — The nav collapses when its links, laid out on one line, don't fit beside the brand, instead of at a fixed 768px container query. A small inline script (so there is no flash of the full row on narrow screens) measures the links and sets `data-collapsed` on `.main-nav`; it re-measures on resize and when web fonts load. All `@container nav` blocks became `.main-nav[data-collapsed]` selectors, and the nav's size containment was removed. With the current menu this collapses below about 1436px; shrink the links (padding, letter-spacing, font size) to move it
- **Hamburger panel** — Restyled to match the original: a light panel under the header (the brand stays visible) instead of a full-screen white overlay; small tracked uppercase links with no borders or fills, a chevron on dropdown parents, child links indented and always visible, active page underlined; the panel scrolls if taller than the screen

### Content: missing images and sanitising

#### Fixed

- **Missing body images** — The migration had dropped inline images from 14 news articles and 8 events (some left a stray "Image" line). Compared every article against the live site and embedded the images in their original positions as markdown images, with the original alt text. 9 new image files were downloaded (a GIF was converted to PNG). Not restored: two images in the InGAME speakers article, which are hotlinked from beyondconference.org and return 404 on the original site too
- **Word markup** — Removed `<o:p></o:p>` from 5 news articles (45 lines)
- **Meta descriptions** — 60 files had a `description` holding the whole article body with `\n`, `###`, `**` and HTML tags; it is now plain text, capped at 160 characters
- **HTML in bodies** — `<h1>`/`<h5>` headings in 9 events converted to markdown headings (body headings start at `##`, since the hero is the page title); layout `<table>` wrappers removed from 2 events; `<u>` removed; two empty `<a>` tags (NLAE concept video, Tay5G flyer PDF) now show as visible links
- **Garbled emphasis** — About 15 lines with broken bold/italic markers (`\***`, `**\*…\*\***`) cleaned up; footnote asterisks left alone
- **Stray "Image" lines** — Removed from 6 events, replaced by the real images

### Spacing: detail and listing pages

#### Fixed

- **Body line-height** (`style.css`) — An unlayered `body { line-height: 150% }` overrode the 1.625 set in `_layout.css`, so every page except the home page (which set its own) was 24px instead of 26px. Now 1.625 in one place; the home page's own `p` line-height is removed
- **Event, resource and company detail pages** — `article` and `header` are now `.flow`, so images, paragraphs, headings and lists get the 26px rhythm instead of being stacked with no gaps. Date, location and website link on events stay together at `--space-3xs`; inline links use `display: block; width: fit-content` so the flow margin applies
- **News article page** — Breadcrumb and title `h2` moved inside `.wrapper.flow` (they sat outside the page wrapper)
- **Events index** — Forthcoming/Previous sections are `.flow`, so the heading no longer touches its card grid

### Footer and signup form

#### Changed

- **Footer** (`Footer.astro`, `NewsArchive.astro`, `FormFooter.astro`) — Two columns that wrap without a media query (`auto-fit`), built from flat flow children instead of wrapper divs. 48px before "Connect With Us"; headings sit 15px from their content via a new `--flow-heading-space` hook in `flow.css`; all footer `h2`s share one size and weight
- **Signup form** — Pill-shaped inputs and button, placeholders ("Email Address", "First Name", "Last Name") at body paragraph size, visible labels dropped in favour of `aria-label`. A placeholder can't be partly coloured, so required, empty fields draw an orange asterisk at the right edge as a background image; placeholder colour is `--gray-7` (above 4.5:1). Still a demo: it is not wired to a mailing list

### News

#### Added

- **News item** — "Tay Cities Region Innovation Opportunities - Cross Sector" (`news/tay-cities-region-innovation-opportunities-cross-sector.mdx`), dated 21 May 2026 from the live news listing, with its banner image

---

## 2026-10-08

### Astro 7.3.7

#### Changed

- Updated `astro` to `^7.3.7`, `@astrojs/mdx` to `^8.0.3`, `@astrojs/netlify` to `^8.2.8`, `jsdom`, `oxfmt` and the pinned pnpm version
- Reformatted `two_column.css` selectors (oxfmt); no behaviour change

---

## 2026-10-02

### AI discoverability (`llms.txt`, `robots.txt`)

#### Added

- **`astro-llms-md`** — Generates `llms.txt` and a markdown copy of every page (`/about.md`, ...) at build. Site name and description set; forms and asides stripped; paginated listing pages (`/news/2`, `/events/2`, ...) excluded. `llms-full.txt` is switched off (it was ~600KB)
- **HTTP `Link` header** (`public/_headers`) — Advertises `/llms.txt`, the sitemap and the RSS feed on every response

#### Changed

- **`robots.txt`** — Explicitly allows AI search and assistant crawlers (GPTBot, ClaudeBot, PerplexityBot, and others) and blocks only Bytespider. No `Content-Signal` line. Same approach as pythonresources.com, which gets referrals from AI agents this way

### Cookie consent & privacy

#### Added

- **`ConsentBanner.astro`** — Cookie banner using Google consent mode (ported from historyofphuket.com, simplified). Analytics are denied by default and `gtag.js` is only requested after "Accept analytics"; "Reject" or no choice means no Google request and no cookies. The choice is stored in `localStorage` (guarded for private windows)
- **Cookie settings** — A `[data-consent-settings]` control in the footer and on the privacy page clears the stored choice, revokes consent and reopens the banner
- **Privacy policy** (`/privacy-policy/`) — Linked from the banner and footer. The text is a draft adapted from the Phuket site and should be reviewed by Digital Dundee before launch

#### Changed

- **`Basehead.astro`** — Google Analytics is now consent-gated (`window.grantConsent` / `window.revokeConsent`) instead of loading on every page

#### Fixed

- **Nested `<main>`** — The layout `<main>` introduced below wrapped pages that already had their own `<main>`; page-level `<main class="wrapper flow">` is now `<div class="wrapper flow">` on all 30 pages

### Accessibility, performance & security

#### Added

- **Hero video controls** (`Video.astro`) — Pause/play button for the background video and rotating word; starts paused for `prefers-reduced-motion`; poster frame (`public/videos/background-poster.jpg`) and `aria-hidden` on the video
- **Security headers** (`public/_headers`) — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` (`max-age=300` to start; raise once HTTPS is confirmed everywhere) and `Permissions-Policy`

#### Changed

- **Partytown removed** — `@astrojs/partytown` dropped; `gtag.js` loads with `defer` (now consent-gated, see above)
- **`aria-label="Main"`** on the main nav; `:focus-visible` outline on dropdown links
- **Redundant `aria-required`** removed where `required` is set (`ContactForm.astro`, `FormFooter.astro`)
- **Italic font preload** (Open Sans Italic) removed from `Basehead.astro`; it is not needed above the fold
- **JSON-LD** — `<` is escaped as `\u003c` in `JsonLd.astro` output

#### Fixed

- **Home page paragraph colour** — `index.astro` had a malformed `oklch(...)` value that browsers discarded; now `var(--color-text)` (also clears the 4.5:1 contrast threshold)

### Modern CSS (from the starter template's `modern-web-guidance` pass)

#### Added

- **Cascade layers** — `style.css` declares `reset, base, theme, components, utilities` and imports each file into its layer
- **Skip link and `<main id="content">`** — `BaseLayout.astro` now wraps content in a focusable `<main>`; skip link is the first child of the header; new `utilities/visually-hidden.css`
- **Native cross-document view transitions** — `@view-transition { navigation: auto }` (off for `prefers-reduced-motion`) and `<link rel="expect" href="#content" blocking="render">` replace `ClientRouter`. Company logo `transition:name` props became inline `view-transition-name` styles
- **Forced-colors** borders on the header and footer

#### Changed

- **Sass removed** — `_reset.scss`, `_layout.scss` and `_globals.scss` are now `_reset.css`, `_layout.css` and `_tokens.css` (`globals` renamed to `tokens`); `//` comments converted; `sass` dependency dropped
- **Reduced motion** — removed the global `0.01ms` animation clamp from the reset
- **`compositions/grid.css`** — `@media screen(md)` / `screen(lg)` replaced with `(min-width: 768px)` / `(min-width: 1024px)`; the `screen()` form broke the production build under Astro 7
- **`CLAUDE.md`** — Updated for the file renames, plain CSS, and full-page-load navigation (no `astro:after-swap`)

---

## 2026-05-08 (styling)

### Layout & footer styling

#### Fixed

- **Overlay/split sections broken by `Picture`** (`two_column.css`) — `<Picture>` renders `<picture>` (wrapping `<img>`), but the grid placement rules only matched `> img`, so the "Opening doors for digital do-ers" background images fell out of the layout. Selectors now use `:is(img, picture)` and `:not(img):not(picture)`; `picture` is `display: block` and its inner `img` fills it

#### Changed

- **Footer** (`Footer.astro`) — Two-column CSS grid (signup form left; news archive and "Connect With Us" social icons right) replacing the `full-width-split-screen` layout; copyright bar is text only
- **Signup form** (`FormFooter.astro`) — Heading, "indicates required" note, light inputs with focus ring, uppercase labels, solid "Subscribe" button. Demo only: it is not wired to a mailing list
- **News archive pills** (`NewsArchive.astro`) — Wrap onto multiple rows, fixed the `--grey-3` typo, link colour inherits, clearer outline and hover state
- **Home** — "Find Out More" in the second overlay panel is now a link to `/be-dundee`; `Hero.astro` reformatted (no behaviour change)

---

## 2026-05-08 (metadata and social links)

### Site Metadata & Social Links

#### Added

- **`siteMetadata` config** (`src/config/siteMetadata.ts`) — Single source of truth for all site-wide data: name, description, URL, contact details, Google Analytics measurement ID, address, navigation menu, and social links
  - Typed interfaces: `SiteMetadata`, `MenuItem`, `SocialLink`, `SiteAddress`
  - `getSocialLinksForDisplay()` — filters social links flagged for UI rendering
  - `getSocialLinksForJsonLd()` — filters social links for Schema.org `sameAs`
  - Social links configured: Twitter/X, Facebook, RSS feed
- **`SocialLinks` component** (`src/components/page/SocialLinks.astro`) — Renders social icon links in the footer using `astro-icon`; icons sized with `--step-2`, hover transition on colour
- **`@config/*` path alias** (`tsconfig.json`) — Maps `@config/*` → `src/config/*`

#### Changed

- **`HeaderNav.astro`** — Navigation `links` array moved out of the component into `siteMetadata.menu`; icon names migrated from `ri:*` to `mdi:*` (`mdi:menu`, `mdi:close`, `mdi:chevron-down`)
- **`Footer.astro`** — `SocialLinks` component added above copyright; site name now sourced from `siteMetadata.name` instead of being hardcoded
- **`Basehead.astro`** — Google Analytics `measurement ID` sourced from `siteMetadata.measurementId`; both `<script>` tags now use `is:inline` with `define:vars` to pass the ID at build time
- **`schema.ts`** — `SITE_URL`, organisation name, description, phone, email, address, and `sameAs` social URLs all sourced from `siteMetadata`; removes duplicated hardcoded values

---

## 2026-05-08 (images)

### Image Format Improvements

#### Changed

- **Replaced `Image` with `Picture` component across all templates**
  - All image components now output `avif` and `webp` `<source>` elements with the original format as fallback
  - Affected files: `Hero.astro`, `SectionSample.astro`, `cards/Event.astro`, `cards/News.astro`, `cards/Resource.astro`, `cards/Success.astro`, `cards/Company.astro`, `pages/index.astro`, `pages/events/[id].astro`, `pages/resources/[id].astro`, `pages/meet-companies/[id].astro`
  - Removed unused `Image` import from `pages/success-stories/[id].astro`

- **SVG-aware image rendering** (`cards/Company.astro`, `pages/meet-companies/[id].astro`)
  - SVG logos are rendered with `Image` (no format conversion) since Astro cannot rasterise SVGs to avif/webp
  - Raster logos use `Picture` with `formats={['avif', 'webp']}` as before
  - `LogoPending` SVG fallback in the company card is now rendered as an inline SVG component instead of being passed through `Picture`

#### Fixed

- **GIF logos converted to PNG** — Astro's image pipeline does not support GIF as a source format; five company logos were converted and their MDX references updated:
  - `broker-insights-limited` → `broker-logo.gif` → `.png`
  - `game-options-ltd` → `new_gameops1_4x1_0.gif` → `.png`
  - `imsat` → `logo_0.gif` → `.png`
  - `pixel-resources-limited` → `customlogo_0_0.gif` → `.png`
  - `lowtek-games` → `lowtek-logo-2018-black-small3_0.gif` → `.png`

### Astro 6.3.1 Upgrade

#### Changed

- Updated Astro to 6.3.1 and related dependencies

---

## 2026-04-13

### Tooling

#### Added

- **oxfmt** — Added `.oxfmtrc.json` config and `oxfmt` npm script for Astro file formatting
- **Astro Robots Text** (`@astrojs/robots-txt`) — Auto-generates `robots.txt` at build time; integrated into `astro.config.mjs`

#### Changed

- Updated Biome config and package scripts

---

## 2026-02-27

### Prep for Astro 6

#### Added

- **PostCSS config** (`postcss.config.mjs`) — Added PostCSS pipeline in preparation for Astro 6 upgrade

#### Changed

- Updated dependencies in `package.json` ahead of Astro 6 migration

---

## 2026-02-14

### Animations & Styling

#### Added

- **astro-animations** — Integrated `astro-animations` package; homepage sections now use `data-animate` attributes for scroll-triggered slide/fade animations
- **Button styles** (`/src/styles/blocks/btn.css`) — New `.btn` block styles
- **Utility classes:**
  - `/src/styles/utilities/centered.css` — `.centered` utility
  - `/src/styles/utilities/pill.css` — `.pill` modifier for rounded buttons

#### Changed

- **Homepage** (`/src/pages/index.astro`) — Replaced `NewsArchive` section with animated `RecentNews` and `UpcomingEvents` sections; applied animation directives to hero text and content sections

---

## 2026-01-30

### Astro 5.17 Upgrade

#### Changed

- Updated Astro to 5.17 and related dependencies (`package.json`)
- Minor wrapper and two-column layout CSS tweaks

---

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

### Link Checking

#### Added

- **Company link checker script** (`/scripts/check-company-links.ts`)
  - Checks all company website URLs from content collection
  - Reads MDX files directly (no Astro dependency)
  - HTTP HEAD requests with 10-second timeout
  - 100ms delay between requests to avoid rate limiting
  - Reports HTTP status codes for each URL
  - Generates CSV report with results

- **npm scripts** (`package.json`)
  - `check-links` - Check all site links with linkinator (includes social media skip)
  - `check-links-companies` - Check only company website URLs and generate CSV report

- **Link check report** (`company-links-report.csv`)
  - CSV format with columns: Company, URL, Status, Result
  - Automatically generated when running company link check
  - Added to `.gitignore`

#### Dependencies

- **linkinator** (v7.5.1) - Web crawler for checking broken links
  - Used for full site link checking
  - Skips social media platforms (LinkedIn, Twitter, Facebook, YouTube) to avoid false positives

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
