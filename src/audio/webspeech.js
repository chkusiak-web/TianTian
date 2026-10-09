// Browser speech (Web Speech API, zh-CN). Only Mandarin (zh-CN) voices are used: Macs also list Cantonese (Sin-Ji,
// zh-HK) and Taiwanese (Mei-Jia, zh-TW) voices, often first. Grandma Wang and the other women get a female voice.
const FEMALE = /ting-?ting|xiaoxiao|xiaoyi|yaoyao|huihui|lili|female|女|google 普通话/i;
const PREFERRED = /ting-?ting/i;                    // the Mac's standard Mandarin voice
const FEMALE_CAST = new Set(['wang', 'chen', 'lin', 'su_f']);
const isMandarin = (v) => /^(zh[-_](cn|hans(-cn)?)|cmn([-_]hans)?([-_]cn)?)$/i.test(v.lang);

// pick a voice from a list (exported for tests)
export function pickVoice(voices, who, preferred) {
  const vs = voices.filter(isMandarin);
  if (preferred) { const v = vs.find((x) => x.name === preferred); if (v) return v; }
  if (FEMALE_CAST.has(who)) { const f = vs.find((v) => PREFERRED.test(v.name)) || vs.find((v) => FEMALE.test(v.name)); if (f) return f; }
  return vs.find((v) => PREFERRED.test(v.name)) || vs.find((v) => v.localService) || vs[0] || null;
}

export function webSpeechBackend() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  // browsers fill the voice list late; the first line waits for it (up to a second) instead of using the default voice
  let ready = null;
  const voices = () => {
    if (!synth) return Promise.resolve([]);
    const now = synth.getVoices();
    if (now.length) return Promise.resolve(now);
    ready = ready || new Promise((res) => {
      const done = () => { synth.removeEventListener && synth.removeEventListener('voiceschanged', done); res(synth.getVoices()); };
      synth.addEventListener ? synth.addEventListener('voiceschanged', done) : (synth.onvoiceschanged = done);
      setTimeout(done, 1000);
    }).finally(() => { ready = null; });
    return ready;
  };
  if (synth) voices();
  return {
    available: () => !!synth,
    stop: () => { try { synth && synth.cancel(); } catch { /* ignore */ } },
    speak(text, { who, slow, rate, voice } = {}) {
      if (!synth) return Promise.resolve(false);
      synth.cancel();
      return voices().then((vs) => new Promise((res) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        const v = pickVoice(vs, who, voice); if (v) u.voice = v;
        u.rate = rate || (slow ? 0.65 : 0.9);
        u.onend = u.onerror = () => res(true);
        synth.speak(u);
      }));
    }
  };
}
