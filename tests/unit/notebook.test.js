import { describe, it, expect } from 'vitest';
import { tokenState, lineClear, clearLines } from '../../src/session/notebook.js';
import { catchWord } from '../../src/core/words.js';
import { lookup } from '../../src/lexicon.js';
import { defaultSave } from '../../src/save/schema.js';
import content from '../../content/baotu.js';

const catchAll = (S, words) => words.forEach((h) => catchWord(S, String(lookup(h).id)));

describe('notebook page 1 (§4.4)', () => {
  it('names are always readable; other words are smudges until caught', () => {
    const S = defaultSave();
    expect(tokenState(S, '老周')).toBe('free');
    expect(tokenState(S, '杯子')).toBe('smudge');
    catchAll(S, ['杯子']); expect(tokenState(S, '杯子')).toBe('caught');
  });
  it('a two-character token clears when both characters are caught (这个 = 这 + 个)', () => {
    const S = defaultSave(); catchAll(S, ['这']);
    expect(tokenState(S, '这个')).toBe('smudge');
    catchAll(S, ['个']); expect(tokenState(S, '这个')).not.toBe('smudge');
  });
  it('after the opening, 「我是老周。」, 「你知道吗？」 and 「七十三。」 are readable', () => {
    const S = defaultSave(); catchAll(S, content.opening.words);
    const lines = content.notebook.lines.map((l) => l.zh);
    expect(clearLines(S, content.notebook.lines).map((i) => lines[i])).toEqual(['我是老周。', '你知道吗？', '七十三。']);
  });
  it('after the Hook, 「孩子：你好！」 clears too; after every beat the whole page is readable', () => {
    const S = defaultSave(); catchAll(S, content.opening.words); catchAll(S, content.beats[0].words);
    expect(lineClear(S, '孩子：你好！')).toBe(true);
    for (const b of content.beats) catchAll(S, b.words);
    expect(clearLines(S, content.notebook.lines)).toHaveLength(content.notebook.lines.length);
  });
});
