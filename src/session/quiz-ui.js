// Question widgets shared by Learn, Use, Refresh, the challenge and the gate quiz.
// Answer tiles are hover-locked until you answer (DECISIONS #18); the question text stays hoverable.
// With the dev panel's "test answers" on, the right option is outlined and carries data-dev-ok.
import { setHzLock } from '../hz/hz.js';
import { speak } from '../audio/index.js';
import { splitWords, lookup, pinyinOf, numToMarks } from '../lexicon.js';

export { esc } from '../core/esc.js';
import { esc } from '../core/esc.js';
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
export function confirmBox(area, ok, answerHtml, glossText) {
  return new Promise((resolve) => {
    const box = document.createElement('div');
    box.className = 'confirm ' + (ok ? 'ok' : 'no');
    box.innerHTML = ok
      ? `<span class="mark">✓</span> Right`
      : `<span class="mark">✗</span> The answer is <b class="zh">${answerHtml}</b>${glossText ? ` <span class="note">${esc(glossText)}</span>` : ''}
         <button class="btn primary cgo">Continue <kbd>Enter</kbd></button>`;
    area.appendChild(box);
    const done = () => { setKeys(null); resolve(); };
    if (ok) { setTimeout(done, 650); return; }
    box.querySelector('.cgo').onclick = done;
    setKeys((e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); done(); } });
    box.querySelector('.cgo').focus({ preventScroll: true });
  });
}

// Multiple choice. options: [{ html, value, zh }] — zh options are Chinese and hover-locked.
export function askChoice(area, { options, answer, answerHtml, glossText }) {
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
      await confirmBox(area, ok, answerHtml || esc(answer), glossText);
      resolve({ ok, value: o.value });
    };
    wrap.querySelectorAll('.choice').forEach((b) => (b.onclick = () => pick(+b.dataset.i)));
    setKeys((e) => { const n = +e.key; if (n >= 1 && n <= options.length) { e.preventDefault(); pick(n - 1); } });
  });
}

// Build a sentence from word tiles (CONCEPT §6.9). Punctuation is added back for display; only the words count.
// `accept`: other answers that are also right (e.g. 谢谢！ for "thank him" when the model answer is 谢谢你！).
export function askBuild(area, { answer, accept = [], extra = [], rng = Math.random, allowHint = true }) {
  return new Promise((resolve) => {
    const target = splitWords(answer).filter((p) => p.w).map((p) => p.t);
    const tiles = [...target, ...extra].map((t, i) => ({ t, i })).sort(() => rng() - 0.5);
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
      wrap.querySelector('.tiles').innerHTML = tiles.map((p) => `<button class="btn tile zh" data-i="${p.i}" ${placed.includes(p) ? 'disabled' : ''}>${esc(p.t)}</button>`).join('');
      wrap.querySelectorAll('.tiles .tile').forEach((b) => (b.onclick = () => { const p = tiles.find((x) => x.i === +b.dataset.i); if (!placed.includes(p)) { placed.push(p); draw(); } }));
      wrap.querySelectorAll('.slots .tile').forEach((b) => (b.onclick = () => { placed.splice(+b.dataset.k, 1); draw(); }));
    };
    const check = async () => {
      if (done || !placed.length) return; done = true; setKeys(null);
      const words = (s) => splitWords(s).filter((p) => p.w).map((p) => p.t).join('|');
      const got = placed.map((p) => p.t).join('|');
      const ok = [answer, ...accept].some((a) => words(a) === got);
      wrap.querySelectorAll('button').forEach((b) => (b.disabled = true));
      setHzLock(false);
      await confirmBox(area, ok, esc(answer), target.map(pinyinOf).join(' '));
      resolve({ ok, hint: hinted, said: placed.map((p) => p.t).join('') });
    };
    wrap.querySelector('.bundo').onclick = () => { placed.pop(); draw(); };
    wrap.querySelector('.bcheck').onclick = check;
    if (allowHint) wrap.querySelector('.bhint').onclick = () => { hinted = true; wrap.querySelector('.bhinttext').textContent = target.map(pinyinOf).join(' '); };
    setKeys((e) => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
      else if (e.key === 'Backspace') { e.preventDefault(); placed.pop(); draw(); }
      else { const n = +e.key; if (n >= 1 && n <= tiles.length) { const p = tiles[n - 1]; if (!placed.includes(p)) { placed.push(p); draw(); } } }
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
    const finish = async (ok) => { if (finished) return; finished = true; await confirmBox(area, ok, esc(ch), ''); resolve({ ok }); };
    if (!STROKES[ch]) { finish(true); return; }
    const w = HW.create(wrap.querySelector('.tracebox'), ch, { width: 220, height: 220, padding: 10, showCharacter: false, showOutline: true, strokeColor: '#2A2622', outlineColor: '#C9C3B6', drawingColor: '#3A95BE', drawingWidth: 14, leniency,
      charDataLoader: (c, ok, err) => (STROKES[c] ? ok(STROKES[c]) : err('missing')) });
    w.quiz({ onComplete: ({ totalMistakes }) => finish(totalMistakes <= Math.max(2, STROKES[ch].strokes.length / 2)) });
    wrap.querySelector('.twatch').onclick = () => { w.cancelQuiz(); w.animateCharacter({ onComplete: () => w.quiz({ onComplete: () => finish(false) }) }); };
    const dev = wrap.querySelector('.tdev'); if (dev) dev.onclick = () => { w.cancelQuiz(); finish(true); };
  });
}

// pinyin with tone marks for a numbered string
export const marks = (n) => numToMarks(n);
export { speak };
