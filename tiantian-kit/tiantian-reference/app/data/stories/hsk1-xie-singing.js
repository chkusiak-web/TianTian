/* 故 Stories · HSK 1 · Xiao Xie takes me singing and gets a surprise. */
window.STORIES.push({
  id: 'hsk1-xie-singing', hsk: 1, chars: ['xie'],
  title: ['我唱，你听', "I Sing, You Listen"],
  names: ['小谢', '泉城广场', '甜蜜蜜'],
  new: [['问题', 'wèntí', 'problem; question'], ['假', 'jiǎ', 'fake; false']],
  text: [
    ['星期五晚上，小谢给我打电话：“走吧！我们去唱歌！”', 'On Friday night, Xiao Xie called me: "Let\'s go! We\'re going singing!"'],
    ['我说：“我不会唱中文歌。”', 'I said: "I can\'t sing Chinese songs."'],
    ['“没问题！我唱，你听！”', '"No problem! I\'ll sing, you listen!"'],
    ['我们去了泉城广场旁边的KTV。', 'We went to a karaoke place next to Quancheng Square.'],
    ['小谢唱了两个小时，唱的歌都不太好听。', "Xiao Xie sang for two hours. None of the songs sounded very good."],
    ['她问我：“我唱歌好听吧？”我说：“……好听，好听。”', 'She asked me: "I sing well, right?" I said: "…Yes, very good."'],
    ['十点了，她说：“现在我教你唱中文歌！”', 'At ten o\'clock, she said: "Now I\'ll teach you a Chinese song!"'],
    ['她教我唱《甜蜜蜜》。我唱了一次，两次，三次。', 'She taught me "Tian Mi Mi." I sang it once, twice, three times.'],
    ['小谢听了，不说话了。', 'Xiao Xie listened and went quiet.'],
    ['“真的假的？你唱歌比我好听！”', '"Seriously? You sing better than me!"'],
    ['她笑着说：“下次你唱，我听！”', 'She laughed and said: "Next time, you sing and I\'ll listen!"']
  ],
  chunks: [
    ['走吧', "let's go", '吧 makes it a suggestion. Xiao Xie says it all the time.'],
    ['没问题', 'no problem', 'The everyday "sure, no problem."'],
    ['不太好听', "doesn't sound very good", '不太 + adjective is a polite way to say something isn\'t good.'],
    ['真的假的', 'seriously? for real?', 'Literally "real or fake?" Said when you can\'t believe what you hear.'],
    ['比我好听', 'sounds better than me', 'A + 比 + B + adjective: 你唱歌比我好听.'],
    ['下次', 'next time', '下次你唱 = next time you sing. 上次 = last time.']
  ],
  qs: [
    { q: '小谢请我去做什么？', o: ['唱歌', '吃饭', '看电影'], a: 0 },
    { q: '小谢唱歌好听吗？', o: ['不太好听', '非常好听', '她没唱歌'], a: 0 },
    { q: '小谢唱了几个小时？', o: ['两个', '十个', '一个'], a: 0 },
    { q: '小谢觉得谁唱歌比她好听？', o: ['我', '小谢的妈妈', '老师'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '去唱歌', d: ['去上课', '去看病', '去上班'] },
    { s: 1, t: '不会唱', d: ['不想吃', '不会买', '不会开'] },
    { s: 2, t: '没问题', d: ['不客气', '谢谢你', '再见了'] },
    { s: 4, t: '两个小时', d: ['两个星期', '两个月', '两年'] },
    { s: 9, t: '比我好听', d: ['比我好看', '比我好吃', '比我好玩儿'] },
    { s: 10, t: '下次', d: ['昨天', '前天', '去年'] }
  ]
});
