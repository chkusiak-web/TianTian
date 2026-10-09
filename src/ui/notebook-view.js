// The notebook from the corner button: page 1 as it stands, any time. (The home screen version comes in checkpoint 5.)
import { openModal, closeModal } from './modal.js';
import { notebookHtml, notebookSummary } from './notebook.js';

export function openNotebook({ store, district }) {
  const sum = notebookSummary(store.state, district);
  const el = document.createElement('div');
  el.className = 'nbmodal';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', "Old Zhou's notebook");
  el.innerHTML = `<div class="card panel nbcard"><div class="label">Old Zhou's notebook · page 1</div>${notebookHtml(store.state, district)}
    <div class="foot"><span class="note">${sum.clear} of ${sum.total} lines in focus · ${sum.written} of ${sum.words} words written.</span><button class="btn primary" id="nbclose">Close <kbd>Esc</kbd></button></div></div>`;
  openModal(el, { onKey: (e) => { if (e.key === 'Enter') { e.preventDefault(); closeModal(); } } });
  el.querySelector('#nbclose').onclick = () => closeModal();
}
