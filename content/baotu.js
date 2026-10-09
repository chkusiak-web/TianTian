// Baotu Spring arc (CONCEPT §5.1): the opening, six beats, notebook page 1.
// Every Chinese string here is checked by `npm run check` (HSK 1 + names + particles + Baotu's taught words),
// and each beat's new words must be the answer to at least one prompt in its scene (§6.10).
//
// Scene steps:
//   { npc, zh, en }                                   a line someone says
//   { ask: 'listen' | 'read', npc, zh, en, label, q, options, answer }
//                                                     they say (listen) or show (read) zh; you pick the answer
//   { build: true, npc, zh?, en?, label, q, answer, extra, accept?, optional? }
//                                                     you build `answer` from word tiles (its words + `extra`).
//                                                     `accept`: other right answers. Close answers also count
//                                                     (src/session/close.js): a repeated word said once, 吧/啊/呀/呢,
//                                                     and words listed in `optional` may be left out or added.
//   { note }                                          English narration between lines
// A unit (the opening or a beat) can be split into `parts`, each one session: { id, title, en, intro?, words, use }.
// `intro` is the story card that leads into a later part.
//   at: 'station' | 'road' | 'home'                   (opening only) moves the taxi on the arrival map (src/ui/arrival.js)
import W from './baotu-words.json' with { type: 'json' };

const words = Object.fromEntries(W.beats.map((b) => [b.id, b.words]));

export default {
  district: 'baotu',

  // The opening and the Hook are split into two sessions each, 4–8 new words apiece (Moondog, Oct 9: "Split scenes";
  // CONCEPT §2.1 says 5–8). A unit's `parts` are played in order; its `words` are all its parts' words.
  opening: {
    id: 'opening',
    title: 'Arrival',
    en: 'You arrive in Jinan. Old Pan drives you from the station; Teacher Zhang is waiting with a key.',
    words: words.opening,
    parts: [
      {
        id: 'taxi',
        title: 'Arrival · Old Pan\'s taxi',
        en: 'Jinan West Station. A taxi driver who never stops talking.',
        words: ['你好', '你', '是', '吗', '不', '我'],
        use: {
          place: 'Jinan West Station, then Old Pan\'s taxi',
          steps: [
            { at: 'station', note: 'Jinan West Station. A taxi driver waves you over and talks the whole way.' },
            { npc: 'pan', zh: '你好！你好！', en: 'Hello! Hello!' },
            { build: true, npc: 'pan', label: 'Speaking · greet Old Pan', q: 'Say hello back.', answer: '你好！', extra: ['我', '不'] },
            { npc: 'pan', zh: '我是老潘。', en: 'I\'m Old Pan.' },
            { build: true, npc: 'pan', label: 'Speaking · check his name', q: 'Ask him: are you Old Pan?', answer: '你是老潘吗？', extra: ['我', '不'] },
            { npc: 'pan', zh: '是！我是老潘！', en: 'Yes! I\'m Old Pan!' },
            { ask: 'listen', npc: 'pan', zh: '你是老周吗？', en: 'Are you Old Zhou?', label: 'Listening · answer Old Pan', q: 'Old Pan asks you something. Answer him.', options: ['是。', '不是。'], answer: '不是。' },
            { build: true, npc: 'pan', label: 'Speaking · set him straight', q: 'Say: I\'m not Old Zhou.', answer: '我不是老周。', extra: ['你', '吗'] },
            { npc: 'pan', zh: '哦，你不是老周。', en: 'Oh, you\'re not Old Zhou.' },
            { at: 'road', note: 'The taxi turns toward the old town. Old Pan goes quiet, then starts counting.' }
          ]
        }
      },
      {
        id: 'gate',
        title: 'Arrival · the courtyard gate',
        intro: 'The taxi rattles into the old town. Old Pan is muttering a number under his breath.',
        en: 'Qushuiting Street. An old man with a white beard is waiting with a key.',
        words: ['七', '十', '三', '这', '的', '本子', '谢谢'],
        use: {
          place: 'At the courtyard gate on Qushuiting Street',
          steps: [
            { at: 'road', npc: 'pan', zh: '老周……七十三……七十三！', en: 'Old Zhou… seventy-three… seventy-three!' },
            { ask: 'listen', npc: 'pan', zh: '七十三！', en: 'Seventy-three!', label: 'Listening · Old Pan\'s number', q: 'Which number does Old Pan keep saying?', options: ['七十三', '三十七', '十三'], answer: '七十三' },
            { at: 'home', npc: 'pan', zh: '这是曲水亭街。谢谢你！', en: 'This is Qushuiting Street. Thank you!' },
            { note: 'An old man with a white beard is waiting at a courtyard gate. He has a key, and an old notebook.' },
            { npc: 'zhang', zh: '你好！我是张老师。', en: 'Hello! I\'m Teacher Zhang.' },
            { build: true, npc: 'zhang', label: 'Speaking · ask about the notebook', q: 'Ask him: is this Old Zhou\'s notebook?', answer: '这是老周的本子吗？', extra: ['你', '我'] },
            { npc: 'zhang', zh: '是。这是老周的本子。', en: 'Yes. This is Old Zhou\'s notebook.' },
            { ask: 'listen', npc: 'zhang', zh: '这是老周的本子。', en: 'This is Old Zhou\'s notebook.', label: 'Listening · whose notebook?', q: 'Whose notebook is it?', options: ['老周的本子', '张老师的本子', '老潘的本子'], answer: '老周的本子' },
            { npc: 'zhang', zh: '这是你的。', en: 'It\'s yours.' },
            { build: true, npc: 'zhang', label: 'Speaking · thank him', q: 'Thank him.', answer: '谢谢你！', accept: ['谢谢！'], extra: ['不', '你好'] },
            { build: true, npc: 'zhang', label: 'Speaking · hold the notebook', q: 'Say: this is my notebook.', answer: '这是我的本子。', extra: ['你', '不', '吗'] },
            { note: 'You open the notebook. Almost every page is a smudge of ink. One line is clear.' }
          ]
        }
      }
    ]
  },

  beats: [
    {
      id: 'hook',
      title: 'Hook · Grandma Wang\'s thermos',
      npc: 'wang',
      en: 'Morning at the spring. An old woman by the railing is upset.',
      words: words.hook,
      parts: [
        {
          id: 'hook1',
          title: 'Hook · the lost cup',
          en: 'Morning at the spring. An old woman by the railing is upset.',
          words: ['孩子', '杯子', '没有', '了', '一', '个', '白'],
          use: {
            place: 'By the railing at Baotu Spring, early morning',
            steps: [
              { ask: 'listen', npc: 'wang', zh: '孩子，你好！', en: 'Hello, child!', label: 'Listening · what does she call you?', q: 'What does she call you?', options: ['孩子', '杯子', '本子'], answer: '孩子' },
              { npc: 'wang', zh: '我是王奶奶。我的杯子没有了！', en: 'I\'m Grandma Wang. My cup is gone!' },
              { note: 'She means her thermos. Here, a thermos is just a 杯子, a cup.' },
              { ask: 'listen', npc: 'wang', zh: '我的杯子没有了！', en: 'My cup is gone!', label: 'Listening · what did Grandma lose?', q: 'What did Grandma Wang lose?', options: ['杯子', '本子', '孩子'], answer: '杯子' },
              { ask: 'listen', npc: 'wang', zh: '没有了！没有了！', en: 'Gone! Gone!', label: 'Listening · what happened?', q: 'What happened to it?', options: ['没有了', '是我的', '是白的'], answer: '没有了' },
              { npc: 'wang', zh: '是一个白杯子。', en: 'It\'s a white cup.' },
              { ask: 'read', npc: 'wang', zh: '是一个白杯子。', en: 'It\'s a white cup.', label: 'Reading · which cup?', q: 'Which one is hers?', options: ['一个白杯子', '一个白本子', '三个白杯子'], answer: '一个白杯子' },
              { build: true, npc: 'wang', label: 'Speaking · comfort her', q: 'Say: a white cup? I don\'t have it.', answer: '一个白杯子？我没有。', extra: ['你', '是'] },
              { npc: 'wang', zh: '孩子，你没有。', en: 'Child, you don\'t have it.' }
            ]
          }
        },
        {
          id: 'hook2',
          title: 'Hook · you first',
          intro: 'Grandma Wang dries her eyes and points at the bubbling water.',
          en: 'Grandma Wang shows you the spring, and wants her cup back.',
          words: ['泉', '想', '要', '先'],
          use: {
            place: 'By the railing at Baotu Spring',
            steps: [
              { npc: 'wang', zh: '孩子，这是泉。', en: 'Child, this is the spring.' },
              { ask: 'read', npc: 'wang', zh: '孩子，这是……', en: 'Child, this is…', label: 'Reading · what is this?', q: 'She points at the bubbling water. What is it?', options: ['泉', '杯子', '本子'], answer: '泉' },
              { ask: 'listen', npc: 'wang', zh: '我想要我的杯子！', en: 'I want my cup!', label: 'Listening · what does she want?', q: 'What does she want?', options: ['想要杯子', '没有杯子', '不要杯子'], answer: '想要杯子' },
              { build: true, npc: 'wang', label: 'Speaking · say it back', q: 'Show you understood: "You want your cup."', answer: '你想要你的杯子。', extra: ['我', '泉'] },
              { npc: 'wang', zh: '孩子，你先。', en: 'Child, you first.' },
              { note: 'She steps back from the railing so you can look first.' },
              { build: true, npc: 'wang', label: 'Speaking · be polite', q: 'Be polite: "No, no, you first!"', answer: '不，不，你先！', extra: ['我', '是'] },
              { npc: 'wang', zh: '哈哈！谢谢你，孩子！', en: 'Haha! Thank you, child!' },
              { note: 'Quest: find Grandma Wang\'s white cup. Someone at the tai chi square might have seen it.' }
            ]
          }
        }
      ]
    },
    { id: 'inv1', title: 'Investigate 1 · tai chi group', npc: 'zhang', words: words.inv1, use: null },
    { id: 'inv2', title: 'Investigate 2 · ticket window', npc: 'chen', words: words.inv2, use: null },
    { id: 'inv3', title: 'Investigate 3 · fish pool and Gate 4', npc: 'xie', words: words.inv3, use: null },
    { id: 'challenge', title: 'Challenge · Lele\'s riddle duel', npc: 'lele', words: words.challenge, use: null },
    { id: 'payoff', title: 'Resolution + notebook page 1', npc: 'wang', words: words.payoff, use: null }
  ],

  // Old Zhou's notebook, page 1 (§5.1). One entry per sentence; a sentence comes into focus when all its words are caught.
  notebook: {
    page: 1,
    lines: [
      { zh: '孩子：你好！', en: 'Child: hello!' },
      { zh: '我是老周。', en: 'I am Old Zhou.' },
      { zh: '你看到这个本子，我很高兴。', en: 'You\'ve found this notebook, and I\'m very glad.' },
      { zh: '济南有七十二名泉。', en: 'Jinan has seventy-two famous springs.' },
      { zh: '你知道吗？', en: 'Did you know?' },
      { zh: '还有一个泉。', en: 'There is one more spring.' },
      { zh: '七十三。', en: 'Seventy-three.' },
      { zh: '我找了很多年。', en: 'I looked for it for many years.' },
      { zh: '现在，你来找吧。', en: 'Now it\'s your turn to look.' },
      { zh: '先去认识王奶奶。', en: 'First, go and meet Grandma Wang.' },
      { zh: '她做的饭很好吃。', en: 'Her cooking is delicious.' }
    ]
  }
};
