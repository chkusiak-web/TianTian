// CONCEPT §6.10 rules that are cheap to check, for content files with `beats`:
//  - each new word is the answer (or part of the answer) to at least one prompt in its scene
//  - each new word appears at least twice in its scene
//  - a scene only uses words taught in this session or earlier (plus names, particles, the fixed expression)
//  - the notebook page is fully readable once the arc's words are caught
//  - text per beat is 40–150 characters (warning only)
//  - a session teaches at most 8 new words (CONCEPT §2.1; units are split into `parts` to stay under it)
import { makeSplitter, wordsOf, HAN } from '../../src/core/split.js';
import { lexicon } from './hsk.js';
import { LX } from './zhcheck.js';

const free = new Set([...LX.names, ...LX.particles, ...(LX.fixed || [])]);
const taughtAll = new Set(Object.values(LX.taught).flat().map(([w]) => w));
const split = makeSplitter((w) => lexicon.has(w) || free.has(w) || taughtAll.has(w));
const toks = (s) => wordsOf(split, s);

// a token is readable if it is free, known, or made only of known characters (这个 = 这 + 个)
const readable = (t, known) => free.has(t) || known.has(t) || [...t].every((c) => known.has(c) || free.has(c));

function sceneText(use) {
  const all = [], answers = [];
  for (const s of use.steps.flatMap((x) => [x, ...(x.onMiss || [])])) {
    if (s.zh) all.push(s.zh);
    if (s.options) all.push(...s.options);
    if (s.answer) { all.push(s.answer); answers.push(s.answer); }
    if (s.extra) all.push(...s.extra);
  }
  return { all, answers };
}

export function checkBeatRules(data, name, warn = (m) => console.log('  ! ' + m)) {
  if (!Array.isArray(data.beats)) return [];
  const problems = [];
  // a unit with `parts` is played as several sessions; its words must be exactly its parts' words
  for (const u of [data.opening, ...data.beats].filter((x) => x && x.parts)) {
    const inParts = u.parts.flatMap((x) => x.words);
    const missing = u.words.filter((w) => !inParts.includes(w)), extra = inParts.filter((w) => !u.words.includes(w));
    if (missing.length || extra.length) problems.push(`${name}:${u.id} parts don't match its words (missing ${missing.join(' ') || '-'}, extra ${extra.join(' ') || '-'})`);
    if (new Set(inParts).size !== inParts.length) problems.push(`${name}:${u.id} a word is taught in two parts`);
  }
  const sessions = [data.opening, ...data.beats].filter(Boolean).flatMap((u) => u.parts || [u]);
  const known = new Set();
  for (const b of sessions) {
    for (const w of b.words) known.add(w);
    if (!b.use) continue;
    if (b.words.length > 8) problems.push(`${name}:${b.id} teaches ${b.words.length} new words (at most 8 per session)`);
    const { all, answers } = sceneText(b.use);
    const ansToks = answers.flatMap(toks), allToks = all.flatMap(toks);
    for (const w of b.words) {
      const inAns = ansToks.includes(w) || ansToks.some((t) => t.length > 1 && t.includes(w) && !known.has(t));
      if (!inAns) problems.push(`${name}:${b.id} new word ${w} is not the answer to any prompt`);
      const n = allToks.filter((t) => t === w || (t.length > 1 && t.includes(w) && !lexicon.has(t))).length;
      if (n < 2) problems.push(`${name}:${b.id} new word ${w} appears ${n}× in the scene (needs 2)`);
    }
    for (const t of new Set(allToks)) if (!readable(t, known)) problems.push(`${name}:${b.id} uses ${t}, which isn't taught by this beat`);
    const chars = all.join('').split('').filter((c) => HAN.test(c)).length;
    if (chars < 40 || chars > 150) warn(`${name}:${b.id} has ${chars} characters of Chinese (aim 40–150)`);
  }
  if (data.notebook) for (const l of data.notebook.lines) for (const t of toks(l.zh)) if (!readable(t, known)) problems.push(`${name}:notebook 「${l.zh}」 → ${t} is never taught`);
  return problems;
}
