// The save file. Bump SAVE_VERSION and add a step in migrations.js whenever the shape changes.
export const SAVE_VERSION = 1;
export const SAVE_KEY = 'working-title:save';

export const defaultSave = () => ({
  v: SAVE_VERSION,
  createdAt: Date.now(),
  dev: { dayOffset: 0, autoAnswer: false },
  // word id -> SRS record (see core/srs.js). A word is "caught" once it has a record.
  words: {},
  // word id -> true, for words that appeared in a line heard or read but are not caught yet
  seen: {},
  // word id -> [{ zh, src }] sentences the word was met in (feeds context cards in Refresh)
  ctx: {},
  progress: {
    stage: 'opening',        // opening | district
    openingStep: 'refresh',  // step of the opening session
    beat: 0,                 // index of the next beat to play (0-5); 6 = all beats done
    beatStep: 'refresh',     // refresh | learn | use | notebook
    part: 0,                 // which session of the opening or current beat (units with `parts`)
    clueMistake: false,      // misheard 四 as 十 in beat 4 (challenge starts with 4 hearts)
    challengeWon: false,
    notebookClear: {},       // line index -> true
    pageRead: false,
    gateCleared: false
  },
  stats: { cleanConversations: 0, conversations: 0, typed: 0, hintsUsed: 0 },
  settings: { silent: { on: false, date: '' }, rate: 'normal', leniency: 'relaxed', typing: false, brisk: false, voice: '' }
});
