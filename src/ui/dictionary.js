// 词典 · the word collection panel (Ctrl/⌘+K). Search only for now; collection pages arrive with the phone.
import { search, pinyinOf } from '../lexicon.js';
import { speak } from '../audio/index.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initDictionary(store) {
  let sel = 0, res = [], panel = null;

  function stateOf(w) {
    const S = store.state, id = String(w.id);
    if (S.words[id]) return 'caught';
    return S.seen[id] ? 'seen' : 'unseen';
  }
  function draw() {
    const box = panel.querySelector('#dictres'), q = panel.querySelector('#dictq').value.trim();
    if (!q) { box.innerHTML = '<div class="dictempty">Try <b>happy</b>, <b>xihuan</b> or <span class="kai">喜欢</span>.</div>'; return; }
    if (!res.length) { box.innerHTML = `<div class="dictempty">No match for “${esc(q)}”.</div>`; return; }
    box.innerHTML = res.map((w, i) => `<div class="dres ${i === sel ? 'sel' : ''}" data-i="${i}">
      <div class="dhz">${esc(w.h)}</div>
      <div class="dinfo"><div><b class="dpy">${esc(w.p || pinyinOf(w.h))}</b> <span class="dhsk">${w.hsk ? 'HSK ' + w.hsk : w.kind === 'taught' ? '★ taught' : w.kind}</span> <span class="dstate ${stateOf(w)}">${stateOf(w)}</span></div>
      <div class="dxm">${esc(w.all || w.m)}</div></div>
      <button class="icon-btn dplay" data-i="${i}" aria-label="Listen">🔊</button></div>`).join('');
    box.querySelectorAll('.dplay').forEach((b) => b.addEventListener('click', () => speak(res[+b.dataset.i].h)));
  }
  function close() { if (!panel) return; panel.remove(); panel = null; document.removeEventListener('keydown', onKey, true); }
  function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } }
  function open() {
    if (panel) return;
    panel = document.createElement('div'); panel.className = 'dictpanel';
    panel.innerHTML = `<div class="dicthead"><span>词典</span><input id="dictq" placeholder="Search English, pinyin or 汉字" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div><div class="dictres" id="dictres"></div>`;
    document.getElementById('overlay').appendChild(panel);
    const inp = panel.querySelector('#dictq');
    inp.addEventListener('input', () => { sel = 0; res = search(inp.value); draw(); });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); if (res[sel]) speak(res[sel].h); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(res.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); draw(); }
    });
    document.addEventListener('keydown', onKey, true);
    draw(); setTimeout(() => inp.focus(), 0);
  }
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); panel ? close() : open(); }
  }, true);
  return { open, close };
}
