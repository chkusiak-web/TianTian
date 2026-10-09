/* 故 Stories · HSK 3 · 小谢 */
window.STORIES.push({
  id: 'hsk3-xie-birthday', hsk: 3, chars: ['xie', 'sun', 'wang', 'su', 'lin'],
  title: ['真的假的？', 'Seriously?!'],
  names: ['小谢', '王奶奶', '小苏', '孙师傅', '林姐', '宽厚里', '济南', '大明湖'],
  new: [['烤肉', 'kǎoròu', 'barbecue; grilled meat']],
  text: [
    ['今天是我的生日，可是好像没有人记得。', 'Today was my birthday, but it seemed nobody remembered.'],
    ['早上王奶奶没给我打电话，小苏也没给我发信息。', "In the morning Grandma Wang didn't call me, and Xiao Su didn't text me either."],
    ['我一个人在家，越来越不高兴。', 'I was home alone, feeling more and more down.'],
    ['晚上七点，小谢突然给我打电话：“哈哈，你在干什么？走吧，我们去宽厚里吃烤肉！”', 'At seven in the evening, Xiao Xie suddenly called me: "Haha, what are you up to? Come on, let\'s go to Kuanhouli for barbecue!"'],
    ['我说：“我有点儿累，不想去。”她说：“不行！快出来，我就在你家门口！”', 'I said: "I\'m a bit tired, I don\'t feel like going." She said: "No way! Hurry out, I\'m right outside your door!"'],
    ['一路上，小谢一边走一边看手机，还一直笑。', 'All the way there, Xiao Xie kept looking at her phone as she walked, and she wouldn\'t stop smiling.'],
    ['我问她：“你笑什么？”她说：“没什么，没什么！”', 'I asked her: "What are you smiling about?" She said: "Nothing, nothing!"'],
    ['到了孙师傅的店，里面黑黑的，一个人也没有。', "When we got to Master Sun's place, it was dark inside, and there wasn't a single person."],
    ['我正想问为什么，灯突然亮了！', 'Just as I was about to ask why, the lights suddenly came on!'],
    ['王奶奶、小苏、孙师傅、林姐都在里面，大家一起唱：“祝你生日快乐！”', 'Grandma Wang, Xiao Su, Master Sun and Sister Lin were all inside, and everyone sang together: "Happy birthday to you!"'],
    ['我又高兴又不好意思，一句话也说不出来。', 'I was so happy and so embarrassed that I couldn\'t say a word.'],
    ['小谢哈哈大笑：“真的假的？你真的以为我们都忘了？”', 'Xiao Xie roared with laughter: "Seriously? Did you really think we\'d all forgotten?"'],
    ['孙师傅拿来了很多烤肉：“朋友，生日快乐！今天不要钱！要不要加个鸡蛋？”', 'Master Sun brought over loads of barbecue: "Happy birthday, friend! It\'s on the house today! Want to add an egg?"'],
    ['那天晚上，我们一边吃一边说，那是我在济南过得最好的一个生日。', 'That night we ate and talked, and it was the best birthday I\'ve ever had in Jinan.']
  ],
  chunks: [
    ['发信息', 'to send a text message', '给 + someone + 发信息: to text someone.'],
    ['在你家门口', 'outside your door', '门口 = doorway, entrance. 在学校门口 = at the school gate.'],
    ['没什么', "it's nothing", 'A quick way to brush off a question: "Nothing, never mind."'],
    ['又高兴又不好意思', 'both happy and embarrassed', '又A又B: two feelings or qualities at once.'],
    ['祝你生日快乐', 'happy birthday to you', '祝你 + wish: 祝你身体健康, 祝你一路平安.'],
    ['要不要加', 'want to add…?', "Master Sun's favorite upsell: 要不要加个鸡蛋？ = Want an egg with that?"]
  ],
  qs: [
    { q: '早上，我为什么越来越不高兴？', o: ['因为好像没有人记得我的生日', '因为我生病了', '因为下雨了'], a: 0 },
    { q: '小谢说去哪儿吃饭？', o: ['宽厚里', '大明湖', '火车站'], a: 0 },
    { q: '灯亮了以后，我看见了什么？', o: ['很多朋友在等我', '店里一个人也没有', '只有孙师傅一个人'], a: 0 },
    { q: '那天孙师傅的烤肉多少钱？', o: ['不要钱', '很贵', '五十块'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '发信息', d: ['开车', '爬山', '睡觉'] },
    { s: 2, t: '越来越不高兴', d: ['越来越高兴', '越来越饱', '越来越年轻'] },
    { s: 4, t: '在你家门口', d: ['在火车上', '在医院里', '在山上'] },
    { s: 6, t: '你笑什么', d: ['你吃什么', '你买什么', '你喝什么'] },
    { s: 8, t: '亮了', d: ['黑了', '冷了', '饿了'] },
    { s: 9, t: '生日快乐', d: ['新年快乐', '一路平安', '欢迎回来'] },
    { s: 12, t: '不要钱', d: ['不好吃', '不能吃', '不开门'] }
  ]
});
