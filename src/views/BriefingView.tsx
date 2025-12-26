
import React, { useState, useEffect } from 'react';

interface BriefingViewProps {
  onInvestigate: () => void;
}

const BriefingView: React.FC<BriefingViewProps> = ({ onInvestigate }) => {
  const [step, setStep] = useState(1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  useEffect(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    let newAudio: HTMLAudioElement | null = null;
    
    if (step === 1) {
      newAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    } else if (step === 2) {
      newAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2458/2458-preview.mp3');
    } else if (step === 3) {
      newAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3');
    }

    if (newAudio) {
      newAudio.loop = true;
      newAudio.volume = 0.2;
      newAudio.play().catch(err => console.log('Audio autoplay prevented:', err));
      setAudio(newAudio);
    }

    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.currentTime = 0;
      }
    };
  }, [step]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

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
      
      <button 
        onClick={() => {
          if (audio) {
            if (audio.paused) audio.play();
            else audio.pause();
          }
        }}
        className="fixed top-8 right-8 z-[60] bg-black/60 hover:bg-primary/20 backdrop-blur-md border border-primary/20 rounded-full p-4 transition-all"
      >
        <span className="material-symbols-outlined text-primary text-2xl font-black">
          {audio && !audio.paused ? 'volume_up' : 'volume_off'}
        </span>
      </button>

      {/* --- PAGE 1: THE DISCOVERY --- */}
      {step === 1 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/10 shadow-2xl">
            <div className="p-8 md:p-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">INCIDENT_FILE_01</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">RESERVOIR_LOCATION</span>
              </div>
              
              <h1 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic">
                เช้าวันที่ปกติ...<br/>
                <span className="text-primary">ที่ไม่ปกติ</span>
              </h1>
              
              <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed font-body">
                <p>
                  เช้าวันที่ทุกอย่างดูเหมือนจะปกติ <span className="text-white font-black underline decoration-primary underline-offset-8">นักศึกษา</span> ที่กำลังวิ่งอยู่ที่อ่างห้วยยาง แต่สายตาต่อไปสะดุดที่สิ่งผิดปกติ นักศึกษาคนดังกล่าวจึงเดินเข้าไปดู
                </p>
                
                <div className="bg-primary/5 p-8 rounded-2xl border-l-8 border-primary text-white italic">
                  <p className="text-2xl leading-relaxed font-bold font-display">"พบว่าเห็นหัวของร่างหนึ่งถูกฝังไว้เหนือผิวดิน จึงแจ้งตำรวจ"</p>
                </div>
                
                <p className="font-medium text-gray-400">
                  จากการตรวจสอบของตำรวจพบว่า ร่างที่ถูกฝังนั้นเป็นร่างของ <span className="text-white font-black">นักศึกษาวิศวกรรมธรณี ชั้นปีที่ 2</span> เสียงลือลั่นไปทั่วทิศว่าเป็นการจัดทำพิธีกรรมบางอย่างที่ไม่อาจมีใครรู้ว่าเป็นพิธีอะไร
                </p>
              </div>

              <div className="mt-16 flex justify-end">
                <button onClick={nextStep} className="group flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                  ANALYSIS_CONTINUE
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAGE 2: THE RITUAL --- */}
      {step === 2 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in slide-in-from-right-12 duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/10 shadow-2xl">
            <div className="p-8 md:p-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">FORENSIC_PATTERN_02</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">RITUAL_DATA</span>
              </div>
              
              <h2 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic">
                บทสวดแห่ง<br/>
                <span className="text-primary">สี่ทิศ</span>
              </h2>
              
              <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed font-body">
                <p>
                  ตำรวจต้องทนกับเสียงวิพากษ์วิจารณ์อย่างหนักที่ไม่สามารถจับตัวคนร้ายได้ ทั้งที่เป็นคดีอุกฉะกัน จึงมอบหมายให้ <span className="text-white font-black">อ.อาทิตย์</span> ตำรวจเก่าที่ผันตัวออกมาเป็นอาจารย์ภาควิชาแพทยศาสตร์
                </p>
                
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 font-mono">
                  <p className="font-black text-primary mb-2 uppercase">LOG_ENTRY_UPDATE:</p>
                  <p className="mb-2">พบร่างนักศึกษาสิ่งแวดล้อม เสียชีวิตอยู่บนเรือ</p>
                  <p className="text-gray-500 text-sm italic">เหตุดังกล่าวเกิดขึ้นซ้ำแล้วซ้ำเล่าจนมีนักศึกษาเสียชีวิตทั้งหมด 3 ราย</p>
                </div>
                
                <div className="bg-black/60 p-10 rounded-3xl border-2 border-primary/20 text-center relative overflow-hidden">
                  <p className="text-white text-3xl font-black mb-4 italic leading-tight relative z-10">
                    "บทสวดแห่งสี่ทิศ" พิธีชำระล้างบาปของผืนดิน ด้วยชีวิตมนุษย์ทั้งสี่ทิศ—เหนือ ใต้ ออก ตก
                  </p>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-6 relative z-10">
                    พบสัญลักษณ์รูปสามเหลี่ยมสลักบนหน้าผาก ยันต์โบราณที่ถูกบิดเบือน
                  </p>
                </div>
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-white transition-all font-black text-sm uppercase tracking-widest group">
                  <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> 
                  PREV_RECORD
                </button>
                <button onClick={nextStep} className="group flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                  FINAL_CORRELATION
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAGE 3: THE CONNECTION --- */}
      {step === 3 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/20 shadow-2xl">
            <div className="p-8 md:p-16">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">VICTIM_CONNECT_FILE</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">RELATIONAL_DATA</span>
              </div>
              
              <h2 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic">
                เพื่อนของ <span className="text-primary">ตุ๊</span>
              </h2>
              
              <div className="space-y-10 text-gray-300 text-lg md:text-xl leading-relaxed font-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1 font-mono tracking-widest font-bold">ศพที่ 1 (เหนือ)</span>
                    <span className="text-white font-black text-lg">วิศวกรรมธรณี</span>
                  </div>
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-primary/40 transition-colors">
                    <span className="text-[10px] text-gray-500 uppercase block mb-1 font-mono tracking-widest font-bold">ศพที่ 2 (ออก)</span>
                    <span className="text-white font-black text-lg">สิ่งแวดล้อม</span>
                  </div>
                  <div className="bg-primary/10 p-6 rounded-2xl border-2 border-primary/40">
                    <span className="text-[10px] text-primary uppercase block mb-1 font-mono tracking-widest font-black">ศพที่ 3 (ใต้)</span>
                    <span className="text-white font-black text-lg">เครื่องกลอากาศยาน</span>
                  </div>
                </div>

                <p>
                  อาทิตย์เริ่มจากการย้อนดูประวัติผู้เสียชีวิต ยิ่งตรวจลึกเท่าไร ยิ่งเห็นความผิดปกติ เพราะทั้ง 3 รายนั้นล้วนเป็น <span className="text-white font-black underline decoration-primary decoration-4 underline-offset-8">เพื่อนของ ตุ๊ ที่เสียชีวิตเมื่อ 2 ปีก่อน</span>
                </p>
                
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 text-white italic">
                  <p className="text-2xl leading-relaxed font-display font-bold text-gray-200">
                    "ตุ๊ มีเพื่อนทั้งหมด 5 คน (ไม่รวมตุ๊) ทำให้ตอนนี้เหลือเพียงสองคน ซึ่งหนึ่งในสองคนนี้อาจเป็นเหยื่อรายถัดไป..."
                  </p>
                </div>
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-white transition-all font-black text-sm uppercase tracking-widest group">
                  <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> 
                  RE_EXAMINE
                </button>
                <button onClick={onInvestigate} className="group flex items-center gap-6 bg-primary hover:bg-white text-black px-16 py-8 rounded-2xl font-black text-2xl transition-all shadow-2xl shadow-primary/40 italic">
                  <span className="material-symbols-outlined font-black text-3xl">terminal</span>
                  INITIATE_FORENSICS
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
