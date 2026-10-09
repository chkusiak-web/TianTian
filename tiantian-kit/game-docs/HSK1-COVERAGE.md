# HSK 1 Coverage · Jinan

Version 0.1 · Oct 9, 2026 · generated in part by `tools/coverage.js`

**What this is.** Every one of the 508 HSK 1 words in 天天's list (`tiantian-reference/app/data/words.js`) gets one **home district**: the Jinan arc where it's taught. This file lists where each word is met first, where it's used again, and how many each district teaches. CONCEPT.md §5.0 points here.

**Run it:**

```
node tools/coverage.js            # summary and notebook check
node tools/coverage.js --write    # also rewrites sections 3–4 below and tools/out/coverage.json
```

Everything between the `coverage` markers below is generated. Don't edit it by hand.

---

## 1. How words get a home

The script works in four passes. The same inputs always give the same result.

1. **Baotu is fixed by the build.** Its 85 words are the ones the game build already teaches (`tools/data/baotu-built.json`, a snapshot of `content/baotu-words.json` on `claude/scene-map`). Re-copy it when the build changes.
2. **Story pass.** For Districts 2–10 in order, a word goes to the first district whose player text uses it: CONCEPT.md §5.2 for Furong, and the parked drafts for 3–10. The line it first appears in is recorded.
3. **Hand placements.** 23 words whose 天天 topic tag is misleading are placed by hand (`tools/data/overrides.json`), e.g. 北京 at West Station and 后边 at Qianfo. A story line still wins over a hand placement.
4. **Theme pass.** Words no line uses yet go by 天天's topic tags to the least-full district with that theme (food → Furong, time and weather → Daming, family and home → Qushuiting, and so on). Words tagged only "basics", or untagged, are shared across Districts 2–5 so they come early.

Then two checks:

- **Used again:** every other district whose text uses the word.
- **Notebook pages:** a page may only use words homed in its own district or earlier (plus names, particles, taught words and 生日快乐). The script exits with an error if one doesn't.

## 2. What the numbers say

- **All 508 words have a home.** All 10 notebook pages pass. (Pages 3–10 pass partly by construction, since their own lines are what homed the words. The check matters when lines are edited later.)
- **Baotu is big: 85 words.** It teaches the basics (pronouns, 是, numbers, 的, 了), and the build already splits it into 12 short sessions. Leave it as built.
- **Districts 2–5 are 58–59 words; 6–10 are 20–47.** That's the "basics come early" rule. The later arcs teach fewer new words and reuse more, which suits their longer notebook pages and the final letter. Hospital has only 20, so it has room for the final letter's review.
- **Most words have no scene yet.** "From themes" means no line uses the word yet (Kuanhouli 40, Daming 42). Those words still need a scene written for them. When Districts 3–10 are designed in full, the story pass will take over and the theme column will shrink.
- **Session count:** at the 8-word cap per session (Moondog, Oct 9), Jinan's 538 words (508 + 30 taught) need about 75–80 teaching sessions, close to CONCEPT's ~70. Districts 2–5 need 8–9 sessions each, not 7.

**Decided** (Moondog, Oct 9): words stay **front-loaded**. Districts 2–5 are bigger, and later arcs teach fewer new words and reuse more.

<!-- coverage:start -->
<!-- zh:off -->

## 3. Per-district counts

| # | District | HSK 1 words | From the build | From story lines | From themes | Taught | Notebook page |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Baotu Spring | **85** | 85 | – | – | 3 | 1: ok |
| 2 | Furong Street | **59** | – | 30 | 29 | 3 | 2: ok |
| 3 | Daming Lake | **59** | – | 17 | 42 | 3 | 3: ok |
| 4 | Quancheng Square | **58** | – | 17 | 41 | 3 | 4: ok |
| 5 | Qianfo Mountain | **58** | – | 20 | 38 | 3 | 5: ok |
| 6 | Jinan West Station | **35** | – | 9 | 26 | 3 | 6: ok |
| 7 | Qushuiting Street | **42** | – | 7 | 35 | 3 | 7: ok |
| 8 | Shandong University | **47** | – | 11 | 36 | 3 | 8: ok |
| 9 | Kuanhouli | **45** | – | 5 | 40 | 3 | 9: ok |
| 10 | Provincial Hospital | **20** | – | 7 | 13 | 3 | 10: ok |
| | **Jinan** | **508** | | | | **30** | |

Every notebook page uses only words homed in its own district or earlier.

## 4. Every word, by district

"Met first" is the line where the word first appears in its home district's text. "Theme" means no line uses it yet, so a scene still has to be written for it. "Used again" lists the other districts whose text uses it.

### 4.1 Baotu Spring (85)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 你好 | nǐ hǎo | hello | build, opening | qianfo, west, shanda |
| 你 | nǐ | you | build, opening | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 我 | wǒ | I; me | build, opening | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 谢谢 | xiè xie | thank you | build, opening | furong |
| 对不起 | duì bu qǐ | sorry | build, challenge | – |
| 是 | shì | to be (am, is, are) | build, opening | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 不 | bù | not; no | build, opening | furong, daming, quancheng, qianfo, west, qushuiting, kuanhouli, hospital |
| 叫 | jiào | to be called; to call | build, inv1 | west, shanda, hospital |
| 名字 | míng zi | name | build, inv1 | west, shanda, hospital |
| 什么 | shén me | what | build, inv1 | furong, quancheng, west, shanda, kuanhouli, hospital |
| 吗 | ma | (yes/no question particle) | build, opening | daming, quancheng, qianfo, qushuiting, shanda, kuanhouli, hospital |
| 他 | tā | he; him | build, inv3 | furong, daming, quancheng, qianfo, west, qushuiting, hospital |
| 她 | tā | she | build, payoff | west, shanda, kuanhouli, hospital |
| 人 | rén | person; people | build, inv1 | furong, west, qushuiting, shanda, kuanhouli |
| 中国 | Zhōng guó | China | build, inv1 | – |
| 一 | yī | one | build, hook | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 三 | sān | three | build, opening | furong, daming, quancheng, qianfo, qushuiting, shanda, hospital |
| 四 | sì | four | build, inv2 | daming, west |
| 五 | wǔ | five | build, challenge | furong, daming, west, shanda |
| 七 | qī | seven | build, opening | daming, qianfo, qushuiting, shanda |
| 九 | jiǔ | nine | build, inv2 | daming, shanda |
| 十 | shí | ten | build, opening | daming, quancheng, qianfo, qushuiting, shanda |
| 几 | jǐ | how many; a few | build, challenge | furong, daming, west, qushuiting, kuanhouli, hospital |
| 块 | kuài | yuan (money); piece | build, inv2 | furong, quancheng, qianfo |
| 有 | yǒu | to have; there is | build, challenge | furong, daming, west, qushuiting, shanda, kuanhouli, hospital |
| 没有 | méi yǒu | don't have; there isn't | build, hook | furong, daming, quancheng, west, qushuiting |
| 要 | yào | to want; will | build, hook | furong, quancheng, kuanhouli |
| 喝 | hē | to drink | build, inv3 | furong, qushuiting, hospital |
| 水 | shuǐ | water | build, inv3 | furong, qushuiting, shanda, hospital |
| 饭 | fàn | meal; cooked rice | build, payoff | – |
| 好吃 | hǎo chī | tasty | build, payoff | furong |
| 这 | zhè | this | build, opening | furong, daming, quancheng, west, qushuiting, shanda, kuanhouli, hospital |
| 哪 | nǎ | which | build, inv1 | shanda |
| 这儿 | zhè r | here | build, inv3 | furong, daming, qianfo, shanda |
| 去 | qù | to go | build, inv3 | daming, qianfo, west, shanda, kuanhouli |
| 来 | lái | to come | build, inv3 | furong, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 现在 | xiàn zài | now | build, payoff | daming, qianfo, qushuiting, shanda, hospital |
| 点 | diǎn | o'clock; a little | build, inv2 | daming, west, hospital |
| 早上 | zǎo shang | morning (early) | build, payoff | furong |
| 上午 | shàng wǔ | morning (before noon) | build, inv2 | daming |
| 下午 | xià wǔ | afternoon | build, inv2 | daming, west |
| 年 | nián | year | build, inv1 | daming, west, qushuiting, shanda, hospital |
| 号 | hào | date; number | build, inv2 | daming, west |
| 想 | xiǎng | to want; to think; to miss | build, hook | quancheng, west, shanda, kuanhouli, hospital |
| 能 | néng | can (able to) | build, challenge | daming, qianfo, west, qushuiting, hospital |
| 说 | shuō | to speak; to say | build, inv1 | furong, west, shanda, kuanhouli, hospital |
| 做 | zuò | to do; to make | build, payoff | furong |
| 多 | duō | many; much | build, inv1 | furong, daming, quancheng, west, qushuiting, kuanhouli, hospital |
| 很 | hěn | very | build, inv1 | furong, daming, quancheng, west, qushuiting, shanda, kuanhouli, hospital |
| 认识 | rèn shi | to know (someone); to recognize | build, payoff | furong, qianfo, qushuiting |
| 高兴 | gāo xìng | happy; glad | build, payoff | kuanhouli |
| 杯子 | bēi zi | cup; glass | build, hook | – |
| 手机 | shǒu jī | cell phone | build, inv2 | qushuiting |
| 的 | de | (possessive particle) 's | build, opening | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 了 | le | (marks a change or completed action) | build, hook | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 个 | gè | (general measure word) | build, hook | furong, daming, quancheng, qianfo, west, qushuiting, shanda, kuanhouli, hospital |
| 和 | hé | and; with | build, challenge | – |
| 也 | yě | also; too | build, challenge | qianfo, qushuiting, shanda |
| 都 | dōu | all; both | build, inv3 | furong, west, qushuiting, kuanhouli |
| 给 | gěi | to give; for | build, challenge | quancheng, west, kuanhouli, hospital |
| 吧 | ba | (suggestion particle) ...OK? | build, payoff | furong, quancheng, west, kuanhouli |
| 天 | tiān | day; sky | build, inv3 | furong, daming, qushuiting, kuanhouli, hospital |
| 知道 | zhī dào | to know; to become aware of | build, payoff | quancheng, qushuiting |
| 走 | zǒu | to walk | build, challenge | qianfo, kuanhouli |
| 谁 | shéi | who | build, challenge | – |
| 找 | zhǎo | to try to find | build, inv1 | furong, quancheng, shanda, kuanhouli |
| 还有 | hái yǒu | furthermore | build, payoff | – |
| 看到 | kàn dào | to see | build, payoff | – |
| 孩子 | hái zi | child | build, hook | qushuiting, kuanhouli, hospital |
| 拿 | ná | to hold | build, inv1 | – |
| 先 | xiān | first | build, hook | furong, qushuiting |
| 门 | mén | door; gate | build, inv2 | west |
| 书 | shū | book | build, inv2 | – |
| 看见 | kàn jiàn | to see | build, inv1 | daming, hospital |
| 白 | bái | white | build, hook | – |
| 西 | xī | west | build, inv3 | – |
| 回答 | huí dá | to reply; to answer | build, challenge | – |
| 东 | dōng | east | build, inv3 | – |
| 国 | guó | country; nation | build, inv1 | shanda |
| 南 | nán | south | build, inv3 | – |
| 北 | běi | north | build, inv3 | qianfo |
| 左边 | zuǒ bian | left | build, inv3 | qianfo |
| 门票 | mén piào | ticket | build, inv2 | – |
| 本子 | běn zi | notebook | build, opening | furong |
| 前边 | qián bian | in front | build, inv3 | qianfo |

### 4.2 Furong Street (59)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 好 | hǎo | good; well | notebook page 2: 那个水很甜。我的朋友都说，这个茶太好喝了！ | daming, quancheng, qushuiting, shanda, kuanhouli, hospital |
| 朋友 | péng you | friend | Hook: 来了！朋友，你要什么？ | daming, quancheng, kuanhouli |
| 六 | liù | six | Clue 2: 甜油旋 六块一个 | – |
| 钱 | qián | money | Clue 4: 马先生有很多钱，很多房子。 | quancheng, kuanhouli |
| 茶 | chá | tea | Hook: 我要两个油旋，一杯茶。 | qianfo, qushuiting, hospital |
| 吃 | chī | to eat | Clue 1: 老周天天来这儿吃早饭。他要一个油旋，一碗米饭？不是！一杯茶。 | hospital |
| 米饭 | mǐ fàn | rice (cooked) | Clue 1: 老周天天来这儿吃早饭。他要一个油旋，一碗米饭？不是！一杯茶。 | – |
| 面条 | miàn tiáo | noodles | theme (hand-placed) | – |
| 那 | nà | that | Hook: 你看！那个油旋，不是我的！ | quancheng, qianfo, shanda, kuanhouli, hospital |
| 哪儿 | nǎ r | where | notebook page 2: 那个地方在哪儿？你先吃一个油旋，再找吧。 | daming, qianfo, west, hospital |
| 在 | zài | at; in; to be (somewhere) | Hook: 我的本子没有了。我的油旋，都在本子里。 | daming, quancheng, qianfo, west, shanda, kuanhouli, hospital |
| 星期 | xīng qī | week | Clue 1: 孙师傅的本子？上个星期没有了。 | daming |
| 看 | kàn | to look; to watch; to read | Hook: 你看！那个油旋，不是我的！ | daming, quancheng, qianfo, kuanhouli, hospital |
| 写 | xiě | to write | Resolution: 你看，这是老周写的：“我的茶，要用那个水做，最好喝。” | daming, west, shanda, hospital |
| 买 | mǎi | to buy | Clue 3: 那个新的先生，他天天来这儿买油旋。 | quancheng, qianfo, shanda |
| 太 | tài | too; extremely | notebook page 2: 那个水很甜。我的朋友都说，这个茶太好喝了！ | quancheng, kuanhouli, hospital |
| 上 | shàng | up; upper | Clue 1: 孙师傅的本子？上个星期没有了。 | daming, qianfo, shanda |
| 里 | lǐ | inside | Hook: 我的本子没有了。我的油旋，都在本子里。 | west, qushuiting, shanda |
| 用 | yòng | to use | Resolution: 你看，这是老周写的：“我的茶，要用那个水做，最好喝。” | qushuiting, hospital |
| 两 | liǎng | two | Hook: 我要两个油旋，一杯茶。 | daming |
| 最 | zuì | most | Challenge: 我的油旋最好吃！你要几个？ | – |
| 再 | zài | again; once more | notebook page 2: 那个地方在哪儿？你先吃一个油旋，再找吧。 | – |
| 新 | xīn | new | Clue 3: 那个新的先生，他天天来这儿买油旋。 | qushuiting |
| 地方 | dì fāng | place | notebook page 2: 我的茶，不用趵突泉的水。我用一个老地方的水。 | – |
| 老 | lǎo | old | notebook page 2: 我的茶，不用趵突泉的水。我用一个老地方的水。 | daming, quancheng, qushuiting, shanda |
| 那些 | nà xiē | those | theme (untagged) | – |
| 有些 | yǒu xiē | some | theme (untagged) | – |
| 们 | men | (plural marker) | theme (numbers) | – |
| 干 | gān | to do | theme (food) | – |
| 先生 | xiān sheng | Mr.; sir; husband | Clue 3: 那个新的先生，他天天来这儿买油旋。 | – |
| 动 | dòng | to move | theme (untagged) | – |
| 杯 | bēi | cup (of) | Hook: 我要两个油旋，一杯茶。 | qianfo, hospital |
| 出去 | chū qù | to go out | theme (untagged) | – |
| 第 | dì | (ordinal prefix) No. | theme (basics) | – |
| 不用 | bù yòng | need not | notebook page 2: 我的茶，不用趵突泉的水。我用一个老地方的水。 | – |
| 电 | diàn | electricity | theme (untagged) | – |
| 房子 | fáng zi | house | Clue 4: 马先生有很多钱，很多房子。 | daming, qianfo, shanda, kuanhouli |
| 肉 | ròu | meat | theme (food) | – |
| 菜 | cài | dish; vegetable | theme (food) | – |
| 饿 | è | to be hungry | theme (food) | – |
| 上班 | shàng bān | to go to work | theme (basics) | – |
| 最好 | zuì hǎo | best | Resolution: 你看，这是老周写的：“我的茶，要用那个水做，最好喝。” | – |
| 有时候 | yǒu shí hou | sometimes | theme (untagged) | – |
| 一会儿 | yī huì r | a moment | theme (untagged) | – |
| 干什么 | gàn shén me | what are you doing? | theme (basics) | – |
| 奶 | nǎi | milk | theme (drinks) | – |
| 牛奶 | niú nǎi | cow's milk | theme (drinks) | – |
| 水果 | shuǐ guǒ | fruit | theme (food) | – |
| 鸡蛋 | jī dàn | egg | theme (food) | – |
| 坐下 | zuò xia | to sit down | theme (hand-placed) | – |
| 请问 | qǐng wèn | Excuse me, may I ask...? | theme (hand-placed) | – |
| 面包 | miàn bāo | bread | theme (food) | – |
| 好听 | hǎo tīng | pleasant to hear | theme (untagged) | – |
| 午饭 | wǔ fàn | lunch | theme (food) | – |
| 早饭 | zǎo fàn | breakfast | Clue 1: 老周天天来这儿吃早饭。他要一个油旋，一碗米饭？不是！一杯茶。 | – |
| 渴 | kě | thirsty | theme (drinks) | – |
| 请假 | qǐng jià | to request leave of absence | theme (untagged) | – |
| 包子 | bāo zi | steamed bun | theme (food) | – |
| 面条儿 | miàn tiáo r | noodles | theme (hand-placed) | – |

### 4.3 Daming Lake (59)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 二 | èr | two | Clue 4: 十点二十分 | – |
| 今天 | jīn tiān | today | Clue 2: 今天天气很好，是晴天。 | – |
| 明天 | míng tiān | tomorrow | Clue 2: 明天下雨吗？ | hospital |
| 昨天 | zuó tiān | yesterday | theme (time) | – |
| 中午 | zhōng wǔ | noon | theme (time) | – |
| 晚上 | wǎn shang | evening | theme (time) | – |
| 月 | yuè | month; moon | theme (time) | – |
| 日 | rì | day; sun | theme (time) | – |
| 坐 | zuò | to sit | notebook page 3: 晴天的时候，我坐船去大明湖。 | west |
| 天气 | tiān qì | weather | Clue 2: 今天天气很好，是晴天。 | – |
| 热 | rè | hot | theme (weather) | – |
| 下雨 | xià yǔ | to rain | Clue 1: 下雨，没有船。 | west |
| 从 | cóng | from | notebook page 3: 从船上，能看见济南的老房子。 | west |
| 时候 | shí hou | time | notebook page 3: 晴天的时候，我坐船去大明湖。 | quancheng, hospital |
| 时间 | shí jiān | time | Clue 2: 开船的是老潘的朋友。他的时间不对！ | – |
| 开 | kāi | to open; to drive | Hook: 船上午十点开。现在几点？ | quancheng, qushuiting |
| 进 | jìn | to go forward | theme (untagged) | – |
| 分 | fēn | minute; point | Clue 4: 十点二十分 | – |
| 帮 | bāng | to help | Clue 3: 你帮我看看，这个照片好看吗？ | – |
| 别人 | bié ren | other people; others | theme (basics) | – |
| 早 | zǎo | early | theme (time) | – |
| 错 | cuò | mistake | theme (untagged) | – |
| 晚 | wǎn | late; evening | theme (time) | – |
| 重 | zhòng | heavy | theme (untagged) | – |
| 半 | bàn | half | Clue 1: 上午九点 · 十点半 · 下午两点 · 四点 | – |
| 她们 | tā men | they | theme (basics) | – |
| 今年 | jīn nián | this year | theme (time) | – |
| 去年 | qù nián | last year | theme (time) | – |
| 回到 | huí dào | to return to | theme (untagged) | – |
| 差 | chà | poor; lacking | theme (weather) | – |
| 家里 | jiā lǐ | home | notebook page 3: 下雨的时候，我在家里看地图。 | quancheng |
| 常 | cháng | often | theme (untagged) | – |
| 风 | fēng | wind | theme (weather) | – |
| 生日 | shēng rì | birthday | theme (dates) | – |
| 一半 | yī bàn | half | theme (numbers) | – |
| 有时 | yǒu shí | sometimes | theme (time) | – |
| 慢 | màn | slow | theme (untagged) | – |
| 好看 | hǎo kàn | good-looking | Clue 3: 你帮我看看，这个照片好看吗？ | – |
| 雨 | yǔ | rain | theme (weather) | – |
| 下次 | xià cì | next time | theme (time) | – |
| 知识 | zhī shi | knowledge | theme (untagged) | – |
| 不对 | bù duì | incorrect | Clue 2: 开船的是老潘的朋友。他的时间不对！ | – |
| 门口 | mén kǒu | doorway | theme (untagged) | – |
| 上次 | shàng cì | last time | theme (time) | – |
| 新年 | xīn nián | New Year | theme (time) | – |
| 地图 | dì tú | map | Resolution: 这是老周的地图。在这儿十年了。 | – |
| 白天 | bái tiān | daytime | theme (time) | – |
| 晚饭 | wǎn fàn | evening meal | theme (time) | – |
| 日期 | rì qī | date | theme (dates) | – |
| 开会 | kāi huì | to hold a meeting | theme (untagged) | – |
| 放假 | fàng jià | to have a holiday or vacation | theme (dates) | – |
| 放学 | fàng xué | to dismiss students at the end of the school day | theme (time) | – |
| 半天 | bàn tiān | half of the day | theme (time) | – |
| 前天 | qián tiān | the day before yesterday | theme (time) | – |
| 后天 | hòu tiān | the day after tomorrow | theme (time) | – |
| 星期日 | xīng qī rì | Sunday | theme (dates) | – |
| 半年 | bàn nián | half a year | theme (time) | – |
| 一下儿 | yī xià r | erhua variant of 一下 | theme (time) | – |
| 有一些 | yǒu yī xiē | somewhat | theme (untagged) | – |

### 4.4 Quancheng Square (58)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 我们 | wǒ men | we; us | Resolution: 我们一起买！ | qianfo, qushuiting, kuanhouli, hospital |
| 八 | bā | eight; 8 | Hook: 八百八十块？太贵了！ | shanda |
| 多少 | duō shǎo | how many; how much | Clue 1: 这个衣服多少钱？ | shanda |
| 商店 | shāng diàn | store; shop | theme (shopping) | – |
| 大 | dà | big | Clue 1: 你要大的还是小的？ | qianfo, hospital |
| 小 | xiǎo | small | Clue 1: 你要大的还是小的？ | – |
| 工作 | gōng zuò | to work; job | theme (untagged) | – |
| 衣服 | yī fu | clothes | Clue 1: 这个衣服多少钱？ | – |
| 就 | jiù | then; right away | notebook page 4: 别给他太多钱。八十八块就很好。 | qianfo, shanda, kuanhouli, hospital |
| 着 | zhe | (ongoing action particle) | theme (untagged) | – |
| 他们 | tā men | they | theme (basics) | – |
| 真 | zhēn | really | theme (untagged) | – |
| 事 | shì | thing; matter | theme (untagged) | – |
| 怎么 | zěn me | how? | theme (basics) | – |
| 地 | dì | ground; land | theme (untagged) | – |
| 快 | kuài | fast | theme (untagged) | – |
| 比 | bǐ | compared to; than | theme (untagged) | – |
| 还是 | hái shi | or; still | Clue 1: 你要大的还是小的？ | – |
| 觉得 | jué de | to think that ...; to feel that ... | theme (basics) | – |
| 起来 | qǐ lai | to get up | theme (untagged) | – |
| 一起 | yī qǐ | together | Resolution: 我们一起买！ | qianfo, qushuiting, kuanhouli |
| 起 | qǐ | to rise | theme (untagged) | – |
| 一些 | yī xiē | some | theme (numbers) | – |
| 找到 | zhǎo dào | to find | notebook page 4: 你找到了吗？那太好了！ | – |
| 非常 | fēi cháng | very; really | theme (untagged) | – |
| 别 | bié | don't; other | notebook page 4: 别给他太多钱。八十八块就很好。 | qushuiting, hospital |
| 重要 | zhòng yào | important | notebook page 4: 这个钥匙很重要。 | – |
| 得到 | dé dào | to get | theme (untagged) | – |
| 您 | nín | you | Hook: 您好！ | – |
| 送 | sòng | to give (a gift); to deliver | theme (shopping) | – |
| 女人 | nǚ rén | woman | theme (untagged) | – |
| 男人 | nán rén | man | theme (untagged) | – |
| 穿 | chuān | to wear | theme (shopping) | – |
| 回来 | huí lai | to return; to come back | notebook page 4: 我没有钱的时候，给了一个朋友。我想买回来。 | qianfo |
| 别的 | bié de | else | theme (untagged) | – |
| 真的 | zhēn de | really, truly, indeed | theme (untagged) | – |
| 元 | yuán | yuan (currency) | theme (money) | – |
| 包 | bāo | bag | theme (shopping) | – |
| 忙 | máng | busy | theme (untagged) | – |
| 试 | shì | to try | theme (shopping) | – |
| 教 | jiào | to teach | theme (untagged) | – |
| 坏 | huài | bad | theme (untagged) | – |
| 小姐 | xiǎo jie | Miss; young lady | theme (hand-placed) | – |
| 进去 | jìn qù | to go in | theme (untagged) | – |
| 生气 | shēng qì | to get angry | theme (untagged) | – |
| 贵 | guì | expensive | Hook: 八百八十块？太贵了！ | – |
| 工人 | gōng rén | worker | theme (untagged) | – |
| 百 | bǎi | hundred | Hook: 八百八十块？太贵了！ | – |
| 听见 | tīng jiàn | to hear | theme (untagged) | – |
| 零 | líng | zero | theme (hand-placed) | – |
| 商场 | shāng chǎng | shopping mall | theme (shopping) | – |
| 钱包 | qián bāo | purse | theme (money) | – |
| 有用 | yǒu yòng | useful | theme (untagged) | – |
| 机票 | jī piào | air ticket | theme (money) | – |
| 一点儿 | yī diǎn r | a little | Clue 3: 太贵了！便宜一点儿吧！ | – |
| 书店 | shū diàn | bookstore | theme (hand-placed) | – |
| 车票 | chē piào | ticket (bus or train) | theme (money) | – |
| 一块儿 | yī kuài r | together | theme (money) | – |

### 4.5 Qianfo Mountain (58)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 家 | jiā | home; family | notebook page 5: 那个七十三，就在我家对面。 | shanda, kuanhouli |
| 那儿 | nà r | there | theme (directions) | – |
| 对 | duì | right; correct | theme (directions) | – |
| 到 | dào | to reach; to arrive | Clue 2: 往前走，到路口，往左走。 | west |
| 还 | hái | still | Hook: 一个老人上山了，现在还没回来。 | – |
| 没 | méi | have not; not | Hook: 一个老人上山了，现在还没回来。 | – |
| 下 | xià | down | theme (directions) | – |
| 中 | zhōng | within; among | theme (directions) | – |
| 前 | qián | front | Clue 2: 往前走，到路口，往左走。 | qushuiting |
| 这里 | zhè lǐ | here | theme (directions) | – |
| 一样 | yī yàng | same | notebook page 5: 你看我的照片。是不是一样？ | – |
| 放 | fàng | to put | theme (places) | – |
| 高 | gāo | high | theme (directions) | – |
| 正 | zhèng | just; straight | theme (directions) | – |
| 花 | huā | flower | theme (untagged) | – |
| 男 | nán | male | theme (numbers) | – |
| 远 | yuǎn | far | theme (directions) | – |
| 哪里 | nǎ lǐ | where? | theme (directions) | – |
| 那里 | nà li | there; that place | theme (directions) | – |
| 飞 | fēi | to fly | theme (untagged) | – |
| 马上 | mǎ shàng | at once | theme (directions) | – |
| 听到 | tīng dào | to hear | theme (untagged) | – |
| 票 | piào | ticket | Clue 1: 上山的票，三十块。 | – |
| 认真 | rèn zhēn | conscientious | theme (untagged) | – |
| 山 | shān | mountain; hill | Hook: 一个老人上山了，现在还没回来。 | – |
| 累 | lèi | tired | Challenge: 我不累！我能走！ | hospital |
| 有的 | yǒu de | some | theme (directions) | – |
| 左 | zuǒ | left | Clue 2: 往前走，到路口，往左走。 | – |
| 动作 | dòng zuò | movement; motion | theme (untagged) | – |
| 树 | shù | tree | Clue 2: 他在山上，大树旁边。 | – |
| 右 | yòu | right; right-hand side | theme (hand-placed) | – |
| 没什么 | méi shén me | nothing | theme (untagged) | – |
| 旁边 | páng biān | side; adjacent place | Clue 2: 他在山上，大树旁边。 | – |
| 中间 | zhōng jiān | the middle; the inside | theme (directions) | – |
| 地点 | dì diǎn | place | theme (places) | – |
| 地上 | dì shang | on the ground | theme (untagged) | – |
| 老人 | lǎo rén | elderly person | Hook: 一个老人上山了，现在还没回来。 | – |
| 那边 | nà bian | over there | theme (directions) | – |
| 网上 | wǎng shàng | online | theme (untagged) | – |
| 是不是 | shì bù shì | is or isn't | notebook page 5: 你看我的照片。是不是一样？ | – |
| 常常 | cháng cháng | frequently | Resolution: 老周？我认识他！我们星期天常常一起爬山。 | west |
| 这边 | zhè biān | this side | theme (directions) | – |
| 右边 | yòu bian | right side | notebook page 5: 左边是大明湖，右边是曲水亭街。 | – |
| 哪些 | nǎ xiē | which ones? | theme (basics) | – |
| 小学 | xiǎo xué | elementary school; primary school | theme (places) | – |
| 中学 | zhōng xué | middle school | theme (directions) | – |
| 不大 | bù dà | not very | theme (basics) | – |
| 路口 | lù kǒu | crossing | Clue 2: 往前走，到路口，往左走。 | – |
| 星期天 | xīng qī tiān | Sunday | Resolution: 老周？我认识他！我们星期天常常一起爬山。 | – |
| 洗手间 | xǐ shǒu jiān | toilet | theme (places) | – |
| 小学生 | xiǎo xué shēng | primary school student | theme (places) | – |
| 后边 | hòu bian | behind | theme (hand-placed) | – |
| 西边 | xī biān | west side | theme (directions) | – |
| 上边 | shàng bian | above; on top | theme (directions) | – |
| 东边 | dōng bian | east side | Clue 3: 东边 | – |
| 南边 | nán bian | south side | theme (directions) | – |
| 北边 | běi biān | north side | Clue 3: 北边 | – |
| 下边 | xià bian | below; under | theme (directions) | – |

### 4.6 Jinan West Station (35)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 饭店 | fàn diàn | restaurant; hotel | theme (travel) | – |
| 回 | huí | to return; to go back | theme (hand-placed) | – |
| 开车 | kāi chē | to drive a car | theme (transport) | – |
| 等 | děng | to wait | Resolution: 老周常常坐我的车。去车站。他在车站等一个人。 | shanda, hospital |
| 这些 | zhè xiē | these | Clue 4: 这些信，都是给泉的！ | – |
| 跟 | gēn | with; to follow | Hook: 我跟你说，这不是他的行李！ | kuanhouli |
| 车 | chē | car | Clue 1: 从北京到济南 · 下午四点 · 五号车 | – |
| 问 | wèn | to ask | notebook page 6: 我不能告诉你。你去问张老师吧。 | – |
| 告诉 | gào sù | to tell | notebook page 6: 我不能告诉你。你去问张老师吧。 | hospital |
| 行 | xíng | OK; capable | theme (travel) | – |
| 国家 | guó jiā | country; nation | theme (travel) | – |
| 小时 | xiǎo shí | hour | Clue 4: 你从哪儿来？坐了几个小时？ | – |
| 站 | zhàn | station | theme (transport) | – |
| 路 | lù | road | theme (transport) | – |
| 外 | wài | outside | theme (travel) | – |
| 汽车 | qì chē | car | theme (transport) | – |
| 飞机 | fēi jī | airplane | theme (transport) | – |
| 回去 | huí qu | to return | theme (hand-placed) | – |
| 打开 | dǎ kāi | to open | theme (transport) | – |
| 路上 | lù shang | on the road | theme (transport) | – |
| 车上 | chē shàng | in the car | theme (transport) | – |
| 机场 | jī chǎng | airport; airfield | theme (transport) | – |
| 火车 | huǒ chē | train | theme (transport) | – |
| 下班 | xià bān | to finish work | theme (transport) | – |
| 国外 | guó wài | abroad | theme (travel) | – |
| 外国 | wài guó | foreign | theme (travel) | – |
| 车站 | chē zhàn | station | Resolution: 老周常常坐我的车。去车站。他在车站等一个人。 | – |
| 北京 | běi jīng | Beijing | theme (hand-placed) | – |
| 上车 | shàng chē | to get on (a vehicle) | theme (transport) | – |
| 马路 | mǎ lù | street | theme (transport) | – |
| 下车 | xià chē | to get off (a vehicle) | theme (transport) | – |
| 里边 | lǐ bian | inside | Hook: 里边都是信！ | – |
| 外语 | wài yǔ | foreign language | theme (travel) | – |
| 外边 | wài bian | outside | theme (travel) | – |
| 打车 | dǎ chē | to take a taxi | theme (transport) | – |

### 4.7 Qushuiting Street (42)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 喜欢 | xǐ huan | to like; to be fond of | Challenge: 你喜欢这个院子吗？ | kuanhouli |
| 会 | huì | can (learned skill); will | Clue 3: 孩子，你会用手机吗？ | shanda, hospital |
| 少 | shǎo | few; little | notebook page 7: 后来，井里没有水了。我也很少喝茶了。 | – |
| 爸爸 | bà ba | dad | theme (family) | – |
| 妈妈 | mā ma | mom | theme (family) | – |
| 儿子 | ér zi | son | theme (family) | – |
| 家人 | jiā rén | family member | Clue 2: 老周没有家人。我们都是他的家人。 | kuanhouli |
| 住 | zhù | to live (somewhere); to stay | Clue 1: 后来，没有人住，井也没有水了。 | – |
| 东西 | dōng xī | thing; stuff | Clue 4: 这是老周的东西。 | – |
| 后 | hòu | after; behind | Clue 1: 后来，没有人住，井也没有水了。 | shanda, hospital |
| 女 | nǚ | female | theme (family) | – |
| 妈 | mā | mom | theme (family) | – |
| 回家 | huí jiā | to return home | theme (home) | – |
| 子 | zǐ | child; son | theme (family) | – |
| 楼 | lóu | building; floor | theme (home) | – |
| 电视 | diàn shì | television; TV | theme (home) | – |
| 电脑 | diàn nǎo | computer | theme (home) | – |
| 床 | chuáng | bed | theme (home) | – |
| 哥 | gē | elder brother | theme (family) | – |
| 爸 | bà | father | theme (family) | – |
| 洗 | xǐ | to wash; to bathe | theme (home) | – |
| 房间 | fáng jiān | room | theme (home) | – |
| 姐姐 | jiě jie | older sister | theme (family) | – |
| 哥哥 | gē ge | older brother | theme (family) | – |
| 妹妹 | mèi mei | younger sister | theme (family) | – |
| 弟弟 | dì di | younger brother | theme (family) | – |
| 干净 | gān jìng | clean | theme (home) | – |
| 在家 | zài jiā | to be at home | theme (home) | – |
| 妹 | mèi | younger sister | theme (family) | – |
| 起床 | qǐ chuáng | to get out of bed | theme (home) | – |
| 奶奶 | nǎi nai | grandma | theme (family) | – |
| 爷爷 | yé ye | grandpa | theme (family) | – |
| 姐 | jiě | older sister | theme (family) | – |
| 桌子 | zhuō zi | table | theme (home) | – |
| 楼下 | lóu xià | downstairs | theme (hand-placed) | – |
| 小朋友 | xiǎo péng yǒu | child | theme (family) | – |
| 楼上 | lóu shàng | upstairs | theme (hand-placed) | – |
| 弟 | dì | younger brother | theme (family) | – |
| 电视机 | diàn shì jī | television set | theme (home) | – |
| 关上 | guān shàng | to close | theme (home) | – |
| 小孩儿 | xiǎo hái r | child | theme (family) | – |
| 男孩儿 | nán hái r | boy | theme (hand-placed) | – |

### 4.8 Shandong University (47)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 你们 | nǐ men | you (plural) | Hook: 你们去找一个老照片，在班上说一说。 | kuanhouli |
| 中文 | Zhōng wén | Chinese (language) | Resolution: 你说的中文很好！ | – |
| 老师 | lǎo shī | teacher | theme (school) | – |
| 学生 | xué sheng | student | theme (school) | – |
| 学校 | xué xiào | school | theme (school) | – |
| 听 | tīng | to listen | theme (study) | – |
| 女儿 | nǚ ér | daughter | Clue 4: 何家的女儿，她叫何泉。 | – |
| 电话 | diàn huà | telephone | Clue 1: 你叫什么名字？你是哪国人？你的电话是多少？ | – |
| 呢 | ne | (question particle) and ...? | Clue 3: 你会写“井”吗？“泉”呢？ | – |
| 爱 | ài | to love; to be fond of | notebook page 8: 以前，我很年轻。我爱一个女孩儿。 | – |
| 话 | huà | words; speech | theme (study) | – |
| 本 | běn | (measure word for books) | theme (study) | – |
| 岁 | suì | years old | Clue 4: 她十八岁。她很年轻！ | – |
| 学 | xué | to learn | theme (school) | – |
| 间 | jiān | (measure word for rooms) | theme (study) | – |
| 明白 | míng bai | to understand | theme (study) | – |
| 记得 | jì de | to remember | theme (study) | – |
| 学习 | xué xí | to learn | theme (school) | – |
| 大学 | dà xué | university | theme (school) | – |
| 忘 | wàng | to forget | theme (study) | – |
| 记 | jì | to remember; to record | theme (study) | – |
| 关 | guān | to close; to turn off | notebook page 8: 因为她家去了北京，井也关了。 | – |
| 班 | bān | class; shift | Hook: 你们去找一个老照片，在班上说一说。 | – |
| 忘记 | wàng jì | to forget | theme (study) | – |
| 课 | kè | class; lesson | theme (school) | – |
| 考试 | kǎo shì | to take an exam | theme (school) | – |
| 女生 | nǚ shēng | schoolgirl | theme (school) | – |
| 考 | kǎo | to take a test | theme (school) | – |
| 记住 | jì zhu | to remember | theme (hand-placed) | – |
| 学院 | xué yuàn | college | theme (school) | – |
| 页 | yè | page | theme (school) | – |
| 男生 | nán shēng | schoolboy | theme (school) | – |
| 上学 | shàng xué | to go to school | theme (school) | – |
| 上课 | shàng kè | to go to class | theme (school) | – |
| 图书馆 | tú shū guǎn | library | theme (school) | – |
| 大学生 | dà xué shēng | university student | theme (school) | – |
| 下课 | xià kè | to finish class | theme (school) | – |
| 书包 | shū bāo | schoolbag | theme (hand-placed) | – |
| 中学生 | zhōng xué shēng | middle-school student | theme (school) | – |
| 课本 | kè běn | textbook | theme (school) | – |
| 汉语 | hàn yǔ | Chinese (language) | theme (study) | – |
| 女孩儿 | nǚ hái r | girl | notebook page 8: 以前，我很年轻。我爱一个女孩儿。 | – |
| 汉字 | hàn zì | Chinese character | theme (study) | – |
| 教学楼 | jiào xué lóu | teaching block | theme (school) | – |
| 课文 | kè wén | text | theme (hand-placed) | – |
| 请坐 | qǐng zuò | please, have a seat | Hook: 你好！请坐。 | – |
| 听写 | tīng xiě | dictation | theme (hand-placed) | – |

### 4.9 Kuanhouli (45)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 再见 | zài jiàn | goodbye | theme (plans) | – |
| 不客气 | bù kè qi | you're welcome | theme (invitations) | – |
| 医院 | yī yuàn | hospital | notebook page 9: 最后一个人，在医院。去看她吧。 | hospital |
| 读 | dú | to read (aloud); to study | theme (hobbies) | – |
| 过 | guò | to pass; (past experience) | theme (plans) | – |
| 出 | chū | to go out | theme (invitations) | – |
| 打 | dǎ | to hit; to play | theme (hobbies) | – |
| 见 | jiàn | to see; to meet | theme (friends) | – |
| 出来 | chū lái | to come out | theme (invitations) | – |
| 最后 | zuì hòu | last; finally | notebook page 9: 最后一个人，在医院。去看她吧。 | – |
| 准备 | zhǔn bèi | to prepare | theme (plans) | – |
| 笑 | xiào | to laugh; to smile | theme (social) | – |
| 正在 | zhèng zài | in the middle of (doing) | theme (plans) | – |
| 球 | qiú | ball | theme (hobbies) | – |
| 第二 | dì èr | second | theme (plans) | – |
| 难 | nán | difficult | notebook page 9: 一个人找泉，太难了。 | – |
| 电影 | diàn yǐng | movie; film | theme (hobbies) | – |
| 跑 | pǎo | to run | theme (hobbies) | – |
| 歌 | gē | song | theme (hobbies) | – |
| 介绍 | jiè shào | to introduce | theme (social) | – |
| 唱 | chàng | to sing | theme (hobbies) | – |
| 说话 | shuō huà | to speak | theme (friends) | – |
| 来到 | lái dào | to arrive; to come | theme (invitations) | – |
| 打电话 | dǎ diàn huà | to make a telephone call | theme (friends) | – |
| 一边 | yī biān | one side; while | theme (hand-placed) | – |
| 吃饭 | chī fàn | to have a meal | Hook: 走吧！我们一起去吃饭！ | hospital |
| 同学 | tóng xué | classmate | theme (friends) | – |
| 帮忙 | bāng máng | to help | theme (hand-placed) | – |
| 进来 | jìn lái | to come in | theme (invitations) | – |
| 见面 | jiàn miàn | to meet; to see each other | theme (friends) | – |
| 明年 | míng nián | next year | theme (plans) | – |
| 唱歌 | chàng gē | to sing a song | Clue 2: 你喜欢唱歌吗？ | – |
| 女朋友 | nǚ péng you | girlfriend | theme (friends) | – |
| 男朋友 | nán péng you | boyfriend | theme (friends) | – |
| 读书 | dú shū | to read a book | theme (hobbies) | – |
| 开玩笑 | kāi wán xiào | to play a joke | theme (hobbies) | – |
| 上网 | shàng wǎng | to go online | theme (hand-placed) | – |
| 爱好 | ài hào | hobby | theme (hobbies) | – |
| 打球 | dǎ qiú | to play ball | theme (hobbies) | – |
| 玩儿 | wán r | to play | theme (hobbies) | – |
| 电影院 | diàn yǐng yuàn | cinema; movie theater | theme (hobbies) | – |
| 没事儿 | méi shì r | it's nothing; no problem | theme (plans) | – |
| 请进 | qǐng jìn | please come in | theme (invitations) | – |
| 好玩儿 | hǎo wán r | fun | theme (hobbies) | – |
| 网友 | wǎng yǒu | online friend | theme (friends) | – |

### 4.10 Provincial Hospital (20)

| Word | Pinyin | English | Met first | Used again |
| --- | --- | --- | --- | --- |
| 没关系 | méi guān xi | it's OK; no problem | Clue 2: 没关系，别想太多。 | – |
| 冷 | lěng | cold | theme (health) | – |
| 医生 | yī shēng | doctor | theme (health) | – |
| 次 | cì | time (occurrence) | Clue 3: 一天三次，一次一个，吃饭后吃。 | – |
| 手 | shǒu | hand | theme (body) | – |
| 请 | qǐng | please; to invite | notebook page 10: 请你给她一杯茶，用我们的水。 | – |
| 身上 | shēn shang | on the body | theme (health) | – |
| 睡 | shuì | to sleep | theme (health) | – |
| 口 | kǒu | mouth | theme (body) | – |
| 身体 | shēn tǐ | body; health | notebook page 10: 她身体好吗？她吃药了吗？ | – |
| 病 | bìng | illness | theme (health) | – |
| 字 | zì | character (writing) | Clue 4: 这个字……是老周写的！ | – |
| 睡觉 | shuì jiào | to go to bed | theme (health) | – |
| 病人 | bìng rén | sick person | Challenge: 现在不能看病人。你明天几点来？ | – |
| 休息 | xiū xi | rest | Clue 2: 多喝水，多休息。 | – |
| 毛 | máo | hair; 0.1 yuan | theme (body) | – |
| 生病 | shēng bìng | to fall ill | theme (health) | – |
| 走路 | zǒu lù | to walk | theme (body) | – |
| 有名 | yǒu míng | famous | theme (health) | – |
| 看病 | kàn bìng | to visit a doctor | theme (health) | – |

<!-- coverage:end -->

---

## 5. Files

| File | What it is |
| --- | --- |
| `tools/coverage.js` | The script |
| `tools/data/baotu-built.json` | Snapshot of Baotu's words from the build |
| `tools/data/overrides.json` | The 23 hand placements |
| `tools/out/coverage.json` | Machine-readable result: each word's district, how it was placed, first line and other uses. The build can read this |
