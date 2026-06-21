import design from '@/data/test-design.json';

// Single source of truth = the discovery design spec (copied into the app at src/data).
export const TEST = design;
export const AXES = design.axes;
export const QUESTIONS = design.questions;
export const CHARACTERS = design.characters;
export const CODES = CHARACTERS.map((c) => c.code);

export function getCharacter(code) {
  return CHARACTERS.find((c) => c.code === code);
}
