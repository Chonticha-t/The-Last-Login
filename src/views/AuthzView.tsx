import React, { useState, useEffect } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';

interface RevelationViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

// ข้อมูลผู้ต้องสงสัยและบทพูด
const SUSPECTS_DATA = [
  {
    id: 1,
    name: "นายคำปัน",
    role: "พ่อผู้สูญเสีย",
    status: "Suspicious",
    imageIcon: "person",
    heartRate: 85, // ชีพจรปกติ
    testimony: "ผมรักลูกชายผมมาก... คืนนั้นผมนอนสวดมนต์อยู่ที่บ้าน ไม่รู้เรื่องพิธีกรรมบ้าบออะไรนั่นหรอก ผมเป็นแค่ชาวบ้านธรรมดา",
    weaknessEvidenceId: "EVI_01", // แพ้ทางหลักฐาน: บทสวด/จดหมาย
    breakdownText: "ใช่... ผมทำพิธีนั่นเอง! แต่ผมทำเพื่อ 'ช่วย' มันต่างหาก! ผมพยายามชุบชีวิตตุ๊ขึ้นมา ไม่ได้ฆ่ามัน!!",
    isBroken: false
  },
  {
    id: 2,
    name: "ศ. ดร. ศักดิ์",
    role: "นักประวัติศาสตร์",
    status: "Suspicious",
    imageIcon: "history_edu",
    heartRate: 72,
    testimony: "ของโบราณพวกนั้นผมแค่ยืมมาศึกษาตามระเบียบราชการ คืนนั้นผมหลับไปตั้งแต่หัวค่ำ ไม่ได้เข้าไปยุ่งย่ามในเขตหวงห้ามเลยสักนิด",
    weaknessEvidenceId: "EVI_02", // แพ้ทางหลักฐาน: บันทึกยืมของ/Log
    breakdownText: "โธ่เว้ย! ก็ได้ๆ ผมแอบเข้าไปขโมยวัตถุโบราณจริง แต่ผมเข้าไปตอนตี 1 แล้วรีบออกมา ผมเห็นแค่ศพ... แต่ผมไม่ได้ฆ่าใครนะ!",
    isBroken: false
  },
  {
    id: 3,
    name: "รองฯ ธวัช",
    role: "ผู้บริหาร",
    status: "Suspicious",
    imageIcon: "corporate_fare",
    heartRate: 65,
    testimony: "ทางมหาวิทยาลัยเสียใจกับเรื่องที่เกิดขึ้น เราพยายามประสานงานกับตำรวจอย่างเต็มที่ และไม่มีการปิดบังข้อมูลใดๆ ทั้งสิ้น",
    weaknessEvidenceId: "EVI_03", // แพ้ทางหลักฐาน: สลิปโอนเงิน/คำสั่งปิดข่าว
    breakdownText: "ฟังนะ... ชื่อเสียงมหาลัยสำคัญที่สุด! ผมแค่จ้างคนไปเก็บกวาดไม่ให้เป็นข่าว แต่ตอนผมไปถึง พวกเด็กนั่นก็ตายกันหมดแล้ว!",
    isBroken: false
  },
  {
    id: 4,
    name: "นายประเสริฐ",
    role: "รปภ.",
    status: "Suspicious",
    imageIcon: "badge",
    heartRate: 110,
    testimony: "ผม... ผมไม่เห็นอะไรทั้งนั้น! คืนนั้นผมนั่งเฝ้าป้อมยามหน้าประตูใหญ่ตลอดเวลา ไม่ได้หลับยาม และไม่มีใครผ่านเข้ามาเลย!",
    weaknessEvidenceId: "EVI_04", // แพ้ทางหลักฐาน: CCTV/FaceID Log
    breakdownText: "อ๊ากกก!! ผมเห็นมัน... เงาสีดำๆ ตัวสูงใหญ่ มันลากศพไปที่น้ำ... ผมกลัว! ผมเลยรีบหนีออกมา ผมไม่ได้ทำ!",
    isBroken: false
  },
  {
    id: 5,
    name: "ดร. มนัส",
    role: "นักวิจัยเคมี",
    status: "Suspicious",
    imageIcon: "biotech",
    heartRate: 60, // นิ่งผิดปกติ
    testimony: "คืนเกิดเหตุผมนอนหลับสบายอยู่ในห้องพักแล็บ ไม่ได้รับรู้อะไรเลย งานวิจัยของผมเกี่ยวกับพืชสมุนไพร ไม่เกี่ยวข้องกับสารอันตรายพวกนั้น",
    weaknessEvidenceId: "EVI_05", // แพ้ทางหลักฐาน: แก้วกาแฟ/Arsenic Log
    breakdownText: "หึ... ช่างสังเกตจังนะ ใช่ ผมไม่ได้นอน... การทดลอง 'Arsenic-33' เพื่อกระตุ้นระบบประสาทต้องใช้ความละเอียดอ่อน... พวกเด็กนั่นแค่อาสาสมัครที่ล้มเหลว",
    isBroken: false
  }
];

// หลักฐานที่ผู้เล่นถืออยู่ (จำลองว่าได้มาจาก Stage 2)
const EVIDENCE_INVENTORY = [
  { id: "EVI_01", name: "คัมภีร์บทสวด & จดหมาย", desc: "หลักฐานว่านายคำปันมีความรู้เรื่องพิธีกรรมมืดและพยายามทำบางอย่างเพื่อลูก" },
  { id: "EVI_02", name: "Log การยืมวัตถุโบราณ", desc: "บันทึกที่ระบุว่า ศ.ศักดิ์ ยืมของกลางออกไปนอกเวลาและยังไม่คืน" },
  { id: "EVI_03", name: "สลิปโอนเงิน & คำสั่งลับ", desc: "หลักฐานการจ้างวานปิดข่าวและการโอนเงินให้นายคำปัน" },
  { id: "EVI_04", name: "CCTV & FaceID Log", desc: "บันทึกระบุว่า รปภ. ไม่อยู่ที่ป้อม และกล้องจับภาพอาการหวาดกลัวได้" },
  { id: "EVI_05", name: "Log สารหนู & แก้วกาแฟ", desc: "บันทึกการเบิก Arsenic (As) และหลักฐานการดื่มกาแฟอย่างหนัก (นอนไม่หลับ)" },
];

const RevelationView: React.FC<RevelationViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [suspects, setSuspects] = useState(SUSPECTS_DATA);
  const [selectedSuspectId, setSelectedSuspectId] = useState<number | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewState, setViewState] = useState<'INTERROGATION' | 'VERDICT'>('INTERROGATION');
  const [verdictId, setVerdictId] = useState<number | null>(null);
  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: 'SYSTEM', type: 'WARN', content: 'ENTERING FINAL STAGE: TRUTH REVELATION' },
    { timestamp: 'AI_CORE', type: 'INFO', content: 'ANALYZE TESTIMONIES. FIND CONTRADICTIONS.' }
  ]);

  // Effect สำหรับพิมพ์ข้อความทีละตัว (Typewriter effect)
  useEffect(() => {
    if (selectedSuspectId) {
      const suspect = suspects.find(s => s.id === selectedSuspectId);
      if (suspect) {
        const textToType = suspect.isBroken ? suspect.breakdownText : suspect.testimony;
        setDialogue("");
        setIsTyping(true);
        let i = 0;
        const timer = setInterval(() => {
          if (i < textToType.length) {
            setDialogue(prev => prev + textToType.charAt(i));
            i++;
          } else {
            setIsTyping(false);
            clearInterval(timer);
          }
        }, 20); // ความเร็วการพิมพ์
        return () => clearInterval(timer);
      }
    }
  }, [selectedSuspectId, suspects]); // Re-run when suspect or their status changes

  const handlePresentEvidence = () => {
    if (!selectedSuspectId || !selectedEvidenceId) return;

    const suspectIndex = suspects.findIndex(s => s.id === selectedSuspectId);
    const suspect = suspects[suspectIndex];

    if (suspect.isBroken) {
        setLogs(prev => [...prev, { timestamp: 'AI', type: 'WARN', content: 'SUBJECT ALREADY BROKEN.' }]);
        return;
    }

    if (selectedEvidenceId === suspect.weaknessEvidenceId) {
      // Success: Break the suspect
      const newSuspects = [...suspects];
      newSuspects[suspectIndex] = { ...suspect, isBroken: true, status: "Confessed" };
      setSuspects(newSuspects);
      setLogs(prev => [...prev, { timestamp: 'TRUTH', type: 'SUCCESS', content: `CONTRADICTION FOUND! SUBJECT ${suspect.name} BROKEN.` }]);
      
      // Play sound effect logic here if needed
    } else {
      // Failed
      setLogs(prev => [...prev, { timestamp: 'AI', type: 'ERR', content: 'EVIDENCE DOES NOT CONTRADICT STATEMENT.' }]);
      // Penalty logic could go here
    }
  };

  const allBroken = suspects.every(s => s.isBroken);

  const handleFinalVerdict = () => {
    if (verdictId === 5) { // Dr. Manas is the culprit
       onComplete();
    } else {
       setLogs(prev => [...prev, { timestamp: 'SYSTEM', type: 'ERR', content: 'INCORRECT VERDICT. THE REAL CULPRIT IS STILL FREE.' }]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-body overflow-hidden flex flex-col">
      <StageHeader stageName="STAGE 3: THE REVELATION" stageNumber={3} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />

      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        
        {/* LEFT PANEL: SUSPECT LIST */}
        <section className="w-full lg:w-80 bg-black border-r border-red-900/30 flex flex-col shrink-0 z-20 shadow-[10px_0_50px_rgba(0,0,0,0.5)]">
          <div className="p-6 border-b border-red-900/30 bg-red-950/10">
            <h2 className="text-xl font-black italic uppercase text-red-500 tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined">group</span>
              ผู้ต้องสงสัย
            </h2>
            <p className="text-[10px] text-gray-500 mt-1">SELECT SUBJECT TO INTERROGATE</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {suspects.map(suspect => (
              <button
                key={suspect.id}
                onClick={() => {
                    if (viewState === 'INTERROGATION') setSelectedSuspectId(suspect.id);
                }}
                disabled={viewState === 'VERDICT'}
                className={`w-full p-4 rounded-xl border-l-4 transition-all relative overflow-hidden group text-left ${
                  selectedSuspectId === suspect.id 
                    ? 'bg-red-900/20 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]' 
                    : 'bg-zinc-900/40 border-zinc-700 hover:bg-zinc-800'
                } ${suspect.isBroken ? 'opacity-70 grayscale' : ''}`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${suspect.isBroken ? 'border-gray-600 bg-gray-800' : 'border-red-500/50 bg-black'}`}>
                    <span className="material-symbols-outlined text-2xl">{suspect.imageIcon}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm uppercase ${suspect.isBroken ? 'text-gray-400 line-through decoration-red-500' : 'text-white'}`}>{suspect.name}</h3>
                    <p className="text-[10px] text-gray-400 tracking-wider">{suspect.role}</p>
                  </div>
                  {suspect.isBroken && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-600 font-black text-2xl -rotate-12 border-2 border-red-600 px-2 py-1 rounded opacity-50">BROKEN</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CENTER PANEL: INTERROGATION ROOM */}
        <section className="flex-1 flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          
          {viewState === 'VERDICT' ? (
             <div className="flex-1 flex flex-col items-center justify-center p-10 animate-in zoom-in duration-500 bg-black/80 backdrop-blur-sm z-30">
                <h2 className="text-6xl font-black text-red-600 uppercase italic mb-8 blood-shadow text-center">Final Verdict</h2>
                <p className="text-gray-300 text-xl mb-12 max-w-2xl text-center font-medium">
                    จากคำสารภาพทั้งหมด... ใครคือ "ฆาตกรตัวจริง" ที่อยู่เบื้องหลังความตายเหล่านี้?
                    <br/><span className="text-sm text-red-500 mt-2 block">(เลือกคนร้ายเพียงหนึ่งเดียว)</span>
                </p>
                <div className="grid grid-cols-5 gap-4 w-full max-w-5xl">
                    {suspects.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setVerdictId(s.id)}
                            className={`p-6 border-2 rounded-xl flex flex-col items-center gap-4 transition-all ${
                                verdictId === s.id ? 'border-red-500 bg-red-900/40 scale-105' : 'border-gray-700 bg-black/60 hover:border-gray-500'
                            }`}
                        >
                            <span className="material-symbols-outlined text-4xl text-white">{s.imageIcon}</span>
                            <span className="font-bold text-sm uppercase text-center">{s.name}</span>
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleFinalVerdict}
                    disabled={!verdictId}
                    className="mt-12 bg-red-600 hover:bg-red-500 text-white font-black text-2xl py-4 px-16 rounded-full uppercase tracking-widest shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    พิพากษา (JUDGE)
                </button>
             </div>
          ) : (
            <>
              {/* Pulse Monitor Area */}
              <div className="h-24 bg-black border-b border-red-900/30 flex items-center px-8 justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(220,38,38,0.1)_50%,transparent_100%)] animate-scan-fast pointer-events-none"></div>
                
                <div className="flex items-center gap-6 z-10">
                   <div className="flex flex-col">
                       <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Heart Rate</span>
                       <span className={`text-4xl font-mono font-black ${selectedSuspectId && suspects.find(s=>s.id===selectedSuspectId)?.isBroken ? 'text-red-600 animate-pulse' : 'text-green-500'}`}>
                           {selectedSuspectId ? suspects.find(s=>s.id===selectedSuspectId)?.heartRate : '--'} <span className="text-sm">BPM</span>
                       </span>
                   </div>
                   {/* Fake Waveform */}
                   <div className="flex items-end gap-1 h-12 w-48 opacity-70">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className={`w-1.5 bg-red-500 transition-all duration-100 ease-in-out`} style={{ 
                                height: `${Math.random() * 100}%`,
                                opacity: selectedSuspectId ? 1 : 0.2
                            }}></div>
                        ))}
                   </div>
                </div>

                <div className="z-10 text-right">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Voice Analysis</div>
                    <div className={`text-lg font-bold uppercase ${selectedSuspectId && suspects.find(s=>s.id===selectedSuspectId)?.isBroken ? 'text-red-500' : 'text-blue-400'}`}>
                        {selectedSuspectId ? (suspects.find(s=>s.id===selectedSuspectId)?.isBroken ? 'DECEPTION DETECTED' : 'ANALYZING...') : 'STANDBY'}
                    </div>
                </div>
              </div>

              {/* Character & Dialogue Area */}
              <div className="flex-1 relative flex flex-col items-center justify-end pb-12">
                 
                 {/* Silhouette / Character Visual */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="material-symbols-outlined text-[400px] text-white">
                        {selectedSuspectId ? suspects.find(s=>s.id===selectedSuspectId)?.imageIcon : 'fingerprint'}
                    </span>
                 </div>

                 {/* Dialogue Box */}
                 <div className="w-full max-w-4xl z-20 px-8">
                    {selectedSuspectId ? (
                        <div className={`glass-panel border-2 ${suspects.find(s=>s.id===selectedSuspectId)?.isBroken ? 'border-red-600 bg-red-950/30' : 'border-primary/50 bg-black/80'} p-8 rounded-2xl relative shadow-2xl min-h-[180px] flex flex-col justify-center`}>
                            
                            <h3 className="absolute -top-4 left-8 px-4 py-1 bg-black border border-current text-sm font-bold uppercase tracking-widest" style={{ color: suspects.find(s=>s.id===selectedSuspectId)?.isBroken ? '#ef4444' : '#ffffff' }}>
                                {suspects.find(s=>s.id===selectedSuspectId)?.name}
                            </h3>

                            <p className={`font-mono text-xl md:text-2xl leading-relaxed ${suspects.find(s=>s.id===selectedSuspectId)?.isBroken ? 'text-red-400 italic shake-animation' : 'text-gray-200'}`}>
                                "{dialogue}"
                                {isTyping && <span className="animate-blink">|</span>}
                            </p>

                            {/* Contradiction Prompt */}
                            {!suspects.find(s=>s.id===selectedSuspectId)?.isBroken && !isTyping && (
                                <div className="absolute bottom-4 right-4 animate-bounce">
                                    <span className="text-xs text-primary bg-black/50 px-2 py-1 rounded">เลือกหลักฐานที่ขัดแย้งกับคำพูดนี้</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600 font-mono text-lg animate-pulse">
                            &lt; WAITING FOR SUBJECT SELECTION &gt;
                        </div>
                    )}
                 </div>
              </div>

              {/* EVIDENCE SELECTOR (Bottom Bar) */}
              <div className="h-40 bg-zinc-900 border-t border-red-900/50 p-4 shrink-0 z-30">
                  <div className="max-w-6xl mx-auto flex items-center gap-4 h-full">
                      <div className="shrink-0 w-32 text-right border-r border-gray-700 pr-4">
                          <h4 className="text-primary font-black uppercase text-sm">หลักฐาน</h4>
                          <p className="text-[10px] text-gray-500">Evidence Bag</p>
                      </div>
                      
                      <div className="flex-1 flex gap-4 overflow-x-auto pb-2 custom-scrollbar items-center">
                          {EVIDENCE_INVENTORY.map(ev => (
                              <button
                                key={ev.id}
                                onClick={() => !allBroken && setSelectedEvidenceId(ev.id)}
                                className={`shrink-0 w-48 h-24 border rounded-lg p-3 flex flex-col justify-between text-left transition-all relative group ${
                                    selectedEvidenceId === ev.id 
                                    ? 'bg-primary text-black border-primary scale-105 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                                    : 'bg-black border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                              >
                                  <div className="font-bold text-xs uppercase truncate w-full">{ev.name}</div>
                                  <div className="text-[9px] line-clamp-2 opacity-80">{ev.desc}</div>
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="material-symbols-outlined text-sm">inventory_2</span>
                                  </div>
                              </button>
                          ))}
                      </div>

                      <div className="shrink-0 pl-4 border-l border-gray-700">
                          {allBroken ? (
                              <button 
                                onClick={() => setViewState('VERDICT')}
                                className="bg-red-600 hover:bg-red-500 text-white font-black h-20 w-40 rounded-xl text-xl uppercase italic shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse"
                              >
                                  DECIDE<br/>FATE
                              </button>
                          ) : (
                              <button 
                                onClick={handlePresentEvidence}
                                disabled={Boolean(!selectedEvidenceId || !selectedSuspectId || (selectedSuspectId && suspects.find(s=>s.id===selectedSuspectId)?.isBroken))}
                                className="bg-white hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 text-black font-black h-20 w-40 rounded-xl text-lg uppercase italic transition-all active:scale-95 flex flex-col items-center justify-center"
                              >
                                  <span className="material-symbols-outlined text-2xl mb-1">gavel</span>
                                  CATCH LIE
                              </button>
                          )}
                      </div>
                  </div>
              </div>
            </>
          )}
        </section>

        {/* RIGHT PANEL: LOGS (Optional/Collapsible) */}
        <aside className="xl:block w-72 bg-black border-l border-red-900/20 p-4 font-mono text-xs overflow-hidden flex flex-col hidden">
            <h3 className="text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Analysis Log</h3>
            <Terminal title="TRUTH_SEEKER_v1.0" lines={logs} />
        </aside>

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        
        .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .blood-shadow { text-shadow: 0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.4); }
      `}</style>
    </div>
  );
};

export default RevelationView;