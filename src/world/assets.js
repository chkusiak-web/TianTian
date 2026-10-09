// Builds Phaser textures from the manifest: a PNG if the entry names one, the code-drawn placeholder otherwise.
import { drawTile, drawObject, personSheet, OBJECT_SIZE, TILE, CW, CH } from './draw.js';

const BASE = import.meta.env.BASE_URL + 'assets/';

export function preloadManifest(scene) {
  scene.load.json('manifest', BASE + 'manifest.json');
}
export function preloadImages(scene) {
  const m = scene.cache.json.get('manifest');
  for (const group of ['tiles', 'objects', 'people']) for (const [k, v] of Object.entries(m[group])) {
    if (!v.src) continue;
    if (group === 'people') scene.load.spritesheet('person.' + k, BASE + v.src, { frameWidth: CW, frameHeight: CH });
    else scene.load.image((group === 'tiles' ? 'tile.' : 'obj.') + k, BASE + v.src);
  }
}
export function buildTextures(scene) {
  const m = scene.cache.json.get('manifest'), T = scene.textures;
  const add = (key, canvas, sheet) => {
    if (T.exists(key)) return;
    const tex = T.addCanvas(key, canvas);
    if (sheet) for (let i = 0; i < 16; i++) tex.add(i, 0, (i % 4) * CW, ((i / 4) | 0) * CH, CW, CH);
  };
  for (const [k, v] of Object.entries(m.tiles)) if (!v.src) add('tile.' + k, drawTile(k));
  for (const [k, v] of Object.entries(m.objects)) if (!v.src) add('obj.' + k, drawObject(k));
  for (const [k, v] of Object.entries(m.people)) if (!v.src) add('person.' + k, personSheet(v.look || {}), true);
  return { TILE, OBJECT_SIZE };
}
// frame index in a person sheet
export const personFrame = (dirIndex, f) => dirIndex * 4 + f;
