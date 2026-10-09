/* 故 Stories · HSK 2 · A rainy night, no taxi will stop, and then Old Pan does. */
window.STORIES.push({
  id: 'hsk2-pan-train', hsk: 2, chars: ['pan'],
  title: ['下雨天的老潘', 'Old Pan on a Rainy Night'],
  names: ['老潘', '济南'],
  new: [['伞', 'sǎn', 'umbrella'], ['把', 'bǎ', 'measure word for things with a handle (umbrellas, chairs)']],
  text: [
    ['星期五晚上，下大雨了，我在路边等了半个小时出租车。', 'On Friday night it was pouring, and I waited by the road for a taxi for half an hour.'],
    ['很多出租车从我旁边开过去，可是没有一辆停下来。', 'Lots of taxis drove past me, but not one of them stopped.'],
    ['我身上都是水，非常冷。', 'I was soaked all over and freezing.'],
    ['这时候，一辆出租车停在我前面，开车的是老潘！', 'Just then, a taxi stopped right in front of me. The driver was Old Pan!'],
    ['“我跟你说，我已经下班了，可是下雨天不能让朋友在外边站着！快上车！”', '"Let me tell you, I\'m already off work, but I can\'t leave a friend standing outside in the rain! Hop in!"'],
    ['我一上车，他就问：“这么晚了，你一个人去哪儿了？为什么没带伞？”', 'The moment I got in, he started asking: "It\'s so late — where have you been on your own? Why didn\'t you bring an umbrella?"'],
    ['我说：“早上天气很好，所以我没带伞。”', 'I said: "The weather was nice this morning, so I didn\'t bring an umbrella."'],
    ['“我跟你说，济南的天，一会儿出太阳，一会儿下雨，你要天天带伞！”', '"Let me tell you, Jinan weather is sunny one minute and raining the next. You need to carry an umbrella every day!"'],
    ['到了我家门口，我要给他钱，他说：“下班了，不要钱！”', 'When we got to my door, I tried to pay him. He said: "I\'m off work. No charge!"'],
    ['他还从后边拿出一把伞给我：“这个给你，我在车里，不用伞。”', 'He even took an umbrella from the back and gave it to me: "Take this. I\'m in the car, I don\'t need one."'],
    ['第二天，太阳很好。我给老潘打电话：“你的伞在我这儿，什么时候给你？”', 'The next day was sunny. I called Old Pan: "I\'ve got your umbrella. When can I give it back?"'],
    ['他笑了：“你拿着吧！济南的天，谁知道呢？”', 'He laughed: "Keep it! With Jinan weather, who knows?"'],
    ['那天下午，又下雨了。', 'That afternoon, it rained again.']
  ],
  chunks: [
    ['等了半个小时', 'waited for half an hour', 'Verb + 了 + length of time: 等了半个小时, 学了两年.'],
    ['停下来', 'to stop; to pull over', 'Verb + 下来 shows coming to a stop: 停下来, 坐下来.'],
    ['下班了', 'off work; finished for the day', '上班 = go to work; 下班 = get off work.'],
    ['没带伞', "didn't bring an umbrella", '带 = to bring/carry with you: 带伞, 带钱, 带手机.'],
    ['一会儿出太阳，一会儿下雨', 'sunny one minute, rainy the next', '一会儿A，一会儿B = switching back and forth.'],
    ['谁知道呢', 'who knows?', 'A shrug in words: nobody can be sure.']
  ],
  qs: [
    { q: '我为什么在路边等了很长时间？', o: ['出租车都不停下来', '我在等朋友', '我没有钱'], a: 0 },
    { q: '老潘为什么不要我的钱？', o: ['他已经下班了', '路很近', '我给了他一把伞'], a: 0 },
    { q: '老潘给了我什么？', o: ['一把伞', '一杯热茶', '一件衣服'], a: 0 },
    { q: '第二天下午天气怎么样？', o: ['又下雨了', '太阳很好', '很热'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '等了半个小时', d: ['睡了半个小时', '吃了半个小时', '唱了半个小时'] },
    { s: 1, t: '停下来', d: ['坐下来', '写下来', '跑下来'] },
    { s: 3, t: '一辆出租车', d: ['一本出租车', '一件出租车', '一杯出租车'] },
    { s: 4, t: '下班了', d: ['上班了', '上课了', '起床了'] },
    { s: 6, t: '没带伞', d: ['没带钱', '没带书', '没带手机'] },
    { s: 9, t: '不用伞', d: ['不用钱', '不用车', '不用手'] },
    { s: 11, t: '谁知道呢', d: ['对不起', '不客气', '没关系'] }
  ]
});
