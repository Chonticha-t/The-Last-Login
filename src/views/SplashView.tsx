
import React from 'react';

interface SplashViewProps {
  onStart: () => void;
}

const SplashView: React.FC<SplashViewProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden bg-background-dark min-h-screen">
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
        <img 
          src="https://picsum.photos/id/1/1920/1080" 
          alt="Forensic Network" 
          className="w-full h-full object-cover grayscale" 
        />
        <div className="absolute inset-0 bg-background-dark/90"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center py-20 text-center">
        <div className="absolute -inset-20 bg-primary/10 blur-[150px] rounded-full animate-pulse"></div>

        <div className="relative mb-8 max-w-4xl px-4">
           <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-[0_0_30px_rgba(255,0,0,0.5)] uppercase font-display leading-tight">
           รหัสลับสี่ทิศ:<br/>พิธีกรรมแห่งการเข้าถึง
          </h1>
        </div>

        <div className="flex items-center gap-6 mt-2 mb-20">
          <div className="h-px w-12 sm:w-24 bg-primary/40"></div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary font-mono">
            แฟ้มคดีนิติวิทยาศาสตร์ดิจิทัล
          </h2>
          <div className="h-px w-12 sm:w-24 bg-primary/40"></div>
        </div>

        <div className="flex flex-col items-center gap-12 w-full max-w-sm">
          <button 
            onClick={onStart}
            className="group relative w-full h-20 flex items-center justify-center overflow-hidden rounded-2xl bg-primary text-black transition-all duration-300 hover:bg-white hover:shadow-[0_0_60px_rgba(255,0,0,0.4)] active:scale-95 shadow-2xl shadow-primary/20"
          >
            <span className="material-symbols-outlined mr-4 text-3xl font-black">lock_open</span>
            <span className="text-lg font-black tracking-tight uppercase">เริ่มการสืบสวน</span>
          </button>

          <div className="flex items-center gap-10 text-[10px] uppercase font-bold text-gray-700 font-mono tracking-wider">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">security</span>
              <span>พื้นที่ควบคุมพิเศษ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>ระบบออนไลน์</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-10 top-10 w-24 h-24 border-t-4 border-l-4 border-primary/20 pointer-events-none"></div>
      <div className="absolute right-10 top-10 w-24 h-24 border-t-4 border-r-4 border-primary/20 pointer-events-none"></div>
      <div className="absolute left-10 bottom-10 w-24 h-24 border-b-4 border-l-4 border-primary/20 pointer-events-none"></div>
      <div className="absolute right-10 bottom-10 w-24 h-24 border-b-4 border-r-4 border-primary/20 pointer-events-none"></div>
    </div>
  );
};

export default SplashView;
