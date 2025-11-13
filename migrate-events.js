import {
  copyFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import http from 'http';
import https from 'https';
import { JSDOM } from 'jsdom';
import { basename, dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const SOURCE_DIR =
  '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com/events';
const CONTENT_DIR = join(__dirname, 'src/content/events');
const ASSETS_DIR = join(__dirname, 'src/assets/images/events');

// Ensure directories exist
if (!existsSync(CONTENT_DIR)) {
  mkdirSync(CONTENT_DIR, { recursive: true });
}
if (!existsSync(ASSETS_DIR)) {
  mkdirSync(ASSETS_DIR, { recursive: true });
}

// Replace spaces with hyphens in filename and decode URL encoding
function sanitizeFilename(filename) {
  const decoded = decodeURIComponent(filename);
  return decoded.replace(/\s+/g, '-');
}

// Download image from URL
async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = createWriteStream(destPath);
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(true);
          });
          fileStream.on('error', (err) => {
            try {
              unlinkSync(destPath);
            } catch (e) {
              // Ignore if file doesn't exist
            }
            reject(err);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          downloadImage(response.headers.location, destPath)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

// Extract text content and clean it
function cleanText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

// Convert HTML to basic markdown
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html
    // Remove style attributes and other inline attributes
    .replace(/\s*style="[^"]*"/gi, '')
    .replace(/\s*class="[^"]*"/gi, '')
    .replace(/\s*id="[^"]*"/gi, '')
    .replace(/\s*data-[^=]*="[^"]*"/gi, '')
    // Handle images
    .replace(/<img[^>]*>/gi, '')
    // Handle formatting
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
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
    .replace(/<blockquote[^>]*>|<\/blockquote>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&pound;/gi, '£')
    .replace(/&rsquo;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"');

  // Clean up extra whitespace
  md = md.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return md;
}

// Check if a string needs quotes in YAML
function needsQuotes(str) {
  const specialChars = /[:#{}[\]!|>&%@`]/;
  const startsWithSpecial = /^[-?:,[\]{}#&*!|>'"%@`]/;
  const booleanLike = /^(true|false|yes|no|on|off|null|~)$/i;
  const numberLike = /^[0-9]/;

  return (
    specialChars.test(str) ||
    startsWithSpecial.test(str) ||
    booleanLike.test(str) ||
    numberLike.test(str) ||
    str.includes('\n')
  );
}

// Format a string for YAML (with quotes only if needed)
function yamlString(str) {
  return needsQuotes(str) ? JSON.stringify(str) : str;
}

// Parse HTML file and extract event data
async function parseEvent(htmlPath, filename) {
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

    // Extract event description
    const descriptionEl = doc.querySelector(
      '.field--name-field-event-description',
    );
    let description = '';
    if (descriptionEl) {
      description = htmlToMarkdown(descriptionEl.innerHTML);
    }

    // Extract event dates and times
    const dateEl = doc.querySelector('.field--name-field-event-date time');
    let eventDate = new Date();
    let eventEndDate = null;
    let eventStartTime = null;
    let eventEndTime = null;

    if (dateEl) {
      const datetime = dateEl.getAttribute('datetime');
      const fullDate = new Date(datetime);
      eventDate = fullDate;

      // Extract time in HH:MM format
      const hours = fullDate.getUTCHours().toString().padStart(2, '0');
      const minutes = fullDate.getUTCMinutes().toString().padStart(2, '0');
      eventStartTime = `${hours}:${minutes}`;
    }

    // Check for end date and time
    const dateField = doc.querySelector('.field--name-field-event-date');
    if (dateField) {
      const times = dateField.querySelectorAll('time');
      if (times.length > 1) {
        const endDatetime = times[1].getAttribute('datetime');
        const fullEndDate = new Date(endDatetime);
        eventEndDate = fullEndDate;

        // Extract end time in HH:MM format
        const endHours = fullEndDate.getUTCHours().toString().padStart(2, '0');
        const endMinutes = fullEndDate
          .getUTCMinutes()
          .toString()
          .padStart(2, '0');
        eventEndTime = `${endHours}:${endMinutes}`;
      }
    }

    // Extract location
    let location = '';
    const locationEl = doc.querySelector('.field--name-field-event-location');
    if (locationEl) {
      location = cleanText(locationEl.textContent);
    }

    // Extract event URL
    let eventUrl = '';
    const urlEl = doc.querySelector('.field--name-field-event-url a');
    if (urlEl) {
      eventUrl = urlEl.getAttribute('href') || '';
    }

    // Extract event image
    let image = null;
    const imgEl = doc.querySelector('.field--name-field-event-image img');
    if (imgEl) {
      const imgSrc = imgEl.getAttribute('src');
      const imgAlt = imgEl.getAttribute('alt') || title;

      if (imgSrc) {
        const cleanSrc = imgSrc.split('?')[0];
        const ext = extname(cleanSrc);
        const originalName = basename(cleanSrc, ext);
        const sanitizedName = sanitizeFilename(originalName) + ext;

        image = {
          src: sanitizedName,
          alt: cleanText(imgAlt),
        };

        // Try to copy the image
        const destPath = join(ASSETS_DIR, sanitizedName);
        let imageCopied = false;

        if (!existsSync(destPath)) {
          const possiblePaths = [
            join(dirname(htmlPath), imgSrc),
            join(dirname(htmlPath), '..', imgSrc),
            '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com' +
              imgSrc,
          ];

          for (const imgPath of possiblePaths) {
            if (existsSync(imgPath)) {
              try {
                copyFileSync(imgPath, destPath);
                console.log(`  Copied image: ${sanitizedName}`);
                imageCopied = true;
                break;
              } catch (err) {
                console.error(`  Failed to copy image:`, err.message);
              }
            }
          }

          // If not found locally, try downloading from website
          if (!imageCopied) {
            const imageUrl = `https://digitaldundee.com${cleanSrc}`;
            try {
              await downloadImage(imageUrl, destPath);
              console.log(`  Downloaded image: ${sanitizedName}`);
              imageCopied = true;
            } catch (err) {
              console.error(
                `  Failed to download image from ${imageUrl}:`,
                err.message,
              );
            }
          }
        } else {
          imageCopied = true;
        }

        // If image couldn't be copied/downloaded, set to null
        if (!imageCopied) {
          image = null;
        }
      }
    }

    return {
      title,
      description,
      eventDate,
      eventEndDate,
      eventStartTime,
      eventEndTime,
      location,
      eventUrl,
      image,
    };
  } catch (err) {
    console.error(`Error parsing ${filename}:`, err.message);
    return null;
  }
}

// Generate MDX file
function generateMDX(data, outputPath) {
  const {
    title,
    description,
    eventDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    location,
    eventUrl,
    image,
  } = data;

  // Create excerpt from description (first 160 chars)
  const excerpt = description
    ? description.length > 160
      ? description.substring(0, 157) + '...'
      : description
    : '';

  // Build frontmatter
  let frontmatter = `---
title: ${yamlString(title)}
eventDate: ${eventDate.toISOString().split('T')[0]}`;

  if (eventEndDate) {
    frontmatter += `
eventEndDate: ${eventEndDate.toISOString().split('T')[0]}`;
  }

  if (eventStartTime) {
    frontmatter += `
eventStartTime: ${yamlString(eventStartTime)}`;
  }

  if (eventEndTime) {
    frontmatter += `
eventEndTime: ${yamlString(eventEndTime)}`;
  }

  if (location) {
    frontmatter += `
location: ${yamlString(location)}`;
  }

  if (eventUrl) {
    frontmatter += `
eventUrl: ${eventUrl}`;
  }

  // Add SEO section
  frontmatter += `
seo:
  title: ${yamlString(title)}
  description: ${yamlString(excerpt)}`;

  if (image) {
    frontmatter += `
  ogImage: ${image.src}`;
  }

  // Add imagePrimary
  if (image) {
    frontmatter += `
imagePrimary:
  src: ../../assets/images/events/${image.src}
  alt: ${yamlString(image.alt)}`;
  }

  if (description) {
    frontmatter += `
description: ${yamlString(excerpt)}`;
  }

  frontmatter += `
---

${description}
`;

  writeFileSync(outputPath, frontmatter, 'utf-8');
  console.log(`  Created: ${basename(outputPath)}`);
}

// Main migration function
async function migrate() {
  console.log('Starting events migration...\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Content: ${CONTENT_DIR}`);
  console.log(`Assets: ${ASSETS_DIR}\n`);

  const files = readdirSync(SOURCE_DIR);
  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    // Skip directories and hidden files
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

    const eventData = await parseEvent(sourcePath, file);

    if (eventData) {
      generateMDX(eventData, outputPath);
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
