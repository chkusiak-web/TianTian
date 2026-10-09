/* 宽厚里 Kuanhouli · HSK 3 · Going out & making plans */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'kuanhouli-1': {   // 小谢 · Make dinner plans (over WeChat)
    greet: [],   // phone/text: no in-person greeting
    open: [['（微信）哈哈，在干嘛？', '(WeChat) Haha, what are you up to?'], ['（微信）嘿！这几天忙不忙？', '(WeChat) Hey! Busy these days?']],
    steps: [
      { obj: 'kuanhouli-1-1', m: ['一起 吃饭|吃晚饭|晚饭|吃东西|出去吃', '请你 吃', '吃饭 吗|吧|怎么样', '约 你|饭'], say: [['真的假的？好啊！你请客吗？哈哈', "Seriously? Sure! Is it your treat? Haha", { ask: {
        yes: ['哈哈，太好了！开玩笑的，我们一起付。哪天？', "Haha, awesome! Just kidding, we'll split it. Which day?"],
        no: ['哈哈，开玩笑的！哪天？', 'Haha, just kidding! Which day?'] } }]],
        try: ['我们一起吃晚饭吧！', '我请你吃饭，怎么样？'] },
      { obj: 'kuanhouli-1-2', m: ['{day} !几点', '哪天|什么时候 有空|方便|可以 !几点'], say: [['{day|周六}可以！几点？', '{day|Saturday} works! What time?']], try: ['星期六你有空吗？', '明天晚上可以吗？'] },
      { obj: 'kuanhouli-1-3', m: ['{time}', '几点'], say: [['{time|七点}，没问题！去哪儿吃？', '{time|Seven}, no problem! Where shall we eat?']], try: ['晚上七点怎么样？', '我们六点半见吧。'] },
      { obj: 'kuanhouli-1-4', m: ['宽厚里', '烧烤|火锅|饺子|鲁菜|把子肉|川菜', '饭馆|餐厅|饭店', '去哪|在哪儿吃|在哪里吃|吃什么'], say: [['好啊！就去宽厚里，那儿什么都有，烧烤、火锅都好吃！', "Sure! Let's go to Kuanhouli, they have everything there. The barbecue and hotpot are both great!"]], try: ['我们去宽厚里吃烧烤吧！', '去哪儿吃？'] },
      { obj: 'kuanhouli-1-5', m: ['还有谁', '谁 来|去|一起', '几个人', '别人', '叫 朋友|谁|别人', '带 朋友|谁'], say: [['我想叫上小苏，可以吗？', 'I was thinking of bringing Xiao Su along, is that OK?', { ask: {
        yes: ['哈哈，太好了！那我们三个人。', "Haha, great! So it's the three of us."],
        no: ['好吧，那就我们两个人！', "OK, then just the two of us!"] } }]],
        try: ['还有谁去？', '你要叫别人吗？'] },
      { obj: 'kuanhouli-1-6', need: '*', m: ['说定了|定了|不见不散|一言为定|到时候见|那就这样', '@bye', '没问题|确定|好的|行', '{day} 见'], say: [['哈哈，好！{day|周六}{time|七点}，宽厚里见！不见不散！', "Haha, great! {day|Saturday}, {time|seven}, see you at Kuanhouli! Be there or be square!"]], try: ['好，就这么定了！', '不见不散！'] }
    ],
    extra: [
      { m: ['忙|在干嘛|在做什么'], say: [['哈哈，天天加班，累死了！所以想吃好吃的！', "Haha, working overtime every day, exhausted! So I want something good to eat!"]] },
      { m: ['不是|不请|没钱|开玩笑'], say: [['哈哈，开玩笑的！', 'Haha, just kidding!']] },
      { m: ['订|位子'], say: [['没问题，我来订位子！', "No problem, I'll book a table!"]] }
    ],
    done: [['（发来一个笑脸）走吧，到时候见！', '(Sends a smiley) Let\'s do it, see you then!']],
    words: [['不见不散', 'bú jiàn bú sàn', "be there or be square (lit. don't leave until we meet)"], ['请客', 'qǐngkè', 'to treat (pay for others)']],
    later: ['哈哈，上次是你约我吃饭的！这次我请你！', "Haha, last time you invited me to dinner! This time it's my treat!"]
  },

  'kuanhouli-2': {   // 孙师傅 · Barbecue for a group
    open: [['来了！朋友，几位？', 'Coming! Friend, how many of you?'], ['来了来了！朋友，今天几个人？', 'Coming, coming! Friend, how many people today?']],
    steps: [
      { obj: 'kuanhouli-2-1', m: ['{n} 个人|位|人 !串', '我们 {n} !串'], say: [['{n}位！这边坐，这张大桌子！', '{n} of you! Sit over here at this big table!']], try: ['我们四个人。', '三位。'] },
      { obj: 'kuanhouli-2-2', m: ['菜单', '有什么 吃|好吃|串|烤', '看看|看一下', '都有什么'], say: [['菜单在这儿！朋友，羊肉串最好吃，三块一串！', "Here's the menu! Friend, the lamb skewers are the best, three yuan each!"]],
        card: { title: '孙记烧烤 · 菜单', rows: [['羊肉串', '3元/串'], ['牛肉串', '3元/串'], ['烤鸡翅', '6元/个'], ['烤韭菜', '2元/串'], ['烤馒头', '2元/个'], ['啤酒', '8元/瓶'], ['饮料', '5元/瓶']] },
        try: ['有菜单吗？', '我们看看菜单。'] },
      { obj: 'kuanhouli-2-3', m: ['{n} 串', '羊肉|牛肉|肉串 {n} !人|位|瓶|杯|分钟'], say: [['好嘞！{n}串，三块一串，{n*3}块。要不要加两个鸡翅？', 'You got it! {n} skewers at three yuan each, {n*3} yuan. Want to add two chicken wings?', { ask: {
        yes: ['好！再加两个鸡翅，十二块！', 'Great! Two more chicken wings, twelve yuan!'],
        no: ['行，朋友，不加！', "Fine, friend, no wings!"] } }]],
        try: ['来二十串羊肉串。', '我们要三十串羊肉，十串牛肉。'] },
      { obj: 'kuanhouli-2-4', m: ['{spice}', '辣椒'], say: [['好嘞，记住了！朋友，放心，辣椒是我自己做的，香！', "You got it, noted! Don't worry, friend, I make the chili myself. Smells great!"]], try: ['微辣，谢谢。', '不要太辣。'] },
      { obj: 'kuanhouli-2-5', m: ['{drink}', '喝的|饮料'], say: [['好嘞！{drink|喝的}马上来，冰的！', "You got it! {drink|Drinks} coming right up, ice cold!"]], try: ['再来四瓶啤酒。', '有什么喝的？'] },
      { obj: 'kuanhouli-2-6', m: ['多久|多长时间|几分钟|要等|什么时候好|快点|好了吗', '快 吗'], say: [['十五分钟！朋友，先喝着，马上就好！', 'Fifteen minutes! Friend, have a drink first, it\'ll be ready in no time!']], try: ['要等多长时间？', '大概要多久？'] }
    ],
    extra: [
      { m: ['@price', '一共'], say: [['吃完再算！好吃不贵！', "We'll settle up after you eat! Tasty and cheap!"]] },
      { m: ['好吃|香'], say: [['那当然！好吃不贵！', 'Of course! Tasty and cheap!']] },
      { m: ['鸡翅|韭菜|馒头'], say: [['好嘞！再加一份，马上烤！', 'You got it! One more order, grilling now!']] }
    ],
    fix: [['个羊肉串', '串羊肉串', 'Skewers are counted with 串: 二十串羊肉串.'], ['个牛肉串', '串牛肉串', 'Skewers are counted with 串: 十串牛肉串.']],
    done: [['来了！朋友们，慢慢吃，不够再加！', "Here you go! Enjoy, friends, and order more if it's not enough!"]],
    words: [['串', 'chuàn', 'skewer; measure word for skewers'], ['烧烤', 'shāokǎo', 'barbecue']],
    later: ['朋友！上次的羊肉串够辣吗？', 'Friend! Were the lamb skewers spicy enough last time?']
  },

  'kuanhouli-3': {   // 老潘 · Toast at the next table
    open: [['哎！外国朋友！来来来，一起喝一杯！你喝酒吗？', "Hey! Foreign friend! Come, come, have a drink with us! Do you drink?", { ask: {
      yes: ['好！来，倒上！', 'Great! Here, let me pour you one!'],
      no: ['没事儿，喝茶也行！来！', "No problem, tea's fine too! Come on!"] } }]],
    steps: [
      { obj: 'kuanhouli-3-1', m: ['干杯', '敬你|敬您', '祝 你|您|大家|我们'], say: [['干杯！哈哈，痛快！', 'Cheers! Haha, that hits the spot!']], try: ['干杯！', '我敬你一杯！'] },
      { obj: 'kuanhouli-3-2', m: ['你|您 做什么|干什么|工作|干嘛', '什么工作', '司机|出租车 你|您'], say: [['我？开出租车的！开了二十年了。我跟你说，济南天天堵死了！你呢？', "Me? I drive a taxi! Twenty years now. Let me tell you, Jinan traffic is jammed every single day! And you?"]], try: ['你做什么工作？', '您是司机吗？'] },
      { obj: 'kuanhouli-3-3', m: ['我是 学生|留学生|老师|工程师|医生|律师|记者|经理|司机', '我在 学习|工作|上学|上班|学校|公司|大学|山大', '我的工作', '我做', '我教', '我学'], say: [['哦！不错，不错！我跟你说……你结婚了吗？哈哈！', "Oh! Not bad, not bad! Let me ask you… are you married? Haha!", { ask: {
        yes: ['哈哈，好啊！家里人也在济南吗？', 'Haha, good! Is your family in Jinan too?'],
        no: ['我跟你说，不着急！济南的好姑娘、好小伙子多着呢！', "Let me tell you, no rush! Jinan has plenty of nice girls and guys!"] } }]],
        try: ['我是留学生，在山东大学学中文。', '我在一家公司工作。'] },
      { obj: 'kuanhouli-3-4', m: ['好吃', '香', '味道 好|不错', '太棒|真棒'], say: [['那当然！我跟你说，这家的烧烤是济南最好的！', 'Of course! Let me tell you, this place has the best barbecue in Jinan!']], try: ['这个烧烤真好吃！', '羊肉串很香！'] },
      { obj: 'kuanhouli-3-5', m: ['济南 喜欢|好|漂亮|美|不错|热情|有意思|方便|舒服', '喜欢 济南|泉水|大明湖|趵突泉|千佛山|泉', '济南人'], say: [['哈哈，你说得对！我跟你说，济南人也热情！欢迎你常来！', "Haha, you're right! And let me tell you, Jinan people are warm too! You're welcome here any time!"]], try: ['我很喜欢济南的泉水。', '济南人很热情！'] }
    ],
    extra: [
      { m: ['堵车|堵'], say: [['我跟你说，经十路每天都堵死了！', "Let me tell you, Jingshi Road is jammed solid every day!"]] },
      { m: ['家|孩子|太太|老婆'], say: [['我儿子在上海工作，一年回来一次。', 'My son works in Shanghai. He comes back once a year.']] }
    ],
    done: [['来来来，再干一杯！有事给我打电话！', "Come on, one more toast! Call me if you ever need anything!"]],
    words: [['干杯', 'gānbēi', 'cheers! (lit. dry the glass)'], ['热情', 'rèqíng', 'warm, enthusiastic']],
    later: ['我跟你说，上次在宽厚里喝得真痛快！', 'Let me tell you, that night drinking at Kuanhouli was great!']
  },

  'kuanhouli-4': {   // 小苏 · Decline politely
    open: [['那个……今天晚上我和同学去唱歌，你想一起去吗？', "Um… tonight my classmates and I are going to karaoke. Do you want to come?"], ['今天晚上我们班去唱歌！你也来吧？', "Our class is going to karaoke tonight! You'll come too, right?"]],
    steps: [
      { obj: 'kuanhouli-4-1', m: ['@thx'], say: [['不客气！大家都想认识你！', "Of course! Everyone wants to meet you!"]], try: ['谢谢你请我！', '谢谢你叫我！'] },
      { obj: 'kuanhouli-4-2', m: ['不好意思', '对不起', '抱歉', '去不了|不能去|不去了|来不了|不能来|没办法去'], say: [['啊……没关系！你有事吗？', 'Ah… no problem! Do you have something on?']], try: ['不好意思，我去不了。', '对不起，今天晚上我不能去。'] },
      { obj: 'kuanhouli-4-3', m: ['因为', '有事', '考试|复习|作业|上课|有课|加班|开会', '累|不舒服|感冒|头疼|生病', '有约|约了'], say: [['哦，这样啊！没关系，那你忙吧。', "Oh, I see! No problem, go do what you need to."]], try: ['因为明天有考试。', '我今天有很多作业。'] },
      { obj: 'kuanhouli-4-4', m: ['下次', '改天', '以后 一起|再', '别的时间', '{day} 一起|吧|怎么样|有空|可以 !考试|作业|上课|有课|有事|忙|不能|去不了'], say: [['好啊！{day|下次}一起去！你唱一首中文歌，好不好？', "Sure! Let's go together {day|next time}! Will you sing a Chinese song?", { ask: {
        yes: ['太酷了！我们说定了！', "So cool! It's a deal!"],
        no: ['哈哈，那你听我们唱！', 'Haha, then you can listen to us sing!'] } }]],
        try: ['下次我们一起去吧！', '周末一起去，怎么样？'] },
      { obj: 'kuanhouli-4-5', need: '*', m: ['玩得开心|玩儿得开心|开心|好好玩', '@bye', '加油'], say: [['谢谢！你也加油！', 'Thanks! Good luck to you too!']], try: ['祝你们玩得开心！', '玩得开心！明天见！'] }
    ],
    extra: [
      { m: ['几点|在哪'], say: [['晚上八点，在学校旁边的歌厅。', 'Eight tonight, at the karaoke place next to campus.']] },
      { m: ['谁 去', '几个人'], say: [['我们班的同学，七八个人吧。', "Classmates from my class, seven or eight people."]] }
    ],
    done: [['没事儿！你是我的好朋友！明天见！', "No worries! You're a good friend! See you tomorrow!"]],
    words: [['可惜', 'kěxī', "what a pity; too bad"], ['唱歌', 'chàng gē', 'to sing (also: to do karaoke)']],
    later: ['上次唱歌你没来，大家都说想认识你！', "You didn't come to karaoke last time. Everyone said they want to meet you!"]
  },

  'kuanhouli-5': {   // 小谢 · Split the bill
    open: [['哈哈，吃得太饱了！小苏去洗手间了。', "Haha, I'm so full! Xiao Su went to the restroom."], ['哎呀，太好吃了，吃多了！', "Oh man, that was so good, I ate too much!"]],
    steps: [
      { obj: 'kuanhouli-5-1', m: ['买单', '结账', '账单', '@price !每|一个人|各|平分|分开|aa'], say: [['服务员，买单！……一共三百六十块。哈哈，你请客？', "Waiter, the bill! …Three hundred sixty yuan in total. Haha, your treat?", { ask: {
        yes: ['真的假的？哈哈，开玩笑的！我们三个人一起付。', "Seriously? Haha, just kidding! The three of us will pay together."],
        no: ['哈哈，开玩笑的！', 'Haha, just kidding!'] } }]],
        card: { title: '宽厚里 · 账单', rows: [['羊肉串 ×40', '120元'], ['烤鸡翅 ×6', '36元'], ['炒饭 ×2', '30元'], ['啤酒 ×8', '64元'], ['烤鱼', '110元'], ['合计（3人）', '360元']] },
        try: ['服务员，买单！', '一共多少钱？'] },
      { obj: 'kuanhouli-5-2', m: ['aa', '平分', '分开 付|付钱|算', '各付各', '一起付', '一人一半'], say: [['好啊，我们三个人平分！你算算，一个人多少？', "Sure, the three of us split it evenly! You do the math: how much each?"]], try: ['我们AA制吧。', '我们平分吧！'] },
      { obj: 'kuanhouli-5-3', m: ['每个人|一个人|每人|人均 多少|{n}', '一百二'], say: [['三百六除以三……一个人一百二十块！我微信转给你。', "Three sixty divided by three… a hundred twenty each! I'll send you mine on WeChat."]], try: ['一个人一百二十块。', '每个人多少钱？'] },
      { obj: 'kuanhouli-5-4', m: ['打车|叫车|叫个车|叫辆车|出租车|滴滴|网约车', '回家 怎么|坐'], say: [['好！到家给我发个微信，哈哈！', "OK! Message me when you get home, haha!"]], try: ['我叫车回家。', '我打车回家吧。'] },
      { obj: 'kuanhouli-5-5', need: '*', m: ['@bye'], say: [['拜拜！下次我请你！', "Bye-bye! Next time it's on me!"]], try: ['再见！下次见！', '拜拜，下次再一起吃！'] }
    ],
    extra: [
      { m: ['好吃|吃饱'], say: [['哈哈，我也是！宽厚里的烤鱼太好吃了！', "Haha, me too! The grilled fish at Kuanhouli is amazing!"]] },
      { m: ['小苏'], say: [['他马上回来，我跟他说一个人一百二。', "He'll be right back. I'll tell him it's a hundred twenty each."]] }
    ],
    done: [['哈哈，今天太开心了！走吧！', "Haha, today was so much fun! Let's go!"]],
    words: [['买单', 'mǎidān', 'to pay the bill'], ['AA制', 'AA zhì', 'going Dutch, splitting the bill']],
    later: ['哈哈，上次说好了，这次我请你！', "Haha, like we agreed last time, this one's on me!"]
  }
});
