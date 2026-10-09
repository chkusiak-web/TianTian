/* 故 Stories · HSK 3 · 张老师 */
window.STORIES.push({
  id: 'hsk3-zhang-glasses', hsk: 3, chars: ['zhang', 'wang'],
  title: ['张老师的眼镜', "Teacher Zhang's Glasses"],
  names: ['张老师', '王奶奶', '趵突泉', '济南', '老张'],
  new: [['眼镜', 'yǎnjìng', 'glasses'], ['成语', 'chéngyǔ', 'idiom; set phrase'], ['太极', 'tàijí', 'tai chi']],
  text: [
    ['星期天早上，张老师在趵突泉旁边打太极，我在一边看。', 'On Sunday morning, Teacher Zhang was doing tai chi beside Baotu Spring while I watched from the side.'],
    ['打完以后，他笑着问我：“你知道吗？三千多年以前就有趵突泉了。”', 'When he finished, he smiled and asked me: "Did you know? Baotu Spring was already here more than three thousand years ago."'],
    ['他一边说，一边从包里拿出一本很旧的书。', 'As he talked, he took a very old book out of his bag.'],
    ['“这本书是我爸爸留给我的，里面有很多济南的老故事。”', '"My father left me this book. It\'s full of old stories about Jinan."'],
    ['可是他刚要读，就着急地说：“不好了，我的眼镜呢？”', 'But just as he was about to read, he said in a panic: "Oh no, where are my glasses?"'],
    ['我们找了半天：椅子下面没有，包里也没有，草地上也没有。', 'We searched for ages: not under the bench, not in his bag, not on the grass either.'],
    ['张老师越来越着急：“没有眼镜，我一个字也看不清楚。”', 'Teacher Zhang got more and more anxious: "Without my glasses, I can\'t make out a single word."'],
    ['这时候，王奶奶走过来，看了看他，笑得说不出话来。', 'Just then Grandma Wang came over, took one look at him, and laughed so hard she couldn\'t speak.'],
    ['“老张啊老张，你的眼镜不是在你头上吗？”', '"Oh, Old Zhang, aren\'t your glasses right on your head?"'],
    ['张老师从头上拿下来一看，真的是他的眼镜！', 'Teacher Zhang reached up and took them off his head — they really were his glasses!'],
    ['他的脸一下子红了，然后也哈哈大笑起来。', 'His face went red, and then he burst out laughing too.'],
    ['“这叫‘骑马找马’。”他说，“你看，今天我又教了你一个成语。”', '"This is what we call \'looking for the horse while riding it,\'" he said. "See? Today I\'ve taught you another idiom."'],
    ['虽然那天我们没读几个故事，但是我学会了一个很有意思的成语。', "Although we didn't read many stories that day, I learned a really interesting idiom."]
  ],
  chunks: [
    ['你知道吗', 'did you know?', 'A friendly way to start telling someone a fact. Teacher Zhang\'s favorite opener.'],
    ['找了半天', 'searched for ages', 'Verb + 了 + 半天: did something for a long time (often without success). 等了半天 = waited forever.'],
    ['越来越着急', 'more and more anxious', '越来越 + adjective: something keeps increasing. 越来越冷, 越来越好.'],
    ['看不清楚', "can't see clearly", 'Verb + 不 + result: unable to. 看不清楚 / 听不清楚.'],
    ['笑得说不出话来', 'laughed so hard (she) couldn\'t speak', 'Verb + 得 + result describes how far something went.'],
    ['骑马找马', 'looking for a horse while riding it', 'An idiom for searching for something you already have.']
  ],
  qs: [
    { q: '张老师的眼镜在哪儿？', o: ['在他头上', '在椅子下面', '在他的包里'], a: 0 },
    { q: '张老师为什么越来越着急？', o: ['因为他找不到眼镜', '因为他的书没有了', '因为下雨了'], a: 0 },
    { q: '是谁发现眼镜在哪儿的？', o: ['王奶奶', '我', '张老师'], a: 0 },
    { q: '那天我学会了什么？', o: ['一个成语', '打太极', '很多老故事'], a: 0 }
  ],
  blanks: [
    { s: 2, t: '拿出', d: ['放进', '送给', '写完'] },
    { s: 5, t: '找了半天', d: ['睡了半天', '吃了半天', '玩儿了半天'] },
    { s: 6, t: '看不清楚', d: ['吃不饱', '睡不着', '买不到'] },
    { s: 7, t: '走过来', d: ['跑出去', '睡着了', '回家了'] },
    { s: 8, t: '在你头上', d: ['在你包里', '在椅子下面', '在草地上'] },
    { s: 10, t: '大笑起来', d: ['哭起来', '跑起来', '唱起来'] },
    { s: 12, t: '学会了', d: ['忘了', '卖了', '洗了'] }
  ]
});
