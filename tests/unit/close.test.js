import { describe, it, expect } from 'vitest';
import { judgeBuild } from '../../src/session/close.js';

const w = (s) => s.split(' ');
describe('close-enough answers', () => {
  it('exact matches, including accepted answers', () => {
    expect(judgeBuild(w('谢谢 你'), [w('谢谢 你'), w('谢谢')])).toBe('exact');
    expect(judgeBuild(w('谢谢'), [w('谢谢 你'), w('谢谢')])).toBe('exact');
  });
  it('a repeated word is close: 不，你先 for 不，不，你先', () => {
    expect(judgeBuild(w('不 你 先'), [w('不 不 你 先')])).toBe('close');
  });
  it('softening particles and optional words are close', () => {
    expect(judgeBuild(w('你 先 吧'), [w('你 先')])).toBe('close');
    expect(judgeBuild(w('这 是 本子'), [w('这 是 我的 本子')], { optional: ['我的'] })).toBe('close');
  });
  it('near (recast, §6.11 rule 4): wrong order, or one word missing or extra', () => {
    expect(judgeBuild(w('先 你 不'), [w('不 不 你 先')])).toBe('near');
    expect(judgeBuild(w('我 要 门票'), [w('我 要 一 个 门票')])).toBe('wrong');
    expect(judgeBuild(w('我 要 个 门票'), [w('我 要 一 个 门票')])).toBe('near');
    expect(judgeBuild(w('我 是 是 游客'), [w('我 是 游客')])).toBe('close');
    expect(judgeBuild(w('我 是 很 游客'), [w('我 是 游客')])).toBe('near');
  });
  it('a missing or extra negation is wrong, not near', () => {
    expect(judgeBuild(w('我 知道'), [w('我 不 知道')])).toBe('wrong');
    expect(judgeBuild(w('我 不 是 游客'), [w('我 是 游客')])).toBe('wrong');
  });
  it('a different word, or two words off, is wrong', () => {
    expect(judgeBuild(w('不 我 先'), [w('不 不 你 先')])).toBe('wrong');
    expect(judgeBuild(w('吧'), [w('你 先')])).toBe('wrong');
    expect(judgeBuild(w('先'), [w('不 你 先')])).toBe('wrong');
  });
});

import content from '../../content/baotu.js';
import { splitWords } from '../../src/lexicon.js';
describe('Baotu build prompts', () => {
  it('every accepted answer can be built from the tiles on offer', () => {
    const words = (s) => splitWords(s).filter((p) => p.w).map((p) => p.t);
    for (const s of [content.opening, ...content.beats].flatMap((b) => b.parts || [b]).flatMap((b) => (b.use ? b.use.steps : []))) {
      if (!s.build) continue;
      const pool = [...words(s.answer), ...(s.extra || [])];
      for (const a of s.accept || []) {
        const left = [...pool];
        for (const w of words(a)) { const i = left.indexOf(w); expect(i, `${a}: no tile for ${w}`).toBeGreaterThanOrEqual(0); left.splice(i, 1); }
      }
    }
  });
});
