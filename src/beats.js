// Beat list for dev tools, the hint and the marker: the playable beats of content/baotu.js (the opening is separate).
import baotu from '../content/baotu.js';
export const OPENING = baotu.beats.find((b) => b.id === 'opening');
export const BEATS = baotu.beats.filter((b) => b.id !== 'opening');
