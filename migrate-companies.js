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
  '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com/meet-companies';
const CONTENT_DIR = join(__dirname, 'src/content/companies');
const ASSETS_DIR = join(__dirname, 'src/assets/images/companies');

// Ensure directories exist
if (!existsSync(CONTENT_DIR)) {
  mkdirSync(CONTENT_DIR, { recursive: true });
}
if (!existsSync(ASSETS_DIR)) {
  mkdirSync(ASSETS_DIR, { recursive: true });
}

// Replace spaces with hyphens in filename and decode URL encoding
function sanitizeFilename(filename) {
  // Decode URL encoding (e.g., %20 to space)
  const decoded = decodeURIComponent(filename);
  // Replace spaces with hyphens
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
          // Handle redirects
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

// Extract taxonomy term text from link
function extractTaxonomyTerms(doc, fieldSelector) {
  const terms = [];
  const fieldEl = doc.querySelector(fieldSelector);

  if (fieldEl) {
    const links = fieldEl.querySelectorAll('.field--item a');
    links.forEach((link) => {
      const term = cleanText(link.textContent);
      if (term) {
        terms.push(term);
      }
    });
  }

  return terms;
}

// Parse HTML file and extract company data
async function parseCompany(htmlPath, filename) {
  console.log(`\nProcessing: ${filename}`);

  try {
    const html = readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Extract title from h1 or meta
    let title = '';
    const h1El = doc.querySelector('h1');
    if (h1El) {
      title = cleanText(h1El.textContent);
    } else {
      // Fallback to filename with proper formatting
      title = filename
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Extract company URL
    let companyUrl = '';
    const urlField = doc.querySelector('.field--name-field-company-url a');
    if (urlField) {
      companyUrl = urlField.getAttribute('href') || '';
    }

    // Extract logo
    let logo = null;
    const logoImg = doc.querySelector('.field--name-field-company-logo img');
    if (logoImg) {
      const imgSrc = logoImg.getAttribute('src');
      const imgAlt = logoImg.getAttribute('alt') || title;

      if (imgSrc) {
        // Remove query parameters (like ?itok=xyz)
        const cleanSrc = imgSrc.split('?')[0];
        const ext = extname(cleanSrc);
        const originalName = basename(cleanSrc, ext);
        const sanitizedName = sanitizeFilename(originalName) + ext;

        logo = {
          src: sanitizedName,
          alt: cleanText(imgAlt),
        };

        // Try to copy the logo
        const destPath = join(ASSETS_DIR, sanitizedName);
        let logoCopied = false;

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
                console.log(`  Copied logo: ${sanitizedName}`);
                logoCopied = true;
                break;
              } catch (err) {
                console.error(`  Failed to copy logo:`, err.message);
              }
            }
          }

          // If not found locally, try downloading from website
          if (!logoCopied) {
            const imageUrl = `https://digitaldundee.com${cleanSrc}`;
            try {
              await downloadImage(imageUrl, destPath);
              console.log(`  Downloaded logo: ${sanitizedName}`);
              logoCopied = true;
            } catch (err) {
              console.error(
                `  Failed to download logo from ${imageUrl}:`,
                err.message,
              );
            }
          }
        } else {
          logoCopied = true;
        }

        // If logo couldn't be copied/downloaded, set to null
        if (!logoCopied) {
          logo = null;
        }
      }
    }

    // Extract sector(s)
    const sector = extractTaxonomyTerms(
      doc,
      '.field--name-field-company-sector',
    );

    // Extract service area(s)
    const serviceArea = extractTaxonomyTerms(
      doc,
      '.field--name-field-company-service-area',
    );

    return {
      title,
      companyUrl,
      logo,
      sector,
      serviceArea,
    };
  } catch (err) {
    console.error(`Error parsing ${filename}:`, err.message);
    return null;
  }
}

// Generate MDX file
function generateMDX(data, outputPath) {
  const { title, companyUrl, logo, sector, serviceArea } = data;

  // Build frontmatter
  let frontmatter = `---
title: ${JSON.stringify(title)}`;

  if (companyUrl) {
    frontmatter += `
companyUrl: ${JSON.stringify(companyUrl)}`;
  }

  if (logo) {
    frontmatter += `
logo:
  src: ../../assets/images/companies/${logo.src}
  alt: ${JSON.stringify(logo.alt)}`;
  }

  // Add sector array
  if (sector.length > 0) {
    frontmatter += `
sector:`;
    sector.forEach((term) => {
      frontmatter += `
  - ${JSON.stringify(term)}`;
    });
  } else {
    frontmatter += `
sector: []`;
  }

  // Add service area array if present
  if (serviceArea.length > 0) {
    frontmatter += `
serviceArea:`;
    serviceArea.forEach((term) => {
      frontmatter += `
  - ${JSON.stringify(term)}`;
    });
  }

  frontmatter += `
---
`;

  writeFileSync(outputPath, frontmatter, 'utf-8');
  console.log(`  Created: ${basename(outputPath)}`);
}

// Main migration function
async function migrate() {
  console.log('Starting companies migration...\n');
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

    const companyData = await parseCompany(sourcePath, file);

    if (companyData) {
      generateMDX(companyData, outputPath);
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
