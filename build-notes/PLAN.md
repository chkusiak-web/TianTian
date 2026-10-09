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
