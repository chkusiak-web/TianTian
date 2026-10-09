/* 故 Stories · HSK 1 · My first Chinese class, and a very wrong introduction. */
window.STORIES.push({
  id: 'hsk1-lu-teacher', hsk: 1, chars: ['lu'],
  title: ['我是老师？', "I'm the Teacher?"],
  names: ['吕老师', '山东大学'],
  new: [['遍', 'biàn', 'time (once through)']],
  text: [
    ['星期一上午，我第一次去山东大学上中文课。', 'On Monday morning, I went to my first Chinese class at Shandong University.'],
    ['吕老师说：“你们好！请坐。今天我们先介绍一下。”', 'Teacher Lü said: "Hello, everyone! Please sit down. Today let\'s start by introducing ourselves."'],
    ['同学们一个一个说了名字。', 'One by one, my classmates said their names.'],
    ['到我了。我站起来说：“你们好！我是老师。”', 'Then it was my turn. I stood up and said: "Hello, everyone! I am the teacher."'],
    ['同学们都笑了。', 'All my classmates laughed.'],
    ['吕老师也笑了：“你是老师？那我是谁？”', 'Teacher Lü laughed too: "You\'re the teacher? Then who am I?"'],
    ['我不知道说什么了。', "I didn't know what to say."],
    ['吕老师说：“没关系，慢慢说。再说一遍。”', 'Teacher Lü said: "It\'s OK, speak slowly. Say it again."'],
    ['我说：“对不起！我是学生，我是吕老师的学生。”', 'I said: "Sorry! I\'m a student. I\'m Teacher Lü\'s student."'],
    ['吕老师说：“很好！”', 'Teacher Lü said: "Very good!"'],
    ['下课了，同学们都叫我“老师”。', 'After class, all my classmates called me "Teacher."']
  ],
  chunks: [
    ['上中文课', 'to have Chinese class', '上 + 课 = attend class: 上中文课, 上数学课. 下课 = class is over.'],
    ['请坐', 'please sit down', 'The polite thing a host or teacher says. 请进 = please come in.'],
    ['介绍一下', 'introduce (yourself) briefly', 'Verb + 一下 makes it light and casual: 介绍一下, 看一下.'],
    ['站起来', 'to stand up', '站 (stand) + 起来 (up). 坐下 is the opposite.'],
    ['慢慢说', 'speak slowly', 'Teachers say this to calm you down: no rush, take your time.'],
    ['再说一遍', 'say it again', '再 (again) + 说 + 一遍 (one time through).']
  ],
  qs: [
    { q: '我第一次去哪儿上中文课？', o: ['山东大学', '医院', '商店'], a: 0 },
    { q: '我说“我是老师”，同学们怎么了？', o: ['都笑了', '都走了', '都睡了'], a: 0 },
    { q: '吕老师说“没关系”，还说了什么？', o: ['再说一遍', '你回家吧', '明天见'], a: 0 },
    { q: '下课了，同学们叫我什么？', o: ['老师', '学生', '朋友'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '请坐', d: ['再见', '不客气', '对不起'] },
    { s: 3, t: '站起来', d: ['走出去', '跑回家', '打开门'] },
    { s: 4, t: '都笑了', d: ['都睡了', '都走了', '都饿了'] },
    { s: 5, t: '那我是谁', d: ['那你几岁', '那我去哪儿', '那你吃了吗'] },
    { s: 7, t: '慢慢说', d: ['快快说', '不要说', '别说话'] },
    { s: 8, t: '对不起', d: ['不客气', '没关系', '再见'] }
  ]
});
