// Old Zhou's notebook (CONCEPT §4.4). A word is a smudge until it's caught, then written clearly; mastered words
// are in darker ink. A line comes into focus when all its words are caught.
import { splitWords, lookup } from '../lexicon.js';
import { stateOf } from '../core/words.js';
import { esc } from '../core/esc.js';
import { speak } from '../audio/index.js';

const FREE = new Set(['name', 'particle', 'fixed']);

// state of one token: 'free' (names, particles), 'mastered', 'caught' or 'smudge'
export function tokenState(S, t) {
  const e = lookup(t);
  if (e && FREE.has(e.kind)) return 'free';
  const st = (h) => { const x = lookup(h); return x ? (FREE.has(x.kind) ? 'free' : stateOf(S, String(x.id))) : 'unseen'; };
  let s = st(t);
  if ((s === 'unseen' || s === 'seen') && [...t].length > 1) {
    const parts = [...t].map(st);   // 这个 = 这 + 个
    if (parts.every((p) => p !== 'unseen' && p !== 'seen')) s = parts.includes('lapsed') ? 'lapsed' : parts.every((p) => p === 'mastered' || p === 'free') ? 'mastered' : 'caught';
  }
  if (s === 'free') return 'free';
  if (s === 'mastered') return 'mastered';
  if (s === 'caught' || s === 'lapsed') return 'caught';
  return 'smudge';
}
export const lineClear = (S, zh) => splitWords(zh).filter((p) => p.w).every((p) => tokenState(S, p.t) !== 'smudge');
export const clearLines = (S, lines) => lines.map((l, i) => (lineClear(S, l.zh) ? i : -1)).filter((i) => i >= 0);

export function renderPage(S, notebook, { fresh = [] } = {}) {
  const lines = notebook.lines.map((l, i) => {
    const clear = lineClear(S, l.zh);
    const html = splitWords(l.zh).map((p) => {
      if (!p.w) return clear ? esc(p.t) : `<span class="punct">${esc(p.t)}</span>`;
      const st = tokenState(S, p.t);
      if (st === 'smudge') return `<span class="smudge" style="width:${[...p.t].length * 1.05}em" aria-label="smudged word"></span>`;
      return `<span class="ink ${st}">${esc(p.t)}</span>`;
    }).join('');
    return `<div class="nline ${clear ? 'clear' : ''} ${fresh.includes(i) ? 'fresh' : ''}" data-i="${i}" ${clear ? `title="${esc(l.en)}"` : ''}>${html}${clear ? ' <button class="icon-btn nsay" aria-label="Listen">🔊</button>' : ''}</div>`;
  }).join('');
  const n = notebook.lines.filter((l) => lineClear(S, l.zh)).length;
  return `<div class="page"><div class="pagehead"><span>Old Zhou's notebook · page ${notebook.page}</span><span class="note">${n} / ${notebook.lines.length} lines readable</span></div>${lines}</div>`;
}

export function wirePage(root, notebook) {
  root.querySelectorAll('.nsay').forEach((b) => (b.onclick = () => speak(notebook.lines[+b.closest('.nline').dataset.i].zh)));
}
