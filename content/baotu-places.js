// Baotu Spring as a scene map (CONCEPT §3.2, round 2 answer 1A): a district board with five places,
// each opening one still scene with the people in it. No walking.
//
// Coordinates are mockup pixels (the visual thread's district mockup, 640×580, ~1 px per metre):
//   board  the 480×270 window of the mockup shown as the district board (×1)
//   view   the 160×90 window a scene shows, drawn ×3 to fill the 480×270 screen
//   hot    the clickable area of a place on the board
//   people / objects / labels: where they stand, in mockup pixels (feet for people, bottom-centre for objects)
// Lines are what people say when it isn't their beat; the beats' real scenes live in content/baotu.js.
export default {
  district: 'baotu',
  name: { zh: '趵突泉', en: 'Baotu Spring' },
  board: { x: 160, y: 230, w: 480, h: 270 },

  places: [
    {
      id: 'spring', zh: '趵突泉', en: 'Baotu Spring',
      hot: { x: 296, y: 280, w: 104, h: 76 }, label: { x: 348, y: 276 },
      view: { x: 268, y: 284 },
      people: [
        { id: 'wang', name: '王奶奶', en: 'Grandma Wang', x: 336, y: 351, face: 'up', lines: [{ zh: '孩子，你好！', en: 'Hello, child!' }, { zh: '我是王奶奶。', en: 'I am Grandma Wang.' }] }
      ],
      objects: [{ type: 'signpost', x: 300, y: 362, sign: 'gate4' }],
      labels: [{ zh: '趵突泉', x: 348, y: 336 }, { zh: '四号门 → 左边', x: 300, y: 350, sign: 'gate4' }]
    },
    {
      id: 'taichi', zh: '', en: 'The tai chi square',
      hot: { x: 452, y: 262, w: 176, h: 130 }, label: { x: 546, y: 262 },
      view: { x: 466, y: 290 },
      people: [
        { id: 'zhang', name: '张老师', en: 'Teacher Zhang', x: 546, y: 362, face: 'down', taichi: true, lines: [{ zh: '你好！我是张老师。', en: 'Hello! I am Teacher Zhang.' }] },
        { id: 'folk1', name: '', en: 'Tai chi neighbor', x: 535, y: 372, face: 'down', taichi: true, lines: [{ zh: '你好！', en: 'Hello!' }] },
        { id: 'folk2', name: '', en: 'Tai chi neighbor', x: 557, y: 372, face: 'down', taichi: true, lines: [{ zh: '你好！', en: 'Hello!' }] }
      ],
      objects: [],
      labels: []
    },
    {
      id: 'gate', zh: '南门', en: 'South gate',
      hot: { x: 340, y: 452, w: 82, h: 44 }, label: { x: 362, y: 456 },
      view: { x: 300, y: 412 },
      people: [
        { id: 'chen', name: '陈女士', en: 'Ms. Chen', x: 398, y: 482, face: 'down', behind: 'window', lines: [{ zh: '你好！你是游客吗？', en: 'Hello! Are you a tourist?' }] }
      ],
      objects: [{ type: 'window', x: 398, y: 486 }],
      labels: [{ zh: '南门', x: 362, y: 460 }]
    },
    {
      id: 'fish', zh: '', en: 'The fish pool',
      hot: { x: 266, y: 370, w: 98, h: 40 }, label: { x: 316, y: 412 },
      view: { x: 236, y: 344 },
      people: [
        { id: 'xie', name: '小谢', en: 'Xiao Xie', x: 300, y: 375, face: 'down', lines: [{ zh: '你好！我是小谢。', en: 'Hi! I am Xiao Xie.' }] },
        { id: 'kid', name: '', en: 'A kid', x: 288, y: 376, face: 'down', lines: [{ zh: '你好！', en: 'Hi!' }] }
      ],
      objects: [],
      labels: []
    },
    {
      id: 'gate4', zh: '四号门', en: 'Gate 4',
      hot: { x: 408, y: 322, w: 40, h: 40 }, label: { x: 428, y: 318 },
      view: { x: 348, y: 296 },
      people: [
        { id: 'lele', name: '乐乐', en: 'Lele', x: 416, y: 364, face: 'down', lines: [{ zh: '我是乐乐！', en: 'I am Lele!' }] }
      ],
      objects: [],
      labels: [{ zh: '四号门', x: 428, y: 322 }]
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
