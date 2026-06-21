import design from '@/data/test-design.json';

// Cache-busting version for fixed-name OG assets (/og/*.png). Bump on any OG redesign:
// the homelab Cloudflare token can't purge cache, so we change the URL instead.
export const ASSET_VER = '2';

// Single source of truth = the discovery design spec (copied into the app at src/data).
export const TEST = design;
export const AXES = design.axes;
export const QUESTIONS = design.questions;
export const CHARACTERS = design.characters;
export const CODES = CHARACTERS.map((c) => c.code);

export function getCharacter(code) {
  return CHARACTERS.find((c) => c.code === code);
}
