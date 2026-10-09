import { createAdapter } from './save/adapter.js';
import { createStore } from './save/store.js';
import { configureAudio } from './audio/index.js';
import { initHz } from './hz/hz.js';
import { initDictionary } from './ui/dictionary.js';
import { initDevPanel } from './ui/dev-panel.js';
import { createGame } from './world/game.js';
import { initInput, releaseAll } from './world/input.js';
import { isModalOpen } from './ui/modal.js';
import { openDialogue, openSignCard } from './ui/dialogue.js';
import { openSettings } from './ui/settings.js';
import { createHud } from './ui/hud.js';
import { drawPortrait } from './world/draw.js';
import { todayKey } from './core/clock.js';
import baotuMap from '../content/baotu-map.js';

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

initHz(document.getElementById('box'));
const dict = initDictionary(store);
const dictOpen = () => !!document.querySelector('.dictpanel');
initInput(() => isModalOpen() || dictOpen());

let scene = null;
const hud = createHud({
  map: baotuMap,
  onSettings: () => { releaseAll(); openSettings({ store, toast, onReset: refresh }); },
  onDictionary: () => dict.open()
});

function refresh() {
  const beat = store.state.progress.beat;
  hud.setHint((baotuMap.beatPlaces[beat] || {}).hint || '');
  if (scene) scene.setBeat(beat);
}

// dev panel only with ?dev in the address (used for testing, never shown in normal play)
if (new URLSearchParams(location.search).has('dev')) initDevPanel({ store, toast, onChange: refresh });

let manifest = null;
function portraitFor(id) {
  const p = manifest && manifest.people[id];
  if (!p) return null;
  if (p.portrait) return { src: import.meta.env.BASE_URL + 'assets/' + p.portrait };
  return { src: drawPortrait(p.look || {}).toDataURL(), pixel: true };
}

async function interact(t) {
  releaseAll(); hud.showReach(null);
  if (t.kind === 'sign') await openSignCard(t.sign);
  else await openDialogue({ who: t.id, name: t.name, en: t.en, portrait: portraitFor(t.id), lines: t.lines });
  hud.showReach(scene && scene.near);
}

window.__game = createGame('phaser', {
  map: baotuMap,
  getBeat: () => store.state.progress.beat,
  onNear: (t) => hud.showReach(isModalOpen() ? null : t),
  onInteract: (t) => { if (!isModalOpen()) interact(t); },
  onReady: (s) => { scene = s; manifest = s.cache.json.get('manifest'); window.__scene = s; refresh(); }
});
refresh();
