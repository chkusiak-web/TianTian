/* 故 Stories · HSK 1 · Old Pan skips Furong Street and takes me to his favourite place. */
window.STORIES.push({
  id: 'hsk1-pan-station', hsk: 1, chars: ['pan'],
  title: ['老潘的好地方', "Old Pan's Favourite Place"],
  names: ['老潘', '芙蓉街', '济南', '把子肉'],
  new: [['结婚', 'jiéhūn', 'to get married'], ['爱人', 'àiren', 'husband or wife; spouse']],
  text: [
    ['星期六中午，我想去芙蓉街吃饭，就打了一个车。', 'On Saturday at noon, I wanted to go eat on Furong Street, so I took a taxi.'],
    ['开车的是老潘：“你好！你是哪国人？”', 'The driver was Old Pan: "Hi! Where are you from?"'],
    ['他还问：“多大了？结婚了吗？喜欢吃什么？”', 'He kept going: "How old are you? Are you married? What do you like to eat?"'],
    ['我说：“我想吃济南菜。什么好吃？”', 'I said: "I want to eat Jinan food. What\'s good?"'],
    ['“我跟你说，芙蓉街人太多！我们去一个好地方！”', '"Let me tell you, Furong Street is way too crowded! We\'re going somewhere good!"'],
    ['车开了一会儿，我们到了一个小饭店。', 'After a little while, we pulled up at a small restaurant.'],
    ['老潘也下了车：“走，我们一起吃！这儿的把子肉最好吃！”', 'Old Pan got out too: "Come on, let\'s eat together! The bazirou here is the best!"'],
    ['饭店里一个女的看见老潘，笑了：“你来了！”', 'A woman in the restaurant saw Old Pan and smiled: "There you are!"'],
    ['老潘说：“我跟你说，这是我爱人。这是她的饭店！”', 'Old Pan said: "Let me tell you, this is my wife. This is her restaurant!"'],
    ['她给了我很多米饭和两块把子肉，问：“你是哪国人？结婚了吗？”', 'She gave me a pile of rice and two pieces of bazirou, and asked: "Where are you from? Are you married?"'],
    ['我笑了：他们两个人问的都一样！', 'I laughed: the two of them ask exactly the same questions!']
  ],
  chunks: [
    ['打了一个车', 'took a taxi', '打车 = to take a taxi. 了一个 can go in the middle: 打了一个车.'],
    ['我跟你说', 'let me tell you', 'Old Pan starts almost every sentence with this.'],
    ['结婚了吗', 'are you married?', 'A very common (and very personal) small-talk question in China.'],
    ['人太多', 'too crowded', '太 + adjective = too …: 人太多, 太贵了.'],
    ['一个好地方', 'a good place', '一个 + adjective + noun: 一个好地方, 一个小饭店.'],
    ['两块把子肉', 'two pieces of bazirou', '块 is the measure word for chunks and pieces: 一块肉, 两块蛋糕.']
  ],
  qs: [
    { q: '老潘说芙蓉街什么太多？', o: ['人', '车', '饭店'], a: 0 },
    { q: '老潘说这个饭店什么最好吃？', o: ['把子肉', '米饭', '面条'], a: 0 },
    { q: '小饭店是谁的？', o: ['老潘的爱人的', '老潘的朋友的', '我的老师的'], a: 0 },
    { q: '老潘的爱人问了我什么？', o: ['我是哪国人，结婚了吗', '我几点回家', '我想喝什么茶'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '打了一个车', d: ['看了一本书', '写了一个字', '喝了一杯茶'] },
    { s: 2, t: '结婚了吗', d: ['下雨了吗', '几点了', '到家了吗'] },
    { s: 4, t: '人太多', d: ['书太多', '水太多', '字太多'] },
    { s: 6, t: '一起吃', d: ['一起学', '一起写', '一起睡'] },
    { s: 8, t: '我爱人', d: ['我的车', '我的书', '我的茶'] },
    { s: 9, t: '两块把子肉', d: ['两本把子肉', '两杯把子肉', '两次把子肉'] }
  ]
});
