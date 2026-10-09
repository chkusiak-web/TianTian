import { describe, it, expect } from 'vitest';
import { pickVoice } from '../../src/audio/webspeech.js';

const mac = [
  { name: 'Sin-Ji', lang: 'zh-HK' }, { name: 'Mei-Jia', lang: 'zh-TW' },
  { name: 'Li-mu', lang: 'zh-CN' }, { name: 'Tingting', lang: 'zh-CN' }, { name: 'Samantha', lang: 'en-US' }
];

describe('voice choice', () => {
  it('never picks Cantonese or Taiwanese voices', () => {
    expect(pickVoice(mac, 'wang').name).toBe('Tingting');
    expect(pickVoice(mac, 'pan').name).toBe('Tingting');
    expect(pickVoice([{ name: 'Sin-Ji', lang: 'zh-HK' }, { name: 'Mei-Jia', lang: 'zh-TW' }], 'wang')).toBe(null);
  });
  it('falls back to any Mandarin voice', () => {
    expect(pickVoice([{ name: 'Mei-Jia', lang: 'zh-TW' }, { name: 'Google 普通话（中国大陆）', lang: 'zh-CN' }], 'wang').lang).toBe('zh-CN');
    expect(pickVoice([{ name: 'X', lang: 'zh_CN' }], 'pan').name).toBe('X');
  });
});
