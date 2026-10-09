// Dialogue box in the bottom third, portrait on the left (VISUAL-LANGUAGE §UI). Space/Enter goes on, Esc closes.
// Every line is spoken (unless silent) and hoverable: pinyin on hover, English on click.
import { openModal, closeModal } from './modal.js';
import { speak } from '../audio/index.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function openDialogue({ who, name, en, portrait, lines }) {
  return new Promise((resolve) => {
    let i = 0;
    const el = document.createElement('div');
    el.className = 'dialogue panel';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', `${en} speaking`);
    const draw = () => {
      const line = lines[i];
      el.innerHTML = `<div class="portrait">${portrait ? `<img src="${esc(portrait.src)}" alt="" class="${portrait.pixel ? 'pixel' : ''}">` : ''}</div>
        <div class="dbody">
          <div class="dname">${name ? `<span class="zh">${esc(name)}</span> ` : ''}<span class="den">${esc(en)}</span></div>
          <div class="dline zh">${esc(line.zh)}</div>
          <div class="dfoot"><button class="icon-btn dsay" aria-label="Listen again">🔊</button>
            <span class="note">${i + 1} / ${lines.length}</span>
            <button class="btn primary dnext">${i + 1 < lines.length ? 'Next' : 'Close'} <kbd>Space</kbd></button></div>
        </div>`;
      el.querySelector('.dsay').onclick = () => speak(line.zh, { who });
      el.querySelector('.dnext').onclick = next;
      speak(line.zh, { who });
    };
    const next = () => { if (i + 1 < lines.length) { i++; draw(); } else closeModal(); };
    openModal(el, {
      onKey: (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); next(); } },
      onClose: resolve
    });
    draw();
  });
}

export function openSignCard({ zh, en }) {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'signcard panel';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Sign');
    el.innerHTML = `<div class="note">Sign</div><div class="signtext">${esc(zh)}</div>
      <div class="row"><button class="icon-btn" aria-label="Listen">🔊</button><button class="btn primary sclose">Close <kbd>Space</kbd></button></div>`;
    el.querySelector('.icon-btn').onclick = () => speak(zh.replace(/[→←↑↓]/g, ''));
    el.querySelector('.sclose').onclick = () => closeModal();
    openModal(el, { onKey: (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); closeModal(); } }, onClose: resolve });
  });
}
