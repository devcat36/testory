// Map a rarity percentage to a collectible-style label + style class.
export function rarityLabel(r) {
  if (r <= 7) return { label: '최고 레어', cls: 'r-legend' };
  if (r <= 11) return { label: '레어', cls: 'r-rare' };
  if (r <= 15) return { label: '언커먼', cls: 'r-uncommon' };
  return { label: '흔한 영혼', cls: 'r-common' };
}
