/* 千佛山 Qianfo Mountain · HSK 2 · Numbers & travel */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'qianfo-1': {   // 陈女士 · Cable car tickets
    open: [['坐缆车？', 'Cable car?'], ['缆车票在这儿买。', 'Cable car tickets are sold here.']],
    steps: [
      { obj: 'qianfo-1-1', m: ['缆车 !多少|几块|一共|几点|最后|末班|最晚|关门', '@want 票 !多少|几块|一共|几点|最后|末班|最晚'],
        say: [['缆车票。价格在这儿。', 'Cable car tickets. Prices are here.'], ['好。你看价格。', 'OK. Here are the prices.']],
        card: { title: '千佛山缆车 · 票价', rows: [['单程', '30元'], ['往返', '50元'], ['儿童', '半价'], ['运营时间', '8:30–17:30']] },
        try: ['我要买缆车票。', '我想坐缆车。'] },
      { obj: 'qianfo-1-2', m: ['{n} 大人|成人|个人|位 !多少|几块|一共', '{n} 张 !多少|几块|一共|几点'],
        say: [['{n}个大人。要往返票吗？', '{n} adults. Round-trip tickets?', { ask: {
          yes: ['好，往返。', 'OK, round trip.', { obj: 'qianfo-1-3' }],
          no: ['单程？那你要走下山，一个小时。', "One way? Then you walk down. An hour."] } }]],
        try: ['两个大人。', '我们两个人。'] },
      { obj: 'qianfo-1-3', m: ['往返', '来回'], say: [['往返，五十一张。', 'Round trip, fifty each.']], try: ['要往返的。', '来回的。'] },
      { obj: 'qianfo-1-4', m: ['@price !几点|最后|末班', '总共'],
        say: [['往返五十一张。{n|两}张，一共{n*50|一百}块。', 'Round trip is fifty each. {n|Two} tickets, {n*50|100} yuan total.']],
        try: ['一共多少钱？', '一共几块？'] },
      { obj: 'qianfo-1-5', m: ['最后|末班|最晚 几点|什么时候|时候|车', '几点 关门|停|结束|下班', '末班车|最后一班'],
        say: [['末班车下午五点半。别晚了。', "Last car is at 5:30 pm. Don't be late."]],
        try: ['最后一班缆车几点？', '末班车是几点？'] },
      { obj: 'qianfo-1-6', m: ['@pay !多少|几块|一共', '这是 钱|块|一百', '给 {n} 块'],
        say: [['好。票拿好。', 'OK. Hold on to your tickets.'], ['……好了。这是你们的票。', '…Done. Here are your tickets.']],
        try: ['给你一百块。', '我用微信付钱。'] }
    ],
    extra: [
      { m: ['儿童|孩子|小孩'], say: [['儿童半价。一米二以下不要票。', 'Children half price. Under 1.2 meters, no ticket needed.']] },
      { m: ['多久|多长时间|几分钟'], say: [['上去十分钟。', 'Ten minutes up.']] },
      { m: ['单程'], say: [['单程三十。下山要自己走。', 'One way is thirty. You walk down yourself.']] }
    ],
    fix: [['个往返', '张往返', 'Tickets take 张: 两张往返票.'], ['个缆车票', '张缆车票', 'Tickets take 张: 两张缆车票.'], ['两大人', '两个大人', 'Numbers need a measure word: 两个大人.']],
    done: [['……（她差点儿笑了）玩得开心。', '…(She almost smiles.) Have fun.']],
    words: [['缆车', 'lǎnchē', 'cable car'], ['往返', 'wǎngfǎn', 'round trip']],
    later: ['千佛山的缆车，坐了吗？……上面风大。', "The Qianfo cable car — did you ride it? …It's windy up there."]
  },

  'qianfo-2': {   // 白大夫 · How far to the top?
    open: [['（她坐在石头上休息，看了看你）爬山啊？', '(Resting on a stone, she looks at you.) Climbing?']],
    steps: [
      { obj: 'qianfo-2-1', m: ['@hi !早上|早点', '早上好'],
        say: [['你好。坐下休息一下吧。要不要喝点儿水？', 'Hello. Sit down and rest a bit. Would you like some water?', { ask: {
          yes: ['给你。慢慢喝，别着急。', "Here you go. Drink slowly, don't rush."],
          no: ['好。累了就休息。', "OK. Rest when you're tired."] } }]],
        try: ['你好！', '阿姨好！'] },
      { obj: 'qianfo-2-2', m: ['几分钟|多少分钟|多长时间|多久|多远|还有多|还要多', '山顶 几|多|远'],
        say: [['到山顶还要二十分钟。别着急，慢慢走。', "Twenty more minutes to the top. Don't rush, go slowly."]],
        card: { title: '千佛山 · 登山路线', rows: [['山门 → 兴国禅寺', '30分钟'], ['兴国禅寺 → 山顶', '20分钟'], ['缆车', '10分钟']] },
        try: ['到山顶还要几分钟？', '还有多长时间到山顶？'] },
      { obj: 'qianfo-2-3', m: ['累 !不累了|我很累|我累|我有点'],
        say: [['有一点儿累。可是爬山对身体很好。你累不累？', 'A little tired. But climbing is good for you. Are you tired?']],
        try: ['爬山累吗？', '你累不累？'] },
      { obj: 'qianfo-2-4', m: ['经常|常常|常来|常爬|每个周末|每周|每个星期|天天|每天|几次'],
        say: [['常来。每个星期六都来，一个星期一次。', 'Often. Every Saturday, once a week.']],
        try: ['你常常来爬山吗？', '你经常来这儿吗？'] },
      { obj: 'qianfo-2-5', m: ['工作', '做什么|干什么', '职业', '是医生|是大夫|是老师'],
        say: [['我是大夫，在医院工作。所以我知道：多喝水，多休息。', "I'm a doctor; I work at a hospital. So I know: drink lots of water, rest a lot."]],
        try: ['你做什么工作？', '你是做什么的？'] },
      { obj: 'qianfo-2-6', m: ['加油', '一起 上去|走|爬'],
        say: [['加油！我们山顶见。', 'Keep going! See you at the top.']],
        try: ['加油！', '我们一起加油！'] }
    ],
    extra: [
      { m: ['我 不累|不太累|还好|还行'], say: [['不错，你身体很好。', "Nice. You're in good shape."]] },
      { m: ['我 很累|有点累|有点儿累|好累|太累'], say: [['别着急，多休息一下。', "Don't rush, rest a bit more."]] },
      { m: ['山顶 什么|好看|漂亮'], say: [['山顶能看到济南城，很漂亮。', 'From the top you can see the city of Jinan. It\'s beautiful.']] }
    ],
    done: [['走吧，一起上去。慢慢走，别着急。', "Let's go up together. Slowly, no rush."]],
    words: [['山顶', 'shāndǐng', 'mountaintop, summit'], ['加油', 'jiāyóu', 'come on! / keep going!']],
    later: ['上次在千佛山，你到山顶了吗？', 'Last time on Qianfo Mountain, did you make it to the top?']
  },

  'qianfo-3': {   // 孙师傅 · Mountain drink stall
    open: [['哎？朋友，又是你！山上也能见到你！喝点儿什么？', 'Huh? Friend, you again! Even up the mountain! What will you drink?']],
    steps: [
      { obj: 'qianfo-3-1', m: ['两瓶|2瓶|俩 !多少|几块|一共|块', '两 {drink} !多少|几块|一共|块'],
        say: [['两瓶{drink|水}，好嘞！要不要加个面包？刚到的！', 'Two {drink|waters}, coming up! Want to add a bread roll? Fresh in!', { ask: {
          yes: ['好嘞，一个面包！', 'One bread roll, coming up!', { obj: 'qianfo-3-2' }],
          no: ['不要？朋友，爬山会饿的！', "No? Friend, you'll get hungry climbing!"] } }]],
        card: { title: '孙师傅 · 山上小卖', rows: [['矿泉水', '3元/瓶'], ['绿茶', '4元/瓶'], ['面包', '5元'], ['饼干', '5元'], ['黄瓜', '5元']] },
        try: ['我要两瓶水。', '来两瓶矿泉水。'] },
      { obj: 'qianfo-3-2', m: ['面包|饼干|零食|吃的|黄瓜|巧克力|方便面 !多少|几块|一共'],
        say: [['好嘞！零食都是五块，山上贵一点儿，哈哈！', 'Coming up! Snacks are all five yuan. A bit pricier up the mountain, haha!']],
        try: ['再要一个面包。', '我还要一包饼干。'] },
      { obj: 'qianfo-3-3', need: ['qianfo-3-1', 'qianfo-3-2'], m: ['一共|总共|多少钱|几块'],
        say: [['两瓶水六块，零食五块，一共十一块！好吃不贵！', 'Two waters is six, the snack five: eleven in total! Tasty and cheap!']],
        try: ['一共多少钱？', '一共几块？'] },
      { obj: 'qianfo-3-4', m: ['五十|50'],
        say: [['五十，好。找你三十九，你数数！', "Fifty, OK. Thirty-nine back, count it!"]],
        try: ['给你五十块。', '我只有五十的。'] },
      { obj: 'qianfo-3-5', need: 'qianfo-3-4', m: ['找', '三十九|39', '零钱', '钱 对|不对|没错'],
        say: [['三十九，对吧？哈哈，我算得没错！', 'Thirty-nine, right? Haha, I counted right!']],
        try: ['找我三十九块，对吗？', '三十九块，对。'] },
      { obj: 'qianfo-3-6', need: 'qianfo-3-4', m: ['@thx'], say: [['客气啥，朋友！爬山加油！', 'No need, friend! Keep climbing!']], try: ['谢谢孙师傅！', '谢谢你！'] }
    ],
    extra: [
      { m: ['{n} 瓶 !两|多少|几块'], say: [['{n}瓶？朋友，爬山要多喝水，两瓶正好！', '{n} bottles? Friend, you need lots of water up here. Two is just right!']] },
      { m: ['@want 水|矿泉水|绿茶 !两|多少|几块'], say: [['几瓶？朋友，爬山要多喝水，来两瓶吧！', 'How many bottles? Friend, you need lots of water up here. Have two!']] },
      { m: ['多少钱|几块|怎么卖'], say: [['水三块一瓶，零食都是五块。', 'Water is three a bottle, snacks are all five.']] },
      { m: ['微信|支付宝|扫码'], say: [['朋友，山上没信号！给现金吧。', 'Friend, no signal up here! Pay cash.']] },
      { m: ['一百|100'], say: [['一百？找不开！有五十的吗？', "A hundred? Can't break that! Got a fifty?"]] }
    ],
    fix: [['两瓶的水', '两瓶水', 'No 的 needed: 两瓶水.']],
    done: [['朋友，下山再来喝一瓶！', 'Friend, come have another on the way down!']],
    words: [['找钱', 'zhǎo qián', 'to give change'], ['零食', 'língshí', 'snack']],
    later: ['朋友，上次山上的水，好喝吧？', 'Friend, that water on the mountain last time — good, right?']
  },

  'qianfo-4': {   // 张老师 · Temple history
    open: [['你看，这就是兴国禅寺。', 'Look, this is Xingguo Temple.']],
    steps: [
      { obj: 'qianfo-4-1', m: ['@hi !早上|早点', '早上好'], say: [['你好！你也来看寺？', 'Hello! Here to see the temple too?']], try: ['张老师好！', '您好！'] },
      { obj: 'qianfo-4-2', m: ['多少年|多久|多长时间|多老|多少岁|几年 !哪|几几年|什么时候', '历史 多|长', '老不老|老吗|很老'],
        say: [['一千四百多年了！你知道吗？山上有很多石头佛像，所以叫“千佛山”。', 'Over 1,400 years! Did you know? There are lots of stone Buddhas on the mountain, so it\'s called "Thousand Buddha Mountain".']],
        try: ['这个寺有多少年了？', '这个寺有多少年的历史？'] },
      { obj: 'qianfo-4-3', m: ['哪一年|哪年|几几年|什么时候|什么年 !多少年|多久', '朝代'],
        say: [['隋朝的时候建的，大概是公元五八一年到六〇〇年。你听懂了吗？', 'It was built in the Sui dynasty, around AD 581 to 600. Did you understand?', { ask: {
          yes: ['不错，不错！', 'Very good!'],
          no: ['没关系：隋朝，一千四百多年前。', 'No problem: Sui dynasty, over 1,400 years ago.'] } }]],
        try: ['这个寺是哪一年建的？', '这个寺是什么时候建的？'] },
      { obj: 'qianfo-4-4', m: ['拍照|照相|照片|拍'],
        say: [['外面可以拍照，里面不可以。要不要我给你拍一张？', "You can take photos outside, not inside. Shall I take one of you?", { ask: {
          yes: ['好，一、二、三……不错，不错！', 'OK, one, two, three… Very nice!'],
          no: ['好，那我们进去看看。', "OK, then let's go in and look."] } }]],
        try: ['这儿可以拍照吗？', '我能拍照片吗？'] },
      { obj: 'qianfo-4-5', need: 'qianfo-4-2', m: ['@thx'], say: [['不客气！你问得很好。', "You're welcome! Good questions."]], try: ['谢谢张老师！', '谢谢您！'] }
    ],
    extra: [
      { m: ['千佛|为什么叫|名字'], say: [['你知道吗？山上有很多石头佛像，所以叫“千佛山”。', 'Did you know? There are many stone Buddhas on the mountain, so it\'s called "Thousand Buddha Mountain".']] },
      { m: ['隋朝|朝代'], say: [['隋朝很短，只有三十多年。', 'The Sui dynasty was short — only about thirty-some years.']] }
    ],
    done: [['这叫“温故而知新”。下次我再考你！', 'This is called "review the old to learn the new". I\'ll quiz you next time!']],
    words: [['寺', 'sì', 'Buddhist temple'], ['历史', 'lìshǐ', 'history']],
    later: ['你还记得兴国禅寺有多少年的历史吗？', 'Do you remember how old Xingguo Temple is?']
  },

  'qianfo-5': {   // 小谢 · Plan a weekend trip
    open: [['哈哈，你看！济南都在下面！太美了！', 'Haha, look! All of Jinan is down there! So beautiful!']],
    steps: [
      { obj: 'qianfo-5-1', m: ['一起 去|玩|旅游|旅行|爬|出去 !见|点|号', '去 玩|旅游|旅行 吧|好不好|怎么样|要不要|好吗 !见|点|号', '我们 去 吧|好不好|怎么样|好吗 !见|点|号'],
        say: [['真的假的？好啊！走吧！哪天去？', "Really? Sure! Let's go! Which day?"]],
        try: ['我们一起去玩吧！', '我们一起去旅游，好不好？'] },
      { obj: 'qianfo-5-2', m: ['{day} 天|周|星期|礼拜 !点'],
        say: [['{day}？没问题！几号？', '{day}? No problem! What date?']],
        try: ['星期六怎么样？', '这个周末去吧。'] },
      { obj: 'qianfo-5-3', m: ['十号|一号|二号|三号|四号|五号|六号|七号|八号|九号|0号|1号|2号|3号|4号|5号|6号|7号|8号|9号 !几号|号线', '月 日 !几'],
        say: [['好，记住了！我写在手机上。', "OK, got it! I'm putting it in my phone."]],
        try: ['十月十号吧。', '那天是十号。'] },
      { obj: 'qianfo-5-4', m: ['{time} 点 !点儿|一点点'],
        say: [['{time}，没问题！别迟到啊，哈哈！', "{time}, no problem! Don't be late, haha!"]],
        try: ['早上八点吧。', '我们九点见。'] },
      { obj: 'qianfo-5-5', m: ['在 见|等|集合 !哪', '门口|站|这儿|那儿|广场 见 !哪'],
        say: [['好，就在那儿见！', 'OK, see you there!']],
        try: ['在火车站见吧。', '我们在千佛山门口见。'] },
      { obj: 'qianfo-5-6', need: '*', m: ['就这样|就这么|一言为定|说好了|定了|确定|没问题|不见不散|好的|好啊|行|可以|对', '@bye'],
        say: [['{day|周末}，{time|八点}，不见不散！走吧！', '{day|The weekend}, {time|8:00} — be there! Let\'s go!']],
        try: ['好，就这样！', '一言为定！'] }
    ],
    extra: [
      { m: ['哪儿见|哪里见|在哪'], say: [['在千佛山门口见，好吗？', 'Meet at the Qianfo Mountain gate, OK?', { ask: {
        yes: ['好，就在门口见！', 'OK, see you at the gate!', { obj: 'qianfo-5-5' }],
        no: ['那你说，在哪儿见？', 'Then you say: where shall we meet?'] } }]] },
      { m: ['几号|哪天'], say: [['我看看……{day|那天}是十号，行吗？', 'Let me see… {day|that day} is the 10th, OK?', { ask: {
        yes: ['好，十号！我写在手机上。', "OK, the 10th! I'm putting it in my phone.", { obj: 'qianfo-5-3' }],
        no: ['那你说几号？', 'Then you say: what date?'] } }]] },
      { m: ['几点'], say: [['早上八点怎么样？', 'How about eight in the morning?', { ask: {
        yes: ['好，八点！别迟到！', "OK, eight! Don't be late!", { obj: 'qianfo-5-4' }],
        no: ['太早了？哈哈，那你说几点。', 'Too early? Haha, then you pick the time.'] } }]] },
      { m: ['去哪|什么地方|哪儿玩|哪里玩'], say: [['泰山怎么样？坐高铁一个小时！', 'How about Mount Tai? An hour by high-speed train!']] }
    ],
    done: [['哈哈，太好了！我先去买零食！', "Haha, great! I'm going to buy snacks first!"]],
    words: [['不见不散', 'bú jiàn bú sàn', "be there or be square (won't leave till we meet)"], ['见面', 'jiànmiàn', 'to meet up']],
    later: ['哈哈，上次在山上说好一起去玩，你没忘吧？', "Haha, we agreed on the mountain to go on a trip — you didn't forget, right?"]
  }
});
