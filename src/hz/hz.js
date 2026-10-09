// Chinese everywhere: hover for pinyin, click for English. Ported from 天天's hz.js as a module.
// While a question is open (setHzLock(true)) the answer tiles (.answers) show no pinyin or English until you answer.
// The question itself stays hoverable (user choice B, see build-notes/DECISIONS.md).
import { splitWords, pinyinOf, englishOf, HAN } from '../lexicon.js';

const SKIP = 'input, textarea, select, option, script, style, svg, .hz, .hztip, [data-nohz], kbd, .dictpanel';
let locked = false;
let tip, tipEl = null;

export const setHzLock = (v) => { locked = !!v; hideTip(); };
export const isHzLocked = () => locked;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function hzHtml(text) {
  return splitWords(text).map((p) => (p.w ? `<span class="hz w">${esc(p.t)}</span>` : esc(p.t))).join('');
}

function hzText(t) {
  if (!t.parentNode || !HAN.test(t.nodeValue) || (t.parentElement && t.parentElement.closest(SKIP))) return;
  const wrap = document.createElement('span');
  wrap.className = 'hzr';
  wrap.innerHTML = hzHtml(t.nodeValue);
  t.parentNode.replaceChild(wrap, t);
}
export function hzify(node) {
  if (!node) return;
  if (node.nodeType === 3) return hzText(node);
  if (node.nodeType !== 1 || node.closest(SKIP)) return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: (t) => (HAN.test(t.nodeValue) && t.parentElement && !t.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  });
  const list = []; while (walker.nextNode()) list.push(walker.currentNode);
  list.forEach(hzText);
}

function showTip(el, text) {
  tip.textContent = text; tip.hidden = false;
  const r = el.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px';
  tip.style.top = (r.top - tip.offsetHeight - 8 < 4 ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + 'px';
}
export function hideTip() { if (tip) { tip.hidden = true; tip.classList.remove('lock'); } tipEl = null; }

const blocked = (el) => locked && el.closest('.answers');

export function initHz(root = document.body) {
  tip = document.createElement('div'); tip.className = 'hztip'; tip.hidden = true; document.body.appendChild(tip);

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest && e.target.closest('.hz');
    if (!el) {
      // crossing punctuation or the gap between two words keeps the last tip, so a line reads smoothly
      if (tipEl && e.target.closest && e.target.closest('.hzr') === tipEl.closest('.hzr')) return;
      if (tipEl) hideTip(); return;
    }
    if (el === tipEl) return;
    tipEl = el;
    if (blocked(el)) { hideTip(); return; }   // locked: hover does nothing (no message either)
    tip.classList.remove('lock');
    showTip(el, el.dataset.py || pinyinOf(el.textContent));
  });
  document.addEventListener('click', (e) => {
    const el = e.target.closest && e.target.closest('.hz');
    if (!el || blocked(el)) return;
    const en = el.dataset.en || englishOf(el.textContent);
    if (en) { tipEl = el; showTip(el, `${el.dataset.py || pinyinOf(el.textContent)} · ${en}`); }
  });

  let queue = [], raf = 0;
  new MutationObserver((muts) => {
    muts.forEach((m) => { if (m.type === 'characterData') queue.push(m.target); else m.addedNodes.forEach((n) => queue.push(n)); });
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; const q = queue; queue = []; q.forEach((n) => { if (document.contains(n)) hzify(n); }); });
  }).observe(root, { childList: true, subtree: true, characterData: true });
  hzify(root);
}
