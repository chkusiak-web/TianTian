# Art and Audio · The 73rd Spring (working title)

Version 0.1 · Oct 9, 2026

**What this is.** How the game looks and sounds, the specs every asset has to meet, and how a finished file replaces a placeholder. The visual style itself was decided in other threads. This file collects those decisions in one place and doesn't reopen them:

- `visual-language/VISUAL-LANGUAGE.md`: the world's look, palette, map rules.
- `reviews/ui-target.md`: the approved UI (cream cards, teal and gold, one Chinese font).
- `build-shots/portraits/`: the code-drawn portraits (`portraits.js`) and the Baotu cast sheet.
- `assets/manual-asset-list.md`: every asset still to make, with what's a placeholder today.

<!-- zh:off -->

---

## 1. Art direction in short

| Area | Decision | Source |
| --- | --- | --- |
| World | Flat, sunny pixel art from a sprite kit: front-view buildings, two tones per shape, no outlines, 90° and 45° lines only | VISUAL-LANGUAGE decisions 9, 14 |
| Map | A scene map: the city map, then a district board with clickable pins, then close-up scenes. No walking | VISUAL-LANGUAGE 5; CONCEPT §3.2 |
| Base size | Board 480×270 at ×1. Close-up scenes are 160×90 windows shown at ×3 (or ×2) | Build decision 35 |
| People in scenes | Code-drawn figures at three sizes: 4×8 (board), 8×12 (×2), 14×22 (×3 close-up). No green clothes | Build decision 37; Moondog, Oct 9 |
| Portraits | **Code-drawn 32-bit pixel art**, 64×64, shown in a 192 px rounded frame. Four expressions: neutral, happy, worried, confused. A pastel backdrop per character; no green clothes. All 7 Baotu speakers are done | Moondog, Oct 9 (Hand-made asset list thread) |
| UI | Cream cards `#FFFBF0`, ink `#24302B`, teal `#1F8E89` for actions, gold `#E8B04A` for current and new, red `#D9573A` for attention | ui-target.md |
| Chinese font | **Noto Sans SC** everywhere (400, 500, 700), subset to the game's characters. No Kaiti, serif or pixel Chinese | ui-target.md; build decision 40 |
| UI font | Nunito Sans (Latin only) | ui-target.md |
| Notebook | A book over a darkened scene; unread words are rough ink blots; "new" tags on fresh lines | ui-target.md |
| Motion | Static first, built in layers so water, boats, people and the cat can animate later | VISUAL-LANGUAGE 13 |
| Brand | New name and logo, not chosen yet. Nothing from 天天's brand (name, seal, palette, sayings) | CONCEPT §0 |

⚑ **Corrections:** CONCEPT §9 named a Kaiti-style font; the approved UI target replaces it with Noto Sans SC, and CONCEPT §9 is updated. The UI target's painted portraits were in turn replaced by code-drawn pixel portraits (Moondog, Oct 9).

---

## 2. Asset specs

| Asset | Size | Format | Notes |
| --- | --- | --- | --- |
| District board | 480×270 | PNG, no anti-aliasing | One per district. Pins are HTML, not part of the art |
| Close-up scene | 160×90 | PNG | Shown at ×3. Leave the bottom third calm: the dialogue box covers it |
| Board figure | 4×8 | PNG or code | Standing where you'll meet them |
| Mid figure | 8×12 | PNG or code | Groups (tai chi) |
| Close-up figure | 14×22 | PNG or code | Eyes and one trait each (Wang's thermos, Zhang's beard) |
| Idle animation | 2–4 frames, same sizes | PNG strip | Optional; the code can bob a figure instead |
| Portrait | 64×64, 4 expressions | Code (`portraits.js`), drawn at ×3 | Hard-edged shapes, 4-tone ramps lit from the upper left, warm outline. A new character is a new entry in the code, not a file |
| Reading card art | Up to 320×180 | PNG | Ledger, menu, photo, label. **The Chinese on it is HTML on top**, so it stays hoverable and passes the checker |
| Icons | 24×24 and 48×48 | SVG preferred | Listen, settings, gifts, stamps |
| City map | 960×540 | PNG | The overview v0.4 style; districts as seals, grey when locked |

**Text in art.** Players must be able to hover any Chinese. So signs, menus and labels are drawn blank, and the text sits on top as HTML (build decision 12). The only exception is decoration nobody needs to read, like a distant shop sign.

### 2.1 How a file replaces a placeholder

- Everything is listed in `public/assets/manifest.json`. `"src": null` means "use the code-drawn placeholder". Drop a PNG in the folder, set `src` to its name, and it's used with no code changes.
- ⚑ **The manifest still describes walking sprite sheets** (64×96, four directions). It has to be rewritten for the three scene-map sizes and portraits before any hand-drawn people can drop in. That's a build task.
- **File names:** `<district>-board.png`, `<district>-<place>.png`, `card-<id>.png`, using the ids in `content/cast.js` and `content/<district>-places.js`.

---

## 3. What to make, in order

The full list is in `assets/manual-asset-list.md`. The order there still holds:

1. ~~Baotu portraits~~ Done: all 7 Baotu speakers are code-drawn and being wired in.
2. The ticket window scene and the ledger card.
3. Close-up backgrounds for the other four Baotu places.
4. The park signs, the thermos and the 七十三 photo.
5. Furong (portraits for Sun, Mr. Ma and the cook in the same code), then the courtyard home screen and the systems art (the cat, stamps, gifts, tea cups).

---

## 4. Audio

### 4.1 Voices

The game speaks a lot of Chinese, so voice quality is part of the teaching.

- **Now (built):** the browser's own Mandarin voice through Web Speech. It works on a Mac (Tingting) and in Chrome with Google's voice. Many Windows and Linux browsers have one Mandarin voice or none, so per-character voices mostly don't work there.
- **The plan (FRAMEWORK §5):** every line can have a recorded file. If a file exists it plays; if not, the browser voice speaks. Files can be added one line at a time.

**How many lines.** Baotu as built has about 40 spoken lines plus notebook sentences. Jinan will be about 500–700 spoken lines, about 60 notebook sentences, and 538 single words for the Learn cards.

| | Lines | Voices |
| --- | --- | --- |
| Baotu | ~50 | Pan, Zhang, Wang, Lin, Chen, Xie, the kid, Lele |
| Jinan | ~600 + 538 words | About 14 characters, plus one neutral voice for words and the notebook |

**Recording spec** (for human or generated files alike):

- Master: 48 kHz, 24-bit, mono WAV. Kept outside the game repo.
- In the game: mono Opus at 48 kbps (`.ogg`; Safari 17+ plays it), with an MP3 fallback only if a target browser needs one. About 5 KB per second, so Jinan's voice files come to about 15–20 MB.
- Natural speed, standard Mandarin, no regional accent. Slow speech is the game slowing the file down, not a separate recording.
- One file per line. Named by a hash of the line's text and speaker, so a changed line never plays the wrong audio.
- Silence trimmed to 100 ms at both ends; loudness normalised to −16 LUFS.

### 4.2 Sound and music

- **Sounds:** right and wrong (with ✓ and ✗, never sound alone), a soft tile click, page turn, notebook line coming into focus, a district opening. Short, quiet and warm.
- **Ambience per place:** spring water, birds, a street, the station. One loop per place, low volume.
- **Music:** none in the Baotu slice. Later, one calm theme per city. Music never plays under a listening question.
- **Volume settings:** separate sliders for voices, sounds, ambience and music. Silent mode mutes all of them (CONCEPT §9).
- **Sources:** only CC0 or properly licensed files, recorded in `LICENSING.md` with their source.

---

## 5. Decisions

**1. Voices.**
 A ★ Generate the voice files with a neural text-to-speech service (one voice per character), checked by ear by a native speaker. The same voices on every computer, cheap, and quick to redo when a line changes. Human recordings can replace the main cast later.
 B Record native speakers from the start. Best quality, but every rewrite means a new session.
 C Stay on browser voices for now. Free, but inconsistent off a Mac.

**2. Background scenes.**
 A ★ Draw each close-up from the district mockup in the same kit style, so board and scenes match.
 B Keep the zoomed-in board crops until Furong is done.
