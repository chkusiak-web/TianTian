// Everything the hover/click layer and the dictionary know about a Chinese word:
// the HSK list (天天's words.js), the taught words, names, particles and the one fixed expression.
import WORDS from './vendor/words.js';
import LX from '../content/lexicon.json';
import { NAME_EN, PARTICLE_EN, FIXED_EN } from '../content/names.js';
import { pinyin } from './vendor/pinyin-pro.js';

export const HAN = /[\u3400-\u9fff]/;

const byHan = new Map();   // word -> entry (lowest HSK level wins)
for (const w of WORDS) { const o = byHan.get(w.h); if (!o || w.hsk < o.hsk) byHan.set(w.h, w); }

export const pyPlain = (s) => { try { return pinyin(s, { toneType: 'symbol', type: 'string' }); } catch { return ''; } };

// Extra (non-HSK) entries get ids like "x:泉" so they can live in the same save maps as HSK ids.
const extras = new Map();
const addExtra = (h, p, m, kind, district) => extras.set(h, { id: 'x:' + h, h, p, m, all: m, hsk: 0, kind, district });
LX.districtOrder.forEach((d) => LX.taught[d].forEach(([h, p, m]) => addExtra(h, p, m, 'taught', d)));
LX.names.forEach((h) => addExtra(h, pyPlain(h), NAME_EN[h] || 'name', 'name'));
LX.particles.forEach((h) => addExtra(h, pyPlain(h), PARTICLE_EN[h] || 'particle', 'particle'));
(LX.fixed || []).forEach((h) => addExtra(h, pyPlain(h), FIXED_EN[h] || h, 'fixed'));

export const lookup = (h) => byHan.get(h) || extras.get(h) || null;
export const byId = (() => { const m = new Map(); WORDS.forEach((w) => m.set(String(w.id), w)); extras.forEach((e) => m.set(e.id, e)); return (id) => m.get(String(id)) || null; })();
export const allWords = () => WORDS;
export const taughtOf = (district) => (LX.taught[district] || []).map(([h]) => extras.get(h));
export const districtOrder = LX.districtOrder;

// Greedy longest-match split into words, as 天天 does for hover.
export function splitWords(text) {
  const s = [...text], out = []; let i = 0;
  while (i < s.length) {
    if (!HAN.test(s[i])) { let j = i; while (j < s.length && !HAN.test(s[j])) j++; out.push({ t: s.slice(i, j).join('') }); i = j; continue; }
    let len = Math.min(6, s.length - i);
    while (len > 1 && !lookup(s.slice(i, i + len).join(''))) len--;
    const w = s.slice(i, i + len).join('');
    out.push({ t: w, w: true }); i += len;
  }
  return out;
}

export const pinyinOf = (h) => { const e = lookup(h); return e ? e.p : pyPlain(h); };
export const englishOf = (h) => { const e = lookup(h); return e ? e.m : ''; };

// Dictionary search, ported from 天天's dictSearch (hanzi, pinyin with or without tone numbers, or English).
const strip = (s) => String(s || '').toLowerCase().replace(/ü|u:/g, 'v').replace(/\s+/g, '');
let index = null;
const buildIndex = () => (index ||= [...WORDS, ...extras.values()].map((w) => {
  const num = strip(w.n || w.p).replace(/5/g, '');
  return { w, num, plain: num.replace(/\d/g, ''), m: String(w.m || '').toLowerCase(), all: String(w.all || '').toLowerCase() };
}));
export function search(raw) {
  const q = raw.trim(); if (!q) return [];
  const out = [];
  if (HAN.test(q)) {
    for (const e of buildIndex()) {
      const h = e.w.h; let sc = 0;
      if (h === q) sc = 100; else if (h.startsWith(q)) sc = 80 - (h.length - q.length); else if (h.includes(q)) sc = 60 - (h.length - q.length); else if (q.includes(h) && h.length > 1) sc = 50 + h.length;
      if (sc) out.push([sc, e]);
    }
  } else {
    let qn = q.toLowerCase();
    try { if (/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(qn)) qn = pinyin(qn, { toneType: 'num', type: 'string' }); } catch { /* keep as typed */ }
    qn = qn.replace(/ü|u:/g, 'v').replace(/\s+/g, '').replace(/5/g, '');
    const tones = /\d/.test(qn), qp = qn.replace(/\d/g, ''), ql = q.toLowerCase().trim();
    const wordRx = new RegExp(`(^|[^a-z])${ql.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`);
    for (const e of buildIndex()) {
      let sc = 0;
      if (/^[a-z\dv:]+$/.test(qn)) {
        if (tones) { if (e.num === qn) sc = 95; else if (e.num.startsWith(qn)) sc = 68; }
        else if (e.plain === qp) sc = 90; else if (qp.length >= 2 && e.plain.startsWith(qp)) sc = 62;
      }
      const glosses = e.m.split(/[;,]/).map((x) => x.trim().replace(/^to /, ''));
      if (glosses.includes(ql) || glosses.includes(ql.replace(/^to /, ''))) sc = Math.max(sc, 92);
      else if (wordRx.test(e.m)) sc = Math.max(sc, 74);
      else if (ql.length >= 3 && wordRx.test(e.all)) sc = Math.max(sc, 54);
      if (sc) out.push([sc, e]);
    }
  }
  return out.sort((a, b) => b[0] - a[0] || (a[1].w.hsk || 9) - (b[1].w.hsk || 9) || a[1].w.h.length - b[1].w.h.length).slice(0, 40).map((x) => x[1].w);
}
