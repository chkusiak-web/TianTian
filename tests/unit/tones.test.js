import { describe, it, expect } from 'vitest';
import { toneOptions, syllables, markSyllable } from '../../src/core/tones.js';

describe('tone options', () => {
  it('reads numbered and tone-marked pinyin', () => {
    expect(syllables('bei1 zi5')).toEqual([['bei', 1], ['zi', 5]]);
    expect(syllables('miàn zi')).toEqual([['mian', 4], ['zi', 5]]);
    expect(syllables('lv4')).toEqual([['lü', 4]]);
  });
  it('puts the mark on the right vowel', () => {
    expect(markSyllable('hao', 3)).toBe('hǎo'); expect(markSyllable('gou', 3)).toBe('gǒu');
    expect(markSyllable('liu', 2)).toBe('liú'); expect(markSyllable('gui', 4)).toBe('guì'); expect(markSyllable('zi', 5)).toBe('zi');
  });
  it('gives the right answer plus three different wrong ones', () => {
    const o = toneOptions('mei2 you3');
    expect(o[0]).toEqual({ py: 'méiyǒu', ok: true });
    expect(o).toHaveLength(4); expect(new Set(o.map((x) => x.py)).size).toBe(4); expect(o.filter((x) => x.ok)).toHaveLength(1);
  });
});
