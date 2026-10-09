/* 故 Stories · HSK 2 · 小谢 */
window.STORIES.push({
  id: 'hsk2-xie-sunrise', hsk: 2, chars: ['xie'],
  title: ['千佛山的太阳', 'Sunrise on Qianfo Mountain'],
  names: ['小谢', '千佛山'],
  new: [['哈哈', 'hāha', 'haha (laughter)'], ['张', 'zhāng', 'measure word for flat things (photos, tickets)']],
  text: [
    ['星期六早上五点，小谢给我打电话：“哈哈，起床了吗？走吧！”', 'At five on Saturday morning, Xiao Xie called me: "Haha, are you up? Let\'s go!"'],
    ['我还在床上：“去哪儿？现在才五点！”', 'I was still in bed: "Go where? It\'s only five o\'clock!"'],
    ['“去千佛山看太阳出来！我要给朋友们发照片！”', '"To Qianfo Mountain to watch the sun come up! I want to send photos to my friends!"'],
    ['我很不想去，可是她说：“没问题，我已经在你家门口了！”', 'I really didn\'t want to go, but she said: "No problem, I\'m already at your door!"'],
    ['六点，我们到了山上，可是天是阴的。', 'At six we got up the mountain, but the sky was cloudy.'],
    ['我们等了一个多小时，太阳还是没出来。', 'We waited for over an hour, and the sun still didn\'t come out.'],
    ['我太累了，坐在椅子上就睡着了。', 'I was so tired that I sat down on a bench and fell asleep.'],
    ['小谢看着我，哈哈大笑，拿出手机就给我照相。', 'Xiao Xie looked at me, burst out laughing, then pulled out her phone and snapped a picture of me.'],
    ['下山以后，我们去吃了一碗热热的面条。', 'After coming down the mountain, we went and had a bowl of hot noodles.'],
    ['晚上，小谢又给我打电话：“真的假的？一百多个人喜欢这张照片！”', 'In the evening Xiao Xie called me again: "No way! Over a hundred people liked this photo!"'],
    ['照片上没有太阳，只有我在椅子上睡觉。', 'There was no sun in the photo, just me asleep on the bench.'],
    ['小谢说：“哈哈，下个星期我们再去吧！”', 'Xiao Xie said: "Haha, let\'s go again next week!"'],
    ['我说：“不去！我要睡觉！”', 'I said: "No way! I\'m sleeping in!"']
  ],
  chunks: [
    ['起床了吗', 'are you up yet?', '起床 = get out of bed. ……了吗？ asks if something has happened yet.'],
    ['太阳出来', 'the sun comes out', '出来 = come out: 太阳出来了, 他从房间里出来了.'],
    ['发照片', 'to send photos', '发 = to send (messages, photos): 发照片, 发手机短信.'],
    ['一个多小时', 'over an hour', 'Number + measure + 多 + noun = "more than": 一个多小时, 一百多个人.'],
    ['真的假的', 'no way! seriously?', "Xiao Xie's favorite reaction: literally \"real or fake?\""],
    ['这张照片', 'this photo', '张 is the measure word for flat things: 一张照片, 两张票.']
  ],
  qs: [
    { q: '小谢为什么五点给我打电话？', o: ['她想去千佛山看太阳出来', '她生病了', '她想请我吃早饭'], a: 0 },
    { q: '那天早上，我们看到太阳了吗？', o: ['没看到，天是阴的', '看到了，很漂亮', '我们没去山上'], a: 0 },
    { q: '很多人喜欢的那张照片上有什么？', o: ['我在椅子上睡觉', '很大的太阳', '一碗面条'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '起床了吗', d: ['吃饭了吗', '下班了吗', '上课了吗'] },
    { s: 3, t: '家门口', d: ['学校门口', '医院门口', '公司门口'] },
    { s: 5, t: '没出来', d: ['没吃饭', '没说话', '没回家'] },
    { s: 7, t: '照相', d: ['做饭', '开门', '洗手'] },
    { s: 9, t: '真的假的', d: ['没关系', '对不起', '不客气'] },
    { s: 12, t: '要睡觉', d: ['要上山', '要照相', '要早起'] }
  ]
});
