import Phaser from 'phaser';
import { ShellScene } from './shell-scene.js';

export function createGame(parent, hooks) {
  const game = new Phaser.Game({
    type: Phaser.CANVAS,          // 480×270 pixel art needs no WebGL; canvas avoids repaint glitches under the HTML overlays
    parent,
    width: 480, height: 270,
    pixelArt: true, roundPixels: true, antialias: false,
    backgroundColor: '#D9F1F7',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [new ShellScene(hooks)]
  });
  return game;
}
