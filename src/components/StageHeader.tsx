
import React from 'react';

interface StageHeaderProps {
  stageName: string;
  stageNumber: number;
  timer: number;
  hintsUsed: number;
  onRequestHint?: () => void;
}

const StageHeader: React.FC<StageHeaderProps> = ({ stageName, stageNumber, timer, hintsUsed, onRequestHint }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timer);

  return (
    <header className="relative z-20 flex items-center justify-between border-b-2 border-border-dark bg-surface-dark/95 px-8 py-5 shadow-2xl backdrop-blur-md font-display">
      <div className="flex items-center gap-6 text-left">
        <div className="size-10 text-primary flex items-center justify-center bg-primary/10 rounded-xl border-2 border-primary shadow-[0_0_15px_rgba(255,0,0,0.3)]">
          <span className="material-symbols-outlined text-3xl font-black italic">emergency_home</span>
        </div>
        <div>
          <h2 className="text-white text-xl font-black tracking-tight uppercase italic leading-none">The Four Directions Cipher</h2>
          <p className="text-[11px] text-primary font-bold tracking-widest uppercase mt-1">Digital Forensic Unit</p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center">
        <h1 className="text-white text-2xl font-black tracking-tight uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          STAGE {stageNumber} / 3 — {stageName}
        </h1>
        <div className="flex items-center gap-3 text-[11px] text-primary font-bold mt-1 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,0,0,1)]"></span>
          RESTRICTED PROTOCOL ACTIVE
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex gap-2 font-mono">
          <div className="bg-black border-2 border-white/10 px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[45px]">
            <span className="text-primary font-black text-lg leading-none">{h}</span>
            <span className="text-[9px] text-gray-600 uppercase font-black">H</span>
          </div>
          <div className="bg-black border-2 border-white/10 px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[45px]">
            <span className="text-primary font-black text-lg leading-none">{m}</span>
            <span className="text-[9px] text-gray-600 uppercase font-black">M</span>
          </div>
          <div className="bg-black border-2 border-primary px-3 py-1.5 rounded-xl flex flex-col items-center min-w-[45px] shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            <span className="text-white font-black text-lg leading-none animate-pulse">{s}</span>
            <span className="text-[9px] text-primary uppercase font-black">S</span>
          </div>
        </div>

        <button 
          onClick={onRequestHint}
          className="flex items-center gap-3 bg-primary text-black px-6 py-3 rounded-2xl transition-all group active:scale-95 uppercase font-black italic shadow-lg shadow-primary/30 hover:bg-white"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform font-black">psychology</span>
          <span className="text-xs tracking-widest font-black">INTEL: {hintsUsed}/3</span>
        </button>
      </div>
    </header>
  );
};

export default StageHeader;
