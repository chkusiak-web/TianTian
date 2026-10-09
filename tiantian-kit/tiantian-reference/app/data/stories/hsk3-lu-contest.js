/* 故 Stories · HSK 3 · 吕老师 */
window.STORIES.push({
  id: 'hsk3-lu-contest', hsk: 3, chars: ['lu'],
  title: ['我的第一次比赛', 'My First Competition'],
  names: ['吕老师', '济南', '王奶奶', '老潘', '孙师傅', '小苏'],
  new: [['鼓掌', 'gǔzhǎng', 'to applaud']],
  text: [
    ['上个月，吕老师在课上说：“下个月学校有一个中文比赛，你参加吧！”', 'Last month, Teacher Lü said in class: "Next month the school is holding a Chinese competition. You should enter!"'],
    ['我很紧张：“老师，我的中文还不太好，我不行。”', 'I was very nervous: "Teacher, my Chinese still isn\'t very good. I can\'t do it."'],
    ['她说：“没关系，我们一起准备。你一定可以！”', 'She said: "It\'s fine, we\'ll prepare together. You can definitely do it!"'],
    ['我的题目是《我在济南的朋友》。', 'My topic was "My Friends in Jinan."'],
    ['从那天起，我每天下课以后都去她的办公室练习。', 'From that day on, I went to her office to practice every day after class.'],
    ['我说一遍，她就说：“很好！再说一遍。”说了几十遍以后，我都会背了。', 'Every time I said it, she\'d say: "Very good! Once more." After dozens of times, I knew it by heart.'],
    ['比赛那天，大家都穿得很漂亮，我越来越紧张。', 'On the day of the competition, everyone was nicely dressed, and I got more and more nervous.'],
    ['我走上去，看着下面那么多人，突然一句话也想不起来了！', 'I walked up, looked out at all those people, and suddenly couldn\'t remember a single sentence!'],
    ['这时候，我看见吕老师坐在第一排，她笑着对我说：“慢慢说。”', 'Then I saw Teacher Lü sitting in the front row. She smiled and said to me: "Speak slowly."'],
    ['我的心一下子安静了，我开始讲王奶奶、老潘和孙师傅的故事。', 'My heart calmed down at once, and I began telling the stories of Grandma Wang, Old Pan and Master Sun.'],
    ['大家一边听一边笑，我也不紧张了。', 'Everyone laughed as they listened, and I stopped being nervous.'],
    ['讲完以后，大家都给我鼓掌。虽然我没有得第一名，但是得了第三名！', "When I finished, everyone applauded. I didn't win first place, but I came third!"],
    ['比赛以后，吕老师给了我一个小本子，里面写着我这一年说错的每一句话。', 'After the competition, Teacher Lü gave me a little notebook. In it was every sentence I had said wrong that year.'],
    ['最后一页上写着：“很好！你的中文越来越好了。”', 'On the last page she had written: "Very good! Your Chinese keeps getting better."']
  ],
  chunks: [
    ['一起准备', 'to prepare together', '准备 = prepare; 一起 before the verb = together. 准备考试, 准备比赛.'],
    ['再说一遍', 'say it once more', '遍 counts complete run-throughs. 再看一遍, 再听一遍.'],
    ['想不起来', "can't recall", '想起来 = to recall; 不 in the middle = unable. 我想不起来他的名字.'],
    ['第一排', 'the front row', '第 + number + 排: which row you sit in.'],
    ['一边听一边笑', 'laughing while listening', '一边A一边B: doing two things at the same time.'],
    ['得了第三名', 'came in third', '得 + 第X名: to win Xth place in a competition.']
  ],
  qs: [
    { q: '是谁让我参加比赛的？', o: ['吕老师', '小苏', '王奶奶'], a: 0 },
    { q: '我在台上为什么一句话也想不起来？', o: ['因为我太紧张了', '因为我生病了', '因为没有人听'], a: 0 },
    { q: '我得了第几名？', o: ['第三名', '第一名', '第二名'], a: 0 },
    { q: '吕老师在本子上写了什么？', o: ['我说错的话', '比赛的时间', '她的电话'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '参加吧', d: ['休息吧', '回家吧', '睡觉吧'] },
    { s: 2, t: '一起准备', d: ['一起吃饭', '一起唱歌', '一起睡觉'] },
    { s: 5, t: '再说一遍', d: ['再写一本', '再吃一碗', '再喝一杯'] },
    { s: 10, t: '一边听一边笑', d: ['一边睡一边哭', '一边吃一边跑', '一边写一边唱'] },
    { s: 7, t: '想不起来', d: ['吃不完', '买不起', '睡不着'] },
    { s: 8, t: '第一排', d: ['第一天', '第一名', '第一本'] },
    { s: 13, t: '越来越好', d: ['越来越贵', '越来越老', '越来越远'] }
  ]
});
