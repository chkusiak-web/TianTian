// Baotu Spring park: the walkable map (one screen, 30x17 tiles of 16 px), who stands where, and the signs.
// Layout follows CONCEPT §5.1: Grandma Wang by the spring's railing, the tai chi group, Ms. Chen's ticket window,
// the fish pool with Xiao Xie, Lele at Gate 4, and the gate signs. Positions are in tiles (x = column, y = row).
// Lines here are placeholders for checkpoint 2; the beats' real scenes live in content/baotu.js from checkpoint 3.
export default {
  district: 'baotu',
  name: { zh: '趵突泉', en: 'Baotu Spring' },
  // W wall · . grass · p path · s paving · ~ water · L water with lotus · T tree · Y willow · f flowers
  legend: { W: 'wall', '.': 'grass', p: 'path', s: 'pave', '~': 'water', L: 'lotus', T: 'tree', Y: 'willow', f: 'flowers' },
  rows: [
    'WWWppWWWWWWWWWppWWWWWWWWWWWWWW',
    'WT.pp....ff...pp...........T.W',
    'W..ppppppppppppp.............W',
    'W.............pp.....sssssss.W',
    'W.T....T..ssssssssss.sssssss.W',
    'W........Ys~~~~~~~~sYsssssss.W',
    'W.T...T...s~~~~~~~~s.sssssss.W',
    'W.........s~~~~~~~~s.sssssss.W',
    'pppppppppps~~~~~~~~spppppppppp',
    'W........Ys~~~~~~~~sY...p....W',
    'W.........ssssssssss....p.ff.W',
    'WppppppppppppppppppppppppppppW',
    'W..~L~~~~.....pp...........Y.W',
    'W..~~~~L~.Y.f.pp......T......W',
    'WT.~~L~~~...f.pp..........T..W',
    'W.............pp....ff.......W',
    'WWWWWWWWWWWWWWppWWWWWWWWWWWWWW'
  ],
  start: { x: 14.5, y: 14.6, face: 'up' },

  objects: [
    { type: 'spring', x: 14.5, y: 7 },
    { type: 'railing', x: 11, y: 9.6, repeat: 8 },
    { type: 'stele', x: 11, y: 3, solid: true },
    { type: 'lantern', x: 13, y: 3, solid: true },
    { type: 'lantern', x: 16, y: 3, solid: true },
    { type: 'signpost', x: 16, y: 2, solid: true, sign: 'gate4' },
    { type: 'window', x: 16, y: 13, solid: true, w: 2, h: 2 },
    { type: 'bench', x: 11, y: 14, solid: true },
    { type: 'bench', x: 23, y: 10, solid: true }
  ],

  // In-world text, drawn on top of the map. `sign` entries can also be read up close with Space.
  labels: [
    { zh: '趵突泉', x: 11.5, y: 2.6 },
    { zh: '北门', x: 15, y: 0.5 },
    { zh: '南门', x: 15, y: 16.5 },
    { zh: '西门', x: 0.6, y: 7.5 },
    { zh: '东门', x: 29.4, y: 7.5 },
    { zh: '四号门', x: 4, y: 0.5 },
    { zh: '四号门 → 左边', x: 16.5, y: 1.6, sign: 'gate4' }
  ],
  signs: {
    gate4: { zh: '四号门 → 左边', en: 'Gate 4 → left' }
  },

  // look: which manifest sprite to use. lines: what they say when you talk to them (placeholder until checkpoint 3)
  npcs: [
    { id: 'wang', name: '王奶奶', en: 'Grandma Wang', x: 12.5, y: 10.4, face: 'up', lines: [{ zh: '孩子，你好！', en: 'Hello, child!' }, { zh: '我是王奶奶。', en: 'I am Grandma Wang.' }] },
    { id: 'zhang', name: '张老师', en: 'Teacher Zhang', x: 24.5, y: 4.4, face: 'down', taichi: true, lines: [{ zh: '你好！我是张老师。', en: 'Hello! I am Teacher Zhang.' }] },
    { id: 'folk1', name: '', en: 'Tai chi neighbor', x: 22.5, y: 5.6, face: 'down', taichi: true, lines: [{ zh: '你好！', en: 'Hello!' }] },
    { id: 'folk2', name: '', en: 'Tai chi neighbor', x: 26.5, y: 6.2, face: 'down', taichi: true, lines: [{ zh: '你好！', en: 'Hello!' }] },
    { id: 'chen', name: '陈女士', en: 'Ms. Chen', x: 17, y: 14.7, face: 'down', behind: 'window', lines: [{ zh: '你好！你是游客吗？', en: 'Hello! Are you a tourist?' }] },
    { id: 'xie', name: '小谢', en: 'Xiao Xie', x: 9.5, y: 12.6, face: 'left', lines: [{ zh: '你好！我是小谢。', en: 'Hi! I am Xiao Xie.' }] },
    { id: 'kid', name: '', en: 'A kid', x: 6.5, y: 11.2, face: 'down', lines: [{ zh: '你好！', en: 'Hi!' }] },
    { id: 'lele', name: '乐乐', en: 'Lele', x: 5.5, y: 1.4, face: 'down', lines: [{ zh: '我是乐乐！', en: 'I am Lele!' }] }
  ],

  // who or what the marker sits on for each beat (index = progress.beat), and the English hint in the corner
  beatPlaces: [
    { npc: 'wang', hint: 'Grandma Wang is by the spring.' },
    { npc: 'zhang', hint: 'Ask the tai chi group.' },
    { npc: 'chen', hint: 'Go to the ticket window.' },
    { npc: 'xie', hint: 'Go to the fish pool.' },
    { npc: 'lele', hint: 'Find Lele at Gate 4.' },
    { npc: 'wang', hint: 'Take the thermos back to Grandma Wang.' }
  ]
};
