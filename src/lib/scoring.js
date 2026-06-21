// Sum each axis's two poles, take the larger pole, and assemble the character code.
// poleA -> segment "1", poleB -> segment "2"  (e.g. A1-B2-C1).
//
// By design each axis's total weight is odd (3-3-3), so poleA and poleB scores can
// never be equal — there are no ties. The `>=` fallback is a defensive default only.
export function scoreToCode(answers) {
  const totals = { A: { A: 0, B: 0 }, B: { A: 0, B: 0 }, C: { A: 0, B: 0 } };
  for (const a of answers) {
    totals[a.axis][a.pole] += a.weight;
  }
  const seg = (ax) => (totals[ax].A >= totals[ax].B ? '1' : '2');
  return `A${seg('A')}-B${seg('B')}-C${seg('C')}`;
}
