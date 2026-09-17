import {taskState} from './status.js';
let snapshot = null, selected = 'all';
const $ = id => document.getElementById(id);
const date = (v, time=true) => v ? new Intl.DateTimeFormat('th-TH',{day:'numeric',month:'short',year:'numeric',...(time?{hour:'2-digit',minute:'2-digit'}:{}),timeZone:'Asia/Bangkok'}).format(new Date(v))+(time?' น.':'') : 'ยังไม่มีบันทึกสำเร็จ';
const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render() {
  $('today').textContent=date(new Date().toISOString(),false);
  if (!snapshot) return;
  const tasks=snapshot.tasks.map(t=>({...t,state:taskState(t)}));
  const counts={attention:0,scheduled:0,complete:0,running:0};
  tasks.forEach(t=>counts[t.state.key]++);
  $('summary').innerHTML=[['attention','ต้องดูแล','ตรวจเงื่อนไขหรือมีงานค้าง'],['scheduled','รอถึงกำหนด','มีวันนัดครั้งถัดไป'],['complete','มีผลยืนยันแล้ว','งานที่บันทึกว่าสำเร็จ']].map(([key,label,note])=>`<button class="summary-item ${key}" data-summary="${key}"><span>${label}</span><strong>${counts[key]}</strong><small>${note}</small></button>`).join('');
  document.querySelectorAll('[data-summary]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.summary)));
  $('task-count').textContent=`${tasks.length} งาน${counts.running ? ` · กำลังทำ ${counts.running}`:''}`;
  const shown=tasks.filter(t=>selected==='all'||t.state.key===selected);
  $('tasks').innerHTML=shown.length?shown.map(t=>`<article class="task"><div class="task-top"><span class="badge ${t.state.key}">${esc(t.state.label)}</span><span class="category">${esc(t.category)}</span></div><h3>${esc(t.title)}</h3><p class="task-description">${esc(t.description)}</p><div class="task-facts"><div><span>${t.nextRunAt?'รอบถัดไป':'ต้องดำเนินการเมื่อ'}</span><strong>${esc(t.nextRunAt?date(t.nextRunAt):t.dueLabel)}</strong><small>${esc(t.scheduleLabel||'')}</small></div><div><span>สำเร็จล่าสุด</span><strong>${esc(date(t.lastSuccessAt))}</strong></div></div><div class="next-step"><b>ขั้นตอนต่อไป</b><p>${esc(t.nextStep)}</p></div><details><summary>รายละเอียดและหลักฐาน</summary><p>${esc(t.evidence)}</p><p class="subtle">ตรวจสถานะล่าสุด ${esc(date(t.checkedAt))}</p>${t.lastResult?`<p>${esc(t.lastResult)}</p>`:''}</details></article>`).join(''):'<p class="empty">'+(selected==='complete'?'ยังไม่มีงานที่บันทึกผลสำเร็จในหน้านี้':'ไม่มีงานในสถานะนี้')+'</p>';
  $('history').innerHTML=[...snapshot.history].sort((a,b)=>b.at.localeCompare(a.at)).slice(0,12).map(e=>`<li><time>${esc(date(e.at))}</time><div><strong>${esc(e.title)}</strong><p>${esc(e.detail)}</p></div></li>`).join('');
}
function filter(key){ selected=key; document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});render(); }
function validate(data){
 if(data.schemaVersion!==1||!Array.isArray(data.tasks)||!Array.isArray(data.history)||!Number.isFinite(Date.parse(data.updatedAt)))throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
 if(data.tasks.some(t=>!t.id||!t.title||!['scheduled','review','blocked','failed','running','complete'].includes(t.status)||(t.nextRunAt&&!Number.isFinite(Date.parse(t.nextRunAt)))))throw new Error('ข้อมูลสถานะไม่ครบ');
 return data;
}
async function refresh(){
 $('refresh').disabled=true;$('sync-status').textContent='กำลังตรวจข้อมูลสถานะ…';
 try{
  const response=await fetch(`./tasks.json?t=${Date.now()}`,{cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  snapshot=validate(await response.json());$('load-error').hidden=true;render();
  $('sync-status').textContent=`บันทึกสถานะล่าสุด ${date(snapshot.updatedAt)} · อ่านจากเว็บเมื่อ ${new Intl.DateTimeFormat('th-TH',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Bangkok'}).format(new Date())} น.`;
 }catch(error){
  $('load-error').hidden=false;$('load-error').textContent=snapshot?'อ่านข้อมูลใหม่ไม่สำเร็จ กำลังแสดงข้อมูลที่อ่านได้ก่อนหน้า กรุณาลองอีกครั้ง':'ยังอ่านสถานะงานไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วกดตรวจข้อมูลล่าสุด';
  $('sync-status').textContent='ยังยืนยันสถานะล่าสุดไม่ได้';
  if(!snapshot)$('tasks').innerHTML='<p class="empty">ไม่มีข้อมูลสถานะที่ยืนยันได้</p>';
 }finally{$('refresh').disabled=false;}
}
$('refresh').addEventListener('click',refresh);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
$('copy-link').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(new URL('./',location.href).href);$('copy-result').textContent='คัดลอกแล้ว';}catch{$('copy-result').textContent='กด Ctrl+D เพื่อบันทึกหน้านี้';}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
setInterval(()=>{if(!document.hidden)refresh();},300000);
setInterval(render,60000);
render();refresh();
