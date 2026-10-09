'use strict';
/* Checks the Chinese a player will see, inside game-docs Markdown files.
   usage: node check-zh.js ../CONCEPT.md [more.md …]

   What gets checked: every string in 「corner brackets」. Other Chinese in the docs (labels for designers,
   later cities' notes) is not player text and is not checked.
   Context markers (HTML comments) set the rule for the 「…」 that follow:
     <!-- zh:baotu -->  … <!-- zh:hospital -->   Jinan, inside that district's arc: HSK 1 + names + particles
                                                  + taught words of that district and earlier ones
     <!-- zh:jinan -->                           Jinan, anywhere: HSK 1 + names + particles + all taught words (default)
     <!-- zh:chengdu --> / shanghai / beijing    HSK 2 / 3 / 4 + names + particles
     <!-- zh:off -->                             not checked
   Exit code 1 if anything fails. */
const fs = require('fs');
const path = require('path');
const { segment } = require('./lib/hsk');
const LX = require('./jinan-lexicon.json');

const CITY_LEVEL = { jinan: 1, chengdu: 2, shanghai: 3, beijing: 4 };
function allowed(ctx) {
  const m = new Map();
  LX.names.forEach((w) => m.set(w, 'name'));
  LX.particles.forEach((w) => m.set(w, 'particle'));
  (LX.fixed || []).forEach((w) => m.set(w, 'fixed'));
  const order = LX.districtOrder;
  const upto = order.includes(ctx) ? order.indexOf(ctx) : (ctx === 'jinan' || CITY_LEVEL[ctx] > 1 ? order.length - 1 : -1);
  for (let i = 0; i <= upto; i++) LX.taught[order[i]].forEach(([w]) => m.set(w, 'taught:' + order[i]));
  return m;
}
const levelOf = (ctx) => (CITY_LEVEL[ctx] || 1);

let fails = 0, checked = 0;
const usedTaught = {};
for (const file of process.argv.slice(2)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let ctx = 'jinan';
  lines.forEach((line, i) => {
    for (const mk of line.matchAll(/<!--\s*zh:(\w+)\s*-->/g)) ctx = mk[1];
    if (ctx === 'off') return;
    for (const m of line.matchAll(/「([^」]*)」/g)) {
      checked++;
      const toks = segment(m[1], levelOf(ctx), allowed(ctx));
      const bad = toks.filter((t) => t.kind === 'over' || t.kind === 'unknown');
      toks.filter((t) => String(t.kind).startsWith('taught')).forEach((t) => (usedTaught[t.w] = (usedTaught[t.w] || 0) + 1));
      if (bad.length) {
        fails++;
        console.log(`${path.basename(file)}:${i + 1} [${ctx}] 「${m[1]}」 → ${bad.map((t) => `${t.w} (${t.kind === 'over' ? 'HSK ' + t.hsk : 'not in list'})`).join(', ')}`);
      }
    }
  });
}
console.log(`\n${checked} player strings checked, ${fails} failed.`);
console.log('Taught words used: ' + (Object.entries(usedTaught).map(([w, n]) => `${w}×${n}`).join(' ') || '–'));
process.exit(fails ? 1 : 0);
