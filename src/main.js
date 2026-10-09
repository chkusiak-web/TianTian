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
import content from '../content/baotu.js';
import castData from '../content/cast.js';
import { playSession, storyCard } from './session/runner.js';
import { renderPage, wirePage } from './session/notebook.js';
import { openModal, closeModal } from './ui/modal.js';

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
initInput(() => isModalOpen() || dictOpen() || busy || !!document.querySelector('.sheet, .storycard'));

let scene = null;
const hud = createHud({
  map: baotuMap,
  onSettings: () => { releaseAll(); openSettings({ store, toast, onReset: () => { refresh(); maybeStartOpening(); } }); },
  onDictionary: () => dict.open(),
  onNotebook: () => openNotebook(),
  onToday: () => today()
});

let busy = false;     // a session is running
const P = () => store.state.progress;

function refresh() {
  const p = P();
  if (p.stage === 'opening') { hud.setHint('arrive in Jinan.', busy ? null : p.openingStep && p.openingStep !== 'refresh' ? 'Continue' : 'Begin'); if (scene) scene.setBeat(-1); return; }
  const place = baotuMap.beatPlaces[p.beat];
  const def = content.beats[p.beat];
  let hint = place ? place.hint : 'Baotu\'s beats are done. The gate quiz comes in checkpoint 5.';
  if (place && def && def.use) hint += p.beatStep === 'use' ? ' (continue the conversation)' : p.beatStep === 'notebook' ? ' (read the notebook)' : ' Press Space next to them.';
  hud.setHint(hint, null);
  if (scene) scene.setBeat(p.beat);
}

// the next thing to do (bottom-bar button, Enter on the map)
function today() {
  if (busy) return;
  if (P().stage === 'opening') return startOpening();
}

async function startOpening() {
  if (busy) return;
  busy = true; releaseAll(); hud.showReach(null); refresh();
  try {
    if (!P().openingStep || P().openingStep === 'refresh') await storyCard('You have come to Jinan to settle the estate of your great-uncle, Old Zhou. He lived on Qushuiting Street for fifty years. You don\'t speak Chinese yet.', 'Begin');
    const r = await playSession({ content, index: 0, store, cast: castData.people, portraitFor, onStep: refresh });
    if (r === 'done') {
      const p = P(); p.stage = 'district'; p.openingStep = 'done'; p.beat = 0; p.beatStep = 'refresh'; store.save();
      await storyCard('Next morning, you walk to Baotu Spring.', 'Go');
    }
  } finally { busy = false; refresh(); }
}
function maybeStartOpening() { if (P().stage === 'opening' && scene) startOpening(); }

async function startBeat() {
  const p = P(), def = content.beats[p.beat];
  if (!def.use) { toast('This scene comes in checkpoint 4.'); return; }
  busy = true; releaseAll(); hud.showReach(null);
  try {
    const r = await playSession({ content, index: p.beat + 1, store, cast: castData.people, portraitFor, onStep: refresh });
    if (r === 'done') { p.beat++; p.beatStep = 'refresh'; store.save(); toast('Beat complete'); }
  } finally { busy = false; refresh(); }
}

function openNotebook() {
  if (busy || isModalOpen()) return;
  releaseAll();
  const el = document.createElement('div');
  el.className = 'sheet notebook-modal';
  el.innerHTML = `<div class="sheethead"><div class="sheettitle">本子 · Old Zhou's notebook</div><button class="icon-btn sclose" title="Close (Esc)">✕</button></div><div class="sheetbody">${renderPage(store.state, content.notebook)}</div>`;
  el.querySelector('.sclose').onclick = () => closeModal();
  openModal(el);
  wirePage(el, content.notebook);
}
document.addEventListener('keydown', (e) => {
  if (/^(input|textarea|select)$/i.test(e.target.tagName) || isModalOpen() || busy || document.querySelector('.sheet, .storycard, .dictpanel')) return;
  if (e.key === 'n' && !e.metaKey && !e.ctrlKey) openNotebook();
  if (e.key === 'Enter' && P().stage === 'opening') { e.preventDefault(); today(); }
});

// dev panel only with ?dev in the address (used for testing, never shown in normal play)
if (new URLSearchParams(location.search).has('dev')) initDevPanel({ store, toast, onChange: refresh });
window.__content = content;

let manifest = null;
function portraitFor(id) {
  const p = manifest && manifest.people[id];
  if (!p) return null;
  if (p.portrait) return { src: import.meta.env.BASE_URL + 'assets/' + p.portrait };
  return { src: drawPortrait(p.look || {}).toDataURL(), pixel: true };
}

async function interact(t) {
  if (busy) return;
  const p = P(), place = baotuMap.beatPlaces[p.beat];
  if (p.stage === 'district' && t.kind === 'npc' && place && place.npc === t.id) return startBeat();
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
  onReady: (s) => { scene = s; manifest = s.cache.json.get('manifest'); window.__scene = s; refresh(); maybeStartOpening(); }
});
refresh();
