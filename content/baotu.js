// Baotu Spring arc (CONCEPT §5.1): the opening, six beats, notebook page 1.
// Every Chinese string here is checked by `npm run check` (HSK 1 + names + particles + Baotu's taught words),
// and each beat's new words must be the answer to at least one prompt in its scene (§6.10).
//
// Scene steps:
//   { npc, zh, en }                                   a line someone says
//   { ask: 'listen' | 'read', npc, zh, en, label, q, options, answer }
//                                                     they say (listen) or show (read) zh; you pick the answer
//   { build: true, npc, zh?, en?, label, q, answer, extra }
//                                                     you build `answer` from word tiles (its words + `extra`)
//   { note }                                          English narration between lines
import W from './baotu-words.json' with { type: 'json' };

const words = Object.fromEntries(W.beats.map((b) => [b.id, b.words]));

export default {
  district: 'baotu',

  opening: {
    id: 'opening',
    title: 'Arrival',
    en: 'You arrive in Jinan. Old Pan drives you from the station; Teacher Zhang is waiting with a key.',
    words: words.opening,
    use: {
      place: 'In Old Pan\'s taxi, then at the courtyard gate on Qushuiting Street',
      steps: [
        { note: 'Jinan West Station. A taxi driver waves you over and talks the whole way.' },
        { npc: 'pan', zh: '你好！你好！', en: 'Hello! Hello!' },
        { build: true, npc: 'pan', label: 'Speaking · greet Old Pan', q: 'Say hello back.', answer: '你好！', extra: ['谢谢', '不'] },
        { npc: 'pan', zh: '我是老潘。', en: 'I\'m Old Pan.' },
        { ask: 'listen', npc: 'pan', zh: '你是老周吗？', en: 'Are you Old Zhou?', label: 'Listening · answer Old Pan', q: 'Old Pan asks you something. Answer him.', options: ['是。', '不是。'], answer: '不是。' },
        { npc: 'pan', zh: '哦，你不是老周。', en: 'Oh, you\'re not Old Zhou.' },
        { npc: 'pan', zh: '老周……七十三……七十三！', en: 'Old Zhou… seventy-three… seventy-three!' },
        { ask: 'listen', npc: 'pan', zh: '七十三！', en: 'Seventy-three!', label: 'Listening · Old Pan\'s number', q: 'Which number does Old Pan keep saying?', options: ['七十三', '三十七', '十三'], answer: '七十三' },
        { npc: 'pan', zh: '这是曲水亭街。谢谢你！', en: 'This is Qushuiting Street. Thank you!' },
        { note: 'An old man with a white beard is waiting at a courtyard gate. He has a key, and an old notebook.' },
        { npc: 'zhang', zh: '你好！我是张老师。', en: 'Hello! I\'m Teacher Zhang.' },
        { build: true, npc: 'zhang', label: 'Speaking · ask about the notebook', q: 'Ask him: is this Old Zhou\'s notebook?', answer: '这是老周的本子吗？', extra: ['你', '我'] },
        { npc: 'zhang', zh: '是。这是老周的本子。', en: 'Yes. This is Old Zhou\'s notebook.' },
        { ask: 'listen', npc: 'zhang', zh: '这是老周的本子。', en: 'This is Old Zhou\'s notebook.', label: 'Listening · whose notebook?', q: 'Whose notebook is it?', options: ['老周的本子', '张老师的本子', '老潘的本子'], answer: '老周的本子' },
        { npc: 'zhang', zh: '这是你的。', en: 'It\'s yours.' },
        { build: true, npc: 'zhang', label: 'Speaking · thank him', q: 'Thank him.', answer: '谢谢你！', extra: ['不', '你好'] },
        { build: true, npc: 'zhang', label: 'Speaking · hold the notebook', q: 'Say: this is my notebook.', answer: '这是我的本子。', extra: ['你', '不', '吗'] },
        { note: 'You open the notebook. Almost every page is a smudge of ink. One line is clear.' }
      ]
    }
  },

  beats: [
    {
      id: 'hook',
      title: 'Hook · Grandma Wang\'s thermos',
      npc: 'wang',
      en: 'Morning at the spring. An old woman by the railing is upset.',
      words: words.hook,
      use: {
        place: 'By the railing at Baotu Spring, early morning',
        steps: [
          { npc: 'wang', zh: '孩子，你好！', en: 'Hello, child!' },
          { ask: 'listen', npc: 'wang', zh: '孩子，你好！', en: 'Hello, child!', label: 'Listening · what does she call you?', q: 'What does she call you?', options: ['孩子', '老潘', '老周'], answer: '孩子' },
          { npc: 'wang', zh: '我是王奶奶。我的杯子没有了！', en: 'I\'m Grandma Wang. My cup is gone!' },
          { ask: 'listen', npc: 'wang', zh: '我的杯子没有了！', en: 'My cup is gone!', label: 'Listening · what did Grandma lose?', q: 'What did Grandma Wang lose?', options: ['杯子', '本子', '孩子'], answer: '杯子' },
          { ask: 'listen', npc: 'wang', zh: '没有了！没有了！', en: 'Gone! Gone!', label: 'Listening · what happened?', q: 'What happened to it?', options: ['没有了', '是我的', '不是'], answer: '没有了' },
          { npc: 'wang', zh: '是一个白杯子。', en: 'It\'s a white cup.' },
          { ask: 'read', npc: 'wang', zh: '是一个白杯子。', en: 'It\'s a white cup.', label: 'Reading · which cup?', q: 'Which one is hers?', options: ['一个白杯子', '一个白本子', '七个杯子'], answer: '一个白杯子' },
          { npc: 'wang', zh: '孩子，这是泉。', en: 'Child, this is the spring.' },
          { ask: 'read', npc: 'wang', zh: '孩子，这是……', en: 'Child, this is…', label: 'Reading · what is this?', q: 'She points at the bubbling water. What is it?', options: ['泉', '杯子', '本子'], answer: '泉' },
          { npc: 'wang', zh: '我想要我的杯子！', en: 'I want my cup!' },
          { ask: 'listen', npc: 'wang', zh: '我想要我的杯子！', en: 'I want my cup!', label: 'Listening · what does she want?', q: 'What does she want?', options: ['想要杯子', '想要本子', '不要杯子'], answer: '想要杯子' },
          { npc: 'wang', zh: '孩子，你先。', en: 'Child, you first.' },
          { note: 'She steps back from the railing so you can look first.' },
          { build: true, npc: 'wang', label: 'Speaking · be polite', q: 'Be polite: "No, no, you first!"', answer: '不，不，你先！', extra: ['我', '是'] },
          { npc: 'wang', zh: '哈哈！谢谢你，孩子！', en: 'Haha! Thank you, child!' },
          { note: 'Quest: find Grandma Wang\'s white cup. Someone at the tai chi square might have seen it.' }
        ]
      }
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
