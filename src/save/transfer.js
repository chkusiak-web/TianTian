// Export / import of the save as a file.
import { migrate } from './migrations.js';

export const FILE_TAG = 'working-title-save';

export const exportText = (state) => JSON.stringify({ app: FILE_TAG, savedAt: new Date().toISOString(), data: state }, null, 2);

export function parseImport(text) {
  let obj;
  try { obj = JSON.parse(text); } catch { throw new Error('That file is not valid JSON.'); }
  if (!obj || obj.app !== FILE_TAG || !obj.data) throw new Error('That is not a Working Title save file.');
  return migrate(obj.data);
}

export function downloadSave(state) {
  const blob = new Blob([exportText(state)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `working-title-save-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const readFileText = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error('Could not read the file.')); r.readAsText(file); });
