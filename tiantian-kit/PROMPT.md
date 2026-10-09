# Prompt for Claude Code: 天天 game, concept doc + framework

Paste everything below the line into Claude Code, opened in this folder (the one that holds this file, `CONCEPT-73rd-Spring.md` and `tiantian-reference/`).

---

## Who I am and how I like to work

- I'm learning Mandarin: Simplified characters, HSK 3.0, standard Mandarin only (no dialect). I'm on an Apple M2 Mac with 16 GB.
- Keep answers short and clear, and use bullets. Don't flatter me, and don't criticize just for the sake of it.
- When you need a decision from me, ask **multiple-choice questions** (A/B/C), with your recommendation marked.
- **Don't write game code.** This job is documents and a technical framework only. Nothing gets built until I say **GREENLIGHT**.

## The situation

I have a working Mac app called **天天 (Tiantian)**, version 3.4.0, built with Electron. Its full source is in `tiantian-reference/`.

- **`tiantian-reference/` is read-only.** Never modify, move or reformat anything in it. 天天 is frozen while we explore.
- We're designing a **separate new game** based on 天天. The game can borrow 天天's code and content, but by copying it, never by editing 天天.
- The existing concept is in `CONCEPT-73rd-Spring.md`. Treat it as the agreed direction. Build on it rather than replacing it. Flag anything you think doesn't work, as a question.

### What 天天 does today (verify all of this in the source)

- **学 Learn:** HSK levels of new words, with stroke writing (hanzi-writer, leniency setting). Drill types: choice, typing, listen, tone, hear→character, read. Wrong answers show a confirm box, and missed items repeat until right.
- **复 Review:** spaced repetition (`S.words[id] = {reps, ease, ivl, due, lapses}`), plus fill-in-the-blank cards made from story sentences (`S.ctx`).
- **Home:** a ~15-minute daily plan (`plan.js`: review → level or quiz → story or quest on alternate days, tones drill as fallback). Weekly goals, a streak with tea cups, animal ranks, XP and badges.
- **故 Stories:** 30 graded stories (HSK1 ×12, HSK2 ×10, HSK3 ×8) starring the Jinan cast. The flow is read → Chinese comprehension questions → context gaps. Chunks are underlined. `build/check_stories.js` checks every word against the HSK list.
- **城 Jinan:** 10 districts with 50 quests. Conversations are scripted in `data/jinan-scripts.js` and `data/scripts/*.js` and run by the offline engine `talk.js` (patterns, slots, grammar-correction rules, homophone matching). A local AI (`ai.js`, Ollama qwen3.5:9b) improvises only when the script doesn't understand.
- **人 People:** the 10 characters in `data/jinan.js`: wang 王奶奶, zhang 张老师, lu 吕老师, su 小苏, xie 小谢, sun 孙师傅, lin 林姐, pan 老潘, chen 陈女士, bai 白大夫. Portrait art exists for wang, zhang and lu (`app/img/people/`).
- **Everywhere:** hover any Chinese word for pinyin, click it for English, and open the dictionary with ⌘K (`hz.js`). Silent mode swaps listening drills for reading versions.
- **Word data:** `data/words.js` has HSK 1–4 (508 / 750 / 953 / 972 words). Its licence is in `data/HSK-VOCAB-LICENSE.txt`. Stroke data is in `data/strokes.js`, licensed under `data/ARPHIC-LICENSE.txt`.
- **Authoring guides:** `build/AUTHORING.md` and `build/STORIES.md`.

### Decisions already made

- **Separate project.** 天天 stays untouched.
- **Web-first.** It must run in any modern browser and be publishable for free (itch.io, GitHub Pages or Netlify). A Mac desktop version comes later as a thin wrapper (Electron or Tauri) around the same build.
- **Engine:** Phaser 3 for the pixel world. Plain HTML/CSS overlays are fine for menus, dialogue and drills if you recommend them.
- **Must work fully without AI.** Ollama isn't available in a browser for other players, so the scripted conversations carry the game. Design an *optional* AI slot for later (an in-browser WebGPU model or a paid API), but nothing may depend on it.
- **Voices:** browser speech (Web Speech API) by default. Design so recorded audio files can replace it later, with a voice set per character (Grandma Wang must have a female voice).
- **Saves:** browser storage (IndexedDB or localStorage) with export/import of a save file. Use a storage adapter, so the desktop version can save to a file instead.
- **Cities:** Jinan is HSK 1 (all 10 districts teach HSK 1 words), Chengdu HSK 2, Shanghai HSK 3, Beijing HSK 4. The next city stays locked until the current one is finished. Each city has its own cast of 10, with cameos from earlier cities.
- **Systems from the concept doc:**
  - 面子 face hearts per encounter
  - 本地 local status tiers that can drop after weeks away
  - XP kept separate from 钱 yuan
  - Gifts, tools, tea and red packets
  - Drills framed as story actions but labelled
  - Five-beat district arcs of about a week each
  - The great-uncle's notebook as the progress bar

## What I want from you

Produce a folder `game-docs/` with these files.

1. **`CONCEPT.md`: the full game design doc.** Expand the existing concept into something detailed enough to build from:
   - Pillars and the target player. The core loop at three scales: one session (~15 min, minute by minute), one arc (~a week), one city.
   - The Jinan story in full: all 10 district arcs, each with the five beats, scenes, characters involved, clues, notebook page text (HSK 1 only), and the drills under each beat.
   - Systems, each with clear rules and numbers:
     - Encounters (face-battle turn structure, "moves", opponent types, rewards)
     - Local status (what raises it, what lowers it, decay timing)
     - Economy (earn rates, prices, the item list)
     - Gifts and friendship (likes and dislikes per character)
     - The word collection (词典 "Pokédex": seen / caught / mastered)
   - How every current 天天 feature maps into the game: levels, review, stories, quests, dictionary, silent mode, streaks, ranks and badges.
   - Outlines for Chengdu, Shanghai and Beijing: mystery premise, cast of 10, and how earlier words come back.
   - Accessibility and settings: silent mode, stroke leniency, pinyin hints that never skip producing the Chinese.

2. **`HSK1-COVERAGE.md`: a word plan.** Run a script over `tiantian-reference/app/data/words.js` to assign **every HSK 1 word** a home district. For each word, give where you first meet it (person, place or object) and where you use it again. Include per-district counts. Write the script into `game-docs/tools/`, not into 天天.

3. **`FRAMEWORK.md`: the technical architecture.**
   - Folder structure and module boundaries.
   - What to copy from 天天 and how to turn each piece into a plain, framework-free module: `talk.js`, the quest scripts, stories plus checker, words, SRS, pinyin-pro, hanzi-writer, the hover/dictionary layer. List each file and what changes.
   - Phaser scene list, and how the overlays talk to it.
   - Game state and the save schema (versioned, with migrations). The storage adapter interface.
   - Content formats: arcs, scenes, clues, encounters, items, characters, notebook pages. Give a JSON/JS schema for each, with an example from the Baotu arc.
   - The content pipeline and validators: extend the HSK level checker so every line of game text is checked against its city's HSK level.
   - The audio interface (TTS now, recorded files later, per-character voice).
   - The optional AI interface.
   - Build and hosting: bundler choice, a static build, itch.io/GitHub Pages deploy, and the later desktop wrapper.
   - Performance targets, browser support, testing (unit tests for the engine and validators, Playwright for flows).

4. **`ART-AND-AUDIO.md`:**
   - Pixel art spec: tile size, resolution, palette, sprite sheet layout, animation list.
   - How the existing illustrated portraits fit beside pixel sprites.
   - A complete asset list for the first playable slice.
   - Options for making the art (myself with AI tools, commissioned, or asset packs), with rough costs.

5. **`LICENSING.md`:** what may be published and how to credit it (HSK list, pinyin-pro, hanzi-writer and its Arphic data, fonts in `app/fonts`, Phaser, art). Flag anything risky.

6. **`ROADMAP.md`:**
   - Milestones from an empty repo to a published browser build.
   - The first milestone is a **vertical slice**: Baotu Spring, Grandma Wang's thermos arc, walking around, one scripted conversation, face hearts, saving, deployed to a test URL.
   - For each milestone: scope, what "done" means, and its risks.

7. **`OPEN-QUESTIONS.md`:** every decision still open, each written as a multiple-choice question with your recommendation.

## How to work

1. **Read first.** Go through `CONCEPT-73rd-Spring.md`, then the 天天 source (start with `app/index.html`, `app/app.js`, `app/talk.js`, `app/jinan.js`, `app/stories.js`, `app/plan.js`, `app/hz.js`, `app/data/jinan.js`, `build/AUTHORING.md`, `build/STORIES.md`). Then give me a short bullet summary of what you found, especially anything that doesn't match the description above.
2. **Ask questions.** Ask me up to 6 multiple-choice questions on what matters most before writing. Wait for my answers.
3. **Write in order:** CONCEPT → HSK1-COVERAGE → FRAMEWORK → ART-AND-AUDIO → LICENSING → ROADMAP → OPEN-QUESTIONS. After each file, give me a 3–5 bullet summary and let me redirect before moving on.
4. **Chinese rules:** all Chinese in the docs is Simplified and natural standard Mandarin. Anything the player sees in Jinan uses HSK 1 words only, plus character and place names. Check this with the script, don't eyeball it.
5. **No game code, and no changes to `tiantian-reference/`.** Small analysis scripts in `game-docs/tools/` are fine.
