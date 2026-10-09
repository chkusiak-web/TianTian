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
import baotu from '../content/baotu.js';
import { loadDistrict } from './district.js';
import { runSession } from './ui/session.js';
import { openNotebook } from './ui/notebook-view.js';
import { OPENING, BEATS } from './beats.js';

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

const district = loadDistrict(baotu);
const beatOf = (i) => district.beats.find((b) => b.id === (BEATS[i] || {}).id);

let scene = null;
const hud = createHud({
  map: baotuMap,
  onSettings: () => { releaseAll(); openSettings({ store, toast, onReset: refresh }); },
  onDictionary: () => dict.open(),
  onNotebook: () => { releaseAll(); openNotebook({ store, district }); },
  onHint: () => { if (store.state.progress.stage === 'opening') playOpening(); }
});

function refresh() {
  const p = store.state.progress;
  if (p.stage === 'opening') hud.setHint('Finish the taxi ride (click to go on).');
  else hud.setHint((baotuMap.beatPlaces[p.beat] || {}).hint || (p.beat >= BEATS.length ? 'All beats done (gate quiz comes in checkpoint 5).' : ''));
  if (scene) scene.setBeat(p.stage === 'opening' ? -1 : p.beat);
}

// The opening (taxi ride and the notebook handover) runs once, before the park. The courtyard home comes in checkpoint 5.
async function playOpening() {
  const p = store.state.progress;
  releaseAll();
  const r = await runSession({ store, district, beat: district.beats.find((b) => b.id === 'opening'), steps: ['learn', 'use', 'notebook'], startAt: p.beatStep, portraitFor, toast });
  if (r === 'done') { p.stage = 'district'; p.beat = 0; p.beatStep = 'refresh'; store.save(); toast('Next morning, you walk to Baotu Spring.'); }
  refresh();
}

// Talking to whoever the current beat is about starts (or resumes) its session.
async function playBeat(i) {
  const p = store.state.progress, beat = beatOf(i);
  releaseAll(); hud.showReach(null);
  const r = await runSession({ store, district, beat, startAt: p.beatStep === 'done' ? 'refresh' : p.beatStep, portraitFor, toast });
  if (r === 'done') { p.beat = i + 1; p.beatStep = 'refresh'; store.save(); }
  refresh();
  hud.showReach(scene && scene.near);
}

// dev panel only with ?dev in the address (used for testing, never shown in normal play)
if (new URLSearchParams(location.search).has('dev')) initDevPanel({ store, toast, onChange: refresh });
window.__district = district;

let manifest = null;
function portraitFor(id) {
  const p = manifest && manifest.people[id];
  if (!p) return null;
  if (p.portrait) return { src: import.meta.env.BASE_URL + 'assets/' + p.portrait };
  return { src: drawPortrait(p.look || {}).toDataURL(), pixel: true };
}

async function interact(t) {
  const p = store.state.progress, beat = beatOf(p.beat);
  if (p.stage === 'district' && beat && beat.scene && t.kind === 'npc' && t.id === beat.who) return playBeat(p.beat);
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
  onReady: (s) => { scene = s; manifest = s.cache.json.get('manifest'); window.__scene = s; refresh(); if (store.state.progress.stage === 'opening') playOpening(); }
});
refresh();
