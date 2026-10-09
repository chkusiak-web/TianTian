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
