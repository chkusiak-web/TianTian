import { describe, it, expect } from 'vitest';
import { defaultSave, SAVE_VERSION, SAVE_KEY } from '../../src/save/schema.js';
import { migrate } from '../../src/save/migrations.js';
import { createAdapter, memoryBackend } from '../../src/save/adapter.js';
import { createStore } from '../../src/save/store.js';
import { exportText, parseImport } from '../../src/save/transfer.js';
import { getOffsetDays, setOffsetDays } from '../../src/core/clock.js';

describe('save migrations', () => {
  it('upgrades an unversioned blob to the current version and fills defaults', () => {
    const out = migrate({ words: { 5: { reps: 1 } }, settings: { rate: 'slow' } });
    expect(out.v).toBe(SAVE_VERSION);
    expect(out.words['5']).toEqual({ reps: 1 });
    expect(out.settings.rate).toBe('slow'); expect(out.settings.leniency).toBe('relaxed');
    expect(out.progress.beat).toBe(0);
  });
  it('runs every step in order from an older version', () => {
    const log = [];
    const steps = { 1: (d) => (log.push(1), { ...d, a: 1 }), 2: (d) => (log.push(2), { ...d, b: 2 }) };
    const out = migrate({ v: 1 }, steps, 3);
    expect(log).toEqual([1, 2]); expect(out).toMatchObject({ v: 3, a: 1, b: 2 });
  });
  it('refuses a save from a newer build and a missing step', () => {
    expect(() => migrate({ v: SAVE_VERSION + 1 })).toThrow(/newer/);
    expect(() => migrate({ v: 1 }, {}, 2)).toThrow(/No migration/);
    expect(() => migrate('x')).toThrow();
  });
  it('does not change its input', () => {
    const src = { v: 0, words: {} }; migrate(src); expect(src.v).toBe(0);
  });
});

describe('store + adapter', () => {
  it('saves, reloads and resets', () => {
    const backend = memoryBackend();
    const a = createStore(createAdapter(backend)); a.load();
    a.state.stats.conversations = 3; a.state.words['7'] = { reps: 1 }; a.save();
    const b = createStore(createAdapter(backend)); b.load();
    expect(b.state.stats.conversations).toBe(3); expect(b.state.words['7']).toBeTruthy();
    b.reset(); expect(createAdapter(backend).read(SAVE_KEY)).toBeNull();
    expect(b.state.stats.conversations).toBe(0);
  });
  it('keeps a broken save aside and starts fresh', () => {
    const backend = memoryBackend(); backend.setItem(SAVE_KEY, JSON.stringify({ v: 99 }));
    const s = createStore(createAdapter(backend)); s.load();
    expect(s.state.v).toBe(SAVE_VERSION);
    expect(backend.getItem(SAVE_KEY + ':broken')).toBeTruthy();
  });
  it('survives a backend that throws', () => {
    const bad = { getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); }, removeItem() { throw new Error('no'); } };
    const ad = createAdapter(bad);
    expect(ad.read('k')).toBeNull(); expect(ad.write('k', 1)).toBe(false);
  });
  it('restores the dev clock offset from the save', () => {
    const backend = memoryBackend();
    const a = createStore(createAdapter(backend)); a.load(); a.state.dev.dayOffset = 5; a.save();
    setOffsetDays(0);
    createStore(createAdapter(backend)).load();
    expect(getOffsetDays()).toBe(5); setOffsetDays(0);
  });
});

describe('export / import', () => {
  it('round-trips a save', () => {
    const s = defaultSave(); s.words['1'] = { reps: 2 };
    expect(parseImport(exportText(s)).words['1']).toEqual({ reps: 2 });
  });
  it('rejects things that are not saves', () => {
    expect(() => parseImport('nope')).toThrow(/JSON/);
    expect(() => parseImport(JSON.stringify({ hello: 1 }))).toThrow(/not a Working Title/);
  });
});
