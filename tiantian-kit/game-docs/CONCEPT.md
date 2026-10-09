# The 73rd Spring (working title) · Game Design Document

Version 0.3 · Oct 9, 2026 · builds on `CONCEPT-73rd-Spring.md` (Oct 8)

**Round 4** added the conversation rules (§6.11).

**What changed in 0.3** (round 3): word tiles are the default and typing is optional; gate-quiz misses repeat until right instead of failing you; the Prove step is folded into the scene; only Baotu and Furong are designed in full; yuan is cut.

**This is a language-learning game first.** The story, the city and the neighbors exist to give the Chinese a reason and a context. Where the concept had to change to fit that, or to fit HSK 1, the change is flagged with **⚑** and repeated in `OPEN-QUESTIONS.md`.

**How the Chinese is checked.** Every string a player will see is written in 「corner brackets」. `tools/check-zh.js` checks each one against the HSK list in `tiantian-reference/app/data/words.js`:

- Jinan text may use HSK 1 words, names, a few particles (啊, 哦, 嗯, 哎, 呀, 哈哈, 喂), one fixed expression (生日快乐), and the taught words of the current or an earlier district (see §5.0).
- Run it with `node tools/check-zh.js CONCEPT.md drafts/jinan-arcs-3-10.md`. The result of the last run is at the end of this file.
- Chinese that is *not* in corner brackets is a label for us, the designers, and isn't shown to players as written.

---

## 0. Decisions this document is built on

| Topic | Decision | Source |
| --- | --- | --- |
| What it is | A language-learning game with a story, not a map game with language elements | Moondog, Oct 9 |
| Name and brand | A new game with its own name (not chosen yet). It doesn't use 天天's brand anchors (name, seal, palette, sayings). "The 73rd Spring" is a working title. 天天 is only the code and content source | Visual language thread, Oct 9 |
| Project | Separate game; 天天 is frozen and only copied from | Brief |
| Platform | Web-first (any modern desktop browser), free hosting; Mac wrapper later | Brief |
| First public build | Desktop browsers. **Word tiles by default**: you build every answer in Chinese from tiles. Typing with a pinyin keyboard is optional and earns more | Answer 2A, then round 3 answer 1A |
| Engine | Phaser 3 for the pixel scenes; HTML/CSS overlays for dialogue, drills, menus | Brief |
| The map | A **scene map**: click a place to open a short pixel scene. No walking avatar | Round 2, answer 1A |
| What drives progress | **Words learned.** The notebook clears word by word as you learn | Round 2, answer 2A |
| Encounters | **Conversation challenges.** Hearts are the mistakes you're allowed. No items, no resolve | Round 2, answer 3A |
| Money | **None.** Yuan is cut. Gifts come from the story and odd jobs. Prices in scenes are just language | Round 3, answer 5A (replaces round 2, 4B) |
| Local status | **Calculated from real skill:** words mastered and conversations without hints | Round 2, answer 5A |
| AI | Never required. Optional slot only | Brief |
| Jinan vocabulary | HSK 1 + names + particles + at most 3 taught words per district | Answer 1A |
| Checking words | No separate "Prove" step. Using a word correctly in the scene is the check | Round 3, answer 3A |
| Design depth | Baotu and Furong are designed in full. Districts 3–10 stay outlines until the vertical slice is playtested | Round 3, answer 4A |
| Next district opens | Finish the arc, then clear the "gate quiz": 10 questions on the arc's words. A miss goes back into the stack and repeats until you get it right. You can't fail it | Answer 3A, then round 3 answer 2D |
| Where new words are taught | Inside the arc's beats. University lessons are optional extra training | Answer 4A |
| Pacing | Completely free. No energy, no daily locks | Answer 5C |
| Existing quests | Jinan quests rewritten at HSK 1 to fit the arcs. Only Jinan is written now | Answer 6A |
| Locked rooms | Open with a short review quiz (same mechanic as the gate quiz) | Mockup thread, round 3 |
| Chinese display | Characters only. Hover for pinyin, click for English | Mockup thread |

---

## 1. Pillars and target player

### 1.1 Target player

- An adult English speaker learning Mandarin from zero to HSK 4. Simplified characters, standard Mandarin, HSK 3.0 word lists.
- Studies about 15 minutes a day, often more on weekends.
- Wants the language to be *used* for something, not drilled in a vacuum, and wants to see real progress.
- Plays on a laptop or desktop. Needs no Chinese keyboard to start: answers are built from word tiles. Players who want to type can switch on a pinyin input method (we teach how).

### 1.2 Pillars

1. **The 80% rule.** At least 80% of every session is spent reading, hearing, saying or writing Chinese. Any feature that doesn't do one of those is cut, or takes under 5 seconds (a scene transition, a menu tap).
2. **Your vocabulary is the progress bar.** Old Zhou's notebook is written in Jinan's words. Its smudges clear word by word as you learn them, so the story literally becomes readable as your Chinese grows.
3. **Learn → use, every session.** New words are introduced, then used straight away in a scene that needs them. Using a word correctly in the scene is the check; there is no separate quiz. The story moves forward only through that use.
4. **Lots of understandable Chinese.** Every scene adds a short text or conversation built from words you know plus the few you just learned. Reading and listening volume is a goal in itself.
5. **Locals respond to your Chinese, not your clock.** How people talk to you depends on what you've mastered and how well you speak. Time spent alone never counts.
6. **Never stuck, never punished hard.** Losing a challenge sends you home to retry at once. A missed quiz question comes back until you get it right. Nothing permanent is lost, and nothing skips the language.

### 1.3 What it is not

- Not an open-world game. No walking avatar, no day/night mechanics, no weather mechanics, no inventory.
- Not an RPG. No stats, no items in challenges, no damage numbers.
- Not a speaking or pronunciation scorer. Recording and compare from 天天 stay, ungraded.
- Not mobile-first. Touch comes later (see `OPEN-QUESTIONS.md`).

---

## 2. Core loop at three scales

### 2.1 One session (about 15 minutes)

Pacing is free, so this is the *designed* session, the one the "Today in Jinan" card suggests. A player can stop after any step or keep going.

| Minute | Step | What happens | Practice underneath |
| --- | --- | --- | --- |
| 0:00–3:00 | **Refresh** | Due words appear as faded notes in the notebook margin. Flip, recall, mark. Some come back as a sentence with a gap. If nothing is due, skip | 天天's spaced review, context cards |
| 3:00–7:00 | **Learn** | Today's beat opens with its word set: 5–8 new words. Each gets the intro card (Listen, Record, Compare, Strokes), then quick drills (pick, hear→character, tone, build, trace) framed by the scene | New words |
| 7:00–13:00 | **Use** | The scene itself: a conversation with a neighbor, a sign or ledger to read, an announcement to listen to. It is written so it *needs* today's words: each one is the answer to at least one prompt. Words you use correctly here, without a hint, are **caught** | Conversation, reading, listening; recall |
| 13:00–15:00 | **Notebook** | Lines whose words are now all caught come into focus. You read them | Reading |

- **Time outside Chinese:** opening the game, choosing the scene, the notebook animation. Budget: under 1 minute per session.
- A beat fits one session. A player who keeps going starts the next beat's Learn step.
- Nothing in the scene is a gate: a word you miss there is caught later, the first time you get it right anywhere (and goes to review first).
- ⚑ The v0.2 "Prove" step (a 5-question check after the scene) is cut. The scene's prompts do that job, so the session has one fewer quiz.

### 2.2 One arc (about a week at 15 minutes a day)

Each district is one arc with five beats. Its ~50 HSK 1 words and 3 taught words are split into the beats' word sets.

| Session | Beat | Word set | Scene content |
| --- | --- | --- | --- |
| 1 | **Hook** | 8–10 words | Meet the neighbor with the problem. First conversation |
| 2 | **Investigate 1** | 8–10 words | Clues 1–2 |
| 3 | **Investigate 2** | 8–10 words | Clues 3–4 |
| 4 | **Investigate 3** | 6–8 words | Last clue, plus a side document to read |
| 5 | **Challenge** | 3–5 words | The conversation challenge (§6.1), mixing the whole arc's words |
| 6 | **Resolution + Payoff** | 3–5 words | The problem is solved. The neighbor talks about Old Zhou. You read the district's notebook page, now fully in focus |
| 7 | **Gate quiz** | — | 10 questions on the arc's words. Misses go back into the stack until each is right. Clearing it opens the next district |

- About 7 sessions. Faster players can do it in two evenings; the gate quiz makes every word come back until you get it right.
- Optional side content in each district: a document to read (a former 天天 story), practice reruns of conversations, one or two odd jobs that earn gifts.

### 2.3 One city (Jinan, about 10–12 weeks)

```
Opening (arrive, inherit the house, the notebook is almost all smudges)    1 session
 → 10 district arcs, opening in order                                        about 70 sessions
     → the notebook clears as words are caught; ink darkens as they're mastered
 → Finale at Mid-Autumn: read the last letter, open the well                 2 sessions
 → Chengdu's train ticket arrives
```

- **City goal:** catch every Jinan word (508 HSK 1 words, 30 taught words, 1 fixed expression) and read the whole notebook.
- **City finished** means the finale is done. That opens Chengdu.
- **The 「老济南」 Old Jinan status** is separate. It's earned by mastery (§6.2), so it can come after the finale.
- **After the city:** Jinan stays open. Its words keep coming back through review, phone calls from the cast and cameos in Chengdu.

---

## 3. World structure

### 3.1 Cities

| City | HSK | Words in 天天 data | Taught extras | Mystery | Status |
| --- | --- | --- | --- | --- | --- |
| 济南 Jinan | 1 | 508 | 30 | The 73rd spring | Districts 1–2 in full, 3–10 outlined (§5) |
| 成都 Chengdu | 2 | 750 | about 30 | The unanswered letter | Outline (§8) |
| 上海 Shanghai | 3 | 953 | about 30 | The stopped clock | Outline (§8) |
| 北京 Beijing | 4 | 972 | about 30 | The courtyard deed | Outline (§8) |

⚑ The concept quotes +772 / +973 / +1,000 (the official HSK 3.0 counts). 天天's data has 508 / 750 / 953 / 972, and that is what we check against.

### 3.2 The scene map

- **City map:** the visual-language thread's Jinan overview map (v0.4 style), with the 10 districts as seals. Open districts are in color, locked ones grey. Click one to go there. No travel time.
- **District board:** a single pixel illustration of the district with 3–5 clickable places (the ticket window, the tai chi square, Gate 4…). The place for today's beat glows. Other places hold reruns, side documents and odd jobs.
- **A scene:** one pixel background with the people in it (idle animations), opened from the board. Clicking a person opens the conversation overlay. Clicking an object (a sign, a ledger, a photo) opens a reading card. The scene *is* the drill's frame.
- **Your courtyard** is the home screen: the notebook, the phone (词典), the gift shelf (gifts you've been given and can pass on), 小七 the cat, and today's tea cup.
- **Signs and labels** in scenes are real Chinese with hover, so even the scenery is reading practice.
- No walking, no day/night or weather mechanics. Scenes may be drawn at different times of day for mood only.

### 3.3 What opens what

| What | How it opens |
| --- | --- |
| District 1, Baotu Spring | Start of the game |
| A beat's scene | Its word set has been introduced (the Learn step). No other condition |
| District N+1 | Arc N finished **and** gate quiz N cleared |
| Locked rooms (a back room, a shed, the teahouse upstairs) | A 6-question review quiz on that room's 5–8 words. Same rules as the gate quiz |
| Finale | All 10 arcs finished |
| Chengdu | Finale finished |

Nothing waits on a timer, an energy bar or a currency. There is no currency.

---

## 4. The Jinan story

### 4.1 Premise

- You arrive in Jinan to settle the estate of your great-uncle **老周 (Old Zhou)**, who lived on 曲水亭街 Qushuiting Street for 50 years.
- You inherit his courtyard house and his notebook: a lifelong search for a 73rd spring that isn't on Jinan's famous list of 72.
- The notebook is written in simple Chinese and addressed to you. On day one only one line can be read: 「七十三」.

⚑ **Name change:** the concept calls him "your great-uncle", which is 叔公 or 舅公 in Chinese. Neither is HSK 1, so the Chinese text calls him by name, 「老周」. English narration still says "great-uncle".

### 4.2 The twist and the finale

- Old Zhou always knew where the spring was: under the sealed well in his own courtyard.
- The notebook was a trail he laid so that whoever came after him would meet the neighbors, learn the language and become a local.
- The spring's name is a person: **何泉 (Hé Quán)**, his first love. Her family lived in this courtyard in the 1950s. When they moved away, the well was sealed. Old Zhou later bought the house.
- 泉 is alive, in her 90s, a patient on Dr. Bai's ward (District 10). She has the notebook's last page: a letter he left with her for "whoever comes".
- **Finale at Mid-Autumn (中秋):** the street gathers in your courtyard. Teacher Zhang and Master Sun unseal the well, the water rises, and 泉 names it.
- **Hook into Chengdu:** among 泉's letters is one from a friend at a Chengdu teahouse: 「他还在等你的回信。」 (He's still waiting for your reply.) Every word in it is known by then (信 is taught in District 6).

### 4.3 The cast in Jinan

All ten from 天天 (`app/data/jinan.js`) keep their personalities and speech styles.

| Character | Role in the mystery | Home district | Challenge type? |
| --- | --- | --- | --- |
| 王奶奶 Grandma Wang | Knew Old Zhou for 40 years; your first friend. Her lost thermos opens the game | Qushuiting (met at Baotu) | No |
| 张老师 Teacher Zhang | Your landlord-turned-neighbor, local historian. Guards the secret of the well | Baotu, Qushuiting | Elder (D7, a friendly test) |
| 吕老师 Teacher Lü | Your Chinese teacher. Runs the "old Jinan photos" class project | Shanda | No |
| 小苏 Xiao Su | Language partner; finds archives, photos and maps | Shanda | No |
| 小谢 Xiao Xie | Friend who drags you everywhere; knows everyone | Baotu, Kuanhouli | No |
| 孙师傅 Master Sun | Food vendor. His 油旋 recipe is stolen (D2). Old Zhou's breakfast every day for 30 years | Furong, Kuanhouli | No |
| 林姐 Sister Lin | Retail pro, your courtyard neighbor. Spots the forged price tag (D4) | Quancheng | No |
| 老潘 Old Pan | Taxi driver. Drove Old Zhou everywhere. Luggage mix-up (D6) | West Station | No |
| 陈女士 Ms. Chen | Works every ticket window in Jinan (running joke). Keeps the lost-and-found ledger | Baotu, Daming, West | Clerk (D3, D6) |
| 白大夫 Dr. Bai | Hiker and doctor. Lost hiker (D5), 泉's doctor (D10) | Qianfo, Hospital | Clerk (D10, ward rules) |

**New characters** (not in 天天; ⚑ in `OPEN-QUESTIONS.md`):

| Character | Who | Why we need them |
| --- | --- | --- |
| 老周 Old Zhou | Your great-uncle. Appears only in the notebook, photos and a few remembered lines | The mystery's author |
| 何泉 Hé Quán | His first love, 90s, warm and sharp | The twist and the finale |
| 乐乐 Lele | Ms. Chen's 8-year-old son. Riddle-mad. Picked up the thermos | The first challenge (kid) |
| 马先生 Mr. Ma | A smooth developer who buys old courtyards and wants "the 73rd spring" as a bottled-water brand. Pushy, never a villain. Behind the fake 油旋 stall, the forged tag and the night argument | A recurring rival that gives the challenges stakes |
| 小七 Xiao Qi | A stray cat who moves into your courtyard. Shows your XP rank (§6.6) | Replaces the rank screen with something warmer |

### 4.4 Old Zhou's notebook: the progress bar

- The notebook is the home screen's centerpiece. It has 11 pages: one per district and the final letter.
- **Every word on every page is a Jinan word.** At the start, each word you haven't caught is a smudge of ink. Words you've caught are written clearly. Words you've mastered are in darker ink.
- **A line comes into focus** when all its words are caught. You can then read it (hover still works). The moment a line clears is the session's last step.
- **A page is complete** when all its lines are clear. That happens in the district's Payoff beat, because the arc's word sets cover the page.
- **Pages that clear early.** Pages share words (是, 我, 你 are everywhere), so later pages are partly legible from the start. Seeing 「……老周……七十三……」 on page 6 while you're still in Baotu is part of the pull.
- **Reading a page is the payoff drill:** sentence by sentence, then 2 comprehension questions in Chinese (天天's story flow, shortened).
- **Gold pages:** a page whose words are all mastered gets a gold edge.
- **Margin notes:** due review words appear as faded notes in the margin; refreshing them sharpens them.
- **Difficulty climbs by length, not words.** Pages 1–3 are 3–5 short sentences. Pages 4–7 are 5–6 sentences. Pages 8–10 are 5–6 longer sentences. The final letter is about 18 sentences and is the Jinan "final exam".
- The page texts are in §5 and checked by the script.

---

## 5. The ten Jinan arcs

Districts 1 and 2 are designed in full. Districts 3–10 are an outline (§5.3–5.10).

### 5.0 Conventions for every arc

- **Five beats:** Hook → Investigate (3–5 clues) → Challenge → Resolution → Payoff. Then the gate quiz.
- **Each beat is a word set.** A beat's session runs Learn → Use (§2.1). The tables below show the *Use* part: the scene, its key lines and the drills inside it. The words each set teaches are assigned in `HSK1-COVERAGE.md`.
- **Notebook pages are written in the arc's words**, so a page clears as its beats are played and is fully readable at Payoff.
- **Every drill has an in-world reason and a visible label:** an English skill name plus the story action, e.g. "Reading · find the right ledger line". The skill names are Listening, Reading, Writing, Speaking, Tones and Review.
- **New words** are introduced in the beat where they matter (天天's intro card: word, Listen, Record, Compare, Strokes), then practised in that beat's drills.
- **Taught words** are the 30 non-HSK-1 words Jinan needs, 3 per district. They're marked ★ in the 词典 and listed in `tools/jinan-lexicon.json`:

| District | Taught words |
| --- | --- |
| 1 Baotu | 泉 spring · 面子 face · 游客 tourist |
| 2 Furong | 碗 bowl · 甜 sweet · 油旋 youxuan pastry |
| 3 Daming | 船 boat · 晴 sunny · 照片 photo |
| 4 Quancheng | 红 red · 钥匙 key · 便宜 cheap |
| 5 Qianfo | 往 towards · 爬山 climb a mountain · 对面 opposite |
| 6 West Station | 信 letter · 行李 luggage · 欢迎 welcome |
| 7 Qushuiting | 井 well · 邻居 neighbor · 院子 courtyard |
| 8 Shanda | 以前 before · 因为 because · 年轻 young |
| 9 Kuanhouli | 熟人 familiar face · 红包 red packet · 大家 everyone |
| 10 Hospital | 舒服 comfortable, well · 药 medicine · 中秋 Mid-Autumn |

- **Which HSK 1 words each district teaches** is in `HSK1-COVERAGE.md` (assigned by script).
- **Clue cards** are pinned in the notebook (each is a short text you can re-read). **Springs** named on the page are added to the notebook's spring list at Payoff.
- **Conversation lines** below are the key lines only. Full scripts are written later in 天天's script format (see `FRAMEWORK.md`).

⚑ Several concept clues used words above HSK 1. Changes: the thermos is **white** (白), not red (红色 is HSK 2); the pavilion 四号亭 becomes **Gate 4**, 「四号门」 (亭 isn't on the list); the retreat line is 「对不起，我先走了。」 (不好意思 is HSK 2); "your great-uncle came here every morning" becomes 「老周天天早上都来这儿。」 (每天 is HSK 3).

<!-- zh:baotu -->
### 5.1 趵突泉 Baotu Spring · "Grandma Wang's thermos"

- **Theme:** greetings, people, names, countries, numbers 1–10. **Grammar:** 是 · 叫 · 吗 · 呢.
- **Taught words:** 泉, 面子, 游客.
- **Cast:** Grandma Wang, Teacher Zhang, Ms. Chen, Xiao Xie, Lele (new).
- **Former 天天 content reused:** quests baotu-1 (park ticket), baotu-2 (tai chi teacher), baotu-3 (photo by the spring); stories 张老师的问题 and 又是你？ as side documents.

**Opening (before the arc, about 1 session).** Old Pan drives you from the station to Qushuiting Street. He talks the whole way (you only need to answer 「是」 or 「不是」). Teacher Zhang hands you the key and the notebook. The notebook is all smudges except 「七十三」. Next morning, you walk to Baotu Spring.

| Beat | Scene | Who | Key lines | Clue or result | Drills underneath |
| --- | --- | --- | --- | --- | --- |
| Hook | Morning at the spring. Grandma Wang is upset by the railing | Wang | 「孩子，你好！我是王奶奶。」 「我的杯子没有了！」 「是一个白杯子。」 | Quest: find her white thermos | Listening · what did Grandma lose? New words: 你好, 我, 你, 是, 叫, 杯子, 没有 |
| Clue 1 | The tai chi group. Introduce yourself and ask around | Teacher Zhang | 「你好！你叫什么名字？」 「你是哪国人？」 「我看见了。一个孩子，拿了一个白杯子。」 | A child took it | Speaking · introduce yourself (name, country). Listening · who saw it? |
| Clue 2 | Ms. Chen's ticket window: buy a ticket, then check her lost-and-found ledger | Ms. Chen | 「你是游客吗？门票四十块。」 Ledger lines: 「白杯子 · 上午九点 · 四号门」 「书 · 下午三点 · 东门」 「手机 · 上午十点 · 北门」 | Seen at Gate 4 at 9 a.m. | Speaking · buy a ticket. Reading · find the right ledger line |
| Clue 3 | A kid by the fish pool shouts the gate number | Kid, Xiao Xie | 「四号门！他去了四号门！」 | Gate 4 (or a mistake) | Tones · 四 or 十? Mishear it and you walk to Gate 10: 「这儿没有十号门。」 The challenge then starts with 4 hearts |
| Clue 4 | Find Gate 4 using the park signs | (signs) | Signs: 「东门」 「西门」 「南门」 「北门」 「四号门 → 左边」 | You find the boy | Reading · follow the signs. Listening · Xiao Xie's directions: 「前边，左边！」 |
| Challenge | Lele won't hand the thermos over until you win his riddle duel | Lele (Kid) | 「你想要杯子吗？先回答我！」 Riddles: 「三和四，是几？」 「我有，你也有。我不能给你。是什么？」 | Thermos back | Mixed review of this arc's words |
| Resolution | You return the thermos. Inside the lid, a small photo of a stone carved with 七十三 | Wang | 「谢谢你，孩子！这是老周的杯子。」 「老周天天早上都来这儿。他喝泉水，他说：七十三！」 | Clue card: Old Zhou's photo of the 七十三 stone | Reading · Grandma's story, 3 sentences |
| Payoff | Notebook page 1 | — | Page text below | Springs: 趵突泉, 金线泉, 漱玉泉 | Reading · notebook page 1, then 2 questions |

⚑ Lele's riddle is the classic "what do you have that you can't give away?". The usual wording needs 可是 (HSK 2), so it's rephrased as above. The answer is 「名字」.

**Challenge: Lele's riddle duel** (Kid; rules in §6.1)

- Lele's turns: a spoken riddle (pick the answer), a number sum 「五和三，是几？」 (build the number in characters), a note to read 「我是谁的孩子？」 (answer: 「陈女士」).
- Your best moves: Listening and Speaking. Writing 七 or 十 from memory counts double against a kid.
- Win: thermos back, and Lele becomes a friend who hangs around ticket windows (and appears with his mother in later arcs). Grandma Wang gives you fruit (your first gift to pass on).

**Notebook page 1** (clears during the arc; fully readable at Payoff)

> 「孩子：你好！我是老周。你看到这个本子，我很高兴。」
> 「济南有七十二名泉。你知道吗？还有一个泉。七十三。」
> 「我找了很多年。现在，你来找吧。」
> 「先去认识王奶奶。她做的饭很好吃。」

**Gate quiz 1:** 10 questions from this arc's words; misses repeat until right (rules in §6.7).

<!-- zh:furong -->
### 5.2 芙蓉街 Furong Street · "Master Sun's stolen 油旋 recipe"

- **Theme:** food and drink, ordering, numbers to 100. **Grammar:** 要 · 想 · measure words 个 / 碗 / 杯.
- **Taught words:** 碗, 甜, 油旋.
- **Cast:** Master Sun, Grandma Wang, Xiao Xie, Mr. Ma (new, first sighting).
- **Reused:** quests furong-1/2/3/4 (breakfast, 油旋, breakfast with Grandma, lunch with Xiao Xie), rewritten at HSK 1; story 一个包子 as a side document.

| Beat | Scene | Who | Key lines | Clue or result | Drills underneath |
| --- | --- | --- | --- | --- | --- |
| Hook | A new stall across the street sells 「孙师傅的油旋」, and it isn't Sun's | Sun | 「来了！朋友，你要什么？」 「你看！那个油旋，不是我的！」 「我的本子没有了。我的油旋，都在本子里。」 | Quest: find Sun's recipe book | Speaking · order breakfast: 「我要两个油旋，一杯茶。」 |
| Clue 1 | Breakfast with Grandma Wang at Sun's stall | Wang | 「老周天天来这儿吃早饭。他要一个油旋，一碗米饭？不是！一杯茶。」 「孙师傅的本子？上个星期没有了。」 | The book went missing last week | Listening · what did Old Zhou order? |
| Clue 2 | Compare the two stalls' price lists | (menus) | Sun's: 「油旋 三块一个」 「茶 两块一杯」. Copycat's: 「油旋 五块一个」 「甜油旋 六块一个」, and under both: 「好吃！」 in the same hand | The copycat has a copy of Sun's book | Reading · compare the menus |
| Clue 3 | Helping out: a morning shift at Sun's stall | Sun, customers | Customers: 「我要三个油旋！」 「两碗米饭，一杯茶。」 One says: 「那个新的先生，他天天来这儿买油旋。」 | A "new gentleman" buys here every day | Listening · take the orders (timed) |
| Clue 4 | Lunch with Xiao Xie, who knows the copycat's cook | Xie | 「我认识他！他是马先生的人。」 「马先生有很多钱，很多房子。」 | Mr. Ma is behind the stall | Speaking · order lunch with the right measure words |
| Challenge | Face-off with the copycat cook at his stall | Cook (Vendor) | 「我的油旋最好吃！你要几个？」 | Book returned | Mixed: numbers, prices, measure words. Catch his wrong measure word for a free heart |
| Resolution | Sun gets his book. On the last page, Old Zhou's handwriting | Sun | 「谢谢你，朋友！」 「你看，这是老周写的：“我的茶，要用那个水做，最好喝。”」 | Clue card: "that water" | Reading · Old Zhou's note |
| Payoff | Notebook page 2 | — | Page text below | Spring: 芙蓉泉 | Reading · notebook page 2 |

**Challenge: the copycat cook** (Vendor). He quotes wrong prices and wrong measure words; correcting him in Chinese is the core of the challenge. Win: the book, and Sun gives you a bag of 油旋 to share (a gift you can pass on).

**Notebook page 2**

> 「我天天早上喝茶。」
> 「我的茶，不用趵突泉的水。我用一个老地方的水。」
> 「那个水很甜。我的朋友都说，这个茶太好喝了！」
> 「那个地方在哪儿？你先吃一个油旋，再找吧。」

**Gate quiz 2.**

### 5.3–5.10 Districts 3–10 (outline only)

Per round 3 (answer 4A), these stay as outlines until the Baotu and Furong slice has been playtested. The v0.2 beat tables, notebook pages 3–10 and the final letter are parked in `drafts/jinan-arcs-3-10.md`. They pass the checker, but they aren't the spec.

| # | District | Problem | Theme | Taught words | Challenge | What it reveals |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 大明湖 Daming Lake | The boat leaves at the wrong times | Time, days, weather | 船 晴 照片 | Ms. Chen (Clerk) | A photo of Old Zhou on a boat; his map of the old streets |
| 4 | 泉城广场 Quancheng Square | Old Zhou's key is on a stall with a forged price tag | Money, shopping, numbers to 1,000 | 红 钥匙 便宜 | Stallholder (Vendor) | The brass key; Mr. Ma sold it |
| 5 | 千佛山 Qianfo Mountain | A proud old hiker hasn't come down | Directions, places | 往 爬山 对面 | Old hiker (Elder) | From the top, the 73 photo lines up with your street |
| 6 | 济南西站 West Station | Old Pan's trunk holds the wrong suitcase, full of letters | Transport, tickets, times | 信 行李 欢迎 | Lost-luggage desk (Clerk) | The letters are to 泉. Old Zhou waited at the station for years |
| 7 | 曲水亭街 Qushuiting Street | The key opens a sealed well in your courtyard; Teacher Zhang says no | Home, family, routine | 井 邻居 院子 | Teacher Zhang (Elder) | The well once had sweet water; it opens only with the whole street there |
| 8 | 山东大学 Shandong University | Teacher Lü's old-photo class project | School, study | 以前 因为 年轻 | Mr. Ma (Rival) | A 1955 photo: 何泉 lived in your courtyard. The spring is your well |
| 9 | 宽厚里 Kuanhouli | Mr. Ma wants to buy every courtyard on the street | Likes, going out, invitations | 熟人 红包 大家 | Mr. Ma (Rival, boss) | The street stands together for the finale |
| 10 | 省立医院 Hospital | Grandma Wang is unwell; the old lady in the next bed is 何泉 | Body, health, feelings | 舒服 药 中秋 | Dr. Bai's ward (Clerk) | 泉 gives you the final letter |

**Finale (outline).** Read the final letter (about 18 short sentences, the Jinan "final exam"). At Mid-Autumn, invite each neighbor, gather in your courtyard, and Teacher Zhang and Master Sun open the well. 泉 names the spring after Old Zhou's every-morning habit. Then comes the Chengdu letter and a train ticket.

**Still spec, even in outline:** the taught-word list (§5.0), each district's challenge type (§6.1), and the rule that each notebook page uses only its own district's words and earlier ones.

---
<!-- zh:jinan -->
## 6. Systems

All numbers are starting values for playtesting. They live in one tuning file (`content/tuning.json`, see `FRAMEWORK.md`), so they can change without touching code.

### 6.1 Conversation challenges (面子)

A challenge is a scripted conversation with stakes. It mixes the whole arc's words and checks them under a little pressure.

| | Value |
| --- | --- |
| Hearts (面子 face) | 5. These are the mistakes you're allowed. 4 if you lost one to a clue mistake (Baotu clue 3). Max 8 (D9 only, §5.9) |
| Length | 8–12 prompts, about 3–4 minutes |
| Timer | None. An optional "brisk" setting adds 20 seconds per answer |

**A prompt.** The other person says or shows something, and you respond. There are four kinds:

| Prompt | What you do |
| --- | --- |
| Ask (Listening) | They say a line. Pick or build the answer |
| Show (Reading) | They show a note, sign or price. Answer about it |
| Test (Writing) | Draw a character from memory, or build a word from its meaning |
| Talk (Speaking) | They say something that needs a reply. Build the sentence from tiles, or type it. `talk.js` matches typed answers |

**Rules.**

- Hover pinyin and English are locked until you answer (天天's `HZ_LOCK`).
- **Right:** the conversation moves on.
- **Wrong:** you lose a heart. 天天's confirm box shows the right answer, and that item comes back two prompts later until you get it right.
- **Local touch:** 3 right in a row restores 1 heart (up to your starting hearts). Skill is the only way to recover.
- **A pinyin hint** is available on Talk and Test prompts. It costs no heart. You still build, type or draw the Chinese.
- **Out of hearts:** you say 「对不起，我先走了。」 and go home. Nothing is lost. The words you missed go to review. Retry at once; the prompts are reshuffled.
- **Win:** the story moves on. The person you helped usually gives you a gift (§6.3).

**Challenge types** only change the mix of prompts and one rule:

| Type | Mix | Rule | Jinan examples |
| --- | --- | --- | --- |
| Kid 小孩 | Ask 40%, Show 20%, Test 40% | Riddles and number puzzles | Lele (D1) |
| Vendor 摊主 | Ask 30%, Show 40%, Talk 30% | Numbers, prices, measure words. Catch their wrong measure word for a free heart | Copycat cook (D2), stallholder (D4) |
| Clerk 窗口 | Show 40%, Talk 60% | Wants exact forms: times, dates, names. Tile sets include near-miss forms (十点半 vs 十半点) | Ms. Chen (D3, D6), Dr. Bai's ward (D10) |
| Elder 长辈 | Ask 30%, Talk 70% | Courtesy matters: 您 and 请 where they belong, or a heart is lost | Old hiker (D5), Teacher Zhang (D7) |
| Rival 对手 | All four | Drawn from your weakest words in review | Mr. Ma (D8, D9) |

**Difficulty follows your status (§6.2), not time:** people speak faster as you're more local (browser speech rate 0.8 as a Tourist, 0.9 as Newcomer or Neighbor, 1.0 as Familiar Face and up) and use longer lines.

### 6.2 本地 Local status, calculated from skill

There are no points to earn. Your tier is calculated live from three skill measures:

- **Caught:** Jinan words you've caught (answered right at least once; §6.5).
- **Mastered:** caught words with a review interval of 21 days or more **that aren't overdue by more than 7 days**.
- **Clean conversations:** conversations and challenges finished without a pinyin hint or a lost heart. Tiles count; typing isn't required for any tier.

| Tier | Needs | What changes |
| --- | --- | --- |
| 「游客」 Tourist | — | People speak slowly and simply. Vendors in scenes call you a tourist |
| 「新来的」 Newcomer | 100 caught | Neighbors greet you by name |
| 「邻居」 Neighbor | 250 caught, 60 mastered, 8 clean conversations | People speak a little faster. Teacher Zhang shows you more of the house |
| 「熟人」 Familiar Face | 400 caught, 180 mastered, 20 clean conversations | Normal speed, longer lines. The members-only teahouse opens (practice reruns there count double toward clean conversations) |
| 「老济南」 Old Jinan | Finale done, all 539 caught, 350 mastered, 35 clean conversations | A gold seal on the notebook. Chengdu people recognise you as someone from Jinan |

- **Status never blocks the story.** It changes how people talk to you and opens a few side scenes.
- **It can drop, honestly.** If you stop reviewing, words go overdue and stop counting as mastered, so your tier can fall back. That's the concept's "drops after weeks away", but it measures forgetting, not absence.
- **It comes back the same way.** Refresh your overdue words and the tier returns as soon as the numbers are met again. Grandma Wang greets you: 「孩子，你回来了！」
- **A wobble warning** appears when more than 30 words are overdue: the status badge cracks before anything drops.
- **The "Your Chinese" page** (the back of the notebook) shows these three numbers, the next tier's targets and your retention rate (gate quizzes and checks over the last 30 days).

⚑ Mastery needs 21-day review intervals, so the 「老济南」 tier can't be reached in under about a month, however fast someone plays. That's intended: it marks retention.

### 6.3 Where gifts come from (no money)

⚑ Yuan is cut (round 3, answer 5A). There is no wallet, no shop and nothing to buy.

- **Gifts are given to you.** Winning a challenge, finishing an odd job or a loved-gift moment usually ends with the person handing you something: Grandma Wang's fruit, a bag of Sun's 油旋, a book from Teacher Lü. They go on your gift shelf.
- **You pass gifts on.** Giving is still a phrase lesson (§6.4), and choosing the right gift for the right person is still the game.
- **Prices stay as language.** Buying a ticket or bargaining in a scene is a conversation with numbers in it. Nothing is deducted.
- **Weekly neighborhood requests** reward a gift.

| Gift | Chinese shown in Jinan | Usually from |
| --- | --- | --- |
| Tea | 「茶」 | Ms. Chen, odd jobs |
| Good tea | 「好茶」 | Teacher Zhang |
| 油旋 | 「油旋」 | Master Sun |
| Fruit | 「水果」 | Grandma Wang |
| Milk | 「牛奶」 | Sister Lin |
| Flowers | 「花」 | Xiao Xie |
| A book | 「书」 | Teacher Lü |
| Film tickets (two) | 「电影票」 | Xiao Su |
| Red packet | 「红包」 (from District 9) | Make one yourself (§6.4) |

**Rule for names:** a Jinan player sees a gift's Chinese name only if every word is HSK 1, a name or taught. All the gifts above pass.

### 6.4 Gifts and friendship: phrase lessons

Gifts are where politeness and culture are practised.

**The insist ritual.** Every gift is refused first: 「不用不用！」. You must insist in Chinese. `talk.js` accepts lines like 「你拿着吧！」, 「这是给你的。」 or 「一点东西。」. Then they accept: 「那……谢谢你！」. If you don't insist, the gift isn't given, and Grandma Wang explains why in English.

**Likes and dislikes.**

| Character | Loves | Likes | Dislikes |
| --- | --- | --- | --- |
| 王奶奶 Grandma Wang | 「水果」 | 「牛奶」, 「花」 | Anything expensive (「太贵了！」) |
| 张老师 Teacher Zhang | 「好茶」 | 「书」 | 「电影票」 |
| 吕老师 Teacher Lü | 「书」 | 「花」, 「好茶」 | 「油旋」 in class |
| 小苏 Xiao Su | 「电影票」 | 「书」, 「油旋」 | 「好茶」 (too old-fashioned) |
| 小谢 Xiao Xie | 「电影票」 | 「花」, 「水果」 | 「书」 |
| 孙师傅 Master Sun | 「好茶」 | 「水果」 | 「油旋」 from anyone else! |
| 林姐 Sister Lin | 「花」 | 「水果」, 「电影票」 | — |
| 老潘 Old Pan | 「油旋」 | 「茶」, 「水果」 | 「书」 |
| 陈女士 Ms. Chen | 「花」 | 「水果」 | 「茶」 (she has plenty) |
| 白大夫 Dr. Bai | 「水果」 | 「好茶」 | 「油旋」 (too greasy) |

**Each reaction is a line to understand.** A loved gift gets a warm reply with a new phrase; a disliked one gets a polite but clear line, e.g. 「谢谢你。我不常吃这个。」.

**Friendship stages** (replace 天天's quest-count stages): stage 2 after 3 "moments" with someone, stage 3 after 6. A moment is a beat or conversation with them, or a loved gift (once a day). Stages change greetings (天天's stage lines), unlock one personal side scene per character, and decide who joins you in the D9 challenge.

**Red packets 红包** (taught in D9):

- You choose the amount (pretend money; there is no wallet), built or typed in Chinese numbers. 6, 8, 66 and 88 are lucky and count as a moment.
- Anything with a 4 (四 sounds like 死, "death"): Grandma Wang stops you and explains. A good moment to teach the tone pair.
- More than 2 to the same person in a week: they refuse, 「不用不用！太多了！」.

**Taboo gifts** (clocks, umbrellas for a couple, white flowers, sets of four) are explained as culture notes in English. Their Chinese comes in Chengdu.

### 6.5 词典 The word collection

The collection lives in your phone (⌘K opens it, as in 天天).

| State | How you get it | Shown as |
| --- | --- | --- |
| Unseen | — | An empty slot showing the English meaning, so you know what's coming |
| Seen | The word appeared in a line you heard or read | Characters, dimmed |
| Caught | You answered it right in a drill or check, or used it correctly in conversation. It enters spaced review | Full ink. Clears its smudges in the notebook |
| Mastered | Review interval 21+ days and not overdue by more than 7 days | Gold border. Darker ink in the notebook |
| Lapsed | A caught word you missed in review | Faded until refreshed |

- **Pages:** one per district (its ~50 HSK 1 words and 3 taught words, from `HSK1-COVERAGE.md`), plus a "Jinan words" page for the taught words and the fixed expression.
- **Each entry shows:** characters, pinyin on hover, English on click, where you first met it (person, place or object), the sentence you met it in, a stroke animation, Listen, and its review status.
- **Count in Jinan:** 508 HSK 1 + 30 taught + 1 fixed expression = 539.

### 6.6 XP, the cat and stamps

- **XP** keeps 天天's rules: 10 per right answer (4 on a retry), 3 per character drawn, review XP with combos. Plus 50 per beat, 300 per arc, 100 per gate quiz. XP is never spent.
- **Typing bonus:** a typed answer (instead of tiles) earns double XP. The "Your Chinese" page counts typed answers, and a set of "brush" stamps rewards them. Typing never gates the story or status.
- **小七 the cat** shows your rank. 天天's 14 animal ranks (蟋蟀 Cricket → 龙 Dragon, same XP thresholds) become the charm on its collar, and it grows from kitten to adult over Jinan. Milestone ranks still need the HSK band finished.
- **Stamps:** 天天's 22 badges keep their tests, re-themed as stamps in a passport. District stamps (page cleared) and gold stamps (page mastered) join them.

### 6.7 Gate quiz and locked rooms

- **Gate quiz:** 10 questions from the finished district's words, weighted to your weakest. Mixed types: listen, hear→character, read, pick, build, tone, and up to 2 draw. Silent mode swaps listening items for reading ones.
- **Hover and hints are off.**
- **A miss** shows the answer in the confirm box, and that question goes back into the stack. It comes back after two or three other questions, and keeps coming back until you get it right.
- **The quiz ends** when all 10 have been answered right once. You can't fail it; a miss only makes it longer. Missed words also go to review.
- **Clear:** a short scene opens the next district. +100 XP.
- **Locked rooms:** the same rules with 6 questions from that room's 5–8 words.

### 6.8 Refresh (review)

- 天天's SRS is kept exactly (`learnWord`, `grade`, `mastery`), including fill-in-the-gap cards built from sentences you met (`S.ctx`), now fed by notebook pages, clue cards and conversations as well as documents.
- **Due words** appear as faded notes in the notebook margin. Refresh is the first step of every session.
- **Timed rounds** (2 and 5 minutes, combos ×2 at 5 and ×3 at 10) become the **morning tea round** at home.
- Overdue words don't block anything. They lower your mastered count (§6.2) until refreshed.

### 6.9 Conversations, tiles and odd jobs

- **Word tiles are the default** (round 3, answer 1A). The script's example sentence is split into words, 2–3 distractor tiles are added, and you build the sentence in order. Tile answers count fully, including toward clean conversations.
- **Typing is optional.** Switch it on per prompt or as a default. Typed answers run on 天天's `talk.js`: rule-based corrections, homophone matching, suggestions after misses. They earn double XP (§6.6).
- **Why tiles first:** a true beginner has no pinyin keyboard and can't produce characters yet. Tiles let day one be about Chinese, not keyboard settings. They also cut the script work: each Talk prompt needs its target sentence and distractors, not every accepted typed variant. Typed matching can be added prompt by prompt.
- **Pinyin hint:** shows the pinyin of one example sentence. You still build or type the characters.
- **Keyboard tutorial** is an in-world scene, offered when you first switch typing on: Xiao Su shows you how to add the pinyin keyboard on Mac and Windows.
- **Odd jobs** are optional extra practice that earn a gift:

| Job | Where | Drill |
| --- | --- | --- |
| Morning shift at Master Sun's stall | Furong | Timed order-taking (Listening, numbers, measure words) |
| Stocking Sister Lin's shelves | Quancheng | Price labels (Reading, numbers) |
| Helping at Ms. Chen's ticket window | Baotu, Daming | Customers ask for tickets and times |
| Old Pan's navigator | West Station onwards | Directions from passengers (Listening) |
| Tutoring Xiao Su | Shanda | Translate short English sentences into Chinese (tiles or typed) |

### 6.10 Content rules that keep it a learning game

These are checked by scripts in `tools/`, not by eye.

| Rule | Value |
| --- | --- |
| New words per beat | 5–10 |
| Each new word used in the beat's scene | At least twice, and the answer to at least one prompt |
| Known-word coverage of a scene's text | 95% or more (only that beat's new words are unknown) |
| Text per beat (lines read or heard) | 40–150 characters |
| Words above the city's level | Only names, particles, the fixed expression and the district's taught words |
| Earlier-district words reused per arc | At least 15% of each arc's lines |
| Session time outside Chinese | Under 1 minute (playtest measure) |
| A line checked twice (shown, then asked about) | Never. Each line is checked at most once |
| Speaking prompts that give the English sentence to say | None. Prompts give the situation or goal |
| Reply choices with at least one wrong or nonsense option | All of them |

### 6.11 Conversation rules

Round 4 (Moondog, Oct 9). These apply to every scene, not only challenges. They come from reading the Baotu scenes as built: the player was told what to say in 23 of 24 speaking prompts, and 18 of 31 questions asked about a line that had just been shown.

**1. You choose what to say, not how to translate it.**

- A speaking prompt gives the situation or the goal ("Ms. Chen wants to know if you're a tourist."), never the English sentence.
- **Reply choices:** many prompts offer 2–3 replies in Chinese. You pick one, then build it from tiles. At least one reply is wrong for the moment or plain nonsense.
- **A sensible reply** gets its own reaction. Example, at the ticket window:
  - 「是，我是游客。」 → 「门票四十块。」
  - 「不是。我是老周的孩子。」 → 「老周的孩子？！老周天天来这儿！」 Ms. Chen is warmer from then on.
- **A wrong or nonsense reply** gets confusion, not a red ✗: 「啊？什么？」 or 「你说什么？」, with a puzzled look. You choose again. Example: answering 「我是杯子。」 to Ms. Chen gets 「……你是杯子？什么？」
- **Choices are small** (round 4, answer 3A): they change a reaction, someone's warmth or a friendship moment (§6.4). They never change the clue path or the story.

**2. No echo questions.**

- A line is never shown and then asked about straight away.
- **Listening is audio first.** An NPC line plays with its text hidden. The text appears after you answer, or after you replay it twice.
- **Each line is checked once at most.** Many lines aren't checked at all; they're just heard and read.
- **Show understanding by doing,** where the scene allows: after 「前边，左边！」 you click the left-hand path, and after 「他去了四号门！」 you walk to a gate on the park map.

**3. Repair lines appear after a mistake.**

- When you miss a listening or reading question, you don't get a ✗. The repair tiles appear instead: 「什么？」 「请再说。」 「慢一点儿！」 「我不知道。」
- Building one makes the speaker react and repeat the line, slower for 慢一点儿. Then you answer again.
- This teaches the survival phrases from day one, in the moment they're needed. The missed word still goes to review.
- In challenges (§6.1) the heart is still lost; the repair line replaces the confirm box.

**4. Recasts for near misses.**

- Outside challenges, an answer that is close (a word missing, order slightly off, a near synonym) isn't marked wrong. The NPC says it back correctly and carries on, as a person would. You build 「我要门票。」, and Ms. Chen says 「一个门票？好！」
- The correct form flashes under their line so you can see the difference. It counts as a miss for catching that word.
- Nonsense (as opposed to close) gets the confusion reaction from rule 1.

**5. Every character has a verbal habit.** These are HSK 1 phrases they come back to, so each voice is recognisable:

| Character | Habit | Example |
| --- | --- | --- |
| 老潘 Old Pan | Opens with "let me tell you" and never stops talking | 「我跟你说……」 |
| 王奶奶 Grandma Wang | Calls you 孩子; worries that you've eaten | 「孩子，你吃饭了吗？」 |
| 陈女士 Ms. Chen | Brisk; counts out loud while she works | 「一、二、三……好，下一个！」 |
| 小谢 Xiao Xie | Always moving you on | 「走吧！走吧！」 |
| 张老师 Teacher Zhang | Slow and approving | 「好，好。很好。」 |
| 林姐 Sister Lin | Points things out | 「你看！你看！」 |
| 乐乐 Lele | Answers a question with a question | 「你知道吗？你不知道！」 |
| 孙师傅 Master Sun | A street vendor's call | 「来了！来了！」 |

**6. A line has to earn its place.** No line exists only to fit a word into the scene. If a word needs a scene, the scene needs a reason, or the word moves to another beat (the coverage script in `HSK1-COVERAGE.md` balances this).

---

## 7. How every 天天 feature maps into the game

| 天天 today | In the game | Notes |
| --- | --- | --- |
| 学 Levels (5 words each) | The Learn step of each beat (5–8 words). Teacher Lü's classroom offers optional extra training on any word you've seen | Same intro card: Listen, Record, Compare, Strokes |
| Drill types (pick, read, listen, hear→character, tone, type, trace, draw) | All kept, framed by the scene, with skill labels. "Type" becomes "build" (tiles) unless typing is on | Wrong answers keep the confirm box; misses repeat until right |
| Pop quiz every 3rd level | Becomes the gate quiz (every arc). Within a beat, the scene's prompts do the checking | |
| Stroke leniency (Relaxed 1.8 / Normal 1.0) | Kept in Settings | |
| Level check (placement) | Offered at the start. Known words become caught, seeded into review, and clear their smudges | The story still plays in full |
| 复 Review (SRS + context cards) | Refresh, the first step of every session; morning tea rounds | §6.8 |
| Home and the 15-minute plan | The courtyard home screen and the "Today in Jinan" card: Refresh → next beat | Suggestions only (free pacing) |
| Weekly goals | Weekly neighborhood requests ("read 2 documents", "3 clean conversations") | Reward: a gift |
| Streak, tea cups, 3 freezes | Morning tea at home; the cups stay. Freezes become tea tins | |
| Animal ranks and XP | 小七 the cat's collar charm | §6.6 |
| Badges (22) | Passport stamps | |
| 故 Stories (30) | HSK 1 stories become side documents in their districts (§5). HSK 2 and 3 stories move to Chengdu and Shanghai later | HSK 1 stories need rewriting to the taught-word list |
| 城 Jinan quests (50) | Rewritten at HSK 1 as the scenes' conversations | Answer 6A |
| 人 People | The cast page in your phone: portraits, friendship stage, gift notes, conversation logs | |
| Hover pinyin, click English, dictionary ⌘K | Everywhere, unchanged. The dictionary is your phone. Locked during questions | |
| Silent mode | Unchanged: listening drills become reading drills | |
| Recording and compare | Kept on intro cards; ungraded | |
| Voice settings | Per-character voices (see `ART-AND-AUDIO.md`, `FRAMEWORK.md`) | |
| Local AI (Ollama) | Optional slot only; off by default | |
| Reminders, open at login | Desktop wrapper only | |
| Export / import progress | Kept | |

---

## 8. Later cities (outlines)

Each later city follows the Jinan pattern: 10 districts, 10 five-beat arcs, a progress object that clears as you learn its words, a cast of 10, about 30 taught words above its level, and cameos from earlier cities.

**How earlier words come back (all cities):**

- Review keeps every caught word on its schedule.
- At least 15% of each arc's lines reuse earlier cities' words, tagged so the checker can confirm it.
- Phone calls from Jinan friends at stage 3 use HSK 1 words only.
- One cameo arc per city: a Jinan character visits.
- Gate quizzes draw 20% of their questions from earlier cities.

### 8.1 成都 Chengdu (HSK 2) · "The unanswered letter"

- **Premise:** 泉's letter leads to a teahouse by the river. Its owner, 茶伯 Uncle Cha, wrote to Old Zhou for 40 years and never got the last reply. You carry Old Zhou's answer, but it's in pieces across the city, each piece held by someone he helped.
- **Progress object:** the reply letter, which clears word by word.
- **Theme:** food (hotpot, spice levels), leisure, mahjong, pandas, weather, feelings, colors and clothes.
- **Cast of 10:**

| Character | Role |
| --- | --- |
| 茶伯 Uncle Cha | 80, teahouse owner, waiting for the reply |
| 辣姐 Sister La | Hotpot restaurant owner; spice-level challenges |
| 小熊 Xiao Xiong | Panda base keeper, young, earnest |
| 麻阿姨 Auntie Ma | Mahjong queen of the neighborhood |
| 川老师 Teacher Chuan | Sichuan opera teacher (face-changing) |
| 小雨 Xiao Yu | University student, bubble-tea part-timer |
| 刘叔 Uncle Liu | Bamboo craftsman |
| 江大哥 Brother Jiang | E-bike courier, knows every lane |
| 宋医生 Dr. Song | Traditional medicine clinic |
| 赵先生 Mr. Zhao | Rival: an influencer turning the teahouse into a "content set" |

- **Cameo:** Old Pan drives a tour group from Jinan.
- **Language note:** standard Mandarin only. People may *mention* Sichuan dialect, but none is used.

### 8.2 上海 Shanghai (HSK 3) · "The stopped clock"

- **Premise:** Uncle Cha's last words point to a clock on the Bund that stopped in 1949. You help a young office worker find out why her great-grandfather's company clock stopped: a missing partner and a lost company seal.
- **Progress object:** a company ledger whose entries clear as you learn.
- **Theme:** work, metro, shopping, plans, opinions, comparisons, connectors (因为……所以, 虽然……但是).
- **Cast of 10:** 方小姐 Ms. Fang (office worker, client), 周经理 Manager Zhou (her boss, no relation, a running joke), 老钟 Old Zhong (clock repairer), 阿明 A-Ming (metro staff), 唐律师 Lawyer Tang, 苗苗 Miaomiao (student, Xiao Su's friend), 黄师傅 Master Huang (tailor), 顾奶奶 Grandma Gu (lane-house resident), 白先生 Mr. Bai (Dr. Bai's brother, banker), 金总 Boss Jin (rival developer, Mr. Ma's partner).
- **Cameo:** Xiao Su comes to Shanghai for a semester.

### 8.3 北京 Beijing (HSK 4) · "The courtyard deed"

- **Premise:** the Shanghai ledger shows that Old Zhou and 泉's family once co-owned a courtyard in a Beijing hutong. Its deed is missing and the hutong is to be redeveloped. You prove who it belongs to, through archives, opera, old shops and formal Chinese.
- **Progress object:** the deed, restored seal by seal.
- **Theme:** history, formality, culture, news, abstract words.
- **Cast of 10:** 何先生 Mr. He (泉's grandson, lawyer), 杜大妈 Auntie Du (hutong committee head), 梅老师 Teacher Mei (Peking opera actor), 邹老师 Teacher Zou (archivist), 小龙 Xiao Long (courier, hutong kid), 侯师傅 Master Hou (roast duck chef), 罗教授 Professor Luo (historian), 袁女士 Ms. Yuan (city official, by-the-book), 叶爷爷 Grandpa Ye (birdkeeper, Old Zhou's old friend), and Mr. Ma (the rival returns, now on your side).
- **Cameo and finale:** Grandma Wang visits her grandson in Beijing. The finale gathers people from all four cities in the restored courtyard.

---

## 9. Accessibility and settings

| Setting | Default | Notes |
| --- | --- | --- |
| Silent mode | Off; turns off each new day (as in 天天) | Listening drills and prompts become reading ones; voices muted |
| Stroke checking | Relaxed (leniency 1.8) | Normal = 1.0. Trackpad-friendly default |
| Pinyin hints | Available on every production task | **A hint never skips producing the Chinese**: you still build, type or draw it |
| Answer input | Word tiles | Typing (pinyin keyboard) per prompt or as a default. Typed answers earn double XP |
| Listen first | Off | NPC lines play before their text appears (listening practice) |
| Speech speed | Normal | Slow = 0.65 rate, as in 天天 |
| Voice per character | On | Falls back to the best Mandarin voice available |
| Challenge timer | Off | "Brisk" adds 20 seconds per answer |
| Text size | 100% | 100–150%; Chinese text never below 20 px |
| Chinese font | Noto Sans SC, everywhere (approved UI target; see `ART-AND-AUDIO.md`) | Subset to the game's characters |
| Color | — | Never color-only meaning: right and wrong also show ✓ and ✗ and a sound |
| Motion | Normal | Reduced motion: no shake, instant fades |
| Controls | Keyboard and mouse | All drills keep 天天's keyboard shortcuts |
| Screen reader | Overlays are real HTML with labels | Scenes list their clickable people and objects as text |
| Hover lock | On in questions | Unlocks after you answer |

---

## 10. Flags (things in the concept that changed)

Each is a question in `OPEN-QUESTIONS.md`.

1. The open walkable map became a scene map (round 2, answer 1A). Phaser now draws scenes rather than a world; `FRAMEWORK.md` will weigh whether Phaser is still worth it.
2. Progress is driven by words learned. Story beats open when their word sets are introduced; nothing else gates them.
3. Face-battles became conversation challenges: hearts only, no items or resolve. Tea no longer restores face.
4. Items (bus card, map, flashlight, umbrella, tickets, teahouse membership) are cut. Yuan is cut too (round 3); gifts come from the story.
5. Local status is calculated from caught words, mastered words and clean conversations. The concept's "drops after ~3 weeks away" becomes "drops when words go overdue".
6. HSK 1 has no colors besides 白. The thermos is white; 红 is taught in D4.
7. 泉, 照片, 信, 钥匙 and 井 aren't HSK 1, but the story needs them. They're among the 30 taught words.
8. 叔公 (great-uncle) isn't HSK 1. Chinese text says 「老周」.
9. The retreat line is 「对不起，我先走了。」 (不好意思 is HSK 2).
10. 生日快乐 is allowed as a fixed expression; the alternative is teaching 快乐.
11. New characters: 老周, 何泉, 乐乐, 马先生, 小七 the cat.
12. Existing HSK 1 stories use non-HSK-1 "new" words and need rewriting.
13. Spring assignments per district need a fact-check against the official list of 72.
14. Word tiles are the default; typing is optional and rewarded (round 3).
15. The gate quiz can't be failed: misses repeat until right (round 3).
16. The Prove step is cut; the scene's prompts catch words (round 3).
17. Districts 3–10 are outlines; their v0.2 drafts are parked in `drafts/` (round 3).

---

## Appendix: checker result

```
$ node tools/check-zh.js CONCEPT.md
152 player strings checked, 0 failed.

$ node tools/check-zh.js CONCEPT.md drafts/jinan-arcs-3-10.md
313 player strings checked, 0 failed.
```
