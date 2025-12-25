
import React, { useState } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';

interface AuthzViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

const AuthzView: React.FC<AuthzViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [flag, setFlag] = useState('');
  const [error, setError] = useState(false);
  const [logs] = useState<TerminalLine[]>([
    { timestamp: '10:42:01', type: 'SYSTEM', content: 'Stage 2 complete. Probing Authorization layer...' },
    { timestamp: '10:42:05', type: 'EXEC', content: 'GET /api/v1/profile', details: 'Status: 200 OK' },
    { timestamp: '10:43:12', type: 'ERR', content: 'GET /api/v1/admin/flags [403 FORBIDDEN]', details: 'Error: Insufficient Scope' }
  ]);

  const handleVerify = () => {
    if (flag.toUpperCase().trim() === 'FLAG{ADMIN_IDOR_X}') {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-background-dark pb-20">
      <StageHeader 
        stageName="AUTHORIZATION" 
        stageNumber={3} 
        timer={status.timer} 
        hintsUsed={status.hintsUsed} 
        onRequestHint={onRequestHint}
      />

      <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
        {/* Left: Access Context */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div className="glass-panel p-5 rounded-xl flex flex-col gap-6">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">Access Context</h3>
              <span className="material-symbols-outlined text-gray-500 text-sm">badge</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-border-dark flex items-center justify-center border border-gray-700 relative">
                <span className="material-symbols-outlined text-gray-400 text-3xl">person</span>
                <div className="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-4 border-surface-dark"></div>
              </div>
              <div className="font-mono">
                <div className="text-white font-bold text-sm">Subject: J.Doe</div>
                <div className="text-primary text-[10px] font-bold">ID: usr_882910</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-dark p-2 rounded border border-border-dark">
                <div className="text-[9px] text-gray-500 uppercase font-bold">Clearance</div>
                <div className="text-xs font-bold text-white">Level 1</div>
              </div>
              <div className="bg-surface-dark p-2 rounded border border-border-dark">
                <div className="text-[9px] text-gray-500 uppercase font-bold">Dept</div>
                <div className="text-xs font-bold text-white">Analyst Ops</div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Role Tree</h4>
              <div className="relative pl-4 space-y-6">
                <div className="absolute left-[19px] top-6 bottom-10 w-0.5 bg-gray-800"></div>
                
                <div className="flex items-center gap-4 opacity-40">
                   <div className="size-8 rounded bg-surface-dark border border-gray-700 flex items-center justify-center z-10"><span className="material-symbols-outlined text-sm">school</span></div>
                   <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-500 uppercase">Student</span></div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="absolute -left-[10px] w-4 h-0.5 bg-gray-800"></div>
                   <div className="size-8 rounded bg-primary/20 border border-primary flex items-center justify-center z-10 shadow-[0_0_10px_rgba(19,236,91,0.2)]">
                     <span className="material-symbols-outlined text-primary text-sm">person_search</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-white uppercase">Analyst (You)</span>
                     <span className="text-[8px] text-primary font-mono tracking-tighter">Inherits: Student</span>
                   </div>
                </div>

                <div className="flex items-center gap-4 opacity-30">
                   <div className="absolute -left-[10px] w-4 h-0.5 bg-gray-800"></div>
                   <div className="size-8 rounded bg-surface-dark border border-gray-700 flex items-center justify-center z-10">
                     <span className="material-symbols-outlined text-danger text-sm">lock</span>
                   </div>
                   <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-500 uppercase">Administrator</span></div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-accent-yellow/5 border border-accent-yellow/20 p-3 rounded-lg flex gap-3">
              <span className="material-symbols-outlined text-accent-yellow text-lg">warning</span>
              <p className="text-[10px] text-accent-yellow leading-relaxed uppercase tracking-tight">Warning: Horizontal privilege escalation attempt detected. System monitoring tightened.</p>
            </div>
          </div>
        </aside>

        {/* Center: Logic Panel */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="glass-panel flex-1 rounded-xl flex flex-col overflow-hidden relative min-h-[500px]">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Privilege Decision Management</h2>
              <p className="text-gray-500 text-sm mt-1 font-light tracking-wide">Evaluating active JWT claims against target resource policy.</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-black/20 relative min-h-[350px]">
               <div className="flex justify-between items-center w-full max-w-4xl relative flex-wrap gap-10 sm:flex-nowrap">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10 -translate-y-1/2 hidden sm:block"></div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 rounded-full bg-black border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(19,236,91,0.2)]">
                      <span className="material-symbols-outlined text-primary text-3xl font-bold">fingerprint</span>
                    </div>
                    <div className="bg-surface-dark px-3 py-1 rounded border border-gray-800 text-[10px] font-bold uppercase tracking-widest text-center">Identified</div>
                  </div>

                  <span className="material-symbols-outlined text-primary/40 hidden sm:block">arrow_forward</span>

                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 rounded-lg bg-black border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(19,236,91,0.2)]">
                      <span className="material-symbols-outlined text-primary text-3xl font-bold">badge</span>
                    </div>
                    <div className="bg-surface-dark px-3 py-1 rounded border border-gray-800 text-[10px] font-bold uppercase tracking-widest text-center">Analyst Role</div>
                  </div>

                  <span className="material-symbols-outlined text-primary/40 hidden sm:block">arrow_forward</span>

                  <div className="flex flex-col items-center gap-4">
                    <div className="size-20 rounded bg-black border-2 border-accent-yellow flex items-center justify-center z-10 animate-pulse">
                      <span className="material-symbols-outlined text-accent-yellow text-4xl">rule</span>
                    </div>
                    <div className="bg-surface-dark px-3 py-1 rounded border border-gray-800 text-[10px] font-bold uppercase tracking-widest text-center">Policy Engine</div>
                  </div>

                  <span className="material-symbols-outlined text-danger hidden sm:block">arrow_forward</span>

                  <div className="flex flex-col items-center gap-4">
                    <div className="size-16 rounded-full bg-black border-2 border-danger flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,51,51,0.2)]">
                      <span className="material-symbols-outlined text-danger text-3xl font-bold">block</span>
                    </div>
                    <div className="bg-danger/20 px-3 py-1 rounded border border-danger/40 text-[10px] font-bold uppercase tracking-widest text-danger text-center">DENIED</div>
                  </div>
               </div>

               <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-gray-800">
                 <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Resource:</span>
                 <span className="material-symbols-outlined text-gray-400 text-sm">dns</span>
                 <span className="text-[10px] text-white font-mono tracking-tighter">/api/v1/admin/flags</span>
               </div>
            </div>

            <div className="glass-panel mx-8 mb-8 flex flex-col bg-black/40 overflow-hidden min-h-[160px]">
               <div className="bg-accent-cyan/10 px-4 py-2 flex justify-between items-center border-b border-accent-cyan/20">
                 <span className="text-accent-cyan font-bold text-[9px] uppercase tracking-widest flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">token</span>
                   JWT Claims Analysis
                 </span>
                 <span className="text-gray-600 font-mono text-[9px]">Type: JWT_FORENSIC</span>
               </div>
               <div className="p-4 font-mono text-xs overflow-y-auto">
                 <pre className="text-gray-300">
{`{
  "sub": "1234567890",
  "name": "John Doe",
  "role": "analyst", 
  "iat": 1516239022,
  "scope": "read:cases" 
}`}
                 </pre>
               </div>
            </div>
          </div>

          {/* Action Bar - Redesigned to be much clearer and avoid collapsing */}
          <div className="glass-panel p-8 rounded-xl border-t-4 border-t-primary bg-black/40 shadow-2xl mt-4">
            <div className="flex flex-col gap-8">
              {/* Row 1: Label and Progress */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="size-2 bg-primary rounded-full animate-pulse"></div>
                   <label className="text-[12px] font-black text-primary uppercase tracking-[0.3em]">System Override Flag</label>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-4 text-[10px] font-mono text-gray-500 uppercase">
                    <span>STATUS: READY</span>
                    <span className="text-primary">95%</span>
                  </div>
                  <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[95%] shadow-[0_0_10px_rgba(19,236,91,0.5)]"></div>
                  </div>
                </div>
              </div>

              {/* Row 2: Large Input Field */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <span className={`material-symbols-outlined text-2xl ${error ? 'text-danger' : 'text-gray-500 group-focus-within:text-primary'}`}>flag</span>
                </div>
                <input 
                  type="text" 
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className={`block w-full bg-black/80 border-2 ${error ? 'border-danger' : 'border-gray-800 focus:border-primary'} rounded-xl pl-16 pr-6 py-6 text-white font-mono text-xl md:text-2xl tracking-[0.2em] focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-gray-900`}
                  placeholder="FLAG{ADMIN_IDOR_...}"
                />
                {error && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-danger font-bold text-xs uppercase tracking-widest animate-pulse">Invalid Code</div>}
              </div>

              {/* Row 3: Action Button */}
              <button 
                onClick={handleVerify}
                className="w-full bg-primary hover:bg-[#1efc7b] text-black font-black text-lg uppercase tracking-[0.3em] py-6 rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(19,236,91,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-4"
              >
                <span className="material-symbols-outlined font-black">verified_user</span>
                Verify Authorization
              </button>
            </div>
          </div>
        </section>

        {/* Right: Monitoring */}
        <aside className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
          <div className="h-[400px]">
            <Terminal title="AUTHZ CONSOLE - TTY3" lines={logs} />
          </div>
          
          <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
             <div className="flex items-center justify-between border-b border-white/5 pb-2">
               <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Rule Evaluation</h3>
               <span className="material-symbols-outlined text-gray-500 text-sm">gavel</span>
             </div>
             <div className="space-y-3">
               {[
                 { label: 'Authentication', sub: 'user.isAuthenticated == true', status: 'PASS', color: 'primary' },
                 { label: 'IP Whitelist', sub: 'src_ip in trusted_subnet', status: 'PASS', color: 'primary' },
                 { label: 'Role Permission', sub: 'user.role == "admin"', status: 'FAIL', color: 'danger' }
               ].map((rule, idx) => (
                 <div key={idx} className={`p-3 rounded border ${rule.color === 'primary' ? 'border-primary/20 bg-primary/5' : 'border-danger/20 bg-danger/5'} flex items-center justify-between`}>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-white uppercase">{rule.label}</span>
                     <span className="text-[8px] font-mono text-gray-500">{rule.sub}</span>
                   </div>
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${rule.color === 'primary' ? 'border-primary/40 text-primary' : 'border-danger/40 text-danger'}`}>{rule.status}</span>
                 </div>
               ))}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AuthzView;
