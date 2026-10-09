// Checkpoint-1 home card: shows hover/click, the question lock, speech and save/load. Replaced by the courtyard in checkpoint 5.
import shell from '../../content/shell.js';
import { speak } from '../audio/index.js';
import { setHzLock } from '../hz/hz.js';
import { downloadSave, parseImport, readFileText } from '../save/transfer.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function mountShellDemo({ store, toast, rerenderAll }) {
  const S = store.state;
  const el = document.createElement('div');
  el.className = 'home panel';
  const q = shell.question;
  el.innerHTML = `<h1>Working Title</h1>
    <p class="note">Checkpoint 1 · shell. Hover a word for pinyin, click it for English.</p>
    ${shell.samples.map((s) => `<div class="sample" data-en="${esc(s.en)}">${esc(s.zh)} <button class="icon-btn" data-say="${esc(s.zh)}" aria-label="Listen">🔊</button></div>`).join('')}
    <h3>Question lock</h3>
    <div class="question locked" id="q">
      <div class="sample">${esc(q.prompt)}</div>
      <div class="choices">${q.options.map((o) => `<button class="btn" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div class="verdict" id="verdict"></div>
      <p class="note" id="qnote">Hover is locked while the question is open. Try it, then answer.</p>
    </div>
    <h3>Save</h3>
    <p>Opened <b id="opens">${S.stats.conversations}</b> time(s) on this save. <button class="btn" id="bump">+1 and save</button></p>
    <div class="row"><button class="btn" id="exp">Export</button><label class="btn">Import<input type="file" id="imp" accept="application/json" hidden></label><button class="btn danger" id="rst">Reset</button></div>
    <h3>Settings</h3>
    <label class="toggle"><input type="checkbox" id="silent" ${S.settings.silent.on ? 'checked' : ''}> Silent mode</label>
    <label class="toggle"><input type="checkbox" id="slow" ${S.settings.rate === 'slow' ? 'checked' : ''}> Slow speech</label>
    <p class="note">Press <kbd>\`</kbd> for the dev panel, <kbd>Ctrl/⌘</kbd>+<kbd>K</kbd> for the dictionary.</p>`;
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

  el.querySelector('#bump').onclick = () => { store.state.stats.conversations++; store.save(); el.querySelector('#opens').textContent = store.state.stats.conversations; };
  el.querySelector('#exp').onclick = () => downloadSave(store.state);
  el.querySelector('#imp').onchange = async (e) => {
    try { store.replace(parseImport(await readFileText(e.target.files[0]))); toast('Save imported'); rerenderAll(); } catch (err) { toast(err.message); }
  };
  el.querySelector('#rst').onclick = () => { if (confirm('Reset the whole save?')) { store.reset(); store.save(); toast('Save reset'); rerenderAll(); } };
  el.querySelector('#silent').onchange = (e) => { store.state.settings.silent = { on: e.target.checked, date: new Date().toISOString().slice(0, 10) }; store.save(); };
  el.querySelector('#slow').onchange = (e) => { store.state.settings.rate = e.target.checked ? 'slow' : 'normal'; store.save(); };
  return el;
}
