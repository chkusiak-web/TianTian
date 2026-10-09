# Decisions (gaps in the spec, simplest option chosen)

1. Beats: 8 rows of §5.1 mapped onto the 6 beats of §2.2 (see PLAN.md).
2. Movement: walk (VISUAL-LANGUAGE) over scene map (CONCEPT §3.2), per the user's choice.
3. Map: one screen, 30×17 tiles.
4. Language: plain JavaScript, ES modules.
5. Font: system CJK stack at 20 px or more (no web font), so nothing of 天天's look is carried over.
6. Missing from the kit (HSK1-COVERAGE.md, FRAMEWORK.md, tuning.json, etc.): replaced by our own `assign-words.js` and `content/tuning.json`.
7. Status badge stays Tourist in this slice (Newcomer needs 100 caught, Baotu has about 53); the dev panel can raise the numbers.
8. SRS time goes through an injectable clock so the dev panel can fast-forward days.
9. Project sits at the repo root; the kit folders stay beside it, untouched.
10. Palette: VISUAL-LANGUAGE says 24 colours but lists 20. Added skin light/dark, lotus pink and cloth blue (`src/world/palette.js`).
11. Phaser runs with the Canvas renderer, not WebGL: 480×270 pixel art doesn't need WebGL, and WebGL left stale patches under the HTML overlays in testing.
12. In-world sign text is HTML placed over the map (crisp, and hover/click works on it like all other Chinese) until a 12 px pixel CJK font is chosen.
13. Taught words, names and particles get ids like `x:泉` so they share the save maps with HSK word ids.
14. Dev panel key: the backtick (`). Ctrl/⌘+K opens the dictionary, as in 天天.
15. Dev panel only loads with `?dev` in the address (user feedback: not wanted in normal play). The Playwright run uses `/?dev`.
16. Saving is automatic and invisible. Export / import / reset live in Settings, not on the main screen.
17. Hover tip stays up while the mouse crosses punctuation or gaps inside one line; a locked word says "Pinyin unlocks after you answer" instead of showing nothing.
