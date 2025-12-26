
import React, { useState} from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';

interface AuthzViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

interface AuthzTask {
  id: number;
  title: string;
  category: string;
  desc: string;
  ans: string;
  hint: string;
}

const AuthzView: React.FC<AuthzViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  const tasks: AuthzTask[] = [
    { 
      id: 1, 
      category: "Access Matrix",
      title: "The Master Anomaly", 
      desc: "ในตาราง Matrix ใครคือผู้ที่มีสิทธิ์ 'W' (Write) ในทุกพิกัด (N, E, S, W)? ป้อนรหัส UID ของผู้นั้น", 
      ans: "DRM-01",
      hint: "สังเกตแถวในตารางที่ช่อง N, E, S, W มีค่าเป็น W ทั้งหมด"
    },
    { 
      id: 2, 
      category: "MLS Protocol",
      title: "LaPadula Breach", 
      desc: "ภายใต้กฎ 'No Read Up', หากคุณมี Clearance 'SECRET' (Level 2) คุณจะไม่สามารถอ่านไฟล์ระดับใดได้? (ป้อนระดับ: TOP-SECRET)", 
      ans: "TOP-SECRET",
      hint: "กฎ No Read Up ห้ามผู้ใช้ระดับต่ำอ่านข้อมูลในระดับที่สูงกว่าตน"
    },
    { 
      id: 3, 
      category: "Attribute Policy",
      title: "Ritual Timestamp", 
      desc: "ระบุค่า Attribute 'Time' ที่คนร้ายตั้งค่าไว้เพื่อให้ระบบทำงานเฉพาะเวลาพิธีกรรม (ดูได้จากไฟล์ POLICY.JSON)", 
      ans: "03:00",
      hint: "หาค่าที่อยู่คู่กับคีย์ 'Access_Time' ในโครงสร้าง JSON"
    },
    { 
      id: 4, 
      category: "Final Justice",
      title: "Incriminate Admin", 
      desc: "ป้อนรหัสคำสั่งสุดท้ายเพื่อยืนยันว่า 'ดร.มนัส' คือฆาตกรตัวจริง (คำใบ้: INCRIMINATE-[รหัสจากด่านที่ 1])", 
      ans: "INCRIMINATE-MANAT-52",
      hint: "ใช้คำนำหน้า INCRIMINATE- ตามด้วยรหัสที่เราหาได้จาก Digital Signature ของดร.มนัส"
    }
  ];

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', content: 'Privilege Escalation Module: ONLINE.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'WARN', content: 'Target: Dr. Manas Laboratory Server (Locked).' }
  ]);

  const handleVerify = () => {
    setIsVerifying(true);
    const task = tasks[currentTaskIndex];
    setTimeout(() => {
      if (inputValue.trim().toUpperCase() === task.ans.toUpperCase()) {
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'SUCCESS', content: `[${task.category}] Access Authorized.` }]);
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
          setInputValue('');
        } else {
          onComplete();
        }
      } else {
        setError(true);
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'ERR', content: 'Authorization Denied: Integrity Violation.' }]);
        setTimeout(() => setError(false), 1000);
      }
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display">
      <StageHeader stageName="AUTHORIZATION_JUSTICE" stageNumber={3} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-[450px] border-r-2 border-border-dark bg-black/95 p-8 shrink-0 space-y-12">
          <div>
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6 italic">ACCESS_CONTROL_MATRIX</h3>
            <div className="overflow-hidden rounded-2xl border-2 border-primary/20">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="p-4 text-left border-b border-primary/20">UID</th>
                    <th className="p-4 border-b border-primary/20">N</th>
                    <th className="p-4 border-b border-primary/20">E</th>
                    <th className="p-4 border-b border-primary/20">S</th>
                    <th className="p-4 border-b border-primary/20">W</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-bold text-white">SAK-91</td>
                    <td className="p-4 text-center">R</td>
                    <td className="p-4 text-center">R</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center">-</td>
                  </tr>
                  <tr className="bg-primary/20">
                    <td className="p-4 font-black text-primary">DRM-01</td>
                    <td className="p-4 text-center font-black">W</td>
                    <td className="p-4 text-center font-black">W</td>
                    <td className="p-4 text-center font-black">W</td>
                    <td className="p-4 text-center font-black">W</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-white">VP-TWAT</td>
                    <td className="p-4 text-center">R</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center">R</td>
                    <td className="p-4 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest italic">SECURITY_CLEARANCE_MODEL</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-5 bg-red-900/30 border-2 border-primary rounded-2xl">
                <span className="text-xs font-black bg-primary text-black px-3 py-1 rounded-lg">LVL 3</span>
                <span className="text-sm font-bold text-red-100 uppercase italic">TOP-SECRET</span>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl opacity-60">
                <span className="text-xs font-black bg-white text-black px-3 py-1 rounded-lg">LVL 2</span>
                <span className="text-sm font-bold text-gray-400 uppercase italic">SECRET</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6 italic">POLICY_DEFINITIONS</h3>
            <div className="bg-black/80 p-6 rounded-2xl border-2 border-primary/20 font-mono text-[11px] text-primary/80 leading-relaxed">
              <pre className="whitespace-pre-wrap">
{`{
  "Rule": "RITUAL_ENFORCE",
  "Action": "ACCESS_VAULT",
  "Condition": {
    "Role": "ADMIN",
    "Access_Time": "03:00",
    "Environment": "LAB_01"
  },
  "Effect": "Permit"
}`}
              </pre>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-12 flex flex-col gap-12 relative pb-40">
          <div className="max-w-4xl mx-auto w-full space-y-16 py-12">
            <div className="flex items-center gap-10">
              <div className="size-20 rounded-[2rem] border-4 border-primary bg-primary/10 flex items-center justify-center text-primary animate-pulse shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                <span className="material-symbols-outlined text-5xl font-black italic">gavel</span>
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight italic drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]">PHASE_JUSTICE</h1>
                <p className="text-primary font-bold text-sm mt-3 tracking-widest uppercase italic">FINALIZING AUTHORIZATION CHAIN</p>
              </div>
            </div>

            <div className="glass-panel p-16 rounded-[4rem] border-4 border-primary/20 bg-black/95 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[200px] font-black italic">policy</span>
              </div>

              <div className="relative z-10 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/30 uppercase tracking-widest">
                      {tasks[currentTaskIndex].category}
                    </span>
                    <span className="text-gray-500 font-bold text-xs uppercase italic">STEP {currentTaskIndex + 1} / 4</span>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight italic leading-none">
                    {tasks[currentTaskIndex].title}
                  </h2>
                  <p className="text-gray-300 text-2xl leading-snug italic font-medium">
                    "{tasks[currentTaskIndex].desc}"
                  </p>
                </div>

                <div className="space-y-8 pt-10 border-t-2 border-white/5">
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={inputValue} 
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleVerify()}
                      autoFocus
                      className={`w-full bg-black border-2 ${error ? 'border-primary animate-shake' : 'border-primary/20 focus:border-primary'} rounded-[2.5rem] py-10 px-14 font-mono text-3xl text-white outline-none transition-all placeholder-red-950 uppercase italic font-bold shadow-2xl tracking-tight`}
                      placeholder="ENTER_PERMIT_CODE..."
                      disabled={isVerifying}
                    />
                    {isVerifying && <div className="absolute right-10 top-1/2 -translate-y-1/2 size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                  
                  <button 
                    onClick={handleVerify}
                    disabled={isVerifying || !inputValue}
                    className="w-full bg-primary hover:bg-white disabled:bg-gray-900 disabled:text-gray-700 text-black font-black py-10 rounded-[2.5rem] uppercase tracking-widest text-3xl transition-all shadow-2xl shadow-primary/40 transform active:scale-[0.98] flex items-center justify-center gap-10 italic"
                  >
                    <span className="material-symbols-outlined font-black text-5xl">verified_user</span>
                    {isVerifying ? 'AUTHORIZING...' : 'EXECUTE_PRIVILEGE'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-red-950/20 border-2 border-primary/20 p-8 rounded-3xl flex items-start gap-6">
              <span className="material-symbols-outlined text-primary text-4xl font-black">warning</span>
              <p className="text-sm text-red-100 font-bold leading-relaxed uppercase italic">
                Notice: Escalated authorization is irreversible. Any data corruption during final handshake will result in case dismissal. Proceed with absolute certainty.
              </p>
            </div>
          </div>
        </main>

        <aside className="w-full lg:w-96 border-l-2 border-border-dark shrink-0 min-h-[400px]">
          <Terminal title="JUSTICE_KERNEL_LOG" lines={logs} />
        </aside>
      </div>
    </div>
  );
};

export default AuthzView;
