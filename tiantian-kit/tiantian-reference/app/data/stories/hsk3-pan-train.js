/* 故 Stories · HSK 3 · 老潘 */
window.STORIES.push({
  id: 'hsk3-pan-train', hsk: 3, chars: ['pan'],
  title: ['老潘开小路', 'Old Pan Takes the Back Streets'],
  names: ['老潘', '济南', '北京', '上海', '千佛山'],
  new: [['堵', 'dǔ', 'to block; jammed (堵车 = traffic jam)'], ['师傅', 'shīfu', 'master; polite way to address a driver or skilled worker']],
  text: [
    ['那天下午我要坐五点的火车去北京，可是四点才出门。', "That afternoon I had to catch the five o'clock train to Beijing, but I didn't leave home until four."],
    ['我在路边打了一个车，开车的是老潘！', 'I hailed a taxi by the road, and the driver was Old Pan!'],
    ['“我跟你说，你来得正好！上车，上车！”', '"Let me tell you, you\'re just in time! Get in, get in!"'],
    ['可是车刚开了十分钟，前面就堵死了。', 'But we had only been driving for ten minutes when the road ahead was completely jammed.'],
    ['老潘一边看路，一边说：“济南什么都好，就是堵车！”', 'Watching the road, Old Pan said: "Jinan is great in every way — except the traffic!"'],
    ['他还一直问我：“你去北京干什么？有女朋友了吗？结婚了吗？”', 'He also kept asking me: "What are you going to Beijing for? Got a girlfriend? Are you married?"'],
    ['我看着手表，越来越着急：“师傅，五点以前能到吗？”', 'I kept looking at my watch, more and more worried: "Driver, can we make it before five?"'],
    ['“放心！我开了三十年车，济南的小路我都知道！”', '"Relax! I\'ve been driving for thirty years. I know every back street in Jinan!"'],
    ['他从大路开进一条小路，一会儿往左，一会儿往右，我都不知道我们在哪儿了。', 'He turned off the main road into a little lane, left one moment, right the next, until I had no idea where we were.'],
    ['四点五十分，我们终于到了火车站！', 'At four fifty, we finally reached the train station!'],
    ['我拿上包就跑，可是到了里面才知道：我的火车晚了半个小时！', 'I grabbed my bag and ran, but once inside I found out: my train was half an hour late!'],
    ['我正在笑自己，突然听见有人在后面大声叫我，是老潘！', 'While I was laughing at myself, I suddenly heard someone shouting my name behind me — it was Old Pan!'],
    ['他手上拿着我的钱包：“我跟你说，你的钱包掉在我车上了！”', 'He was holding my wallet: "Let me tell you, you dropped your wallet in my car!"'],
    ['我说：“太谢谢你了！还有半个小时，我请你喝杯茶吧！”', 'I said: "Thank you so much! We\'ve got half an hour — let me buy you a cup of tea!"']
  ],
  chunks: [
    ['打了一个车', 'took a taxi', '打车 = to hail a taxi. You can put 了一个 in the middle: 打了一个车.'],
    ['来得正好', "you're just in time", 'Verb + 得 + 正好: at exactly the right moment.'],
    ['堵死了', 'completely jammed', 'Adjective/verb + 死了: "to death," i.e. extremely. 累死了, 热死了. Old Pan\'s favorite complaint.'],
    ['一会儿往左，一会儿往右', 'left one moment, right the next', '一会儿A，一会儿B: switching back and forth.'],
    ['放心', "don't worry; relax", 'Literally "put your heart down." Said to reassure someone.'],
    ['掉在我车上了', 'dropped in my car', '掉 = to fall/drop + 在 + place: where something fell.']
  ],
  qs: [
    { q: '我要去哪儿？', o: ['北京', '上海', '千佛山'], a: 0 },
    { q: '我为什么越来越着急？', o: ['因为路上车太多，走不动', '因为老潘开得太快', '因为我饿了'], a: 0 },
    { q: '到了火车站，我的火车怎么了？', o: ['晚了半个小时', '已经开走了', '没有票了'], a: 0 },
    { q: '老潘为什么到火车站里面找我？', o: ['给我送钱包', '他也想去北京', '他想喝茶'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '打了一个车', d: ['吃了一个饭', '看了一个病', '买了一个包'] },
    { s: 3, t: '堵死了', d: ['饿死了', '累死了', '热死了'] },
    { s: 6, t: '越来越着急', d: ['越来越高兴', '越来越饱', '越来越胖'] },
    { s: 7, t: '放心', d: ['再见', '你好', '谢谢'] },
    { s: 9, t: '终于到了', d: ['终于睡了', '终于吃了', '终于买了'] },
    { s: 10, t: '晚了半个小时', d: ['跑了半个小时', '睡了半个小时', '吃了半个小时'] },
    { s: 12, t: '掉在', d: ['吃在', '睡在', '住在'] }
  ]
});
