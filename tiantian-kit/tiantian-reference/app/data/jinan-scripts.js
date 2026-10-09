/* 天天 · Jinan conversation scripts: characters. Quests live in data/scripts/<district>.js.
   Every line is [Chinese, English]. See talk.js for how scripts are matched. */
window.JINAN_SCRIPTS = { quests: {}, characters: {
  wang: {
    meet: [['孩子，你好！我姓王，你叫我王奶奶就行。', 'Hello, child! My surname is Wang. Just call me Grandma Wang.'],
      ['你好啊，孩子！我是王奶奶，就住在这儿。', "Hello there, child! I'm Grandma Wang. I live right here."]],
    hello: {
      1: [['孩子，又见面了！吃了吗？', 'We meet again, child! Have you eaten?'], ['哎，是你啊，孩子！', "Oh, it's you, child!"]],
      2: [['孩子来了！吃了吗？没吃就来奶奶家吃！', "My child's here! Have you eaten? If not, come eat at Grandma's!"], ['孩子，今天累不累？多穿点儿！', 'Child, tired today? Wear more layers!']],
      3: [['我的好孩子来了！我孙子还问你呢！', 'My dear child is here! My grandson was asking about you!'], ['孩子，奶奶给你包了饺子，一会儿拿回去！', 'Child, Grandma made you dumplings. Take some home later!']]
    },
    huh: [['啊？孩子，慢慢来，再说一遍。', 'Huh? Take your time, child. Say it again.'], ['奶奶耳朵不好，你再说一遍？', "Grandma's ears aren't so good. Say it again?"], ['慢慢来，孩子，不着急。', 'Take your time, child. No rush.']],
    thx: [['谢什么，孩子！', 'No need to thank me, child!'], ['不客气，不客气！', "You're welcome, you're welcome!"]],
    wait: [['孩子，别急着走嘛！', "Child, don't rush off!"]],
    bye: [['孩子，慢走！多穿点儿！', 'Take care, child! Dress warmly!']],
    talk: { ate: [['吃了就好，吃了就好！', "Good, you've eaten. Good!"]], notate: [['还没吃？孩子，这可不行！', "Not eaten yet? Child, that won't do!"]] }
  },
  zhang: {
    meet: [['你好！我姓张，以前是历史老师。你叫我张老师吧。', 'Hello! My surname is Zhang. I used to teach history. Call me Teacher Zhang.']],
    hello: {
      1: [['你好，你好！又见面了。', 'Hello, hello! We meet again.']],
      2: [['来了？今天我们学点儿什么呢？', "You're here? What shall we learn today?"], ['你好！最近中文学得怎么样？', 'Hello! How is your Chinese coming along?']],
      3: [['老朋友来了！一会儿喝杯茶，下盘棋？', 'My old friend is here! Tea and a game of chess later?']]
    },
    huh: [['嗯？请你再说一遍。', 'Hm? Please say that again.'], ['慢慢说，不着急。', 'Speak slowly, no rush.'], ['这句话我没听懂。你换个说法？', "I didn't understand that. Try saying it another way?"]],
    thx: [['不客气，不客气。', "You're welcome, you're welcome."], ['不用谢！', 'No need to thank me!']],
    wait: [['等一下，我们还没说完呢。', "Wait, we haven't finished."]],
    bye: [['再见！路上小心。', 'Goodbye! Take care on the way.']]
  },
  lu: {
    meet: [['你好！我是吕老师，你的中文老师。', "Hello! I'm Teacher Lü, your Chinese teacher."]],
    hello: {
      1: [['你好！请坐。', 'Hello! Please sit down.']],
      2: [['你好！你的中文越来越好了！', 'Hello! Your Chinese keeps getting better!']],
      3: [['来了？今天我们说难一点儿的中文，好吗？', "You're here? Let's speak some harder Chinese today, OK?"]]
    },
    huh: [['没关系，慢慢说。', "It's OK, speak slowly."], ['再说一遍，好吗？', 'Say it once more, OK?'], ['嗯……你想说什么？用简单的话说。', 'Hm… what do you want to say? Use simple words.']],
    thx: [['不客气！很好！', "You're welcome! Very good!"]],
    wait: [['等一下，我们还没说完。', "Wait, we're not finished."]],
    bye: [['再见！明天见！', 'Goodbye! See you tomorrow!']]
  },
  su: {
    meet: [['你……你好！我叫苏明，大家都叫我小苏。', 'H-hello! My name is Su Ming. Everyone calls me Xiao Su.']],
    hello: {
      1: [['啊，你好！真巧！', 'Ah, hello! What a coincidence!']],
      2: [['嘿，你好！今天学了什么新词？', 'Hey! What new words did you learn today?']],
      3: [['老朋友！你来了，太好了！', "Old friend! You're here, great!"]]
    },
    huh: [['啊？什么意思？', 'Huh? What do you mean?'], ['这个……我没听懂。再说一遍？', "Um… I didn't get that. Say it again?"], ['等等，你说什么？', 'Wait, what did you say?']],
    thx: [['不客气！', "You're welcome!"], ['小事儿！', 'No big deal!']],
    wait: [['等一下！还没说完呢！', "Wait! We're not done yet!"]],
    bye: [['再见！', 'Bye!']]
  },
  xie: {
    meet: [['哈哈，你好！我叫谢婷，叫我小谢就行！', "Haha, hi! I'm Xie Ting. Just call me Xiao Xie!"]],
    hello: {
      1: [['哈哈，是你啊！', "Haha, it's you!"]],
      2: [['嘿！走吧，今天干什么？', "Hey! Let's go. What are we doing today?"]],
      3: [['哈哈，又迟到了吧？开玩笑的！', 'Haha, late again, huh? Just kidding!']]
    },
    huh: [['啊？真的假的？你说什么？', 'Huh? Seriously? What did you say?'], ['哈哈，我没听懂！', "Haha, I didn't get that!"], ['什么？再说一遍！', 'What? Say it again!']],
    thx: [['没问题！', 'No problem!'], ['哈哈，谢什么！', 'Haha, no need to thank me!']],
    wait: [['哎，别走啊！', "Hey, don't go!"]],
    bye: [['拜拜！', 'Bye-bye!']]
  },
  sun: {
    meet: [['来了！朋友，我姓孙，大家都叫我孙师傅！', 'Coming! Friend, my surname is Sun. Everyone calls me Master Sun!']],
    hello: {
      1: [['来了！朋友，又是你！', 'Coming! Friend, you again!']],
      2: [['来了！朋友，老样子？', 'Coming! Friend, the usual?']],
      3: [['朋友来了！今天多给你加点儿！', "My friend's here! Extra for you today!"]]
    },
    huh: [['啊？朋友，再说一遍？', 'Huh? Say that again, friend?'], ['太吵了，听不清！大点儿声！', "Too noisy, can't hear you! Louder!"], ['什么？你要什么？', 'What? What do you want?']],
    thx: [['不客气，朋友！', "You're welcome, friend!"], ['客气啥！', 'No need to be polite!']],
    wait: [['朋友，别走啊！', "Friend, don't go!"]],
    bye: [['慢走，朋友！下次再来！', 'Take care, friend! Come again!']]
  },
  lin: {
    meet: [['您好！我姓林，叫我林姐就行。', 'Hello! My surname is Lin. Just call me Sister Lin.']],
    hello: {
      1: [['您好！又见面了。', 'Hello! We meet again.']],
      2: [['你好！又是你呀，最近怎么样？', 'Hi! You again. How have you been?']],
      3: [['哎，邻居！最近好吗？', 'Hey, neighbor! How are things?']]
    },
    huh: [['不好意思，请您再说一遍？', 'Sorry, could you say that again?'], ['对不起，我没听明白。', "Sorry, I didn't quite understand."], ['请问您是说……？', 'Do you mean…?']],
    thx: [['不客气！', "You're welcome!"], ['应该的！', 'My pleasure!']],
    wait: [['等一下，还没好呢。', "One moment, it's not done yet."]],
    bye: [['慢走！欢迎再来！', 'Take care! Come again!']]
  },
  pan: {
    meet: [['你好！我姓潘，大家都叫我老潘。你是哪国人？', 'Hi! My surname is Pan. Everyone calls me Old Pan. Where are you from?']],
    hello: {
      1: [['哎，是你啊！我跟你说，今天又堵死了！', "Hey, it's you! Let me tell you, traffic is jammed again today!"]],
      2: [['老朋友！最近怎么样？', 'Old friend! How have you been?']],
      3: [['哈哈，老朋友！有事就给我打电话！', 'Haha, old friend! Call me if you ever need anything!']]
    },
    huh: [['啊？你说啥？', 'Huh? What did you say?'], ['我跟你说，我没听懂！再说一遍！', "Let me tell you, I didn't get that! Again!"], ['什么？车太吵了！', "What? The car's too noisy!"]],
    thx: [['客气啥！', 'No need to be polite!'], ['不客气，不客气！', "You're welcome, you're welcome!"]],
    wait: [['哎，别急！', "Hey, don't rush!"]],
    bye: [['再见！有事给我打电话！', 'Bye! Call me if you need anything!']],
    talk: { country: [['{country}人啊！我跟你说，我最喜欢{country}人了！', 'From {country}! Let me tell you, I love people from {country}!']], married: [['哦！我跟你说，我结婚三十年了！', "Oh! Let me tell you, I've been married thirty years!"]] }
  },
  chen: {
    meet: [['你好。我姓陈。下一位。', 'Hello. My surname is Chen. Next.']],
    hello: {
      1: [['你好。下一位。', 'Hello. Next.']],
      2: [['又是你？', 'You again?'], ['……又是你。你好。', '…You again. Hello.']],
      3: [['又是你！（她笑了）你好。', 'You again! (She smiles.) Hello.']]
    },
    huh: [['什么？说清楚。', 'What? Speak clearly.'], ['听不懂。再说一遍。', "Don't understand. Again."], ['下一位……哦，你还没说完？', "Next… oh, you're not finished?"]],
    thx: [['不客气。', "You're welcome."]],
    wait: [['还没好。', 'Not done yet.']],
    bye: [['再见。下一位。', 'Goodbye. Next.']],
    talk: { country: [['{country}。好。', '{country}. OK.']], name: [['{name}。好。', '{name}. OK.']] }
  },
  bai: {
    meet: [['你好。我姓白。别着急，慢慢来。', "Hello. My surname is Bai. Don't rush, take your time."]],
    hello: {
      1: [['你好，又见面了。', 'Hello, we meet again.']],
      2: [['你好！最近身体怎么样？', 'Hello! How have you been feeling?']],
      3: [['你好！见到你真高兴。', "Hello! It's so good to see you."]]
    },
    huh: [['别着急，慢慢说。', "Don't worry, speak slowly."], ['我没听懂。你能再说一遍吗？', "I didn't understand. Could you say it again?"]],
    thx: [['不客气。', "You're welcome."]],
    wait: [['等一下，还有一个问题。', "One moment, one more question."]],
    bye: [['再见！多喝水，多休息。', 'Goodbye! Drink lots of water and rest.']]
  }
} };
