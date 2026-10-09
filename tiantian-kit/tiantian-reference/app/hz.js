'use strict';
/* 天天 · Chinese everywhere: hover any Chinese word for pinyin, click for English (locked inside a question until it's answered),
   and a dictionary that opens from anywhere (🔍 top right, or ⌘K). Loaded after jinan.js (uses zhWords, dict, showTip). */

// ---------------------------------------------------------------- hover/click on every Chinese word
const HZ_SKIP = 'input, textarea, select, option, script, style, svg, .hz, .hztip, .brush, .couplet, .dragbar, [data-nohz], kbd, .dictpanel';
const HAN_ANY = /[\u3400-\u9fff]/;
function hzify(node) {
  if (!node) return;
  if (node.nodeType === 3) return hzText(node);
  if (node.nodeType !== 1 || node.closest(HZ_SKIP)) return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: (t) => (HAN_ANY.test(t.nodeValue) && t.parentElement && !t.parentElement.closest(HZ_SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  });
  const list = []; while (walker.nextNode()) list.push(walker.currentNode);
  list.forEach(hzText);
}
function hzText(t) {
  if (!t.parentNode || !HAN_ANY.test(t.nodeValue) || (t.parentElement && t.parentElement.closest(HZ_SKIP))) return;
  // one inline wrapper, so flex/grid containers still see a single item
  const wrap = document.createElement('span');
  wrap.className = 'hzr';
  wrap.innerHTML = zhWords(t.nodeValue);
  t.parentNode.replaceChild(wrap, t);
}
let hzQueue = [], hzRaf = 0;
new MutationObserver((muts) => {
  muts.forEach((m) => { if (m.type === 'characterData') hzQueue.push(m.target); else m.addedNodes.forEach((n) => hzQueue.push(n)); });
  if (!hzRaf) hzRaf = requestAnimationFrame(() => { hzRaf = 0; const q = hzQueue; hzQueue = []; q.forEach((n) => { if (document.contains(n)) hzify(n); }); });
}).observe(document.body, { childList: true, subtree: true, characterData: true });
hzify(document.body);

// ---------------------------------------------------------------- dictionary
const DICT_ICON = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>`;
const dictBtn = document.createElement('button');
dictBtn.className = 'dictbtn'; dictBtn.id = 'dictbtn'; dictBtn.title = 'Dictionary (⌘K)'; dictBtn.setAttribute('aria-label', 'Dictionary');
dictBtn.innerHTML = DICT_ICON;
document.body.appendChild(dictBtn);
dictBtn.addEventListener('click', () => (document.getElementById('dictpanel') ? dictClose() : dictOpen()));
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); e.stopPropagation(); document.getElementById('dictpanel') ? dictClose() : dictOpen(); }
}, true);

let DIDX = null;
function dictIndex() {
  if (DIDX && DIDX.n === W.length + (S.extraWords || []).length) return DIDX.list;
  const strip = (s) => String(s || '').toLowerCase().replace(/ü|u:/g, 'v').replace(/\s+/g, '');
  const list = W.filter(Boolean).map((w) => {
    const num = strip(w.n).replace(/5/g, '');
    return { w, num, plain: num.replace(/\d/g, ''), m: String(w.m || '').toLowerCase(), all: String(w.all || '').toLowerCase() };
  });
  DIDX = { n: W.length + (S.extraWords || []).length, list };
  return list;
}
function dictSearch(raw) {
  const q = raw.trim(); if (!q) return [];
  const list = dictIndex(), out = [];
  if (HAN_ANY.test(q)) {
    for (const e of list) {
      const h = e.w.h; let sc = 0;
      if (h === q) sc = 100; else if (h.startsWith(q)) sc = 80 - (h.length - q.length); else if (h.includes(q)) sc = 60 - (h.length - q.length); else if (q.includes(h) && h.length > 1) sc = 50 + h.length;
      if (sc) out.push([sc, e]);
    }
  } else {
    let qn = q.toLowerCase();
    try { if (/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(qn)) qn = window.pinyinPro.convert(qn, { format: 'symbolToNum' }); } catch {}
    qn = qn.replace(/ü|u:/g, 'v').replace(/\s+/g, '').replace(/5/g, '');
    const tones = /\d/.test(qn), qp = qn.replace(/\d/g, ''), ql = q.toLowerCase().trim();
    const wordRx = new RegExp(`(^|[^a-z])${ql.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`);
    for (const e of list) {
      let sc = 0;
      if (/^[a-z\dv:]+$/.test(qn)) {
        if (tones) { if (e.num === qn) sc = 95; else if (e.num.startsWith(qn)) sc = 68; }
        else if (e.plain === qp) sc = 90; else if (qp.length >= 2 && e.plain.startsWith(qp)) sc = 62;
      }
      const glosses = e.m.split(/[;,]/).map((x) => x.trim().replace(/^to /, ''));
      if (glosses.includes(ql) || glosses.includes(ql.replace(/^to /, ''))) sc = Math.max(sc, 92);
      else if (wordRx.test(e.m)) sc = Math.max(sc, 74);
      else if (ql.length >= 3 && wordRx.test(e.all)) sc = Math.max(sc, 54);
      if (sc) out.push([sc, e]);
    }
  }
  return out.sort((a, b) => b[0] - a[0] || (a[1].w.hsk || 9) - (b[1].w.hsk || 9) || a[1].w.h.length - b[1].w.h.length).slice(0, 40).map((x) => x[1].w);
}
function metIn(w) {
  const c = ((S.ctx || {})[w.id] || [])[0];
  if (c) { const st = (window.STORIES || []).find((s) => s.id === c.s); return `Met in ${st ? `the story <span class="kai">${esc(st.title[0])}</span>` : 'a story'}: <span class="kai">${esc(c.zh)}</span>`; }
  if (w.extra) return 'Picked up in Jinan or a story';
  const lv = LEVELS.find((l) => l.ids.includes(w.id));
  return lv ? `${S.levelsDone[lv.n] ? 'Learned in' : 'Comes in'} Level ${lv.n}` : '';
}
let dictSel = 0, dictRes = [];
function dictOpen() {
  if (document.getElementById('dictpanel')) return;
  hideTip();
  const p = document.createElement('div');
  p.className = 'dictpanel'; p.id = 'dictpanel';
  p.innerHTML = `<div class="dicthead"><span class="dicticon">${DICT_ICON}</span><input id="dictq" placeholder="Search English, pinyin or 汉字" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div>
    <div class="dictres" id="dictres"><div class="dictempty">Try <b>happy</b>, <b>xihuan</b>, <b>xi3huan</b> or <span class="kai">喜欢</span>.</div></div>`;
  document.body.appendChild(p);
  const inp = p.querySelector('#dictq');
  inp.addEventListener('input', () => { dictSel = 0; dictRes = dictSearch(inp.value); drawDict(); });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); e.stopPropagation(); if (dictRes[dictSel]) speak(dictRes[dictSel].h); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); dictSel = Math.max(0, Math.min(dictRes.length - 1, dictSel + (e.key === 'ArrowDown' ? 1 : -1))); drawDict(); }
  });
  p.addEventListener('mousedown', (e) => e.stopPropagation());
  setTimeout(() => { inp.focus(); document.addEventListener('mousedown', dictOutside); }, 0);
  document.addEventListener('keydown', dictEsc, true);
}
// while the dictionary is open, Esc closes it (and nothing else)
function dictEsc(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); dictClose(); } }
function dictOutside(e) { if (!e.target.closest('#dictpanel, #dictbtn')) dictClose(); }
function dictClose() {
  const p = document.getElementById('dictpanel'); if (!p) return;
  p.remove(); document.removeEventListener('mousedown', dictOutside); document.removeEventListener('keydown', dictEsc, true);
}
function drawDict() {
  const box = document.getElementById('dictres'); if (!box) return;
  const q = document.getElementById('dictq').value.trim();
  if (!q) { box.innerHTML = `<div class="dictempty">Try <b>happy</b>, <b>xihuan</b>, <b>xi3huan</b> or <span class="kai">喜欢</span>.</div>`; return; }
  if (!dictRes.length) { box.innerHTML = `<div class="dictempty">No match for “${esc(q)}” in HSK 1–4.</div>`; return; }
  box.innerHTML = dictRes.map((w, i) => `<div class="dres ${i === dictSel ? 'sel' : ''}" data-i="${i}">
      <div class="dhz kai">${esc(w.h)}</div>
      <div class="dinfo"><div><b class="dpy">${esc(w.p)}</b> <span class="dhsk">${w.hsk ? 'HSK ' + w.hsk : 'Extra'}</span></div>
        <div class="dxm">${esc(w.all || w.m)}</div><div class="dmet">${metIn(w)}</div></div>
      <div class="dact"><button class="icon-btn sm dplay" data-i="${i}" aria-label="Listen">${I.speaker}</button>
        ${S.words[w.id] ? `<span class="din">✓ In Review</span>` : `<button class="btn-outline dadd" data-i="${i}">+ Review</button>`}</div></div>`).join('');
  box.querySelectorAll('.dplay').forEach((b) => b.addEventListener('click', () => speak(dictRes[+b.dataset.i].h)));
  box.querySelectorAll('.dadd').forEach((b) => b.addEventListener('click', () => { const w = dictRes[+b.dataset.i]; learnWord(w.id, 1); save(); toast(`${w.h} added to Review`); drawDict(); }));
  box.querySelectorAll('.dres').forEach((r) => r.addEventListener('mouseenter', () => { dictSel = +r.dataset.i; box.querySelectorAll('.dres').forEach((x) => x.classList.toggle('sel', x === r)); }));
  const sel = box.querySelector('.dres.sel'); if (sel) sel.scrollIntoView({ block: 'nearest' });
}
