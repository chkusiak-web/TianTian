'use strict';
/* 天天 · local AI helper for Jinan conversations (Ollama on this Mac; fully offline, never required).
   The hand-written scripts (talk.js) stay in charge: they answer first, tick goals and give rule-based corrections.
   The local model only:
     · improvises an in-character reply when the script doesn't understand the learner;
     · double-checks the learner's sentence when the rules found nothing (shown as a softer "Tip");
     · translates its own improvised lines when clicked.
   Every call for a conversation shares one prompt prefix (character card + rules + conversation so far),
   so Ollama can reuse its cache and later turns stay fast. */
const AI = (() => {
  const DEF = { on: true, model: 'qwen3.5:9b' };
  const cfg = () => { S.settings.ai = Object.assign({}, DEF, S.settings.ai || {}); return S.settings.ai; };
  let status = { running: false, hasModel: false, checked: 0 };
  const waiters = new Map(); let seq = 0;
  if (bridge.onAiToken) bridge.onAiToken(({ id, text }) => { const f = waiters.get(id); if (f) f(text); });

  async function check(force) {
    if (!bridge.aiStatus) { status = { running: false, hasModel: false, checked: Date.now(), unsupported: true }; return status; }
    if (!force && Date.now() - status.checked < 20000) return status;
    const r = await bridge.aiStatus(cfg().model);
    status = { ...r, checked: Date.now() };
    return status;
  }
  const ready = () => cfg().on && status.running && status.hasModel;

  async function call(body, onText, timeout) {
    const id = 'ai' + ++seq;
    if (onText) waiters.set(id, onText);
    try { return await bridge.aiChat({ id, body: { model: cfg().model, keep_alive: '20m', ...body }, timeout }); }
    finally { waiters.delete(id); }
  }
  const parse = (s) => { try { return JSON.parse(s); } catch { return null; } };
  // pull the reply out of a partial JSON stream: {"reply": "…
  function partialReply(t) {
    const m = t.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)/); if (!m) return '';
    try { return JSON.parse('"' + m[1].replace(/\\$/, '') + '"'); } catch { return m[1]; }
  }
  // keep replies clean: no pinyin in brackets, no Latin letters
  const clean = (s) => String(s || '').replace(/[（(][^）)]*[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü][^）)]*[）)]/gi, '').replace(/[A-Za-z]+/g, '').replace(/\s+/g, '').trim();

  /* ctx: { c: character (JINAN), stage, d: district, q: quest, memory, known[] } */
  function system(ctx) {
    const { c, d, q } = ctx;
    return `You play ${c.zh} (${c.en}), ${c.age}, ${c.role}, in Jinan, China. You are talking with a foreign beginner learning Mandarin (around ${d.hsk}).
Personality: ${c.personality}
Speech: ${c.speech}
Signature phrases (sometimes): ${c.signature_phrases.join('、')}
Relationship now: ${c.arc[ctx.stage - 1].description}
Scene: ${d.zh} ${d.en}. ${q.setting}
What you remember about the learner: ${ctx.memory || 'nothing yet'}
The learner knows these words, use mostly them: ${ctx.known.join(' ')}
The learner's goals in this scene: ${q.objectives.map((o) => o.text).join('; ')}

THREE KINDS OF MESSAGES

1. A normal learner message (may end with 【还没做】 and the goals not done yet).
Answer in character with JSON {"reply": "..."}.
- reply: natural spoken Mandarin, Simplified characters, 1–2 SHORT sentences, simple words. Never English, never pinyin. Stay in the scene and in this moment; don't end the conversation or leave. Don't invent new prices or facts that contradict what was already said. If the learner's Chinese is unclear, ask a short simple question back. Gently lead toward the goals not done yet, without listing them.

2. 【检查】 + a sentence: you are now a strict but fair Chinese teacher. Is the sentence correct, natural Mandarin?
Answer JSON {"ok": true|false, "wrong": "...", "right": "...", "note": "..."}.
- ok true if a native speaker could say it (casual is fine). When unsure, ok true. Then wrong, right, note are "".
- ok false only for a real error: wrong is the exact wrong part copied from the sentence, right is the whole corrected sentence, note is one short ENGLISH reason. Keep the learner's meaning; never change what they wanted to say.
- If it says 【拼音】, the learner typed pinyin: ok false, wrong = the pinyin, right = the same sentence in characters (keep every number exactly), note "Type characters, not pinyin."
Examples:
【检查】我要两苹果。 → {"ok":false,"wrong":"两苹果","right":"我要两个苹果。","note":"Numbers need a measure word: 两个苹果."}
【检查】我吃饭在家。 → {"ok":false,"wrong":"我吃饭在家","right":"我在家吃饭。","note":"Place (在家) goes before the verb."}
【检查】他很喜欢喝米饭。 → {"ok":false,"wrong":"喝米饭","right":"他很喜欢吃米饭。","note":"You eat (吃) rice, you don't drink (喝) it."}
【检查】我昨天去了商店。 → {"ok":true,"wrong":"","right":"","note":""}
【检查】这个多少钱？ → {"ok":true,"wrong":"","right":"","note":""}
【检查】太贵了，便宜一点吧。 → {"ok":true,"wrong":"","right":"","note":""}
【检查】【拼音】wo xiang qu huo che zhan → {"ok":false,"wrong":"wo xiang qu huo che zhan","right":"我想去火车站。","note":"Type characters, not pinyin."}

3. 【翻译】 + a Chinese sentence: translate it into natural English. JSON {"en": "..."}.`;
  }
  const REPLY = { type: 'object', properties: { reply: { type: 'string' } }, required: ['reply'] };
  const CHECK = { type: 'object', properties: { ok: { type: 'boolean' }, wrong: { type: 'string' }, right: { type: 'string' }, note: { type: 'string' } }, required: ['ok', 'wrong', 'right', 'note'] };
  const EN = { type: 'object', properties: { en: { type: 'string' } }, required: ['en'] };
  const OPTS = { num_ctx: 4096 };

  // conv: { sys, hist: [{role, content}] } — hist holds the conversation so far (learner lines + character lines)
  const msgs = (conv, extra) => [{ role: 'system', content: conv.sys }, ...conv.hist.slice(-24), ...extra];
  async function warm(conv) {
    if (!ready()) return;
    try { await call({ messages: msgs(conv, [{ role: 'user', content: '【翻译】你好' }]), format: EN, stream: false, options: { ...OPTS, temperature: 0, num_predict: 1 } }, null, 90000); } catch {}
  }
  async function reply(conv, text, left, onPartial) {
    if (!ready()) return null;
    const body = { messages: msgs(conv, [{ role: 'user', content: `${text}\n【还没做】${left.join('；') || '无'}` }]), format: REPLY, stream: true, options: { ...OPTS, temperature: 0.7, num_predict: 120 } };
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await call(body, (t) => onPartial && onPartial(clean(partialReply(t))), 45000);
      if (!r || r.error) return null;
      const j = parse(r.text), out = j && clean(j.reply);
      if (out && /\p{Script=Han}/u.test(out)) return out;
    }
    return null;
  }
  async function checkSentence(conv, text, pinyin) {
    if (!ready()) return null;
    const r = await call({ messages: msgs(conv, [{ role: 'user', content: `【检查】${pinyin ? '【拼音】' : ''}${text}` }]), format: CHECK, stream: false, options: { ...OPTS, temperature: 0, num_predict: 90 } }, null, 45000);
    const j = r && !r.error && parse(r.text);
    if (!j || j.ok !== false) return null;
    const wrong = String(j.wrong || '').trim(), right = String(j.right || '').trim();
    // only show a tip that quotes the learner and actually changes something into Chinese
    if (!wrong || !text.includes(wrong) || !right || right === text || !/\p{Script=Han}/u.test(right)) return null;
    const note = String(j.note || ''), han = (note.match(/[\u3400-\u9fff]/g) || []).length, lat = (note.match(/[A-Za-z]/g) || []).length;
    if (han * 2 > lat) return null;   // notes must be in English (a few quoted characters are fine)
    return { original: wrong, corrected: right, note: String(j.note || ''), tip: true };
  }
  async function translate(conv, zh) {
    if (!ready()) return '';
    const r = await call({ messages: msgs(conv, [{ role: 'user', content: `【翻译】${zh}` }]), format: EN, stream: false, options: { ...OPTS, temperature: 0, num_predict: 80 } }, null, 30000);
    const j = r && !r.error && parse(r.text);
    return j && j.en ? String(j.en) : '';
  }
  return { cfg, check, ready, status: () => status, system, warm, reply, checkSentence, translate, DEF };
})();
