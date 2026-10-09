/* 故 Stories · HSK 3 · 小苏 */
window.STORIES.push({
  id: 'hsk3-su-library', hsk: 3, chars: ['su'],
  title: ['图书馆里的女生', 'The Girl in the Library'],
  names: ['小苏', '小雨', '山东大学'],
  new: [['酷', 'kù', 'cool'], ['窗户', 'chuānghu', 'window']],
  text: [
    ['小苏最近有点儿奇怪，每天下午都去山东大学的图书馆。', 'Xiao Su has been a bit strange lately: every afternoon he goes to the Shandong University library.'],
    ['我问他：“你最近怎么这么爱学习？”他的脸马上红了。', 'I asked him: "Since when do you love studying so much?" His face went red right away.'],
    ['原来，图书馆里有一个女生，每天都坐在窗户旁边看书。', 'It turned out there was a girl in the library who sat reading by the window every day.'],
    ['小苏说：“她也喜欢看老故事！可是……我不敢跟她说话。”', 'Xiao Su said: "She likes old stories too! But… I don\'t dare talk to her."'],
    ['他一边走来走去，一边问我：“第一句话说什么好呢？”', 'Pacing back and forth, he asked me: "What should I say first?"'],
    ['我说：“就说‘你好，我叫小苏’，很简单！”', 'I said: "Just say \'Hi, I\'m Xiao Su.\' It\'s easy!"'],
    ['第二天，小苏拿着一本书，在她旁边站了十分钟，还是什么也没说。', 'The next day, Xiao Su stood next to her holding a book for ten minutes, and still said nothing.'],
    ['他回来的时候很不高兴：“我真不行！”', 'When he came back he was really down: "I\'m hopeless!"'],
    ['第三天，我们刚走进图书馆，那个女生就站起来，向小苏走过来。', 'On the third day, we had only just walked into the library when the girl stood up and came over to Xiao Su.'],
    ['她拿出一张纸，上面写着：“你好，我叫小雨。你也喜欢这本书吗？”', 'She took out a piece of paper. On it was written: "Hi, I\'m Xiao Yu. Do you like this book too?"'],
    ['小苏看了半天，才说：“真的吗？太……太酷了！”', 'Xiao Su stared at it for ages before he said: "Really? That\'s s-so cool!"'],
    ['小雨笑着说：“我每天都看见你，可是我也不好意思先说话。”', 'Xiao Yu smiled and said: "I saw you every day, but I was too shy to speak first, too."'],
    ['现在他们常常一起去图书馆，还请我一起去。', 'Now they often go to the library together, and they even invite me along.'],
    ['可是我觉得，我还是别去了。', 'But I think I\'d better not go.']
  ],
  chunks: [
    ['有点儿奇怪', 'a bit strange', '有点儿 + adjective: "a bit…", usually for something not quite right.'],
    ['走来走去', 'to pace back and forth', 'Verb + 来 + verb + 去: doing something back and forth. 想来想去 = think it over and over.'],
    ['什么也没说', "didn't say anything", '什么也/都 + 没 + verb: not … anything at all.'],
    ['站起来', 'to stand up', 'Verb + 起来: upward movement. 站起来, 拿起来.'],
    ['不好意思', 'embarrassed; too shy to', '不好意思 + verb: too shy or embarrassed to do something. Also "excuse me."'],
    ['还是别去了', "I'd better not go", '还是 + suggestion: on second thought, it\'s better to…']
  ],
  qs: [
    { q: '小苏最近每天下午去哪儿？', o: ['图书馆', '医院', '火车站'], a: 0 },
    { q: '第二天，小苏跟那个女生说话了吗？', o: ['没有，他什么也没说', '说了很多话', '他们一起吃饭了'], a: 0 },
    { q: '最后是谁先说话的？', o: ['那个女生', '小苏', '我'], a: 0 },
    { q: '小雨为什么以前不先说话？', o: ['因为她也不好意思', '因为她不喜欢小苏', '因为她不会说中文'], a: 0 }
  ],
  blanks: [
    { s: 0, t: '有点儿奇怪', d: ['有点儿饿', '有点儿贵', '有点儿远'] },
    { s: 2, t: '窗户旁边', d: ['火车旁边', '医院旁边', '商店旁边'] },
    { s: 6, t: '站了十分钟', d: ['睡了十分钟', '跑了十分钟', '吃了十分钟'] },
    { s: 8, t: '站起来', d: ['坐下来', '睡着了', '哭起来'] },
    { s: 9, t: '一张纸', d: ['一杯水', '一碗面', '一件衣服'] },
    { s: 10, t: '看了半天', d: ['睡了半天', '吃了半天', '跑了半天'] },
    { s: 11, t: '不好意思', d: ['没关系', '不客气', '对不起'] }
  ]
});
