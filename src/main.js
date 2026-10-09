// Noto Sans SC is subset to the game's characters (src/fonts, tools/subset-fonts.py); Nunito Sans ships Latin only
import '@fontsource/nunito-sans/latin-400.css';
import '@fontsource/nunito-sans/latin-600.css';
import '@fontsource/nunito-sans/latin-800.css';
import { createAdapter } from './save/adapter.js';
import { createStore } from './save/store.js';
import { configureAudio } from './audio/index.js';
import { initHz } from './hz/hz.js';
import { initDictionary } from './ui/dictionary.js';
import { initDevPanel } from './ui/dev-panel.js';
import { createGame } from './world/game.js';
import { isModalOpen } from './ui/modal.js';
import { openDialogue, openSignCard } from './ui/dialogue.js';
import { openSettings } from './ui/settings.js';
import { createHud } from './ui/hud.js';
import { drawPortrait } from './world/draw.js';
import { portraitURL } from './world/portraits.js';
import { todayKey } from './core/clock.js';
import places from '../content/baotu-places.js';
import content from '../content/baotu.js';
import castData from '../content/cast.js';
import { playSession, storyCard, partsOf } from './session/runner.js';
import { renderPage, wirePage } from './session/notebook.js';
import { openModal, closeModal } from './ui/modal.js';
import { preloadStrokes } from './session/quiz-ui.js';
import { createArrival } from './ui/arrival.js';

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
const blocked = () => isModalOpen() || dictOpen() || busy || !!document.querySelector('.sheet, .storycard');

let scene = null;
const hud = createHud({
  name: places.name,
  onSettings: () => { openSettings({ store, toast, onReset: () => { refresh(); maybeStartOpening(); } }); },
  onDictionary: () => dict.open(),
  onNotebook: () => openNotebook(),
  onToday: () => today(),
  onBack: () => { if (scene && !blocked()) scene.showBoard(); },
  onTarget: (t) => pick(t)
});

const arrival = createArrival({ box, base: import.meta.env.BASE_URL, onTitle: (t) => hud.setTitle(t) });

let busy = false;     // a session is running
const P = () => store.state.progress;

function refresh() {
  const p = P();
  if (p.stage === 'opening' && !arrival.on) arrival.show(p.part > 0 ? 'road' : 'station');
  if (p.stage !== 'opening' && arrival.on) arrival.hide();
  if (p.stage === 'opening') { hud.setHint('arrive in Jinan.', busy ? null : p.part > 0 || (p.openingStep && p.openingStep !== 'refresh') ? 'Continue' : 'Begin'); if (scene) scene.setBeat(-1); return; }
  const place = places.beatPlaces[p.beat];
  const def = content.beats[p.beat];
  let hint = place ? place.hint : 'Baotu\'s beats are done. The gate quiz comes in checkpoint 5.';
  const parts = def ? partsOf(def) : [];
  if (place && parts[0] && parts[0].use) hint += p.beatStep === 'use' ? ' (continue the conversation)' : p.beatStep === 'notebook' ? ' (read the notebook)' : p.part > 0 ? ` (part ${p.part + 1} of ${parts.length})` : '';
  hud.setHint(hint, null);
  if (scene) scene.setBeat(p.beat);
}

// the next thing to do (bottom-bar button, Enter on the map)
function today() {
  if (busy) return;
  if (P().stage === 'opening') return startOpening();
}

// play a unit's sessions (its parts) from the saved one on; a story card leads into each later part
async function playParts(index, unit, stepKey, extra = {}) {
  const p = P(), parts = partsOf(unit);
  if (!(p.part >= 0 && p.part < parts.length)) p.part = 0;
  for (;;) {
    const def = parts[p.part];
    if (p.part > 0 && (p[stepKey] || 'refresh') === 'refresh' && def.intro) await storyCard(def.intro, 'Continue');
    const r = await playSession({ content, index, part: p.part, store, cast: castData.people, portraitFor, onStep: refresh, ...extra });
    if (r !== 'done') return r;
    if (p.part + 1 >= parts.length) { p.part = 0; store.save(); return 'done'; }
    p.part++; p[stepKey] = 'refresh'; store.save(); refresh();
  }
}

async function startOpening() {
  if (busy) return;
  busy = true; hud.clearHover(); refresh();
  try {
    if (!P().part && (!P().openingStep || P().openingStep === 'refresh')) await storyCard('You have come to Jinan to settle the estate of your great-uncle, Old Zhou. He lived on Qushuiting Street for fifty years. You don\'t speak Chinese yet.', 'Begin');
    const r = await playParts(0, content.opening, 'openingStep', { onAt: (stop) => arrival.at(stop) });
    if (r === 'done') {
      const p = P(); p.stage = 'district'; p.openingStep = 'done'; p.beat = 0; p.beatStep = 'refresh'; store.save();
      await storyCard('Next morning, you walk to Baotu Spring.', 'Go');
    }
  } finally { busy = false; refresh(); }
}
function maybeStartOpening() { if (P().stage === 'opening' && scene) startOpening(); }

async function startBeat() {
  const p = P(), def = content.beats[p.beat];
  if (!partsOf(def)[0].use) { toast('This scene comes in checkpoint 4.'); return; }
  busy = true; hud.clearHover();
  try {
    const r = await playParts(p.beat + 1, def, 'beatStep');
    if (r === 'done') { p.beat++; p.beatStep = 'refresh'; p.part = 0; store.save(); toast('Beat complete'); }
  } finally { busy = false; refresh(); }
}

function openNotebook() {
  if (busy || isModalOpen()) return;
  const el = document.createElement('div');
  el.className = 'sheet notebook-modal book';
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
// the cast's code-drawn portraits first (src/world/portraits.js); a step can ask for a face: neutral, happy, worried, confused
function portraitFor(id, face) {
  const coded = portraitURL(id, face);
  if (coded) return { src: coded, pixel: true };
  const p = manifest && manifest.people[id];
  if (!p) return null;
  if (p.portrait) return { src: import.meta.env.BASE_URL + 'assets/' + p.portrait };
  return { src: drawPortrait(p.look || {}).toDataURL(), pixel: true };
}

// a click on the board opens a place; a click on someone in a place talks to them (or starts today's beat)
async function pick(t) {
  if (!scene || blocked()) return;
  if (t.kind === 'place') return scene.openPlace(t.id);
  const p = P(), place = places.beatPlaces[p.beat];
  scene.faceYou(t);
  if (p.stage === 'district' && t.kind === 'npc' && place && place.npc === t.id && scene.place.id === place.place) return startBeat();
  if (t.kind === 'sign') await openSignCard(t.sign);
  else await openDialogue({ who: t.id, name: t.name, en: t.en, portrait: portraitFor(t.id), lines: t.lines });
}

// Esc in a place goes back to the board (checked before overlays close themselves on the same key)
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !scene || scene.view !== 'place' || blocked()) return;
  scene.showBoard();
}, true);

window.__game = createGame('phaser', {
  district: places,
  getBeat: () => (P().stage === 'opening' ? -1 : P().beat),
  onView: (s) => hud.setView(s, s.now),
  onReady: (s) => { scene = s; manifest = s.cache.json.get('manifest'); window.__scene = s; refresh(); maybeStartOpening(); setTimeout(preloadStrokes, 300); }
});
refresh();
