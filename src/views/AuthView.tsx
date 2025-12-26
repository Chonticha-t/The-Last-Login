
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

interface SuspectRoom {
  id: number;
  name: string;
  role: string;
  authType: string;
  description: string;
  challenge: string;
  answer: string;
  icon: string;
  evidence: string[];
  behavior: string;
  isUnlocked: boolean;
  color: string;
}

const AuthView: React.FC<AuthViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [inputValue, setInputValue] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; content: string } | null>(null);

  const [rooms, setRooms] = useState<SuspectRoom[]>([
    {
      id: 1,
      name: "นายคำปัน",
      role: "พ่อของตุ๊",
      authType: "Password-based",
      icon: "elderly",
      description: "คอมพิวเตอร์เก่าที่เก็บตำราดั้งเดิม ถูกล็อกด้วยรหัสที่เขาไม่เคยเปลี่ยน",
      challenge: "ป้อนรหัสผ่าน (ชื่อเล่นลูกชายของเขาเป็นตัวพิมพ์ใหญ่)",
      answer: "TU",
      evidence: ["คัมภีร์พิธี (ขาดหน้า)", "มีดหมอ (ไม่เคยใช้)"],
      behavior: "เคยกล่าวว่าพื้นที่เกิดเหตุเป็น 'ดินที่ยังไม่สะอาด' และหลีกเลี่ยงการพูดถึงพิธีกรรม",
      isUnlocked: false,
      color: "border-red-900"
    },
    {
      id: 2,
      name: "อาจารย์ศักดิ์",
      role: "อาจารย์ภาควิชาสนาม",
      authType: "PIN-based (4-Digits)",
      icon: "history_edu",
      description: "เซฟเก็บข้อมูลภาคสนามถูกล็อกด้วยปีที่เขาเชื่อว่าเป็นจุดเริ่มต้นของอาถรรพ์",
      challenge: "หา PIN (ปีที่ตุ๊เสียชีวิต คือ 2 ปีก่อนหน้าปี 2024)",
      answer: "2022",
      evidence: ["คัมภีร์บทสวด (ฉบับเต็ม)", "สมุดจดคำอธิษฐาน"],
      behavior: "ปรากฏตัวในพื้นที่เกิดเหตุของศพทั้งสาม และแสดงความเชื่อแรงกล้าเรื่องบาปกรรม",
      isUnlocked: false,
      color: "border-red-800"
    },
    {
      id: 3,
      name: "รองอธิการธวัช",
      role: "ผู้บริหารมหาวิทยาลัย",
      authType: "OTP (One-Time Password)",
      icon: "account_balance",
      description: "ระบบกู้คืนไฟล์เอกสารที่ถูกฉีกต้องการรหัส OTP เพื่อยืนยันสิทธิ์ผู้บริหาร",
      challenge: "กู้คืนรหัส OTP (รหัสเริ่มต้นระบบ 123 ตามด้วย 456)",
      answer: "123456",
      evidence: ["เอกสารถูกฉีกบางส่วน", "USB Log การเบิกจ่าย"],
      behavior: "เป็นผู้สั่งระงับการเผยแพร่ข้อมูลทันทีหลังพบศพ และเข้าถึงทุกพื้นที่ได้",
      isUnlocked: false,
      color: "border-primary"
    },
    {
      id: 4,
      name: "นายประเสริฐ",
      role: "เจ้าหน้าที่ภาคสนาม",
      authType: "Biometric (Face ID Hash)",
      icon: "engineering",
      description: "บันทึกเวรในคืนเกิดเหตุถูกเข้ารหัสด้วย Face ID Hash ของเจ้าหน้าที่",
      challenge: "ป้อนรหัส Hash ของใบหน้า (ดูรหัสในไฟล์ FACE_ID.LOG)",
      answer: "FACE-99",
      evidence: ["วิทยุสื่อสาร", "บันทึกการเข้าเวรที่ถูกแก้ไข"],
      behavior: "อยู่ในคืนที่ตุ๊เสียชีวิต แต่คำให้การมีความคลาดเคลื่อนกับข้อมูลในระบบ",
      isUnlocked: false,
      color: "border-red-950"
    },
    {
      id: 5,
      name: "ดร.มนัส",
      role: "ที่ปรึกษาโครงการ",
      authType: "Multifactor (MFA)",
      icon: "biotech",
      description: "ห้องแล็บลับที่ใช้จัดเก็บข้อมูลวิจัยต้องการรหัสยืนยันหลายชั้น",
      challenge: "ป้อนรหัส MFA (ชื่อโครงการวิจัย 'PROJECT-X')",
      answer: "PROJECT-X",
      evidence: ["เอกสารงานวิจัยด้านพิธีกรรม", "ตารางเวลานัดหมายที่ถูกเข้ารหัส"],
      behavior: "เป็นผู้เสนอแนวคิดเชื่อมโยงคดีเข้ากับความเชื่อท้องถิ่นอย่างเป็นวิชาการ",
      isUnlocked: false,
      color: "border-red-700"
    }
  ]);

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', content: 'Restricted Wing Infiltration Sub-routine Active.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'WARN', content: 'Five secure subject nodes detected. Exfiltration required.' }
  ]);

  const handleVerify = () => {
    if (activeRoomId === null || !inputValue) return;
    const room = rooms.find(r => r.id === activeRoomId);
    if (!room) return;

    setIsVerifying(true);
    setTimeout(() => {
      if (inputValue.trim().toUpperCase() === room.answer.toUpperCase()) {
        setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, isUnlocked: true } : r));
        setLogs(prev => [
          ...prev,
          { timestamp: new Date().toLocaleTimeString(), type: 'SUCCESS', content: `Access Authorized: ${room.name}` },
          { timestamp: new Date().toLocaleTimeString(), type: 'INFO', content: `Artifacts exfiltrated from node ID-0${room.id}.` }
        ]);
        setActiveRoomId(null);
        setInputValue('');
      } else {
        setError(true);
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'ERR', content: `Authentication Breach Failed: ${room.authType} Mismatch.` }]);
        setTimeout(() => setError(false), 1000);
      }
      setIsVerifying(false);
    }, 800);
  };

  const evidenceFiles = [
    { name: 'KAMPAN_BIO.TXT', content: "Subject: Kampan\nSon: Tu (Deceased 2022)\nKey: SON_NAME" },
    { name: 'FACE_ID.LOG', content: "Detected_Subject: Prasert\nHash_Ref: FACE-99" },
    { name: 'RESEARCH_DRAFT.PDF', content: "Title: Project-X\nAuthor: Dr. Manas" },
    { name: 'LOG_RECOVERY.TMP', content: "Default_OTP_Buffer: 123456" }
  ];

  const unlockedCount = rooms.filter(r => r.isUnlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display">
      <StageHeader
        stageName="RESTRICTED_WING_INVESTIGATION"
        stageNumber={2}
        timer={status.timer}
        hintsUsed={status.hintsUsed}
        onRequestHint={onRequestHint}
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        <section className="flex-1 p-8 lg:p-12 pb-40">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-primary/20 pb-10 gap-6">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight italic drop-shadow-[0_0_20px_rgba(255,0,0,0.4)] leading-none">THE RESTRICTED WING</h2>
                <p className="text-primary font-bold text-sm mt-4 tracking-widest uppercase flex items-center gap-3">
                  <span className="material-symbols-outlined font-black">lock_person</span>
                  SECURE NODES: {unlockedCount} / 5 DECRYPTED
                </p>
              </div>
              <div className="flex gap-4">
                {evidenceFiles.map(f => (
                  <button key={f.name} onClick={() => setSelectedFile({...f, type: 'SECURE_DASHBOARD'})} className="glass-panel px-6 py-3 rounded-xl flex items-center gap-3 hover:border-primary transition-all border-primary/20">
                    <span className="material-symbols-outlined text-primary font-black">encrypted</span>
                    <span className="text-[10px] font-bold uppercase">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => !room.isUnlocked && setActiveRoomId(room.id)}
                  className={`glass-panel p-8 rounded-[2.5rem] border-4 transition-all relative overflow-hidden flex flex-col h-[450px] ${
                    room.isUnlocked 
                      ? 'border-primary bg-primary/5 shadow-[0_0_40px_rgba(255,0,0,0.1)]' 
                      : 'border-white/5 bg-black/80 hover:border-primary/40 cursor-pointer group'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                    <span className="material-symbols-outlined text-[150px] font-black">{room.icon}</span>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${room.isUnlocked ? 'bg-primary text-black border-primary' : 'bg-white/5 text-primary/60 border-primary/20'}`}>
                          {room.isUnlocked ? 'AUTHORIZED' : 'LOCKED'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase font-mono">{room.authType}</span>
                      </div>
                      <h3 className="text-white font-black text-3xl uppercase tracking-tighter italic leading-none">{room.name}</h3>
                      <p className="text-primary font-bold text-xs uppercase tracking-widest mt-2">{room.role}</p>
                    </div>

                    <div className="flex-1 space-y-8">
                      {room.isUnlocked ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                          <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                              <span className="material-symbols-outlined text-lg font-black">inventory_2</span>
                              SECURED ARTIFACTS
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {room.evidence.map((e, i) => (
                                <span key={i} className="text-[11px] font-bold text-gray-200 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">{e}</span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                              <span className="material-symbols-outlined text-lg font-black">visibility</span>
                              BEHAVIOR_REPORT
                            </h4>
                            <p className="text-sm text-gray-400 italic font-medium leading-relaxed">"{room.behavior}"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full justify-between">
                          <p className="text-lg text-gray-500 italic leading-relaxed font-medium">"{room.description}"</p>
                          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col items-center gap-4 group-hover:bg-primary/20 transition-all">
                             <span className="material-symbols-outlined text-primary text-4xl animate-pulse font-black">key</span>
                             <p className="text-[10px] font-black text-primary uppercase tracking-widest">BYPASS AUTHENTICATION</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {unlockedCount === 5 && (
              <div className="flex justify-center pt-10 animate-in zoom-in duration-700">
                <button
                  onClick={onComplete}
                  className="bg-primary hover:bg-white text-black font-black px-24 py-8 rounded-[2.5rem] uppercase tracking-widest text-3xl italic shadow-[0_0_100px_rgba(255,0,0,0.4)] transition-all transform hover:scale-110 active:scale-95 flex items-center gap-8"
                >
                  <span className="material-symbols-outlined font-black text-5xl">verified_user</span>
                  FINALIZE_STAGE_02
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full lg:w-96 border-l-2 border-border-dark shrink-0 min-h-[500px]">
          <Terminal title="WING_SECURITY_LOG" lines={logs} />
        </aside>
      </div>

      {activeRoomId !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl glass-panel border-4 border-primary rounded-[3rem] p-12 md:p-16 flex flex-col gap-10 relative overflow-hidden shadow-[0_0_150px_rgba(255,0,0,0.3)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[300px] font-black italic">vpn_key</span>
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black bg-primary text-black px-4 py-1 rounded-full uppercase tracking-widest">CHALLENGE_GATE</span>
                   <span className="text-xs font-mono text-primary/60 font-bold uppercase">{rooms.find(r => r.id === activeRoomId)?.authType}</span>
                </div>
                <h2 className="text-5xl font-black text-white uppercase italic leading-none tracking-tight">BYPASS: {rooms.find(r => r.id === activeRoomId)?.name}</h2>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-3xl border-l-[12px] border-primary">
                <p className="text-2xl text-gray-200 italic font-bold leading-relaxed">
                  "{rooms.find(r => r.id === activeRoomId)?.challenge}"
                </p>
              </div>

              <div className="space-y-8">
                <div className="relative group">
                  <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    autoFocus
                    className={`w-full bg-black border-2 ${error ? 'border-primary animate-shake' : 'border-primary/20 focus:border-primary'} rounded-[2rem] py-8 px-10 font-mono text-3xl text-white outline-none transition-all placeholder-red-950 uppercase italic font-black shadow-2xl`}
                    placeholder="ENTER CREDENTIALS..."
                    disabled={isVerifying}
                  />
                  {isVerifying && <div className="absolute right-10 top-1/2 -translate-y-1/2 size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || !inputValue}
                    className="flex-1 bg-primary hover:bg-white disabled:bg-gray-900 disabled:text-gray-700 text-black font-black py-6 rounded-2xl uppercase tracking-widest text-xl transition-all active:scale-95 italic shadow-2xl shadow-primary/20 flex items-center justify-center gap-4"
                  >
                    <span className="material-symbols-outlined font-black text-3xl">lock_open</span>
                    {isVerifying ? 'AUTHENTICATING...' : 'AUTHORIZE_ACCESS'}
                  </button>
                  <button
                    onClick={() => { setActiveRoomId(null); setInputValue(''); }}
                    className="px-8 py-6 bg-transparent border-2 border-white/10 hover:border-white/40 text-gray-500 hover:text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all italic"
                  >
                    ABORT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <EvidenceModal
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        file={selectedFile}
      />
    </div>
  );
};

export default AuthView;
