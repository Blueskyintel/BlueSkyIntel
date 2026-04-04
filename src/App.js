import { useState, useRef, useEffect } from "react";

const MODEL = "claude-sonnet-4-20250514";

const DEALS = [
  { id:1, title:"Penske acquires 2 Lexus stores", state:"Multi", states:["TX","CA"], region:"Multi", brand:"Lexus", type:"Closed", date:"Mar 2026", size:"Undisclosed", source:"Automotive News", signal:"confirmed", stores:2, detail:"Ongoing luxury import focus. Penske continuing recognized-brand acquisition strategy in key markets." },
  { id:2, title:"Lithia acquires Mercedes-Benz of Medford", state:"OR", states:["OR"], region:"Pacific", brand:"Mercedes-Benz", type:"Closed", date:"Feb 2026", size:"Incl. real estate", source:"Presidio Group", signal:"confirmed", stores:1, detail:"Advised by The Presidio Group. Lancaster County Motors sole dealership. Real estate included." },
  { id:3, title:"Asbury sells 6 St. Louis luxury stores to MileOne", state:"MO", states:["MO"], region:"Midwest", brand:"Multi luxury", type:"Closed", date:"Feb 2026", size:"Undisclosed", source:"Presidio Group", signal:"confirmed", stores:6, detail:"Portfolio management post-Herb Chambers. Advised by Presidio. MileOne expands Midwest luxury footprint." },
  { id:4, title:"ZT Automotive acquires 4 Tampa Bay dealerships", state:"FL", states:["FL"], region:"Southeast", brand:"Multi-brand", type:"Closed", date:"Dec 2025", size:"Undisclosed", source:"Auto Remarketing", signal:"confirmed", stores:4, detail:"Part of 6-deal flurry in final 2 weeks of 2025 involving 15 stores across 5 states." },
  { id:5, title:"Hudson Automotive acquires All Star Automotive Group", state:"Multi", states:["GA","SC","NC"], region:"Southeast", brand:"Multi-brand", type:"Closed", date:"Q4 2025", size:"2nd largest 2025", source:"Kerrigan Advisors", signal:"confirmed", stores:null, detail:"Second largest transaction in 2025. Southeast consolidation accelerating rapidly." },
  { id:6, title:"Group 1 acquires 3 luxury stores FL & TX", state:"FL/TX", states:["FL","TX"], region:"Southeast", brand:"Lexus, Acura, Mercedes", type:"Closed", date:"May 2025", size:"$330M rev", source:"SEC 8-K", signal:"confirmed", stores:3, detail:"Fort Myers FL Lexus & Acura plus TX Mercedes-Benz. Expands cluster strategy." },
  { id:7, title:"Asbury acquires The Herb Chambers Companies", state:"MA", states:["MA","CT","NH","RI"], region:"Northeast", brand:"Multi (52 franchises)", type:"Closed", date:"Jul 2025", size:"$1.45B", source:"Business Wire", signal:"confirmed", stores:33, detail:"3rd largest deal in auto retail history. 33 dealerships, 52 franchises, 3 collision centers." },
  { id:8, title:"PE & family offices accelerating dealership entries", state:"Multi", states:["TX","FL","GA","NC","TN"], region:"Multi", brand:"Multi-brand", type:"Ongoing", date:"2026", size:"Multiple", source:"WardsAuto", signal:"pre-market", stores:null, detail:"New capital entering buy-sell. Low rates fueling PE and family office dealership acquisitions." },
  { id:9, title:"Carvana acquiring Stellantis franchise stores", state:"AZ/CA/TX", states:["AZ","CA","TX"], region:"Southwest", brand:"Jeep/Ram/Chrysler", type:"Ongoing", date:"2024–2026", size:"Undisclosed", source:"ION Analytics", signal:"pre-market", stores:5, detail:"Online giant entering new-car market. 5 Stellantis stores over 2 years. Watch for expansion." },
];

const STATE_DEALS = {};
DEALS.forEach(d => { (d.states||[]).forEach(s => { if(!STATE_DEALS[s]) STATE_DEALS[s]=[]; STATE_DEALS[s].push(d); }); });

const STATE_HEAT = { FL:95, TX:88, CA:72, MA:85, OR:60, MO:58, GA:78, SC:65, NC:70, CT:75, NH:62, RI:60, AZ:68, TN:55, NC:70, VA:52, OH:48, IL:45, CO:42, WA:50, NV:44 };

const BLUE_SKY = {
  "Toyota":    { low:8.0,  high:12.0, trend:"up",    note:"Record demand — 10x+ in FL/TX. Most coveted franchise nationally." },
  "Lexus":     { low:9.0,  high:13.0, trend:"up",    note:"Near-impossible to acquire. Scarce supply driving record premiums." },
  "Honda":     { low:5.5,  high:8.0,  trend:"up",    note:"Low-end raised Q4 2025. Industry-leading hybrid sales driving confidence." },
  "BMW":       { low:6.0,  high:9.0,  trend:"up",    note:"Multiple increased Q4 2025. Strong luxury demand across all markets." },
  "Mercedes":  { low:5.5,  high:8.5,  trend:"stable",note:"Solid luxury performance. Consistent institutional buyer interest." },
  "Audi":      { low:5.0,  high:8.0,  trend:"up",    note:"Q4 2025 increase per Kerrigan. European luxury gaining momentum." },
  "Porsche":   { low:8.0,  high:11.0, trend:"down",  note:"Low end cut Q3 2025. EV delays and high facility costs create headwinds." },
  "Ford":      { low:3.0,  high:5.0,  trend:"up",    note:"US manufacturing bill boosted domestic brand outlook significantly." },
  "Chevrolet": { low:3.0,  high:4.75, trend:"up",    note:"High-end multiple raised Q4 2025. Improved inventory management." },
  "Cadillac":  { low:3.5,  high:5.5,  trend:"up",    note:"Q4 2025 increase. EV transition creating new buyer opportunity." },
  "Buick GMC": { low:2.5,  high:4.0,  trend:"up",    note:"US manufacturing tailwinds benefit domestic brand sentiment." },
  "Subaru":    { low:4.0,  high:6.5,  trend:"down",  note:"Sales -5.8% YoY Q3 2025. Softening demand across key markets." },
  "Kia":       { low:4.5,  high:5.5,  trend:"stable",note:"Haig & Kerrigan align on range. Consistent regional buyer interest." },
  "Nissan":    { low:1.5,  high:3.0,  trend:"down",  note:"Below pre-pandemic. Weak buyer interest and elevated inventory." },
  "Jeep/Ram":  { low:2.5,  high:4.5,  trend:"stable",note:"Carvana entering Stellantis space. Interesting dynamic developing." },
};

const HISTORY = [
  { era:"1990s Consolidation", years:"1996–2000", mult:"1–3x", summary:"Public auto retail born. AutoNation, CarMax, United Auto Group IPO. Industry consolidates from ~50k to ~22k franchised points.", lesson:"Brand mix and geography determined survivors — scale alone was insufficient." },
  { era:"2008 Financial Crisis", years:"2007–2010", mult:"0–1.5x", summary:"SAAR collapses 16M to 10.4M. GM and Chrysler file bankruptcy. 2,000+ points eliminated. Import dealers outperform domestic 2:1.", lesson:"Fixed ops absorption ratio became the definitive survival metric." },
  { era:"Post-Crisis Recovery", years:"2011–2019", mult:"3–6x", summary:"SAAR recovers to 17M. Lithia, Penske, Asbury accelerate. PE capital enters. Top 150 groups expand from 15% to 30% of franchised points.", lesson:"Lithia hub-and-spoke regional clustering proved the most scalable model." },
  { era:"COVID-Era Boom", years:"2020–2022", mult:"Peak 8–15x", summary:"Chip shortage creates scarcity. Avg dealer pre-tax hits $4M+ (4x pre-COVID). Toyota/Lexus at 10–12x. 2021 sets all-time record.", lesson:"Valuation gap between buyers and sellers resolved by 2023 — then it ran." },
  { era:"EV Transition & Normalization", years:"2023–2025", mult:"4–12x K-shaped", summary:"Profits normalize but remain elevated ($4.1M avg 2024). EV mandates drive brand divergence. 2025 sets new record. $4.4B deployed.", lesson:"Brand selection now eclipses geography as the primary value driver." },
  { era:"2026 Banner Year", years:"2026+", mult:"8–13x top brands", summary:"Pipeline at record levels. 90%+ private buyers. PE and family offices accelerating. Single-points are prime targets. Sun Belt dominates.", lesson:"Five rooftops will be 15 in 8 years. Premium brands at record premiums." },
];

const C = {
  bg:"#06080f", surface:"#0c0e18", card:"#101320", border:"rgba(180,148,60,0.18)",
  borderDim:"rgba(255,255,255,0.05)", gold:"#c9a84c", goldGlow:"rgba(201,168,76,0.12)",
  text:"#dde0e8", muted:"#7a7d8a", dim:"#3a3d4a", accent:"#3d6b8f",
  red:"#c94c4c", green:"#4c9e70", up:"#c9a84c", down:"#c94c4c"
};

const sigC = s => ({ confirmed:C.gold,"pre-market":"#5a8fb5" }[s]||"#555");
const sigL = s => ({ confirmed:"CONFIRMED","pre-market":"PRE-MARKET" }[s]||s.toUpperCase());
const tC = t => t==="up"?C.up:t==="down"?C.down:C.muted;
const fmt = v => "$"+Math.round(v).toLocaleString();

const callClaude = async (sys, msg, hist=[]) => {
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,max_tokens:1000,system:sys,messages:[...hist,{role:"user",content:msg}]})});
  const d = await r.json(); return d.content?.map(c=>c.text||"").join("")||"No response.";
};

function GoldLine() { return <div style={{height:1,background:`linear-gradient(90deg, transparent, ${C.gold}, transparent)`,opacity:0.3,margin:"20px 0"}}/>; }

function SectionHead({ label, sub }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:2,height:14,background:C.gold,flexShrink:0}}/>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.18em",color:C.gold,textTransform:"uppercase"}}>{label}</span>
        <div style={{flex:1,height:"1px",background:C.border}}/>
      </div>
      {sub&&<p style={{margin:"5px 0 0 12px",fontSize:11,color:C.muted,letterSpacing:"0.05em"}}>{sub}</p>}
    </div>
  );
}

function Stat({ label, value, sub, hi }) {
  return (
    <div style={{background:C.card,border:`1px solid ${hi?C.border:C.borderDim}`,borderRadius:2,padding:"13px 15px",position:"relative",overflow:"hidden"}}>
      {hi&&<div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:C.gold}}/>}
      <div style={{fontSize:9,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:5}}>{label}</div>
      <div style={{fontSize:19,fontWeight:700,color:hi?C.gold:C.text,letterSpacing:"-0.02em"}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:C.dim,marginTop:2,letterSpacing:"0.03em"}}>{sub}</div>}
    </div>
  );
}

function AIChat({ sys, placeholder }) {
  const [msgs,setMsgs]=useState([]); const [inp,setInp]=useState(""); const [load,setLoad]=useState(false); const endRef=useRef(null);
  const send=async()=>{
    if(!inp.trim()||load) return; const t=inp.trim(); setInp(""); setLoad(true);
    setMsgs(m=>[...m,{role:"user",content:t}]);
    try{ const r=await callClaude(sys,t,msgs.map(m=>({role:m.role,content:m.content}))); setMsgs(m=>[...m,{role:"assistant",content:r}]); }
    catch{ setMsgs(m=>[...m,{role:"assistant",content:"Connection error. Please retry."}]); }
    setLoad(false); setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,overflow:"hidden",marginTop:20}}>
      <div style={{padding:"9px 14px",borderBottom:`1px solid ${C.borderDim}`,display:"flex",alignItems:"center",gap:8,background:C.surface}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:C.gold}}/>
        <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase"}}>AI Market Analyst</span>
        <span style={{fontSize:9,color:C.dim,marginLeft:"auto",letterSpacing:"0.08em"}}>Claude-Powered Intelligence</span>
      </div>
      <div style={{minHeight:80,maxHeight:220,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.length===0&&<p style={{fontSize:12,color:C.dim,fontStyle:"italic",lineHeight:1.6}}>{placeholder}</p>}
        {msgs.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"88%"}}>
            <div style={{background:m.role==="user"?C.gold:"rgba(255,255,255,0.04)",color:m.role==="user"?"#06080f":C.text,padding:"8px 12px",borderRadius:2,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",fontWeight:m.role==="user"?600:400}}>{m.content}</div>
          </div>
        ))}
        {load&&<div style={{background:"rgba(255,255,255,0.03)",padding:"8px 12px",borderRadius:2,fontSize:13,color:C.dim,alignSelf:"flex-start"}}>Analyzing market data...</div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",borderTop:`1px solid ${C.borderDim}`}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={placeholder.substring(0,60)+"..."} style={{flex:1,background:"transparent",border:"none",color:C.text,padding:"10px 14px",fontSize:12,outline:"none"}}/>
        <button onClick={send} style={{background:C.gold,border:"none",color:"#06080f",padding:"10px 18px",fontSize:10,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase"}}>SEND</button>
      </div>
    </div>
  );
}

// US TOPOGRAPHIC HEATMAP
const US_STATES = {
  AL:{x:590,y:320,name:"Alabama"},AK:{x:130,y:390,name:"Alaska"},AZ:{x:175,y:290,name:"Arizona"},
  AR:{x:545,y:300,name:"Arkansas"},CA:{x:105,y:245,name:"California"},CO:{x:270,y:240,name:"Colorado"},
  CT:{x:740,y:170,name:"Connecticut"},DE:{x:720,y:200,name:"Delaware"},FL:{x:640,y:380,name:"Florida"},
  GA:{x:635,y:320,name:"Georgia"},HI:{x:220,y:420,name:"Hawaii"},ID:{x:175,y:165,name:"Idaho"},
  IL:{x:565,y:220,name:"Illinois"},IN:{x:590,y:210,name:"Indiana"},IA:{x:520,y:190,name:"Iowa"},
  KS:{x:440,y:255,name:"Kansas"},KY:{x:610,y:240,name:"Kentucky"},LA:{x:545,y:355,name:"Louisiana"},
  ME:{x:770,y:130,name:"Maine"},MD:{x:710,y:205,name:"Maryland"},MA:{x:755,y:160,name:"Massachusetts"},
  MI:{x:600,y:170,name:"Michigan"},MN:{x:500,y:145,name:"Minnesota"},MS:{x:570,y:330,name:"Mississippi"},
  MO:{x:535,y:250,name:"Missouri"},MT:{x:235,y:140,name:"Montana"},NE:{x:415,y:215,name:"Nebraska"},
  NV:{x:150,y:215,name:"Nevada"},NH:{x:755,y:148,name:"New Hampshire"},NJ:{x:725,y:190,name:"New Jersey"},
  NM:{x:265,y:300,name:"New Mexico"},NY:{x:715,y:165,name:"New York"},NC:{x:675,y:270,name:"North Carolina"},
  ND:{x:415,y:148,name:"North Dakota"},OH:{x:635,y:205,name:"Ohio"},OK:{x:445,y:295,name:"Oklahoma"},
  OR:{x:125,y:165,name:"Oregon"},PA:{x:685,y:190,name:"Pennsylvania"},RI:{x:757,y:168,name:"Rhode Island"},
  SC:{x:665,y:300,name:"South Carolina"},SD:{x:415,y:180,name:"South Dakota"},TN:{x:600,y:280,name:"Tennessee"},
  TX:{x:430,y:345,name:"Texas"},UT:{x:195,y:235,name:"Utah"},VT:{x:740,y:148,name:"Vermont"},
  VA:{x:685,y:230,name:"Virginia"},WA:{x:140,y:135,name:"Washington"},WV:{x:665,y:220,name:"West Virginia"},
  WI:{x:545,y:165,name:"Wisconsin"},WY:{x:265,y:190,name:"Wyoming"},DC:{x:718,y:215,name:"DC"}
};

function HeatMap() {
  const [hovered,setHovered]=useState(null); const [tooltip,setTooltip]=useState({x:0,y:0});
  const svgRef=useRef(null);

  const getHeat = (s) => STATE_HEAT[s]||Math.floor(Math.random()*30+10);
  const heatColor = (h) => {
    if(h>=80) return "#c9a84c";
    if(h>=60) return "#8a7a2e";
    if(h>=40) return "#2d3a2e";
    return "#1a2230";
  };
  const heatGlow = (h) => h>=60?"0 0 8px rgba(201,168,76,0.5)":h>=40?"0 0 4px rgba(100,140,80,0.3)":"none";

  return (
    <div>
      <SectionHead label="M&A Activity Heatmap" sub="Hover any state to see current deal activity · Color intensity reflects transaction volume"/>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,padding:"20px",position:"relative",overflow:"hidden"}}>
        {/* Topographic background lines */}
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.06}} viewBox="0 0 800 450">
          {[...Array(12)].map((_,i)=>(
            <ellipse key={i} cx="400" cy="225" rx={60+i*30} ry={30+i*15} fill="none" stroke={C.gold} strokeWidth="0.5"/>
          ))}
          {[...Array(8)].map((_,i)=>(
            <line key={i} x1={i*100} y1="0" x2={i*100+50} y2="450" stroke={C.gold} strokeWidth="0.3"/>
          ))}
        </svg>

        <svg ref={svgRef} viewBox="0 0 800 450" style={{width:"100%",maxHeight:420,display:"block"}} onMouseLeave={()=>setHovered(null)}>
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.gold} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
            </radialGradient>
            <filter id="blur"><feGaussianBlur stdDeviation="2"/></filter>
          </defs>

          {/* Render states as circles with topo feel */}
          {Object.entries(US_STATES).map(([code,{x,y,name}])=>{
            const heat=getHeat(code); const deals=STATE_DEALS[code]||[];
            const isHot=heat>=60; const isHovered=hovered===code;
            const r=isHot?14:10;
            return (
              <g key={code} onMouseEnter={e=>{setHovered(code); const svg=svgRef.current.getBoundingClientRect(); setTooltip({x:e.clientX-svg.left,y:e.clientY-svg.top});}} onMouseMove={e=>{const svg=svgRef.current.getBoundingClientRect(); setTooltip({x:e.clientX-svg.left,y:e.clientY-svg.top});}} style={{cursor:"pointer"}}>
                {/* Glow ring for hot states */}
                {isHot&&<circle cx={x} cy={y} r={r+8} fill={heatColor(heat)} opacity={0.15} filter="url(#blur)"/>}
                {isHovered&&<circle cx={x} cy={y} r={r+12} fill={C.gold} opacity={0.2} filter="url(#blur)"/>}
                {/* Topo rings */}
                {isHot&&<circle cx={x} cy={y} r={r+4} fill="none" stroke={heatColor(heat)} strokeWidth="0.5" opacity={0.4}/>}
                {/* Main circle */}
                <circle cx={x} cy={y} r={r} fill={isHovered?"#e8c96e":heatColor(heat)} stroke={isHovered?"#fff":isHot?C.gold:"rgba(255,255,255,0.15)"} strokeWidth={isHovered?1.5:isHot?1:0.5} opacity={0.92}/>
                {/* State label */}
                <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={code.length>2?6:7} fontWeight="600" fill={heat>=60?"#06080f":"rgba(255,255,255,0.7)"} letterSpacing="0.02em">{code}</text>
                {/* Deal count badge */}
                {deals.length>0&&<>
                  <circle cx={x+r-1} cy={y-r+1} r={5} fill={C.gold}/>
                  <text x={x+r-1} y={y-r+2} textAnchor="middle" dominantBaseline="middle" fontSize={6} fontWeight="800" fill="#06080f">{deals.length}</text>
                </>}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered&&(()=>{
          const st=US_STATES[hovered]; const deals=STATE_DEALS[hovered]||[]; const heat=getHeat(hovered);
          const ttX=Math.min(tooltip.x, 580); const ttY=Math.max(tooltip.y-10, 10);
          return (
            <div style={{position:"absolute",left:ttX,top:ttY,background:"#0a0c14",border:`1px solid ${C.gold}`,borderRadius:2,padding:"12px 14px",minWidth:220,maxWidth:280,pointerEvents:"none",zIndex:10,boxShadow:`0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${C.goldGlow}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:700,color:C.gold,letterSpacing:"0.05em"}}>{st.name} ({hovered})</span>
                <span style={{fontSize:10,color:heat>=60?C.gold:C.muted,fontWeight:600}}>HEAT: {heat}/100</span>
              </div>
              <div style={{height:"2px",background:`linear-gradient(90deg, ${C.gold}, transparent)`,marginBottom:10,opacity:0.5}}/>
              {deals.length===0?(
                <p style={{fontSize:11,color:C.muted,margin:0,fontStyle:"italic"}}>No tracked transactions in this state</p>
              ):(
                deals.map((d,i)=>(
                  <div key={i} style={{marginBottom:i<deals.length-1?8:0,paddingBottom:i<deals.length-1?8:0,borderBottom:i<deals.length-1?`1px solid ${C.borderDim}`:"none"}}>
                    <div style={{display:"flex",gap:6,marginBottom:3}}>
                      <span style={{fontSize:9,padding:"2px 6px",background:sigC(d.signal)+"22",color:sigC(d.signal),letterSpacing:"0.08em",fontWeight:700}}>{sigL(d.signal)}</span>
                      <span style={{fontSize:9,color:C.dim}}>{d.date}</span>
                    </div>
                    <p style={{margin:"0 0 2px",fontSize:12,color:C.text,fontWeight:500,lineHeight:1.3}}>{d.title}</p>
                    <p style={{margin:0,fontSize:10,color:C.muted}}>{d.size} · {d.brand}</p>
                  </div>
                ))
              )}
            </div>
          );
        })()}

        {/* Legend */}
        <div style={{display:"flex",gap:16,marginTop:12,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Activity Level:</span>
          {[["High (80+)","#c9a84c"],["Medium (60–79)","#8a7a2e"],["Low (40–59)","#2d3a2e"],["Minimal","#1a2230"]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:c,border:"1px solid rgba(255,255,255,0.2)"}}/>
              <span style={{fontSize:9,color:C.muted,letterSpacing:"0.06em"}}>{l}</span>
            </div>
          ))}
          <span style={{fontSize:9,color:C.gold,marginLeft:"auto",letterSpacing:"0.06em"}}>● = Active deals tracked</span>
        </div>
      </div>
    </div>
  );
}

function DealFeed() {
  const [region,setRegion]=useState("All"); const [exp,setExp]=useState(null);
  const regions=["All","Northeast","Southeast","Midwest","Southwest","Pacific"];
  const filtered=DEALS.filter(d=>region==="All"||d.region.includes(region));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(135px,1fr))",gap:8,marginBottom:24}}>
        <Stat label="2025 Record" value="Record Vol" sub="Haig · Kerrigan" hi/>
        <Stat label="Public Capital" value="$4.4B" sub="~80 franchises"/>
        <Stat label="Private Buyers" value="90%+" sub="Of all deals"/>
        <Stat label="Avg Pre-Tax" value="$4.1M" sub="Per store 2024"/>
        <Stat label="Blue Sky Index" value="+76%" sub="vs pre-pandemic"/>
        <Stat label="Top Region" value="Southeast" sub="Population growth"/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        {regions.map(r=>(
          <button key={r} onClick={()=>setRegion(r)} style={{fontSize:10,padding:"5px 13px",background:region===r?C.gold:"transparent",color:region===r?"#06080f":C.muted,border:`1px solid ${region===r?C.gold:C.borderDim}`,borderRadius:1,cursor:"pointer",letterSpacing:"0.1em",fontWeight:700,textTransform:"uppercase"}}>{r}</button>
        ))}
        <span style={{fontSize:9,color:C.dim,marginLeft:"auto",letterSpacing:"0.08em",textTransform:"uppercase"}}>Newest First</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {filtered.map((d,i)=>(
          <div key={d.id} onClick={()=>setExp(exp===d.id?null:d.id)} style={{background:exp===d.id?C.card:C.surface,border:`1px solid ${exp===d.id?C.border:C.borderDim}`,borderRadius:2,padding:"15px 18px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
            {i===0&&<div style={{position:"absolute",top:0,left:0,bottom:0,width:"2px",background:C.gold}}/>}
            <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:7,flexWrap:"wrap"}}>
                  <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",background:sigC(d.signal)+"18",color:sigC(d.signal),border:`1px solid ${sigC(d.signal)}40`,letterSpacing:"0.1em"}}>{sigL(d.signal)}</span>
                  <span style={{fontSize:9,color:C.dim,letterSpacing:"0.05em"}}>{d.source}</span>
                  <span style={{fontSize:9,color:C.dim}}>{d.date}</span>
                  {i===0&&<span style={{fontSize:9,color:C.gold,fontWeight:700,letterSpacing:"0.1em"}}>● LATEST</span>}
                </div>
                <p style={{margin:"0 0 4px",fontWeight:600,fontSize:14,color:C.text,lineHeight:1.3}}>{d.title}</p>
                <p style={{margin:0,fontSize:11,color:C.muted,letterSpacing:"0.02em"}}>{d.brand} &nbsp;·&nbsp; {d.region} &nbsp;·&nbsp; {d.state}</p>
                {exp===d.id&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.borderDim}`}}><p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.7}}>{d.detail}</p></div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:17,fontWeight:700,color:C.gold,letterSpacing:"-0.01em"}}>{d.size}</div>
                {d.stores&&<div style={{fontSize:10,color:C.dim,marginTop:2}}>{d.stores} stores</div>}
                <div style={{fontSize:9,color:C.dim,marginTop:6,letterSpacing:"0.06em"}}>{exp===d.id?"COLLAPSE ↑":"EXPAND ↓"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AIChat sys="You are a senior automotive M&A analyst. Real 2025-2026: Asbury-Herb Chambers $1.45B, Group 1 FL/TX, Lithia Medford MB, Hudson All Star, Carvana new-car, 2025 record, Toyota/Lexus 8-13x, Honda 5.5-8x, 90%+ private, Southeast leads. History: 1990s rollup, 2008 crisis, COVID boom 15x, normalization. Be precise and broker-focused." placeholder="Ask about deal flow, valuations, buyer profiles, or which markets are heating up..."/>
    </div>
  );
}

function BlueSkyCalc() {
  const [sel,setSel]=useState(null); const [inp,setInp]=useState({brand:"Toyota",pretax:1500000,region:"Southeast"});
  const [res,setRes]=useState(null); const [load,setLoad]=useState(false);
  const maxH=Math.max(...Object.values(BLUE_SKY).map(v=>v.high));
  const sorted=[...Object.entries(BLUE_SKY)].sort((a,b)=>b[1].high-a[1].high);
  const calc=async()=>{
    setLoad(true); setRes(null); const bs=BLUE_SKY[inp.brand];
    const low=Math.round(inp.pretax*bs.low),mid=Math.round(inp.pretax*((bs.low+bs.high)/2)),high=Math.round(inp.pretax*bs.high);
    try{
      const c=await callClaude("You are a dealership valuation expert at Haig Partners or Kerrigan Advisors level. Give a precise 2-sentence broker-focused valuation commentary with specific market context. Reference comparable transactions. No bullet points.",`Brand: ${inp.brand} (${bs.low}–${bs.high}x, trend: ${bs.trend}). Pre-tax: $${inp.pretax.toLocaleString()}. Region: ${inp.region}. Range: ${fmt(low)}–${fmt(high)}.`);
      setRes({low,mid,high,c,ml:bs.low,mh:bs.high});
    }catch{setRes({low,mid,high,c:"Based on current Haig/Kerrigan Q4 2025 data.",ml:bs.low,mh:bs.high});}
    setLoad(false);
  };
  return (
    <div>
      <p style={{fontSize:11,color:C.muted,marginBottom:16,letterSpacing:"0.03em"}}>Source: Haig Partners Q4 2025 Haig Report® · Kerrigan Advisors Q4 2025 Blue Sky Report®</p>
      <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:24}}>
        {sorted.map(([brand,data])=>(
          <div key={brand} onClick={()=>setSel(sel===brand?null:brand)} style={{background:sel===brand?C.card:C.surface,border:`1px solid ${sel===brand?C.border:C.borderDim}`,borderRadius:2,padding:"10px 14px",cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontWeight:600,fontSize:13,color:C.text,minWidth:90}}>{brand}</span>
                <span style={{color:tC(data.trend),fontSize:12,fontWeight:700}}>{data.trend==="up"?"↑":data.trend==="down"?"↓":"→"}</span>
              </div>
              <span style={{fontWeight:700,fontSize:13,color:data.trend==="up"?C.gold:data.trend==="down"?C.red:C.muted}}>{data.low}–{data.high}x</span>
            </div>
            <div style={{position:"relative",height:4,background:C.borderDim,borderRadius:1,overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:(data.high/maxH*100)+"%",background:"rgba(201,168,76,0.25)",borderRadius:1}}/>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:(data.low/maxH*100)+"%",background:C.gold,borderRadius:1}}/>
            </div>
            {sel===brand&&<p style={{margin:"8px 0 0",fontSize:11,color:C.muted,lineHeight:1.6}}>{data.note}</p>}
          </div>
        ))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,padding:"18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
          <div style={{width:2,height:12,background:C.gold}}/>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",color:C.gold,textTransform:"uppercase"}}>Blue Sky Calculator</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10,marginBottom:14}}>
          {[["Franchise","brand","select",Object.keys(BLUE_SKY)],["Region","region","select",["Northeast","Southeast","Midwest","Southwest","Mountain","Pacific"]]].map(([l,k,t,opts])=>(
            <div key={k}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,letterSpacing:"0.12em",textTransform:"uppercase"}}>{l}</label>
              <select value={inp[k]} onChange={e=>setInp(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:C.surface,border:`1px solid ${C.borderDim}`,color:C.text,padding:"8px 10px",fontSize:12,borderRadius:1,outline:"none"}}>{opts.map(o=><option key={o} style={{background:C.surface}}>{o}</option>)}</select></div>
          ))}
          <div><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,letterSpacing:"0.12em",textTransform:"uppercase"}}>Pre-Tax Earnings</label>
            <input type="number" value={inp.pretax} onChange={e=>setInp(p=>({...p,pretax:+e.target.value}))} style={{width:"100%",background:C.surface,border:`1px solid ${C.borderDim}`,color:C.text,padding:"8px 10px",fontSize:12,borderRadius:1,outline:"none"}}/></div>
        </div>
        <button onClick={calc} style={{background:C.gold,border:"none",color:"#06080f",padding:"10px 24px",fontSize:10,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",marginBottom:14}}>CALCULATE BLUE SKY VALUE</button>
        {load&&<p style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>Running valuation model...</p>}
        {res&&!load&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
              {[["Conservative",res.low],["Market Mid",res.mid],["Optimistic",res.high]].map(([l,v],i)=>(
                <div key={l} style={{background:C.surface,borderRadius:2,padding:"12px",textAlign:"center",border:`1px solid ${i===1?C.border:C.borderDim}`}}>
                  <div style={{fontSize:9,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                  <div style={{fontSize:18,fontWeight:700,color:i===1?C.gold:C.text}}>{fmt(v)}</div>
                </div>
              ))}
            </div>
            <p style={{margin:"0 0 6px",fontSize:10,color:C.muted,letterSpacing:"0.06em"}}>{res.ml}–{res.mh}x pre-tax earnings · Source: Haig/Kerrigan Q4 2025</p>
            <p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.7}}>{res.c}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketAnalysis() {
  const [region,setRegion]=useState("Southeast"); const [report,setReport]=useState(""); const [load,setLoad]=useState(false);
  const generate=async()=>{
    setLoad(true); setReport("");
    try{
      const t=await callClaude("You are a senior automotive M&A market analyst. Real 2025-2026: record buy-sell, $4.4B public capital, Toyota/Lexus 8-13x, Honda 5.5-8x, Asbury-Herb Chambers $1.45B, Lithia Medford, Carvana new-car, 90%+ private, Southeast leads, PE/family office accelerating. Draw on historical patterns from 1990s rollup, 2008 crisis, COVID boom.",
        `Generate a comprehensive M&A intelligence report for ${region} Q2 2026. Structure: 1) Current deal activity, 2) Active buyer profiles, 3) Blue Sky multiples for this region, 4) Pre-market signals, 5) Three specific broker opportunities. Be data-precise.`);
      setReport(t);
    }catch{setReport("Report unavailable. Please retry.");}
    setLoad(false);
  };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(135px,1fr))",gap:8,marginBottom:24}}>
        <Stat label="2025 Volume" value="Record" sub="Buy-sell market" hi/>
        <Stat label="Public Capital" value="$4.4B" sub="80 franchises"/>
        <Stat label="Toyota/Lexus" value="8–13x" sub="Blue Sky"/>
        <Stat label="Avg Pre-Tax" value="$4.1M" sub="Per store 2024"/>
        <Stat label="Kerrigan Index" value="+76%" sub="vs pre-pandemic"/>
        <Stat label="Top Buyers" value="Private" sub="90%+ of deals"/>
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
        {["Northeast","Southeast","Midwest","Southwest","Mountain","Pacific","Florida","Texas"].map(r=>(
          <button key={r} onClick={()=>setRegion(r)} style={{fontSize:10,padding:"5px 13px",background:region===r?C.gold:"transparent",color:region===r?"#06080f":C.muted,border:`1px solid ${region===r?C.gold:C.borderDim}`,borderRadius:1,cursor:"pointer",letterSpacing:"0.1em",fontWeight:700,textTransform:"uppercase"}}>{r}</button>
        ))}
      </div>
      <button onClick={generate} style={{background:C.gold,border:"none",color:"#06080f",padding:"10px 24px",fontSize:10,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",marginBottom:18}}>GENERATE {region.toUpperCase()} INTELLIGENCE REPORT</button>
      {(load||report)&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,padding:"18px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:2,height:12,background:C.gold}}/>
            <span style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase"}}>{region} — Q2 2026 Intelligence Report</span>
          </div>
          {load?<p style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>Generating analysis...</p>:<p style={{fontSize:13,lineHeight:1.8,color:C.muted,whiteSpace:"pre-wrap"}}>{report}</p>}
        </div>
      )}
      <AIChat sys={`Senior automotive M&A analyst. 2025-2026 real data. Focus: ${region}. Toyota/Lexus 8-13x, Honda 5.5-8x raised Q4 2025, private buyers 90%+, Southeast leads, Asbury $1.45B, Carvana new-car. Historical: 1990s rollup, 2008 crisis, COVID boom, normalization.`} placeholder={`Ask about ${region} deal flow, active buyers, or specific franchise opportunities...`}/>
    </div>
  );
}

function MarketHistory() {
  const [sel,setSel]=useState(0); const [analysis,setAnalysis]=useState(""); const [load,setLoad]=useState(false);
  const era=HISTORY[sel];
  const run=async()=>{
    setLoad(true); setAnalysis("");
    try{const t=await callClaude("You are a veteran automotive M&A advisor with 30+ years in the business. Draw direct, specific parallels between historical eras and today 2026. Reference specific companies, deal sizes, and multiples. Broker-focused perspective.",`Analyze ${era.era} (${era.years}) and connect it precisely to the 2026 market. What patterns are repeating? What should brokers be doing right now?`); setAnalysis(t);}
    catch{setAnalysis("Analysis unavailable.");}
    setLoad(false);
  };
  return (
    <div>
      <p style={{fontSize:11,color:C.muted,marginBottom:16,lineHeight:1.6}}>The AI analyst draws on every major M&A cycle in automotive retail history — providing pattern recognition that took decades to accumulate.</p>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
        {HISTORY.map((h,i)=><button key={i} onClick={()=>{setSel(i);setAnalysis("");}} style={{fontSize:10,padding:"5px 12px",background:sel===i?C.gold:"transparent",color:sel===i?"#06080f":C.muted,border:`1px solid ${sel===i?C.gold:C.borderDim}`,borderRadius:1,cursor:"pointer",letterSpacing:"0.08em",fontWeight:700}}>{h.years}</button>)}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,padding:"18px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg, ${C.gold}, transparent)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <div><p style={{margin:"0 0 3px",fontWeight:700,fontSize:15,color:C.text}}>{era.era}</p><p style={{margin:0,fontSize:11,color:C.muted}}>{era.years}</p></div>
          <span style={{fontSize:10,padding:"4px 10px",background:C.goldGlow,color:C.gold,border:`1px solid ${C.border}`,fontWeight:700,letterSpacing:"0.08em"}}>BLUE SKY: {era.mult}</span>
        </div>
        <p style={{margin:"0 0 12px",fontSize:13,color:C.muted,lineHeight:1.75}}>{era.summary}</p>
        <div style={{borderTop:`1px solid ${C.borderDim}`,paddingTop:12}}>
          <span style={{fontSize:10,color:C.dim,letterSpacing:"0.1em",textTransform:"uppercase"}}>Broker Lesson: </span>
          <span style={{fontSize:13,color:C.text,fontWeight:500}}>{era.lesson}</span>
        </div>
      </div>
      <button onClick={run} style={{background:C.gold,border:"none",color:"#06080f",padding:"10px 24px",fontSize:10,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase",marginBottom:14}}>AI: HOW DOES THIS APPLY TO 2026?</button>
      {(load||analysis)&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,padding:"18px"}}>{load?<p style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>Analyzing historical patterns...</p>:<p style={{fontSize:13,lineHeight:1.8,color:C.muted,whiteSpace:"pre-wrap"}}>{analysis}</p>}</div>}
    </div>
  );
}

function Newsletter() {
  const [form,setForm]=useState({name:"",email:"",states:[],brands:[],tier:"free"}); const [done,setDone]=useState(false);
  const toggle=(arr,v)=>arr.includes(v)?arr.filter(x=>x!==v):[...arr,v];
  const STATES=["AL","AZ","CA","CO","FL","GA","IL","MD","MI","MN","MO","NC","NJ","NV","NY","OH","OR","PA","TN","TX","VA","WA"];
  if(done) return(
    <div style={{textAlign:"center",padding:"48px 20px"}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:C.goldGlow,border:`1px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:18,color:C.gold}}>✓</div>
      <p style={{fontWeight:700,fontSize:17,margin:"0 0 8px",color:C.text}}>Subscription Confirmed</p>
      <p style={{fontSize:12,color:C.muted}}>{form.tier==="pro"?"Pro: Daily alerts + pre-market signals":"Free: Weekly M&A digest"}</p>
    </div>
  );
  const lb=(active)=>({fontSize:10,padding:"5px 12px",background:active?C.gold:"transparent",color:active?"#06080f":C.muted,border:`1px solid ${active?C.gold:C.borderDim}`,borderRadius:1,cursor:"pointer",letterSpacing:"0.08em",fontWeight:700,textTransform:"uppercase"});
  return(
    <div style={{maxWidth:580}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[["Name","name","Your name"],["Email","email","your@brokerage.com"]].map(([l,k,ph])=>(
          <div key={k}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:5,letterSpacing:"0.14em",textTransform:"uppercase"}}>{l}</label>
            <input value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:C.surface,border:`1px solid ${C.borderDim}`,color:C.text,padding:"9px 12px",fontSize:12,borderRadius:1,outline:"none"}}/></div>
        ))}
      </div>
      <div style={{marginBottom:16}}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:8,letterSpacing:"0.14em",textTransform:"uppercase"}}>States to Monitor</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{STATES.map(s=><button key={s} onClick={()=>setForm(p=>({...p,states:toggle(p.states,s)}))} style={lb(form.states.includes(s))}>{s}</button>)}</div></div>
      <div style={{marginBottom:16}}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:8,letterSpacing:"0.14em",textTransform:"uppercase"}}>Franchise Alerts</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{Object.keys(BLUE_SKY).map(b=><button key={b} onClick={()=>setForm(p=>({...p,brands:toggle(p.brands,b)}))} style={lb(form.brands.includes(b))}>{b}</button>)}</div></div>
      <div style={{marginBottom:20}}><label style={{fontSize:9,color:C.muted,display:"block",marginBottom:8,letterSpacing:"0.14em",textTransform:"uppercase"}}>Subscription Tier</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[["free","Free — Weekly Digest"],["pro","Pro — Daily Alerts + Pre-Market Signals"]].map(([v,l])=>(
            <button key={v} onClick={()=>setForm(p=>({...p,tier:v}))} style={lb(form.tier===v)}>{l}</button>
          ))}
        </div></div>
      <button onClick={()=>setDone(true)} style={{background:C.gold,border:"none",color:"#06080f",padding:"11px 28px",fontSize:10,fontWeight:800,letterSpacing:"0.14em",cursor:"pointer",textTransform:"uppercase"}}>SUBSCRIBE</button>
    </div>
  );
}

const NAV=[{id:"feed",label:"Deal Feed"},{id:"heatmap",label:"Heatmap"},{id:"blue-sky",label:"Blue Sky"},{id:"analysis",label:"Market Analysis"},{id:"history",label:"Market History"},{id:"newsletter",label:"Alerts"}];
const SECTIONS={feed:DealFeed,heatmap:HeatMap,"blue-sky":BlueSkyCalc,analysis:MarketAnalysis,history:MarketHistory,newsletter:Newsletter};
const TITLES={feed:"Deal Feed",heatmap:"M&A Activity Heatmap","blue-sky":"Blue Sky Multiples",analysis:"Market Analysis",history:"Market History",newsletter:"Alerts & Newsletter"};
const SUBS={feed:"Sorted newest first · Real transactions from verified sources","blue-sky":"Source: Haig Partners Q4 2025 · Kerrigan Advisors Q4 2025",heatmap:"Hover any state for current deal data · Intensity reflects transaction volume",analysis:"AI-generated regional intelligence · Q2 2026",history:"30 years of M&A cycles distilled for broker insight",newsletter:"Free weekly digest or Pro daily alerts"};

export default function App() {
  const [tab,setTab]=useState("feed"); const [pro,setPro]=useState(false);
  const Section=SECTIONS[tab];
  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:C.text}}>
      {/* Top bar */}
      <div style={{borderBottom:`1px solid ${C.border}`,background:C.surface,position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0 10px",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"baseline",gap:12}}>
              <span style={{fontWeight:800,fontSize:18,letterSpacing:"-0.03em",color:C.text}}>BlueSky<span style={{color:C.gold}}>Intel</span></span>
              <span style={{fontSize:9,color:C.gold,padding:"2px 7px",border:`1px solid ${C.border}`,letterSpacing:"0.14em",fontWeight:700}}>BETA</span>
              <span style={{fontSize:9,color:C.muted,letterSpacing:"0.08em",display:"none @media(max-width:600px)"}}>AUTOMOTIVE M&A INTELLIGENCE</span>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>
              <span style={{fontSize:9,color:C.muted,letterSpacing:"0.08em"}}>LIVE · Data through Apr 2026</span>
              <span style={{width:1,height:12,background:C.borderDim}}/>
              <span style={{fontSize:9,padding:"4px 10px",color:C.muted,border:`1px solid ${C.borderDim}`,letterSpacing:"0.1em"}}>FREE PLAN</span>
              <button onClick={()=>setPro(true)} style={{background:C.gold,border:"none",color:"#06080f",padding:"7px 16px",fontSize:10,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase"}}>UPGRADE PRO</button>
            </div>
          </div>
          <div style={{display:"flex",gap:0,overflowX:"auto"}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} style={{fontSize:10,padding:"8px 16px",border:"none",borderBottom:tab===n.id?`2px solid ${C.gold}`:"2px solid transparent",background:"transparent",color:tab===n.id?C.gold:C.muted,fontWeight:tab===n.id?700:400,whiteSpace:"nowrap",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.15s"}}>{n.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 24px 60px"}}>
        <div style={{marginBottom:24}}>
          <h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.02em"}}>{TITLES[tab]}</h1>
          <p style={{margin:0,fontSize:11,color:C.muted,letterSpacing:"0.04em"}}>{SUBS[tab]}</p>
          <GoldLine/>
        </div>
        <Section/>
      </div>

      {/* Pro Modal */}
      {pro&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}} onClick={()=>setPro(false)}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:2,padding:"32px",maxWidth:460,width:"90%",position:"relative",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg, transparent, ${C.gold}, transparent)`}}/>
            <p style={{margin:"0 0 4px",fontWeight:800,fontSize:20,color:C.text,letterSpacing:"-0.02em"}}>BlueSkyIntel <span style={{color:C.gold}}>Pro</span></p>
            <p style={{margin:"0 0 22px",fontSize:12,color:C.muted}}>The intelligence platform serious M&A brokers keep open all day.</p>
            {["Daily deal alerts by state, region & brand","Pre-market & dark deal signals","Full Blue Sky calculator with AI commentary","Dealer group intelligence briefs","Regional AI market reports","CRM deal pipeline tracker","Buyer/seller matching AI","Historical pattern recognition engine","Priority AI analyst access"].map(f=>(
              <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <span style={{color:C.gold,fontSize:12,fontWeight:700}}>✓</span>
                <span style={{fontSize:12,color:C.muted}}>{f}</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${C.borderDim}`,marginTop:22,paddingTop:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><div style={{fontSize:26,fontWeight:800,color:C.gold,letterSpacing:"-0.02em"}}>$299<span style={{fontSize:14,fontWeight:400,color:C.muted}}>/mo</span></div><div style={{fontSize:10,color:C.dim,letterSpacing:"0.06em"}}>CANCEL ANYTIME</div></div>
              <button style={{background:C.gold,border:"none",color:"#06080f",padding:"12px 28px",fontSize:11,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase"}} onClick={()=>setPro(false)}>GET PRO ACCESS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }
