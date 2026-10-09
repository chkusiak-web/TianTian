// Content check for player Chinese, adapted from check-zh.js. Works on strings in the data files instead of 「」 in Markdown.
// Allowed in Jinan text: HSK 1 words, names, particles, the fixed expression, and the taught words of this district and earlier ones.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { segment, HAN } from './hsk.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const LX = JSON.parse(fs.readFileSync(path.join(here, '../../content/lexicon.json'), 'utf8'));

export function allowedFor(district) {
  const m = new Map();
  LX.names.forEach((w) => m.set(w, 'name'));
  LX.particles.forEach((w) => m.set(w, 'particle'));
  (LX.fixed || []).forEach((w) => m.set(w, 'fixed'));
  const upto = LX.districtOrder.indexOf(district);
  if (upto < 0) throw new Error(`Unknown district "${district}"`);
  for (let i = 0; i <= upto; i++) LX.taught[LX.districtOrder[i]].forEach(([w]) => m.set(w, 'taught:' + LX.districtOrder[i]));
  return m;
}

// Returns the tokens that are not allowed (above HSK 1, or not in any list).
export function checkString(text, district, level = 1) {
  const toks = segment(text, level, allowedFor(district));
  return { toks, bad: toks.filter((t) => t.kind === 'over' || t.kind === 'unknown') };
}

// Visit every string that holds Chinese. Keys starting with "_" are designer notes and are skipped.
export function* playerStrings(node, trail = '') {
  if (typeof node === 'string') { if (HAN.test(node)) yield { path: trail, text: node }; return; }
  if (Array.isArray(node)) { for (let i = 0; i < node.length; i++) yield* playerStrings(node[i], `${trail}[${i}]`); return; }
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) if (!k.startsWith('_')) yield* playerStrings(v, trail ? `${trail}.${k}` : k);
}

export function checkContent(data, name = 'content') {
  const problems = []; let count = 0;
  for (const { path: p, text } of playerStrings(data)) {
    count++;
    const { bad } = checkString(text, data.district);
    if (bad.length) problems.push(`${name}:${p} 「${text}」 → ${bad.map((t) => `${t.w} (${t.kind === 'over' ? 'HSK ' + t.hsk : 'not in list'})`).join(', ')}`);
  }
  return { count, problems };
}
