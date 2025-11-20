#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Base directory for news listing files
const newsDir =
  '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee.com';

// Object to store the mapping
const newsDateMapping = {};

// Function to parse date from DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Function to extract slug from URL
function extractSlug(url) {
  const match = url.match(/\/news\/(.+)/);
  return match ? match[1] : null;
}

// Function to parse a single news listing page
function parseNewsPage(pageNumber) {
  const filename = join(newsDir, `news?page=${pageNumber}`);

  if (!existsSync(filename)) {
    console.log(`File not found: ${filename}`);
    return;
  }

  console.log(`Processing: news?page=${pageNumber}`);
  const content = readFileSync(filename, 'utf-8');

  // Regular expression to match article blocks
  // Matches the entire card structure with URL and date
  const articlePattern =
    /<a href="https:\/\/digitaldundee\.com\/news\/([^"]+)"[\s\S]*?<time datetime="[^"]+">(\d{2}\/\d{2}\/\d{4})<\/time>/g;

  let match;
  let count = 0;

  while ((match = articlePattern.exec(content)) !== null) {
    const slug = match[1];
    const dateString = match[2];
    const isoDate = parseDate(dateString);

    // Store in mapping
    if (slug && dateString) {
      newsDateMapping[slug] = isoDate;
      count++;
      console.log(`  Found: ${slug} -> ${dateString} (${isoDate})`);
    }
  }

  console.log(`  Total articles found: ${count}\n`);
}

// Process all 15 pages (0-14)
console.log('Starting extraction of news article dates...\n');

for (let i = 0; i <= 14; i++) {
  parseNewsPage(i);
}

// Sort the mapping by slug for easier reading
const sortedMapping = Object.keys(newsDateMapping)
  .sort()
  .reduce((acc, key) => {
    acc[key] = newsDateMapping[key];
    return acc;
  }, {});

// Save to JSON file in the project root
const outputPath =
  '/Users/stjohn/Documents/GitHub/Astro/Sites/Digital Dundee/digitaldundee-astro/news-dates-mapping.json';
writeFileSync(outputPath, JSON.stringify(sortedMapping, null, 2), 'utf-8');

console.log(`\n✓ Extraction complete!`);
console.log(`  Total articles: ${Object.keys(newsDateMapping).length}`);
console.log(`  Output file: ${outputPath}`);
