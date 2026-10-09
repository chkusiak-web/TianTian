// Question widgets shared by Learn, Use, Refresh, the challenge and the gate quiz.
// Answer tiles are hover-locked until you answer (DECISIONS #18); the question text stays hoverable.
// With the dev panel's "test answers" on, the right option is outlined and carries data-dev-ok.
import { setHzLock } from '../hz/hz.js';
import { speak } from '../audio/index.js';
import { splitWords, lookup, pinyinOf, numToMarks } from '../lexicon.js';

export { esc } from '../core/esc.js';
import { esc } from '../core/esc.js';
import { judgeBuild } from './close.js';
import { shuffle } from './drills.js';
const devOn = () => { try { return !!window.__store.state.dev.autoAnswer; } catch { return false; } };

// gloss for the confirm box: pinyin · English of a word or phrase
export function gloss(zh, en) {
  const bare = zh.replace(/[。，！？、：…\s]/g, '');
  const e = lookup(bare);
  if (e) return `${e.p} · ${e.m}`;
  const py = splitWords(zh).filter((p) => p.w).map((p) => pinyinOf(p.t)).join(' ');
  return en ? `${py} · ${en}` : py;
}

// One key handler at a time for the active question (1–4 to choose, Enter to go on)
let keyFn = null;
document.addEventListener('keydown', (e) => { if (keyFn && !/^(input|textarea|select)$/i.test(e.target.tagName)) keyFn(e); });
const setKeys = (f) => { keyFn = f; };

// Show the result: ✓ goes on by itself; ✗ shows the right answer and waits (天天's confirm box)
export function confirmBox(area, ok, answerHtml, glossText, { close = false } = {}) {
  return new Promise((resolve) => {
    const box = document.createElement('div');
    box.className = 'confirm ' + (ok ? 'ok' : 'no') + (close ? ' close' : '');
    box.innerHTML = ok && close
      ? `<span class="mark">✓</span> Close enough. Also natural: <b class="zh">${answerHtml}</b>${glossText ? ` <span class="note">${esc(glossText)}</span>` : ''}
         <button class="btn primary cgo">Continue <kbd>Enter</kbd></button>`
      : ok
      ? `<span class="mark">✓</span> Right`
      : `<span class="mark">✗</span> The answer is <b class="zh">${answerHtml}</b>${glossText ? ` <span class="note">${esc(glossText)}</span>` : ''}
         <button class="btn primary cgo">Continue <kbd>Enter</kbd></button>`;
    area.appendChild(box);
    const done = () => { setKeys(null); resolve(); };
    if (ok && !close) { setTimeout(done, 650); return; }
    box.querySelector('.cgo').onclick = done;
    setKeys((e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); done(); } });
    box.querySelector('.cgo').focus({ preventScroll: true });
  });
}

// Multiple choice. options: [{ html, value, zh }] — zh options are Chinese and hover-locked.
// soft: a wrong pick shows no ✗ box; the caller decides what happens next (a repair line, §6.11 rule 3)
export function askChoice(area, { options, answer, answerHtml, glossText, soft = false }) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'choices answers';
    wrap.innerHTML = options.map((o, i) => `<button class="btn choice ${o.zh ? 'zh' : ''}" data-i="${i}" ${devOn() && o.value === answer ? 'data-dev-ok="1"' : ''}><kbd>${i + 1}</kbd> ${o.html}</button>`).join('');
    area.appendChild(wrap);
    setHzLock(true);
    let done = false;
    const pick = async (i) => {
      if (done) return; done = true; setKeys(null);
      const o = options[i], ok = o.value === answer;
      wrap.querySelectorAll('.choice').forEach((b, j) => { b.disabled = true; if (options[j].value === answer) b.classList.add('right'); else if (j === i) b.classList.add('wrong'); });
      setHzLock(false);
      if (soft && !ok) await new Promise((r) => setTimeout(r, 500));
      else await confirmBox(area, ok, answerHtml || esc(answer), glossText);
      resolve({ ok, value: o.value });
    };
    wrap.querySelectorAll('.choice').forEach((b) => (b.onclick = () => pick(+b.dataset.i)));
    setKeys((e) => { const n = +e.key; if (n >= 1 && n <= options.length) { e.preventDefault(); pick(n - 1); } });
  });
}

// keys for tiles: 1–9, then 0, then the row under them
export const TILE_KEYS = [...'1234567890qwertyuiop'];

// Build a sentence from word tiles (CONCEPT §6.9). Punctuation is added back for display; only the words count.
// `accept`: other answers that are also right (e.g. 谢谢！ for "thank him" when the model answer is 谢谢你！).
// soft: only an exact or close answer is judged here. A near or wrong one resolves at once (no ✗ box), so the
// conversation can recast it or answer 「啊？什么？」 (§6.11 rules 1 and 4). Without soft, near counts as wrong.
export function askBuild(area, { answer, accept = [], optional = [], extra = [], rng = Math.random, allowHint = true, soft = false }) {
  return new Promise((resolve) => {
    const target = splitWords(answer).filter((p) => p.w).map((p) => p.t);
    const tiles = shuffle([...target, ...extra].map((t, i) => ({ t, i })), rng);
    const placed = [];
    let hinted = false, done = false;
    const wrap = document.createElement('div');
    wrap.className = 'build answers';
    wrap.innerHTML = `<div class="slots zh" aria-label="Your answer"></div><div class="tiles"></div>
      <div class="row"><button class="btn bundo">⌫ Undo</button>${allowHint ? '<button class="btn bhint">Pinyin hint</button>' : ''}<span class="bhinttext note"></span><button class="btn primary bcheck">Check <kbd>Enter</kbd></button></div>`;
    area.appendChild(wrap);
    if (devOn()) wrap.dataset.devAnswer = target.join('|');
    setHzLock(true);
    const draw = () => {
      wrap.querySelector('.slots').innerHTML = placed.length ? placed.map((p, k) => `<button class="btn tile placed zh" data-k="${k}">${esc(p.t)}</button>`).join('') : '<span class="note">Click the tiles in order</span>';
      wrap.querySelector('.tiles').innerHTML = tiles.map((p, n) => `<button class="btn tile zh" data-i="${p.i}" ${placed.includes(p) ? 'disabled' : ''} data-key="${TILE_KEYS[n] || ''}">${esc(p.t)}</button>`).join('');
      wrap.querySelectorAll('.tiles .tile').forEach((b) => (b.onclick = () => { const p = tiles.find((x) => x.i === +b.dataset.i); if (!placed.includes(p)) { placed.push(p); draw(); } }));
      wrap.querySelectorAll('.slots .tile').forEach((b) => (b.onclick = () => { placed.splice(+b.dataset.k, 1); draw(); }));
    };
    const check = async () => {
      if (done || !placed.length) return; done = true; setKeys(null);
      const words = (s) => splitWords(s).filter((p) => p.w).map((p) => p.t);
      const verdict = judgeBuild(placed.map((p) => p.t), [answer, ...accept].map(words), { optional });
      const ok = verdict === 'exact' || verdict === 'close';
      wrap.querySelectorAll('button').forEach((b) => (b.disabled = true));
      setHzLock(false);
      const said = placed.map((p) => p.t).join('');
      if (soft && !ok) { wrap.classList.add('checked', 'soft'); resolve({ ok, verdict, hint: hinted, said }); return; }
      wrap.classList.add('checked', ok ? 'ok' : 'no');   // your answer stays readable, marked right or wrong
      await confirmBox(area, ok, esc(answer), target.map(pinyinOf).join(' '), { close: verdict === 'close' });
      resolve({ ok, verdict, close: verdict === 'close', hint: hinted, said });
    };
    wrap.querySelector('.bundo').onclick = () => { placed.pop(); draw(); };
    wrap.querySelector('.bcheck').onclick = check;
    if (allowHint) wrap.querySelector('.bhint').onclick = () => { hinted = true; wrap.querySelector('.bhinttext').textContent = target.map(pinyinOf).join(' '); };
    setKeys((e) => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
      else if (e.key === 'Backspace') { e.preventDefault(); placed.pop(); draw(); }
      else if (!e.metaKey && !e.ctrlKey && !e.altKey) { const n = TILE_KEYS.indexOf(e.key.toLowerCase()); if (n >= 0 && n < tiles.length) { e.preventDefault(); const p = tiles[n]; if (!placed.includes(p)) { placed.push(p); draw(); } } }
    });
    draw();
  });
}

// Trace a character over its outline with hanzi-writer (Writing). Leniency from Settings.
let HW = null, STROKES = null;
async function strokesLib() {
  if (!HW) HW = (await import('../vendor/hanzi-writer.js')).default;
  if (!STROKES) STROKES = (await import('../vendor/strokes.js')).default;
  return { HW, STROKES };
}
// the stroke data is large: start loading it while the player is still on the map
export const preloadStrokes = () => strokesLib().catch(() => {});
export const hasStrokes = async (ch) => !!(await strokesLib()).STROKES[ch];

export async function strokeAnimation(el, ch) {
  const { HW, STROKES } = await strokesLib();
  if (!STROKES[ch]) return null;
  el.innerHTML = '';
  const w = HW.create(el, ch, { width: 150, height: 150, padding: 6, strokeColor: '#2A2622', radicalColor: '#C2573F', delayBetweenStrokes: 180, charDataLoader: (c, ok, err) => (STROKES[c] ? ok(STROKES[c]) : err('missing')) });
  return new Promise((res) => w.animateCharacter({ onComplete: res }));
}

export function askTrace(area, { ch, leniency = 1.8 }) {
  return new Promise(async (resolve) => {
    const { HW, STROKES } = await strokesLib();
    const wrap = document.createElement('div');
    wrap.className = 'trace answers';
    wrap.innerHTML = `<div class="tracebox"></div><div class="row"><button class="btn twatch">Show me</button>${devOn() ? '<button class="btn tdev" data-dev-ok="1">Pass (dev)</button>' : ''}<span class="note">Draw each stroke over the outline.</span></div>`;
    area.appendChild(wrap);
    let finished = false;
    let watched = false;   // "Show me" is a hint, not a miss: trace it after watching and it still counts
    const finish = async (ok) => { if (finished) return; finished = true; await confirmBox(area, ok, esc(ch), ''); resolve({ ok, hint: watched }); };
    if (!STROKES[ch]) { finish(true); return; }
    // as big as the panel allows: most of its width, about half its height
    const panel = area.closest('.sheetbody') || area;
    const size = Math.round(Math.max(200, Math.min(area.clientWidth * 0.75, panel.clientHeight * 0.55, 420)));
    const w = HW.create(wrap.querySelector('.tracebox'), ch, { width: size, height: size, padding: 10, showCharacter: false, showOutline: true, strokeColor: '#2A2622', outlineColor: '#C9C3B6', drawingColor: '#3A95BE', drawingWidth: Math.round(size / 16), leniency,
      charDataLoader: (c, ok, err) => (STROKES[c] ? ok(STROKES[c]) : err('missing')) });
    const quiz = () => w.quiz({ onComplete: ({ totalMistakes }) => finish(totalMistakes <= Math.max(2, STROKES[ch].strokes.length / 2)) });
    quiz();
    wrap.querySelector('.twatch').onclick = () => { watched = true; w.cancelQuiz(); w.animateCharacter({ onComplete: quiz }); };
    const dev = wrap.querySelector('.tdev'); if (dev) dev.onclick = () => { w.cancelQuiz(); finish(true); };
  });
}

// pinyin with tone marks for a numbered string
export const marks = (n) => numToMarks(n);
export { speak };
