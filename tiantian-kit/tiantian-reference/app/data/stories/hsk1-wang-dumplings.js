/* 故 Stories · reference example. See build/STORIES.md for the format. */
window.STORIES.push({
  id: 'hsk1-wang-dumplings', hsk: 1, chars: ['wang'],
  title: ['王奶奶的饺子', "Grandma Wang's Dumplings"],
  names: ['王奶奶'],
  new: [['饺子', 'jiǎozi', 'dumpling'], ['碗', 'wǎn', 'bowl']],
  text: [
    ['星期六早上，王奶奶给我打电话。', 'On Saturday morning, Grandma Wang called me.'],
    ['“孩子，你今天有时间吗？来我家吃饭吧！”', '"Child, are you free today? Come eat at my place!"'],
    ['我很高兴，马上就去了。', 'I was very happy and went right away.'],
    ['王奶奶家里有肉，有菜，还有很多东西。', "Grandma Wang's home had meat, vegetables, and lots of other things."],
    ['她说：“今天我们一起包饺子！”', 'She said: "Today we\'re making dumplings together!"'],
    ['我不会包饺子。奶奶说：“没关系，慢慢来。”', 'I can\'t make dumplings. Grandma said: "It\'s OK, take your time."'],
    ['她包一个，我也包一个。', 'She made one, and I made one too.'],
    ['我包的饺子不太好看。奶奶说：“很好，很好！”', 'The dumplings I made weren\'t very pretty. Grandma said: "Great, great!"'],
    ['中午，我们两个人吃了五十个饺子！', 'At noon, the two of us ate fifty dumplings!'],
    ['吃了饭，奶奶给了我一大碗饺子。', 'After the meal, Grandma gave me a big bowl of dumplings.'],
    ['“孩子，拿回家吃，别饿着！”', '"Child, take them home to eat. Don\'t go hungry!"']
  ],
  chunks: [
    ['打电话', 'to make a phone call', '打 + 电话: you "hit" a phone call. 给我打电话 = call me.'],
    ['有时间', 'to have time; to be free', '你有时间吗？ is the everyday way to ask "Are you free?"'],
    ['包饺子', 'to make dumplings', '包 means to wrap: you wrap the filling in the dough.'],
    ['慢慢来', 'take your time', 'Said to calm someone down: no rush, you\'ll get it.'],
    ['一大碗', 'a big bowl', '一 + 大 + measure word: 一大碗饭, 一大杯水.'],
    ['拿回家', 'to take home', '拿 (take) + 回家 (back home). 拿回家吃 = take it home to eat.']
  ],
  qs: [
    { q: '王奶奶给我打电话做什么？', o: ['请我去她家吃饭', '问我几点了', '请我去医院'], a: 0 },
    { q: '我会包饺子吗？', o: ['不会', '很会', '天天包'], a: 0 },
    { q: '中午我们吃了多少个饺子？', o: ['五十个', '十五个', '五个'], a: 0 },
    { q: '吃了饭，奶奶给了我什么？', o: ['一大碗饺子', '一杯茶', '一本书'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '打电话', d: ['打车', '看电视', '说中文'] },
    { s: 1, t: '有时间', d: ['有钱', '有名字', '有朋友'] },
    { s: 4, t: '包饺子', d: ['看电影', '买衣服', '去学校'] },
    { s: 5, t: '慢慢来', d: ['快一点', '对不起', '不客气'] },
    { s: 9, t: '一大碗', d: ['一大杯', '一大本', '一大块'] },
    { s: 10, t: '拿回家', d: ['拿出来', '坐下来', '打电话'] }
  ]
});
