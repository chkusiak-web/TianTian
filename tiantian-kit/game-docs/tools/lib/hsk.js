'use strict';
/* Shared helpers for the game-docs analysis scripts. Reads 天天's data (read-only) and never writes to it.
   Reference folder: $TIANTIAN_REF, or ../../tiantian-reference relative to game-docs/tools/. */
const path = require('path');
const fs = require('fs');

const REF = process.env.TIANTIAN_REF || path.join(__dirname, '..', '..', '..', 'tiantian-reference');
const APP = path.join(REF, 'app');
const HAN = /[㐀-鿿]/;

function loadGlobal(file) {
  // 天天's data files assign to window.X; run them in a sandbox object instead of the real global.
  const vm = require('vm');
  const sandbox = { window: {} };
  sandbox.window.window = sandbox.window;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox.window, { filename: file });
  return sandbox.window;
}

let cache = null;
function data() {
  if (cache) return cache;
  const words = loadGlobal(path.join(APP, 'data', 'words.js')).WORDS;
  const topics = loadGlobal(path.join(APP, 'data', 'topics.js')).WORD_TOPICS;
  const lex = new Map();   // word → lowest-level entry
  for (const w of words) { const o = lex.get(w.h); if (!o || w.hsk < o.hsk) lex.set(w.h, w); }
  cache = { words, topics, lex };
  return cache;
}

/* Segment Chinese text into words, minimising unknown characters (×1000), words above the level (×50)
   and the number of tokens (same method as 天天's build/check_stories.js).
   extra: Map(word → kind) of allowed non-HSK items (names, glossary, particles). */
function segment(text, level, extra = new Map()) {
  const { lex } = data();
  const s = [...text], n = s.length, MAXLEN = 6;
  const best = Array(n + 1).fill(null); best[0] = { cost: 0, toks: [] };
  for (let i = 0; i < n; i++) {
    if (!best[i]) continue;
    const relax = (j, c, tok) => {
      const cand = { cost: best[i].cost + c, toks: tok ? [...best[i].toks, tok] : best[i].toks };
      if (!best[j] || cand.cost < best[j].cost) best[j] = cand;
    };
    if (!HAN.test(s[i])) { relax(i + 1, 0, null); continue; }
    for (let L = 1; L <= MAXLEN && i + L <= n; L++) {
      const chunk = s.slice(i, i + L);
      if (!chunk.every((c) => HAN.test(c))) break;
      const w = chunk.join('');
      if (extra.has(w)) relax(i + L, 1, { w, kind: extra.get(w) });
      else if (lex.has(w)) { const e = lex.get(w); relax(i + L, 1 + (e.hsk > level ? 50 : 0), { w, kind: e.hsk > level ? 'over' : 'ok', id: e.id, hsk: e.hsk }); }
      else if (L === 1) relax(i + 1, 1000, { w, kind: 'unknown' });
    }
  }
  return best[n].toks;
}

module.exports = { REF, APP, HAN, data, segment, loadGlobal };
