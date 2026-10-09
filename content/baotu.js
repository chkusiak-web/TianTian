// Baotu Spring arc (CONCEPT §5.1): the opening, six beats, notebook page 1.
// Every Chinese string here is checked by `npm run check` (HSK 1 + names + particles + Baotu's taught words),
// and each beat's new words must be the answer to at least one prompt in its scene (§6.10).
//
// Scene steps:
//   { npc, zh, en }                                   a line someone says (slow: true to say it slowly)
//   { ask: 'listen' | 'read', npc, zh, en, label, q, options, answer }
//                                                     they say (listen, text hidden until you answer) or show (read)
//                                                     a line, and you pick. Never a line that was just shown (§6.11 rule 2).
//                                                     A miss outside a challenge brings up the repair lines (rule 3).
//   { build: true, npc, zh?, en?, label, q, answer, extra, accept?, optional?, recast? }
//                                                     you build `answer` from word tiles (its words + `extra`). `q` gives
//                                                     the situation or goal, never the sentence. `accept`: other right
//                                                     answers. Close answers count (src/session/close.js); a near miss is
//                                                     recast: the NPC says `recast` (default: the answer) and goes on.
//   { reply: true, npc, q, options: [{ zh, en?, then?, nonsense?, react?, accept?, recast?, extra? }] }
//                                                     reply choices (rule 1): you pick what to say, then build it. A
//                                                     sensible pick plays its `then` steps; a `nonsense` one gets `react`
//                                                     (default 「啊？什么？」) and you choose again. Choices never change the
//                                                     clue path. Every reply step has at least one nonsense option.
//   { note }                                          English narration between lines
//   face: 'happy' | 'worried' | 'confused'   the speaker's portrait expression (default neutral)
//   sign: true      the line is a park sign, drawn as one
//   { duel: { hearts, loseOn?, win?, retreat, prompts: [prompt steps] } }   a conversation challenge (§6.1, src/session/use.js)
//   on a prompt: flag: 'name'   a miss sets progress[name] (e.g. clueMistake);  onMiss: [steps]  played only after a miss
// A unit (the opening or a beat) is split into `parts`, each one session: { id, title, en, intro?, words, use }.
// `intro` is the story card that leads into a later part. A unit's words are its parts' words.
//   at: 'station' | 'road' | 'home'                   (opening only) moves the taxi on the arrival map (src/ui/arrival.js)
//
// Verbal habits (§6.11 rule 5): Old Pan 「我跟你说……」, Grandma Wang 「孩子，你吃了吗？」, Ms. Chen 「好，下一个！」,
// Xiao Xie 「走吧！走吧！」, Teacher Zhang 「好，好。很好。」, Sister Lin 「你看！你看！」, Lele 「你知道吗？你不知道！」.
// Their words are taught where each person first speaks; the repair lines are taught in the taxi (opening part 2).

const unit = (u) => ({ ...u, words: u.parts.flatMap((p) => p.words) });

export default {
  district: 'baotu',

  opening: unit({
    id: 'opening',
    title: 'Arrival',
    en: 'You arrive in Jinan. Old Pan drives you from the station; Teacher Zhang is waiting with a key.',
    parts: [
      {
        id: 'taxi',
        title: 'Arrival · Old Pan\'s taxi',
        en: 'Jinan West Station. A taxi driver who never stops talking.',
        words: ['你好', '你', '是', '吗', '不', '我', '跟', '说'],
        use: {
          place: 'Jinan West Station, then Old Pan\'s taxi',
          steps: [
            { at: 'station', note: 'Jinan West Station. A taxi driver waves you over and talks the whole way.' },
            { npc: 'pan', face: 'happy', zh: '你好！你好！', en: 'Hello! Hello!' },
            { reply: true, npc: 'pan', label: 'Speaking · reply', q: 'The driver is grinning at you, waiting.', options: [
              { zh: '你好！' },
              { zh: '我是你！', nonsense: true, react: '啊？你是我？' }
            ] },
            { note: 'The licence on his dashboard says 老潘.' },
            { build: true, npc: 'pan', label: 'Speaking · check his name', q: 'Check the name on his licence with him.', answer: '你是老潘吗？', extra: ['我', '不'] },
            { npc: 'pan', face: 'happy', zh: '是！我是老潘！我跟你说，我……', en: 'Yes! I\'m Old Pan! Let me tell you, I…' },
            { ask: 'listen', npc: 'pan', zh: '你是老周吗？', en: 'Are you Old Zhou?', label: 'Listening · answer Old Pan', q: 'He stops mid-sentence and asks you something. Answer him.', options: ['是。', '不是。'], answer: '不是。' },
            { npc: 'pan', zh: '老周！你好，老周！', en: 'Old Zhou! Hello, Old Zhou!' },
            { build: true, npc: 'pan', label: 'Speaking · get a word in', q: 'He isn\'t listening. Get a word in, the way he does.', answer: '我跟你说，我不是老周！', extra: ['吗', '你好'] },
            { npc: 'pan', face: 'confused', zh: '哦……你不是老周。', en: 'Oh… you\'re not Old Zhou.' },
            { at: 'road', note: 'The taxi swings onto the ring road. Old Pan starts talking again, faster than ever.' }
          ]
        }
      },
      {
        id: 'fast',
        title: 'Arrival · too fast',
        intro: 'Old Pan talks faster and faster. Time to learn the four lines for when you don\'t catch something.',
        en: 'Old Pan talks too fast. Ask him to slow down, and say it again.',
        words: ['什么', '请', '再', '慢', '一点儿', '知道'],
        use: {
          place: 'Old Pan\'s taxi, on the ring road',
          steps: [
            { at: 'road', npc: 'pan', zh: '我跟你说，老周是……老周不是……老周……', en: 'Let me tell you, Old Zhou is… Old Zhou isn\'t… Old Zhou…' },
            { build: true, npc: 'pan', label: 'Speaking · repair', q: 'Much too fast. Ask him to slow down.', answer: '慢一点儿！', accept: ['请慢一点儿！'], extra: ['请', '再'] },
            { npc: 'pan', slow: true, zh: '哦！慢一点儿。', en: 'Oh! A bit slower.' },
            { ask: 'listen', npc: 'pan', zh: '你知道老周吗？', en: 'Do you know Old Zhou?', label: 'Listening · Old Pan, slower', q: 'Slower now, he asks you something. What does he want to know?', options: ['你知道老周吗？', '你是老周吗？', '你跟老周说吗？'], answer: '你知道老周吗？' },
            { reply: true, npc: 'pan', label: 'Speaking · reply', q: 'You\'ve never met Old Zhou.', options: [
              { zh: '我不知道。' },
              { zh: '我是老周。', nonsense: true, react: '什么？你不是老周！' }
            ] },
            { npc: 'pan', zh: '你不知道？我跟你说，老周是……', en: 'You don\'t know? Let me tell you, Old Zhou is…' },
            { note: 'He\'s off again, and the taxi horn drowns him out. You lose him completely.' },
            { reply: true, npc: 'pan', label: 'Speaking · repair', q: 'You lost him completely.', options: [
              { zh: '请再说。', then: [{ npc: 'pan', slow: true, zh: '请再说？哦！老周……我不知道！哈哈！', en: 'Say it again? Oh! Old Zhou… I don\'t know! Haha!' }] },
              { zh: '什么？', then: [{ npc: 'pan', slow: true, zh: '什么？哦！老周……我不知道！哈哈！', en: 'What? Oh! Old Zhou… I don\'t know! Haha!' }] },
              { zh: '我不是你。', nonsense: true, react: '什么？我跟你说……' }
            ] },
            { note: 'Four lines for when you don\'t catch something: 什么？ 请再说。 慢一点儿！ 我不知道。 From now on, a missed question brings them up.' }
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
            { at: 'road', ask: 'listen', npc: 'pan', zh: '老周……七十三……七十三！', en: 'Old Zhou… seventy-three… seventy-three!', label: 'Listening · Old Pan\'s number', q: 'Old Pan keeps muttering a number. Which one?', options: ['七十三', '三十七', '十三'], answer: '七十三' },
            { at: 'home', npc: 'pan', zh: '这是曲水亭街。我跟你说，谢谢你！', en: 'This is Qushuiting Street. Let me tell you: thank you!' },
            { reply: true, npc: 'pan', label: 'Speaking · reply', q: 'He\'s dropped you at the gate and won\'t take a tip.', options: [
              { zh: '谢谢你！' },
              { zh: '谢谢，老潘！' },
              { zh: '这是我的！', nonsense: true, react: '什么？这是你的？' }
            ] },
            { note: 'An old man with a white beard is waiting at a courtyard gate. He has a key, and an old notebook.' },
            { npc: 'zhang', zh: '你好！我是张老师。', en: 'Hello! I\'m Teacher Zhang.' },
            { build: true, npc: 'zhang', label: 'Speaking · the notebook', q: 'He\'s holding out an old notebook. Ask whether it was Old Zhou\'s.', answer: '这是老周的本子吗？', extra: ['你', '我'] },
            { ask: 'listen', npc: 'zhang', zh: '是，这是老周的本子。这是你的。', en: 'Yes, this is Old Zhou\'s notebook. It\'s yours.', label: 'Listening · whose notebook?', q: 'Whose notebook is it now?', options: ['你的', '老周的', '张老师的'], answer: '你的' },
            { reply: true, npc: 'zhang', label: 'Speaking · reply', q: 'He puts it in your hands.', options: [
              { zh: '谢谢你！' },
              { zh: '这是我的本子？谢谢！' },
              { zh: '七十三！', nonsense: true, react: '七十三？什么？' }
            ] },
            { note: 'You open the notebook. Almost every page is a smudge of ink. One line is clear.' }
          ]
        }
      }
    ]
  }),

  beats: [
    unit({
      id: 'hook',
      title: 'Hook · Grandma Wang\'s thermos',
      npc: 'wang',
      en: 'Morning at the spring. An old woman by the railing is upset.',
      parts: [
        {
          id: 'hook1',
          title: 'Hook · the lost cup',
          en: 'Morning at the spring. An old woman by the railing is upset.',
          words: ['孩子', '杯子', '没有', '了', '一', '个', '白', '吃'],
          use: {
            place: 'By the railing at Baotu Spring, early morning',
            steps: [
              { ask: 'listen', npc: 'wang', zh: '孩子，你好！你吃了吗？', en: 'Hello, child! Have you eaten?', label: 'Listening · what does she call you?', q: 'An old woman by the railing greets you. What does she call you?', options: ['孩子', '杯子', '本子'], answer: '孩子' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'She asked if you\'ve eaten. You had breakfast at the station.', options: [
                { zh: '我吃了。' },
                { zh: '吃了，谢谢！' },
                { zh: '我是杯子。', nonsense: true, react: '……你是杯子？什么？' }
              ] },
              { npc: 'wang', face: 'worried', zh: '我是王奶奶。我的杯子……没有了！', en: 'I\'m Grandma Wang. My cup… it\'s gone!' },
              { note: 'She means her thermos. Here, a thermos is just a 杯子, a cup.' },
              { build: true, npc: 'wang', label: 'Speaking · make sure', q: 'Make sure you understood what\'s happened.', answer: '你的杯子没有了？', extra: ['我', '孩子'] },
              { ask: 'listen', npc: 'wang', face: 'worried', zh: '没有了！一个白杯子，没有了！', en: 'Gone! A white cup, gone!', label: 'Listening · which cup?', q: 'What does her cup look like?', options: ['一个白杯子', '一个白本子', '三个白杯子'], answer: '一个白杯子' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'She looks at your hands, hoping.', options: [
                { zh: '我没有。' },
                { zh: '一个白杯子？我没有。' },
                { zh: '我吃了杯子。', nonsense: true, react: '什么？！你吃了杯子？' }
              ] },
              { npc: 'wang', face: 'worried', zh: '哦……你没有。', en: 'Oh… you don\'t have it.' }
            ]
          }
        },
        {
          id: 'hook2',
          title: 'Hook · you first',
          intro: 'Grandma Wang dries her eyes and points at the water bubbling up out of the rock.',
          en: 'Grandma Wang shows you the spring, and wants her cup back.',
          words: ['泉', '想', '要', '先'],
          use: {
            place: 'By the railing at Baotu Spring',
            steps: [
              { ask: 'read', npc: 'wang', zh: '孩子，这是泉。', en: 'Child, this is the spring.', label: 'Reading · the water', q: 'What is the bubbling water called?', options: ['泉', '杯子', '本子'], answer: '泉' },
              { ask: 'listen', npc: 'wang', face: 'worried', zh: '我想要我的杯子！', en: 'I want my cup!', label: 'Listening · what does she want?', q: 'What does she want?', options: ['想要杯子', '没有杯子', '不要杯子'], answer: '想要杯子' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'Show her you understood.', options: [
                { zh: '你想要你的杯子。' },
                { zh: '你要白杯子？' },
                { zh: '我要吃泉！', nonsense: true, react: '什么？你要吃泉？！' }
              ] },
              { note: 'She steps back from the railing so you can look first.' },
              { ask: 'listen', npc: 'wang', zh: '孩子，你先。', en: 'Child, you first.', label: 'Listening · what does she say?', q: 'She gestures at the railing. What does she say?', options: ['你先', '我先', '你要'], answer: '你先' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'She\'s much older than you. Be polite.', options: [
                { zh: '不，不，你先！' },
                { zh: '我先！', nonsense: true, react: '哦……你先？' },
                { zh: '我要泉。', nonsense: true, react: '什么？' }
              ] },
              { npc: 'wang', face: 'happy', zh: '哈哈！谢谢你，孩子！', en: 'Haha! Thank you, child!' },
              { note: 'Quest: find Grandma Wang\'s white cup. Someone at the tai chi square might have seen it.' }
            ]
          }
        }
      ]
    }),
    unit({
      id: 'inv1',
      title: 'Investigate 1 · tai chi group',
      npc: 'zhang',
      en: 'The tai chi square. Introduce yourself and ask around.',
      parts: [
        {
          id: 'inv1a',
          title: 'Investigate 1 · who are you?',
          en: 'The tai chi group wants to know who you are.',
          words: ['叫', '名字', '哪', '国', '人', '中国', '看'],   // 中国 so you can say where you're not from (美国, 英国 aren't HSK 1)
          use: {
            place: 'The tai chi square',
            steps: [
              { note: 'The tai chi group moves slowly in a circle. A woman in blue spots you first.' },
              { ask: 'listen', npc: 'lin', face: 'happy', zh: '你看！你看！', en: 'Look! Look!', label: 'Listening · what is she saying?', q: 'She grabs Teacher Zhang\'s sleeve and points at you. What is she saying?', options: ['你看', '你好', '你先'], answer: '你看' },
              { ask: 'listen', npc: 'lin', zh: '你好！你叫什么名字？', en: 'Hi! What\'s your name?', label: 'Listening · what does she ask?', q: 'She asks you something. What does she want to know?', options: ['你的名字', '你的杯子', '你的本子'], answer: '你的名字' },
              { reply: true, npc: 'lin', label: 'Speaking · reply', q: 'You don\'t have a Chinese name yet.', options: [
                { zh: '我叫……我不知道！', then: [{ npc: 'lin', face: 'happy', zh: '哈哈！你不知道你的名字？', en: 'Haha! You don\'t know your own name?' }] },
                { zh: '我是老周的孩子。', then: [{ npc: 'zhang', zh: '是，这是老周的孩子。', en: 'Yes, this is Old Zhou\'s child.' }] },
                { zh: '我叫杯子。', nonsense: true, react: '你叫杯子？什么？' }
              ] },
              { build: true, npc: 'lin', label: 'Speaking · her name', q: 'Ask her name too.', answer: '你叫什么名字？', extra: ['我', '是'] },
              { ask: 'listen', npc: 'lin', zh: '我叫林姐。你是哪国人？', en: 'I\'m Sister Lin. What country are you from?', label: 'Listening · a new question', q: 'She answers, then asks something new. What?', options: ['哪国人', '什么名字', '什么杯子'], answer: '哪国人' },
              { reply: true, npc: 'lin', label: 'Speaking · reply', q: 'You\'re not from China.', options: [
                { zh: '我不是中国人。' },
                { zh: '我是中国人。', nonsense: true, react: '你是中国人？哦……什么？' },
                { zh: '我是泉。', nonsense: true, react: '什么？' }
              ] },
              { npc: 'lin', face: 'happy', zh: '哦，你不是中国人！你看，你看！张老师！', en: 'Oh, you\'re not Chinese! Look, look! Teacher Zhang!' },
              { note: 'Teacher Zhang finishes the last move and comes over to talk.' }
            ]
          }
        },
        {
          id: 'inv1b',
          title: 'Investigate 1 · a witness',
          intro: 'Teacher Zhang walks over, still breathing slowly from the form.',
          en: 'Teacher Zhang saw something this morning.',
          words: ['找', '看见', '拿', '很', '多', '年', '好'],
          use: {
            place: 'The tai chi square',
            steps: [
              { note: 'He shows you one slow tai chi move, and you copy it.' },
              { ask: 'listen', npc: 'zhang', face: 'happy', zh: '好，好。很好。', en: 'Good, good. Very good.', label: 'Listening · Teacher Zhang', q: 'What does he think of your move?', options: ['很好', '不好', '很多'], answer: '很好' },
              { npc: 'zhang', zh: '孩子，你找什么？', en: 'Child, what are you looking for?' },
              { reply: true, npc: 'zhang', label: 'Speaking · reply', q: 'Tell him what you\'re after.', options: [
                { zh: '我找一个白杯子。' },
                { zh: '我找王奶奶的杯子。' },
                { zh: '我找我的名字。', nonsense: true, react: '你的名字？什么？' }
              ] },
              { ask: 'listen', npc: 'zhang', zh: '我看见了。一个孩子，拿了一个白杯子。', en: 'I saw it. A child took a white cup.', label: 'Listening · a witness', q: 'What did Teacher Zhang see?', options: ['一个孩子拿了', '一个孩子找了', '王奶奶拿了'], answer: '一个孩子拿了' },
              { build: true, npc: 'zhang', label: 'Speaking · make sure', q: 'Make sure he saw it with his own eyes.', answer: '你看见了吗？', extra: ['拿', '找'] },
              { npc: 'zhang', zh: '看见了。很多人看见了。很多孩子！', en: 'I saw. Lots of people saw. Lots of children around!' },
              { ask: 'listen', npc: 'zhang', zh: '孩子，老周找了很多年。', en: 'Child, Old Zhou looked for many years.', label: 'Listening · Old Zhou', q: 'He changes the subject. How long did Old Zhou look?', options: ['很多年', '七十三年', '一年'], answer: '很多年' },
              { reply: true, npc: 'zhang', label: 'Speaking · reply', q: 'You want to know more about Old Zhou.', options: [
                { zh: '老周找什么？' },
                { zh: '老周说什么？' },
                { zh: '老周很好吃。', nonsense: true, react: '什么？！' }
              ] },
              { npc: 'zhang', zh: '老周说：七十三！七十三！好，好。', en: 'Old Zhou said: seventy-three! Seventy-three! Well, well.' },
              { note: 'A child took the white cup. Ms. Chen sells the tickets at the south gate. She might know which child came in this morning.' }
            ]
          }
        }
      ]
    }),
    unit({
      id: 'inv2',
      title: 'Investigate 2 · ticket window',
      npc: 'chen',
      en: 'Ms. Chen\'s ticket window at the south gate: buy a ticket, then check her lost-and-found ledger.',
      parts: [
        {
          id: 'inv2a',
          title: 'Investigate 2 · a ticket',
          en: 'Buy a ticket at the south gate.',
          words: ['游客', '门票', '四', '块', '号', '门', '下'],
          use: {
            place: 'The ticket window at the south gate',
            steps: [
              { note: 'The ticket window at the south gate. Ms. Chen looks up from a fat ledger.' },
              { ask: 'listen', npc: 'chen', zh: '你好！你是游客吗？', en: 'Hello! Are you a tourist?', label: 'Listening · what does she ask?', q: 'What does Ms. Chen ask you?', options: ['是游客吗', '是老周吗', '是孩子吗'], answer: '是游客吗' },
              { reply: true, npc: 'chen', label: 'Speaking · reply', q: 'Answer her.', options: [
                { zh: '是，我是游客。' },
                { zh: '不是。我是老周的孩子。', then: [{ npc: 'chen', face: 'happy', zh: '老周的孩子？！你好，你好！', en: 'Old Zhou\'s child?! Hello, hello!' }] },
                { zh: '我是杯子。', nonsense: true, react: '……你是杯子？什么？' }
              ] },
              { ask: 'listen', npc: 'chen', zh: '这是一号门。门票四十块。', en: 'This is Gate 1. A ticket is forty yuan.', label: 'Listening · how much?', q: 'How much is a ticket?', options: ['四十块', '十四块', '四块'], answer: '四十块' },
              { reply: true, npc: 'chen', label: 'Speaking · reply', q: 'You have the money ready.', options: [
                { zh: '我要一个门票。', recast: '一个门票？好！' },
                { zh: '我要四十个门票。', nonsense: true, react: '四十个？！什么？' }
              ] },
              { ask: 'listen', npc: 'chen', zh: '好！这是你的门票。下一个！', en: 'Right! Here\'s your ticket. Next!', label: 'Listening · Ms. Chen', q: 'She hands over your ticket and calls out. What does she call?', options: ['下一个！', '一个！', '这个！'], answer: '下一个！' },
              { ask: 'read', zh: '门票 · 四十块 · 一号门', en: 'Ticket · 40 yuan · Gate 1', label: 'Reading · your ticket', q: 'Which gate does your ticket say?', options: ['一号门', '四号门', '七号门'], answer: '一号门' },
              { reply: true, npc: 'chen', label: 'Speaking · reply', q: 'Before she calls the next person, ask about the cup.', options: [
                { zh: '你看见一个白杯子吗？' },
                { zh: '你吃了门票吗？', nonsense: true, react: '什么？！' }
              ] },
              { npc: 'chen', face: 'confused', zh: '一个白杯子？这是我的本子……', en: 'A white cup? Here\'s my book…' },
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
              { npc: 'chen', zh: '白杯子，白杯子……你看。', en: 'White cup, white cup… have a look.' },
              { ask: 'read', zh: '书 · 下午三点 · 七号门', en: 'Book · 3 p.m. · Gate 7', label: 'Reading · line 1', q: 'What was found on this line?', options: ['书', '手机', '杯子'], answer: '书' },
              { ask: 'read', zh: '手机 · 上午十点 · 三号门', en: 'Phone · 10 a.m. · Gate 3', label: 'Reading · line 2', q: 'And on this one?', options: ['手机', '书', '门票'], answer: '手机' },
              { ask: 'read', zh: '白杯子 · 上午九点 · 四号门', en: 'White cup · 9 a.m. · Gate 4', label: 'Reading · line 3', q: 'When was the white cup seen?', options: ['上午九点', '下午九点', '上午十点'], answer: '上午九点' },
              { build: true, npc: 'chen', label: 'Speaking · read it out', q: 'Read the cup\'s time out to her.', answer: '白杯子，上午九点。', extra: ['下午', '书'] },
              { reply: true, npc: 'chen', label: 'Speaking · reply', q: 'Make sure it wasn\'t the afternoon.', options: [
                { zh: '不是下午？' },
                { zh: '是上午吗？' },
                { zh: '我要手机。', nonsense: true, react: '你要手机？什么？下一个！' }
              ] },
              { ask: 'listen', npc: 'chen', zh: '不是下午。上午九点，四号门。一个孩子拿了。', en: 'Not the afternoon. Nine in the morning, Gate 4. A child took it.', label: 'Listening · which gate?', q: 'Which gate was it?', options: ['四号门', '三号门', '七号门'], answer: '四号门' },
              { note: 'Gate 4, nine in the morning, a child. Xiao Xie by the fish pool sees every child who runs past.' }
            ]
          }
        }
      ]
    }),
    unit({
      id: 'inv3',
      title: 'Investigate 3 · fish pool and Gate 4',
      npc: 'xie',
      en: 'A kid by the fish pool shouts the gate number; then the park signs lead you to Gate 4.',
      parts: [
        {
          id: 'inv3a',
          title: 'Investigate 3 · the fish pool',
          en: 'A kid by the fish pool saw where the boy went.',
          words: ['他', '去', '这儿', '天', '都', '来', '喝', '水'],
          use: {
            place: 'The fish pool',
            steps: [
              { note: 'Fish dart through the pool. Xiao Xie is feeding them, and the kid next to her is jumping up and down.' },
              // a miss here is the spec's wrong turn: you walk to Gate 10, and Lele's duel starts with 4 hearts
              { ask: 'listen', npc: 'kid', zh: '四号门！他去了四号门！', en: 'Gate 4! He went to Gate 4!', label: 'Tones · 四 or 十?', q: 'The kid points. Which gate did the boy go to?', options: ['四号门', '十号门'], answer: '四号门', flag: 'clueMistake',
                onMiss: [
                  { note: 'You run to the far side of the park. There is no Gate 10 anywhere. You walk back, out of breath.' },
                  { npc: 'xie', face: 'confused', zh: '这儿没有十号门。是四号门！', en: 'There\'s no Gate 10 here. It\'s Gate 4!' }
                ] },
              { npc: 'xie', zh: '你好！我是小谢。', en: 'Hi! I\'m Xiao Xie.' },
              { ask: 'listen', npc: 'xie', zh: '他天天都来这儿。', en: 'He comes here every day.', label: 'Listening · how often?', q: 'She knows the boy. How often does he come here?', options: ['天天都来', '天天都去', '天天都喝水'], answer: '天天都来' },
              { build: true, npc: 'xie', label: 'Speaking · make sure', q: 'Check with her that you heard the kid right.', answer: '他去了四号门？', extra: ['十', '来'] },
              { npc: 'xie', zh: '是，他去了。他天天都去四号门。', en: 'Yes, he did. He goes to Gate 4 every day.' },
              { ask: 'listen', npc: 'kid', zh: '你喝水吗？', en: 'Do you want some water?', label: 'Listening · what does the kid offer?', q: 'The kid holds out a bottle. What does he offer?', options: ['喝水', '喝泉', '门票'], answer: '喝水' },
              { reply: true, npc: 'kid', label: 'Speaking · reply', q: 'You\'re thirsty after all that running.', options: [
                { zh: '我喝水，谢谢！' },
                { zh: '谢谢！我不喝。' },
                { zh: '我喝门票。', nonsense: true, react: '什么？你喝门票？' }
              ] },
              { npc: 'xie', zh: '老周天天都来这儿。他喝泉水。', en: 'Old Zhou came here every day too. He drank the spring water.' },
              { reply: true, npc: 'xie', label: 'Speaking · reply', q: 'Old Zhou? Ask her more.', options: [
                { zh: '老周来这儿？' },
                { zh: '老周天天都来吗？' },
                { zh: '老周是水吗？', nonsense: true, react: '什么？' }
              ] },
              { npc: 'xie', zh: '是，天天都来。', en: 'Yes, every day.' }
            ]
          }
        },
        {
          id: 'inv3b',
          title: 'Investigate 3 · the signs',
          intro: 'Xiao Xie walks you to a crossing of paths. Signs point every way.',
          en: 'Follow the park signs to Gate 4.',
          words: ['东', '西', '南', '北', '前边', '左边', '走', '吧'],
          use: {
            place: 'A crossing of paths near the fish pool',
            steps: [
              { ask: 'listen', npc: 'xie', zh: '四号门……前边，左边！走吧！走吧！', en: 'Gate 4… straight ahead, then left! Go on! Go on!', label: 'Listening · which way?', q: 'Which way does Xiao Xie say?', options: ['前边，左边', '左边，前边', '前边，前边'], answer: '前边，左边' },
              { ask: 'read', sign: true, zh: '东门 →', en: 'East Gate →', label: 'Reading · a sign', q: 'Which gate is this way?', options: ['东门', '西门', '北门'], answer: '东门' },
              { ask: 'read', sign: true, zh: '← 西门', en: '← West Gate', label: 'Reading · a sign', q: 'And this way?', options: ['西门', '南门', '东门'], answer: '西门' },
              { ask: 'read', sign: true, zh: '北门 ↑', en: 'North Gate ↑', label: 'Reading · a sign', q: 'Which gate is straight ahead?', options: ['北门', '南门', '东门'], answer: '北门' },
              { ask: 'read', sign: true, zh: '南门 ↓', en: 'South Gate ↓', label: 'Reading · a sign', q: 'Which gate is behind you, the way you came in?', options: ['南门', '北门', '西门'], answer: '南门' },
              { ask: 'read', sign: true, zh: '四号门 → 左边', en: 'Gate 4 → left', label: 'Reading · find Gate 4', q: 'Which way is Gate 4?', options: ['左边', '前边', '北门'], answer: '左边' },
              { build: true, npc: 'xie', label: 'Speaking · the sign', q: 'Tell Xiao Xie which way the sign says.', answer: '四号门，左边！', extra: ['前边', '东'] },
              { npc: 'xie', face: 'happy', zh: '是！你去，我不去。走吧！走吧！', en: 'Yes! You go; I\'m staying. Go on! Go on!' },
              { reply: true, npc: 'xie', label: 'Speaking · reply', q: 'She\'s shooing you off.', options: [
                { zh: '好，走吧！' },
                { zh: '好，我走了！' },
                { zh: '我去北门。', nonsense: true, react: '北门？不是！左边！' }
              ] },
              { note: 'Past the willows, at Gate 4, a boy in a red cap is holding a white thermos. That must be Lele.' }
            ]
          }
        }
      ]
    }),
    unit({
      id: 'challenge',
      title: 'Challenge · Lele\'s riddle duel',
      npc: 'lele',
      en: 'Lele won\'t hand the thermos over until you win his riddle duel.',
      parts: [
        {
          id: 'chal1',
          title: 'Challenge · Lele',
          en: 'At Gate 4, a boy with a white thermos.',
          words: ['对不起', '能', '有', '也', '给', '回答'],
          use: {
            place: 'Gate 4',
            steps: [
              { note: 'At Gate 4, a boy in a red cap hugs a white thermos. He sees you and starts to walk off.' },
              { ask: 'listen', npc: 'lele', zh: '对不起，我先走了！', en: 'Sorry, I\'m off!', label: 'Listening · what is he doing?', q: 'What is the boy doing?', options: ['我先走了', '我先回答', '我先喝水'], answer: '我先走了' },
              { reply: true, npc: 'lele', label: 'Speaking · reply', q: 'Stop him!', options: [
                { zh: '你不能走！' },
                { zh: '我喝你的水。', nonsense: true, react: '什么？' }
              ] },
              { npc: 'lele', face: 'worried', zh: '我是乐乐。这是我的杯子！', en: 'I\'m Lele. This is my cup!' },
              { reply: true, npc: 'lele', label: 'Speaking · reply', q: 'Set him straight, politely.', options: [
                { zh: '对不起！是王奶奶的杯子。' },
                { zh: '我是杯子。', nonsense: true, react: '哈哈！' }
              ] },
              { ask: 'listen', npc: 'lele', zh: '我有杯子，你没有！你知道吗？你不知道！', en: 'I have the cup, you don\'t! Did you know? You didn\'t!', label: 'Listening · what does he say?', q: 'What does Lele say?', options: ['我有杯子，你没有', '我没有杯子，你有', '我有杯子，你也有'], answer: '我有杯子，你没有' },
              { ask: 'listen', npc: 'lele', zh: '你也想要杯子？我不能给你。', en: 'You want the cup too? I can\'t give it to you.', label: 'Listening · what won\'t he do?', q: 'What won\'t Lele do?', options: ['不能给你', '不能回答', '不能走'], answer: '不能给你' },
              { npc: 'lele', zh: '你想要杯子吗？先回答我！', en: 'You want the cup? Answer me first!' },
              { reply: true, npc: 'lele', label: 'Speaking · reply', q: 'He wants a riddle duel.', options: [
                { zh: '好！我回答你！' },
                { zh: '我也能回答！' },
                { zh: '我吃杯子！', nonsense: true, react: '什么？！你吃杯子？' }
              ] },
              { note: 'Lele grins and plants his feet. Riddles, then. Every mistake costs you face: 面子.' }
            ]
          }
        },
        {
          id: 'chal2',
          title: 'Challenge · the riddle duel',
          intro: 'Lele\'s riddle duel. You have 5 hearts of face (面子); a mistake costs one, three right in a row win one back.',
          en: 'Win Lele\'s riddle duel to get the thermos back.',
          words: ['和', '几', '五', '谁', '面子'],
          use: {
            place: 'Gate 4',
            steps: [
              { npc: 'lele', zh: '先回答我！你知道吗？你不知道！', en: 'Answer me first! Bet you don\'t know!' },
              { duel: {
                hearts: 5, loseOn: 'clueMistake', win: 'challengeWon',   // 4 hearts if you misheard the gate (Investigate 3)
                retreat: '对不起，我先走了。',
                prompts: [
                  { ask: 'listen', npc: 'lele', zh: '三和四，是几？', en: 'Three and four makes how many?', label: 'Listening · a number riddle', q: 'Three and four makes…?', options: ['七', '十', '三'], answer: '七' },
                  { ask: 'read', npc: 'lele', zh: '三 + 四', en: '3 + 4', label: 'Reading · Lele writes it down', q: 'How does Lele say "+"?', options: ['和', '也', '给'], answer: '和' },
                  { ask: 'listen', npc: 'lele', zh: '我有，你也有。我不能给你。是什么？', en: 'I have one, you have one too. I can\'t give it to you. What is it?', label: 'Listening · the riddle', q: 'What is it?', options: ['名字', '杯子', '面子'], answer: '名字' },
                  { build: true, npc: 'lele', zh: '五和四，是几？', en: 'Five and four makes how many?', label: 'Test · a full sentence', q: 'Answer his riddle in a full sentence.', answer: '五和四是九。', extra: ['七', '三'] },
                  { ask: 'read', npc: 'lele', zh: '四和五，几？谁？', en: 'Four and five, how many? Who?', label: 'Reading · his scribbles', q: 'Which word asks "how many"?', options: ['几', '谁', '什么'], answer: '几' },
                  { ask: 'listen', npc: 'lele', zh: '我是谁？', en: 'Who am I?', label: 'Listening · a new riddle', q: 'What does Lele ask?', options: ['我是谁？', '我是几？', '我是什么？'], answer: '我是谁？' },
                  { ask: 'read', npc: 'lele', zh: '我是谁的孩子？门票四十块！', en: 'Whose child am I? Tickets, forty yuan!', label: 'Reading · Lele\'s note', q: 'Whose child is Lele?', options: ['陈女士', '王奶奶', '林姐'], answer: '陈女士' },
                  { build: true, npc: 'lele', label: 'Speaking · the answer', q: 'You\'ve worked out whose child he is. Tell him.', answer: '你是陈女士的孩子。', extra: ['谁', '我'] }
                ]
              } },
              { ask: 'listen', npc: 'lele', face: 'happy', zh: '你有面子！给你杯子。', en: 'You\'ve got face! Here\'s the cup.', label: 'Listening · what do you have?', q: 'Lele hands it over. What does he say you have?', options: ['面子', '名字', '杯子'], answer: '面子' },
              { note: 'Lele hands over the white thermos. Grandma Wang is waiting by the spring.' }
            ]
          }
        }
      ]
    }),
    unit({
      id: 'payoff',
      title: 'Resolution + notebook page 1',
      npc: 'wang',
      en: 'You bring the thermos back to Grandma Wang, and read notebook page 1.',
      parts: [
        {
          id: 'pay1',
          title: 'Resolution · the thermos',
          en: 'Grandma Wang gets her thermos back. Inside the lid, a photo.',
          words: ['高兴', '看到', '认识', '她', '早上'],
          use: {
            place: 'By the railing at Baotu Spring',
            steps: [
              { note: 'Grandma Wang is still by the railing. She sees the white thermos in your hands.' },
              { ask: 'listen', npc: 'wang', face: 'happy', zh: '我的杯子！我很高兴！', en: 'My cup! I\'m so happy!', label: 'Listening · how does she feel?', q: 'How does Grandma Wang feel?', options: ['很高兴', '不高兴', '很多年'], answer: '很高兴' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'Tell her who had it.', options: [
                { zh: '我看到乐乐了。' },
                { zh: '乐乐拿了，我看到了。' },
                { zh: '我是乐乐。', nonsense: true, react: '你是乐乐？什么？' }
              ] },
              { npc: 'wang', zh: '乐乐？陈女士的孩子？', en: 'Lele? Ms. Chen\'s child?' },
              { build: true, npc: 'wang', label: 'Speaking · Ms. Chen', q: 'Ask whether she knows Ms. Chen.', answer: '你认识她吗？', extra: ['看到', '我'] },
              { npc: 'wang', face: 'happy', zh: '认识！我认识她很多年了。', en: 'I do! I\'ve known her for years.' },
              { ask: 'listen', npc: 'wang', zh: '孩子，这是老周的杯子。', en: 'Child, this was Old Zhou\'s cup.', label: 'Listening · whose cup?', q: 'Whose cup was it, really?', options: ['老周的杯子', '乐乐的杯子', '王奶奶的杯子'], answer: '老周的杯子' },
              { ask: 'listen', npc: 'wang', zh: '老周天天早上都来这儿，他说：七十三！', en: 'Old Zhou came here every morning, and he said: seventy-three!', label: 'Listening · when?', q: 'When did Old Zhou come here?', options: ['天天早上', '天天下午', '上午九点'], answer: '天天早上' },
              { note: 'She opens the lid. Tucked inside is a small photo: a stone carved with 七十三.' },
              { npc: 'wang', face: 'confused', zh: '你知道七十三吗？', en: 'Do you know what seventy-three is?' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'You have no idea.', options: [
                { zh: '我不知道。' },
                { zh: '对不起，我不知道。' },
                { zh: '七十三是我。', nonsense: true, react: '什么？' }
              ] },
              { npc: 'wang', zh: '我也不知道。你的本子！', en: 'I don\'t know either. Your notebook!' }
            ]
          }
        },
        {
          id: 'pay2',
          title: 'Payoff · notebook page 1',
          intro: 'You open Old Zhou\'s notebook by the spring. The ink is clearer now.',
          en: 'Read notebook page 1, then lunch at Grandma Wang\'s.',
          words: ['做', '饭', '好吃', '现在', '还有'],
          use: {
            place: 'By the railing at Baotu Spring',
            steps: [
              { ask: 'listen', npc: 'wang', face: 'happy', zh: '孩子，你吃饭了吗？我做饭，你来吧！', en: 'Child, have you eaten? I\'ll cook. Come over!', label: 'Listening · what does she offer?', q: 'What does Grandma Wang offer?', options: ['做饭', '喝水', '门票'], answer: '做饭' },
              { reply: true, npc: 'wang', label: 'Speaking · reply', q: 'Lunch at Grandma Wang\'s. Accept.', options: [
                { zh: '好！我现在来！' },
                { zh: '谢谢！我现在去。' },
                { zh: '我做你！', nonsense: true, react: '你做我？什么？哈哈！' }
              ] },
              { ask: 'listen', npc: 'wang', zh: '我做的饭很好吃！', en: 'My cooking is delicious!', label: 'Listening · her cooking', q: 'What does she say about her cooking?', options: ['很好吃', '很高兴', '很多年'], answer: '很好吃' },
              { note: 'Before you go, you open the notebook. Page 1 reads clearly now. Read it from the top.' },
              { ask: 'read', zh: '济南有七十二名泉。你知道吗？还有一个泉。', en: 'Jinan has seventy-two famous springs. Did you know? There is one more spring.', label: 'Reading · notebook page 1', q: 'What does Old Zhou say there is?', options: ['还有一个泉', '还有一个杯子', '还有一个孩子'], answer: '还有一个泉' },
              { ask: 'read', zh: '我找了很多年。现在，你来找吧。', en: 'I looked for it for many years. Now it\'s your turn to look.', label: 'Reading · notebook page 1', q: 'What does he ask you to do now?', options: ['你来找吧', '你来喝水吧', '你来回答吧'], answer: '你来找吧' },
              { ask: 'read', zh: '先去认识王奶奶。她做的饭很好吃。', en: 'First, go and meet Grandma Wang. Her cooking is delicious.', label: 'Reading · notebook page 1', q: 'Who does he tell you to meet first?', options: ['王奶奶', '乐乐', '老潘'], answer: '王奶奶' },
              { note: 'Seventy-two famous springs, and one more: the seventy-third. Old Zhou looked for it for years. Now it\'s your turn.' }
            ]
          }
        }
      ]
    })
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
