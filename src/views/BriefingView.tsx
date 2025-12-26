
import React, { useState } from 'react';

interface BriefingViewProps {
  onInvestigate: () => void;
}

const BriefingView: React.FC<BriefingViewProps> = ({ onInvestigate }) => {
  const [step, setStep] = useState(1);
  
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const ProgressIndicator = () => (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-3 z-50">
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          className={`h-1.5 w-12 rounded-full transition-all duration-700 ${step >= s ? 'bg-primary shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'bg-white/10'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden relative bg-background-dark font-display selection:bg-primary selection:text-black">
      <ProgressIndicator />
      
      {/* --- หน้า 1: การค้นพบ --- */}
      {step === 1 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/10 shadow-2xl">
            <div className="p-8 md:p-16 text-left font-body">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">แฟ้มคดี_01</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">สถานที่: อ่างเก็บน้ำห้วยยาง</span>
              </div>
              
              <h1 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic font-display">
                เช้าที่แสนปกติ...<br/>
                <span className="text-primary">กลับกลายเป็นฝันร้าย</span>
              </h1>
              
              <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed">
                <p>
                  นักศึกษาที่มาวิ่งออกกำลังกายริมอ่างเก็บน้ำห้วยยางสังเกตเห็นสิ่งผิดปกติโผล่พ้นดิน... เมื่อเข้าไปดูใกล้ๆ กลับพบว่าเป็นศีรษะมนุษย์ที่ถูกฝังไว้ครึ่งหนึ่ง
                </p>
                
                <div className="bg-primary/5 p-8 rounded-2xl border-l-8 border-primary text-white italic">
                  <p className="text-2xl leading-relaxed font-bold font-display">"ผู้เสียชีวิตถูกระบุว่าเป็นนักศึกษาชั้นปีที่ 2 สาขาวิชาวิศวกรรมธรณี"</p>
                </div>
                
                <p className="font-medium text-gray-400">
                  ข่าวลือแพร่สะพัดอย่างรวดเร็วว่านี่คือส่วนหนึ่งของพิธีกรรมฆาตกรรมต่อเนื่อง เพราะหลังจากนั้นไม่นาน มีการพบศพเพิ่มอีกสองศพในจุดที่ตรงกับทิศหลักของเมือง
                </p>
              </div>

              <div className="mt-16 flex justify-end">
                <button onClick={nextStep} className="group flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                  วิเคราะห์ต่อ
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- หน้า 2: พิธีกรรม --- */}
      {step === 2 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in slide-in-from-right-12 duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/10 shadow-2xl">
            <div className="p-8 md:p-16 text-left font-body">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">รูปแบบคดี_02</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">ข้อมูลพิธีกรรม</span>
              </div>
              
              <h2 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic font-display">
                รหัสลับแห่ง<br/>
                <span className="text-primary">สี่ทิศทาง</span>
              </h2>
              
              <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed">
                <p>
                  ตำรวจมืดแปดด้านจนกระทั่ง "ดร. อาทิตย์" นักสืบรุ่นเก๋าที่ผันตัวไปเป็นอาจารย์เข้ามาช่วย เขาพบรูปแบบบางอย่าง: เหนือ, ตะวันออก, ใต้ และ ตะวันตก
                </p>
                
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 font-mono">
                  <p className="font-black text-primary mb-2 uppercase">บันทึกข้อมูลล่าสุด:</p>
                  <p className="mb-2">เหยื่อรายที่ 2 (นักศึกษาสิ่งแวดล้อม) ถูกพบลอยอยู่ในเรือกลางน้ำ</p>
                  <p className="text-gray-500 text-sm italic">การฆาตกรรมเลียนแบบพิธีกรรมล้างมลทินโบราณ แต่กลับมีการใช้การเข้ารหัสข้อมูลดิจิทัลที่ซับซ้อนมาเกี่ยวข้อง</p>
                </div>
                
                <div className="bg-black/60 p-10 rounded-3xl border-2 border-primary/20 text-center relative overflow-hidden">
                  <p className="text-white text-3xl font-black mb-4 italic leading-tight relative z-10 font-display">
                    "พิธีกรรมสี่ทิศ" — การชำระล้างแผ่นดินด้วยเลือด ณ จุดตัดของทิศทั้งสี่
                  </p>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-6 relative z-10 font-mono">
                    มีสัญลักษณ์สามเหลี่ยมถูกสลักไว้บนหน้าผากเหยื่อ—ยันต์โบราณที่ถูกดัดแปลง
                  </p>
                </div>
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-white transition-all font-black text-sm uppercase tracking-widest group">
                  <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> 
                  ย้อนกลับ
                </button>
                <button onClick={nextStep} className="group flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                  วิเคราะห์ความเชื่อมโยง
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- หน้า 3: ความเชื่อมโยง --- */}
      {step === 3 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/20 shadow-2xl">
            <div className="p-8 md:p-16 text-left font-body">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">ความเชื่อมโยงเหยื่อ</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">ข้อมูลความสัมพันธ์</span>
              </div>
              
              <h2 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic font-display">
                กลุ่มเพื่อนของ <span className="text-primary">ตู้</span>
              </h2>
              
              <div className="space-y-10 text-gray-300 text-lg md:text-xl leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1 font-mono tracking-widest font-bold">เหยื่อ-01 (เหนือ)</span>
                    <span className="text-white font-black text-lg">วิศวกรรมธรณี</span>
                  </div>
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1 font-mono tracking-widest font-bold">เหยื่อ-02 (ตะวันออก)</span>
                    <span className="text-white font-black text-lg">สิ่งแวดล้อม</span>
                  </div>
                  <div className="bg-primary/10 p-6 rounded-2xl border-2 border-primary/40">
                    <span className="text-[10px] text-primary uppercase block mb-1 font-mono tracking-widest font-black">เหยื่อ-03 (ใต้)</span>
                    <span className="text-white font-black text-lg">วิศวกรรมการบิน</span>
                  </div>
                </div>

                <p>
                  ดร. อาทิตย์ สังเกตว่าเหยื่อทุกคนล้วนเป็น <span className="text-white font-black underline decoration-primary decoration-4 underline-offset-8">เพื่อนสนิทของ "ตู้" นักศึกษาที่เสียชีวิตไปเมื่อ 2 ปีก่อน</span>
                </p>
                
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 text-white italic">
                  <p className="text-2xl leading-relaxed font-display font-bold text-gray-200">
                    "ตู้มีกลุ่มเพื่อนสนิท 5 คน 3 คนเสียชีวิตไปแล้ว เหลืออีก 2 คน... หนึ่งในนั้นอาจเป็นเหยื่อรายต่อไป หรืออาจเป็นฆาตกรเสียเอง"
                  </p>
                </div>
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-white transition-all font-black text-sm uppercase tracking-widest group">
                  <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> 
                  ตรวจสอบบันทึกใหม่
                </button>
                <button onClick={onInvestigate} className="group flex items-center gap-6 bg-primary hover:bg-white text-black px-16 py-8 rounded-2xl font-black text-2xl transition-all shadow-2xl shadow-primary/40 italic">
                  <span className="material-symbols-outlined font-black text-3xl">terminal</span>
                  เริ่มการสืบสวน
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefingView;
