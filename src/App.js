import { useState, useRef } from "react";

const MODEL = "claude-sonnet-4-20250514";
const BLUE_SKY = {
  "Toyota":    { low:8.0,  high:12.0, trend:"up",    note:"Record demand; 10x+ in FL/TX" },
  "Lexus":     { low:9.0,  high:13.0, trend:"up",    note:"Scarce supply driving premiums" },
  "Honda":     { low:5.5,  high:8.0,  trend:"up",    note:"Low-end raised Q4 2025 by Kerrigan" },
  "BMW":       { low:6.0,  high:9.0,  trend:"up",    note:"Multiple increased Q4 2025" },
  "Mercedes":  { low:5.5,  high:8.5,  trend:"stable",note:"Solid luxury market" },
  "Audi":      { low:5.0,  high:8.0,  trend:"up",    note:"Q4 2025 increase per Kerrigan" },
  "Porsche":   { low:8.0,  high:11.0, trend:"down",  note:"Low end cut Q3 2025; EV delays" },
  "Ford":      { low:3.0,  high:5.0,  trend:"up",    note:"US mfg bill boosted sentiment" },
  "Chevrolet": { low:3.0,  high:4.75, trend:"up",    note:"High-end raised Q4 2025" },
  "Subaru":    { low:4.0,  high:6.5,  trend:"down",  note:"Sales -5.8% YoY Q3 2025" },
  "Kia":       { low:4.5,  high:5.5,  trend:"stable",note:"Consistent demand" },
  "Nissan":    { low:1.5,  high:3.0,  trend:"down",  note:"Below pre-pandemic levels" },
  "Cadillac":  { low:3.5,  high:5.5,  trend:"up",    note:"Multiple raised Q4 2025" },
  "Jeep/Ram":  { low:2.5,  high:4.5,  trend:"stable",note:"Carvana buying Stellantis stores" },
};

const DEALS = [
  { id:1, title:"Asbury acquires Herb Chambers Companies", state:"MA", region:"Northeast", brand:"Multi (52 franchises)", type:"Closed", date:"Jul 2025", size:"$1.45B", source:"Business Wire", signal:"confirmed", stores:33, detail:"3rd largest deal in auto retail history. 33 dealerships, 52 franchises, 3 collision centers across New England." },
  { id:2, title:"Group 1 acquires 3 luxury stores FL & TX", state:"FL/TX", region:"Southeast", brand:"Lexus, Acura, Mercedes", type:"Closed", date:"May 2025", size:"$330M rev", source:"SEC 8-K", signal:"confirmed", stores:3, detail:"Fort Myers FL Lexus & Acura + TX Mercedes-Benz. Cluster strategy." },
  { id:3, title:"ZT Automotive acquires 4 Tampa Bay stores", state:"FL", region:"Southeast", brand:"Multi-brand", type:"Closed", date:"Dec 2025", size:"Undisclosed", source:"Auto Remarketing", signal:"confirmed", stores:4, detail:"Part of Q4 2025 end-of-year M&A flurry." },
  { id:4, title:"Hudson Automotive acquires All Star Automotive", state:"Multi", region:"Southeast", brand:"Multi-brand", type:"Closed", date:"Q4 2025", size:"2nd largest 2025", source:"Kerrigan Advisors", signal:"confirmed", stores:null, detail:"Second largest transaction in 2025 per Kerrigan Advisors." },
  { id:5, title:"Lithia acquires Mercedes-Benz of Medford", state:"OR", region:"Pacific", brand:"Mercedes-Benz", type:"Closed", date:"Feb 2026", size:"Incl. real estate", source:"Presidio Group", signal:"confirmed", stores:1, detail:"Advised by The Presidio Group. Real estate included." },
  { id:6, title:"Asbury sells 6 St. Louis luxury stores to MileOne", state:"MO", region:"Midwest", brand:"Multi luxury", type:"Closed", date:"Feb 2026", size:"Undisclosed", source:"Presidio Group", signal:"confirmed", stores:6, detail:"Portfolio management post-Herb Chambers acquisition." },
  { id:7, title:"Carvana acquiring Stellantis franchise stores", state:"AZ/CA/TX", region:"Southwest", brand:"Jeep/Ram/Chrysler", type:"Ongoing", date:"2024-2026", size:"Undisclosed", source:"ION Analytics", signal:"pre-market", stores:5, detail:"Online used-car giant entering new-car market. Watch for brand expansion." },
  { id:8, title:"PE & family office dealership entries accelerating", state:"Multi", region:"Multi", brand:"Multi-brand", type:"Ongoing", date:"2026", size:"Multiple", source:"WardsAuto", signal:"pre-market", stores:null, detail:"New capital entering buy-sell. Low rates fueling PE/family office dealership acquisitions." },
];

const HISTORY = [
  { era:"1990s Consolidation", years:"1996-2000", mult:"1-3x", summary:"Public auto retail born. AutoNation, CarMax go public. Industry consolidates from ~50k to ~22k franchised points.", lesson:"Brand mix and geography determined survivors, not just scale." },
  { era:"2008 Financial Crisis", years:"2007-2010", mult:"0-1.5x", summary:"SAAR collapses to 10.4M. GM and Chrysler file bankruptcy. 2,000+ points eliminated. Import dealers outperform domestic 2:1.", lesson:"Fixed ops absorption ratio became the defining survival metric." },
  { era:"Post-Crisis Recovery", years:"2011-2019", mult:"3-6x", summary:"SAAR recovers to 17M. Lithia, Penske, Asbury accelerate acquisitions. Top 150 groups grow from 15% to 30% of franchised points.", lesson:"Lithia hub-and-spoke regional clustering proved most scalable model." },
  { era:"COVID Boom", years:"2020-2022", mult:"Peak 8-15x", summary:"Chip shortage creates scarcity. Avg dealer pre-tax hits $4M+ (4x pre-COVID). Toyota/Lexus reach 10-12x. 2021 sets record buy-sell volume.", lesson:"Valuation gap between buyers/sellers created temporary pause resolved by 2023." },
  { era:"Normalization + EV", years:"2023-2025", mult:"4-12x K-shaped", summary:"Profits normalize but remain elevated ($4.1M avg 2024). EV mandates create brand divergence. 2025 sets new record. Public groups deploy $4.4B.", lesson:"Brand selection now matters more than geography." },
  { era:"2026 Banner Year", years:"2026+", mult:"8-13x Toyota/Lexus", summary:"Pipeline at record levels. Private buyers 90%+ of deals. PE and family offices accelerating. Single-points are prime targets. Sun Belt dominates.", lesson:"Five rooftops will be 15 in 8 years. Buy now before premiums compound." },
];

const sigClr = s => ({ confirmed:"#10b981","pre-market":"#f59e0b" }[s]||"#64748b");
const sigLbl = s => ({ confirmed:"Confirmed","pre-market":"Pre-Market Signal" }[s]||s);
const trendA = t => t==="up"?"▲":t==="down"?"▼":"—";
const trendC = t => t==="up"?"#10b981":t==="down"?"#ef4444":"#64748b";
const fmt = v => "$"+Math.round(v).toLocaleString();

const callClaude = async (sys, msg, hist=[]) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:MODEL, max_tokens:1000, system:sys, messages:[...hist,{role:"user",content:msg}] })
  });
  const d = await r.json();
  return d.content?.map(c=>c.text||"").join("")||"No response.";
};

const card = { background:"#1e293b", border:"1px solid #334155", borderRadius:12, padding:"14px 16px" };
const proBtn = { fontSize:13, padding:"7px 18px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" };
const btn = a => ({ fontSize:12, padding:"4px 12px", background:a?"#3b82f6":"transparent", color:a?"#fff":"#94a3b8", border:"1px solid "+(a?"#3b82f6":"#475569"), borderRadius:8, cursor:"pointer" });

function AIChat({ sys, placeholder }) {
  const [msgs,setMsgs] = useState([]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const endRef = useRef(null);
  const send = async () => {
    if (!input.trim()||loading) return;
    const txt = input.trim(); setInput(""); setLoading(true);
    setMsgs(m => [...m,{role:"user",content:txt}]);
    try {
      const r = await callClaude(sys, txt, msgs.map(m=>({role:m.role,content:m.content})));
      setMsgs(m => [...m,{role:"assistant",content:r}]);
    } catch { setMsgs(m => [...m,{role:"assistant",content:"Error. Try again."}]); }
    setLoading(false);
    endRef.current?.scrollIntoView({behavior:"smooth"});
  };
  return (
    <div style={{...card,marginTop:16}}>
      <div style={{fontSize:11,color:"#64748b",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:"#10b981",display:"inline-block"}}/>AI Market Analyst
      </div>
      <div style={{minHeight:60,maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,marginBottom:10}}>
        {msgs.length===0 && <p style={{fontSize:13,color:"#475569"}}>{placeholder}</p>}
        {msgs.map((m,i) => (
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"88%"}}>
            <div style={{background:m.role==="user"?"#1d4ed8":"#0f172a",color:"#f1f5f9",padding:"8px 12px",borderRadius:10,fontSize:13,lineHeight:1.55,whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{background:"#0f172a",padding:"8px 12px",borderRadius:10,fontSize:13,color:"#64748b",alignSelf:"flex-start"}}>Analyzing...</div>}
        <div ref={endRef}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything..." style={{flex:1,fontSize:13}}/>
        <button onClick={send} style={proBtn}>Send</button>
      </div>
    </div>
  );
}

function DealFeed() {
  const [region,setRegion] = useState("All");
  const [expanded,setExpanded] = useState(null);
  const regions = ["All","Northeast","Southeast","Midwest","Southwest","Pacific"];
  const filtered = DEALS.filter(d => region==="All" || d.region.includes(region));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:16}}>
        {[["2025 Record","Record vol.","Buy-sell market"],["Public Capital","$4.4B","~80 franchises"],["Private Share","90%+","Non-public buyers"],["Avg Pre-Tax","$4.1M","Per store 2024"],["Blue Sky Index","+76%","vs pre-pandemic"],["Top Region","Southeast","Most active"]].map(([l,v,s])=>(
          <div key={l} style={{background:"#0f172a",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"#64748b",marginBottom:3}}>{l}</div>
            <div style={{fontSize:18,fontWeight:600}}>{v}</div>
            <div style={{fontSize:11,color:"#475569",marginTop:2}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {regions.map(r=><button key={r} onClick={()=>setRegion(r)} style={btn(region===r)}>{r}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(d=>(
          <div key={d.id} style={{...card,cursor:"pointer"}} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
            <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:6,background:sigClr(d.signal)+"33",color:sigClr(d.signal)}}>{sigLbl(d.signal)}</span>
                  <span style={{fontSize:11,color:"#475569"}}>{d.source} · {d.date}</span>
                </div>
                <p style={{margin:"0 0 4px",fontWeight:500,fontSize:15}}>{d.title}</p>
                <p style={{margin:0,fontSize:12,color:"#64748b"}}>{d.brand} · {d.region}</p>
                {expanded===d.id && <p style={{margin:"10px 0 0",fontSize:13,lineHeight:1.65,color:"#94a3b8",borderTop:"1px solid #334155",paddingTop:10}}>{d.detail}</p>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:17,fontWeight:600}}>{d.size}</div>
                {d.stores && <div style={{fontSize:11,color:"#475569"}}>{d.stores} stores</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <AIChat sys="You are a senior automotive M&A analyst. Real 2025-2026 data: Asbury-Herb Chambers $1.45B, Group 1 FL/TX luxury, Lithia Medford MB, Hudson All Star, Carvana entering new-car, 2025 record buy-sell, Toyota/Lexus 8-13x, Honda 5.5-8x, private buyers 90%+, Southeast leads. History: 1990s rollup, 2008 crisis 10.4M SAAR, COVID boom 15x peak, normalization 2023-25." placeholder="Ask about recent deals, valuations, or what buyers are targeting in 2026..."/>
    </div>
  );
}

function BlueSkyCalc() {
  const [sel,setSel] = useState(null);
  const [inp,setInp] = useState({brand:"Toyota",pretax:1500000,region:"Southeast"});
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);
  const maxH = Math.max(...Object.values(BLUE_SKY).map(v=>v.high));
  const sorted = [...Object.entries(BLUE_SKY)].sort((a,b)=>b[1].high-a[1].high);
  const calc = async () => {
    setLoading(true); setResult(null);
    const bs = BLUE_SKY[inp.brand];
    const low = Math.round(inp.pretax*bs.low);
    const mid = Math.round(inp.pretax*((bs.low+bs.high)/2));
    const high = Math.round(inp.pretax*bs.high);
    try {
      const c = await callClaude("You are a dealership valuation expert. Give a 2-sentence broker-focused commentary. Be specific, no bullets.","Brand: "+inp.brand+" ("+bs.low+"-"+bs.high+"x). Pre-tax: $"+inp.pretax.toLocaleString()+". Region: "+inp.region+". Range: "+fmt(low)+"-"+fmt(high)+".");
      setResult({low,mid,high,c,ml:bs.low,mh:bs.high});
    } catch { setResult({low,mid,high,c:"Based on current Haig/Kerrigan data.",ml:bs.low,mh:bs.high}); }
    setLoading(false);
  };
  return (
    <div>
      <p style={{fontSize:12,color:"#475569",marginBottom:14}}>Source: Haig Partners Q4 2025 · Kerrigan Advisors Q4 2025</p>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {sorted.map(([brand,data])=>(
          <div key={brand} onClick={()=>setSel(sel===brand?null:brand)} style={{...card,cursor:"pointer",borderColor:sel===brand?"#3b82f6":"#334155"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:500,fontSize:14,minWidth:90}}>{brand}</span>
                <span style={{color:trendC(data.trend),fontSize:13}}>{trendA(data.trend)}</span>
              </div>
              <span style={{fontWeight:600,fontSize:14}}>{data.low}-{data.high}x</span>
            </div>
            <div style={{position:"relative",height:6,background:"#0f172a",borderRadius:3,overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:(data.high/maxH*100)+"%",background:"#1e40af",borderRadius:3}}/>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:(data.low/maxH*100)+"%",background:"#3b82f6",borderRadius:3}}/>
            </div>
            {sel===brand && <p style={{margin:"8px 0 0",fontSize:12,color:"#94a3b8"}}>{data.note}</p>}
          </div>
        ))}
      </div>
      <div style={card}>
        <p style={{margin:"0 0 12px",fontWeight:500,fontSize:15}}>Blue Sky Calculator</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginBottom:12}}>
          <div><label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Franchise</label>
            <select value={inp.brand} onChange={e=>setInp(p=>({...p,brand:e.target.value}))} style={{width:"100%"}}>{Object.keys(BLUE_SKY).map(b=><option key={b}>{b}</option>)}</select></div>
          <div><label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Pre-tax Earnings</label>
            <input type="number" value={inp.pretax} onChange={e=>setInp(p=>({...p,pretax:+e.target.value}))} style={{width:"100%"}}/></div>
          <div><label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Region</label>
            <select value={inp.region} onChange={e=>setInp(p=>({...p,region:e.target.value}))} style={{width:"100%"}}>
              {["Northeast","Southeast","Midwest","Southwest","Mountain","Pacific"].map(r=><option key={r}>{r}</option>)}</select></div>
        </div>
        <button onClick={calc} style={{...proBtn,marginBottom:12}}>Calculate Blue Sky</button>
        {loading && <p style={{fontSize:13,color:"#475569"}}>Running model...</p>}
        {result && !loading && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
              {[["Conservative",result.low],["Market Mid",result.mid],["Optimistic",result.high]].map(([l,v])=>(
                <div key={l} style={{background:"#0f172a",borderRadius:8,padding:12,textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#475569",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:17,fontWeight:600}}>{fmt(v)}</div>
                </div>
              ))}
            </div>
            <p style={{margin:"0 0 6px",fontSize:12,color:"#475569"}}>{result.ml}-{result.mh}x pre-tax earnings</p>
            <p style={{margin:0,fontSize:13,lineHeight:1.6}}>{result.c}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketHistory() {
  const [sel,setSel] = useState(0);
  const [analysis,setAnalysis] = useState("");
  const [loading,setLoading] = useState(false);
  const era = HISTORY[sel];
  const run = async () => {
    setLoading(true); setAnalysis("");
    try {
      const t = await callClaude("You are a veteran automotive M&A advisor with 30+ years. Draw direct parallels between historical eras and today 2026. Be specific and broker-focused.",
        "Analyze "+era.era+" ("+era.years+") and connect to 2026 market. What patterns are repeating? What should brokers do?");
      setAnalysis(t);
    } catch { setAnalysis("Analysis unavailable."); }
    setLoading(false);
  };
  return (
    <div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {HISTORY.map((h,i)=><button key={i} onClick={()=>{setSel(i);setAnalysis("");}} style={btn(sel===i)}>{h.years}</button>)}
      </div>
      <div style={{...card,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
          <div><p style={{margin:0,fontWeight:500,fontSize:15}}>{era.era}</p><p style={{margin:0,fontSize:12,color:"#475569"}}>{era.years}</p></div>
          <span style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:6,background:"#1e40af",color:"#93c5fd"}}>Blue Sky: {era.mult}</span>
        </div>
        <p style={{margin:"0 0 10px",fontSize:13,lineHeight:1.7}}>{era.summary}</p>
        <div style={{borderTop:"1px solid #334155",paddingTop:10}}>
          <p style={{margin:0,fontSize:13,color:"#64748b"}}>Broker lesson: <span style={{color:"#f1f5f9",fontWeight:500}}>{era.lesson}</span></p>
        </div>
      </div>
      <button onClick={run} style={{...proBtn,marginBottom:14}}>AI: How does this apply to 2026?</button>
      {(loading||analysis) && (
        <div style={card}>
          {loading ? <p style={{fontSize:13,color:"#475569"}}>Analyzing patterns...</p> : <p style={{fontSize:13,lineHeight:1.72,whiteSpace:"pre-wrap"}}>{analysis}</p>}
        </div>
      )}
    </div>
  );
}

function MarketAnalysis() {
  const [region,setRegion] = useState("Southeast");
  const [report,setReport] = useState("");
  const [loading,setLoading] = useState(false);
  const generate = async () => {
    setLoading(true); setReport("");
    try {
      const t = await callClaude("You are a senior automotive M&A analyst. Real 2025-2026 data: record buy-sell, $4.4B public capital, Toyota/Lexus 8-13x, Honda 5.5-8x, Asbury-Herb Chambers $1.45B, private buyers 90%+, Southeast leads, PE/family offices accelerating, Carvana entering new-car.",
        "Generate a detailed M&A intelligence report for "+region+" Q2 2026. Include: current deal activity, active buyers, Blue Sky multiples, pre-market signals, 3 specific broker opportunities.");
      setReport(t);
    } catch { setReport("Report unavailable."); }
    setLoading(false);
  };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:16}}>
        {[["2025 Volume","Record","Buy-sell market"],["Public Capital","$4.4B","80 franchises"],["Toyota/Lexus","8-13x","Blue Sky"],["Avg Pre-Tax","$4.1M","Per store 2024"],["Kerrigan Index","+76%","vs pre-pandemic"],["Top Buyer","Private","90%+ of deals"]].map(([l,v,s])=>(
          <div key={l} style={{background:"#0f172a",borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"#64748b",marginBottom:3}}>{l}</div>
            <div style={{fontSize:18,fontWeight:600}}>{v}</div>
            <div style={{fontSize:11,color:"#475569",marginTop:2}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {["Northeast","Southeast","Midwest","Southwest","Mountain","Pacific","Florida","Texas"].map(r=><button key={r} onClick={()=>setRegion(r)} style={btn(region===r)}>{r}</button>)}
      </div>
      <button onClick={generate} style={{...proBtn,marginBottom:14}}>Generate {region} Report</button>
      {(loading||report) && (
        <div style={{...card,marginBottom:14}}>
          <p style={{margin:"0 0 10px",fontWeight:500,fontSize:14}}>{region} — Q2 2026 Intelligence Report</p>
          {loading ? <p style={{fontSize:13,color:"#475569"}}>Generating...</p> : <p style={{fontSize:13,lineHeight:1.72,whiteSpace:"pre-wrap"}}>{report}</p>}
        </div>
      )}
      <AIChat sys={"Senior automotive M&A analyst. 2025-2026: record buy-sell, $4.4B public capital, Toyota/Lexus 8-13x, Honda 5.5-8x raised Q4 2025, private buyers 90%+, Southeast leads, Asbury-Herb Chambers $1.45B, Carvana new-car. Current focus: "+region} placeholder={"Ask about "+region+" deal flow, buyers, or market timing..."}/>
    </div>
  );
}

function Newsletter() {
  const [form,setForm] = useState({name:"",email:"",states:[],brands:[],tier:"free"});
  const [done,setDone] = useState(false);
  const toggle = (arr,v) => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v];
  const STATES = ["AL","AZ","CA","CO","FL","GA","IL","MD","MI","MN","MO","NC","NJ","NV","NY","OH","OR","PA","TN","TX","VA","WA"];
  if (done) return (
    <div style={{textAlign:"center",padding:"48px 20px"}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:20,color:"#10b981"}}>✓</div>
      <p style={{fontWeight:500,fontSize:17,margin:"0 0 8px"}}>You're subscribed</p>
      <p style={{fontSize:13,color:"#64748b"}}>{form.tier==="pro"?"Pro: Daily alerts + pre-market signals":"Free: Weekly digest"}</p>
    </div>
  );
  return (
    <div style={{maxWidth:560}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" style={{width:"100%"}}/></div>
        <div><label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4}}>Email</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@brokerage.com" style={{width:"100%"}}/></div>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:6}}>States to monitor</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {STATES.map(st=><button key={st} onClick={()=>setForm(p=>({...p,states:toggle(p.states,st)}))} style={btn(form.states.includes(st))}>{st}</button>)}
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:6}}>Plan</label>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[["free","Free - Weekly digest"],["pro","Pro - Daily alerts + pre-market signals"]].map(([v,l])=>(
            <button key={v} onClick={()=>setForm(p=>({...p,tier:v}))} style={btn(form.tier===v)}>{l}</button>
          ))}
        </div>
      </div>
      <button onClick={()=>setDone(true)} style={proBtn}>Subscribe</button>
    </div>
  );
}

const NAV = [{id:"feed",label:"Deal Feed"},{id:"blue-sky",label:"Blue Sky"},{id:"analysis",label:"Market Analysis"},{id:"history",label:"Market History"},{id:"newsletter",label:"Alerts"}];
const SECTIONS = {feed:DealFeed,"blue-sky":BlueSkyCalc,analysis:MarketAnalysis,history:MarketHistory,newsletter:Newsletter};
const TITLES = {feed:"Deal Feed","blue-sky":"Blue Sky Multiples",analysis:"Market Analysis",history:"Market History",newsletter:"Alerts & Newsletter"};

export default function App() {
  const [tab,setTab] = useState("feed");
  const [showPro,setShowPro] = useState(false);
  const Section = SECTIONS[tab];
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"0 16px 48px"}}>
      <div style={{borderBottom:"1px solid #1e293b",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0 12px",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontWeight:700,fontSize:20,letterSpacing:"-0.4px"}}>BlueSky Intel</span>
            <span style={{fontSize:11,color:"#475569",padding:"2px 7px",borderRadius:4,border:"1px solid #334155"}}>BETA</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"#1e293b",color:"#64748b",border:"1px solid #334155"}}>Free Plan</span>
            <button onClick={()=>setShowPro(true)} style={proBtn}>Upgrade to Pro</button>
          </div>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{fontSize:13,padding:"8px 14px",border:"none",borderBottom:tab===n.id?"2px solid #3b82f6":"2px solid transparent",borderRadius:0,background:"transparent",color:tab===n.id?"#3b82f6":"#64748b",fontWeight:tab===n.id?600:400,whiteSpace:"nowrap",cursor:"pointer"}}>{n.label}</button>
          ))}
        </div>
      </div>
      {showPro && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={()=>setShowPro(false)}>
          <div style={{...card,maxWidth:420,width:"90%",padding:"28px 32px"}} onClick={e=>e.stopPropagation()}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:18}}>BlueSky Intel Pro</p>
            <p style={{margin:"0 0 18px",fontSize:13,color:"#64748b"}}>$299/month - cancel anytime</p>
            {["Daily deal alerts by state, region & brand","Pre-market & dark deal signals","Full Blue Sky calculator with AI commentary","Regional AI market reports","CRM deal pipeline tracker","Buyer/seller matching AI","Historical pattern recognition","Priority AI analyst access"].map(f=>(
              <div key={f} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
                <span style={{color:"#10b981"}}>✓</span><span style={{fontSize:13}}>{f}</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid #334155",marginTop:18,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:22,fontWeight:700}}>$299<span style={{fontSize:14,fontWeight:400}}>/mo</span></div>
              <button style={proBtn} onClick={()=>setShowPro(false)}>Get Pro Access</button>
            </div>
          </div>
        </div>
      )}
      <p style={{margin:"0 0 16px",fontWeight:600,fontSize:16}}>{TITLES[tab]}</p>
      <Section/>
    </div>
  );
  }
