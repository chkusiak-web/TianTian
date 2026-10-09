/* 故 Stories · HSK 1 · Buying a birthday present for Mom, with a stand-in model. */
window.STORIES.push({
  id: 'hsk1-lin-gift', hsk: 1, chars: ['lin'],
  title: ['妈妈的生日', "Mom's Birthday"],
  names: ['林姐', '恒隆广场'],
  new: [['件', 'jiàn', '(measure word for clothes)']],
  text: [
    ['下个星期是我妈妈的生日。', "Next week is my mom's birthday."],
    ['我去恒隆广场给她买衣服。', 'I went to Hang Lung Plaza to buy her some clothes.'],
    ['林姐在那儿工作。她说：“您好！请问您要买什么？”', 'Sister Lin works there. She said: "Hello! May I ask what you\'re looking for?"'],
    ['我说：“我想给我妈妈买一件衣服。”', 'I said: "I\'d like to buy a piece of clothing for my mom."'],
    ['林姐问：“好的。您妈妈穿多大的？”', 'Sister Lin asked: "Of course. What size does your mother wear?"'],
    ['我不知道！我想了想，说：“她跟你一样高。”', 'I had no idea! I thought for a moment and said: "She\'s as tall as you."'],
    ['林姐笑了：“好的，那我来试一下！”', 'Sister Lin laughed: "OK, then I\'ll try it on!"'],
    ['她穿上一件白衣服，问我：“好看吗？”', 'She put on a white top and asked me: "Does it look nice?"'],
    ['我说：“非常好看！我就要这件！”', 'I said: "It looks great! I\'ll take this one!"'],
    ['晚上，我在家门口看到了林姐。', 'In the evening, I ran into Sister Lin outside my door.'],
    ['她说：“那件衣服太好看了，明天我也去买一件！”', 'She said: "That top was so nice. Tomorrow I\'m going to buy one too!"']
  ],
  chunks: [
    ['给她买衣服', 'buy clothes for her', '给 + person + 买 + thing = buy something for someone.'],
    ['请问您要买什么', 'may I ask what you would like to buy', 'Polite shop talk: 请问 (may I ask) + 您 (polite "you").'],
    ['穿多大的', 'what size (to wear)', 'In a clothing shop, 多大 asks about size, not age.'],
    ['跟你一样高', 'as tall as you', 'A + 跟 + B + 一样 + adjective = A is as … as B.'],
    ['试一下', 'try it (on)', '试 + 一下 = give it a try. In a shop it means try it on.']
  ],
  qs: [
    { q: '我去恒隆广场做什么？', o: ['给妈妈买衣服', '找林姐吃饭', '买手机'], a: 0 },
    { q: '我妈妈跟谁一样高？', o: ['林姐', '我', '我爸爸'], a: 0 },
    { q: '我买了林姐试的衣服吗？', o: ['买了', '没买', '明天买'], a: 0 },
    { q: '晚上林姐说明天做什么？', o: ['也去买那件衣服', '去我家吃饭', '不去工作'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '买衣服', d: ['买车票', '看电影', '吃包子'] },
    { s: 2, t: '请问', d: ['再见', '对不起', '没关系'] },
    { s: 4, t: '多大', d: ['多远', '几点', '哪儿'] },
    { s: 5, t: '一样高', d: ['一样老', '一样忙', '一样累'] },
    { s: 6, t: '试一下', d: ['睡一下', '吃一下', '听一下'] },
    { s: 8, t: '非常好看', d: ['非常好吃', '非常好听', '非常好喝'] }
  ]
});
