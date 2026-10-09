/* 故 Stories · HSK 2 · 王奶奶 */
window.STORIES.push({
  id: 'hsk2-wang-cat', hsk: 2, chars: ['wang'],
  title: ['王奶奶的猫', "Grandma Wang's Cat"],
  names: ['王奶奶', '白白', '曲水亭街'],
  new: [],
  text: [
    ['星期天下午，王奶奶来我家找我。', 'On Sunday afternoon, Grandma Wang came to my place looking for me.'],
    ['“孩子，你看见我的猫了吗？它一个上午都没回家！”', '"Child, have you seen my cat? It hasn\'t come home all morning!"'],
    ['奶奶的猫叫白白，很白，很可爱，最喜欢睡觉。', "Grandma's cat is called Baibai. It's very white, very cute, and loves sleeping more than anything."],
    ['我们马上一起出去找它，从曲水亭街走到了河边。', 'We went out together right away to look for it, walking from Qushuiting Street all the way to the river.'],
    ['我问了很多人：“你们看见一只白猫了吗？”', 'I asked lots of people: "Have you seen a white cat?"'],
    ['大家都说：“没看见。”', 'Everyone said: "Haven\'t seen it."'],
    ['奶奶走累了。我说：“奶奶，我们先回家喝一点儿水吧。”', 'Grandma was worn out from walking. I said: "Grandma, let\'s go home first and drink some water."'],
    ['我打开我房间的门，一看，就笑了。', 'I opened the door to my room, took one look, and burst out laughing.'],
    ['白白就在我的床上，睡得很舒服！', 'Baibai was right there on my bed, sleeping very comfortably!'],
    ['原来早上我出门的时候没关门，它自己走进来了。', "It turned out that when I went out in the morning I didn't close the door, and it just walked in by itself."],
    ['奶奶也笑了：“孩子，它喜欢你的床，也喜欢你！”', 'Grandma laughed too: "Child, it likes your bed, and it likes you too!"'],
    ['晚上，奶奶给我拿来一大碗面条：“孩子，吃了吗？谢谢你帮我找猫！”', 'That evening, Grandma brought me a big bowl of noodles: "Child, have you eaten? Thank you for helping me look for the cat!"']
  ],
  chunks: [
    ['出去找', 'to go out and look for', '出去 (go out) + 找 (look for). 出去找它 = go out looking for it.'],
    ['一只白猫', 'a white cat', '只 is the measure word for most animals: 一只猫, 一只狗, 一只鸟.'],
    ['喝一点儿水', 'to drink a little water', 'Verb + 一点儿 softens a suggestion: 吃一点儿东西, 喝一点儿水.'],
    ['睡得很舒服', 'to sleep very comfortably', 'Verb + 得 + how: 睡得很舒服, 走得很快, 说得很好.'],
    ['原来', 'so it turns out', 'Starts the explanation of a surprise: 原来… = so that\'s why…'],
    ['一大碗', 'a big bowl', '一 + 大 + measure word: 一大碗面条, 一大杯水.']
  ],
  qs: [
    { q: '王奶奶为什么来找我？', o: ['她的猫没回家', '她想请我吃饭', '她要去医院'], a: 0 },
    { q: '白白最后在哪儿？', o: ['在我的床上', '在河边', '在奶奶家里'], a: 0 },
    { q: '白白是怎么进我房间的？', o: ['我没关门，它自己走进来了', '奶奶带它来了', '我在河边找到了它'], a: 0 },
    { q: '晚上奶奶给了我什么？', o: ['一大碗面条', '一只猫', '一杯水'], a: 0 }
  ],
  blanks: [
    { s: 3, t: '出去找', d: ['出去吃', '出去买', '出去卖'] },
    { s: 4, t: '一只', d: ['一本', '一件', '一杯'] },
    { s: 6, t: '喝一点儿水', d: ['看一点儿书', '写一点儿字', '买一点儿菜'] },
    { s: 8, t: '睡得很舒服', d: ['跑得很快', '写得很好', '说得很好'] },
    { s: 9, t: '没关门', d: ['没吃饭', '没睡觉', '没上课'] },
    { s: 11, t: '一大碗', d: ['一大杯', '一大本', '一大件'] }
  ]
});
