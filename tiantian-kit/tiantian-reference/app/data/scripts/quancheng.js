/* 泉城广场 Quancheng Square & Road · HSK 1–2 · Shopping & money */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'quancheng-1': {   // 林姐 · Get a SIM card
    open: [['欢迎光临！请问您需要什么？', 'Welcome! What can I help you with?'], ['您好，这里是手机柜台。请问您需要什么？', 'Hello, this is the phone counter. What can I help you with?']],
    steps: [
      { obj: 'quancheng-1-1', m: ['sim|电话卡|手机卡|新号|办卡|办张卡|一张卡 !多少|几块|价|一个月|每个月|能用|可以用'], say: [['好的，没问题。办卡需要护照，您带了吗？', 'Certainly. You need a passport to get a SIM card. Do you have it with you?', { ask: {
        yes: ['好的，请给我看一下……谢谢，没问题。', "Great, may I see it… thank you, that's fine.", { obj: 'quancheng-1-4' }],
        no: ['不好意思，办卡一定要护照。您再找找？', "Sorry, a passport is required for a SIM card. Could you check again?"] } }]], card: { title: '手机套餐', rows: [['小套餐', '30G 流量 · 200分钟'], ['中套餐', '60G 流量 · 500分钟'], ['大套餐', '100G 流量 · 1000分钟']] }, try: ['我想办一张电话卡。', '我要一张手机卡。'] },
      { obj: 'quancheng-1-2', m: ['@want|选|办 套餐|大的|中的|小的|便宜|流量|第一个|第二个|第三个 !多少|几块|价|吗|什么', '0g|0个g|0gb !多少|几块|价'], say: [['好的，这个套餐很多人用。', 'Very good, lots of people use that plan.'], ['好的，没问题。这个套餐很好。', 'Certainly. That one is a good plan.']], try: ['我要中套餐。', '我想要60G的。'] },
      { obj: 'quancheng-1-3', m: ['@price', '一个月 多少|几块', '每个月 多少|几块', '月租'], say: [['每个月的价格在这儿，您看一下。', "Here are the monthly prices, please take a look."]], card: { title: '套餐价格（每月）', rows: [['小套餐 · 30G', '59元'], ['中套餐 · 60G', '89元'], ['大套餐 · 100G', '129元'], ['手机卡', '免费']] }, try: ['一个月多少钱？', '每个月多少钱？'] },
      { obj: 'quancheng-1-4', m: ['护照 !吗|要不要|需要什么|需不需要|没带|没有', '带了|带来了 !没'], say: [['好的，谢谢。我看一下……没问题。', "Thank you. Let me take a look… that's fine."]], try: ['这是我的护照。', '给您我的护照。'] },
      { obj: 'quancheng-1-5', need: 'quancheng-1-2', m: ['@pay !护照|多少|几块|怎么', '刷卡'], say: [['好的……付好了，谢谢您！', 'Certainly… payment received. Thank you!']], try: ['我用微信付钱。', '我刷卡。'] },
      { obj: 'quancheng-1-6', need: 'quancheng-1-5', m: ['能用|可以用|好用|能打|打通|通了|信号|能上网|可以上网|试试|试一下|有网'], say: [['好的，我给您打一个……您的手机响了吧？可以用了！', 'Sure, let me call you… your phone is ringing, right? It works!']], try: ['现在能用吗？', '我试一下……可以用了！'] }
    ],
    extra: [
      { m: ['护照|证件'], say: [['要的，办卡一定要护照。', 'Yes, a passport is required for a SIM card.']] },
      { m: ['流量|分钟'], say: [['流量和分钟在这儿，您看一下。', 'The data and minutes are listed here, please take a look.']] },
      { m: ['号码 多少|是什么'], say: [['您的新号码在卡上，一八六开头的。', 'Your new number is on the card. It starts with 186.']] }
    ],
    done: [['您的号码可以用了。欢迎来济南！', 'Your number is working. Welcome to Jinan!']],
    words: [['护照', 'hùzhào', 'passport'], ['流量', 'liúliàng', 'mobile data']],
    later: ['新的手机号，用着还好吗？', 'How is your new phone number working out?']
  },

  'quancheng-2': {   // 林姐 · Buy clothes
    open: [['您好，欢迎光临！今天新到了很多衣服，请随便看看。', 'Hello, welcome! Lots of new clothes came in today. Feel free to look around.']],
    steps: [
      { obj: 'quancheng-2-1', m: ['衬衫|t恤|裤子|裙子|外套|毛衣|衣服|鞋子 @want|找|看|想 !多少|几块|号|颜色|试'], say: [['好的，这边请。这件怎么样？', 'Certainly, this way please. How about this one?'], ['好的，您看看这个，今年很多人买。', 'Of course. Take a look at this one. Lots of people bought it this year.']], try: ['我想买一件衬衫。', '我在找裤子。'] },
      { obj: 'quancheng-2-2', m: ['{size} 大号|中号|小号|l号|m号|s号|xl', '多大号|穿几号|穿什么号|尺码|尺寸|大一点|小一点|大一号|小一号', '我穿 l|m|s|xl'], say: [['有的。{size|您的号}，给您。', 'We do. Here it is in {size|your size}.']], card: { title: '尺码表', rows: [['S', '160/84'], ['M', '170/88'], ['L', '175/92'], ['XL', '180/96']] }, try: ['有没有大号的？', '我要M号。'] },
      { obj: 'quancheng-2-3', m: ['别的颜色|其他颜色|什么颜色|颜色', '{color} 色|有没有|的吗|红的|蓝的|白的|黑的|绿的|黄的|灰的|粉的 !试|多少'], say: [['有的。这是{color|蓝色}的，您看看。', 'We do. Here it is in {color|blue}, take a look.']], try: ['有别的颜色吗？', '有没有白色的？'] },
      { obj: 'quancheng-2-4', m: ['试一下|试试|试穿|试一试|能试|可以试|想试|穿一下|穿穿'], say: [['好的，试衣间在那边。……怎么样？合适吗？', 'Of course, the fitting room is over there. …How is it? Does it fit?']], try: ['我可以试一下吗？', '我想试试。'] },
      { obj: 'quancheng-2-5', m: ['合适|正好|不大不小|刚好|很舒服|很好|挺好|不错 !不合适|吗|太|有点', '大小 可以|好|不错'], say: [['太好了！您穿很好看。', 'Wonderful! It looks great on you.']], try: ['很合适！', '大小正好。'] },
      { obj: 'quancheng-2-6', need: 'quancheng-2-1', m: ['@want 这件|这条|这个|它 !试|多少|几块|吗', '买了|就要|就买|我买', '@pay !多少|几块|怎么', '买单|结账'], say: [['好的，一共一百九十九。请这边付款。……谢谢，欢迎再来！', 'Certainly, that comes to 199. Please pay over here. …Thank you, come again!']], try: ['我买这件。', '好，我要这件。'] }
    ],
    extra: [
      { m: ['太大|太小|有点大|有点小|有点儿大|有点儿小|不合适|大了|小了'], say: [['没关系，我给您换一件……这件呢？合适吗？', "No problem, let me get you another… how about this one? Does it fit?", { ask: {
        yes: ['太好了！您穿很好看。', 'Wonderful! It looks great on you.', { obj: 'quancheng-2-5' }],
        no: ['好的，我再给您找找。', "All right, I'll look for another one."] } }]] },
      { m: ['@price'], say: [['这件一百九十九。', 'This one is 199.']] },
      { m: ['试衣间|在哪'], say: [['试衣间在那边，请。', 'The fitting room is over there, please.']] }
    ],
    done: [['您的衣服，请拿好。欢迎下次光临！', 'Here are your clothes. We look forward to seeing you again!']],
    words: [['试', 'shì', 'to try (on)'], ['合适', 'héshì', 'to fit; suitable']],
    later: ['上次那件衣服，您穿着合适吗？', 'Does that piece of clothing from last time fit you well?']
  },

  'quancheng-3': {   // 王奶奶 · Bargain at the craft stall
    open: [['孩子，来看看！喜欢吗？', 'Child, come and look! Do you like them?'], ['孩子，你也来广场玩啊？来，看看奶奶的东西！', "Child, you came to the square too? Come, look at Grandma's things!"]],
    steps: [
      { obj: 'quancheng-3-1', m: ['什么 这|东西|做|那', '是什么'], say: [['这是中国结，奶奶自己做的！你看，像不像泉水？', "These are Chinese knots, Grandma made them herself! Look, don't they look like spring water?", { ask: {
        yes: ['对！奶奶叫它“泉水结”！', 'Right! Grandma calls it the "spring knot"!'],
        no: ['你看这儿……水往上跳！像了吧？', 'Look here… water jumping up! See it now?'] } }]], try: ['这是什么？', '您做的是什么？'] },
      { obj: 'quancheng-3-2', m: ['@price !便宜|少一点|少点|贵'], say: [['一个三十块。孩子，都是手做的！', 'Thirty yuan each. Child, they\'re all handmade!']], card: { title: '泉水结', rows: [['小的', '30元'], ['大的', '50元']] }, try: ['多少钱？', '一个多少钱？'] },
      { obj: 'quancheng-3-3', m: ['贵 !不贵|贵姓|多贵'], say: [['贵？孩子，奶奶做一个要一天呢！', 'Expensive? Child, it takes Grandma a whole day to make one!']], try: ['有点儿贵。', '太贵了！'] },
      { obj: 'quancheng-3-4', m: ['便宜 一点|点|些|吗|能|可以|吧', '块|元 可以吗|行吗|行不行|好吗|可不可以', '打折', '少一点|少点|少一些|少些|少收', '优惠', '折扣'], say: [['唉，好吧……给你二十五，行不行？', 'Sigh, fine… twenty-five for you. OK?', { ask: {
        yes: ['好！二十五！', 'Deal! Twenty-five!', { obj: 'quancheng-3-5' }],
        no: ['二十五，不能再少了！孩子，奶奶也要吃饭呀！', 'Twenty-five, I can\'t go any lower! Child, Grandma has to eat too!'] } }]], try: ['能便宜一点儿吗？', '便宜一点吧！'] },
      { obj: 'quancheng-3-5', need: 'quancheng-3-4', m: ['{n} 块|元|吧|行|可以|好', '好吧|行吧|成交|就这样|可以 !不|吗'], say: [['好吧，好吧，{n|二十五}块就{n|二十五}块！', 'Fine, fine, {n|25} yuan it is!']], try: ['二十五块，可以。', '好吧，就这样。'] },
      { obj: 'quancheng-3-6', need: 'quancheng-3-5', m: ['@pay !多少|几块|怎么', '给 块 !多少', '这是 钱|块'], say: [['{n|二十五}块，收到了。孩子，奶奶再送你一个小的！', "{n|25} yuan, got it. Child, Grandma's giving you a little one too!"]], try: ['给您钱。', '我用微信付。'] }
    ],
    extra: [
      { m: ['不像'], say: [['你看这儿……水往上跳！像了吧？', 'Look here… water jumping up! See it now?']] },
      { m: ['像'], say: [['对！奶奶叫它“泉水结”！', 'Right! Grandma calls it the "spring knot"!']] },
      { m: ['自己做|你做的|您做的|手做'], say: [['是啊，奶奶天天在家做！', 'Yes, Grandma makes them at home every day!']] },
      { m: ['漂亮|好看|喜欢'], say: [['喜欢就好！孩子，你的眼光真好。', 'If you like it, that\'s what matters! Child, you have good taste.']] },
      { m: ['大的'], say: [['大的五十，小的三十。', 'The big ones are fifty, the small ones thirty.']] }
    ],
    done: [['孩子，拿好！挂在家里，天天都有泉水！', 'Hold on to it, child! Hang it at home and you\'ll have spring water every day!']],
    words: [['便宜', 'piányi', 'cheap'], ['中国结', 'Zhōngguó jié', 'Chinese knot']],
    later: ['孩子，奶奶做的中国结，你挂起来了吗？', 'Child, did you hang up the Chinese knot Grandma made?']
  },

  'quancheng-4': {   // 林姐 · Return a shirt
    open: [['您好，这里是服务台。请问有什么可以帮您？', 'Hello, this is the service desk. How may I help you?']],
    steps: [
      { obj: 'quancheng-4-1', m: ['退货|换货|退换|退一下|换一下|退钱|退款', '退|换 衬衫|衣服|这件|这个', '想|能|可以|要 退|换'], say: [['好的，没问题。请问衣服有什么问题吗？', 'Certainly. May I ask what the problem with it is?']], try: ['我想换这件衬衫。', '这件衣服可以退吗？'] },
      { obj: 'quancheng-4-2', m: ['太小|有点小|有点儿小|小了|不合适|穿不下|太紧|有点紧|很紧|紧了|不够大'], say: [['明白了，太小了。请问您有小票吗？', 'I see, it\'s too small. Do you have the receipt?', { ask: {
        yes: ['好的，请给我看一下……没问题，三天以内可以退换。您要换一件吗？', 'Great, may I see it… that\'s fine. Returns and exchanges are allowed within three days. Would you like to exchange it?', { obj: 'quancheng-4-3', ask: {
          yes: ['好的，给您换一件大一号的。这样可以吗？', 'Certainly, I\'ll exchange it for one size up. Is that all right?', { obj: 'quancheng-4-4', ask: {
            yes: ['好的，办好了。请您拿好。', 'All done. Here you are.', { obj: 'quancheng-4-5' }], no: ['那您想怎么办？', 'Then what would you like to do?'] } }],
          no: ['好的，那给您退钱，退到您的微信。这样可以吗？', 'All right, then I\'ll refund you to your WeChat. Is that all right?', { obj: 'quancheng-4-4', ask: {
            yes: ['好的，办好了。请您拿好小票。', 'All done. Please keep your receipt.', { obj: 'quancheng-4-5' }], no: ['那您想怎么办？', 'Then what would you like to do?'] } }] } }],
        no: ['不好意思，没有小票不能退换。您再找找？', "Sorry, we can't do returns or exchanges without a receipt. Could you look again?"] } }]], try: ['衬衫太小了。', '这件我穿有点儿小。'] },
      { obj: 'quancheng-4-3', m: ['小票|收据|发票 !吗|要不要|没有|没带', '这是 票'], say: [['好的，我看一下……没问题，三天以内可以退换。您要换一件吗？', 'Let me take a look… that\'s fine. Returns and exchanges are allowed within three days. Would you like to exchange it?', { ask: {
        yes: ['好的，给您换一件大一号的。这样可以吗？', 'Certainly, I\'ll exchange it for one size up. Is that all right?', { obj: 'quancheng-4-4', ask: {
          yes: ['好的，办好了。请您拿好。', 'All done. Here you are.', { obj: 'quancheng-4-5' }], no: ['那您想怎么办？', 'Then what would you like to do?'] } }],
        no: ['好的，那给您退钱，退到您的微信。这样可以吗？', 'All right, then I\'ll refund you to your WeChat. Is that all right?', { obj: 'quancheng-4-4', ask: {
          yes: ['好的，办好了。请您拿好小票。', 'All done. Please keep your receipt.', { obj: 'quancheng-4-5' }], no: ['那您想怎么办？', 'Then what would you like to do?'] } }] } }]], try: ['给您小票。', '我有小票。'] },
      { obj: 'quancheng-4-4', need: 'quancheng-4-3', m: ['换 大|一件|个|新的|别的|{size}', '退钱|退款|退了|退吧|要退|想退', '换吧|换一下|我换|要换|想换'], say: [['好的，没问题，马上给您办。这样可以吗？', "Certainly, I'll take care of it right away. Is that all right?", { ask: {
        yes: ['好的，办好了。请您拿好。', 'All done. Here you are.', { obj: 'quancheng-4-5' }], no: ['那您想怎么办？', 'Then what would you like to do?'] } }]], try: ['我想换一件大号的。', '我要退钱。'] },
      { obj: 'quancheng-4-5', need: 'quancheng-4-4', m: ['好的|可以|行|没问题|就这样|明白 !不|吗', '好 !不|吗|你好|您好', '@thx'], say: [['好的，办好了。请您拿好。', 'All done. Here you are.']], try: ['好的，没问题。', '可以，谢谢！'] }
    ],
    extra: [
      { m: ['没有小票|没带小票|小票丢'], say: [['不好意思，没有小票不能退换。您再找找？', "Sorry, we can't do returns or exchanges without a receipt. Could you look again?"]] },
      { m: ['换'], say: [['好的，那给您换一件合适的。', "All right, I'll exchange it for one that fits."]] },
      { m: ['退'], say: [['好的，那给您退钱，退到您的微信。', "All right, I'll refund it to your WeChat."]] },
      { m: ['几天|多久'], say: [['三天以内可以退换。', 'Returns and exchanges are allowed within three days.']] }
    ],
    done: [['不客气，这是应该的。祝您购物愉快！', 'Not at all, it\'s our job. Enjoy your shopping!']],
    words: [['小票', 'xiǎopiào', 'receipt'], ['换', 'huàn', 'to exchange']],
    later: ['上次换的那件衬衫，合适吗？', 'Did that shirt you exchanged last time fit?']
  },

  'quancheng-5': {   // 林姐 · Buy a birthday gift
    open: [['您好，这边是茶叶和礼品，请随便看看。', 'Hello, this is our tea and gifts section. Feel free to look around.']],
    steps: [
      { obj: 'quancheng-5-1', m: ['生日', '礼物 !推荐|什么好|哪个好'], say: [['给朋友的生日礼物啊？好的。请问她喜欢什么？', "A birthday gift for a friend? Lovely. May I ask what she likes?"]], try: ['我想买一个生日礼物。', '我朋友过生日，我想买礼物。'] },
      { obj: 'quancheng-5-2', m: ['喜欢|爱 !什么|吗|你|您|哪个'], say: [['明白了。年轻的女孩子，我想想……', "I see. A young woman, let me think…"]], try: ['她喜欢喝茶。', '她很喜欢漂亮的东西。'] },
      { obj: 'quancheng-5-3', m: ['推荐', '送什么', '买什么好', '什么 好 !喜欢|吗', '哪个好', '有什么 !喜欢'], say: [['我推荐这个花茶礼盒，很漂亮，年轻人都喜欢。一百二十八元。要不要帮您包装一下？', 'I recommend this jasmine tea gift box. It\'s beautiful and young people love it. 128 yuan. Shall I gift-wrap it for you?', { ask: {
        yes: ['好的，用红色的纸，很漂亮。', 'Certainly, in red paper. Very pretty.', { obj: 'quancheng-5-4' }],
        no: ['好的。这个盒子不包装也很好看。', 'All right. This box looks nice even without wrapping.'] } }]], card: { title: '礼品', rows: [['花茶礼盒', '128元'], ['茶杯（一对）', '88元'], ['泉水明信片', '15元'], ['礼品包装', '免费']] }, try: ['您可以推荐一下吗？', '送什么好？'] },
      { obj: 'quancheng-5-4', m: ['包装', '包一下', '包起来', '包好', '礼品纸'], say: [['好的，没问题。用红色的纸，很漂亮。', 'Certainly. Red paper, very pretty.']], try: ['可以包装一下吗？', '请帮我包起来。'] },
      { obj: 'quancheng-5-5', need: 'quancheng-5-3', m: ['@pay !包|多少|几块|怎么', '买这个|要这个|就这个|买了|就要'], say: [['好的，一共一百二十八元。请扫这里……好了，谢谢您！', 'Certainly, 128 yuan in total. Please scan here… done, thank you!']], try: ['我买这个。', '我用微信付钱。'] },
      { obj: 'quancheng-5-6', need: 'quancheng-5-5', m: ['@thx'], say: [['不客气！祝您的朋友生日快乐！', "You're welcome! Happy birthday to your friend!"]], try: ['谢谢您！', '谢谢林姐！'] }
    ],
    extra: [
      { m: ['@price'], say: [['花茶礼盒一百二十八，茶杯八十八。', 'The tea gift box is 128, the cups are 88.']] },
      { m: ['小谢'], say: [['小谢？我认识她！她很喜欢花茶。', "Xiao Xie? I know her! She loves jasmine tea."]] }
    ],
    done: [['希望她喜欢！欢迎再来！', 'I hope she likes it! Please come again!']],
    words: [['礼物', 'lǐwù', 'gift'], ['包装', 'bāozhuāng', 'to wrap; packaging']],
    later: ['小谢喜欢那个礼物吗？', 'Did Xiao Xie like the gift?']
  }
});
