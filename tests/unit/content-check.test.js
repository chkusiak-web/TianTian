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
