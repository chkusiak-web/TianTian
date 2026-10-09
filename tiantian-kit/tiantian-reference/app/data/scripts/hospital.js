/* 山东省立医院 Shandong Provincial Hospital · HSK 3 · Health */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'hospital-1': {   // 小苏 · Register (挂号)
    open: [['我今天在医院当志愿者。那个……你需要帮忙吗？', "I'm volunteering at the hospital today. Um… do you need help?"], ['这儿是服务台，我是志愿者。你怎么了？', "This is the help desk, I'm a volunteer. What's wrong?"]],
    steps: [
      { obj: 'hospital-1-1', m: ['看病', '看医生|看大夫|看一下医生|找医生|见医生', '挂号'], say: [['好的，我帮你挂号。你是第一次来这个医院吗？', "OK, I'll help you register. Is this your first time at this hospital?", { ask: {
        yes: ['那我先帮你办一张就诊卡。你哪儿不舒服？', "Then I'll get you a patient card first. What's bothering you?"],
        no: ['好，那你哪儿不舒服？', "OK, so what's bothering you?"] } }]], try: ['我想看医生。', '我要挂号。'] },
      { obj: 'hospital-1-2', m: ['头疼|头痛|肚子疼|嗓子疼|发烧|感冒|咳嗽|不舒服|拉肚子|疼|痛|过敏|难受|头晕'], say: [['真的吗？哎呀，你要多喝水，好好休息！', "Really? Oh no, you need to drink lots of water and rest!"]], try: ['我头疼，还有点儿发烧。', '我肚子不舒服。'] },
      { obj: 'hospital-1-3', m: ['哪个科|什么科|几科|哪科|科室', '挂 哪个|什么|哪', '看 哪个|什么 医生|大夫'], say: [['你这个要挂内科。白大夫今天在，她很好！', "For that you should register with Internal Medicine. Dr. Bai is in today, she's great!"]], try: ['我应该挂哪个科？', '我要看什么科？'] },
      { obj: 'hospital-1-4', m: ['{name}', '护照', '证件'], say: [['好，我看一下你的护照……挂好了！这是你的挂号单。', "OK, let me see your passport… you're registered! Here's your registration slip."]],
        card: { title: '挂号单', rows: [['姓名', '{name|——}'], ['科室', '内科'], ['医生', '白大夫'], ['诊室', '2楼 205'], ['号码', '18号']] },
        try: ['我叫大卫，这是我的护照。', '给你我的护照。'] },
      { obj: 'hospital-1-5', m: ['@where !哪个科|什么科|哪科', '几楼', '往哪'], say: [['坐电梯到二楼，往左走，二〇五诊室。别担心，我带你去！', "Take the elevator to the second floor, turn left, Room 205. Don't worry, I'll take you there!"]],
        try: ['内科在哪儿？', '我应该去哪儿？'] }
    ],
    extra: [
      { m: ['@price', '挂号费'], say: [['挂号费二十块，用微信付就行。', 'The registration fee is twenty yuan. You can just pay with WeChat.']] },
      { m: ['志愿者|你在这儿'], say: [['我每个星期六来这儿帮忙。太酷了，对吧？', "I come help here every Saturday. Pretty cool, right?"]] }
    ],
    done: [['祝你早日康复！……这个“早日康复”用英语怎么说？', 'Wishing you a quick recovery! …How do you say 早日康复 in English?']],
    words: [['挂号', 'guàhào', 'to register (at a hospital)'], ['护照', 'hùzhào', 'passport']],
    later: ['上次在医院，你现在身体好点儿了吗？', 'About last time at the hospital: are you feeling better now?']
  },

  'hospital-2': {   // 白大夫 · See the doctor
    open: [['请坐。嗯……我们是不是在千佛山见过？好，今天哪儿不舒服？', "Please sit. Hm… haven't we met on Qianfo Mountain? OK, what's bothering you today?"]],
    steps: [
      { obj: 'hospital-2-1', m: ['头疼|头痛|肚子疼|嗓子疼|咳嗽|感冒|拉肚子|不舒服|疼|痛|难受|头晕|流鼻涕|想吐 !过敏'], say: [['嗯。别着急。这样多长时间了？', "Mm. Don't worry. How long has it been like this?"]], try: ['我头疼，嗓子也疼。', '我肚子很不舒服。'] },
      { obj: 'hospital-2-2', m: ['{n} 天|个星期|星期|个月|小时', '昨天|前天|上个星期|上星期|今天早上|开始'], say: [['好，知道了。你发烧吗？', 'OK, I see. Do you have a fever?', { ask: {
        yes: ['我量一下……三十七度八，有一点儿发烧。你对什么药过敏吗？', "Let me take your temperature… 37.8, a slight fever. Are you allergic to any medicine?", { obj: 'hospital-2-3', ask: {
          yes: ['好，告诉我对什么过敏，我记下来。', "OK, tell me what you're allergic to and I'll note it down.", { obj: 'hospital-2-4' }],
          no: ['好，不过敏。', 'OK, no allergies.', { obj: 'hospital-2-4' }] } }],
        no: ['我量一下……三十六度八，不发烧。你对什么药过敏吗？', "Let me take your temperature… 36.8, no fever. Are you allergic to any medicine?", { obj: 'hospital-2-3', ask: {
          yes: ['好，告诉我对什么过敏，我记下来。', "OK, tell me what you're allergic to and I'll note it down.", { obj: 'hospital-2-4' }],
          no: ['好，不过敏。', 'OK, no allergies.', { obj: 'hospital-2-4' }] } }] } }]],
        try: ['两天了。', '从昨天开始。'] },
      { obj: 'hospital-2-3', m: ['发烧|发热', '体温', '{n} 度', '不烧|没烧'], say: [['我量一下……三十七度二，不太高。你对什么药过敏吗？', "Let me check… 37.2, not too high. Are you allergic to any medicine?", { ask: {
        yes: ['好，告诉我对什么过敏，我记下来。', "OK, tell me what you're allergic to and I'll note it down.", { obj: 'hospital-2-4' }],
        no: ['好，不过敏。', 'OK, no allergies.', { obj: 'hospital-2-4' }] } }]],
        try: ['我有点儿发烧。', '我不发烧。'] },
      { obj: 'hospital-2-4', m: ['过敏'], say: [['好，我记下了。我看看……问题不大，别着急。', "OK, I've noted that. Let me take a look… nothing serious, don't worry."]], try: ['我对青霉素过敏。', '我对药不过敏。'] },
      { obj: 'hospital-2-5', m: ['怎么办', '应该 做|怎么|吃', '要不要|要|用不用|用 吃药|打针|住院', '吃什么药', '吃药 吗', '需要 吃药|打针|住院|做什么'], say: [['多喝水，多休息。我给你开点儿药，三天以后还不好，再来找我。', "Drink lots of water and rest. I'll prescribe you some medicine. If you're not better in three days, come see me again."]], try: ['我应该怎么办？', '我需要吃药吗？'] },
      { obj: 'hospital-2-6', need: 'hospital-2-1', m: ['@thx'], say: [['不客气。多喝水，多休息。', "You're welcome. Drink lots of water and get plenty of rest."]], try: ['谢谢大夫！', '谢谢您，白大夫。'] }
    ],
    extra: [
      { m: ['见过|千佛山|爬山'], say: [['我就说嘛！我周末常去爬千佛山。好，说说你哪儿不舒服。', "I knew it! I often hike Qianfo Mountain on weekends. OK, tell me what's wrong."]] },
      { m: ['严重|没事吧|要紧'], say: [['别着急，不严重。', "Don't worry, it's not serious."]] }
    ],
    done: [['好了。别着急，过几天就好了。下次千佛山见！', "All done. Don't worry, you'll be fine in a few days. See you on Qianfo Mountain!"]],
    words: [['发烧', 'fāshāo', 'to have a fever'], ['过敏', 'guòmǐn', 'to be allergic']],
    later: ['上次你来看病，现在好点儿了吗？', 'You came to see me last time. Are you feeling better now?']
  },

  'hospital-3': {   // 白大夫 · Your medicine
    open: [['这是你的药。别着急，我们一个一个看。', "Here's your medicine. Don't worry, we'll go through it one by one."]],
    steps: [
      { obj: 'hospital-3-1', m: ['治什么|治', '什么药', '干什么的|做什么的|什么用|是什么', '为什么 吃'], say: [['这是感冒药，治头疼和嗓子疼。白色的是退烧药，发烧的时候才吃。', "This is cold medicine, for headache and sore throat. The white one is for fever; only take it when you have a fever."]],
        card: { title: '处方 · 白大夫', rows: [['感冒药', '一天三次 · 一次两片 · 饭后'], ['退烧药（白色）', '发烧时吃 · 一次一片'], ['用药时间', '三天']] },
        try: ['这是什么药？', '这个药是治什么的？'] },
      { obj: 'hospital-3-2', m: ['几次', '一天 多少|几', '怎么吃', '几片|吃多少'], say: [['一天三次，一次两片。', 'Three times a day, two tablets each time.']], try: ['一天吃几次？', '一次吃几片？'] },
      { obj: 'hospital-3-3', m: ['饭前|饭后|吃饭以前|吃饭以后|吃饭前|吃饭后|空腹', '吃饭 前|后|以前|以后'], say: [['饭后吃。吃完饭再吃药，别空着肚子吃。明白了吗？', "After meals. Eat first, then take the medicine; not on an empty stomach. Is that clear?", { ask: {
        yes: ['很好。', 'Good.'],
        no: ['我再说一遍：先吃饭，再吃药。', "I'll say it again: eat first, then take the medicine."] } }]],
        try: ['饭前吃还是饭后吃？', '吃饭以前吃吗？'] },
      { obj: 'hospital-3-4', m: ['副作用', '不好的|有问题|危险|不舒服', '会 困|想睡觉|头晕', '酒|开车'], say: [['可能会有点儿困，所以别开车，也别喝酒。', "It might make you a bit sleepy, so don't drive, and don't drink alcohol."]], try: ['这个药有副作用吗？', '吃了这个药可以开车吗？'] },
      { obj: 'hospital-3-5', need: 'hospital-3-1', m: ['@thx'], say: [['不客气。按时吃药，多喝水，多休息。', "You're welcome. Take your medicine on time, drink lots of water and rest."]], try: ['谢谢白大夫！', '谢谢您！'] }
    ],
    extra: [
      { m: ['@price', '交钱|交费'], say: [['先去一楼交费，然后在药房拿药。', 'Pay at the first floor first, then pick up the medicine at the pharmacy.']] },
      { m: ['几天|多久|多长时间'], say: [['先吃三天。三天以后还不好，再来找我。', 'Take it for three days first. If you are not better after three days, come see me again.']] }
    ],
    done: [['好了，回家好好休息。有问题给我打电话。', 'All right, go home and rest well. Call me if there is any problem.']],
    words: [['副作用', 'fùzuòyòng', 'side effect'], ['饭后', 'fànhòu', 'after meals']],
    later: ['药按时吃了吗？饭后吃，别忘了。', "Have you been taking your medicine on time? After meals, don't forget."]
  },

  'hospital-4': {   // 吕老师 · Call in sick (phone)
    greet: [],   // phone/text: no in-person greeting
    open: [['（电话里）喂？是你啊。怎么了？', '(On the phone) Hello? Oh, it\'s you. What\'s up?'], ['（电话）喂，你好？', '(Phone) Hello?']],
    steps: [
      { obj: 'hospital-4-1', m: ['@hi', '喂'], say: [['你好！你的声音不太好，怎么了？', "Hello! You don't sound so good. What's wrong?"]], try: ['喂，吕老师好！', '老师，您好！'] },
      { obj: 'hospital-4-2', m: ['生病|病了|不舒服|感冒|发烧|头疼|肚子疼|咳嗽|难受|去医院|看病'], say: [['哎呀，生病了？没关系，身体最重要。看医生了吗？', 'Oh dear, you\'re sick? Don\'t worry, your health comes first. Have you seen a doctor?']], try: ['老师，我生病了。', '我感冒了，还发烧。'] },
      { obj: 'hospital-4-3', m: ['不能 来|去|上课', '来不了|去不了|上不了课', '请假', '请 假', '今天 不来|不去|不上课|没办法'], say: [['好，我知道了。今天你好好休息。', "OK, I understand. Rest well today."]], try: ['我今天不能去上课。', '老师，我想请一天假。'] },
      { obj: 'hospital-4-4', m: ['作业'], say: [['作业是第十三课的练习，课本第九十页。你现在能写吗？', 'The homework is the exercises for Lesson 13, page 90 in the textbook. Can you do it now?', { ask: {
        yes: ['好，不着急，写完了下次给我。', "OK, no rush. Give it to me next time when it's done."],
        no: ['没关系，先休息，好了以后再写。', "That's fine. Rest first, and do it after you're better."] } }]],
        try: ['今天的作业是什么？', '老师，有作业吗？'] },
      { obj: 'hospital-4-5', m: ['{day} 来|回|上课|去学校 !不能|不来|来不了|去不了|不去|请假|不上', '好了 以后|就', '过 {n} 天', '{n} 天以后'], say: [['好，{day|过几天}见。别着急，好好休息！', "OK, see you {day|in a few days}. Don't rush, rest well!"]], try: ['我明天来上课。', '我星期三回学校。'] }
    ],
    extra: [
      { m: ['看了|去了|医生说|开了药|吃药'], say: [['那就好。按时吃药，多喝水。', 'Good. Take your medicine on time and drink lots of water.']] },
      { m: ['对不起|不好意思'], say: [['没关系，身体最重要。', "It's OK, your health comes first."]] }
    ],
    done: [['好，那你好好休息。有问题给我发微信。', 'OK, rest well then. Message me on WeChat if you have questions.']],
    words: [['请假', 'qǐngjià', 'to ask for time off'], ['生病', 'shēngbìng', 'to fall ill']],
    later: ['你身体好了吗？上次你生病，同学们都很担心。', "Are you feeling better? When you were sick last time, your classmates were all worried."]
  },

  'hospital-5': {   // 老潘 · Emergency ride (urgent phone call)
    greet: [],   // phone/text: no in-person greeting
    open: [['（电话）喂？哎，是你啊！怎么了？', "(Phone) Hello? Hey, it's you! What's up?"]],
    steps: [
      { obj: 'hospital-5-1', m: ['着急|急事|紧急|很急|急|救命|出事|不好了|帮帮我|帮忙|帮个忙'], say: [['别着急，别着急！慢慢说，怎么了？', "Don't panic, don't panic! Slow down, what happened?"]], try: ['老潘，我有急事！', '很急，请帮帮我！'] },
      { obj: 'hospital-5-2', m: ['摔|掉下', '不能走|走不了|走不动', '受伤|伤|脚|腿', '小谢 疼|不能|出事'], say: [['什么？小谢摔了？不能走？我跟你说，别让她动！你们在哪儿？', "What? Xiao Xie fell? Can't walk? Listen, don't let her move! Where are you?"]], try: ['小谢在楼梯上摔倒了。', '小谢的脚受伤了，不能走。'] },
      { obj: 'hospital-5-3', m: ['我们在|我在|在 宽厚里|山大|山东大学|学校|门口|小区|家|号楼|饭馆|饭店|路', '地址'], say: [['好，我知道那儿！你们能到门口吗？', 'OK, I know the place! Can you get to the entrance?', { ask: {
        yes: ['好，在门口等我！', 'OK, wait for me at the entrance!'],
        no: ['没事，我上去找你们！', "No problem, I'll come up and find you!"] } }]],
        try: ['我们在宽厚里。', '我们在山东大学东门。'] },
      { obj: 'hospital-5-4', m: ['快 来|点|过来', '马上 来|过来', '赶紧|赶快', '来接'], say: [['我马上到！十分钟！', "I'm on my way! Ten minutes!"]], try: ['你能快点儿来吗？', '请你马上过来！'] },
      { obj: 'hospital-5-5', m: ['省立', '哪个医院|什么医院|哪家医院', '医院 最近|近'], say: [['省立医院！我跟你说，那儿最近，医生也好！', "The Provincial Hospital! Let me tell you, it's the closest, and the doctors are good!"]], try: ['我们去省立医院。', '去哪个医院最近？'] },
      { obj: 'hospital-5-6', need: 'hospital-5-4', m: ['@thx'], say: [['客气啥！有我呢！', "Don't mention it! I've got you!"]], try: ['谢谢你，老潘！', '太谢谢你了！'] }
    ],
    extra: [
      { m: ['医院'], say: [['哪个医院？省立医院最近！', 'Which hospital? The Provincial Hospital is closest!']] },
      { m: ['怎么办|害怕|怕'], say: [['别怕！我跟你说，十分钟就到！', "Don't be scared! Let me tell you, ten minutes and I'm there!"]] }
    ],
    done: [['别怕，有我呢！我跟你说，十分钟就到！', "Don't be scared, I've got you! Let me tell you, I'll be there in ten minutes!"]],
    words: [['摔倒', 'shuāidǎo', 'to fall down'], ['着急', 'zháojí', 'anxious; urgent']],
    later: ['小谢的脚好了吗？那天可吓死我了！', "Is Xiao Xie's foot better? That day scared me half to death!"]
  }
});
