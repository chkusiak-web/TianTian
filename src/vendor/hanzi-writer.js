// Loads 天天's hanzi-writer 3.7.3 copy (src/vendor/hanzi-writer.min.umd.txt, unchanged) as a module.
import raw from './hanzi-writer.min.umd.txt?raw';
export default new Function(`${raw}\n;return HanziWriter;`)();
