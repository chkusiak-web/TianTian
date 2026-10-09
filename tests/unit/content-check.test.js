import { describe, it, expect } from 'vitest';
import { checkString, checkContent, playerStrings } from '../../tools/lib/zhcheck.js';

describe('content validator', () => {
  it('accepts HSK 1 words, names, particles and this district\'s taught words', () => {
    for (const s of ['你好！我是王奶奶。', '我的杯子没有了！', '老周天天早上都来这儿。', '你是游客吗？', '嗯，哈哈！']) expect(checkString(s, 'baotu').bad, s).toEqual([]);
  });
  it('rejects words above HSK 1', () => {
    const { bad } = checkString('不好意思', 'baotu');
    expect(bad.length).toBeGreaterThan(0);
  });
  it('rejects a later district\'s taught word', () => {
    expect(checkString('我要一碗油旋。', 'baotu').bad.map((t) => t.w)).toEqual(expect.arrayContaining(['碗']));
    expect(checkString('我要一碗油旋。', 'furong').bad).toEqual([]);
  });
  it('walks nested content, skipping _notes', () => {
    const data = { district: 'baotu', a: [{ zh: '你好' }, { zh: '不好意思' }], _note: '随便写', en: 'hello' };
    expect([...playerStrings(data)].map((x) => x.path)).toEqual(['a[0].zh', 'a[1].zh']);
    const r = checkContent(data);
    expect(r.problems).toHaveLength(1); expect(r.problems[0]).toMatch(/a\[1\]\.zh/);
  });
});

import { checkBeatRules } from '../../tools/lib/beatrules.js';
describe('§6.10 beat rules', () => {
  const base = () => ({ district: 'baotu', opening: { id: 'o', words: ['你好', '我'], use: { steps: [
    { npc: 'x', zh: '你好！我，老潘。' }, { build: true, answer: '你好！', extra: [] }, { ask: 'listen', zh: '我', options: ['我', '你好'], answer: '我' }] } }, beats: [] });
  const quiet = () => {};
  it('passes a scene where every new word is an answer and appears twice', () => {
    expect(checkBeatRules(base(), 't', quiet)).toEqual([]);
  });
  it('flags a new word that is never an answer', () => {
    const d = base(); d.opening.words.push('杯子'); d.opening.use.steps.push({ npc: 'x', zh: '杯子，杯子' });
    expect(checkBeatRules(d, 't', quiet).join()).toMatch(/杯子 is not the answer/);
  });
  it('flags a word the scene uses before it is taught', () => {
    const d = base(); d.opening.use.steps.push({ npc: 'x', zh: '我要杯子。' });
    expect(checkBeatRules(d, 't', quiet).join()).toMatch(/uses 要/);
  });
});
