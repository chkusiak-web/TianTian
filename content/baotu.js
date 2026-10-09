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
    {
      id: 'inv1',
      title: 'Investigate 1 · tai chi group',
      npc: 'zhang',
      en: 'The tai chi square. Introduce yourself and ask around.',
      words: [...words.inv1, '中国'],   // 中国 added so you can say where you're not from (美国, 英国 aren't HSK 1)
      parts: [
        {
          id: 'inv1a',
          title: 'Investigate 1 · who are you?',
          en: 'The tai chi group wants to know who you are.',
          words: ['叫', '什么', '名字', '哪', '国', '人', '中国'],
          use: {
            place: 'The tai chi square',
            steps: [
              { note: 'The tai chi group moves slowly in a circle. Teacher Zhang waves you over.' },
              { npc: 'zhang', zh: '孩子，你好！', en: 'Hello, child!' },
              { npc: 'lin', zh: '你好！你叫什么名字？', en: 'Hi! What\'s your name?' },
              { ask: 'listen', npc: 'lin', zh: '你叫什么名字？', en: 'What\'s your name?', label: 'Listening · what does she ask?', q: 'The woman next to him asks you something. What does she want to know?', options: ['你的名字', '你的杯子', '你的本子'], answer: '你的名字' },
              { npc: 'zhang', zh: '这是老周的孩子。', en: 'This is Old Zhou\'s child.' },
              { build: true, npc: 'lin', label: 'Speaking · ask her name', q: 'Ask her back: what\'s your name?', answer: '你叫什么名字？', extra: ['我', '是'] },
              { npc: 'lin', zh: '我叫林姐。你是哪国人？', en: 'I\'m Sister Lin. What country are you from?' },
              { ask: 'listen', npc: 'lin', zh: '你是哪国人？', en: 'What country are you from?', label: 'Listening · what does she ask now?', q: 'What does she ask this time?', options: ['哪国人', '什么名字', '什么杯子'], answer: '哪国人' },
              { build: true, npc: 'lin', label: 'Speaking · where you\'re from', q: 'Tell her you\'re not Chinese.', answer: '我不是中国人。', extra: ['你', '吗'] },
              { npc: 'lin', zh: '哦，你不是中国人！你好，你好！', en: 'Oh, you\'re not Chinese! Hello, hello!' },
              { build: true, npc: 'lin', label: 'Speaking · who you are', q: 'You have no Chinese name yet. Say: I\'m Old Zhou\'s child.', answer: '我是老周的孩子。', extra: ['叫', '名字'] },
              { note: 'Teacher Zhang finishes the last move and comes over to talk.' }
            ]
          }
        },
        {
          id: 'inv1b',
          title: 'Investigate 1 · a witness',
          intro: 'Teacher Zhang walks over, still breathing slowly from the form.',
          en: 'Teacher Zhang saw something this morning.',
          words: ['找', '看见', '拿', '很', '多', '年', '说'],
          use: {
            place: 'The tai chi square',
            steps: [
              { npc: 'zhang', zh: '孩子，你找什么？', en: 'Child, what are you looking for?' },
              { build: true, npc: 'zhang', label: 'Speaking · say what you\'re looking for', q: 'Say: I\'m looking for a white cup.', answer: '我找一个白杯子。', extra: ['你', '本子'] },
              { npc: 'zhang', zh: '王奶奶的杯子？我看见了。一个孩子，拿了一个白杯子。', en: 'Grandma Wang\'s cup? I saw it. A child took a white cup.' },
              { ask: 'listen', npc: 'zhang', zh: '我看见了。', en: 'I saw it.', label: 'Listening · what does he say?', q: 'What does Teacher Zhang say?', options: ['我看见了', '我拿了', '我找了'], answer: '我看见了' },
              { ask: 'listen', npc: 'zhang', zh: '一个孩子，拿了一个白杯子。', en: 'A child took a white cup.', label: 'Listening · who took it?', q: 'Who took the cup?', options: ['一个孩子', '王奶奶', '老潘'], answer: '一个孩子' },
              { ask: 'read', npc: 'zhang', zh: '一个孩子，拿了……', en: 'A child took…', label: 'Reading · what did the child do?', q: 'What did the child do with the cup?', options: ['拿了', '看见了', '没有了'], answer: '拿了' },
              { npc: 'zhang', zh: '很多人看见了。很多孩子！', en: 'Lots of people saw. Lots of children around!' },
              { npc: 'zhang', zh: '孩子，老周找了很多年。', en: 'Child, Old Zhou looked for many years.' },
              { ask: 'listen', npc: 'zhang', zh: '老周找了很多年。', en: 'Old Zhou looked for many years.', label: 'Listening · how long?', q: 'How long did Old Zhou look?', options: ['很多年', '七十三年', '一年'], answer: '很多年' },
              { build: true, npc: 'zhang', label: 'Speaking · ask about Old Zhou', q: 'Ask him: what did Old Zhou say?', answer: '老周说什么？', extra: ['找', '你'] },
              { npc: 'zhang', zh: '老周说：七十三！七十三！', en: 'Old Zhou said: seventy-three! Seventy-three!' },
              { note: 'A child took the white cup. Ms. Chen sells the tickets at the south gate. She might know which child came in this morning.' }
            ]
          }
        }
      ]
    },
    {
      id: 'inv2',
      title: 'Investigate 2 · ticket window',
      npc: 'chen',
      en: 'Ms. Chen\'s ticket window at the south gate: buy a ticket, then check her lost-and-found ledger.',
      words: words.inv2,
      parts: [
        {
          id: 'inv2a',
          title: 'Investigate 2 · a ticket',
          en: 'Buy a ticket at the south gate.',
          words: ['游客', '门票', '四', '块', '号', '门'],
          use: {
            place: 'The ticket window at the south gate',
            steps: [
              { note: 'The ticket window at the south gate. Ms. Chen looks up from a fat ledger.' },
              { npc: 'chen', zh: '你好！你是游客吗？', en: 'Hello! Are you a tourist?' },
              { ask: 'listen', npc: 'chen', zh: '你是游客吗？', en: 'Are you a tourist?', label: 'Listening · what does she ask?', q: 'What does Ms. Chen ask you?', options: ['你是游客吗？', '你是老周吗？', '你是孩子吗？'], answer: '你是游客吗？' },
              { build: true, npc: 'chen', label: 'Speaking · answer her', q: 'Say: yes, I\'m a tourist.', answer: '是，我是游客。', accept: ['我是游客。'], extra: ['不', '吗'] },
              { npc: 'chen', zh: '这是一号门。门票四十块。', en: 'This is Gate 1. A ticket is forty yuan.' },
              { ask: 'listen', npc: 'chen', zh: '门票四十块。', en: 'A ticket is forty yuan.', label: 'Listening · how much?', q: 'How much is a ticket?', options: ['四十块', '十四块', '四块'], answer: '四十块' },
              { build: true, npc: 'chen', label: 'Speaking · buy a ticket', q: 'Say: I want a ticket.', answer: '我要门票。', extra: ['四', '你'] },
              { npc: 'chen', zh: '谢谢！这是你的门票。', en: 'Thank you! Here\'s your ticket.' },
              { ask: 'read', npc: 'chen', zh: '门票 · 四十块 · 一号门', en: 'Ticket · 40 yuan · Gate 1', label: 'Reading · your ticket', q: 'Which gate does your ticket say?', options: ['一号门', '四号门', '七号门'], answer: '一号门' },
              { build: true, npc: 'chen', label: 'Speaking · ask about the cup', q: 'Ask her: did you see a white cup?', answer: '你看见一个白杯子吗？', accept: ['你看见白杯子吗？'], extra: ['我', '门票'] },
              { npc: 'chen', zh: '一个白杯子？这是我的本子。', en: 'A white cup? This is my notebook.' },
              { note: 'She turns the ledger around: everything lost and found at Baotu, by time and gate.' }
            ]
          }
        },
        {
          id: 'inv2b',
          title: 'Investigate 2 · the ledger',
          intro: 'Ms. Chen\'s ledger: three lines from today, each with a thing, a time and a gate.',
          en: 'Find the white cup in Ms. Chen\'s lost-and-found ledger.',
          words: ['书', '下午', '手机', '上午', '九', '点'],
          use: {
            place: 'The ticket window at the south gate',
            steps: [
              { npc: 'chen', zh: '这是我的本子。白杯子，白杯子……', en: 'This is my notebook. White cup, white cup…' },
              { ask: 'read', npc: 'chen', zh: '书 · 下午三点 · 七号门', en: 'Book · 3 p.m. · Gate 7', label: 'Reading · line 1', q: 'What was found on this line?', options: ['书', '手机', '杯子'], answer: '书' },
              { ask: 'read', npc: 'chen', zh: '手机 · 上午十点 · 三号门', en: 'Phone · 10 a.m. · Gate 3', label: 'Reading · line 2', q: 'And on this one?', options: ['手机', '书', '门票'], answer: '手机' },
              { ask: 'read', npc: 'chen', zh: '白杯子 · 上午九点 · 四号门', en: 'White cup · 9 a.m. · Gate 4', label: 'Reading · line 3', q: 'When was the white cup seen?', options: ['上午九点', '下午九点', '上午十点'], answer: '上午九点' },
              { build: true, npc: 'chen', label: 'Speaking · read it out', q: 'Read the cup\'s line to her: white cup, nine in the morning.', answer: '白杯子，上午九点。', extra: ['下午', '书'] },
              { build: true, npc: 'chen', label: 'Speaking · make sure', q: 'Check: not in the afternoon?', answer: '不是下午？', extra: ['上午', '吗'] },
              { npc: 'chen', zh: '不是下午。上午九点，四号门。一个孩子拿了。', en: 'Not the afternoon. Nine in the morning, Gate 4. A child took it.' },
              { ask: 'listen', npc: 'chen', zh: '上午九点，四号门。', en: 'Nine in the morning, Gate 4.', label: 'Listening · which gate?', q: 'Which gate was it?', options: ['四号门', '三号门', '七号门'], answer: '四号门' },
              { note: 'Gate 4, nine in the morning, a child. Xiao Xie by the fish pool sees every child who runs past.' }
            ]
          }
        }
      ]
    },
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
