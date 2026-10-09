// Checkpoint-1 home card: shows hover/click, the question lock, speech and save/load. Replaced by the courtyard in checkpoint 5.
import shell from '../../content/shell.js';
import { speak } from '../audio/index.js';
import { setHzLock } from '../hz/hz.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function mountShellDemo({ store, toast }) {
  const S = store.state;
  const el = document.createElement('div');
  el.className = 'home panel';
  const q = shell.question;
  el.innerHTML = `<h1>Working Title</h1>
    <p class="note">Hover a word for pinyin, click it for English.</p>
    ${shell.samples.map((s) => `<div class="sample" data-en="${esc(s.en)}">${esc(s.zh)} <button class="icon-btn" data-say="${esc(s.zh)}" aria-label="Listen">🔊</button></div>`).join('')}
    <h3>Question lock</h3>
    <div class="question locked" id="q">
      <div class="sample">${esc(q.prompt)}</div>
      <div class="choices">${q.options.map((o) => `<button class="btn" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="verdict" id="verdict"></div>
      <p class="note" id="qnote">Hover is locked while the question is open. Try it, then answer.</p>
    </div>
    <h3>Settings</h3>
    <label class="toggle"><input type="checkbox" id="silent" ${S.settings.silent.on ? 'checked' : ''}> Silent mode</label>
    <label class="toggle"><input type="checkbox" id="slow" ${S.settings.rate === 'slow' ? 'checked' : ''}> Slow speech</label>
    <p class="note">Progress saves by itself. <kbd>⌘</kbd>+<kbd>K</kbd> opens the dictionary.</p>`;
  document.getElementById('overlay').appendChild(el);

  el.querySelectorAll('[data-say]').forEach((b) => (b.onclick = () => speak(b.dataset.say, { who: 'wang' })));
  el.querySelectorAll('.sample[data-en]').forEach((d) => d.addEventListener('contextmenu', (e) => { e.preventDefault(); toast(d.dataset.en); }));

  // question lock
  setHzLock(true);
  el.querySelectorAll('[data-opt]').forEach((b) => (b.onclick = () => {
    const ok = b.dataset.opt === q.answer, v = el.querySelector('#verdict');
    v.className = 'verdict ' + (ok ? 'ok' : 'no'); v.textContent = ok ? '✓ Right' : `✗ The answer is ${q.answer}`;
    setHzLock(false); el.querySelector('#q').classList.remove('locked'); el.querySelector('#qnote').textContent = 'Answered: hover and click work again.';
  }));
  if (store.state.dev.autoAnswer) el.querySelector(`[data-opt="${q.answer}"]`).style.outline = '3px solid #E8B93A';

  el.querySelector('#silent').onchange = (e) => { store.state.settings.silent = { on: e.target.checked, date: new Date().toISOString().slice(0, 10) }; store.save(); };
  el.querySelector('#slow').onchange = (e) => { store.state.settings.rate = e.target.checked ? 'slow' : 'normal'; store.save(); };
  return el;
}
