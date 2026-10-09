/* 故 Stories · HSK 1 · I only wanted one baozi. Master Sun had other plans. */
window.STORIES.push({
  id: 'hsk1-sun-baozi', hsk: 1, chars: ['sun'],
  title: ['一个包子', 'Just One Baozi'],
  names: ['孙师傅', '芙蓉街'],
  new: [['加', 'jiā', 'to add']],
  text: [
    ['早上七点，我去芙蓉街买早饭。', 'At seven in the morning, I went to Furong Street to buy breakfast.'],
    ['孙师傅看到我就说：“来了！朋友，吃什么？”', 'As soon as Master Sun saw me, he said: "Coming! Friend, what\'ll you have?"'],
    ['我说：“我要一个包子。”', 'I said: "I\'d like one baozi."'],
    ['“一个？朋友，要不要加一杯牛奶？”', '"Just one? Friend, how about adding a cup of milk?"'],
    ['我说：“好吧。”', 'I said: "OK, fine."'],
    ['“要不要加一个鸡蛋？好吃不贵！”', '"How about adding an egg? Tasty and cheap!"'],
    ['“……好。”“要不要再加两个包子？”', '"…OK." "How about two more baozi?"'],
    ['最后，我手里有三个包子、一个鸡蛋和一杯牛奶。', 'In the end, I had three baozi, an egg, and a cup of milk in my hands.'],
    ['我说：“孙师傅，太多了！我一个人吃不了！”', 'I said: "Master Sun, that\'s too much! I can\'t eat all this by myself!"'],
    ['孙师傅笑了：“没关系，朋友！这个包子是我送你的！”', 'Master Sun laughed: "No worries, friend! This baozi is on me!"'],
    ['我想：我要的是一个包子……', 'I thought: all I wanted was one baozi…']
  ],
  chunks: [
    ['买早饭', 'to buy breakfast', '买 + 早饭/午饭/晚饭. Many people in China buy breakfast from a street stall.'],
    ['要不要加', 'do you want to add…?', '要不要 + verb? = "do you want to…?" Every vendor\'s favorite question.'],
    ['好吃不贵', 'tasty and cheap', 'A classic street-food slogan: 好吃 + 不贵.'],
    ['吃不了', "can't finish (eating)", 'Verb + 不了 = can\'t manage it: 吃不了, 喝不了.'],
    ['送你的', "it's a gift for you", '是我送你的 = it\'s on me / my gift to you.']
  ],
  qs: [
    { q: '我早上想买几个包子？', o: ['一个', '三个', '两个'], a: 0 },
    { q: '最后，我手里有什么？', o: ['三个包子、一个鸡蛋和一杯牛奶', '一个包子', '两杯牛奶和一个鸡蛋'], a: 0 },
    { q: '孙师傅送了我什么？', o: ['一个包子', '一杯茶', '一个鸡蛋'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '买早饭', d: ['买衣服', '看电影', '买车票'] },
    { s: 2, t: '一个包子', d: ['一个手机', '一个杯子', '一个朋友'] },
    { s: 3, t: '一杯牛奶', d: ['一本书', '一个手机', '一个桌子'] },
    { s: 5, t: '好吃不贵', d: ['好看不贵', '好听不贵', '好玩儿不贵'] },
    { s: 7, t: '最后', d: ['昨天', '前天', '去年'] },
    { s: 8, t: '吃不了', d: ['看不见', '听不见', '找不到'] }
  ]
});
