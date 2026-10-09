// npm run check: every Chinese string a player can see in content/*.js must pass the HSK 1 + lexicon rule.
// Exits 1 on any miss, so `npm test` and the build fail.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkContent } from './lib/zhcheck.js';
import { checkBeatRules } from './lib/beatrules.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../content');
const SKIP = new Set(['names.js']);
let total = 0; const problems = [];

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js') && !SKIP.has(x))) {
  const data = (await import(pathToFileURL(path.join(dir, f)).href)).default;
  const r = checkContent(data, f); total += r.count; problems.push(...r.problems);
  problems.push(...checkBeatRules(data, f));
}
// every Chinese character in the game must be in the subset font (src/fonts), or it shows in a fallback font
const root = path.join(dir, '..');
const covered = new Set(fs.readFileSync(path.join(root, 'src/fonts/zh-chars.txt'), 'utf8'));
const sources = [...fs.readdirSync(dir).map((f) => path.join(dir, f)), ...fs.readdirSync(path.join(root, 'src'), { recursive: true }).filter((f) => f.endsWith('.js') && !/strokes|hanzi-writer/.test(f)).map((f) => path.join(root, 'src', f))];
const missing = new Set();
for (const f of sources) for (const c of fs.readFileSync(f, 'utf8')) { const n = c.codePointAt(0); if (n > 0x3400 && n < 0x9fff && !covered.has(c)) missing.add(c); }
if (missing.size) problems.push(`Not in the subset font: ${[...missing].join('')}. Run: python3 tools/subset-fonts.py`);
problems.forEach((p) => console.log('✗ ' + p));
console.log(`\n${total} player strings checked, ${problems.length} problem(s).`);
process.exit(problems.length ? 1 : 0);
