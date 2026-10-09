/* 故 Stories · HSK 2 · 吕老师 */
window.STORIES.push({
  id: 'hsk2-lu-homework', hsk: 2, chars: ['lu'],
  title: ['作业在哪儿？', 'Where Is My Homework?'],
  names: ['吕老师', '山东大学', '济南', '趵突泉', '大明湖'],
  new: [],
  text: [
    ['星期一早上，我坐公交车去山东大学上课。', 'On Monday morning, I took the bus to Shandong University for class.'],
    ['到了教室，我打开书包一看，作业不在里面！', 'When I got to the classroom, I opened my schoolbag, and my homework wasn\'t in it!'],
    ['我想了想：作业还在家里的桌子上。', 'I thought about it: the homework was still on the table at home.'],
    ['吕老师走过来问：“你的作业呢？”', 'Teacher Lü came over and asked: "Where\'s your homework?"'],
    ['我很不好意思：“对不起，老师，我忘在家里了。”', 'I was really embarrassed: "Sorry, Teacher, I left it at home."'],
    ['吕老师说：“没关系，慢慢说。你写的是什么？”', 'Teacher Lü said: "It\'s OK, take your time. What did you write about?"'],
    ['我的作业叫《我的济南》，我写了趵突泉和大明湖。', 'My homework was called "My Jinan". I wrote about Baotu Spring and Daming Lake.'],
    ['吕老师说：“很好！那你给大家说一说吧。”', 'Teacher Lü said: "Very good! Then tell everyone about it."'],
    ['我站起来，一句一句地说。', 'I stood up and said it one sentence at a time.'],
    ['我说错了一个词，吕老师说：“没关系，再说一遍。”', 'I said one word wrong, and Teacher Lü said: "It\'s OK, say it again."'],
    ['我又说了一遍，这次一个也没说错。', "I said it again, and this time I didn't make a single mistake."],
    ['说完以后，同学们都说：“说得真好！”', 'When I finished, my classmates all said: "That was really good!"'],
    ['吕老师笑着说：“很好！你的作业不在本子上，在你的心里。”', 'Teacher Lü smiled and said: "Very good! Your homework isn\'t in your notebook, it\'s in your head."']
  ],
  chunks: [
    ['坐公交车', 'to take the bus', '坐 + vehicle: 坐公交车, 坐地铁, 坐出租车.'],
    ['不好意思', 'embarrassed; sorry', '很不好意思 = to feel embarrassed. Also a polite "excuse me".'],
    ['忘在家里', 'to leave (something) at home', '忘在 + place = forgot it at a place: 忘在车上, 忘在学校.'],
    ['慢慢说', 'take your time (speaking)', "Teacher Lü's way of calming you down: no rush, just say it slowly."],
    ['再说一遍', 'say it again', '遍 counts times you do something start to finish: 再说一遍, 再看一遍.'],
    ['说得真好', 'said really well', 'Verb + 得 + comment: 说得真好, 写得很好.']
  ],
  qs: [
    { q: '我的作业在哪儿？', o: ['在家里的桌子上', '在书包里', '在吕老师那儿'], a: 0 },
    { q: '我的作业写的是什么？', o: ['我的济南', '我的大学', '我的家'], a: 0 },
    { q: '吕老师让我做什么？', o: ['给大家说一说作业', '回家拿作业', '明天再写一次'], a: 0 },
    { q: '第二遍说的时候，我说得怎么样？', o: ['一个也没错', '错了很多', '没说完'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '坐公交车', d: ['坐飞机', '坐船', '坐火车'] },
    { s: 1, t: '打开书包', d: ['打开电视', '打开门', '打开车门'] },
    { s: 4, t: '很不好意思', d: ['很高兴', '很开心', '很好看'] },
    { s: 5, t: '慢慢说', d: ['快点儿走', '别说话', '去睡觉'] },
    { s: 8, t: '站起来', d: ['睡着了', '走出去', '跑回家'] },
    { s: 10, t: '又说了一遍', d: ['又写了一本', '又买了一个', '又吃了一碗'] }
  ]
});
