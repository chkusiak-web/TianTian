/* 曲水亭街 Qushuiting Street · HSK 2 · Home & daily life */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'qushuiting-1': {   // 张老师 · Meet your landlord
    open: [['来，请进！这就是我的院子。房间在那边。', 'Come in, please! This is my courtyard. The room is over there.']],
    steps: [
      { obj: 'qushuiting-1-1', m: ['@hi !早上|早点', '早上好'],
        say: [['你好！你知道吗？这个院子有一百多年了。', 'Hello! Did you know? This courtyard is over a hundred years old.']],
        try: ['张老师好！', '您好！'] },
      { obj: 'qushuiting-1-2', m: ['房租|租金', '一个月|每个月 多少|几|钱', '@price'],
        say: [['一个月两千五百块。三个月交一次。', 'Two thousand five hundred a month, paid every three months.']],
        card: { title: '曲水亭街 · 出租', rows: [['房间', '一室一厅'], ['房租', '2500元/月'], ['付款', '三个月一次'], ['网', '有'], ['热水', '24小时']] },
        try: ['房租一个月多少钱？', '一个月多少钱？'] },
      { obj: 'qushuiting-1-3', m: ['wifi|无线|网|密码'],
        say: [['有网，很快。密码在桌子上。', "There's internet, and it's fast. The password is on the table."]],
        try: ['有Wi-Fi吗？', '这儿可以上网吗？'] },
      { obj: 'qushuiting-1-4', m: ['热水|洗澡'],
        say: [['有热水，二十四小时都有。', "There's hot water, twenty-four hours a day."]],
        try: ['有热水吗？', '可以洗澡吗？'] },
      { obj: 'qushuiting-1-5', m: ['搬', '什么时候|哪天|几号|今天|明天 住|进来', '住进|入住|能住|可以住'],
        say: [['明天就可以搬。明天上午来，好吗？', 'You can move in tomorrow. Come tomorrow morning, OK?', { ask: {
          yes: ['好，明天上午我在家等你。', "Good. I'll be home waiting for you tomorrow morning."],
          no: ['没关系，你什么时候方便，给我打电话。', "No problem. Call me whenever it suits you."] } }]],
        try: ['我什么时候可以搬进来？', '我哪天能住进来？'] },
      { obj: 'qushuiting-1-6', need: 'qushuiting-1-2', m: ['租 !房租|租金|多少|几|吗', '要了|就要|决定|定了|这个房间|这个房子|这间 !吗|多少|几'],
        say: [['好！不错，不错。这叫“远亲不如近邻”，以后我们就是邻居了！', 'Great! Very good. As the saying goes, "a close neighbor beats a distant relative." From now on we\'re neighbors!']],
        try: ['我想租这个房间。', '好，我租了！'] }
    ],
    extra: [
      { m: ['厨房|做饭'], say: [['有厨房，你可以自己做饭。', 'There\'s a kitchen; you can cook for yourself.']] },
      { m: ['院子|多少年|历史|老房子'], say: [['你知道吗？这个院子是清朝的，一百多年了！', 'Did you know? This courtyard dates from the Qing dynasty — over a hundred years old!']] },
      { m: ['泉|小河|水'], say: [['门口的水是泉水，很干净。所以这条街叫“曲水亭街”。', 'The water by the door is spring water, very clean. That\'s why this street is called "Qushuiting Street".']] }
    ],
    fix: [['热的水', '热水', 'Hot water is one word: 热水.']],
    done: [['好！这是钥匙。有问题就来找我。', "Good! Here are the keys. If there's any problem, come find me."]],
    words: [['房租', 'fángzū', 'rent'], ['搬家', 'bānjiā', 'to move (house)']],
    later: ['住得怎么样？热水没问题吧？', 'How are you settling in? Hot water working?']
  },

  'qushuiting-2': {   // 王奶奶 · Neighbor at the stream
    open: [['（她在门口的小河里洗菜）孩子，你是新来的吧？', "(She's washing vegetables in the stream by her door.) Child, you're new here, aren't you?"]],
    steps: [
      { obj: 'qushuiting-2-1', m: ['@hi !早上|早点', '早上好'],
        say: [['你好，孩子！吃了吗？', 'Hello, child! Have you eaten?']],
        try: ['奶奶好！', '您好！'] },
      { obj: 'qushuiting-2-2', m: ['刚 搬|来|住', '搬 来|家|到|了|进', '新 邻居|来的', '我 住 这|那|对面|张老师'],
        say: [['哎呀，新邻居！欢迎，欢迎！你一个人住吗？', 'Oh my, a new neighbor! Welcome, welcome! Do you live alone?', { ask: {
          yes: ['一个人啊……孩子，要好好吃饭！', 'All alone… Child, you must eat properly!'],
          no: ['哦，有人一起住，好，好。', 'Oh, someone lives with you. Good, good.'] } }]],
        try: ['我刚搬来。', '我是新邻居，住在张老师家。'] },
      { obj: 'qushuiting-2-3', m: ['{n} 口', '家 {n} 个人', '家 有 {n} 人'],
        say: [['{n}口人，好啊！他们都在你们国家吗？孩子，想家吗？', '{n} people, lovely! Are they all back in your country? Child, do you miss home?', { ask: {
          yes: ['想家就来奶奶这儿！奶奶给你做饭。', "When you miss home, come to Grandma's! I'll cook for you."],
          no: ['不想家？哈哈，好孩子，你很勇敢！', "You don't? Haha, good child, you're brave!"] } }]],
        try: ['我家有四口人。', '我家有三个人：爸爸、妈妈和我。'] },
      { obj: 'qushuiting-2-4', m: ['你家|您家|你的家|您的家|你们家 几|多少|人|谁', '你|您 有 孩子|孙子|儿子|女儿', '你|您 家里|家人'],
        say: [['我啊，有一个儿子，两个孙子。孙子在北京上大学，不常回来。今天晚上来奶奶家吃饭吧？', "Me? One son and two grandsons. My grandsons are at university in Beijing and don't come back often. Come eat at Grandma's tonight?", { ask: {
          yes: ['好，好！晚上六点来，奶奶包饺子！', "Good, good! Come at six tonight. Grandma will make dumplings!", { obj: 'qushuiting-2-5' }],
          no: ['不来？孩子，不吃饭可不行！你再想想。', "Not coming? Child, you can't skip dinner! Think about it."] } }]],
        try: ['您家有几口人？', '您有孙子吗？'] },
      { obj: 'qushuiting-2-5', need: 'qushuiting-2-4', m: ['我 去|来 !不|没', '好啊|好的|没问题|一定|当然|太好了 !不'],
        say: [['好，好！晚上六点来，奶奶包饺子！', "Good, good! Come at six tonight. Grandma will make dumplings!"]],
        try: ['好啊，我一定去！', '谢谢奶奶，我晚上来。'] }
    ],
    extra: [
      { m: ['朋友|同学|不是'], say: [['哦，有人一起住啊？好，好。', 'Oh, someone lives with you? Good, good.']] },
      { m: ['洗菜|干什么|做什么'], say: [['洗菜呢！泉水洗菜，干净！', "Washing vegetables! Spring water gets them clean!"]] },
      { m: ['水 干净|能喝|泉水'], say: [['这是泉水，很干净。济南人都用。', "It's spring water, very clean. Everyone in Jinan uses it."]] },
      { m: ['饺子|吃什么'], say: [['白菜猪肉饺子！孩子，你吃过吗？', 'Cabbage and pork dumplings! Child, have you had them?']] }
    ],
    done: [['孩子，晚上六点，别忘了！多穿点儿！', "Child, six o'clock tonight, don't forget! Wear something warm!"]],
    fix: [['两个口人', '两口人', 'Family size uses 口 alone: 两口人.'], ['三个口人', '三口人', 'Family size uses 口 alone: 三口人.'], ['四个口人', '四口人', 'Family size uses 口 alone: 四口人.'], ['五个口人', '五口人', 'Family size uses 口 alone: 五口人.'], ['六个口人', '六口人', 'Family size uses 口 alone: 六口人.']],
    words: [['邻居', 'línjū', 'neighbor'], ['口', 'kǒu', 'measure word for family members']],
    later: ['孩子，上次的饺子好吃吧？', 'Child, the dumplings last time were good, weren\'t they?']
  },

  'qushuiting-3': {   // 老潘 · Teahouse on his day off
    open: [['哎！这儿，这儿！来坐！', 'Hey! Over here, over here! Come sit!']],
    steps: [
      { obj: 'qushuiting-3-1', m: ['@hi !早上|早点', '早上好', '老潘好|潘师傅|潘叔叔'],
        say: [['你好！今天我休息，不开车！来，喝杯茶吧？', "Hello! I'm off today, no driving! Come on, have a cup of tea?", { ask: {
          yes: ['好嘞！我跟你说，这是花茶，济南人最喜欢喝！', "Great! Let me tell you, this is jasmine tea. Jinan people's favorite!", { obj: 'qushuiting-3-2' }],
          no: ['不喝？来茶馆不喝茶？哈哈，来一杯吧！', "Not drinking? Coming to a teahouse and not having tea? Haha, have one!"] } }]],
        try: ['老潘，你好！', '你好！'] },
      { obj: 'qushuiting-3-2', m: ['@want|喝 茶|一杯 !不|喜欢|爱好', '好啊|好的|谢谢|可以 喝|茶|一杯 !不'],
        say: [['好嘞！我跟你说，这是花茶，济南人最喜欢喝！', "Great! Let me tell you, this is jasmine tea. Jinan people's favorite!"]],
        try: ['好啊，我喝一杯茶。', '我要一杯茶，谢谢。'] },
      { obj: 'qushuiting-3-3', m: ['你|您 爱好|喜欢 什么|做什么|干什么', '你的爱好|您的爱好|有什么爱好', '爱好 是什么', '爱好|喜欢 你呢|您呢'],
        say: [['我啊？我最喜欢钓鱼！我跟你说，黄河的鱼可大了！你有什么爱好？', 'Me? I love fishing! Let me tell you, the fish in the Yellow River are huge! What are your hobbies?']],
        try: ['你有什么爱好？', '你喜欢做什么？'] },
      { obj: 'qushuiting-3-4', m: ['我 喜欢|爱 !你喜欢|您喜欢|什么', '我的爱好 !什么', '爱好是 !什么'],
        say: [['真的？不错！年轻人就应该这样！', 'Really? Nice! That\'s how young people should be!']],
        try: ['我喜欢看书。', '我的爱好是踢足球。'] },
      { obj: 'qushuiting-3-5', m: ['我 周末|星期六|星期天|星期日|休息的时候', '周末 常常|一般|喜欢|在家|去 !你|您'],
        say: [['不错！下个周末，我带你去黄河钓鱼，想去吗？', 'Nice! Next weekend I\'ll take you fishing on the Yellow River. Want to come?', { ask: {
          yes: ['好嘞，说好了！我开车！', "Great, it's a deal! I'll drive!"],
          no: ['哈哈，没意思？那我们就喝茶！', "Haha, boring? Then we'll just drink tea!"] } }]],
        try: ['我周末常常去爬山。', '周末我一般在家休息。'] },
      { obj: 'qushuiting-3-6', need: '*', m: ['@bye'],
        say: [['再见！有事给我打电话！', 'Bye! Call me if you need anything!']],
        try: ['老潘，再见！', '我走了，再见！'] }
    ],
    extra: [
      { m: ['不 谢谢|喝 !喝茶|一杯'], say: [['不喝？来茶馆不喝茶？哈哈，来一杯吧！', "Not drinking? Coming to a teahouse and not having tea? Haha, have one!"]] },
      { m: ['我 喜欢|爱 !你喜欢|您喜欢|什么'], say: [['哈哈，好！我跟你说，我年轻的时候也喜欢！', 'Haha, great! Let me tell you, I liked that too when I was young!']] },
      { m: ['你|您 周末'], say: [['我跟你说，我周末就去钓鱼！你呢？周末干什么？', 'Let me tell you, on weekends I go fishing! You? What do you do on weekends?']] },
      { m: ['好喝|茶 好|香'], say: [['是吧？我跟你说，这儿的茶最好！', 'Right? Let me tell you, the tea here is the best!']] },
      { m: ['开车|堵车|累'], say: [['我跟你说，天天堵死了！今天不开车，太好了！', 'Let me tell you, traffic is jammed every day! No driving today — great!']] }
    ],
    done: [['今天聊得真开心！我跟你说，下次我请你吃把子肉！', 'Great chat today! Let me tell you, next time 把子肉 is on me!']],
    words: [['爱好', 'àihào', 'hobby'], ['茶馆', 'cháguǎn', 'teahouse']],
    later: ['上次在茶馆说的，周末一起去钓鱼，你还记得吗？', 'Remember what we said at the teahouse — going fishing together some weekend?']
  },

  'qushuiting-4': {   // 林姐 · Your package
    open: [['哎，邻居！你回来了？正好，我这儿有你的东西。', "Hey, neighbor! You're back? Perfect timing, I've got something of yours."]],
    steps: [
      { obj: 'qushuiting-4-1', m: ['@hi !早上|早点', '早上好'],
        say: [['你好！今天不上班，在家休息。', "Hi! No work today, I'm resting at home."]],
        try: ['林姐好！', '你好！'] },
      { obj: 'qushuiting-4-2', m: ['快递|包裹 !下次|我帮', '我的 东西'],
        say: [['收到了！昨天下午到的。可是这儿有好几个，哪个是你的？', "Yes, it came yesterday afternoon. But there are several here — which one is yours?"]],
        try: ['你收到我的快递了吗？', '有我的快递吗？'] },
      { obj: 'qushuiting-4-3', m: ['{color} 的|色', '大的|小的|大盒子|小盒子|大箱子|小箱子|很大|不大|很小|不小|很重|不重|很轻|不轻|袋子|盒子|箱子', '一本书|衣服|手机|电脑'],
        say: [['我看看……对，是这个！上面有你的名字。有点儿重，要我帮你拿过去吗？', "Let me see… yes, this one! It has your name on it. It's a bit heavy — want me to carry it over for you?", { ask: {
          yes: ['好的，没问题！走吧。', "Sure, no problem! Let's go."],
          no: ['好的，给你。小心点儿！', 'OK, here you go. Careful!'] } }]],
        card: { title: '快递单', rows: [['收件人', '{name|—}'], ['地址', '曲水亭街12号院'], ['重量', '2公斤'], ['到达', '昨天 15:20']] },
        try: ['是一个大盒子。', '是一个白色的盒子。'] },
      { obj: 'qushuiting-4-4', need: 'qushuiting-4-2', m: ['@thx', '麻烦你了|辛苦'],
        say: [['不客气，邻居嘛！', "You're welcome, we're neighbors!"]],
        try: ['谢谢林姐！', '谢谢你，麻烦你了！'] },
      { obj: 'qushuiting-4-5', need: 'qushuiting-4-2', m: ['我 帮你|帮您|帮忙', '下次 我', '请你|请您 吃|喝', '有事 找我|叫我|告诉我', '需要 帮'],
        say: [['你真客气！那我下个星期出差，你帮我收快递吧！', "That's so kind! Then next week when I'm away on business, you take in my packages!"]],
        try: ['下次我帮你拿快递。', '有事就找我！'] }
    ],
    extra: [
      { m: ['什么时候到|几点到|哪天到'], say: [['昨天下午三点多到的。', 'It came a little after three yesterday afternoon.']] },
      { m: ['上班|工作|休息'], say: [['今天休息！不用说“您好，请问您需要……”，太好了！', 'Day off! No need to say "Hello, how may I help you…" — so nice!']] }
    ],
    done: [['有你这个邻居，真好！', "It's great having a neighbor like you!"]],
    words: [['快递', 'kuàidì', 'package, express delivery'], ['盒子', 'hézi', 'box']],
    later: ['上次的快递，东西没问题吧？', 'That package last time — everything OK inside?']
  },

  'qushuiting-5': {   // 王奶奶 · Help with her phone
    open: [['孩子，你来得正好！奶奶的手机……哎呀！', "Child, perfect timing! Grandma's phone… oh dear!"]],
    steps: [
      { obj: 'qushuiting-5-1', m: ['怎么了|什么事|有事|要我', '需要 帮|什么', '帮你|帮您|帮忙', '做什么|干什么'],
        say: [['我想跟孙子视频，可是我不会用。孩子，你帮帮奶奶？', "I want to video-call my grandson, but I don't know how. Child, will you help Grandma?", { ask: {
          yes: ['好孩子！来，你看。', 'Good child! Here, take a look.'],
          no: ['……孩子，你忙？那奶奶等你。', "…You're busy, child? Then Grandma will wait."] } }]],
        try: ['奶奶，怎么了？', '您需要什么帮助？'] },
      { obj: 'qushuiting-5-2', m: ['微信'],
        say: [['微信……是这个绿色的吗？', 'WeChat… is it this green one?', { ask: {
          yes: ['好，打开了！然后呢？', "OK, it's open! What next?"],
          no: ['不是？哎呀，奶奶眼睛不好……哦，这个！打开了。', "Not that one? Oh dear, Grandma's eyes… oh, this one! It's open."] } }]],
        try: ['先打开微信。', '您点一下微信。'] },
      { obj: 'qushuiting-5-3', m: ['按|点|摁 这个|那个|视频|按钮|右边|左边|上面|下面|加号|图标 !微信', '视频通话|视频聊天|打视频|视频', '按钮'],
        say: [['这个？……按了！哎，响了，响了！', 'This one? …Pressed it! Oh, it\'s ringing, it\'s ringing!']],
        try: ['按这个视频按钮。', '点右下角的视频。'] },
      { obj: 'qushuiting-5-4', need: 'qushuiting-5-3', m: ['好了|可以了|通了|成功|看到|看见|能看|行了|接了'],
        say: [['看到了！看到我孙子了！孩子，你真聪明！', 'I can see him! I can see my grandson! Child, you\'re so clever!']],
        try: ['好了！您看，可以了。', '通了！您能看到他吗？'] },
      { obj: 'qushuiting-5-5', need: 'qushuiting-5-4', m: ['@hi', '你们好'],
        say: [['（孙子：你好！谢谢你帮我奶奶！）', '(Grandson: Hi! Thanks for helping my grandma!)']],
        try: ['你好！', '你们好！'] }
    ],
    extra: [
      { m: ['不是'], say: [['不是？哎呀，奶奶眼睛不好……哦，这个！打开了。', "Not that one? Oh dear, Grandma's eyes… oh, this one! It's open."]] },
      { m: ['孙子 几岁|多大|在哪'], say: [['大孙子二十岁，在北京上大学。', 'My older grandson is twenty, at university in Beijing.']] },
      { m: ['听不见|声音|大声'], say: [['啊？奶奶听不见……哦，好了，听见了！', "Huh? Grandma can't hear… oh, there, now I can!"]] }
    ],
    done: [['孩子，谢谢你！吃了吗？没吃就在奶奶家吃！', "Thank you, child! Have you eaten? If not, eat at Grandma's!"]],
    words: [['视频', 'shìpín', 'video (call)'], ['按', 'àn', 'to press']],
    later: ['孩子，我现在天天跟孙子视频！都是你教的！', 'Child, I video-call my grandson every day now! All thanks to you!']
  }
});
