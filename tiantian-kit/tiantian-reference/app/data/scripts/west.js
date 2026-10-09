/* 济南西站 Jinan West Station · HSK 2 · Transport & tickets */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'west-1': {   // 陈女士 · Train ticket to Beijing
    open: [['去哪儿？', 'Where to?'], ['买票？去哪儿？', 'Ticket? Where to?']],
    steps: [
      { obj: 'west-1-1', m: ['北京'],
        say: [['北京南。哪天？几点？', 'Beijing South. Which day? What time?']],
        card: { title: '济南西 → 北京南', rows: [['首班车', '06:30'], ['末班车', '21:00'], ['发车', '每30分钟一趟'], ['全程', '约1小时40分钟']] },
        try: ['我要一张去北京的票。', '我想去北京。'] },
      { obj: 'west-1-2', m: ['{time} 点 !点儿|一点点|便宜', '{time} {day} 点 !点儿|一点点|便宜'],
        say: [['{day|今天}{time}的，有票。', '{day|Today}, {time}: seats available.']],
        try: ['明天上午十点的。', '我要明天下午两点的车。'] },
      { obj: 'west-1-3', m: ['二等 !多少|几块|钱'],
        say: [['二等座。好。', 'Second class. OK.']],
        try: ['我要二等座。', '二等座，谢谢。'] },
      { obj: 'west-1-4', m: ['@price'],
        say: [['二等座一百八十五。请出示证件。', 'Second class is 185. ID, please.']],
        card: { title: '票价 · 济南西 → 北京南', rows: [['商务座', '590元'], ['一等座', '310元'], ['二等座', '185元']] },
        try: ['多少钱？', '二等座多少钱一张？'] },
      { obj: 'west-1-5', m: ['护照|证件|身份证'],
        say: [['好。扫这儿付钱。……票好了，你看一下。', "OK. Scan here to pay. …Ticket's done, have a look."]],
        card: { title: '车票 · 济南西 → 北京南', rows: [['车次', 'G110次'], ['日期', '{day|今天}'], ['发车', '{time|上午十点}'], ['座位', '二等座 08车12F号'], ['票价', '185元']] },
        try: ['这是我的护照。', '给你我的护照。'] },
      { obj: 'west-1-6', need: 'west-1-5', m: ['110|一一零|一百一十', '车次', '次 对|是吗', '哪趟|哪一趟|几次'],
        say: [['对，就是这趟。票上写着呢，八号车厢。', "Yes, this one. It's on the ticket: car 8."]],
        try: ['是G110次，对吗？', '车次是G110吗？'] }
    ],
    extra: [
      { m: ['{day} 天|周|星期|礼拜 !点'], say: [['{day}。几点？', '{day}. What time?']] },
      { m: ['一等|商务'], say: [['一等座没有了。二等座行吗？', 'First class is sold out. Is second class OK?', { ask: {
        yes: ['好，二等座。', 'OK, second class.', { obj: 'west-1-3' }],
        no: ['那只有商务座，五百九。', "Then there's only business class: 590."] } }]] },
      { m: ['车次|哪趟|几次'], say: [['等一下。先给我证件。', 'Wait. ID first.']] }
    ],
    fix: [['票去北京', '去北京的票', 'The destination goes before 票: 一张去北京的票.']],
    done: [['……下一位。', '…Next.']],
    words: [['二等座', 'èrděngzuò', 'second-class seat'], ['车次', 'chēcì', 'train number']],
    later: ['去北京的票……没误车吧？', "That Beijing ticket… you didn't miss the train, did you?"]
  },

  'west-2': {   // 小苏 · Which gate?
    open: [['你也坐这趟车？我回家！', "You're on this train too? I'm going home!"]],
    steps: [
      { obj: 'west-2-1', m: ['巧', '没想到'],
        say: [['真的太巧了！我们是一趟车！', 'Such a coincidence! We\'re on the same train!']],
        try: ['真巧！', '好巧啊！'] },
      { obj: 'west-2-2', m: ['检票口 !几点|什么时候|多久', '几号口|哪个口|哪个门|几号门|在哪儿检票|在哪里检票|在哪检票', '哪儿|哪里|在哪 上车|进站'],
        say: [['我看看……十二号检票口！你看，大屏幕上有。', "Let me see… Gate 12! Look, it's on the big screen."]],
        card: { title: '大屏幕 · 出发', rows: [['车次', 'G110'], ['开往', '北京南'], ['发车', '10:15'], ['检票口', '12'], ['状态', '候车']] },
        try: ['检票口在哪儿？', '我们在几号口检票？'] },
      { obj: 'west-2-3', m: ['几点|什么时候|多久 检票|上车|进站|开始', '检票 时间'],
        say: [['十点开始检票，还有二十分钟。不着急！', 'Boarding starts at ten — twenty minutes from now. No rush!']],
        try: ['几点开始检票？', '什么时候上车？'] },
      { obj: 'west-2-4', m: ['洗手间|厕所|卫生间|wc'],
        say: [['洗手间在左边。要我帮你看着包吗？', "The restroom is on the left. Want me to watch your bag?", { ask: {
          yes: ['没问题！快去快回！', 'No problem! Be quick!'],
          no: ['好的！那我在这儿等你。', "OK! I'll wait here then."] } }]],
        try: ['洗手间在哪儿？', '请问厕所在哪里？'] },
      { obj: 'west-2-5', m: ['车厢', '几号车', '座位 哪|几|多少', '坐在哪|坐哪'],
        say: [['我在五号车厢！你呢？', "I'm in car five! You?"]],
        try: ['你在几号车厢？', '你的座位在哪个车厢？'] },
      { obj: 'west-2-6', need: '*', m: ['一路平安|一路顺风', '路上 小心|平安|注意|顺利', '旅途愉快|平安'],
        say: [['谢谢！你也一路平安！走吧，我们一起去检票口！', "Thanks! Safe travels to you too! Come on, let's go to the gate together!"]],
        try: ['祝你一路平安！', '路上小心！'] }
    ],
    extra: [
      { m: ['我 车厢|号车'], say: [['真的吗？不远！到车上我去找你聊天！', "Really? That's not far! I'll come find you on the train to chat!"]] },
      { m: ['你 去哪|回哪|回家'], say: [['我回家看爸爸妈妈！好久没回家了。', "I'm going home to see my parents! Haven't been home in ages."]] },
      { m: ['大屏幕|屏幕'], say: [['大屏幕……这个用英语怎么说？哈哈，你说中文吧！', '"Da pingmu"… how do you say that in English? Haha, just say it in Chinese!']] }
    ],
    done: [['“一路平安”用英语怎么说？……哈哈，算了，上车再说！', 'How do you say "yi lu ping an" in English? …Haha, never mind, tell me on the train!']],
    words: [['检票口', 'jiǎnpiàokǒu', 'ticket gate (for boarding)'], ['车厢', 'chēxiāng', 'train car, carriage']],
    later: ['上次在西站见到你，真巧！你的车没晚吧？', "Running into you at West Station last time — what a coincidence! Your train wasn't late, was it?"]
  },

  'west-3': {   // 林姐 · Metro into the city
    open: [['（她拿着包，刚下班）哎，你也坐地铁？', '(She has her bag, just off work.) Oh, you taking the metro too?']],
    steps: [
      { obj: 'west-3-1', m: ['市中心|市里|城里|市区|泉城广场|大明湖|进城 !几号线|换|几站|多少站', '怎么去|怎么走|怎么到 !几号线|换|几站|多少站'],
        say: [['坐地铁最方便。我也去那边，我们一起走吧？', "The metro is easiest. I'm going that way too — shall we go together?", { ask: {
          yes: ['好的，没问题！跟我来。', 'Sure, no problem! Follow me.'],
          no: ['好的。那我给你说一下怎么走。', "OK. Then I'll tell you how to get there."] } }]],
        try: ['请问，去市中心怎么走？', '我想去泉城广场，怎么去？'] },
      { obj: 'west-3-2', m: ['几号线|哪条线|哪个线|什么线|哪一条|哪号线'],
        say: [['先坐一号线。', 'Take Line 1 first.']],
        card: { title: '济南地铁', rows: [['1号线', '济南西站 → 王府庄（换乘2号线）'], ['2号线', '王府庄 → 市中心方向'], ['票价', '2–7元'], ['运营时间', '6:00–22:30']] },
        try: ['坐几号线？', '我应该坐哪条线？'] },
      { obj: 'west-3-3', m: ['换|转车|倒车'],
        say: [['要换乘。在王府庄站换二号线。', 'You need to transfer. Change to Line 2 at Wangfuzhuang.']],
        try: ['要换乘吗？', '在哪儿换车？'] },
      { obj: 'west-3-4', m: ['几站|多少站|几个站|多少个站'],
        say: [['一共十站，大概四十分钟。', 'Ten stops in all, about forty minutes.']],
        try: ['一共几站？', '要坐多少站？'] },
      { obj: 'west-3-5', need: 'west-3-2', m: ['@thx', '麻烦你了'],
        say: [['不客气！在济南有问题就问我。', "You're welcome! Any problems in Jinan, just ask me."]],
        try: ['谢谢林姐！', '谢谢你！'] }
    ],
    extra: [
      { m: ['票|@price'], say: [['地铁票两到七块。用手机扫码也可以。', 'Metro tickets are two to seven yuan. You can also scan with your phone.']] },
      { m: ['多久|多长时间|几分钟'], say: [['大概四十分钟。', 'About forty minutes.']] },
      { m: ['下班|上班|工作'], say: [['对，刚下班，累死了！', "Yes, just got off work. I'm exhausted!"]] }
    ],
    done: [['好的，没问题！车来了，我们上车吧。', "Great, no problem! The train's here, let's get on."]],
    words: [['换乘', 'huànchéng', 'to transfer (metro/bus)'], ['号线', 'hàoxiàn', '(metro) line number']],
    later: ['上次在地铁站，你找到路了吗？', 'Last time at the metro station — did you find your way?']
  },

  'west-4': {   // 老潘 · Taxi to the hotel
    open: [['（车窗开了）去哪儿？上车上车！', '(The window rolls down.) Where to? Hop in, hop in!']],
    steps: [
      { obj: 'west-4-1', m: ['@hi !早上|早点', '早上好', '师傅'],
        say: [['哎，你好！我跟你说，今天人多，你运气好！', 'Hey, hello! Let me tell you, it\'s busy today — you\'re lucky!']],
        try: ['师傅，你好！', '师傅好！'] },
      { obj: 'west-4-2', m: ['酒店|宾馆|饭店|旅馆|地址 !多少|多久|多长|几分钟|发票', '去 路|街|号 !多少|多久|多长|几分钟|发票'],
        say: [['好嘞！那儿我知道，上车，走！', "Got it! I know the place. Hop in, let's go!"], ['行！我看一下手机地图……好，走！', "OK! Let me check the map on my phone… right, let's go!"]],
        try: ['我去如家酒店。', '我要去这个地址。'] },
      { obj: 'west-4-3', m: ['多久|多长时间|几分钟|多少分钟|什么时候到|远不远|远吗'],
        say: [['不堵车二十分钟。现在？我跟你说，堵死了，四十分钟吧！你是来旅游的吗？', "Twenty minutes without traffic. Now? Let me tell you, it's jammed solid. Forty minutes! Are you here as a tourist?", { ask: {
          yes: ['旅游好！我跟你说，一定要吃把子肉！', 'Great! Let me tell you, you have to try 把子肉!'],
          no: ['哦，来工作的？济南好地方！', "Oh, here for work? Jinan's a great place!"] } }]],
        try: ['到酒店要多长时间？', '要多久？'] },
      { obj: 'west-4-4', m: ['@price !发票'],
        say: [['打表，大概五十块。', "It's on the meter. About fifty yuan."]],
        try: ['多少钱？', '到酒店大概多少钱？'] },
      { obj: 'west-4-5', m: ['发票|收据|小票|开票|打票'],
        say: [['要发票？好，给你。五十二块。', 'Need a receipt? Sure, here. Fifty-two yuan.']],
        card: { title: '出租车发票', rows: [['上车', '济南西站'], ['下车', '酒店'], ['里程', '18公里'], ['等候', '15分钟'], ['金额', '52元']] },
        try: ['我要发票。', '可以给我发票吗？'] },
      { obj: 'west-4-6', need: '*', m: ['@bye'],
        say: [['好嘞，再见！有事给我打电话！', 'Alright, bye! Call me if you need anything!']],
        try: ['再见！', '谢谢，再见！'] }
    ],
    extra: [
      { m: ['@pay'], say: [['五十二，微信扫这儿就行。', 'Fifty-two. Just scan here with WeChat.']] },
      { m: ['工作|出差|上学|留学|学习'], say: [['哦，这样啊！我跟你说，济南是好地方！', "Oh, I see! Let me tell you, Jinan's a great place!"]] },
      { m: ['不是'], say: [['不是啊？没事儿！我跟你说，济南我都认识！', "No? No problem! Let me tell you, I know all of Jinan!"]] },
      { m: ['堵车|堵'], say: [['我跟你说，济南天天堵死了！', 'Let me tell you, Jinan traffic is jammed every single day!']] },
      { m: ['把子肉|好吃|吃什么'], say: [['把子肉！米饭加大肉，济南人都爱吃！', '把子肉! Rice with big slabs of pork. Everyone in Jinan loves it!']] }
    ],
    done: [['我跟你说，晚上去吃把子肉！好吃！', 'Let me tell you, go get 把子肉 tonight! Delicious!']],
    words: [['发票', 'fāpiào', 'receipt, invoice'], ['堵车', 'dǔchē', 'traffic jam']],
    later: ['上次从西站送你去酒店，堵死了吧？哈哈！', 'Last time I drove you from West Station to your hotel — total gridlock, huh? Haha!']
  },

  'west-5': {   // 陈女士 · Missed your train
    open: [['（她抬头看你）……什么事？', '(She looks up at you.) …What is it?']],
    steps: [
      { obj: 'west-5-1', m: ['没赶上|错过|晚了|迟到|没上车|误了|没坐上|车走了|开走了'],
        say: [['错过了？票给我。', 'Missed it? Give me the ticket.']],
        try: ['我错过了我的火车。', '对不起，我来晚了，车走了。'] },
      { obj: 'west-5-2', m: ['改签 !多少|钱|费', '换 票|车|时间|一张|一趟 !多少|钱|费', '改 票|时间|车 !多少|钱|费'],
        say: [['可以改签。下一趟两点半，要吗？', 'You can change it. Next train is at 2:30. Want it?', { ask: {
          yes: ['好，两点半。', 'OK, 2:30.', { obj: 'west-5-3' }],
          no: ['那你要几点的？', 'Then what time do you want?'] } }]],
        card: { title: '今日余票 · 济南西 → 北京南', rows: [['下一趟', '14:30'], ['以后', '每30分钟一趟'], ['末班车', '21:00']] },
        try: ['可以改签吗？', '我想换一张票。'] },
      { obj: 'west-5-3', m: ['{time} 点 !点儿|一点点|便宜', '下一趟|下一班|最早|最近的|马上'],
        say: [['{time|两点半}，有票。', '{time|2:30}: seats available.']],
        try: ['下午三点的。', '我要下一趟。'] },
      { obj: 'west-5-4', m: ['手续费|要钱|加钱|收费|费用|免费|多付|再付|@price'],
        say: [['今天改签，不要钱。', 'Changing it today is free.']],
        try: ['要加钱吗？', '改签要多少钱？'] },
      { obj: 'west-5-5', need: 'west-5-3', m: ['就这个|就这趟|就要|确定|好的|行|没问题|可以|对 !钱|费|吗|几点'],
        say: [['好了。新票，你看清楚。', 'Done. New ticket — check it carefully.']],
        card: { title: '车票（改签）· 济南西 → 北京南', rows: [['车次', 'G180次'], ['发车', '{time|下午两点半}'], ['座位', '二等座 05车3A号'], ['改签费', '0元']] },
        try: ['好的，就这个。', '没问题，谢谢。'] }
    ],
    extra: [
      { m: ['对不起|不好意思'], say: [['……没事。下次早点儿来。', "…It's fine. Come earlier next time."]] },
      { m: ['为什么|堵车|堵'], say: [['堵车？……每个人都这么说。', 'Traffic? …Everyone says that.']] }
    ],
    done: [['（她叹了口气）……下次早点儿来。下一位。', '(She sighs.) …Come earlier next time. Next.']],
    words: [['改签', 'gǎiqiān', 'to change a ticket'], ['错过', 'cuòguò', 'to miss (a train, a chance)']],
    later: ['这次……没错过车吧？', "This time… you didn't miss your train, did you?"]
  }
});
