import { SAVE_VERSION, defaultSave } from './schema.js';

// MIGRATIONS[n] upgrades a save from version n to n+1.
export const MIGRATIONS = {
  // 0 -> 1: an unversioned blob gets the v1 defaults filled in around whatever it had
  0: (d) => deepFill({ ...d, v: 1 }, defaultSave())
};

function deepFill(target, defaults) {
  for (const k of Object.keys(defaults)) {
    if (target[k] === undefined) target[k] = defaults[k];
    else if (isObj(target[k]) && isObj(defaults[k])) deepFill(target[k], defaults[k]);
  }
  return target;
}
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);

export function migrate(data, migrations = MIGRATIONS, target = SAVE_VERSION) {
  if (!isObj(data)) throw new Error('Save is not an object');
  let d = structuredClone(data);
  let v = Number.isInteger(d.v) ? d.v : 0;
  if (v > target) throw new Error(`Save is from a newer version (${v}) than this build (${target})`);
  while (v < target) {
    const step = migrations[v];
    if (!step) throw new Error(`No migration from save version ${v}`);
    d = step(d); v++; d.v = v;
  }
  // fields added since a save was written (same version) get their defaults, so older saves never crash
  return deepFill(d, defaultSave());
}
