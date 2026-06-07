import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// TRAINING TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
const TRAINING_TEMPLATES = [
  { id:"gvt", name:"GVT", fullName:"German Volume Training", tag:"Hipertrofia", color:"#f97316",
    description:"10 séries × 10 reps com 60% 1RM. Volume extremo para hipertrofia máxima.",
    protocol:"10×10 | 60-90s descanso | 60% 1RM",
    days:[
      { name:"GVT — Peito & Costas", exercises:[
        {name:"Supino Reto",sets:10,reps:10,note:"60% 1RM | 90s descanso"},
        {name:"Barra Fixa",sets:10,reps:10,note:"Peso corporal / lastro"},
        {name:"Crucifixo",sets:3,reps:12,note:"Acessório — 60s"},
        {name:"Pullover",sets:3,reps:12,note:"Acessório — 60s"}]},
      { name:"GVT — Pernas & Core", exercises:[
        {name:"Agachamento",sets:10,reps:10,note:"60% 1RM | 90s descanso"},
        {name:"Leg Press",sets:10,reps:10,note:"Variação"},
        {name:"Mesa Flexora",sets:3,reps:12,note:"Acessório"},
        {name:"Panturrilha",sets:3,reps:15,note:"Acessório"}]},
      { name:"GVT — Ombros & Braços", exercises:[
        {name:"Desenvolvimento",sets:10,reps:10,note:"60% 1RM | 90s"},
        {name:"Rosca Direta",sets:10,reps:10,note:"60% 1RM | 90s"},
        {name:"Tríceps Testa",sets:3,reps:12,note:"Acessório"},
        {name:"Elevação Lateral",sets:3,reps:15,note:"Acessório"}]}]},
  { id:"5x5", name:"StrongLifts 5×5", fullName:"StrongLifts 5×5", tag:"Força + Massa", color:"#06b6d4",
    description:"Progressão linear clássica. Adicione 2,5kg por sessão nos compostos.",
    protocol:"5×5 | 3min descanso | Progressão linear",
    days:[
      { name:"5×5 — Treino A", exercises:[
        {name:"Agachamento",sets:5,reps:5,note:"+2,5kg a cada treino"},
        {name:"Supino Reto",sets:5,reps:5,note:"+2,5kg a cada treino"},
        {name:"Remada Curvada",sets:5,reps:5,note:"+2,5kg a cada treino"}]},
      { name:"5×5 — Treino B", exercises:[
        {name:"Agachamento",sets:5,reps:5,note:"+2,5kg a cada treino"},
        {name:"Levantamento Terra",sets:1,reps:5,note:"+5kg a cada treino"},
        {name:"Desenvolvimento",sets:5,reps:5,note:"+2,5kg a cada treino"}]}]},
  { id:"powerlifting", name:"Powerlifting", fullName:"Base Powerlifting", tag:"Força Máxima", color:"#a78bfa",
    description:"Foco nos 3 levantamentos. Periodização por blocos de intensidade.",
    protocol:"3–5 séries | 3–5min descanso | 80–95% 1RM",
    days:[
      { name:"PL — Dia de Agachamento", exercises:[
        {name:"Agachamento",sets:5,reps:3,note:"85–90% 1RM"},
        {name:"Agachamento",sets:3,reps:5,note:"70% — back-off"},
        {name:"Leg Press",sets:3,reps:8,note:"Acessório"},
        {name:"Mesa Flexora",sets:3,reps:10,note:"Acessório"}]},
      { name:"PL — Dia de Supino", exercises:[
        {name:"Supino Reto",sets:5,reps:3,note:"85–90% 1RM"},
        {name:"Supino Reto",sets:3,reps:5,note:"70% — back-off"},
        {name:"Remada Curvada",sets:4,reps:8,note:"Equilíbrio"},
        {name:"Tríceps Corda",sets:3,reps:12,note:"Acessório"}]},
      { name:"PL — Levantamento Terra", exercises:[
        {name:"Levantamento Terra",sets:4,reps:3,note:"87–92% 1RM"},
        {name:"Levantamento Terra",sets:2,reps:5,note:"70% — back-off"},
        {name:"Barra Fixa",sets:4,reps:6,note:"Força de puxada"},
        {name:"Hip Thrust",sets:3,reps:10,note:"Glúteo / posterior"}]}]},
  { id:"ppl", name:"PPL", fullName:"Push Pull Legs", tag:"Hipertrofia", color:"#22c55e",
    description:"6 dias semanais. Push/Pull/Legs com máxima frequência e volume.",
    protocol:"3–4×8–12 | 60–90s | RIR 1–2",
    days:[
      { name:"PPL — Push", exercises:[
        {name:"Supino Reto",sets:4,reps:8,note:"Compound principal"},
        {name:"Supino Inclinado",sets:3,reps:10,note:"Peito alto"},
        {name:"Desenvolvimento",sets:3,reps:10,note:"Ombro"},
        {name:"Elevação Lateral",sets:4,reps:15,note:"Deltoide medial"},
        {name:"Tríceps Corda",sets:3,reps:12,note:"Isolação"}]},
      { name:"PPL — Pull", exercises:[
        {name:"Barra Fixa",sets:4,reps:6,note:"Compound principal"},
        {name:"Remada Curvada",sets:4,reps:8,note:"Massa costas"},
        {name:"Puxada Frontal",sets:3,reps:10,note:"Volume lat"},
        {name:"Rosca Direta",sets:3,reps:12,note:"Bíceps"},
        {name:"Rosca Martelo",sets:3,reps:12,note:"Braquiorradial"}]},
      { name:"PPL — Legs", exercises:[
        {name:"Agachamento",sets:4,reps:8,note:"Compound principal"},
        {name:"Leg Press",sets:3,reps:12,note:"Volume quad"},
        {name:"Cadeira Extensora",sets:3,reps:15,note:"Isolação"},
        {name:"Stiff",sets:4,reps:10,note:"Posterior"},
        {name:"Panturrilha",sets:4,reps:15,note:"Volume"}]}]},
  { id:"upper_lower", name:"Upper/Lower", fullName:"Upper / Lower Split", tag:"Força + Massa", color:"#f59e0b",
    description:"4 dias semanais. Alta frequência com alternância força / hipertrofia.",
    protocol:"4×6–10 | 2min descanso | Progressão dupla",
    days:[
      { name:"Upper — Força", exercises:[
        {name:"Supino Reto",sets:4,reps:5,note:"85% 1RM"},
        {name:"Remada Curvada",sets:4,reps:5,note:"85% 1RM"},
        {name:"Desenvolvimento",sets:3,reps:8,note:"75% 1RM"},
        {name:"Rosca Direta",sets:3,reps:10,note:"Moderado"}]},
      { name:"Lower — Força", exercises:[
        {name:"Agachamento",sets:4,reps:5,note:"85% 1RM"},
        {name:"Levantamento Terra",sets:3,reps:5,note:"85% 1RM"},
        {name:"Afundo",sets:3,reps:8,note:"Por perna"},
        {name:"Panturrilha",sets:4,reps:12,note:"Carga moderada"}]},
      { name:"Upper — Hipertrofia", exercises:[
        {name:"Supino Inclinado",sets:4,reps:10,note:"70% 1RM"},
        {name:"Puxada Frontal",sets:4,reps:10,note:"70% 1RM"},
        {name:"Crucifixo",sets:3,reps:12,note:"Isolação"},
        {name:"Elevação Lateral",sets:4,reps:15,note:"Medial delt"}]},
      { name:"Lower — Hipertrofia", exercises:[
        {name:"Leg Press",sets:4,reps:12,note:"70% 1RM"},
        {name:"Stiff",sets:4,reps:10,note:"Excêntrico"},
        {name:"Cadeira Extensora",sets:3,reps:15,note:"Isolação"},
        {name:"Hip Thrust",sets:3,reps:12,note:"Glúteo"}]}]},
  { id:"arnold", name:"Arnold Split", fullName:"Arnold Split Clássico", tag:"Hipertrofia", color:"#ec4899",
    description:"6 dias. Peito+Costas no mesmo dia. Alta frequência e volume clássico.",
    protocol:"4–5×8–12 | 60s | Volume alto",
    days:[
      { name:"Arnold — Peito & Costas", exercises:[
        {name:"Supino Reto",sets:4,reps:10,note:"Principal peito"},
        {name:"Barra Fixa",sets:4,reps:8,note:"Principal costas"},
        {name:"Supino Inclinado",sets:3,reps:10,note:"Peito alto"},
        {name:"Remada Curvada",sets:3,reps:10,note:"Espessura"},
        {name:"Crucifixo",sets:3,reps:12,note:"Isolação peito"}]},
      { name:"Arnold — Ombros & Braços", exercises:[
        {name:"Desenvolvimento",sets:4,reps:8,note:"Principal"},
        {name:"Rosca Direta",sets:4,reps:10,note:"Bíceps"},
        {name:"Tríceps Testa",sets:4,reps:10,note:"Tríceps"},
        {name:"Elevação Lateral",sets:3,reps:12,note:"Medial delt"},
        {name:"Rosca Martelo",sets:3,reps:12,note:"Braquiorradial"}]},
      { name:"Arnold — Pernas", exercises:[
        {name:"Agachamento",sets:4,reps:10,note:"Principal quad"},
        {name:"Leg Press",sets:4,reps:12,note:"Volume"},
        {name:"Afundo",sets:3,reps:10,note:"Por perna"},
        {name:"Stiff",sets:3,reps:10,note:"Isquios"},
        {name:"Panturrilha",sets:5,reps:15,note:"Volume"}]}]},
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & STORAGE
// ═══════════════════════════════════════════════════════════════════════════════
const MUSCLE_GROUPS = ["Peito","Costas","Ombros","Bíceps","Tríceps","Pernas","Glúteos","Core","Full Body"];
const DEFAULT_EXERCISES = {
  Peito:["Supino Reto","Supino Inclinado","Supino Declinado","Crucifixo","Crossover","Flexão","Dips","Supino Máquina"],
  Costas:["Barra Fixa","Puxada Frontal","Remada Curvada","Remada Unilateral","Pullover","Levantamento Terra","Remada Máquina","Puxada Neutra"],
  Ombros:["Desenvolvimento","Elevação Lateral","Elevação Frontal","Remada Alta","Face Pull","Arnold Press","Desenvolvimento Máquina"],
  Bíceps:["Rosca Direta","Rosca Alternada","Rosca Martelo","Rosca Concentrada","Rosca 21","Rosca Scott","Rosca Cabo"],
  Tríceps:["Tríceps Corda","Tríceps Testa","Mergulho","Tríceps Franzido","Extensão Overhead","Close Grip Supino","Tríceps Máquina"],
  Pernas:["Agachamento","Leg Press","Cadeira Extensora","Mesa Flexora","Stiff","Hack Squat","Afundo","Panturrilha","Agachamento Búlgaro","Leg Curl em Pé"],
  Glúteos:["Hip Thrust","Glúteo no Cabo","Abdução","Agachamento Sumô","Step Up","Afundo Reverso"],
  Core:["Prancha","Abdominal","Abdominal Oblíquo","Elevação de Pernas","Russian Twist","Dead Bug","Ab Wheel"],
  "Full Body":["Levantamento Terra","Clean","Snatch","Burpee","Thruster","Kettlebell Swing"],
};
const EMPTY_DATA = { workouts:[], bodyWeight:[], personalRecords:{}, maxLoads:{}, savedLists:[] };

function getStorage() {
  try { return { ...EMPTY_DATA, ...JSON.parse(localStorage.getItem("ironlog_v2") || "{}") }; }
  catch { return EMPTY_DATA; }
}
function setStorage(d) { try { localStorage.setItem("ironlog_v2", JSON.stringify(d)); } catch {} }

// ═══════════════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════════════
const e1rm = (w, r) => +(w * (1 + r / 30)).toFixed(1);
const fmtDate = d => new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});
const today = () => new Date().toISOString().split("T")[0];
const calcVolume = sets => sets.reduce((s,x) => s+(parseFloat(x.weight||0)*parseInt(x.reps||0)),0);

function calcStreak(workouts) {
  if (!workouts.length) return 0;
  const dates = [...new Set(workouts.map(w=>w.date))].sort().reverse();
  let streak=0, cur=new Date(); cur.setHours(0,0,0,0);
  for (const d of dates) {
    const wd=new Date(d+"T00:00:00"); wd.setHours(0,0,0,0);
    if (Math.round((cur-wd)/86400000)<=1){streak++;cur=wd;}else break;
  }
  return streak;
}

// GIF search map
const GIF_MAP = {
  "Supino Reto":"bench+press+form","Supino Inclinado":"incline+bench+press",
  "Barra Fixa":"pull+up+form","Agachamento":"squat+form","Levantamento Terra":"deadlift+form",
  "Desenvolvimento":"shoulder+press+form","Rosca Direta":"bicep+curl+form",
  "Tríceps Corda":"tricep+pushdown","Hip Thrust":"hip+thrust+form",
  "Remada Curvada":"barbell+row+form","Leg Press":"leg+press+exercise",
  "Stiff":"romanian+deadlift","Mesa Flexora":"leg+curl+exercise",
};
const gifUrl = n => `https://giphy.com/search/${GIF_MAP[n]||(n.replace(/ /g,"+")+"+exercise+form")}`;

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS (unified set)
// ═══════════════════════════════════════════════════════════════════════════════
const ICON_PATHS = {
  dumbbell:"M6 5v14M18 5v14M4 8h4M16 8h4M4 16h4M16 16h4M8 12h8",
  chart:"polyline:22 12 18 12 15 21 9 3 6 12 2 12",
  plus:"M12 5v14M5 12h14",
  trophy:"polyline:8 21 12 17 16 21|M12 17v-6|path:M7 4v4s-5 0-5 4 5 4 5 4|path:M17 4v4s5 0 5 4-5 4-5 4|M7 4h10",
  home:"path:M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z|polyline:9 22 9 12 15 12 15 22",
  trash:"polyline:3 6 5 6 21 6|path:M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6|M10 11v6M14 11v6|path:M9 6V4h6v2",
  check:"polyline:20 6 9 17 4 12",
  fire:"path:M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
  bolt:"polygon:13 2 3 14 12 14 11 22 21 10 12 10 13 2",
  list:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  template:"path:M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z|path:M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z|path:M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  save:"path:M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z|polyline:17 21 17 13 7 13 7 21|polyline:7 3 7 8 15 8",
  edit:"path:M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7|path:M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  star:"polygon:12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",
  close:"M18 6L6 18M6 6l12 12",
  weight:"circle:12 12 10|M12 8v4l3 3",
  video:"polygon:23 7 16 12 23 17 23 7|rect:1 5 15 14 2",
  clock:"circle:12 12 10|M12 6v6l4 2",
  mic:"M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8",
  micOff:"M1 1l22 22M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8",
  send:"M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  heart:"path:M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  heartbeat:"M22 12h-4l-3 9L9 3l-3 9H2",
  flame:"path:M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z",
  bike:"circle:18.5 17.5 2.5|circle:5.5 17.5 2.5|circle:15 5 2|path:M12 17.5V14l-3-3 4-3 2 3h2",
  run:"circle:12 5 1|path:M15 14l-4 4-3-3 2-3.5M13 14l2-3.5-3-2.5 1-2.5",
  swim:"path:M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2",
  bluetooth:"path:M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11",
  ai:"circle:12 12 9|M9 10h.01M15 10h.01|path:M9 15c.83.67 1.86 1 3 1s2.17-.33 3-1",
};
const I = ({n,s=20}) => {
  const d = ICON_PATHS[n]||"";
  const parts = d.split("|");
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {parts.map((p,i)=>{
        if(p.startsWith("polyline:"))return <polyline key={i} points={p.slice(9)}/>;
        if(p.startsWith("polygon:"))return <polygon key={i} points={p.slice(8)}/>;
        if(p.startsWith("path:"))return <path key={i} d={p.slice(5)}/>;
        if(p.startsWith("circle:")){const[cx,cy,r]=p.slice(7).split(" ");return <circle key={i} cx={cx} cy={cy} r={r}/>;}
        if(p.startsWith("rect:")){const[x,y,w,h,rx]=p.slice(5).split(" ");return <rect key={i} x={x} y={y} width={w} height={h} rx={rx}/>;}
        return <path key={i} d={p}/>;
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPARKLINE
// ═══════════════════════════════════════════════════════════════════════════════
function SparkLine({data,color="#f97316",height=52}){
  if(!data||data.length<2)return <div style={{height,display:"flex",alignItems:"center",justifyContent:"center",color:"#444",fontSize:12}}>Dados insuficientes</div>;
  const vals=data.map(d=>d.value),min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const W=300,H=height,px=i=>(i/(data.length-1))*W,py=v=>H-((v-min)/range)*(H-10)-5;
  const pts=data.map((d,i)=>`${px(i)},${py(d.value)}`).join(" ");
  const area=`M0,${H} L${data.map((d,i)=>`${px(i)},${py(d.value)}`).join(" L")} L${W},${H} Z`;
  const last=data[data.length-1];
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height,display:"block"}}>
      <defs><linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={area} fill={`url(#g${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={px(data.length-1)} cy={py(last.value)} r="5" fill={color}/>
      <text x={px(data.length-1)} y={py(last.value)-10} fill={color} fontSize="11" fontWeight="700" textAnchor="middle">{last.value.toFixed(1)}</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REST TIMER OVERLAY
// ═══════════════════════════════════════════════════════════════════════════════
function RestTimer({seconds,onDone,onDismiss}){
  const[remaining,setRemaining]=useState(seconds);
  const[paused,setPaused]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    if(paused){clearInterval(ref.current);return;}
    ref.current=setInterval(()=>setRemaining(r=>{if(r<=1){clearInterval(ref.current);onDone();return 0;}return r-1;}),1000);
    return()=>clearInterval(ref.current);
  },[paused]);
  const pct=((seconds-remaining)/seconds)*100,r=44,circ=2*Math.PI*r,dash=circ-(pct/100)*circ;
  const min=Math.floor(remaining/60),sec=remaining%60;
  return(
    <div className="rest-overlay">
      <div className="rest-card">
        <div className="rest-label">DESCANSO</div>
        <div className="rest-ring-wrap">
          <svg width={110} height={110} viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={r} fill="none" stroke="#1f1f1f" strokeWidth="8"/>
            <circle cx="55" cy="55" r={r} fill="none" stroke={remaining<=10?"#ef4444":"#f97316"}
              strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
              transform="rotate(-90 55 55)" style={{transition:"stroke-dashoffset .9s linear,stroke .3s"}}/>
          </svg>
          <div className="rest-time">{min>0?`${min}:${sec.toString().padStart(2,"0")}`:sec}<span>{min>0?"":"s"}</span></div>
        </div>
        <div className="rest-actions">
          <button className="rest-adj" onClick={()=>setRemaining(p=>Math.max(5,p-15))}>−15s</button>
          <button className="rest-pause" onClick={()=>setPaused(p=>!p)}>{paused?"▶":"⏸"}</button>
          <button className="rest-adj" onClick={()=>setRemaining(p=>p+15)}>+15s</button>
        </div>
        <button className="rest-skip" onClick={onDismiss}>Pular descanso</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXERCISE MEDIA MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function ExerciseMediaModal({exName,onClose}){
  const[mode,setMode]=useState("gif");
  const videoRef=useRef(),mrRef=useRef(),streamRef=useRef();
  const[recording,setRecording]=useState(false);
  const[recorded,setRecorded]=useState(null);
  const[camActive,setCamActive]=useState(false);
  const[camError,setCamError]=useState(null);

  const startCam=async()=>{
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
      streamRef.current=s;
      if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play();}
      setCamActive(true);setCamError(null);
    }catch(e){setCamError("Câmera: "+e.message);}
  };
  const stopCam=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;setCamActive(false);};
  const startRec=()=>{
    if(!streamRef.current)return;
    const chunks=[];
    const mr=new MediaRecorder(streamRef.current);
    mr.ondataavailable=e=>chunks.push(e.data);
    mr.onstop=()=>setRecorded(URL.createObjectURL(new Blob(chunks,{type:"video/webm"})));
    mr.start();mrRef.current=mr;setRecording(true);
  };
  const stopRec=()=>{mrRef.current?.stop();setRecording(false);stopCam();};

  useEffect(()=>{if(mode==="camera")startCam();return()=>stopCam();},[mode]);

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{exName}</div>
          <button className="icon-btn" onClick={onClose}><I n="close" s={16}/></button>
        </div>
        <div className="modal-tabs">
          <button className={mode==="gif"?"active":""} onClick={()=>setMode("gif")}>📹 Ver Execução</button>
          <button className={mode==="camera"?"active":""} onClick={()=>setMode("camera")}>📷 Me Gravar</button>
        </div>
        {mode==="gif"&&(
          <div className="modal-gif-area">
            <a href={gifUrl(exName)} target="_blank" rel="noreferrer" className="gif-link-btn">
              <I n="bolt" s={18}/> Ver GIFs de "{exName}" no Giphy
            </a>
            <div className="gif-tip">💡 <strong>Dica:</strong> Confira a técnica antes de cada série.</div>
          </div>
        )}
        {mode==="camera"&&(
          <div className="modal-camera-area">
            {camError&&<div className="cam-error">{camError}</div>}
            {!recorded?(
              <>
                <video ref={videoRef} className="cam-preview" muted playsInline autoPlay/>
                <div className="cam-actions">
                  {!recording
                    ?<button className="cam-rec-btn" onClick={startRec} disabled={!camActive}><span className="rec-dot"/>GRAVAR</button>
                    :<button className="cam-rec-btn recording" onClick={stopRec}><span className="rec-dot active"/>PARAR</button>
                  }
                </div>
                <div className="cam-note">Vídeo salvo apenas no seu dispositivo</div>
              </>
            ):(
              <div className="cam-result">
                <video src={recorded} className="cam-preview" controls/>
                <button className="cta-btn" style={{marginBottom:8}} onClick={()=>{const a=document.createElement("a");a.href=recorded;a.download=`${exName.replace(/ /g,"_")}.webm`;a.click();}}>
                  <I n="save" s={16}/> Salvar no Celular
                </button>
                <button className="ghost-btn" onClick={()=>{setRecorded(null);startCam();}}>Gravar novamente</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME TAB
// ═══════════════════════════════════════════════════════════════════════════════
function HomeTab({data,setTab,setData}){
  const recent=[...data.workouts].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
  const streak=calcStreak(data.workouts);
  const weekVol=data.workouts.filter(w=>new Date(w.date)>=new Date(Date.now()-7*86400000)).reduce((s,w)=>s+w.exercises.reduce((s2,ex)=>s2+calcVolume(ex.sets),0),0);
  const topPR=Object.entries(data.personalRecords).sort(([,a],[,b])=>b.e1rm-a.e1rm)[0];
  return(
    <div className="tab-content">
      <div className="hero-header">
        <div>
          <div className="hero-greeting">IRON LOG</div>
          <div className="hero-sub">{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</div>
        </div>
        <div className="streak-badge"><I n="fire" s={16}/><span>{streak}d</span></div>
      </div>
      <div className="stats-row">
        <StatCard label="Treinos" value={data.workouts.length} icon="dumbbell" color="#f97316"/>
        <StatCard label="Volume 7d" value={`${(weekVol/1000).toFixed(1)}t`} icon="bolt" color="#06b6d4"/>
        <StatCard label="Streak" value={`${streak}d`} icon="fire" color="#ef4444"/>
      </div>
      {topPR&&(
        <div className="pr-highlight">
          <div className="prh-label"><I n="star" s={13}/> Melhor 1RM</div>
          <div className="prh-ex">{topPR[0]}</div>
          <div className="prh-val">{topPR[1].e1rm.toFixed(1)} <span>kg</span></div>
          <div className="prh-sub">{topPR[1].weight}kg × {topPR[1].reps} · {fmtDate(topPR[1].date)}</div>
        </div>
      )}
      <button className="cta-btn" onClick={()=>setTab("new")}><I n="plus" s={20}/>INICIAR TREINO</button>

      {/* HIIT nudge banner — shows if last workout was today */}
      {(()=>{
        const last=[...data.workouts].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
        if(!last||last.date!==today())return null;
        return(
          <button className="hiit-banner-btn" onClick={()=>setTab("hiit")}>
            <div className="hiit-banner-left">
              <span className="hiit-banner-fire">🔥</span>
              <div>
                <div className="hiit-banner-title">Adicione 10 min de HIIT agora</div>
                <div className="hiit-banner-sub">+300% lipólise · −2,5kg gordura/mês · seu glicogênio está esgotado — hora ideal</div>
              </div>
            </div>
            <div className="hiit-banner-arrow">→</div>
          </button>
        );
      })()}
      <div className="home-actions">
        <button className="home-action-btn" onClick={()=>setTab("templates")}><I n="template" s={20}/><span>Programas</span></button>
        <button className="home-action-btn" onClick={()=>setTab("lists")}><I n="list" s={20}/><span>Minhas Listas</span></button>
      </div>
      <div className="home-actions" style={{marginTop:-4}}>
        <button className="home-action-btn hiit-home-btn" onClick={()=>setTab("hiit")}><I n="flame" s={20}/><span>HIIT</span></button>
        <button className="home-action-btn" onClick={()=>setTab("progress")}><I n="chart" s={20}/><span>Evolução</span></button>
      </div>
      {recent.length>0&&(
        <div className="section">
          <div className="section-title">Histórico Recente</div>
          {recent.map(w=>(
            <WorkoutCard key={w.id} workout={w} maxLoads={data.maxLoads} onDelete={()=>setData(d=>({...d,workouts:d.workouts.filter(x=>x.id!==w.id)}))}/>
          ))}
        </div>
      )}
      {!recent.length&&(
        <div className="empty-state">
          <div className="empty-icon"><I n="dumbbell" s={44}/></div>
          <div className="empty-title">Sem treinos ainda</div>
          <div className="empty-sub">Comece agora ou escolha um programa!</div>
        </div>
      )}
    </div>
  );
}
function StatCard({label,value,icon,color}){
  return(<div className="stat-card" style={{"--ac":color}}><div className="stat-icon"><I n={icon} s={18}/></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>);
}
function WorkoutCard({workout,maxLoads,onDelete}){
  const vol=workout.exercises.reduce((s,ex)=>s+calcVolume(ex.sets),0);
  const sets=workout.exercises.reduce((s,ex)=>s+ex.sets.length,0);
  return(
    <div className="workout-card">
      <div className="wc-top">
        <div><div className="wc-name">{workout.name}</div><div className="wc-date">{fmtDate(workout.date)}</div></div>
        <button className="icon-btn danger" onClick={onDelete}><I n="trash" s={14}/></button>
      </div>
      <div className="wc-stats"><span>{workout.exercises.length} exercícios</span><span>{sets} séries</span><span>{vol.toFixed(0)} kg vol.</span></div>
      <div className="wc-chips">
        {workout.exercises.slice(0,3).map((ex,i)=>{
          const ml=maxLoads[ex.name],myMax=Math.max(...ex.sets.filter(s=>s.weight).map(s=>parseFloat(s.weight)),0),isPR=ml&&myMax>=ml.weight;
          return <div key={i} className={`ex-chip${isPR?" pr-chip":""}`}>{isPR?"🏆 ":""}{ex.name}</div>;
        })}
        {workout.exercises.length>3&&<div className="ex-chip muted">+{workout.exercises.length-3}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function TemplatesTab({data,setData,setTab,setNewWorkoutFromTemplate}){
  const[sel,setSel]=useState(null);
  const[selDay,setSelDay]=useState(null);
  if(selDay!==null&&sel){
    const tpl=TRAINING_TEMPLATES.find(t=>t.id===sel),day=tpl.days[selDay];
    return(
      <div className="tab-content">
        <button className="back-btn" onClick={()=>setSelDay(null)}>← {tpl.name}</button>
        <div className="page-title">{day.name}</div>
        <div className="day-ex-list">
          {day.exercises.map((ex,i)=>(
            <div key={i} className="day-ex-row">
              <div className="day-ex-idx">{i+1}</div>
              <div className="day-ex-info"><div className="day-ex-name">{ex.name}</div><div className="day-ex-sets">{ex.sets}×{ex.reps}</div><div className="day-ex-note">{ex.note}</div></div>
            </div>
          ))}
        </div>
        <button className="cta-btn" onClick={()=>{setNewWorkoutFromTemplate(day,tpl);setSelDay(null);setSel(null);setTab("new");}}><I n="bolt" s={18}/>INICIAR ESTE TREINO</button>
        <button className="ghost-btn" onClick={()=>{setData(d=>({...d,savedLists:[...(d.savedLists||[]),{id:Date.now(),name:day.name,exercises:day.exercises.map(e=>e.name),source:tpl.name}]}));alert(`Lista "${day.name}" salva!`);}}><I n="save" s={15}/> Salvar como lista</button>
      </div>
    );
  }
  if(sel){
    const tpl=TRAINING_TEMPLATES.find(t=>t.id===sel);
    return(
      <div className="tab-content">
        <button className="back-btn" onClick={()=>setSel(null)}>← Programas</button>
        <div className="tpl-detail-header" style={{"--tc":tpl.color}}>
          <div className="tpl-detail-tag" style={{color:tpl.color}}>{tpl.tag}</div>
          <div className="tpl-detail-name">{tpl.name}</div>
          <div className="tpl-detail-full">{tpl.fullName}</div>
          <div className="tpl-detail-desc">{tpl.description}</div>
          <div className="tpl-detail-proto"><I n="bolt" s={13}/> {tpl.protocol}</div>
        </div>
        <div className="section-title" style={{marginTop:20}}>Dias de Treino</div>
        {tpl.days.map((day,i)=>(
          <button key={i} className="day-card" onClick={()=>setSelDay(i)}>
            <div className="day-card-num" style={{color:tpl.color}}>DIA {i+1}</div>
            <div className="day-card-name">{day.name}</div>
            <div className="day-card-exs">{day.exercises.map(e=>e.name).join(" · ")}</div>
            <div className="day-card-arrow">→</div>
          </button>
        ))}
      </div>
    );
  }
  return(
    <div className="tab-content">
      <div className="page-title">Programas</div>
      <div className="tpl-subtitle">Metodologias baseadas em ciência.</div>
      <div className="tpl-list">
        {TRAINING_TEMPLATES.map(t=>(
          <button key={t.id} className="tpl-card" onClick={()=>setSel(t.id)} style={{"--tc":t.color}}>
            <div className="tpl-card-top">
              <div><div className="tpl-card-name">{t.name}</div><div className="tpl-card-full">{t.fullName}</div></div>
              <div className="tpl-tag" style={{background:t.color+"22",color:t.color,border:`1px solid ${t.color}44`}}>{t.tag}</div>
            </div>
            <div className="tpl-card-desc">{t.description}</div>
            <div className="tpl-card-proto"><I n="bolt" s={12}/> {t.protocol}</div>
            <div className="tpl-card-days">{t.days.length} dias de treino</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LISTS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ListsTab({data,setData,setTab,setNewWorkoutFromList}){
  const[creating,setCreating]=useState(false);
  const[listName,setListName]=useState("");
  const[selGroup,setSelGroup]=useState("Peito");
  const[picked,setPicked]=useState([]);
  const[customEx,setCustomEx]=useState("");

  if(creating){return(
    <div className="tab-content">
      <button className="back-btn" onClick={()=>{setCreating(false);setPicked([]);}}>← Minhas Listas</button>
      <div className="page-title">Nova Lista</div>
      <input className="text-input" value={listName} onChange={e=>setListName(e.target.value)} placeholder="Nome da lista..." style={{marginBottom:14}}/>
      <div className="group-tabs">{MUSCLE_GROUPS.map(g=><button key={g} className={`group-tab${selGroup===g?" active":""}`} onClick={()=>setSelGroup(g)}>{g}</button>)}</div>
      <div className="ex-list">{(DEFAULT_EXERCISES[selGroup]||[]).map(ex=>{const s=picked.includes(ex);return <button key={ex} className={`ex-option${s?" selected":""}`} onClick={()=>setPicked(p=>s?p.filter(e=>e!==ex):[...p,ex])}>{s?"✓ ":""}{ex}</button>;})}</div>
      <div className="custom-ex-row"><input className="text-input flex1" value={customEx} onChange={e=>setCustomEx(e.target.value)} placeholder="Exercício personalizado..."/><button className="icon-btn accent" onClick={()=>{if(customEx.trim()){setPicked(p=>[...p,customEx.trim()]);setCustomEx("");}}}><I n="plus" s={16}/></button></div>
      {picked.length>0&&<div className="picked-preview"><div className="section-title">Selecionados ({picked.length})</div><div className="picked-chips">{picked.map((ex,i)=><div key={i} className="picked-chip">{ex}<button onClick={()=>setPicked(p=>p.filter(e=>e!==ex))}>×</button></div>)}</div></div>}
      <button className="cta-btn" style={{marginTop:16}} onClick={()=>{if(!listName.trim()||!picked.length)return;setData(d=>({...d,savedLists:[...(d.savedLists||[]),{id:Date.now(),name:listName.trim(),exercises:picked,source:"Personalizado"}]}));setCreating(false);setListName("");setPicked([]);}}><I n="save" s={18}/> SALVAR LISTA</button>
    </div>
  );}
  return(
    <div className="tab-content">
      <div className="page-title">Minhas Listas</div>
      <button className="add-ex-btn" onClick={()=>setCreating(true)}><I n="plus" s={18}/> Criar Nova Lista</button>
      {(!data.savedLists||!data.savedLists.length)?<div className="empty-state"><div className="empty-icon"><I n="list" s={40}/></div><div className="empty-title">Sem listas salvas</div></div>:
        data.savedLists.map(list=>(
          <div key={list.id} className="list-card">
            <div className="list-card-header"><div><div className="list-card-name">{list.name}</div>{list.source&&<div className="list-card-source">{list.source}</div>}</div><button className="icon-btn danger" onClick={()=>setData(d=>({...d,savedLists:d.savedLists.filter(l=>l.id!==list.id)}))}><I n="trash" s={14}/></button></div>
            <div className="list-card-exs">{list.exercises.map((ex,i)=><span key={i} className="ex-chip">{ex}</span>)}</div>
            <button className="list-start-btn" onClick={()=>{setNewWorkoutFromList(list);setTab("new");}}><I n="bolt" s={14}/> Usar esta lista</button>
          </div>
        ))
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HIIT NUDGE MODAL — aparece ao salvar treino
// ═══════════════════════════════════════════════════════════════════════════════
function HIITNudgeModal({ onGoHIIT, onDismiss }) {
  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="nudge-card" onClick={e => e.stopPropagation()}>
        <div className="nudge-fire">🔥</div>
        <div className="nudge-title">Treino salvo!</div>
        <div className="nudge-subtitle">Agora é a hora certa para o HIIT</div>

        <div className="nudge-stats">
          <div className="nudge-stat">
            <div className="nudge-stat-val">+300%</div>
            <div className="nudge-stat-lbl">lipólise pós-treino</div>
          </div>
          <div className="nudge-divider"/>
          <div className="nudge-stat">
            <div className="nudge-stat-val">−2,5kg</div>
            <div className="nudge-stat-lbl">gordura em 1 mês</div>
          </div>
          <div className="nudge-divider"/>
          <div className="nudge-stat">
            <div className="nudge-stat-val">10 min</div>
            <div className="nudge-stat-lbl">é tudo que precisa</div>
          </div>
        </div>

        <div className="nudge-science">
          Seu glicogênio está esgotado — o corpo queima <strong>3× mais gordura</strong> agora do que em qualquer outro momento. 10 min de HIIT equivalem a 40 min de cardio em jejum.
        </div>

        <button className="nudge-cta" onClick={onGoHIIT}>
          <I n="flame" s={20}/> FAZER HIIT AGORA
        </button>
        <button className="nudge-skip" onClick={onDismiss}>Hoje não, obrigado</button>
      </div>
    </div>
  );
}


function NewWorkoutTab({data,setData,setTab,templateInit,clearTemplate}){
  const[name,setName]=useState(templateInit?.name||"Treino de "+new Date().toLocaleDateString("pt-BR",{weekday:"long"}));
  const[date,setDate]=useState(today());
  const[exercises,setExercises]=useState(
    templateInit?.exercises
      ?templateInit.exercises.map(ex=>({name:ex.name,sets:Array.from({length:ex.sets},()=>({weight:"",reps:String(ex.reps),done:false})),note:ex.note||""}))
      :[]
  );
  const[showAddEx,setShowAddEx]=useState(false);
  const[selGroup,setSelGroup]=useState("Peito");
  const[customEx,setCustomEx]=useState("");
  const[saved,setSaved]=useState(false);
  const[showNudge,setShowNudge]=useState(false);
  const[restTimer,setRestTimer]=useState(null);
  const[restSeconds,setRestSeconds]=useState(90);
  const[mediaModal,setMediaModal]=useState(null);

  const addExercise=n=>{const lw=data.maxLoads[n]?.weight||"";setExercises(p=>[...p,{name:n,sets:[{weight:String(lw),reps:"",done:false}],note:""}]);setShowAddEx(false);};
  const addSet=ei=>setExercises(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:[...ex.sets,{weight:ex.sets[ex.sets.length-1]?.weight||"",reps:"",done:false}]}));
  const updSet=(ei,si,f,v)=>setExercises(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:ex.sets.map((s,j)=>j!==si?s:{...s,[f]:v})}));
  const completeSet=(ei,si)=>{
    const set=exercises[ei].sets[si];
    if(!set.weight||!set.reps)return;
    setExercises(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:ex.sets.map((s,j)=>j!==si?s:{...s,done:true})}));
    setRestTimer({seconds:restSeconds});
  };
  const save=()=>{
    if(!exercises.length)return;
    const workout={id:Date.now(),name,date,exercises};
    const prs={...data.personalRecords},maxL={...data.maxLoads};
    exercises.forEach(ex=>ex.sets.forEach(set=>{const w=parseFloat(set.weight),r=parseInt(set.reps);if(!w||!r)return;const rm=e1rm(w,r);if(!prs[ex.name]||rm>prs[ex.name].e1rm)prs[ex.name]={e1rm:rm,weight:w,reps:r,date};if(!maxL[ex.name]||w>maxL[ex.name].weight)maxL[ex.name]={weight:w,date};}));
    setData(d=>({...d,workouts:[...d.workouts,workout],personalRecords:prs,maxLoads:maxL}));
    setSaved(true);clearTemplate&&clearTemplate();
    setTimeout(()=>{ setSaved(false); setShowNudge(true); },1200);
  };

  return(
    <div className="tab-content">
      {restTimer&&<RestTimer seconds={restTimer.seconds} onDone={()=>setRestTimer(null)} onDismiss={()=>setRestTimer(null)}/>}
      {mediaModal&&<ExerciseMediaModal exName={mediaModal} onClose={()=>setMediaModal(null)}/>}
      {showNudge&&<HIITNudgeModal onGoHIIT={()=>{setShowNudge(false);setTab("hiit");}} onDismiss={()=>{setShowNudge(false);setTab("home");}}/>}
      <div className="page-title">Novo Treino</div>
      <div className="rest-config"><I n="clock" s={14}/><span>Descanso:</span>{[60,90,120,180,240].map(s=><button key={s} className={`rest-preset${restSeconds===s?" active":""}`} onClick={()=>setRestSeconds(s)}>{s>=60?`${s/60}min`:`${s}s`}</button>)}</div>
      <div className="field-group" style={{marginTop:10}}>
        <input className="text-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do treino"/>
        <input className="text-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      </div>
      {exercises.map((ex,ei)=>{
        const maxL=data.maxLoads[ex.name],curMax=Math.max(...ex.sets.filter(s=>s.weight).map(s=>parseFloat(s.weight)),0),isNewPR=maxL&&curMax>maxL.weight;
        const rm1=ex.sets.filter(s=>s.weight&&s.reps).length?Math.max(...ex.sets.filter(s=>s.weight&&s.reps).map(s=>e1rm(parseFloat(s.weight),parseInt(s.reps)))):null;
        const doneSets=ex.sets.filter(s=>s.done).length;
        return(
          <div key={ei} className="ex-block">
            <div className="ex-block-header">
              <div className="ex-block-name-col">
                <span className="ex-block-name">{ex.name}</span>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {maxL&&<span className="max-load-badge"><I n="weight" s={11}/> Máx: {maxL.weight}kg</span>}
                  {isNewPR&&<span className="pr-new-badge">🏆 NOVO RECORDE!</span>}
                  {doneSets>0&&<span className="done-badge">✓ {doneSets}/{ex.sets.length}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="icon-btn media-btn" onClick={()=>setMediaModal(ex.name)}><I n="video" s={15}/></button>
                <button className="icon-btn danger" onClick={()=>setExercises(p=>p.filter((_,i)=>i!==ei))}><I n="trash" s={14}/></button>
              </div>
            </div>
            {ex.note&&<div className="ex-note">{ex.note}</div>}
            <div className="sets-header"><span>Série</span><span>Kg</span><span>Reps</span><span>✓</span></div>
            {ex.sets.map((set,si)=>{
              const setLoad=parseFloat(set.weight)||0,isSetMax=maxL&&setLoad>maxL.weight,filled=set.weight&&set.reps;
              return(
                <div key={si} className={`set-row${isSetMax?" set-row-pr":""}${set.done?" set-done":""}`}>
                  <span className="set-num">{set.done?"✓":si+1}</span>
                  <input className="set-input" type="number" min="0" step="0.5" value={set.weight} onChange={e=>updSet(ei,si,"weight",e.target.value)} placeholder="0" disabled={set.done}/>
                  <input className="set-input" type="number" min="0" value={set.reps} onChange={e=>updSet(ei,si,"reps",e.target.value)} placeholder="0" disabled={set.done}/>
                  {set.done
                    ?<button className="set-done-btn done" onClick={()=>updSet(ei,si,"done",false)}><I n="check" s={14}/></button>
                    :<button className={`set-done-btn${filled?" ready":""}`} onClick={()=>completeSet(ei,si)} disabled={!filled}><I n="check" s={14}/></button>
                  }
                </div>
              );
            })}
            <button className="add-set-btn" onClick={()=>addSet(ei)}>+ Série</button>
            {rm1&&<div className="ex-1rm">1RM est.: <strong>{rm1.toFixed(1)} kg</strong> · Vol.: <strong>{calcVolume(ex.sets).toFixed(0)} kg</strong></div>}
          </div>
        );
      })}
      {showAddEx?(
        <div className="add-ex-panel">
          <div className="add-ex-panel-title">Adicionar Exercício</div>
          {data.savedLists&&data.savedLists.length>0&&(
            <div className="quick-lists">
              <div className="section-title" style={{marginBottom:8}}>Das Minhas Listas</div>
              {data.savedLists.map(list=>(
                <div key={list.id} className="quick-list-row"><span className="quick-list-name">{list.name}</span><div className="quick-list-exs">{list.exercises.map(ex=><button key={ex} className="ex-option" onClick={()=>addExercise(ex)}>{ex}</button>)}</div></div>
              ))}
              <div className="divider"/>
            </div>
          )}
          <div className="group-tabs">{MUSCLE_GROUPS.map(g=><button key={g} className={`group-tab${selGroup===g?" active":""}`} onClick={()=>setSelGroup(g)}>{g}</button>)}</div>
          <div className="ex-list">{(DEFAULT_EXERCISES[selGroup]||[]).map(ex=>{const ml=data.maxLoads[ex];return <button key={ex} className="ex-option" onClick={()=>addExercise(ex)}>{ex}{ml?<span className="ex-opt-max"> {ml.weight}kg</span>:""}</button>;})}</div>
          <div className="custom-ex-row"><input className="text-input flex1" value={customEx} onChange={e=>setCustomEx(e.target.value)} placeholder="Exercício personalizado..."/><button className="icon-btn accent" onClick={()=>{if(customEx.trim())addExercise(customEx.trim());setCustomEx("");}}><I n="check" s={16}/></button></div>
          <button className="ghost-btn" onClick={()=>setShowAddEx(false)}>Cancelar</button>
        </div>
      ):(
        <button className="add-ex-btn" onClick={()=>setShowAddEx(true)}><I n="plus" s={18}/> Adicionar Exercício</button>
      )}
      {exercises.length>0&&<button className={`cta-btn${saved?" success":""}`} onClick={save}>{saved?<><I n="check" s={20}/> SALVO!</>:<><I n="save" s={18}/> SALVAR TREINO</>}</button>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ProgressTab({data,setData}){
  const[selEx,setSelEx]=useState("");
  const[bwInput,setBwInput]=useState("");
  const[bwDate,setBwDate]=useState(today());
  const[chartMode,setChartMode]=useState("e1rm");
  const allEx=[...new Set(data.workouts.flatMap(w=>w.exercises.map(e=>e.name)))].sort();
  const chartData=selEx?data.workouts.filter(w=>w.exercises.some(e=>e.name===selEx)).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(w=>{const ex=w.exercises.find(e=>e.name===selEx);const vs=ex.sets.filter(s=>s.weight&&s.reps);if(!vs.length)return null;return{label:fmtDate(w.date),e1rm:Math.max(...vs.map(s=>e1rm(parseFloat(s.weight),parseInt(s.reps)))),volume:calcVolume(ex.sets),weight:Math.max(...ex.sets.filter(s=>s.weight).map(s=>parseFloat(s.weight)))};}).filter(Boolean):[];
  const bwData=[...data.bodyWeight].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(b=>({label:fmtDate(b.date),value:b.weight}));
  const weekMap={};data.workouts.forEach(w=>{const d=new Date(w.date+"T00:00:00"),mon=new Date(d);mon.setDate(d.getDate()-(d.getDay()||7)+1);const k=mon.toISOString().split("T")[0];weekMap[k]=(weekMap[k]||0)+w.exercises.reduce((s,ex)=>s+calcVolume(ex.sets),0);});
  const weekData=Object.entries(weekMap).sort(([a],[b])=>a>b?1:-1).slice(-8).map(([k,v])=>({label:fmtDate(k),value:v}));
  const curBW=bwData.length?bwData[bwData.length-1].value:null,prevBW=bwData.length>1?bwData[bwData.length-2].value:null;
  return(
    <div className="tab-content">
      <div className="page-title">Evolução</div>
      <div className="card">
        <div className="card-header"><I n="weight" s={15}/> Peso Corporal{curBW&&<span className="card-badge">{curBW} kg {prevBW?((curBW-prevBW)>0?"+":"")+(curBW-prevBW).toFixed(1)+" kg":""}</span>}</div>
        <SparkLine data={bwData} color="#06b6d4"/>
        <div className="bw-row"><input className="text-input flex1" type="number" step="0.1" value={bwInput} onChange={e=>setBwInput(e.target.value)} placeholder="Peso (kg)"/><input className="text-input" style={{width:130}} type="date" value={bwDate} onChange={e=>setBwDate(e.target.value)}/><button className="icon-btn accent" onClick={()=>{if(!bwInput)return;setData(d=>({...d,bodyWeight:[...d.bodyWeight.filter(b=>b.date!==bwDate),{date:bwDate,weight:parseFloat(bwInput)}]}));setBwInput("");}}><I n="plus" s={16}/></button></div>
      </div>
      <div className="card">
        <div className="card-header"><I n="chart" s={15}/> Progresso por Exercício</div>
        <select className="text-input" value={selEx} onChange={e=>setSelEx(e.target.value)}><option value="">Selecione um exercício...</option>{allEx.map(ex=>{const ml=data.maxLoads[ex];return <option key={ex} value={ex}>{ex}{ml?` (máx ${ml.weight}kg)`:""}</option>;})}</select>
        {selEx&&data.maxLoads[selEx]&&<div className="max-load-info"><I n="weight" s={14}/> Carga máxima: <strong>{data.maxLoads[selEx].weight} kg</strong> em {fmtDate(data.maxLoads[selEx].date)}</div>}
        {selEx&&chartData.length>0&&(<>
          <div className="chart-tabs">{[["e1rm","1RM Est."],["weight","Carga Máx."],["volume","Volume"]].map(([k,l])=><button key={k} className={chartMode===k?"active":""} onClick={()=>setChartMode(k)}>{l}</button>)}</div>
          <SparkLine data={chartData.map(d=>({label:d.label,value:d[chartMode]}))} color={chartMode==="e1rm"?"#f97316":chartMode==="weight"?"#a78bfa":"#22c55e"}/>
          {chartData.length>1&&(()=>{const first=chartData[0][chartMode],last=chartData[chartData.length-1][chartMode],pct=((last-first)/first*100).toFixed(1);return(<div className="chart-stats-row"><div className="csr"><span>Início</span><strong>{first.toFixed(1)}</strong></div><div className="csr"><span>Atual</span><strong>{last.toFixed(1)}</strong></div><div className={`csr ${pct>0?"pos":"neg"}`}><span>Evolução</span><strong>{pct>0?"+":""}{pct}%</strong></div></div>);})()}
        </>)}
      </div>
      <div className="card"><div className="card-header"><I n="bolt" s={15}/> Volume Semanal (8 semanas)</div><SparkLine data={weekData} color="#22c55e"/></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECORDS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function RecordsTab({data}){
  const[mode,setMode]=useState("1rm");
  const[cat,setCat]=useState("Todos");
  const prs1rm=Object.entries(data.personalRecords).map(([name,pr])=>({name,...pr})).sort((a,b)=>b.e1rm-a.e1rm);
  const prsLoad=Object.entries(data.maxLoads).map(([name,ml])=>({name,...ml})).sort((a,b)=>b.weight-a.weight);
  const cats=["Todos",...MUSCLE_GROUPS];
  const filterFn=list=>cat==="Todos"?list:list.filter(pr=>(DEFAULT_EXERCISES[cat]||[]).some(ex=>pr.name.toLowerCase().includes(ex.toLowerCase())||ex.toLowerCase().includes(pr.name.toLowerCase())));
  const list=filterFn(mode==="1rm"?prs1rm:prsLoad);
  return(
    <div className="tab-content">
      <div className="page-title">Recordes</div>
      <div className="mode-switch"><button className={mode==="1rm"?"active":""} onClick={()=>setMode("1rm")}>1RM Estimado</button><button className={mode==="load"?"active":""} onClick={()=>setMode("load")}>Carga Máxima</button></div>
      {!prs1rm.length?<div className="empty-state"><div className="empty-icon"><I n="trophy" s={44}/></div><div className="empty-title">Sem recordes</div><div className="empty-sub">Salve treinos para ver seus PRs!</div></div>:(
        <>
          <div className="cat-scroll">{cats.map(c=><button key={c} className={`cat-btn${cat===c?" active":""}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
          <div className="pr-list">{list.map((pr,i)=>(
            <div key={pr.name} className="pr-card">
              <div className="pr-rank">{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
              <div className="pr-info"><div className="pr-name">{pr.name}</div><div className="pr-detail">{mode==="1rm"?`${pr.weight}kg × ${pr.reps} reps · ${fmtDate(pr.date)}`:`Carga máxima · ${fmtDate(pr.date)}`}</div></div>
              <div className="pr-e1rm"><div className="pr-e1rm-val">{(mode==="1rm"?pr.e1rm:pr.weight).toFixed(1)}</div><div className="pr-e1rm-lbl">{mode==="1rm"?"kg est.":"kg lift"}</div></div>
            </div>
          ))}</div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// IRON AI TAB — voice assistant embedded
// ═══════════════════════════════════════════════════════════════════════════════

const QUICK_CMDS = [
  "Qual meu recorde no supino?","Registra supino 100kg 5 reps",
  "Inicia treino de perna","Muda descanso pra 2 minutos",
  "Que exercícios faço hoje?","Quanto falta pra bater meu PR?",
];

function buildAIPrompt(appData, currentWorkout) {
  const prs = appData?.personalRecords
    ? Object.entries(appData.personalRecords).map(([n,p])=>`${n}: ${p.e1rm.toFixed(1)}kg 1RM (${p.weight}kg×${p.reps})`).slice(0,15).join(", ")
    : "Nenhum";
  const maxL = appData?.maxLoads
    ? Object.entries(appData.maxLoads).map(([n,m])=>`${n}: ${m.weight}kg`).slice(0,15).join(", ")
    : "Nenhum";
  const recent = appData?.workouts
    ? [...appData.workouts].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).map(w=>`${w.date}: ${w.name}`).join(" | ")
    : "Nenhum";
  const cwCtx = currentWorkout
    ? `Treino ATIVO: "${currentWorkout.name}" — ${currentWorkout.exercises.map(e=>`${e.name} (${e.sets.filter(s=>s.done).length}/${e.sets.length} séries)`).join(", ")}`
    : "Sem treino ativo.";
  return `Você é o IRON AI, assistente de treino embutido num app de musculação/powerlifting.
Responda APENAS com JSON válido, nunca texto puro.

DADOS DO ATLETA:
- PRs 1RM: ${prs}
- Cargas máximas: ${maxL}
- Últimos treinos: ${recent}
- ${cwCtx}

AÇÕES DISPONÍVEIS:
- ADD_SET: {type:"ADD_SET", exercise, weight, reps}
- START_WORKOUT: {type:"START_WORKOUT", name, exercises:[...]}
- QUERY_PR: {type:"QUERY_PR", exercise}
- SET_REST: {type:"SET_REST", seconds}
- null: só resposta de texto

FORMATO OBRIGATÓRIO:
{"response":"frase curta motivacional em português (máx 2 frases)","action":{...} ou null}

EXEMPLOS:
"Registra supino 100kg 8 reps" → {"response":"100kg por 8 no supino! Anotado!","action":{"type":"ADD_SET","exercise":"Supino Reto","weight":100,"reps":8}}
"Qual meu recorde no agachamento" → {"response":"Seu agachamento está em X kg estimado!","action":{"type":"QUERY_PR","exercise":"Agachamento"}}
"Falta quanto pro PR?" → {"response":"Analise os dados e responda motivado","action":null}
Seja direto, use linguagem de academia.`;
}

function Waveform({active,analyzing}){
  return(
    <div className="waveform">
      {Array.from({length:20}).map((_,i)=>(
        <div key={i} className={`wave-bar${active?" active":""}${analyzing?" analyzing":""}`}
          style={{animationDelay:`${(i*0.07)%0.9}s`,animationDuration:active?`${0.4+(i%5)*0.1}s`:"0s"}}/>
      ))}
    </div>
  );
}

function AIActionCard({action,onApply,applied}){
  if(!action)return null;
  const labels={ADD_SET:{icon:"dumbbell",color:"#f97316",label:"Adicionar Série"},START_WORKOUT:{icon:"bolt",color:"#22c55e",label:"Iniciar Treino"},QUERY_PR:{icon:"trophy",color:"#fbbf24",label:"Consulta PR"},SET_REST:{icon:"clock",color:"#06b6d4",label:"Ajustar Descanso"},COMPLETE_SET:{icon:"check",color:"#a78bfa",label:"Completar Série"}};
  const meta=labels[action.type]||{icon:"bolt",color:"#888",label:action.type};
  return(
    <div className="ac-card" style={{"--acc":meta.color}}>
      <div className="ac-head"><span className="ac-icon-wrap"><I n={meta.icon} s={14}/></span><span className="ac-lbl">{meta.label}</span>{applied&&<span className="ac-done">✓ Aplicado</span>}</div>
      <div className="ac-body">
        {action.type==="ADD_SET"&&<><strong>{action.exercise}</strong> — {action.weight}kg × {action.reps} reps</>}
        {action.type==="START_WORKOUT"&&<><strong>{action.name}</strong>: {action.exercises?.join(", ")}</>}
        {action.type==="QUERY_PR"&&<>PR de <strong>{action.exercise}</strong></>}
        {action.type==="SET_REST"&&<>Descanso: <strong>{action.seconds}s</strong></>}
      </div>
      {!applied&&action.type!=="QUERY_PR"&&<button className="ac-apply" onClick={()=>onApply(action)}>Aplicar no treino →</button>}
    </div>
  );
}

function IronAITab({data, setData, setTab, setTemplateInit}){
  const[messages,setMessages]=useState([{id:0,role:"ai",text:"E aí atleta! Sou o IRON AI 🔥 Pode falar ou digitar. Registro séries, consulto seus recordes e ajusto o treino pela sua voz.",time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);
  const[input,setInput]=useState("");
  const[listening,setListening]=useState(false);
  const[analyzing,setAnalyzing]=useState(false);
  const[speaking,setSpeaking]=useState(false);
  const[transcript,setTranscript]=useState("");
  const[applied,setApplied]=useState(new Set());
  const[micPerm,setMicPerm]=useState("unknown");
  const[aiWorkout,setAiWorkout]=useState(null); // workout being built by voice

  const recogRef=useRef(null),synthRef=useRef(window.speechSynthesis),endRef=useRef(null);
  const msgId=useRef(1),finalRef=useRef(""),sendRef=useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  useEffect(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setMicPerm("unsupported");return;}
    navigator.permissions?.query({name:"microphone"}).then(r=>{setMicPerm(r.state);r.onchange=()=>setMicPerm(r.state);}).catch(()=>setMicPerm("unknown"));
  },[]);

  const speak=useCallback(text=>{
    if(!synthRef.current)return;
    synthRef.current.cancel();
    const u=new SpeechSynthesisUtterance(text);u.lang="pt-BR";u.rate=1.05;
    const v=synthRef.current.getVoices().find(v=>v.lang.startsWith("pt"));if(v)u.voice=v;
    u.onstart=()=>setSpeaking(true);u.onend=()=>setSpeaking(false);
    synthRef.current.speak(u);
  },[]);

  const applyAction=useCallback((action,mid)=>{
    const d=getStorage();
    if(action.type==="ADD_SET"){
      let cw=aiWorkout||{id:Date.now(),name:"Treino via IA",date:today(),exercises:[]};
      const idx=cw.exercises.findIndex(e=>e.name.toLowerCase().includes(action.exercise.toLowerCase()));
      if(idx>=0)cw.exercises[idx].sets.push({weight:String(action.weight),reps:String(action.reps),done:true});
      else cw.exercises.push({name:action.exercise,sets:[{weight:String(action.weight),reps:String(action.reps),done:true}],note:""});
      setAiWorkout({...cw});
      const rm=e1rm(action.weight,action.reps);
      if(!d.personalRecords[action.exercise]||rm>d.personalRecords[action.exercise].e1rm)d.personalRecords[action.exercise]={e1rm:rm,weight:action.weight,reps:action.reps,date:today()};
      if(!d.maxLoads[action.exercise]||action.weight>d.maxLoads[action.exercise].weight)d.maxLoads[action.exercise]={weight:action.weight,date:today()};
      // save workout immediately
      const ewIdx=d.workouts.findIndex(w=>w.id===cw.id);
      if(ewIdx>=0)d.workouts[ewIdx]={...cw};else d.workouts.push({...cw});
      setData(_=>({...d}));setStorage(d);
    } else if(action.type==="START_WORKOUT"){
      const nw={id:Date.now(),name:action.name||"Treino via IA",date:today(),exercises:(action.exercises||[]).map(n=>({name:n,sets:[],note:""}))};
      setAiWorkout(nw);
      setTemplateInit({name:nw.name,exercises:(action.exercises||[]).map(n=>({name:n,sets:3,reps:10,note:""}))});
    } else if(action.type==="SET_REST"){
      localStorage.setItem("ironlog_rest_seconds",String(action.seconds));
    }
    setApplied(p=>new Set([...p,mid]));
  },[aiWorkout,setData,setTemplateInit]);

  const sendMessage=useCallback(async(text,trans="")=>{
    if(!text.trim())return;
    const uid=msgId.current++;
    setMessages(p=>[...p,{id:uid,role:"user",text,transcript:trans||null,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);
    setAnalyzing(true);setInput("");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:buildAIPrompt(data,aiWorkout),messages:[{role:"user",content:text}]})});
      const rd=await r.json();
      const raw=rd.content?.[0]?.text||"{}";
      let parsed={};
      try{parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());}catch{parsed={response:raw,action:null};}
      const aid=msgId.current++;
      setMessages(p=>[...p,{id:aid,role:"ai",text:parsed.response||"Entendido!",action:parsed.action||null,onApply:ac=>applyAction(ac,aid),time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);
      speak(parsed.response||"Entendido!");
      if(parsed.action?.type==="QUERY_PR")setApplied(p=>new Set([...p,aid]));
    }catch{
      setMessages(p=>[...p,{id:msgId.current++,role:"ai",text:"⚠️ IA offline. Verifique a conexão.",time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);
    }finally{setAnalyzing(false);}
  },[data,aiWorkout,applyAction,speak]);

  useEffect(()=>{sendRef.current=sendMessage;},[sendMessage]);

  const startListening=useCallback(()=>{
    if(recogRef.current){try{recogRef.current.abort();}catch{}recogRef.current=null;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert("Reconhecimento de voz não suportado. Use Chrome/Edge.");return;}
    const rec=new SR();rec.lang="pt-BR";rec.continuous=false;rec.interimResults=true;rec.maxAlternatives=1;
    finalRef.current="";
    rec.onstart=()=>{setListening(true);setTranscript("");finalRef.current="";};
    rec.onresult=e=>{let interim="",fin="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)fin+=t;else interim+=t;}if(fin)finalRef.current+=fin;setTranscript((finalRef.current+interim).trim());};
    rec.onerror=e=>{setListening(false);setTranscript("");if(e.error==="not-allowed"){setMessages(p=>[...p,{id:msgId.current++,role:"ai",text:"❌ Microfone bloqueado. Libere nas configurações do navegador.",time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);}};
    rec.onend=()=>{setListening(false);const cap=finalRef.current.trim();setTranscript("");finalRef.current="";if(cap)sendRef.current?.(cap,cap);};
    try{rec.start();recogRef.current=rec;}catch(e){console.error(e);setListening(false);}
  },[]);

  const stopListening=useCallback(()=>{if(!recogRef.current)return;try{recogRef.current.stop();}catch{};},[]);

  const activeSets=aiWorkout?.exercises?.reduce((s,e)=>s+e.sets.filter(x=>x.weight).length,0)||0;

  return(
    <div className="ai-tab">
      {/* AI Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-logo">IA</div>
          <div>
            <div className="ai-title">IRON AI</div>
            <div className="ai-sub">Assistente de treino por voz</div>
          </div>
        </div>
        <div className="ai-status-col">
          <div className="ai-status-row"><div className={`sdot${micPerm==="granted"?" ok":micPerm==="denied"?" err":" warn"}`}/><span>{micPerm==="granted"?"Mic OK":micPerm==="denied"?"Mic bloq.":"Mic?"}</span></div>
          {activeSets>0&&<div className="ai-active-sets">🏋️ {activeSets} séries via IA</div>}
        </div>
      </div>

      {/* Mic banner */}
      {micPerm==="denied"&&<div className="ai-banner err">🎙️ Microfone bloqueado — libere nas configurações do navegador.</div>}
      {(micPerm==="prompt"||micPerm==="unknown")&&<div className="ai-banner info">🎙️ Toque no microfone para liberar o áudio</div>}

      {/* Messages */}
      <div className="ai-messages">
        {messages.map(msg=>(
          <div key={msg.id} className={`ai-bubble ${msg.role}`}>
            {msg.role==="ai"&&<div className="ai-avatar">IA</div>}
            <div className="ai-bubble-body">
              {msg.role==="user"&&msg.transcript&&<div className="ai-transcript">🎙 "{msg.transcript}"</div>}
              <div className="ai-bubble-text">{msg.text}</div>
              {msg.action&&<AIActionCard action={msg.action} onApply={msg.onApply} applied={applied.has(msg.id)}/>}
              <div className="ai-time">{msg.time}</div>
            </div>
          </div>
        ))}
        {listening&&transcript&&<div className="ai-live">
          <span className="ai-live-dot"/><span>{transcript}</span>
        </div>}
        {analyzing&&<div className="ai-bubble ai"><div className="ai-avatar">IA</div><div className="ai-bubble-body"><div className="ai-thinking"><span/><span/><span/></div></div></div>}
        <div ref={endRef}/>
      </div>

      {/* Quick commands */}
      <div className="ai-quick">{QUICK_CMDS.map((c,i)=><button key={i} className="ai-quick-btn" onClick={()=>sendMessage(c)}>{c}</button>)}</div>

      {/* Waveform */}
      <div className="ai-wave-row"><Waveform active={listening||speaking} analyzing={analyzing}/><div className="ai-wave-hint">{listening?"Ouvindo… toque para parar":analyzing?"Processando…":speaking?"Respondendo…":"Toque no mic ou digite"}</div></div>

      {/* Input */}
      <div className="ai-input-row">
        <input className="ai-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage(input)} placeholder="Ou digite aqui..." disabled={listening||analyzing}/>
        <button className={`ai-send${input.trim()?" ready":""}`} onClick={()=>sendMessage(input)} disabled={!input.trim()||analyzing}><I n="send" s={17}/></button>
        <button className={`ai-mic${listening?" on":""}${analyzing?" busy":""}`} onClick={()=>listening?stopListening():startListening()} disabled={analyzing}>
          <I n={listening?"micOff":"mic"} s={22}/>
          {listening&&<span className="mic-ring"/>}
        </button>
      </div>
      <div className="ai-footer">Voz processada localmente · Dados salvos no dispositivo</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// HIIT MODULE — Science-based data & protocols
// ═══════════════════════════════════════════════════════════════════════════════

// Science refs: Gibala et al. 2012, Buchheit & Laursen 2013, Weston et al. 2014
// BPM zones: Karvonen formula (HRR method) — gold standard for HIIT intensity
// Beginner: 6×20-30s @ 85-90% HRmax / 2:1 work:rest — Gibala 2012
// Intermediate: 10×30s @ 90-95% HRmax / 1:1 or 2:1 — Tabata-derived
// Advanced: 20min total (4×4 Norwegian or 8-12×30s Tabata) @ 90-100% HRmax

const HIIT_MODALITIES = [
  { id:"run",    name:"Corrida ao Ar Livre", icon:"run"  },
  { id:"tread",  name:"Esteira",             icon:"run"  },
  { id:"bike",   name:"Bicicleta / Bike",    icon:"bike" },
  { id:"row",    name:"Remo Ergométrico",    icon:"swim" },
  { id:"jump",   name:"Corda / Pular",       icon:"flame"},
  { id:"swim",   name:"Natação",             icon:"swim" },
  { id:"ski",    name:"Ski Ergométrico",     icon:"flame"},
  { id:"custom", name:"Outra Modalidade",    icon:"bolt" },
];

const HIIT_LEVELS = {
  beginner: {
    label:"Iniciante", color:"#22c55e",
    totalMin: 12,
    warmupS: 120,  // 2 min warm-up
    cooldownS: 120,
    workS: 25,      // 20-30s → 25s default
    restS: 75,      // 3:1 ratio — safer for beginners
    rounds: 6,
    intensityPct: [85, 90], // % HRmax
    hrr_pct: [70, 80],      // % HRR (Karvonen)
    rpe: "7-8/10 — difícil, mas mantém forma",
    science: "Gibala et al. 2012: 6 sprints de 20-30s são suficientes para adaptação cardiovascular em iniciantes. Ratio 1:3 minimiza risco de overtraining.",
    cues: ["Mantenha postura ereta","Respire pelo nariz e boca","Reduza pace se não conseguir falar","Não trave os joelhos"],
  },
  intermediate: {
    label:"Intermediário", color:"#f59e0b",
    totalMin: 16,
    warmupS: 180,  // 3 min
    cooldownS: 120,
    workS: 30,      // 30s
    restS: 30,      // 1:1 Tabata-derived
    rounds: 10,
    intensityPct: [90, 95],
    hrr_pct: [80, 88],
    rpe: "8-9/10 — muito difícil, fala apenas palavras curtas",
    science: "Tabata 1996 + Buchheit & Laursen 2013: 10×30s @ 90-95% HRmax com 1:1 ratio provoca maior consumo de VO₂max e EPOC prolongado que treino contínuo.",
    cues: ["Atinja velocidade máxima nos primeiros 5s","Recuperação ativa (trote leve, não parado)","BPM deve cair <70% HRmax no descanso","Aumente carga a cada 4 semanas"],
  },
  advanced: {
    label:"Avançado", color:"#ef4444",
    totalMin: 20,
    warmupS: 300,  // 5 min
    cooldownS: 180,
    workS: 40,      // 40s high-intensity
    restS: 20,      // 2:1 inverse — 40/20
    rounds: 16,     // ~20min total
    intensityPct: [93, 100],
    hrr_pct: [88, 95],
    rpe: "9-10/10 — máximo esforço, incapaz de conversar",
    science: "Weston et al. 2014 / Norwegian 4×4: 16-20 tiros de 40s @ >93% HRmax maximizam adaptação central (VO₂max) e periférica (mitocôndrias musculares). Equivalente a 3-4x volume de treino contínuo.",
    cues: ["Aquecimento obrigatório de 5 min","Nunca pule o cooldown — previne hipotensão","Frequência máx: 3x/semana com 48h descanso","Combine com monitoramento de BPM em tempo real"],
  },
};

// Karvonen formula: Target HR = ((HRmax - HRrest) × intensity%) + HRrest
// HRmax = 220 - age (Tanaka formula more accurate: 208 - 0.7 × age)
function calcHIITZones(age, restHR) {
  const hrMax = Math.round(208 - 0.7 * age);
  const hrr = hrMax - restHR; // Heart Rate Reserve
  return {
    hrMax,
    warm:    { lo: Math.round(hrr * 0.50 + restHR), hi: Math.round(hrr * 0.60 + restHR), label:"Aquecimento",   color:"#06b6d4", pct:"50-60%" },
    aerobic: { lo: Math.round(hrr * 0.60 + restHR), hi: Math.round(hrr * 0.70 + restHR), label:"Aeróbico",      color:"#22c55e", pct:"60-70%" },
    tempo:   { lo: Math.round(hrr * 0.70 + restHR), hi: Math.round(hrr * 0.80 + restHR), label:"Limiar",        color:"#f59e0b", pct:"70-80%" },
    hiit_b:  { lo: Math.round(hrr * 0.80 + restHR), hi: Math.round(hrr * 0.88 + restHR), label:"HIIT Iniciante",color:"#f97316", pct:"80-88%" },
    hiit_i:  { lo: Math.round(hrr * 0.88 + restHR), hi: Math.round(hrr * 0.93 + restHR), label:"HIIT Interm.",  color:"#ef4444", pct:"88-93%" },
    hiit_a:  { lo: Math.round(hrr * 0.93 + restHR), hi: hrMax,                             label:"HIIT Avançado", color:"#dc2626", pct:"93-100%"},
  };
}

// ─── BPM CALCULATOR ──────────────────────────────────────────────────────────
function BpmCalculator({ onClose }) {
  const [age, setAge] = useState(30);
  const [restHR, setRestHR] = useState(65);
  const [computed, setComputed] = useState(null);

  const calc = () => setComputed(calcHIITZones(age, restHR));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{maxHeight:"85dvh"}}>
        <div className="modal-header">
          <div className="modal-title">Calculadora de BPM</div>
          <button className="icon-btn" onClick={onClose}><I n="close" s={16}/></button>
        </div>
        <div className="bpm-info">Fórmula de Karvonen (HRR) — método cientificamente validado para zonas de treino individualizadas.</div>

        <div className="bpm-fields">
          <div className="bpm-field">
            <label>Idade (anos)</label>
            <input className="text-input" type="number" min="15" max="80" value={age} onChange={e=>setAge(+e.target.value)}/>
          </div>
          <div className="bpm-field">
            <label>FC de repouso (bpm) <span>Meça ao acordar</span></label>
            <input className="text-input" type="number" min="40" max="100" value={restHR} onChange={e=>setRestHR(+e.target.value)}/>
          </div>
        </div>

        <button className="cta-btn" onClick={calc} style={{marginTop:4}}><I n="heartbeat" s={18}/>CALCULAR ZONAS</button>

        {computed && (
          <div className="bpm-zones">
            <div className="bpm-hrmax">FC Máxima estimada: <strong>{computed.hrMax} bpm</strong></div>
            {Object.entries(computed).filter(([k])=>k!=="hrMax").map(([k,z])=>(
              <div key={k} className="bpm-zone-row" style={{"--zc":z.color}}>
                <div className="bpm-zone-bar" style={{background:z.color+"33",borderColor:z.color+"55"}}>
                  <div className="bpm-zone-name">{z.label}</div>
                  <div className="bpm-zone-pct">{z.pct} HRR</div>
                </div>
                <div className="bpm-zone-val" style={{color:z.color}}>{z.lo}–{z.hi} <span>bpm</span></div>
              </div>
            ))}
            <div className="bpm-tip">💡 Para HIIT eficiente, mantenha BPM na zona correta do seu nível durante os tiros e deixe cair ao menos para Aeróbico no descanso.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HEART RATE MONITOR (Web Bluetooth) ─────────────────────────────────────
// GATT service: Heart Rate (0x180D) — standard BLE HR profile
function useHeartRateMonitor() {
  const [hr, setHr] = useState(null);
  const [status, setStatus] = useState("idle"); // idle|connecting|connected|error|unsupported
  const [device, setDevice] = useState(null);
  const charRef = useRef(null);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) { setStatus("unsupported"); return; }
    try {
      setStatus("connecting");
      const dev = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: ["heart_rate"],
      });
      setDevice(dev);
      const server = await dev.gatt.connect();
      const service = await server.getPrimaryService("heart_rate");
      const char = await service.getCharacteristic("heart_rate_measurement");
      charRef.current = char;

      char.addEventListener("characteristicvaluechanged", e => {
        const val = e.target.value;
        // HR value format: flag byte + HR value (1 or 2 bytes per spec)
        const flag = val.getUint8(0);
        const bpm = (flag & 0x01) ? val.getUint16(1, true) : val.getUint8(1);
        setHr(bpm);
      });
      await char.startNotifications();
      setStatus("connected");

      dev.addEventListener("gattserverdisconnected", () => {
        setStatus("idle"); setHr(null); setDevice(null);
      });
    } catch (e) {
      if (e.name !== "NotFoundError") setStatus("error");
      else setStatus("idle");
    }
  }, []);

  const disconnect = useCallback(() => {
    try { device?.gatt?.disconnect(); } catch {}
    setStatus("idle"); setHr(null); setDevice(null);
  }, [device]);

  return { hr, status, connect, disconnect };
}

// ─── HR DISPLAY BADGE ────────────────────────────────────────────────────────
function HrBadge({ hr, status, zones, connect, disconnect }) {
  const zone = zones && hr ? Object.values(zones).filter(z=>z.lo).find(z => hr >= z.lo && hr <= z.hi) : null;
  return (
    <div className={`hr-badge ${status}`} onClick={status === "idle" || status === "error" ? connect : undefined} style={zone ? {"--hrc": zone.color} : {}}>
      {status === "unsupported" && <><I n="bluetooth" s={14}/><span>BLE indisponível</span></>}
      {status === "idle"        && <><I n="bluetooth" s={14}/><span>Conectar relógio</span></>}
      {status === "connecting"  && <><I n="bluetooth" s={14}/><span>Conectando…</span></>}
      {status === "error"       && <><I n="bluetooth" s={14}/><span>Erro — tentar de novo</span></>}
      {status === "connected"   && (
        <>
          <I n="heart" s={14}/>
          <span className="hr-val">{hr ?? "—"}</span>
          <span className="hr-unit">bpm</span>
          {zone && <span className="hr-zone" style={{color:zone.color}}>{zone.label}</span>}
          <button className="hr-disc" onClick={e=>{e.stopPropagation();disconnect();}}>×</button>
        </>
      )}
    </div>
  );
}

// ─── HIIT SESSION (active workout) ───────────────────────────────────────────
function HIITSession({ protocol, modality, level, zones, hr, onFinish }) {
  const lvl = HIIT_LEVELS[level];
  const phases = [
    { type:"warmup",   label:"AQUECIMENTO",    duration: lvl.warmupS,  color:"#06b6d4", targetZone: zones?.warm },
    ...Array.from({ length: lvl.rounds }, (_, i) => [
      { type:"work", label:`TIRO ${i+1}/${lvl.rounds}`, duration: lvl.workS,  color: lvl.color, targetZone: zones?.[level==="beginner"?"hiit_b":level==="intermediate"?"hiit_i":"hiit_a"] },
      { type:"rest", label:"DESCANSO", duration: lvl.restS, color:"#22c55e", targetZone: zones?.aerobic },
    ]).flat().slice(0, lvl.rounds * 2 - 1), // remove last rest
    { type:"cooldown", label:"DESACELERAÇÃO",   duration: lvl.cooldownS,color:"#06b6d4", targetZone: zones?.aerobic },
  ];

  const totalPhases = phases.length;
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [hrHistory, setHrHistory] = useState([]);
  const timerRef = useRef(null);

  // track HR
  useEffect(() => {
    if (running && hr) setHrHistory(p => [...p, { t: Date.now(), bpm: hr }]);
  }, [hr, running]);

  useEffect(() => {
    if (!running) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (phaseIdx + 1 >= totalPhases) {
            setDone(true); setRunning(false); return 0;
          }
          const next = phaseIdx + 1;
          setPhaseIdx(next);
          setTimeLeft(phases[next].duration);
          // vibrate on phase change if supported
          try { navigator.vibrate?.([200, 100, 200]); } catch {}
          return phases[next].duration;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, phaseIdx]);

  const current = phases[phaseIdx];
  const progress = ((current.duration - timeLeft) / current.duration) * 100;
  const min = Math.floor(timeLeft / 60), sec = timeLeft % 60;
  const worksCompleted = phases.slice(0, phaseIdx + 1).filter(p => p.type === "work").length;
  const avgHR = hrHistory.length ? Math.round(hrHistory.reduce((s, x) => s + x.bpm, 0) / hrHistory.length) : null;

  if (done) {
    return (
      <div className="hiit-done">
        <div className="hiit-done-icon">🏆</div>
        <div className="hiit-done-title">SESSÃO CONCLUÍDA!</div>
        <div className="hiit-done-sub">{lvl.rounds} tiros · {lvl.totalMin} min · {modality.name}</div>
        {avgHR && <div className="hiit-done-stat">FC média: <strong>{avgHR} bpm</strong></div>}
        <div className="hiit-done-stat">{hrHistory.length} leituras de batimento</div>
        <button className="cta-btn" style={{marginTop:20}} onClick={onFinish}><I n="check" s={18}/>VOLTAR</button>
      </div>
    );
  }

  return (
    <div className="hiit-session">
      {/* Status bar */}
      <div className="hiit-session-bar" style={{background:current.color}}>
        <div className="hiit-bar-fill" style={{width:`${progress}%`, background:"rgba(255,255,255,.25)"}}/>
        <span className="hiit-bar-label">{current.label}</span>
        <span className="hiit-bar-sub">{modality.name}</span>
      </div>

      {/* Timer */}
      <div className="hiit-timer-wrap">
        <svg className="hiit-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#1f1f1f" strokeWidth="10"/>
          <circle cx="100" cy="100" r="88" fill="none" stroke={current.color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={553}
            strokeDashoffset={553 - (553 * progress / 100)}
            transform="rotate(-90 100 100)"
            style={{transition:"stroke-dashoffset .9s linear, stroke .3s"}}/>
        </svg>
        <div className="hiit-timer-inner">
          <div className="hiit-timer-phase">{current.type === "work" ? "🔥" : current.type === "rest" ? "💨" : "🌊"}</div>
          <div className="hiit-timer-time">{min > 0 ? `${min}:${sec.toString().padStart(2,"0")}` : sec}<span>s</span></div>
          <div className="hiit-timer-type" style={{color:current.color}}>{current.type === "work" ? "TIRO" : current.type === "rest" ? "DESCANSO" : current.type === "warmup" ? "AQUEC." : "COOL"}</div>
        </div>
      </div>

      {/* HR live */}
      {hr && current.targetZone && (
        <div className="hiit-hr-live" style={{borderColor: current.targetZone.color + "44"}}>
          <I n="heart" s={16}/>
          <div>
            <div className="hiit-hr-val" style={{color: hr >= current.targetZone.lo && hr <= current.targetZone.hi ? "#22c55e" : "#ef4444"}}>
              {hr} bpm {hr >= current.targetZone.lo && hr <= current.targetZone.hi ? "✓" : "↑"}
            </div>
            <div className="hiit-hr-target">Alvo: {current.targetZone.lo}–{current.targetZone.hi} bpm</div>
          </div>
          {avgHR && <div className="hiit-hr-avg">Média: {avgHR}</div>}
        </div>
      )}

      {/* Progress */}
      <div className="hiit-progress-row">
        {phases.filter(p=>p.type==="work").map((_,i)=>(
          <div key={i} className={`hiit-dot ${i < worksCompleted ? "done" : i === worksCompleted && current.type === "work" ? "active" : ""}`} style={i < worksCompleted ? {background:lvl.color} : i === worksCompleted && current.type === "work" ? {background:lvl.color, boxShadow:`0 0 8px ${lvl.color}`} : {}}/>
        ))}
      </div>

      {/* Science cue */}
      <div className="hiit-cue">{lvl.cues[phaseIdx % lvl.cues.length]}</div>

      {/* Controls */}
      <div className="hiit-controls">
        <button className="hiit-ctrl-btn" onClick={()=>{setPhaseIdx(0);setTimeLeft(phases[0].duration);setRunning(false);setDone(false);setHrHistory([]);}}>↺</button>
        <button className="hiit-play-btn" style={{background:current.color}} onClick={()=>setRunning(r=>!r)}>
          {running ? "⏸" : "▶"}
        </button>
        <button className="hiit-ctrl-btn" onClick={()=>{if(phaseIdx+1<totalPhases){const n=phaseIdx+1;setPhaseIdx(n);setTimeLeft(phases[n].duration);}else{setDone(true);setRunning(false);}}}>⏭</button>
      </div>
    </div>
  );
}

// ─── HIIT TAB ────────────────────────────────────────────────────────────────
function HIITTab({ data, setData }) {
  const [screen, setScreen] = useState("home"); // home|setup|session|bpm
  const [level, setLevel] = useState(null);
  const [modality, setModality] = useState(null);
  const [userAge, setUserAge] = useState(data.userAge || 30);
  const [userRestHR, setUserRestHR] = useState(data.userRestHR || 65);
  const [showBpm, setShowBpm] = useState(false);
  const { hr, status, connect, disconnect } = useHeartRateMonitor();

  const zones = calcHIITZones(userAge, userRestHR);
  const history = data.hiitHistory || [];

  const saveSession = (session) => {
    setData(d => ({ ...d, hiitHistory: [session, ...(d.hiitHistory || [])].slice(0, 30), userAge, userRestHR }));
  };

  if (screen === "session" && level && modality) {
    return (
      <div className="tab-content" style={{padding:0}}>
        <HIITSession
          protocol={HIIT_LEVELS[level]}
          modality={modality}
          level={level}
          zones={zones}
          hr={hr}
          onFinish={() => {
            saveSession({ date: today(), level, modality: modality.name, rounds: HIIT_LEVELS[level].rounds });
            setScreen("home");
          }}
        />
      </div>
    );
  }

  if (screen === "setup") {
    const lvl = HIIT_LEVELS[level];
    const targetZone = zones[level === "beginner" ? "hiit_b" : level === "intermediate" ? "hiit_i" : "hiit_a"];
    return (
      <div className="tab-content">
        <button className="back-btn" onClick={() => setScreen("home")}>← HIIT</button>
        <div className="page-title" style={{color: lvl.color}}>{lvl.label.toUpperCase()}</div>

        {/* Protocol card */}
        <div className="hiit-proto-card" style={{"--lc": lvl.color}}>
          <div className="hiit-proto-row"><span>Tiros</span><strong>{lvl.rounds}×</strong></div>
          <div className="hiit-proto-row"><span>Duração tiro</span><strong>{lvl.workS}s</strong></div>
          <div className="hiit-proto-row"><span>Descanso</span><strong>{lvl.restS}s</strong></div>
          <div className="hiit-proto-row"><span>Duração total</span><strong>~{lvl.totalMin} min</strong></div>
          <div className="hiit-proto-row"><span>Intensidade</span><strong>{lvl.intensityPct[0]}–{lvl.intensityPct[1]}% FCmax</strong></div>
          <div className="hiit-proto-row"><span>RPE</span><strong>{lvl.rpe.split("—")[0].trim()}</strong></div>
        </div>

        {/* Target BPM */}
        <div className="hiit-target-bpm" style={{borderColor: lvl.color + "44", background: lvl.color + "11"}}>
          <div className="hiit-bpm-label"><I n="heart" s={14}/> BPM alvo nos tiros</div>
          <div className="hiit-bpm-range" style={{color: lvl.color}}>{targetZone.lo}–{targetZone.hi}</div>
          <div className="hiit-bpm-sub">bpm (Karvonen {targetZone.pct} HRR)</div>
          <div className="hiit-bpm-rest">Descanso: volte para {zones.aerobic.lo}–{zones.aerobic.hi} bpm</div>
        </div>

        {/* Science */}
        <div className="hiit-science"><I n="bolt" s={12}/> {lvl.science}</div>

        {/* Modality */}
        <div className="section-title">Modalidade</div>
        <div className="hiit-modality-grid">
          {HIIT_MODALITIES.map(m => (
            <button key={m.id} className={`hiit-mod-btn ${modality?.id === m.id ? "selected" : ""}`}
              onClick={() => setModality(m)} style={modality?.id === m.id ? {"--mc": lvl.color} : {}}>
              <I n={m.icon} s={20}/>
              <span>{m.name}</span>
            </button>
          ))}
        </div>

        {/* Smartwatch / HR */}
        <div className="section-title" style={{marginTop:14}}>Monitor Cardíaco</div>
        <HrBadge hr={hr} status={status} zones={zones} connect={connect} disconnect={disconnect}/>
        {status === "unsupported" && (
          <div className="hiit-ble-note">Web Bluetooth não disponível neste navegador. Use Chrome no Android ou instale o app nativo para usar seu smartwatch.</div>
        )}

        {/* Age & Rest HR for zones */}
        <div className="section-title" style={{marginTop:14}}>Seus dados para cálculo de zonas</div>
        <div className="hiit-user-fields">
          <div className="hiit-user-field"><label>Idade</label><input className="text-input" type="number" min="15" max="80" value={userAge} onChange={e=>{setUserAge(+e.target.value);setData(d=>({...d,userAge:+e.target.value}));}}/></div>
          <div className="hiit-user-field"><label>FC repouso (bpm)</label><input className="text-input" type="number" min="40" max="100" value={userRestHR} onChange={e=>{setUserRestHR(+e.target.value);setData(d=>({...d,userRestHR:+e.target.value}));}}/></div>
        </div>

        <button className={`cta-btn ${!modality ? "disabled-cta" : ""}`} style={{marginTop:8, background: modality ? lvl.color : undefined}}
          onClick={() => { if (modality) setScreen("session"); }}>
          <I n="flame" s={18}/> INICIAR {lvl.label.toUpperCase()}
        </button>
      </div>
    );
  }

  // HOME screen
  return (
    <div className="tab-content">
      {showBpm && <BpmCalculator onClose={() => setShowBpm(false)}/>}
      <div className="page-title">HIIT</div>

      {/* HR badge always visible */}
      <div style={{marginBottom:12}}>
        <HrBadge hr={hr} status={status} zones={zones} connect={connect} disconnect={disconnect}/>
        {hr && <div className="hiit-live-zone">{Object.values(zones).filter(z=>z.lo).find(z=>hr>=z.lo&&hr<=z.hi)?.label || "Acima do máx"}</div>}
      </div>

      <button className="hiit-bpm-calc-btn" onClick={() => setShowBpm(true)}>
        <I n="heartbeat" s={16}/> Calcular minhas zonas de BPM
      </button>

      {/* Level selector */}
      <div className="section-title">Escolha seu nível</div>
      {Object.entries(HIIT_LEVELS).map(([key, lvl]) => (
        <button key={key} className={`hiit-level-card ${level === key ? "selected" : ""}`}
          style={{"--lc": lvl.color}}
          onClick={() => { setLevel(key); setScreen("setup"); }}>
          <div className="hlc-top">
            <div>
              <div className="hlc-name">{lvl.label}</div>
              <div className="hlc-proto">{lvl.rounds} tiros · {lvl.workS}s tiro · {lvl.restS}s descanso · {lvl.totalMin} min</div>
            </div>
            <div className="hlc-tag" style={{background: lvl.color + "22", color: lvl.color, border:`1px solid ${lvl.color}44`}}>
              {lvl.intensityPct[0]}–{lvl.intensityPct[1]}% FCmax
            </div>
          </div>
          <div className="hlc-rpe">{lvl.rpe}</div>
          <div className="hlc-arrow">→</div>
        </button>
      ))}

      {/* History */}
      {history.length > 0 && (
        <div className="section" style={{marginTop:16}}>
          <div className="section-title">Histórico HIIT</div>
          {history.slice(0,5).map((s,i) => (
            <div key={i} className="hiit-hist-row">
              <div className="hiit-hist-lvl" style={{color: HIIT_LEVELS[s.level]?.color}}>●</div>
              <div><div className="hiit-hist-name">{HIIT_LEVELS[s.level]?.label} — {s.modality}</div><div className="hiit-hist-date">{fmtDate(s.date)} · {s.rounds} tiros</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App(){
  const[data,setDataRaw]=useState(getStorage);
  const[tab,setTab]=useState("home");
  const[templateInit,setTemplateInit]=useState(null);

  const setData=updater=>setDataRaw(prev=>{const next=typeof updater==="function"?updater(prev):updater;setStorage(next);return next;});
  const setNewWorkoutFromTemplate=(day,tpl)=>setTemplateInit({name:day.name,exercises:day.exercises});
  const setNewWorkoutFromList=list=>setTemplateInit({name:list.name,exercises:list.exercises.map(name=>({name,sets:3,reps:10,note:""}))});

  const TABS=[
    {id:"home",label:"Início",icon:"home"},
    {id:"new",label:"Treinar",icon:"plus"},
    {id:"hiit",label:"HIIT",icon:"flame"},
    {id:"records",label:"Records",icon:"trophy"},
    {id:"ai",label:"Iron AI",icon:"ai"},
  ];

  return(
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="content">
          {tab==="home"&&<HomeTab data={data} setTab={setTab} setData={setData}/>}
          {tab==="templates"&&<TemplatesTab data={data} setData={setData} setTab={setTab} setNewWorkoutFromTemplate={setNewWorkoutFromTemplate}/>}
          {tab==="new"&&<NewWorkoutTab data={data} setData={setData} setTab={setTab} templateInit={templateInit} clearTemplate={()=>setTemplateInit(null)}/>}
          {tab==="progress"&&<ProgressTab data={data} setData={setData}/>}
          {tab==="hiit"&&<HIITTab data={data} setData={setData}/>}
          {tab==="records"&&<RecordsTab data={data}/>}
          {tab==="lists"&&<ListsTab data={data} setData={setData} setTab={setTab} setNewWorkoutFromList={setNewWorkoutFromList}/>}
          {tab==="ai"&&<IronAITab data={data} setData={setData} setTab={setTab} setTemplateInit={setTemplateInit}/>}
        </div>
        <nav className="bottom-nav">
          {TABS.map(t=>(
            <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              {t.id==="ai"
                ?<div className={`ai-nav-icon${tab==="ai"?" glow":""}`}><I n="ai" s={20}/></div>
                :<I n={t.icon} s={21}/>
              }
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080808;--bg2:#111;--bg3:#181818;--bg4:#1f1f1f;
  --border:#232323;--border2:#2e2e2e;
  --text:#f0f0f0;--muted:#585858;--muted2:#888;
  --accent:#f97316;--accent2:#06b6d4;--success:#22c55e;--danger:#ef4444;--gold:#fbbf24;--purple:#a78bfa;
  --nav-h:64px;
  --ff:'DM Sans',sans-serif;--ffd:'Bebas Neue',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--ff);-webkit-tap-highlight-color:transparent}
input,select,button{font-family:var(--ff)}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
.app{max-width:430px;margin:0 auto;min-height:100dvh;display:flex;flex-direction:column;background:var(--bg)}
.content{flex:1;overflow-y:auto;padding-bottom:calc(var(--nav-h)+8px)}
.tab-content{padding:20px 16px 12px}

/* NAV */
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;height:var(--nav-h);background:rgba(8,8,8,.97);border-top:1px solid var(--border);display:flex;backdrop-filter:blur(16px);z-index:100}
.nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:var(--muted);font-size:9px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;cursor:pointer;transition:color .2s;position:relative}
.nav-btn.active{color:var(--accent)}
.nav-btn.active::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:28px;height:2px;background:var(--accent);border-radius:0 0 3px 3px}
.ai-nav-icon{display:flex;align-items:center;justify-content:center;transition:all .3s}
.ai-nav-icon.glow{color:var(--accent);filter:drop-shadow(0 0 6px var(--accent))}

/* HERO */
.hero-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
.hero-greeting{font-family:var(--ffd);font-size:46px;letter-spacing:2px;line-height:1;background:linear-gradient(135deg,var(--accent),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{color:var(--muted2);font-size:12px;margin-top:4px;text-transform:capitalize}
.streak-badge{display:flex;align-items:center;gap:5px;background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.25);border-radius:20px;padding:7px 13px;font-size:14px;font-weight:800}

.pr-highlight{background:linear-gradient(135deg,rgba(249,115,22,.12),rgba(251,191,36,.08));border:1px solid rgba(249,115,22,.25);border-radius:14px;padding:14px 16px;margin-bottom:16px}
.prh-label{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
.prh-ex{font-size:16px;font-weight:700}
.prh-val{font-family:var(--ffd);font-size:38px;color:var(--accent);line-height:1.1}
.prh-val span{font-family:var(--ff);font-size:16px;color:var(--muted2)}
.prh-sub{font-size:12px;color:var(--muted2);margin-top:2px}

.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px 10px;text-align:center;position:relative;overflow:hidden}
.stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--ac,var(--accent))}
.stat-icon{color:var(--ac,var(--accent));display:flex;justify-content:center;margin-bottom:5px}
.stat-value{font-family:var(--ffd);font-size:26px;letter-spacing:1px;line-height:1}
.stat-label{color:var(--muted);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:3px}

.cta-btn{width:100%;padding:15px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-family:var(--ffd);font-size:20px;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;transition:all .15s}
.cta-btn:active{transform:scale(.97)}
.cta-btn.success{background:var(--success)}
.home-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px}
.home-action-btn{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:7px;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
.home-action-btn:hover{border-color:var(--accent);color:var(--accent)}

.section{margin-top:4px}
.section-title{font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.divider{border:none;border-top:1px solid var(--border);margin:12px 0}

.workout-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px}
.wc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.wc-name{font-weight:700;font-size:15px}
.wc-date{font-size:12px;color:var(--muted2);margin-top:1px}
.wc-stats{display:flex;gap:12px;font-size:12px;color:var(--muted2);margin-bottom:8px}
.wc-chips{display:flex;flex-wrap:wrap;gap:5px}
.ex-chip{background:var(--bg3);border:1px solid var(--border);border-radius:20px;padding:3px 10px;font-size:11px}
.ex-chip.muted{color:var(--muted)}
.pr-chip{background:rgba(249,115,22,.15);border-color:rgba(249,115,22,.3);color:var(--accent)}
.empty-state{text-align:center;padding:48px 20px}
.empty-icon{color:var(--muted);display:flex;justify-content:center;margin-bottom:12px}
.empty-title{font-size:18px;font-weight:700;margin-bottom:6px}
.empty-sub{color:var(--muted2);font-size:14px;line-height:1.5}
.back-btn{background:none;border:none;color:var(--muted2);font-size:13px;font-weight:600;cursor:pointer;padding:0;margin-bottom:16px;transition:color .15s}
.back-btn:hover{color:var(--text)}

/* TEMPLATES */
.tpl-subtitle{color:var(--muted2);font-size:13px;margin-bottom:18px;margin-top:-10px}
.tpl-list{display:flex;flex-direction:column;gap:12px}
.tpl-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;text-align:left;cursor:pointer;transition:all .15s;border-left:3px solid var(--tc,var(--accent));width:100%}
.tpl-card:hover{background:var(--bg3)}
.tpl-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.tpl-card-name{font-family:var(--ffd);font-size:28px;letter-spacing:1px;line-height:1}
.tpl-card-full{font-size:12px;color:var(--muted2)}
.tpl-tag{font-size:10px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;border-radius:20px;padding:4px 10px;flex-shrink:0}
.tpl-card-desc{font-size:13px;color:var(--muted2);line-height:1.5;margin-bottom:8px}
.tpl-card-proto{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--muted2);margin-bottom:6px}
.tpl-card-days{font-size:11px;color:var(--muted)}
.tpl-detail-header{background:linear-gradient(135deg,rgba(255,255,255,.04),transparent);border:1px solid var(--border);border-left:3px solid var(--tc,var(--accent));border-radius:14px;padding:18px;margin-bottom:16px}
.tpl-detail-tag{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
.tpl-detail-name{font-family:var(--ffd);font-size:40px;letter-spacing:2px;line-height:1}
.tpl-detail-full{color:var(--muted2);font-size:14px;margin-bottom:10px}
.tpl-detail-desc{font-size:14px;line-height:1.6;margin-bottom:10px;color:var(--muted2)}
.tpl-detail-proto{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:700}
.day-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px;width:100%;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px;transition:all .15s;position:relative}
.day-card:hover{border-color:var(--accent)}
.day-card-num{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase}
.day-card-name{font-weight:700;font-size:15px}
.day-card-exs{font-size:11px;color:var(--muted2);line-height:1.5}
.day-card-arrow{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:18px}
.day-ex-list{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
.day-ex-row{display:flex;gap:12px;align-items:flex-start;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px}
.day-ex-idx{font-family:var(--ffd);font-size:24px;color:var(--muted);width:28px;flex-shrink:0;line-height:1}
.day-ex-name{font-weight:700;font-size:15px;margin-bottom:2px}
.day-ex-sets{font-size:12px;color:var(--accent);font-weight:700;margin-bottom:2px}
.day-ex-note{font-size:11px;color:var(--muted2)}

/* LISTS */
.list-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px}
.list-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.list-card-name{font-weight:700;font-size:15px}
.list-card-source{font-size:11px;color:var(--muted2);margin-top:2px}
.list-card-exs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.list-start-btn{width:100%;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.25);border-radius:8px;color:var(--accent);font-size:13px;font-weight:700;padding:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
.list-start-btn:hover{background:rgba(249,115,22,.2)}
.picked-preview{margin-top:12px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px}
.picked-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.picked-chip{background:rgba(249,115,22,.15);border:1px solid rgba(249,115,22,.3);border-radius:20px;padding:4px 10px 4px 12px;font-size:12px;color:var(--accent);display:flex;align-items:center;gap:6px}
.picked-chip button{background:none;border:none;color:var(--accent);cursor:pointer;font-size:15px;line-height:1;padding:0}

/* FORMS */
.field-group{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.text-input{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:11px 13px;color:var(--text);font-size:14px;outline:none;transition:border-color .15s}
.text-input:focus{border-color:var(--accent)}
.text-input.flex1{flex:1}
select.text-input{appearance:none}

/* REST CONFIG */
.rest-config{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--muted2)}
.rest-preset{background:var(--bg3);border:1px solid var(--border);border-radius:20px;color:var(--muted2);font-size:11px;font-weight:700;padding:4px 10px;cursor:pointer;transition:all .15s}
.rest-preset.active{background:var(--accent);border-color:var(--accent);color:#fff}

/* EX BLOCK */
.ex-block{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px}
.ex-block-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.ex-block-name-col{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1;margin-right:8px}
.ex-block-name{font-weight:700;font-size:15px;color:var(--accent)}
.max-load-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:var(--accent2);background:rgba(6,182,212,.1);border:1px solid rgba(6,182,212,.2);border-radius:20px;padding:2px 8px;width:fit-content}
.pr-new-badge{font-size:10px;font-weight:800;color:var(--gold);background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);border-radius:20px;padding:2px 8px;width:fit-content;animation:pulse 1s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
.done-badge{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:800;color:var(--success);background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:20px;padding:2px 8px}
.ex-note{font-size:11px;color:var(--muted2);margin-bottom:8px;padding:6px 8px;background:var(--bg3);border-radius:6px;border-left:2px solid var(--accent)}
.sets-header{display:grid;grid-template-columns:26px 1fr 1fr 44px;gap:5px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:6px;padding:0 2px}
.set-row{display:grid;grid-template-columns:26px 1fr 1fr 44px;gap:5px;align-items:center;margin-bottom:5px;transition:opacity .3s}
.set-done{opacity:.5}
.set-row-pr .set-input{border-color:rgba(251,191,36,.4)!important;background:rgba(251,191,36,.06)!important}
.set-num{font-size:13px;color:var(--muted);text-align:center;font-weight:700}
.set-input{background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:8px 3px;color:var(--text);font-size:15px;font-weight:700;text-align:center;outline:none;width:100%;transition:border-color .15s}
.set-input:focus{border-color:var(--accent)}
.set-done-btn{height:36px;border-radius:8px;border:2px solid var(--border);background:var(--bg3);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;width:100%}
.set-done-btn:disabled{opacity:.3;cursor:not-allowed}
.set-done-btn.ready{border-color:var(--success);color:var(--success);background:rgba(34,197,94,.08)}
.set-done-btn.ready:hover{background:rgba(34,197,94,.2)}
.set-done-btn.done{border-color:var(--success);background:rgba(34,197,94,.18);color:var(--success)}
.add-set-btn{background:none;border:1px dashed var(--border);border-radius:7px;color:var(--muted);font-size:12px;padding:7px;width:100%;cursor:pointer;margin-top:4px;transition:all .15s}
.add-set-btn:hover{border-color:var(--accent);color:var(--accent)}
.ex-1rm{font-size:11px;color:var(--muted);margin-top:8px;text-align:right}
.ex-1rm strong{color:var(--accent2)}
.media-btn{border-color:rgba(6,182,212,.3)!important;color:var(--accent2)!important}
.media-btn:hover{background:rgba(6,182,212,.1)!important}
.add-ex-btn{width:100%;background:var(--bg2);border:2px dashed var(--border);border-radius:12px;color:var(--text);font-size:15px;font-weight:700;padding:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px;transition:all .15s}
.add-ex-btn:hover{border-color:var(--accent);color:var(--accent)}
.add-ex-panel{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:16px}
.add-ex-panel-title{font-weight:800;font-size:14px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;color:var(--muted2)}
.quick-lists{margin-bottom:12px}
.quick-list-row{margin-bottom:10px}
.quick-list-name{font-size:11px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px}
.quick-list-exs{display:flex;flex-wrap:wrap;gap:5px}
.group-tabs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.group-tab{background:var(--bg3);border:1px solid var(--border);border-radius:20px;padding:5px 11px;color:var(--muted2);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s}
.group-tab.active{background:var(--accent);border-color:var(--accent);color:#fff}
.ex-list{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;max-height:160px;overflow-y:auto}
.ex-option{background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:7px 11px;color:var(--text);font-size:12px;cursor:pointer;transition:all .15s;text-align:left}
.ex-option:hover,.ex-option.selected{background:var(--accent);border-color:var(--accent);color:#fff}
.ex-opt-max{font-size:10px;opacity:.7;margin-left:3px}
.custom-ex-row{display:flex;gap:7px;align-items:center;margin-bottom:9px}
.ghost-btn{width:100%;background:none;border:1px solid var(--border);border-radius:9px;color:var(--muted2);font-size:13px;padding:10px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.ghost-btn:hover{border-color:var(--muted2);color:var(--text)}
.icon-btn{background:none;border:1px solid var(--border);border-radius:7px;color:var(--muted);cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.icon-btn.danger:hover{background:rgba(239,68,68,.1);border-color:var(--danger);color:var(--danger)}
.icon-btn.accent{background:var(--accent);border-color:var(--accent);color:#fff}
.page-title{font-family:var(--ffd);font-size:34px;letter-spacing:1px;margin-bottom:16px}
.card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:14px}
.card-header{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:12px}
.card-badge{margin-left:auto;font-size:13px;font-weight:700;color:var(--accent2);letter-spacing:0;text-transform:none}
.bw-row{display:flex;gap:7px;align-items:center;margin-top:10px}
.max-load-info{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--muted2);margin-bottom:10px;background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.15);border-radius:7px;padding:8px 10px}
.max-load-info strong{color:var(--accent2)}
.chart-tabs{display:flex;gap:5px;margin-bottom:12px}
.chart-tabs button{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:7px;color:var(--muted);font-size:11px;font-weight:700;padding:7px;cursor:pointer;transition:all .15s}
.chart-tabs button.active{background:var(--accent);border-color:var(--accent);color:#fff}
.chart-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}
.csr{background:var(--bg3);border-radius:8px;padding:10px;text-align:center}
.csr span{font-size:9px;color:var(--muted);display:block;margin-bottom:3px;text-transform:uppercase;font-weight:700}
.csr strong{font-size:16px;font-weight:800}
.csr.pos strong{color:var(--success)}
.csr.neg strong{color:var(--danger)}
.mode-switch{display:flex;background:var(--bg2);border:1px solid var(--border);border-radius:10px;margin-bottom:16px;padding:3px}
.mode-switch button{flex:1;background:none;border:none;color:var(--muted2);font-size:13px;font-weight:700;padding:9px;cursor:pointer;border-radius:8px;transition:all .15s}
.mode-switch button.active{background:var(--accent);color:#fff}
.cat-scroll{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:14px;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cat-btn{background:var(--bg2);border:1px solid var(--border);border-radius:20px;color:var(--muted2);font-size:11px;font-weight:700;padding:6px 13px;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .15s}
.cat-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}
.pr-list{display:flex;flex-direction:column;gap:8px}
.pr-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px}
.pr-rank{font-size:22px;width:36px;flex-shrink:0;text-align:center}
.pr-info{flex:1;min-width:0}
.pr-name{font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr-detail{font-size:11px;color:var(--muted2);margin-top:2px}
.pr-e1rm{text-align:right;flex-shrink:0}
.pr-e1rm-val{font-family:var(--ffd);font-size:28px;color:var(--accent);line-height:1}
.pr-e1rm-lbl{font-size:9px;color:var(--muted);text-transform:uppercase;font-weight:700}

/* REST TIMER */
.rest-overlay{position:fixed;inset:0;z-index:999;display:flex;align-items:flex-end;justify-content:center;padding-bottom:80px;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);animation:fadeUp .25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
.rest-card{background:var(--bg2);border:1px solid var(--border2);border-radius:24px;padding:28px 32px 24px;text-align:center;min-width:260px;box-shadow:0 20px 60px rgba(0,0,0,.7)}
.rest-label{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
.rest-ring-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}
.rest-time{position:absolute;font-family:var(--ffd);font-size:36px;letter-spacing:1px;line-height:1}
.rest-time span{font-family:var(--ff);font-size:16px}
.rest-actions{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px}
.rest-adj{background:var(--bg3);border:1px solid var(--border);border-radius:20px;color:var(--muted2);font-size:12px;font-weight:700;padding:7px 14px;cursor:pointer;transition:all .15s}
.rest-adj:hover{border-color:var(--accent);color:var(--accent)}
.rest-pause{background:var(--accent);border:none;border-radius:50%;width:44px;height:44px;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.rest-pause:hover{transform:scale(1.08)}
.rest-skip{background:none;border:none;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;text-decoration:underline}
.rest-skip:hover{color:var(--text)}

/* MODAL */
.modal-overlay{position:fixed;inset:0;z-index:998;background:rgba(0,0,0,.78);display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(8px);animation:fadeUp .25s ease}
.modal-card{background:var(--bg2);border:1px solid var(--border2);border-radius:20px 20px 0 0;width:100%;max-width:430px;padding:20px 16px 32px;max-height:88dvh;overflow-y:auto}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.modal-title{font-weight:800;font-size:17px}
.modal-tabs{display:flex;background:var(--bg3);border-radius:10px;padding:3px;margin-bottom:16px}
.modal-tabs button{flex:1;background:none;border:none;color:var(--muted2);font-size:13px;font-weight:700;padding:9px;cursor:pointer;border-radius:8px;transition:all .15s}
.modal-tabs button.active{background:var(--bg2);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.modal-gif-area{display:flex;flex-direction:column;gap:12px}
.gif-link-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,rgba(249,115,22,.15),rgba(251,191,36,.1));border:1px solid rgba(249,115,22,.3);border-radius:12px;color:var(--accent);font-weight:700;font-size:15px;padding:16px;text-decoration:none;transition:all .15s}
.gif-tip{background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.15);border-radius:10px;padding:12px;font-size:12px;color:var(--muted2);line-height:1.5}
.gif-tip strong{color:var(--accent2)}
.modal-camera-area{display:flex;flex-direction:column;gap:10px;align-items:center}
.cam-preview{width:100%;max-height:280px;object-fit:cover;border-radius:12px;background:#000;border:1px solid var(--border)}
.cam-error{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:8px;color:#ef4444;font-size:13px;padding:10px;width:100%;text-align:center}
.cam-actions{width:100%;display:flex;justify-content:center}
.cam-rec-btn{display:flex;align-items:center;gap:8px;background:rgba(239,68,68,.12);border:2px solid rgba(239,68,68,.35);border-radius:30px;color:#ef4444;font-size:14px;font-weight:800;padding:12px 28px;cursor:pointer;letter-spacing:1px;transition:all .15s}
.cam-rec-btn:disabled{opacity:.4;cursor:not-allowed}
.cam-rec-btn.recording{background:rgba(239,68,68,.22);animation:recPulse 1.5s infinite}
@keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
.rec-dot{width:10px;height:10px;border-radius:50%;background:#ef4444;display:inline-block}
.rec-dot.active{animation:blink .8s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.cam-note{font-size:11px;color:var(--muted);text-align:center}
.cam-result{width:100%;display:flex;flex-direction:column;gap:10px}

/* ─── IRON AI TAB ─── */
.ai-tab{display:flex;flex-direction:column;height:calc(100dvh - var(--nav-h));overflow:hidden}
.ai-header{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:rgba(8,8,8,.97);backdrop-filter:blur(12px);flex-shrink:0}
.ai-header-left{display:flex;align-items:center;gap:12px}
.ai-logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--gold));display:flex;align-items:center;justify-content:center;font-family:var(--ffd);font-size:17px;letter-spacing:1px;color:#fff;box-shadow:0 0 18px rgba(249,115,22,.3)}
.ai-title{font-family:var(--ffd);font-size:22px;letter-spacing:2px;line-height:1;background:linear-gradient(90deg,var(--accent),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ai-sub{font-size:10px;color:var(--muted2);letter-spacing:.5px;margin-top:2px}
.ai-status-col{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.ai-status-row{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted2)}
.sdot{width:7px;height:7px;border-radius:50%;background:var(--muted)}
.sdot.ok{background:var(--success);box-shadow:0 0 5px var(--success)}
.sdot.err{background:var(--danger)}
.sdot.warn{background:var(--gold)}
.ai-active-sets{font-size:10px;color:var(--success);font-weight:700;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:20px;padding:2px 8px}
.ai-banner{padding:9px 14px;font-size:12px;font-weight:500;line-height:1.4;flex-shrink:0}
.ai-banner.err{background:rgba(239,68,68,.1);border-bottom:1px solid rgba(239,68,68,.2);color:#fca5a5}
.ai-banner.info{background:rgba(249,115,22,.07);border-bottom:1px solid rgba(249,115,22,.15);color:var(--accent)}

.ai-messages{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.ai-messages::-webkit-scrollbar{width:3px}
.ai-messages::-webkit-scrollbar-thumb{background:var(--border2)}

.ai-bubble{display:flex;gap:8px;animation:msgIn .2s ease}
@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ai-bubble.user{flex-direction:row-reverse}
.ai-avatar{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--accent),var(--gold));display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;box-shadow:0 0 8px rgba(249,115,22,.25);margin-top:2px}
.ai-bubble-body{display:flex;flex-direction:column;gap:5px;max-width:calc(100% - 36px)}
.ai-bubble.user .ai-bubble-body{align-items:flex-end}
.ai-transcript{font-size:10px;color:var(--muted2);font-style:italic;padding:4px 9px;background:rgba(255,255,255,.03);border-radius:6px;border-left:2px solid var(--accent)}
.ai-bubble-text{background:#0d1520;border:1px solid var(--border);border-radius:12px 12px 12px 3px;padding:9px 13px;font-size:13px;line-height:1.5;color:var(--text)}
.ai-bubble.user .ai-bubble-text{background:#1a1f2e;border-radius:12px 12px 3px 12px;border-color:var(--border2)}
.ai-time{font-size:10px;color:var(--muted);padding:0 3px}
.ai-bubble.user .ai-time{text-align:right}
.ai-thinking{display:flex;gap:5px;padding:9px 13px;align-items:center;background:#0d1520;border:1px solid var(--border);border-radius:12px 12px 12px 3px}
.ai-thinking span{width:6px;height:6px;border-radius:50%;background:var(--muted2);animation:bounce .8s infinite}
.ai-thinking span:nth-child(2){animation-delay:.15s}
.ai-thinking span:nth-child(3){animation-delay:.3s}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px);background:var(--accent)}}
.ai-live{display:flex;align-items:center;gap:8px;background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.2);border-radius:9px;padding:9px 13px;font-size:13px;color:var(--accent);font-style:italic}
.ai-live-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);flex-shrink:0;animation:blink .6s infinite}

/* ACTION CARD */
.ac-card{background:var(--bg3);border:1px solid var(--border2);border-radius:9px;padding:11px;border-left:3px solid var(--acc,var(--accent));margin-top:4px}
.ac-head{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.ac-icon-wrap{color:var(--acc,var(--accent));display:flex}
.ac-lbl{font-size:10px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:var(--acc,var(--accent))}
.ac-done{margin-left:auto;font-size:10px;font-weight:700;color:var(--success);background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);border-radius:20px;padding:2px 8px}
.ac-body{font-size:12px;color:var(--muted2);margin-bottom:7px;line-height:1.4}
.ac-body strong{color:var(--text)}
.ac-apply{width:100%;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.25);border-radius:6px;color:var(--accent);font-size:12px;font-weight:700;padding:7px;cursor:pointer;transition:all .15s}
.ac-apply:hover{background:rgba(249,115,22,.2)}

/* QUICK CMDS */
.ai-quick{display:flex;gap:6px;padding:7px 12px;overflow-x:auto;scrollbar-width:none;flex-shrink:0;border-top:1px solid var(--border)}
.ai-quick::-webkit-scrollbar{display:none}
.ai-quick-btn{background:var(--bg3);border:1px solid var(--border);border-radius:20px;color:var(--muted2);font-size:11px;font-weight:600;padding:5px 12px;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all .15s}
.ai-quick-btn:hover{border-color:var(--accent);color:var(--accent)}

/* WAVEFORM */
.ai-wave-row{padding:8px 16px 4px;display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0}
.waveform{display:flex;align-items:center;justify-content:center;gap:3px;height:32px}
.wave-bar{width:3px;border-radius:3px;background:var(--muted);height:4px;transition:background .3s;flex-shrink:0}
.wave-bar.active{animation:wave .5s ease-in-out infinite alternate;background:var(--accent)}
.wave-bar.analyzing{animation:wave .35s ease-in-out infinite alternate;background:var(--accent2)}
@keyframes wave{from{height:4px;opacity:.5}to{height:26px;opacity:1}}
.ai-wave-hint{font-size:11px;color:var(--muted2);font-weight:500}

/* AI INPUT */
.ai-input-row{display:flex;gap:7px;padding:7px 12px 9px;align-items:center;flex-shrink:0;border-top:1px solid var(--border);background:var(--bg2)}
.ai-input{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:22px;padding:10px 15px;color:var(--text);font-size:14px;outline:none;transition:border-color .15s}
.ai-input:focus{border-color:var(--accent)}
.ai-input::placeholder{color:var(--muted)}
.ai-input:disabled{opacity:.5}
.ai-send{width:40px;height:40px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);color:var(--muted);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0}
.ai-send.ready{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 0 12px rgba(249,115,22,.3)}
.ai-send:disabled{opacity:.4;cursor:not-allowed}
.ai-mic{width:50px;height:50px;border-radius:50%;flex-shrink:0;background:var(--bg3);border:2px solid var(--border2);color:var(--muted2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;position:relative;overflow:visible}
.ai-mic:hover{border-color:var(--accent);color:var(--accent)}
.ai-mic:disabled{opacity:.4;cursor:not-allowed}
.ai-mic.on{background:rgba(249,115,22,.15);border-color:var(--accent);color:var(--accent);animation:micGlow 1.2s infinite}
.ai-mic.busy{background:rgba(6,182,212,.1);border-color:var(--accent2);color:var(--accent2)}
@keyframes micGlow{0%{box-shadow:0 0 0 0 rgba(249,115,22,.5)}70%{box-shadow:0 0 0 12px rgba(249,115,22,0)}100%{box-shadow:0 0 0 0 rgba(249,115,22,0)}}
.mic-ring{position:absolute;inset:-5px;border-radius:50%;border:2px solid var(--accent);opacity:.5;animation:pulsering 1.2s ease-out infinite;pointer-events:none}
@keyframes pulsering{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.4);opacity:0}}
.ai-footer{text-align:center;font-size:10px;color:var(--muted);padding:4px 0 6px;flex-shrink:0;background:var(--bg2)}

/* ─── HIIT MODULE ─── */
.hiit-home-btn{border-color:rgba(239,68,68,.3)!important;color:#ef4444!important}
.hiit-home-btn:hover{border-color:#ef4444!important;background:rgba(239,68,68,.08)!important}

/* BPM calculator */
.bpm-info{font-size:12px;color:var(--muted2);background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.15);border-radius:8px;padding:10px;margin-bottom:14px;line-height:1.5}
.bpm-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.bpm-field{display:flex;flex-direction:column;gap:5px}
.bpm-field label{font-size:11px;font-weight:700;color:var(--muted2);text-transform:uppercase;letter-spacing:.5px}
.bpm-field label span{font-weight:400;text-transform:none;letter-spacing:0;color:var(--muted)}
.bpm-zones{display:flex;flex-direction:column;gap:7px;margin-top:12px}
.bpm-hrmax{font-size:13px;color:var(--muted2);text-align:center;margin-bottom:4px}
.bpm-hrmax strong{color:var(--text);font-size:15px}
.bpm-zone-row{display:flex;align-items:center;gap:10px}
.bpm-zone-bar{flex:1;border:1px solid;border-radius:8px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center}
.bpm-zone-name{font-size:12px;font-weight:700}
.bpm-zone-pct{font-size:10px;color:var(--muted2)}
.bpm-zone-val{font-family:var(--ffd);font-size:22px;letter-spacing:1px;text-align:right;min-width:80px}
.bpm-zone-val span{font-family:var(--ff);font-size:12px}
.bpm-tip{font-size:11px;color:var(--muted2);background:rgba(249,115,22,.07);border:1px solid rgba(249,115,22,.15);border-radius:8px;padding:10px;line-height:1.5;margin-top:8px}

/* HR badge */
.hr-badge{display:flex;align-items:center;gap:7px;border:1px solid var(--border);border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;color:var(--muted2)}
.hr-badge.idle,.hr-badge.error{background:var(--bg2)}
.hr-badge.idle:hover{border-color:var(--accent2);color:var(--accent2)}
.hr-badge.connecting{border-color:var(--accent2);color:var(--accent2);animation:pulse 1.5s infinite}
.hr-badge.connected{background:rgba(var(--hrc,34 197 94),.08);border-color:rgba(var(--hrc,34 197 94),.3);color:var(--text)}
.hr-val{font-family:var(--ffd);font-size:26px;letter-spacing:1px;line-height:1;color:var(--hrc,var(--success))}
.hr-unit{font-size:11px;color:var(--muted2)}
.hr-zone{font-size:10px;font-weight:800;margin-left:auto}
.hr-disc{background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;padding:0;line-height:1;margin-left:4px}
.hiit-live-zone{font-size:11px;color:var(--muted2);margin-top:5px;text-align:center;font-weight:600}
.hiit-ble-note{font-size:11px;color:var(--muted2);background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.15);border-radius:8px;padding:10px;line-height:1.5;margin-top:8px}

/* BPM calc button */
.hiit-bpm-calc-btn{width:100%;background:rgba(6,182,212,.08);border:1px solid rgba(6,182,212,.25);border-radius:10px;color:var(--accent2);font-size:14px;font-weight:700;padding:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;transition:all .15s}
.hiit-bpm-calc-btn:hover{background:rgba(6,182,212,.15)}

/* Level cards */
.hiit-level-card{background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--lc,var(--accent));border-radius:12px;padding:14px;margin-bottom:10px;width:100%;text-align:left;cursor:pointer;transition:all .15s;position:relative}
.hiit-level-card:hover,.hiit-level-card.selected{background:var(--bg3);border-color:var(--lc)}
.hlc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;gap:10px}
.hlc-name{font-family:var(--ffd);font-size:26px;letter-spacing:1px;line-height:1;color:var(--lc)}
.hlc-proto{font-size:11px;color:var(--muted2);margin-top:3px}
.hlc-tag{font-size:10px;font-weight:800;letter-spacing:.3px;border-radius:20px;padding:4px 10px;flex-shrink:0;text-align:center}
.hlc-rpe{font-size:12px;color:var(--muted2);line-height:1.4}
.hlc-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:18px}

/* Setup screen */
.hiit-proto-card{background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--lc,var(--accent));border-radius:12px;padding:14px;margin-bottom:14px}
.hiit-proto-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)}
.hiit-proto-row:last-child{border-bottom:none}
.hiit-proto-row span{font-size:13px;color:var(--muted2)}
.hiit-proto-row strong{font-size:14px;font-weight:700}
.hiit-target-bpm{border:1px solid;border-radius:12px;padding:14px;margin-bottom:12px;text-align:center}
.hiit-bpm-label{display:flex;align-items:center;justify-content:center;gap:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted2);margin-bottom:6px}
.hiit-bpm-range{font-family:var(--ffd);font-size:48px;letter-spacing:2px;line-height:1}
.hiit-bpm-sub{font-size:11px;color:var(--muted2);margin-bottom:6px}
.hiit-bpm-rest{font-size:12px;color:var(--muted2);background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.15);border-radius:6px;padding:6px 10px;display:inline-block}
.hiit-science{font-size:11px;color:var(--muted2);background:var(--bg3);border-left:2px solid var(--accent2);padding:10px;border-radius:0 8px 8px 0;margin-bottom:14px;line-height:1.5;display:flex;gap:6px;align-items:flex-start}
.hiit-modality-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:4px}
.hiit-mod-btn{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px 10px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:all .15s;color:var(--muted2);font-size:12px;font-weight:600}
.hiit-mod-btn:hover{border-color:var(--mc,var(--accent));color:var(--text)}
.hiit-mod-btn.selected{background:rgba(249,115,22,.1);border-color:var(--mc,var(--accent));color:var(--mc,var(--accent))}
.hiit-user-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.hiit-user-field{display:flex;flex-direction:column;gap:5px}
.hiit-user-field label{font-size:11px;font-weight:700;color:var(--muted2);text-transform:uppercase}
.disabled-cta{opacity:.4;cursor:not-allowed!important}

/* Session screen */
.hiit-session{display:flex;flex-direction:column;align-items:center;min-height:100dvh;padding-bottom:80px}
.hiit-session-bar{position:relative;width:100%;padding:16px;text-align:center;overflow:hidden;flex-shrink:0}
.hiit-bar-fill{position:absolute;left:0;top:0;height:100%;transition:width .9s linear;pointer-events:none}
.hiit-bar-label{font-family:var(--ffd);font-size:18px;letter-spacing:2px;color:#fff;position:relative;z-index:1;display:block}
.hiit-bar-sub{font-size:11px;color:rgba(255,255,255,.7);position:relative;z-index:1;display:block}
.hiit-timer-wrap{position:relative;display:flex;align-items:center;justify-content:center;margin:16px 0 8px}
.hiit-ring{width:200px;height:200px}
.hiit-timer-inner{position:absolute;display:flex;flex-direction:column;align-items:center;gap:2px}
.hiit-timer-phase{font-size:28px;line-height:1}
.hiit-timer-time{font-family:var(--ffd);font-size:52px;letter-spacing:2px;line-height:1}
.hiit-timer-time span{font-family:var(--ff);font-size:18px}
.hiit-timer-type{font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
.hiit-hr-live{display:flex;align-items:center;gap:12px;border:1px solid;border-radius:10px;padding:10px 16px;margin:8px 16px;width:calc(100%-32px)}
.hiit-hr-val{font-family:var(--ffd);font-size:28px;letter-spacing:1px;line-height:1}
.hiit-hr-target{font-size:11px;color:var(--muted2)}
.hiit-hr-avg{margin-left:auto;font-size:12px;color:var(--muted2);font-weight:700}
.hiit-progress-row{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:8px 16px}
.hiit-dot{width:10px;height:10px;border-radius:50%;background:var(--border2);transition:all .3s}
.hiit-dot.done{transform:scale(.85)}
.hiit-dot.active{transform:scale(1.3)}
.hiit-cue{font-size:12px;color:var(--muted2);text-align:center;padding:6px 20px;font-style:italic;min-height:30px}
.hiit-controls{display:flex;align-items:center;gap:16px;margin-top:8px}
.hiit-ctrl-btn{width:48px;height:48px;border-radius:50%;background:var(--bg2);border:1px solid var(--border);color:var(--muted2);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.hiit-ctrl-btn:hover{border-color:var(--text);color:var(--text)}
.hiit-play-btn{width:72px;height:72px;border-radius:50%;border:none;color:#fff;font-size:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 4px 20px rgba(0,0,0,.4)}
.hiit-play-btn:hover{transform:scale(1.05)}
.hiit-done{display:flex;flex-direction:column;align-items:center;padding:40px 20px;text-align:center;gap:10px}
.hiit-done-icon{font-size:56px}
.hiit-done-title{font-family:var(--ffd);font-size:36px;letter-spacing:2px}
.hiit-done-sub{color:var(--muted2);font-size:14px}
.hiit-done-stat{font-size:15px;color:var(--accent2);font-weight:700}
.hiit-hist-row{display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px}
.hiit-hist-lvl{font-size:18px;flex-shrink:0}
.hiit-hist-name{font-weight:600;font-size:14px}
.hiit-hist-date{font-size:11px;color:var(--muted2)}

/* HIIT NUDGE MODAL */
.nudge-card{
  background:var(--bg2);border:1px solid var(--border2);
  border-radius:24px 24px 0 0;width:100%;max-width:430px;
  padding:28px 20px 36px;text-align:center;
  background:linear-gradient(180deg,#0f0a06 0%,var(--bg2) 100%);
}
.nudge-fire{font-size:52px;margin-bottom:8px;animation:fireAnim 1.2s ease-in-out infinite alternate}
@keyframes fireAnim{from{transform:scale(1) rotate(-3deg)}to{transform:scale(1.12) rotate(3deg)}}
.nudge-title{font-family:var(--ffd);font-size:34px;letter-spacing:2px;
  background:linear-gradient(135deg,var(--accent),var(--gold));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  margin-bottom:4px}
.nudge-subtitle{font-size:14px;color:var(--muted2);margin-bottom:20px}
.nudge-stats{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:18px;
  background:rgba(249,115,22,.07);border:1px solid rgba(249,115,22,.2);border-radius:14px;padding:14px 10px}
.nudge-stat{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.nudge-stat-val{font-family:var(--ffd);font-size:28px;letter-spacing:1px;color:var(--accent);line-height:1}
.nudge-stat-lbl{font-size:10px;color:var(--muted2);font-weight:600;text-align:center;line-height:1.3}
.nudge-divider{width:1px;height:40px;background:rgba(249,115,22,.25);flex-shrink:0}
.nudge-science{font-size:12px;color:var(--muted2);line-height:1.6;
  background:rgba(6,182,212,.06);border:1px solid rgba(6,182,212,.15);
  border-radius:10px;padding:12px;margin-bottom:18px;text-align:left}
.nudge-science strong{color:var(--accent2)}
.nudge-cta{
  width:100%;padding:16px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#ea580c,#f97316,#fbbf24);
  color:#fff;font-family:var(--ffd);font-size:22px;letter-spacing:2px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;
  margin-bottom:12px;box-shadow:0 4px 24px rgba(249,115,22,.4);
  transition:all .15s;
}
.nudge-cta:hover{transform:scale(1.02);box-shadow:0 6px 32px rgba(249,115,22,.5)}
.nudge-cta:active{transform:scale(.97)}
.nudge-skip{background:none;border:none;color:var(--muted);font-size:13px;
  font-weight:600;cursor:pointer;text-decoration:underline;width:100%;padding:4px}
.nudge-skip:hover{color:var(--muted2)}

/* HIIT BANNER on HomeTab */
.hiit-banner-btn{
  width:100%;background:linear-gradient(135deg,rgba(239,68,68,.1),rgba(249,115,22,.08));
  border:1px solid rgba(249,115,22,.3);border-radius:12px;
  padding:14px;margin-bottom:16px;cursor:pointer;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  transition:all .15s;text-align:left;
  animation:bannerGlow 2.5s ease-in-out infinite;
}
@keyframes bannerGlow{
  0%,100%{border-color:rgba(249,115,22,.3);box-shadow:0 0 0 0 rgba(249,115,22,0)}
  50%{border-color:rgba(249,115,22,.6);box-shadow:0 0 16px rgba(249,115,22,.15)}
}
.hiit-banner-btn:hover{background:linear-gradient(135deg,rgba(239,68,68,.18),rgba(249,115,22,.14))}
.hiit-banner-left{display:flex;align-items:center;gap:12px;flex:1;min-width:0}
.hiit-banner-fire{font-size:28px;flex-shrink:0}
.hiit-banner-title{font-size:14px;font-weight:800;color:var(--accent);margin-bottom:3px}
.hiit-banner-sub{font-size:10px;color:var(--muted2);line-height:1.4}
.hiit-banner-arrow{font-size:20px;color:var(--accent);flex-shrink:0;font-weight:700}
`;
