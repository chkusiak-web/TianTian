/* 故 Stories · HSK 2 · A cold the weekend before a big exam, and Dr. Bai's cheapest medicine. */
window.STORIES.push({
  id: 'hsk2-bai-mountain', hsk: 2, chars: ['bai'],
  title: ['最好的药', 'The Best Medicine'],
  names: ['白大夫', '山东省立医院'],
  new: [['感冒', 'gǎnmào', 'to catch a cold; a cold'], ['发烧', 'fāshāo', 'to have a fever'], ['着急', 'zháojí', 'to worry; to be anxious']],
  text: [
    ['星期五我感冒了，可是下个星期一我有一个很重要的考试。', 'On Friday I caught a cold, but I had a very important exam the following Monday.'],
    ['我头很疼，身体也很累，什么都不想做。', 'My head really hurt and my whole body was tired. I didn\'t feel like doing anything.'],
    ['我去了山东省立医院，给我看病的是白大夫。', 'I went to Shandong Provincial Hospital, and the doctor who saw me was Dr. Bai.'],
    ['他说：“别着急。我们一个一个问题来。第一个：哪儿不舒服？”', 'He said: "Don\'t worry. Let\'s take it one question at a time. First: what\'s wrong?"'],
    ['“头疼，还有点儿发烧。医生，我星期一有考试！”', '"My head hurts, and I have a bit of a fever. Doctor, I have an exam on Monday!"'],
    ['他又问：“第二个问题：这个星期你晚上都是几点睡觉？”', 'He asked again: "Second question: what time did you go to bed every night this week?"'],
    ['我说：“都是两点以后。我天天学习到很晚。”', 'I said: "Always after two. I\'ve been studying late every night."'],
    ['白大夫说：“好，我知道你为什么感冒了。”', 'Dr. Bai said: "Right. Now I know why you caught a cold."'],
    ['我问：“您能给我最好的药吗？我想快点儿好！”', 'I asked: "Can you give me the best medicine? I want to get better fast!"'],
    ['“最好的药不要钱，就是睡觉。今天晚上十点睡觉，多喝水，多休息。”', '"The best medicine is free: sleep. Go to bed at ten tonight, drink lots of water, and rest."'],
    ['“可是我还有很多书没看完……”', '"But I still have lots of books I haven\'t finished…"'],
    ['他笑了笑：“书明天还在。你的身体比书重要。”', 'He gave a little smile: "The books will still be there tomorrow. Your body is more important than books."'],
    ['星期一考完试，我去医院谢谢他，他说：“不客气。下次考试以前，先睡觉，再看书。”', 'After the exam on Monday, I went to the hospital to thank him. He said: "You\'re welcome. Next time before an exam: sleep first, then study."']
  ],
  chunks: [
    ['感冒了', 'caught a cold', '感冒 + 了 = got a cold. 我感冒了 is how you tell people you\'re sick.'],
    ['哪儿不舒服', "what's wrong? where does it hurt?", "A doctor's first question. 不舒服 = not feeling well."],
    ['有点儿发烧', 'have a bit of a fever', '有点儿 + (usually bad) thing: a little. 有点儿累, 有点儿贵.'],
    ['学习到很晚', 'study until late', 'Verb + 到 + time: do it until then. 工作到十点.'],
    ['多喝水，多休息', 'drink lots of water, get lots of rest', "Dr. Bai's standard advice. 多 + verb = do more of it."],
    ['先睡觉，再看书', 'sleep first, then study', '先 A，再 B = first A, then B.']
  ],
  qs: [
    { q: '我为什么去医院？', o: ['我感冒了', '我要去考试', '我去看朋友'], a: 0 },
    { q: '这个星期我晚上都是几点睡觉？', o: ['两点以后', '十点', '十二点以前'], a: 0 },
    { q: '白大夫说最好的药是什么？', o: ['睡觉', '多看书', '很贵的药'], a: 0 },
    { q: '星期一考完试，我做了什么？', o: ['去医院谢谢白大夫', '回家睡觉', '去买药'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '感冒了', d: ['下课了', '上班了', '出门了'] },
    { s: 2, t: '看病', d: ['看书', '看电影', '看朋友'] },
    { s: 3, t: '哪儿不舒服', d: ['你去哪儿', '你买什么', '你卖什么'] },
    { s: 5, t: '几点睡觉', d: ['几点吃饭', '几点上课', '几点起床'] },
    { s: 8, t: '最好的药', d: ['最好的书', '最好的菜', '最好的衣服'] },
    { s: 9, t: '多喝水', d: ['多看书', '多工作', '多上课'] },
    { s: 12, t: '先睡觉', d: ['先看书', '先上课', '先工作'] }
  ]
});
