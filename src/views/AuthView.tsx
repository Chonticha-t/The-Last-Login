
import React, { useState } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';
import EvidenceModal from '../components/EvidenceModal';

interface AuthViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [flag, setFlag] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, type: string, content: string} | null>(null);
  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: '14:02:11', type: 'SYSTEM', content: 'Stage 1 clear. Moving to Authentication Module...' },
    { timestamp: '14:02:15', type: 'INFO', content: 'Intercepting session metadata from JSON artifacts.' },
    { timestamp: '14:02:20', type: 'WARN', content: 'MFA requirement detected. OTP sequence initiated.' }
  ]);

  const addLog = (line: TerminalLine) => setLogs(prev => [...prev, line]);

  const handleVerifyOtp = () => {
    setIsOtpVerifying(true);
    addLog({ timestamp: '14:10:00', type: 'LOAD', content: 'Verifying TOTP challenge response...' });
    
    setTimeout(() => {
      // The logic from otp_seed suggested padding or simple match
      // For gameplay, let's accept any 6 digits to keep flow, or a specific one if you prefer
      if (otp.length === 6) {
        addLog({ timestamp: '14:10:05', type: 'SUCCESS', content: 'MFA Step 1/2 complete. Proceed to JWT manipulation.' });
      } else {
        addLog({ timestamp: '14:10:05', type: 'ERR', content: 'Invalid OTP length. Expected 6 digits.' });
      }
      setIsOtpVerifying(false);
    }, 1500);
  };

  const handleVerifyFlag = () => {
    if (flag.toUpperCase().trim() === 'FLAG{JWT_WEAK_SIGN}') {
      addLog({ timestamp: '14:12:00', type: 'SUCCESS', content: 'JWT Signature Validated! Session Hijacked.' });
      setTimeout(onComplete, 1000);
    } else {
      addLog({ timestamp: '14:05:01', type: 'ERR', content: 'Auth token rejected. Signature mismatch or expired.' });
    }
  };

  const artifactData: Record<string, { name: string, type: string, content: string }> = {
    'otp_seed.txt': {
      name: 'otp_seed.txt',
      type: 'MFA CONFIG',
      content: "TOTP CONFIGURATION\nAlgorithm: SHA1\nDigits: 6\nPeriod: 30s\nSecret Seed: J8X299L0K1S5H6P4\n\nNOTE: The emergency fallback code for analyst_07 is always the current challenge token padded with zeros if needed."
    },
    'session_meta.json': {
      name: 'session_meta.json',
      type: 'SESSION METADATA',
      content: "{\n  \"session_id\": \"0x4F912AA892FF01\",\n  \"auth_method\": \"JWT\",\n  \"jwt_header\": {\n    \"alg\": \"HS256\",\n    \"typ\": \"JWT\"\n  },\n  \"security_note\": \"The HS256 secret key was set to the default company name 'CYBERUNIT' during the initial setup. Needs rotation!\"\n}"
    }
  };

  return (
    <div className="h-full flex flex-col bg-background-dark">
      <StageHeader 
        stageName="AUTHENTICATION" 
        stageNumber={2} 
        timer={status.timer} 
        hintsUsed={status.hintsUsed} 
        onRequestHint={onRequestHint}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 sm:p-6 gap-6">
        {/* Left: Intel Data */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto lg:overflow-visible">
          <div className="glass-panel rounded-xl flex flex-col h-full min-h-[300px]">
            <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center rounded-t-xl">
              <h3 className="text-primary font-black text-xs tracking-widest uppercase">Identity Intel</h3>
              <span className="material-symbols-outlined text-primary text-sm">badge</span>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-6 font-mono text-xs">
              <div>
                <label className="text-gray-500 mb-2 block tracking-widest uppercase text-[10px]">User Account</label>
                <div className="bg-black/60 p-3 rounded border border-gray-800 text-white flex justify-between items-center group">
                  <span>analyst_07</span>
                  <span className="material-symbols-outlined text-gray-700 group-hover:text-primary cursor-pointer text-sm">content_copy</span>
                </div>
              </div>
              <div>
                <label className="text-gray-500 mb-2 block tracking-widest uppercase text-[10px]">Session ID</label>
                <div className="bg-black/60 p-3 rounded border border-gray-800 text-accent-cyan truncate">0x4F912AA892FF01</div>
              </div>
              <div>
                <label className="text-gray-500 mb-2 block tracking-widest uppercase text-[10px]">OTP Seed (Encrypted)</label>
                <div className="bg-black/60 p-3 rounded border border-gray-800 text-accent-yellow font-bold tracking-widest blur-[3px] hover:blur-0 transition-all cursor-help">
                  J8X2-99L0-K1S...
                </div>
              </div>
              
              <div className="mt-auto border-t border-white/5 pt-6">
                 <label className="text-gray-500 mb-4 block tracking-widest uppercase text-[10px]">Related Artifacts</label>
                 <div className="flex flex-col gap-2">
                   {Object.keys(artifactData).map(fileName => (
                     <div 
                        key={fileName} 
                        onClick={() => setSelectedFile(artifactData[fileName])}
                        className="flex items-center gap-3 p-3 rounded bg-black/40 border border-gray-800 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                      >
                       <span className="material-symbols-outlined text-gray-500 group-hover:text-primary text-lg">description</span>
                       <span className="text-gray-400 group-hover:text-white truncate text-[11px] font-bold">{fileName}</span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Interactive Workspace */}
        <section className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Auth Diagram */}
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden min-h-[240px] flex flex-col">
            <h3 className="text-white font-black text-xs tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">account_tree</span>
              Verification Workflow
            </h3>
            <div className="relative flex justify-between items-center max-w-2xl mx-auto w-full flex-wrap gap-4 sm:flex-nowrap">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-800 -translate-y-1/2 -z-10 hidden sm:block"></div>
              
              {[
                { label: 'Credentials', icon: 'key', active: false, done: true },
                { label: 'OTP Check', icon: 'lock_clock', active: true, done: false },
                { label: 'MFA', icon: 'star_half', active: false, done: false },
                { label: 'JWT Issued', icon: 'verified_user', active: false, done: false }
              ].map((step, idx) => (
                <div key={idx} className={`flex flex-col items-center gap-2 bg-background-dark p-2 rounded-lg z-10 border transition-all ${step.active ? 'border-accent-yellow animate-pulse shadow-[0_0_15px_rgba(255,230,0,0.2)]' : step.done ? 'border-primary' : 'border-gray-800 opacity-50'}`}>
                  <div className={`size-10 rounded-full flex items-center justify-center ring-1 ring-inset ${step.active ? 'bg-accent-yellow/10 text-accent-yellow ring-accent-yellow' : step.done ? 'bg-primary/10 text-primary ring-primary' : 'bg-gray-800 text-gray-500 ring-gray-700'}`}>
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${step.active ? 'text-white' : step.done ? 'text-primary' : 'text-gray-600'}`}>{step.label}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-10 font-mono tracking-widest uppercase">CURRENT_STATUS: WAITING_FOR_CHALLENGE_RESPONSE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OTP Module */}
            <div className="glass-panel rounded-xl flex flex-col min-h-[300px]">
              <div className="bg-primary/10 p-4 border-b border-primary/20">
                <h3 className="text-white font-black text-xs tracking-widest uppercase">Interactive OTP</h3>
              </div>
              <div className="p-8 flex flex-col items-center justify-center gap-6 flex-1">
                <div className="w-full text-center">
                  <label className="text-[10px] font-mono text-accent-yellow mb-4 block uppercase tracking-[0.3em]">Challenge Token: 49-X-91</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    disabled={isOtpVerifying}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full max-w-[280px] bg-black/60 border border-primary/30 rounded-lg p-4 text-center text-4xl tracking-[0.4em] text-white font-mono focus:ring-1 focus:ring-primary focus:outline-none placeholder-gray-800 disabled:opacity-50"
                    placeholder="000000"
                  />
                </div>
                <button 
                  onClick={handleVerifyOtp}
                  disabled={isOtpVerifying || !otp}
                  className="w-full max-w-[280px] py-4 bg-primary hover:bg-[#1efc7b] text-black font-black text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-[0_0_20px_rgba(19,236,91,0.4)] disabled:bg-gray-800 disabled:text-gray-500"
                >
                  {isOtpVerifying ? 'Verifying...' : 'Verify Response'}
                </button>
                <div className="flex items-center gap-2 text-[10px] font-mono mt-2">
                  <span className={`w-2 h-2 rounded-full ${isOtpVerifying ? 'bg-accent-yellow animate-ping' : 'bg-primary'} `}></span>
                  <span className="text-gray-500">MFA_ENGINE_STATUS: </span>
                  <span className="text-primary font-bold">{isOtpVerifying ? 'PROCESSING' : 'READY'}</span>
                </div>
              </div>
            </div>

            {/* JWT Inspector */}
            <div className="glass-panel rounded-xl flex flex-col overflow-hidden min-h-[300px]">
              <div className="bg-accent-cyan/10 p-4 border-b border-accent-cyan/20 flex justify-between items-center">
                <h3 className="text-white font-black text-xs tracking-widest uppercase">Token Inspector</h3>
                <span className="text-[9px] font-bold bg-danger/20 text-danger border border-danger/30 px-2 py-0.5 rounded uppercase">Unverified</span>
              </div>
              <div className="p-5 font-mono text-[11px] overflow-y-auto flex-1 bg-black/40">
                 <div className="space-y-4">
                   <div>
                     <span className="text-gray-600 block mb-1 uppercase text-[9px] font-bold">// JOSE Header</span>
                     <div className="text-danger break-all">{"{"}"alg":"HS256","typ":"JWT"{"}"}</div>
                   </div>
                   <div>
                     <span className="text-gray-600 block mb-1 uppercase text-[9px] font-bold">// Payload</span>
                     <div className="text-accent-cyan break-all">{"{"}"sub":"analyst_07","role":"analyst","exp":1718923000{"}"}</div>
                   </div>
                   <div>
                     <span className="text-gray-600 block mb-1 uppercase text-[9px] font-bold">// Signature</span>
                     <div className="text-primary blur-[2px] hover:blur-none transition-all cursor-pointer break-all">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</div>
                   </div>
                 </div>
                 <div className="mt-8 bg-accent-yellow/5 border border-accent-yellow/20 p-3 rounded-lg flex gap-3 animate-in fade-in slide-in-from-bottom duration-1000">
                   <span className="material-symbols-outlined text-accent-yellow text-sm">warning</span>
                   <p className="text-[10px] text-accent-yellow leading-relaxed uppercase tracking-tight">Warning: Weak symmetric algorithm (HS256) detected. Signature may be vulnerable to brute-force or manipulation.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="glass-panel p-5 rounded-xl border-t-2 border-t-primary bg-black/40 flex flex-col gap-4 mt-auto">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Authentication Flag Input</label>
              <span className="text-[10px] font-mono text-primary font-bold">STAGE_02_PROGRESS: 66%</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden shadow-inner">
               <div className="bg-primary h-full w-[66%] shadow-[0_0_15px_rgba(19,236,91,0.6)]"></div>
            </div>
            <div className="flex gap-4 items-stretch mt-1 flex-wrap sm:flex-nowrap">
               <div className="relative flex-1 group min-w-[200px]">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">flag</span>
                 <input 
                  type="text" 
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="w-full bg-black/60 border border-gray-800 focus:border-primary rounded-lg pl-12 pr-4 py-4 text-white font-mono text-sm focus:ring-0 transition-all placeholder-gray-800"
                  placeholder="FLAG{JWT_...}"
                 />
               </div>
               <button 
                onClick={handleVerifyFlag}
                className="bg-white hover:bg-gray-200 text-black font-black text-xs uppercase tracking-widest px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
               >
                 Verify Auth
                 <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </button>
            </div>
          </div>
        </section>

        {/* Right: Terminal */}
        <aside className="w-full lg:w-96 flex flex-col h-[400px] lg:h-full">
          <Terminal title="AUTH CONSOLE - TTY2" lines={logs} />
        </aside>
      </div>

      <EvidenceModal 
        isOpen={!!selectedFile} 
        onClose={() => setSelectedFile(null)} 
        file={selectedFile} 
      />
    </div>
  );
};

export default AuthView;
