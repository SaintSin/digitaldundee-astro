import type { CollectionEntry } from 'astro:content';

export function getUniqueSectors(
  companies: CollectionEntry<'companies'>[],
): string[] {
  const sectors = new Set<string>();

  companies.forEach((company) => {
    if (company.data.sector) {
      company.data.sector.forEach((s) => sectors.add(s));
    }
  });

  return Array.from(sectors).sort();
}

export function getUniqueServiceAreas(
  companies: CollectionEntry<'companies'>[],
): string[] {
  const serviceAreas = new Set<string>();

  companies.forEach((company) => {
    if (company.data.serviceArea) {
      company.data.serviceArea.forEach((sa) => serviceAreas.add(sa));
    }
  });

  return Array.from(serviceAreas).sort();
}
