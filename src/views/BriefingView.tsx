import React, { useState, useEffect, useRef } from 'react';

interface BriefingViewProps {
  onInvestigate: () => void;
}

const BriefingView: React.FC<BriefingViewProps> = ({ onInvestigate }) => {
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // เสียงที่ใช้แต่ละหน้า
  const soundTracks = {
    1: 'https://assets.mixkit.co/active_storage/sfx/2465/2465.wav', // Dark forest
    2: 'https://assets.mixkit.co/active_storage/sfx/2458/2458.wav', // Water ritual
    3: 'https://assets.mixkit.co/active_storage/sfx/2466/2466.wav', // Cold wind
  };

  // เล่นเสียง
  const playSound = (step: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(soundTracks[step as keyof typeof soundTracks]);
    audio.loop = true;
    audio.volume = 1.0;
    
    audio.play().catch(err => {
      console.log('Audio play prevented:', err);
    });
    
    audioRef.current = audio;
    setIsPlaying(true);
  };

  // หยุดเสียง
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Toggle เสียง
  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound(step);
    }
  };

  // เปลี่ยนเสียงเมื่อเปลี่ยนหน้า
  useEffect(() => {
    if (isPlaying) {
      playSound(step);
    }
  }, [step]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

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
      
      {/* ปุ่มควบคุมเสียง */}
      <button 
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all group"
        title={isPlaying ? "ปิดเสียง" : "เปิดเสียง"}
      >
        <span className="material-symbols-outlined text-white text-xl">
          {isPlaying ? 'volume_up' : 'volume_off'}
        </span>
      </button>
      
      {/* --- หน้า 1: รายงานการเสียชีวิต --- */}
      {step === 1 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/10 shadow-2xl">
            <div className="p-8 md:p-16 text-left font-body">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">แฟ้มคดี_01</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">สถานะ: ด่วนที่สุด</span>
              </div>
              
              <h1 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic font-display">
                โศกนาฏกรรม<br/>
                <span className="text-primary">หนึ่งเดือน สามศพ</span>
              </h1>
              
              <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed">
                <p>
                  ในช่วงเดือนที่ผ่านมา เกิดเหตุการเสียชีวิตของนักศึกษา 3 รายติดต่อกัน ในช่วงเวลาไล่เลี่ยกันอย่างผิดปกติ
                </p>
                
                <div className="bg-primary/5 p-8 rounded-2xl border-l-8 border-primary text-white italic">
                  <p className="text-2xl leading-relaxed font-bold font-display">"สภาพการตายดูผิดปกติ... พร้อมหลักฐานทางนิติวิทยาศาสตร์ที่ชี้ว่ามีเงื่อนงำซ่อนอยู่"</p>
                </div>
                
                <p className="font-medium text-gray-400">
                   สังคมกำลังตื่นตระหนก มหาวิทยาลัยพยายามปิดข่าว แต่ความจริงไม่สามารถถูกฝังกลบได้
                </p>
              </div>

              <div className="mt-16 flex justify-end">
                <button onClick={nextStep} className="group flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                  รับภารกิจ
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- หน้า 2: ภารกิจสืบสวน --- */}
      {step === 2 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in slide-in-from-right-12 duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/10 shadow-2xl">
            <div className="p-8 md:p-16 text-left font-body">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">คำสั่ง_02</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">วัตถุประสงค์</span>
              </div>
              
              <h2 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic font-display">
                ค้นหา<br/>
                <span className="text-primary">สาเหตุที่แท้จริง</span>
              </h2>
              
              <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed">
                <p>
                  เจ้าหน้าที่ตำรวจไม่สามารถระบุสาเหตุการตายที่แน่ชัดได้ ข้อมูลบางอย่างถูกเข้ารหัสและซ่อนไว้ในระบบดิจิทัล
                </p>
                
                <div className="bg-black/60 p-10 rounded-3xl border-2 border-primary/20 text-center relative overflow-hidden">
                  <p className="text-white text-3xl font-black mb-4 italic leading-tight relative z-10 font-display">
                    "หน้าที่ของคุณคือการสืบหาว่า... พวกเขาตายเพราะอะไร?"
                  </p>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-6 relative z-10 font-mono">
                    เจาะลึกเข้าไปในหลักฐาน ถอดรหัสสิ่งที่ถูกซ่อนเร้น และเปิดโปงความจริง
                  </p>
                </div>
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-white transition-all font-black text-sm uppercase tracking-widest group">
                  <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> 
                  ย้อนกลับ
                </button>
                <button onClick={nextStep} className="group flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                  ตรวจสอบเบาะแสสำคัญ
                  <span className="material-symbols-outlined font-black group-hover:translate-x-3 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- หน้า 3: ความเชื่อมโยงกับตุ๊ --- */}
      {step === 3 && (
        <div className="min-h-screen w-full flex items-center justify-center p-6 sm:p-12 relative animate-in fade-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
          
          <div className="w-full max-w-5xl relative z-10 glass-panel rounded-[2rem] overflow-hidden border-primary/20 shadow-2xl">
            <div className="p-8 md:p-16 text-left font-body">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1 rounded border border-primary/20 tracking-wider uppercase">จุดเชื่อมโยง</span>
                <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase font-bold">ความสัมพันธ์ในอดีต</span>
              </div>
              
              <h2 className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight italic font-display">
                รอยต่อของอดีต<br />
                <span className="text-primary">"ตุ๊"</span>
              </h2>
              
              <div className="space-y-10 text-gray-300 text-lg md:text-xl leading-relaxed">
                <p>
                  จากการตรวจสอบประวัติผู้เสียชีวิตทั้ง 3 ราย พบจุดร่วมเพียงหนึ่งเดียวที่น่าสงสัย...
                </p>
                
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 text-white italic">
                  <p className="text-2xl leading-relaxed font-display font-bold text-gray-200">
                    "นักศึกษาทั้ง 3 คนที่เสียชีวิตเมื่อเดือนก่อน ล้วนเป็นเพื่อนสนิทของ <span className="text-primary border-b-2 border-primary">'ตุ๊'</span> นักศึกษาที่เสียชีวิตไปเมื่อ 2 ปีก่อน"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-60">
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-gray-500 uppercase block font-mono">Victim 01</span>
                    <span className="text-white font-bold">เพื่อนของตุ๊</span>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-gray-500 uppercase block font-mono">Victim 02</span>
                    <span className="text-white font-bold">เพื่อนของตุ๊</span>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-gray-500 uppercase block font-mono">Victim 03</span>
                    <span className="text-white font-bold">เพื่อนของตุ๊</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-between items-center">
                <button onClick={prevStep} className="flex items-center gap-2 text-gray-600 hover:text-white transition-all font-black text-sm uppercase tracking-widest group">
                  <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> 
                  ย้อนกลับ
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