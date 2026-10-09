// Baotu Spring as a scene map (CONCEPT §3.2, round 2 answer 1A): a district board with five places,
// each opening one still scene with the people in it. No walking.
//
// Coordinates are mockup pixels (the visual thread's district mockup, 640×580, ~1 px per metre):
//   board  the 480×270 window of the mockup shown as the district board (×1)
//   view   top-left of the window a scene shows; zoom (default 3) scales it to fill the 480×270 screen,
//          so the window is 160×90 at ×3 and 240×135 at ×2
//   hot    the clickable area of a place on the board; pin: where its name tag stands; tag: the name on it
//   people / objects: where they stand, in mockup pixels (feet for people, bottom-centre for objects)
// Lines are what people say when it isn't their beat; the beats' real scenes live in content/baotu.js.
export default {
  district: 'baotu',
  name: { zh: '趵突泉', en: 'Baotu Spring' },
  board: { x: 160, y: 230, w: 480, h: 270 },

  places: [
    {
      id: 'spring', en: 'Baotu Spring', tag: '趵突泉',
      hot: { x: 296, y: 280, w: 104, h: 76 }, pin: { x: 348, y: 318 },
      view: { x: 268, y: 284 },
      people: [
        { id: 'wang', name: '王奶奶', en: 'Grandma Wang', x: 388, y: 335, face: 'down', lines: [{ zh: '孩子，你好！', en: 'Hello, child!' }, { zh: '我是王奶奶。', en: 'I am Grandma Wang.' }] }
      ],
      objects: [{ type: 'signpost', x: 300, y: 362, sign: 'gate4' }]
    },
    {
      id: 'taichi', en: 'The tai chi square', tag: '泉城广场',
      hot: { x: 452, y: 262, w: 176, h: 130 }, pin: { x: 546, y: 330 },
      view: { x: 400, y: 282 }, zoom: 2,
      people: [
        { id: 'zhang', name: '张老师', en: 'Teacher Zhang', x: 546, y: 354, face: 'down', taichi: true, lines: [{ zh: '你好！我是张老师。', en: 'Hello! I am Teacher Zhang.' }] },
        { id: 'lin', name: '林姐', en: 'Sister Lin', x: 533, y: 364, face: 'down', taichi: true, lines: [{ zh: '你好！', en: 'Hello!' }] },
        { id: 'folk2', name: '', en: 'Tai chi neighbor', x: 559, y: 364, face: 'down', taichi: true, lines: [{ zh: '你好！', en: 'Hello!' }] }
      ],
      objects: []
    },
    {
      id: 'gate', en: 'South gate', tag: '南门',
      hot: { x: 340, y: 452, w: 82, h: 44 }, pin: { x: 362, y: 470 },
      view: { x: 300, y: 412 },
      people: [
        { id: 'chen', name: '陈女士', en: 'Ms. Chen', x: 398, y: 482, face: 'down', behind: 'window', lines: [{ zh: '你好！你是游客吗？', en: 'Hello! Are you a tourist?' }] }
      ],
      objects: [{ type: 'window', x: 398, y: 486 }]
    },
    {
      id: 'fish', en: 'The fish pool', tag: '小谢',
      hot: { x: 266, y: 370, w: 98, h: 40 }, pin: { x: 316, y: 386 },
      view: { x: 236, y: 344 },
      people: [
        { id: 'xie', name: '小谢', en: 'Xiao Xie', x: 300, y: 375, face: 'down', lines: [{ zh: '你好！我是小谢。', en: 'Hi! I am Xiao Xie.' }] },
        { id: 'kid', name: '', en: 'A kid', x: 288, y: 376, face: 'down', lines: [{ zh: '你好！', en: 'Hi!' }] }
      ],
      objects: []
    },
    {
      id: 'gate4', en: 'Gate 4', tag: '四号门',
      hot: { x: 408, y: 322, w: 40, h: 40 }, pin: { x: 428, y: 336 },
      view: { x: 348, y: 296 },
      people: [
        { id: 'lele', name: '乐乐', en: 'Lele', x: 416, y: 364, face: 'down', lines: [{ zh: '我是乐乐！', en: 'I am Lele!' }] }
      ],
      objects: []
    }
  ],

  signs: {
    gate4: { zh: '四号门 → 左边', en: 'Gate 4 → left' }
  },

  // where each beat happens (index = progress.beat), who starts it, and the English hint in the corner
  beatPlaces: [
    { place: 'spring', npc: 'wang', hint: 'Grandma Wang is by the spring.' },
    { place: 'taichi', npc: 'zhang', hint: 'Ask the tai chi group.' },
    { place: 'gate', npc: 'chen', hint: 'Go to the ticket window at the south gate.' },
    { place: 'fish', npc: 'xie', hint: 'Go to the fish pool.' },
    { place: 'gate4', npc: 'lele', hint: 'Find Lele at Gate 4.' },
    { place: 'spring', npc: 'wang', hint: 'Take the thermos back to Grandma Wang.' }
  ]
};
