/* 故 Stories · HSK 2 · 陈女士 */
window.STORIES.push({
  id: 'hsk2-chen-twins', hsk: 2, chars: ['chen'],
  title: ['两个陈女士', 'Two Ms. Chens'],
  names: ['陈女士', '趵突泉', '千佛山'],
  new: [['猜', 'cāi', 'to guess']],
  text: [
    ['星期天，我想去三个地方：趵突泉、千佛山和电影院。', 'On Sunday, I wanted to go to three places: Baotu Spring, Qianfo Mountain and the cinema.'],
    ['早上九点，我到了趵突泉买门票。', 'At nine in the morning, I got to Baotu Spring to buy a ticket.'],
    ['卖票的是陈女士。她没看我，只说：“护照。下一位。”', 'The ticket seller was Ms. Chen. She didn\'t even look at me, just said: "Passport. Next."'],
    ['下午两点，我去千佛山买票，卖票的……还是陈女士！', 'At two in the afternoon, I went to buy a ticket at Qianfo Mountain, and the ticket seller was… Ms. Chen again!'],
    ['她看了看我：“又是你？”', 'She looked me over: "You again?"'],
    ['我想：她怎么在两个地方工作？', 'I thought: how can she work in two places?'],
    ['晚上七点，我去电影院看电影。', 'At seven in the evening, I went to the cinema to see a movie.'],
    ['我去买票，一看，又是陈女士！', 'I went to buy a ticket, took one look, and it was Ms. Chen again!'],
    ['这次我先说：“又是你？”', 'This time I said it first: "You again?"'],
    ['她没说话，可是笑了。她旁边还坐着一个人，长得跟她一样！', 'She didn\'t say anything, but she smiled. Next to her sat another person who looked exactly like her!'],
    ['“这是我妹妹。早上是我，下午是她。”', '"This is my younger sister. In the morning it was me, in the afternoon it was her."'],
    ['我问：“那现在是谁？”', 'I asked: "So who is it now?"'],
    ['她们两个人都笑了：“你猜！下一位！”', 'They both laughed: "You guess! Next!"']
  ],
  chunks: [
    ['买门票', 'to buy an entry ticket', '门票 is a ticket to get into a park or sight; a movie or train ticket is just 票.'],
    ['下一位', 'next, please', "Ms. Chen's favorite words. 位 is the polite measure word for people."],
    ['又是你', "it's you again", '又 = again (for something that already happened). Ms. Chen\'s running joke.'],
    ['看电影', 'to watch a movie', '看 + 电影: 去电影院看电影 = go to the cinema to see a movie.'],
    ['长得跟她一样', 'looks just like her', '长得 = to look (appearance). A 跟 B 一样 = A is the same as B.']
  ],
  qs: [
    { q: '星期天我去了几个地方？', o: ['三个', '两个', '一个'], a: 0 },
    { q: '下午在千佛山卖票的是谁？', o: ['陈女士的妹妹', '陈女士', '我的朋友'], a: 0 },
    { q: '在电影院，陈女士旁边坐着谁？', o: ['她的妹妹', '她的妈妈', '她的老师'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '买门票', d: ['买衣服', '买水果', '买手机'] },
    { s: 2, t: '下一位', d: ['不客气', '对不起', '欢迎你'] },
    { s: 4, t: '又是你', d: ['不客气', '再见了', '谢谢你'] },
    { s: 6, t: '看电影', d: ['看医生', '看朋友', '看书'] },
    { s: 10, t: '我妹妹', d: ['我爸爸', '我哥哥', '我爷爷'] },
    { s: 12, t: '你猜', d: ['你吃', '你睡', '你写'] }
  ]
});
