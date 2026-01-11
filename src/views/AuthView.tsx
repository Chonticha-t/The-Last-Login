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
  hint: string;
}

const AuthView: React.FC<AuthViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [inputValue, setInputValue] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; content: string } | null>(null);
  const [showRitualScroll, setShowRitualScroll] = useState(false);

  // 1. ไฟล์หลักฐานระบบ (สำหรับใช้หาคำตอบ/คำใบ้) - กลับมาครบถ้วน
  const evidenceFiles = [
    {
      name: 'ประวัติ_คำปัน.TXT',
      status: 'RESTRICTED',
      content: "FILE_ID: KP-001\nSECRET_KEY: VkVOR0FOQ0U=\nNote: รหัสผ่านนี้ถูกเข้ารหัสแบบ Base64 เพื่อป้องกันการอ่านโดยตรง\n'ความแค้นที่ต้องสะสาง... เพื่อลูกชายข้า'",
      icon: 'person'
    },
    {
      name: 'FACE_ID.LOG',
      status: 'ENCRYPTED',
      content: "[SYSTEM_SCANNER_LOG]\nTimestamp: 03:14:00\nDevice: Terminal-4\nLast_Successful_Login: ID-99-TRAPPED\nUser: นายประเสริฐ (Guard)\nStatus: บันทึกใบหน้ามีความเครียดสูงผิดปกติ",
      icon: 'face'
    },
    {
      name: 'บันทึกการทดลอง_As.PDF',
      status: 'ENCRYPTED',
      content: "สรุปผลการทดลองโครงการ Toxic:\nสารตั้งต้นหลัก: Arsenic (As)\nเลขอะตอม: ? \n\nบันทึกส่วนตัว: วันนี้เครียดมากจนต้องอัดกาแฟ ผมชงดื่มไปจนเกลี้ยงกล่องแคปซูล (ขนาดครึ่งโหล) เหลือแคปซูลอันสุดท้ายอันเดียวทิ้งไว้ในกล่อง...",
      icon: 'description'
    },
    {
      name: 'SYS_RECOVERY.TMP',
      status: 'RESTRICTED',
      content: "[MEM_DUMP]\nAddress: 0x004F\nHex_Data: 41 55 54 48\nASCII_Output: [DECODING_REQUIRED]\nUser_Action: Deleted by Vice_Tawat",
      icon: 'settings_backup_restore'
    }
  ];

  // 2. ข้อมูลห้องผู้ต้องสงสัย - ตัดการเฉลย Role ออกเพื่อให้ผู้เล่นวิเคราะห์เอง
  const [rooms, setRooms] = useState<SuspectRoom[]>([
    {
      id: 1,
      name: "นายคำปัน",
      role: "ชาวบ้าน / พ่อของนักศึกษาที่เสียชีวิต",
      authType: "Base64 Decoding",
      icon: "person",
      description: "อดีตหมอพิธีพื้นบ้านที่มีความรู้เรื่องบทสวดสี่ทิศอย่างลึกซึ้ง",
      challenge: "ถอดรหัส Base64 ของ 'VkVOR0FOQ0U='",
      answer: "VENGEANCE",
      hint: "รหัสถูกซ่อนอยู่ในไฟล์ ประวัติ_คำปัน.TXT",
      evidence: ["บทสวดดั้งเดิม", "จดหมายถึงลูกชาย"],
      behavior: "มักจะมาปรากฏตัวบริเวณที่พบศพพร้อมบริกรรมคาถาที่ชาวบ้านไม่เข้าใจ มีความแค้นต่อผู้มีอิทธิพลในพื้นที่อย่างชัดเจน",
      isUnlocked: false
    },
    {
      id: 2,
      name: "ศ. ดร. ศักดิ์",
      role: "อาจารย์อาวุโสสายภาคสนาม",
      authType: "Binary Logic Gate",
      icon: "history_edu",
      description: "ผู้เชี่ยวชาญด้านประวัติศาสตร์ที่เชื่อเรื่องอาถรรพ์และกฎแห่งกรรม",
      challenge: "หาค่า PIN จาก (1010 OR 0101) XOR 1111",
      answer: "0000",
      hint: "ตัวเลขฐานสอง 4 หลัก (คำนวณจาก OR แล้วตามด้วย XOR)",
      evidence: ["คัมภีร์บทสวดโบราณ", "บันทึกการยืมวัตถุโบราณ"],
      behavior: "พยายามเข้าไปยุ่งเกี่ยวกับพยานหลักฐานในที่เกิดเหตุโดยอ้างเรื่องการสะกดวิญญาณ และมีการยืมวัตถุโบราณออกไปโดยไม่แจ้งวัตถุประสงค์",
      isUnlocked: false
    },
    {
      id: 3,
      name: "นายประเสริฐ",
      role: "เจ้าหน้าที่ดูแลความปลอดภัยภาคสนาม",
      authType: "Metadata Inherence",
      icon: "badge",
      description: "ผู้รับผิดชอบพื้นที่ในคืนที่เกิดเหตุการณ์ทั้งหมด",
      challenge: "กรอกรหัส Face_ID ที่ซ่อนอยู่ในไฟล์ LOG (รูปแบบ ID-XX-XXXXXX)",
      answer: "ID-99-TRAPPED",
      hint: "ค้นหา String ลับในไฟล์ FACE_ID.LOG",
      evidence: ["บันทึกเวรยาม", "ภาพจากกล้องวงจรปิดที่หายไป"],
      behavior: "ให้การสับสนเกี่ยวกับเหตุการณ์ในคืนเกิดเหตุ และมีอาการหวาดระแวงอย่างรุนแรงเมื่อต้องพูดถึงห้องทดลอง",
      isUnlocked: false
    },
    {
      id: 4,
      name: "รองฯ ธวัช",
      role: "ผู้บริหารระดับสูงมหาลัย",
      authType: "Hex to ASCII OTP",
      icon: "corporate_fare",
      description: "ผู้ดูแลภาพรวมของโครงการวิจัยและงบประมาณทั้งหมด",
      challenge: "ถอดรหัส HEX: 41 55 54 48",
      answer: "AUTH",
      hint: "แปลงเลขฐาน 16 เป็นตัวอักษรจากไฟล์ TMP",
      evidence: ["เอกสารสั่งห้ามเผยแพร่ข่าว", "บันทึกการโอนเงินลับ"],
      behavior: "ใช้อำนาจสั่งระงับการสืบสวนภายใน และพยายามจำกัดการเข้าถึงข้อมูลของนักศึกษาที่เสียชีวิต",
      isUnlocked: false
    },
    {
      id: 5,
      name: "ดร. มนัส",
      role: "ที่ปรึกษาโครงการวิจัย",
      authType: "Logic Calculation",
      icon: "biotech",
      description: "นักวิทยาศาสตร์ผู้เชี่ยวชาญ และเป็นเจ้าของโครงการทดลองภาคสนาม",
      challenge: "Password Logic: [Atomic No. of Arsenic] - [Coffee Cups Left]",
      answer: "28",
      hint: "อ้างอิงข้อมูลสารตั้งต้นและจำนวนแคปซูลกาแฟในไฟล์ PDF",
      evidence: ["เอกสารโครงงานวิจัย", "สนิทกับนายคำปัน"],
      behavior: "เป็นผู้เข้าถึงข้อมูลสารเคมีและตารางการทำงานของนักศึกษาทุกคน และมีความรู้เรื่องความเชื่อท้องถิ่นในเชิงวิชาการอย่างดี",
      isUnlocked: false
    }
  ]);

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: 'SYSTEM', type: 'WARN', content: 'INITIALIZING INVESTIGATION CHAIN...' },
    { timestamp: 'INFO', type: 'ERR', content: 'ANALYZE EVIDENCE FILES TO BREACH NODES.' }
  ]);

  // ระบบปลดล็อกตามลำดับ (1&2 -> 3 -> 4 -> 5)
  const isRoomAvailable = (index: number) => {
    if (index < 2) return true;
    if (index === 2) return rooms[0].isUnlocked && rooms[1].isUnlocked;
    if (index === 3) return rooms[2].isUnlocked;
    if (index === 4) return rooms[3].isUnlocked;
    return false;
  };

  const getEvidenceContent = (ev: string) => {
    const data: Record<string, string> = {
      "จดหมายถึงลูกชาย": "ตุ๊ลูกพ่อ... พ่อขอโทษที่ห้ามเจ้าไม่ได้ โครงการของ ดร.มนัส มันอันตรายเกินไป",
      "คัมภีร์บทสวดโบราณ": "พบรอยขีดเขียนแก้ไขบทสวดด้วยปากกาสมัยใหม่ ลายมือคล้ายคนในคณะวิจัย",
      "บันทึกการยืมวัตถุโบราณ": "ยืม: ผอบดินอาถรรพ์ และกริชเงินโบราณ | ผู้รับมอบ: ดร.มนัส (อ้างการทดลองทางเคมีบนวัตถุ)",
      "บันทึกเวรยาม": "03:20 น. พบชายสวมชุดกาวน์ขนย้ายวัตถุบางอย่างไปทางตลิ่ง | หมายเหตุ: รองฯ ธวัชสั่งให้ข้ามการบันทึกส่วนนี้",
      "ภาพจากกล้องวงจรปิดที่หายไป": "[กู้คืนไฟล์] ภาพ รปภ. ประเสริฐ ยืนก้มหน้าตัวสั่นขณะที่ชายสวมชุดกาวน์เดินผ่านไป",
      "เอกสารสั่งห้ามเผยแพร่ข่าว": "ห้ามเปิดเผยข้อมูลเรื่องสารเคมีรั่วไหล ให้แจ้งว่านักศึกษาพลัดตกน้ำเอง - รองฯ ธวัช",
      "บันทึกการโอนเงินลับ": "โอนเงิน 500,000 บาท เข้าบัญชีนายคำปัน (กำกับ: ค่าที่ดิน/ปิดโครงการ)",
      "เอกสารโครงงานวิจัย": "โครงการ Arsenic-X: มาตรฐานความปลอดภัยไม่ผ่านเกณฑ์แต่ยังคงดำเนินการต่อ",
      "สนิทกับนายคำปัน": "Chat Log: 'มนัส' อาสาเป็นคนจัดการเรื่องชันสูตรศพให้เองทั้งหมด เพื่อความสะดวกของครอบครัว"
    };
    return data[ev] || "ข้อมูลหลักฐานประกอบรูปคดีลับ";
  };

  const handleVerify = () => {
    if (activeRoomId === null || !inputValue) return;
    const room = rooms.find(r => r.id === activeRoomId);
    if (!room) return;

    setIsVerifying(true);
    setTimeout(() => {
      if (inputValue.trim().toUpperCase() === room.answer.toUpperCase()) {
        setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, isUnlocked: true } : r));
        setLogs(prev => [...prev, { timestamp: 'SUCCESS', type: 'SUCCESS', content: `NODE ${room.name} BREACHED.` }]);
        setActiveRoomId(null);
        setInputValue('');
      } else {
        setError(true);
        setLogs(prev => [...prev, { timestamp: 'ERROR', type: 'ERR', content: `DENIED AT ${room.name}` }]);
        setTimeout(() => setError(false), 1000);
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleRequestHint = () => {
    // ตรวจสอบว่าใช้ hint ไปครบ 3 ครั้งหรือยัง (สมมติว่า limit คือ 3)
    if (status.hintsUsed < 3) {
      onRequestHint();
    } else {
      // แสดง Log แจ้งเตือนใน Terminal ว่าคำใบ้หมดแล้ว
      setLogs(prev => [
        ...prev,
        { timestamp: 'SYSTEM', type: 'WARN', content: 'HINT LIMIT REACHED: 3/3. NO MORE ASSISTANCE AVAILABLE.' }
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display">
      <StageHeader
        stageName="STAGE 2: ENTITY_BREACH"
        stageNumber={2}
        timer={status.timer}
        hintsUsed={status.hintsUsed}
        // เปลี่ยนบรรทัดนี้
        onRequestHint={handleRequestHint}
      />

      <div className="flex-1 flex flex-col lg:flex-row font-body overflow-hidden">
        <section className="flex-1 p-8 lg:p-12 pb-40 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-12">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-red-900/40 pb-10 gap-6">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic blood-shadow leading-none">พื้นที่ควบคุม</h2>
                <p className="text-primary font-bold text-sm mt-4 tracking-[0.4em] uppercase flex items-center gap-3">
                  <span className="material-symbols-outlined animate-pulse">terminal</span>
                  โหนดที่เจาะสำเร็จ: {rooms.filter(r => r.isUnlocked).length} / 5
                </p>
              </div>

              {/* Evidence Files แถบบน (เอากลับมาแล้ว) */}
              <div className="flex flex-wrap gap-4">
                {evidenceFiles.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFile({ ...f, type: 'ไฟล์หลักฐานระบบ' })}
                    className="glass-panel px-6 py-4 rounded-xl flex items-center gap-4 hover:border-primary transition-all group border-primary/20 bg-black/40"
                  >
                    <span className="material-symbols-outlined text-primary text-2xl font-black">{f.icon}</span>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-[8px] text-primary/60 font-black tracking-widest uppercase">{f.status}</span>
                      <span className="text-xs font-mono font-bold text-white uppercase">{f.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => {
                const available = isRoomAvailable(index);
                return (
                  <div
                    key={room.id}
                    onClick={() => available && !room.isUnlocked && setActiveRoomId(room.id)}
                    className={`glass-panel p-8 rounded-[2.5rem] border-4 transition-all relative overflow-hidden flex flex-col h-[520px] 
                      ${room.isUnlocked ? 'border-primary bg-primary/5 shadow-[0_0_60px_rgba(255,0,0,0.15)]' :
                        available ? 'border-white/10 bg-black/80 hover:border-primary/40 cursor-pointer group' :
                          'border-white/5 bg-black/40 opacity-30 grayscale cursor-not-allowed'}`}
                  >
                    {!available && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-6xl text-white/20 mb-4">lock</span>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Missing Prior Intel</p>
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${room.isUnlocked ? 'bg-primary text-black border-primary' : 'text-primary/60 border-primary/20'}`}>
                            {room.isUnlocked ? 'BREACHED' : 'ENCRYPTED'}
                          </span>
                        </div>
                        <h3 className="text-white font-black text-4xl uppercase tracking-tighter italic font-display leading-none">{room.name}</h3>
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mt-2">{room.role}</p>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        {room.isUnlocked ? (
                          <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 italic flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">info</span> รายงานข้อมูลเชิงลึก
                              </h4>
                              <p className="text-sm text-gray-400 italic font-medium leading-relaxed">"{room.behavior}"</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.evidence.map((ev, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (ev === "บทสวดดั้งเดิม") setShowRitualScroll(true);
                                    else setSelectedFile({ name: ev, type: "หลักฐานกู้คืน", content: getEvidenceContent(ev) });
                                  }}
                                  className="px-3 py-2 bg-red-900/30 border border-red-500/30 rounded-lg text-[10px] font-black text-white hover:bg-red-700/50"
                                >
                                  {ev}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col h-full justify-between">
                            <p className="text-lg text-gray-500 italic leading-relaxed font-medium">"{room.description}"</p>
                            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 flex flex-col items-center gap-4 transition-all">
                              <span className="material-symbols-outlined text-primary text-4xl font-black">key_visualizer</span>
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest">เริ่มต้นการเจาะระบบ</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {rooms.filter(r => r.isUnlocked).length === 5 && (
              <div className="flex justify-center pt-10">
                <button onClick={onComplete} className="bg-primary text-black font-black px-24 py-8 rounded-[2.5rem] uppercase text-3xl italic shadow-[0_0_100px_rgba(255,0,0,0.4)] hover:scale-105 transition-all">
                  ยืนยันหลักฐานทั้งหมด
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full lg:w-96 border-l-2 border-red-900/20 bg-black/20">
          <Terminal title="SYSTEM_AUTH_LOGS" lines={logs} />
        </aside>
      </div>

      {/* Verification Modal */}
      {activeRoomId !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="w-full max-w-2xl glass-panel border-4 border-primary rounded-[3rem] p-12 relative overflow-hidden">
            <h2 className="text-5xl font-black text-white uppercase italic mb-8 font-display">ปลดล็อก: {rooms.find(r => r.id === activeRoomId)?.name}</h2>
            <div className="bg-primary/5 p-8 rounded-3xl border-l-[12px] border-primary mb-10">
              <p className="text-2xl text-gray-200 italic font-bold">"{rooms.find(r => r.id === activeRoomId)?.challenge}"</p>
              <p className="text-xs text-primary/60 mt-4 font-black">Hint: {rooms.find(r => r.id === activeRoomId)?.hint}</p>
            </div>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              className={`w-full bg-black border-2 ${error ? 'border-primary animate-shake' : 'border-primary/20'} rounded-[2rem] py-8 px-10 text-3xl text-white outline-none mb-8 font-mono`}
              placeholder="กรอกรหัสยืนยัน..."
              disabled={isVerifying}
            />
            <div className="flex gap-4">
              <button onClick={handleVerify} disabled={isVerifying || !inputValue} className="flex-1 bg-primary text-black font-black py-6 rounded-2xl uppercase text-xl">
                {isVerifying ? 'กำลังตรวจสอบ...' : 'ยืนยันสิทธิ์'}
              </button>
              <button onClick={() => setActiveRoomId(null)} className="px-8 py-6 text-gray-500 uppercase font-black text-xs">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* Ritual Scroll Modal */}
      {showRitualScroll && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 animate-in zoom-in">
          <div className="relative w-full max-w-2xl bg-[#f4e4bc] p-12 border-[12px] border-[#3d2b1f] rounded-sm">
            <button onClick={() => setShowRitualScroll(false)} className="absolute top-4 right-4 text-[#3d2b1f] hover:scale-110">
              <span className="material-symbols-outlined text-4xl font-black">close</span>
            </button>
            <div className="text-[#3d2b1f] font-serif text-center space-y-6">
              <h2 className="text-3xl font-black border-b-2 border-[#3d2b1f]/30 pb-4 uppercase">บทสวดส่งวิญญาณ (ต้นฉบับ)</h2>
              <p className="text-xl italic leading-relaxed">"๏ ถึงวันโกน มืดมิด ปิดดวงแก้ว... ขอขมาดินฟ้า ส่งลูกข้าคืนสู่สุขคติ"</p>
              <div className="mt-8 pt-8 border-t-2 border-[#3d2b1f]/20 text-red-900 font-bold italic">
                (บันทึก: บทสวดนี้ใช้เพื่อการทำศพและส่งวิญญาณเท่านั้น ไม่พบเนื้อหาที่เกี่ยวกับการสังเวยหรือการดึงวิญญาณกลับคืน)
              </div>
            </div>
          </div>
        </div>
      )}

      <EvidenceModal isOpen={!!selectedFile} onClose={() => setSelectedFile(null)} file={selectedFile} />
    </div>
  );
};

export default AuthView;