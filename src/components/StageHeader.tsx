
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
    <header className="relative z-20 flex items-center justify-between border-b border-border-dark bg-surface-dark/90 px-6 py-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded border border-primary/30">
          <span className="material-symbols-outlined text-2xl">fingerprint</span>
        </div>
        <div>
          <h2 className="text-white text-lg font-bold tracking-tight uppercase">THE LAST LOGIN</h2>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] font-mono leading-none">CYBER FORENSIC UNIT</p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center">
        <h1 className="text-white text-lg font-bold tracking-widest uppercase">
          STAGE {stageNumber} / 3 — {stageName}
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-primary font-mono mt-1 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          ENCRYPTED SESSION ACTIVE
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-1.5 font-mono">
          <div className="bg-black/50 px-2 py-1 rounded border border-primary/20 flex flex-col items-center min-w-[40px]">
            <span className="text-primary font-bold">{h}</span>
            <span className="text-[8px] text-gray-500 uppercase">hrs</span>
          </div>
          <div className="bg-black/50 px-2 py-1 rounded border border-primary/20 flex flex-col items-center min-w-[40px]">
            <span className="text-primary font-bold">{m}</span>
            <span className="text-[8px] text-gray-500 uppercase">min</span>
          </div>
          <div className="bg-black/50 px-2 py-1 rounded border border-accent-yellow/20 flex flex-col items-center min-w-[40px]">
            <span className="text-accent-yellow font-bold animate-pulse">{s}</span>
            <span className="text-[8px] text-gray-500 uppercase">sec</span>
          </div>
        </div>

        <button 
          onClick={onRequestHint}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-3 py-1.5 rounded transition-all group active:scale-95"
        >
          <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">lightbulb</span>
          <span className="text-xs font-bold">HINTS: {hintsUsed}/3</span>
        </button>
      </div>
    </header>
  );
};

export default StageHeader;
