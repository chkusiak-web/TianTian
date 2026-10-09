# Build plan: Working Title, Baotu test run

Scope A (Baotu end to end) · Movement A (walk, one screen, 30×17 tiles) · Plain JS (ES modules) · Vite · Phaser 3 · Vitest · Playwright.

## Read-only inputs
`tiantian-kit/`, `tiantian-trial/`, `visual-language/`, `BUILD-PROMPT.md`. Nothing in them is edited; code and data are copied out.

## Beat map (§5.1 rows → §2.2 beats)
| # | Beat | §5.1 rows | Place |
|---|------|-----------|-------|
| 1 | Hook | Hook | Railing, Grandma Wang |
| 2 | Investigate 1 | Clue 1 | Tai chi group, Teacher Zhang |
| 3 | Investigate 2 | Clue 2 | Ticket window, Ms. Chen (ledger) |
| 4 | Investigate 3 | Clue 3 + Clue 4 | Fish pool (Xiao Xie, 四/十 tone) → park signs → Gate 4 |
| 5 | Challenge | Challenge | Lele's riddle duel |
| 6 | Resolution + Payoff | Resolution + Payoff | Wang, then notebook page 1 |
Then: gate quiz 1 → "District 2 opens".

## Folder structure
```
index.html  vite.config.js  package.json
src/
  main.js                 boot: storage, audio, Phaser, overlay router
  core/  clock.js srs.js words.js status.js hearts.js quiz-stack.js tuning.js
  save/  adapter.js schema.js migrations.js transfer.js (export/import/reset)
  audio/ index.js (interface) webspeech.js
  world/ phaser-game.js baotu-scene.js tiles.js sprites.js (code-drawn art) manifest.js
  ui/    overlay.js dialogue.js drills/*.js notebook.js phone.js today.js settings.js dev-panel.js
  hz/    hz.js (hover/click/dictionary, module) lock.js
  talk/  talk.js (copied) adapter.js
  vendor/ words.js strokes.js hanzi-writer.min.js pinyin-pro.js + licences
content/
  baotu.js                beats, scenes, lines, prompts, tiles, notebook page, gate quiz
  cast.js  tuning.json  word-assignment.json (script output)
tools/
  check-zh.js (copied + adapted for data files)  assign-words.js  validate-content.js
assets/ manifest.json + generated placeholders
tests/  unit/*.test.js  e2e/slice.spec.js
build-notes/ PLAN.md DECISIONS.md
```

## Modules in one line each
- **srs.js**: `learnWord/grade/mastery/due` from 天天, with an injectable clock.
- **words.js**: states unseen/seen/caught/mastered/lapsed (§6.5).
- **status.js**: caught / mastered / clean-conversation counts → tier (§6.2).
- **hearts.js**: 5 hearts (4 after the clue-3 mistake), 3-in-a-row restore, requeue 2 prompts later, retreat at 0, instant retry.
- **quiz-stack.js**: gate quiz, misses go back in until right.
- **save/**: versioned schema, migrations, localStorage adapter, export/import, reset.
- **hz/**: hover pinyin, click English, locked while a question is open; phone dictionary.
- **drills/**: pick, hear→character, tone, tile-build, trace (hanzi-writer), optional typing.
- **dev-panel**: jump to beat, mark words, advance days, dump save, auto-answer for Playwright.

## Order and checkpoints (a commit each)
1. **Shell**: Vite + Phaser scene + overlay, hover/click Chinese, save/load/export/reset, dev panel. *Play:* open it, hover characters, save survives reload.
2. **Baotu map**: walkable park, cast placed, current-beat marker, signs, interact key. *Play:* walk and talk to placeholder lines.
3. **One full beat (Hook)**: word assignment list shown to you first, then Refresh → Learn → Use → Notebook. *Play:* the first session start to finish.
4. **All beats + Lele's duel**: tone mistake costs a heart. *Play:* the whole arc up to the challenge and the win/retreat/retry.
5. **Notebook page 1, gate quiz, word collection, status badge, settings, opening, courtyard home.** *Play:* fresh save to "District 2 opens".
6. **Playwright run of the whole slice**, then a playtest checklist.

## Gates
- `npm run check` (content validator) must pass before each checkpoint commit.
- `npm test` = Vitest + validator; Playwright runs on its own (`npm run e2e`) using the Chromium already on this machine.

## Word assignment (before any scene is written)
`tools/assign-words.js` starts from the words §5.1 names, adds greetings/people/countries/numbers 1–10 from 天天's topic tags, targets about 50 HSK 1 words split 9/9/9/8/4/4 across the six beats, and prints the list for your approval.

## Round 4 (design docs package, Oct 9)

Source: `tiantian-kit/game-docs/` CONCEPT §6.10–6.11, FRAMEWORK §8, HSK1-COVERAGE, ART-AND-AUDIO (copied in from the docs thread).

### Now (checkpoint 4b, before the gate quiz)
1. **Engine, conversation rules (§6.11):**
   - `reply` step: 2–3 replies in Chinese, at least one wrong or nonsense. A sensible pick is built from tiles and gets its own reaction (`then`); nonsense gets 「啊？什么？」 with a confused face and you choose again. Choices never change the clue path.
   - Listening is audio first (built); the text also appears after two replays.
   - Missed listening or reading outside a challenge: no ✗. The repair tiles appear (什么？ 请再说。 慢一点儿！ 我不知道。); building one makes the speaker repeat the line (slower for 慢一点儿), then you answer again. The missed word still goes to review. In a challenge the heart is lost and the repair line replaces the confirm box.
   - Recasts: a near-miss build (one word missing or extra, or the right words in the wrong order) isn't marked wrong outside a challenge. The NPC says it back correctly, the correct form shows under their line, and the words aren't caught. A wrong build gets 「啊？什么？」 and you try again; the second miss shows the answer.
2. **Checks (§6.10):** no line asked about right after it's shown; each line checked at most once; no speaking prompt that gives the English sentence ("Say: …"); every reply step has a nonsense option.
3. **Words:** the repair phrases are taught in the opening (Old Pan talks fast). Habit words move to where each character first speaks. `content/baotu-words.json` is written from the content (`npm run words`), so HSK1-COVERAGE's snapshot can be re-copied.
4. **Content:** rewrite all 12 Baotu sessions to the rules: merge "line, then ask about the line" into one audio-first prompt, turn "Say: …" into situations and reply choices, add each character's verbal habit (§6.11 rule 5), cut lines that exist only to fit a word (rule 6).
5. **Tests:** unit tests for the judge (near), reply steps and the new checks; e2e autoplay handles reply choices; all Baotu e2e runs stay green.

### Next
- **Gate quiz** (checkpoint 5), then the playtest checklist.
- **"Show understanding by doing"** steps: click the left path after 「前边，左边！」, pick the gate on the park board after 「他去了四号门！」.
- **Manifest rewrite** for the scene-map sizes (4×8, 8×12, 14×22) and portraits (ART §2.1), so hand-drawn people can drop in.
- **Recorded audio hook:** `audio/manifest.json` keyed by a hash of line + speaker; play the file if present, else Web Speech (FRAMEWORK §5).

### Decided, done later
- Phaser stays. Hosting is GitHub Pages with a test URL per checkpoint (set up when Moondog wants the first link). Desktop wrapper is decided after Jinan.
- Copy 天天's `talk.js` when the first typed prompt is built, behind the typing setting.
- Save version 2 (`progress.districts[id]`, `people[id]`) with a migration and unit test, before District 2 starts.
- Portraits are the code-drawn pixel ones (`src/world/portraits.js`); Chinese font is Noto Sans SC everywhere (built).
