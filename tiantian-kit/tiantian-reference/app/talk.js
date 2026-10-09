'use strict';
/* 天天 · offline conversation engine for Jinan quests. Pure logic, no DOM (also runs in Node for the validator).

   A quest script (data/jinan-scripts.js) is a set of STEPS; each step completes one objective.
   The learner types freely; the engine:
     1. spots mistakes with rules (pinyin instead of characters, English words, measure words, word order, …)
        and with the quest's own known mistakes, then matches the CORRECTED sentence, so meaning is accepted;
     2. finds the step(s) whose patterns match, ticks their objectives and answers with one of the step's lines;
     3. otherwise tries the quest's extra lines, small talk and generic intents (thanks, bye, "say it again"…);
     4. otherwise the character is confused, and suggestions appear (1 after the first miss, 3 after that).

   Pattern syntax (step.m): a list of alternatives; each is space-separated TERMS that must all appear (any order).
     term   = alt|alt|alt      any of these substrings
     !term  = none of these may appear
     @name  = macro (see MACROS), {slot} = a value the engine captures (number, color, size, drink, country, day, time, name)
   NPC lines are [zh, en] or [zh, en, { ask, card }]. Lines may use {slot} or {slot|fallback} and {n*3} (arithmetic on n).
   ask = { yes: [zh, en, {obj}], no: [zh, en, {obj}] }: a yes/no question; the learner's yes/no picks the branch. */
(function (root) {
  const MACROS = {
    hi: '你好|您好|早上好|早安|上午好|中午好|下午好|晚上好|嗨|哈喽|哈啰|大家好|早|奶奶好|老师好|师傅好|阿姨好|叔叔好|大夫好|医生好|姐好|哥好|同学好',
    thx: '谢谢|多谢|谢了|感谢|谢啦',
    bye: '再见|拜拜|回见|回头见|下次见|明天见|一会儿见|周末见|慢走|改天见|下周见|下星期见',
    yes: '好|行|可以|要|对|是|没问题|当然|嗯|ok|好啊|好吧|加',
    no: '不要|不用|不了|算了|没有|不行|不想|别|不',
    price: '多少钱|几块|几元|怎么卖|什么价|价钱|价格|多贵|一共',
    want: '要|想要|来|买|想买|给我|点|想吃|想喝|拿',
    pay: '付钱|付款|给你钱|给您钱|买单|结账|扫码|微信|支付宝|现金|钱给|给你|给您|刷卡|付',
    where: '哪儿|哪里|在哪|怎么走|怎么去',
    when: '什么时候|几点|哪天|星期几|多久|多长时间',
    please: '请问|请|麻烦|打扰|不好意思|劳驾'
  };
  const NO_RX = /^没|没[\u3400-\u9fff]过|还没|从来没|不要|不用|不了|算了|没有|没带|没去|没看|没学|不行|不想|^别|^不|不加|别加|不需要|不懂|没懂|不明白|没听懂|听不懂|不太|不会|不喜欢|不能|不可以|不对|不是|不吃|不喝|有点|有一点|太[大小贵辣远]/;
  const YES_RX = /^(好|好的|好啊|好吧|行|可以|要|要的|对|对的|是|是的|没问题|当然|嗯|ok|加|来一个|加一个|需要|想|懂|明白|知道|听懂|记住|能|会|喜欢|有(?!点)|像|带了|吃过|吃了|看了|看过|学过|去过|合适|正好)|[了过]$/;

  // ------------------------------------------------------------ lexicons for {slots}
  const LEX = {
    color: [['红色', 'red'], ['红的', 'red'], ['蓝色', 'blue'], ['蓝的', 'blue'], ['白色', 'white'], ['白的', 'white'], ['黑色', 'black'], ['黑的', 'black'], ['绿色', 'green'], ['绿的', 'green'],
      ['黄色', 'yellow'], ['灰色', 'gray'], ['粉色', 'pink'], ['粉红色', 'pink'], ['紫色', 'purple'], ['咖啡色', 'brown'], ['棕色', 'brown'], ['红', 'red'], ['蓝', 'blue'], ['白', 'white'], ['黑', 'black'], ['绿', 'green']],
    size: [['特大号', 'XXL'], ['加大号', 'XL'], ['大号', 'large'], ['中号', 'medium'], ['小号', 'small'], ['xxl', 'XXL'], ['xl', 'XL'], ['l号', 'L'], ['m号', 'M'], ['s号', 'S']],
    drink: [['矿泉水', 'mineral water'], ['绿茶', 'green tea'], ['红茶', 'black tea'], ['花茶', 'jasmine tea'], ['奶茶', 'milk tea'], ['咖啡', 'coffee'], ['可乐', 'cola'], ['啤酒', 'beer'], ['果汁', 'juice'],
      ['豆浆', 'soy milk'], ['牛奶', 'milk'], ['雪碧', 'Sprite'], ['酸梅汤', 'plum juice'], ['白酒', 'baijiu'], ['茶', 'tea'], ['水', 'water']],
    country: [['美国', 'America'], ['英国', 'Britain'], ['加拿大', 'Canada'], ['澳大利亚', 'Australia'], ['新西兰', 'New Zealand'], ['爱尔兰', 'Ireland'], ['法国', 'France'], ['德国', 'Germany'],
      ['意大利', 'Italy'], ['西班牙', 'Spain'], ['葡萄牙', 'Portugal'], ['荷兰', 'the Netherlands'], ['瑞典', 'Sweden'], ['挪威', 'Norway'], ['丹麦', 'Denmark'], ['芬兰', 'Finland'], ['瑞士', 'Switzerland'],
      ['波兰', 'Poland'], ['俄罗斯', 'Russia'], ['日本', 'Japan'], ['韩国', 'Korea'], ['印度', 'India'], ['泰国', 'Thailand'], ['越南', 'Vietnam'], ['新加坡', 'Singapore'], ['马来西亚', 'Malaysia'],
      ['巴西', 'Brazil'], ['墨西哥', 'Mexico'], ['阿根廷', 'Argentina'], ['南非', 'South Africa'], ['埃及', 'Egypt'], ['以色列', 'Israel'], ['土耳其', 'Turkey'], ['菲律宾', 'the Philippines'], ['印度尼西亚', 'Indonesia']],
    day: [['今天', 'today'], ['明天', 'tomorrow'], ['后天', 'the day after tomorrow'], ['这个周末', 'this weekend'], ['周末', 'the weekend'], ['星期一', 'Monday'], ['星期二', 'Tuesday'], ['星期三', 'Wednesday'],
      ['星期四', 'Thursday'], ['星期五', 'Friday'], ['星期六', 'Saturday'], ['星期天', 'Sunday'], ['星期日', 'Sunday'], ['周一', 'Monday'], ['周二', 'Tuesday'], ['周三', 'Wednesday'], ['周四', 'Thursday'],
      ['周五', 'Friday'], ['周六', 'Saturday'], ['周日', 'Sunday'], ['礼拜六', 'Saturday'], ['礼拜天', 'Sunday']],
    spice: [['不辣', 'not spicy'], ['微辣', 'mildly spicy'], ['中辣', 'medium spicy'], ['特辣', 'extra spicy'], ['很辣', 'very spicy'], ['一点辣', 'a little spicy'], ['一点儿辣', 'a little spicy'], ['辣', 'spicy']]
  };
  const MEASURES = '个张件本杯瓶碗位双辆只条把块份串台部盒包斤次口';

  // ------------------------------------------------------------ numbers
  const DIG = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  function zhToNum(s) {
    if (/^\d+$/.test(s)) return +s;
    let total = 0, cur = 0;
    for (const ch of s) {
      if (ch in DIG) cur = DIG[ch];
      else if (ch === '十') { total += (cur || 1) * 10; cur = 0; }
      else if (ch === '百') { total += (cur || 1) * 100; cur = 0; }
      else if (ch === '千') { total += (cur || 1) * 1000; cur = 0; }
      else if (ch === '万') { total = (total + cur) * 10000; cur = 0; }
    }
    return total + cur;
  }
  function numZh(n, liang) {
    n = Math.round(n);
    if (n === 2 && liang) return '两';
    const d = '零一二三四五六七八九';
    if (n < 10) return d[n];
    if (n < 20) return '十' + (n % 10 ? d[n % 10] : '');
    if (n < 100) return d[Math.floor(n / 10)] + '十' + (n % 10 ? d[n % 10] : '');
    if (n < 1000) { const r = n % 100; return (n >= 200 && n < 300 && liang ? '两' : d[Math.floor(n / 100)]) + '百' + (r === 0 ? '' : r < 10 ? '零' + d[r] : (r < 20 ? '一' : '') + numZh(r)); }
    if (n < 10000) { const r = n % 1000; return d[Math.floor(n / 1000)] + '千' + (r === 0 ? '' : r < 100 ? '零' + numZh(r) : numZh(r)); }
    return String(n);
  }
  // first quantity-like number in a normalized string (skips 一起/一下/第一/星期一…)
  function findNum(s) {
    const rx = /\d+|[零〇一二两三四五六七八九十百千]+/g; let m;
    while ((m = rx.exec(s))) {
      const before = s.slice(Math.max(0, m.index - 2), m.index), after = s.slice(m.index + m[0].length, m.index + m[0].length + 1);
      if (/第|星期|周|礼拜$/.test(before) || /^(第|星期)/.test(before.slice(-2))) continue;
      if (m[0] === '一' && /^[起下点共样定直些会边路切般半]/.test(after)) continue;
      if (/^[点号月]/.test(after) && !/^点儿/.test(s.slice(m.index + m[0].length))) continue;   // times and dates are not quantities
      return { v: zhToNum(m[0]), raw: m[0], i: m.index };
    }
    return null;
  }
  function findTime(s) {
    const m = s.match(/(早上|上午|中午|下午|晚上)?([零一二两三四五六七八九十\d]+)点(半|[零一二三四五六七八九十\d]+分|一刻|三刻)?/);
    if (!m) return null;
    let h = zhToNum(m[2]), min = !m[3] ? 0 : m[3] === '半' ? 30 : m[3] === '一刻' ? 15 : m[3] === '三刻' ? 45 : zhToNum(m[3].replace('分', ''));
    if (h > 24) return null;
    const pm = /下午|晚上/.test(m[1] || '') && h < 12;
    return { zh: m[0], en: `${pm ? h : h}:${String(min).padStart(2, '0')}${m[1] ? (pm ? ' pm' : /上午|早上/.test(m[1]) ? ' am' : '') : ''}`, v: h * 60 + min };
  }

  // ------------------------------------------------------------ text helpers
  const HAN = /[㐀-鿿]/;
  const norm = (s) => String(s || '').normalize('NFKC').toLowerCase().replace(/[\s，。！？、,.!?~～…;；:："“”'‘’（）()\-—·《》]/g, '');
  const pick = (arr, seed) => (Array.isArray(arr) && arr.length ? arr[Math.floor((seed === undefined ? Math.random() : seed) * arr.length) % arr.length] : null);
  const stripTones = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[1-5]/g, '').replace(/ü|v/g, 'u');
  let PY = null;   // set by init: (text) => array of toneless syllables
  let PYM = null;  // set by init: (text) => pinyin with tone marks, for notes
  const pyArr = (s) => (PY ? PY(s).map((x) => stripTones(String(x).toLowerCase())) : []);
  const pyStr = (s) => pyArr(s).join('');
  const pyCache = new Map();
  // sound-space strings are space-delimited syllables (" zai jian "), so matches stay on syllable boundaries
  const pySp = (s) => ' ' + pyArr(s).join(' ') + ' ';
  const pyOfAlt = (a) => { if (!pyCache.has(a)) pyCache.set(a, pySp(a)); return pyCache.get(a); };

  // ------------------------------------------------------------ patterns
  function expand(term) {
    return term.split('|').flatMap((a) => (a[0] === '@' && MACROS[a.slice(1)] ? MACROS[a.slice(1)].split('|') : [a])).filter(Boolean);
  }
  function captureSlot(name, s, raw) {
    if (name === 'n') { const n = findNum(s); return n ? { zh: n.raw, en: String(n.v), v: n.v } : null; }
    if (name === 'time') return findTime(s);
    if (name === 'name') {
      const m = String(raw || '').match(/(?:我叫|我的名字是|我的名字叫|名字是|叫我)\s*([A-Za-z][A-Za-z\-']{0,15}|[㐀-鿿]{1,4})/);
      if (!m) return null;
      let v = m[1].replace(/[吗呢吧啊了。！]$/, '');
      return { zh: v, en: v };
    }
    const lex = LEX[name]; if (!lex) return null;
    let best = null;
    for (const [zh, en] of lex) { const i = s.indexOf(zh); if (i >= 0 && (!best || zh.length > best.zh.length)) best = { zh, en, i }; }
    return best;
  }
  // Does one alternative (space-separated terms) match? Returns { score, slots } or null.
  function matchAlt(alt, s, raw, pyMode) {
    let score = 0, words = 0; const slots = {};
    for (let term of alt.trim().split(/\s+/)) {
      const neg = term[0] === '!'; if (neg) term = term.slice(1);
      const slot = term.match(/^\{(\w+)\}$/);
      if (slot) {
        if (pyMode) return null;   // slots can't be read in sound space, so this alternative can't match there
        const v = captureSlot(slot[1], s, raw);
        if (!v) return null;
        slots[slot[1]] = v; score += 2; words++; continue;
      }
      const alts = expand(term);
      let hit = null;
      for (const a of alts) {
        const na = norm(a);
        if (pyMode && !neg && [...na].length < 2) continue;   // one syllable is too ambiguous by sound (岛/道, 右/有)
        const ok = pyMode ? (pyOfAlt(na).trim() && s.includes(pyOfAlt(na))) : s.includes(na);
        if (ok && (!hit || na.length > hit.length)) hit = na;
      }
      if (neg) { if (hit) return null; continue; }
      if (!hit) return null;
      score += hit.length; words++;
    }
    if (!words) return null;   // an alternative made only of slots/exclusions must not match on its own in sound space
    return { score, slots };
  }
  function matchPatterns(list, s, raw, pyMode) {
    let best = null; const slots = {};
    for (const alt of list || []) {
      const r = matchAlt(alt, s, raw, pyMode); if (!r) continue;
      Object.assign(slots, r.slots);   // keep slot values from every matching alternative
      if (!best || r.score > best.score) best = r;
    }
    return best && { score: best.score, slots };
  }

  // ------------------------------------------------------------ corrections (rules; at most one per message)
  // Each rule: (raw) => { original, corrected, note, from, to } or null. from/to rewrite the sentence before matching.
  const NOUN_MW = {
    票: '张', 门票: '张', 车票: '张', 火车票: '张', 电影票: '张', 地图: '张', 桌子: '张', 照片: '张', 卡: '张', 床: '张', 纸: '张', 名片: '张',
    衬衫: '件', 衣服: '件', 外套: '件', 毛衣: '件', 事: '件', 礼物: '件',
    书: '本', 杂志: '本', 词典: '本', 本子: '本',
    茶: '杯', 咖啡: '杯', 奶茶: '杯', 豆浆: '杯', 果汁: '杯', 水: '瓶', 矿泉水: '瓶', 啤酒: '瓶', 可乐: '瓶',
    米饭: '碗', 面条: '碗', 面: '碗', 汤: '碗', 甜沫: '碗', 粥: '碗',
    油旋: '个', 煎饼: '个', 包子: '个', 苹果: '个', 鸡蛋: '个', 汉堡: '个', 西瓜: '个', 朋友: '个', 问题: '个', 房间: '个',
    鞋: '双', 筷子: '双', 袜子: '双', 车: '辆', 自行车: '辆', 出租车: '辆', 狗: '只', 猫: '只', 鸟: '只',
    鱼: '条', 裤子: '条', 裙子: '条', 路: '条', 船: '条', 伞: '把', 雨伞: '把', 椅子: '把', 钥匙: '把', 手机: '部', 电脑: '台'
  };
  const MW_OK = { 水: '瓶杯', 啤酒: '瓶杯', 可乐: '瓶杯', 豆浆: '杯碗', 船: '条只', 手机: '部个', 汤: '碗份', 面条: '碗份', 米饭: '碗份', 礼物: '件个份', 问题: '个', 房间: '个间' };
  const STRICT_MW = { 票: 1, 门票: 1, 车票: 1, 火车票: 1, 衬衫: 1, 衣服: 1, 书: 1, 米饭: 1, 面条: 1, 茶: 1, 鞋: 1, 照片: 1, 地图: 1 };
  const NUM = '[一二两三四五六七八九十几百\\d]+';
  const nounAlt = Object.keys(NOUN_MW).sort((a, b) => b.length - a.length).join('|');
  const FOODS = '面包|米饭|饭|菜|包子|饺子|面条|煎饼|油旋|汉堡|肉|把子肉|鸡蛋|水果|苹果|蛋糕|饼干|零食|串|烤串|羊肉串|早饭|午饭|晚饭';
  const DRINKS = '水|茶|咖啡|可乐|啤酒|果汁|牛奶|豆浆|酒|奶茶|饮料|矿泉水';
  const ADJ = '高兴|饿|累|忙|渴|冷|热|开心|好|困|饱|紧张|舒服|不舒服';
  const SLANG = [['神马', '什么', '神马 is internet slang for 什么 (what). Say 什么.'], ['肿么', '怎么', '肿么 is internet slang for 怎么 (how). Say 怎么.'],
    ['酱紫', '这样子', '酱紫 is internet slang for 这样子 (like this).'], ['表酱紫', '不要这样子', '表酱紫 is internet slang for 不要这样子.'], ['木有', '没有', '木有 is internet slang for 没有.'],
    ['伦家', '人家', '伦家 is slang for 人家.'], ['偶们', '我们', '偶们 is slang for 我们.'], ['油墨', '有没有', ''], ['3q', '谢谢', '3Q is slang. Say 谢谢.'], ['88', '再见', '88 (bye-bye) is slang. Say 再见.']].filter((x) => x[2]);
  const RULES = [
    // English "it" calque: 它需要多长时间 → 要多长时间
    (t) => { const m = t.match(/^它(需要|要)(多长时间|多久|多少钱|几分钟|多少分钟)/); return m && { original: m[0], corrected: '要' + m[2], note: `Chinese doesn't need "it" here, and 要 sounds more natural than 需要: 要${m[2]}？` }; },
    (t) => { for (const [a, b, note] of SLANG) if (t.includes(a)) return { original: a, corrected: b, note }; return null; },
    // 二 + measure word → 两
    (t) => { const m = t.match(new RegExp(`(^|[^十第\\d零一二三四五六七八九])二(${'[' + MEASURES + ']'})`)); return m && { original: '二' + m[2], corrected: '两' + m[2], note: 'Before a measure word, "two" is 两, not 二.' }; },
    // number + noun with no measure word
    (t) => {
      const m = t.match(new RegExp(`(^|[^第])(${NUM})(${nounAlt})`)); if (!m) return null;
      const num = m[2], noun = m[3];
      if (num === '一' && /^(下|点|起|共|样|定|些|路)/.test(noun)) return null;
      if (/^(路|街|道|环)/.test(noun) && m.index + m[1].length > 0 && /[\u3400-\u9fff]/.test(t[m.index + m[1].length - 1] || '')) return null;   // road names: 经十路, 二环路
      const mw = NOUN_MW[noun];
      return { original: num + noun, corrected: num + mw + noun, note: `Numbers need a measure word: ${num}${mw}${noun}.` };
    },
    // 个 used where a specific measure word is expected
    (t) => {
      const m = t.match(new RegExp(`(${NUM})个(${nounAlt})`)); if (!m || !STRICT_MW[m[2]] || NOUN_MW[m[2]] === '个') return null;
      const mw = NOUN_MW[m[2]];
      const why = { 张: 'flat things like tickets, photos and maps', 件: 'clothes', 本: 'books', 碗: 'bowls of food', 杯: 'cups of a drink', 双: 'pairs' }[mw] || 'this noun';
      return { original: `${m[1]}个${m[2]}`, corrected: `${m[1]}${mw}${m[2]}`, note: `${mw} is the measure word for ${why}.` };
    },
    // 喝 + food / 吃 + drink
    (t) => { const m = t.match(new RegExp(`喝(一?[个点些块]?)(${FOODS})`)); return m && { original: '喝' + m[1] + m[2], corrected: '吃' + m[1] + m[2], note: 'Use 吃 (eat) for food; 喝 is for drinks.' }; },
    (t) => { const m = t.match(new RegExp(`吃(一?[杯瓶点些]?)(${DRINKS})(?!果|饭|饺|店)`)); return m && !/吃水果|吃饭/.test(t) && { original: '吃' + m[1] + m[2], corrected: '喝' + m[1] + m[2], note: 'Use 喝 (drink) for drinks; 吃 is for food.' }; },
    // 多钱 → 多少钱
    (t) => { const m = t.match(/(^|[^很好太么少许])多钱/); return m && { original: '多钱', corrected: '多少钱', note: '"How much" is 多少钱.' }; },
    // 不有 → 没有
    (t) => t.includes('不有') && { original: '不有', corrected: '没有', note: '有 is negated with 没: 没有.' },
    // 我是饿 → 我很饿
    (t) => { const m = t.match(new RegExp(`(我|你|他|她|我们|你们)是(很)?(${ADJ})(?![的人吃])`)); return m && { original: m[0], corrected: `${m[1]}很${m[3]}`, note: 'Adjectives don\'t take 是: say 很 + adjective.' }; },
    // 这个是好吃 → 这个很好吃
    (t) => { const m = t.match(/(这个|那个|这|那|它)是(很)?(好吃|好喝|贵|便宜|辣|甜|好看|漂亮|大|小|远|近|难|容易)(?=$|了|啊|吧|吗|呢)/); return m && { original: m[0], corrected: `${m[1]}很${m[3]}`, note: 'Adjectives don\'t take 是: say 很 + adjective.' }; },
    // 付钱用手机 → 用手机付钱
    (t) => { const m = t.match(/(付钱|付款|买单|支付|付)用(微信|支付宝|手机|现金|信用卡|银行卡|饭卡|卡)/); return m && { original: m[0], corrected: `用${m[2]}${m[1]}`, note: 'The "how" comes before the verb: 用 + tool + verb.' }; },
    // 我去学校明天 → 我明天去学校
    (t) => { const m = t.match(/^(我|我们|你|他|她)(要)?(去|来|回|到)([㐀-鿿]{1,8}?)(今天|明天|后天|昨天|星期[一二三四五六天日]|周末|下午|上午|晚上)$/); return m && { original: m[0], corrected: `${m[1]}${m[5]}${m[2] || ''}${m[3]}${m[4]}`, note: 'Time words go before the verb: who + when + do what.' }; },
    // question word + 吗
    (t) => {
      if (!/吗$/.test(t) || /知道|认识|记得|明白|懂|问问|不知/.test(t)) return null;
      const m = t.match(/什么|哪儿|哪里|哪|谁|几|多少|怎么|为什么/); if (!m) return null;
      return { original: t, corrected: t.replace(/吗$/, ''), note: `A question with ${m[0]} doesn't need 吗.` };
    },
    // 叫是 → 叫
    (t) => t.includes('叫是') && { original: '叫是', corrected: '叫', note: 'Say 我叫… or 我的名字是…, not both.' },
    // 在见 / 再看 as goodbye
    (t) => /在见/.test(t) && { original: '在见', corrected: '再见', note: 'Goodbye is 再见 (再 = again), not 在.' },
    (t) => /再看$/.test(t) && /谢谢|好|拜|师傅|老师|明天|下次/.test(t) && { original: '再看', corrected: '再见', note: 'Goodbye is 再见. 再看 means "look again".' },
    // 很 + verb of liking ok; 非常很 → 非常
    (t) => /非常很|很非常/.test(t) && { original: t.match(/非常很|很非常/)[0], corrected: '非常', note: 'Use 很 or 非常, not both.' }
  ];
  // Words that are fine in Latin letters inside Chinese
  const LATIN_OK = /^(ok|wifi|wi|fi|sim|ktv|aa|app|qq|t|s|m|l|xl|xxl|kfc|atm|vip|id|pm|am|a|b|c|d|g|cd|dvd|tv|ipad|iphone)$/i;
  const EN = {
    bag: '袋子', bags: '袋子', food: '吃的', ticket: '票', tickets: '票', water: '水', receipt: '小票', invoice: '发票', card: '卡', wechat: '微信', alipay: '支付宝',
    hello: '你好', hi: '你好', thanks: '谢谢', thank: '谢谢', sorry: '对不起', bye: '再见', goodbye: '再见', yes: '是', no: '不',
    size: '号', small: '小', big: '大', large: '大号', medium: '中号', phone: '手机', taxi: '出租车', hotel: '酒店', train: '火车', station: '车站',
    cool: '酷', photo: '照片', picture: '照片', menu: '菜单', bill: '账单', change: '找钱', money: '钱', cash: '现金', cheap: '便宜', expensive: '贵',
    spicy: '辣', sweet: '甜', delicious: '好吃', tasty: '好吃', tea: '茶', coffee: '咖啡', beer: '啤酒', rice: '米饭', noodles: '面条', egg: '鸡蛋',
    cilantro: '香菜', coriander: '香菜', password: '密码', passport: '护照', address: '地址', minutes: '分钟', hour: '小时', hours: '小时',
    weekend: '周末', tomorrow: '明天', today: '今天', friend: '朋友', teacher: '老师', student: '学生', doctor: '医生', hospital: '医院',
    fever: '发烧', cold: '感冒', headache: '头疼', medicine: '药', homework: '作业', library: '图书馆', book: '书', birthday: '生日',
    gift: '礼物', present: '礼物', color: '颜色', colour: '颜色', blue: '蓝色', red: '红色', white: '白色', black: '黑色', shirt: '衬衫',
    boat: '船', deposit: '押金', gate: '检票口', toilet: '洗手间', bathroom: '洗手间', restroom: '洗手间', metro: '地铁', subway: '地铁',
    line: '号线', stop: '站', package: '快递', parcel: '快递', rent: '房租', internet: '网', video: '视频', party: '聚会', dinner: '晚饭', lunch: '午饭', breakfast: '早饭'
  };
  let enLookup = null;   // optional dictionary fallback, set by init
  function englishRule(raw) {
    if (!HAN.test(raw)) return null;
    // names after 我叫/名字是 and other capitalized words that aren't in the glossary are left alone
    const words = (raw.match(/[A-Za-z][A-Za-z']+/g) || []).filter((w) => !LATIN_OK.test(w) &&
      !new RegExp(`(叫|名字是|名字叫|我是|叫我)\\s*${w}`).test(raw) && !(/^[A-Z]/.test(w) && !EN[w.toLowerCase()]));
    if (!words.length) return null;
    const w = words[0], zh = EN[w.toLowerCase()] || (enLookup && enLookup(w.toLowerCase()));
    if (!zh) return { original: w, corrected: '', note: `Try saying "${w}" in Chinese.`, unknown: true };
    return { original: w, corrected: zh, note: `Say it in Chinese: ${zh}${PYM ? ' (' + PYM(zh) + ')' : ''}.` };
  }

  // ------------------------------------------------------------ pinyin-only input
  let SYL = null;
  function isPinyin(raw) {
    if (HAN.test(raw) || !/[a-zA-Z]/.test(raw)) return false;
    const toks = stripTones(raw.toLowerCase()).replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
    if (!toks.length || !SYL) return false;
    const ok = toks.filter((t) => segment(t)).length;
    return ok / toks.length >= 0.75 && !/\b(the|you|is|are|can|have|what|how|please|thanks|thank|want|need|where|this|that|for|with|and|my|it)\b/i.test(raw);
  }
  // split toneless pinyin into syllables ("nihao" → ["ni","hao"]); null if it isn't pinyin
  function segment(w) {
    if (!w) return [];
    for (let l = Math.min(6, w.length); l > 0; l--) if (SYL && SYL.has(w.slice(0, l))) { const r = segment(w.slice(l)); if (r) return [w.slice(0, l), ...r]; }
    return null;
  }
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m || !n) return Math.max(m, n);
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }

  // ------------------------------------------------------------ templates
  function fill(tpl, slots, me, lang) {
    return String(tpl).replace(/\{([\w.]+)(?:\*(\d+(?:\.\d+)?))?(?:\|([^}]*))?\}/g, (whole, name, mul, fb, off, str) => {
      const v = slots[name] || (me && me[name] ? (typeof me[name] === 'object' ? me[name] : { zh: me[name], en: me[name] }) : null);
      if (!v) return fb !== undefined ? fb : '';
      if (mul !== undefined || name === 'n') {
        const n = (v.v || 0) * (mul !== undefined ? +mul : 1);
        if (lang === 'en') return String(Math.round(n * 100) / 100);
        const next = str[off + whole.length] || '';
        return numZh(n, MEASURES.includes(next) || next === '块');
      }
      return lang === 'en' ? v.en : v.zh;
    });
  }

  // ------------------------------------------------------------ engine
  const GENERIC = {
    thx: [['不客气！', "You're welcome!"], ['不客气。', "You're welcome."], ['没事儿！', 'No problem!']],
    hi: [['你好！', 'Hello!'], ['你好你好！', 'Hello, hello!']],
    wait: [['等一下，还没完呢！', "Wait, we're not done yet!"], ['别急着走嘛！', "Don't rush off!"]],
    repeat: [['好，我再说一遍：', 'OK, I\'ll say it again:']],
    huh: [['啊？你说什么？', 'Huh? What did you say?'], ['不好意思，我没听懂。', "Sorry, I didn't understand."], ['什么？再说一遍？', 'What? Say it again?']],
    zh: [['请说中文吧！', 'Please speak Chinese!'], ['我不会说英语……说中文吧！', "I can't speak English… say it in Chinese!"]],
    bye: [['再见！', 'Goodbye!'], ['慢走！', 'Take care!']],
    again: [['知道了，知道了！', 'I know, I know!'], ['对，你刚才说了。', 'Right, you just said that.'], ['好，没问题，我记得。', "Sure, no problem, I remember."]],
    ok: [['是吗？', 'Really?'], ['嗯嗯。', 'Mm-hm.'], ['哦，这样啊。', 'Oh, I see.']]
  };
  const SMALL = [
    // small talk the learner may offer at any time; characters can override by intent name
    { id: 'name', m: ['{name}'], say: [['{name}，你好！很高兴认识你。', 'Hello, {name}! Nice to meet you.']] },
    { id: 'country', m: ['我是 {country} 人', '我从 {country}', '我来自 {country}', '{country} 人', '我是 {country}'], say: [['{country}人啊！欢迎来济南！', 'From {country}! Welcome to Jinan!']] },
    { id: 'howareyou', m: ['你好吗', '您好吗', '你怎么样', '最近好吗', '最近怎么样', '你身体好吗'], say: [['我很好，谢谢！你呢？', "I'm well, thanks! And you?"]] },
    { id: 'imfine', m: ['我很好', '我也很好', '我挺好', '还不错', '还可以'], say: [['那就好！', 'Good to hear!']] },
    { id: 'ate', m: ['吃了 !没 !吗', '我吃过了', '吃过了'], say: [['那就好！', 'Good!']] },
    { id: 'notate', m: ['还没吃', '没吃', '没有吃'], say: [['还没吃？那可不行！', "Not yet? That won't do!"]] },
    { id: 'student', m: ['我是学生', '我是留学生', '我在山东大学', '我在山大'], say: [['学生啊！好好学习！', 'A student! Study hard!']] },
    { id: 'likejinan', m: ['我喜欢济南', '济南很好', '济南很漂亮', '济南真好', '济南很美'], say: [['真的吗？济南是个好地方！', 'Really? Jinan is a great place!']] },
    { id: 'learning', m: ['我在学中文', '我学习中文', '我学中文', '我的中文不好', '我中文不好', '我会说一点'], say: [['你的中文很好啊！', 'Your Chinese is good!']] },
    { id: 'married', m: ['我结婚了', '我没结婚', '我还没结婚', '我单身'], say: [['哦，这样啊！', 'Oh, I see!']] },
    { id: 'age', m: ['我{n}岁', '我今年{n}'], say: [['{n}岁，年轻啊！', '{n}? So young!']] }
  ];

  function init(opts) {
    PY = opts.py || null; PYM = opts.pyMarks || null;
    enLookup = opts.enLookup || null;
    if (opts.syllables) SYL = new Set(opts.syllables.map((x) => stripTones(x)));
  }

  /* state: { qid, cid, done[], slots{}, misses, pending, last:[zh,en], seed } */
  function newState(script, qid, cid, done) {
    return { qid, cid, done: (done || []).slice(), slots: {}, misses: 0, pending: null, last: null };
  }
  const stepsOf = (script) => script.steps || [];
  // need: an objective id (or list) that must be done first; '*' = every other objective first (e.g. saying goodbye)
  const available = (script, st) => stepsOf(script).filter((s) => !st.done.includes(s.obj) && (!s.need ||
    (s.need === '*' ? stepsOf(script).every((x) => x === s || st.done.includes(x.obj)) : [].concat(s.need).every((n) => st.done.includes(n)))));
  function suggestions(script, st, count) {
    const out = [];
    for (const s of available(script, st)) {
      for (const t of s.try || []) { if (out.length < count && !out.includes(t)) out.push(t); if (out.length >= Math.ceil(count / 2) && count > 1) break; }
      if (out.length >= count) break;
    }
    return out.slice(0, count);
  }
  function nudgeObj(script, st, objectives) {
    const s = available(script, st)[0];
    const o = s && objectives.find((x) => x.id === s.obj);
    return o ? o.text : '';
  }
  const lineOut = (l, slots, me) => (l ? { zh: fill(l[0], slots, me, 'zh'), en: fill(l[1] || '', slots, me, 'en'), opts: l[2] || {} } : null);

  // Find the correction for a message (at most one). Returns { fix, text } where text is the rewritten sentence.
  function correct(raw, script) {
    const t = String(raw).normalize('NFKC').trim();
    const en = englishRule(t);
    if (en && !en.unknown) return { fix: en, text: t.split(en.original).join(en.corrected) };
    for (const [a, b, note] of (script && script.fix) || []) {
      if (t.includes(a) && !t.includes(b)) return { fix: { original: a, corrected: b, note }, text: t.split(a).join(b) };
    }
    const n = t.replace(/[\s，。！？、,.!?]/g, '');
    for (const r of RULES) {
      const f = r(n);
      if (f && f.original && f.corrected && f.original !== f.corrected) return { fix: f, text: n.split(f.original).join(f.corrected) };
    }
    if (en) return { fix: en, text: t };
    return { fix: null, text: t };
  }

  /* respond(script, character, state, text, ctx) → {
       fix, lines:[{zh,en,card}], ticked:[], complete, suggest:[], nudge, miss } */
  function respond(script, ch, st, raw, ctx) {
    ctx = ctx || {}; const me = ctx.me || {}; const objectives = ctx.objectives || [];
    const out = { fix: null, lines: [], ticked: [], complete: false, suggest: [], nudge: '', miss: false };
    raw = String(raw || '').trim(); if (!raw) return out;
    const say = (l) => { const o = lineOut(l, st.slots, me); if (o) { out.lines.push(o); st.last = l; if (o.opts.ask) st.pending = o.opts.ask; } return o; };
    const chLines = (key) => (ch && ch[key] && ch[key].length ? ch[key] : GENERIC[key]);

    // 1. pinyin-only input: match in sound space, correction shows the characters
    if (isPinyin(raw)) {
      const toks = stripTones(raw.toLowerCase()).replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
      const P = toks.join(''), PS = ' ' + toks.flatMap((x) => segment(x) || [x]).join(' ') + ' ';
      let best = null;
      for (const s of available(script, st)) {
        const r = matchPatterns(s.m, PS, raw, true);
        if (r) {
          const tr = (s.try || []).map((t) => ({ t, d: lev(P, pyStr(t)) })).sort((a, b) => a.d - b.d)[0];
          const sc = r.score * 10 - (tr ? tr.d : 0);
          if (!best || sc > best.sc) best = { s, sc, tr };
        }
      }
      if (!best) {   // maybe a try sentence anyway
        for (const s of available(script, st)) for (const t of s.try || []) { const d = lev(P, pyStr(t)) / Math.max(P.length, 1); if (d < 0.3 && (!best || d < best.d)) best = { s, d, tr: { t } }; }
      }
      out.fix = { original: raw, corrected: best ? best.tr.t : '', note: 'Type characters, not pinyin: switch your keyboard to Pinyin – Simplified, type the sounds, then pick the characters.' };
      if (!best) { say(pick(chLines('huh'))); out.miss = true; st.misses++; out.suggest = suggestions(script, st, st.misses > 1 ? 3 : 1); out.nudge = nudgeObj(script, st, objectives); return out; }
      raw = best.tr.t;   // continue as if they had typed the characters
    }

    // 2. corrections; match on the corrected sentence
    const c = correct(raw, script);
    if (!out.fix && c.fix) out.fix = c.fix;
    let s = norm(c.text);
    // greeting someone by name or title: 老潘好, 陈女士好, 王奶奶好 count as hello
    if (/^(老|小)?[\u3400-\u9fff]{1,2}(师傅|老师|奶奶|爷爷|阿姨|叔叔|大夫|医生|姐|哥|女士|先生|同学)?好[啊呀]?$/.test(s) && !/^(很|还|真|太|挺|不|都|也|最|好|你|您|我|他|她)/.test(s)) s += '你好';
    const englishOnly = !HAN.test(raw) && /[a-z]{2,}/i.test(raw) && !isPinyin(raw);
    if (englishOnly) { say(pick(chLines('zh'))); out.miss = true; st.misses++; out.suggest = suggestions(script, st, st.misses > 1 ? 3 : 1); out.nudge = nudgeObj(script, st, objectives); return out; }

    // 3. steps (several objectives can be done in one message)
    const runSteps = (text, pyMode) => {
      const hits = [];
      for (const step of available(script, st)) { const r = matchPatterns(step.m, text, c.text, pyMode); if (r) hits.push({ step, r }); }
      return hits;
    };
    let hits = runSteps(s, false);
    // "give me three, how much?": an order with a price question tacked on. Match the order without the question.
    if (!hits.length) {
      const bare = s.replace(/(一共|总共|那)?(是)?(多少钱|多少|几块钱|几块|怎么卖)(呢|吗|啊)?$/, '');
      if (bare !== s && bare.length >= 2) hits = runSteps(bare, false);
    }
    // homophone typos (在见 → 再见): match in sound space, then show which characters were swapped
    if (!hits.length && PY && HAN.test(s)) {
      const ph = runSteps(pySp(s), true);
      if (ph.length && !out.fix) {
        const ua = [...s], up = pyArr(s);
        outer: for (const alt of ph[0].step.m) for (const term of alt.split(/\s+/)) for (const a of (term[0] === '!' ? [] : expand(term))) {
          const na = norm(a); if (!na || s.includes(na) || /[{]/.test(na)) continue;
          const ap = pyArr(na);
          for (let i = 0; i + ap.length <= up.length; i++) if (ap.every((x, k) => x === up[i + k])) { out.fix = { original: ua.slice(i, i + ap.length).join(''), corrected: na, note: `Same sound, different characters: ${na}.` }; break outer; }
        }
      }
      if (out.fix) hits = ph;
    }
    // a pending yes/no question beats generic matches but not a real step
    const yn = NO_RX.test(s) ? 'no' : (YES_RX.test(s) || YES_RX.test(s.replace(/^(我们|我)(也|都)?/, ''))) ? 'yes' : null;   // 我是游客 → yes
    if (!hits.length && st.pending && yn && st.pending[yn]) {
      // "Have you ever …过吗?" answered with 不 + verb: experience is negated with 没…过
      const q = st.last && String(st.last[0] || '').match(/([\u3400-\u9fff])过吗/);
      const neg = yn === 'no' && q && s.match(new RegExp(`不${q[1]}了?`));
      if (neg && !out.fix) out.fix = { original: neg[0], corrected: `没${q[1]}过`, note: `To say you've never done something, use 没…过: 没${q[1]}过. (${neg[0]} sounds like "I won't ${q[1] === '吃' ? 'eat' : 'do'} it".)` };
      const b = st.pending[yn]; st.pending = null;
      if (b[2] && b[2].obj && available(script, st).some((x) => x.obj === b[2].obj)) { st.done.push(b[2].obj); out.ticked.push(b[2].obj); }
      say(b); st.misses = 0;
      return finish();
    }
    if (hits.length) {
      st.pending = null; st.misses = 0;
      hits.sort((a, b) => stepsOf(script).indexOf(a.step) - stepsOf(script).indexOf(b.step));
      for (const h of hits) {
        Object.assign(st.slots, h.r.slots);
        for (const k of ['name', 'country']) if (h.r.slots[k] && ctx.remember) ctx.remember(k, h.r.slots[k]);
        st.done.push(h.step.obj); out.ticked.push(h.step.obj);
      }
      // reply with the last two matched steps' lines (in order)
      hits.slice(-2).forEach((h) => { const o = say(pick(h.step.say)); if (o && h.step.card) o.card = fillCard(h.step.card, st.slots, me); });
      return finish();
    }

    // 4. something already done, said again: "I know"
    const doneHit = stepsOf(script).find((step) => st.done.includes(step.obj) && !/@(hi|thx|bye)/.test((step.m || []).join(' ')) && matchPatterns(step.m, s, c.text));
    if (doneHit) {
      // a repeated question gets its answer again; a repeated statement gets "I know"
      if (/[吗？?]|多少|几|什么|哪|怎么|多久|多长/.test(c.text)) { say(pick(GENERIC.repeat)); const o = say(pick(doneHit.say)); if (o && doneHit.card) o.card = fillCard(doneHit.card, st.slots, me); }
      else say(pick(chLines('again')));
      out.nudge = nudgeObj(script, st, objectives); return finish(true);
    }
    // 5. quest extras, then character small talk, then generic intents
    for (const e of script.extra || []) { const r = matchPatterns(e.m, s, c.text); if (r) { Object.assign(st.slots, r.slots); say(pick(e.say)); return finish(true); } }
    for (const t of SMALL) {
      const r = matchPatterns(t.m, s, c.text); if (!r) continue;
      Object.assign(st.slots, r.slots);
      for (const k of ['name', 'country']) if (r.slots[k] && ctx.remember) ctx.remember(k, r.slots[k]);
      const own = ch && ch.talk && ch.talk[t.id];
      say(pick(own || t.say)); return finish(true);
    }
    const has = (macro) => expand('@' + macro).some((a) => s.includes(norm(a)));
    if (/再说一遍|再说一次|慢一点|慢点|请再说|听不懂|没听懂|不懂|不明白/.test(s) && st.last) {
      if (/听不懂|没听懂|不懂|不明白/.test(s)) { out.suggest = suggestions(script, st, 2); }
      say(pick(GENERIC.repeat)); say(st.last); return finish(true);
    }
    if (has('thx')) { say(pick(chLines('thx'))); return finish(true); }
    if (has('bye')) { say(pick(chLines('wait'))); out.nudge = nudgeObj(script, st, objectives); return finish(true); }
    if (has('hi') && s.length <= 4) { say(pick(chLines('hi'))); return finish(true); }

    // 6. not understood
    st.misses++; out.miss = true;
    // a longer, well-formed sentence gets a polite "oh really?"; anything else gets "huh?"
    say(pick(chLines((s.match(/[\u3400-\u9fff]/g) || []).length >= 6 && !out.fix ? 'ok' : 'huh')));
    out.suggest = suggestions(script, st, st.misses > 1 ? 3 : 1);
    out.nudge = nudgeObj(script, st, objectives);
    return out;

    function finish(noTick) {
      if (!noTick || out.ticked.length) {
        const all = objectives.length ? objectives.every((o) => st.done.includes(o.id)) : stepsOf(script).every((x) => st.done.includes(x.obj));
        if (all) { out.complete = true; const d = pick(script.done); if (d) say(d); st.pending = null; }
      }
      return out;
    }
  }
  function fillCard(card, slots, me) {
    return { title: fill(card.title || '', slots, me, 'zh'), rows: (card.rows || []).map((r) => r.map((x) => fill(x, slots, me, 'zh'))) };
  }

  /* opening lines when a quest starts: greeting (first meeting = self-introduction; otherwise by arc stage),
     an optional callback to the last quest with them, then the scene's opener. */
  function opening(script, ch, ctx, st) {
    const me = (ctx && ctx.me) || {}; const lines = [];
    // a quest can override the character's greeting (e.g. a phone call): greet = lines, or { meet, hello }
    const own = script.greet;
    const g = Array.isArray(own) ? pick(own)
      : ctx.met ? pick((own && own.hello) || (ch.hello || {})[ctx.stage] || (ch.hello || {})[1]) : pick((own && own.meet) || ch.meet);
    if (g) lines.push(lineOut(g, {}, me));
    if (ctx.later) lines.push(lineOut(ctx.later, {}, me));
    const o = pick(script.open);
    if (o) lines.push(lineOut(o, {}, me));
    if (st) { const last = [g, ctx.later, o].filter(Boolean).pop(); st.last = last; if (o && o[2] && o[2].ask) st.pending = o[2].ask; }
    return lines.filter(Boolean);
  }

  const api = { init, newState, respond, opening, correct, suggestions, fill, norm, isPinyin, findNum, findTime, matchPatterns, numZh, zhToNum, MACROS, LEX, RULES, NOUN_MW, available, pick };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TALK = api;
})(typeof window !== 'undefined' ? window : globalThis);
