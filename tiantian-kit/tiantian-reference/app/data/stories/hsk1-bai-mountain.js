/* 故 Stories · HSK 1 · A kind stranger on Qianfo Mountain turns up again. */
window.STORIES.push({
  id: 'hsk1-bai-mountain', hsk: 1, chars: ['bai'],
  title: ['山上的先生', 'The Man on the Mountain'],
  names: ['白大夫', '千佛山', '吕老师', '老潘'],
  new: [['爬', 'pá', 'to climb'], ['着急', 'zháojí', 'to worry; to be in a hurry'], ['舒服', 'shūfu', 'comfortable; well']],
  text: [
    ['星期天上午，天气很热。我去爬千佛山。', 'On Sunday morning it was very hot. I went to climb Qianfo Mountain.'],
    ['我走了一个小时，非常累，也非常渴。', 'I walked for an hour. I was really tired and really thirsty.'],
    ['我没有水！', "And I didn't have any water!"],
    ['旁边的一个先生给我水喝。', 'A man next to me gave me some water to drink.'],
    ['他说：“别着急，慢慢走。多喝水，多休息。”', 'He said: "Don\'t rush, take it slow. Drink plenty of water and rest."'],
    ['我们一起到了山上。我忘了问他的名字。', 'We reached the top together. I forgot to ask his name.'],
    ['星期一，我生病了，去医院看病。', 'On Monday I got sick and went to the hospital to see a doctor.'],
    ['医生说：“你好。哪儿不舒服？”', 'The doctor said: "Hello. What seems to be the problem?"'],
    ['我看了看他……是山上的那个先生！', 'I looked at him… it was the man from the mountain!'],
    ['他笑了：“我是白大夫。我们在山上见过！”', 'He smiled: "I\'m Dr. Bai. We met on the mountain!"'],
    ['“没什么。多喝水，多休息。下次爬山，别忘了水！”', '"It\'s nothing serious. Drink plenty of water and rest. Next time you climb a mountain, don\'t forget water!"']
  ],
  chunks: [
    ['爬千佛山', 'climb Qianfo Mountain', '爬 + mountain name, or just 爬山 (go hiking).'],
    ['别着急', "don't worry; no rush", 'Dr. Bai\'s catchphrase: calms people down.'],
    ['多喝水，多休息', 'drink lots of water and rest', 'What every Chinese doctor (and mother) tells you.'],
    ['去医院看病', 'go to the hospital to see a doctor', '看病 = see a doctor (as the patient).'],
    ['哪儿不舒服', 'what\'s bothering you?', 'Literally "where is uncomfortable?" The doctor\'s first question.'],
    ['见过', 'have met before', 'Verb + 过 = have done it before: 见过, 去过, 吃过.']
  ],
  qs: [
    { q: '在千佛山上，我没有什么？', o: ['水', '手机', '朋友'], a: 0 },
    { q: '山上的先生是谁？', o: ['白大夫', '吕老师', '老潘'], a: 0 },
    { q: '星期一我去了哪儿？', o: ['医院', '千佛山', '学校'], a: 0 },
    { q: '白大夫说，下次爬山别忘了什么？', o: ['水', '钱包', '手机'], a: 0 }
  ],
  blanks: [
    { s: 1, t: '非常渴', d: ['非常高', '非常忙', '非常大'] },
    { s: 4, t: '慢慢走', d: ['快快跑', '去上班', '去开车'] },
    { s: 6, t: '看病', d: ['看书', '看电影', '看朋友'] },
    { s: 7, t: '不舒服', d: ['不认识', '不喜欢', '不知道'] },
    { s: 9, t: '见过', d: ['吃过', '睡过', '买过'] },
    { s: 10, t: '别忘了', d: ['别喝了', '别买了', '别要了'] }
  ]
});
