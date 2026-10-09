'use strict';
/* Quick lookup: node lvl.js 词 词 … → each word's lowest HSK level, or how it segments. */
const { data, segment } = require('./lib/hsk');
const { lex } = data();
for (const q of process.argv.slice(2)) {
  const e = lex.get(q);
  if (e) { console.log(`${q}\tHSK ${e.hsk}\t${e.p}\t${e.m}`); continue; }
  console.log(`${q}\t(not a list word) → ${segment(q, 1).map((t) => `${t.w}${t.kind === 'ok' ? '' : '[' + (t.hsk ? 'HSK' + t.hsk : t.kind) + ']'}`).join(' ')}`);
}
