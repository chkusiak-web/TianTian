// CONCEPT §6.10 rules that are cheap to check. Applies to content files that define `beats`.
// (The checks are filled in with the first real beat in checkpoint 3.)
export function checkBeatRules(data, name) {
  if (!Array.isArray(data.beats)) return [];
  return [];
}
