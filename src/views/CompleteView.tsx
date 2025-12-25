
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
    // Simulate server upload
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
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || h > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(' ');
  };

  if (isFinalized) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-background-dark animate-in fade-in zoom-in duration-1000">
        <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none"></div>
        
        {/* Final Certificate / Dossier */}
        <div className="w-full max-w-2xl bg-[#0d1a12] border-2 border-primary/30 p-10 md:p-16 rounded-sm shadow-[0_0_100px_rgba(19,236,91,0.1)] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -mr-16 -mt-16 rotate-45"></div>
          <div className="absolute bottom-4 right-4 opacity-20">
             <span className="material-symbols-outlined text-8xl text-primary">verified_user</span>
          </div>

          <div className="border-b-2 border-primary/20 pb-8 mb-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-primary font-black text-xs tracking-[0.5em] uppercase mb-2">Digital Forensic Unit</h1>
                <h2 className="text-white text-4xl font-black tracking-tighter uppercase">Case Closed</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-mono text-[10px] uppercase">File Ref</p>
                <p className="text-white font-mono text-xs">#LTL-FINAL-2024</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-gray-600 font-bold text-[10px] uppercase tracking-widest block mb-1">Investigator</label>
                <p className="text-white text-xl font-bold tracking-tight">AGENT_ONYX</p>
              </div>
              <div>
                <label className="text-gray-600 font-bold text-[10px] uppercase tracking-widest block mb-1">Clearance Level</label>
                <p className="text-primary text-xl font-black tracking-widest">RANK: S-CLASS</p>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 p-6 rounded">
              <div className="grid grid-cols-2 gap-y-4">
                <span className="text-gray-500 text-xs font-mono">Mission Duration:</span>
                <span className="text-white text-xs font-mono text-right">{formatTime(status.timer)}</span>
                
                <span className="text-gray-500 text-xs font-mono">Hints Utilized:</span>
                <span className={`text-xs font-mono text-right ${status.hintsUsed > 0 ? 'text-accent-yellow' : 'text-primary'}`}>
                  {status.hintsUsed} / 3
                </span>

                <span className="text-gray-500 text-xs font-mono">Data Integrity:</span>
                <span className="text-primary text-xs font-mono text-right">100% VERIFIED</span>
              </div>
            </div>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10 border-dashed"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#0d1a12] px-4 text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">Evaluation Result</span></div>
            </div>

            <p className="text-gray-300 italic text-center text-sm leading-relaxed">
              "The suspect's encryption was neutralized with surgical precision. By bypassing the legacy JWT claims and identifying the IDOR vulnerability, you have successfully secured the CEO's terminal and prevented a global data leak."
            </p>

            <div className="flex justify-center pt-6">
              <div className="border-2 border-danger/40 text-danger px-8 py-3 rounded-md font-black text-2xl rotate-[-5deg] uppercase tracking-widest opacity-80 border-double">
                CONFIDENTIAL
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="mt-12 text-gray-500 hover:text-primary transition-all font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">logout</span>
          Terminate Session & Exit
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start p-6 lg:p-12 relative overflow-y-auto overflow-x-hidden bg-background-dark">
      {/* Background celebration glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl flex flex-col gap-10 relative z-10 animate-in fade-in slide-in-from-bottom duration-1000 py-10">
        <div className="text-center flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
            <span className="material-symbols-outlined text-primary text-8xl relative z-10 animate-pulse">check_circle</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(19,236,91,0.5)] uppercase text-center">MISSION COMPLETE</h2>
            <p className="text-primary text-lg md:text-xl font-bold tracking-[0.3em] uppercase opacity-90 text-center">THE LAST LOGIN HAS BEEN REVEALED</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl border-primary/20">
          <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-black/40 flex-wrap gap-4">
            <h3 className="text-lg font-black tracking-[0.2em] text-white uppercase flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">assignment</span>
              Final Forensic Report
            </h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">CASE_ID: #8829-XF-COMPLETED</span>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              <div className="flex flex-col gap-2 relative pl-6 border-l-2 border-primary/40">
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Identified Account</span>
                <p className="text-2xl text-white font-black tracking-tight">admin_root_01</p>
              </div>
              <div className="flex flex-col gap-2 relative pl-6 border-l-2 border-primary/40">
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Timestamp</span>
                <p className="text-2xl text-white font-mono tracking-tighter">2023-10-27T14:30:00Z</p>
              </div>
              <div className="flex flex-col gap-2 relative pl-6 border-l-2 border-primary/40">
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Exploit Vector</span>
                <p className="text-xl text-white font-bold tracking-tight">IDOR / Authentication Bypass</p>
              </div>
              <div className="flex flex-col gap-2 relative pl-6 border-l-2 border-primary/40">
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Resolution Status</span>
                <div className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#13ec5b]"></span>
                  <p className="text-xl text-primary font-black uppercase tracking-widest">RESOLVED</p>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12"></div>

            <div className="flex flex-col gap-6">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Investigation Lifecycle Summary</span>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'CRYPTO', icon: 'encrypted' },
                  { label: 'AUTH', icon: 'fingerprint' },
                  { label: 'AUTHZ', icon: 'admin_panel_settings' }
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(19,236,91,0.1)]">
                    <span className="material-symbols-outlined text-lg">{s.icon}</span>
                    <span className="text-sm font-black tracking-widest">{s.label}</span>
                    <span className="material-symbols-outlined text-sm font-bold ml-1">check</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-surface-dark border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-2xl group relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="flex-1 w-full space-y-3 relative z-10">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] font-bold">FINAL_FLAG_CAPTURE</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-primary opacity-50">flag</span>
              <input 
                type="text" 
                readOnly 
                value="FLAG{THE_LAST_LOGIN_REVEALED}"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-5 pl-14 pr-4 text-primary font-mono text-xl tracking-[0.1em] shadow-inner outline-none select-all"
              />
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-5 bg-primary hover:bg-[#1efc7b] disabled:bg-gray-800 disabled:text-gray-500 text-black font-black text-lg rounded-xl shadow-[0_0_30px_rgba(19,236,91,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 relative z-10 min-w-[240px]"
          >
            {isSubmitting ? (
              <>
                <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                UPLOADING...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined font-bold">send</span>
                SUBMIT RESULT
              </>
            )}
          </button>
        </div>

        <div className="flex justify-center gap-6 mt-4 flex-wrap">
           <button onClick={onReset} className="px-8 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">refresh</span>
             Restart Investigation
           </button>
           <button className="px-8 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">leaderboard</span>
             View Leaderboard
           </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteView;
