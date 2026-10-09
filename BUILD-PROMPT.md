# Prompt for Claude Code: build a playable test run

**How to use this**

1. Unzip `game-build-kit.zip` into a new, empty folder on your Mac (for example `~/Desktop/game-test-run/`).
2. Open Claude Code in that folder.
3. Check the two **Choices** below (change a letter if you want), then paste everything below the line.

---

## Choices (edit before pasting)

- **Movement:** **A**
  - A) Walk around a small pixel Baotu park with the arrow keys / WASD (matches the visual language doc, the newer decision)
  - B) Click places on a district board to open still pixel scenes, no walking (matches CONCEPT.md v0.3)
- **Scope:** **A**
  - A) The Baotu arc end to end: opening, 6 beats, Lele's challenge, notebook page 1, gate quiz
  - B) Baotu and Furong
  - C) Just the Hook beat and one conversation, to test feel first

## Who I am and how I like to work

- I'm learning Mandarin: Simplified characters, HSK 3.0, standard Mandarin only. I'm on an Apple M2 MacBook Air, 16 GB.
- Keep answers short and clear, with bullets. Don't flatter me, and don't criticize just for the sake of it.
- When you need a decision, ask **multiple-choice questions** (A/B/C) with your recommendation marked.
- Nothing gets built until I say **GREENLIGHT**.

## What this is

A **test run** of a new language-learning game: one playable district, so I can feel whether the loop works before we build more. It runs locally in the browser. It doesn't need to be pretty or complete; it needs to be playable from start to finish and honest about how the learning feels.

## The folder

- `tiantian-kit/tiantian-reference/`: my old app 天天 (Electron, v3.4.0). **Read-only.** Never edit, move, reformat or run build scripts inside it (`build/check_stories.js` writes into it). You may **copy** code and data out of it.
- `tiantian-kit/game-docs/CONCEPT.md`: the game design doc, v0.3. **This is the spec.**
- `tiantian-kit/game-docs/tools/`: `check-zh.js` (checks player Chinese against HSK levels), `jinan-lexicon.json` (names, particles, taught words), `lib/hsk.js`. Reuse these.
- `tiantian-kit/game-docs/drafts/`: parked drafts for districts 3–10. Not the spec; ignore for this build.
- `tiantian-kit/CONCEPT-73rd-Spring.md`: the original concept. CONCEPT.md replaces it where they differ.
- `tiantian-kit/PROMPT.md`: an earlier prompt for writing the docs. Background only.
- `visual-language/VISUAL-LANGUAGE.md` and its map images: art direction (camera, tile size, palette, UI).
- `tiantian-trial/`: an earlier throwaway browser trial and mockups, plus `decisions.md`. Look for ideas only.

Treat the docs as the source of truth. Don't edit them; put your own notes in `build-notes/`.

## Fixed decisions

- **New game, new name.** The English name isn't chosen yet. Use the placeholder title "Working Title" in the UI and `working-title` in code. Don't use 天天's name, seal, palette, fonts or sayings.
- **Web-first:** runs in a desktop browser (Chrome and Safari on Mac), 16:9, keyboard and mouse. No touch.
- **Phaser 3** for the pixel world, **plain HTML/CSS overlays** for dialogue, drills, the notebook and menus. Vite as the dev server and bundler. Plain JavaScript or TypeScript, your call.
- **No AI.** Everything is scripted. Don't include Ollama or any API.
- **Voices:** browser speech (Web Speech API, zh-CN), behind a small audio interface so recorded files can replace it later. Grandma Wang needs a female voice when one exists.
- **Saves:** localStorage behind a storage adapter, with a versioned save schema, plus export/import of a save file and a "reset" button.
- **Chinese display:** characters only. Hover shows pinyin, click shows English, locked during questions until answered (as 天天's `HZ_LOCK`).
- **Answer input:** word tiles by default. Typing is optional (CONCEPT §6.9).
- **Content rule:** every Chinese string a player sees in Jinan uses HSK 1 words, names, the allowed particles, and the taught words of this district or earlier ones. Check it with the script, never by eye.

## What the test run includes (Scope A, Baotu)

Follow CONCEPT.md §2.1, §4, §5.0, §5.1 and §6. In short:

1. **Opening** (short): Old Pan's taxi ride with 是 / 不是 answers, Teacher Zhang hands over the key and the notebook. Can be a few static screens.
2. **Courtyard home screen:** the notebook, the phone (词典), and a "Today" card that points to the next step.
3. **Baotu district:** movement per the Choices above. Grandma Wang, Teacher Zhang, Ms. Chen, Xiao Xie, Lele and the park signs placed where §5.1 puts them. The place or person for the current beat is marked.
4. **The session loop** for each beat: Refresh (due words) → Learn (5–8 new words: intro card with Listen, Strokes; then quick drills) → Use (the scene's conversation, reading or listening, where each new word is the answer to at least one prompt) → Notebook (lines that just cleared).
5. **All six beats of §5.1**, with the key lines as written. Fill in the rest of each scene in the same style and check it. Include the 四 / 十 tone mistake that costs a heart.
6. **Lele's riddle duel** (§6.1): 5 hearts, the four prompt kinds, the confirm box, missed items coming back, 3-in-a-row restores a heart, retreat at zero, retry at once.
7. **Notebook page 1** that clears word by word (§4.4), then the 2 comprehension questions.
8. **Gate quiz 1** (§6.7): 10 questions, misses go back into the stack until right; clearing it shows "District 2 opens" (Furong itself is out of scope).
9. **Word collection** (§6.5): seen / caught / mastered / lapsed, for this district's words.
10. **Spaced review:** copy 天天's SRS (`learnWord`, `grade`, `mastery` in `app/app.js`) and its context cards.
11. **Local status badge** (§6.2): calculated live; it only needs to show the tier and the three numbers.
12. **Settings:** silent mode, speech speed, stroke leniency, typing on/off, reset save.
13. **Dev panel** (toggle with a key): jump to any beat, mark words caught/due, fast-forward review days, show the current save. I'll use this to test.

**Out of scope:** Furong and later districts, the city map (a placeholder screen with Baotu open and the rest grey is fine), gifts and friendship stages, odd jobs, red packets, XP ranks, the cat, stamps, streaks, deployment, the desktop wrapper.

If I picked **Scope B**, add Furong (§5.2) the same way. If I picked **Scope C**, build only the Hook beat, one conversation, the tiles, hover and saving.

## Copy from 天天 (into the new project, never edit in place)

- `app/data/words.js` (HSK list) and `app/data/strokes.js` + `app/lib/hanzi-writer.min.js` (stroke drawing). Keep their licence files next to them.
- `app/lib/pinyin-pro.js` (pinyin for hover). Keep its licence.
- `app/hz.js` (hover pinyin, click English, the dictionary): turn it into a module.
- `app/talk.js` (offline conversation matcher; exports `TALK` for Node): use it for optional typed answers.
- `app/data/scripts/baotu.js` and `app/data/jinan.js`: the old Baotu quests and the cast. Rewrite lines to fit §5.1 and the HSK 1 rule.
- `app/app.js`: the SRS functions, the drill types and the confirm-box flow. Extract what you need into small modules.
- Portraits in `app/img/people/` can be placeholders for wang and zhang.

## Art for the test run

- Placeholder pixel art you generate yourself (code-drawn tiles and sprites) that follows `VISUAL-LANGUAGE.md`: 480×270 native, scaled ×4 with nearest-neighbor, 16×16 tiles, 16×24 characters, ¾ view, light from the upper left, the 24-color palette.
- Keep every asset in one folder with a manifest, so real art can be swapped in later without code changes.
- Chinese in overlays: a clean font at 20 px or more. In-world signs can be text drawn on top of the map for now.

## Content and checks

- Keep all game text in data files (one per district: beats, scenes, lines, prompts, tiles, notebook page, gate quiz), not in code.
- Write a validator that runs `tiantian-kit/game-docs/tools/check-zh.js`-style checks on every player string in the data files, using `jinan-lexicon.json`, and fails the build on a miss.
- Also check CONCEPT §6.10 where it's cheap: each beat's new words appear in its scene and are the answer to at least one prompt.
- Assign Baotu's ~50 HSK 1 words to its beats with a script and show me the list before writing scenes. Start from the words §5.1 already names.

## Testing

- Unit tests (Vitest) for: SRS, word states, local status tiers, challenge hearts and retries, gate-quiz stack, save migrations, the content validator.
- One Playwright run that plays the whole slice from a fresh save to "District 2 opens" using the dev panel's test answers. Playwright needs to download a browser the first time; ask me before it does.
- `npm run dev` starts it; `npm test` runs everything; `npm run check` runs the content validator.

## How to work

1. **Read first:** CONCEPT.md (all of it), VISUAL-LANGUAGE.md, then the 天天 files listed above. Give me a short bullet summary, and list anything where the docs disagree with each other or with the 天天 source.
2. **Ask me up to 5 multiple-choice questions** on what matters most, with your recommendation. Wait for my answers.
3. **Write a short build plan** in `build-notes/PLAN.md`: folder structure, modules, the order you'll build in, and what each checkpoint lets me play. Wait for **GREENLIGHT**.
4. **Build in checkpoints.** After each one, run the tests and the content check, tell me in 3–5 bullets what I can now try, and how to open it. Let me redirect before moving on. Suggested checkpoints:
   1. Empty shell: Phaser scene + overlay, hover/click Chinese, save/load, dev panel
   2. Baotu map you can move around (or click), with the cast placed
   3. One full beat: Refresh → Learn → Use → Notebook
   4. All beats and Lele's challenge
   5. Notebook page 1, gate quiz, word collection, status badge, settings
   6. Playwright run of the whole slice, then a playtest checklist for me
5. **Never edit `tiantian-reference/` or the docs.** If the spec has a gap, pick the simplest option that fits CONCEPT.md, note it in `build-notes/DECISIONS.md`, and keep going. Ask only when the choice changes what I'd notice as a player.
6. **Use git** in the project folder from the start, with a commit per checkpoint.
