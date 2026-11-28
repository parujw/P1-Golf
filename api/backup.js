// สำรองข้อมูลจาก Firestore (อ่านอย่างเดียว ตาม Rules ที่เปิดอ่านได้)
// /api/backup?part=data            ข้อมูลทั้งหมด ไม่รวมรูป (รูปแสดงเป็นขนาดแทน)
// /api/backup?part=photos&pageSize=8&pageToken=...   รูปทีละหน้า
// /api/backup?part=pr&pageSize=4&pageToken=...       ภาพ PR ทีละหน้า
function cfg(){let c={};try{c=JSON.parse(process.env.FIREBASE_CONFIG||"{}");}catch(e){try{c=Function("return ("+process.env.FIREBASE_CONFIG+")")()||{};}catch(_){}}
  // ค่าสาธารณะของเว็บ (อยู่ใน config.js ที่เบราว์เซอร์โหลดอยู่แล้ว)
  return {projectId:c.projectId||"p1-golf",apiKey:c.apiKey||"AIzaSyCLkrlyKOrIOvKM2Mwvnd5Yq5MvL3K67so"};}
function val(v){if(!v||typeof v!=="object")return null;
  if("stringValue" in v)return v.stringValue;if("integerValue" in v)return Number(v.integerValue);if("doubleValue" in v)return v.doubleValue;
  if("booleanValue" in v)return v.booleanValue;if("nullValue" in v)return null;if("timestampValue" in v)return v.timestampValue;
  if("arrayValue" in v)return (v.arrayValue.values||[]).map(val);if("mapValue" in v)return obj(v.mapValue.fields||{});return null;}
function obj(f){const o={};for(const k in f)o[k]=val(f[k]);return o;}
async function list(base,key,col,pageSize,pageToken){const u=`${base}/${col}?pageSize=${pageSize}&key=${key}${pageToken?`&pageToken=${encodeURIComponent(pageToken)}`:""}`;
  const r=await fetch(u);if(!r.ok)throw new Error(col+": "+r.status+" "+(await r.text()).slice(0,200));const j=await r.json();
  return {docs:(j.documents||[]).map(d=>({id:d.name.split("/").pop(),data:obj(d.fields||{}),updated:d.updateTime})),next:j.nextPageToken||null};}
async function all(base,key,col,strip){let out=[],tok=null;do{const r=await list(base,key,col,300,tok);out=out.concat(r.docs);tok=r.next;}while(tok);
  if(strip)out.forEach(d=>{if(typeof d.data.img==="string"){d.data.imgBytes=d.data.img.length;delete d.data.img;}});return out;}
module.exports=async(req,res)=>{
  const c=cfg();if(!c.projectId||!c.apiKey){res.status(500).json({error:"FIREBASE_CONFIG not set"});return;}
  const base=`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents`;
  const q=req.query||{},part=q.part||"data";
  try{
    res.setHeader("Cache-Control","no-store");
    if(part==="data"){const out={backupAt:new Date().toISOString(),project:c.projectId};
      for(const col of ["event","scores","ntp","photos","pr"])out[col]=await all(base,c.apiKey,col,col==="photos"||col==="pr");
      res.status(200).json(out);return;}
    if(part==="photos"||part==="pr"){const r=await list(base,c.apiKey,part,Math.min(20,+q.pageSize||8),q.pageToken||null);
      res.status(200).json({backupAt:new Date().toISOString(),part,docs:r.docs,next:r.next});return;}
    res.status(400).json({error:"unknown part"});
  }catch(e){res.status(500).json({error:String(e.message||e)});}
};
