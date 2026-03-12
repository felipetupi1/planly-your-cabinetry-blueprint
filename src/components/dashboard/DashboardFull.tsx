import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const C = {
  navy: "#1e3a5f", accent: "#c1440e", bg: "#ffffff",
  secondary: "#f0ece8", border: "#e0dbd5", muted: "#8a8a8a",
  text: "#1e3a5f", success: "#1a7a5e", planBg: "#f8f5f2",
};

interface ProjectData {
  id: string;
  client_name: string;
  client_email: string;
  stage: string;
  created_at: string | null;
  access_token: string;
  notes: string | null;
  deadline: string | null;
}

interface SpaceData {
  id: string;
  space_key: string;
  space_label: string;
  size: string | null;
  price: number | null;
  render_3d: boolean | null;
  description: string | null;
  room_data: any;
  scan_status: string | null;
  scan_link: string | null;
  floor_plan_url: string | null;
  project_id: string | null;
}

const ROOM_TYPES: Record<string, { label: string; icon: string; hasSink: boolean; hasAppliances: boolean; hasWasherDryer: boolean }> = {
  kitchen:  { label:"Kitchen",  icon:"🍳", hasSink:true,  hasAppliances:true,  hasWasherDryer:true  },
  bathroom: { label:"Bathroom", icon:"🚿", hasSink:true,  hasAppliances:false, hasWasherDryer:true  },
  closet:   { label:"Closet",   icon:"👔", hasSink:false, hasAppliances:false, hasWasherDryer:false },
  laundry:  { label:"Laundry",  icon:"🧺", hasSink:true,  hasAppliances:false, hasWasherDryer:true  },
};

const KITCHEN_APPLIANCES = [
  { id:"refrigerator", label:"Refrigerator",     icon:"🧊" },
  { id:"dishwasher",   label:"Dishwasher",        icon:"🫧" },
  { id:"oven",         label:"Oven / Range",      icon:"♨️" },
  { id:"microwave",    label:"Microwave",         icon:"📡" },
  { id:"hood",         label:"Hood / Range Hood", icon:"💨" },
  { id:"washer",       label:"Washer",            icon:"🌀" },
  { id:"dryer",        label:"Dryer",             icon:"🌬️" },
];
const WASHER_DRYER = [
  { id:"washer", label:"Washer", icon:"🌀" },
  { id:"dryer",  label:"Dryer",  icon:"🌬️" },
];

const ELEMENT_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  door:   { label:"Door",   icon:"🚪", color:C.accent  },
  window: { label:"Window", icon:"🪟", color:"#2a5fa5" },
  sink:   { label:"Sink",   icon:"🪣", color:C.success },
};

const STAGES = ["Payment","Brief","In Progress","1st Draft","Revision 1","Revision 2","Final Production","Delivered"];

interface RoomElement {
  id: string;
  type: string;
  width: number;
  height?: number;
  distFromLeft: number;
  distFromFloor?: number;
  wallId?: string;
}

interface RoomDimensions {
  widthIn: number;
  depthIn: number;
  ceilIn: number;
}

interface WallsMap {
  [wallId: string]: RoomElement[];
}

interface SpaceDataItem {
  room: RoomDimensions;
  walls: WallsMap;
  files: File[];
  description: string;
  appliances: Record<string, any>;
  scanStatus?: "idle" | "pending" | "received";
  scanLink?: string;
  floorPlanUrl?: string;
}

interface MessageItem {
  from: "client" | "admin";
  text: string;
  time: string;
}

// ─── CubiCasa GoToScan Card ────────────────────────────────────────────────

type ScanStatus = "idle" | "pending" | "received";

interface ScanCardProps {
  spaceLabel: string;
  projectId: string;
  spaceKey: string;
  scanStatus: ScanStatus;
  scanLink?: string;
  floorPlanUrl?: string;
  onScanRequested: (link: string) => void;
}

function ScanCard({ spaceLabel, projectId, spaceKey, scanStatus, scanLink, floorPlanUrl, onScanRequested }: ScanCardProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // In production: call a Supabase Edge Function that holds the CubiCasa API key
  // and creates a GoToScan order via POST /api/integrate/v3/gotoscan
  // The edge function returns the GoToScan dynamic link.
  // Here we simulate that flow for prototype purposes.
  const handleGenerateLink = async () => {
    setLoading(true);
    // Simulated delay (replace with real Supabase Edge Function call)
    await new Promise(r => setTimeout(r, 1400));
    const externalId = `${projectId}-${spaceKey}-${Date.now()}`;
    // Real link format (edge function would return this):
    // https://api.cubi.casa/conversion/gotoscan?token=TOKEN&external_id=EXT_ID&webhook_url=WEBHOOK
    const mockLink = `https://gotoscan.cubi.casa/start?external_id=${externalId}`;
    setLoading(false);
    onScanRequested(mockLink);
    setShowModal(true);
  };

  if (scanStatus === "received") {
    return (
      <div style={{
        border: `1px solid #a7d4b8`,
        borderRadius: 10,
        padding: "14px 18px",
        background: "#f0faf4",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.success }}>Floor plan received</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted, fontWeight: 300 }}>
            Your {spaceLabel.toLowerCase()} scan has been processed. Dimensions below are pre-filled.
          </p>
        </div>
        {floorPlanUrl && (
          <a href={floorPlanUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: C.accent, textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
            View floor plan →
          </a>
        )}
      </div>
    );
  }

  if (scanStatus === "pending") {
    return (
      <div style={{
        border: `1px solid #d4b87a`,
        borderRadius: 10,
        padding: "14px 18px",
        background: "#fffbf0",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        <span style={{ fontSize: 22 }}>⏳</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#8a6a00" }}>Scan in progress</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted, fontWeight: 300 }}>
            Waiting for scan upload. Floor plan is usually ready within 24 hours.
          </p>
        </div>
        {scanLink && (
          <button
            onClick={() => setShowModal(true)}
            style={{ fontSize: 11, color: C.navy, background: "none", border: `1px solid ${C.border}`, borderRadius: 5, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>
            View link
          </button>
        )}
        {showModal && scanLink && (
          <ScanLinkModal link={scanLink} spaceLabel={spaceLabel} onClose={() => setShowModal(false)} />
        )}
      </div>
    );
  }

  // idle state
  return (
    <>
      <div style={{
        border: `1px dashed ${C.border}`,
        borderRadius: 10,
        padding: "14px 18px",
        background: C.planBg,
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>📱</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.navy }}>
            No tape measure? Scan your {spaceLabel.toLowerCase()}.
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 11, color: C.muted, fontWeight: 300 }}>
            We'll send you a link — scan with your phone in ~5 min. Floor plan generated automatically.
          </p>
        </div>
        <button
          onClick={handleGenerateLink}
          disabled={loading}
          style={{
            background: C.navy,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
          {loading ? "Generating…" : "Get scan link"}
        </button>
      </div>

      {showModal && scanLink && (
        <ScanLinkModal link={scanLink} spaceLabel={spaceLabel} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function ScanLinkModal({ link, spaceLabel, onClose }: { link: string; spaceLabel: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(30,58,95,0.45)",
        zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "28px 30px",
          maxWidth: 440,
          width: "90%",
          boxShadow: "0 24px 60px rgba(30,58,95,0.2)",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.navy }}>
              📱 Scan your {spaceLabel.toLowerCase()}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted, fontWeight: 300 }}>
              Powered by CubiCasa GoToScan
            </p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: C.muted, fontSize: 20 }}>×</button>
        </div>

        <ol style={{ paddingLeft: 18, margin: "0 0 20px", color: C.text }}>
          {[
            "Open this link on your phone.",
            "Install the GoToScan app (free, iOS & Android).",
            "Walk through the space slowly — takes about 5 minutes.",
            "Upload when done. Floor plan arrives within 24h.",
          ].map((step, i) => (
            <li key={i} style={{ fontSize: 12, fontWeight: 300, marginBottom: 8, lineHeight: 1.6 }}>{step}</li>
          ))}
        </ol>

        <div style={{
          background: C.planBg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 11, color: C.muted, flex: 1, wordBreak: "break-all", fontFamily: "monospace" }}>{link}</span>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? C.success : C.navy,
              color: "#fff", border: "none", borderRadius: 5,
              padding: "6px 14px", fontSize: 11, fontWeight: 600,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <p style={{ fontSize: 10, color: C.muted, fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
          The link is unique to this project. Once scanned, your floor plan will appear here automatically.
        </p>
      </div>
    </div>
  );
}

// ─── Status Bar ────────────────────────────────────────────────────────────

function StatusBar() {
  const ci = STAGES.indexOf(CURRENT_STAGE);
  return (
    <div style={{borderBottom:`1px solid ${C.border}`,background:C.bg,padding:"18px 36px"}}>
      <div style={{maxWidth:900}}>
        <div style={{display:"flex",alignItems:"center"}}>
          {STAGES.map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",flex:i<STAGES.length-1?1:"none"}}>
              <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:i===ci?C.accent:i<ci?C.navy:C.secondary}}/>
              {i<STAGES.length-1&&<div style={{flex:1,height:3,background:i<ci?C.navy:C.secondary}}/>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",marginTop:7}}>
          {STAGES.map((s,i)=>(
            <div key={s} style={{flex:i<STAGES.length-1?1:"none"}}>
              <span style={{fontSize:9,letterSpacing:1,textTransform:"uppercase" as const,whiteSpace:"nowrap" as const,
                color:i===ci?C.accent:i<ci?C.navy:C.muted,fontWeight:i===ci?600:300}}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PLAN_W=460, PLAN_H=320, PAD=40;
function pxPerIn(room: RoomDimensions){ return Math.min((PLAN_W-PAD*2)/room.widthIn,(PLAN_H-PAD*2)/room.depthIn,2.6); }

function FloorPlan({ room, walls, selectedId, onWallClick, onElementClick, roomType }: {
  room: RoomDimensions; walls: WallsMap; selectedId?: string; onWallClick: (id: string) => void; onElementClick: (el: RoomElement, wallId: string) => void; roomType: string;
}) {
  const px=pxPerIn(room), rW=room.widthIn*px, rD=room.depthIn*px;
  const ox=(PLAN_W-rW)/2, oy=(PLAN_H-rD)/2, WALL=10;
  function elRect(wId: string, el: RoomElement){
    const dPx=el.distFromLeft*px, wPx=el.width*px;
    if(wId==="A") return{x:ox+dPx,y:oy,w:wPx,h:WALL};
    if(wId==="C") return{x:ox+dPx,y:oy+rD-WALL,w:wPx,h:WALL};
    if(wId==="D") return{x:ox,y:oy+dPx,w:WALL,h:wPx};
    return{x:ox+rW-WALL,y:oy+dPx,w:WALL,h:wPx};
  }
  return (
    <svg width={PLAN_W} height={PLAN_H} style={{display:"block",background:C.planBg,borderRadius:8,border:`1px solid ${C.border}`}}>
      {Array.from({length:Math.ceil(room.widthIn/12)+1},(_,i)=>i*12).map(i=>
        <line key={`gx${i}`} x1={ox+i*px} y1={oy} x2={ox+i*px} y2={oy+rD} stroke="#e8e3de" strokeWidth={i%48===0?.8:.4}/>)}
      {Array.from({length:Math.ceil(room.depthIn/12)+1},(_,i)=>i*12).map(i=>
        <line key={`gy${i}`} x1={ox} y1={oy+i*px} x2={ox+rW} y2={oy+i*px} stroke="#e8e3de" strokeWidth={i%48===0?.8:.4}/>)}
      <rect x={ox} y={oy} width={rW} height={rD} fill="#fff"/>
      {([["A",ox,oy,rW,WALL],["C",ox,oy+rD-WALL,rW,WALL],["D",ox,oy,WALL,rD],["B",ox+rW-WALL,oy,WALL,rD]] as [string,number,number,number,number][]).map(([id,x,y,w,h])=>(
        <g key={id}>
          <rect x={x} y={y} width={w} height={h} fill={C.navy} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();onWallClick(id);}}/>
          <text x={x+w/2} y={y+h/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight="700" fill="#fff" fontFamily="system-ui" style={{pointerEvents:"none"}}>{id}</text>
        </g>
      ))}
      {Object.entries(walls).flatMap(([wId,els])=>els.map(el=>{
        const r=elRect(wId,el); const m=ELEMENT_TYPES[el.type];
        const cx=r.x+r.w/2,cy=r.y+r.h/2,rad=Math.min(r.w,r.h)*0.35;
        return (
          <g key={el.id} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();onElementClick(el,wId);}}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={m.color} stroke={el.id===selectedId?"#ffcc00":"transparent"} strokeWidth={el.id===selectedId?2.5:0}/>
            {el.type==="sink"&&<>
              <circle cx={cx} cy={cy} r={rad} fill="none" stroke="#fff" strokeWidth={1.2}/>
              <line x1={cx} y1={cy-rad} x2={cx} y2={cy+rad} stroke="#fff" strokeWidth={1}/>
              <line x1={cx-rad} y1={cy} x2={cx+rad} y2={cy} stroke="#fff" strokeWidth={1}/>
            </>}
          </g>
        );
      }))}
      <text x={ox+rW/2} y={oy-14} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="system-ui">{room.widthIn}"</text>
      <text x={ox-18} y={oy+rD/2} textAnchor="middle" fontSize={9} fill={C.muted} fontFamily="system-ui" transform={`rotate(-90,${ox-18},${oy+rD/2})`}>{room.depthIn}"</text>
      <text x={PLAN_W/2} y={PLAN_H-7} textAnchor="middle" fontSize={9} fill="#ccc" fontFamily="system-ui">Click a wall to add elements</text>
    </svg>
  );
}

function AddElementPanel({wallId,onAdd,onCancel,roomType}: {wallId: string; onAdd: (wallId: string, type: string) => void; onCancel: () => void; roomType: string}){
  const types=roomType==="closet"?["door","window"]:["door","window","sink"];
  return(
    <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 8px 32px rgba(30,58,95,0.15)",padding:"14px 18px",zIndex:20,minWidth:185}}>
      <p style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase" as const,margin:"0 0 10px"}}>Add to Wall {wallId}</p>
      <div style={{display:"flex",flexDirection:"column" as const,gap:7}}>
        {types.map(type=>{const m=ELEMENT_TYPES[type];return(
          <button key={type} onClick={()=>onAdd(wallId,type)} style={{display:"flex",alignItems:"center",gap:10,background:"#fafaf9",border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 14px",cursor:"pointer",fontSize:13,color:C.navy,fontWeight:500}}>
            <span style={{width:13,height:13,background:m.color,borderRadius:3,flexShrink:0}}/>{m.icon} {m.label}
          </button>
        );})}
      </div>
      <button onClick={onCancel} style={{marginTop:10,width:"100%",border:"none",background:"transparent",color:C.muted,fontSize:11,cursor:"pointer"}}>Cancel</button>
    </div>
  );
}

function ElementPopup({el,wallId,room,onUpdate,onDelete,onClose}: {
  el: RoomElement; wallId: string; room: RoomDimensions; onUpdate: (id: string, wallId: string, patch: Partial<RoomElement>) => void; onDelete: (id: string, wallId: string) => void; onClose: () => void;
}){
  const wallLen=(wallId==="A"||wallId==="C")?room.widthIn:room.depthIn;
  const opposite=wallLen-el.distFromLeft-el.width;
  const meta=ELEMENT_TYPES[el.type];
  const inp=(label: string, value: number, onChange: (v: number) => void)=>(
    <div style={{marginBottom:9}}>
      <label style={{fontSize:9,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase" as const,display:"block",marginBottom:3}}>{label}</label>
      <input type="number" value={value} onChange={e=>onChange(parseFloat(e.target.value)||0)} style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:5,padding:"5px 9px",fontSize:12,color:C.navy,background:"#fafaf9",outline:"none",boxSizing:"border-box" as const}}/>
    </div>
  );
  return(
    <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:10,right:10,background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 8px 32px rgba(30,58,95,0.15)",padding:"13px 15px",zIndex:20,width:205}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
        <span style={{fontWeight:600,color:C.navy,fontSize:12}}>{meta.icon} {meta.label} — Wall {wallId}</span>
        <button onClick={onClose} style={{border:"none",background:"transparent",cursor:"pointer",color:C.muted,fontSize:17,lineHeight:1}}>×</button>
      </div>
      {inp("Width (in)",el.width,v=>onUpdate(el.id,wallId,{width:Math.min(v,wallLen-el.distFromLeft)}))}
      {el.type!=="sink"&&inp("Height (in)",el.height||80,v=>onUpdate(el.id,wallId,{height:v}))}
      {el.type==="sink"&&<div style={{marginBottom:9,padding:"6px 9px",background:"#f0f9f5",borderRadius:5,fontSize:11,color:C.success}}>📍 Center: {(el.distFromLeft+el.width/2).toFixed(1)}" from left</div>}
      {inp("From left / top (in)",el.distFromLeft,v=>onUpdate(el.id,wallId,{distFromLeft:Math.min(Math.max(0,v),wallLen-el.width)}))}
      {el.type!=="sink"&&inp("From floor (in)",el.distFromFloor||0,v=>onUpdate(el.id,wallId,{distFromFloor:v}))}
      <div style={{padding:"5px 9px",background:C.secondary,borderRadius:5,fontSize:11,color:C.muted,marginBottom:11}}>Opposite wall: <strong>{opposite.toFixed(1)}"</strong></div>
      <button onClick={()=>onDelete(el.id,wallId)} style={{width:"100%",border:`1px solid #fca5a5`,borderRadius:5,background:"#fff1f1",color:"#dc2626",padding:"6px 0",fontSize:11,fontWeight:600,cursor:"pointer"}}>Remove</button>
    </div>
  );
}

function ApplianceCard({appliance,data,onChange}: {appliance: {id: string; label: string; icon: string}; data: any; onChange: (d: any) => void}){
  const [open,setOpen]=useState(false);
  const [fileName,setFileName]=useState(data?.fileName||"");
  return(
    <div style={{border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:open?"#fafaf9":"#fff",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:16}}>{appliance.icon}</span>
          <span style={{fontSize:12,fontWeight:500,color:C.navy}}>{appliance.label}</span>
          {data?.width&&<span style={{fontSize:10,color:C.muted}}>{data.width}"×{data.height}"×{data.depth}"</span>}
        </div>
        <span style={{color:C.muted,fontSize:10}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{padding:"12px 14px",borderTop:`1px solid ${C.border}`,background:"#fafaf9"}}>
          <p style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:7}}>Dimensions (inches)</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:11}}>
            {["width","height","depth"].map(dim=>(
              <div key={dim}>
                <label style={{fontSize:9,color:C.muted,textTransform:"uppercase" as const,display:"block",marginBottom:3}}>{dim}</label>
                <input type="number" min="0" placeholder="—" value={data?.[dim]||""} onChange={e=>onChange({...data,[dim]:e.target.value})}
                  style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:5,padding:"5px 7px",fontSize:12,color:C.navy,background:"#fff",outline:"none",boxSizing:"border-box" as const}}/>
              </div>
            ))}
          </div>
          <p style={{fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:5}}>Product link</p>
          <input type="url" placeholder="https://..." value={data?.link||""} onChange={e=>onChange({...data,link:e.target.value})}
            style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:5,padding:"6px 9px",fontSize:11,color:C.navy,background:"#fff",outline:"none",boxSizing:"border-box" as const,marginBottom:7}}/>
          <label style={{display:"flex",alignItems:"center",gap:7,border:`1px dashed ${C.border}`,borderRadius:5,padding:"6px 11px",cursor:"pointer",background:"#fff"}}>
            <span style={{fontSize:12}}>📎</span>
            <span style={{fontSize:11,color:C.muted}}>{fileName||"Upload spec / cut sheet"}</span>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){setFileName(f.name);onChange({...data,file:f,fileName:f.name})}}}/>
          </label>
        </div>
      )}
    </div>
  );
}

function SpaceBrief({spaceKey,data,onChange}: {spaceKey: string; data: SpaceDataItem; onChange: (d: SpaceDataItem) => void}){
  const rt=ROOM_TYPES[spaceKey];
  const [room,setRoom]=useState(data.room||{widthIn:180,depthIn:144,ceilIn:108});
  const [walls,setWalls]=useState<WallsMap>(data.walls||{A:[],B:[],C:[],D:[]});
  const [addPanel,setAddPanel]=useState<{wallId: string}|null>(null);
  const [selectedEl,setSelectedEl]=useState<{el: RoomElement; wallId: string}|null>(null);
  const containerRef=useRef<HTMLDivElement>(null);

  const closeAll=()=>{setAddPanel(null);setSelectedEl(null);};
  const updRoom=(r: RoomDimensions)=>{setRoom(r);onChange({...data,room:r});};
  const updWalls=(w: WallsMap)=>{setWalls(w);onChange({...data,walls:w});};

  const handleWallClick=useCallback((wallId: string)=>{setSelectedEl(null);setAddPanel(p=>p?.wallId===wallId?null:{wallId});},[]);
  const handleElementClick=useCallback((el: RoomElement, wallId: string)=>{setAddPanel(null);setSelectedEl(s=>s?.el?.id===el.id?null:{el,wallId});},[]);
  const handleAddElement=useCallback((wallId: string, type: string)=>{
    const e: RoomElement={id:`${type}-${Date.now()}`,type,width:type==="door"?36:type==="window"?36:24,height:type==="door"?80:type==="window"?48:0,distFromLeft:12,distFromFloor:type==="window"?36:0};
    const w={...walls,[wallId]:[...walls[wallId],e]};updWalls(w);setAddPanel(null);
  },[walls]);
  const handleUpdateElement=useCallback((id: string, wallId: string, patch: Partial<RoomElement>)=>{
    const w={...walls,[wallId]:walls[wallId].map(el=>el.id===id?{...el,...patch}:el)};
    updWalls(w);setSelectedEl(s=>s?.el?.id===id?{...s,el:{...s.el,...patch}}:s);
  },[walls]);
  const handleDeleteElement=useCallback((id: string, wallId: string)=>{
    updWalls({...walls,[wallId]:walls[wallId].filter(el=>el.id!==id)});setSelectedEl(null);
  },[walls]);

  const appList=spaceKey==="kitchen"?KITCHEN_APPLIANCES:(spaceKey==="bathroom"||spaceKey==="laundry")?WASHER_DRYER:[];
  const allEls=Object.entries(walls).flatMap(([wId,els])=>els.map(e=>({...e,wallId:wId})));

  const lbl: React.CSSProperties={fontSize:9,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6};
  const inp: React.CSSProperties={border:`1px solid ${C.border}`,borderRadius:4,padding:"7px 11px",fontSize:12,color:C.text,background:C.bg,outline:"none",boxSizing:"border-box",width:"100%"};

  return(
    <div onClick={closeAll}>

      {/* ── CubiCasa Scan Card ── */}
      <ScanCard
        spaceLabel={rt.label}
        projectId={PROJECT.id}
        spaceKey={spaceKey}
        scanStatus={data.scanStatus || "idle"}
        scanLink={data.scanLink}
        floorPlanUrl={data.floorPlanUrl}
        onScanRequested={(link) => onChange({ ...data, scanStatus: "pending", scanLink: link })}
      />

      <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>

        {/* COL 1: dimensions, walls, legend */}
        <div style={{width:140,flexShrink:0}}>
          <p style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"#bbb",marginBottom:9}}>Dimensions</p>
          {([["Width (in)","widthIn"],["Depth (in)","depthIn"],["Ceiling (in)","ceilIn"]] as [string, keyof RoomDimensions][]).map(([label,key])=>(
            <div key={key} style={{marginBottom:9}}>
              <label style={{fontSize:9,color:C.muted,display:"block",textTransform:"uppercase",marginBottom:3}}>{label}</label>
              <input type="number" min="60" value={room[key]} onClick={e=>e.stopPropagation()}
                onChange={e=>updRoom({...room,[key]:parseInt(e.target.value)||room[key]})}
                style={{width:"100%",border:`1px solid ${C.border}`,borderRadius:5,padding:"5px 8px",fontSize:12,color:C.navy,background:"#fafaf9",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
          <p style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"#bbb",marginTop:14,marginBottom:8}}>Walls</p>
          {["A","B","C","D"].map(wId=>(
            <div key={wId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid #f0ece8`}}>
              <span style={{fontSize:11,color:C.navy,fontWeight:600}}>Wall {wId}</span>
              <div style={{display:"flex",gap:3}}>
                {walls[wId].length===0?<span style={{fontSize:10,color:"#ddd"}}>—</span>:walls[wId].map(el=><span key={el.id} style={{fontSize:11}}>{ELEMENT_TYPES[el.type].icon}</span>)}
              </div>
            </div>
          ))}
          <p style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"#bbb",marginTop:14,marginBottom:7}}>Legend</p>
          {Object.entries(ELEMENT_TYPES).filter(([t])=>spaceKey!=="closet"||t!=="sink").map(([type,meta])=>(
            <div key={type} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <div style={{width:13,height:7,background:meta.color,borderRadius:2}}/>
              <span style={{fontSize:10,color:"#666"}}>{meta.icon} {meta.label}</span>
            </div>
          ))}
        </div>

        {/* COL 2: floor plan + upload + describe + element schedule */}
        <div style={{display:"flex",flexDirection:"column",gap:14,flexShrink:0}}>
          <div ref={containerRef} style={{position:"relative",display:"inline-block"}} onClick={e=>e.stopPropagation()}>
            <FloorPlan room={room} walls={walls} selectedId={selectedEl?.el?.id}
              onWallClick={handleWallClick} onElementClick={handleElementClick} roomType={spaceKey}/>
            {addPanel&&<div onClick={e=>e.stopPropagation()}><AddElementPanel wallId={addPanel.wallId} onAdd={handleAddElement} onCancel={()=>setAddPanel(null)} roomType={spaceKey}/></div>}
            {selectedEl&&<div onClick={e=>e.stopPropagation()}><ElementPopup el={selectedEl.el} wallId={selectedEl.wallId} room={room} onUpdate={handleUpdateElement} onDelete={handleDeleteElement} onClose={()=>setSelectedEl(null)}/></div>}
          </div>

          <div>
            <label style={lbl}>Upload files</label>
            <label style={{border:`2px dashed ${C.border}`,borderRadius:8,padding:"14px 16px",textAlign:"center",cursor:"pointer",display:"block",background:"#fafaf9"}}>
              <div style={{fontSize:18}}>📎</div>
              <p style={{marginTop:4,fontSize:11,color:C.muted,fontWeight:300}}>Floor plan, photos, references</p>
              <p style={{fontSize:10,color:"#ccc",margin:"2px 0 0"}}>drag and drop or click</p>
              <input type="file" multiple style={{display:"none"}} onChange={e=>{const f=[...(data.files||[]),...Array.from(e.target.files||[])];onChange({...data,files:f});}}/>
            </label>
            {(data.files||[]).map((f,i)=>(
              <div key={i} style={{fontSize:11,color:C.muted,marginTop:4,display:"flex",alignItems:"center",gap:5}}>
                <span>📄</span>{f.name}
              </div>
            ))}
          </div>

          <div>
            <label style={lbl}>Describe this space</label>
            <textarea value={data.description||""} onChange={e=>onChange({...data,description:e.target.value})}
              placeholder={`Tell us about your ${rt.label.toLowerCase()} — style, materials, layout, must-haves...`}
              rows={5} style={{...inp,resize:"none",lineHeight:1.7}}/>
          </div>

          {allEls.length>0&&(
            <div style={{border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
              <div style={{background:C.navy,padding:"7px 12px"}}>
                <span style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"#fff",fontWeight:600}}>Element Schedule</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{background:C.secondary}}>
                    {["Wall","Type","Width","Ht/Ctr","From wall"].map(h=>(
                      <th key={h} style={{padding:"6px 10px",textAlign:"left",color:C.muted,fontWeight:500,fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allEls.map((el,i)=>{
                    const m=ELEMENT_TYPES[el.type];
                    return(
                      <tr key={el.id} style={{borderTop:`1px solid ${C.border}`,background:i%2?C.secondary:"#fff"}}>
                        <td style={{padding:"6px 10px",fontWeight:600,color:C.navy}}>{el.wallId}</td>
                        <td style={{padding:"6px 10px",color:C.navy}}>{m.icon} {m.label}</td>
                        <td style={{padding:"6px 10px",color:C.muted}}>{el.width}"</td>
                        <td style={{padding:"6px 10px",color:el.type==="sink"?C.success:C.muted,fontWeight:el.type==="sink"?600:400}}>
                          {el.type==="sink"?`ctr ${(el.distFromLeft+el.width/2).toFixed(1)}"`:el.height?`${el.height}"`:"-"}
                        </td>
                        <td style={{padding:"6px 10px",color:C.muted}}>{el.distFromLeft}"</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* COL 3: appliances */}
        {appList.length>0&&(
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.navy,margin:"0 0 4px"}}>Appliances</p>
            <p style={{fontSize:11,color:C.muted,marginBottom:10,fontWeight:300}}>Click to add dimensions and product info.</p>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {appList.map(ap=>(
                <ApplianceCard key={ap.id} appliance={ap} data={(data.appliances||{})[ap.id]}
                  onChange={(apData: any)=>onChange({...data,appliances:{...(data.appliances||{}),[ap.id]:apData}})}/>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SectionBrief(){
  const spaces=PROJECT.purchasedSpaces;
  const [activeTab,setActiveTab]=useState(spaces[0].key);
  const [spaceData,setSpaceData]=useState<Record<string, SpaceDataItem>>(
    Object.fromEntries(spaces.map(s=>[s.key,{room:{widthIn:180,depthIn:144,ceilIn:108},walls:{A:[],B:[],C:[],D:[]},files:[],description:"",appliances:{},scanStatus:"idle"}]))
  );
  const [saved,setSaved]=useState(false);
  const [submitted,setSubmitted]=useState(false);

  const isComplete=(key: string)=>spaceData[key].description?.trim().length>0;
  const allComplete=spaces.every(s=>isComplete(s.key));
  const handleSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};

  if(submitted){
    return(
      <div style={{textAlign:"center",padding:"60px 0"}}>
        <div style={{fontSize:48}}>✅</div>
        <h2 style={{fontSize:20,fontWeight:300,color:C.navy,letterSpacing:2,textTransform:"uppercase",marginTop:16}}>Brief Submitted</h2>
        <p style={{color:C.muted,fontWeight:300,marginTop:8,fontSize:13}}>We'll review your brief and get started. You'll hear from us soon.</p>
      </div>
    );
  }

  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:300,color:C.text,letterSpacing:2,textTransform:"uppercase",margin:0}}>Submit Brief</h2>
          <p style={{marginTop:5,color:C.muted,fontWeight:300,fontSize:12}}>Fill in each space. Save your progress and return at any time.</p>
        </div>
        <button onClick={handleSave} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"7px 16px",fontSize:11,color:saved?C.success:C.navy,background:saved?"#f0f9f5":"#fff",cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          {saved?"✓ Saved":"💾 Save progress"}
        </button>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:22}}>
        {spaces.map(space=>{
          const isActive=activeTab===space.key;
          const isDone=isComplete(space.key);
          return(
            <button key={space.key} onClick={()=>setActiveTab(space.key)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 20px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:isActive?600:400,color:isActive?C.navy:C.muted,borderBottom:isActive?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:-1}}>
              <span style={{fontSize:15}}>{ROOM_TYPES[space.key].icon}</span>
              {space.label}
              {isDone&&<span style={{fontSize:10,color:C.success,marginLeft:2}}>✓</span>}
            </button>
          );
        })}
      </div>
      {spaces.map(space=>(
        <div key={space.key} style={{display:activeTab===space.key?"block":"none"}}>
          <SpaceBrief spaceKey={space.key} data={spaceData[space.key]} onChange={(d: SpaceDataItem)=>setSpaceData(p=>({...p,[space.key]:d}))}/>
        </div>
      ))}
      <div style={{display:"flex",gap:12,marginTop:24,paddingTop:18,borderTop:`1px solid ${C.border}`,alignItems:"center"}}>
        <button onClick={handleSave} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 18px",fontSize:11,color:saved?C.success:C.navy,background:saved?"#f0f9f5":"#fff",cursor:"pointer",fontWeight:500}}>
          {saved?"✓ Saved":"💾 Save progress"}
        </button>
        {!allComplete&&<p style={{fontSize:11,color:C.muted,fontWeight:300,margin:0}}>Add a description to each space to unlock submit.</p>}
        <button onClick={()=>setSubmitted(true)} disabled={!allComplete} style={{marginLeft:"auto",background:allComplete?C.accent:"#ddd",color:"#fff",border:"none",borderRadius:6,padding:"10px 26px",fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",cursor:allComplete?"pointer":"not-allowed"}}>
          Submit brief →
        </button>
      </div>
    </div>
  );
}

function SectionProject(){
  const sub=PROJECT.purchasedSpaces.reduce((s,x)=>s+x.price+(x.render3d?150:0),0);
  const disc=sub*0.1;
  return(
    <div>
      <h2 style={{fontSize:20,fontWeight:300,color:C.text,letterSpacing:2,textTransform:"uppercase",margin:0}}>My Project</h2>
      <p style={{marginTop:7,color:C.muted,fontWeight:300,fontSize:13}}>Summary of what was purchased.</p>
      <div style={{marginTop:7,display:"flex",gap:24,fontSize:12,color:C.muted}}>
        <span>Project ID: <strong style={{color:C.text}}>{PROJECT.id}</strong></span>
        <span>Date: <strong style={{color:C.text}}>{PROJECT.date}</strong></span>
      </div>
      <div style={{marginTop:18,border:`1px solid ${C.border}`,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:C.secondary}}>
            {["Space","Size","3D Render","Price"].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left" as const,fontWeight:500,color:C.text,fontSize:10,textTransform:"uppercase" as const,letterSpacing:1}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {PROJECT.purchasedSpaces.map((s,i)=>(
              <tr key={i} style={{borderTop:`1px solid ${C.border}`}}>
                <td style={{padding:"11px 16px",color:C.text}}>{ROOM_TYPES[s.key].icon} {s.label}</td>
                <td style={{padding:"11px 16px",color:C.muted,fontWeight:300}}>{s.size}</td>
                <td style={{padding:"11px 16px",color:C.muted,fontWeight:300}}>{s.render3d?"Yes (+$150)":"No"}</td>
                <td style={{padding:"11px 16px",color:C.text,fontWeight:500}}>${s.price+(s.render3d?150:0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{padding:"11px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:12,color:C.success,fontWeight:500}}>Multi-space discount (10%) — −${disc}</span>
          <span style={{fontSize:16,fontWeight:500,color:C.text}}>Total: ${sub-disc}</span>
        </div>
      </div>
    </div>
  );
}

function SectionReview(){return(<div><h2 style={{fontSize:20,fontWeight:300,color:C.text,letterSpacing:2,textTransform:"uppercase",margin:0}}>Review</h2><div style={{marginTop:22,border:`1px solid ${C.border}`,borderRadius:8,padding:40,textAlign:"center"}}><div style={{fontSize:30}}>🔒</div><p style={{marginTop:10,color:C.muted,fontWeight:300,fontSize:13}}>Files appear here once the design is ready.</p></div></div>);}
function SectionDelivery(){return(<div><h2 style={{fontSize:20,fontWeight:300,color:C.text,letterSpacing:2,textTransform:"uppercase",margin:0}}>Final Delivery</h2><div style={{marginTop:22,border:`1px solid ${C.border}`,borderRadius:8,padding:40,textAlign:"center"}}><div style={{fontSize:30}}>🔒</div><p style={{marginTop:10,color:C.muted,fontWeight:300,fontSize:13}}>Files available once the project is approved.</p></div></div>);}

function SectionMessages(){
  const [messages,setMessages]=useState<MessageItem[]>([{from:"admin",text:"Welcome! Feel free to ask any questions here.",time:"Mar 8, 10:00 AM"}]);
  const [input,setInput]=useState("");
  const send=()=>{if(!input.trim())return;setMessages(p=>[...p,{from:"client",text:input.trim(),time:"Just now"}]);setInput("");};
  return(
    <div>
      <h2 style={{fontSize:20,fontWeight:300,color:C.text,letterSpacing:2,textTransform:"uppercase",margin:0}}>Messages</h2>
      <div style={{marginTop:18,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
        <div style={{height:260,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:11}}>
          {messages.map((msg,i)=>(
            <div key={i} style={{display:"flex",justifyContent:msg.from==="client"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"70%",borderRadius:8,padding:"9px 13px",fontSize:13,background:msg.from==="client"?C.accent:C.secondary,color:msg.from==="client"?"#fff":C.text}}>
                <p style={{margin:0,fontWeight:300}}>{msg.text}</p>
                <p style={{margin:"3px 0 0",fontSize:10,opacity:0.6}}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,padding:10,display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..."
            style={{flex:1,border:`1px solid ${C.border}`,borderRadius:4,padding:"7px 11px",fontSize:13,color:C.text,background:C.bg,outline:"none"}}/>
          <button onClick={send} style={{background:C.navy,color:"#fff",border:"none",borderRadius:4,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Send</button>
        </div>
      </div>
    </div>
  );
}

const NAV=[{id:"project",label:"My Project"},{id:"brief",label:"Brief"},{id:"review",label:"Review"},{id:"delivery",label:"Delivery"},{id:"messages",label:"Messages"}];

export default function Dashboard(){
  const [active,setActive]=useState("brief");
  const content=()=>{
    switch(active){
      case "project":  return <SectionProject/>;
      case "brief":    return <SectionBrief/>;
      case "review":   return <SectionReview/>;
      case "delivery": return <SectionDelivery/>;
      case "messages": return <SectionMessages/>;
    }
  };
  return(
    <div style={{fontFamily:"'Outfit', system-ui, sans-serif",display:"flex",minHeight:"100vh",background:C.bg}}>
      <aside style={{width:200,minHeight:"100vh",background:C.navy,flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"22px 20px 14px"}}><span style={{fontSize:11,fontWeight:700,letterSpacing:4,textTransform:"uppercase",color:"#fff"}}>MEASURED</span></div>
        <nav style={{marginTop:14,flex:1}}>
          {NAV.map(s=>(
            <button key={s.id} onClick={()=>setActive(s.id)} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 20px",fontSize:10,letterSpacing:2,textTransform:"uppercase",fontWeight:active===s.id?500:400,color:active===s.id?"#fff":"rgba(255,255,255,0.55)",background:"none",border:"none",cursor:"pointer",borderLeft:active===s.id?`3px solid ${C.accent}`:"3px solid transparent"}}>
              {s.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <p style={{fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:1,textTransform:"uppercase",margin:0}}>Project ID</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",margin:"3px 0 0",fontWeight:300}}>{PROJECT.id}</p>
        </div>
      </aside>
      <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <StatusBar/>
        <main style={{flex:1,padding:"26px 34px",overflowY:"auto"}}>
          <div style={{maxWidth:980}}>{content()}</div>
        </main>
      </div>
    </div>
  );
}
