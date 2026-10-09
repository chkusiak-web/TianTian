// One-off copier: reads 天天's files (read-only) and writes ES-module copies into src/vendor/.
// Run from the repo root:  node tools/vendor-copy.js
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP = path.join(ROOT, 'tiantian-kit/tiantian-reference/app');
const OUT = path.join(ROOT, 'src/vendor');
fs.mkdirSync(OUT, { recursive: true });

function windowGlobal(file) {
  const win = {}; win.window = win;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), win, { filename: file });
  return win;
}
const emit = (name, value) => fs.writeFileSync(path.join(OUT, name), `// Copied from 天天 (${name.replace('.js', '')}); data unchanged.\nexport default ${JSON.stringify(value)};\n`);

emit('words.js', windowGlobal(path.join(APP, 'data/words.js')).WORDS);
emit('topics.js', windowGlobal(path.join(APP, 'data/topics.js')).WORD_TOPICS);
emit('strokes.js', windowGlobal(path.join(APP, 'data/strokes.js')).STROKES);

// Libraries stay byte-identical; src/vendor/*.js wrappers load them.
for (const f of ['lib/hanzi-writer.min.js', 'lib/pinyin-pro.js']) fs.copyFileSync(path.join(APP, f), path.join(OUT, path.basename(f).replace('.js', '.umd.txt')));
fs.copyFileSync(path.join(APP, 'lib/pinyin-pro-LICENSE.txt'), path.join(OUT, 'pinyin-pro-LICENSE.txt'));
fs.copyFileSync(path.join(APP, 'data/ARPHIC-LICENSE.txt'), path.join(OUT, 'ARPHIC-LICENSE.txt'));
fs.copyFileSync(path.join(APP, 'data/HSK-VOCAB-LICENSE.txt'), path.join(OUT, 'HSK-VOCAB-LICENSE.txt'));
fs.copyFileSync(path.join(ROOT, 'tiantian-kit/game-docs/tools/jinan-lexicon.json'), path.join(ROOT, 'content/lexicon.json'));
console.log('vendor files written');
