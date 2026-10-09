// The session panel: a notebook-paper sheet over the map for Refresh, Learn and the notebook page.
// Header shows the four steps of a session (CONCEPT §2.1). ✕ or Esc pauses: progress is kept, the step resumes later.
import { esc } from '../session/quiz-ui.js';

export const STEPS = [['refresh', 'Refresh'], ['learn', 'Learn'], ['use', 'Use'], ['notebook', 'Notebook']];
export class Paused extends Error {}

export function openPanel({ title, step }) {
  const el = document.createElement('div');
  el.className = 'sheet';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
  let closed = false, rejectors = [];
  const stop = () => { if (closed) return; closed = true; el.remove(); document.removeEventListener('keydown', onEsc, true); rejectors.forEach((r) => r(new Paused())); };
  const onEsc = (e) => { if (e.key === 'Escape' && !document.querySelector('.dictpanel')) { e.preventDefault(); e.stopPropagation(); stop(); } };
  document.addEventListener('keydown', onEsc, true);
  el.innerHTML = `<div class="sheethead"><div class="sheettitle">${esc(title)}</div><ol class="steps">${STEPS.map(([k, l]) => `<li data-k="${k}">${l}</li>`).join('')}</ol>
    <button class="icon-btn sclose" title="Pause (Esc). Your progress is kept.">✕</button></div><div class="sheetbody"></div>`;
  el.querySelector('.sclose').onclick = stop;
  document.getElementById('overlay').appendChild(el);
  const api = {
    el, body: el.querySelector('.sheetbody'),
    get closed() { return closed; },
    setStep(k) { el.querySelectorAll('.steps li').forEach((li) => { const i = STEPS.findIndex(([x]) => x === li.dataset.k), j = STEPS.findIndex(([x]) => x === k); li.className = i < j ? 'done' : i === j ? 'now' : ''; }); },
    hide() { el.hidden = true; }, show() { el.hidden = false; },
    // await something, but give up (throw Paused) if the panel is closed meanwhile
    guard(p) { return new Promise((res, rej) => { if (closed) return rej(new Paused()); rejectors.push(rej); p.then(res, rej); }); },
    close: stop
  };
  api.setStep(step);
  return api;
}
