'use strict';
/* 天天 · 故 Stories. Short graded readers starring the Jinan characters.
   Content: data/stories/*.js (window.STORIES); word ids per story: data/stories-index.js (built by build/check_stories.js).
   Flow per story: Read (sentence by sentence; chunks underlined) → Questions (Chinese, 3–4) → Gaps (5–8 blanks on chunks,
   typed if you know every word in it, else pick from 4) → reward. New words and chunks go to Review WITH their sentence (S.ctx). */

const STORY_LIST = (window.STORIES || []).slice();
const STORY_UNLOCK = 0.9;               // share of a story's HSK words you must know
const SXP = { read: 40, q: 10, gap: 10, perfect: 30 };
const SS = () => { S.stories = S.stories || {}; S.ctx = S.ctx || {}; return S.stories; };
const storyIds = (st) => (window.STORY_WORDS || {})[st.id] || [];
function storyKnown(st) { const ids = storyIds(st); return ids.length ? ids.filter((id) => S.words[id]).length / ids.length : 1; }
function storyToGo(st) { const ids = storyIds(st), k = ids.filter((id) => S.words[id]).length; return Math.max(0, Math.ceil(ids.length * STORY_UNLOCK) - k); }
function storyStatus(st) {
  const p = SS()[st.id] || {};
  if (p.done) return 'done';
  if (storyKnown(st) < STORY_UNLOCK) return 'locked';
  return p.read ? 'read' : 'new';
}
function phrasePy(t) {   // dictionary readings first (饺子 → jiǎo zi), pinyin-pro for the rest
  const d = dict(), s = [...t], out = []; let i = 0;
  while (i < s.length) {
    let L = Math.min(4, s.length - i);
    for (; L > 1; L--) if (d.has(s.slice(i, i + L).join(''))) break;
    const w = s.slice(i, i + L).join(''), e = d.get(w);
    if (e && e.p) out.push(e.p); else { try { out.push(window.pinyinPro.pinyin(w)); } catch { out.push(''); } }
    i += L;
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}
const storyChar = (st) => CHARS[(st.chars || [])[0]] || null;

// ---------------------------------------------------------------- shelf
function stShelf() {
  hideTip();
  const order = { new: 0, read: 1, locked: 2, done: 3 };
  const groups = [1, 2, 3].map((h) => {
    const list = STORY_LIST.filter((s) => s.hsk === h)
      .sort((a, b) => order[storyStatus(a)] - order[storyStatus(b)] || storyKnown(b) - storyKnown(a));
    if (!list.length) return '';
    const done = list.filter((s) => storyStatus(s) === 'done').length;
    return `<div class="goalrow sgroup"><span class="label">HSK ${h}</span><b>${done} / ${list.length} read</b></div>
      <div class="shelf">${list.map(storyCard).join('')}</div>`;
  }).join('');
  const total = STORY_LIST.filter((s) => storyStatus(s) === 'done').length;
  render(shell('stories', `<div class="pagehead"><div class="label">故 · Stories · ${total} / ${STORY_LIST.length} read</div><h1>Stories</h1>
    <p>Read a short story about your Jinan neighbors, answer a few questions, then fill the gaps from context. Its words and phrases go to Review with the sentence you met them in.</p></div>${groups}`,
    brush('读书', 'font-size:260px;right:-50px;top:30px;color:var(--ink);opacity:.06')),
  (e) => e.key === 'Escape' && go('home'), () => on('[data-st]', 'click', (e) => {
    const st = STORY_LIST.find((s) => s.id === e.currentTarget.dataset.st);
    if (storyStatus(st) === 'locked') return toast(`Learn ${storyToGo(st)} more of its words to unlock (${Math.round(storyKnown(st) * 100)}% known). Keep doing levels!`, 3400);
    stOpen(st.id);
  }));
}
function storyCard(st) {
  const s = storyStatus(st), c = storyChar(st), p = SS()[st.id] || {};
  const pct = Math.round(storyKnown(st) * 100);
  const stat = s === 'done' ? `${stamp} Read${p.best ? ` · ${p.best}` : ''}` : s === 'read' ? 'Continue' : s === 'new' ? 'New' : `Locked · ${pct}% of words known`;
  return `<button class="scard ${s}" data-st="${st.id}">
    <span class="portrait sm ${hasFace(c) ? 'img' : ''}">${faceInner(c)}</span>
    <span class="sci"><b class="kai">${esc(st.title[0])}</b><span class="sce">${esc(st.title[1])}</span>
      <span class="smoke">${c ? `${esc(c.zh)} · ` : ''}${st.text.length} sentences${(st.new || []).length ? ` · ${(st.new || []).length} new word${st.new.length > 1 ? 's' : ''}` : ''}</span>
      <span class="sst">${stat}</span>
      ${s === 'locked' ? `<span class="bar thin" style="margin-top:6px"><i style="width:${pct}%"></i></span>` : ''}</span></button>`;
}

// ---------------------------------------------------------------- one story
let story = null;   // { st, phase, i, en, qi, qok, qs, bi, bok, gaps, missed[], replay }
function stOpen(id) {
  const st = STORY_LIST.find((s) => s.id === id); if (!st) return stShelf();
  const p = SS()[id] || {};
  story = { st, replay: !!p.done, i: 0, en: false, qi: 0, qok: 0, qs: shuffle(st.qs).map((q) => ({ ...q, order: shuffle([0, 1, 2]) })), bi: 0, bok: 0, gaps: st.blanks.slice().sort((a, b) => a.s - b.s), missed: [] };
  stRead();
}
function stFrame(label, pct, body, foot, keys, after) {
  HZ_LOCK = false;
  render(`<div class="drill sdrill"><div class="topbar"><button class="icon-btn sm" id="squit" aria-label="Close">${I.x}</button>
      <div class="bar thin ink"><i style="width:${Math.round(pct * 100)}%"></i></div><span class="pos slab">${label}</span></div>
    <div class="sbody" id="sbody">${body}</div><div class="foot">${foot}</div></div>`,
  (e) => { if (e.key === 'Escape') return stQuit(); keys && keys(e); },
  () => { on('#squit', 'click', stQuit); after && after(); });
}
function stQuit() {
  if (story && (story.i > 0 || story.phase !== 'read') && story.phase !== 'done' && !confirm('Leave this story? You can start it again any time.')) return;
  story = null; if (window.speechSynthesis) speechSynthesis.cancel(); stShelf();
}
function stHead(st) {
  const c = storyChar(st);
  return `<div class="shead"><span class="portrait sm ${hasFace(c) ? 'img' : ''}">${faceInner(c)}</span><div>
    <div class="label">故 · HSK ${st.hsk}${c ? ` · ${esc(c.en)}` : ''}</div>
    <div class="stitle"><span class="kai hz" data-en="${esc(st.title[1])}">${esc(st.title[0])}</span></div><div class="smoke">${esc(st.title[1])}</div></div></div>`;
}
// Chinese sentence → HTML: chunks underlined (click = meaning + note), new words marked, every word hoverable for pinyin.
function storyHtml(zh, st, opts = {}) {
  const marks = [];   // [start, end, html-wrapper]
  const taken = Array(zh.length).fill(false);
  const add = (needle, cls, attrs) => {
    if (!needle) return; let from = 0, i;
    while ((i = zh.indexOf(needle, from)) >= 0) {
      if (!taken.slice(i, i + needle.length).some(Boolean)) { marks.push([i, i + needle.length, cls, attrs]); for (let k = i; k < i + needle.length; k++) taken[k] = true; }
      from = i + needle.length;
    }
  };
  if (opts.blank) add(opts.blank, 'sgap', '');
  if (!opts.plain) (st.chunks || []).slice().sort((a, b) => b[0].length - a[0].length).forEach((c, ci) => add(c[0], 'chunk', `data-ck="${st.chunks.indexOf(c)}"`));
  if (!opts.plain) (st.new || []).forEach(([h, p, m]) => add(h, 'neww', `data-py="${esc(p)}" data-en="${esc(m)}"`));
  marks.sort((a, b) => a[0] - b[0]);
  let out = '', pos = 0;
  const words = (t) => zhWords(t);
  for (const [s, e, cls, attrs] of marks) {
    out += words(zh.slice(pos, s));
    const seg = zh.slice(s, e);
    if (cls === 'sgap') out += `<span class="sgap" id="sgap">${opts.filled ? `<span class="${opts.filledCls || ''}">${esc(opts.filled)}</span>` : '\u3000'.repeat(Math.max(2, [...seg].length))}</span>`;
    else if (cls === 'neww') out += `<span class="hz w neww" ${attrs}>${esc(seg)}</span>`;
    else out += `<span class="chunk" ${attrs}>${words(seg)}</span>`;
    pos = e;
  }
  return out + words(zh.slice(pos));
}
function wireChunks(st) {
  root.querySelectorAll('.chunk').forEach((el) => el.addEventListener('click', (e) => {
    e.stopPropagation();
    const c = st.chunks[+el.dataset.ck]; if (!c) return;
    const py = phrasePy(c[0]);
    showTip(el, `${py} · ${c[1]}${c[2] ? ' — ' + c[2] : ''}`);
  }));
}

// ---- 1. read
function stRead() {
  const { st } = story; story.phase = 'read';
  const last = story.i >= st.text.length - 1;
  const lines = st.text.slice(0, story.i + 1).map(([zh, en], k) => `<div class="sline ${k === story.i ? 'cur' : 'past'}" data-k="${k}">
      <div class="szh kai"><span class="szt">${storyHtml(zh, st)}</span><button class="cplay" data-zh="${esc(zh)}" aria-label="Play">${I.speaker}</button></div>
      <div class="sen" ${k === story.i && story.en ? '' : 'hidden'}>${esc(en)}</div></div>`).join('');
  stFrame(`Read · ${story.i + 1} / ${st.text.length}`, (story.i + 1) / st.text.length * 0.4,
    `${stHead(st)}<div class="slines" id="slines">${lines}</div>
     ${story.i === 0 ? `<div class="tip stip">Hover any word for pinyin. <u>Underlined</u> phrases are worth learning: click one. Click a sentence for English.</div>` : ''}`,
    `${hints([['Space', 'next'], ['P', 'play'], ['E', 'English'], ['B', 'back']])}<div class="right">${story.i > 0 ? `<button class="btn-secondary" id="sprev">Back</button>` : ''}<button class="btn-primary" id="snext">${last ? 'Questions' : 'Next'} <kbd>Space</kbd></button></div>`,
    (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); next(); }
      else if (e.key === 'p') speak(st.text[story.i][0]);
      else if (e.key === 'e') { story.en = !story.en; toggleEn(); }
      else if (e.key === 'b' && story.i > 0) { story.i--; stRead(); }
    }, () => {
      wireChunks(st);
      on('#snext', 'click', next); on('#sprev', 'click', () => { story.i--; stRead(); });
      on('.cplay', 'click', (e) => { e.stopPropagation(); speak(e.currentTarget.dataset.zh); });
      on('.sline', 'click', (e) => { if (e.target.closest('.chunk, .hz')) return; const en = e.currentTarget.querySelector('.sen'); en.hidden = !en.hidden; });
      const box = root.querySelector('#sbody'); box.scrollTop = box.scrollHeight;
    });
  function toggleEn() { const el = root.querySelector('.sline.cur .sen'); if (el) el.hidden = !story.en; }
  function next() {
    if (!last) { story.i++; return stRead(); }
    SS()[st.id] = { ...(SS()[st.id] || {}), read: SS()[st.id] && SS()[st.id].read || today() }; save();
    stQuestion();
  }
}

// ---- 2. comprehension questions (Chinese)
function stQuestion() {
  const { st } = story; story.phase = 'qs';
  const q = story.qs[story.qi]; if (!q) return stGaps();
  let answered = false;
  const opts = q.order.map((oi, k) => `<button class="opt" data-oi="${oi}"><span class="n">${k + 1}</span><span class="kai">${zhWords(q.o[oi])}</span></button>`).join('');
  stFrame(`Questions · ${story.qi + 1} / ${story.qs.length}`, 0.4 + (story.qi / story.qs.length) * 0.2,
    `<div class="sq"><div class="label">理解 · Comprehension</div><div class="sqq kai">${zhWords(q.q)}</div>
      <div class="options sopts">${opts}</div>
      <button class="btn-outline slook" id="slook">Look back at the story <kbd>L</kbd></button>
      <div class="slookbox" id="slookbox" hidden>${st.text.map(([zh]) => `<p class="kai">${storyHtml(zh, st)}</p>`).join('')}</div></div>`,
    `${hints([['1–3', 'answer'], ['L', 'look back']])}<div class="right"><button class="btn-primary" id="sgo" disabled>Continue <kbd>↵</kbd></button></div>`,
    (e) => {
      if (!answered && ['1', '2', '3'].includes(e.key)) pick(q.order[+e.key - 1]);
      else if (e.key === 'l') look();
      else if (answered && e.key === 'Enter') nextQ();
    }, () => {
      on('.opt', 'click', (e) => !answered && pick(+e.currentTarget.dataset.oi));
      on('#slook', 'click', look); on('#sgo', 'click', () => answered && nextQ()); wireChunks(st);
    });
  function look() { const b = root.querySelector('#slookbox'); b.hidden = !b.hidden; }
  function pick(oi) {
    answered = true; const ok = oi === q.a; if (ok) story.qok++;
    root.querySelectorAll('.opt').forEach((b) => { const x = +b.dataset.oi; b.classList.add(x === q.a ? 'ok' : x === oi ? 'bad' : 'dim'); });
    setFoot(ok ? 'ok' : 'bad', ok ? '对！ Correct' : `The answer: <span class="kai">${esc(q.o[q.a])}</span>`);
    const g = root.querySelector('#sgo'); g.disabled = false;
  }
  function nextQ() { story.qi++; stQuestion(); }
}

// ---- 3. gaps: the story again, with blanks on chunks/collocations
const learnedEntry = (h) => { const w = dict().get(h); return w && S.words[w.id] ? w : null; };
// type it if every word in it is one you've learned; otherwise pick from 4
function canType(t) {
  if (learnedEntry(t)) return true;
  const s = [...t]; let i = 0;
  while (i < s.length) {
    let L = Math.min(4, s.length - i), ok = false;
    for (; L >= 1; L--) { const w = s.slice(i, i + L).join(''); if (learnedEntry(w)) { ok = true; break; } }
    if (!ok) return false; i += L;
  }
  return true;
}
function stGaps() {
  const { st } = story; story.phase = 'gaps';
  const g = story.gaps[story.bi]; if (!g) return stFinish();
  const typed = canType(g.t);
  const opts = typed ? [] : shuffle([g.t, ...g.d]);
  let answered = false;
  // context lines: the sentence before and after; a later gap in them stays hidden so it isn't given away
  const later = (k) => story.gaps.find((x, j) => j > story.bi && x.s === k);
  const ctx = (k, cls) => {
    if (!st.text[k]) return '';
    const o = k === g.s ? { blank: g.t, plain: true } : later(k) ? { blank: later(k).t, plain: true } : { plain: true };
    return `<div class="sctx ${cls}"><div class="kai">${storyHtml(st.text[k][0], st, o)}</div></div>`;
  };
  stFrame(`Gaps · ${story.bi + 1} / ${story.gaps.length}`, 0.6 + (story.bi / story.gaps.length) * 0.4,
    `<div class="sgaps"><div class="label">语境 · Fill the gap from context</div>
      ${ctx(g.s - 1, 'faded')}${ctx(g.s, 'cur')}${ctx(g.s + 1, 'faded')}
      <div class="sgen smoke" id="sgen" hidden>${esc(st.text[g.s][1])}</div>
      ${typed ? `<div class="sgin"><input class="typein" id="sin" autocomplete="off" spellcheck="false" lang="zh-CN" placeholder="打字…"></div>`
        : `<div class="options sopts four">${opts.map((o, k) => `<button class="opt" data-o="${esc(o)}"><span class="n">${k + 1}</span><span class="kai">${esc(o)}</span></button>`).join('')}</div>`}</div>`,
    `${hints(typed ? [['↵', 'check'], ['Tab', 'hint']] : [['1–4', 'answer']])}<div class="right"><button class="btn-primary" id="sgo">${typed ? 'Check' : 'Continue'} <kbd>↵</kbd></button></div>`,
    (e) => {
      if (answered) { if (e.key === 'Enter') { e.preventDefault(); nextGap(); } return; }
      if (typed) { if (e.key === 'Enter') { e.preventDefault(); check(); } else if (e.key === 'Tab') { e.preventDefault(); hint(); } }
      else if (['1', '2', '3', '4'].includes(e.key)) answer(opts[+e.key - 1]);
    }, () => {
      wireChunks(st);
      on('#sgo', 'click', () => (answered ? nextGap() : typed ? check() : null));
      on('.opt', 'click', (e) => !answered && answer(e.currentTarget.dataset.o));
      const inp = root.querySelector('#sin'); if (inp) { inp.focus(); inp.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); hint(); } }); }
    });
  function hint() { const py = phrasePy(g.t); setFoot('', `Hint: <b>${esc(py)}</b>`); }
  function check() {
    const inp = root.querySelector('#sin'); const v = inp.value.replace(/[\s，。！？、,.!?]/g, '');
    if (!v) return setFoot('bad', 'Type an answer first');
    inp.readOnly = true; inp.classList.add(v === g.t ? 'ok' : 'bad'); answer(v);
  }
  function answer(v) {
    answered = true; const ok = v === g.t;
    if (ok) story.bok++; else story.missed.push(g.t);
    root.querySelectorAll('.opt').forEach((b) => b.classList.add(b.dataset.o === g.t ? 'ok' : b.dataset.o === v ? 'bad' : 'dim'));
    const gap = root.querySelector('.sctx.cur #sgap'); if (gap) gap.innerHTML = `<span class="${ok ? 'gok' : 'gbad'}">${esc(g.t)}</span>`;
    const ch = (st.chunks || []).find((c) => c[0] === g.t || c[0].includes(g.t) || g.t.includes(c[0]));
    const py = phrasePy(g.t);
    setFoot(ok ? 'ok' : 'bad', `${ok ? '对！' : 'Answer:'} <span class="kai">${esc(g.t)}</span> · ${esc(py)}${ch ? ` · ${esc(ch[1])}` : ''}`);
    speak(st.text[g.s][0]);
    const en = root.querySelector('#sgen'); if (en) en.hidden = false;
    const b = root.querySelector('#sgo'); b.innerHTML = 'Continue <kbd>↵</kbd>';
  }
  function nextGap() { story.bi++; stGaps(); }
}

// ---- 4. finish: XP, words + chunks to Review with their sentence
function addCtx(id, zh, en, sid) {
  const list = (S.ctx[id] = S.ctx[id] || []);
  if (!list.some((c) => c.zh === zh)) { list.push({ zh, en, s: sid }); if (list.length > 3) list.shift(); }
}
function storyEntry(h, p, m) {   // an HSK word, or a phrase/new word stored as an extra review card
  const w = dict().get(h); if (w) return w;
  S.extraWords = S.extraWords || [];
  let x = S.extraWords.find((e) => e.h === h);
  if (!x) {
    let n = ''; try { n = window.pinyinPro.pinyin(h, { toneType: 'num' }).replace(/0/g, '5'); } catch {}
    if (!p) p = phrasePy(h);
    x = { id: 100000 + S.extraWords.length, h, p, n, m, all: m, hsk: 0, extra: true };
    S.extraWords.push(x); W[x.id] = x; DICT = null;
  }
  return x;
}
function stFinish() {
  const { st } = story; story.phase = 'done';
  SS(); const sid = st.id, before = rank().i;
  const sentOf = (h) => st.text.find(([zh]) => zh.includes(h)) || st.text[0];
  const added = [];
  // new words + chunks: into Review, with the sentence where they appear
  [...(st.new || []).map(([h, p, m]) => [h, p, m]), ...(st.chunks || []).map(([h, m]) => [h, '', m])].forEach(([h, p, m]) => {
    const e = storyEntry(h, p, m), [zh, en] = sentOf(h);
    addCtx(e.id, zh, en, sid);
    if (!S.words[e.id]) { learnWord(e.id, 1); added.push(e); }
  });
  // words you already know get this story as a context, and due ones are pushed back a little (seen in context)
  storyIds(st).forEach((id) => {
    const w = W[id]; if (!w || !S.words[id] || [...w.h].length < 2) return;
    const s = st.text.find(([zh]) => zh.includes(w.h)); if (s) addCtx(id, s[0], s[1], sid);
    if (S.words[id].due <= Date.now()) S.words[id].due = Date.now() + DAY;
  });
  // missed gaps go back into Review sooner
  story.missed.forEach((h) => { const e = dict().get(h); if (e && S.words[e.id]) grade(e.id, false); });
  const perfect = story.bok === story.gaps.length && story.qok === story.qs.length;
  let xp = SXP.read + SXP.q * story.qok + SXP.gap * story.bok + (perfect ? SXP.perfect : 0);
  if (story.replay) xp = Math.round(xp * 0.25);
  addXp(xp);
  const p = SS()[sid] || {};
  SS()[sid] = { ...p, read: p.read || today(), done: p.done || today(), plays: (p.plays || 0) + 1, best: bestOf(p.best, `${story.bok}/${story.gaps.length}`) };
  S.stats.stories = (S.stats.stories || 0) + 1;
  planMark('story'); if (!p.done) weekBump('stories');
  const milestone = markPractice();
  const got = checkBadges(); save();
  const r = rank(), rankUp = r.i > before;
  const say = SAYINGS[(S.stats.stories - 1) % SAYINGS.length];
  const art = rankUp ? rankArt(r) : milestone ? milestoneCups() : heroSaying(say);
  const head = rankUp ? `${r.hz}!` : milestone ? `连胜 ${S.streak.count}!` : perfect ? '太棒了!' : '读完了!';
  const sub = rankUp ? `New rank · ${r.en}` : milestone ? `${S.streak.count}-day streak` : perfect ? 'Perfect' : 'Story finished';
  const nextSt = STORY_LIST.filter((s) => ['new', 'read'].includes(storyStatus(s)) && s.id !== sid).sort((a, b) => a.hsk - b.hsk)[0];
  const finishStats = { q: `${story.qok} / ${story.qs.length}`, g: `${story.bok} / ${story.gaps.length}` };
  story = null;
  render(`<div class="reward"><div class="col">
    ${rewardHero({ label: `故 · ${esc(st.title[0])} · ${esc(st.title[1])}`, head, sub, art, say: rankUp || milestone ? null : say })}
    <div class="stats4">${statCard('Questions', `${finishStats.q}`)}${statCard('Gaps', `${finishStats.g}`)}${statCard('XP earned', '+' + xp)}${statCard('To Review', added.length)}</div>
    ${added.length ? `<div class="chips">${added.map((w) => `<span class="chip"><span class="kai">${esc(w.h)}</span>${esc(w.m)}</span>`).join('')}</div>` : ''}
    ${p.done ? goldNote('Replay · 25% XP') : ''}
    ${got.map(badgeNote).join('')}
    <div class="actions"><button class="btn-secondary" id="sback">Stories <kbd>Esc</kbd></button>${nextSt ? `<button class="btn-primary" id="snextst">Next story <kbd>↵</kbd></button>` : ''}</div>
  </div></div>`, (e) => { if (e.key === 'Escape') stShelf(); if (e.key === 'Enter' && nextSt) stOpen(nextSt.id); },
  () => { on('#sback', 'click', stShelf); on('#snextst', 'click', () => stOpen(nextSt.id)); });
  planButton();
}
function bestOf(a, b) { if (!a) return b; const v = (x) => { const [n, d] = x.split('/').map(Number); return n / d; }; return v(b) > v(a) ? b : a; }
