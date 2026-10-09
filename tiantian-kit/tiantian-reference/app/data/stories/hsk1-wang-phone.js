/* 故 Stories · HSK 1 · Grandma Wang learns to video call her grandson. */
window.STORIES.push({
  id: 'hsk1-wang-phone', hsk: 1, chars: ['wang'],
  title: ['王奶奶的新手机', "Grandma Wang's New Phone"],
  names: ['王奶奶', '曲水亭街'],
  new: [['孙子', 'sūnzi', 'grandson'], ['视频', 'shìpín', 'video']],
  text: [
    ['星期天下午，王奶奶在曲水亭街的家门口叫我：“孩子，你来一下！”', 'On Sunday afternoon, Grandma Wang called to me from her doorway on Qushuiting Street: "Child, come here a moment!"'],
    ['她有一个新手机，是她孙子给她买的。', 'She had a new phone. Her grandson had bought it for her.'],
    ['孙子在北京工作，很忙，不常回家。', "Her grandson works in Beijing. He's very busy and doesn't come home often."],
    ['“孩子，我想跟他打视频电话。你会吗？”', '"Child, I want to video call him. Do you know how?"'],
    ['我说：“我会，我来帮你！”', 'I said: "I do. Let me help you!"'],
    ['电话打过去了。奶奶说：“我看不见他！”', 'The call went through. Grandma said: "I can\'t see him!"'],
    ['我一看，笑了：奶奶的手在手机上！', "I took one look and laughed: Grandma's hand was covering the phone!"],
    ['奶奶拿开手，马上看到了孙子。', 'Grandma moved her hand away and right away she saw her grandson.'],
    ['她太高兴了：“孩子，吃了吗？北京冷不冷？多穿一点儿！”', 'She was so happy: "Child, have you eaten? Is it cold in Beijing? Wear more layers!"'],
    ['孙子笑着说：“奶奶，我吃了，我不冷！”', 'Her grandson laughed and said: "Grandma, I\'ve eaten, and I\'m not cold!"'],
    ['他们打了一个小时电话。奶奶说：“孩子，谢谢你！晚上来奶奶家吃饭！”', 'They talked on the phone for an hour. Grandma said: "Thank you, child! Come to Grandma\'s for dinner tonight!"']
  ],
  chunks: [
    ['你来一下', 'come here a moment', '来一下 softens a request: "come over for a sec." 你看一下 = take a look.'],
    ['不常回家', "doesn't often come home", '不常 + verb = not often. 他不常回家 is how you talk about family who live far away.'],
    ['打视频电话', 'to make a video call', '打电话 + 视频: 跟他打视频电话 = video call him.'],
    ['看不见', "can't see", 'Verb + 不 + result: 看不见 (can\'t see), 听不见 (can\'t hear).'],
    ['多穿一点儿', 'wear more (layers)', 'What grandmas say when it\'s cold. 多 + verb + 一点儿 = do a bit more of it.'],
    ['一个小时', 'one hour', '打了一个小时电话 = talked on the phone for an hour. The time goes before the object.']
  ],
  qs: [
    { q: '王奶奶的新手机是谁买的？', o: ['她孙子', '她女儿', '我'], a: 0 },
    { q: '王奶奶的孙子在哪儿工作？', o: ['北京', '医院', '曲水亭街'], a: 0 },
    { q: '奶奶看不见孙子的时候，她的手在哪儿？', o: ['在手机上', '在桌子上', '在门上'], a: 0 },
    { q: '奶奶请我晚上做什么？', o: ['去她家吃饭', '去北京', '买一个新手机'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '新手机', d: ['新衣服', '新书', '新茶'] },
    { s: 3, t: '打视频电话', d: ['去北京工作', '一起吃午饭', '开车去学校'] },
    { s: 5, t: '看不见', d: ['不认识', '不喜欢', '不想去'] },
    { s: 6, t: '笑了', d: ['睡了', '走了', '饿了'] },
    { s: 8, t: '多穿一点儿', d: ['少穿一点儿', '多看一点儿', '多写一点儿'] },
    { s: 10, t: '一个小时', d: ['一个星期', '一个月', '两年'] }
  ]
});
