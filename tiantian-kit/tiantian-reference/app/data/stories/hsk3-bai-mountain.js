/* 故 Stories · HSK 3 · I read my symptoms online and panic. Dr. Bai has a diagnosis. */
window.STORIES.push({
  id: 'hsk3-bai-mountain', hsk: 3, chars: ['bai'],
  title: ['网上的病', 'The Internet Disease'],
  names: ['白大夫', '山东省立医院'],
  new: [['严重', 'yánzhòng', 'serious; severe'], ['着急', 'zháojí', 'to worry; to be anxious']],
  text: [
    ['最近我的头总是疼，眼睛也不太舒服。', "Lately my head had been hurting all the time, and my eyes didn't feel great either."],
    ['那天晚上我睡不着，就在手机上查：“头疼、眼睛疼是什么病？”', 'That night I couldn\'t sleep, so I looked it up on my phone: "Headache and sore eyes — what illness is it?"'],
    ['网上说，可能是很严重的病！我越看越害怕，一个晚上都没睡。', 'The internet said it might be something very serious! The more I read, the more scared I got, and I didn\'t sleep all night.'],
    ['第二天早上，我马上去了山东省立医院，给我看病的又是白大夫。', 'The next morning I went straight to Shandong Provincial Hospital, and once again the doctor who saw me was Dr. Bai.'],
    ['我一进门就说：“白大夫，我是不是得了很严重的病？网上说……”', 'The moment I walked in, I said: "Dr. Bai, do I have something really serious? The internet says…"'],
    ['他让我坐下：“别着急。我们一个问题一个问题来。哪儿不舒服？”', 'He had me sit down: "Don\'t worry. Let\'s take it one question at a time. What\'s wrong?"'],
    ['我说了头疼和眼睛疼。他又问：“你每天看几个小时手机？”', 'I told him about my headache and sore eyes. Then he asked: "How many hours a day do you look at your phone?"'],
    ['我想了想：“上课的时候不看……下课以后，大概十个小时吧。”', 'I thought about it: "Not during class… after class, about ten hours, I guess."'],
    ['“昨天晚上睡了几个小时？”“一个小时都没睡，因为我一直在网上查我的病。”', '"How many hours did you sleep last night?" "Not even one, because I was looking up my illness online the whole time."'],
    ['白大夫一边写一边说：“好，我知道你得的是什么病了。”', 'Writing as he spoke, Dr. Bai said: "Right. I know what you\'ve got."'],
    ['我紧张得不得了：“是什么病？”', 'I was incredibly nervous: "What is it?"'],
    ['“这个病叫‘手机病’。头疼，因为你没睡觉；眼睛疼，因为你一直看手机。”', '"It\'s called \'phone disease.\' Your head hurts because you didn\'t sleep; your eyes hurt because you never stop looking at your phone."'],
    ['“还有，网上的医生都不用上班，所以他们想说什么就说什么。”', '"Also, the doctors on the internet don\'t have to come to work, so they can say whatever they like."'],
    ['他给我的“药”很简单：每天少看手机，晚上十一点以前睡觉，多喝水，多休息。', 'The "medicine" he gave me was simple: look at my phone less every day, go to bed before eleven, drink lots of water and rest.'],
    ['我走到门口，拿出手机想查一下“手机病”，就听见白大夫在后面说：“别查了！”', 'At the door, I took out my phone to look up "phone disease," and heard Dr. Bai behind me: "Stop looking it up!"']
  ],
  chunks: [
    ['越看越害怕', 'the more I read, the more scared I got', '越 A 越 B = the more A, the more B. 越吃越饿, 越说越快.'],
    ['一进门就', 'the moment (I) walked in', '一 A 就 B = as soon as A, B happens.'],
    ['一个问题一个问题来', 'one question at a time', "Dr. Bai's calm method. 一个一个来 = one at a time."],
    ['一个小时都没睡', "didn't sleep even one hour", '一 + measure word + 都没 = not even one: 一口都没吃.'],
    ['紧张得不得了', 'incredibly nervous', 'Adjective + 得不得了 = extremely: 高兴得不得了, 累得不得了.'],
    ['想说什么就说什么', 'say whatever they like', 'Question word … 就 + same question word: 想吃什么就吃什么 = eat whatever you want.']
  ],
  qs: [
    { q: '我为什么一个晚上都没睡？', o: ['因为我一直在网上查我的病', '因为我要准备考试', '因为白大夫给我打电话'], a: 0 },
    { q: '我每天大概看几个小时手机？', o: ['十个小时', '一个小时', '两个小时'], a: 0 },
    { q: '白大夫说我头疼是因为什么？', o: ['因为我没睡觉', '因为我得了很严重的病', '因为我喝水太多'], a: 0 },
    { q: '白大夫最后为什么说“别查了”？', o: ['因为我又想在手机上查“手机病”', '因为我想给他钱', '因为我要去找别的医生'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '不太舒服', d: ['不太好吃', '不太便宜', '不太远'] },
    { s: 2, t: '越看越害怕', d: ['越看越高兴', '越看越饿', '越看越好笑'] },
    { s: 4, t: '一进门', d: ['一起床', '一上课', '一回家'] },
    { s: 8, t: '睡了几个小时', d: ['吃了几碗饭', '看了几本书', '喝了几杯水'] },
    { s: 10, t: '紧张得不得了', d: ['高兴得不得了', '饱得不得了', '开心得不得了'] },
    { s: 12, t: '不用上班', d: ['不用吃饭', '不用睡觉', '不用喝水'] },
    { s: 13, t: '少看手机', d: ['多看手机', '多上网', '晚上不睡'] },
    { s: 14, t: '别查了', d: ['别哭了', '别吃了', '别喝了'] }
  ]
});
