// Checkpoint 1 shell: proves the art pipeline (manifest → textures), the 480×270 canvas and the overlay labels.
// The real Baotu map replaces this in checkpoint 2.
import Phaser from 'phaser';
import { preloadManifest, preloadImages, buildTextures } from './assets.js';

export class ShellScene extends Phaser.Scene {
  constructor(hooks) { super('shell'); this.hooks = hooks; }
  preload() {
    preloadManifest(this);
    this.load.on('filecomplete-json-manifest', () => preloadImages(this));
  }
  create() {
    buildTextures(this);
    const W = 30, H = 17;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let t = (x * 7 + y * 3) % 5 === 0 ? 'grass_b' : 'grass_a';
      if (y >= 6 && y <= 10 && x >= 11 && x <= 18) t = 'water_a';
      else if (y >= 5 && y <= 11 && x >= 10 && x <= 19) t = 'pave';
      if (y === 14 || x === 4) t = 'path';
      this.add.image(x * 16, y * 16, 'tile.' + t).setOrigin(0);
    }
    this.water = [];
    for (let y = 6; y <= 10; y++) for (let x = 11; x <= 18; x++) this.water.push(this.add.image(x * 16, y * 16, 'tile.water_b').setOrigin(0).setVisible(false));
    this.time.addEvent({ delay: 600, loop: true, callback: () => { this.flip = !this.flip; this.water.forEach((w) => w.setVisible(this.flip)); } });
    this.add.image(8 * 16, 4 * 16, 'obj.sign').setOrigin(0);
    this.add.image(21 * 16, 4 * 16, 'obj.lantern').setOrigin(0);
    this.add.image(3 * 16, 3 * 16, 'tile.tree').setOrigin(0);
    this.add.image(25 * 16, 11 * 16, 'tile.willow').setOrigin(0);
    const wang = this.add.sprite(6 * 16, 11 * 16, 'person.wang', 0).setOrigin(0);
    const zhang = this.add.sprite(22 * 16, 12 * 16, 'person.zhang', 0).setOrigin(0);
    this.player = this.add.sprite(14 * 16, 13 * 16, 'person.player', 0).setOrigin(0);
    [wang, zhang, this.player].forEach((s, i) => this.tweens.add({ targets: s, y: s.y - 1, duration: 500 + i * 80, yoyo: true, repeat: -1 }));
    this.hooks.onReady && this.hooks.onReady(this);
  }
}
