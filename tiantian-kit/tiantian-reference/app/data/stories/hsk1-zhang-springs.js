/* 故 Stories · HSK 1 · Teacher Zhang quizzes me about Jinan's springs. */
window.STORIES.push({
  id: 'hsk1-zhang-springs', hsk: 1, chars: ['zhang'],
  title: ['张老师的问题', "Teacher Zhang's Question"],
  names: ['张老师', '趵突泉', '济南', '泉城'],
  new: [['泉', 'quán', 'spring (of water)']],
  text: [
    ['早上六点，我在趵突泉看到了张老师。', 'At six in the morning, I saw Teacher Zhang at Baotu Spring.'],
    ['他常常早上来这儿喝茶。', 'He often comes here in the morning to drink tea.'],
    ['“你好！来，坐下喝杯茶。这个茶是用泉水做的。”', '"Hello! Come, sit down and have a cup of tea. This tea is made with spring water."'],
    ['我喝了一口，真好喝！', 'I took a sip. It was really good!'],
    ['张老师笑着问我：“你知道吗？济南有多少个泉？”', 'Teacher Zhang smiled and asked me: "Do you know how many springs Jinan has?"'],
    ['我想了想，说：“十个？”', 'I thought for a moment and said: "Ten?"'],
    ['“不对！你再想想。”', '"Wrong! Think again."'],
    ['“一百个？”张老师说：“济南的泉很多，最有名的有七十二个。”', '"A hundred?" Teacher Zhang said: "Jinan has lots of springs. The most famous ones number seventy-two."'],
    ['“泉多，大家就叫济南‘泉城’！”', '"With so many springs, people call Jinan the City of Springs!"'],
    ['第二天早上，在趵突泉，张老师问我：“济南有多少个有名的泉？”', 'The next morning at Baotu Spring, Teacher Zhang asked me: "How many famous springs does Jinan have?"'],
    ['我说：“七十三个！七十二个泉，还有张老师的茶！”张老师笑了：“不错，不错！”', 'I said: "Seventy-three! Seventy-two springs, plus Teacher Zhang\'s tea!" Teacher Zhang laughed: "Not bad, not bad!"']
  ],
  chunks: [
    ['喝杯茶', 'have a cup of tea', '喝 + (一)杯 + 茶: the 一 is often dropped. 坐下喝杯茶 is a classic polite invitation.'],
    ['真好喝', 'really tasty (drinks)', '好喝 for drinks, 好吃 for food, 好看 for things you look at.'],
    ['你知道吗', 'do you know…?', 'A friendly way to start a question or a fun fact.'],
    ['想了想', 'thought for a moment', 'Verb + 了 + verb = do it briefly: 想了想, 看了看.'],
    ['最有名的', 'the most famous', '最 + adjective = the most…: 最有名的泉, 最好吃的菜.'],
    ['第二天早上', 'the next morning', '第二天 = the next day (in a story about the past).']
  ],
  qs: [
    { q: '张老师早上在哪儿喝茶？', o: ['在趵突泉', '在学校', '在医院'], a: 0 },
    { q: '我第一次说济南有多少个泉？', o: ['十个', '七十二个', '一百个'], a: 0 },
    { q: '济南最有名的泉有多少个？', o: ['七十二个', '七十三个', '十个'], a: 0 },
    { q: '我说的七十三个里，还有什么？', o: ['张老师的茶', '张老师的家', '趵突泉'], a: 0 }
  ],
  blanks: [
    { s: 2, t: '喝杯茶', d: ['看本书', '写个字', '买个车'] },
    { s: 3, t: '真好喝', d: ['真好看', '真好听', '真好玩儿'] },
    { s: 4, t: '你知道吗', d: ['你饿了吗', '你累了吗', '你在家吗'] },
    { s: 6, t: '不对', d: ['不错', '很好', '没错'] },
    { s: 7, t: '最有名的', d: ['最小的', '最新的', '最贵的'] },
    { s: 9, t: '第二天早上', d: ['昨天早上', '前天早上', '去年早上'] }
  ]
});
