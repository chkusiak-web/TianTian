/* 趵突泉 Baotu Spring · HSK 1 · Greetings & basics */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'baotu-1': {   // 陈女士 · Buy a park ticket
    open: [['买票吗？', 'Buying a ticket?'], ['买票？', 'Ticket?']],
    steps: [
      { obj: 'baotu-1-1', m: ['@hi'], say: [['你好。', 'Hello.']], try: ['你好！', '您好！'] },
      { obj: 'baotu-1-2', m: ['@want 票|张 !多少|几块|几元', '一张 !多少|几块|几元|钱'], say: [['一张。好。', 'One. OK.'], ['好，一张。', 'OK, one.']], try: ['我要一张票。', '我买一张门票。'] },
      { obj: 'baotu-1-3', m: ['@price'], say: [['四十块。学生二十。', 'Forty yuan. Students twenty.']], card: { title: '趵突泉 · 门票', rows: [['成人票', '40元'], ['学生票', '20元'], ['开放时间', '7:00–18:00']] }, try: ['多少钱？', '一张多少钱？', '多少钱一张？'] },
      { obj: 'baotu-1-4', m: ['@pay', '这是 钱|四十|块', '给 {n} 块'], say: [['好。这是你的票。', "OK. Here's your ticket."]], try: ['给你四十块。', '我用微信付钱。'] },
      { obj: 'baotu-1-5', need: 'baotu-1-4', m: ['@thx', '@bye'], say: [['不客气。下一位！', "You're welcome. Next!"]], try: ['谢谢！再见！', '谢谢您！'] }
    ],
    extra: [
      { m: ['学生'], say: [['学生票二十块。有学生证吗？', 'Student tickets are twenty yuan. Do you have a student card?']] },
      { m: ['几点|开门|关门'], say: [['早上七点开门，晚上六点关门。', 'Opens at seven in the morning, closes at six in the evening.']] }
    ],
    done: [['……祝你玩得开心。', '…Have a nice visit.']],
    words: [['门票', 'ménpiào', 'admission ticket']],
    later: ['上次在趵突泉，是你吧？', 'Last time at Baotu Spring, that was you, right?']
  },

  'baotu-2': {   // 张老师 · Meet the tai chi teacher
    open: [['早上好！你也来打太极拳吗？', 'Good morning! Are you here for tai chi too?']],
    steps: [
      { obj: 'baotu-2-1', m: ['@hi'], say: [['你好！', 'Hello!'], ['早上好！', 'Good morning!']], try: ['你好！', '早上好！'] },
      { obj: 'baotu-2-2', m: ['{name}'], say: [['{name}，好名字！', '{name}, nice name!']], try: ['我叫大卫。', '我的名字是安娜。'] },
      { obj: 'baotu-2-3', m: ['叫什么', '贵姓', '姓什么', '名字是什么', '什么名字'], say: [['我姓张，你叫我张老师吧。', 'My surname is Zhang. Call me Teacher Zhang.']], try: ['您叫什么名字？', '您贵姓？'] },
      { obj: 'baotu-2-4', m: ['{country}', '我是 国人|人 !中国|学生|老师|医生', '我从 来', '我来自'], say: [['{country|是吗}？欢迎你来济南！', '{country|Really}? Welcome to Jinan!']], try: ['我是美国人。', '我是英国人。'] },
      { obj: 'baotu-2-5', m: ['认识 高兴', '很高兴认识', '幸会'], say: [['认识你我也很高兴！', "I'm glad to meet you too!"]], try: ['认识你很高兴！', '很高兴认识你！'] },
      { obj: 'baotu-2-6', need: '*', m: ['@bye'], say: [['再见！明天早上见！', 'Goodbye! See you tomorrow morning!']], try: ['再见！', '张老师，再见！'] }
    ],
    extra: [
      { m: ['太极'], say: [['太极拳很好！你想学吗？明天早上来吧。', 'Tai chi is great! Want to learn? Come tomorrow morning.']] },
      { m: ['几点'], say: [['我们每天早上六点在这儿。', "We're here every morning at six."]] }
    ],
    done: [['不错，不错！明天早上六点，我们一起打太极拳。', 'Very good! Tomorrow at six a.m., tai chi together.']],
    words: [['太极拳', 'tàijíquán', 'tai chi']],
    later: ['你还记得吗？我们在趵突泉打太极拳的时候认识的。', 'Do you remember? We met doing tai chi at Baotu Spring.']
  },

  'baotu-3': {   // 小谢 · Meet someone by the spring
    open: [['你好！可以帮我拍张照片吗？', 'Hi! Could you take a photo of me?', { ask: {
      yes: ['太好了！从这儿拍，要有泉水！', 'Great! Shoot from here, with the spring in it!', { obj: 'baotu-3-2' }],
      no: ['哦……好吧，没关系！', 'Oh… OK, no worries!'] } }]],
    steps: [
      { obj: 'baotu-3-1', m: ['@hi'], say: [['你好你好！', 'Hi, hi!']], try: ['你好！', '嗨，你好！'] },
      { obj: 'baotu-3-2', m: ['没问题', '当然', '好的', '好啊', '行', '我来|我帮', '可以 !微信 !吗'], say: [['谢谢！从这儿拍，要有泉水！……好了！太好看了！', "Thanks! From here, with the spring in it! …Done! It looks great!"]], try: ['没问题！', '好的，我帮你拍。'] },
      { obj: 'baotu-3-3', m: ['哪国人', '哪里人', '哪儿人', '从哪', '哪儿来', '哪里来'], say: [['我是济南人！就住在这儿。你呢？', "I'm from Jinan! I live right here. And you?"]], try: ['你是哪里人？', '你是哪国人？'] },
      { obj: 'baotu-3-4', m: ['{country}', '我是 国人|人 !济南|中国|学生', '我从 来', '我来自'], say: [['{country|哇}？真的假的！我想去{country|那儿}玩！', '{country|Wow}? Really? I want to visit {country|there}!']], try: ['我是美国人。', '我从加拿大来。'] },
      { obj: 'baotu-3-5', m: ['叫什么', '你的名字', '贵姓', '姓什么', '{name}'], say: [['我叫谢婷，叫我小谢就行！很高兴认识你！', "I'm Xie Ting, just call me Xiao Xie! Nice to meet you!"]], try: ['你叫什么名字？我叫大卫。', '我叫安娜，你呢？'] },
      { obj: 'baotu-3-6', m: ['微信'], say: [['好啊！我扫你吧。……好了！', "Sure! I'll scan yours. …Done!"]], try: ['我们加个微信吧！', '可以加微信吗？'] }
    ],
    extra: [
      { m: ['好看|漂亮|美'], say: [['哈哈，谢谢！趵突泉也很美吧？', 'Haha, thanks! Baotu Spring is beautiful too, right?']] },
      { m: ['工作|做什么'], say: [['我做市场工作，天天很忙！', "I work in marketing. Busy every day!"]] }
    ],
    done: [['哈哈，太好了！有空一起玩！', "Haha, great! Let's hang out sometime!"]],
    words: [['拍照', 'pāizhào', 'to take a photo'], ['微信', 'Wēixìn', 'WeChat']],
    later: ['哈哈，还记得吗？你在趵突泉给我拍的照片，我很喜欢！', 'Haha, remember? I love the photo you took of me at Baotu Spring!']
  },

  'baotu-4': {   // 张老师 · What does 趵突 mean?
    open: [['你看，这就是趵突泉的石碑。', "Look, this is Baotu Spring's stone tablet."]],
    steps: [
      { obj: 'baotu-4-1', m: ['请问', '打扰', '不好意思', '老师 !谢'], say: [['嗯？你说。', 'Yes? Go ahead.']], try: ['张老师，请问……', '请问一下。'] },
      { obj: 'baotu-4-2', m: ['什么意思', '意思', '是什么 趵突|这|泉'], say: [['你知道吗？“趵突”的意思是：水从下面往上跳。你听懂了吗？', 'Did you know? "Baotu" means: water jumping up from below. Did you understand?', { ask: {
        yes: ['不错，不错！', 'Very good!', { obj: 'baotu-4-3' }],
        no: ['没关系，慢慢来。', "No problem, take your time.", { obj: 'baotu-4-3' }] } }]], try: ['趵突泉是什么意思？', '“趵突”是什么意思？'] },
      { obj: 'baotu-4-3', need: 'baotu-4-2', m: ['懂了', '明白', '知道了', '听懂', '不懂', '没懂', '听不懂', '不明白', '不太懂'], say: [['好。', 'OK.']], try: ['我听懂了！', '我不太懂。'] },
      { obj: 'baotu-4-4', m: ['再说一遍', '再说一次', '慢一点', '慢点', '慢慢说'], say: [['好，我慢慢说：趵——突——。水——往——上——跳。', 'OK, slowly: Bao—tu. Water—jumps—up.']], try: ['请再说一遍。', '请您慢一点儿说。'] },
      { obj: 'baotu-4-5', need: 'baotu-4-2', m: ['@thx'], say: [['不客气！你很认真。不错，不错。', "You're welcome! You're very diligent. Good, good."]], try: ['谢谢您！', '谢谢张老师！'] }
    ],
    extra: [
      { m: ['几个泉|多少泉|多少个泉'], say: [['济南有七十二名泉！所以济南叫“泉城”。', 'Jinan has seventy-two famous springs! That\'s why it\'s called "City of Springs".']] }
    ],
    done: [['这叫“学而时习之”。下次我再考你！', 'This is called "learn and practice often". Next time I\'ll quiz you!']],
    words: [['意思', 'yìsi', 'meaning']],
    later: ['你还记得“趵突”是什么意思吗？', 'Do you still remember what "baotu" means?']
  },

  'baotu-5': {   // 王奶奶 · Fill your bottle at 黑虎泉
    open: [['孩子，你也来打水吗？', 'Child, are you here for water too?']],
    steps: [
      { obj: 'baotu-5-1', m: ['@hi'], say: [['你好，孩子！', 'Hello, child!']], try: ['奶奶好！', '您好！'] },
      { obj: 'baotu-5-2', m: ['能喝', '可以喝', '能不能喝', '干净'], say: [['能喝！泉水很干净，很好喝。', 'Yes! The spring water is very clean and tastes good.']], try: ['这个水能喝吗？', '泉水可以喝吗？'] },
      { obj: 'baotu-5-3', m: ['瓶子|水瓶|杯子|瓶 可以|能|行', '打水|接水|装水'], say: [['当然可以！来，孩子，慢慢来。', 'Of course! Come, child, take your time.']], try: ['我可以打水吗？', '我能用我的瓶子接水吗？'] },
      { obj: 'baotu-5-4', m: ['常常|经常|每天|多久|几次|常来|天天'], say: [['我天天来！每天早上六点。', 'I come every day! Six every morning.']], try: ['您常常来这儿吗？', '您每天都来吗？'] },
      { obj: 'baotu-5-5', need: 'baotu-5-2', m: ['@thx'], say: [['谢什么，孩子！', 'No need to thank me, child!']], try: ['谢谢奶奶！', '谢谢您！'] }
    ],
    extra: [
      { m: ['黑虎泉|老虎'], say: [['这是黑虎泉。你听，水声像老虎！', 'This is Black Tiger Spring. Listen, the water sounds like a tiger!']] },
      { m: ['好喝|甜'], say: [['是吧？泉水甜！', 'Right? Spring water is sweet!']] }
    ],
    done: [['孩子，多喝水！明天早上一起来吧！', 'Drink lots of water, child! Come with me tomorrow morning!']],
    words: [['泉水', 'quánshuǐ', 'spring water'], ['打水', 'dǎ shuǐ', 'to fetch water']],
    later: ['孩子，黑虎泉的水好喝吧？', 'Child, the Black Tiger Spring water was good, wasn\'t it?']
  }
});
