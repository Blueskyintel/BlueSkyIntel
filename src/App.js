import { useState, useRef } from "react";

const DEALS = [
  { id:1, title:"Penske acquires 2 Lexus stores", states:["TX","CA"], region:"Multi", brand:"Lexus", date:"Mar 2026", size:"Undisclosed", source:"Automotive News", signal:"confirmed", stores:2, detail:"Ongoing luxury import focus. Penske continuing recognized-brand strategy in key markets. Lexus remains the most competitive franchise to acquire nationally." },
  { id:2, title:"Lithia acquires Mercedes-Benz of Medford", states:["OR"], region:"Pacific", brand:"Mercedes-Benz", date:"Feb 2026", size:"Incl. real estate", source:"Presidio Group", signal:"confirmed", stores:1, detail:"Advised by The Presidio Group. Real estate included. Lithia continuing Pacific Coast luxury build-out." },
  { id:3, title:"Asbury sells 6 St. Louis luxury stores to MileOne", states:["MO"], region:"Midwest", brand:"Multi luxury", date:"Feb 2026", size:"Undisclosed", source:"Presidio Group", signal:"confirmed", stores:6, detail:"Portfolio optimization post-Herb Chambers. MileOne expands Midwest luxury footprint significantly." },
  { id:4, title:"ZT Automotive acquires 4 Tampa Bay dealerships", states:["FL"], region:"Southeast", brand:"Multi-brand", date:"Dec 2025", size:"Undisclosed", source:"Auto Remarketing", signal:"confirmed", stores:4, detail:"Part of Q4 2025 year-end flurry involving 15 stores across 5 states. Tampa Bay market attracting aggressive consolidators." },
  { id:5, title:"Hudson Automotive acquires All Star Automotive Group", states:["GA","SC","NC"], region:"Southeast", brand:"Multi-brand", date:"Q4 2025", size:"2nd largest 2025", source:"Kerrigan Advisors", signal:"confirmed", detail:"Second largest transaction in 2025. Southeast consolidation accelerating at record pace." },
  { id:6, title:"Group 1 acquires 3 luxury stores in FL & TX", states:["FL","TX"], region:"Southeast", brand:"Lexus, Acura, Mercedes", date:"May 2025", size:"$330M rev", source:"SEC 8-K", signal:"confirmed", stores:3, detail:"Fort Myers FL Lexus & Acura plus TX Mercedes-Benz. Expands Group 1 cluster strategy in high-growth markets." },
  { id:7, title:"Asbury acquires The Herb Chambers Companies", states:["MA","CT","NH","RI"], region:"Northeast", brand:"Multi (52 franchises)", date:"Jul 2025", size:"$1.45B", source:"Business Wire", signal:"confirmed", stores:33, detail:"3rd largest deal in auto retail history. 33 dealerships, 52 franchises, 3 collision centers across New England." },
  { id:8, title:"PE & family offices accelerating dealership entries", states:["TX","FL","GA","NC","TN"], region:"Multi", brand:"Multi-brand", date:"2026", size:"Multiple", source:"WardsAuto", signal:"pre-market", detail:"New capital entering buy-sell. Low rates fueling PE and family office dealership acquisitions across Sun Belt." },
  { id:9, title:"Carvana acquiring Stellantis franchise stores", states:["AZ","CA","TX"], region:"Southwest", brand:"Jeep/Ram/Chrysler", date:"2024-2026", size:"Undisclosed", source:"ION Analytics", signal:"pre-market", stores:5, detail:"Online giant entering new-car market. 5 Stellantis stores over 2 years. Watch for further brand expansion." },
];

const BLUE_SKY = {
  "Toyota":    { low:8.0,  high:12.0, trend:"up",    note:"Most coveted franchise. 10x+ in FL & TX. Buyers compete aggressively at any price." },
  "Lexus":     { low:9.0,  high:13.0, trend:"up",    note:"Near-impossible to acquire. Scarce supply driving record premiums nationally." },
  "Honda":     { low:5.5,  high:8.0,  trend:"up",    note:"Low-end raised Q4 2025 by Kerrigan. Industry-leading hybrid sales driving confidence." },
  "BMW":       { low:6.0,  high:9.0,  trend:"up",    note:"Multiple increased Q4 2025. Strong luxury demand across all geographic markets." },
  "Mercedes":  { low:5.5,  high:8.5,  trend:"stable",note:"Consistent institutional buyer interest. Solid luxury performance continues." },
  "Audi":      { low:5.0,  high:8.0,  trend:"up",    note:"Q4 2025 increase per Kerrigan. European luxury gaining meaningful momentum." },
  "Porsche":   { low:8.0,  high:11.0, trend:"down",  note:"Low end cut Q3 2025. EV strategy delays and high facility requirements create headwinds." },
  "Ford":      { low:3.0,  high:5.0,  trend:"up",    note:"US manufacturing bill significantly boosted domestic brand sentiment." },
  "Chevrolet": { low:3.0,  high:4.75, trend:"up",    note:"High-end raised Q4 2025. Improved inventory discipline driving buyer interest." },
  "Cadillac":  { low:3.5,  high:5.5,  trend:"up",    note:"Q4 2025 increase. EV transition creating new strategic acquisition opportunity." },
  "Subaru":    { low:4.0,  high:6.5,  trend:"down",  note:"Sales -5.8% YoY Q3 2025. Softening demand across most key markets." },
  "Kia":       { low:4.5,  high:5.5,  trend:"stable",note:"Consistent regional demand. Haig and Kerrigan aligned on range." },
  "Nissan":    { low:1.5,  high:3.0,  trend:"down",  note:"Below pre-pandemic levels. Elevated inventory and weak buyer demand persist." },
  "Jeep/Ram":  { low:2.5,  high:4.5,  trend:"stable",note:"Carvana now entering Stellantis space. Interesting dynamic developing." },
};

const HISTORY = [
  { era:"1990s Consolidation", years:"1996-2000", mult:"1-3x", summary:"Public auto retail is born. AutoNation, CarMax, United Auto Group IPO. Industry consolidates from ~50,000 to ~22,000 franchised points.", lesson:"Brand mix and geography determined survivors — scale alone proved insufficient." },
  { era:"2008 Financial Crisis", years:"2007-2010", mult:"0-1.5x", summary:"SAAR collapses from 16M to 10.4M. GM and Chrysler file bankruptcy. Over 2,000 franchise points eliminated. Import dealers outperform domestic 2:1.", lesson:"Fixed operations absorption ratio became the definitive dealership survival metric." },
  { era:"Post-Crisis Recovery", years:"2011-2019", mult:"3-6x", summary:"SAAR recovers to 17M by 2016. Lithia, Penske, Asbury accelerate acquisitions. PE capital enters. Top 150 groups grow from 15% to 30% of all franchised points.", lesson:"Lithia hub-and-spoke regional clustering proved the most scalable model." },
  { era:"COVID-Era Boom", years:"2020-2022", mult:"Peak 8-15x", summary:"Chip shortage creates scarcity. Avg dealer pre-tax hits $4M+ (4x pre-COVID). Toyota/Lexus at 10-12x. 2021 sets all-time buy-sell volume record.", lesson:"The valuation gap between buyers and sellers resolved by 2023 — then the market ran." },
  { era:"EV Transition & Normalization", years:"2023-2025", mult:"4-12x K-shaped", summary:"Profits normalize but remain elevated at $4.1M avg per store in 2024. EV mandates drive brand divergence. 2025 sets new record. Public groups deploy $4.4B.", lesson:"Brand selection now eclipses geography as the primary value driver." },
  { era:"2026 Banner Year", years:"2026+", mult:"8-13x top brands", summary:"Pipeline at record levels. Private buyers 90%+ of deals. PE and family offices accelerating. Single-points are prime targets. Sun Belt dominates.", lesson:"Five rooftops will be fifteen in eight years. Buy now before premiums compound." },
];

const STATE_DEALS = {};
DEALS.forEach(d => (d.states||[]).forEach(s => { if(!STATE_DEALS[s]) STATE_DEALS[s]=[]; STATE_DEALS[s].push(d); }));

const HEAT = {FL:95,TX:88,MA:85,GA:78,CA:72,NC:70,CT:75,OR:60,MO:58,SC:65,NH:62,RI:60,AZ:68,TN:55,VA:52,OH:48,IL:45,CO:42,WA:50,NV:44,NY:55,NJ:50,MD:46,MI:44,MN:40,PA:42};

// Apple design system
const C = {
  bg:"#000",surface:"#0a0a0a",card:"#111",border:"rgba(255,255,255,0.08)",
  borderGold:"rgba(212,175,55,0.22)",gold:"#d4af37",goldDim:"rgba(212,175,55,0.1)",
  text:"#f5f5f7",sub:"#86868b",dim:"#3a3a3a",
  red:"#ff453a",green:"#32d74b",blue:"#2997ff",
};

const sigC = s => s==="confirmed"?C.gold:C.blue;
const sigL = s => s==="confirmed"?"CONFIRMED":"PRE-MARKET";
const tC = t => t==="up"?C.gold:t==="down"?C.red:C.sub;
const fmt = v => "$"+Math.round(v).toLocaleString();

const callClaude = async (sys, msg, hist=[]) => {
  const r = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({system:sys, messages:[...hist,{role:"user",content:msg}]})
  });
  if(!r.ok) throw new Error("API "+r.status);
  const d = await r.json();
  return d.content?.map(c=>c.text||"").join("")||"No response.";
};

function Tag({children, color}) {
  const c=color||C.gold;
  return <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",background:c+"18",color:c,border:"1px solid "+c+"35",letterSpacing:"0.1em"}}>{children}</span>;
}

function Stat({label,value,sub,gold}) {
  return (
    <div style={{background:C.card,border:"1px solid "+C.border,padding:"15px 16px",position:"relative"}}>
      {gold&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,"+C.gold+",transparent)"}}/>}
      <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.14em",color:C.sub,textTransform:"uppercase",marginBottom:5}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:gold?C.gold:C.text,letterSpacing:"-0.03em",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.dim,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function AIChat({sys, placeholder}) {
  const [msgs,setMsgs]=useState([]); const [inp,setInp]=useState(""); const [load,setLoad]=useState(false); const endRef=useRef(null);
  const send=async()=>{
    if(!inp.trim()||load) return;
    const t=inp.trim(); setInp(""); setLoad(true);
    setMsgs(m=>[...m,{role:"user",content:t}]);
    try {
      const r=await callClaude(sys,t,msgs.map(m=>({role:m.role,content:m.content})));
      setMsgs(m=>[...m,{role:"assistant",content:r}]);
    } catch(e) {
      setMsgs(m=>[...m,{role:"assistant",content:"Connection error — ensure ANTHROPIC_API_KEY is saved in Vercel environment variables, then redeploy."}]);
    }
    setLoad(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  return (
    <div style={{border:"1px solid "+C.borderGold,background:C.card,marginTop:20}}>
      <div style={{padding:"9px 14px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:8,background:C.goldDim}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,boxShadow:"0 0 8px "+C.gold}}/>
        <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.16em",color:C.gold,textTransform:"uppercase"}}>AI Market Analyst</span>
        <span style={{fontSize:9,color:C.dim,marginLeft:"auto",letterSpacing:"0.08em"}}>CLAUDE · ANTHROPIC</span>
      </div>
      <div style={{minHeight:80,maxHeight:220,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.length===0&&<p style={{fontSize:12,color:C.sub,fontStyle:"italic",lineHeight:1.65}}>{placeholder}</p>}
        {msgs.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"90%"}}>
            <div style={{background:m.role==="user"?C.gold:C.surface,color:m.role==="user"?"#000":C.text,padding:"8px 12px",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",fontWeight:m.role==="user"?600:400,border:"1px solid "+(m.role==="user"?"transparent":C.border)}}>{m.content}</div>
          </div>
        ))}
        {load&&<div style={{background:C.surface,border:"1px solid "+C.border,padding:"8px 12px",fontSize:13,color:C.sub,alignSelf:"flex-start"}}>Analyzing...</div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",borderTop:"1px solid "+C.border}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{flex:1,background:"transparent",border:"none",color:C.text,padding:"10px 14px",fontSize:13,outline:"none"}}/>
        <button onClick={send} style={{background:C.gold,border:"none",color:"#000",padding:"10px 18px",fontSize:9,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase"}}>SEND</button>
      </div>
    </div>
  );
}

// ─── TOPOGRAPHIC HEATMAP ──────────────────────────────────────────────────────
// Real state polygon paths in 960x580 coordinate space
const SPATHS = {
  ME:"M860,42 L905,42 L905,90 L860,90 Z",
  VT:"M838,80 L860,80 L860,125 L838,125 Z",
  NH:"M858,58 L882,58 L882,130 L858,130 Z",
  MA:"M828,128 L895,128 L895,148 L828,148 Z",
  RI:"M892,145 L910,145 L910,162 L892,162 Z",
  CT:"M828,148 L892,148 L892,168 L828,168 Z",
  NY:"M720,118 L838,118 L838,185 L720,185 Z",
  NJ:"M828,168 L858,168 L858,205 L828,205 Z",
  DE:"M852,198 L872,198 L872,218 L852,218 Z",
  MD:"M758,200 L855,200 L855,228 L758,228 Z",
  PA:"M720,168 L828,168 L828,205 L720,205 Z",
  VA:"M698,222 L820,222 L820,262 L698,262 Z",
  WV:"M695,198 L745,198 L745,240 L695,240 Z",
  NC:"M688,262 L812,262 L812,295 L688,295 Z",
  SC:"M718,292 L800,292 L800,328 L718,328 Z",
  GA:"M688,295 L762,295 L762,388 L688,388 Z",
  FL:"M688,385 L808,385 L808,478 L688,478 Z",
  AL:"M638,318 L688,318 L688,408 L638,408 Z",
  MS:"M588,318 L638,318 L638,402 L588,402 Z",
  TN:"M582,278 L762,278 L762,318 L582,318 Z",
  KY:"M618,242 L762,242 L762,278 L618,278 Z",
  OH:"M690,158 L752,158 L752,238 L690,238 Z",
  IN:"M640,155 L692,155 L692,248 L640,248 Z",
  IL:"M580,145 L640,145 L640,252 L580,252 Z",
  MI:"M622,65 L710,65 L710,162 L622,162 Z",
  WI:"M572,62 L622,62 L622,148 L572,148 Z",
  MN:"M508,42 L600,42 L600,148 L508,148 Z",
  IA:"M508,148 L600,148 L600,198 L508,198 Z",
  MO:"M508,198 L600,198 L600,262 L508,262 Z",
  AR:"M508,318 L592,318 L592,372 L508,372 Z",
  LA:"M508,372 L588,372 L588,435 L508,435 Z",
  ND:"M372,40 L510,40 L510,110 L372,110 Z",
  SD:"M372,110 L510,110 L510,175 L372,175 Z",
  NE:"M372,175 L508,175 L508,225 L372,225 Z",
  KS:"M372,225 L508,225 L508,272 L372,272 Z",
  OK:"M355,272 L510,272 L510,318 L355,318 Z",
  TX:"M355,318 L510,318 L510,450 L355,450 Z",
  MT:"M198,38 L372,38 L372,118 L198,118 Z",
  WY:"M258,118 L372,118 L372,188 L258,188 Z",
  CO:"M258,188 L372,188 L372,258 L258,258 Z",
  NM:"M258,355 L372,355 L372,432 L258,432 Z",
  ID:"M198,60 L260,60 L260,185 L198,185 Z",
  UT:"M178,195 L260,195 L260,298 L178,298 Z",
  AZ:"M178,298 L258,298 L258,430 L178,430 Z",
  NV:"M152,188 L200,188 L200,308 L152,308 Z",
  OR:"M98,118 L200,118 L200,192 L98,192 Z",
  WA:"M98,58 L200,58 L200,122 L98,122 Z",
  CA:"M98,192 L178,192 L178,358 L98,358 Z",
};

// Centroid of each state for label placement
function centroid(path) {
  const nums = (path.match(/[d.]+/g)||[]).map(Number);
  const xs=[],ys=[];
  for(let i=0;i<nums.length;i+=2){xs.push(nums[i]);ys.push(nums[i+1]);}
  return {cx:(Math.min(...xs)+Math.max(...xs))/2, cy:(Math.min(...ys)+Math.max(...ys))/2,
    w:Math.max(...xs)-Math.min(...xs), h:Math.max(...ys)-Math.min(...ys)};
}

function TopoMap() {
  const [hov,setHov]=useState(null);
  const [tip,setTip]=useState({x:0,y:0});
  const svgRef=useRef(null);

  const getHeat=s=>HEAT[s]||(STATE_DEALS[s]?30:12);

  // Terrain-accurate color palette matching the reference image
  // Deep forest greens, warm tans, rich browns — topographic relief style
  const terrainFill=(h,isHov)=>{
    if(isHov) return "#e8d070";
    if(h>=88) return "#7a5c18";   // deep amber-brown — hottest
    if(h>=75) return "#5a4a20";   // dark warm brown
    if(h>=62) return "#3d5c2e";   // rich forest green
    if(h>=48) return "#2e4a28";   // deep green
    if(h>=32) return "#1e3420";   // dark forest
    return "#141e16";              // near-black lowlands
  };

  const terrainStroke=(h,isHov)=>{
    if(isHov) return "#e8d070";
    if(h>=75) return "rgba(212,175,55,0.5)";
    if(h>=48) return "rgba(80,120,60,0.4)";
    return "rgba(255,255,255,0.06)";
  };

  return (
    <div style={{background:"#050c08",border:"1px solid "+C.borderGold,position:"relative",overflow:"hidden"}}>

      {/* Topographic contour lines as background texture */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.05,pointerEvents:"none"}} viewBox="0 0 960 520" preserveAspectRatio="none">
        <defs>
          <radialGradient id="tg1" cx="35%" cy="40%" r="40%"><stop offset="0%" stopColor="#d4af37" stopOpacity="1"/><stop offset="100%" stopColor="#d4af37" stopOpacity="0"/></radialGradient>
          <radialGradient id="tg2" cx="68%" cy="65%" r="35%"><stop offset="0%" stopColor="#d4af37" stopOpacity="0.8"/><stop offset="100%" stopColor="#d4af37" stopOpacity="0"/></radialGradient>
        </defs>
        {[20,40,60,80,100,120,140,160,180].map(r=><ellipse key={r} cx="340" cy="240" rx={r*1.6} ry={r*0.9} fill="none" stroke="#d4af37" strokeWidth="0.5"/>)}
        {[15,30,45,60,75,90,105].map(r=><ellipse key={r+"b"} cx="650" cy="350" rx={r*1.8} ry={r} fill="none" stroke="#d4af37" strokeWidth="0.4"/>)}
        {[10,22,34,46,58].map(r=><ellipse key={r+"c"} cx="160" cy="300" rx={r*1.2} ry={r*0.7} fill="none" stroke="#d4af37" strokeWidth="0.3"/>)}
        {/* Subtle grid lines */}
        {[...Array(10)].map((_,i)=><line key={i} x1={i*100} y1="0" x2={i*100} y2="520" stroke="#d4af37" strokeWidth="0.2"/>)}
        {[...Array(6)].map((_,i)=><line key={i+"h"} x1="0" y1={i*90} x2="960" y2={i*90} stroke="#d4af37" strokeWidth="0.2"/>)}
      </svg>

      {/* Atmospheric overlay — simulates shaded relief */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 25% 35%, rgba(74,103,65,0.15) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(90,74,32,0.1) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, transparent 70%)",pointerEvents:"none",zIndex:1}}/>

      <svg ref={svgRef} viewBox="0 0 960 520" style={{width:"100%",display:"block",maxHeight:460,position:"relative",zIndex:2}}
        onMouseLeave={()=>setHov(null)}>
        <defs>
          <filter id="relief" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur"/>
            <feOffset dx="1.5" dy="2.5" in="blur" result="shadow"/>
            <feFlood floodColor="rgba(0,0,0,0.6)" result="color"/>
            <feComposite in="color" in2="shadow" operator="in" result="colored-shadow"/>
            <feMerge><feMergeNode in="colored-shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-gold">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="glow-soft">
            <feGaussianBlur stdDeviation="2.5"/>
          </filter>
          <linearGradient id="hillshade-n" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)"/>
            <stop offset="60%" stopColor="rgba(255,255,255,0)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)"/>
          </linearGradient>
        </defs>

        {/* Ocean base */}
        <rect width="960" height="520" fill="#020d14"/>

        {/* Render each state */}
        {Object.entries(SPATHS).map(([code,path])=>{
          const heat=getHeat(code);
          const deals=STATE_DEALS[code]||[];
          const isHov=hov===code;
          const fill=terrainFill(heat,isHov);
          const stroke=terrainStroke(heat,isHov);
          const {cx,cy,w,h}=centroid(path);
          return (
            <g key={code}
              onMouseEnter={e=>{setHov(code);const b=svgRef.current?.getBoundingClientRect();if(b)setTip({x:e.clientX-b.left,y:e.clientY-b.top});}}
              onMouseMove={e=>{const b=svgRef.current?.getBoundingClientRect();if(b)setTip({x:e.clientX-b.left,y:e.clientY-b.top});}}
              style={{cursor:"pointer"}}>
              {/* Drop shadow for 3D terrain relief feel */}
              <path d={path} fill="rgba(0,0,0,0.5)" transform="translate(1.5,2.5)" filter="url(#glow-soft)" opacity={0.7}/>
              {/* Hot state outer glow */}
              {heat>=70&&!isHov&&<path d={path} fill="none" stroke={C.gold} strokeWidth="1.5" opacity={0.35} filter="url(#glow-soft)"/>}
              {isHov&&<path d={path} fill={C.gold} opacity={0.18} filter="url(#glow-gold)"/>}
              {/* Main fill */}
              <path d={path} fill={fill} stroke={stroke} strokeWidth={isHov?1.5:0.7} filter="url(#relief)"/>
              {/* Hillshade overlay — simulates light from NW */}
              <path d={path} fill="url(#hillshade-n)" opacity={0.5}/>
              {/* State label */}
              {w>28&&h>18&&<text x={cx} y={cy+0.5} textAnchor="middle" dominantBaseline="middle"
                fontSize={w>70?8:6} fontWeight="700"
                fill={heat>=65?"rgba(0,0,0,0.75)":"rgba(255,255,255,0.45)"}
                letterSpacing="0.02em" style={{pointerEvents:"none"}}>{code}</text>}
              {/* Deal count badge */}
              {deals.length>0&&(
                <g style={{pointerEvents:"none"}}>
                  <circle cx={cx+(w>60?14:8)} cy={cy-(h>35?10:6)} r={5.5} fill={C.gold} opacity={0.95}/>
                  <text x={cx+(w>60?14:8)} y={cy-(h>35?10:6)+0.5} textAnchor="middle" dominantBaseline="middle"
                    fontSize={5.5} fontWeight="900" fill="#000">{deals.length}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hov&&(()=>{
        const deals=STATE_DEALS[hov]||[]; const heat=getHeat(hov);
        const svgEl=svgRef.current; if(!svgEl) return null;
        const svgW=svgEl.clientWidth, svgH=svgEl.clientHeight;
        const tx=Math.min(Math.max(tip.x+12,8),svgW-310);
        const ty=Math.min(Math.max(tip.y-10,8),svgH-60);
        return (
          <div style={{position:"absolute",left:tx,top:ty,minWidth:240,maxWidth:295,background:"rgba(4,8,12,0.97)",border:"1px solid "+C.borderGold,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",boxShadow:"0 24px 64px rgba(0,0,0,0.85),0 0 24px rgba(212,175,55,0.08)",pointerEvents:"none",zIndex:30}}>
            <div style={{padding:"11px 14px",borderBottom:"1px solid rgba(212,175,55,0.12)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:700,color:C.gold,letterSpacing:"0.02em"}}>{hov}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:44,height:2.5,background:C.dim,overflow:"hidden"}}>
                    <div style={{width:heat+"%",height:"100%",background:heat>=70?C.gold:heat>=45?"#4a6741":"#2d4a35"}}/>
                  </div>
                  <span style={{fontSize:9,color:C.sub,fontWeight:600}}>{heat}/100</span>
                </div>
              </div>
            </div>
            <div style={{padding:"10px 14px"}}>
              {deals.length===0
                ? <p style={{fontSize:11,color:C.sub,margin:0,fontStyle:"italic"}}>No tracked transactions in this market</p>
                : deals.map((d,i)=>(
                  <div key={i} style={{paddingBottom:i<deals.length-1?10:0,marginBottom:i<deals.length-1?10:0,borderBottom:i<deals.length-1?"1px solid "+C.border:"none"}}>
                    <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                      <Tag color={sigC(d.signal)}>{sigL(d.signal)}</Tag>
                      <span style={{fontSize:9,color:C.sub}}>{d.date}</span>
                    </div>
                    <p style={{margin:"0 0 2px",fontSize:12,color:C.text,fontWeight:500,lineHeight:1.35}}>{d.title}</p>
                    <p style={{margin:0,fontSize:10,color:C.sub}}>{d.size} · {d.brand}</p>
                  </div>
                ))
              }
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div style={{padding:"10px 16px",borderTop:"1px solid "+C.border,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap",background:"rgba(0,0,0,0.5)"}}>
        <span style={{fontSize:9,fontWeight:600,letterSpacing:"0.12em",color:C.sub,textTransform:"uppercase"}}>Activity</span>
        {[["Critical","#7a5c18"],["High","#3d5c2e"],["Active","#2e4a28"],["Moderate","#1e3420"],["Low","#141e16"]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:10,height:10,background:c,border:"1px solid rgba(255,255,255,0.12)"}}/>
            <span style={{fontSize:9,color:C.sub}}>{l}</span>
          </div>
        ))}
        <span style={{fontSize:9,color:C.gold,marginLeft:"auto",fontWeight:600}}>● Tracked deal</span>
      </div>
    </div>
  );
}

// ─── DEAL FEED ────────────────────────────────────────────────────────────────
function DealFeed() {
  const [region,setRegion]=useState("All"); const [exp,setExp]=useState(null);
  const regions=["All","Northeast","Southeast","Midwest","Southwest","Pacific"];
  const filtered=DEALS.filter(d=>region==="All"||d.region.includes(region));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:1,marginBottom:1}}>
        <Stat label="2025 Volume" value="Record" sub="Haig · Kerrigan" gold/>
        <Stat label="Public Capital" value="$4.4B" sub="~80 franchises"/>
        <Stat label="Private Buyers" value="90%+" sub="Of all deals"/>
        <Stat label="Avg Pre-Tax" value="$4.1M" sub="Per store 2024"/>
        <Stat label="Blue Sky Index" value="+76%" sub="vs pre-pandemic"/>
        <Stat label="Top Region" value="Southeast" sub="Population momentum"/>
      </div>
      <div style={{marginTop:1,display:"flex",gap:1,flexWrap:"wrap",alignItems:"center",marginBottom:1}}>
        {regions.map(r=>(
          <button key={r} onClick={()=>setRegion(r)} style={{fontSize:10,padding:"8px 16px",background:region===r?C.gold:C.card,color:region===r?"#000":C.sub,border:"1px solid "+(region===r?C.gold:C.border),cursor:"pointer",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.12s"}}>{r}</button>
        ))}
        <span style={{fontSize:9,color:C.dim,marginLeft:"auto",letterSpacing:"0.1em",textTransform:"uppercase"}}>Newest First</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        {filtered.map((d,i)=>(
          <div key={d.id} onClick={()=>setExp(exp===d.id?null:d.id)} style={{background:C.card,border:"1px solid "+(exp===d.id?C.borderGold:C.border),padding:"16px 18px",cursor:"pointer",position:"relative",overflow:"hidden",transition:"border-color 0.12s"}}>
            {i===0&&region==="All"&&<div style={{position:"absolute",top:0,left:0,bottom:0,width:2,background:C.gold}}/>}
            <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:7,flexWrap:"wrap"}}>
                  <Tag color={sigC(d.signal)}>{sigL(d.signal)}</Tag>
                  <span style={{fontSize:9,color:C.sub,letterSpacing:"0.05em"}}>{d.source}</span>
                  <span style={{fontSize:9,color:C.sub}}>{d.date}</span>
                  {i===0&&region==="All"&&<span style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"0.1em"}}>● LATEST</span>}
                </div>
                <p style={{margin:"0 0 4px",fontWeight:600,fontSize:14,color:C.text,lineHeight:1.3}}>{d.title}</p>
                <p style={{margin:0,fontSize:11,color:C.sub}}>{d.brand} · {d.region}</p>
                {exp===d.id&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid "+C.border}}><p style={{margin:0,fontSize:12,color:C.sub,lineHeight:1.75}}>{d.detail}</p></div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:700,color:C.gold}}>{d.size}</div>
                {d.stores&&<div style={{fontSize:10,color:C.dim,marginTop:2}}>{d.stores} stores</div>}
                <div style={{fontSize:9,color:C.dim,marginTop:6,letterSpacing:"0.06em"}}>{exp===d.id?"COLLAPSE ↑":"DETAILS ↓"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AIChat sys="You are a senior automotive M&A analyst. Real 2025-2026 data: Asbury-Herb Chambers $1.45B Jul 2025, Group 1 FL/TX luxury May 2025, Lithia Medford MB Feb 2026, Hudson All Star Q4 2025, Carvana entering new-car, 2025 record buy-sell volume, Toyota/Lexus 8-13x Blue Sky, Honda 5.5-8x raised Q4 2025, private buyers 90%+, Southeast leads. Historical: 1990s rollup era, 2008 crisis 10.4M SAAR, COVID boom 15x peak, 2023-25 normalization. Be precise, data-driven, broker-focused." placeholder="Ask about deal flow, buyer profiles, franchise valuations, or which markets are heating up..."/>
    </div>
  );
}

// ─── BLUE SKY ─────────────────────────────────────────────────────────────────
function BlueSkyCalc() {
  const [sel,setSel]=useState(null); const [inp,setInp]=useState({brand:"Toyota",pretax:1500000,region:"Southeast"}); const [res,setRes]=useState(null); const [load,setLoad]=useState(false);
  const maxH=Math.max(...Object.values(BLUE_SKY).map(v=>v.high));
  const sorted=[...Object.entries(BLUE_SKY)].sort((a,b)=>b[1].high-a[1].high);
  const calc=async()=>{
    setLoad(true); setRes(null); const bs=BLUE_SKY[inp.brand];
    const low=Math.round(inp.pretax*bs.low),mid=Math.round(inp.pretax*((bs.low+bs.high)/2)),high=Math.round(inp.pretax*bs.high);
    try {
      const c=await callClaude("You are a dealership valuation expert at Haig Partners or Kerrigan Advisors level. Give a precise 2-sentence broker-focused valuation commentary referencing current market conditions and comparable transactions. No bullets.",`Brand: ${inp.brand} (${bs.low}-${bs.high}x, trend: ${bs.trend}). Pre-tax earnings: $${inp.pretax.toLocaleString()}. Region: ${inp.region}. Calculated range: ${fmt(low)}-${fmt(high)}.`);
      setRes({low,mid,high,c,ml:bs.low,mh:bs.high});
    } catch { setRes({low,mid,high,c:"Valuation based on Q4 2025 Haig/Kerrigan data.",ml:bs.low,mh:bs.high}); }
    setLoad(false);
  };
  return (
    <div>
      <p style={{fontSize:11,color:C.sub,marginBottom:16}}>Source: Haig Partners Q4 2025 Haig Report® · Kerrigan Advisors Q4 2025 Blue Sky Report®</p>
      <div style={{display:"flex",flexDirection:"column",gap:1,marginBottom:20}}>
        {sorted.map(([brand,d])=>(
          <div key={brand} onClick={()=>setSel(sel===brand?null:brand)} style={{background:C.card,border:"1px solid "+(sel===brand?C.borderGold:C.border),padding:"9px 14px",cursor:"pointer",transition:"border-color 0.12s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontWeight:600,fontSize:13,color:C.text,minWidth:85}}>{brand}</span>
                <span style={{color:tC(d.trend),fontSize:11,fontWeight:700}}>{d.trend==="up"?"↑":d.trend==="down"?"↓":"→"}</span>
              </div>
              <span style={{fontWeight:700,fontSize:13,color:d.trend==="up"?C.gold:d.trend==="down"?C.red:C.sub}}>{d.low}–{d.high}×</span>
            </div>
            <div style={{position:"relative",height:3,background:C.dim+"60",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:(d.high/maxH*100)+"%",background:d.trend==="down"?C.red+"30":"rgba(212,175,55,0.18)"}}/>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:(d.low/maxH*100)+"%",background:tC(d.trend)}}/>
            </div>
            {sel===brand&&<p style={{margin:"8px 0 0",fontSize:11,color:C.sub,lineHeight:1.65}}>{d.note}</p>}
          </div>
        ))}
      </div>
      <div style={{background:C.card,border:"1px solid "+C.borderGold,padding:20}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:C.gold,textTransform:"uppercase",marginBottom:14}}>Blue Sky Calculator</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10,marginBottom:14}}>
          {[["Franchise","brand","select",Object.keys(BLUE_SKY)],["Region","region","select",["Northeast","Southeast","Midwest","Southwest","Mountain","Pacific"]]].map(([l,k,_,opts])=>(
            <div key={k}><div style={{fontSize:9,fontWeight:600,letterSpacing:"0.12em",color:C.sub,textTransform:"uppercase",marginBottom:5}}>{l}</div>
              <select value={inp[k]} onChange={e=>setInp(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:C.surface,border:"1px solid "+C.border,color:C.text,padding:"8px",fontSize:12,outline:"none"}}>{opts.map(o=><option key={o} style={{background:C.surface}}>{o}</option>)}</select></div>
          ))}
          <div><div style={{fontSize:9,fontWeight:600,letterSpacing:"0.12em",color:C.sub,textTransform:"uppercase",marginBottom:5}}>Pre-Tax Earnings</div>
            <input type="number" value={inp.pretax} onChange={e=>setInp(p=>({...p,pretax:+e.target.value}))} style={{width:"100%",background:C.surface,border:"1px solid "+C.border,color:C.text,padding:"8px",fontSize:12,outline:"none"}}/></div>
        </div>
        <button onClick={calc} style={{background:C.gold,border:"none",color:"#000",padding:"10px 22px",fontSize:9,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",marginBottom:14}}>CALCULATE BLUE SKY</button>
        {load&&<p style={{fontSize:12,color:C.sub,fontStyle:"italic"}}>Running valuation model...</p>}
        {res&&!load&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,marginBottom:12}}>
              {[["Conservative",res.low],["Market Mid",res.mid],["Optimistic",res.high]].map(([l,v],i)=>(
                <div key={l} style={{background:C.surface,border:"1px solid "+(i===1?C.borderGold:C.border),padding:"13px",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.12em",color:C.sub,textTransform:"uppercase",marginBottom:4}}>{l}</div>
                  <div style={{fontSize:19,fontWeight:700,color:i===1?C.gold:C.text}}>{fmt(v)}</div>
                </div>
              ))}
            </div>
            <p style={{margin:"0 0 8px",fontSize:10,color:C.dim,letterSpacing:"0.06em"}}>{res.ml}–{res.mh}× pre-tax · Source: Haig/Kerrigan Q4 2025</p>
            <p style={{margin:0,fontSize:13,color:C.sub,lineHeight:1.75}}>{res.c}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MARKET ANALYSIS ─────────────────────────────────────────────────────────
function MarketAnalysis() {
  const [region,setRegion]=useState("Southeast"); const [report,setReport]=useState(""); const [load,setLoad]=useState(false);
  const generate=async()=>{
    setLoad(true); setReport("");
    try {
      const t=await callClaude("You are a senior automotive M&A market analyst. Real 2025-2026: record buy-sell, $4.4B public capital, Toyota/Lexus 8-13x, Honda 5.5-8x, Asbury-Herb Chambers $1.45B, Lithia Medford, Carvana new-car, 90%+ private buyers, Southeast leads, PE/family office accelerating.",
        `Q2 2026 M&A intelligence report for ${region}. Include: 1) Current deal activity, 2) Active buyer profiles, 3) Blue Sky multiples for region, 4) Pre-market signals, 5) Three specific broker opportunities. Be data-precise and actionable.`);
      setReport(t);
    } catch { setReport("Report unavailable. Ensure ANTHROPIC_API_KEY is configured in Vercel environment variables."); }
    setLoad(false);
  };
  const regs=["Northeast","Southeast","Midwest","Southwest","Mountain","Pacific","Florida","Texas"];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:1,marginBottom:1}}>
        <Stat label="2025 Volume" value="Record" sub="Buy-sell market" gold/>
        <Stat label="Public Capital" value="$4.4B" sub="80 franchises"/>
        <Stat label="Toyota/Lexus" value="8–13×" sub="Blue Sky"/>
        <Stat label="Avg Pre-Tax" value="$4.1M" sub="Per store 2024"/>
        <Stat label="Kerrigan Index" value="+76%" sub="vs pre-pandemic"/>
        <Stat label="Top Buyers" value="Private" sub="90%+ of deals"/>
      </div>
      <div style={{marginTop:1,display:"flex",gap:1,flexWrap:"wrap",marginBottom:1}}>
        {regs.map(r=><button key={r} onClick={()=>setRegion(r)} style={{fontSize:10,padding:"8px 15px",background:region===r?C.gold:C.card,color:region===r?"#000":C.sub,border:"1px solid "+(region===r?C.gold:C.border),cursor:"pointer",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{r}</button>)}
      </div>
      <button onClick={generate} style={{background:C.gold,border:"none",color:"#000",padding:"10px 22px",fontSize:9,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",marginBottom:14}}>GENERATE {region.toUpperCase()} REPORT</button>
      {(load||report)&&<div style={{background:C.card,border:"1px solid "+C.borderGold,padding:20,marginBottom:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:2,height:12,background:C.gold}}/><span style={{fontSize:9,fontWeight:700,letterSpacing:"0.14em",color:C.gold,textTransform:"uppercase"}}>{region} · Q2 2026 Intelligence Report</span></div>
        {load?<p style={{fontSize:12,color:C.sub,fontStyle:"italic"}}>Generating analysis...</p>:<p style={{fontSize:13,lineHeight:1.85,color:C.sub,whiteSpace:"pre-wrap"}}>{report}</p>}
      </div>}
      <AIChat sys={`Senior automotive M&A analyst. Focus: ${region}. 2025-2026: Toyota/Lexus 8-13x, Honda 5.5-8x Q4 2025, 90%+ private, Southeast leads, Asbury $1.45B, Carvana new-car, PE/family office entry accelerating. History: 1990s rollup, 2008 crisis, COVID boom, normalization.`} placeholder={`Ask about ${region} deal flow, active buyers, or specific franchise opportunities...`}/>
    </div>
  );
}

// ─── HISTORY ─────────────────────────────────────────────────────────────────
function MarketHistory() {
  const [sel,setSel]=useState(0); const [analysis,setAnalysis]=useState(""); const [load,setLoad]=useState(false);
  const era=HISTORY[sel];
  const run=async()=>{
    setLoad(true); setAnalysis("");
    try { const t=await callClaude("You are a 30-year automotive M&A veteran. Draw specific parallels between historical eras and 2026. Reference companies, deal sizes, multiples. Broker-focused and actionable.",`Analyze ${era.era} (${era.years}) and connect precisely to 2026. What patterns repeat? What should brokers do right now?`); setAnalysis(t); }
    catch { setAnalysis("Analysis unavailable. Ensure ANTHROPIC_API_KEY is configured in Vercel."); }
    setLoad(false);
  };
  return (
    <div>
      <p style={{fontSize:12,color:C.sub,marginBottom:16,lineHeight:1.65}}>Pattern recognition across 30 years of automotive M&A cycles — from the 1990s public rollup era to today's 2026 banner year.</p>
      <div style={{display:"flex",gap:1,flexWrap:"wrap",marginBottom:1}}>
        {HISTORY.map((h,i)=><button key={i} onClick={()=>{setSel(i);setAnalysis("");}} style={{fontSize:10,padding:"8px 14px",background:sel===i?C.gold:C.card,color:sel===i?"#000":C.sub,border:"1px solid "+(sel===i?C.gold:C.border),cursor:"pointer",fontWeight:700,letterSpacing:"0.08em"}}>{h.years}</button>)}
      </div>
      <div style={{background:C.card,border:"1px solid "+C.borderGold,padding:20,marginBottom:1,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,"+C.gold+",transparent)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
          <div><p style={{margin:"0 0 3px",fontWeight:700,fontSize:16,color:C.text}}>{era.era}</p><p style={{margin:0,fontSize:11,color:C.sub}}>{era.years}</p></div>
          <Tag>{era.mult} Blue Sky</Tag>
        </div>
        <p style={{margin:"0 0 14px",fontSize:13,color:C.sub,lineHeight:1.8}}>{era.summary}</p>
        <div style={{borderTop:"1px solid "+C.border,paddingTop:12}}>
          <span style={{fontSize:9,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase"}}>Broker Lesson · </span>
          <span style={{fontSize:13,color:C.text,fontWeight:500}}>{era.lesson}</span>
        </div>
      </div>
      <button onClick={run} style={{background:C.gold,border:"none",color:"#000",padding:"10px 22px",fontSize:9,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",marginBottom:14}}>AI: HOW DOES THIS APPLY TO 2026?</button>
      {(load||analysis)&&<div style={{background:C.card,border:"1px solid "+C.borderGold,padding:20}}>{load?<p style={{fontSize:12,color:C.sub,fontStyle:"italic"}}>Analyzing patterns...</p>:<p style={{fontSize:13,lineHeight:1.85,color:C.sub,whiteSpace:"pre-wrap"}}>{analysis}</p>}</div>}
    </div>
  );
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function Newsletter() {
  const [form,setForm]=useState({name:"",email:"",states:[],brands:[],tier:"free"}); const [done,setDone]=useState(false);
  const toggle=(arr,v)=>arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];
  const STATES=["AL","AZ","CA","CO","FL","GA","IL","MD","MI","MN","MO","NC","NJ","NV","NY","OH","OR","PA","TN","TX","VA","WA"];
  if(done) return(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{width:44,height:44,background:C.goldDim,border:"1px solid "+C.borderGold,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:18,color:C.gold}}>✓</div>
      <p style={{fontWeight:700,fontSize:18,margin:"0 0 8px",color:C.text}}>Subscription Confirmed</p>
      <p style={{fontSize:12,color:C.sub}}>{form.tier==="pro"?"Pro — Daily alerts + pre-market signals":"Free — Weekly M&A digest"}</p>
    </div>
  );
  const tb=(active)=>({fontSize:10,padding:"7px 13px",background:active?C.gold:C.card,color:active?"#000":C.sub,border:"1px solid "+(active?C.gold:C.border),cursor:"pointer",fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase"});
  return(
    <div style={{maxWidth:560}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:1}}>
        {[["Name","name","Your name"],["Email","email","your@brokerage.com"]].map(([l,k,ph])=>(
          <div key={k} style={{background:C.card,border:"1px solid "+C.border,padding:"12px 14px"}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.14em",color:C.sub,textTransform:"uppercase",marginBottom:6}}>{l}</div>
            <input value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:"transparent",border:"none",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
        ))}
      </div>
      {[["States to Monitor","states",STATES],["Franchise Alerts","brands",Object.keys(BLUE_SKY)]].map(([label,key,opts])=>(
        <div key={key} style={{background:C.card,border:"1px solid "+C.border,padding:"14px",marginBottom:1}}>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.14em",color:C.sub,textTransform:"uppercase",marginBottom:10}}>{label}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:1}}>{opts.map(o=><button key={o} onClick={()=>setForm(p=>({...p,[key]:toggle(p[key],o)}))} style={tb(form[key].includes(o))}>{o}</button>)}</div>
        </div>
      ))}
      <div style={{background:C.card,border:"1px solid "+C.border,padding:"14px",marginBottom:1}}>
        <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.14em",color:C.sub,textTransform:"uppercase",marginBottom:10}}>Subscription Tier</div>
        <div style={{display:"flex",gap:1,flexWrap:"wrap"}}>
          {[["free","Free — Weekly Digest"],["pro","Pro — Daily Alerts + Pre-Market"]].map(([v,l])=>(
            <button key={v} onClick={()=>setForm(p=>({...p,tier:v}))} style={tb(form.tier===v)}>{l}</button>
          ))}
        </div>
      </div>
      <button onClick={()=>setDone(true)} style={{background:C.gold,border:"none",color:"#000",padding:"12px 0",fontSize:10,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",width:"100%"}}>SUBSCRIBE</button>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const NAV=[{id:"feed",label:"Deal Feed"},{id:"heatmap",label:"Deal Map"},{id:"blue-sky",label:"Blue Sky"},{id:"analysis",label:"Market Analysis"},{id:"history",label:"History"},{id:"newsletter",label:"Alerts"}];
const SECTIONS={feed:DealFeed,heatmap:TopoMap,"blue-sky":BlueSkyCalc,analysis:MarketAnalysis,history:MarketHistory,newsletter:Newsletter};
const TITLES={feed:"Deal Feed",heatmap:"Deal Activity Map","blue-sky":"Blue Sky Multiples",analysis:"Market Analysis",history:"Market History",newsletter:"Alerts & Newsletter"};
const SUBS={feed:"Newest first · Verified transactions · Real-time intelligence",heatmap:"Hover any state · Color intensity reflects M&A activity · Gold badge = tracked deal","blue-sky":"Haig Partners Q4 2025 · Kerrigan Advisors Q4 2025",analysis:"AI-powered regional intelligence · Q2 2026",history:"30 years of M&A cycles · Pattern recognition for broker advantage",newsletter:"Free weekly digest or Pro daily pre-market alerts"};

export default function App() {
  const [tab,setTab]=useState("feed"); const [pro,setPro]=useState(false);
  const Section=SECTIONS[tab];
  return(

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg:        "#0a0c0f",
  surface:   "#0f1318",
  card:      "#13181f",
  cardHover: "#171d26",
  border:    "#1e2530",
  borderGold:"#8a6f3e",
  gold:      "#c9a55a",
  goldLight: "#e8c97a",
  goldDim:   "#6b5430",
  text:      "#f0ede8",
  textSub:   "#8a8f9a",
  textDim:   "#4a5060",
  topo: {
    sage:    "#8fa89a",
    forest:  "#3d6b4f",
    teal:    "#2a5c6a",
    sand:    "#c8a97a",
    cream:   "#e8e4d8",
    deep:    "#1a3a2a",
    water:   "#1e4a5a",
  }
};

// ─── DEALS DATA ───────────────────────────────────────────────────────────────
const DEALS = [
  { id:1,  title:"Penske Acquires 2 Lexus Stores",            state:"TX", brand:"Lexus",          date:"Mar 2026", size:"Undisclosed",  signal:"confirmed", source:"Automotive News" },
  { id:2,  title:"Lithia Motors — Mercedes-Benz of Medford",  state:"OR", brand:"Mercedes-Benz",  date:"Feb 2026", size:"~$38M",        signal:"confirmed", source:"Dealer News"     },
  { id:3,  title:"Asbury Automotive Expands in Southeast",    state:"GA", brand:"Multi-Brand",    date:"Feb 2026", size:"~$120M",       signal:"confirmed", source:"SEC Filing"      },
  { id:4,  title:"Private Group Eyes BMW Rooftop in Miami",   state:"FL", brand:"BMW",            date:"Jan 2026", size:"Undisclosed",  signal:"rumor",     source:"Industry Intel"  },
  { id:5,  title:"Larry H. Miller — Toyota of Scottsdale",    state:"AZ", brand:"Toyota",         date:"Jan 2026", size:"~$55M",        signal:"confirmed", source:"Automotive News" },
  { id:6,  title:"Group 1 Acquires 3 Ford Stores in Texas",   state:"TX", brand:"Ford",           date:"Dec 2025", size:"~$80M",        signal:"confirmed", source:"Dealer News"     },
  { id:7,  title:"Family Group Exits — 4 Rooftops in NC",     state:"NC", brand:"Multi-Brand",    date:"Dec 2025", size:"~$95M",        signal:"confirmed", source:"Broker Network"  },
  { id:8,  title:"Hendrick Motorsports Eyes Southeast BMW",   state:"SC", brand:"BMW",            date:"Nov 2025", size:"Undisclosed",  signal:"rumor",     source:"Industry Intel"  },
  { id:9,  title:"AutoNation — Honda of Stuart",              state:"FL", brand:"Honda",          date:"Nov 2025", size:"~$42M",        signal:"confirmed", source:"SEC Filing"      },
  { id:10, title:"Private Equity Group — Kia Midwest Play",  state:"MO", brand:"Kia",            date:"Oct 2025", size:"~$28M",        signal:"confirmed", source:"Dealer News"     },
];

const STATE_ACTIVITY = {
  FL:{ count:4, x:720, y:390, hot:true  },
  TX:{ count:5, x:460, y:370, hot:true  },
  GA:{ count:3, x:680, y:330, hot:true  },
  NC:{ count:2, x:690, y:280, hot:false },
  SC:{ count:2, x:700, y:305, hot:false },
  OR:{ count:2, x:130, y:165, hot:false },
  AZ:{ count:2, x:260, y:330, hot:false },
  MO:{ count:1, x:540, y:265, hot:false },
  CA:{ count:2, x:110, y:260, hot:false },
  MA:{ count:1, x:790, y:175, hot:false },
};

const NAV = [
  { id:"feed",     label:"Deal Feed"     },
  { id:"map",      label:"Market Map"    },
  { id:"groups",   label:"Dealer Groups" },
  { id:"analysis", label:"AI Analysis"   },
  { id:"alerts",   label:"Alerts"        },
];

// ─── TOPOGRAPHIC MAP COMPONENT ────────────────────────────────────────────────
function TopoMap({ onStateClick }) {
  const [hovered, setHovered] = useState(null);

  const usPath = "M 155,80 L 178,75 L 205,70 L 240,68 L 280,65 L 330,62 L 390,60 L 450,58 L 510,57 L 565,56 L 610,55 L 650,55 L 685,56 L 710,58 L 730,60 L 755,63 L 775,67 L 790,72 L 800,78 L 808,85 L 812,92 L 810,100 L 805,108 L 800,115 L 795,122 L 792,130 L 788,140 L 785,152 L 782,165 L 778,178 L 773,190 L 765,200 L 755,208 L 742,215 L 728,220 L 714,225 L 700,230 L 688,238 L 678,248 L 670,260 L 660,272 L 648,284 L 634,295 L 620,305 L 606,315 L 592,324 L 578,332 L 564,338 L 550,343 L 536,347 L 522,350 L 508,353 L 494,356 L 480,360 L 466,365 L 453,371 L 441,378 L 430,386 L 420,394 L 410,400 L 398,405 L 385,408 L 372,410 L 358,411 L 344,412 L 330,412 L 316,411 L 302,408 L 288,404 L 274,399 L 260,393 L 246,386 L 232,379 L 218,372 L 204,366 L 190,361 L 176,357 L 162,354 L 148,352 L 136,350 L 125,348 L 115,345 L 107,340 L 100,333 L 95,324 L 92,313 L 91,300 L 92,286 L 95,272 L 100,258 L 107,244 L 116,231 L 127,219 L 140,208 L 150,198 L 157,188 L 161,177 L 162,166 L 160,155 L 157,144 L 154,133 L 152,122 L 151,111 L 152,100 L 154,89 Z";

  return (
    <div style={{position:"relative",width:"100%",aspectRatio:"16/9",borderRadius:2,overflow:"hidden",background:"#0d1a14"}}>
      <svg viewBox="80 50 760 390" style={{width:"100%",height:"100%",display:"block"}}>
        <defs>
          <radialGradient id="topoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a5c3a" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0d1a14" stopOpacity="0"/>
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a3528"/>
            <stop offset="35%" stopColor="#2a5c3a"/>
            <stop offset="65%" stopColor="#3d6b4f"/>
            <stop offset="100%" stopColor="#244a35"/>
          </linearGradient>
        </defs>

        {/* Ocean background */}
        <rect x="80" y="50" width="760" height="390" fill="#0d1a22"/>

        {/* Topo contour rings */}
        {[0,1,2,3,4].map(i => (
          <ellipse key={i} cx="430" cy="230" rx={380-i*55} ry={195-i*28}
            fill="none" stroke="#1e3028" strokeWidth={0.6} opacity={0.5-i*0.08}/>
        ))}

        {/* Land mass */}
        <path d={usPath} fill="url(#landGrad)" stroke="#2a4a38" strokeWidth="1.5"/>

        {/* Inner terrain shading */}
        <path d={usPath} fill="url(#topoGlow)" opacity="0.6"/>

        {/* State activity markers */}
        {Object.entries(STATE_ACTIVITY).map(([state, data]) => {
          const isHot = data.hot;
          const isHov = hovered === state;
          const r = isHot ? 14 : 10;
          return (
            <g key={state} style={{cursor:"pointer"}}
              onMouseEnter={() => setHovered(state)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onStateClick(state)}>
              {isHot && (
                <circle cx={data.x} cy={data.y} r={r+8} fill={C.gold} opacity="0.12" filter="url(#goldGlow)"/>
              )}
              <circle cx={data.x} cy={data.y} r={isHov ? r+3 : r}
                fill={isHot ? C.gold : "#2a5c3a"}
                stroke={isHot ? C.goldLight : "#4a8a5a"}
                strokeWidth="1.5"
                opacity={isHov ? 1 : 0.9}
                style={{transition:"all 0.2s"}}
                filter={isHot ? "url(#softGlow)" : undefined}
              />
              <text x={data.x} y={data.y+1} textAnchor="middle" dominantBaseline="middle"
                fontSize="7" fontWeight="700" fill={isHot ? "#000" : C.cream}
                style={{pointerEvents:"none",letterSpacing:"0.05em"}}>
                {state}
              </text>
              <text x={data.x} y={data.y + r + 8} textAnchor="middle"
                fontSize="6.5" fill={isHot ? C.goldLight : C.sage}
                style={{pointerEvents:"none"}}>
                {data.count}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(88,390)">
          <rect x="0" y="0" width="160" height="38" rx="2" fill="#0f1318" opacity="0.85"/>
          <circle cx="14" cy="12" r="6" fill={C.gold}/>
          <text x="24" y="16" fontSize="7" fill={C.textSub}>High Activity (3+ deals)</text>
          <circle cx="14" cy="28" r="6" fill="#2a5c3a" stroke="#4a8a5a" strokeWidth="1"/>
          <text x="24" y="32" fontSize="7" fill={C.textSub}>Active Market</text>
        </g>
      </svg>

      {/* Hover tooltip */}
      {hovered && STATE_ACTIVITY[hovered] && (
        <div style={{
          position:"absolute", bottom:16, right:16,
          background:C.card, border:"1px solid "+C.borderGold,
          padding:"12px 16px", minWidth:200,
          boxShadow:"0 8px 32px rgba(0,0,0,0.6)"
        }}>
          <div style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:"0.12em",marginBottom:6}}>
            {hovered} MARKET
          </div>
          {DEALS.filter(d=>d.state===hovered).map(d=>(
            <div key={d.id} style={{fontSize:10,color:C.textSub,marginBottom:3,lineHeight:1.4}}>
              · {d.title}
            </div>
          ))}
          <div style={{fontSize:9,color:C.goldDim,marginTop:6,letterSpacing:"0.08em"}}>
            CLICK TO FILTER FEED
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEAL CARD ────────────────────────────────────────────────────────────────
function DealCard({ deal, index }) {
  return (
    <div style={{
      background: index === 0 ? "#141c14" : C.card,
      border: "1px solid " + (index === 0 ? C.borderGold : C.border),
      borderLeft: "3px solid " + (index === 0 ? C.gold : deal.signal === "rumor" ? "#3a5a8a" : "#2a4a3a"),
      padding:"18px 20px", marginBottom:8,
      transition:"all 0.18s", cursor:"pointer",
      display:"flex", alignItems:"flex-start", gap:16
    }}
    onMouseEnter={e=>{e.currentTarget.style.background=C.cardHover;e.currentTarget.style.borderColor=C.borderGold}}
    onMouseLeave={e=>{e.currentTarget.style.background=index===0?"#141c14":C.card;e.currentTarget.style.borderColor=index===0?C.borderGold:C.border}}
    >
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          {index===0 && <span style={{fontSize:8,fontWeight:800,color:"#000",background:C.gold,padding:"2px 7px",letterSpacing:"0.12em"}}>LATEST</span>}
          <span style={{fontSize:8,fontWeight:700,color:deal.signal==="rumor"?"#6a9acf":"#4a8a5a",letterSpacing:"0.1em",textTransform:"uppercase"}}>
            {deal.signal}
          </span>
          <span style={{fontSize:8,color:C.textDim,letterSpacing:"0.06em"}}>{deal.source}</span>
        </div>
        <div style={{fontSize:13,fontWeight:600,color:C.text,letterSpacing:"-0.01em",marginBottom:4}}>{deal.title}</div>
        <div style={{display:"flex",gap:12}}>
          <span style={{fontSize:10,color:C.textSub}}>{deal.brand}</span>
          <span style={{fontSize:10,color:C.textDim}}>·</span>
          <span style={{fontSize:10,color:C.textSub}}>{deal.state}</span>
          <span style={{fontSize:10,color:C.textDim}}>·</span>
          <span style={{fontSize:10,color:C.textSub}}>{deal.date}</span>
        </div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontSize:13,fontWeight:700,color:C.gold}}>{deal.size}</div>
        <div style={{fontSize:9,color:C.textDim,marginTop:2}}>EST. VALUE</div>
      </div>
    </div>
  );
}

// ─── ASK AI ───────────────────────────────────────────────────────────────────
function AskAI() {
  const [query, setQuery]   = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const ask = async () => {
    if (!query.trim()) return;
    setLoading(true); setAnswer(""); setError("");
    try {
      const res = await fetch("/api/claude", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          system: "You are BlueSkyIntel's AI analyst specializing in automotive M&A. You have deep knowledge of dealership valuations (Blue Sky multiples), dealer group strategies, OEM franchise rules, and market trends. Be concise, authoritative, and data-driven. Format answers cleanly.",
          messages:[{ role:"user", content: query }],
          max_tokens: 800
        })
      });
      const data = await res.json();
      if (data.content?.[0]?.text) {
        setAnswer(data.content[0].text);
      } else if (data.error) {
        setError("API Error: " + (data.error.message || JSON.stringify(data.error)));
      } else {
        setError("Unexpected response format.");
      }
    } catch(e) {
      setError("Network error: " + e.message);
    }
    setLoading(false);
  };

  const suggestions = [
    "What's the average Blue Sky multiple for a Toyota store in 2026?",
    "Which markets are showing the most consolidation pressure?",
    "What are the key due diligence items in a dealership acquisition?",
    "How does rising floor plan interest affect dealership valuations?",
  ];

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {suggestions.map(s=>(
            <button key={s} onClick={()=>setQuery(s)} style={{
              fontSize:10,color:C.textSub,background:C.surface,border:"1px solid "+C.border,
              padding:"6px 12px",cursor:"pointer",letterSpacing:"0.04em",
              transition:"all 0.15s"
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderGold;e.currentTarget.style.color=C.gold}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSub}}
            >{s}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&ask()}
            placeholder="Ask anything about automotive M&A, Blue Sky values, market trends…"
            style={{
              flex:1, background:C.surface, border:"1px solid "+C.border,
              color:C.text, padding:"12px 16px", fontSize:12,
              outline:"none", letterSpacing:"0.02em",
              fontFamily:"inherit"
            }}
            onFocus={e=>e.target.style.borderColor=C.borderGold}
            onBlur={e=>e.target.style.borderColor=C.border}
          />
          <button onClick={ask} disabled={loading} style={{
            background: loading ? C.goldDim : C.gold,
            border:"none", color:"#000", padding:"12px 24px",
            fontSize:10, fontWeight:800, letterSpacing:"0.12em",
            cursor: loading ? "not-allowed" : "pointer",
            textTransform:"uppercase", transition:"all 0.2s"
          }}>
            {loading ? "ANALYZING…" : "ASK AI"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{background:"#1a0e0e",border:"1px solid #5a2a2a",padding:"14px 16px",fontSize:11,color:"#cf7a7a",marginBottom:16}}>
          {error}
        </div>
      )}

      {answer && (
        <div style={{background:C.surface,border:"1px solid "+C.borderGold,padding:"20px 24px"}}>
          <div style={{fontSize:9,fontWeight:700,color:C.gold,letterSpacing:"0.14em",marginBottom:12}}>AI ANALYST RESPONSE</div>
          <div style={{fontSize:12,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{answer}</div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]       = useState("feed");
  const [pro, setPro]       = useState(false);
  const [filter, setFilter] = useState(null);

  const filteredDeals = filter ? DEALS.filter(d => d.state === filter) : DEALS;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif"}}>

      {/* Top Bar */}
      <div style={{borderBottom:"1px solid "+C.border,background:C.surface,position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:7,height:7,background:C.gold,borderRadius:"50%",boxShadow:"0 0 8px "+C.gold}}/>
              <span style={{fontSize:15,fontWeight:700,color:C.text,letterSpacing:"-0.02em"}}>BlueSky<span style={{color:C.gold}}>Intel</span></span>
              <span style={{fontSize:8,color:C.textDim,letterSpacing:"0.14em",textTransform:"uppercase",marginLeft:2}}>M&A Intelligence</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:8,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid "+C.border,padding:"4px 10px"}}>FREE TIER</span>
              <button onClick={()=>setPro(true)} style={{background:C.gold,border:"none",color:"#000",padding:"7px 18px",fontSize:9,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase"}}>UPGRADE PRO</button>
            </div>
          </div>
          <div style={{display:"flex",gap:0}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} style={{
                fontSize:10,padding:"10px 18px",border:"none",
                borderBottom:"2px solid "+(tab===n.id?C.gold:"transparent"),
                background:"transparent",color:tab===n.id?C.gold:C.textSub,
                fontWeight:tab===n.id?700:400,cursor:"pointer",
                letterSpacing:"0.1em",textTransform:"uppercase",
                transition:"all 0.15s",fontFamily:"inherit"
              }}>{n.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 24px 80px"}}>

        {tab === "feed" && (
          <div>
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
                <div>
                  <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.03em"}}>Live Deal Feed</h1>
                  <p style={{margin:0,fontSize:11,color:C.textSub,letterSpacing:"0.04em"}}>Real-time automotive M&A intelligence · {DEALS.length} active deals tracked</p>
                </div>
                {filter && (
                  <button onClick={()=>setFilter(null)} style={{fontSize:9,color:C.gold,background:"transparent",border:"1px solid "+C.borderGold,padding:"5px 12px",cursor:"pointer",letterSpacing:"0.1em"}}>
                    CLEAR FILTER: {filter} ×
                  </button>
                )}
              </div>
              <div style={{height:1,background:"linear-gradient(90deg,"+C.borderGold+",transparent)",marginTop:16}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:24}}>
              <div>{filteredDeals.map((d,i)=><DealCard key={d.id} deal={d} index={i}/>)}</div>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:C.textDim,letterSpacing:"0.14em",marginBottom:12,textTransform:"uppercase"}}>Market Pulse</div>
                {[{label:"Deals This Month",value:"8"},{label:"Avg. Deal Size",value:"$62M"},{label:"Hot Markets",value:"FL · TX · GA"},{label:"Top Brand",value:"Multi-Brand"}].map(s=>(
                  <div key={s.label} style={{background:C.card,border:"1px solid "+C.border,padding:"14px 16px",marginBottom:6}}>
                    <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{s.label}</div>
                    <div style={{fontSize:16,fontWeight:700,color:C.gold}}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "map" && (
          <div>
            <div style={{marginBottom:24}}>
              <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.03em"}}>Market Intelligence Map</h1>
              <p style={{margin:0,fontSize:11,color:C.textSub}}>Click a state to filter the deal feed · Gold = high activity</p>
              <div style={{height:1,background:"linear-gradient(90deg,"+C.borderGold+",transparent)",marginTop:16}}/>
            </div>
            <TopoMap onStateClick={(s)=>{setFilter(s);setTab("feed");}}/>
          </div>
        )}

        {tab === "groups" && (
          <div>
            <div style={{marginBottom:24}}>
              <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.03em"}}>Dealer Group Intelligence</h1>
              <p style={{margin:0,fontSize:11,color:C.textSub}}>Track acquisition velocity and group strategy</p>
              <div style={{height:1,background:"linear-gradient(90deg,"+C.borderGold+",transparent)",marginTop:16}}/>
            </div>
            {[
              {name:"Penske Automotive",stores:315,deals:3,trend:"↑",focus:"Luxury Import"},
              {name:"Lithia Motors",stores:290,deals:5,trend:"↑",focus:"Geographic Expansion"},
              {name:"Asbury Automotive",stores:205,deals:2,trend:"→",focus:"Southeast"},
              {name:"Group 1 Automotive",stores:265,deals:4,trend:"↑",focus:"Texas & UK"},
              {name:"AutoNation",stores:250,deals:2,trend:"→",focus:"Sun Belt"},
            ].map(g=>(
              <div key={g.name} style={{background:C.card,border:"1px solid "+C.border,padding:"18px 20px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderGold}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>{g.name}</div>
                  <div style={{fontSize:10,color:C.textSub}}>{g.stores} rooftops · Focus: {g.focus}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:700,color:g.trend==="↑"?C.gold:C.textSub}}>{g.trend}</div>
                  <div style={{fontSize:9,color:C.textDim}}>{g.deals} deals tracked</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "analysis" && (
          <div>
            <div style={{marginBottom:24}}>
              <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.03em"}}>AI Deal Analyst</h1>
              <p style={{margin:0,fontSize:11,color:C.textSub}}>Powered by Claude · Blue Sky valuations, market trends, deal intelligence</p>
              <div style={{height:1,background:"linear-gradient(90deg,"+C.borderGold+",transparent)",marginTop:16}}/>
            </div>
            <AskAI/>
          </div>
        )}

        {tab === "alerts" && (
          <div>
            <div style={{marginBottom:24}}>
              <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.03em"}}>Deal Alerts</h1>
              <p style={{margin:0,fontSize:11,color:C.textSub}}>Configure notifications by state, brand, or deal size</p>
              <div style={{height:1,background:"linear-gradient(90deg,"+C.borderGold+",transparent)",marginTop:16}}/>
            </div>
            <div style={{background:C.card,border:"1px solid "+C.borderGold,padding:"28px",textAlign:"center"}}>
              <div style={{fontSize:11,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Pro Feature</div>
              <div style={{fontSize:13,color:C.textSub,marginBottom:20}}>Real-time alerts require a BlueSkyIntel Pro subscription.</div>
              <button onClick={()=>setPro(true)} style={{background:C.gold,border:"none",color:"#000",padding:"12px 28px",fontSize:10,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase"}}>
                UNLOCK ALERTS — $299/MO
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pro Modal */}
      {pro && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(12px)"}} onClick={()=>setPro(false)}>
          <div style={{background:C.card,border:"1px solid "+C.borderGold,padding:"32px",maxWidth:440,width:"90%",position:"relative"}} onClick={e=>e.stopPropagation()}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+C.gold+",transparent)"}}/>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:20,color:C.text,letterSpacing:"-0.02em"}}>BlueSky<span style={{color:C.gold}}>Intel</span> Pro</p>
            <p style={{margin:"0 0 22px",fontSize:11,color:C.textSub}}>The intelligence platform serious M&A brokers keep open all day.</p>
            {["Daily deal alerts by state, region & brand","Pre-market & dark deal signals","Full Blue Sky calculator with AI commentary","Dealer group intelligence briefs","Regional AI market reports","CRM deal pipeline tracker","Priority AI analyst access"].map(f=>(
              <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <span style={{color:C.gold,fontSize:11,fontWeight:700}}>✓</span>
                <span style={{fontSize:11,color:C.textSub}}>{f}</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid "+C.border,marginTop:22,paddingTop:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:26,fontWeight:700,color:C.gold}}>$299<span style={{fontSize:13,fontWeight:400,color:C.textSub}}>/mo</span></div>
                <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:3}}>Cancel anytime</div>
              </div>
              <button style={{background:C.gold,border:"none",color:"#000",padding:"12px 26px",fontSize:10,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase"}} onClick={()=>setPro(false)}>GET PRO ACCESS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
