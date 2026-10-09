// Corner cards: where you are (top left), what to do next (bottom left), and chips for the notebook,
// dictionary and settings (bottom right). Over the art: the clickable places and people of the current view.
// On the board each place is a pin with a name tag; today's beat is the gold one (UI target, Oct 9).
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pctX = (x) => `${(x / 480) * 100}%`, pctY = (y) => `${(y / 270) * 100}%`;
const VERB = { place: 'Go', npc: 'Talk', sign: 'Read' };

export function createHud({ name, onSettings, onDictionary, onNotebook, onToday, onBack, onTarget }) {
  const overlay = document.getElementById('overlay');
  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `<div class="hudplace"><button class="btn back" id="hudBack" title="Back to the map (Esc)" hidden>← Map</button><b class="zh">${esc(name.zh)}</b><span class="pen" id="hudWhere">${esc(name.en)}</span></div>
    <div class="hudnext"><span class="hint" id="hint"></span><button class="btn primary today" id="hudToday" hidden>Begin <kbd>Enter</kbd></button></div>
    <div class="hudbtns"><button class="chip" id="hudBook" title="Old Zhou's notebook (N)">本子<small>Notebook</small></button><button class="chip" id="hudDict" title="Dictionary (⌘K)">词典<small>Dictionary</small></button><button class="chip" id="hudSet" title="Settings">设置<small>Settings</small></button></div>`;
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
    const who = t.kind === 'npc' ? [t.name, t.en].filter(Boolean).join(' · ') : t.kind === 'place' ? t.en : t.sign.en;
    tag.textContent = `${who} · ${VERB[t.kind]}`;
    const below = t.kind === 'npc' && !!t.name;   // a named person already has a tag over their head
    tag.classList.toggle('below', below);
    tag.style.left = pctX(b.x + b.w / 2); tag.style.top = pctY(below ? b.y + b.h + 2 : b.y - 2);
    tag.hidden = false;
  }
  // a pin: a name tag over a dot, anchored at (x, y)
  function pin(t, text, x, y, now) {
    const el = document.createElement('button');
    el.className = `spot k-${t.kind}${now ? ' now' : ''}`; el.dataset.id = t.id;
    el.setAttribute('aria-label', `${VERB[t.kind]}: ${t.kind === 'sign' ? t.sign.en : t.en}`);
    el.innerHTML = `<span class="tag" data-nohz><i>${esc([...text][0])}</i>${esc(text)}</span><span class="pin"></span>`;
    el.style.left = pctX(x); el.style.top = pctY(y);
    el.onclick = () => { hover(null); onTarget(t); };
    el.onmouseenter = el.onfocus = () => hover(t, { x: x - 20, y: y - 22, w: 40, h: 0 });
    el.onmouseleave = el.onblur = () => hover(null);
    return el;
  }

  return {
    setHint(text, button) {
      const h = hud.querySelector('#hint');
      h.innerHTML = text ? `Next: ${esc(text)}` : '';
      hud.querySelector('.hudnext').hidden = !text && !button;
      const b = hud.querySelector('#hudToday'); b.hidden = !button; if (button) b.innerHTML = `${esc(button)} <kbd>Enter</kbd>`;
    },
    // rebuild the buttons for the board or a place; `now` is today's beat place ({ place, npc }) or null
    setView(scene, now) {
      const place = scene.view === 'place' ? scene.place : null;
      hud.querySelector('#hudBack').hidden = !place;
      hud.querySelector('#hudWhere').textContent = place ? place.en : name.en;
      labels.innerHTML = '';
      const pins = [];
      for (const t of scene.targets) {
        const b = t.box, el = document.createElement('button');
        el.className = 'hot k-' + t.kind; el.dataset.kind = t.kind; el.dataset.id = t.id;
        el.setAttribute('aria-label', `${VERB[t.kind]}: ${t.kind === 'sign' ? t.sign.en : t.en}`);
        Object.assign(el.style, { left: pctX(b.x), top: pctY(b.y), width: pctX(b.w), height: pctY(b.h) });
        el.onmouseenter = el.onfocus = () => hover(t, b);
        el.onmouseleave = el.onblur = () => hover(null);
        el.onclick = () => { hover(null); onTarget(t); };
        labels.appendChild(el);
        if (t.kind === 'place') { el.tabIndex = -1; el.setAttribute('aria-hidden', 'true'); pins.push(pin(t, t.tag, t.pin.x, t.pin.y, now && now.place === t.id)); }
        if (t.kind === 'sign') pins.push(pin(t, t.sign.zh, b.x + b.w / 2, b.y, false));
        if (t.kind === 'npc' && t.name) pins.push(pin(t, t.name, t.x, t.y - 26, now && now.npc === t.id && place && now.place === place.id));
      }
      pins.forEach((p) => labels.appendChild(p));
      labels.appendChild(tag); tag.hidden = true;
    },
    clearHover() { tag.hidden = true; }
  };
}
