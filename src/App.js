import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#08090c",surface:"#0c0f15",card:"#10141c",cardHov:"#141921",
  border:"#1a2030",bGold:"#6b5030",gold:"#c8a45a",goldLt:"#e8c97a",
  goldDim:"#5a4025",text:"#ede9e3",sub:"#6a7080",dim:"#35404a",
  up:"#3a7a50",upLt:"#4aaa68",down:"#7a3030",teal:"#1e4858",
};

const DEALS = [
  {id:1,title:"Penske Acquires 2 Lexus Rooftops",states:["TX","CA"],region:"Southwest",brand:"Lexus",date:"Mar 2026",size:"Undisclosed",signal:"confirmed",source:"Automotive News",stores:2,buyer:"Penske Automotive",seller:"Private Family Group",detail:"Luxury import consolidation. Penske targeting Sun Belt aggressively Q1 2026."},
  {id:2,title:"Lithia — Mercedes-Benz of Medford",states:["OR"],region:"Pacific",brand:"Mercedes-Benz",date:"Feb 2026",size:"~$38M",signal:"confirmed",source:"Presidio Group",stores:1,buyer:"Lithia Motors",seller:"Medford Auto Group",detail:"Incl. real estate. Lithia continues Pacific NW buildout. MB demand strongest in 5 years."},
  {id:3,title:"Asbury Sells 6 St. Louis Luxury Stores",states:["MO"],region:"Midwest",brand:"Multi luxury",date:"Feb 2026",size:"~$210M",signal:"confirmed",source:"SEC Filing",stores:6,buyer:"MileOne Automotive",seller:"Asbury Automotive",detail:"Portfolio pruning. Asbury exiting Midwest to focus capital on Sun Belt. Landmark deal."},
  {id:4,title:"ZT Automotive — 4 Tampa Bay Dealerships",states:["FL"],region:"Southeast",brand:"Multi-brand",date:"Dec 2025",size:"~$95M",signal:"confirmed",source:"Auto Remarketing",stores:4,buyer:"ZT Automotive",seller:"Bay Area Auto Group",detail:"PE play. Strong used vehicle margins drove premium valuation in FL market."},
  {id:5,title:"Hudson Automotive — All Star Auto Group",states:["GA","SC","NC"],region:"Southeast",brand:"Multi-brand",date:"Dec 2025",size:"~$310M",signal:"confirmed",source:"Kerrigan Advisors",stores:12,buyer:"Hudson Automotive",seller:"All Star Automotive",detail:"2nd largest deal of 2025. Southeast footprint play, 12 rooftops across 3 states."},
  {id:6,title:"Group 1 Acquires 3 Luxury Stores FL & TX",states:["FL","TX"],region:"Southeast",brand:"Lexus, Acura, Mercedes",date:"Dec 2025",size:"~$130M",signal:"confirmed",source:"Dealer News",stores:3,buyer:"Group 1 Automotive",seller:"Regional Group",detail:"Premium brand focus continues. Group 1 targeting $1B+ acquisition run rate for 2026."},
  {id:7,title:"Asbury Acquires Herb Chambers Companies",states:["MA","CT","NH","RI"],region:"Northeast",brand:"Multi (52 franchises)",date:"Nov 2025",size:"~$1.1B",signal:"confirmed",source:"SEC Filing",stores:20,buyer:"Asbury Automotive",seller:"Herb Chambers",detail:"Largest single-seller transaction in automotive retail history."},
  {id:8,title:"PE & Family Offices Accelerating Entries",states:["TX","FL","GA","NC"],region:"Multi",brand:"Multi-brand",date:"Oct 2025",size:"Various",signal:"trend",source:"Kerrigan Q3 Report",stores:0,buyer:"Private Equity",seller:"Various",detail:"PE now 18% of all buyers. Platforming driving premium Blue Sky multiples across markets."},
  {id:9,title:"Carvana Acquiring Stellantis Franchise Stores",states:["AZ","CA","TX"],region:"Southwest",brand:"Jeep/Ram/Chrysler",date:"Oct 2025",size:"~$60M",signal:"rumor",source:"Industry Intel",stores:5,buyer:"Carvana",seller:"Stellantis-affiliated",detail:"Unconfirmed. Carvana pivoting to franchise model after profitability milestone."},
  {id:10,title:"Larry H. Miller — 3 BMW Rooftops Colorado",states:["CO"],region:"Southwest",brand:"BMW",date:"Sep 2025",size:"~$85M",signal:"confirmed",source:"Automotive News",stores:3,buyer:"Larry H. Miller",seller:"Mountain Auto Group",detail:"LHM expanding luxury import. BMW multiple hit 9x earnings — near record high."},
];

const BLUE_SKY = {
  "Toyota":{low:8.0,high:12.0,trend:"up",note:"Most coveted franchise. 10x+ in FL & TX. Buyers compete aggressively at any price."},
  "Lexus":{low:9.0,high:13.0,trend:"up",note:"Near-impossible to acquire. Scarce supply driving record premiums nationally."},
  "Honda":{low:5.5,high:8.0,trend:"up",note:"Low-end raised Q4 2025 by Kerrigan. Hybrid sales driving sustained confidence."},
  "BMW":{low:6.0,high:9.0,trend:"up",note:"Multiple increases Q4 2025. Luxury demand strong across all geographies."},
  "Mercedes":{low:5.5,high:8.5,trend:"stable",note:"Consistent institutional buyer interest. Solid luxury performance continues."},
  "Audi":{low:5.0,high:8.0,trend:"up",note:"Q4 2025 increase per Kerrigan. European luxury gaining meaningful momentum."},
  "Porsche":{low:8.0,high:11.0,trend:"down",note:"Low end cut Q3 2025. EV strategy delays and facility risk creating headwinds."},
  "Ford":{low:3.0,high:5.0,trend:"up",note:"US manufacturing bill significantly boosted domestic brand buyer sentiment."},
  "Chevrolet":{low:3.0,high:4.75,trend:"up",note:"High-end raised Q4 2025. Improved inventory discipline driving buyer interest."},
  "Cadillac":{low:3.5,high:5.5,trend:"up",note:"Q4 2025 increase. EV transition creating new strategic acquisition opportunity."},
  "Subaru":{low:4.0,high:6.5,trend:"down",note:"Sales -5.8% YoY Q3 2025. Softening demand across most key markets."},
  "Kia":{low:4.5,high:6.5,trend:"stable",note:"Consistent regional demand. Haig and Kerrigan aligned on range."},
  "Hyundai":{low:4.0,high:6.0,trend:"stable",note:"Strong value position. Ioniq EV line adding long-term franchise appeal."},
  "Stellantis":{low:1.5,high:3.5,trend:"down",note:"Significant pressure. Inventory glut and dealer relations remain strained."},
  "Nissan":{low:1.5,high:3.0,trend:"down",note:"Brand headwinds significant. Weak demand limiting buyer pool considerably."},
};

const GROUPS = [
  {name:"Penske Automotive",stores:315,revenue:"$27B",ytdDeals:3,trend:"up",focus:"Luxury Import",score:94,hq:"Bloomfield Hills, MI"},
  {name:"Lithia Motors",stores:290,revenue:"$31B",ytdDeals:5,trend:"up",focus:"Geographic Expansion",score:91,hq:"Medford, OR"},
  {name:"Asbury Automotive",stores:205,revenue:"$16B",ytdDeals:4,trend:"up",focus:"Northeast + Sun Belt",score:89,hq:"Duluth, GA"},
  {name:"Group 1 Automotive",stores:265,revenue:"$19B",ytdDeals:4,trend:"up",focus:"TX, FL & International",score:88,hq:"Houston, TX"},
  {name:"AutoNation",stores:250,revenue:"$21B",ytdDeals:2,trend:"flat",focus:"Sun Belt Optimization",score:82,hq:"Fort Lauderdale, FL"},
  {name:"Hendrick Automotive",stores:92,revenue:"$10B",ytdDeals:1,trend:"up",focus:"Southeast Premium",score:79,hq:"Charlotte, NC"},
  {name:"Larry H. Miller",stores:68,revenue:"$6B",ytdDeals:3,trend:"up",focus:"Mountain West Luxury",score:77,hq:"Sandy, UT"},
  {name:"Sonic Automotive",stores:108,revenue:"$14B",ytdDeals:2,trend:"flat",focus:"EchoPark + Franchises",score:74,hq:"Charlotte, NC"},
];

const HISTORY = [
  {year:2024,volume:"$14.2B",deals:384,avgSize:"$37M",topRegion:"Southeast",note:"Record PE participation at 16% of buyers"},
  {year:2023,volume:"$11.8B",deals:321,avgSize:"$36.8M",topRegion:"Southeast",note:"Post-COVID normalization. Blue Sky stabilized after 2022 peak"},
  {year:2022,volume:"$16.1B",deals:409,avgSize:"$39.4M",topRegion:"Southeast",note:"All-time record. Inventory scarcity drove unprecedented multiples"},
  {year:2021,volume:"$12.4B",deals:361,avgSize:"$34.3M",topRegion:"Southeast",note:"Pandemic rebound. Private buyers dominated, PE just entering market"},
  {year:2020,volume:"$7.3B",deals:249,avgSize:"$29.3M",topRegion:"Southeast",note:"COVID suppressed H1. H2 recovery exceeded all expectations"},
];

const REGIONS = {
  Southeast:{states:["FL","GA","NC","SC","TN","AL","VA"],deals:42,avgMultiple:7.2,hot:true},
  Southwest:{states:["TX","AZ","NV","CO","NM"],deals:31,avgMultiple:6.8,hot:true},
  Northeast:{states:["MA","NY","NJ","CT","PA"],deals:24,avgMultiple:6.1,hot:false},
  Midwest:{states:["MO","OH","IL","MI","IN"],deals:18,avgMultiple:5.4,hot:false},
  Pacific:{states:["CA","OR","WA"],deals:16,avgMultiple:6.3,hot:false},
};

const NAV = [
  {id:"feed",label:"Deal Feed"},
  {id:"map",label:"Market Map"},
  {id:"blusky",label:"Blue Sky Index"},
  {id:"groups",label:"Dealer Groups"},
  {id:"history",label:"Market History"},
  {id:"ai",label:"AI Analyst"},
];

function TopoMap({onRegionClick}) {
  const [hov,setHov] = useState(null);
  const pts = {
    Southeast:{x:680,y:310,r:22,deals:42},
    Southwest:{x:320,y:290,r:19,deals:31},
    Northeast:{x:760,y:185,r:16,deals:24},
    Midwest:{x:550,y:230,r:14,deals:18},
    Pacific:{x:120,y:230,r:13,deals:16},
  };
  return (
    <div style={{position:"relative",background:"#060d0a",borderRadius:2,overflow:"hidden",border:"1px solid "+C.border}}>
      <svg viewBox="60 50 820 420" style={{width:"100%",display:"block"}}>
        <defs>
          <radialGradient id="g1" cx="60%" cy="55%" r="55%"><stop offset="0%" stopColor="#1a3a22" stopOpacity="0.7"/><stop offset="100%" stopColor="#060d0a" stopOpacity="0"/></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="sglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect x="60" y="50" width="820" height="420" fill="#060d0a"/>
        {[0,1,2,3,4].map(i=>(
          <ellipse key={i} cx="460" cy="265" rx={400-i*60} ry={210-i*30} fill="none" stroke="#0f2018" strokeWidth={0.8} opacity={0.5-i*0.08}/>
        ))}
        <rect x="60" y="50" width="820" height="420" fill="url(#g1)"/>
        <path d="M165,95 L200,88 L310,78 L460,71 L590,68 L682,70 L742,77 L780,90 L808,117 L805,140 L782,182 L746,223 L692,248 L627,270 L561,299 L495,323 L429,338 L341,347 L253,340 L165,310 L85,260 L61,215 L79,173 L127,141 L165,117 Z" fill="#0f2018" stroke="#1a3525" strokeWidth="1.5"/>
        <path d="M165,95 L200,88 L310,78 L460,71 L590,68 L682,70 L742,77 L780,90 L808,117 L805,140 L782,182 L746,223 L692,248 L627,270 L561,299 L495,323 L429,338 L341,347 L253,340 L165,310 L85,260 L61,215 L79,173 L127,141 L165,117 Z" fill="url(#g1)" opacity="0.5"/>
        {Object.entries(pts).map(([reg,d])=>{
          const isHot = REGIONS[reg]?.hot;
          const isHov = hov===reg;
          return (
            <g key={reg} style={{cursor:"pointer"}} onMouseEnter={()=>setHov(reg)} onMouseLeave={()=>setHov(null)} onClick={()=>onRegionClick(reg)}>
              {isHot && <circle cx={d.x} cy={d.y} r={d.r+16} fill={C.gold} opacity="0.08" filter="url(#glow)"/>}
              <circle cx={d.x} cy={d.y} r={isHov?d.r+4:d.r} fill={isHot?"#2a1e08":C.surface} stroke={isHov?C.gold:isHot?C.bGold:C.border} strokeWidth={isHov?1.5:1} style={{transition:"all 0.2s"}}/>
              <text x={d.x} y={d.y-3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={isHot?C.gold:C.sub} style={{pointerEvents:"none"}}>{reg.substring(0,4).toUpperCase()}</text>
              <text x={d.x} y={d.y+8} textAnchor="middle" fontSize="7" fill={isHot?C.goldLt:C.dim} style={{pointerEvents:"none"}}>{d.deals}</text>
            </g>
          );
        })}
        {hov && REGIONS[hov] && (
          <g>
            <rect x="560" y="55" width="220" height="90" fill={C.card} stroke={C.bGold} strokeWidth="0.8"/>
            <text x="575" y="76" fontSize="8" fontWeight="700" fill={C.gold}>{hov.toUpperCase()} REGION</text>
            <text x="575" y="93" fontSize="7" fill={C.sub}>Deals YTD: {REGIONS[hov].deals}</text>
            <text x="575" y="107" fontSize="7" fill={C.sub}>Avg Multiple: {REGIONS[hov].avgMultiple}x</text>
            <text x="575" y="133" fontSize="6.5" fill={C.goldDim||"#5a4025"}>CLICK TO FILTER</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function DealCard({deal,idx,expanded,onToggle}) {
  const isNew = idx===0;
  const sigColor = deal.signal==="confirmed"?C.up:deal.signal==="rumor"?C.teal:C.dim;
  return (
    <div onClick={onToggle} style={{background:isNew?"#0e1a10":C.card,border:"1px solid "+(expanded?C.bGold:isNew?C.bGold:C.border),borderLeft:"3px solid "+sigColor,marginBottom:6,cursor:"pointer",transition:"border-color 0.15s"}}>
      <div style={{padding:"16px 20px",display:"flex",alignItems:"flex-start",gap:16}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            {isNew && <span style={{fontSize:7,fontWeight:800,background:C.gold,color:"#000",padding:"2px 7px",letterSpacing:"0.14em"}}>LATEST</span>}
            <span style={{fontSize:7,fontWeight:700,color:sigColor,letterSpacing:"0.1em",border:"1px solid "+sigColor,padding:"2px 6px"}}>{deal.signal.toUpperCase()}</span>
            <span style={{fontSize:7,color:C.dim}}>{deal.source} · {deal.date}</span>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:5}}>{deal.title}</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:C.sub}}>{deal.brand}</span>
            <span style={{fontSize:10,color:C.dim}}>·</span>
            <span style={{fontSize:10,color:C.sub}}>{deal.states.join(", ")}</span>
            {deal.stores>0&&<><span style={{fontSize:10,color:C.dim}}>·</span><span style={{fontSize:10,color:C.sub}}>{deal.stores} rooftop{deal.stores!==1?"s":""}</span></>}
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:15,fontWeight:700,color:C.gold}}>{deal.size}</div>
          <div style={{fontSize:8,color:C.dim,marginTop:2}}>EST. VALUE</div>
          <div style={{fontSize:8,color:C.dim,marginTop:8}}>{expanded?"▲":"▼"}</div>
        </div>
      </div>
      {expanded&&(
        <div style={{padding:"0 20px 16px",borderTop:"1px solid "+C.border,paddingTop:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><div style={{fontSize:8,color:C.dim,letterSpacing:"0.1em",marginBottom:3}}>BUYER</div><div style={{fontSize:11,color:C.text}}>{deal.buyer}</div></div>
            <div><div style={{fontSize:8,color:C.dim,letterSpacing:"0.1em",marginBottom:3}}>SELLER</div><div style={{fontSize:11,color:C.text}}>{deal.seller}</div></div>
          </div>
          <div style={{fontSize:11,color:C.sub,lineHeight:1.6,borderLeft:"2px solid "+C.bGold,paddingLeft:12}}>{deal.detail}</div>
        </div>
      )}
    </div>
  );
}

function BlueSkyIndex() {
  const [sel,setSel] = useState(null);
  const sorted = Object.entries(BLUE_SKY).sort((a,b)=>b[1].high-a[1].high);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {sorted.map(([brand,d])=>{
          const isSel=sel===brand;
          const tColor=d.trend==="up"?C.upLt:d.trend==="down"?"#cf6a6a":C.sub;
          const tIcon=d.trend==="up"?"↑":d.trend==="down"?"↓":"→";
          return (
            <div key={brand} onClick={()=>setSel(isSel?null:brand)} style={{background:isSel?"#131a10":C.card,border:"1px solid "+(isSel?C.bGold:C.border),padding:"14px 16px",cursor:"pointer",transition:"all 0.15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:600,color:C.text}}>{brand}</span>
                <span style={{fontSize:11,fontWeight:700,color:tColor}}>{tIcon} {d.trend.toUpperCase()}</span>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}}>
                <span style={{fontSize:20,fontWeight:700,color:C.gold}}>{d.low}–{d.high}x</span>
                <span style={{fontSize:9,color:C.dim}}>EARNINGS</span>
              </div>
              <div style={{height:3,background:C.border,borderRadius:2,marginBottom:isSel?12:0}}>
                <div style={{height:"100%",width:((d.high/14)*100)+"%",background:"linear-gradient(90deg,"+C.goldDim+","+C.gold+")",borderRadius:2}}/>
              </div>
              {isSel&&<div style={{fontSize:10,color:C.sub,lineHeight:1.6,borderLeft:"2px solid "+C.bGold,paddingLeft:10,marginTop:8}}>{d.note}</div>}
            </div>
          );
        })}
      </div>
      <div style={{marginTop:14,background:C.card,border:"1px solid "+C.border,padding:"14px 16px"}}>
        <div style={{fontSize:8,fontWeight:700,color:C.dim,letterSpacing:"0.12em",marginBottom:6}}>SOURCE METHODOLOGY</div>
        <div style={{fontSize:10,color:C.sub,lineHeight:1.7}}>Blue Sky multiples sourced from Kerrigan Advisors Blue Sky Report, Haig Partners Quarterly, and Presidio Group transaction data. Ranges reflect Q4 2025 — Q1 2026 closed transactions. Click any franchise for analyst notes.</div>
      </div>
    </div>
  );
}

function AskAI() {
  const [q,setQ]=useState("");
  const [ans,setAns]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const ask=async(query)=>{
    const text=query||q;
    if(!text.trim())return;
    setQ(text);setLoading(true);setAns("");setErr("");
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system:"You are BlueSkyIntel senior M&A analyst. Specialize in automotive retail acquisitions, Blue Sky valuations (Kerrigan, Haig, Presidio methodologies), OEM franchise rules, dealership P&L, deal structuring, and regional market trends. Respond with depth and confidence of a $300/hr advisor. Use specific numbers, name real groups and advisors. Be direct and actionable. Never hedge unnecessarily.",messages:[{role:"user",content:text}],max_tokens:900})});
      const data=await res.json();
      if(data.content?.[0]?.text)setAns(data.content[0].text);
      else if(data.error)setErr("Error: "+(data.error.message||JSON.stringify(data.error)));
      else setErr("Unexpected response.");
    }catch(e){setErr("Network error: "+e.message);}
    setLoading(false);
  };
  const prompts=["What is the Blue Sky range for a Toyota store in Florida right now?","Which regions are seeing the most consolidation pressure in 2026?","Walk me through key due diligence items on a $50M acquisition","How is rising floor plan interest affecting valuations this cycle?","What are PE firms paying vs. strategic buyers right now?","Which OEM franchises should I avoid in 2026 and why?"];
  return (
    <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {prompts.map(p=>(<button key={p} onClick={()=>ask(p)} style={{fontSize:10,color:C.sub,background:C.surface,border:"1px solid "+C.border,padding:"7px 13px",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.bGold;e.currentTarget.style.color=C.gold;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub;}}>{p}</button>))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Ask anything — Blue Sky multiples, deal structure, market trends, due diligence..." style={{flex:1,background:C.surface,border:"1px solid "+C.border,color:C.text,padding:"13px 16px",fontSize:12,outline:"none",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=C.bGold} onBlur={e=>e.target.style.borderColor=C.border}/>
        <button onClick={()=>ask()} disabled={loading} style={{background:loading?C.goldDim:C.gold,border:"none",color:"#000",padding:"13px 24px",fontSize:10,fontWeight:800,letterSpacing:"0.12em",cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",fontFamily:"inherit"}}>{loading?"ANALYZING...":"ASK AI"}</button>
      </div>
      {err&&<div style={{background:"#1a0a0a",border:"1px solid #5a2020",padding:"13px 16px",fontSize:11,color:"#cf7a7a",marginBottom:12}}>{err}</div>}
      {ans&&(<div style={{background:C.surface,border:"1px solid "+C.bGold,padding:"22px 26px"}}><div style={{fontSize:8,fontWeight:700,color:C.gold,letterSpacing:"0.16em",marginBottom:14}}>AI ANALYST RESPONSE</div><div style={{fontSize:12,color:C.text,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{ans}</div></div>)}
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("feed");
  const [pro,setPro]=useState(false);
  const [filter,setFilter]=useState(null);
  const [expanded,setExpanded]=useState(null);
  const deals=filter?DEALS.filter(d=>d.region===filter||d.states.includes(filter)):DEALS;
  const Div=()=>(<div style={{height:1,background:"linear-gradient(90deg,"+C.bGold+",transparent)",margin:"0 0 24px"}}/>);
  const SH=({title,sub})=>(<div style={{marginBottom:24}}><h1 style={{margin:"0 0 4px",fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.03em"}}>{title}</h1><p style={{margin:"0 0 20px",fontSize:11,color:C.sub}}>{sub}</p><Div/></div>);
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif"}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:C.surface,borderBottom:"1px solid "+C.border}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"0 28px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:54}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:8,height:8,background:C.gold,borderRadius:"50%",boxShadow:"0 0 10px "+C.gold}}/>
              <span style={{fontSize:16,fontWeight:700,letterSpacing:"-0.025em",color:C.text}}>BlueSky<span style={{color:C.gold}}>Intel</span></span>
              <span style={{fontSize:8,color:C.dim,letterSpacing:"0.16em"}}>M&A INTELLIGENCE</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:8,color:C.up,letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,background:C.up,borderRadius:"50%",display:"inline-block"}}/>LIVE · Apr 2026</div>
              <span style={{fontSize:8,color:C.dim,border:"1px solid "+C.border,padding:"4px 10px"}}>FREE PLAN</span>
              <button onClick={()=>setPro(true)} style={{background:C.gold,border:"none",color:"#000",padding:"8px 18px",fontSize:9,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase",fontFamily:"inherit"}}>UPGRADE PRO</button>
            </div>
          </div>
          <div style={{display:"flex",gap:0,marginBottom:"-1px"}}>
            {NAV.map(n=>(<button key={n.id} onClick={()=>setTab(n.id)} style={{fontSize:10,padding:"10px 18px",border:"none",fontFamily:"inherit",borderBottom:"2px solid "+(tab===n.id?C.gold:"transparent"),background:"transparent",color:tab===n.id?C.gold:C.sub,fontWeight:tab===n.id?700:400,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.15s"}}>{n.label}</button>))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"36px 28px 100px"}}>
        {tab==="feed"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:28}}>{[{l:"2026 YTD Volume",v:"$4.1B",s:"Through Mar 2026"},{l:"Active Deals",v:"131",s:"In market now"},{l:"Avg Blue Sky",v:"6.4x",s:"All franchises"},{l:"PE Share",v:"18%",s:"Of all buyers"},{l:"Hot Region",v:"Southeast",s:"42 YTD deals"},{l:"Top Franchise",v:"Lexus",s:"9–13x earnings"}].map(s=>(<div key={s.l} style={{background:C.card,border:"1px solid "+C.border,padding:"14px 16px"}}><div style={{fontSize:8,color:C.dim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{s.l}</div><div style={{fontSize:18,fontWeight:700,color:C.gold,marginBottom:2}}>{s.v}</div><div style={{fontSize:9,color:C.dim}}>{s.s}</div></div>))}</div>)}
        {tab==="feed"&&(<div><SH title="Live Deal Feed" sub={"Real-time M&A intelligence · "+deals.length+" deals"+(filter?" · Filtered: "+filter:"")}/><div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24}}><div>{filter&&<button onClick={()=>setFilter(null)} style={{marginBottom:12,fontSize:9,color:C.gold,background:"transparent",border:"1px solid "+C.bGold,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>CLEAR FILTER: {filter} ×</button>}{deals.map((d,i)=>(<DealCard key={d.id} deal={d} idx={i} expanded={expanded===d.id} onToggle={()=>setExpanded(expanded===d.id?null:d.id)}/>))}</div><div><div style={{fontSize:8,fontWeight:700,color:C.dim,letterSpacing:"0.14em",marginBottom:10}}>MARKET PULSE</div>{[{l:"Deals This Month",v:"8",c:C.gold},{l:"Avg Deal Size",v:"$62M",c:C.gold},{l:"Hot Markets",v:"FL · TX · GA",c:C.upLt},{l:"Top Franchise",v:"Lexus / Toyota",c:C.gold},{l:"PE Activity",v:"↑ Surging",c:C.upLt},{l:"Sentiment",v:"Bullish",c:C.upLt}].map(s=>(<div key={s.l} style={{background:C.card,border:"1px solid "+C.border,padding:"12px 14px",marginBottom:5}}><div style={{fontSize:8,color:C.dim,letterSpacing:"0.1em",marginBottom:3}}>{s.l}</div><div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div></div>))}<div style={{background:"#0e1a10",border:"1px solid "+C.bGold,padding:"14px",marginTop:8}}><div style={{fontSize:8,color:C.gold,letterSpacing:"0.12em",fontWeight:700,marginBottom:6}}>BROKER SIGNAL</div><div style={{fontSize:10,color:C.sub,lineHeight:1.6}}>Southeast and Southwest markets seeing compressed timelines — quality stores moving in under 90 days. PE buyers bidding 0.5–1.0x above historical norms.</div></div></div></div></div>)}
        {tab==="map"&&(<div><SH title="Market Intelligence Map" sub="Click a region to filter deal feed · Gold = high activity"/><TopoMap onRegionClick={(reg)=>{setFilter(reg);setTab("feed");}}/><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginTop:16}}>{Object.entries(REGIONS).map(([reg,d])=>(<div key={reg} onClick={()=>{setFilter(reg);setTab("feed");}} style={{background:C.card,border:"1px solid "+(d.hot?C.bGold:C.border),padding:"14px",cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bGold} onMouseLeave={e=>e.currentTarget.style.borderColor=d.hot?C.bGold:C.border}><div style={{fontSize:9,fontWeight:700,color:d.hot?C.gold:C.sub,letterSpacing:"0.1em",marginBottom:4}}>{reg.toUpperCase()}</div><div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:2}}>{d.deals}</div><div style={{fontSize:8,color:C.dim,marginBottom:6}}>YTD deals</div><div style={{fontSize:11,fontWeight:600,color:C.gold}}>{d.avgMultiple}x avg</div></div>))}</div></div>)}
        {tab==="blusky"&&(<div><SH title="Blue Sky Index" sub="Current franchise valuations · Q4 2025 – Q1 2026 · Source: Kerrigan, Haig, Presidio"/><BlueSkyIndex/></div>)}
        {tab==="groups"&&(<div><SH title="Dealer Group Intelligence" sub="Track acquisition velocity, strategy, and group profiles"/>{GROUPS.map(g=>(<div key={g.name} style={{background:C.card,border:"1px solid "+C.border,padding:"20px 22px",marginBottom:6,display:"flex",alignItems:"center",gap:20,transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bGold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{width:36,height:36,background:C.surface,border:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12,fontWeight:700,color:C.gold}}>{g.name.charAt(0)}</span></div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:3}}>{g.name}</div><div style={{fontSize:10,color:C.sub}}>{g.hq} · {g.stores} rooftops · {g.revenue} revenue · {g.focus}</div></div><div style={{display:"flex",gap:16,alignItems:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:g.trend==="up"?C.upLt:g.trend==="down"?"#cf6a6a":C.sub}}>{g.trend==="up"?"↑":g.trend==="down"?"↓":"→"}</div><div style={{fontSize:8,color:C.dim}}>TREND</div></div><div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:C.gold}}>{g.ytdDeals}</div><div style={{fontSize:8,color:C.dim}}>DEALS YTD</div></div><div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:g.score>=90?C.upLt:g.score>=80?C.gold:C.sub}}>{g.score}</div><div style={{fontSize:8,color:C.dim}}>SCORE</div></div></div></div>))}</div>)}
        {tab==="history"&&(<div><SH title="Market History" sub="Annual M&A transaction data · 2020–2025"/><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:24}}>{HISTORY.map(h=>(<div key={h.year} style={{background:h.year===2022?"#0e1a10":C.card,border:"1px solid "+(h.year===2022?C.bGold:C.border),padding:"18px 16px"}}><div style={{fontSize:9,color:C.dim,marginBottom:6}}>{h.year}</div><div style={{fontSize:22,fontWeight:700,color:h.year===2022?C.gold:C.text,marginBottom:3}}>{h.volume}</div><div style={{fontSize:10,color:C.sub,marginBottom:2}}>{h.deals} transactions</div><div style={{fontSize:10,color:C.gold,marginBottom:8}}>{h.avgSize} avg</div><div style={{fontSize:9,color:C.dim,lineHeight:1.5}}>{h.note}</div></div>))}</div><div style={{background:C.card,border:"1px solid "+C.border,padding:"20px 22px"}}><div style={{fontSize:9,fontWeight:700,color:C.dim,letterSpacing:"0.14em",marginBottom:10}}>5-YEAR VOLUME TREND</div><div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>{HISTORY.map(h=>{const val=parseFloat(h.volume.replace(/[^0-9.]/g,""));const pct=(val/16.1)*100;return(<div key={h.year} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{width:"100%",height:pct+"%",background:h.year===2022?"linear-gradient(180deg,"+C.gold+","+C.goldDim+")":"linear-gradient(180deg,"+C.bGold+",#2a1a08)",minHeight:4}}/><div style={{fontSize:8,color:h.year===2022?C.gold:C.dim}}>{h.year}</div></div>);})}</div></div></div>)}
        {tab==="ai"&&(<div><SH title="AI Deal Analyst" sub="Powered by Claude · Ask anything about automotive M&A, valuations, and market strategy"/><AskAI/></div>)}
      </div>
      {pro&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(16px)"}} onClick={()=>setPro(false)}><div style={{background:C.card,border:"1px solid "+C.bGold,padding:"36px",maxWidth:460,width:"90%",position:"relative"}} onClick={e=>e.stopPropagation()}><div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+C.gold+",transparent)"}}/><div style={{fontSize:9,color:C.gold,letterSpacing:"0.18em",marginBottom:8}}>BLUESKYINTEL PRO</div><div style={{fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.025em",marginBottom:4}}>The platform serious<br/>brokers keep open all day.</div><div style={{fontSize:11,color:C.sub,marginBottom:24}}>Everything in Free, plus the intelligence that closes deals.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>{["Real-time deal alerts by state & brand","Pre-market & dark deal signals","Full Blue Sky calculator + AI notes","Dealer group intelligence briefs","Regional AI market reports","CRM deal pipeline tracker","Buyer/seller matching engine","Historical pattern recognition","Custom watchlists & tracking","Priority AI analyst access"].map(f=>(<div key={f} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:C.gold,fontSize:10,fontWeight:700,flexShrink:0}}>✓</span><span style={{fontSize:10,color:C.sub,lineHeight:1.4}}>{f}</span></div>))}</div><div style={{borderTop:"1px solid "+C.border,paddingTop:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><div style={{fontSize:28,fontWeight:700,color:C.gold}}>$299<span style={{fontSize:14,fontWeight:400,color:C.sub}}>/mo</span></div><div style={{fontSize:9,color:C.dim,marginTop:2}}>CANCEL ANYTIME</div></div><button onClick={()=>setPro(false)} style={{background:C.gold,border:"none",color:"#000",padding:"14px 28px",fontSize:10,fontWeight:800,letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase",fontFamily:"inherit"}}>GET PRO ACCESS</button></div></div></div>)}
    </div>
  );
  }
