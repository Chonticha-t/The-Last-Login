
import React from 'react';

interface BriefingViewProps {
  onInvestigate: () => void;
}

const BriefingView: React.FC<BriefingViewProps> = ({ onInvestigate }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-4 sm:p-6 lg:p-12 overflow-y-auto overflow-x-hidden relative">
      <div className="w-full max-w-5xl relative group animate-in fade-in zoom-in duration-500 py-10 mb-10">
        {/* Glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent-cyan/20 rounded-xl blur opacity-25"></div>
        
        {/* Main Briefing Card */}
        <div className="relative w-full glass-panel rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          {/* Left forensic strip */}
          <div className="hidden md:flex w-20 bg-primary/5 border-r border-primary/20 flex-col items-center justify-between py-10 shrink-0">
            <div className="writing-vertical text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase rotate-180 whitespace-nowrap">
              SECURE_HANDSHAKE_ESTABLISHED
            </div>
            <div className="flex flex-col gap-6">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary/10 rounded-full"></div>
              <div className="w-1 h-24 bg-gradient-to-b from-primary/40 to-transparent rounded-full"></div>
            </div>
            <span className="material-symbols-outlined text-primary/30">lock</span>
          </div>

          {/* Content area */}
          <div className="flex-1 p-6 sm:p-8 md:p-14 flex flex-col">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-10 border-b border-primary/10 pb-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded border border-primary/40 tracking-widest uppercase">CLASSIFIED</span>
                  <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase">REF: LTL-004-FORENSIC</span>
                </div>
                <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  CASE BRIEFING
                </h1>
                <p className="text-primary text-sm font-medium tracking-wide flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-sm">folder_managed</span>
                  FILE ID: #00491-A | OP: THE LAST LOGIN
                </p>
              </div>

              <div className="hidden sm:block text-right">
                <div className="text-[10px] text-gray-500 font-mono mb-1 tracking-widest">INCIDENT_STATUS</div>
                <div className="text-green-400 font-bold text-xs bg-green-900/20 px-4 py-1.5 rounded border border-green-500/30 inline-flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  OPEN FOR INVESTIGATION
                </div>
              </div>
            </div>

            <div className="space-y-8 text-gray-300 font-light leading-relaxed max-w-3xl">
              <div className="flex gap-4 sm:gap-6 group">
                <span className="text-primary/40 font-mono text-sm pt-1 group-hover:text-primary transition-colors shrink-0">01</span>
                <p className="text-base sm:text-lg md:text-xl">
                  At 03:00 AM local time, automated sentries detected a massive spike in outbound encrypted traffic originating from the CEO's personal terminal. This anomaly bypassed primary firewalls using a legacy authentication token thought to be decommissioned years ago.
                </p>
              </div>
              <div className="flex gap-4 sm:gap-6 group">
                <span className="text-primary/40 font-mono text-sm pt-1 group-hover:text-primary transition-colors shrink-0">02</span>
                <p className="text-base sm:text-lg md:text-xl">
                  Within minutes, terabytes of R&D schematics were exfiltrated to an unknown server cluster in the dark web. Immediately following the transfer, the terminal initiated a secure wipe sequence, scrubbing local event logs and cache files to cover the intruder's tracks.
                </p>
              </div>
              <div className="flex gap-4 sm:gap-6 bg-primary/5 p-4 sm:p-6 rounded-xl border-l-4 border-primary/60 group">
                <span className="text-primary/40 font-mono text-sm pt-1 group-hover:text-primary transition-colors shrink-0">03</span>
                <p className="text-base sm:text-lg md:text-xl text-white font-normal">
                  Your objective is to perform a digital autopsy on the recovered memory dump. You must reconstruct the session data, bypass the wiper's corruption, and identify the intruder before the trail goes cold. Good luck, investigator.
                </p>
              </div>
            </div>

            <div className="mt-14 flex flex-col items-center gap-8">
              <button 
                onClick={onInvestigate}
                className="group relative w-full md:w-auto min-w-0 sm:min-w-[360px] h-16"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-cyan to-primary rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative h-full w-full flex items-center justify-center gap-3 bg-primary hover:bg-[#1efc7b] text-black text-xl font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all transform group-hover:scale-[1.02] active:scale-95 border border-white/20 px-6">
                  <span className="material-symbols-outlined text-2xl font-bold">search</span>
                  Start Investigation
                </div>
              </button>

              <div className="flex items-center gap-6 sm:gap-10 flex-wrap justify-center pb-6">
                <button className="text-gray-500 hover:text-white transition-colors text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  Rules of Engagement
                </button>
                <div className="hidden sm:block w-px h-4 bg-gray-800"></div>
                <button className="text-gray-500 hover:text-white transition-colors text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                  <span className="material-symbols-outlined text-sm">group</span>
                  The Team
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* HUD Corner Accents */}
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary pointer-events-none opacity-50 hidden sm:block"></div>
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary pointer-events-none opacity-50 hidden sm:block"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-primary pointer-events-none opacity-50 hidden sm:block"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary pointer-events-none opacity-50 hidden sm:block"></div>
      </div>
    </div>
  );
};

export default BriefingView;
