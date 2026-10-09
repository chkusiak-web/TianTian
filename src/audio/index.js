// Audio interface. The game only calls speak() and stop(); recorded files can replace the Web Speech voice later
// by registering a different implementation with setAudioBackend().
//
//   speak(text, { who, slow }) -> Promise<boolean>   who: a cast id ('wang', 'zhang', …) so a voice can be picked per person
//   stop()
//   available() -> boolean
import { webSpeechBackend } from './webspeech.js';

let backend = webSpeechBackend();
let silent = () => false;
let slow = () => false;

export const setAudioBackend = (b) => { backend = b; };
export const configureAudio = ({ isSilent, isSlow }) => { if (isSilent) silent = isSilent; if (isSlow) slow = isSlow; };
export const speak = (text, opts = {}) => (silent() ? Promise.resolve(false) : backend.speak(text, { slow: slow(), ...opts }));
export const stop = () => backend.stop();
export const available = () => backend.available();
