/* 故 Stories · HSK 2 · 孙师傅 */
window.STORIES.push({
  id: 'hsk2-sun-helper', hsk: 2, chars: ['sun'],
  title: ['孙师傅的新帮手', "Master Sun's New Helper"],
  names: ['孙师傅', '宽厚里'],
  new: [['烤', 'kǎo', 'to grill, to roast'], ['串', 'chuàn', 'skewer; measure word for things on a stick']],
  text: [
    ['星期五晚上，我去宽厚里找孙师傅吃烤肉串。', 'On Friday night, I went to Kuanhouli to have grilled meat skewers at Master Sun\'s.'],
    ['那天人特别多，孙师傅一个人太忙了。', 'There were especially lots of people that day, and Master Sun was far too busy on his own.'],
    ['“来了！朋友，你会写汉字吧？帮我一下！”', '"Coming! Friend, you can write Chinese characters, right? Give me a hand!"'],
    ['他让我站在门口，问客人要什么，然后写在本子上。', 'He had me stand at the entrance, ask customers what they wanted, and then write it in a notebook.'],
    ['第一个客人说：“二十串肉，两瓶水。”', 'The first customer said: "Twenty meat skewers, two bottles of water."'],
    ['我写得很慢，后面的客人都在等。', 'I wrote very slowly, and the customers behind were all waiting.'],
    ['孙师傅大声说：“别急，别急！我的朋友在学中文呢！”', 'Master Sun called out loudly: "Don\'t rush, don\'t rush! My friend is learning Chinese!"'],
    ['大家都笑了，还有人教我写“串”字。', 'Everyone laughed, and someone even taught me how to write the character 串.'],
    ['后来，我学孙师傅，也问客人们：“要不要加十串？”', 'After that, I started copying Master Sun and asking the customers too: "Want to add ten more skewers?"'],
    ['很多客人都说：“好，加！”', 'Lots of customers said: "Sure, add them!"'],
    ['十一点，肉都卖完了，孙师傅特别高兴。', 'By eleven, all the meat was sold out, and Master Sun was especially happy.'],
    ['“朋友，你比我还会卖！今天的晚饭不要钱！”', '"Friend, you\'re a better salesman than me! Tonight\'s dinner is free!"'],
    ['那天晚上，我吃得很饱，还学会了一个新字。', 'That night I ate until I was full, and I also learned a new character.']
  ],
  chunks: [
    ['帮我一下', 'give me a hand', 'Verb + 一下 makes a request light and casual: 帮我一下, 等我一下.'],
    ['两瓶水', 'two bottles of water', '瓶 is the measure word for bottles: 一瓶水, 两瓶可乐.'],
    ['别急', "don't rush", 'Said to calm people down. 别 + verb = don\'t: 别急, 别走.'],
    ['要不要加', 'want to add…?', "Master Sun's sales line. 要不要 + verb asks \"do you want to…?\""],
    ['卖完了', 'sold out', 'Verb + 完 = finished: 卖完了 (all sold), 吃完了 (all eaten).'],
    ['不要钱', 'free (no charge)', 'Literally "doesn\'t want money": 这个不要钱 = this one is free.']
  ],
  qs: [
    { q: '孙师傅为什么让我帮忙？', o: ['那天人特别多，他太忙了', '他不会写字', '他生病了'], a: 0 },
    { q: '第一个客人要了什么？', o: ['二十串肉和两瓶水', '十串肉和一瓶水', '两碗面条'], a: 0 },
    { q: '我学孙师傅问客人什么？', o: ['要不要加十串', '你是哪国人', '你吃饱了吗'], a: 0 },
    { q: '最后孙师傅为什么很高兴？', o: ['肉都卖完了', '客人都走了', '我会做饭了'], a: 0 }
  ],
  blanks: [
    { s: 2, t: '帮我一下', d: ['送我回家', '请我喝水', '给我打车'] },
    { s: 4, t: '两瓶水', d: ['两本水', '两件水', '两只水'] },
    { s: 6, t: '别急，别急', d: ['再见，再见', '谢谢，谢谢', '好吃，好吃'] },
    { s: 8, t: '要不要加', d: ['要不要走', '要不要睡', '要不要哭'] },
    { s: 10, t: '卖完了', d: ['写完了', '看完了', '听完了'] },
    { s: 11, t: '不要钱', d: ['不好吃', '不能吃', '不太好'] }
  ]
});
