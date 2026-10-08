import type { ImageMetadata } from 'astro';

/**
 * Card images are shown in a fixed-ratio box and cropped (`object-fit: cover`).
 * Logos and banners (very wide) or posters (portrait) would lose most of their
 * content that way, so they are shown whole instead (`data-fit="contain"`).
 */
const WIDEST = 2.6;
const NARROWEST = 0.9;

export function cardFit(src?: ImageMetadata): 'contain' | undefined {
  if (!src?.width || !src.height) return undefined;
  const ratio = src.width / src.height;
  return ratio > WIDEST || ratio < NARROWEST ? 'contain' : undefined;
}
