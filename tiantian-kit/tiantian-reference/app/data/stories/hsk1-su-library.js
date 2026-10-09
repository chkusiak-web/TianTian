/* 故 Stories · HSK 1 · Xiao Su learns a new English word, a little too loudly. */
window.STORIES.push({
  id: 'hsk1-su-library', hsk: 1, chars: ['su'],
  title: ['图书馆里的“酷”', 'Cool in the Library'],
  names: ['小苏', '山东大学'],
  new: [['英语', 'Yīngyǔ', 'English (language)'], ['酷', 'kù', 'cool'], ['安静', 'ānjìng', 'quiet']],
  text: [
    ['星期三下午，我和小苏在山东大学的图书馆学习。', 'On Wednesday afternoon, Xiao Su and I were studying in the Shandong University library.'],
    ['图书馆里有很多人，都在看书。', 'There were lots of people in the library, all reading.'],
    ['小苏写了一个字，问我：“‘书’用英语怎么说？”', 'Xiao Su wrote a character and asked me: "How do you say 书 in English?"'],
    ['我在本子上写：book。', 'I wrote in my notebook: book.'],
    ['他还问：“那‘非常好’用英语怎么说？”', 'He also asked: "Then how do you say \'really great\' in English?"'],
    ['我写：cool。我告诉他，cool就是“酷”。', 'I wrote: cool. I told him that "cool" is 酷.'],
    ['小苏非常高兴，站起来说：“Cool！太酷了！”', 'Xiao Su was thrilled. He stood up and said: "Cool! So cool!"'],
    ['图书馆里的人都看着我们。', 'Everyone in the library was looking at us.'],
    ['一个老师走过来说：“请安静！”', 'A teacher walked over and said: "Please be quiet!"'],
    ['小苏马上坐下说：“对不起！”', 'Xiao Su sat down right away and said: "Sorry!"'],
    ['我们走到外边，小苏笑着问我：“‘请安静’用英语怎么说？”', 'We went outside, and Xiao Su asked me with a grin: "How do you say \'please be quiet\' in English?"']
  ],
  chunks: [
    ['用英语怎么说', 'how do you say it in English', '用 + language + 怎么说: 用中文怎么说？ is the most useful question for a learner.'],
    ['站起来', 'to stand up', '站 + 起来 (up). The opposite is 坐下.'],
    ['太酷了', 'so cool', '太 + adjective + 了 = so…!: 太好了, 太酷了.'],
    ['看着我们', 'looking at us', 'Verb + 着 = in the middle of doing it: 看着, 等着.'],
    ['请安静', 'please be quiet', 'What you see on signs in libraries and hospitals.'],
    ['走到外边', 'walk outside', '走到 + place = walk (all the way) to. 外边 = outside.']
  ],
  qs: [
    { q: '我和小苏在哪儿学习？', o: ['在图书馆', '在饭店', '在家里'], a: 0 },
    { q: '小苏说了什么，图书馆里的人都看着我们？', o: ['太酷了', '对不起', '你好'], a: 0 },
    { q: '老师走过来说了什么？', o: ['请安静', '请坐', '再见'], a: 0 },
    { q: '到了外边，小苏问我什么？', o: ['“请安静”用英语怎么说', '图书馆在哪儿', '现在几点了'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '图书馆', d: ['电影院', '火车站', '洗手间'] },
    { s: 2, t: '用英语怎么说', d: ['在哪儿买', '多少钱', '是谁的'] },
    { s: 6, t: '站起来', d: ['坐下来', '跑出去', '走回家'] },
    { s: 7, t: '都看着我们', d: ['都在睡觉', '都在打球', '都回家了'] },
    { s: 8, t: '请安静', d: ['请进', '请坐', '请喝茶'] },
    { s: 9, t: '对不起', d: ['不客气', '没关系', '你好'] }
  ]
});
