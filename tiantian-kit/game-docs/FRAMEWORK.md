# Technical Framework · The 73rd Spring (working title)

Version 0.1 · Oct 9, 2026

**What this is.** The technical shape of the game: how it is put together, the formats content is written in, how saving, audio and checking work, and what each 天天 part becomes. It describes the Baotu build that already exists (repo `chkusiak-web/TianTian`, branch `claude/scene-map`, commit `b70d2f3`) and sets the rules for everything after it. No code is written here.

**Status words used below:** **built** (in the build now), **planned** (in the build's plan, not there yet), **proposed** (new in this document).

<!-- zh:off -->

---

## 1. Decisions this framework rests on

| Topic | Decision | Source |
| --- | --- | --- |
| Platform | Web first, desktop browsers. A desktop wrapper later | Brief, CONCEPT §0 |
| Engine | Phaser 3 draws the scene art; everything you read or click is HTML on top | Brief; build decision 35 |
| Language | Plain JavaScript (ES modules), no framework, no TypeScript | Build decision 4 |
| Tooling | Vite (dev server and build), Vitest (unit tests), Playwright (browser tests) | Build plan |
| Offline | Everything works with no network and no AI | Brief |
| 天天 | Frozen. Code and data are copied out, never imported from its folder | Brief |
| Content | Plain JS data files in `content/`, checked by script before every commit | Build |

---

## 2. Architecture

```
index.html
src/
  main.js        boot: storage → audio → Phaser → HTML overlays; routes clicks to sessions
  core/          rules with no UI: clock, SRS, word states, sentence split
  session/       the session loop: Refresh → Learn → Use → Notebook; drills; close-enough judging
  world/         Phaser: the district board and scene art, people sprites, palette
  ui/            HTML overlays: dialogue box, panel, HUD, dictionary (phone), settings, dev panel
  hz/            hover pinyin / click English on every Chinese string, locked during questions
  audio/         one audio interface; Web Speech behind it now, recorded files later
  save/          versioned save file, migrations, storage adapter, export/import
  vendor/        copied libraries and data, with their licence files
content/         districts, cast, places, lexicon (data, not code)
tools/           content checks, word assignment, font subsetting
tests/           unit (Vitest) and browser (Playwright) tests
```

**One rule holds it together:** `core/` and `session/` never touch Phaser, and `world/` never decides game rules. Phaser only paints. That keeps the rules testable in Node and makes Phaser replaceable (§8).

### 2.1 Modules

| Module | Job | Status |
| --- | --- | --- |
| `core/clock.js` | One `now()` for the whole game, so tests and the dev panel can move time | Built |
| `core/srs.js` | 天天's `learnWord`, `grade`, `mastery`, `due`, unchanged in their rules, working on the save object | Built |
| `core/words.js` | Word states: unseen, seen, caught, mastered, lapsed (CONCEPT §6.5) | Built |
| `core/status.js` | Caught / mastered / clean-conversation counts → tier (CONCEPT §6.2) | Planned |
| `core/hearts.js` | Challenge hearts: start 5 (4 after the clue mistake), 3-in-a-row restore, requeue, retreat | Planned |
| `core/quiz-stack.js` | Gate quiz: a miss goes back into the stack until right (CONCEPT §6.7) | Planned |
| `session/runner.js` | Plays a session and saves the current step, so Esc pauses and resumes | Built |
| `session/learn.js`, `drills.js` | Intro cards and drills: pick, hear→character, tone, build, trace | Built |
| `session/use.js` | Plays a scene's steps (lines, questions, builds, notes, signs) | Built |
| `session/close.js` | Judges a built answer: exact, close, wrong | Built |
| `session/notebook.js` | Notebook page: lines come into focus as their words are caught | Built |
| `session/talk.js` | Typed-answer matching, copied from 天天's `talk.js` (only when typing is on) | Proposed |
| `ui/*` | Dialogue box, docked lesson panel, HUD, phone dictionary, settings | Built |
| `ui/dev-panel.js` | Jump to any session, mark words, move days, dump the save. Only with `?dev` | Built |
| `world/*` | Board and scene art, code-drawn people at three zoom levels | Built |
| `audio/` | `say(text, who)`, `stop()`, voice choice per character | Built (Web Speech) |
| `save/` | Save schema, migrations, adapter, export/import/reset | Built |

---

## 3. Content format

Content is data in `content/*.js`. A writer edits these files and runs `npm run check`. No game code changes for new scenes.

### 3.1 A district file (built)

```js
export default {
  district: 'baotu',
  opening: { id, title, en, words, parts: [ /* sessions */ ] },
  beats: [
    { id: 'hook', title, npc, en, words, parts: [
      { id: 'hook1', title, intro, en, words: ['孩子', '杯子', ...],   // at most 8 new words
        use: { place, steps: [ /* see 3.2 */ ] } }
    ] },
    ...
  ],
  notebook: { page: 1, lines: [{ zh, en }, ...] }
};
```

- A **unit** is the opening or a beat. It has one or more **parts**; each part is one session (Refresh → Learn → Use → Notebook).
- `words` are the new words that part teaches. The coverage script (`HSK1-COVERAGE.md`) decides which district a word belongs to; the build's `assign-words.js` splits a district's words into parts.

### 3.2 Scene steps

Built now:

| Step | Shape | What the player does |
| --- | --- | --- |
| Line | `{ npc, zh, en }` | Hears and reads it |
| Note | `{ note }` | Reads English narration |
| Question | `{ ask: 'listen' \| 'read', npc, zh, en, label, q, options, answer }` | Picks an answer. `listen` hides the text until answered |
| Build | `{ build: true, npc, label, q, answer, extra, accept?, optional? }` | Builds the answer from tiles |
| Sign | `sign: true` on a question | The text is drawn as a sign |
| Miss branch | `flag`, `onMiss: [steps]` on a question | A miss sets a story flag and plays extra steps |

**Proposed for the conversation rules (CONCEPT §6.11).** These are additions, so existing scenes keep working while they're rewritten:

| Step or field | Shape | Rule it serves |
| --- | --- | --- |
| Reply choice | `{ choose: true, npc, label, situation, replies: [{ zh, react: [steps], warm?: 'chen' }, { zh, nonsense: true }] }` | §6.11.1. The player picks a reply, then builds it. A `nonsense` reply plays the speaker's confusion line and asks again. `warm` records a friendship moment |
| Situation, not sentence | `situation` replaces `q` on builds and choices | §6.11.1. The checker fails a build whose prompt starts "Say:" or quotes the English answer |
| Audio first | `listenFirst: true` on a line (default on for questions) | §6.11.2. Text appears after the answer or two replays |
| Act to answer | `{ ask: 'act', npc, zh, targets: [placeId...], answer }` | §6.11.2. The player clicks a place or path in the scene instead of a tile |
| Repair | No field. On any miss, the runner offers the repair tiles, the speaker repeats the line (slower for 慢一点儿), and the question is asked again | §6.11.3 |
| Recast | `close.js` result "close" → the speaker says the model answer back in a line | §6.11.4 |
| Confusion lines | In `cast.js`: `confused: ['啊？什么？', ...]`, `habit: '我跟你说……'` | §6.11.1 and §6.11.5 |

### 3.3 Other content files

| File | What it holds | Status |
| --- | --- | --- |
| `content/cast.js` | Each character: name, look, voice gender, portrait, habit, confusion lines, likes and dislikes (CONCEPT §6.4) | Built (habits proposed) |
| `content/<district>-places.js` | The places on a district board and which beat each one opens | Built for Baotu |
| `content/lexicon.json` | Taught words, names, particles, the fixed expression (same as `game-docs/tools/jinan-lexicon.json`) | Built |
| `content/tuning.json` | Every number in CONCEPT §6 (hearts, tiers, quiz length, speech rates) | Planned |
| `content/<district>-words.json` | Which part teaches which word (generated) | Built for Baotu |
| `content/gate-<district>.js` | Gate quiz pool, if a district needs hand-written items | Proposed (default: generated from the district's words) |

### 3.4 Content checks

`npm run check` runs before every commit and in `npm test`. It fails the build if:

- any player-visible Chinese uses a word above HSK 1 that isn't a name, particle, the fixed expression, or a taught word of this district or earlier (built);
- a session teaches more than 8 new words, or a unit's parts don't add up to its word list (built);
- a new word isn't the answer to at least one prompt in its session (built);
- a character isn't in the subset font (built);
- **proposed:** a line is shown and then asked about straight away, a build prompt gives the English sentence, or a reply choice has no wrong option (CONCEPT §6.10).

Two copies of the checker exist: `game-docs/tools/check-zh.js` for the design docs and `tools/lib/zhcheck.js` for the game's data. They share the same segmentation and lexicon. **Proposed:** the build's copy is the source of truth for game content, and the docs' copy for docs only.

---

## 4. Saving

- **Built:** one JSON save object (`save/schema.js`, version 1) behind a storage adapter. The adapter uses `localStorage`, falls back to memory in private windows, and can be swapped for files or a server later. Saving is automatic. Export, import and reset are in Settings.
- **The save holds:** SRS records per word, seen words, context sentences per word (for gap cards in Refresh), story progress, stats (clean conversations, typed answers, hints), settings.
- **Proposed, version 2:** `progress` is Baotu-shaped now (beat index, one notebook page). Before District 2, move it to `progress.districts[id] = { beat, part, step, flags, notebookClear, gateCleared }` plus `progress.current`, with a migration from version 1. Friendship moments and gift shelf go in `people[id] = { moments, stage, gifts }`.
- **Size:** about 600 words × a small record is well under `localStorage`'s limit. IndexedDB isn't needed for Jinan; the adapter makes it a later swap if recordings are ever stored.
- **Rule:** every shape change bumps `SAVE_VERSION` and adds a migration with a unit test. A player's save is never thrown away.

---

## 5. Audio

- **Built:** `audio/index.js` is the only thing the game calls. Behind it, `webspeech.js` uses the browser's Mandarin (zh-CN) voices only, Tingting first on a Mac, with a female voice for the women in the cast. The first line waits up to a second for the voice list.
- **Known limit:** many Windows and Linux browsers have one Mandarin voice or none, and quality varies. Per-character voices only really work on Macs and in Chrome with Google's voice.
- **Proposed, recorded audio:** a manifest `audio/manifest.json` maps a line's text (hashed) to a file. `say()` plays the file if it exists, and falls back to Web Speech. Recording can then happen line by line, starting with Baotu, with no code changes. Details of recording are in `ART-AND-AUDIO.md`.
- **Silent mode:** listening steps become reading steps; nothing is spoken (built).

---

## 6. Reused from 天天

| 天天 part | In the game | How |
| --- | --- | --- |
| `words.js`, `topics.js`, `strokes.js` | HSK lists, topic tags, stroke data | Copied to `src/vendor/` (built) |
| SRS (`learnWord`, `grade`, `mastery`) | `core/srs.js` | Rules copied, rewritten to use the save object and clock (built) |
| `hz.js` hover/click, ⌘K dictionary | `hz/hz.js`, `ui/dictionary.js` | Rewritten as a module (built) |
| Drills, intro card, confirm box | `session/learn.js`, `drills.js` | Rebuilt in the new UI (built) |
| hanzi-writer, pinyin-pro | Tracing, pinyin | Copied with licences (built) |
| Stroke leniency (1.8 / 1.0) | Settings | Built |
| `talk.js` (patterns, corrections, homophones) | Typed answers only | Proposed: copy when typing is switched on, keep its tests |
| Stories flow and context cards | Notebook page reading, gap cards in Refresh | Notebook built; gap cards planned |
| Badges, ranks, streak, weekly goals | Stamps, the cat's collar, tea cups, neighborhood requests | Planned, after Baotu |
| Ollama local AI | Optional slot, off by default | Proposed: an `ai/` interface with no default backend. Nothing in the game may need it |

---

## 7. Testing and quality

| Check | Tool | When |
| --- | --- | --- |
| Content rules (§3.4) | `npm run check` | Every commit (fails the build) |
| Rules and data (SRS, save migrations, close-enough, notebook, voices) | Vitest, `npm test` | Every commit |
| A full play-through with auto-answer | Playwright, `npm run e2e` (`?dev`) | Before each checkpoint |
| Chinese in the design docs | `game-docs/tools/check-zh.js` | After editing a doc |
| Word coverage | `game-docs/tools/coverage.js` | After a district's words change |
| Browsers | Chromium in tests; Safari and Firefox by hand before a public build | Before publishing |

---

## 8. Technical choices (decided)

Moondog, Oct 9 ("1a 2a 4a 4a 5a"; the second 4a is read as 3A).

| # | Choice | Decision |
| --- | --- | --- |
| 1 | Phaser | **Keep it.** It already works, and it leaves room for small animations (water, idle people, the cat) |
| 2 | Hosting | **GitHub Pages** from the repo, with a test URL per checkpoint. itch.io can come later for the first public release |
| 3 | Desktop wrapper | **Decide after Jinan.** Electron (same Chromium as the tests) and Tauri (small, but Safari's engine) stay the options |
| 4 | Typed answers | **Copy 天天's `talk.js`** when the first typed prompt is built, behind the typing setting |
| 5 | Save shape | **Move to save version 2** (§4) before District 2 starts |
