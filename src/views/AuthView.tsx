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

  // ข้อมูลห้องและหลักฐานเฉพาะบุคคล
  const [rooms, setRooms] = useState<SuspectRoom[]>([
    {
      id: 1,
      name: "นายคำปัน",
      role: "พ่อของตุ๊ (Knowledge Factor)",
      authType: "Base64 Decoding",
      icon: "person",
      description: "คอมพิวเตอร์เก่ามีข้อความ Encode ทิ้งไว้ในไฟล์ประวัติเพื่อพรางรหัสผ่าน",
      challenge: "ถอดรหัส Base64 ของ 'VkVOR0FOQ0U=' (ค่านามธรรมของความแค้น)",
      answer: "VENGEANCE",
      hint: "รหัสถูกซ่อนอยู่ในไฟล์ ประวัติ_คำปัน.TXT",
      evidence: ["บทสวดดั้งเดิม", "จดหมายถึงลูกชาย"],
      behavior: "เคยเป็นหมอพิธีล้านนา มีความรู้เชิงลึกเกี่ยวกับพิธีกรรมและความเชื่อโบราณ ความรักต่อลูกชายคือแรงผลักดันสูงสุด",
      isUnlocked: false
    },
    {
      id: 2,
      name: "ศ. ดร. ศักดิ์",
      role: "นักประวัติศาสตร์ (PIN Factor)",
      authType: "Binary Logic Gate",
      icon: "history_edu",
      description: "ระบบล็อกตู้เซฟใช้การคำนวณทางลอจิกพื้นฐานในการเข้าถึง",
      challenge: "หาค่า PIN จาก (1010 OR 0101) XOR 1111",
      answer: "0000",
      hint: "ตัวเลขฐานสอง 4 หลัก (คำนวณจาก OR แล้วตามด้วย XOR)",
      evidence: ["คัมภีร์บทสวดโบราณ", "บันทึกการยืมวัตถุโบราณ"],
      behavior: "มีความรู้ด้านพิธีกรรมโบราณและความเชื่อพื้นบ้าน มักแอบอ้างงานวิจัยเพื่อเข้าถึงวัตถุต้องห้าม",
      isUnlocked: false
    },
    {
      id: 3,
      name: "รองฯ ธวัช",
      role: "ผู้บริหาร (Possession Factor)",
      authType: "Hex to ASCII OTP",
      icon: "corporate_fare",
      description: "ไฟล์ที่ถูกลบต้องใช้รหัส OTP ที่กู้คืนจากข้อมูลฐานสิบหก",
      challenge: "ถอดรหัส HEX: 41 55 54 48 (จากไฟล์ TMP)",
      answer: "AUTH",
      hint: "แปลงเลขฐาน 16 เป็นตัวอักษร",
      evidence: ["เอกสารสั่งห้ามเผยแพร่ข่าว", "บันทึกการโอนเงินลับ"],
      behavior: "ชอบเก็บเรื่องเงียบ และไม่อยากให้ใครรู้ความจริงเกี่ยวกับการหายตัวไปของนักศึกษา",
      isUnlocked: false
    },
    {
      id: 4,
      name: "นายประเสริฐ",
      role: "เจ้าหน้าที่ดูแลความปลอดภัย (Biometric Auth)",
      authType: "Metadata Inherence",
      icon: "badge",
      description: "บันทึกเวรยามถูกล็อกด้วยรหัสใบหน้า แต่ข้อมูลรั่วไหลอยู่ใน Metadata",
      challenge: "กรอกรหัส Face_ID ที่ซ่อนอยู่ในไฟล์ LOG (รูปแบบ ID-XX-XXXXXX)",
      answer: "ID-99-TRAPPED",
      hint: "ค้นหา String ลับในไฟล์ FACE_ID.LOG",
      evidence: ["บันทึกเวรยาม", "ภาพจากกล้องวงจรปิดที่หายไป"],
      behavior: "มักเดินไปแถวจุดเกิดเหตุบ่อยกว่าหน้าที่ทั่วไป และให้การไม่ตรงกัน ดูเหมือนมีอาการหวาดระแวงตลอดเวลา",
      isUnlocked: false
    },
    {
      id: 5,
      name: "ดร. มนัส",
      role: "ที่ปรึกษา (Multi-factor Auth)",
      authType: "TOTP Seed Calculation",
      icon: "biotech",
      description: "ระบบความปลอดภัยที่ต้องใช้ข้อมูลหลายอย่างร่วมกัน",
      challenge: "รหัสคือ 'PROJECT-' ต่อด้วย (ปีพิธีสำเร็จ - 2000)",
      answer: "PROJECT-22",
      hint: "ดูปีจากไฟล์ 'ร่างงานวิจัย.PDF'",
      evidence: ["เอกสารโครงงานวิจัย", "สนิทกับนายคำปัน"],
      behavior: "ดูเป็นคนมีเหตุผล ฉลาด และรอบคอบ แต่เบื้องหลังใช้ความรู้เพื่อทดลองทฤษฎีการฟื้นคืนชีพ",
      isUnlocked: false
    }
  ]);

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: 'SYSTEM', type: 'WARN', content: 'INITIALIZING CTF-AUTHENTICATION PROTOCOL...' },
    { timestamp: 'SYSTEM', type: 'ERR', content: 'DECRYPT ALL ENTITY NODES TO ACCESS THE TRUTH.' }
  ]);

  // ไฟล์หลักฐานที่วางอยู่ด้านบน (สำหรับแก้ปริศนา)
  const evidenceFiles = [
    { 
      name: 'ประวัติ_คำปัน.TXT', 
      status: 'RESTRICTED', 
      content: "FILE_ID: KP-001\nSECRET_KEY: VkVOR0FOQ0U=\nNote: รหัสผ่านนี้ถูกเข้ารหัสแบบ Base64 เพื่อป้องกันการอ่านโดยตรง\nคำโปรย: 'ความแค้นที่ต้องสะสาง'", 
      icon: 'person' 
    },
    { 
      name: 'FACE_ID.LOG', 
      status: 'ENCRYPTED', 
      content: "[SYSTEM_SCANNER_LOG]\nTimestamp: 03:14:00\nDevice: Terminal-4\nLast_Successful_Login: ID-99-TRAPPED\nUser: นายประเสริฐ (Guard)\nStatus: บันทึกใบหน้าผิดปกติ", 
      icon: 'face' 
    },
    { 
      name: 'ร่างงานวิจัย.PDF', 
      status: 'ENCRYPTED', 
      content: "สรุปผลการทดลองโครงการ X:\nปีที่ประกอบพิธีกรรมสำเร็จ: 2022\nสถานะ: สมบูรณ์ (Success)\nรหัสโครงการเริ่มต้น: PROJECT-[Year-2000]", 
      icon: 'description' 
    },
    { 
      name: 'SYS_RECOVERY.TMP', 
      status: 'RESTRICTED', 
      content: "[MEM_DUMP]\nAddress: 0x004F\nHex_Data: 41 55 54 48\nASCII_Output: [DECODING_REQUIRED]\nUser_Action: Deleted by Vice_Tawat", 
      icon: 'settings_backup_restore' 
    }
  ];

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
          { timestamp: 'ACCESS', type: 'SUCCESS', content: `NODE-0${room.id} BREACHED: ${room.name}` }
        ]);
        setActiveRoomId(null);
        setInputValue('');
      } else {
        setError(true);
        setLogs(prev => [...prev, { timestamp: 'AUTH', type: 'ERR', content: `HASH MISMATCH AT NODE-0${room.id}` }]);
        setTimeout(() => setError(false), 1000);
      }
      setIsVerifying(false);
    }, 1000);
  };

  const unlockedCount = rooms.filter(r => r.isUnlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display text-left">
      <StageHeader stageName="STAGE 2: ENTITY_BREACH" stageNumber={2} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />

      <div className="flex-1 flex flex-col lg:flex-row font-body">
        <section className="flex-1 p-8 lg:p-12 pb-40">
          <div className="max-w-6xl mx-auto space-y-12">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-red-900/40 pb-10 gap-6">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic blood-shadow leading-none">พื้นที่ควบคุม</h2>
                <p className="text-primary font-bold text-sm mt-4 tracking-[0.4em] uppercase flex items-center gap-3">
                  <span className="material-symbols-outlined font-black animate-pulse">terminal</span>
                  โหนดที่เจาะสำเร็จ: {unlockedCount} / 5
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {evidenceFiles.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFile({ ...f, type: 'ไฟล์หลักฐานระบบ' })}
                    className="glass-panel px-6 py-4 rounded-xl flex items-center gap-4 hover:border-primary transition-all group border-primary/20 bg-black/40"
                  >
                    <span className="material-symbols-outlined text-primary text-2xl font-black group-hover:scale-110 transition-transform">
                      {f.icon}
                    </span>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-[8px] text-primary/60 font-black tracking-widest uppercase">{f.status}</span>
                      <span className="text-xs font-mono font-bold text-white tracking-tighter uppercase">{f.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => !room.isUnlocked && setActiveRoomId(room.id)}
                  className={`glass-panel p-8 rounded-[2.5rem] border-4 transition-all relative overflow-hidden flex flex-col h-[520px] ${room.isUnlocked
                    ? 'border-primary bg-primary/5 shadow-[0_0_60px_rgba(255,0,0,0.15)]'
                    : 'border-white/5 bg-black/80 hover:border-primary/40 cursor-pointer group'
                    }`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                    <span className="material-symbols-outlined text-[150px] font-black">{room.icon}</span>
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${room.isUnlocked ? 'bg-primary text-black border-primary' : 'bg-white/5 text-primary/60 border-primary/20'}`}>
                          {room.isUnlocked ? 'AUTHORIZED' : 'ENCRYPTED'}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase font-mono tracking-widest">{room.authType}</span>
                      </div>
                      <h3 className="text-white font-black text-4xl uppercase tracking-tighter italic leading-none font-display">{room.name}</h3>
                      <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mt-2">{room.role}</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      {room.isUnlocked ? (
                        <div className="space-y-6 animate-in fade-in duration-500">
                          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                              <span className="material-symbols-outlined text-lg font-black">psychology</span>
                              รายงานพฤติกรรม
                            </h4>
                            <p className="text-sm text-gray-400 italic font-medium leading-relaxed">"{room.behavior}"</p>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-4">
                            {room.evidence.map((ev, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={(e_ev) => {
                                  e_ev.stopPropagation();
                                  if (ev === "บทสวดดั้งเดิม") {
                                    setShowRitualScroll(true);
                                  } else {
                                    // กำหนดเนื้อหาหลักฐานเฉพาะตามชื่อ
                                    let specificContent = "";
                                    switch(ev) {
                                      case "จดหมายถึงลูกชาย": specificContent = "ลูกเอ๋ย...พ่อขอโทษ\nวันที่เจ้าจากไป พ่อคิดว่าตนเองเข้มแข็งพอ\nแต่ความจริง พ่ออ่อนแอเกินกว่าจะยอมรับมัน\nวันนี้พ่อไม่ขอรั้งเจ้าไว้แล้ว\nขอเพียงให้ลูกไปสบาย ไม่ต้องหันกลับมาอีก"; break;
                                      case "คัมภีร์บทสวดโบราณ": specificContent = "บันทึก: 'การเปิดประตูนรกบานที่หก ต้องทำในยามตีสามของวันโกนเท่านั้น'"; break;
                                      case "บันทึกการยืมวัตถุโบราณ": specificContent = "ยืม: ผอบดินอาถรรพ์ และกริชเงินโบราณ สถานะ: ยังไม่ส่งคืน"; break;
                                      case "เอกสารสั่งห้ามเผยแพร่ข่าว": specificContent = "คำสั่ง: ระงับการทำข่าวเรื่องนักศึกษาหายในป่าหลังมหาลัยเด็ดขาด - รองฯ ธวัช"; break;
                                      case "บันทึกการโอนเงินลับ": specificContent = "โอนเงิน 500,000 บาท ไปยังบัญชี 'นายคำปัน' - บันทึก: ค่าที่ดิน/ค่าดำเนินการ"; break;
                                      case "บันทึกเวรยาม": specificContent = "คืนวันที่ 13: พบคนเดินแบกห่อผ้าสีขาวไปทางแม่น้ำหลัง ม. แต่ผมไม่ได้เรียกตรวจตามคำสั่งรองฯ"; break;
                                      case "ภาพจากกล้องวงจรปิดที่หายไป": specificContent = "[File Corrupted] เห็นเงาตะคุ่มคล้ายคน 3 คนยืนล้อมกองไฟในป่า"; break;
                                      case "เอกสารโครงงานวิจัย": specificContent = "ทฤษฎี: การใช้คลื่นความถี่ร่วมกับพิธีกรรมพื้นบ้านเพื่อควบคุมจิตใต้สำนึก"; break;
                                      case "สนิทกับนายคำปัน": specificContent = "สองคนนั้นสนิทกันมานาน\nเวลาใครในหมู่บ้านมีเรื่องหนักใจ\nก็มักเห็นมานั่งคุยกันใต้ต้นโพธิ์ข้างวัด"; break;
                                      default: specificContent = "ไฟล์ข้อมูลประกอบการพิจารณาคดีลับ";
                                    }
                                    
                                    setSelectedFile({
                                      name: ev,
                                      type: "หลักฐานมัดตัว",
                                      content: specificContent,
                                    });
                                  }
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-900/30 text-[11px] font-bold text-white hover:bg-red-700/50 hover:border-red-400 active:scale-95 transition-all"
                              >
                                <span>{ev}</span>
                                <span className="material-symbols-outlined text-sm opacity-70">open_in_new</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full justify-between">
                          <p className="text-lg text-gray-500 italic leading-relaxed font-medium">"{room.description}"</p>
                          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 flex flex-col items-center gap-4 group-hover:bg-primary/20 transition-all animate-heartbeat">
                            <span className="material-symbols-outlined text-primary text-4xl font-black italic">vpn_key</span>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">เริ่มต้นการเจาะระบบ</p>
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
                  className="bg-primary hover:bg-white text-black font-black px-24 py-8 rounded-[2.5rem] uppercase tracking-widest text-3xl italic shadow-[0_0_100px_rgba(255,0,0,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-8 font-display"
                >
                  <span className="material-symbols-outlined font-black text-5xl">key_visualizer</span>
                  ยืนยันข้อมูลเพื่อไปต่อ
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full lg:w-96 border-l-2 border-red-900/20 shrink-0 min-h-[500px] bg-black/20">
          <Terminal title="SYSTEM_AUTH_LOGS" lines={logs} />
        </aside>
      </div>

      {/* Ritual Scroll Modal */}
      {showRitualScroll && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-500">
          <div className="relative w-full max-w-2xl bg-[#f4e4bc] p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.8)] border-[12px] border-[#3d2b1f] rounded-sm overflow-y-auto max-h-[90vh] ritual-scroll-texture">
            <button onClick={() => setShowRitualScroll(false)} className="absolute top-4 right-4 text-[#3d2b1f] hover:scale-125 transition-all">
              <span className="material-symbols-outlined text-4xl font-black">close</span>
            </button>
            <div className="text-[#3d2b1f] font-serif text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-black border-b-2 border-[#3d2b1f]/30 pb-4 mb-10 tracking-widest uppercase italic">บทสวดแห่งสี่ทิศ</h2>
              <div className="text-xl md:text-2xl leading-[2.5rem] italic font-medium space-y-12 whitespace-pre-line text-justify md:text-center px-4">
                <p>๏ ถึงวันโกน มืดมิด ปิดดวงแก้ว<br />ยามตีสาม ครบแล้ว ตามกำหนด<br />เปิดประตูนรก บานที่หก สะกดบท<br />เร่งร่ายมนตร์ สังเวยพจน์ กฎแห่งตาย</p>
                <p>๏ ทิศอุดร ป้อนธรณี พลีธาตุดิน<br />ฝังกายสิ้น ลงลึก ผนึกหมาย<br />เหลือเพียงเศียร พ้นพื้น ยืนท้าทาย<br />ดูดชีพวาย ใต้หล้า กลับมาเป็น</p>
                <p>๏ บูรพา บูชาชล ดลธาตุน้ำ<br />ปล่อยศพลอย ทวนลำ ที่เชี่ยวเข็ญ<br />ให้กระแส แทรกซึม ดื่มความเย็น<br />ชะล้างเข็ญ เลือดหมุน อุ่นกายา</p>
                <p>๏ ทิศทักษิณ ถิ่นวาโย โชว์ธาตุลม<br />แขวนศพสม ยอดไม้ ไว้วเวหา<br />ให้ลมพัด ยัดเยียด เบียดวิญญา<br />คืนลมปราณ สู่ปุระ อุระตน</p>
                <p>๏ ปัจจิม ริมอัคคี พลีธาตุไฟ<br />เผาร่างให้ เกรียมกรม สมเหตุผล<br />กระตุ้นเนื้อ ที่มอดไหม้ ให้ร้อนรน<br />ปลุกชีพคน ให้ฟื้น ตื่นนิทราฯ</p>
              </div>
              <div className="mt-16 pt-8 border-t-2 border-[#3d2b1f]/20 bg-[#3d2b1f]/5 p-6 rounded-lg italic text-[#5d1a1a]">
                <p className="text-lg md:text-xl font-black uppercase mb-4 tracking-tighter">-- บันทึกท้ายคัมภีร์ --</p>
                <p className="text-base md:text-lg leading-relaxed font-bold">
                  "แลเมื่อสังเวยครบสี่ทิศตามธาตุแห่งผืนดิน น้ำ ลม ไฟ บ่วงวิญญาณจะคลายมนตร์ สะกดชีพที่ดับสูญให้หวนคืน หนึ่งชีวิตต้องแลกด้วยสี่ วิญญาณที่กักขังจะกลายเป็นรากฐานแห่งการอุบัติใหม่..."
                </p>
              </div>
            </div>
          </div>
          <style>{`.ritual-scroll-texture { background-image: url('https://www.transparenttextures.com/patterns/paper-fibers.png'); box-shadow: inset 0 0 100px rgba(0,0,0,0.1), 0 0 100px rgba(0,0,0,0.8); }`}</style>
        </div>
      )}

      {/* Verification Modal */}
      {activeRoomId !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300 font-body">
          <div className="w-full max-w-2xl glass-panel border-4 border-primary rounded-[3rem] p-12 md:p-16 flex flex-col gap-10 relative overflow-hidden shadow-[0_0_150px_rgba(255,0,0,0.3)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[300px] font-black italic">security</span>
            </div>
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black bg-primary text-black px-4 py-1 rounded-full uppercase tracking-widest">Security Challenge</span>
                  <span className="text-xs font-mono text-primary/60 font-bold uppercase tracking-widest">{rooms.find(r => r.id === activeRoomId)?.authType}</span>
                </div>
                <h2 className="text-5xl font-black text-white uppercase italic leading-none tracking-tight font-display">ปลดล็อก: {rooms.find(r => r.id === activeRoomId)?.name}</h2>
              </div>
              <div className="bg-primary/5 p-8 rounded-3xl border-l-[12px] border-primary">
                <p className="text-2xl text-gray-200 italic font-bold leading-relaxed mb-4">"{rooms.find(r => r.id === activeRoomId)?.challenge}"</p>
                <p className="text-xs text-primary/60 uppercase font-black tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Hint: {rooms.find(r => r.id === activeRoomId)?.hint}
                </p>
              </div>
              <div className="space-y-8">
                <input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  autoFocus
                  className={`w-full bg-black border-2 ${error ? 'border-primary animate-shake' : 'border-primary/20 focus:border-primary'} rounded-[2rem] py-8 px-10 text-3xl text-white outline-none transition-all placeholder-red-950 uppercase italic font-black shadow-2xl font-mono`}
                  placeholder="กรอกรหัสยืนยัน..."
                  disabled={isVerifying}
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={handleVerify} disabled={isVerifying || !inputValue} className="flex-1 bg-primary hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-700 text-black font-black py-6 rounded-2xl uppercase tracking-widest text-xl transition-all active:scale-95 italic shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 font-display">
                    <span className="material-symbols-outlined font-black text-3xl">lock_open</span>
                    {isVerifying ? 'กำลังตรวจสอบ...' : 'ยืนยันสิทธิ์'}
                  </button>
                  <button onClick={() => { setActiveRoomId(null); setInputValue(''); }} className="px-8 py-6 bg-transparent border-2 border-white/10 hover:border-white/40 text-gray-500 hover:text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all italic font-display">ยกเลิก</button>
                </div>
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