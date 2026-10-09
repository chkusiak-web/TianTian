// 天天 · Stories checker + index builder.
// usage: node build/check_stories.js [--quiet]
// Validates every story in app/data/stories/*.js and writes app/data/stories-index.js
// (the HSK word ids each story uses, so the app can tell how much of it you already know).
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', 'app');
global.window = global;
require(APP + '/data/words.js');
require(APP + '/data/jinan.js');
window.STORIES = [];
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);   // e.g. --only=hsk2 checks just those files (no index written)
const files = fs.readdirSync(APP + '/data/stories').filter((f) => f.endsWith('.js') && (!ONLY || f.startsWith(ONLY))).sort();
for (const f of files) require(APP + '/data/stories/' + f);
const QUIET = process.argv.includes('--quiet');

const LEX = new Map();   // word → lowest HSK level entry
for (const w of WORDS) { const o = LEX.get(w.h); if (!o || w.hsk < o.hsk) LEX.set(w.h, w); }
const CHAR_IDS = new Set(JINAN.characters.map((c) => c.id));
const HAN = /[㐀-鿿]/;
const MAXLEN = 6;

// Segment a Chinese string, minimising: unknown chars (×1000), words above the level (×50), number of tokens.
function segment(text, level, extra) {
  const s = [...text], n = s.length;
  const best = Array(n + 1).fill(null); best[0] = { cost: 0, toks: [] };
  for (let i = 0; i < n; i++) {
    if (!best[i]) continue;
    if (!HAN.test(s[i])) { relax(i + 1, 0, null); continue; }
    for (let L = 1; L <= MAXLEN && i + L <= n; L++) {
      const w = s.slice(i, i + L).join('');
      if (!s.slice(i, i + L).every((c) => HAN.test(c))) break;
      if (extra.has(w)) relax(i + L, 1, { w, kind: extra.get(w) });
      else if (LEX.has(w)) { const e = LEX.get(w); relax(i + L, 1 + (e.hsk > level ? 50 : 0), { w, kind: e.hsk > level ? 'over' : 'ok', id: e.id, hsk: e.hsk }); }
      else if (L === 1) relax(i + 1, 1000, { w, kind: 'unknown' });
    }
    function relax(j, c, tok) {
      const cand = { cost: best[i].cost + c, toks: tok ? [...best[i].toks, tok] : best[i].toks };
      if (!best[j] || cand.cost < best[j].cost) best[j] = cand;
    }
  }
  return best[n].toks;
}

let errors = 0, warnings = 0;
const index = {};
const ids = new Set();
const byLevel = {}, byChar = {};
for (const st of STORIES) {
  const err = (m) => { errors++; console.log(`  ERROR ${st.id}: ${m}`); };
  const warn = (m) => { warnings++; if (!QUIET) console.log(`  warn  ${st.id}: ${m}`); };
  if (!st.id || ids.has(st.id)) { err('missing or duplicate id'); continue; }
  ids.add(st.id);
  const L = st.hsk;
  if (![1, 2, 3].includes(L)) err('hsk must be 1, 2 or 3');
  byLevel[L] = (byLevel[L] || 0) + 1;
  (st.chars || []).forEach((c) => { if (!CHAR_IDS.has(c)) err(`unknown character id ${c}`); byChar[c] = (byChar[c] || 0) + 1; });
  if (!Array.isArray(st.title) || st.title.length !== 2) err('title must be [zh, en]');
  const extra = new Map();
  (st.names || []).forEach((x) => extra.set(x, 'name'));
  (st.new || []).forEach(([h, p, m]) => {
    if (!h || !p || !m) err(`new word needs [zh, pinyin, english]: ${h}`);
    const e = LEX.get(h);
    if (e && e.hsk <= L) err(`new word ${h} is already HSK ${e.hsk} (not new at this level)`);
    extra.set(h, 'new');
  });
  if ((st.new || []).length > 3) err('at most 3 new words');
  const text = st.text || [];
  if (text.length < 8 || text.length > 15) err(`text has ${text.length} sentences (want 8–15)`);
  const full = text.map((x) => x[0]).join('');
  (st.new || []).forEach(([h]) => { if (!full.includes(h)) err(`new word ${h} never appears in the text`); });
  const used = new Set();
  const check = (zh, where) => {
    for (const t of segment(zh, L, extra)) {
      if (t.kind === 'unknown') err(`${where}: "${t.w}" is not an HSK word (in "${zh}") — rephrase, or add it to new/names`);
      else if (t.kind === 'over') err(`${where}: ${t.w} is HSK ${t.hsk}, above HSK ${L} (in "${zh}") — rephrase, or make it one of the new words`);
      else if (t.id !== undefined && where.startsWith('text')) used.add(t.id);
    }
  };
  text.forEach(([zh, en], i) => { if (!zh || !en) err(`text[${i}] needs [zh, en]`); else check(zh, `text[${i}]`); });
  // chunks: phrases that appear in the text
  const chunks = st.chunks || [];
  if (chunks.length < 3 || chunks.length > 6) err(`${chunks.length} chunks (want 3–6)`);
  chunks.forEach(([zh, en, note], i) => {
    if (!zh || !en) err(`chunk ${i} needs [zh, en, note]`);
    else if (!full.includes(zh)) err(`chunk ${zh} doesn't appear in the text`);
    if ([...(zh || '')].length < 2) warn(`chunk ${zh} is a single character; chunks should be phrases`);
  });
  // comprehension questions (Chinese, at level)
  const qs = st.qs || [];
  if (qs.length < 3 || qs.length > 4) err(`${qs.length} questions (want 3–4)`);
  qs.forEach((q, i) => {
    if (!q.q || !Array.isArray(q.o) || q.o.length !== 3 || typeof q.a !== 'number' || !q.o[q.a]) err(`qs[${i}] needs {q, o:[3 options], a}`);
    else { check(q.q, `qs[${i}]`); q.o.forEach((o, k) => check(o, `qs[${i}].o[${k}]`)); if (new Set(q.o).size !== 3) err(`qs[${i}] has duplicate options`); }
  });
  // blanks: chunks / collocations in context
  const blanks = st.blanks || [];
  if (blanks.length < 5 || blanks.length > 8) err(`${blanks.length} blanks (want 5–8)`);
  const perSentence = {};
  blanks.forEach((b, i) => {
    const s = text[b.s];
    if (!s) return err(`blanks[${i}] points to a missing sentence ${b.s}`);
    if (!b.t || !s[0].includes(b.t)) return err(`blanks[${i}] "${b.t}" is not in text[${b.s}] "${s[0]}"`);
    if (s[0].split(b.t).length > 2) warn(`blanks[${i}] "${b.t}" appears twice in its sentence; the first is blanked`);
    if (!Array.isArray(b.d) || b.d.length !== 3 || new Set([b.t, ...b.d]).size !== 4) err(`blanks[${i}] needs 3 distinct distractors different from the answer`);
    else b.d.forEach((x, k) => check(x, `blanks[${i}].d[${k}]`));
    perSentence[b.s] = (perSentence[b.s] || 0) + 1;
    if ([...b.t].length < 2) warn(`blanks[${i}] "${b.t}" is a single character; prefer a word or chunk`);
  });
  Object.entries(perSentence).forEach(([s, n]) => { if (n > 1) err(`text[${s}] has ${n} blanks (max 1 per sentence)`); });
  // summary
  const chars = [...full].filter((c) => HAN.test(c)).length;
  if (!QUIET) console.log(`${st.id.padEnd(22)} HSK ${L} · ${text.length} sentences · ${chars} chars · ${used.size} words · new: ${(st.new || []).map((x) => x[0]).join('、') || '–'}`);
  index[st.id] = [...used];
}
console.log(`\n${STORIES.length} stories · by level ${JSON.stringify(byLevel)} · by character ${JSON.stringify(byChar)}`);
console.log(`${errors} errors, ${warnings} warnings`);
if (!ONLY) fs.writeFileSync(APP + '/data/stories-index.js', '/* generated by build/check_stories.js: HSK word ids used by each story */\nwindow.STORY_WORDS = ' + JSON.stringify(index) + ';\n');
process.exit(errors ? 1 : 0);
