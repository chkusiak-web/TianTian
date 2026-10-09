// Runtime view of a district's content: beats with their word entries, and district-aware word splitting
// (only the district's words, names and particles, so a notebook line splits the same way the validator counts it).
import { lookup, pyPlain, HAN } from './lexicon.js';
import LX from '../content/lexicon.json';

export function loadDistrict(data) {
  const entry = (h) => {
    const e = lookup(h);
    if (!e) throw new Error(`Word ${h} is not in the lexicon`);
    return { id: String(e.id), h: e.h, p: e.p || pyPlain(e.h), n: e.n || pyPlain(e.h), m: (e.m || '').split(/;\s*/)[0] || e.m, hsk: e.hsk, kind: e.kind };
  };
  const beats = data.beats.map((b) => ({ ...b, entries: b.words.map(entry) }));
  const all = beats.flatMap((b) => b.entries);
  const byH = new Map(all.map((e) => [e.h, e]));
  const free = new Set([...LX.names, ...LX.particles, ...(LX.fixed || [])]);

  // greedy longest match over the district's words and the free list; returns [{ t, e? , free? }]
  function split(text) {
    const s = [...text], out = []; let i = 0;
    while (i < s.length) {
      if (!HAN.test(s[i])) { let j = i; while (j < s.length && !HAN.test(s[j])) j++; out.push({ t: s.slice(i, j).join('') }); i = j; continue; }
      let len = Math.min(6, s.length - i), hit = null;
      for (; len >= 1; len--) {
        const w = s.slice(i, i + len).join('');
        if (byH.has(w)) { hit = { t: w, e: byH.get(w) }; break; }
        if (free.has(w)) { hit = { t: w, free: true }; break; }
      }
      if (!hit) hit = { t: s[i], free: true }, len = 1;
      out.push(hit); i += len;
    }
    return out;
  }
  const wordsIn = (text) => split(text).filter((x) => x.e).map((x) => x.e);

  return { data, beats, all, byH, split, wordsIn, cast: data.cast || {}, notebook: data.notebook };
}
