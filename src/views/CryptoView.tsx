
import React, { useState } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';
import EvidenceModal from '../components/EvidenceModal';

interface CryptoViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

interface Objective {
  id: number;
  title: string;
  category: string;
  description: string;
  answer: string;
  hint: string;
  isCompleted: boolean;
  poem: string;
  forensicResult?: string;
}

const CryptoView: React.FC<CryptoViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, type: string, content: string} | null>(null);
  
  const [objectives, setObjectives] = useState<Objective[]>([
    { 
      id: 1, 
      title: "ศพที่ 1: ทิศเหนือ (ดิน)", 
      category: "AES Decryption",
      description: "ไฟล์ชันสูตร autopsy_north.enc ถูกล็อกด้วย AES-256 'ดินจำกลิ่นของผู้ที่เหยียบมันเป็นครั้งแรก' ป้อนชื่อภาควิชาแรกของผู้ตายเพื่อใช้เป็นกุญแจ", 
      poem: "เหนือเอาดิน กลบลมหาย... เลือดซึมดิน เป็นคำสาบาน",
      answer: "GEOLOGY", 
      hint: "ตรวจสอบไฟล์ VICTIM_01.BIO พบว่าผู้ตายเคยศึกษาที่ภาควิชา 'GEOLOGY' (ธรณีวิทยา)",
      isCompleted: false,
      forensicResult: "ชันสูตร: ดินในปอดไม่ตรงกับพิกัดที่พบศพ ไม่พบร่องรอยการดิ้นรนก่อนตาย"
    },
    { 
      id: 2, 
      title: "ศพที่ 2: ทิศตะวันออก (น้ำ)", 
      category: "Signature Verification",
      description: "ไฟล์ autopsy_east.pkg อ้างว่าลงนามโดย 'รองอธิการธวัช' แต่ระบบแจ้งเตือนสถานะความปลอดภัย ตรวจสอบสถานะของ Certificate นี้", 
      poem: "ออกเอาน้ำ กลืนชื่อคน ปิดปากตน ด้วยคลื่นไหล",
      answer: "EXPIRED", 
      hint: "ดูในไฟล์ SIGNATURE_STATUS.LOG พบว่าใบรับรองของรองอธิการถูกระบุว่า 'EXPIRED' (หมดอายุ)",
      isCompleted: false,
      forensicResult: "ชันสูตร: พบยาสลบเข้มข้นในกระแสเลือด และเรือถูกผูกไว้จากด้านนอกก่อนที่น้ำจะเข้า"
    },
    { 
      id: 3, 
      title: "ศพที่ 3: ทิศใต้ (ไม้)", 
      category: "Diffie-Hellman",
      description: "คำนวณ Shared Secret (s) เพื่อปลดล็อกข้อมูลศพที่ถูกแขวน: กำหนดให้ A=3, b=4, p=13. จงหาค่า s = A^b mod p", 
      poem: "ใต้เอาไม้ ผูกลมหาย... เมื่อเท้าไม่ แตะพื้นพง",
      answer: "3", 
      hint: "คำนวณ 3^4 = 81 จากนั้นหา 81 mod 13 = 3",
      isCompleted: false,
      forensicResult: "ชันสูตร: กระดูกคอหักก่อนการแขวน เชือกถูกคำนวณแรงตึงมาอย่างแม่นยำด้วยโปรแกรมคอมพิวเตอร์"
    },
    { 
      id: 4, 
      title: "บทสรุป: ลายเซ็นฆาตกร", 
      category: "Final Identity",
      description: "ระบุ Subject ID ของฆาตกรที่ลงนามกำกับ 'บทสวดทิศตะวันตก' ที่ยังไม่ถูกเปิดเผย", 
      poem: "ให้ความตาย เลือกทางเอง... ชีวิตที่สี่ ไม่ถูกกำหนดด้วยพิธี",
      answer: "MANAT-52", 
      hint: "ตรวจสอบไฟล์ FINAL_SIGNATURE.SIG ฆาตกรทิ้งรหัส 'MANAT-52' ไว้ใน Metadata",
      isCompleted: false 
    }
  ]);

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', content: 'Forensic Decryption Sub-routine Initialized.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'WARN', content: 'Autopsy reports are heavily obfuscated by administrative encryption.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'INFO', content: 'Ready to process 3 cardinal bodies.' }
  ]);

  const handleVerify = () => {
    const currentTask = objectives[currentTaskIndex];
    if (!inputValue) return;
    setIsVerifying(true);
    setTimeout(() => {
      if (inputValue.trim().toUpperCase() === currentTask.answer.toUpperCase()) {
        const updated = [...objectives];
        updated[currentTaskIndex].isCompleted = true;
        setObjectives(updated);
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'SUCCESS', content: `[${currentTask.category}] Decrypted.` }]);
        if (currentTask.forensicResult) {
          setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'INFO', content: currentTask.forensicResult! }]);
        }
        
        if (currentTaskIndex < objectives.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
          setInputValue('');
        } else {
          onComplete();
        }
      } else {
        setError(true);
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), type: 'ERR', content: `Verification Failed in ${currentTask.title}.` }]);
        setTimeout(() => setError(false), 1000);
      }
      setIsVerifying(false);
    }, 800);
  };

  const evidenceFiles = [
    { id: 'v1', name: 'VICTIM_01.BIO', type: 'BIO', content: "Name: Somchai\nDept: Geology Engineering\nYear: 2021\nNote: 'ดินจำกลิ่นของผู้ที่เหยียบมันเป็นครั้งแรก'" },
    { id: 'sig', name: 'SIGNATURE_STATUS.LOG', type: 'LOG', content: "Subject: VP_Thawat\nIssuer: University_CA\nStatus: EXPIRED\nTimestamp_Mismatch: DETECTED" },
    { id: 'dh', name: 'WIND_EXCHANGE.TXT', type: 'CRYPTO', content: "Public_G: 2\nPublic_P: 13\nAlice_A: 3\nBob_b: 4\nCalculate: Shared_Secret_s = A^b mod p" },
    { id: 'meta', name: 'FINAL_SIGNATURE.SIG', type: 'META', content: "X-Auth-ID: MANAT-52\nX-Auth-Role: DR_MANAT\nNote: 'ชีวิตที่สี่ไม่ถูกกำหนดด้วยพิธี'" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-dark font-display">
      <StageHeader stageName="FORENSIC DECRYPTION" stageNumber={1} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />
      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 border-r border-border-dark bg-black/60 p-6 shrink-0">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-8">Autopsy Queue</h3>
          <div className="space-y-4">
            {objectives.map((obj, i) => (
              <div key={obj.id} className={`p-5 rounded-2xl border transition-all ${obj.isCompleted ? 'border-primary/20 bg-primary/5 opacity-40 grayscale' : i === currentTaskIndex ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(255,0,0,0.1)]' : 'border-white/5 opacity-20'}`}>
                <div className="text-[9px] font-mono text-primary font-bold mb-2 uppercase">{obj.category}</div>
                <div className="text-sm font-black text-white uppercase tracking-tight">{obj.title}</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 p-8 flex flex-col gap-8 pb-32">
          <div className="flex flex-wrap gap-4">
            {evidenceFiles.map(f => (
              <button key={f.name} onClick={() => setSelectedFile(f)} className="glass-panel px-6 py-4 rounded-xl flex items-center gap-4 hover:border-primary transition-all group border-primary/20">
                <span className="material-symbols-outlined text-primary text-2xl font-black">folder_managed</span>
                <span className="text-xs font-mono font-bold">{f.name}</span>
              </button>
            ))}
          </div>

          <div className="glass-panel rounded-[3rem] p-10 md:p-16 flex-1 flex flex-col bg-black/90 border-primary/20 relative overflow-hidden shadow-2xl">
             <div className="relative z-10 h-full flex flex-col justify-center max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-16 bg-primary"></div>
                  <div className="text-primary font-bold text-xs uppercase tracking-widest italic">{objectives[currentTaskIndex].category}</div>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase mb-8 tracking-tighter italic leading-none">
                  {objectives[currentTaskIndex].title}
                </h2>

                <div className="bg-primary/5 p-10 rounded-3xl border-l-[12px] border-primary mb-12 group hover:bg-primary/10 transition-colors">
                  <p className="text-gray-200 font-bold italic text-2xl md:text-3xl leading-snug">
                    "{objectives[currentTaskIndex].poem}"
                  </p>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest block">CHALLENGE_OBJECTIVE</label>
                    <p className="text-gray-300 text-lg leading-relaxed font-medium">{objectives[currentTaskIndex].description}</p>
                  </div>

                  <div className="space-y-6 max-w-xl">
                    <div className="relative group">
                      <input 
                        type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleVerify()}
                        className={`w-full bg-black border-2 ${error ? 'border-primary animate-shake' : 'border-primary/20 focus:border-primary'} rounded-2xl py-7 px-10 font-mono text-3xl text-white outline-none transition-all placeholder-red-950 shadow-inner italic font-bold tracking-tight`}
                        placeholder="ENTER_RESULT..."
                        disabled={isVerifying}
                      />
                      {isVerifying && <div className="absolute right-8 top-1/2 -translate-y-1/2 size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                    
                    <button 
                      onClick={handleVerify} 
                      disabled={isVerifying || !inputValue}
                      className="w-full bg-primary hover:bg-white text-black font-black py-7 rounded-2xl uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-6 italic text-xl"
                    >
                      <span className="material-symbols-outlined font-black text-3xl">medical_services</span>
                      {isVerifying ? 'DECIPHERING...' : 'ACCESS_AUTOPSY_LOG'}
                    </button>
                  </div>
                </div>
             </div>

             <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none rotate-12">
                <span className="material-symbols-outlined text-[500px]">biotech</span>
             </div>
          </div>
        </section>

        <aside className="w-full lg:w-96 flex flex-col bg-black shrink-0 border-l-2 border-border-dark min-h-[400px]">
          <Terminal title="DECRYPTION_CORE" lines={logs} />
        </aside>
      </div>
      <EvidenceModal isOpen={!!selectedFile} onClose={() => setSelectedFile(null)} file={selectedFile} />
    </div>
  );
};

export default CryptoView;
