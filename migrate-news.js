import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  copyFileSync,
} from 'fs';
import { join, dirname, basename, extname } from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const SOURCE_DIR =
  '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com/news';
const CONTENT_DIR = join(__dirname, 'src/content/news');
const ASSETS_DIR = join(__dirname, 'src/assets/images');

// Ensure directories exist
if (!existsSync(CONTENT_DIR)) {
  mkdirSync(CONTENT_DIR, { recursive: true });
}
if (!existsSync(ASSETS_DIR)) {
  mkdirSync(ASSETS_DIR, { recursive: true });
}

// Replace spaces with hyphens in filename
function sanitizeFilename(filename) {
  return filename.replace(/\s+/g, '-');
}

// Extract text content and clean it
function cleanText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

// Convert HTML to basic markdown with image handling
function htmlToMarkdown(html, imageMap) {
  if (!html) return '';

  // First, handle images - check if they exist before converting
  let md = html.replace(/<img[^>]*>/gi, (match) => {
    const srcMatch = match.match(/src="([^"]*)"/i);
    const altMatch = match.match(/alt="([^"]*)"/i);

    if (srcMatch) {
      const originalSrc = srcMatch[1];
      const cleanSrc = originalSrc.split('?')[0]; // Remove query params
      const alt = altMatch ? altMatch[1] : '';

      // Check if image file exists
      let imagePath = cleanSrc;
      if (cleanSrc.startsWith('/')) {
        imagePath =
          '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com' +
          cleanSrc;
      }

      // Only include image if it exists, otherwise skip it
      if (existsSync(imagePath)) {
        const sanitizedName = sanitizeFilename(basename(cleanSrc));

        // Store in imageMap for later reference
        if (imageMap) {
          imageMap.set(originalSrc, sanitizedName);
        }

        // Copy the image
        const destPath = join(ASSETS_DIR, sanitizedName);
        if (!existsSync(destPath)) {
          try {
            copyFileSync(imagePath, destPath);
            console.log(`  Copied inline image: ${sanitizedName}`);
          } catch (err) {
            console.error(`  Failed to copy inline image:`, err.message);
          }
        }

        // Return markdown image syntax
        return `\n\n![${alt}](../../assets/images/${sanitizedName})\n\n`;
      }
    }
    // Image doesn't exist or no src, remove it
    return '';
  });

  // Simple conversions
  md = md
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>|<\/ol>/gi, '\n')
    .replace(/<div[^>]*>|<\/div>/gi, '')
    .replace(/<span[^>]*>|<\/span>/gi, '')
    .replace(/<dt[^>]*>|<\/dt>/gi, '')
    .replace(/<dd[^>]*>|<\/dd>/gi, '')
    .replace(/<dl[^>]*>|<\/dl>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&pound;/gi, '£');

  // Clean up extra whitespace and standalone "Image" labels
  md = md
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\n\s*Image\s*\n/g, '\n')
    .trim();

  return md;
}

// Process images in content
function processContentImages(contentHtml, baseDir) {
  const dom = new JSDOM(contentHtml);
  const images = dom.window.document.querySelectorAll('img');
  const copiedImages = [];

  images.forEach((img) => {
    let src = img.getAttribute('src');
    if (!src) return;

    // Remove query parameters
    const cleanSrc = src.split('?')[0];

    // Handle relative and absolute URLs
    let imagePath = cleanSrc;
    if (cleanSrc.startsWith('/')) {
      imagePath =
        '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com' +
        cleanSrc;
    } else if (cleanSrc.startsWith('http')) {
      // Skip external URLs
      return;
    }

    if (existsSync(imagePath)) {
      const ext = extname(cleanSrc);
      const originalName = basename(cleanSrc, ext);
      const sanitizedName = sanitizeFilename(originalName) + ext;
      const destPath = join(ASSETS_DIR, sanitizedName);

      // Copy image if it doesn't exist
      if (!existsSync(destPath)) {
        try {
          copyFileSync(imagePath, destPath);
          console.log(`  Copied inline image: ${sanitizedName}`);
        } catch (err) {
          console.error(
            `  Failed to copy inline image ${imagePath}:`,
            err.message,
          );
        }
      }

      copiedImages.push({
        original: src,
        sanitized: sanitizedName,
        alt: img.getAttribute('alt') || '',
        title: img.getAttribute('title') || '',
      });
    }
  });

  return copiedImages;
}

// Parse HTML file and extract article data
function parseArticle(htmlPath, filename) {
  console.log(`\nProcessing: ${filename}`);

  try {
    const html = readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Extract title
    const titleEl = doc.querySelector('h1');
    const title = titleEl
      ? cleanText(titleEl.textContent)
      : filename.replace(/-/g, ' ');

    // Extract meta description for SEO
    const metaDesc = doc.querySelector('meta[name="description"]');
    const description = metaDesc ? metaDesc.getAttribute('content') : '';

    // Extract date
    const timeEl = doc.querySelector('time[datetime]');
    let pubDate = new Date();
    if (timeEl) {
      const datetime = timeEl.getAttribute('datetime');
      pubDate = new Date(datetime);
    }

    // Extract main content
    const articleEl =
      doc.querySelector('article.node--type-news') ||
      doc.querySelector('article');
    let content = '';
    let imagePrimary = {
      src: 'placeholder.jpg',
      alt: title,
    };

    if (articleEl) {
      // Find primary image
      const mainImg = articleEl.querySelector('img');
      if (mainImg) {
        const imgSrc = mainImg.getAttribute('src');
        const imgAlt = mainImg.getAttribute('alt') || title;

        // Process the image
        if (imgSrc) {
          // Remove query parameters (like ?itok=xyz) from the image source
          const cleanSrc = imgSrc.split('?')[0];
          const ext = extname(cleanSrc);
          const originalName = basename(cleanSrc, ext);
          const sanitizedName = sanitizeFilename(originalName) + ext;

          imagePrimary = {
            src: sanitizedName,
            alt: cleanText(imgAlt),
          };

          // Try to copy the image
          const possiblePaths = [
            join(dirname(htmlPath), imgSrc),
            join(dirname(htmlPath), '..', imgSrc),
            '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com' +
              imgSrc,
          ];

          for (const imgPath of possiblePaths) {
            if (existsSync(imgPath)) {
              const destPath = join(ASSETS_DIR, sanitizedName);
              if (!existsSync(destPath)) {
                try {
                  copyFileSync(imgPath, destPath);
                  console.log(`  Copied primary image: ${sanitizedName}`);
                } catch (err) {
                  console.error(`  Failed to copy primary image:`, err.message);
                }
              }
              break;
            }
          }
        }
      }

      // Extract content paragraphs
      const contentEl = articleEl.querySelector(
        '.field--type-text-with-summary, .node__content, .field--name-body',
      );
      if (contentEl) {
        // First, process and copy all images from the content
        const imageMap = new Map();
        processContentImages(contentEl.innerHTML, dirname(htmlPath));

        // Then convert HTML to markdown with image handling
        content = htmlToMarkdown(contentEl.innerHTML, imageMap);
      }
    }

    // Create excerpt from description or first paragraph
    let excerpt = description || content.split('\n\n')[0] || '';
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...';
    }

    // Generate frontmatter
    const frontmatter = {
      title,
      pubDate: pubDate.toISOString().split('T')[0],
      excerpt,
      seo: {
        title: title,
        description: description || excerpt,
        ogImage: imagePrimary.src,
      },
      imagePrimary,
    };

    return {
      frontmatter,
      content,
    };
  } catch (err) {
    console.error(`Error parsing ${filename}:`, err.message);
    return null;
  }
}

// Generate MDX file
function generateMDX(data, outputPath) {
  const { frontmatter, content } = data;

  const yaml = `---
title: ${JSON.stringify(frontmatter.title)}
pubDate: ${frontmatter.pubDate}
excerpt: ${JSON.stringify(frontmatter.excerpt)}
seo:
  title: ${JSON.stringify(frontmatter.seo.title)}
  description: ${JSON.stringify(frontmatter.seo.description)}
  ogImage: ${JSON.stringify(frontmatter.seo.ogImage)}
imagePrimary:
  src: ${JSON.stringify(frontmatter.imagePrimary.src)}
  alt: ${JSON.stringify(frontmatter.imagePrimary.alt)}
---

${content}
`;

  writeFileSync(outputPath, yaml, 'utf-8');
  console.log(`  Created: ${basename(outputPath)}`);
}

// Main migration function
async function migrate() {
  console.log('Starting news migration...\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Content: ${CONTENT_DIR}`);
  console.log(`Assets: ${ASSETS_DIR}\n`);

  const files = readdirSync(SOURCE_DIR);
  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    // Skip directories and non-article files
    if (file.startsWith('.') || file.includes('?page=')) {
      skipped++;
      continue;
    }

    const sourcePath = join(SOURCE_DIR, file);
    const outputPath = join(CONTENT_DIR, `${file}.mdx`);

    // Skip if already exists
    if (existsSync(outputPath)) {
      console.log(`Skipping (exists): ${file}`);
      skipped++;
      continue;
    }

    const articleData = parseArticle(sourcePath, file);

    if (articleData) {
      generateMDX(articleData, outputPath);
      processed++;
    } else {
      skipped++;
    }
  }

  console.log(`\n✓ Migration complete!`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${files.length}`);
}

// Run migration
migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
