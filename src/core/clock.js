// One clock for everything time-based, so the dev panel can fast-forward days.
export const DAY = 86400000;
let offset = 0;
export const now = () => Date.now() + offset;
export const setOffsetDays = (d) => { offset = d * DAY; };
export const getOffsetDays = () => offset / DAY;
export const todayKey = () => new Date(now()).toISOString().slice(0, 10);
