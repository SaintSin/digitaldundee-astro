import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public/rss-images');
const CONTENT_DIR = path.join(__dirname, '../src/content');
const ASSETS_DIR = path.join(__dirname, '../src/assets');
const RSS_IMAGE_MAX_WIDTH = 600; // Max width for RSS feed images

// Ensure output directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

interface ContentItem {
  id: string;
  imagePath?: string;
}

function extractImagePath(content: string): string | undefined {
  // Look for imagePrimary src with relative path (e.g., ../../assets/images/file.png)
  const match = content.match(/imagePrimary:\s*\n?\s*src:\s*([^\n]+)/);
  if (!match) return undefined;

  const srcLine = match[1].trim();

  // Check if it's a relative path (with or without quotes)
  if (srcLine.startsWith('../')) {
    // Relative path like ../../assets/images/file.png
    return srcLine.replace('../..', '');
  }

  // Extract path from quotes
  const pathMatch = srcLine.match(/['"](\.\.\/.*?)['"]/);
  if (pathMatch) {
    return pathMatch[1].replace('../..', '');
  }

  // Check for import statement pattern
  const importMatch = content.match(/imagePrimary:\s*\{\s*src:\s*(\w+)/);
  if (importMatch) {
    const varName = importMatch[1];
    const importStatement = content.match(
      new RegExp(`import\\s+${varName}\\s+from\\s+['"]([^'"]+)['"]`),
    );
    if (importStatement) {
      return importStatement[1];
    }
  }

  return undefined;
}

function getContentItems(collectionName: string): ContentItem[] {
  const collectionPath = path.join(CONTENT_DIR, collectionName);
  if (!fs.existsSync(collectionPath)) return [];

  const items: ContentItem[] = [];
  const files = fs.readdirSync(collectionPath);

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const filePath = path.join(collectionPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = file.replace('.mdx', '');
    const imagePath = extractImagePath(content);

    items.push({ id, imagePath });
  }

  return items;
}

async function processImage(
  imagePath: string,
  outputPath: string,
): Promise<boolean> {
  try {
    // Resolve the image path - it's already relative to src/ (e.g., /assets/images/file.png)
    const resolvedPath = path.join(__dirname, '..', 'src', imagePath);

    if (!fs.existsSync(resolvedPath)) {
      console.warn(`⚠️  Image not found: ${resolvedPath}`);
      return false;
    }

    const image = sharp(resolvedPath);
    const metadata = await image.metadata();

    // Only resize if image is wider than max width
    if (metadata.width && metadata.width > RSS_IMAGE_MAX_WIDTH) {
      await image
        .resize(RSS_IMAGE_MAX_WIDTH, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
    } else {
      // Keep original size, just optimize
      await image.jpeg({ quality: 85 }).toFile(outputPath);
    }

    return true;
  } catch (error) {
    console.warn(`⚠️  Failed to process image: ${error}`);
    return false;
  }
}

async function generateRssImages() {
  console.log('🖼️  Generating RSS feed images...');

  let processed = 0;
  let skipped = 0;

  // Process news articles
  const news = getContentItems('news');
  for (const article of news) {
    const outputPath = path.join(PUBLIC_DIR, `news-${article.id}.jpg`);

    if (fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    if (article.imagePath) {
      const success = await processImage(article.imagePath, outputPath);
      if (success) processed++;
    }
  }

  // Process events
  const events = getContentItems('events');
  for (const event of events) {
    const outputPath = path.join(PUBLIC_DIR, `event-${event.id}.jpg`);

    if (fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    if (event.imagePath) {
      const success = await processImage(event.imagePath, outputPath);
      if (success) processed++;
    }
  }

  // Process success stories
  const successStories = getContentItems('success-stories');
  for (const story of successStories) {
    const outputPath = path.join(PUBLIC_DIR, `success-${story.id}.jpg`);

    if (fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    if (story.imagePath) {
      const success = await processImage(story.imagePath, outputPath);
      if (success) processed++;
    }
  }

  console.log(
    `✅ Generated ${processed} RSS images, skipped ${skipped} existing`,
  );
}

generateRssImages().catch((error) => {
  console.error('❌ Error generating RSS images:', error);
  process.exit(1);
});
