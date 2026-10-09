// One session (CONCEPT §2.1): Refresh → Learn → Use → Notebook. The current step is saved, so closing the panel
// (Esc / ✕) pauses and the next visit picks up there.
import { openPanel, Paused } from '../ui/panel.js';
import { runLearn, runRefresh } from './learn.js';
import { runConversation } from './use.js';
import { renderPage, wirePage, clearLines } from './notebook.js';
import { dueIds } from '../core/srs.js';
import { wordObj, byId } from '../lexicon.js';
import { todayKey } from '../core/clock.js';
import { esc } from './quiz-ui.js';

const ORDER = ['refresh', 'learn', 'use', 'notebook'];
const MAX_REFRESH = 15;

// words of the opening and every beat up to and including `upto` (an index into [opening, ...beats])
export function knownWordObjs(content, upto) {
  return [content.opening, ...content.beats].slice(0, upto + 1).flatMap((s) => s.words).map(wordObj).filter(Boolean);
}

export async function playSession({ content, index, store, cast, portraitFor, onStep, onAt }) {
  const S = store.state;
  const def = index === 0 ? content.opening : content.beats[index - 1];
  const getStep = () => (index === 0 ? S.progress.openingStep : S.progress.beatStep) || 'refresh';
  const setStep = (k) => { if (index === 0) S.progress.openingStep = k; else S.progress.beatStep = k; store.save(); onStep && onStep(k); };
  const words = def.words.map(wordObj).filter(Boolean);
  const pool = knownWordObjs(content, index);
  const silent = () => { const m = S.settings.silent; return !!(m && m.on && m.date === todayKey()); };
  const before = clearLines(S, content.notebook.lines);

  const panel = openPanel({ title: def.title, step: getStep() });
  try {
    if (getStep() === 'refresh') {
      panel.setStep('refresh');
      const due = dueIds(S).slice(0, MAX_REFRESH).map((id) => byId(id)).filter(Boolean).map((e) => wordObj(e.h));
      if (due.length) await runRefresh(panel, { due, pool, store });
      setStep('learn');
    }
    if (getStep() === 'learn') {
      panel.setStep('learn');
      await runLearn(panel, { words, pool, store, silent: silent(), leniency: S.settings.leniency === 'normal' ? 1.0 : 1.8, frame: def.en || def.title });
      setStep('use');
    }
    if (getStep() === 'use') {
      panel.setStep('use'); panel.hide();
      const r = await runConversation({ use: def.use, store, cast, portraitFor, sessionId: def.id, onAt });
      panel.show();
      S.stats.conversations++;
      if (!r.misses && !r.hints) S.stats.cleanConversations++;
      setStep('notebook');
    }
    if (getStep() === 'notebook') {
      panel.setStep('notebook'); panel.el.classList.add('book');
      const after = clearLines(S, content.notebook.lines);
      const fresh = after.filter((i) => !before.includes(i));
      panel.body.innerHTML = `<p class="note">${fresh.length ? `${fresh.length} line${fresh.length > 1 ? 's' : ''} came into focus. Read ${fresh.length > 1 ? 'them' : 'it'}: hover for pinyin, click for English.` : 'More of the notebook is readable now. Words you\'ve caught are written clearly.'}</p>
        ${renderPage(S, content.notebook, { fresh })}<div class="row center"><button class="btn primary nbclose">Close the notebook <kbd>Enter</kbd></button></div>`;
      wirePage(panel.body, content.notebook);
      await panel.guard(new Promise((res) => {
        const k = (e) => { if (e.key === 'Enter') { e.preventDefault(); done(); } };
        const done = () => { document.removeEventListener('keydown', k); res(); };
        panel.body.querySelector('.nbclose').onclick = done; document.addEventListener('keydown', k);
      }));
    }
    panel.close();
    return 'done';
  } catch (e) {
    panel.close();
    if (e instanceof Paused) return 'paused';
    throw e;
  }
}

// A one-screen story card (e.g. "Next morning, you walk to Baotu Spring.")
export function storyCard(text, button = 'Continue') {
  return new Promise((res) => {
    const el = document.createElement('div');
    el.className = 'storycard';
    el.innerHTML = `<div class="panel"><p>${esc(text)}</p><button class="btn primary">${esc(button)} <kbd>Enter</kbd></button></div>`;
    document.getElementById('overlay').appendChild(el);
    const done = () => { document.removeEventListener('keydown', k, true); el.remove(); res(); };
    const k = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); done(); } };
    document.addEventListener('keydown', k, true);
    el.querySelector('button').onclick = done;
  });
}
