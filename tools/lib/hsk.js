// Word segmentation against 天天's HSK list (our copy in src/vendor/words.js). Same method as 天天's
// build/check_stories.js: minimise unknown characters (×1000), words above the level (×50) and token count.
import WORDS from '../../src/vendor/words.js';

export const HAN = /[㐀-鿿]/;
const lex = new Map();
for (const w of WORDS) { const o = lex.get(w.h); if (!o || w.hsk < o.hsk) lex.set(w.h, w); }
export const lexicon = lex;
export const hskOf = (h) => (lex.has(h) ? lex.get(h).hsk : null);

// extra: Map(word -> kind) of allowed non-HSK items (names, particles, taught words).
export function segment(text, level, extra = new Map()) {
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
