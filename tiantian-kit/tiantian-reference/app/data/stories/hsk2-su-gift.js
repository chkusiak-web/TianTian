/* 故 Stories · HSK 2 · 小苏 */
window.STORIES.push({
  id: 'hsk2-su-gift', hsk: 2, chars: ['su'],
  title: ['小苏的礼物', "Xiao Su's Present"],
  names: ['小苏', '小月', '芙蓉街'],
  new: [['奇怪', 'qíguài', 'strange'], ['酷', 'kù', 'cool']],
  text: [
    ['小苏最近有点儿奇怪，常常一个人看着手机笑。', "Xiao Su has been a little strange lately. He often smiles at his phone all by himself."],
    ['有一天，他小声问我：“你说，女生喜欢什么礼物？”', 'One day he quietly asked me: "Tell me, what kind of present do girls like?"'],
    ['我笑了：“谁的生日？”他说：“我们班的小月……下个星期五。”', 'I laughed: "Whose birthday?" He said: "Xiaoyue in my class… next Friday."'],
    ['那天下午，我们一起去芙蓉街看礼物。', 'That afternoon we went to Furong Street together to look at presents.'],
    ['小苏看了很多东西：花、杯子、衣服……他都说“不好”。', 'Xiao Su looked at lots of things: flowers, cups, clothes… and said "no good" to all of them.'],
    ['最后，他买了一本英文书：“她也喜欢英语！太酷了！”', 'In the end, he bought an English book: "She likes English too! So cool!"'],
    ['他还问我：“‘生日快乐’用英语怎么说？”', 'He also asked me: "How do you say \'生日快乐\' in English?"'],
    ['我告诉了他，他在路上说了二十遍。', 'I told him, and he said it twenty times on the way.'],
    ['星期五，小苏拿着书，在图书馆门口等了一个小时。', 'On Friday, Xiao Su waited outside the library for an hour, holding the book.'],
    ['小月来了，她的手里也拿着一本书。', 'Xiaoyue arrived, and she was holding a book too.'],
    ['他们一看，两本书是一样的！', 'They looked: the two books were the same!'],
    ['原来下个月是小苏的生日，小月也想送他一本。', 'It turned out Xiao Su\'s birthday was next month, and Xiaoyue had wanted to give him a copy too.'],
    ['那天晚上，小苏给我打电话，说了三十遍“太酷了”。', 'That night, Xiao Su called me and said "so cool" thirty times.']
  ],
  chunks: [
    ['小声问', 'to ask quietly', '小声 = in a low voice; 大声 = loudly. 小声说, 大声问.'],
    ['看礼物', 'to look at presents', '看 also means to browse/shop: 看衣服, 看房子.'],
    ['用英语怎么说', 'how do you say it in English', "Xiao Su's favorite question. Swap the language: 用中文怎么说？"],
    ['说了二十遍', 'said it twenty times', '遍 counts times you do something start to finish: 说了三遍, 看了两遍.'],
    ['等了一个小时', 'waited for an hour', 'Verb + 了 + length of time: 等了一个小时, 走了半个小时.'],
    ['一样的', 'the same', '两本书是一样的 = the two books are the same. 跟…一样 = the same as…']
  ],
  qs: [
    { q: '小苏想给谁买礼物？', o: ['他们班的小月', '他的妈妈', '他的姐姐'], a: 0 },
    { q: '小苏最后买了什么？', o: ['一本英文书', '一些花', '一件衣服'], a: 0 },
    { q: '小月手里拿着什么？', o: ['一本一样的书', '一个杯子', '一个手机'], a: 0 },
    { q: '小苏的生日是什么时候？', o: ['下个月', '下个星期五', '昨天'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '小声问我', d: ['帮我开门', '给我打车', '请我吃饭'] },
    { s: 5, t: '一本', d: ['一件', '一杯', '一只'] },
    { s: 6, t: '怎么说', d: ['怎么走', '怎么吃', '怎么买'] },
    { s: 7, t: '二十遍', d: ['二十本', '二十件', '二十杯'] },
    { s: 8, t: '等了一个小时', d: ['睡了一个小时', '吃了一个小时', '跑了一个小时'] },
    { s: 12, t: '打电话', d: ['打球', '睡觉', '起床'] }
  ]
});
