// Keyboard state for walking. Our own listener (not Phaser's) so typing in overlays never moves the player
// and arrow keys / Space never get swallowed when an input has focus.
const held = new Set();
let pressed = [];
let blocked = () => false;

const KEYMAP = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'act', Enter: 'act', KeyE: 'act' };
const typing = (t) => t && (/^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable);

export function initInput(isBlocked) {
  blocked = isBlocked;
  window.addEventListener('keydown', (e) => {
    const k = KEYMAP[e.code]; if (!k || typing(e.target) || e.metaKey || e.ctrlKey) return;
    if (blocked()) { held.clear(); return; }
    e.preventDefault();
    if (k === 'act') { if (!e.repeat) pressed.push('act'); return; }
    held.add(k);
  });
  window.addEventListener('keyup', (e) => { const k = KEYMAP[e.code]; if (k) held.delete(k); });
  window.addEventListener('blur', () => held.clear());
}
export const isHeld = (k) => !blocked() && held.has(k);
export const takePressed = () => { const p = pressed; pressed = []; return blocked() ? [] : p; };
export const releaseAll = () => { held.clear(); pressed = []; };
