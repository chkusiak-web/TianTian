// Copied from the visual thread's district mockup (visual-language/map-kit/baotu-district.html, Oct 9 version).
// Used as placeholder art for the district board and the scene backgrounds until real art exists.
// Changes from the original: page UI and the palette swatches removed, variant C fixed, `layers()` export added.
// Don't edit by hand; re-copy it when the mockup changes.
/* eslint-disable */

const PAL={
  "Paper":"#F4EACA","Road":"#FAF5E0","Road edge":"#E2D7B0",
  "Water":"#1F8E89","Water deep":"#18706D","Ripple":"#7FC7BF",
  "Lawn":"#B1C65B","Lawn shade":"#97B04E","Tree light":"#69A150","Tree":"#43804F","Tree dark":"#1F664A","Trunk":"#785845",
  "Wall":"#FBF7EC","Wall shade":"#E2DBC8","Window":"#2F4250",
  "Tile roof":"#6E7883","Tile roof dark":"#4E5762","Red roof":"#D9573A","Red roof dark":"#AE4029","Charcoal roof":"#3E4A54",
  "Gold":"#E8B04A","Spring blue":"#2F6FD6","Spring blue dark":"#1F4FA8","Silver":"#DCE1E7"
};
const K={paper:"#F4EACA",road:"#FAF5E0",edge:"#E2D7B0",w:"#1F8E89",wd:"#18706D",rip:"#7FC7BF",lawn:"#B1C65B",lawnD:"#97B04E",
  tl:"#69A150",t:"#43804F",td:"#1F664A",trunk:"#785845",wall:"#FBF7EC",wallD:"#E2DBC8",win:"#2F4250",
  tile:"#6E7883",tileD:"#4E5762",red:"#D9573A",redD:"#AE4029",char:"#3E4A54",gold:"#E8B04A",
  stone:"#CFC6B0",stoneD:"#A69C86",lantern:"#D94436",brick:"#B5654A",brickD:"#8E4A35",skin:"#E9B98F"};

/* sprite drawing: each sprite is {w,h,draw(ctx)}; s.R draws a rect, s.M draws a rect and its mirror */
function make(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");
  const R=(a,b,ww,hh,col)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh)};
  const M=(a,b,ww,hh,col)=>{R(a,b,ww,hh,col);R(w-a-ww,b,ww,hh,col)};
  const P=(a,b,col)=>R(a,b,1,1,col);
  fn({R,M,P,w,h});return c}
// shared parts
function tileRoof(s,y,h,inset,col=K.tile,dark=K.tileD){ // Chinese roof: slight curve, upturned eaves, ridge
  const {R,M,w}=s;R(inset,y,w-inset*2,h,col);for(let i=inset+2;i<w-inset-1;i+=3)R(i,y+2,1,h-3,dark); // tile rows
  R(inset-1,y,w-inset*2+2,2,dark);M(inset-2,y-1,2,2,dark); // ridge with upturned ends
  R(inset-2,y+h-1,w-inset*2+4,2,dark);M(inset-3,y+h-2,1,1,dark); // eave
}
function pitchedRoof(s,y,h,col,dark,over=2){ // triangle-ish roof, symmetric, shade on right half
  const {R,w}=s;for(let j=0;j<h;j++){const half=Math.round((j+1)/h*(w/2+over));const l=Math.round(w/2-half),r=Math.round(w/2+half);R(l,y+j,Math.ceil((r-l)/2),1,col);R(Math.round(w/2),y+j,r-Math.round(w/2),1,dark)}}
function hipRoof(s,y,h,inset,col,dark){const {R,w}=s;for(let j=0;j<h;j++){const l=inset+(h-1-j),r=w-inset-(h-1-j);R(l,y+j,Math.ceil((r-l)/2),1,col);R(Math.floor(w/2),y+j,r-Math.floor(w/2),1,dark)}}
function windows(s,y,cols,ww=2,wh=3,gap=null){const {M,w}=s;const n=Math.floor(cols/2);const g=gap||Math.floor((w-6)/(cols+1));for(let k=0;k<n;k++){const a=3+g*(k+1)-Math.floor(ww/2);M(a,y,ww,wh,K.win)}if(cols%2)s.R(Math.floor(w/2)-Math.floor(ww/2),y,ww,wh,K.win)}

const S={};
/* ---- Chinese old town ---- */
S.cnHouse=make(20,16,s=>{const {R,M}=s;tileRoof(s,2,5,2);R(2,7,16,8,K.wall);R(16,7,2,8,K.wallD);R(2,13,16,2,K.stone);M(5,9,3,3,K.win);R(9,9,2,6,K.red);});
S.cnShop=make(28,22,s=>{const {R,M,P}=s;tileRoof(s,2,6,2);R(2,8,24,13,K.wall);R(24,8,2,13,K.wallD);R(2,8,24,2,K.wallD);
  M(4,11,5,8,K.trunk);M(5,12,3,6,K.gold);R(11,11,6,10,K.trunk);R(12,12,4,9,K.win);M(3,9,2,3,K.lantern);P(3,12,K.gold);P(24,12,K.gold);R(2,19,24,2,K.stone);});
S.cnCourtyard=make(36,26,s=>{const {R,M}=s;tileRoof(s,2,6,6);R(6,8,24,4,K.wallD); // main hall behind
  M(0,9,9,5,K.tile);M(0,9,9,1,K.tileD);R(1,14,34,11,K.wall);R(1,14,34,2,K.tileD);R(31,16,4,9,K.wallD); // side roofs + front wall cap
  tileRoof({...s,w:16,R:(a,b,ww,hh,c)=>s.R(a+10,b,ww,hh,c),M:(a,b,ww,hh,c)=>{s.R(a+10,b,ww,hh,c);s.R(16-a-ww+10,b,ww,hh,c)}},11,4,1);
  R(14,17,8,8,K.red);R(17,17,2,8,K.redD);M(5,18,3,3,K.win);R(1,23,34,2,K.stone);});
S.cnTwoStorey=make(28,26,s=>{const {R,M}=s;tileRoof(s,2,5,3);R(3,7,22,7,K.wall);R(23,7,2,7,K.wallD);windows(s,9,4,2,3);
  tileRoof(s,13,4,1);R(2,17,24,8,K.wall);R(24,17,2,8,K.wallD);M(5,19,3,3,K.win);R(12,19,4,6,K.red);R(2,23,24,2,K.stone);});
S.cnWall=make(32,8,s=>{const {R}=s;R(0,1,32,2,K.tileD);R(0,0,32,1,K.tile);R(0,3,32,5,K.wall);R(0,6,32,2,K.stone);});
/* ---- outside the moat ---- */
S.redHouse=make(20,18,s=>{const {R,M}=s;pitchedRoof(s,1,7,K.red,K.redD,1);R(3,8,14,9,K.wall);R(15,8,2,9,K.wallD);M(5,10,2,3,K.win);R(9,12,2,5,K.win);});
S.charVilla=make(36,24,s=>{const {R,M}=s;hipRoof(s,1,7,2,K.char,"#2E373F");R(3,8,30,15,K.wall);R(31,8,2,15,K.wallD);windows(s,10,7,2,3);windows(s,16,7,2,3);R(16,17,4,6,K.win);});
S.redVilla=make(36,26,s=>{const {R,M}=s;hipRoof(s,1,8,1,K.red,K.redD);R(3,9,30,16,K.wall);R(31,9,2,16,K.wallD);windows(s,11,7,2,3);windows(s,17,7,2,3);R(15,18,6,7,K.win);R(14,17,8,1,K.wallD);});
S.apartment=make(28,32,s=>{const {R}=s;R(1,1,26,3,K.stoneD);R(2,0,24,1,K.stone);R(2,4,24,27,K.wall);R(24,4,2,27,K.wallD);for(let j=7;j<28;j+=5)windows(s,j,5,2,3);R(12,26,4,5,K.win);});
S.shop=make(28,20,s=>{const {R,M}=s;R(1,1,26,2,K.stoneD);R(2,3,24,16,K.wall);R(24,3,2,16,K.wallD);
  for(let i=2;i<26;i+=4)R(i,8,2,4,(i/2)%2?K.wall:K.red);R(2,12,24,1,K.redD);M(4,13,6,5,K.win);R(12,13,4,6,K.win);windows(s,5,3,2,2);});
/* ---- trees ---- */
function roundTree(w,h){return make(w,h,s=>{const {R}=s;const cx=w/2,r=w/2-.5,cy=r+.5;
  for(let j=0;j<w;j++)for(let i=0;i<w;i++){const dx=i+.5-cx,dy=j+.5-cy;if(dx*dx+dy*dy<=r*r){let c=dx>0?K.td:K.t;if(dx<-r*.15&&dy<-r*.15&&dx*dx+dy*dy<r*r*.45)c=K.tl;R(i,j,1,1,c)}}
  R(Math.floor(cx)-1,w-1,2,h-w+1,K.trunk)})}
S.treeBig=roundTree(14,17);S.treeMid=roundTree(10,13);S.treeSmall=roundTree(8,10);
S.cypress=make(8,18,s=>{const {R}=s;for(let j=0;j<15;j++){const half=Math.min(3,Math.floor(Math.sin(j/15*3.14)*4)+1);R(4-half,j,half,1,K.t);R(4,j,half,1,K.td)}R(3,15,2,3,K.trunk)});
S.willow=make(14,16,s=>{const {R}=s;for(let j=0;j<5;j++){const half=Math.min(6,2+j);R(7-half,j,half,1,K.tl);R(7,j,half,1,K.t)}
  for(let i=1;i<13;i+=2){const L=6+((i*3)%4);R(i,5,1,L,i<7?K.t:K.td)}R(6,10,2,6,K.trunk)});
S.bush=make(10,6,s=>{const {R}=s;R(1,1,8,5,K.t);R(2,0,6,1,K.t);R(5,1,4,5,K.td);R(2,1,2,2,K.tl)});
S.lotus=make(12,6,s=>{const {R,P}=s;[[1,2],[5,0],[8,3],[3,4]].forEach(([a,b])=>{R(a,b,3,2,K.t);P(a+1,b,K.tl)});P(6,0,"#F2A6B8");P(2,3,"#F2A6B8")});
S.spring=make(16,8,s=>{const {R,M}=s;R(2,0,12,8,K.stone);R(0,2,16,4,K.stone);R(3,1,10,6,K.w);R(1,3,14,2,K.w);R(3,1,10,1,K.wd);M(5,3,2,1,K.rip);R(7,4,2,1,K.rip)});
/* ---- movers ---- */
S.tourBoat=make(24,9,s=>{const {R,M}=s;R(2,5,20,3,K.wall);R(4,8,16,1,K.wallD);R(0,5,2,2,K.wall);R(22,5,2,2,K.wall);R(5,2,14,3,K.red);R(6,1,12,1,K.redD);M(7,3,2,1,K.win);R(11,3,2,1,K.win);});
S.sailboat=make(10,12,s=>{const {R}=s;for(let j=0;j<8;j++)R(5-Math.floor(j/2),j,Math.floor(j/2)+1,1,K.wall);R(5,0,1,9,K.trunk);R(1,9,8,2,K.red);R(2,11,6,1,K.redD)});
S.rowboat=make(10,4,s=>{const {R}=s;R(0,1,10,2,K.trunk);R(1,3,8,1,"#5A3E2C");R(3,0,4,1,K.wallD)});
S.bus=make(20,8,s=>{const {R}=s;R(0,1,20,6,K.red);R(1,0,18,1,K.red);for(let i=2;i<18;i+=3)R(i,2,2,2,K.win);R(0,5,20,1,K.redD);R(3,7,3,1,K.win);R(14,7,3,1,K.win)});
S.car=make(10,6,s=>{const {R}=s;R(0,2,10,3,K.gold);R(2,0,6,2,K.gold);R(3,1,4,1,K.win);R(1,5,2,1,K.win);R(7,5,2,1,K.win)});
S.carTeal=make(10,6,s=>{const {R}=s;R(0,2,10,3,K.w);R(2,0,6,2,K.w);R(3,1,4,1,K.win);R(1,5,2,1,K.win);R(7,5,2,1,K.win)});
S.train=make(48,9,s=>{const {R}=s;for(let k=0;k<3;k++){R(k*16,1,15,7,K.wall);R(k*16,5,15,1,K.red);for(let i=2;i<14;i+=3)R(k*16+i,2,2,2,K.win)}R(0,0,48,1,K.stoneD);R(0,8,48,1,K.win)});
S.person=make(4,8,s=>{const {R}=s;R(1,0,2,2,K.skin);R(0,2,4,3,K.red);R(1,5,1,3,K.win);R(2,5,1,3,K.win)});
S.person2=make(4,8,s=>{const {R}=s;R(1,0,2,2,K.skin);R(0,2,4,3,K.w);R(1,5,1,3,K.char);R(2,5,1,3,K.char)});
S.cyclist=make(10,9,s=>{const {R}=s;R(4,0,2,2,K.skin);R(3,2,4,3,K.gold);R(0,6,3,3,K.win);R(7,6,3,3,K.win);R(1,7,1,1,K.paper);R(8,7,1,1,K.paper);R(2,5,6,1,K.win)});
/* ---- landmarks ---- */
S.chaoran=make(40,64,s=>{const {R,M}=s;R(4,60,32,4,K.stone);R(4,60,32,1,K.stoneD);
  for(let t=0;t<5;t++){const y=50-t*10,inset=4+t*3;R(inset-2,y,40-2*(inset-2),3,K.tile);R(inset-2,y,40-2*(inset-2),1,K.tileD);M(inset-3,y-1,1,2,K.tileD);
    R(inset,y+3,40-2*inset,7,K.red);R(40-inset-2,y+3,2,7,K.redD);for(let i=inset+2;i<40-inset-2;i+=3)R(i,y+5,1,3,K.gold)}
  R(19,4,2,6,K.gold);R(18,8,4,2,K.tileD);});
// 泉标: traced from photo 2, version B (56 px, 3 tones)
const QB=(()=>{const B="#2F6FD6",BD="#1F4FA8",BL="#6FA2EE",SV="#DCE1E7",SVD="#9AA3AD",SVL="#FFFFFF",ST="#CFC6B0",STD="#A69C86";
// centerlines traced from the new photo (498 × 1088); y grows downward
const P={
  backLoop:{pts:[[183,705],[146,708],[136,738],[160,758],[240,756]],w:26,tone:"dark"},
  leftLeg:{pts:[[183,690],[183,1030]],w:44,tone:"dark"},
  ribbonB:{pts:[[405,655],[362,672],[292,668],[222,662],[192,668],[183,700]],w:40,tone:"dark"},
  leftBlade:{pts:[[192,80],[192,440],[165,488],[105,515],[72,575],[86,625]],w:46,tone:"mid",top:115,cut:-0.15},
  rightBlade:{pts:[[282,20],[282,440],[305,476],[375,500],[428,560],[430,625],[405,655]],w:46,tone:"mid",top:48,cut:0.75},
  ribbonA:{pts:[[86,625],[120,660],[196,680],[256,698],[282,730]],w:50,tone:"mid"},
  rightLeg:{pts:[[282,715],[282,1030]],w:56,tone:"mid"}};
const BALL={cx:240,cy:560,r:62};
function seg(px,py,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let t=((px-a[0])*dx+(py-a[1])*dy)/L;t=Math.max(0,Math.min(1,t));
  const qx=a[0]+t*dx,qy=a[1]+t*dy,len=Math.sqrt(L);return {d:Math.hypot(px-qx,py-qy),side:((px-qx)*dy-(py-qy)*dx)/len}}
function render(H,o){const s=H/985,X0=40,Y0=45,W=Math.ceil(400*s);const c=document.createElement("canvas");c.width=W;c.height=H+3;const x=c.getContext("2d");
  const put=(i,j,col)=>{x.fillStyle=col;x.fillRect(i,j,1,1)};const ph=(i,j)=>[X0+(i+.5)/s,Y0+(j+.5)/s];
  const draw=k=>{const p=P[k],w=p.w*(o.bold||1);for(let j=0;j<H;j++)for(let i=0;i<W;i++){const [px,py]=ph(i,j);
    if(p.top!==undefined&&py<p.top+p.cut*(px-p.pts[0][0]))continue;
    let best=null;for(let n=0;n<p.pts.length-1;n++){const r=seg(px,py,p.pts[n],p.pts[n+1]);if(!best||r.d<best.d)best=r}
    if(best.d>w/2)continue;let col=p.tone==="dark"?BD:B;
    if(p.tone==="mid"&&o.tones>=3&&best.side>w*.2)col=BL;   // lit right face
    if(p.tone==="mid"&&best.side<-w*.25)col=BD;              // shaded left edge
    put(i,j,col)}};
  ["backLoop","leftLeg","ribbonB","leftBlade","rightBlade"].forEach(draw);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const [px,py]=ph(i,j);const dx=px-BALL.cx,dy=py-BALL.cy,d=Math.hypot(dx,dy);
    if(d<=BALL.r*(o.ball||1)){let col=SV;if(dx+dy>BALL.r*.5)col=SVD;if(dx+dy<-BALL.r*.6&&d<BALL.r*.8)col=SVL;put(i,j,col)}}
  ["ribbonA","rightLeg"].forEach(draw);
  x.fillStyle=ST;x.fillRect(Math.round(W*.2),H,Math.round(W*.6),3);x.fillStyle=STD;x.fillRect(Math.round(W*.2),H,Math.round(W*.6),1);
  return c}
return render(56,{tones:3,bold:1.35,ball:1.1})})();
S.quanbiao=QB;

S.jiefang=make(44,34,s=>{const {R,M}=s;R(0,16,44,18,K.stoneD);for(let j=18;j<34;j+=4)R(0,j,44,1,K.stone);R(0,16,44,2,K.stone);R(18,24,8,10,K.win);
  tileRoof({...s},2,6,8);R(10,8,24,8,K.red);R(32,8,2,8,K.redD);M(12,10,2,6,K.gold);R(20,10,4,6,K.gold);});
S.baotu=make(56,34,s=>{const {R,M}=s;R(2,22,52,12,K.stone);R(4,24,48,8,K.w);R(4,24,48,2,K.wd);
  [[14,12],[28,18],[42,12]].forEach(([a,h])=>{R(a-1,26-h,2,h,K.rip);R(a-2,24-h,4,2,K.wall);R(a-3,25-h,1,1,K.rip);R(a+2,25-h,1,1,K.rip);R(a-3,25,6,1,K.wall)});
  });
S.pavilion=make(28,24,s=>{const {R,M}=s;tileRoof(s,2,6,3,K.w,K.wd);M(5,8,2,12,K.red);R(4,20,20,3,K.stone);R(4,20,20,1,K.stoneD);R(13,1,2,2,K.gold)});
S.temple=make(56,32,s=>{const {R,M}=s;tileRoof(s,2,8,4,K.gold,"#C08A2C");R(6,10,44,16,K.red);R(46,10,4,16,K.redD);for(let i=8;i<48;i+=5)R(i,12,1,14,K.redD);
  R(24,16,8,10,K.win);M(10,15,6,5,K.win);R(0,26,56,6,K.stone);R(0,26,56,1,K.stoneD);for(let j=28;j<32;j+=2)R(18,j,20,1,K.stoneD)});
S.station=make(72,30,s=>{const {R}=s;for(let i=0;i<72;i++){const h=Math.round(8+Math.sin(i/71*3.14)*8);R(i,18-h,1,h,i%6<3?K.wall:K.wallD)}R(0,18,72,10,K.w);for(let i=2;i<70;i+=4)R(i,19,2,8,K.win);R(0,28,72,2,K.stoneD);R(32,21,8,7,K.wall)});
S.campus=make(56,34,s=>{const {R,M}=s;hipRoof(s,6,7,2,K.char,"#2E373F");R(3,13,50,20,K.brick);R(51,13,2,20,K.brickD);windows(s,16,9,2,4);windows(s,24,9,2,4);R(24,24,8,9,K.win);
  R(22,0,12,7,K.brick);R(32,0,2,7,K.brickD);R(26,2,4,3,K.wall);R(27,3,2,1,K.win)});
S.hospital=make(48,30,s=>{const {R,M}=s;R(1,4,46,3,K.stoneD);R(2,7,44,22,K.wall);R(44,7,2,22,K.wallD);for(let j=10;j<26;j+=5)windows(s,j,9,2,3);
  R(20,0,8,8,K.wall);R(23,1,2,6,"#4E9A55");R(21,3,6,2,"#4E9A55");R(20,23,8,6,K.win)});
S.bridge=make(40,12,s=>{const {R}=s;R(0,2,40,10,K.stone);R(0,2,40,2,K.wall);for(let i=0;i<40;i++){const d=Math.abs(i-20);if(d<12){const h=Math.round(Math.sqrt(144-d*d)*0.55);R(i,12-h,1,h,K.w)}}R(0,1,40,1,K.stoneD);for(let i=2;i<40;i+=6)R(i,0,2,2,K.stoneD)});
S.well=make(14,12,s=>{const {R,M}=s;R(1,6,12,6,K.stone);R(1,6,12,1,K.stoneD);R(2,4,10,2,K.trunk);M(1,0,2,6,K.trunk);R(1,0,12,2,K.tile);R(6,8,2,2,K.gold)});

/* ===== Baotu Spring district v3: layout traced loosely from OSM, north up, ~1 px ≈ 1 m ===== */
const W=640,H=580;
/* ---- district sprites ---- */
S.paifang=make(30,24,s=>{const {R,M}=s;R(1,3,28,4,K.tile);R(0,2,30,2,K.tileD);M(0,1,2,1,K.tileD);R(1,7,28,1,K.tileD);
  R(5,0,20,2,K.tileD);R(9,8,12,4,K.gold);R(10,9,10,2,K.redD);M(4,8,2,15,K.red);M(10,12,2,11,K.red);M(5,8,1,15,K.redD);R(0,22,30,2,K.stone);R(0,22,30,1,K.stoneD)});
S.hall=make(44,30,s=>{const {R,M}=s;tileRoof(s,2,6,3);R(5,8,34,6,K.red);R(37,8,2,6,K.redD);for(let i=7;i<37;i+=4)R(i,9,2,4,K.gold);
  tileRoof({...s,R:(a,b,w,h,c)=>R(a,b+12,w,h,c),M:(a,b,w,h,c)=>M(a,b+12,w,h,c)},2,5,1);
  R(4,19,36,9,K.red);R(37,19,3,9,K.redD);for(let i=6;i<38;i+=5)R(i,19,1,9,K.redD);R(18,21,8,7,K.win);M(8,21,6,4,K.win);R(1,27,42,3,K.stone);R(1,27,42,1,K.stoneD)});
S.greyPav=make(20,18,s=>{const {R,M}=s;tileRoof(s,2,5,3);R(9,0,2,2,K.gold);M(4,7,2,8,K.red);R(2,15,16,3,K.stone);R(2,15,16,1,K.stoneD)});
S.memorial=make(40,26,s=>{const {R,M}=s;hipRoof(s,2,6,1,K.tile,K.tileD);R(3,8,34,14,K.wall);R(35,8,2,14,K.wallD);M(6,10,2,10,K.wallD);M(11,10,2,10,K.wallD);
  R(17,12,6,10,K.win);R(0,22,40,4,K.stone);R(0,22,40,1,K.stoneD);R(14,24,12,2,K.stoneD)});
S.bamboo=make(10,18,s=>{const {R,P}=s;[[1,4],[3,1],[5,3],[7,0],[8,5]].forEach(([a,t])=>{R(a,t,1,18-t,"#7FA845");for(let j=t+3;j<17;j+=4)P(a,j,K.t)});
  [[0,3],[2,0],[4,5],[6,1],[8,4],[3,8],[7,9]].forEach(([a,b])=>{R(a,b,2,1,K.tl);P(a+1,b+1,K.t)})});
S.rock=make(8,7,s=>{const {R}=s;R(1,1,6,6,K.stoneD);R(2,0,3,1,K.stoneD);R(1,1,3,3,K.stone);R(5,4,2,2,"#8C836F");R(3,3,1,1,"#8C836F")});
S.pier=make(18,6,s=>{const {R}=s;R(0,0,18,4,K.trunk);for(let i=1;i<18;i+=3)R(i,0,1,4,"#5A3E2C");R(1,4,2,2,"#5A3E2C");R(15,4,2,2,"#5A3E2C")});
const plume=h=>make(10,h,s=>{const {R,M,P}=s;R(3,2,4,h-5,K.wall);R(6,2,1,h-5,K.rip);R(3,2,1,h-5,"#FFFFFF"); // column
  R(2,0,6,3,"#FFFFFF");M(1,1,1,2,K.rip);M(0,3,1,1,K.rip);M(2,3,1,1,K.wall); // crown
  R(1,h-4,8,3,K.wall);R(0,h-3,10,2,K.rip);M(1,h-4,1,1,"#FFFFFF");R(2,h-1,6,1,K.rip)}); // splash
S.plumeTall=plume(30);S.plume=plume(22);
S.flowerbed=make(16,6,s=>{const {R,M,P}=s;R(0,1,16,5,K.lawnD);R(1,0,14,1,K.lawnD);R(1,1,14,4,K.t);
  for(let i=2;i<14;i+=3){P(i,2,"#F2A6B8");P(i+1,3,K.gold)}M(1,4,1,1,"#F2A6B8")});
S.bench=make(8,4,s=>{const {R}=s;R(0,0,8,2,K.trunk);R(0,0,8,1,"#9A7558");R(1,2,1,2,"#5A3E2C");R(6,2,1,2,"#5A3E2C")});
S.sparkle=make(9,9,s=>{const {R,P}=s;R(4,0,1,9,"#2F6FD6");R(0,4,9,1,"#2F6FD6");R(3,3,3,3,"#2F6FD6");R(4,2,1,5,"#FFFFFF");R(2,4,5,1,"#FFFFFF");
  P(1,1,"#7FC7BF");P(7,1,"#7FC7BF");P(1,7,"#7FC7BF");P(7,7,"#7FC7BF")});

/* ---- geometry helpers ---- */
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
// distance to a polyline; flat=true gives square (cut-off) ends instead of round caps
function dLine(x,y,L,flat=false){let m=1e9;for(let k=0;k<L.length-1;k++){const [a,b]=L[k],[c,d]=L[k+1];const dx=c-a,dy=d-b,l=dx*dx+dy*dy;let t=((x-a)*dx+(y-b)*dy)/l;
  if(flat&&((t<0&&k===0)||(t>1&&k===L.length-2)))continue;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(x-a-t*dx,y-b-t*dy))}return m}
function blob(cx,cy,rx,ry,wob=0.18,seed=1){const P=[];for(let k=0;k<24;k++){const a=k/24*6.283,r=1+wob*Math.sin(a*3+seed)+wob*.6*Math.cos(a*5+seed*2);P.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r])}return P}
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

/* ---- layout: straight lines and 45° only; geography loosened for looks ---- */
function rrect(x0,y0,x1,y1,r=4){const P=[];const c=[[x1-r,y0+r,-90],[x1-r,y1-r,0],[x0+r,y1-r,90],[x0+r,y0+r,180]];
  c.forEach(([cx,cy,a0])=>{for(let k=0;k<=4;k++){const a=(a0+k*22.5)*Math.PI/180;P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}});return P}
const PARK=[[194,40],[290,40],[290,120],[406,236],[428,258],[428,488],[34,488],[34,370],[64,340],[170,340],[170,64]];
const WALL=[[284,40],[194,40],[170,64],[170,340],[64,340],[34,370],[34,488],[428,488],[428,262]]; // not on the moat side
const GATES=[[428,350],[362,488]];
const SQUARE=[[452,250],[640,250],[640,486],[452,486]]; // 泉城广场
const MOAT=[[290,-4],[290,120],[406,236],[644,236]], MOAT_W=18;
const MOAT_NS=MOAT.slice(0,3), MOAT_EW=MOAT.slice(2);
const ROADS=[ // [polyline, width, major?] — only major roads bridge water
  [[[-4,9],[644,9]],12,1],[[[-4,497],[644,497]],16,1],[[[440,-4],[440,584]],12,1],
  [[[447,118],[640,118]],7],
  [[[-4,92],[162,92]],5],[[[-4,170],[162,170]],5],[[[-4,250],[162,250]],5],
  [[[60,15],[60,332]],5],[[[120,15],[120,332]],5],[[[520,15],[520,224]],5],[[[600,15],[600,224]],5],[[[300,15],[300,104]],5],[[[300,60],[433,60]],5],
  [[[-4,540],[644,540]],5],[[[150,505],[150,584]],5],[[[300,505],[300,584]],5],[[[540,505],[540,584]],5]];
const POOL={x0:318,y0:314,x1:378,y1:340}; // 趵突泉: walled rectangular pool
const PONDS=[
  {P:rrect(270,330,292,342,3),n:"漱玉泉"},{P:rrect(296,278,310,288,3),n:"金线泉"},{P:rrect(276,378,356,400,6),n:"枫溪"},
  {P:rrect(214,396,246,414,5),n:"无忧泉"},{P:rrect(40,452,120,478,7),n:"白龙湾"},{P:rrect(402,300,416,310,3),n:"马跑泉"},
  {P:rrect(236,318,250,328,3),n:"柳絮泉"},{P:rrect(196,262,210,272,3),n:"洗钵泉"}];
const STREAMS=[[[378,326],[392,326],[392,226]],[[292,336],[318,336]],[[348,340],[348,378]],
  [[276,392],[262,392],[250,404],[246,404]],[[214,405],[176,405],[136,445],[120,461]]];
const MAIN=[[[428,350],[398,350]],[[362,356],[362,488]],
  [[298,352],[262,352],[262,430],[100,430]],[[348,296],[348,260],[300,212],[230,212],[230,92]]];
const SIDE=[[[230,212],[190,212],[190,300],[262,300]],[[262,430],[262,470],[362,470]],[[100,430],[60,430],[60,446]],
  [[306,356],[306,366]],[[334,410],[362,410]],[[230,150],[270,150]],[[190,300],[190,380],[262,380]]];
const ZIGZAG=[[306,364],[306,384],[320,384],[320,394],[334,394],[334,412]];
const PLAZAS=[[[298,296],[398,296],[398,356],[298,356]],[[206,60],[254,60],[254,92],[206,92]]];

/* ---- ground raster ---- */
// 0 paper 1 lawn 2 road 3 roadEdge 4 water 5 waterEdge 6 path 7 plaza 8 lawnShade 9 balustrade 10 wall 11 wallCap
const T=new Uint8Array(W*H),BR=new Uint8Array(W*H); // BR: bridge deck (1 road, 2 rail, 3 stone path)
const inGate=(x,y)=>GATES.some(([a,b])=>Math.abs(x-a)<13&&Math.abs(y-b)<13);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x+.5,py=y+.5,i=y*W+x;let t=0;
  const park=inPoly(px,py,PARK),sq=inPoly(px,py,SQUARE);
  if(park)t=1;
  if(sq){t=7;const lawnW=x>=460&&x<532,lawnE=x>=560&&x<632;if((lawnW||lawnE)&&y>=258&&y<478&&Math.hypot(x-546,y-326)>26)t=1}
  if(t===1){if(MAIN.some(L=>dLine(px,py,L)<2.1)||SIDE.some(L=>dLine(px,py,L)<2.1))t=6 /* one path width everywhere */}
  for(const P of PLAZAS)if(inPoly(px,py,P))t=7;
  // roads never enter the park or the square; flat ends so lanes stop cleanly
  let road=0;if(!park&&!sq)for(const [L,w,maj] of ROADS){const d=dLine(px,py,L,true);if(d<=w/2){t=2;road=maj?d/(w/2)+1e-9:-1}}
  if(t===6&&Math.min(dLine(px,py,MOAT_NS),dLine(px,py,MOAT_EW))<=MOAT_W/2+2)t=1; // paths stop short of the moat
  // water
  const dm=Math.min(dLine(px,py,MOAT_NS),dLine(px,py,MOAT_EW));
  let wet=0;
  if(STREAMS.some(L=>dLine(px,py,L)<=2))wet=4;else if(t!==2&&t!==3&&t!==6&&t!==7&&STREAMS.some(L=>dLine(px,py,L)<=3))wet=5;
  if(PONDS.some(p=>inPoly(px,py,p.P)))wet=4;
  if(dm<=MOAT_W/2-2)wet=4;else if(dm<=MOAT_W/2)wet=wet||5;
  if(sq&&x>=538&&x<554&&y>=380&&y<462)wet=(x<539||x>=553||y<381||y>=461)?9:4; // fountain channel on the square axis
  if(wet){
    if(road>0&&dm<=MOAT_W/2+1){BR[i]=road>0.84?2:1;t=wet} // major road on a bridge over the moat
    else if(road!==0){/* minor road meets water: water wins */t=wet}
    else if(t===6&&wet===4){BR[i]=4;t=wet}else if(t===6){/* path keeps priority over a rim */} // footpath crossing a stream: stone slab bridge
    else t=wet}
  // the 趵突泉 pool: water inside a white stone balustrade
  if(x>=POOL.x0&&x<POOL.x1&&y>=POOL.y0&&y<POOL.y1){const e=x<POOL.x0+2||x>=POOL.x1-2||y<POOL.y0+2||y>=POOL.y1-2;t=e?9:4}
  // park wall (white wall, grey tile cap), gaps at the gates
  // (no park wall: Moondog cut it)
  T[i]=t}
// road edge: a 1-px stroke all the way round every road, ends included
for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;if(T[i]===0&&(T[i-1]===2||T[i+1]===2||T[i-W]===2||T[i+W]===2))T[i]=3}
// zigzag bridge over 枫溪
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(dLine(x+.5,y+.5,ZIGZAG,true)<2.1){const i=y*W+x;if(T[i]===4||T[i]===5)BR[i]=4;else if(T[i]===1||T[i]===8)T[i]=6}
// stone rims where water meets lawn or path
for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;if(T[i]!==1&&T[i]!==7)continue;
  if(T[i-1]===4||T[i+1]===4||T[i-W]===4||T[i+W]===4)T[i]=5}
// one-px shade on the south edge of every lawn
for(let y=H-2;y>=0;y--)for(let x=0;x<W;x++){const i=y*W+x;if(T[i]===1&&T[i+W]!==1&&T[i+W]!==8)T[i]=8}

const layer=()=>{const c=document.createElement("canvas");c.width=W;c.height=H;return c};
const L={ground:layer(),water:layer(),ripples:layer(),boats:layer(),bridges:layer(),city:layer(),sprites:layer(),movers:layer()};
{const g=L.ground.getContext("2d"),w=L.water.getContext("2d"),b=L.bridges.getContext("2d");
  const col=[false?"#E5D6A9":"#F4EACA",K.lawn,K.road,K.edge,null,K.stoneD,K.road,"#FBF3DA",K.lawnD,K.wall,K.wall,K.tile,K.tileD,K.wallD];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,t=T[i];
    if(t===4){w.fillStyle=(y>0&&T[i-W]!==4)?K.wd:K.w;w.fillRect(x,y,1,1)}
    else{let c=col[t];if(t===9&&(x+y)%4===0)c=K.wallD;g.fillStyle=c;g.fillRect(x,y,1,1)}
    if(BR[i]){let c=BR[i]===1?K.road:BR[i]===2?K.stoneD:K.stone;
      if(BR[i]===4){const deck=j=>BR[j]===4||T[j]===6;c=K.road}
      b.fillStyle=c;b.fillRect(x,y,1,1)}}
  // bridge undersides: a dark line where the deck ends over water, so boats read as passing under
  for(let y=1;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!BR[i]&&BR[i-W]&&T[i]===4){b.fillStyle=K.wd;b.fillRect(x,y,1,1)}}
  g.fillStyle=K.edge;for(let x=4;x<W;x+=14){if(!BR[9*W+x])g.fillRect(x,9,6,1);g.fillRect(x,497,6,1)}
  const r=L.ripples.getContext("2d");r.fillStyle=K.rip;
  for(let k=0;k<300;k++){const x=Math.floor(rnd()*W),y=Math.floor(rnd()*H);let ok=true;for(let i=-2;i<6;i++){const j=y*W+x+i;if(T[j]!==4||T[j-W]!==4||T[j+W]!==4||BR[j])ok=false}if(ok)r.fillRect(x,y,4,1)}}

/* ---- sprites: occupancy mask, depth-sorted ---- */
const occ=new Uint8Array(W*H),items=[];
const free=(x0,y0,w,h,allowed)=>{if(x0<0||y0<0||x0+w>W||y0+h>H)return false;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const i=y*W+x;if(occ[i]||BR[i]||!allowed.includes(T[i]))return false}return true};
const mark=(x0,y0,w,h)=>{for(let y=Math.max(0,y0);y<Math.min(H,y0+h);y++)for(let x=Math.max(0,x0);x<Math.min(W,x0+w);x++)occ[y*W+x]=1};
// tree rule: trees never overlap anything (full sprite box + 1 px gap); clumps sit on a 45° lattice
const occAll=new Uint8Array(W*H),TREES=new Set(["treeBig","treeMid","treeSmall","willow","cypress"]);
const boxFree=(x0,y0,w,h)=>{for(let y=Math.max(0,y0);y<Math.min(H,y0+h);y++)for(let x=Math.max(0,x0);x<Math.min(W,x0+w);x++)if(occAll[y*W+x])return false;return true};
function place(k,cx,bottom,opt={}){const sp=S[k];const x0=Math.round(cx-sp.width/2),y0=Math.round(bottom-sp.height);
  const fy=opt.foot??Math.ceil(sp.height*.45);
  if(opt.check&&!free(x0,bottom-fy,sp.width,fy,opt.check))return false;
  if(TREES.has(k)&&!boxFree(x0-1,y0-1,sp.width+2,sp.height+2))return false;
  mark(x0,bottom-fy,sp.width,fy);
  for(let y=Math.max(0,y0);y<Math.min(H,bottom);y++)for(let x=Math.max(0,x0);x<Math.min(W,x0+sp.width);x++)occAll[y*W+x]=1;
  items.push({k,x:x0,y:y0,b:bottom,city:!!opt.city});return true}
const GROUND=[0],LAWN=[1,8];
// hero: 趵突泉 with 泺源堂 behind and pavilions either side
mark(POOL.x0,POOL.y0,POOL.x1-POOL.x0,POOL.y1-POOL.y0);
place("hall",348,312);place("plume",333,333,{foot:0});place("plumeTall",348,331,{foot:0});place("plume",363,333,{foot:0});
place("greyPav",308,354);place("greyPav",388,354);
place("memorial",230,86);place("cnCourtyard",292,206);place("cnTwoStorey",390,286);place("cnHouse",280,322,{check:LAWN.concat([6,7]),foot:6});
place("cnCourtyard",190,476);place("cnHouse",156,476);place("cnShop",400,456);place("greyPav",230,394);
place("paifang",428,352);place("paifang",362,490);
place("quanbiao",546,326);
// (bamboo cut)
[[210,104],[250,104],[210,124],[250,124],[200,70],[260,70]].forEach(([a,b])=>place("cypress",a,b,{check:LAWN,foot:3}));
[[296,348],[402,346],[270,376],[358,404],[250,416],[124,450]].forEach(([a,b])=>place("rock",a,b,{check:LAWN.concat([5,6,7]),foot:2}));
[[296,390],[326,388],[70,468],[96,470],[52,462],[236,406]].forEach(([a,b])=>place("lotus",a,b,{check:[4],foot:5}));
// square: tree rows along the outer edge of each lawn, flowerbeds along the axis
for(let y=272,k=0;y<478;y+=14,k++){place("treeMid",466+(k%2)*12,y,{check:LAWN,foot:3});place("treeMid",626-(k%2)*12,y,{check:LAWN,foot:3})} // 45° zigzag rows
for(let y=290;y<476;y+=26){place("flowerbed",522,y,{check:LAWN,foot:4});place("flowerbed",570,y,{check:LAWN,foot:4})}
place("pier",520,232,{foot:0});
// willows along both moat banks, evenly spaced
for(let k=0;k<MOAT.length-1;k++){const [a,b]=MOAT[k],[c,d]=MOAT[k+1];const len=Math.hypot(c-a,d-b),nx=-(d-b)/len,ny=(c-a)/len;
  for(let t=8;t<len;t+=(Math.abs(d-b)>1?22:28)){const x=a+(c-a)*t/len,y=b+(d-b)*t/len;
    for(const sg of [-1,1]){const ox=x+nx*sg*17,oy=y+ny*sg*17+6;place("treeMid",ox,oy,{check:GROUND.concat(LAWN,[7]),foot:3,city:!inPoly(ox,oy,PARK)})}}}
// city blocks: pale backdrop layer
function fillRow(y,x0,x1,kinds){let x=x0;while(x<x1){const k=kinds[Math.floor(rnd()*kinds.length)],w=S[k].width;if(x+w>x1)break;
  if(place(k,x+w/2,y,{check:GROUND,foot:Math.min(10,S[k].height),city:true}))x+=w+2+Math.floor(rnd()*3);else x+=4}}
const OLD=["cnHouse","cnHouse","cnShop","cnTwoStorey","cnCourtyard","cnHouse"],NEW=["apartment","shop","redVilla","charVilla","apartment","redHouse"],MIX=["cnHouse","cnTwoStorey","shop","redHouse","cnShop","apartment"];
[[44,0,166],[86,0,166],[126,0,166],[164,0,166],[206,0,166],[244,0,166],[286,0,166],[326,0,166],[34,194,290],[52,304,434],[100,312,434]].forEach(([y,a,b])=>fillRow(y,a,b,y<200?OLD:MIX));
[[50,447,640],[110,447,640],[160,447,640],[198,447,640],[226,447,640]].forEach(([y,a,b])=>fillRow(y,a,b,NEW));
[[536,0,640],[578,0,640]].forEach(([y,a,b])=>fillRow(y,a,b,NEW.concat(["shop","apartment"])));
// park trees in clumps, willows near water; open lawns get flowerbeds and benches
const G=16; // lattice step: diagonal neighbours are (±16,±16), same-row neighbours 32 apart
for(let j=0;j*G+40<488;j++)for(let i=0;i*G+30<510;i++){if((i+j)%2)continue;const a=30+i*G,b=40+j*G;if(T[b*W+a]!==1)continue;
  let nearW=false;for(let i=-10;i<=10;i+=5)for(let j=-6;j<=6;j+=6)if(T[(b+j)*W+a+i]===4)nearW=true;
  const k=["treeBig","treeMid","treeMid","treeSmall","treeBig"][Math.floor(rnd()*5)];
  const clump=Math.sin(a*.045+1)*Math.cos(b*.05+2)+Math.sin(a*.02-b*.03)*.6;
  window.DBG=window.DBG||{try:0,ok:0};if(clump>-.35&&rnd()<.9&&Math.hypot(a-348,b-326)>48){DBG.try++;if(place(k,a,b,{check:LAWN,foot:4}))DBG.ok++}}
for(let k=0;k<400;k++){const a=30+Math.floor(rnd()*480),b=40+Math.floor(rnd()*448);
  let nearMain=false;for(const [i,j] of [[0,4],[0,-6],[6,0],[-6,0]])if(T[(b+j)*W+a+i]===6)nearMain=true;
  if(nearMain&&rnd()<.5)place("bench",a,b,{check:LAWN,foot:4});else if(rnd()<.12)place("flowerbed",a,b,{check:LAWN,foot:6})}
for(let k=0;k<160;k++){const a=Math.floor(rnd()*W),b=Math.floor(rnd()*H);place(rnd()<.6?"treeSmall":"bush",a,b,{check:GROUND,foot:4,city:true})}
items.sort((p,q)=>p.b-q.b);
const V="C"; // C (pastel facades) chosen by Moondog
const BUILD=k=>!TREES.has(k)&&!["bush","rock","lotus","flowerbed","bench","pier","plume","plumeTall"].includes(k);
{const s=L.sprites.getContext("2d"),c=L.city.getContext("2d");
  // option A: a flat drop shadow under every building, offset down-right
  if(V.includes("A")){const sh=document.createElement("canvas");sh.width=W;sh.height=H;const x=sh.getContext("2d");
    items.filter(it=>BUILD(it.k)).forEach(it=>x.drawImage(S[it.k],it.x+2,it.y+2));x.globalCompositeOperation="source-in";x.fillStyle="#C9B98A";x.fillRect(0,0,W,H);
    L.ground.getContext("2d").drawImage(sh,0,0)}
  // option C: pastel facades on modern buildings (wall colours swapped per building)
  const PAST=[["#F2BFA8","#D99E86"],["#BFE0CC","#98C2AB"],["#F6DC94","#DCBF70"],["#BCD5EE","#97B3D2"]],MODERN=["apartment","shop","redVilla","charVilla","redHouse"];
  const swap=(k,n)=>{const key=k+"|"+n;if(S[key])return S[key];const src=S[k],cv=document.createElement("canvas");cv.width=src.width;cv.height=src.height;const x=cv.getContext("2d");x.drawImage(src,0,0);
    const d=x.getImageData(0,0,cv.width,cv.height),hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),[w1,w2]=[hex(K.wall),hex(K.wallD)],[p1,p2]=PAST[n].map(hex);
    for(let i=0;i<d.data.length;i+=4){const px=[d.data[i],d.data[i+1],d.data[i+2]];const eq=a=>a.every((v,j)=>v===px[j]);const r=eq(w1)?p1:eq(w2)?p2:null;if(r){d.data[i]=r[0];d.data[i+1]=r[1];d.data[i+2]=r[2]}}
    x.putImageData(d,0,0);return S[key]=cv};
  items.forEach((it,n)=>{const sp=V.includes("C")&&MODERN.includes(it.k)?swap(it.k,(it.x*7+it.y*3)%4):S[it.k];(it.city?c:s).drawImage(sp,it.x,it.y)})}

/* ---- movers: boats sit under the bridges, everything else on top ---- */
{const put=(m,k,cx,b)=>{const sp=S[k];m.drawImage(sp,Math.round(cx-sp.width/2),Math.round(b-sp.height))};
  const bt=L.boats.getContext("2d"),m=L.movers.getContext("2d");
  put(bt,"tourBoat",560,242);put(bt,"tourBoat",480,242);put(bt,"rowboat",80,468);
  put(m,"bus",120,13);put(m,"car",400,13);put(m,"carTeal",230,14);put(m,"bus",480,500);put(m,"car",200,505);put(m,"carTeal",330,499);put(m,"car",620,505);put(m,"cyclist",40,506);
  put(m,"car",560,122);put(m,"person2",320,393);
  // people on paths: pick path pixels with a fixed seed so they stay put between renders
  let n=0;for(let k=0;k<4000&&n<16;k++){const x=30+Math.floor(rnd()*600),y=40+Math.floor(rnd()*450);const i=y*W+x;
    if((T[i]===6||T[i]===7)&&T[i-W*2]!==4&&!occ[i]){put(m,n%2?"person":"person2",x,y+1);n++;for(let j=-10;j<10;j++)for(let l=-10;l<10;l++)occ[(y+j)*W+x+l]=1}}}

// the layers in drawing order, at 1 px per mockup pixel (640×580)
export function layers({ movers = true } = {}) {
  return ["ground","water","ripples","boats","bridges","city","sprites","movers"].filter((k) => movers || (k !== "movers" && k !== "boats")).map((k) => L[k]);
}
export const SIZE = { w: W, h: H };
