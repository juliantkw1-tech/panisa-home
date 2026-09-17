export function taskState(task, now = new Date()) {
  if (task.status === 'complete' && !task.lastSuccessAt) return {key:'attention', label:'ยังไม่มีผลยืนยัน'};
  if (task.status === 'blocked') return {key:'attention', label:'ต้องให้คุณช่วย'};
  if (task.status === 'failed') return {key:'attention', label:'ทำไม่สำเร็จ'};
  if (task.status === 'review') return {key:'attention', label:'ต้องตรวจเพิ่ม'};
  if (task.status === 'running') {
    if (task.lastStartedAt && now - new Date(task.lastStartedAt) > 6*60*60*1000) return {key:'attention', label:'ยังไม่พบผลหลังเริ่มงาน'};
    return {key:'running', label:'กำลังทำ'};
  }
  if (task.status === 'complete') return {key:'complete', label:'ยืนยันสำเร็จแล้ว'};
  if (task.nextRunAt && now >= new Date(task.nextRunAt)) return {key:'attention', label:'เลยกำหนด · ยังไม่มีผลยืนยัน'};
  return {key:'scheduled', label:'ตั้งเวลาแล้ว · รอทำ'};
}
