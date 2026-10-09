// usage: node build/try.js <questId> "line1" "line2" ...
const path=require('path'),fs=require('fs');const APP=path.join(__dirname,'..','app');global.window=global;
require(APP+'/data/words.js');require(APP+'/data/jinan.js');require(APP+'/data/jinan-scripts.js');
for(const f of fs.readdirSync(APP+'/data/scripts'))require(APP+'/data/scripts/'+f);
const PP=require(APP+'/lib/pinyin-pro.js');const T=require(APP+'/talk.js');
const syl=new Set();WORDS.forEach(w=>String(w.n||'').split(/\s+/).forEach(s=>s&&syl.add(s.replace(/\d/g,''))));
T.init({py:(s)=>PP.pinyin(s,{toneType:'none',type:'array'}),pyMarks:(s)=>PP.pinyin(s),syllables:[...syl]});
const qid=process.argv[2];let q;for(const d of JINAN.districts)for(const x of d.quests)if(x.id===qid)q=x;
const sc=JINAN_SCRIPTS.quests[qid],ch=JINAN_SCRIPTS.characters[q.character];const st=T.newState(sc,qid,q.character,[]);const me={};
console.log('NPC:',T.opening(sc,ch,{met:false,stage:1,me},st).map(l=>l.zh).join(' / '));
for(const u of process.argv.slice(3)){const r=T.respond(sc,ch,st,u,{objectives:q.objectives,me,remember:(k,v)=>me[k]=v});
console.log('\nME :',u+(r.fix?`   ✎ ${r.fix.original} → ${r.fix.corrected} (${r.fix.note})`:''));console.log('NPC:',r.lines.map(l=>l.zh).join(' / '),r.ticked.length?'✓'+r.ticked:'',r.complete?'[COMPLETE]':'',r.suggest.length?'try: '+r.suggest.join(' | '):'');}
