/* 芙蓉街 Furong Street · HSK 1 · Food & snacks */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'furong-1': {   // 孙师傅 · Buy a 煎饼
    open: [['朋友，来个煎饼？刚做的，好吃不贵！', 'Friend, a jianbing? Freshly made, tasty and cheap!'], ['煎饼！热的煎饼！朋友，来一个？', 'Jianbing! Hot jianbing! Friend, want one?']],
    steps: [
      { obj: 'furong-1-1', m: ['@hi'], say: [['来了！朋友，你好！', 'Coming! Hello, friend!'], ['你好你好！朋友，吃煎饼吗？', 'Hello, hello! Friend, having a jianbing?']], try: ['师傅好！', '你好！'] },
      { obj: 'furong-1-2', m: ['煎饼 @want !多少|几块|怎么卖|一共|什么', '{n} 个煎饼 !多少|几块|钱|怎么卖|一共'], say: [['好嘞！{n|一}个煎饼！朋友，要不要加鸡蛋？', 'Coming up! {n|1} jianbing! Friend, want an egg in it?', { ask: {
        yes: ['好，加鸡蛋！香菜要不要？', 'OK, egg it is! Cilantro or not?', { obj: 'furong-1-3', ask: {
          yes: ['好，多放香菜！', 'OK, extra cilantro!'],
          no: ['好，不要香菜！', 'OK, no cilantro!', { obj: 'furong-1-4' }] } }],
        no: ['不加？朋友，加个鸡蛋更好吃！', 'No egg? Friend, it tastes better with an egg!'] } }]], try: ['我要一个煎饼。', '师傅，来一个煎饼！'] },
      { obj: 'furong-1-3', m: ['加 蛋 !不加|别加|不要加|不要鸡蛋|不要蛋|不用加|多少|几块|钱', '鸡蛋 @want|放 !不加|不要鸡蛋|不放|多少|几块|钱'], say: [['好嘞，加鸡蛋！', 'You got it, egg!'], ['加鸡蛋，没问题！朋友，你懂吃！', 'Egg, no problem! Friend, you know your food!']], try: ['加一个鸡蛋。', '我要加鸡蛋。'] },
      { obj: 'furong-1-4', m: ['香菜 不要|不加|别|不吃|不用|不放|没有|去掉'], say: [['好，不要香菜！', 'OK, no cilantro!'], ['不要香菜？没问题！', 'No cilantro? No problem!']], try: ['不要香菜。', '我不吃香菜。'] },
      { obj: 'furong-1-5', m: ['多少钱|几块|几元|怎么卖|什么价|价钱|多贵|一共 !火腿|肠'], say: [['加鸡蛋，一个七块！{n|一}个煎饼，一共{n*7|七}块。好吃不贵！', 'With an egg, seven yuan each! {n|1} jianbing, {n*7|7} yuan in total. Tasty and cheap!']], card: { title: '孙师傅煎饼', rows: [['煎饼', '6元'], ['加鸡蛋', '1元'], ['加火腿肠', '2元']] }, try: ['多少钱？', '一共多少钱？'] },
      { obj: 'furong-1-6', need: 'furong-1-2', m: ['@pay !多少|几块|怎么', '给 块 !多少', '这是 钱|块'], say: [['好，{n*7|七}块，收到！朋友，小心，很热！', "OK, {n*7|7} yuan, got it! Careful, friend, it's hot!"]], try: ['给你七块。', '我用微信付钱。'] },
      { obj: 'furong-1-7', need: 'furong-1-6', m: ['@thx', '@bye'], say: [['不客气，朋友！好吃再来！', "You're welcome, friend! Come back if you like it!"]], try: ['谢谢师傅！', '谢谢！再见！'] }
    ],
    extra: [
      { m: ['火腿|肠'], say: [['加火腿肠两块！朋友，要不要加？', 'Sausage is two yuan extra! Friend, want some?', { ask: {
        yes: ['好嘞，加火腿肠！', 'You got it, sausage!'], no: ['好，下次加！', 'OK, next time!'] } }]] },
      { m: ['辣|酱'], say: [['我的酱有一点儿辣，很香！', 'My sauce is a little spicy, very fragrant!']] },
      { m: ['好吃|香'], say: [['哈哈，好吃不贵！', 'Haha, tasty and cheap!']] }
    ],
    done: [['朋友，趁热吃！明天再来！', 'Friend, eat it while it\'s hot! Come again tomorrow!']],
    words: [['煎饼', 'jiānbing', 'savory crepe'], ['香菜', 'xiāngcài', 'cilantro']],
    later: ['朋友，上次的煎饼好吃吧？', 'Friend, that jianbing last time was good, right?']
  },

  'furong-2': {   // 孙师傅 · Buy 油旋
    open: [['朋友，看！刚出锅的油旋！', 'Friend, look! Youxuan, fresh out of the pan!'], ['油旋！热的油旋！朋友，看看！', 'Youxuan! Hot youxuan! Take a look, friend!']],
    steps: [
      { obj: 'furong-2-1', m: ['油旋 什么|啥', '什么是油旋', '这 什么|啥 !多少|几块|钱|里'], say: [['油旋是济南有名的小吃，很香！朋友，你吃过吗？', "Youxuan is a famous Jinan snack. It smells so good! Friend, have you had it before?", { ask: {
        yes: ['哈哈，那你知道！好吃不贵！', 'Haha, then you know! Tasty and cheap!'],
        no: ['没吃过？那今天一定要吃一个！', "Never had it? Then you have to try one today!"] } }]], try: ['油旋是什么？', '这是什么？'] },
      { obj: 'furong-2-2', m: ['@price', '一个 多少|几块'], say: [['三块一个！好吃不贵！', 'Three yuan each! Tasty and cheap!'], ['一个三块，朋友！', 'Three yuan each, friend!']], card: { title: '孙师傅 · 价目表', rows: [['油旋', '3元/个'], ['甜沫', '4元/碗'], ['豆浆', '2元/杯']] }, try: ['一个多少钱？', '油旋怎么卖？'] },
      { obj: 'furong-2-3', m: ['{n} 油旋 !多少|几块|钱|怎么卖|一共', '@want {n} 个 !多少|几块|钱|袋|怎么卖|一共|吗|哪|那|药'], say: [['好嘞！{n}个油旋，一共{n*3}块！', 'Coming up! {n} youxuan, {n*3} yuan in total!'], ['{n}个！好嘞！一共{n*3}块，朋友！', '{n}! You got it! {n*3} yuan in total, friend!']], try: ['我要三个油旋。', '给我两个。'] },
      { obj: 'furong-2-4', m: ['袋子|塑料袋|个袋|一袋', '打包', '包起来', '包一下', '装起来|装一下'], say: [['没问题，给你装好了！', "No problem, I've bagged them for you!"]], try: ['给我一个袋子，好吗？', '可以给我一个袋子吗？'] },
      { obj: 'furong-2-5', need: 'furong-2-3', m: ['@pay !多少|几块|怎么', '给 块 !多少', '这是 钱|块'], say: [['{n*3|好}块，收到！朋友，趁热吃！', "{n*3|OK}, got it! Eat them while they're hot, friend!"]], try: ['我用微信付钱。', '给你钱。'] }
    ],
    extra: [
      { m: ['没吃过|没有吃过|没吃'], say: [['没吃过？那今天一定要吃一个！', 'Never had it? Then you have to try one today!']] },
      { m: ['吃过'], say: [['哈哈，那你知道！好吃不贵！', 'Haha, then you know! Tasty and cheap!']] },
      { m: ['好吃|香'], say: [['哈哈，是吧？好吃不贵！', 'Haha, right? Tasty and cheap!']] },
      { m: ['甜沫|豆浆'], say: [['要不要加一碗甜沫？朋友，很好喝！', 'Want to add a bowl of tianmo? Friend, it\'s really good!']] }
    ],
    done: [['朋友，好吃再来！', 'Friend, if you like them, come back!']],
    words: [['油旋', 'yóuxuán', 'flaky scallion pastry'], ['袋子', 'dàizi', 'bag']],
    later: ['朋友！上次的油旋，好吃吧？', 'Friend! Those youxuan last time were good, right?']
  },

  'furong-3': {   // 王奶奶 · Breakfast with 王奶奶
    open: [['孩子，坐这儿！今天奶奶请你喝甜沫。', "Sit here, child! Today Grandma's treating you to tianmo."], ['孩子，来，坐！奶奶请你吃早饭。', "Come sit, child! Grandma's treating you to breakfast."]],
    steps: [
      { obj: 'furong-3-1', m: ['@hi'], say: [['早上好，孩子！', 'Good morning, child!'], ['早，早！孩子，吃了吗？', "Morning, morning! Have you eaten, child?"]], try: ['奶奶，早上好！', '早上好！'] },
      { obj: 'furong-3-2', m: ['甜沫 什么|啥 !里|做|放|加', '什么是甜沫', '这 什么|啥 !里|做|放|加'], say: [['甜沫是济南人的早饭。叫“甜”，可是不甜！哈哈。', 'Tianmo is a Jinan breakfast. It\'s called "sweet", but it isn\'t sweet! Haha.']], try: ['甜沫是什么？', '这是什么？'] },
      { obj: 'furong-3-3', m: ['里 什么|啥', '什么 做|放|加', '有什么 东西', '用什么'], say: [['里面有米、豆腐、菜，还有胡椒，有一点儿辣。孩子，你吃辣吗？', "There's grain, tofu, vegetables and pepper in it, so it's a little spicy. Do you eat spicy food, child?", { ask: {
        yes: ['好！那奶奶给你多放点儿胡椒。', "Good! Then Grandma will add more pepper for you.", { obj: 'furong-3-4' }],
        no: ['好，好，给你少放一点儿。', "OK, OK, I'll put in just a little.", { obj: 'furong-3-4' }] } }]], try: ['甜沫里有什么？', '里面是什么？'] },
      { obj: 'furong-3-4', m: ['吃辣|辣的|不辣|怕辣|很辣|太辣|有点辣|有点儿辣|喜欢辣|爱辣|能辣 !吗|辣不辣', '能吃|爱吃|不吃|吃不了 !吗|过|饱|好吃|什么|东西|早饭'], say: [['好，奶奶记住了！来，甜沫好了，快尝尝！', "OK, Grandma will remember! Here, the tianmo's ready. Have a taste!"]], try: ['我喜欢吃辣的。', '我不能吃辣。'] },
      { obj: 'furong-3-5', need: 'furong-3-2', m: ['好吃|好喝|真香|很香|太香 !吗|不好吃|不好喝'], say: [['好喝吧？孩子，多喝一点儿！', 'Good, right? Have some more, child!'], ['好吃就多吃！孩子，慢慢来。', "If it's good, eat more! Take your time, child."]], try: ['真好吃！', '甜沫很好喝！'] },
      { obj: 'furong-3-6', need: 'furong-3-2', m: ['@thx', '请客'], say: [['谢什么，孩子！奶奶高兴！', "No need to thank me, child! It makes Grandma happy!"]], try: ['谢谢奶奶请客！', '谢谢您！'] }
    ],
    extra: [
      { m: ['辣吗|辣不辣'], say: [['有一点儿辣。孩子，你吃辣吗？', 'A little spicy. Do you eat spicy food, child?', { ask: {
        yes: ['好！那奶奶给你多放点儿胡椒。', 'Good! Then Grandma will add more pepper for you.', { obj: 'furong-3-4' }],
        no: ['好，好，给你少放一点儿。', "OK, OK, I'll put in just a little.", { obj: 'furong-3-4' }] } }]] },
      { m: ['钱|@pay|我请'], say: [['孩子，不用！今天奶奶请客！', "No need, child! Grandma's treating today!"]] },
      { m: ['饱'], say: [['饱了？再吃一个包子吧！', 'Full? Have one more baozi!']] }
    ],
    done: [['孩子，吃饱了吗？明天早上还来，奶奶请你！', "Are you full, child? Come again tomorrow morning. Grandma's treat!"]],
    words: [['甜沫', 'tiánmò', 'savory millet porridge (Jinan)'], ['胡椒', 'hújiāo', 'pepper']],
    later: ['孩子，那天的甜沫好喝吧？', 'Child, the tianmo that day was good, wasn\'t it?']
  },

  'furong-4': {   // 小谢 · 把子肉 lunch
    open: [['哈哈，我饿死了！走吧，进去！你看，菜都在这儿！', "Haha, I'm starving! Let's go in! Look, all the dishes are right here!"], ['走吧！这家的把子肉，济南第一！我饿死了！', "Let's go! This place has the best bazi rou in Jinan! I'm starving!"]],
    steps: [
      { obj: 'furong-4-1', m: ['把子肉 什么|啥', '什么是把子肉'], say: [['真的假的？你没吃过？把子肉就是大块的肉，配米饭，济南人都爱吃！', "Seriously? You've never had it? Bazi rou is big pieces of braised pork with rice. Everyone in Jinan loves it!"]], card: { title: '把子肉 · 菜单', rows: [['把子肉', '8元/块'], ['米饭', '2元/碗'], ['鸡蛋', '2元/个'], ['豆腐', '3元'], ['青菜', '4元'], ['可乐', '3元/瓶']] }, try: ['把子肉是什么？', '什么是把子肉？'] },
      { obj: 'furong-4-2', m: ['把子肉 @want|吃|一块|一份 !什么|啥', '@want|吃 肉|米饭 !什么|啥|喝'], say: [['好！我也要把子肉！我们再点两个菜吧？要不要豆腐和鸡蛋？', "Great! I'll have bazi rou too! Let's get two sides as well? How about tofu and egg?", { ask: {
        yes: ['走吧！豆腐、鸡蛋，好了！', "Let's go! Tofu and egg, done!", { obj: 'furong-4-3' }],
        no: ['哈哈，那你说，要什么菜？', 'Haha, then you pick. Which sides?'] } }]], try: ['我想吃把子肉。', '我要一块把子肉和米饭。'] },
      { obj: 'furong-4-3', m: ['鸡蛋|豆腐|青菜|土豆|茄子|豆角|两个菜|配菜'], say: [['没问题！两个菜，我们一起吃！', "No problem! Two sides, we'll share!"], ['好啊！就这两个！哈哈，我饿死了！', "Sure! Those two! Haha, I'm starving!"]], try: ['我们要豆腐和青菜吧。', '我想要鸡蛋和豆腐。'] },
      { obj: 'furong-4-4', m: ['喝 什么|啥', '你 要喝|想喝|喝不喝'], say: [['我要一瓶可乐！冰的！你呢？', "I'll have a cola! Ice cold! What about you?"]], try: ['你想喝什么？', '你要喝什么？'] },
      { obj: 'furong-4-5', need: 'furong-4-2', m: ['请客', '我请', '我来 付|买单|结账', '我 付|买单|结账'], say: [['真的假的？哈哈，谢谢！那下次我请你吃烤串！', "Seriously? Haha, thanks! Then next time I'm treating you to barbecue skewers!"]], try: ['今天我来请客！', '我请你吧！'] }
    ],
    extra: [
      { m: ['我 喝|要 {drink}'], say: [['{drink|好}，我去拿！', "{drink|OK}, I'll go grab it!"]] },
      { m: ['饿'], say: [['哈哈，我也饿死了！快点菜吧！', "Haha, I'm starving too! Let's order already!"]] },
      { m: ['好吃|香'], say: [['是吧？我跟你说过，济南第一！', 'Right? I told you, best in Jinan!']] }
    ],
    done: [['哈哈，太好了！来，吃吧！我饿死了！', "Haha, awesome! Come on, let's eat! I'm starving!"]],
    words: [['把子肉', 'bǎziròu', 'braised pork belly (Jinan dish)'], ['请客', 'qǐngkè', 'to treat (pay for others)']],
    later: ['哈哈，上次的把子肉太好吃了！谢谢你请客！', 'Haha, that bazi rou last time was so good! Thanks for treating me!']
  },

  'furong-5': {   // 孙师傅 · What's famous here?
    open: [['朋友，看看我的菜单！什么都有！', 'Friend, check out my menu! I have everything!'], ['朋友，今天吃点儿什么？我这儿什么都好吃！', 'Friend, what are you having today? Everything here is delicious!']],
    steps: [
      { obj: 'furong-5-1', m: ['有名', '出名', '最好吃', '什么 好吃 !吗', '推荐', '特色', '招牌'], say: [['最有名的是草包包子！济南人都知道！', 'The most famous is Caobao baozi! Everyone in Jinan knows it!']], card: { title: '孙师傅小吃 · 菜单', rows: [['草包包子', '2元/个'], ['油旋', '3元/个'], ['甜沫', '4元/碗'], ['煎饼', '6元/个'], ['把子肉', '8元/份']] }, try: ['这儿什么最有名？', '什么最好吃？'] },
      { obj: 'furong-5-2', m: ['辣吗|甜吗|辣不辣|甜不甜|辣还是|甜还是|辣的还是|甜的还是 !要|想吃|来'], say: [['包子不辣也不甜，里面是肉，很香！朋友，要不要尝一个？', "The baozi aren't spicy or sweet. There's meat inside, so tasty! Friend, want to try one?", { ask: {
        yes: ['来，朋友，尝尝！怎么样？好吃不贵！', "Here, friend, try it! How is it? Tasty and cheap!"],
        no: ['好，你看菜单，慢慢选！', 'OK, look at the menu and take your time!'] } }]], try: ['包子辣吗？', '是辣的还是甜的？'] },
      { obj: 'furong-5-3', m: ['@want {n} 个|碗|份 !多少|几块|钱|怎么卖|吗|哪|那|药|晚|分钟', '@want 包子|油旋|甜沫|煎饼|把子肉 !多少|几块|钱|吗|什么|辣|甜'], say: [['好嘞！马上来！朋友，坐这儿等一下！', 'Coming right up! Friend, have a seat and wait a moment!']], try: ['我要五个包子。', '给我一碗甜沫和两个油旋。'] },
      { obj: 'furong-5-4', need: 'furong-5-3', m: ['微信', '扫码|扫一下|扫一扫', '支付宝'], say: [['好嘞！扫这儿……收到了！', 'You got it! Scan here… received!']], try: ['我用微信付钱。', '可以用微信吗？'] },
      { obj: 'furong-5-5', need: '*', m: ['好吃|香|不错|好喝 !吗|不好吃|不好喝', '@bye'], say: [['哈哈，好吃不贵！朋友，慢走，下次再来！', 'Haha, tasty and cheap! Take care, friend. Come again!']], try: ['太好吃了！再见！', '很好吃，谢谢！拜拜！'] }
    ],
    extra: [
      { m: ['现金|给你钱|给您钱|刷卡'], say: [['现金？朋友，我没零钱！用微信，行不行？', "Cash? Friend, I don't have change! How about WeChat?", { ask: {
        yes: ['好嘞！扫这儿……收到了！', 'You got it! Scan here… received!', { obj: 'furong-5-4' }],
        no: ['好吧，好吧，我找找零钱……', "Fine, fine, let me look for some change…"] } }]] },
      { m: ['好吃|香'], say: [['哈哈，是吧？好吃不贵！', 'Haha, right? Tasty and cheap!']] },
      { m: ['草包|包子 什么'], say: [['草包包子，济南的老字号！一百多年了！', 'Caobao baozi: an old Jinan brand! Over a hundred years old!']] }
    ],
    done: [['朋友，你现在是济南人了！哈哈！', "Friend, you're a real Jinan local now! Haha!"]],
    words: [['有名', 'yǒumíng', 'famous'], ['扫码', 'sǎomǎ', 'to scan a QR code']],
    later: ['朋友！草包包子好吃吧？', 'Friend! The Caobao baozi were good, right?']
  }
});
