// src/utils/imageFit.ts
import type { ImageMetadata } from 'astro';

/**
 * Conditional styling for card images, decided at build time from the image's
 * real dimensions and exposed as data attributes for card.css:
 *
 *   data-fit="contain"  squares, portraits and very wide banners: shown whole
 *                       instead of being cropped to the card's ratio
 *   data-size="small"   narrower than a card: never scaled up past its own size
 *
 * Everything else is cropped to the card's ratio (`object-fit: cover`).
 */
const WIDEST = 2.6;
const NARROWEST = 1.2;
const CARD_WIDTH = 360; // px, a card at desktop width

export function cardImage(src?: ImageMetadata) {
  if (!src?.width || !src.height) return {};
  const ratio = src.width / src.height;
  return {
    'data-fit': ratio > WIDEST || ratio < NARROWEST ? 'contain' : undefined,
    'data-size': src.width < CARD_WIDTH ? 'small' : undefined,
  };
}
