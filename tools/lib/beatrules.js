// CONCEPT §6.10 rules that are cheap to check, for content files with `beats`:
//  - each new word is the answer (or part of the answer) to at least one prompt in its scene
//  - each new word appears at least twice in its scene
//  - a scene only uses words taught in this session or earlier (plus names, particles, the fixed expression)
//  - the notebook page is fully readable once the arc's words are caught
//  - text per beat is 40–150 characters (warning only)
//  - a session teaches at most 8 new words (CONCEPT §2.1; units are split into `parts` to stay under it)
//  - conversation rules (§6.11): no line is asked about right after it's shown, each line is checked at most once,
//    no speaking prompt gives the English sentence ("Say: …"), every reply step has a nonsense and a sensible option
import { makeSplitter, wordsOf, HAN } from '../../src/core/split.js';
import { lexicon } from './hsk.js';
import { LX } from './zhcheck.js';

const free = new Set([...LX.names, ...LX.particles, ...(LX.fixed || [])]);
const taughtAll = new Set(Object.values(LX.taught).flat().map(([w]) => w));
const split = makeSplitter((w) => lexicon.has(w) || free.has(w) || taughtAll.has(w));
const toks = (s) => wordsOf(split, s);

// a token is readable if it is free, known, or made only of known characters (这个 = 这 + 个)
const readable = (t, known) => free.has(t) || known.has(t) || [...t].every((c) => known.has(c) || free.has(c));

// every step a session can play, in order: onMiss steps, duel prompts and reply reactions included
const flat = (steps) => steps.flatMap((x) => [x, ...flat(x.onMiss || []), ...flat((x.duel && x.duel.prompts) || []), ...(x.options && x.reply ? x.options.flatMap((o) => flat(o.then || [])) : [])]);

function sceneText(use) {
  const all = [], answers = [];
  for (const s of flat(use.steps)) {
    if (s.duel && s.duel.retreat) all.push(s.duel.retreat);
    if (s.zh) all.push(s.zh);
    if (s.reply) for (const o of s.options) { all.push(o.zh); if (o.react) all.push(o.react); if (o.recast) all.push(o.recast); if (!o.nonsense) answers.push(o.zh); if (o.extra) all.push(...o.extra); }
    else if (s.options) all.push(...s.options);
    if (s.answer) { all.push(s.answer); answers.push(s.answer); }
    if (s.recast) all.push(s.recast);
    if (s.extra) all.push(...s.extra);
  }
  return { all, answers };
}

const bare = (zh) => (zh || '').replace(/[。，！？、：；…·→\s「」]/g, '');
export function conversationRules(use, at) {
  const problems = [];
  const walk = (steps) => {
    const shown = [];   // plain lines so far in this run of steps
    const asked = new Set();
    for (const s of steps) {
      if (s.ask && s.zh) {
        const z = bare(s.zh);
        if (shown.some((l) => l.includes(z) || z.includes(l))) problems.push(`${at}: 「${s.zh}」 is asked about right after it's shown (play it as the question instead)`);
        if (asked.has(z)) problems.push(`${at}: 「${s.zh}」 is checked twice`);
        asked.add(z);
      } else if (s.zh && !s.ask && !s.build && !s.reply) shown.push(bare(s.zh));
      if (s.build && !s.reply && /^\s*say\b/i.test(s.q || '')) problems.push(`${at}: speaking prompt "${s.q}" gives the sentence; give the situation or goal`);
      if (s.reply) {
        if (!s.options || s.options.length < 2) problems.push(`${at}: a reply step needs 2–3 options`);
        else {
          if (!s.options.some((o) => o.nonsense)) problems.push(`${at}: reply 「${s.options[0].zh}」… has no wrong or nonsense option`);
          if (!s.options.some((o) => !o.nonsense)) problems.push(`${at}: reply step has no sensible option`);
          for (const o of s.options) if (o.then) walk(o.then);
        }
      }
      if (s.onMiss) walk(s.onMiss);
    }
  };
  walk(use.steps);
  return problems;
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
    problems.push(...conversationRules(b.use, `${name}:${b.id}`));
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
