/* 故 Stories · HSK 2 · 张老师 */
window.STORIES.push({
  id: 'hsk2-zhang-springwater', hsk: 2, chars: ['zhang'],
  title: ['张老师的泉水', "Teacher Zhang's Spring Water"],
  names: ['张老师', '济南', '黑虎泉', '泉城'],
  new: [['泉水', 'quánshuǐ', 'spring water'], ['茶叶', 'cháyè', 'tea leaves']],
  text: [
    ['星期六早上六点，张老师就来找我了。', 'At six on Saturday morning, Teacher Zhang was already at my door.'],
    ['“你知道吗？济南人喝茶，最喜欢用泉水。今天我们去打泉水！”', '"Did you know? When Jinan people drink tea, they love to use spring water best. Today we\'re going to fetch some!"'],
    ['我们拿了两个大瓶子，走到了黑虎泉。', 'We took two big bottles and walked to Black Tiger Spring.'],
    ['那儿已经有很多老人在排队了。', 'There were already lots of old folks standing in line.'],
    ['等的时候，张老师问我：“济南还叫什么？”', 'While we waited, Teacher Zhang asked me: "What else is Jinan called?"'],
    ['我说：“泉城！”他笑了：“不错，不错！”', 'I said: "The City of Springs!" He smiled: "Not bad, not bad!"'],
    ['打完水，我说：“老师，您休息，我来拿！”', 'When we\'d finished fetching the water, I said: "Teacher, you rest, I\'ll carry it!"'],
    ['可是两瓶水太重了，我走得很慢很慢。', 'But the two bottles of water were too heavy, and I walked very, very slowly.'],
    ['走了半个小时，我们才到家。', 'Only after half an hour of walking did we get home.'],
    ['张老师打开门，看了看，说：“不好！家里没有茶叶了！”', 'Teacher Zhang opened the door, looked around, and said: "Oh no! There are no tea leaves left at home!"'],
    ['我们两个人看着两大瓶泉水，都笑了。', 'The two of us looked at the two big bottles of spring water and both burst out laughing.'],
    ['那天上午，我们喝了很多很多泉水。', 'That morning, we drank lots and lots of spring water.'],
    ['张老师说：“你知道吗？泉水不放茶叶，也很好喝！”', 'Teacher Zhang said: "Did you know? Spring water tastes good even without tea leaves!"']
  ],
  chunks: [
    ['打泉水', 'to fetch spring water', '打 + 水 = to fetch water. Jinan locals queue at the springs with bottles to 打泉水.'],
    ['在排队', 'to be standing in line', '在 + verb = doing it right now. 很多人在排队 = lots of people are queuing.'],
    ['我来拿', "I'll carry it", '我来 + verb = "let me do it": 我来拿, 我来做, 我来买.'],
    ['太重了', 'too heavy', '太 + adjective + 了: 太重了, 太贵了, 太远了.'],
    ['才到家', 'only got home (then)', '才 means "not until": 走了半个小时才到家 = it took half an hour to get home.'],
    ['不错，不错', 'not bad at all', "Teacher Zhang's warm praise: 不错 = pretty good, said twice to be kind."]
  ],
  qs: [
    { q: '张老师和我早上去做什么？', o: ['去打泉水', '去买茶叶', '去上课'], a: 0 },
    { q: '在黑虎泉，张老师问了我什么？', o: ['济南还叫什么', '我几岁了', '我喜欢喝什么茶'], a: 0 },
    { q: '回到家，张老师发现了什么问题？', o: ['家里没有茶叶了', '瓶子里没有水了', '门打不开'], a: 0 },
    { q: '最后我们喝了什么？', o: ['泉水', '茶', '牛奶'], a: 0 }
  ],
  blanks: [
    { s: 3, t: '在排队', d: ['在睡觉', '在上课', '在开车'] },
    { s: 6, t: '打完水', d: ['吃完饭', '看完书', '写完字'] },
    { s: 7, t: '太重了', d: ['太好看了', '太便宜了', '太好喝了'] },
    { s: 8, t: '半个小时', d: ['半个月', '半年', '两年'] },
    { s: 10, t: '都笑了', d: ['都睡了', '都走了', '都吃了'] },
    { s: 12, t: '很好喝', d: ['很好看', '很好听', '很好玩儿'] }
  ]
});
