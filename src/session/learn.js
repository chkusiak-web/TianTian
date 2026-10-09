// Learn (CONCEPT §2.1): each new word gets an intro card (Listen, Strokes), then quick drills.
// The first right answer catches a word; a miss shows the answer and the drill comes back two items later.
import { buildLearnQueue, requeue, shuffle } from './drills.js';
import { askChoice, askTrace, confirmBox, strokeAnimation, hasStrokes, marks, esc, speak } from './quiz-ui.js';
import { catchWord } from '../core/words.js';

const LABEL = { pick: 'Reading · what does it mean?', hear: 'Listening · which word did you hear?', hearSilent: 'Reading · which word is this?', tone: 'Tones · which tones are right?', trace: 'Writing · trace it' };

export async function runLearn(panel, { words, pool, store, silent, leniency, frame }) {
  const S = store.state;
  const todo = words.filter((w) => !S.words[w.id]);
  if (!todo.length) return;
  panel.body.innerHTML = `<div class="loading"><b>${esc(frame)}</b><span>Getting today's ${todo.length} words ready</span><span class="dots"><i></i><i></i><i></i></span></div>`;
  const strokeable = new Set();
  const single = todo.filter((w) => [...w.h].length === 1);
  (await Promise.all(single.map((w) => hasStrokes(w.h)))).forEach((ok, i) => ok && strokeable.add(single[i].h));
  const queue = buildLearnQueue(todo, { pool, silent, traceable: (h) => strokeable.has(h) });
  const total = queue.filter((x) => x.t !== 'intro').length;
  let doneDrills = 0;

  for (let i = 0; i < queue.length; i++) {
    const it = queue[i], w = it.w;
    const b = panel.body;
    b.innerHTML = `<div class="learnhead"><span class="note">${esc(frame)}</span><span class="progress"><i style="width:${(doneDrills / total) * 100}%"></i></span></div><div class="card"></div>`;
    const card = b.querySelector('.card');

    if (it.t === 'intro') {
      card.classList.add('intro');
      card.innerHTML = `<div class="label">New word</div>
        <div class="introhz zh" data-nohz>${esc(w.h)}</div><div class="intropy">${esc(w.p)}</div><div class="introen">${esc(w.m)}</div>
        <div class="strokes"></div>
        <div class="row center"><button class="btn ilisten">🔊 Listen <kbd>Space</kbd></button><button class="btn istrokes">✎ Strokes <kbd>S</kbd></button><button class="btn primary inext">Next <kbd>Enter</kbd></button></div>`;
      speak(w.h);
      let drawing = false;
      const strokes = async () => { if (drawing) return; drawing = true; const el = card.querySelector('.strokes'); for (const ch of w.h) await strokeAnimation(el, ch); drawing = false; };
      await panel.guard(new Promise((res) => {
        card.querySelector('.ilisten').onclick = () => speak(w.h);
        card.querySelector('.istrokes').onclick = strokes;
        card.querySelector('.inext').onclick = () => { document.removeEventListener('keydown', k); res(); };
        const k = (e) => { if (/^(input|textarea)$/i.test(e.target.tagName)) return; if (e.key === 'Enter') { e.preventDefault(); card.querySelector('.inext').click(); } else if (e.key === ' ') { e.preventDefault(); speak(w.h); } else if (e.key === 's') strokes(); };
        document.addEventListener('keydown', k);
        card.querySelector('.inext').focus({ preventScroll: true });
      }));
      continue;
    }

    let r;
    if (it.t === 'pick') {
      card.innerHTML = `<div class="label">${LABEL.pick}</div><div class="qhz zh answers" data-nohz>${esc(w.h)}</div><div class="qarea"></div>`;
      r = await panel.guard(askChoice(card.querySelector('.qarea'), { options: it.options.map((o) => ({ html: esc(o.m), value: o.id })), answer: w.id, answerHtml: esc(w.m), glossText: `${w.h} · ${w.p}` }));
    } else if (it.t === 'hear') {
      card.innerHTML = it.silent
        ? `<div class="label">${LABEL.hearSilent}</div><div class="qpy">${esc(w.p)}</div><div class="qarea"></div>`
        : `<div class="label">${LABEL.hear}</div><button class="btn big qsay">🔊 Play again</button><div class="qarea"></div>`;
      if (!it.silent) { speak(w.h); card.querySelector('.qsay').onclick = () => speak(w.h); }
      r = await panel.guard(askChoice(card.querySelector('.qarea'), { options: it.options.map((o) => ({ html: esc(o.h), value: o.id, zh: true })), answer: w.id, answerHtml: esc(w.h), glossText: `${w.p} · ${w.m}` }));
    } else if (it.t === 'tone') {
      card.innerHTML = `<div class="label">${LABEL.tone}</div><div class="qhz zh answers" data-nohz>${esc(w.h)}</div><button class="btn qsay">🔊</button><div class="qarea"></div>`;
      speak(w.h); card.querySelector('.qsay').onclick = () => speak(w.h);
      r = await panel.guard(askChoice(card.querySelector('.qarea'), { options: it.options.map((n) => ({ html: esc(marks(n)), value: n })), answer: w.n, answerHtml: esc(marks(w.n)), glossText: w.m }));
    } else if (it.t === 'trace') {
      card.innerHTML = `<div class="label">${LABEL.trace}</div><div class="qpy">${esc(w.p)} · ${esc(w.m)}</div><div class="qarea"></div>`;
      r = await panel.guard(askTrace(card.querySelector('.qarea'), { ch: w.h, leniency }));
      S.stats.drawn = (S.stats.drawn || 0) + (r.ok ? 1 : 0);
    }
    if (r.ok) { doneDrills++; if (catchWord(S, w.id)) store.save(); }
    else requeue(queue, i, it);
    store.save();
  }
}

// Refresh (CONCEPT §2.1, §6.8): due words come back. Context cards (a sentence you met with a gap) when there is one,
// otherwise a flip card. Graded with 天天's SRS.
import { grade } from '../core/srs.js';
export async function runRefresh(panel, { due, pool, store, rng = Math.random }) {
  const S = store.state;
  for (let i = 0; i < due.length; i++) {
    const w = due[i];
    panel.body.innerHTML = `<div class="learnhead"><span class="note">Faded notes in the margin: words that are due.</span><span class="progress"><i style="width:${(i / due.length) * 100}%"></i></span></div><div class="card"></div>`;
    const card = panel.body.querySelector('.card');
    const ctx = ((S.ctx || {})[w.id] || []).find((c) => c.zh.includes(w.h) && c.zh !== w.h);
    let ok;
    if (ctx) {
      const opts = shuffle([w, ...shuffle(pool.filter((x) => x.id !== w.id && x.h.length === w.h.length), rng).slice(0, 2)], rng);
      card.innerHTML = `<div class="label">Review · fill the gap</div><div class="qline zh">${esc(ctx.zh).replace(esc(w.h), '<span class="gap">＿＿</span>')}</div><div class="qarea"></div>`;
      ({ ok } = await panel.guard(askChoice(card.querySelector('.qarea'), { options: opts.map((o) => ({ html: esc(o.h), value: o.id, zh: true })), answer: w.id, answerHtml: esc(w.h), glossText: `${w.p} · ${w.m}` })));
    } else {
      card.innerHTML = `<div class="label">Review · do you remember it?</div><div class="introhz zh answers" data-nohz>${esc(w.h)}</div><div class="reveal" hidden><div class="intropy">${esc(w.p)}</div><div class="introen">${esc(w.m)}</div></div>
        <div class="row center rshow"><button class="btn primary">Show <kbd>Space</kbd></button></div><div class="row center rmark" hidden><button class="btn" data-ok="1"><kbd>1</kbd> I knew it</button><button class="btn" data-ok="0"><kbd>2</kbd> I didn't</button></div>`;
      ok = await panel.guard(new Promise((res) => {
        const show = () => { card.querySelector('.reveal').hidden = false; card.querySelector('.rshow').hidden = true; card.querySelector('.rmark').hidden = false; speak(w.h); };
        const k = (e) => { if (e.key === ' ' && !card.querySelector('.rshow').hidden) { e.preventDefault(); show(); } else if (!card.querySelector('.rmark').hidden && (e.key === '1' || e.key === '2')) { done(e.key === '1'); } };
        const done = (v) => { document.removeEventListener('keydown', k); res(v); };
        card.querySelector('.rshow button').onclick = show;
        card.querySelectorAll('.rmark button').forEach((b) => (b.onclick = () => done(b.dataset.ok === '1')));
        document.addEventListener('keydown', k);
      }));
    }
    grade(S, w.id, ok); store.save();
  }
}
