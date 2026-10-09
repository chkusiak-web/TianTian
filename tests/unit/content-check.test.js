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
import baotu from '../../content/baotu.js';

describe('beat rules (§6.10)', () => {
  const beat = (steps, words = ['杯子']) => ({ district: 'baotu', beats: [{ id: 'x', words, scene: { maxChars: 999, steps } }] });
  const filler = { who: 'wang', zh: '杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子杯子' };
  it('passes the real Baotu content', () => { expect(checkBeatRules(baotu, 'baotu.js')).toEqual([]); });
  it('flags a word no beat has taught yet', () => {
    const p = checkBeatRules(beat([filler, { who: 'wang', zh: '你好，杯子！' }, { ask: 'pick', label: 'x', options: ['杯子'], answer: '杯子', words: ['杯子'] }]), 't');
    expect(p.join()).toMatch(/uses 你好/);
  });
  it('flags a beat word that is never the answer, or used only once', () => {
    const p = checkBeatRules(beat([{ who: 'wang', zh: '杯子' }, { do: 'x' }], ['杯子']), 't');
    expect(p.join()).toMatch(/not the answer to any prompt/); expect(p.join()).toMatch(/used 1 time/);
  });
  it('flags a prompt that catches a word its answer does not use', () => {
    const p = checkBeatRules(beat([filler, { ask: 'pick', label: 'x', options: ['杯子', '一'], answer: '一', words: ['杯子'] }], ['杯子', '一']), 't');
    expect(p.join()).toMatch(/doesn't use it/);
  });
});
