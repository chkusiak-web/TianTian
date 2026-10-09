/* 故 Stories · HSK 3 · 林姐 */
window.STORIES.push({
  id: 'hsk3-lin-coat', hsk: 3, chars: ['lin'],
  title: ['下个星期再来', 'Come Back Next Week'],
  names: ['林姐', '恒隆广场'],
  new: [['折', 'zhé', 'discount (打八折 = pay 80%)'], ['围巾', 'wéijīn', 'scarf']],
  text: [
    ['天气越来越冷了，我想买一件大衣。', 'The weather was getting colder and colder, and I wanted to buy a winter coat.'],
    ['我去了恒隆广场，在一家店里看见了一件很好看的大衣。', 'I went to Hang Lung Plaza and saw a really nice coat in one of the shops.'],
    ['一个服务员走过来说：“您好！请问您需要什么？”', 'A shop assistant came over and said: "Hello! What can I help you with?"'],
    ['我一看，是住在我对面的林姐！', 'I looked up — it was Sister Lin, who lives across from me!'],
    ['我笑了：“林姐，是我啊！你怎么跟我说‘您’？”', 'I laughed: "Sister Lin, it\'s me! Why are you being so formal with me?"'],
    ['她也笑了，可是马上又说：“好的。这件大衣是新到的，您穿上试试？”', 'She laughed too, but straight away went on: "Of course. This coat just came in. Would you like to try it on?"'],
    ['我穿上一看，大小正好，颜色也很漂亮。', 'I put it on: the size was just right, and the color was lovely too.'],
    ['可是我一问价格，要两千八百块！', 'But when I asked the price, it was two thousand eight hundred yuan!'],
    ['我正在想怎么办，林姐小声地说：“先别买，下个星期这里打八折。”', 'While I was wondering what to do, Sister Lin whispered: "Don\'t buy it yet. Next week everything here is 20% off."'],
    ['然后她又大声地说：“好的，您再看看！欢迎下次再来！”', 'Then she said loudly: "Of course, do have another look! Please come again!"'],
    ['一个星期以后，我又去了那家店。', 'A week later, I went back to that shop.'],
    ['林姐看见我，笑着说：“您好！请问您需要什么？”', 'Sister Lin saw me and said with a smile: "Hello! What can I help you with?"'],
    ['这次大衣便宜了五百多块，林姐还送了我一条围巾。', 'This time the coat was over five hundred yuan cheaper, and Sister Lin even gave me a scarf.'],
    ['我想：虽然林姐在店里叫我“您”，但是她真是一个很好的朋友。', 'I thought: even if Sister Lin talks to me so formally at the shop, she really is a great friend.']
  ],
  chunks: [
    ['请问您需要什么', 'what can I help you with?', 'The polite shop greeting. 请问 = may I ask; 您 = polite "you."'],
    ['穿上试试', 'try it on', 'Verb + 上 (put on) + 试试 (give it a try). 吃吃看 works the same way for food.'],
    ['大小正好', 'just the right size', '大小 = size (big + small). 正好 = just right.'],
    ['打八折', '20% off', 'Chinese discounts say what you pay: 打八折 = pay 80%. 打五折 = half price.'],
    ['欢迎下次再来', 'please come again', 'What shop staff say as you leave.']
  ],
  qs: [
    { q: '我想买什么？', o: ['一件大衣', '一条裙子', '一块手表'], a: 0 },
    { q: '林姐为什么让我先别买？', o: ['因为下个星期会便宜', '因为大衣不好看', '因为大衣太小了'], a: 0 },
    { q: '第二次去，大衣便宜了多少？', o: ['五百多块', '两千八百块', '八十块'], a: 0 },
    { q: '林姐还送了我什么？', o: ['一条围巾', '一件大衣', '一杯咖啡'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '越来越冷', d: ['越来越热', '越来越近', '越来越短'] },
    { s: 1, t: '一件', d: ['一本', '一张', '一杯'] },
    { s: 5, t: '穿上试试', d: ['吃吃看', '听听看', '写写看'] },
    { s: 6, t: '正好', d: ['太小', '太大', '不好'] },
    { s: 8, t: '打八折', d: ['打电话', '打车', '打球'] },
    { s: 9, t: '欢迎下次再来', d: ['欢迎回家', '好久不见', '生日快乐'] },
    { s: 12, t: '一条围巾', d: ['一条鱼', '一条路', '一条河'] }
  ]
});
