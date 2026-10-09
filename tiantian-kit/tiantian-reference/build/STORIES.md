# Writing 故 Stories for 天天

天天 is an offline Mac app for an English speaker learning Mandarin (Simplified, HSK 3.0). **Stories** are short graded readers starring the recurring Jinan characters. The learner's goals, in priority order:
1. **Contextualizing words and phrases** — seeing words and chunks used naturally in context, beyond flashcards (TOP PRIORITY).
2. Reading comprehension.
3. Vocabulary.

How the app uses a story: (1) the learner reads it sentence by sentence (hover pinyin, click English, read-aloud); useful **chunks** are underlined and explained; (2) 3–4 **comprehension questions** in Chinese; (3) the story comes back with 5–8 **blanks** on chunks/collocations that the learner fills using context (type it if known, else pick from 4 options); (4) new words + chunks go to Review *with their sentence*.

## Files
- **Reference example — read it first and match its style and shape exactly:** `app/data/stories/hsk1-wang-dumplings.js`
- Characters (personality, speech, role): `app/data/jinan.js` (`characters`), and their voice/catchphrases in `app/data/jinan-scripts.js`. Keep each character in voice.
- Write ONE FILE PER STORY: `app/data/stories/hsk<level>-<charId>-<slug>.js`, e.g. `hsk2-pan-traffic.js`, containing one `window.STORIES.push({...});`.
- Check: `node build/check_stories.js --only=hsk<level>` (from `/home/claude/mandarin`). Fix until **0 errors** for your files. Warnings are worth fixing too. The checker uses the real HSK 3.0 word list.

## Shape
```js
window.STORIES.push({
  id: 'pan-traffic', hsk: 2, chars: ['pan'],          // id: '<charId>-<slug>', unique; chars: who's in it (main character first)
  title: ['老潘的一天', "Old Pan's Day"],
  names: ['老潘'],                                     // proper nouns/names used (character names, place names like 趵突泉) — exempt from the word check
  new: [['堵车', 'dǔchē', 'traffic jam']],             // 0–3 words ABOVE the level that the story teaches (each must appear in the text)
  text: [[zh, en], ...],                               // 8–15 sentences; natural English translations
  chunks: [[zh, en, note], ...],                       // 3–6 useful phrases/collocations that appear verbatim in the text; note = one short English line on how it's used
  qs: [{ q: '…？', o: ['right', 'wrong', 'wrong'], a: 0 }, ...],  // 3–4 comprehension questions, in Chinese at the story's level; 3 options; a = index of the right one (the app shuffles)
  blanks: [{ s: 3, t: '打个车', d: ['…', '…', '…'] }, ...]       // 5–8 blanks; s = sentence index; t = exact substring of text[s]; d = 3 distractors
});
```

## Rules
- **Level:** every word in text, questions, options and distractors must be at or below the story's HSK level, except `new` words and `names`. HSK 1 is tight (≈500 words): keep sentences simple; use `new` for the 1–3 words the story really needs. The checker tells you exactly which word is too high — rephrase.
- **Length:** HSK 1: 8–11 sentences, short. HSK 2: 10–13. HSK 3: 11–15, can be a little longer and use more connectors (因为…所以, 虽然…但是, 一边…一边, 越来越…).
- **Story:** a real little story with a beginning, a small problem or surprise, and an ending — warm, funny or touching, set in Jinan. Not a textbook dialogue. Mix narration (我/他/她) with a little dialogue in “…” quotes. The learner (我) can appear as the narrator.
- **Context first:** pick blanks and chunks that carry meaning in context — collocations (打电话, 坐地铁, 一大碗), set phrases (慢慢来, 不好意思, 没关系), verb+result (找到, 听懂), measure word + noun, time/place phrases. The sentence (or the one before it) must give a clue that makes the answer clearly right.
- **Distractors:** same type and length as the answer, at level, grammatical, but clearly WRONG in this context (e.g. answer 一大碗 → 一大杯 / 一大本 / 一大块). Never a distractor that would also be correct.
- **Blanks:** max 1 per sentence; prefer 2–4 character words or chunks; spread across the story.
- **Questions:** test understanding of what happened (who/what/why/how many), not word definitions. Wrong options must be plausible but clearly wrong from the text.
- **Chunks:** the most reusable phrases in the story, with a short practical English note.
- Simplified characters only. Use Chinese quotes “…” for dialogue. Keep each character's personality and catchphrases (王奶奶 says 孩子, 孙师傅 says 朋友, 老潘 says 我跟你说, etc.).
- Don't make two stories with the same plot; vary settings around Jinan (趵突泉, 大明湖, 芙蓉街, 千佛山, 泉城广场, 宽厚里, 曲水亭街, 山东大学, the hospital, the train station).
