// Baotu Spring (district 1): the beats, their scenes, notebook page 1.
// Word sets come from content/baotu-words.json (tools/assign-words.js, approved by the user).
// Every Chinese string here is checked by `npm run check`: HSK 1 + lexicon, only words of this beat or earlier ones,
// and each beat word used twice in its scene and answered at least once (CONCEPT §6.10).
//
// A scene is a list of steps:
//   { who, zh, en }                       a line someone says (spoken, hoverable)
//   { do }                                English stage direction
//   { ask: 'pick', label, options, answer, words }        choose what you say (Chinese tiles)
//   { ask: 'listen', label, hear, options, answer, words } hear a line, then choose (text shows after you answer)
//   { ask: 'build', label, tiles, extra, words }           put word tiles in order (answer = tiles joined)
// `words` are the beat words a right answer catches. `label` is the English skill + story action.
import WORDS from './baotu-words.json' with { type: 'json' };

const words = (id) => WORDS.beats.find((b) => b.id === id).words;

export default {
  district: 'baotu',

  cast: {
    pan: { name: '老潘', en: 'Old Pan' },
    zhang: { name: '张老师', en: 'Teacher Zhang' },
    wang: { name: '王奶奶', en: 'Grandma Wang' },
    me: { name: '', en: 'You' }
  },

  beats: [
    {
      id: 'opening',
      title: 'Opening · Old Pan\'s taxi',
      place: 'From the station to Qushuiting Street',
      words: words('opening'),
      scene: {
        backdrop: 'taxi',
        steps: [
          { do: 'Jinan West Station. A taxi driver waves at you and opens the door.' },
          { who: 'pan', zh: '你好！你好！我是老潘。', en: 'Hello, hello! I\'m Old Pan.' },
          { ask: 'pick', label: 'Speaking · say hello', options: ['你好！', '谢谢！', '不是。'], answer: '你好！', words: ['你好'] },
          { who: 'pan', zh: '这是济南！泉城！', en: 'This is Jinan! The City of Springs!' },
          { who: 'pan', zh: '曲水亭街……老周的……是吗？', en: 'Qushuiting Street… Old Zhou\'s place… right?' },
          { ask: 'pick', label: 'Speaking · yes or no?', options: ['是。', '不是。'], answer: '是。', words: ['是'] },
          { who: 'pan', zh: '你是……你是张老师吗？', en: 'Are you… are you Teacher Zhang?' },
          { ask: 'build', label: 'Speaking · tell him no', tiles: ['不是', '，', '我', '不是', '张老师', '。'], extra: ['你', '吗'], words: ['不', '我'] },
          { who: 'pan', zh: '哈哈！不是，不是！', en: 'Ha ha! No, no!' },
          { do: 'Qushuiting Street. An old man with a key is waiting at a red door.' },
          { who: 'zhang', zh: '你好！我是张老师。', en: 'Hello! I\'m Teacher Zhang.' },
          { who: 'zhang', zh: '这是老周的本子。这是你的。', en: 'This is Old Zhou\'s notebook. It\'s yours.' },
          { ask: 'listen', label: 'Listening · whose notebook is it?', hear: '这是老周的本子。', options: ['老周的本子', '老潘的本子', '张老师的本子'], answer: '老周的本子', words: ['的', '本子'] },
          { ask: 'build', label: 'Speaking · check with him', tiles: ['这', '是', '我', '的', '本子', '吗', '？'], extra: ['不', '你好'], words: ['这', '吗'] },
          { who: 'zhang', zh: '是！你的本子。', en: 'Yes! Your notebook.' },
          { ask: 'pick', label: 'Speaking · thank him', options: ['谢谢你！', '你是我的。', '不是你的。'], answer: '谢谢你！', words: ['谢谢', '你'] },
          { do: 'You open the notebook. Every page is smudged ink, except a few words on the first page.' },
          { who: 'zhang', zh: '七……三……', en: 'Seven… three…' },
          { ask: 'listen', label: 'Listening · which numbers does he read?', hear: '七……三……', options: ['七，三', '三，七', '七，七'], answer: '七，三', words: ['七', '三'] }
        ]
      }
    },
    {
      id: 'hook',
      title: 'Hook · Grandma Wang\'s thermos',
      place: 'Morning at the spring',
      who: 'wang',
      words: words('hook'),
      scene: {
        steps: [
          { do: 'Next morning, by the spring\'s railing. An old woman is looking everywhere.' },
          { who: 'wang', zh: '哎呀！哎呀！', en: 'Oh dear! Oh dear!' },
          { who: 'wang', zh: '孩子，你好！我是王奶奶。', en: 'Hello, child! I\'m Grandma Wang.' },
          { ask: 'listen', label: 'Listening · what does she call you?', hear: '孩子，你好！', options: ['孩子', '杯子', '本子'], answer: '孩子', words: ['孩子'] },
          { ask: 'pick', label: 'Speaking · say hello', options: ['王奶奶，你好！', '王奶奶，谢谢！', '王奶奶，不是。'], answer: '王奶奶，你好！', words: [] },
          { who: 'wang', zh: '孩子，这是泉。我的杯子……', en: 'Child, this is the spring. My cup…' },
          { ask: 'pick', label: 'Reading · she points at the water. What is it?', options: ['这是泉。', '这是杯子。', '这是本子。'], answer: '这是泉。', words: ['泉'] },
          { who: 'wang', zh: '我的杯子没有了！', en: 'My cup is gone!' },
          { ask: 'build', label: 'Listening · what\'s wrong?', tiles: ['王奶奶', '的', '杯子', '没有', '了', '。'], extra: ['本子', '是'], words: ['杯子', '没有', '了'] },
          { who: 'wang', zh: '是一个白杯子。', en: 'It\'s a white cup.' },
          { ask: 'listen', label: 'Listening · what does her cup look like?', hear: '是一个白杯子。', options: ['一个白杯子', '三个白杯子', '一个白本子'], answer: '一个白杯子', words: ['一', '个', '白'] },
          { do: 'She grabs a red cup from the bench.' },
          { who: 'wang', zh: '这个……这个杯子是我的吗？', en: 'This… is this cup mine?' },
          { ask: 'build', label: 'Speaking · look at the cup, then answer', tiles: ['不是', '。', '这个', '不是', '白', '的', '。'], extra: ['是', '一'], words: ['个', '白'] },
          { who: 'wang', zh: '不是……我想要我的杯子！', en: 'No… I want my cup!' },
          { ask: 'pick', label: 'Reading · what does Grandma Wang want?', options: ['王奶奶想要白杯子。', '王奶奶想要一个本子。', '王奶奶不要杯子。'], answer: '王奶奶想要白杯子。', words: ['想', '要'] },
          { who: 'wang', zh: '孩子，先谢谢你！', en: 'Child, thank you in advance!' },
          { ask: 'listen', label: 'Listening · what does she say?', hear: '孩子，先谢谢你！', options: ['先谢谢你！', '不谢谢你！', '我想谢谢你！'], answer: '先谢谢你！', words: ['先'] },
          { who: 'wang', zh: '我先……我先想一想。一个白杯子……', en: 'Let me… let me think first. A white cup…' },
          { do: 'Quest: find Grandma Wang\'s white thermos. Someone in the tai chi group might have seen it.' }
        ]
      }
    },
    { id: 'inv1', title: 'Investigate 1 · tai chi group', who: 'zhang', words: words('inv1'), scene: null },
    { id: 'inv2', title: 'Investigate 2 · ticket window', who: 'chen', words: words('inv2'), scene: null },
    { id: 'inv3', title: 'Investigate 3 · fish pool and Gate 4', who: 'xie', words: words('inv3'), scene: null },
    { id: 'challenge', title: 'Challenge · Lele\'s riddle duel', who: 'lele', words: words('challenge'), scene: null },
    { id: 'payoff', title: 'Resolution + notebook page 1', who: 'wang', words: words('payoff'), scene: null }
  ],

  // Old Zhou's notebook, page 1 (CONCEPT §5.1). Each line comes into focus once all its words are caught.
  notebook: {
    header: '七十三',
    lines: [
      { zh: '孩子：你好！我是老周。你看到这个本子，我很高兴。', en: 'Child: hello! I\'m Old Zhou. You\'ve found this notebook, and I\'m glad.' },
      { zh: '济南有七十二名泉。你知道吗？还有一个泉。七十三。', en: 'Jinan has 72 famous springs. Did you know? There\'s one more spring. Seventy-three.' },
      { zh: '我找了很多年。现在，你来找吧。', en: 'I looked for many years. Now it\'s your turn to look.' },
      { zh: '先去认识王奶奶。她做的饭很好吃。', en: 'First go and meet Grandma Wang. Her cooking is delicious.' }
    ]
  }
};
