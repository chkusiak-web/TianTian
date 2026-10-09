// Old Zhou's notebook (CONCEPT §4.4). Words you haven't caught are smudges of ink; caught words are written clearly,
// mastered ones in darker ink. A line comes into focus (and can be hovered) once all its words are caught.
// Names and punctuation are always legible; the page header 「七十三」 is the one thing written plainly from day one.
import { stateOf } from '../core/words.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function lineState(S, district, line) {
  const ws = district.wordsIn(line.zh);
  const missing = ws.filter((e) => !S.words[e.id]);
  return { words: ws, missing, clear: missing.length === 0 };
}

// before: a Set of word ids caught before this session (to mark what just became legible)
export function notebookHtml(S, district, before = null) {
  const nb = district.notebook;
  const lines = nb.lines.map((line, i) => {
    const st = lineState(S, district, line);
    const wasClear = before && st.words.every((e) => before.has(e.id));
    const parts = district.split(line.zh).map((x) => {
      if (!x.e) return st.clear ? esc(x.t) : `<span data-nohz>${esc(x.t)}</span>`;
      const s = stateOf(S, x.e.id);
      if (s === 'unseen' || s === 'seen') return `<span class="smudge" data-nohz aria-label="smudged word">${'墨'.repeat([...x.t].length)}</span>`;
      const fresh = before && !before.has(x.e.id) ? ' fresh' : '';
      return st.clear ? `<span class="ink ${s}${fresh}">${esc(x.t)}</span>` : `<span class="ink ${s}${fresh}" data-nohz>${esc(x.t)}</span>`;
    }).join('');
    return `<p class="nbline${st.clear ? ' clear' : ''}${st.clear && before && !wasClear ? ' justclear' : ''}" data-line="${i}">${parts}</p>`;
  }).join('');
  return `<div class="nbpage"><div class="nbhead zh">${esc(nb.header)}</div>${lines}</div>`;
}

export function notebookSummary(S, district, before) {
  const lines = district.notebook.lines.map((l) => lineState(S, district, l));
  const clear = lines.filter((l) => l.clear).length;
  const justClear = before ? district.notebook.lines.filter((l, i) => lines[i].clear && !district.wordsIn(l.zh).every((e) => before.has(e.id))).length : 0;
  const all = new Set(lines.flatMap((l) => l.words.map((e) => e.id)));
  const written = [...all].filter((id) => S.words[id]).length;
  const fresh = before ? [...all].filter((id) => S.words[id] && !before.has(id)).length : 0;
  return { clear, total: lines.length, justClear, written, words: all.size, fresh };
}
