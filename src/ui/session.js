// One beat's session (CONCEPT §2.1): Refresh → Learn → Use → Notebook.
// Runs as one overlay that owns the keyboard; Esc pauses it and progress.beatStep remembers where you were.
//   runSession({ ... }) → Promise<'done' | 'paused'>
import { openModal, closeModal } from './modal.js';
import { makeDrills, shuffle } from './drills.js';
import { speak, stop } from '../audio/index.js';
import { setHzLock } from '../hz/hz.js';
import { dueIds } from '../core/srs.js';
import { answeredRight, answeredWrong, refreshMark, pendingIds, markSeen, addCtx } from '../core/words.js';
import { notebookHtml, notebookSummary } from './notebook.js';
import { byId, pyPlain } from '../lexicon.js';
import { todayKey } from '../core/clock.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const STEPS = ['refresh', 'learn', 'use', 'notebook'];
const STEP_EN = { refresh: 'Refresh', learn: 'Learn', use: 'Use', notebook: 'Notebook' };
const PUNCT = /^[，。？！、：；…]+$/;
const PAUSED = Symbol('paused');

export function runSession({ store, district, beat, steps = STEPS, startAt, portraitFor, toast }) {
  const S = () => store.state;
  const save = () => store.save();
  const pool = district.all;
  const before = new Set(Object.keys(S().words));
  let keyFn = null, finish;

  const el = document.createElement('div');
  el.className = 'session';
  el.setAttribute('data-step', '');
  el.innerHTML = `<div class="shead"><span class="stitle">${esc(beat.title)}</span>
      <ol class="ssteps">${steps.map((s) => `<li data-s="${s}">${STEP_EN[s]}</li>`).join('')}</ol>
      <span class="sprog" id="sprog"></span><button class="btn spause" id="spause">Pause <kbd>Esc</kbd></button></div>
    <div class="sbody" id="sbody"></div>`;
  const body = el.querySelector('#sbody');
  const setKeys = (f) => { keyFn = f; };
  const prog = (t) => { el.querySelector('#sprog').textContent = t || ''; };

  const silent = () => { const m = S().settings.silent; return !!(m && m.on && m.date === todayKey()); };
  const drills = makeDrills({
    body, setKeys, pool,
    isSilent: () => silent(),
    leniency: () => S().settings.leniency,
    autoAnswer: () => !!S().dev.autoAnswer
  });

  // every awaited card goes through here, so Esc can stop the session between or during cards
  let ended = false;
  const wait = (p) => { const stopper = new Promise((_, rej) => { finish = () => rej(PAUSED); }); stopper.catch(() => {}); return Promise.race([p, stopper]); };

  function showStep(s) {
    el.dataset.step = s;
    el.querySelectorAll('.ssteps li').forEach((li) => { li.className = li.dataset.s === s ? 'on' : steps.indexOf(li.dataset.s) < steps.indexOf(s) ? 'done' : ''; });
    S().progress.beatStep = s; save();
  }

  // ---------------------------------------------------------------- Refresh
  async function refresh() {
    const ids = [...new Set([...pendingIds(S()), ...dueIds(S())])].filter((id) => byId(id));
    if (!ids.length) {
      body.innerHTML = `<div class="card panel"><div class="label">Refresh</div><div class="meaning">Nothing is due today.</div>
        <div class="foot"><span></span><button class="btn primary" id="go">Continue <kbd>↵</kbd></button></div></div>`;
      await wait(new Promise((r) => { body.querySelector('#go').onclick = r; setKeys((e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); r(); } }); }));
      return;
    }
    for (const [k, id] of ids.entries()) {
      prog(`${k + 1} / ${ids.length}`);
      await wait(flipCard(id));
    }
  }

  // 天天's review card: flip, then mark. Some cards are the sentence you met the word in, with a gap.
  function flipCard(id) {
    return new Promise((done) => {
      const e0 = byId(id), w = pool.find((x) => x.id === id) || { id, h: e0.h, p: e0.p || pyPlain(e0.h), m: e0.m };
      const ctxs = (S().ctx[id] || []).filter((c) => c.zh.includes(w.h));
      const ctx = ctxs.length && Math.random() < 0.5 ? ctxs[Math.floor(Math.random() * ctxs.length)] : null;
      const gap = '＿'.repeat(Math.max(2, [...w.h].length));
      setHzLock(true);
      body.innerHTML = `<div class="card panel flip"><div class="label">Refresh · do you remember it?${S().pending[id] ? ' <span class="note">(missed last time)</span>' : ''}</div>
        ${ctx ? `<div class="ctxzh zh lockzh">${esc(ctx.zh).split(esc(w.h)).join(`<span class="ctxgap" id="gap">${gap}</span>`)}</div><div class="note">${esc(ctx.en)}</div>` : `<div class="bigzh zh lockzh">${esc(w.h)}</div>`}
        <div class="back" id="back" hidden>${ctx ? `<div class="zh">${esc(w.h)}</div>` : ''}<div class="wpy">${esc(w.p)}</div><div class="meaning">${esc(w.m)}</div></div>
        <div class="foot"><span></span><span id="r1"><button class="btn primary" id="flip">Flip <kbd>Space</kbd></button></span>
          <span id="r2" hidden><button class="btn" id="miss">Missed it <kbd>1</kbd></button> <button class="btn primary" id="knew">Knew it <kbd>2</kbd></button></span></div></div>`;
      let flipped = false;
      const flip = () => {
        flipped = true; setHzLock(false);
        body.querySelectorAll('.lockzh').forEach((x) => x.classList.remove('lockzh'));
        body.querySelector('#back').hidden = false; body.querySelector('#r1').hidden = true; body.querySelector('#r2').hidden = false;
        const g = body.querySelector('#gap'); if (g) { g.textContent = w.h; g.classList.add('on'); }
        speak(ctx ? ctx.zh : w.h);
      };
      const mark = (good) => {
        if (!flipped) return;
        const r = refreshMark(S(), id, good); save();
        body.querySelector('.card').classList.add(good ? 'ok' : 'bad');
        if (r === 'caught') toast(`Caught ✓ ${w.h}`);
        setTimeout(done, 260);
      };
      body.querySelector('#flip').onclick = flip; body.querySelector('#miss').onclick = () => mark(false); body.querySelector('#knew').onclick = () => mark(true);
      setKeys((e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipped ? mark(true) : flip(); }
        else if (flipped && e.key === '1') mark(false); else if (flipped && e.key === '2') mark(true);
      });
    });
  }

  // ---------------------------------------------------------------- Learn
  async function learn() {
    const fresh = beat.entries.filter((w) => !S().words[w.id]);
    if (!fresh.length) return;
    // groups of four: the intro cards, then two quick drills per word, spread so one word never comes twice in a row
    const groups = [];
    for (let i = 0; i < fresh.length; i += 4) groups.push(fresh.slice(i, i + 4));
    let k = 0;
    for (const g of groups) {
      for (const w of g) { k++; prog(`New word ${k} / ${fresh.length}`); markSeen(S(), w.id); save(); await wait(drills.intro(w, k, fresh.length)); }
      const items = spread(g.flatMap((w) => { const n = fresh.indexOf(w); return [{ w, t: n % 2 ? 'hear' : 'read' }, { w, t: ['pick', 'tone', 'trace'][n % 3] }]; }));
      const tries = new Map();
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        prog(`Practice · ${g.map((x) => x.h).join(' ')}`);
        const ok = await wait(it.t === 'trace' ? drills.trace(it.w) : drills.choice(it.w, it.t));
        if (!ok) {
          // a miss comes back a few cards later (at most three times)
          const n = (tries.get(it) || 0) + 1;
          if (n <= 3) { const again = { ...it }; tries.set(again, n); items.splice(Math.min(items.length, i + 3), 0, again); }
        }
      }
    }
  }
  function spread(list) {
    for (let t = 0; t < 60; t++) { const s = shuffle(list); if (s.every((x, i) => !i || x.w !== s[i - 1].w)) return s; }
    return shuffle(list);
  }

  // ---------------------------------------------------------------- Use (the scene)
  async function use() {
    const steps = beat.scene.steps;
    const cast = district.cast;
    let misses = 0, last = null;
    body.innerHTML = `${beat.scene.backdrop ? `<div class="backdrop ${esc(beat.scene.backdrop)}"></div>` : ''}<div class="prompt-area" id="pa"></div>
      <div class="dialogue panel" id="dlg"><div class="portrait" id="por"></div><div class="dbody"><div class="dname" id="dname"></div><div class="dline zh" id="dline"></div>
      <div class="dfoot"><button class="icon-btn dsay" id="dsay" aria-label="Listen again">🔊</button><span class="note" id="dcount"></span><button class="btn primary dnext" id="dnext">Next <kbd>Space</kbd></button></div></div></div>`;
    const pa = body.querySelector('#pa');
    const lineFor = (st, hidden) => {
      const who = cast[st.who] || { name: '', en: '' };
      const p = st.who && st.who !== 'me' && portraitFor(st.who);
      body.querySelector('#por').innerHTML = p ? `<img src="${esc(p.src)}" alt="" class="${p.pixel ? 'pixel' : ''}">` : '';
      body.querySelector('#por').hidden = !st.who;
      body.querySelector('#dname').innerHTML = st.who ? `${who.name ? `<span class="zh">${esc(who.name)}</span> ` : ''}<span class="den">${esc(who.en)}</span>` : '';
      const dl = body.querySelector('#dline');
      dl.className = 'dline ' + (st.do ? 'narr' : 'zh') + (hidden ? ' hiddenline' : '');
      dl.innerHTML = hidden ? '' : esc(st.zh || st.do);
      if (hidden) dl.setAttribute('data-hidden', st.zh); else dl.removeAttribute('data-hidden');
    };
    const reveal = () => { const dl = body.querySelector('#dline'); if (dl.dataset.hidden != null) { dl.textContent = dl.dataset.hidden; dl.removeAttribute('data-hidden'); dl.classList.remove('hiddenline'); } };
    const metLine = (zh, en) => { for (const e of district.wordsIn(zh)) { markSeen(S(), e.id); addCtx(S(), e.id, zh, en || ''); } save(); };
    const tapNext = () => new Promise((r) => {
      const nx = body.querySelector('#dnext'); nx.hidden = false; nx.onclick = r;
      setKeys((e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); r(); } });
    });

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      prog(`${i + 1} / ${steps.length}`);
      if (!st.ask) {
        // a line you will be asked to listen to next stays hidden until you answer (unless silent mode is on)
        const nxt = steps[i + 1];
        const hide = st.zh && nxt && nxt.ask === 'listen' && st.zh.includes(nxt.hear) && !silent();
        lineFor(st, hide); last = st;
        body.querySelector('#dsay').hidden = !st.zh;
        body.querySelector('#dsay').onclick = () => speak(st.zh, { who: st.who });
        if (st.zh) { speak(st.zh, { who: st.who }); metLine(st.zh, st.en); }
        if (hide) { body.querySelector('#dline').innerHTML = '<span class="note">🔊 Listen…</span>'; }
        await wait(tapNext());
        continue;
      }
      body.querySelector('#dnext').hidden = true;
      const ok = await wait(prompt(st, pa, last));
      if (!ok) misses++;
      reveal();
      // you say your answer
      const said = st.ask === 'listen' ? null : answerText(st);
      if (said) { lineFor({ who: 'me', zh: said }); body.querySelector('#dsay').onclick = () => speak(said); speak(said, { who: 'me' }); metLine(said, ''); await wait(tapNext()); }
    }
    S().stats.conversations++; if (!misses) S().stats.cleanConversations++; save();
    pa.innerHTML = '';
  }

  const answerText = (st) => (st.ask === 'build' ? st.tiles.join('') : st.answer);

  // one prompt in the scene. Right first time catches the prompt's words; a miss shows the answer and they wait in Refresh.
  function prompt(st, pa, lastLine) {
    return new Promise((done) => {
      const ans = answerText(st);
      const cheat = !!S().dev.autoAnswer;
      setHzLock(true);
      const result = (ok, yours) => {
        setHzLock(false);
        const caught = [];
        for (const h of st.words || []) {
          const e = district.byH.get(h); if (!e) continue;
          if (ok) { if (answeredRight(S(), e.id) === 'caught') caught.push(h); } else answeredWrong(S(), e.id);
        }
        save();
        if (caught.length) toast(`Caught ✓ ${caught.join(' ')}`);
        if (ok) { pa.querySelector('.pcard').classList.add('ok'); setTimeout(() => { pa.innerHTML = ''; done(true); }, 700); }
        else {
          const box = document.createElement('div'); box.className = 'wrongbox';
          box.innerHTML = `<div class="wrongcard panel" role="dialog" aria-label="Correct answer"><div class="label">Not quite · the answer</div>
            ${yours ? `<div class="note">You chose 「${esc(yours)}」</div>` : ''}<div class="whz zh">${esc(ans)}</div><div class="wpy">${esc(pyPlain(ans))}</div>
            <div class="row"><button class="btn" id="wplay">🔊 Listen <kbd>Space</kbd></button><button class="btn primary" id="wok">Got it <kbd>↵</kbd></button></div>
            <div class="note">These words come back in your next Refresh.</div></div>`;
          body.appendChild(box);
          const close = () => { box.remove(); pa.innerHTML = ''; done(false); };
          box.querySelector('#wok').onclick = close; box.querySelector('#wplay').onclick = () => speak(ans);
          setKeys((e) => { if (e.key === 'Enter') { e.preventDefault(); close(); } else if (e.key === ' ') { e.preventDefault(); speak(ans); } });
        }
      };

      if (st.ask === 'build') {
        const bank = shuffle([...st.tiles, ...(st.extra || [])].filter((t) => !PUNCT.test(t)).map((t, i) => ({ t, i })));
        const want = st.tiles.filter((t) => !PUNCT.test(t)).join('|');
        const picked = [];
        // test answers (dev panel): which bank tile goes in which place
        const order = new Map();
        if (cheat) want.split('|').forEach((t, pos) => { const k = bank.findIndex((b, j) => b.t === t && !order.has(j)); order.set(k, pos); });
        pa.innerHTML = `<div class="pcard panel question"><div class="label">${esc(st.label)}</div>
          <div class="built zh answers" id="built"></div>
          <div class="bank answers">${bank.map((b, k) => `<button class="tile zh${order.has(k) ? ' cheat' : ''}" data-k="${k}" ${order.has(k) ? `data-order="${order.get(k)}"` : ''}><span class="n">${k + 1}</span>${esc(b.t)}</button>`).join('')}</div>
          <div class="foot"><button class="btn" id="undo">Undo <kbd>⌫</kbd></button><button class="btn primary" id="check">Say it <kbd>↵</kbd></button></div></div>`;
        const draw = () => {
          pa.querySelector('#built').innerHTML = picked.length ? picked.map((k) => `<span class="btile">${esc(bank[k].t)}</span>`).join('') : '<span class="note">Pick the words in order</span>';
          pa.querySelectorAll('.tile').forEach((b) => { b.disabled = picked.includes(+b.dataset.k); });
        };
        const add = (k) => { if (k < bank.length && !picked.includes(k)) { picked.push(k); draw(); } };
        let answered = false;
        const check = () => {
          if (answered || !picked.length) return;
          answered = true;
          const got = picked.map((k) => bank[k].t).join('|');
          result(got === want, got.replace(/\|/g, ''));
        };
        pa.querySelectorAll('.tile').forEach((b) => (b.onclick = () => add(+b.dataset.k)));
        pa.querySelector('#undo').onclick = () => { picked.pop(); draw(); };
        pa.querySelector('#check').onclick = check;
        setKeys((e) => {
          const n = +e.key; if (n >= 1 && n <= bank.length) add(n - 1);
          else if (e.key === 'Backspace') { picked.pop(); draw(); } else if (e.key === 'Enter') { e.preventDefault(); check(); }
        });
        draw();
        return;
      }

      const opts = shuffle(st.options);
      const listen = st.ask === 'listen';
      pa.innerHTML = `<div class="pcard panel question"><div class="label">${esc(st.label)}</div>
        ${listen ? `<div class="prow"><button class="listen" id="hear" aria-label="Listen again">🔊</button>${silent() ? `<span class="zh">${esc(st.hear)}</span>` : '<span class="note">Listen, then choose</span>'}</div>` : ''}
        <div class="options answers">${opts.map((o, k) => `<button class="opt zh${cheat && o === st.answer ? ' cheat' : ''}" data-k="${k}"><span class="n">${k + 1}</span>${esc(o)}</button>`).join('')}</div></div>`;
      let answered = false;
      const pick = (k) => {
        if (answered) return; answered = true;
        pa.querySelectorAll('.opt').forEach((b, j) => b.classList.add(opts[j] === st.answer ? 'ok' : j === k ? 'bad' : 'dim'));
        result(opts[k] === st.answer, opts[k]);
      };
      pa.querySelectorAll('.opt').forEach((b) => (b.onclick = () => pick(+b.dataset.k)));
      if (listen) { pa.querySelector('#hear').onclick = () => speak(st.hear, { who: lastLine && lastLine.who }); if (!silent()) speak(st.hear, { who: lastLine && lastLine.who }); }
      setKeys((e) => { const n = +e.key; if (n >= 1 && n <= opts.length) pick(n - 1); else if (e.key === ' ' && listen) { e.preventDefault(); speak(st.hear, { who: lastLine && lastLine.who }); } });
    });
  }

  // ---------------------------------------------------------------- Notebook
  async function notebook() {
    const sum = notebookSummary(S(), district, before);
    const msg = sum.justClear ? `${sum.justClear === 1 ? 'A line has' : sum.justClear + ' lines have'} come into focus. Read ${sum.justClear === 1 ? 'it' : 'them'}.`
      : sum.fresh ? `${sum.fresh} word${sum.fresh === 1 ? '' : 's'} on this page ${sum.fresh === 1 ? 'is' : 'are'} written clearly now. No line is fully clear yet.`
        : 'Nothing new on this page today.';
    body.innerHTML = `<div class="card panel nbcard"><div class="label">Old Zhou's notebook · page 1</div>${notebookHtml(S(), district, before)}
      <div class="foot"><span class="note">${esc(msg)} ${sum.written} of ${sum.words} words written.</span><button class="btn primary" id="go">Close the notebook <kbd>↵</kbd></button></div></div>`;
    await wait(new Promise((r) => { body.querySelector('#go').onclick = r; setKeys((e) => { if (e.key === 'Enter') { e.preventDefault(); r(); } }); }));
  }

  // ---------------------------------------------------------------- run
  return new Promise((resolve) => {
    openModal(el, {
      onKey: (e) => { if (keyFn) keyFn(e); },
      onClose: () => { stop(); setHzLock(false); drills.clearWriters(); if (!ended && finish) finish(); }
    });
    el.querySelector('#spause').onclick = () => closeModal();
    (async () => {
      const run = { refresh, learn, use, notebook };
      const from = Math.max(0, steps.indexOf(startAt));
      try {
        for (const s of steps.slice(from)) { showStep(s); prog(''); await run[s](); }
        S().progress.beatStep = 'done'; save();
        ended = true; closeModal();
        resolve('done');
      } catch (err) {
        if (err !== PAUSED) { console.error(err); closeModal(); }
        resolve('paused');
      }
    })();
  });
}
