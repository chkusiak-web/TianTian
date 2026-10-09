// Settings: silent mode, speech speed, and the save file (export / import / reset). More settings arrive in checkpoint 5.
import { openModal, closeModal } from './modal.js';
import { downloadSave, parseImport, readFileText } from '../save/transfer.js';
import { todayKey } from '../core/clock.js';

export function openSettings({ store, toast, onReset }) {
  const S = store.state;
  const el = document.createElement('div');
  el.className = 'settings panel';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Settings');
  el.innerHTML = `<h2>Settings</h2>
    <label class="toggle"><input type="checkbox" id="stSilent" ${S.settings.silent.on && S.settings.silent.date === todayKey() ? 'checked' : ''}> Silent mode <span class="note">(no voices today; listening questions become reading)</span></label>
    <label class="toggle">Speech speed <select id="stRate"><option value="normal">Normal</option><option value="slow" ${S.settings.rate === 'slow' ? 'selected' : ''}>Slow</option></select></label>
    <h3>Your save</h3>
    <p class="note">Progress saves by itself in this browser. Export it to keep a copy or move it to another browser.</p>
    <div class="row"><button class="btn" id="stExp">Export</button><label class="btn">Import<input type="file" id="stImp" accept="application/json" hidden></label><button class="btn danger" id="stReset">Reset…</button></div>
    <div class="row" style="margin-top:1em"><button class="btn primary" id="stClose">Done <kbd>Esc</kbd></button></div>`;
  openModal(el);
  el.querySelector('#stSilent').onchange = (e) => { S.settings.silent = { on: e.target.checked, date: todayKey() }; store.save(); };
  el.querySelector('#stRate').onchange = (e) => { S.settings.rate = e.target.value; store.save(); };
  el.querySelector('#stExp').onclick = () => downloadSave(store.state);
  el.querySelector('#stImp').onchange = async (e) => {
    try { store.replace(parseImport(await readFileText(e.target.files[0]))); toast('Save imported'); closeModal(); onReset(); } catch (err) { toast(err.message); }
  };
  el.querySelector('#stReset').onclick = () => {
    if (!confirm('Start over? This deletes all progress in this browser.')) return;
    store.reset(); store.save(); toast('Save reset'); closeModal(); onReset();
  };
  el.querySelector('#stClose').onclick = () => closeModal();
}
