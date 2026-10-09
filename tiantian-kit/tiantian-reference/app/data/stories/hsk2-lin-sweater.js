/* 故 Stories · HSK 2 · 林姐 */
window.STORIES.push({
  id: 'hsk2-lin-sweater', hsk: 2, chars: ['lin', 'wang'],
  title: ['两件红毛衣', 'Two Red Sweaters'],
  names: ['林姐', '王奶奶', '恒隆广场'],
  new: [['毛衣', 'máoyī', 'sweater'], ['邻居', 'línjū', 'neighbor']],
  text: [
    ['下个星期天是王奶奶的生日，我想给她买一件衣服。', "Next Sunday is Grandma Wang's birthday, and I wanted to buy her something to wear."],
    ['我去了恒隆广场，林姐就在那儿工作。', 'I went to Hang Lung Plaza, where Sister Lin works.'],
    ['“您好！请问您……”她看见是我，笑了：“是你啊，邻居！”', '"Hello! Can I help y—" She saw it was me and laughed: "Oh, it\'s you, neighbor!"'],
    ['我说：“我想给王奶奶买一件红色的衣服。”', 'I said: "I want to buy Grandma Wang something red to wear."'],
    ['林姐问：“好的，没问题。王奶奶穿多大的？”', 'Sister Lin asked: "Sure, no problem. What size does Grandma Wang wear?"'],
    ['我不知道。林姐想了想：“她跟我差不多高，我知道！”', 'I didn\'t know. Sister Lin thought for a moment: "She\'s about as tall as me. I know!"'],
    ['她给我拿来一件红毛衣，又便宜又好看。', 'She brought me a red sweater that was cheap and pretty.'],
    ['我很高兴，马上就买了。', 'I was really happy and bought it on the spot.'],
    ['星期天，我和林姐一起去王奶奶家。', 'On Sunday, Sister Lin and I went to Grandma Wang\'s place together.'],
    ['奶奶打开我的礼物：“红毛衣！谢谢你，孩子！”', 'Grandma opened my present: "A red sweater! Thank you, child!"'],
    ['然后她打开林姐的礼物，也是一件红毛衣，一样的！', "Then she opened Sister Lin's present. It was also a red sweater, the exact same one!"],
    ['我看着林姐，林姐不好意思地笑了：“我也觉得这件最好看。”', 'I looked at Sister Lin, and she gave an embarrassed smile: "I thought this one was the prettiest too."'],
    ['王奶奶笑着说：“好，好！一件今天穿，一件明天穿！孩子们，吃了吗？”', 'Grandma Wang laughed: "Good, good! One to wear today, one to wear tomorrow! Children, have you eaten?"']
  ],
  chunks: [
    ['一件衣服', 'a piece of clothing', '件 is the measure word for clothes: 一件衣服, 一件毛衣.'],
    ['穿多大的', 'what size (does someone) wear', '多大 = how big. 你穿多大的？ is how to ask someone\'s size.'],
    ['差不多高', 'about the same height', '跟…差不多 + adjective: 她跟我差不多高 = she\'s about as tall as me.'],
    ['又便宜又好看', 'both cheap and pretty', '又…又… links two qualities: 又好吃又不贵.'],
    ['不好意思地笑了', 'smiled in embarrassment', 'Adjective + 地 + verb describes how: 不好意思地笑了, 高兴地说.']
  ],
  qs: [
    { q: '我为什么去恒隆广场？', o: ['给王奶奶买生日礼物', '去找工作', '给林姐买衣服'], a: 0 },
    { q: '林姐怎么知道王奶奶穿多大的？', o: ['王奶奶跟她差不多高', '王奶奶给她打了电话', '我告诉了她'], a: 0 },
    { q: '王奶奶收到了什么？', o: ['两件一样的红毛衣', '一件红毛衣和一本书', '两件不一样的衣服'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '一件', d: ['一本', '一碗', '一只'] },
    { s: 4, t: '穿多大', d: ['吃多少', '走多远', '住多久'] },
    { s: 6, t: '又便宜又好看', d: ['又贵又难看', '又大又难看', '又小又贵'] },
    { s: 7, t: '马上就买了', d: ['马上就哭了', '马上就睡了', '马上就不要了'] },
    { s: 11, t: '不好意思', d: ['很生气', '不高兴', '很难过'] },
    { s: 12, t: '明天穿', d: ['明天吃', '明天看', '明天写'] }
  ]
});
