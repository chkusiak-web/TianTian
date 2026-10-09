// Browser speech (Web Speech API, zh-CN). Grandma Wang asks for a female voice when one exists.
const FEMALE = /ting-?ting|xiaoxiao|xiaoyi|yaoyao|huihui|lili|female|女|mei-?jia|sin-?ji|google 普通话/i;
const FEMALE_CAST = new Set(['wang', 'chen', 'lin', 'su_f']);

export function webSpeechBackend() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const zhVoices = () => (synth ? synth.getVoices() : []).filter((v) => /^zh[-_]?(cn|hans)?$/i.test(v.lang) || /^zh/i.test(v.lang));
  function pick(who, preferred) {
    const vs = zhVoices();
    if (preferred) { const v = vs.find((x) => x.name === preferred); if (v) return v; }
    if (FEMALE_CAST.has(who)) { const f = vs.find((v) => FEMALE.test(v.name)); if (f) return f; }
    return vs.find((v) => /zh[-_]CN/i.test(v.lang)) || vs[0] || null;
  }
  return {
    available: () => !!synth,
    stop: () => { try { synth && synth.cancel(); } catch { /* ignore */ } },
    speak(text, { who, slow, rate, voice } = {}) {
      return new Promise((res) => {
        if (!synth) return res(false);
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        const v = pick(who, voice); if (v) u.voice = v;
        u.rate = rate || (slow ? 0.65 : 0.9);
        u.onend = u.onerror = () => res(true);
        synth.speak(u);
      });
    }
  };
}
