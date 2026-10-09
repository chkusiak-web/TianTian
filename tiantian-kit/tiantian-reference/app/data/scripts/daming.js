/* 大明湖 Daming Lake · HSK 1–2 · Weather, time & directions */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'daming-1': {   // 王奶奶 · Weather with 王奶奶
    open: [['孩子，坐，坐！你看，湖边多舒服。', 'Sit, child, sit! Look how nice it is by the lake.'], ['孩子，来，跟奶奶坐一会儿。', 'Come, child, sit with Grandma for a while.']],
    steps: [
      { obj: 'daming-1-1', m: ['@hi'], say: [['你好，孩子！', 'Hello, child!'], ['孩子，你好！吃了吗？', 'Hello, child! Have you eaten?']], try: ['奶奶好！', '您好！'] },
      { obj: 'daming-1-2', m: ['今天|天气 热|冷|晴天|阴天|下雨|雨|凉快|暖和|好|不错|风|舒服 !明天|怎么样|吗|喜欢|请', '很热|很冷|太热|太冷|真热|真冷|好热|好冷|晴天|阴天|下雨|凉快|暖和|刮风 !明天|吗|喜欢'], say: [['是啊，是啊！所以奶奶来湖边坐坐。', "Yes, yes! That's why Grandma came to sit by the lake."], ['对，对！你看，湖边的人真多。', 'Right, right! Look how many people are by the lake.']], try: ['今天天气很好！', '今天有点儿热。'] },
      { obj: 'daming-1-3', m: ['明天 天气|怎么样|冷|热|下雨|晴|会|呢'], say: [['听说明天下雨。孩子，你有伞吗？', "I heard it'll rain tomorrow. Child, do you have an umbrella?", { ask: {
        yes: ['好孩子！明天带上，多穿点儿！', 'Good child! Take it tomorrow, and dress warmly!'],
        no: ['没有？奶奶家有，一会儿给你拿一把！', "No? Grandma has one at home. I'll get you one later!"] } }]], try: ['明天天气怎么样？', '明天会下雨吗？'] },
      { obj: 'daming-1-4', m: ['喜欢|怕|爱|讨厌 热|冷|暖和|凉快 !吗|还是', '热天|冷天 !吗|还是'], say: [['哦！奶奶老了，怕冷。冬天我不出门！', "Oh! Grandma's old and feels the cold. In winter I don't go out!"]], try: ['我喜欢热天。', '我怕冷。'] },
      { obj: 'daming-1-5', m: ['春天|夏天|秋天|冬天 喜欢|最|爱 !什么|哪个|吗'], say: [['好啊！济南一年四季都很美。奶奶最喜欢秋天，不冷也不热。', "Lovely! Jinan is beautiful all year round. Grandma likes autumn best: not cold, not hot."]], try: ['我最喜欢秋天。', '我喜欢春天。'] },
      { obj: 'daming-1-6', need: '*', m: ['@bye'], say: [['孩子，慢走！明天别忘了带伞！', "Take care, child! Don't forget your umbrella tomorrow!"]], try: ['奶奶，再见！', '再见，明天见！'] }
    ],
    extra: [
      { m: ['什么季节|哪个季节|你喜欢什么'], say: [['奶奶最喜欢秋天！不冷不热。孩子，你呢？', 'Grandma likes autumn best! Not cold, not hot. What about you, child?']] },
      { m: ['热还是冷|冷还是热'], say: [['奶奶怕冷！孩子，你喜欢热还是冷？', "Grandma can't stand the cold! Child, do you like hot or cold?"]] },
      { m: ['湖|柳树|漂亮|美'], say: [['大明湖很美吧？奶奶小时候天天来这儿。', "Daming Lake is beautiful, isn't it? Grandma came here every day as a little girl."]] }
    ],
    done: [['孩子，跟你说话，奶奶真高兴！', 'Child, talking with you makes Grandma so happy!']],
    words: [['伞', 'sǎn', 'umbrella'], ['季节', 'jìjié', 'season']],
    later: ['孩子，那天在大明湖，第二天真下雨了吧？', 'Child, after that day at Daming Lake, it really did rain the next day, didn\'t it?']
  },

  'daming-2': {   // 张老师 · When does 超然楼 light up?
    open: [['你看，那就是超然楼。晚上灯一亮，特别漂亮！', 'Look, that\'s Chaoran Tower. When the lights come on at night, it\'s especially beautiful!']],
    steps: [
      { obj: 'daming-2-1', m: ['@when 亮|灯 !现在|多久|多长|几个小时|到几点|关', '亮灯|开灯 !现在|多久|多长|几个小时|到几点|关'], say: [['晚上七点亮灯。你知道吗？“超然楼亮了”，现在全中国都知道！', 'The lights come on at seven p.m. Did you know? "Chaoran Tower is lit" is famous all over China now!']], try: ['超然楼几点亮灯？', '什么时候开灯？'] },
      { obj: 'daming-2-2', m: ['现在 几点|时间', '几点了'], say: [['现在五点半。还有一个半小时。', "It's half past five now. Another hour and a half."]], try: ['现在几点？', '现在几点了？'] },
      { obj: 'daming-2-3', m: ['多久|多长时间|几个小时|到几点|几点关|什么时候关|关灯'], say: [['亮到晚上十点，三个小时。', 'It stays lit until ten p.m., three hours.']], try: ['灯亮多长时间？', '亮到几点？'] },
      { obj: 'daming-2-4', m: ['一起 等|看', '等 吧|一下|一会儿', '我们 等'], say: [['好主意！我们去喝杯茶，一边喝一边等，怎么样？', "Good idea! Let's get a cup of tea and wait while we drink. How about it?", { ask: {
        yes: ['好！湖边有一个茶馆，我常去。', "Great! There's a teahouse by the lake. I go there often."],
        no: ['好，那我们就在这儿坐着等。', "All right, then we'll sit here and wait."] } }]], try: ['我们一起等吧！', '我们等一会儿吧。'] },
      { obj: 'daming-2-5', need: 'daming-2-1', m: ['@thx'], say: [['不客气！跟你一起看，我也很高兴。', "You're welcome! I'm glad to watch it with you too."]], try: ['谢谢张老师！', '谢谢您！'] }
    ],
    extra: [
      { m: ['超然楼 什么|历史|老', '多少年'], say: [['你知道吗？超然楼是元代的楼，七百多年了。现在的楼是新的。', 'Did you know? Chaoran Tower dates from the Yuan dynasty, over seven hundred years ago. Today\'s building is new.']] },
      { m: ['漂亮|好看|美'], say: [['是啊。这叫“湖光山色”。', 'Indeed. This is what we call "lake light and mountain colors."']] }
    ],
    done: [['（七点……）你看，亮了！这叫“等得值”。不错，不错！', "(Seven o'clock…) Look, it's lit! This is what we call \"worth the wait.\" Very good!"]],
    words: [['亮', 'liàng', 'to light up; bright'], ['小时', 'xiǎoshí', 'hour']],
    later: ['你知道吗？那天晚上超然楼真漂亮。我们等得值！', 'You know, Chaoran Tower was so beautiful that night. It was worth the wait!']
  },

  'daming-3': {   // 陈女士 · Rent a pedal boat
    open: [['租船？', 'Renting a boat?'], ['……租船？排队。', '…Renting a boat? Get in line.']],
    steps: [
      { obj: 'daming-3-1', m: ['租船|划船|坐船|租一条船|租条船|租一个船 !多少|几块|价|小时|几点|什么时候|押金', '船 想|能|可以|要 !串|多少|几块|价|小时|几点|什么时候|押金'], say: [['脚踏船。好。', 'Pedal boat. OK.'], ['租船。好。', 'A boat. OK.']], try: ['我想租一条船。', '我要租船。'] },
      { obj: 'daming-3-2', m: ['@price', '一个小时 多少|几块', '收费'], say: [['一小时八十。押金两百。', 'Eighty an hour. Two hundred deposit.']], card: { title: '大明湖 · 游船', rows: [['脚踏船', '80元/小时'], ['电动船', '120元/小时'], ['押金', '200元'], ['营业时间', '9:00–18:00']] }, try: ['一个小时多少钱？', '多少钱？'] },
      { obj: 'daming-3-3', m: ['{n} 小时|钟头 !多少|几块|钱|几点|什么时候|还'], say: [['{n}个小时，{n*80}块。押金两百。', '{n} hour(s), {n*80} yuan. Two hundred deposit.']], try: ['我要两个小时。', '我租一个小时。'] },
      { obj: 'daming-3-4', m: ['几点|什么时候 还|回来|回', '还船'], say: [['时间到了就回来。最晚六点。', 'Come back when your time is up. Six at the latest.']], try: ['几点还船？', '我什么时候回来？'] },
      { obj: 'daming-3-5', need: 'daming-3-1', m: ['押金 !多少|几块|什么|吗', '@pay !多少|几块|怎么', '给 两百|200'], say: [['收到。这是船票。时间到了，回来还船，退押金。明白吗？', 'Received. Here\'s your boat ticket. When time\'s up, return the boat and get your deposit back. Understood?', { ask: {
        yes: ['好。下一位。', 'Good. Next.', { obj: 'daming-3-6' }],
        no: ['……时间到，回来。还船，退钱。明白了吗？', '…Time\'s up, come back. Return the boat, get your money. Understood now?', { ask: {
          yes: ['好。下一位。', 'Good. Next.', { obj: 'daming-3-6' }], no: ['……（她指了指船票上的字。）', '…(She points at the words on the ticket.)'] } }] } }]], try: ['给你押金。', '我用微信付押金。'] },
      { obj: 'daming-3-6', need: 'daming-3-5', m: ['明白|知道了|懂了|没问题|好的|确定|就这样|行 !吗|不明白|不知道|不懂', '@thx'], say: [['好。下一位。', 'Good. Next.']], try: ['好的，明白了。', '没问题，谢谢！'] }
    ],
    extra: [
      { m: ['押金'], say: [['两百。还船的时候退给你。', 'Two hundred. You get it back when you return the boat.']] },
      { m: ['几个人|人'], say: [['一条船，最多四个人。', 'One boat, four people at most.']] },
      { m: ['电动'], say: [['电动船一百二一小时。', 'Electric boats are one-twenty an hour.']] }
    ],
    done: [['……祝你玩得开心。', '…Have fun.']],
    words: [['押金', 'yājīn', 'deposit'], ['租', 'zū', 'to rent']],
    later: ['……又是你。上次的船，按时还了。不错。', '…You again. Last time you returned the boat on time. Not bad.']
  },

  'daming-4': {   // 小苏 · Photo by the lake
    open: [['哇，这儿太漂亮了！你看，超然楼！', 'Wow, it\'s so beautiful here! Look, Chaoran Tower!'], ['你的手机……给我吧！我来拍！', 'Your phone… give it to me! I\'ll take it!']],
    steps: [
      { obj: 'daming-4-1', m: ['拍|照相|照片 帮|给我|能|可以|请|吧 !再|多拍|又'], say: [['当然！你站这儿……好！', 'Of course! Stand here… good!'], ['好啊！我拍照很好的，真的！', "Sure! I'm really good at photos, honestly!"]], try: ['你能帮我拍一张照片吗？', '请给我拍一张照片。'] },
      { obj: 'daming-4-2', m: ['超然楼 !什么|几点|在哪|哪儿|什么时候', '楼 拍|进去|也|一起 !什么'], say: [['好！超然楼在你后面……太酷了！', 'OK! Chaoran Tower is behind you… so cool!'], ['没问题！你和超然楼，一起！', 'No problem! You and Chaoran Tower, together!']], try: ['要有超然楼。', '把超然楼也拍进去。'] },
      { obj: 'daming-4-3', m: ['往左|往右|向左|向右|左边|右边|靠左|靠右|左一点|右一点'], say: [['往……这边？好，好！', 'This way…? OK, OK!'], ['好，我动一下……这样呢？', 'OK, I\'ll move a bit… how\'s this?']], try: ['往左一点儿。', '你往右走一点儿。'] },
      { obj: 'daming-4-4', m: ['近一点|近点|远一点|远点|太近|太远|再近|再远|靠近|走近|离我|往前|向前|往后|向后|后退|退后|过来一点|过来点|走过去'], say: [['好，好……这样呢？太酷了！', 'OK, OK… how about this? So cool!']], try: ['近一点儿。', '你再往后一点儿。'] },
      { obj: 'daming-4-5', need: 'daming-4-1', m: ['再拍|再来一张|再照|多拍|再一张|又拍'], say: [['好！一、二、三……好了！你看看，好看吗？', 'OK! One, two, three… done! Take a look. Does it look good?', { ask: {
        yes: ['真的吗？太酷了！我拍得很好吧？', 'Really? So cool! I did a good job, right?'],
        no: ['真的吗？那我再拍几张！', 'Really? Then I\'ll take a few more!'] } }]], try: ['再拍一张吧！', '请再拍一张。'] },
      { obj: 'daming-4-6', need: 'daming-4-1', m: ['@thx'], say: [['不客气！我也想跟超然楼拍一张……你能帮我吗？', "You're welcome! I want one with Chaoran Tower too… can you help me?"]], try: ['谢谢你！', '谢谢，小苏！'] }
    ],
    extra: [
      { m: ['英语|英文'], say: [['真的吗？你教我吧！', 'Really? Teach me!']] },
      { m: ['不好看|不太好|不行'], say: [['真的吗？那我再拍几张！', "Really? Then I'll take a few more!"]] },
      { m: ['好看|漂亮|美|不错'], say: [['真的吗？太酷了！我拍得很好吧？', 'Really? So cool! I did a good job, right?']] }
    ],
    done: [['太酷了！今天的照片都很好看！', 'So cool! All of today\'s photos look great!']],
    words: [['左', 'zuǒ', 'left'], ['右', 'yòu', 'right']],
    later: ['你还记得吗？大明湖的照片，我拍得太酷了！', 'Remember? The photos I took at Daming Lake were so cool!']
  },

  'daming-5': {   // 陈女士 · Help someone who's lost
    open: [['（她拿着地图，看来看去。）……这是哪儿啊？', "(She's turning a map around and around.) …Where is this?"], ['……对不起，这个地图……', '…Sorry, this map…']],
    steps: [
      { obj: 'daming-5-1', m: ['帮 你|您|忙', '需要 帮|帮忙|帮助', '怎么了', '有什么事', '你没事吧|您没事吧', '你还好吗|您还好吗'], say: [['啊……是你！我……我找不到路了。你知道历下亭吗？', "Oh… it's you! I… I'm lost. Do you know Lixia Pavilion?", { ask: {
        yes: ['太好了！我想去历下亭。', "Great! I'm trying to get to Lixia Pavilion.", { obj: 'daming-5-2' }],
        no: ['历下亭……湖上的那个亭子。我想去那儿。', "Lixia Pavilion… the pavilion on the lake. I want to go there."] } }]], try: ['你需要帮忙吗？', '您怎么了？'] },
      { obj: 'daming-5-2', m: ['历下亭|亭子 !岛|走|转|桥|分钟|很近|不远', '你 去|找 哪|什么'], say: [['对，历下亭。今天我休息，想去看看。可是在哪儿？', "Yes, Lixia Pavilion. I'm off today and want to see it. But where is it?"]], try: ['你要去历下亭吗？', '你找什么？'] },
      { obj: 'daming-5-3', m: ['岛上|小岛|岛中|在岛|湖中间|湖中心|湖里面'], say: [['在岛上？哦……我一直在湖边找！', "On the island? Oh… I've been looking along the shore the whole time!"]], try: ['历下亭在岛上。', '在湖中间的岛上。'] },
      { obj: 'daming-5-4', m: ['直走|往前走|一直走|左转|右转|往左|往右|左拐|右拐|过桥|桥'], say: [['直走，左转，过桥……是这样吗？', 'Straight, turn left, cross the bridge… like that?', { ask: {
        yes: ['好，我记住了。', 'OK, I\'ve got it.'],
        no: ['……那，怎么走？请再说一遍。', '…Then which way? Please say it again.'] } }]], try: ['一直走，然后左转，过桥。', '往前走，过桥就到了。'] },
      { obj: 'daming-5-5', m: ['{n} 分钟|分', '几分钟 就|到', '很近|不远|不太远'], say: [['{n|几}分钟就到？好，不远。', 'Just {n|a few} minutes? Good, not far.']], try: ['走十分钟就到了。', '不远，五分钟。'] },
      { obj: 'daming-5-6', need: 'daming-5-2', m: ['祝', '玩得 开心|好|愉快', '休息 好|愉快|开心', '开心|愉快'], say: [['谢谢你！（她笑了）……下次买票，你不用排队。开玩笑的。', "Thank you! (She smiles.) …Next time you buy a ticket, you can skip the line. Just kidding."]], try: ['祝你休息日快乐！', '祝你玩得开心！'] }
    ],
    extra: [
      { m: ['不是|不对|错了'], say: [['……那，怎么走？请再说一遍。', '…Then which way? Please say it again.']] },
      { m: ['直走|往前|左转|右转|过桥|一直走'], say: [['……过桥，然后……好，我记住了。', '…Cross the bridge, then… OK, I\'ve got it.']] },
      { m: ['@thx'], say: [['不，是我要谢谢你。', "No, I should be thanking you."]] },
      { m: ['休息|工作|上班'], say: [['今天休息。不卖票。', "I'm off today. No tickets."]] }
    ],
    done: [['……你人真好。再见。', '…You\'re very kind. Goodbye.']],
    words: [['岛', 'dǎo', 'island'], ['桥', 'qiáo', 'bridge']],
    later: ['……上次你帮我找到历下亭。谢谢。', '…Last time you helped me find Lixia Pavilion. Thank you.']
  }
});
