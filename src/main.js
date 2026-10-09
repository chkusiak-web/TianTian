import { createAdapter } from './save/adapter.js';
import { createStore } from './save/store.js';
import { configureAudio } from './audio/index.js';
import { initHz } from './hz/hz.js';
import { initDictionary } from './ui/dictionary.js';
import { initDevPanel } from './ui/dev-panel.js';
import { mountShellDemo } from './ui/shell-demo.js';
import { createGame } from './world/game.js';
import { todayKey } from './core/clock.js';

const store = createStore(createAdapter());
store.load();
window.__store = store;          // handy in the console and for the Playwright run

const box = document.getElementById('box');
const fit = () => document.documentElement.style.setProperty('--bw', box.clientWidth + 'px');
new ResizeObserver(fit).observe(box); fit();

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.getElementById('overlay').appendChild(t); setTimeout(() => t.remove(), 2200);
}

// silent mode turns itself off at the start of each day, as in 天天
configureAudio({
  isSilent: () => { const m = store.state.settings.silent; return !!(m && m.on && m.date === todayKey()); },
  isSlow: () => store.state.settings.rate === 'slow'
});

let demo;
function rerenderAll() { if (demo) demo.remove(); demo = mountShellDemo({ store, toast, rerenderAll }); }

initHz(document.getElementById('overlay'));
initDictionary(store);
initDevPanel({ store, toast, onChange: rerenderAll });
rerenderAll();

window.__game = createGame('phaser', {
  onReady: (scene) => {
    // in-world sign text lives in HTML on top of the map: crisp, and hoverable like all other Chinese
    const labels = document.getElementById('labels');
    const add = (zh, gx, gy) => { const d = document.createElement('div'); d.className = 'wlabel'; d.textContent = zh; d.style.left = (gx / 480 * 100) + '%'; d.style.top = (gy / 270 * 100) + '%'; labels.appendChild(d); };
    add('趵突泉', 8 * 16 + 8, 4 * 16 - 8);
    labels.style.pointerEvents = 'none';
    labels.querySelectorAll('.wlabel').forEach((l) => (l.style.pointerEvents = 'auto'));
    window.__scene = scene;
  }
});
