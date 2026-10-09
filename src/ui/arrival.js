// The arrival's own backdrop (test run, Oct 9): the city map of Jinan from the visual thread, with Old Pan's taxi
// going from the West Station to your courtyard on Qushuiting Street. It sits over the district board while the
// opening is played, so the arrival never happens at Baotu Spring.
// Stops are in pixels of the map crop (960×540, public/assets/arrival/jinan.png).
const MAP = { w: 960, h: 540, src: 'assets/arrival/jinan.png' };
export const STOPS = {
  station: { x: 150, y: 160, zh: '济南西站', en: 'Jinan West Station' },
  road: { x: 336, y: 172, zh: '济南', en: 'Jinan, in Old Pan\'s taxi' },
  home: { x: 700, y: 196, zh: '曲水亭街', en: 'Qushuiting Street' }
};
const ROUTE = [[150, 160], [250, 160], [336, 172], [470, 178], [548, 196], [700, 196]];

// the kit's gold car (sprite kit: S.car), 10×6
function car() {
  const c = document.createElement('canvas'); c.width = 10; c.height = 6;
  const g = c.getContext('2d'), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  R(0, 2, 10, 3, '#E8B04A'); R(2, 0, 6, 2, '#E8B04A'); R(3, 1, 4, 1, '#2F4250'); R(1, 5, 2, 1, '#2F4250'); R(7, 5, 2, 1, '#2F4250');
  return c;
}

export function createArrival({ box, base = '', onTitle }) {
  const el = document.createElement('div');
  el.id = 'arrival'; el.hidden = true;
  const pct = (x, y) => ({ left: (x / MAP.w) * 100 + '%', top: (y / MAP.h) * 100 + '%' });
  el.innerHTML = `<img src="${base}${MAP.src}" alt="A map of Jinan: the West Station on the left, the old town and Daming Lake in the middle.">
    <svg viewBox="0 0 ${MAP.w} ${MAP.h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${ROUTE.map((p) => p.join(',')).join(' ')}"/></svg>
    <div class="taxi" aria-hidden="true"></div>`;
  el.querySelector('.taxi').appendChild(car());
  box.insertBefore(el, box.querySelector('#labels'));
  let at = null;
  const api = {
    get on() { return !el.hidden; },
    show(stop = 'station') { el.hidden = false; api.at(stop); },
    hide() { el.hidden = true; at = null; onTitle && onTitle(null); },
    at(stop) {
      const s = STOPS[stop]; if (!s || stop === at) return;
      at = stop;
      Object.assign(el.querySelector('.taxi').style, pct(s.x, s.y));
      el.querySelector('.taxi').classList.toggle('parked', stop === 'home');
      onTitle && onTitle(s);
    }
  };
  return api;
}
