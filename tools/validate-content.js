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
problems.forEach((p) => console.log('✗ ' + p));
console.log(`\n${total} player strings checked, ${problems.length} problem(s).`);
process.exit(problems.length ? 1 : 0);
