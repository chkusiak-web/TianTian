/* Validates Jinan conversation scripts: coverage, try-sentences route to their own step, full playthroughs. */
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', 'app');
global.window = global;
require(APP + '/data/words.js'); require(APP + '/data/jinan.js'); require(APP + '/data/jinan-scripts.js');
const only = process.argv[2];
for (const f of fs.readdirSync(APP + '/data/scripts')) require(APP + '/data/scripts/' + f);
const PP = require(APP + '/lib/pinyin-pro.js');
const T = require(APP + '/talk.js');
const syl = new Set(); WORDS.forEach((w) => String(w.n || '').split(/\s+/).forEach((s) => s && syl.add(s.replace(/\d/g, ''))));
T.init({ py: (s) => PP.pinyin(s, { toneType: 'none', type: 'array' }), pyMarks: (s) => PP.pinyin(s), syllables: [...syl] });
const HSK = {}; WORDS.forEach((w) => [...w.h].forEach((c) => { if (!HSK[c] || HSK[c] > w.hsk) HSK[c] = w.hsk; }));
const S = window.JINAN_SCRIPTS; let errors = 0, warns = 0;
const err = (q, m) => { errors++; console.log(`ERROR ${q}: ${m}`); };
const warn = (q, m) => { warns++; if (!process.env.QUIET) console.log(`  warn ${q}: ${m}`); };
const isLine = (l) => Array.isArray(l) && typeof l[0] === 'string' && l[0].trim() && typeof l[1] === 'string' && l[1].trim();
for (const [cid, c] of Object.entries(S.characters)) {
  if (!(c.meet || []).every(isLine) || !c.meet.length) err(cid, 'character meet lines');
  for (const k of [1, 2, 3]) if (!((c.hello || {})[k] || []).length) err(cid, 'hello stage ' + k);
}
const report = [];
for (const d of JINAN.districts) for (const q of d.quests) {
  if (only && !q.id.startsWith(only)) continue;
  const sc = S.quests[q.id]; if (!sc) { err(q.id, 'no script'); continue; }
  const ch = S.characters[q.character];
  const objs = q.objectives.map((o) => o.id);
  const stepObjs = (sc.steps || []).map((s) => s.obj);
  objs.forEach((o) => { const n = stepObjs.filter((x) => x === o).length; if (n !== 1) err(q.id, `objective ${o} has ${n} steps`); });
  stepObjs.forEach((o) => { if (!objs.includes(o)) err(q.id, `step for unknown objective ${o}`); });
  if (!(sc.open || []).every(isLine) || !sc.open.length) err(q.id, 'open lines');
  if (!(sc.done || []).every(isLine) || !sc.done.length) err(q.id, 'done lines');
  if (sc.later && !isLine(sc.later)) err(q.id, 'later line');
  (sc.words || []).forEach((w) => { if (!Array.isArray(w) || w.length !== 3) err(q.id, 'words entry ' + JSON.stringify(w)); });
  (sc.extra || []).forEach((e, i) => { if (!e.m || !e.m.length || !(e.say || []).every(isLine) || !e.say.length) err(q.id, 'extra ' + i); });
  const allLines = [...(sc.open || []), ...(sc.done || []), ...(sc.later ? [sc.later] : []), ...(sc.extra || []).flatMap((e) => e.say || [])];
  for (const s of sc.steps || []) {
    if (!s.m || !s.m.length) err(q.id, `${s.obj} has no patterns`);
    if (!(s.say || []).length || !s.say.every(isLine)) err(q.id, `${s.obj} say lines`);
    if ((s.try || []).length < 2) err(q.id, `${s.obj} needs 2+ try sentences`);
    allLines.push(...(s.say || []));
    // slot templates must be captured by every pattern, unless they have a fallback
    for (const l of s.say || []) for (const m of String(l[0]).matchAll(/\{(\w+)(?:\*[\d.]+)?\}/g)) {
      if (['name', 'country'].includes(m[1])) continue;   // may come from memory
      const missing = s.m.filter((a) => !a.includes('{' + m[1] + '}'));
      if (missing.length) err(q.id, `${s.obj} line uses {${m[1]}} without fallback, but pattern(s) don't capture it: ${missing.join(' / ')}`);
    }
    // each try sentence, with every other objective done, must tick exactly this step and need no correction
    for (const t of s.try || []) {
      const st = T.newState(sc, q.id, q.character, objs.filter((o) => o !== s.obj));
      const r = T.respond(sc, ch, st, t, { objectives: q.objectives, me: {} });
      if (!r.ticked.includes(s.obj)) err(q.id, `try "${t}" does not match its step ${s.obj} → ${r.lines.map((l) => l.zh).join(' ')}`);
      if (r.fix) err(q.id, `try "${t}" triggers a correction: ${JSON.stringify(r.fix)}`);
      // cross-talk from a fresh state
      const st2 = T.newState(sc, q.id, q.character, []);
      const r2 = T.respond(sc, ch, st2, t, { objectives: q.objectives, me: {} });
      const other = r2.ticked.filter((o) => o !== s.obj);
      if (other.length) warn(q.id, `try "${t}" (${s.obj}) also ticks ${other.join(',')}`);
    }
  }
  // lines: no Latin in Chinese, count hard characters
  let hard = new Set();
  for (const l of allLines) {
    const zh = String(l[0]).replace(/\{[^}]*\}/g, '');
    if (/[A-Za-z]/.test(zh)) warn(q.id, `Latin letters in line: ${l[0]}`);
    [...zh].forEach((c) => { if (/[㐀-鿿]/.test(c) && !(HSK[c] <= hskBand(d.hsk) + 1)) hard.add(c); });
  }
  // playthrough with first try sentences in order
  const st = T.newState(sc, q.id, q.character, []); let complete = false, turns = 0;
  for (let guard = 0; guard < 20 && !complete; guard++) {
    const av = T.available(sc, st); if (!av.length) break;
    const r = T.respond(sc, ch, st, av[0].try[0], { objectives: q.objectives, me: {} }); turns++;
    complete = r.complete;
  }
  if (!complete) err(q.id, `playthrough did not complete (done ${st.done.join(',')})`);
  report.push(`${q.id.padEnd(14)} ${String((sc.steps || []).length).padStart(2)} steps · ${turns} turns · hard chars: ${[...hard].join('') || '–'}`);
}
function hskBand(s) { return parseInt(String(s).match(/\d/g).pop(), 10); }
if (!process.env.QUIET) console.log('\n' + report.join('\n'));
console.log(`\n${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
