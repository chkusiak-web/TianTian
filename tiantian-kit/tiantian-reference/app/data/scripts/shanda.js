/* 山东大学 Shandong University · HSK 2–3 · School & friends */
Object.assign(window.JINAN_SCRIPTS.quests, {
  'shanda-1': {   // 吕老师 · Register as a student
    open: [['欢迎来山东大学！我们先登记一下。', "Welcome to Shandong University! Let's get you registered first."], ['你是新同学吧？来，我们先填一张表。', "You're a new student, right? Come, let's fill in a form first."]],
    steps: [
      { obj: 'shanda-1-1', m: ['@hi'], say: [['你好！请坐。我们一个一个来。', "Hello! Please sit down. We'll go one thing at a time."]], try: ['吕老师好！', '老师，您好！'] },
      { obj: 'shanda-1-2', m: ['{name}', '我姓 !什么|您|贵', '我是 !国|人|学生|吗|加拿大|澳大利亚|新西兰|新加坡|的'], say: [['{name|好的}，我写一下。你有中文名字吗？', "{name|OK}, let me write that down. Do you have a Chinese name?", { ask: {
        yes: ['很好，我也写上。你是哪国人？', "Very good, I'll write that down too. What's your nationality?"],
        no: ['没关系，以后可以起一个。你是哪国人？', "That's fine, you can choose one later. What's your nationality?"] } }]], try: ['我叫大卫。', '我的名字是安娜。'] },
      { obj: 'shanda-1-3', m: ['{country}', '我是 国人|人 !中国|学生|老师|留学生', '我从 来', '我来自'], say: [['很好！{country|}留学生，欢迎你！你的生日是几月几号？', 'Very good! An international student from {country|abroad}, welcome! What is your birthday?']], try: ['我是美国人。', '我从英国来。'] },
      { obj: 'shanda-1-4', m: ['生日', '出生', '月 号|日 !上课|开学|开始|手机|电话'], say: [['好，记下了。你的手机号码是多少？', "OK, noted. What's your mobile number?"]], try: ['我的生日是五月三号。', '我是一九九八年十月八号出生的。'] },
      { obj: 'shanda-1-5', m: ['手机|电话|号码 !多少|什么|几', '{n} !月|号|日|岁|点|年|课'], say: [['好，我记下了。最后，你还有什么问题吗？', "OK, I've got it. Finally, do you have any questions?"]], try: ['我的手机号码是13812345678。', '我的电话是13698765432。'] },
      { obj: 'shanda-1-6', m: ['@when|几号|哪天 上课|开学|开课', '上课 时间', '开学 时间'], say: [['下个星期一开始上课，早上八点，在三号楼二〇一。别迟到！', "Classes start next Monday at eight in the morning, in Building 3, Room 201. Don't be late!"]],
        card: { title: '开学安排', rows: [['开始上课', '下星期一'], ['上课时间', '8:00–11:30'], ['教室', '3号楼201'], ['老师', '吕老师']] },
        try: ['什么时候开始上课？', '请问，哪天开学？'] }
    ],
    extra: [
      { m: ['宿舍|住在哪|住哪'], say: [['宿舍的事，你去二楼办公室问一下。', 'For the dormitory, ask at the office on the second floor.']] },
      { m: ['教室|几号楼'], say: [['教室在三号楼二〇一。', "The classroom is Building 3, Room 201."]] },
      { m: ['学生证'], say: [['学生证下个星期给你。', "You'll get your student ID next week."]] }
    ],
    done: [['好了，登记完了！很好。下星期一见！', "All done, you're registered! Very good. See you next Monday!"]],
    words: [['登记', 'dēngjì', 'to register, sign in'], ['开学', 'kāixué', 'start of the school term']],
    later: ['你的学生证拿到了吗？', 'Did you get your student ID?']
  },

  'shanda-2': {   // 小苏 · Find a language partner
    open: [['那个……你也是来找语言伙伴的吗？', 'Um… are you here to find a language partner too?'], ['啊，你也在这儿喝咖啡？那个……你在学中文吗？', "Ah, you're having coffee here too? Um… are you learning Chinese?"]],
    steps: [
      { obj: 'shanda-2-1', m: ['{name}', '我是 !吗|什么|你', '我来自', '我从 来'], say: [['{name|你好}，很高兴认识你！你的中文真好！', "{name|Hi}, nice to meet you! Your Chinese is really good!"]], try: ['我叫大卫，我是美国人。', '我叫安娜，是英国留学生。'] },
      { obj: 'shanda-2-2', m: ['专业', '你 学什么|学习什么', '什么系'], say: [['我的专业是计算机！不过我最喜欢英语。“计算机”用英语怎么说？', "My major is computer science! But I like English best. How do you say 计算机 in English?"]], try: ['你的专业是什么？', '你学什么专业？'] },
      { obj: 'shanda-2-3', m: ['语言交换', '交换', '互相', '你教我 中文|汉语', '我教你 英语|英文', '一起 学|练习', '语伴', '语言伙伴'], say: [['真的吗？太酷了！你教我英语，我教你中文！星期二和星期四下午四点，可以吗？', "Really? So cool! You teach me English, I teach you Chinese! Tuesdays and Thursdays at 4 pm, does that work?", { ask: {
        yes: ['太好了！那就星期二、星期四下午四点，就在这个咖啡馆。', "Great! Tuesdays and Thursdays at 4 pm then, right here at this café.", { obj: 'shanda-2-4' }],
        no: ['没关系！那你什么时候有空？', 'No problem! When are you free, then?'] } }]],
        try: ['我们做语言交换吧！', '我教你英语，你教我中文，好吗？'] },
      { obj: 'shanda-2-4', m: ['{day} 有空|可以|行|见面|怎么样|吧|好', '{time}', '什么时候 见面|有空', '哪天|几点 见面|有空|方便', '一个星期 几次|两次'], say: [['好啊！那就{day|星期二}{time|下午四点}，在这个咖啡馆见！', "Sure! Then {day|Tuesday} at {time|4 pm}, here at this café!"]], try: ['星期三下午有空吗？', '我们周六上午十点见面吧。'] },
      { obj: 'shanda-2-5', m: ['微信', '扫 我|你|一下'], say: [['好啊！我扫你吧……好了！我给你发个笑脸。', "Sure! I'll scan yours… done! I'm sending you a smiley."]], try: ['我们加个微信吧！', '你有微信吗？'] }
    ],
    extra: [
      { m: ['我的专业', '我学 !什么'], say: [['真的吗？太酷了！', 'Really? So cool!']] },
      { m: ['咖啡|喝什么|喝点'], say: [['这儿的咖啡不错！今天我请你。', "The coffee here is good! It's on me today."]] },
      { m: ['computer|电脑'], say: [['对对对！太酷了，我记住了！', "Right, right! So cool, I'll remember that!"]] }
    ],
    done: [['太酷了！我有语言伙伴了！我们一起加油！', "So cool! I have a language partner! Let's both work hard!"]],
    words: [['专业', 'zhuānyè', 'major (field of study)'], ['语言交换', 'yǔyán jiāohuàn', 'language exchange']],
    later: ['上次在咖啡馆，你教我的英语我都记住了！', 'I remembered all the English you taught me at the café!']
  },

  'shanda-3': {   // 吕老师 · Homework check
    open: [['请进！有什么问题吗？', 'Come in! Do you have a question?'], ['请坐。今天想问什么？', 'Have a seat. What would you like to ask today?']],
    steps: [
      { obj: 'shanda-3-1', m: ['什么作业', '作业是什么 !时候', '有什么作业', '有没有作业', '有作业', '作业 多不多|哪些|要做什么', '要做什么'], say: [['这个星期的作业是写一篇短文，题目是《我的一天》。', 'This week\'s homework is a short essay titled "My Day".']], try: ['老师，这个星期有什么作业？', '我们的作业是什么？'] },
      { obj: 'shanda-3-2', m: ['什么时候|哪天|几号|星期几|几点 交|做完|写完|给您', '什么时候 !上课', '交 时间|日子'], say: [['星期五上课以前交。别忘了！', "Hand it in before class on Friday. Don't forget!"]], try: ['什么时候交作业？', '作业哪天交？'] },
      { obj: 'shanda-3-3', m: ['哪一课|第几课|哪课|几课', '哪一页|第几页|哪页|几页', '课文 哪|几'], say: [['看第十二课，课本第八十五页。先看课文，再写。', 'Look at Lesson 12, page 85 in the textbook. Read the text first, then write.']],
        card: { title: '本周作业', rows: [['作业', '写短文《我的一天》'], ['字数', '200字左右'], ['课文', '第12课 · 第85页'], ['交作业', '星期五上课以前']] },
        try: ['是第几课？', '在课本第几页？'] },
      { obj: 'shanda-3-4', m: ['多少字|几个字|写多少|多长', '可以用|能用 电脑|拼音|英语|英文|词典', '用电脑', '手写', '可以不可以|能不能', '怎么写', '一个问题|有个问题'], say: [['好问题！写两百字左右，用电脑写、手写都可以，但是别用英语和拼音。明白了吗？', "Good question! About two hundred characters; typed or handwritten are both fine, but no English or pinyin. Understood?", { ask: {
        yes: ['很好！', 'Very good!'],
        no: ['没关系，我再说一遍：两百字，电脑、手写都行。', "No problem, I'll say it again: two hundred characters, typed or handwritten is fine."] } }]],
        try: ['要写多少字？', '可以用电脑写吗？'] },
      { obj: 'shanda-3-5', need: 'shanda-3-1', m: ['@thx'], say: [['不客气！很好，有问题随时来问我。', "You're welcome! Good. Come ask me any time you have questions."]], try: ['谢谢老师！', '谢谢您，吕老师！'] }
    ],
    extra: [
      { m: ['难|不会写|写不好'], say: [['没关系，慢慢写。写完我帮你看看。', "It's OK, take your time. When you're done, I'll look it over."]] },
      { m: ['晚 交|一天'], say: [['最好别晚交。有问题早点儿告诉我。', "Better not hand it in late. If there's a problem, tell me early."]] }
    ],
    done: [['很好！我等着看你的《我的一天》。', 'Very good! I look forward to reading your "My Day".']],
    words: [['作业', 'zuòyè', 'homework'], ['交', 'jiāo', 'to hand in']],
    later: ['你的短文《我的一天》写得很好！', 'Your essay "My Day" was very well written!']
  },

  'shanda-4': {   // 小苏 · Canteen lunch with 小苏
    open: [['哇，好香！今天人真多。', "Wow, smells great! So many people today."], ['终于排到了！你想吃什么？', 'Finally our turn! What do you want to eat?']],
    steps: [
      { obj: 'shanda-4-1', m: ['什么好吃', '好吃 什么|哪个|吗', '推荐', '有什么', '吃什么'], say: [['今天的红烧肉和宫保鸡丁都很好吃！麻婆豆腐有点儿辣。', 'Today the braised pork and kung pao chicken are both good! The mapo tofu is a bit spicy.']],
        card: { title: '第一食堂 · 今日菜单', rows: [['红烧肉', '12元'], ['宫保鸡丁', '10元'], ['麻婆豆腐（辣）', '6元'], ['西红柿炒鸡蛋', '5元'], ['米饭', '1元/碗']] },
        try: ['今天什么好吃？', '你想吃什么？'] },
      { obj: 'shanda-4-2', m: ['@want|我吃|吃 红烧肉|宫保鸡丁|鸡丁|麻婆豆腐|豆腐|西红柿|炒鸡蛋|这个|那个 !多少|几块', '红烧肉|宫保鸡丁|麻婆豆腐|西红柿炒鸡蛋 吧|一份|两份 !多少|几块'], say: [['好选择！阿姨，这个来一份！要不要米饭？', 'Good choice! Auntie, one of these please! Do you want rice?', { ask: {
        yes: ['好，再来一碗米饭！', 'OK, and a bowl of rice!'],
        no: ['好，不要米饭。', 'OK, no rice.'] } }]],
        try: ['我要红烧肉。', '我想吃麻婆豆腐。'] },
      { obj: 'shanda-4-3', m: ['饭卡', '怎么 付|买单|给钱|交钱', '刷卡', '微信|支付宝|现金 可以|行|能'], say: [['用饭卡！在这个机器上刷一下就行。没有饭卡？用我的吧！', "With your campus card! Just tap it on this machine. No card? Use mine!"]], try: ['怎么付钱？', '可以用饭卡吗？'] },
      { obj: 'shanda-4-4', need: 'shanda-4-2', m: ['辣 !吗|什么|哪|有没有'], say: [['真的吗？哈哈，我觉得刚好！山东菜不太辣，四川菜才辣呢。', "Really? Haha, I think it's just right! Shandong food isn't very spicy; Sichuan food is the really spicy one."]], try: ['这个不太辣。', '太辣了！'] },
      { obj: 'shanda-4-5', m: ['我们国家|我的国家|我们那儿|我们那里', '在 {country}', '{country} 菜|吃|饭|人', '汉堡|披萨|三明治|牛排'], say: [['真的吗？太酷了！我还没吃过{country|你们国家}的菜。下次你做给我吃吧！', "Really? So cool! I've never had food from {country|your country}. Cook some for me next time!"]],
        try: ['在美国，我们常常吃汉堡。', '我们国家的菜不辣。'] }
    ],
    extra: [
      { m: ['辣 吗|什么|哪|有没有'], say: [['麻婆豆腐有一点儿辣，别的菜都不辣。', 'The mapo tofu is a little spicy; the other dishes are not spicy at all.']] },
      { m: ['好吃|香'], say: [['是吧？食堂的菜又便宜又好吃！', "Right? The canteen food is cheap and tasty!"]] },
      { m: ['@price'], say: [['菜单上有价钱。红烧肉十二块，米饭一块。', 'The prices are on the menu. Braised pork is twelve, rice is one.']] }
    ],
    done: [['吃饱了吗？下午还有课，我们走吧！', "Full? We have class this afternoon, let's go!"]],
    words: [['食堂', 'shítáng', 'canteen, dining hall'], ['饭卡', 'fànkǎ', 'campus meal card']],
    later: ['那天在食堂一起吃饭真开心！下次再去吧？', "Lunch at the canteen that day was so fun! Let's go again?"]
  },

  'shanda-5': {   // 吕老师 · Borrow a library book
    open: [['这就是图书馆。书很多吧？你想找什么书？', "This is the library. Lots of books, right? What book are you looking for?"]],
    steps: [
      { obj: 'shanda-5-1', m: ['@where 书|词典|小说|课本', '书 @where', '有 书|词典|小说 吗', '找 书|词典|小说|一本'], say: [['中文书在三楼，外文书在四楼。你看，在电脑上查一下书号，就能找到。', 'Chinese books are on the third floor, foreign-language books on the fourth. Look, search the call number on the computer and you can find it.']],
        card: { title: '图书馆 · 楼层', rows: [['一楼', '借书 · 还书'], ['二楼', '报纸 · 杂志'], ['三楼', '中文书'], ['四楼', '外文书']] },
        try: ['请问，汉语词典在哪儿？', '我想找一本中文小说。'] },
      { obj: 'shanda-5-2', m: ['怎么 借|办', '借 可以|能|要什么 !多久|多长|几天|几个星期|什么时候|哪天|还'], say: [['很简单！带上学生证，到一楼借书。你有学生证吗？', 'Easy! Bring your student ID to the first floor to borrow it. Do you have a student ID?', { ask: {
        yes: ['很好！那我们一会儿去一楼。', "Very good! Then we'll go to the first floor in a bit."],
        no: ['没关系，今天用我的卡借。你的学生证很快就有了。', "No problem, use my card today. You'll get your student ID soon."] } }]],
        try: ['这本书怎么借？', '我可以借这本书吗？'] },
      { obj: 'shanda-5-3', m: ['多久|多长时间|几天|几个星期|几周|多少天 !还书|什么时候还|哪天还|几号还'], say: [['可以借一个月。不够的话，还可以再借一次。', "You can keep it for a month. If that's not enough, you can renew it once."]], try: ['可以借多长时间？', '这本书能借多久？'] },
      { obj: 'shanda-5-4', m: ['还 什么时候|哪天|几号|几月|星期几 !多久|多长', '什么时候|哪天|几号 还', '到期'], say: [['一个月以后，就是下个月的今天。日期写在借书单上，你看。', "In one month, so this day next month. The date is on the loan slip, look."]],
        card: { title: '借书单', rows: [['借书日期', '今天'], ['还书日期', '下个月的今天'], ['再借', '可以一次']] },
        try: ['什么时候还书？', '我哪天要还？'] },
      { obj: 'shanda-5-5', need: 'shanda-5-1', m: ['@thx'], say: [['不客气！很好，多看书，中文会越来越好。', "You're welcome! Good. Read a lot and your Chinese will keep getting better."]], try: ['谢谢老师！', '谢谢您带我来！'] }
    ],
    extra: [
      { m: ['几点 开门|关门', '开门|关门'], say: [['图书馆早上八点开门，晚上十点关门。', 'The library opens at eight in the morning and closes at ten at night.']] },
      { m: ['说话|安静|大声'], say: [['在图书馆要小声说话。', 'In the library, you have to speak quietly.']] }
    ],
    done: [['很好！有空就来图书馆看书吧。', 'Very good! Come read at the library whenever you have time.']],
    words: [['借', 'jiè', 'to borrow'], ['还', 'huán', 'to return (something)']],
    later: ['你借的书看完了吗？别忘了还！', "Have you finished the book you borrowed? Don't forget to return it!"]
  }
});
