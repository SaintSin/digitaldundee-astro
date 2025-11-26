import fs from 'fs';
import https from 'https';
import { parse } from 'node-html-parser';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const OLD_SITE_PATH =
  '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com';
const IMAGES_DIR = './src/assets/images/success-stories';
const CONTENT_DIR = './src/content/success-stories';

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Get success stories from directory listing
function getSuccessStories() {
  const successStoryDir = path.join(OLD_SITE_PATH, 'success-story');
  if (!fs.existsSync(successStoryDir)) {
    console.error(`Directory not found: ${successStoryDir}`);
    return [];
  }
  return fs.readdirSync(successStoryDir).filter((file) => {
    // Filter out any system files
    return !file.startsWith('.') && file !== 'index.html';
  });
}

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function extractImageAlt(imgElement) {
  const alt = imgElement.getAttribute('alt');
  const title = imgElement.getAttribute('title');
  return alt || title || 'Success story image';
}

function sanitizeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sanitizeImageFilename(filename) {
  // Split filename into name and extension
  const lastDotIndex = filename.lastIndexOf('.');
  const name =
    lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const ext = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';

  // Sanitize the name part (keep case for readability, replace spaces with hyphens)
  const sanitizedName = name.replace(/\s+/g, '-');

  return sanitizedName + ext;
}

async function downloadImage(url, filepath) {
  // Convert relative URLs to absolute
  const fullUrl = url.startsWith('http')
    ? url
    : `https://digitaldundee.com${url}`;

  return new Promise((resolve, reject) => {
    https
      .get(fullUrl, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filepath);
          streamPipeline(response, fileStream)
            .then(() => resolve(filepath))
            .catch(reject);
        } else {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

function htmlToMarkdown(htmlContent) {
  // Simple HTML to Markdown conversion
  let markdown = htmlContent;

  // Remove excessive inline styles
  markdown = markdown.replace(/ style="[^"]*"/g, '');
  markdown = markdown.replace(/ class="[^"]*"/g, '');
  markdown = markdown.replace(/ data-[^=]*="[^"]*"/g, '');

  // Convert headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n### $1\n\n');

  // Convert links (before removing other tags)
  markdown = markdown.replace(
    /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    '[$2]($1)',
  );

  // Convert bold (before removing other tags)
  markdown = markdown.replace(
    /<(?:strong|b)[^>]*>(.*?)<\/(?:strong|b)>/gi,
    '**$1**',
  );

  // Convert italic (before removing other tags)
  markdown = markdown.replace(/<(?:em|i)[^>]*>(.*?)<\/(?:em|i)>/gi, '*$1*');

  // Convert paragraphs - IMPORTANT: keep double line breaks
  markdown = markdown.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  markdown = markdown.replace(/<p[^>]*>/gi, '');
  markdown = markdown.replace(/<\/p>/gi, '\n\n');

  // Convert divs that act as paragraphs
  markdown = markdown.replace(
    /<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>\s*<div[^>]*>/gi,
    '\n\n',
  );
  markdown = markdown.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi,
    '\n\n',
  );

  // Remove other HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&apos;/g, "'");
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');

  // Clean up excessive whitespace but preserve paragraph breaks
  markdown = markdown.replace(/[ \t]+/g, ' '); // Multiple spaces to single space
  markdown = markdown.replace(/\n[ \t]+/g, '\n'); // Remove leading spaces on lines
  markdown = markdown.replace(/[ \t]+\n/g, '\n'); // Remove trailing spaces on lines
  markdown = markdown.replace(/\n\n\n+/g, '\n\n'); // Max two line breaks

  return markdown.trim();
}

async function processSuccessStory(slug) {
  console.log(`\n📄 Processing: ${slug}`);

  const htmlPath = path.join(OLD_SITE_PATH, 'success-story', slug);

  if (!fs.existsSync(htmlPath)) {
    console.log(`   ⚠️  File not found: ${htmlPath}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const root = parse(html);

  // Extract title
  const titleElement = root.querySelector('h1');
  const title = titleElement
    ? cleanText(titleElement.text)
    : slug.replace(/-/g, ' ');

  console.log(`   ✓ Title: ${title}`);

  // Extract main content
  const contentElement = root.querySelector('article.success-story .content');

  if (!contentElement) {
    console.log(`   ⚠️  No content found`);
    return;
  }

  // Extract primary image
  const primaryImageElement = contentElement.querySelector(
    '.field--name-field-success-story-image img',
  );
  let primaryImagePath = null;
  let primaryImageAlt = 'Success story';

  if (primaryImageElement) {
    const imgSrc = primaryImageElement.getAttribute('src');
    const imgAlt = extractImageAlt(primaryImageElement);
    primaryImageAlt = imgAlt;

    if (imgSrc) {
      const decodedFileName = decodeURIComponent(
        path.basename(imgSrc.split('?')[0]),
      );
      const imgFileName = sanitizeImageFilename(decodedFileName);
      const localImgPath = path.join(IMAGES_DIR, imgFileName);

      try {
        await downloadImage(imgSrc, localImgPath);
        primaryImagePath = imgFileName;
        console.log(`   ✓ Downloaded primary image: ${imgFileName}`);
      } catch (err) {
        console.log(`   ⚠️  Failed to download primary image: ${err.message}`);
      }
    }
  }

  // Extract body content
  const bodyElement = contentElement.querySelector('.field--name-body');
  let bodyContent = '';
  let imageCounter = 0;

  if (bodyElement) {
    // Find all images in the body
    const images = bodyElement.querySelectorAll('img');
    const imageMap = new Map();

    for (const img of images) {
      const imgSrc = img.getAttribute('src');
      if (imgSrc) {
        const decodedFileName = decodeURIComponent(
          path.basename(imgSrc.split('?')[0]),
        );
        const imgFileName = sanitizeImageFilename(decodedFileName);
        const localImgPath = path.join(IMAGES_DIR, imgFileName);

        try {
          await downloadImage(imgSrc, localImgPath);
          const imgAlt = extractImageAlt(img);
          imageMap.set(imgSrc, { fileName: imgFileName, alt: imgAlt });
          imageCounter++;
          console.log(
            `   ✓ Downloaded body image ${imageCounter}: ${imgFileName}`,
          );
        } catch (err) {
          console.log(`   ⚠️  Failed to download body image: ${err.message}`);
        }
      }
    }

    // Process paragraphs individually to maintain structure
    const paragraphs = bodyElement.querySelectorAll('p');
    const contentParts = [];

    for (const para of paragraphs) {
      // Get text content from paragraph
      const paraText = para.textContent.trim();

      if (paraText) {
        // Handle bold/strong tags
        const strongElements = para.querySelectorAll('strong, b');
        let paraHtml = para.innerHTML;

        // Replace strong tags with markdown bold
        for (const strong of strongElements) {
          const strongText = strong.textContent;
          const strongHtml = strong.toString();
          paraHtml = paraHtml.replace(strongHtml, `**${strongText}**`);
        }

        // Handle links
        const links = para.querySelectorAll('a');
        for (const link of links) {
          const linkText = link.textContent;
          const href = link.getAttribute('href');
          const linkHtml = link.toString();
          if (href) {
            paraHtml = paraHtml.replace(linkHtml, `[${linkText}](${href})`);
          }
        }

        // Remove all remaining HTML tags and decode entities
        paraHtml = paraHtml.replace(/<[^>]+>/g, '');
        paraHtml = paraHtml.replace(/&nbsp;/g, ' ');
        paraHtml = paraHtml.replace(/&amp;/g, '&');
        paraHtml = paraHtml.replace(/&quot;/g, '"');
        paraHtml = paraHtml.replace(/&apos;/g, "'");
        paraHtml = paraHtml.replace(/&lt;/g, '<');
        paraHtml = paraHtml.replace(/&gt;/g, '>');
        paraHtml = paraHtml.replace(/\s+/g, ' ').trim();

        if (paraHtml) {
          contentParts.push(paraHtml);
        }
      }
    }

    // Handle images that appear between paragraphs
    for (const [oldSrc, { fileName, alt }] of imageMap) {
      const mdxImage = `\n\n![${alt}](../../assets/images/success-stories/${fileName})\n\n`;
      contentParts.push(mdxImage.trim());
    }

    bodyContent = contentParts.join('\n\n');
  }

  // Extract excerpt (first paragraph of content)
  const firstPara = bodyElement?.querySelector('p');
  const excerpt = firstPara
    ? cleanText(firstPara.text).substring(0, 200) + '...'
    : '';

  // Create frontmatter
  const frontmatter = {
    title,
    pubDate: new Date().toISOString().split('T')[0], // Default to today, can be updated manually
    excerpt,
    imagePrimary: primaryImagePath
      ? {
          src: `../../assets/images/success-stories/${primaryImagePath}`,
          alt: primaryImageAlt,
        }
      : null,
    seo: {
      title,
      description: excerpt,
      ogImage: primaryImagePath || '',
    },
  };

  // Generate MDX file
  const mdxContent = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
pubDate: ${frontmatter.pubDate}
excerpt: "${frontmatter.excerpt.replace(/"/g, '\\"')}"
${
  frontmatter.imagePrimary
    ? `imagePrimary:
  src: ${frontmatter.imagePrimary.src}
  alt: "${frontmatter.imagePrimary.alt}"`
    : ''
}
seo:
  title: "${frontmatter.seo.title.replace(/"/g, '\\"')}"
  description: "${frontmatter.seo.description.replace(/"/g, '\\"')}"
  ogImage: "${frontmatter.seo.ogImage}"
---

${bodyContent}
`;

  // Write MDX file with sanitized filename
  const sanitizedSlug = sanitizeSlug(slug);
  const mdxPath = path.join(CONTENT_DIR, `${sanitizedSlug}.mdx`);
  fs.writeFileSync(mdxPath, mdxContent);
  console.log(`   ✓ Created: ${sanitizedSlug}.mdx`);
  console.log(
    `   ✓ Images: ${imageCounter + (primaryImagePath ? 1 : 0)} downloaded`,
  );
}

async function migrateAll() {
  console.log('🚀 Starting success stories migration...\n');
  console.log(`📂 Old site path: ${OLD_SITE_PATH}`);
  console.log(`📂 Images directory: ${IMAGES_DIR}`);
  console.log(`📂 Content directory: ${CONTENT_DIR}`);

  const successStories = getSuccessStories();
  console.log(`📊 Found ${successStories.length} success stories\n`);

  for (const slug of successStories) {
    try {
      await processSuccessStory(slug);
    } catch (error) {
      console.error(`❌ Error processing ${slug}:`, error.message);
    }
  }

  console.log('\n✅ Migration complete!');
}

// Run migration
migrateAll().catch(console.error);
