// Checkpoint-1 demo text only (replaced by the real scenes in later checkpoints).
// District context decides which taught words are allowed; see tools/validate-content.js.
export default {
  district: 'baotu',
  samples: [
    { zh: '你好！我是王奶奶。', en: 'Hello! I am Grandma Wang.' },
    { zh: '我的杯子没有了！', en: 'My cup is gone!' }
  ],
  question: {
    prompt: '这是什么？',
    promptEn: 'What is this?',
    options: ['杯子', '老周', '四十'],
    answer: '杯子'
  }
};
