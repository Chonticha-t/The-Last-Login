
import React, { useState } from 'react';
import type { CaseStatus } from '../types';

interface CompleteViewProps {
  status: CaseStatus;
  onReset: () => void;
}

const CompleteView: React.FC<CompleteViewProps> = ({ status, onReset }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsFinalized(true);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts = [];
    if (h > 0) parts.push(`${h} ชม.`);
    if (m > 0 || h > 0) parts.push(`${m} น.`);
    parts.push(`${s} วิ.`);
    return parts.join(' ');
  };

  if (isFinalized) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-start p-8 bg-background-dark overflow-y-auto animate-in fade-in duration-1000 pb-40 font-display min-h-screen">
        <div className="absolute inset-0 bg-primary/5 opacity-40 pointer-events-none"></div>
        
        <div className="w-full max-w-5xl glass-panel border-8 border-primary/20 p-12 md:p-24 rounded-[4rem] shadow-2xl relative mt-20 font-body text-left">
          <div className="border-b-4 border-primary/20 pb-16 mb-16 text-center">
            <h1 className="text-primary font-black text-sm tracking-widest uppercase mb-6 italic animate-pulse">รายงานสรุปคดีหลังการสืบสวน</h1>
            <h2 className="text-white text-6xl md:text-8xl font-black tracking-tight uppercase italic drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] leading-none font-display">ปิดคดี: มานัส-52</h2>
          </div>

          <div className="space-y-20">
            <section className="space-y-10">
              <h3 className="text-primary font-black text-2xl tracking-widest uppercase border-b-4 border-primary/20 pb-6 italic font-display">สรุปคดี: พิธีกรรมที่ถูกโปรแกรมไว้</h3>
              <div className="text-gray-200 text-xl md:text-2xl leading-relaxed space-y-8 font-medium italic">
                <p>
                  <strong>ดร. มานัส</strong> คือผู้อยู่เบื้องหลังการฆาตกรรมทั้งหมด เขาใช้สัญลักษณ์พิธีกรรมโบราณมาอำพรางคดีเพื่อกำจัดนักศึกษาที่กำลังจะเปิดโปงความล้มเหลวและทุจริตในงานวิจัยของเขา
                </p>
                <div className="bg-primary/5 p-12 rounded-[3rem] border-4 border-primary/10 space-y-8 font-mono not-italic text-lg">
                  <p><span className="text-primary font-black">01. เหนือ (ปฐพี):</span> ใช้รหัสผ่านที่ขโมยมาเพื่อเข้าถึงข้อมูลธรณี</p>
                  <p><span className="text-primary font-black">02. ตะวันออก (วารี):</span> ปลอมแปลงสถานะเรือและใบรับรองความปลอดภัย</p>
                  <p><span className="text-primary font-black">03. ใต้ (พฤกษา):</span> ใช้ความรู้กลศาสตร์คำนวณการแขวนคอเพื่อจัดฉากเป็นการฆ่าตัวตาย</p>
                  <p><span className="text-primary font-black">04. ตัวตน:</span> ลายนิ้วมือดิจิทัล (MANAT-52) ถูกพบใน Log การเข้าถึงเซ็นเซอร์ทุกทิศ</p>
                </div>
                <p>
                  หลักฐานสำคัญคือ <strong>Access Matrix (UID: DRM-01)</strong> ซึ่งแสดงให้เห็นว่าเขามีสิทธิ์เขียนข้อมูลในทุกจุดยุทธศาสตร์ของพิธีกรรมเพียงคนเดียว
                </p>
              </div>
            </section>

            <div className="bg-black/80 border-4 border-primary/30 p-12 rounded-[3rem] flex flex-col items-center gap-10 shadow-inner">
               <div className="flex justify-between w-full border-b-2 border-primary/10 pb-6">
                  <span className="text-primary/60 font-black text-sm uppercase tracking-widest">เวลาที่ใช้ทั้งหมด</span>
                  <span className="text-white font-black text-3xl italic leading-none">{formatTime(status.timer)}</span>
               </div>
               <div className="flex justify-between w-full border-b-2 border-primary/10 pb-6">
                  <span className="text-primary/60 font-black text-sm uppercase tracking-widest">คะแนนการสืบสวน</span>
                  <span className="text-primary font-black text-3xl italic leading-none">ดีเยี่ยม (100%)</span>
               </div>
               <p className="text-white font-black text-2xl tracking-tight uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] font-display">ผลสรุป: นักสืบนิติวิทยาศาสตร์ระดับสูง</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-8 lg:p-16 relative overflow-y-auto overflow-x-hidden bg-background-dark font-display min-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[1000px] bg-primary/5 blur-[200px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-6xl flex flex-col gap-16 relative z-10 animate-in fade-in slide-in-from-bottom duration-1000 py-24 font-body">
        <div className="text-center flex flex-col items-center gap-12 font-display">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/40 blur-[80px] rounded-full animate-pulse"></div>
            <span className="material-symbols-outlined text-primary text-[140px] relative z-10 font-black italic drop-shadow-[0_0_40px_rgba(255,0,0,1)]">gavel</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-7xl md:text-9xl font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,0,0,0.6)] uppercase text-center italic leading-none">ภารกิจสำเร็จ</h2>
            <p className="text-primary text-2xl md:text-3xl font-black tracking-widest uppercase opacity-90 text-center italic">จับกุม ดร. มานัส เรียบร้อยแล้ว</p>
          </div>
        </div>

        <div className="glass-panel rounded-[4rem] overflow-hidden flex flex-col shadow-2xl border-4 border-primary/20 mt-12 text-left">
          <div className="px-16 py-8 border-b-2 border-primary/10 flex justify-between items-center bg-primary/5 font-display">
            <h3 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-6 italic">
              <span className="material-symbols-outlined text-primary font-black text-4xl">verified</span>
              สรุปรายงานนิติวิทยาศาสตร์
            </h3>
          </div>

          <div className="p-16 space-y-16">
            <p className="text-gray-200 text-3xl md:text-4xl leading-snug italic text-center font-black">
              "ยอดเยี่ยมมาก นักสืบ การวิเคราะห์ห่วงโซ่รหัสลับของคุณทำให้ความจริงปรากฏ—พิธีกรรมนั้นเป็นเพียงหน้ากากที่ใช้ปกปิดการฆาตกรรม"
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-10 bg-primary/5 border-2 border-primary/10 rounded-[3rem] text-center shadow-inner font-mono">
                <p className="text-[11px] text-primary/60 uppercase mb-4 font-black tracking-widest">เวลาปฏิบัติการ</p>
                <p className="text-5xl text-white font-black italic leading-none">{formatTime(status.timer)}</p>
              </div>
              <div className="p-10 bg-primary/5 border-2 border-primary/10 rounded-[3rem] text-center shadow-inner font-mono">
                <p className="text-[11px] text-primary/60 uppercase mb-4 font-black tracking-widest">จำนวนการใช้คำใบ้</p>
                <p className="text-5xl text-white font-black italic leading-none">{status.hintsUsed} / 3</p>
              </div>
              <div className="p-10 bg-primary border-4 border-white/20 rounded-[3rem] text-center shadow-2xl font-mono">
                <p className="text-[11px] text-black/40 uppercase mb-4 font-black tracking-widest">การประเมินผล</p>
                <p className="text-5xl text-black font-black italic leading-none">ดีเยี่ยม</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-12">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group px-24 py-10 bg-primary hover:bg-white text-black font-black text-4xl rounded-[3rem] shadow-2xl shadow-primary/40 transition-all transform hover:scale-110 active:scale-95 flex items-center gap-10 italic font-display"
          >
            {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'เข้าถึงรายงานคดีฉบับเต็ม'}
            <span className="material-symbols-outlined font-black text-5xl group-hover:translate-x-3 transition-transform">terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteView;
