import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPANIES_DIR = path.join(__dirname, '../src/content/companies');

interface Company {
  id: string;
  title: string;
  companyUrl?: string;
}

function extractCompanyData(filePath: string): Company | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const id = path.basename(filePath, '.mdx');

    // Extract title
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : id;

    // Extract companyUrl (with or without quotes)
    const urlMatch = content.match(/companyUrl:\s*["']?([^\s"'\n]+)["']?/);
    const companyUrl = urlMatch ? urlMatch[1] : undefined;

    return { id, title, companyUrl };
  } catch (error) {
    console.warn(`Failed to read ${filePath}:`, error);
    return null;
  }
}

function getCompanies(): Company[] {
  if (!fs.existsSync(COMPANIES_DIR)) {
    console.error(`Companies directory not found: ${COMPANIES_DIR}`);
    return [];
  }

  const files = fs.readdirSync(COMPANIES_DIR);
  const companies: Company[] = [];

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const filePath = path.join(COMPANIES_DIR, file);
    const company = extractCompanyData(filePath);

    if (company) {
      companies.push(company);
    }
  }

  return companies;
}

async function checkCompanyLinks() {
  console.log('🔍 Checking company website links...\n');

  const companies = getCompanies();
  const results: { name: string; url: string; status: number; ok: boolean }[] =
    [];

  let checked = 0;
  let failed = 0;
  let noUrl = 0;

  for (const company of companies) {
    const url = company.companyUrl;
    if (!url) {
      console.log(`⚠️  ${company.title} - No URL`);
      noUrl++;
      continue;
    }

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const ok = response.ok;
      results.push({
        name: company.title,
        url,
        status: response.status,
        ok,
      });

      if (ok) {
        console.log(`✓ ${company.title} - ${response.status}`);
      } else {
        console.log(`✗ ${company.title} - ${response.status} ${url}`);
        failed++;
      }

      checked++;
    } catch (error) {
      console.log(
        `✗ ${company.title} - ERROR: ${error instanceof Error ? error.message : 'Unknown error'} - ${url}`,
      );
      results.push({
        name: company.title,
        url,
        status: 0,
        ok: false,
      });
      failed++;
      checked++;
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Summary:`);
  console.log(`Total companies: ${companies.length}`);
  console.log(`Companies with URLs: ${checked}`);
  console.log(`Companies without URLs: ${noUrl}`);
  console.log(`Failed: ${failed}`);
  console.log(
    `Success rate: ${checked > 0 ? (((checked - failed) / checked) * 100).toFixed(1) : 0}%`,
  );

  // List all failed links
  if (failed > 0) {
    console.log(`\n❌ Failed links:`);
    results
      .filter((r) => !r.ok)
      .forEach((r) => {
        console.log(`   ${r.name} (${r.status || 'ERROR'}): ${r.url}`);
      });
  }

  // Write results to CSV
  const csvPath = path.join(__dirname, '../company-links-report.csv');
  const csvHeader = 'Company,URL,Status,Result\n';
  const csvRows = results
    .map((r) => {
      const company = r.name.replace(/"/g, '""'); // Escape quotes
      const status = r.status || 'ERROR';
      const result = r.ok ? 'OK' : 'FAILED';
      return `"${company}","${r.url}",${status},${result}`;
    })
    .join('\n');

  fs.writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
  console.log(`\n📄 Report saved to: ${csvPath}`);
}

checkCompanyLinks().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
