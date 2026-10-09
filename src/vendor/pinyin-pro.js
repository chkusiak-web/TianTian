// Loads 天天's pinyin-pro copy (src/vendor/pinyin-pro.umd.txt, unchanged) as a module.
import raw from './pinyin-pro.umd.txt?raw';
const exp = {};
new Function('exports', 'module', raw).call(globalThis, exp, { exports: exp });
export const { pinyin, convert, html } = exp;
export default exp;
