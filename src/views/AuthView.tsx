
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
      name: "กัมปนาท",
      role: "พ่อของตู้",
      authType: "Password-based",
      icon: "elderly",
      description: "คอมพิวเตอร์เครื่องเก่าที่เก็บคัมภีร์พิธีกรรม ล็อกด้วยรหัสผ่านที่เขาไม่เคยเปลี่ยน",
      challenge: "กรอกรหัสผ่าน (ชื่อเล่นของ 'ตู้' เป็นภาษาอังกฤษตัวใหญ่)",
      answer: "TU",
      evidence: ["ม้วนคัมภีร์พิธีกรรม (หน้าที่หายไป)", "มีดทำพิธี (ยังไม่เคยใช้)"],
      behavior: "ระบุว่าสถานที่นั้น 'ยังไม่สะอาดพอ' และพยายามเลี่ยงที่จะพูดถึงพิธีกรรม",
      isUnlocked: false,
      color: "border-red-900"
    },
    {
      id: 2,
      name: "ศ. ดร. ศักดิ์",
      role: "นักประวัติศาสตร์สนาม",
      authType: "PIN-based (4 ตัวเลข)",
      icon: "history_edu",
      description: "ตู้เซฟสนามที่ล็อกด้วยปีที่เขาเชื่อว่าเป็นจุดเริ่มต้นของคำสาป",
      challenge: "ค้นหา PIN (ปีที่ตู้เสียชีวิต: 2 ปีก่อนจากปี 2024)",
      answer: "2022",
      evidence: ["สมุดสวดฉบับเต็ม", "บันทึกคาถาอาคม"],
      behavior: "พบเห็นที่สถานที่เกิดเหตุทั้งสามแห่ง มีความเชื่อรุนแรงเรื่องบาปกรรม",
      isUnlocked: false,
      color: "border-red-800"
    },
    {
      id: 3,
      name: "รองฯ ธวัช",
      role: "ผู้บริหารมหาวิทยาลัย",
      authType: "OTP (One-Time Password)",
      icon: "account_balance",
      description: "ระบบกู้คืนไฟล์ต้องใช้รหัส OTP เพื่อยืนยันสิทธิ์การเป็นผู้ดูแล",
      challenge: "กู้คืน OTP (รหัสเริ่มต้น 123 ตามด้วย 456)",
      answer: "123456",
      evidence: ["เอกสารที่ถูกทำลาย", "Log การโอนย้ายงบประมาณ"],
      behavior: "สั่งให้ปิดข่าวทันทีและสามารถเข้าถึงพื้นที่ควบคุมได้ทุกจุด",
      isUnlocked: false,
      color: "border-primary"
    },
    {
      id: 4,
      name: "ประเสริฐ",
      role: "เจ้าหน้าที่สนาม",
      authType: "Biometric Hash",
      icon: "engineering",
      description: "บันทึกการปฏิบัติงานในคืนที่เกิดเหตุ ถูกล็อกด้วยรหัส Face ID ของเขา",
      challenge: "กรอก Face ID Hash (พบในไฟล์ FACE_ID.LOG)",
      answer: "FACE-99",
      evidence: ["วิทยุสื่อสาร", "เวรยามที่ถูกดัดแปลง"],
      behavior: "ปฏิบัติหน้าที่ในคืนที่ตู้เสียชีวิต คำให้การขัดแย้งกับบันทึกในระบบ",
      isUnlocked: false,
      color: "border-red-950"
    },
    {
      id: 5,
      name: "ดร. มานัส",
      role: "อาจารย์ที่ปรึกษาโครงการ",
      authType: "Multifactor (MFA)",
      icon: "biotech",
      description: "คลังข้อมูลลับในห้องแล็บที่ต้องการการยืนยันหลายชั้น",
      challenge: "กรอกรหัส MFA (ชื่อโปรเจกต์วิจัย: 'PROJECT-X')",
      answer: "PROJECT-X",
      evidence: ["เอกสารวิจัยพิธีกรรม", "ตารางเวลาที่ถูกเข้ารหัส"],
      behavior: "เสนอทฤษฎีความเชื่อมโยงระหว่างการฆาตกรรมกับตำนานท้องถิ่นในเชิงวิชาการ",
      isUnlocked: false,
      color: "border-red-700"
    }
  ]);

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', content: 'เริ่มภารกิจแทรกซึมพื้นที่ควบคุม' },
    { timestamp: new Date().toLocaleTimeString(), type: 'WARN', content: 'ตรวจพบโหนดความปลอดภัย 5 จุดที่ต้องดึงข้อมูล' }
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
          { timestamp: new Date().toLocaleTimeString(), type: 'SUCCESS', content: `ได้รับสิทธิ์การเข้าถึง: ${room.name}` },
          { timestamp: new Date().toLocaleTimeString(), type: 'INFO', content: `ดึงข้อมูลจากโหนด ID-0${room.id} สำเร็จ` }
        ]);
        setActiveRoomId(null);
        setInputValue('');
      } else {
        setError(true);
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'ERR', content: `การเจาะระบบล้มเหลว: รหัสผ่านไม่ถูกต้อง` }]);
        setTimeout(() => setError(false), 1000);
      }
      setIsVerifying(false);
    }, 800);
  };

  const evidenceFiles = [
    { name: 'ประวัติ_กัมปนาท.TXT', content: "เป้าหมาย: กัมปนาท\nบุตรชาย: ตู้ (เสียชีวิตปี 2022)\nรหัสผ่าน: ชื่อบุตรชาย" },
    { name: 'FACE_ID.LOG', content: "ตรวจพบใบหน้า: ประเสริฐ\nHash_Ref: FACE-99" },
    { name: 'ร่างงานวิจัย.PDF', content: "ชื่อโครงการ: Project-X\nผู้แต่ง: ดร. มานัส" },
    { name: 'บันทึกการกู้คืน.TMP', content: "Default_OTP_Buffer: 123456" }
  ];

  const unlockedCount = rooms.filter(r => r.isUnlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display text-left">
      <StageHeader
        stageName="ตรวจสอบพื้นที่ควบคุม"
        stageNumber={2}
        timer={status.timer}
        hintsUsed={status.hintsUsed}
        onRequestHint={onRequestHint}
      />

      <div className="flex-1 flex flex-col lg:flex-row font-body">
        <section className="flex-1 p-8 lg:p-12 pb-40">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-primary/20 pb-10 gap-6">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight italic drop-shadow-[0_0_20px_rgba(255,0,0,0.4)] leading-none font-display">พื้นที่ควบคุมพิเศษ</h2>
                <p className="text-primary font-bold text-sm mt-4 tracking-widest uppercase flex items-center gap-3">
                  <span className="material-symbols-outlined font-black">lock_person</span>
                  โหนดที่เจาะได้: {unlockedCount} / 5
                </p>
              </div>
              <div className="flex gap-4">
                {evidenceFiles.map(f => (
                  <button key={f.name} onClick={() => setSelectedFile({...f, type: 'แดชบอร์ดความปลอดภัย'})} className="glass-panel px-6 py-3 rounded-xl flex items-center gap-3 hover:border-primary transition-all border-primary/20">
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
                          {room.isUnlocked ? 'อนุญาตแล้ว' : 'ล็อกอยู่'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase font-mono">{room.authType}</span>
                      </div>
                      <h3 className="text-white font-black text-3xl uppercase tracking-tighter italic leading-none font-display">{room.name}</h3>
                      <p className="text-primary font-bold text-xs uppercase tracking-widest mt-2">{room.role}</p>
                    </div>

                    <div className="flex-1 space-y-8">
                      {room.isUnlocked ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                          <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                              <span className="material-symbols-outlined text-lg font-black">inventory_2</span>
                              หลักฐานที่ตรวจพบ
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
                              รายงานพฤติกรรม
                            </h4>
                            <p className="text-sm text-gray-400 italic font-medium leading-relaxed">"{room.behavior}"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full justify-between">
                          <p className="text-lg text-gray-500 italic leading-relaxed font-medium">"{room.description}"</p>
                          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col items-center gap-4 group-hover:bg-primary/20 transition-all">
                             <span className="material-symbols-outlined text-primary text-4xl animate-pulse font-black">key</span>
                             <p className="text-[10px] font-black text-primary uppercase tracking-widest">เริ่มกระบวนการยืนยันตัวตน</p>
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
                  className="bg-primary hover:bg-white text-black font-black px-24 py-8 rounded-[2.5rem] uppercase tracking-widest text-3xl italic shadow-[0_0_100px_rgba(255,0,0,0.4)] transition-all transform hover:scale-110 active:scale-95 flex items-center gap-8 font-display"
                >
                  <span className="material-symbols-outlined font-black text-5xl">verified_user</span>
                  เสร็จสิ้นขั้นตอนที่ 02
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full lg:w-96 border-l-2 border-border-dark shrink-0 min-h-[500px]">
          <Terminal title="บันทึกความปลอดภัย" lines={logs} />
        </aside>
      </div>

      {activeRoomId !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300 font-body">
          <div className="w-full max-w-2xl glass-panel border-4 border-primary rounded-[3rem] p-12 md:p-16 flex flex-col gap-10 relative overflow-hidden shadow-[0_0_150px_rgba(255,0,0,0.3)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[300px] font-black italic">vpn_key</span>
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black bg-primary text-black px-4 py-1 rounded-full uppercase tracking-widest">ด่านทดสอบ</span>
                   <span className="text-xs font-mono text-primary/60 font-bold uppercase">{rooms.find(r => r.id === activeRoomId)?.authType}</span>
                </div>
                <h2 className="text-5xl font-black text-white uppercase italic leading-none tracking-tight font-display">ปลดล็อก: {rooms.find(r => r.id === activeRoomId)?.name}</h2>
              </div>
              
              <div className="bg-primary/5 p-8 rounded-3xl border-l-[12px] border-primary">
                <p className="text-2xl text-gray-200 italic font-bold leading-relaxed">
                  "{rooms.find(r => r.id === activeRoomId)?.challenge}"
                </p>
              </div>

              <div className="space-y-8">
                <div className="relative group font-mono">
                  <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    autoFocus
                    className={`w-full bg-black border-2 ${error ? 'border-primary animate-shake' : 'border-primary/20 focus:border-primary'} rounded-[2rem] py-8 px-10 text-3xl text-white outline-none transition-all placeholder-red-950 uppercase italic font-black shadow-2xl`}
                    placeholder="กรอกข้อมูลยืนยัน..."
                    disabled={isVerifying}
                  />
                  {isVerifying && <div className="absolute right-10 top-1/2 -translate-y-1/2 size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || !inputValue}
                    className="flex-1 bg-primary hover:bg-white disabled:bg-gray-900 disabled:text-gray-700 text-black font-black py-6 rounded-2xl uppercase tracking-widest text-xl transition-all active:scale-95 italic shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 font-display"
                  >
                    <span className="material-symbols-outlined font-black text-3xl">lock_open</span>
                    {isVerifying ? 'กำลังตรวจสอบ...' : 'ยืนยันสิทธิ์'}
                  </button>
                  <button
                    onClick={() => { setActiveRoomId(null); setInputValue(''); }}
                    className="px-8 py-6 bg-transparent border-2 border-white/10 hover:border-white/40 text-gray-500 hover:text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all italic font-display"
                  >
                    ยกเลิก
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
