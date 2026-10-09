// CONCEPT §6.10 rules that are cheap to check, for content files that define `beats`:
//  - a scene only uses words of its own beat and earlier beats (plus names and particles), so only today's words are new
//  - each beat word appears at least twice in its scene and is caught by at least one prompt
//  - a prompt's caught words are in its answer, and the answer is one of the options
//  - text per beat (lines read or heard) is 40–150 characters
//  - the notebook page only uses the district's words, so it is fully readable at Payoff
//  - beat word sets match the approved plan (content/<district>-words.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { segment, HAN } from './hsk.js';
import { allowedFor } from './zhcheck.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const FREE = new Set(['name', 'particle', 'fixed']);
const hanCount = (s) => [...s].filter((c) => HAN.test(c)).length;

export const answerOf = (st) => (st.ask === 'build' ? st.tiles.join('') : st.answer);

// every Chinese string a player sees in a scene step; `count` says whether it counts as a use of the word
export function sceneStrings(steps) {
  const out = [];
  for (const st of steps) {
    if (st.zh) out.push({ text: st.zh, count: true, line: true });
    if (st.hear) out.push({ text: st.hear, count: false, line: true });
    for (const o of st.options || []) out.push({ text: o, count: true });
    for (const t of [...(st.tiles || []), ...(st.extra || [])]) out.push({ text: t, count: true });
  }
  return out.filter((x) => HAN.test(x.text));
}

// words that count for the rules: HSK and taught words, plus names that a beat teaches as a word (白 is also Dr. Bai's surname)
export function tokens(text, district, taughtAsWords = new Set()) {
  return segment(text, 1, allowedFor(district)).filter((t) => !FREE.has(t.kind) || taughtAsWords.has(t.w));
}

export function checkBeatRules(data, name) {
  if (!Array.isArray(data.beats)) return [];
  const P = [], d = data.district;
  const known = new Set();
  const all = new Set(data.beats.flatMap((b) => b.words));
  const tok = (text) => tokens(text, d, all);
  const plan = path.join(here, `../../content/${d}-words.json`);
  const planned = fs.existsSync(plan) ? JSON.parse(fs.readFileSync(plan, 'utf8')).beats : null;

  data.beats.forEach((b, bi) => {
    const own = new Set(b.words);
    if (planned) {
      const pb = planned.find((x) => x.id === b.id);
      if (!pb || pb.words.join() !== b.words.join()) P.push(`${name}: beat ${b.id} words differ from ${d}-words.json`);
    }
    b.words.forEach((w) => known.add(w));
    if (!b.scene) return;
    const at = `${name}: beat ${b.id}`;
    const strs = sceneStrings(b.scene.steps);

    // only words taught so far
    for (const s of strs) for (const t of tok(s.text)) if (!known.has(t.w)) P.push(`${at} 「${s.text}」 uses ${t.w}, not taught by this beat or earlier`);

    // each beat word used twice and caught by a prompt
    const uses = new Map(), caught = new Set();
    for (const s of strs) if (s.count) for (const t of tok(s.text)) uses.set(t.w, (uses.get(t.w) || 0) + 1);
    b.scene.steps.forEach((st, si) => {
      if (!st.ask) return;
      const ans = answerOf(st);
      if (!ans) P.push(`${at} step ${si}: prompt has no answer`);
      if (st.ask !== 'build' && !(st.options || []).includes(ans)) P.push(`${at} step ${si}: answer is not one of the options`);
      if (!st.label) P.push(`${at} step ${si}: prompt has no label`);
      const ansToks = new Set(tok(ans).map((t) => t.w));
      for (const w of st.words || []) {
        if (!known.has(w)) P.push(`${at} step ${si}: catches ${w}, which isn't taught yet`);
        if (!ansToks.has(w)) P.push(`${at} step ${si}: catches ${w}, but the answer 「${ans}」 doesn't use it`);
        caught.add(w);
      }
    });
    for (const w of b.words) {
      if ((uses.get(w) || 0) < 2) P.push(`${at}: ${w} is used ${uses.get(w) || 0} time(s) in the scene (needs 2)`);
      if (!caught.has(w)) P.push(`${at}: ${w} is not the answer to any prompt`);
    }

    // 40–150 characters read or heard: the lines, plus what you say
    const n = b.scene.steps.reduce((a, st) => a + hanCount(st.zh || '') + (st.ask && st.ask !== 'listen' ? hanCount(answerOf(st) || '') : 0), 0);
    if (n < 40 || n > b.scene.maxChars || (!b.scene.maxChars && n > 150)) P.push(`${at}: ${n} characters of text (40–${b.scene.maxChars || 150})`);
    if (bi === 0 && !b.words.length) P.push(`${at}: no words`);
  });

  if (data.notebook) for (const l of data.notebook.lines) for (const t of tok(l.zh)) if (!known.has(t.w)) P.push(`${name}: notebook 「${l.zh}」 uses ${t.w}, which no beat teaches`);
  return P;
}
