/* 故 Stories · HSK 1 · Night barbecue at Kuanhouli, and a missing wallet. */
window.STORIES.push({
  id: 'hsk1-sun-wallet', hsk: 1, chars: ['sun'],
  title: ['钱包在哪儿？', 'Where Is My Wallet?'],
  names: ['孙师傅', '宽厚里', '芙蓉街'],
  new: [['肉串', 'ròuchuàn', 'meat skewer'], ['加', 'jiā', 'to add']],
  text: [
    ['星期六晚上，我去宽厚里吃孙师傅的肉串。', "On Saturday night, I went to Kuanhouli to eat Master Sun's meat skewers."],
    ['“来了！朋友，还是十个肉串？”', '"Coming! Friend, ten skewers as usual?"'],
    ['我吃了十个肉串，还喝了两杯茶。', 'I ate ten skewers and drank two cups of tea.'],
    ['要给钱的时候，我找不到我的钱包！', 'When it was time to pay, I couldn\'t find my wallet!'],
    ['我的手机也没电了。', 'My phone was dead too.'],
    ['我说：“孙师傅，对不起……我的钱包不在这儿。”', 'I said: "Master Sun, I\'m sorry… my wallet isn\'t here."'],
    ['孙师傅笑了：“朋友，没关系！明天给吧！”', 'Master Sun laughed: "Friend, no problem! Pay me tomorrow!"'],
    ['“今天很冷，要不要加一个肉串？我送你！”', '"It\'s cold tonight. How about one more skewer? It\'s on me!"'],
    ['第二天晚上，我拿着钱去了宽厚里。', 'The next evening, I went to Kuanhouli with the money.'],
    ['孙师傅看到我就问：“朋友，今天你的钱包在不在？”', 'As soon as Master Sun saw me, he asked: "Friend, did you bring your wallet today?"'],
    ['我笑着说：“在！今天我要二十个肉串！”', 'I laughed and said: "I did! Today I want twenty skewers!"']
  ],
  chunks: [
    ['还是十个', 'ten again (as usual)', '还是 = still / as before. 还是老样子？ = the usual?'],
    ['找不到', "can't find", '找 + 不 + 到: you looked but didn\'t find it. 找到了 = found it.'],
    ['没电了', 'out of battery', '手机没电了 = my phone is dead. 了 shows the change.'],
    ['明天给吧', 'pay tomorrow', '给 (give) is often just "pay" when talking about money.'],
    ['拿着钱', 'with money in hand', 'Verb + 着 shows how you do something: 拿着钱去 = go carrying the money.']
  ],
  qs: [
    { q: '我在哪儿吃肉串？', o: ['宽厚里', '芙蓉街', '山东大学'], a: 0 },
    { q: '要给钱的时候，我找不到什么？', o: ['钱包', '手机', '孙师傅'], a: 0 },
    { q: '孙师傅说我什么时候给钱？', o: ['明天', '今天晚上', '下个月'], a: 0 },
    { q: '第二天晚上，我要了多少个肉串？', o: ['二十个', '十个', '两个'], a: 0 }
  ],
  blanks: [
    { s: 2, t: '十个肉串', d: ['十个杯子', '十本书', '十块钱'] },
    { s: 3, t: '找不到', d: ['吃不了', '听不见', '睡不着'] },
    { s: 4, t: '没电了', d: ['没饭了', '没水了', '没人了'] },
    { s: 6, t: '没关系', d: ['不客气', '谢谢你', '你好'] },
    { s: 7, t: '我送你', d: ['你送我', '我问你', '我找你'] },
    { s: 8, t: '第二天晚上', d: ['昨天晚上', '前天晚上', '去年晚上'] }
  ]
});
