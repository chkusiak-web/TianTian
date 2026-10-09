/* 故 Stories · HSK 1 · Three ticket windows, one Ms. Chen. */
window.STORIES.push({
  id: 'hsk1-chen-tickets', hsk: 1, chars: ['chen'],
  title: ['又是你？', 'You Again?'],
  names: ['陈女士', '趵突泉', '千佛山', '济南'],
  new: [['又', 'yòu', 'again'], ['位', 'wèi', '(polite measure word for people)']],
  text: [
    ['星期六上午，我去趵突泉。我要买门票。', 'On Saturday morning, I went to Baotu Spring. I needed to buy a ticket.'],
    ['买票的地方有一位陈女士。她不笑，说话很快。', "At the ticket window was a Ms. Chen. She didn't smile, and she spoke fast."],
    ['“你好。几个人？……好。下一位。”', '"Hello. How many people? …OK. Next."'],
    ['下午，我去千佛山。买票的时候，我看见了……陈女士！', 'In the afternoon, I went to Qianfo Mountain. When I went to buy a ticket, I saw… Ms. Chen!'],
    ['她看了看我：“又是你？下一位。”', 'She looked at me: "You again? Next."'],
    ['晚上，我去火车站买明天的车票。', "In the evening, I went to the train station to buy a ticket for tomorrow."],
    ['我想：这次不是她吧？', "I thought: it won't be her this time, right?"],
    ['我到了前边一看，还是她！', 'I got to the front and looked. It was her again!'],
    ['我问：“陈女士，你在济南几个地方工作？”', 'I asked: "Ms. Chen, how many places in Jinan do you work at?"'],
    ['陈女士第一次笑了。', 'For the first time, Ms. Chen smiled.'],
    ['“又是你。……明天见。”', '"You again. …See you tomorrow."']
  ],
  chunks: [
    ['买门票', 'to buy an entrance ticket', '门票 = ticket to get in (parks, museums). 车票 = ticket for a train or bus.'],
    ['几个人', 'how many people?', 'What every ticket seller and restaurant host asks.'],
    ['下一位', 'next (person)', '位 is the polite measure word for people. What clerks call out to the line.'],
    ['又是你', "it's you again", '又 = again (it already happened). Said with surprise, or a sigh.'],
    ['还是她', "it's still her", '还是 = still the same. 还是她！ = her again!'],
    ['明天见', 'see you tomorrow', 'Time + 见: 明天见, 下次见, 晚上见.']
  ],
  qs: [
    { q: '上午我去了哪儿？', o: ['趵突泉', '千佛山', '火车站'], a: 0 },
    { q: '我在几个地方看见了陈女士？', o: ['三个', '两个', '一个'], a: 0 },
    { q: '晚上我去火车站做什么？', o: ['买车票', '找陈女士', '吃饭'], a: 0 },
    { q: '最后陈女士怎么了？', o: ['她笑了', '她生气了', '她回家了'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '买门票', d: ['买衣服', '买手机', '买面包'] },
    { s: 2, t: '几个人', d: ['几点了', '吃了吗', '几号了'] },
    { s: 4, t: '又是你', d: ['谢谢你', '对不起', '不客气'] },
    { s: 5, t: '明天的车票', d: ['昨天的车票', '昨天的门票', '明天的早饭'] },
    { s: 7, t: '还是她', d: ['还是你', '还是我', '是他们'] },
    { s: 10, t: '明天见', d: ['昨天见', '前天见', '去年见'] }
  ]
});
