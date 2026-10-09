/* 故 Stories · HSK 3 · 陈女士 */
window.STORIES.push({
  id: 'hsk3-chen-boat', hsk: 3, chars: ['chen'],
  title: ['不上班的陈女士', 'Ms. Chen, Off Duty'],
  names: ['陈女士', '大明湖'],
  new: [],
  text: [
    ['星期六天气很好，我想去大明湖坐船。', 'Saturday was a lovely day, and I wanted to go for a boat ride on Daming Lake.'],
    ['买票的人很多，我排了二十分钟的队。', 'There were lots of people buying tickets, and I queued for twenty minutes.'],
    ['我前面是一个穿红裙子的女人，旁边还有一位老奶奶。', 'In front of me was a woman in a red dress, with an old lady beside her.'],
    ['到她的时候，卖票的人说：“下一位！两张票一百块。”', 'When it was her turn, the ticket seller said: "Next! Two tickets, a hundred yuan."'],
    ['她拿出手机看了半天，然后着急地说：“不好了，手机没电了！”', 'She took out her phone, stared at it for a while, then said anxiously: "Oh no, my phone\'s dead!"'],
    ['她一回头看见了我，我们两个人都“啊”了一下。', 'She turned around and saw me, and we both went "Ah!"'],
    ['“又是你？”是陈女士！她的脸一下子红了。', '"You again?" It was Ms. Chen! Her face turned red at once.'],
    ['原来，她今天不上班，想带妈妈来坐船。', "It turned out she had the day off and wanted to take her mom on a boat ride."],
    ['我说：“没关系，我帮你们买吧！”', 'I said: "No problem, let me buy them for you!"'],
    ['陈女士一直说“不用，不用”，可是她妈妈笑着说：“谢谢你啊！”', 'Ms. Chen kept saying "No, no, there\'s no need," but her mother smiled and said: "Thank you so much!"'],
    ['最后，我们三个人坐上了一条船。', 'In the end, the three of us got on the same boat.'],
    ['在船上，陈女士给我讲了很多大明湖的故事，还笑了好几次。', 'On the boat, Ms. Chen told me lots of stories about Daming Lake, and she even laughed several times.'],
    ['我从来没见过她这么开心。', "I'd never seen her so happy."],
    ['下船的时候，她把钱还给我，说：“下次你来买票，我先说‘你好’，再说‘下一位’。”', 'When we got off the boat, she paid me back and said: "Next time you come to buy a ticket, I\'ll say \'hello\' first, and then \'next.\'"']
  ],
  chunks: [
    ['排了二十分钟的队', 'queued for twenty minutes', '排队 = to queue; the time goes in the middle: 排了…的队.'],
    ['下一位', 'next, please', 'What clerks call out to the next person in line. 位 is the polite measure word for people.'],
    ['手机没电了', 'my phone is dead', '没电了 = out of battery.'],
    ['一下子', 'all at once', 'Something happens suddenly: 脸一下子红了.'],
    ['从来没见过', 'have never seen', '从来没 + verb + 过: have never (ever) done something.'],
    ['把钱还给我', 'paid me back', '把 + thing + 还给 + person: to give something back to someone.']
  ],
  qs: [
    { q: '我想去大明湖做什么？', o: ['坐船', '买衣服', '看病'], a: 0 },
    { q: '陈女士为什么不能买票？', o: ['因为她的手机没电了', '因为票都卖完了', '因为她没有排队'], a: 0 },
    { q: '陈女士今天跟谁一起来的？', o: ['她妈妈', '她的朋友', '她的老师'], a: 0 },
    { q: '下次我去买票，陈女士会先说什么？', o: ['你好', '下一位', '又是你'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '排了二十分钟', d: ['睡了二十分钟', '唱了二十分钟', '跑了二十分钟'] },
    { s: 3, t: '下一位', d: ['下个月', '下雨了', '下车了'] },
    { s: 4, t: '没电了', d: ['没饭了', '没水了', '没车了'] },
    { s: 7, t: '不上班', d: ['不吃饭', '不睡觉', '不说话'] },
    { s: 10, t: '坐上了', d: ['吃完了', '买到了', '写好了'] },
    { s: 12, t: '这么开心', d: ['这么难过', '这么生气', '这么累'] },
    { s: 13, t: '还给我', d: ['写给我', '卖给我', '教给我'] }
  ]
});
