import { SAVE_KEY, defaultSave } from './schema.js';
import { migrate } from './migrations.js';
import { setOffsetDays } from '../core/clock.js';

export function createStore(adapter) {
  let state = defaultSave();
  const subs = new Set();
  const emit = () => subs.forEach((f) => f(state));

  function load() {
    const raw = adapter.read(SAVE_KEY);
    if (!raw) { state = defaultSave(); }
    else {
      try { state = migrate(raw); }
      catch (e) { console.warn('Save could not be read, starting fresh:', e.message); adapter.write(SAVE_KEY + ':broken', raw); state = defaultSave(); }
    }
    setOffsetDays(state.dev.dayOffset || 0);
    emit();
    return state;
  }
  function save() { adapter.write(SAVE_KEY, state); emit(); }
  function replace(next) { state = migrate(next); setOffsetDays(state.dev.dayOffset || 0); save(); }
  function reset() { adapter.remove(SAVE_KEY); state = defaultSave(); setOffsetDays(0); emit(); }

  return {
    get state() { return state; },
    load, save, replace, reset,
    subscribe(f) { subs.add(f); return () => subs.delete(f); }
  };
}
