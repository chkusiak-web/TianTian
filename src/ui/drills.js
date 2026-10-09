// Learn-step cards, ported from 天天's intro / choice / drawIt and the confirm box (showWrong).
// Each function draws into the session body and resolves when the card is done:
//   intro → undefined, drills → true (right first time) / false.
// While a question is open, hover is locked on the answers and on the prompt when the prompt is the word being tested.
import HanziWriter from '../vendor/hanzi-writer.js';
import STROKES from '../vendor/strokes.js';
import { speak } from '../audio/index.js';
import { setHzLock } from '../hz/hz.js';
import { toneOptions } from '../core/tones.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const hanChars = (s) => [...s].filter((c) => STROKES[c]);
const INK = '#2A2622', OUTLINE = '#C9C3B6', OK = '#4E9A33';

// distractors from the district's own words first (plausible and on-topic), same length when we show characters
export function distractors(pool, w, n, field) {
  const fit = pool.filter((x) => x.id !== w.id && x.m !== w.m && x.h !== w.h && (field !== 'h' || [...x.h].length === [...w.h].length));
  const loose = pool.filter((x) => x.id !== w.id && x.m !== w.m && x.h !== w.h);
  const src = fit.length >= n ? fit : loose;
  const seen = new Set(), out = [];
  for (const x of shuffle(src)) { const k = field === 'h' ? x.h : x.m; if (!seen.has(k)) { seen.add(k); out.push(x); } if (out.length === n) break; }
  return out;
}

export function makeDrills({ body, setKeys, pool, isSilent, leniency, autoAnswer }) {
  const card = (html) => { body.innerHTML = `<div class="card panel">${html}</div>`; return body.firstElementChild; };
  const on = (root, sel, fn) => root.querySelectorAll(sel).forEach((el) => el.addEventListener('click', fn));
  const answerLine = (w) => `<span class="zh">${esc(w.h)}</span> · ${esc(w.p)} · ${esc(w.m)}`;
  let writers = [];
  const clearWriters = () => { writers.forEach((x) => { try { x.cancelQuiz(); } catch { /* ignore */ } }); writers = []; };
  const writer = (el, ch, opts = {}) => {
    const size = el.clientWidth || 200;
    const x = HanziWriter.create(el, ch, {
      width: size, height: size, padding: Math.round(size * 0.08), showCharacter: false, showOutline: true,
      strokeColor: INK, outlineColor: OUTLINE, drawingColor: INK, highlightColor: '#72CDE0', radicalColor: null,
      drawingWidth: Math.max(8, Math.round(size / 15)), strokeAnimationSpeed: 1.4, delayBetweenStrokes: 120,
      charDataLoader: (c, ok, err) => (STROKES[c] ? ok(STROKES[c]) : err('missing')), ...opts
    });
    writers.push(x); return x;
  };
  const grids = (w, id) => `<div class="grids">${hanChars(w.h).map((c, i) => `<div class="grid"><div id="${id}${i}"></div></div>`).join('')}</div>`;

  // the confirm box after a miss (Enter or Esc to go on, Space to listen)
  function wrongBox(w, yours) {
    return new Promise((done) => {
      const box = document.createElement('div');
      box.className = 'wrongbox';
      box.innerHTML = `<div class="wrongcard panel" role="dialog" aria-label="Correct answer">
        <div class="label">Not quite · the answer</div>
        ${yours ? `<div class="note">You chose ${esc(yours)}</div>` : ''}
        <div class="whz zh">${esc(w.h)}</div><div class="wpy">${esc(w.p)}</div><div class="wm">${esc(w.m)}</div>
        <div class="row"><button class="btn" id="wplay">🔊 Listen <kbd>Space</kbd></button><button class="btn primary" id="wok">Got it <kbd>↵</kbd></button></div>
        <div class="note">It comes back in a few cards.</div></div>`;
      body.appendChild(box);
      const close = () => { box.remove(); done(); };
      setKeys((e) => { if (e.key === 'Enter') { e.preventDefault(); close(); } else if (e.key === ' ') { e.preventDefault(); speak(w.h); } });
      box.querySelector('#wok').onclick = close;
      box.querySelector('#wplay').onclick = () => speak(w.h);
    });
  }

  function intro(w, k, n) {
    return new Promise((done) => {
      setHzLock(false);
      const el = card(`<div class="label">New word · ${k} / ${n}</div>
        <div class="bigzh zh">${esc(w.h)}</div>
        <button class="pypill" id="py">Show pinyin <kbd>P</kbd></button>
        <div class="meaning">${esc(w.m)}${w.kind === 'taught' ? ' <span class="star">★ Jinan word</span>' : ''}</div>
        <div class="toolrow"><button class="btn" id="play">🔊 Listen <kbd>Space</kbd></button>${hanChars(w.h).length ? '<button class="btn" id="strokes">✎ Strokes <kbd>S</kbd></button>' : ''}</div>
        <div class="anim" id="anim"></div>
        <div class="foot"><span></span><button class="btn primary" id="next">Continue <kbd>↵</kbd></button></div>`);
      const py = () => { const p = el.querySelector('#py'); p.textContent = w.p; p.classList.add('shown'); };
      const strokes = async () => {
        clearWriters(); const box = el.querySelector('#anim'); box.innerHTML = grids(w, 'a');
        for (const [i, c] of hanChars(w.h).entries()) await writer(box.querySelector('#a' + i), c).animateCharacter();
      };
      const next = () => { clearWriters(); done(); };
      on(el, '#play', () => speak(w.h)); on(el, '#py', py); on(el, '#strokes', strokes); on(el, '#next', next);
      setKeys((e) => {
        if (e.key === ' ') { e.preventDefault(); speak(w.h); } else if (e.key === 'p') py(); else if (e.key === 's') strokes();
        else if (e.key === 'Enter') { e.preventDefault(); next(); }
      });
      setTimeout(() => speak(w.h), 250);
    });
  }

  // t: read (character → meaning) · pick (meaning → character) · hear (sound → character) · tone (sound → pinyin) · tonesee
  function choice(w, t) {
    if (isSilent()) t = { hear: 'pick', tone: 'tonesee' }[t] || t;
    return new Promise((done) => {
      let label, prompt, opts;
      const spk = '<button class="listen" id="spk" aria-label="Play">🔊</button>';
      if (t === 'read') { label = 'Reading · what does it mean?'; prompt = `<div class="bigzh zh lockzh">${esc(w.h)}</div>`; opts = shuffle([w, ...distractors(pool, w, 3, 'm')]).map((x) => ({ ok: x.id === w.id, html: esc(x.m), raw: x.m })); }
      else if (t === 'pick') { label = 'Reading · which one is it?'; prompt = `<div class="meaning big">${esc(w.m)}</div>`; opts = shuffle([w, ...distractors(pool, w, 3, 'h')]).map((x) => ({ ok: x.id === w.id, html: `<span class="zh">${esc(x.h)}</span>`, raw: x.h })); }
      else if (t === 'hear') { label = 'Listening · which one do you hear?'; prompt = spk; opts = shuffle([w, ...distractors(pool, w, 3, 'h')]).map((x) => ({ ok: x.id === w.id, html: `<span class="zh">${esc(x.h)}</span>`, raw: x.h })); }
      else { label = t === 'tone' ? 'Tones · which do you hear?' : 'Tones · which pinyin is right?'; prompt = t === 'tone' ? spk : `<div class="bigzh zh lockzh">${esc(w.h)}</div>`; opts = shuffle(toneOptions(w.n)).map((o) => ({ ok: o.ok, html: esc(o.py), raw: o.py })); }
      setHzLock(true);
      const el = card(`<div class="label">${label}</div><div class="prompt">${prompt}</div>
        <div class="options answers">${opts.map((o, i) => `<button class="opt${autoAnswer() && o.ok ? ' cheat' : ''}" data-i="${i}"><span class="n">${i + 1}</span>${o.html}</button>`).join('')}</div>
        <div class="foot"><span class="fb" id="fb"></span><button class="btn primary" id="next" hidden>Continue <kbd>↵</kbd></button></div>`);
      const audio = t === 'hear' || t === 'tone';
      let answered = false;
      const answer = (i) => {
        if (answered) return; answered = true; setHzLock(false);
        const ok = opts[i].ok;
        el.querySelectorAll('.opt').forEach((b, j) => b.classList.add(opts[j].ok ? 'ok' : j === i ? 'bad' : 'dim'));
        el.querySelector('.prompt').classList.remove('lockzh'); el.querySelector('.lockzh')?.classList.remove('lockzh');
        el.querySelector('#fb').innerHTML = answerLine(w); el.querySelector('#fb').className = 'fb ' + (ok ? 'ok' : 'bad');
        speak(w.h);
        if (ok) { setTimeout(() => done(true), 900); setKeys((e) => { if (e.key === 'Enter') done(true); }); }
        else wrongBox(w, opts[i].raw).then(() => done(false));
      };
      on(el, '.opt', (e) => answer(+e.currentTarget.dataset.i));
      on(el, '#spk', () => speak(w.h));
      setKeys((e) => { const n = +e.key; if (n >= 1 && n <= opts.length) answer(n - 1); else if (e.key === ' ') { e.preventDefault(); if (audio || answered) speak(w.h); } });
      if (audio) setTimeout(() => speak(w.h), 250);
    });
  }

  // trace the character over its outline (hanzi-writer quiz). Relaxed leniency accepts rougher strokes on a trackpad.
  function trace(w) {
    const chars = hanChars(w.h);
    if (!chars.length || autoAnswer()) return choice(w, 'pick');
    return new Promise((done) => {
      setHzLock(false);
      const relaxed = leniency() !== 'strict';
      let ci = 0, misses = 0, finished = false;
      const el = card(`<div class="label">Writing · trace it</div><div class="meaning">${esc(w.m)} · ${esc(w.p)}</div>
        <div class="tracewrap">${grids(w, 't')}</div>
        <div class="foot"><span class="fb" id="fb">Draw each stroke in order. After two misses the next stroke flashes.</span><button class="btn primary" id="next" hidden>Continue <kbd>↵</kbd></button></div>`);
      const start = () => {
        el.querySelectorAll('.grid').forEach((g, i) => g.classList.toggle('wait', i > ci));
        const x = writer(el.querySelector('#t' + ci), chars[ci]);
        x.quiz({
          leniency: relaxed ? 1.8 : 1, showHintAfterMisses: 2, highlightOnComplete: false,
          onMistake: () => { misses++; },
          onComplete: () => { ci++; if (ci < chars.length) setTimeout(start, 200); else finish(); }
        });
      };
      const finish = () => {
        finished = true; clearWriters();
        const ok = misses <= (relaxed ? 4 : 3) * chars.length;
        el.querySelectorAll('.grid').forEach((g) => g.classList.add(ok ? 'ok' : 'bad'));
        el.querySelector('#fb').innerHTML = answerLine(w) + ` · ${misses ? misses + (misses === 1 ? ' miss' : ' misses') : 'no misses'}`;
        el.querySelector('#fb').className = 'fb ' + (ok ? 'ok' : 'bad');
        const nx = el.querySelector('#next'); nx.hidden = false; nx.onclick = () => done(ok);
        speak(w.h);
        setKeys((e) => { if (e.key === 'Enter') done(ok); });
      };
      setKeys((e) => { if (e.key === ' ' && !finished) { e.preventDefault(); speak(w.h); } });
      requestAnimationFrame(start);
      speak(w.h);
    });
  }

  return { intro, choice, trace, wrongBox, clearWriters, strokeCol: OK };
}
