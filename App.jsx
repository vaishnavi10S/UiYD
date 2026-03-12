import { useState, useEffect } from "react"

const C = {
  bg:         "#000000",
  fg:         "#ffffff",
  accent:     "#a1d9c6",
  secondary:  "#283e36",
  surface:    "#0d0d0d",
  surfaceHigh:"#161616",
  muted:      "#545454",
  border:     "#1f1f1f",
}

const PRODUCTS = [
  {
    id:1, name:"SPECTRE PUFFER", price:349, tag:"NEW DROP", category:"outerwear",
    desc:"Oversized ripstop shell. Baffled construction. Dropped hem.",
    sizes:["XS","S","M","L","XL"],
    img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=640&fit=crop&crop=center",
  },
  {
    id:2, name:"PHANTOM CARGO", price:189, tag:"BESTSELLER", category:"bottoms",
    desc:"Wax-coated cotton. 8 pockets. Articulated knee.",
    sizes:["XS","S","M","L","XL","XXL"],
    img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=640&fit=crop",
  },
  {
    id:3, name:"VOID TEE", price:79, tag:"LIMITED", category:"tops",
    desc:"360gsm heavyweight. Washed black. Embroidered logo.",
    sizes:["S","M","L","XL","XXL"],
    img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=640&fit=crop",
  },
  {
    id:4, name:"DRIP HOODIE", price:159, tag:"CORE", category:"tops",
    desc:"800gsm loopback fleece. Reverse seams. Double hood.",
    sizes:["XS","S","M","L","XL"],
    img:"https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&h=640&fit=crop",
  },
  {
    id:5, name:"BURIAL RUNNER", price:310, tag:"COLLAB", category:"footwear",
    desc:"EVA midsole platform. Mesh upper. Reflective pull tab.",
    sizes:["US 6","US 7","US 8","US 9","US 10","US 11"],
    img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=640&fit=crop",
  },
  {
    id:6, name:"HAZE BUCKET", price:69, tag:"NEW", category:"accessories",
    desc:"Nylon shell. Inner mesh print. Packable brim.",
    sizes:["ONE SIZE"],
    img:"https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=640&fit=crop",
  },
]

const RECS_MAP = {
  male:   { slim:[1,3,5], athletic:[4,2,5], broad:[4,1,6] },
  female: { slim:[3,6,4], athletic:[1,3,5], curvy:[4,2,6] },
  fluid:  { slim:[3,1,6], athletic:[2,4,5], broad:[1,4,3] },
}

function buildRecs(gender, body, currentId) {
  const pool = RECS_MAP[gender]?.[body] || [1,3,4]
  let ids = pool.filter(id => id !== currentId).slice(0,3)
  const extras = PRODUCTS.map(p=>p.id).filter(id=>!ids.includes(id)&&id!==currentId)
  while(ids.length<3) ids.push(extras.shift())
  return PRODUCTS.filter(p=>ids.includes(p.id))
}

const Tag = ({ children, color = C.accent }) => (
  <span style={{
    fontFamily:"'Dela Gothic One',sans-serif",
    fontSize:9,letterSpacing:"0.18em",
    padding:"3px 9px",border:`1px solid ${color}33`,
    color,background:`${color}0d`,borderRadius:1,
    textTransform:"uppercase",display:"inline-block"
  }}>{children}</span>
)

const PriceTag = ({ price }) => (
  <span style={{fontFamily:"'Baskervville',serif",fontSize:20,color:C.fg,fontStyle:"italic"}}>
    ₹{(price*86).toLocaleString()}
  </span>
)

const Logo = ({ size = 22 }) => (
  <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
    <svg width={size+8} height={size+8} viewBox="0 0 32 32" fill="none">
      <rect x="0.5" y="0.5" width="31" height="31" stroke={C.accent} strokeWidth="0.6"/>
      <text x="16" y="23" textAnchor="middle"
        style={{fontFamily:"'Dela Gothic One',sans-serif",fontSize:18,fill:C.accent}}>Y</text>
    </svg>
    <div>
      <div style={{fontFamily:"'Dela Gothic One',sans-serif",fontSize:size,lineHeight:1,letterSpacing:"0.05em",color:C.fg}}>
        YUNGDRIP
      </div>
      <div style={{fontFamily:"'Baskervville',serif",fontSize:8,color:C.muted,letterSpacing:"0.4em",marginTop:1,fontStyle:"italic"}}>
        for those at the fringe
      </div>
    </div>
  </div>
)

export default function App() {
  const [filter,setFilter]             = useState("ALL")
  const [cart,setCart]                 = useState([])
  const [cartOpen,setCartOpen]         = useState(false)
  const [aiOpen,setAiOpen]             = useState(false)
  const [aiProduct,setAiProduct]       = useState(null)
  const [aiStep,setAiStep]             = useState(0)
  const [aiForm,setAiForm]             = useState({gender:"",skin:"",body:"",style:""})
  const [aiRecs,setAiRecs]             = useState([])
  const [hoverId,setHoverId]           = useState(null)
  const [addedId,setAddedId]           = useState(null)
  const [selectedSizes,setSelectedSizes] = useState({})
  const [heroIn,setHeroIn]             = useState(false)
  const [loadPct,setLoadPct]           = useState(0)
  const [navScrolled,setNavScrolled]   = useState(false)
  const [aiMsg,setAiMsg]               = useState("")

  useEffect(()=>{setTimeout(()=>setHeroIn(true),80)},[])
  useEffect(()=>{
    const fn=()=>setNavScrolled(window.scrollY>60)
    window.addEventListener("scroll",fn)
    return()=>window.removeEventListener("scroll",fn)
  },[])

  useEffect(()=>{
    if(aiStep!==1) return
    const msgs=["READING PROFILE...","CROSS-REFERENCING 12K+ LOOKS...","MAPPING TONE PALETTE...","BUILDING YOUR FIT..."]
    let i=0,charI=0
    setAiMsg("")
    const loop=()=>{
      if(i>=msgs.length) return
      if(charI<=msgs[i].length){setAiMsg(msgs[i].slice(0,charI));charI++;setTimeout(loop,38)}
      else{setTimeout(()=>{i++;charI=0;loop()},500)}
    }
    loop()
    let p=0
    const bar=setInterval(()=>{p=Math.min(p+Math.random()*4,95);setLoadPct(Math.floor(p))},60)
    setTimeout(()=>{
      clearInterval(bar);setLoadPct(100)
      setAiRecs(buildRecs(aiForm.gender||"male",aiForm.body||"athletic",aiProduct?.id))
      setTimeout(()=>setAiStep(2),400)
    },3200)
    return()=>clearInterval(bar)
  },[aiStep])

  const cats=["ALL","TOPS","BOTTOMS","OUTERWEAR","FOOTWEAR","ACCESSORIES"]
  const visible=filter==="ALL"?PRODUCTS:PRODUCTS.filter(p=>p.category===filter.toLowerCase())
  const totalQty=cart.reduce((s,i)=>s+i.qty,0)
  const totalAmt=cart.reduce((s,i)=>s+i.price*86*i.qty,0)

  const addToCart=(p,size)=>{
    const sz=size||selectedSizes[p.id]||p.sizes[Math.floor(p.sizes.length/2)]
    setCart(c=>{
      const ex=c.find(i=>i.id===p.id&&i.size===sz)
      return ex?c.map(i=>i.id===p.id&&i.size===sz?{...i,qty:i.qty+1}:i):[...c,{...p,size:sz,qty:1}]
    })
    setAddedId(p.id);setTimeout(()=>setAddedId(null),1400)
  }

  const openAI=(p)=>{
    setAiProduct(p||PRODUCTS[0]);setAiStep(0)
    setAiForm({gender:"",skin:"",body:"",style:""});setAiRecs([]);setLoadPct(0);setAiOpen(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Baskervville:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{background:#000;color:#fff;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#000;}
        ::-webkit-scrollbar-thumb{background:#283e36;border-radius:2px;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scanline{0%{top:-80px}100%{top:100vh}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}

        .dela{font-family:'Dela Gothic One',sans-serif;}
        .bask{font-family:'Baskervville',serif;}
        .mono{font-family:'Courier New',monospace;}

        .btn-accent{
          background:${C.accent};color:#000;
          font-family:'Dela Gothic One',sans-serif;
          font-size:11px;letter-spacing:0.15em;
          border:none;cursor:pointer;
          transition:all 0.2s;position:relative;overflow:hidden;
        }
        .btn-accent:hover{background:#b8e8d6;box-shadow:0 0 24px rgba(161,217,198,0.25);}

        .btn-outline{
          background:transparent;color:${C.fg};
          font-family:'Dela Gothic One',sans-serif;
          font-size:11px;letter-spacing:0.15em;
          border:1px solid #2a2a2a;cursor:pointer;transition:all 0.2s;
        }
        .btn-outline:hover{border-color:${C.accent};color:${C.accent};}

        .nav-item{
          font-family:'Dela Gothic One',sans-serif;font-size:11px;
          letter-spacing:0.2em;color:${C.muted};
          background:none;border:none;cursor:pointer;transition:color 0.2s;
          position:relative;
        }
        .nav-item::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:${C.accent};transform:scaleX(0);transition:transform 0.25s;}
        .nav-item:hover{color:#fff;}
        .nav-item:hover::after{transform:scaleX(1);}

        .cat-btn{font-family:'Dela Gothic One',sans-serif;font-size:10px;letter-spacing:0.18em;border:none;cursor:pointer;padding:8px 18px;transition:all 0.2s;}
        .cat-btn.on{background:${C.fg};color:#000;}
        .cat-btn.off{background:transparent;color:${C.muted};border:1px solid #1f1f1f;}
        .cat-btn.off:hover{color:#fff;border-color:#333;}

        .size-chip{font-family:'Courier New',monospace;font-size:10px;border:1px solid #222;padding:5px 9px;cursor:pointer;transition:all 0.15s;color:#555;background:transparent;}
        .size-chip:hover,.size-chip.on{border-color:${C.accent};color:${C.accent};}

        .ai-opt{font-family:'Dela Gothic One',sans-serif;font-size:11px;letter-spacing:0.12em;border:1px solid #1f1f1f;padding:12px 14px;cursor:pointer;transition:all 0.18s;color:#555;background:transparent;text-align:left;display:flex;align-items:center;gap:10px;}
        .ai-opt:hover,.ai-opt.on{border-color:${C.accent};color:#fff;background:rgba(161,217,198,0.04);}

        .product-card{transition:transform 0.4s cubic-bezier(0.23,1,0.32,1),box-shadow 0.4s;}
        .product-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,0.7);}

        .panel-enter{animation:slideIn 0.38s cubic-bezier(0.23,1,0.32,1);}

        .scan-line{position:fixed;left:0;right:0;height:80px;pointer-events:none;z-index:9999;background:linear-gradient(180deg,transparent,rgba(161,217,198,0.015),transparent);animation:scanline 7s linear infinite;}
      `}</style>

      {/* Scanline */}
      <div className="scan-line"/>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:300,
        borderBottom:`1px solid ${navScrolled?"#1a1a1a":"transparent"}`,
        background:navScrolled?"rgba(0,0,0,0.94)":"transparent",
        backdropFilter:navScrolled?"blur(20px)":"none",transition:"all 0.4s"}}>
        {/* Ticker */}
        <div style={{background:C.secondary,overflow:"hidden",height:28,display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",gap:0,animation:"marquee 22s linear infinite",whiteSpace:"nowrap"}}>
            {Array(2).fill(["FREE SHIPPING OVER ₹4999","·","NEW DROP: SPECTRE PUFFER","·","USE CODE DRIP20","·","DROP 002 COMING FRIDAY","·"]).flat().map((w,i)=>(
              <span key={i} className="mono" style={{fontSize:9,letterSpacing:"0.25em",color:i%4===0?C.accent:"#7aab9a",marginRight:40}}>{w}</span>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",height:62}}>
          <Logo size={22}/>
          <div style={{display:"flex",gap:36}}>
            {["SHOP","DROPS","ABOUT"].map(l=>(
              <button key={l} className="nav-item"
                onClick={()=>l==="SHOP"&&document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <button className="btn-accent" style={{padding:"9px 18px",display:"flex",alignItems:"center",gap:7,fontSize:10}}
              onClick={()=>openAI(null)}>
              <span style={{fontSize:12}}>◈</span> AI STYLIST
            </button>
            <button onClick={()=>setCartOpen(true)}
              style={{position:"relative",background:"none",border:"none",cursor:"pointer",color:C.muted,transition:"color 0.2s",display:"flex"}}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color=C.muted}>
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalQty>0&&(
                <span style={{position:"absolute",top:-5,right:-5,width:15,height:15,background:C.accent,color:"#000",borderRadius:"50%",fontSize:8,fontFamily:"'Courier New',monospace",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{totalQty}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",position:"relative",overflow:"hidden"}}>
        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&h=900&fit=crop&crop=top"
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.35) contrast(1.2)",zIndex:0}} alt=""/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,0.6) 70%,#000 100%)",zIndex:1}}/>
        <div style={{position:"absolute",left:40,top:0,bottom:0,width:1,background:`linear-gradient(180deg,transparent,${C.accent}44,transparent)`,zIndex:2}}/>

        <div style={{position:"relative",zIndex:3,padding:"0 80px 80px",
          opacity:heroIn?1:0,transform:heroIn?"translateY(0)":"translateY(30px)",
          transition:"all 1s cubic-bezier(0.23,1,0.32,1)"}}>
          <p className="mono" style={{fontSize:9,letterSpacing:"0.5em",color:C.accent,marginBottom:18}}>DROP 001 / COLLECTION</p>
          <h1 className="dela" style={{fontSize:"clamp(60px,9vw,130px)",lineHeight:0.88,letterSpacing:"0.02em",color:C.fg,marginBottom:28}}>
            WEAR<br/>
            <span style={{color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.2)"}}>THE</span><br/>
            DRIP
          </h1>
          <p className="bask" style={{fontSize:15,color:"#888",maxWidth:400,lineHeight:1.8,marginBottom:40,fontStyle:"italic"}}>
            Streetwear born from the margins. Worn by those who refuse the ordinary.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button className="btn-accent" style={{padding:"14px 36px",fontSize:12}}
              onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}>
              SHOP THE DROP
            </button>
            <button className="btn-outline" style={{padding:"14px 28px",fontSize:12}}
              onClick={()=>openAI(null)}>
              ◈ AI STYLIST
            </button>
          </div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.accent}44,transparent)`,zIndex:3}}/>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <div style={{borderTop:"1px solid #111",borderBottom:"1px solid #111",padding:"13px 0",overflow:"hidden",background:"#050505"}}>
        <div style={{display:"flex",gap:0,animation:"marquee 18s linear infinite",whiteSpace:"nowrap"}}>
          {Array(2).fill(["YUNGDRIP","—","STREETWEAR","—","FOR THOSE AT THE FRINGE","—","DROP 001","—","AI-STYLED","—","CULTURE","—"]).flat().map((w,i)=>(
            <span key={i} className="dela" style={{fontSize:11,letterSpacing:"0.3em",color:i%2===0?"#222":"#111",marginRight:48}}>{w}</span>
          ))}
        </div>
      </div>

      {/* ── SHOP ──────────────────────────────────────────────── */}
      <section id="shop" style={{padding:"100px 40px 120px",maxWidth:1360,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:56,flexWrap:"wrap",gap:20}}>
          <div>
            <p className="mono" style={{fontSize:9,letterSpacing:"0.45em",color:C.accent,marginBottom:10}}>COLLECTION 001</p>
            <h2 className="dela" style={{fontSize:"clamp(36px,5vw,68px)",lineHeight:0.9,letterSpacing:"0.03em"}}>THE DROP</h2>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {cats.map(c=>(
              <button key={c} className={`cat-btn ${filter===c?"on":"off"}`} onClick={()=>setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:2}}>
          {visible.map((p,i)=>(
            <div key={p.id} className="product-card"
              style={{background:C.surface,cursor:"pointer",position:"relative",
                opacity:0,animation:`fadeUp 0.55s cubic-bezier(0.23,1,0.32,1) ${i*0.07}s forwards`}}
              onMouseEnter={()=>setHoverId(p.id)}
              onMouseLeave={()=>setHoverId(null)}>
              <div style={{position:"relative",height:400,overflow:"hidden"}}>
                <img src={p.img} alt={p.name}
                  style={{width:"100%",height:"100%",objectFit:"cover",
                    transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)",
                    transform:hoverId===p.id?"scale(1.05)":"scale(1)",
                    filter:"brightness(0.85) contrast(1.05)"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.9) 100%)"}}/>
                <div style={{position:"absolute",top:16,left:16}}>
                  <Tag color={p.tag==="LIMITED"?"#e8c170":p.tag==="COLLAB"?"#c4a8d4":C.accent}>{p.tag}</Tag>
                </div>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
                  opacity:hoverId===p.id?1:0,transition:"opacity 0.3s",
                  background:"rgba(0,0,0,0.35)",backdropFilter:hoverId===p.id?"blur(3px)":"none"}}>
                  <button className="btn-accent" style={{padding:"11px 22px",fontSize:10}}
                    onClick={e=>{e.stopPropagation();openAI(p)}}>
                    ◈ STYLE THIS
                  </button>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.accent}88,transparent)`}}/>
              </div>
              <div style={{padding:"18px 18px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <h3 className="dela" style={{fontSize:16,letterSpacing:"0.04em",color:C.fg,lineHeight:1.1}}>{p.name}</h3>
                  <PriceTag price={p.price}/>
                </div>
                <p className="bask" style={{fontSize:12,color:C.muted,marginBottom:14,lineHeight:1.6,fontStyle:"italic"}}>{p.desc}</p>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:16}}>
                  {p.sizes.slice(0,5).map(s=>(
                    <button key={s} className={`size-chip ${selectedSizes[p.id]===s?"on":""}`}
                      onClick={e=>{e.stopPropagation();setSelectedSizes(v=>({...v,[p.id]:s}))}}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn-accent"
                    style={{flex:1,padding:"11px 14px",fontSize:10,
                      background:addedId===p.id?"#fff":C.accent,transition:"all 0.3s"}}
                    onClick={()=>addToCart(p)}>
                    {addedId===p.id?"✓ ADDED":"ADD TO CART"}
                  </button>
                  <button className="btn-outline" style={{padding:"11px 16px",fontSize:10}} onClick={()=>openAI(p)}>◈</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI FEATURE BANNER ─────────────────────────────────── */}
      <section style={{background:C.secondary,padding:"80px 40px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.accent}66,transparent)`}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.accent}66,transparent)`}}/>
        <div className="dela" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"clamp(80px,16vw,200px)",color:"rgba(161,217,198,0.04)",whiteSpace:"nowrap",pointerEvents:"none"}}>AI STYLIST</div>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <p className="mono" style={{fontSize:9,letterSpacing:"0.5em",color:C.accent,marginBottom:16}}>INTRODUCING</p>
          <h2 className="dela" style={{fontSize:"clamp(32px,5vw,64px)",lineHeight:0.9,letterSpacing:"0.03em",marginBottom:24}}>
            YOUR PERSONAL<br/>STYLE INTELLIGENCE
          </h2>
          <p className="bask" style={{fontSize:16,color:"#9abfb5",lineHeight:1.8,maxWidth:560,margin:"0 auto 36px",fontStyle:"italic"}}>
            Tell us about yourself. Our AI maps your body type, skin tone, and style personality
            to curate a fit that's distinctly yours.
          </p>
          <button className="btn-accent" style={{padding:"15px 44px",fontSize:12}} onClick={()=>openAI(null)}>
            ◈ TRY AI STYLIST NOW
          </button>
          <div style={{display:"flex",justifyContent:"center",gap:48,marginTop:56,flexWrap:"wrap"}}>
            {[["12K+","PROFILES STYLED"],["98%","SATISFACTION"],["4.9★","AVG RATING"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div className="dela" style={{fontSize:32,color:C.fg}}>{n}</div>
                <div className="mono" style={{fontSize:8,color:"#7aab9a",letterSpacing:"0.3em",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{background:"#000",borderTop:"1px solid #111",padding:"60px 40px 36px"}}>
        <div style={{maxWidth:1360,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:40,marginBottom:56}}>
            <div>
              <Logo size={18}/>
              <p className="bask" style={{color:C.muted,fontSize:13,lineHeight:1.8,maxWidth:260,marginTop:16,fontStyle:"italic"}}>
                Streetwear for those at the fringe. Born at the intersection of culture and code.
              </p>
            </div>
            {[
              {t:"SHOP",ls:["New Drops","Tops","Bottoms","Outerwear","Footwear"]},
              {t:"BRAND",ls:["About","Careers","Sustainability","Press"]},
              {t:"HELP",ls:["FAQ","Shipping","Returns","Size Guide","Contact"]},
            ].map(col=>(
              <div key={col.t}>
                <div className="dela" style={{fontSize:10,color:C.accent,letterSpacing:"0.25em",marginBottom:20}}>{col.t}</div>
                {col.ls.map(l=>(
                  <div key={l} className="bask" style={{fontSize:13,color:C.muted,cursor:"pointer",marginBottom:10,transition:"color 0.15s",fontStyle:"italic"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color=C.muted}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{height:1,background:"#1a1a1a",marginBottom:24}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <span className="mono" style={{fontSize:9,color:"#2a2a2a",letterSpacing:"0.2em"}}>© 2024 YUNGDRIP. ALL RIGHTS RESERVED.</span>
            <span className="mono" style={{fontSize:9,color:C.secondary,letterSpacing:"0.2em"}}>AI: LIVE · DROP: ACTIVE</span>
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ───────────────────────────────────────── */}
      {cartOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:600}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(10px)"}}
            onClick={()=>setCartOpen(false)}/>
          <div className="panel-enter" style={{
            position:"absolute",top:0,right:0,bottom:0,width:400,
            background:"#080808",borderLeft:"1px solid #1a1a1a",
            display:"flex",flexDirection:"column"}}>
            <div style={{height:2,background:`linear-gradient(90deg,transparent,${C.accent},transparent)`}}/>
            <div style={{padding:"22px 24px",borderBottom:"1px solid #111",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div className="mono" style={{fontSize:8,color:C.accent,letterSpacing:"0.3em",marginBottom:5}}>YOUR BAG</div>
                <div className="dela" style={{fontSize:20,letterSpacing:"0.04em"}}>{totalQty} ITEM{totalQty!==1?"S":""}</div>
              </div>
              <button onClick={()=>setCartOpen(false)}
                style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,transition:"color 0.2s"}}
                onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color=C.muted}>✕</button>
            </div>
            <div style={{flex:1,overflow:"auto",padding:"18px 24px"}}>
              {cart.length===0?(
                <div style={{textAlign:"center",padding:"70px 0"}}>
                  <div className="dela" style={{fontSize:14,letterSpacing:"0.15em",color:C.muted}}>EMPTY BAG</div>
                  <div className="bask" style={{fontSize:13,fontStyle:"italic",color:"#333",marginTop:8}}>Go fill it up.</div>
                </div>
              ):cart.map(item=>(
                <div key={`${item.id}-${item.size}`} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:"1px solid #0f0f0f"}}>
                  <img src={item.img} alt={item.name} style={{width:74,height:86,objectFit:"cover",filter:"brightness(0.8)",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div className="dela" style={{fontSize:13,letterSpacing:"0.04em",marginBottom:4}}>{item.name}</div>
                    <div className="mono" style={{fontSize:9,color:C.muted,letterSpacing:"0.15em",marginBottom:8}}>{item.size} · QTY {item.qty}</div>
                    <PriceTag price={item.price*item.qty}/>
                  </div>
                  <button style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:16,alignSelf:"flex-start",transition:"color 0.15s"}}
                    onMouseEnter={e=>e.target.style.color="#e55"} onMouseLeave={e=>e.target.style.color="#333"}
                    onClick={()=>setCart(c=>c.filter(i=>!(i.id===item.id&&i.size===item.size)))}>✕</button>
                </div>
              ))}
            </div>
            {cart.length>0&&(
              <div style={{padding:"18px 24px",borderTop:"1px solid #111"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <span className="dela" style={{fontSize:12,letterSpacing:"0.12em",color:C.muted}}>SUBTOTAL</span>
                  <span className="bask" style={{fontSize:22,fontStyle:"italic"}}>₹{totalAmt.toLocaleString()}</span>
                </div>
                <button className="btn-accent" style={{width:"100%",padding:"15px",fontSize:12}}>CHECKOUT →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── AI STYLIST PANEL ──────────────────────────────────── */}
      {aiOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:700}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(14px)"}}
            onClick={()=>setAiOpen(false)}/>
          <div className="panel-enter" style={{
            position:"absolute",top:0,right:0,bottom:0,width:500,
            background:"#030303",borderLeft:"1px solid #181818",
            display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{height:2,background:`linear-gradient(90deg,transparent,${C.accent},${C.secondary},transparent)`}}/>

            {/* AI Header */}
            <div style={{padding:"22px 28px 18px",borderBottom:"1px solid #111",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:C.accent,display:"inline-block",animation:"pulse 1.8s ease-in-out infinite"}}/>
                    <span className="mono" style={{fontSize:8,color:C.accent,letterSpacing:"0.35em"}}>AI STYLIST · ONLINE</span>
                  </div>
                  <h2 className="dela" style={{fontSize:26,letterSpacing:"0.04em",lineHeight:1}}>
                    YUNGDRIP<br/><span style={{color:C.accent}}>STYLE AI</span>
                  </h2>
                  <p className="bask" style={{fontSize:12,color:C.muted,marginTop:6,fontStyle:"italic"}}>
                    Personalized fits based on your unique profile
                  </p>
                </div>
                <button onClick={()=>setAiOpen(false)}
                  style={{background:"none",border:"1px solid #1f1f1f",color:C.muted,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"all 0.2s",flexShrink:0}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#333";e.currentTarget.style.color="#fff"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#1f1f1f";e.currentTarget.style.color=C.muted}}>
                  ✕
                </button>
              </div>
              {aiProduct&&(
                <div style={{marginTop:16,padding:"11px 14px",background:"#0a0a0a",border:"1px solid #181818",display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{position:"relative"}}>
                    <img src={aiProduct.img} alt="" style={{width:46,height:54,objectFit:"cover",filter:"brightness(0.8)",flexShrink:0}}/>
                    <div style={{position:"absolute",inset:0,border:`1px solid ${C.accent}44`}}/>
                  </div>
                  <div>
                    <div className="mono" style={{fontSize:8,color:C.accent,letterSpacing:"0.25em",marginBottom:3}}>STYLING FOR</div>
                    <div className="dela" style={{fontSize:14,letterSpacing:"0.05em"}}>{aiProduct.name}</div>
                    <div className="bask" style={{fontSize:12,color:C.muted,fontStyle:"italic"}}>₹{(aiProduct.price*86).toLocaleString()}</div>
                  </div>
                  <button className="mono" style={{marginLeft:"auto",background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:10,transition:"color 0.15s"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color=C.muted}
                    onClick={()=>setAiProduct(null)}>change ↗</button>
                </div>
              )}
            </div>

            {/* AI Body */}
            <div style={{flex:1,overflow:"auto",padding:"24px 28px"}}>

              {/* FORM */}
              {aiStep===0&&(
                <div style={{animation:"fadeIn 0.35s ease"}}>
                  {/* Identity */}
                  <div style={{marginBottom:28}}>
                    <div className="mono" style={{fontSize:9,color:C.accent,letterSpacing:"0.35em",marginBottom:12}}>01 — IDENTITY</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                      {[{v:"male",l:"MALE"},{v:"female",l:"FEMALE"},{v:"fluid",l:"GENDER FLUID"}].map(g=>(
                        <button key={g.v} className={`ai-opt ${aiForm.gender===g.v?"on":""}`}
                          style={{justifyContent:"center",textAlign:"center",padding:"13px 8px",fontSize:10}}
                          onClick={()=>setAiForm(f=>({...f,gender:g.v}))}>{g.l}</button>
                      ))}
                    </div>
                  </div>

                  {/* Skin tone */}
                  <div style={{marginBottom:28}}>
                    <div className="mono" style={{fontSize:9,color:C.accent,letterSpacing:"0.35em",marginBottom:12}}>02 — SKIN TONE</div>
                    <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                      {[{v:"fair",c:"#f5d5b0",l:"Fair"},{v:"light",c:"#e8b98a",l:"Light"},{v:"medium",c:"#c8855a",l:"Medium"},{v:"tan",c:"#a0622b",l:"Tan"},{v:"brown",c:"#7a4020",l:"Brown"},{v:"deep",c:"#3d1e0e",l:"Deep"}].map(s=>(
                        <div key={s.v} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}
                          onClick={()=>setAiForm(f=>({...f,skin:s.v}))}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:s.c,
                            border:`2px solid ${aiForm.skin===s.v?C.accent:"transparent"}`,
                            boxShadow:aiForm.skin===s.v?`0 0 10px ${C.accent}55`:"none",transition:"all 0.18s"}}/>
                          <span className="mono" style={{fontSize:8,color:aiForm.skin===s.v?C.accent:"#333",letterSpacing:"0.1em"}}>{s.l}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body type */}
                  <div style={{marginBottom:28}}>
                    <div className="mono" style={{fontSize:9,color:C.accent,letterSpacing:"0.35em",marginBottom:12}}>03 — BODY TYPE</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                      {[{v:"slim",l:"SLIM",d:"Lean frame"},{v:"athletic",l:"ATHLETIC",d:"Muscular"},{v:"broad",l:"BROAD",d:"Fuller build"}].map(b=>(
                        <button key={b.v} className={`ai-opt ${aiForm.body===b.v?"on":""}`}
                          style={{flexDirection:"column",alignItems:"flex-start",padding:"14px 12px",gap:0}}
                          onClick={()=>setAiForm(f=>({...f,body:b.v}))}>
                          <span style={{fontSize:12,marginBottom:3}}>{b.l}</span>
                          <span className="bask" style={{fontSize:10,color:"#444",fontStyle:"italic"}}>{b.d}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style vibe */}
                  <div style={{marginBottom:36}}>
                    <div className="mono" style={{fontSize:9,color:C.accent,letterSpacing:"0.35em",marginBottom:12}}>04 — STYLE VIBE</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {[{v:"dark",l:"DARK & MOODY"},{v:"minimal",l:"CLEAN MINIMAL"},{v:"loud",l:"LOUD STATEMENT"},{v:"utility",l:"FUNCTIONAL"}].map(s=>(
                        <button key={s.v} className={`ai-opt ${aiForm.style===s.v?"on":""}`}
                          style={{padding:"11px 12px",fontSize:10,justifyContent:"flex-start"}}
                          onClick={()=>setAiForm(f=>({...f,style:s.v}))}>{s.l}</button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-accent"
                    style={{width:"100%",padding:"16px",fontSize:12,
                      opacity:aiForm.gender&&aiForm.skin&&aiForm.body&&aiForm.style?1:0.25,transition:"opacity 0.3s"}}
                    disabled={!aiForm.gender||!aiForm.skin||!aiForm.body||!aiForm.style}
                    onClick={()=>setAiStep(1)}>
                    ◈ GENERATE MY STYLE PICKS
                  </button>
                  <p className="bask" style={{fontSize:11,color:"#2a2a2a",textAlign:"center",marginTop:14,fontStyle:"italic"}}>Your profile is private and never stored.</p>
                </div>
              )}

              {/* LOADING */}
              {aiStep===1&&(
                <div style={{animation:"fadeIn 0.3s ease",textAlign:"center",padding:"40px 0"}}>
                  <div style={{position:"relative",display:"inline-block",marginBottom:36}}>
                    <svg width="100" height="100" viewBox="0 0 100 100"
                      style={{animation:"spin 3s linear infinite"}}>
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#111" strokeWidth="1"/>
                      <circle cx="50" cy="50" r="44" fill="none" stroke={C.accent} strokeWidth="1.5"
                        strokeDasharray="276" strokeDashoffset={276*(1-loadPct/100)}
                        strokeLinecap="round" style={{transition:"stroke-dashoffset 0.1s"}}/>
                      <text x="50" y="55" textAnchor="middle"
                        style={{fontFamily:"'Dela Gothic One',sans-serif",fontSize:18,fill:C.fg}}>{loadPct}%</text>
                    </svg>
                  </div>
                  <div className="mono" style={{fontSize:11,color:C.accent,letterSpacing:"0.12em",minHeight:18,marginBottom:8}}>
                    {aiMsg}<span style={{animation:"pulse 0.8s step-end infinite"}}>_</span>
                  </div>
                  <div style={{width:"70%",margin:"20px auto 0",height:1,background:"#111",position:"relative"}}>
                    <div style={{position:"absolute",left:0,top:0,height:"100%",background:C.accent,width:`${loadPct}%`,transition:"width 0.1s",boxShadow:`0 0 8px ${C.accent}88`}}/>
                  </div>
                  <div className="mono" style={{fontSize:8,color:"#222",letterSpacing:"0.2em",marginTop:20}}>CROSS-REFERENCING 14,000+ STYLE PROFILES</div>
                </div>
              )}

              {/* RESULTS */}
              {aiStep===2&&(
                <div style={{animation:"fadeUp 0.4s cubic-bezier(0.23,1,0.32,1)"}}>
                  <div style={{padding:"14px 16px",background:C.surfaceHigh,border:"1px solid #181818",marginBottom:24}}>
                    <div className="mono" style={{fontSize:8,color:C.accent,letterSpacing:"0.3em",marginBottom:8}}>PROFILE SUMMARY</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[aiForm.gender,aiForm.skin+" tone",aiForm.body+" build",aiForm.style+" vibe"].map(t=>(
                        <Tag key={t} color={C.accent}>{t}</Tag>
                      ))}
                    </div>
                  </div>

                  <div className="dela" style={{fontSize:20,letterSpacing:"0.04em",marginBottom:4}}>YOUR FIT PICKS</div>
                  <p className="bask" style={{fontSize:12,color:C.muted,fontStyle:"italic",marginBottom:24}}>Curated specifically for your profile.</p>

                  {aiRecs.map((rec,i)=>(
                    <div key={rec.id} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:"1px solid #0f0f0f",
                      opacity:0,animation:`fadeUp 0.45s cubic-bezier(0.23,1,0.32,1) ${i*0.1}s forwards`}}>
                      <div style={{position:"relative",flexShrink:0}}>
                        <img src={rec.img} alt={rec.name}
                          style={{width:82,height:96,objectFit:"cover",filter:"brightness(0.82)"}}/>
                        <div style={{position:"absolute",top:0,left:0,background:C.secondary,padding:"3px 7px"}}>
                          <span className="mono" style={{fontSize:7,color:C.accent}}>
                            {i===0?"BEST PICK":i===1?"PAIRS WELL":"COMPLETE FIT"}
                          </span>
                        </div>
                      </div>
                      <div style={{flex:1}}>
                        <div className="dela" style={{fontSize:15,letterSpacing:"0.04em",marginBottom:4}}>{rec.name}</div>
                        <p className="bask" style={{fontSize:11,color:C.muted,lineHeight:1.6,marginBottom:10,fontStyle:"italic"}}>{rec.desc}</p>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <PriceTag price={rec.price}/>
                          <button className="btn-accent" style={{padding:"7px 16px",fontSize:9}}
                            onClick={()=>addToCart(rec)}>ADD ◈</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{marginTop:24,padding:"16px",background:C.secondary,border:"1px solid #283e36"}}>
                    <div className="dela" style={{fontSize:13,letterSpacing:"0.06em",marginBottom:4}}>ADD FULL OUTFIT</div>
                    <p className="bask" style={{fontSize:11,color:"#7aab9a",fontStyle:"italic",marginBottom:12}}>Get the complete look in one click.</p>
                    <button className="btn-accent" style={{width:"100%",padding:"12px",fontSize:10}}
                      onClick={()=>aiRecs.forEach(r=>addToCart(r))}>
                      ADD ALL {aiRecs.length} PIECES →
                    </button>
                  </div>

                  <button className="btn-outline" style={{width:"100%",padding:"13px",marginTop:12,fontSize:10}}
                    onClick={()=>{setAiStep(0);setAiForm({gender:"",skin:"",body:"",style:""})}}>
                    ← RESTYLE FROM SCRATCH
                  </button>
                </div>
              )}
            </div>

            <div style={{padding:"10px 28px",borderTop:"1px solid #0f0f0f",display:"flex",justifyContent:"space-between",flexShrink:0}}>
              <span className="mono" style={{fontSize:7,color:"#1f1f1f",letterSpacing:"0.2em"}}>YUNGDRIP AI v1.0 · PRIVATE</span>
              <span className="mono" style={{fontSize:7,color:C.secondary,letterSpacing:"0.2em"}}>● LIVE</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
