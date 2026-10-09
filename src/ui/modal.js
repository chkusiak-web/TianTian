// One overlay at a time owns the keyboard (dialogue, sign card, settings). While one is open the player can't walk.
let current = null;
export const isModalOpen = () => !!current;
export function openModal(el, { onKey, onClose } = {}) {
  closeModal();
  const key = (e) => {
    if (/^(input|textarea|select)$/i.test(e.target.tagName)) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (onKey) onKey(e);
  };
  document.addEventListener('keydown', key, true);
  document.getElementById('overlay').appendChild(el);
  current = { el, key, onClose };
}
export function closeModal() {
  if (!current) return;
  const c = current; current = null;
  document.removeEventListener('keydown', c.key, true);
  c.el.remove();
  c.onClose && c.onClose();
}
