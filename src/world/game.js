import Phaser from 'phaser';
import { DistrictScene } from './district-scene.js';

export function createGame(parent, hooks) {
  return new Phaser.Game({
    type: Phaser.CANVAS,          // 480×270 pixel art needs no WebGL; canvas avoids repaint glitches under the HTML overlays
    parent,
    width: 480, height: 270,
    pixelArt: true, roundPixels: true, antialias: false,
    backgroundColor: '#D9F1F7',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { keyboard: false, mouse: false, touch: false },   // clicks go to the HTML buttons in ui/hud.js
    scene: [new DistrictScene(hooks)]
  });
}
