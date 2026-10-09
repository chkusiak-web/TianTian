// Corner display: where you are, what to do next, and buttons for the notebook, dictionary and settings.
// Also the clickable places and people of the current view (HTML buttons over the art), their hover tag,
// and the in-world labels and signs.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pctX = (x) => `${(x / 480) * 100}%`, pctY = (y) => `${(y / 270) * 100}%`;
const VERB = { place: 'Go', npc: 'Talk', sign: 'Read' };

export function createHud({ name, onSettings, onDictionary, onNotebook, onToday, onBack, onTarget }) {
  const overlay = document.getElementById('overlay');
  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `<div class="place"><button class="btn back" id="hudBack" title="Back to the map (Esc)" hidden>← Map</button><span class="zh">${esc(name.zh)}</span> <span class="pen" id="hudWhere">${esc(name.en)}</span><span class="hint" id="hint"></span><button class="btn today" id="hudToday" hidden>Begin <kbd>Enter</kbd></button></div>
    <div class="hudbtns"><button class="btn" id="hudBook" title="Old Zhou's notebook (N)">本子</button><button class="btn" id="hudDict" title="Dictionary (⌘K)">词典</button><button class="btn" id="hudSet" title="Settings">⚙ Settings</button></div>`;
  overlay.appendChild(hud);
  hud.querySelector('#hudSet').onclick = onSettings;
  hud.querySelector('#hudDict').onclick = onDictionary;
  hud.querySelector('#hudBook').onclick = onNotebook;
  hud.querySelector('#hudToday').onclick = onToday;
  hud.querySelector('#hudBack').onclick = onBack;

  const labels = document.getElementById('labels');
  const tag = document.createElement('div');
  tag.className = 'reach'; tag.hidden = true;

  function hover(t, b) {
    if (!t) { tag.hidden = true; return; }
    const who = t.kind === 'npc' ? [t.name, t.en].filter(Boolean).join(' · ') : t.kind === 'place' ? t.en : '';
    tag.textContent = who ? `${who} · ${VERB[t.kind]}` : VERB[t.kind];
    tag.style.left = pctX(b.x + b.w / 2); tag.style.top = pctY(b.y - 2);
    tag.hidden = false;
  }

  return {
    setHint(text, button) {
      hud.querySelector('#hint').textContent = text ? 'Next: ' + text : '';
      const b = hud.querySelector('#hudToday'); b.hidden = !button; if (button) b.innerHTML = `${esc(button)} <kbd>Enter</kbd>`;
    },
    // rebuild the buttons and labels for the board or a place
    setView(scene) {
      const place = scene.view === 'place' ? scene.place : null;
      hud.querySelector('#hudBack').hidden = !place;
      hud.querySelector('#hudWhere').textContent = place ? place.en : name.en;
      labels.innerHTML = '';
      for (const t of scene.targets) {
        const b = t.box, el = document.createElement('button');
        el.className = 'hot k-' + t.kind; el.dataset.kind = t.kind; el.dataset.id = t.id;
        el.setAttribute('aria-label', `${VERB[t.kind]}: ${t.kind === 'sign' ? t.sign.en : t.en}`);
        Object.assign(el.style, { left: pctX(b.x), top: pctY(b.y), width: pctX(b.w), height: pctY(b.h) });
        el.onmouseenter = el.onfocus = () => hover(t, b);
        el.onmouseleave = el.onblur = () => hover(null);
        el.onclick = () => { hover(null); onTarget(t); };
        labels.appendChild(el);
      }
      for (const l of scene.labels) {
        const d = document.createElement('div');
        d.className = 'wlabel' + (l.sign ? ' sign' : '');
        d.textContent = l.zh;
        d.style.left = pctX(l.x); d.style.top = pctY(l.y);
        labels.appendChild(d);
      }
      labels.appendChild(tag); tag.hidden = true;
    },
    clearHover() { tag.hidden = true; }
  };
}
