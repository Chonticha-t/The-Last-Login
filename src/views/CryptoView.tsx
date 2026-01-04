import React, { useState } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';

interface CryptoViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

const MaterialIcon = ({ icon, className = "" }: { icon: string, className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

const CORPSES_DATA = [
  {
    id: 0,
    direction: "NORTH (อุดร)",
    pos: { top: '15%', left: '50%' },
    element: "EARTH",
    cryptoType: "SYMMETRIC ENCRYPTION",
    iconName: "landslide",
    difficulty: "Easy",
    description: "ไฟล์ผลชันสูตรถูกเข้ารหัส XOR. Key คือคำภาษาอังกฤษ 5 ตัวอักษร (เกี่ยวกับทิศที่พบศพ)",
    challengeData: {
      ciphertext: "17 1A 06 0B 1B 1C 17 1D 1A 1B",
      hint: "Key is the English name of this direction.",
      solution: "SUFFOCATION" 
    },
    autopsyFindings: [
      "สภาพศพ: ถูกฝังดินลึกระดับไหล่ เหลือเพียงศีรษะโผล่พ้นดิน",
      "ภายนอก: พบรอยช้ำเป็นวงรอบข้อมือทั้งสองข้าง ลักษณะถูกมัดไพล่หลังอย่างแน่นหนา",
      "ภายใน: ตรวจพบเศษดินโคลนจำนวนมากอัดแน่นในหลอดลมและปอด",
      "สาเหตุการตาย: ขาดอากาศหายใจจากการสำลักดิน"
    ],
    poem: "ทิศอุดร ป้อนธรณี พลีธาตุดิน \nฝังกายสิ้น ลงลึก ผนึกหมาย \nเหลือเพียงเศียร พ้นพื้น ยืนท้าทาย \nดูดชีพวาย ใต้หล้า กลับมาเป็น"
  },
  {
    id: 1,
    direction: "EAST (บูรพา)",
    pos: { top: '50%', left: '85%' },
    element: "WATER",
    cryptoType: "ASYMMETRIC (RSA)",
    iconName: "water_drop",
    difficulty: "Medium",
    description: "ถอดรหัส RSA เพื่อเข้าถึงผลตรวจสารพิษ. (Given: n = 3233, e = 17. Find d)",
    challengeData: {
      ciphertext: "RSA Key Exchange Intercepted.",
      hint: "Calculate d where (d * e) % phi(n) = 1",
      solution: "2753"
    },
    autopsyFindings: [
      "สภาพศพ: ลอยคว่ำหน้าในแหล่งน้ำ สภาพขึ้นอืด",
      "ภายนอก: ไม่พบรอยบาดแผลฉกรรจ์ แต่พบรอยเข็มฉีดยา บริเวณต้นคอด้านขวา",
      "พิษวิทยา: ตรวจพบสาร Tetrodotoxin (พิษปลาปักเป้า) ในกระแสเลือดปริมาณสูง",
      "สรุป: ผู้ตายเป็นอัมพาตจากสารพิษและจมน้ำเสียชีวิตในเวลาต่อมา"
    ],
    poem: "บูรพา บูชาชล ดลธาตุน้ำ \nปล่อยศพลอย ทวนลำ ที่เชี่ยวเข็ญ \nให้กระแส แทรกซึม ดื่มความเย็น \nชะล้างเข็ญ เลือดหมุน อุ่นกายา"
  },
  {
    id: 2,
    direction: "SOUTH (ทักษิณ)",
    pos: { top: '85%', left: '50%' },
    element: "WIND",
    cryptoType: "HASH FUNCTION",
    iconName: "air",
    difficulty: "Medium",
    description: "Crack MD5 Hash ของสารเคมีที่พบในที่เกิดเหตุ (4 ตัวอักษรภาษาอังกฤษพิมพ์ใหญ่)",
    challengeData: {
      ciphertext: "MD5: c4ca4238a0b923820dcc509a6f75849b",
      ciphertextDisplay: "MD5 Hash of the chemical agent found on fingers.",
      hint: "Corrosive substance used to dissolve fingerprints.",
      solution: "ACID"
    },
    autopsyFindings: [
      "สภาพศพ: แขวนคออยู่บนกิ่งไม้สูงด้วยเชือกไนลอน",
      "ภายนอก: ลายนิ้วมือถูกทำลายด้วยสารเคมีกัดกร่อนรุนแรง (Chemical burns)",
      "ข้อสังเกต: รอยเชือกที่คอมีลักษณะกดทับในแนวเฉียงขึ้น (Hanging) แต่พบรอยกดทับอื่นที่เกิดขึ้นหลังตาย",
      "สรุป: สารเคมีที่พบคือ กรดเข้มข้น (Acid)"
    ],
    poem: "๏ ทิศทักษิณ ถิ่นวาโย โชว์ธาตุลม \nแขวนศพสม ยอดไม้ ไว้วเวหา \nให้ลมพัด ยัดเยียด เบียดวิญญา \nคืนลมปราณ สู่ปุระ อุระตน"
  },
  {
    id: 3,
    direction: "WEST (ปัจจิม)",
    pos: { top: '50%', left: '15%' },
    element: "FIRE",
    cryptoType: "DIGITAL SIGNATURE",
    iconName: "local_fire_department",
    difficulty: "Hard",
    description: "ตรวจสอบ Digital Signature ของรายงานฉบับนี้ (ตอบ VALID หรือ INVALID)",
    challengeData: {
      ciphertext: "Signer: Unknown\nHash Mismatch Detected.",
      hint: "The integrity of this report is compromised.",
      solution: "INVALID"
    },
    autopsyFindings: [
      "สถานะ: ค้นพบร่องรอยการทำลายหลักฐาน (Digital Sabotage)",
      "ข้อมูลการสืบสวน: เป้าหมายรายต่อไปถูกกำหนดให้เป็นเหยื่อในพิธี 'บูชาอัคคี' (ธาตุไฟ)",
      "ความเสี่ยง: การเผาทั้งเป็นและการบิดเบือนข้อมูลข้อมูลนิติเวช",
      "คำเตือน: ระบบตรวจพบการเข้าถึงข้อมูลที่ผิดปกติ"
    ],
    poem: "๏ ปัจจิม ริมอัคคี พลีธาตุไฟ \nเผาร่างให้ เกรียมกรม สมเหตุผล \nกระตุ้นเนื้อ ที่มอดไหม้ ให้ร้อนรน \nปลุกชีพคน ให้ฟื้น ตื่นนิทราฯ"
  }
];

type ViewState = 'MAP' | 'CHALLENGE' | 'REPORT';

const CryptoView: React.FC<CryptoViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [view, setView] = useState<ViewState>('MAP');
  const [selectedCorpseId, setSelectedCorpseId] = useState<number>(0);
  const [unlockedStatus, setUnlockedStatus] = useState<boolean[]>([false, false, false, false]); 
  const [challengeInput, setChallengeInput] = useState('');
  
  const [terminalLogs, setTerminalLogs] = useState<TerminalLine[]>([
    { timestamp: 'SYSTEM', type: 'WARN', content: 'RITUAL INTERFACE: LOADED.' },
    { timestamp: 'SYSTEM', type: 'ERR', content: 'CRITICAL: RESOLVE ALL 4 NODES TO PROCEED.' }
  ]);

  const handleCorpseClick = (id: number) => {
    const isUnlocked = unlockedStatus[id];
    const canAccess = id === 0 || unlockedStatus[id - 1];

    if (!canAccess && !isUnlocked) {
      setTerminalLogs(prev => [...prev, { timestamp: 'ACCESS', type: 'ERR', content: `NODE ${id} IS LOCKED. COMPLETE PREVIOUS RITUAL.` }]);
      return;
    }

    setSelectedCorpseId(id);
    if (isUnlocked) {
      setView('REPORT');
    } else {
      setView('CHALLENGE');
      setChallengeInput('');
      setTerminalLogs([
        { timestamp: 'SECURE', type: 'WARN', content: `TRYING TO ACCESS NODE: ${CORPSES_DATA[id].direction}` },
        { timestamp: 'ENCRYPT', type: 'ERR', content: `CIPHER TYPE: ${CORPSES_DATA[id].cryptoType}` }
      ]);
    }
  };

  const submitChallenge = () => {
    const currentCorpse = CORPSES_DATA[selectedCorpseId];
    setTerminalLogs(prev => [...prev, { timestamp: 'USER', type: 'EXEC', content: `> INJECT KEY: ${challengeInput}` }]);

    if (challengeInput.toUpperCase().trim() === currentCorpse.challengeData.solution.toUpperCase()) {
        setTerminalLogs(prev => [...prev, { timestamp: 'SYSTEM', type: 'SUCCESS', content: 'ACCESS GRANTED. DATA RECONSTRUCTED.' }]);
        setTimeout(() => {
            const newStatus = [...unlockedStatus];
            newStatus[selectedCorpseId] = true;
            setUnlockedStatus(newStatus);
            setView('REPORT');
        }, 800);
    } else {
        setTerminalLogs(prev => [...prev, { timestamp: 'SYSTEM', type: 'ERR', content: 'INCORRECT KEY. ACCESS DENIED.' }]);
    }
  };

  const checkAllUnlocked = () => {
    // ตรวจสอบว่าปลดล็อคครบทั้ง 4 ทิศ (Index 0, 1, 2, 3)
    const allCleared = unlockedStatus.every(s => s === true);
    
    if (allCleared) {
        onComplete(); // ไปด่านที่ 2
    } else {
        setView('MAP');
    }
  };

  const renderMap = () => (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[85vh] bg-black overflow-hidden px-4 py-10">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
             <div className="w-[65%] aspect-square border-2 border-red-900/10 rounded-full animate-spin-slow"></div>
             <svg className="absolute w-full h-full opacity-40">
                <line x1="50%" y1="15%" x2="85%" y2="50%" stroke={unlockedStatus[0] ? "#ff0000" : "#440000"} strokeWidth="2" strokeDasharray="8,4" />
                <line x1="85%" y1="50%" x2="50%" y2="85%" stroke={unlockedStatus[1] ? "#ff0000" : "#440000"} strokeWidth="2" strokeDasharray="8,4" />
                <line x1="50%" y1="85%" x2="15%" y2="50%" stroke={unlockedStatus[2] ? "#ff0000" : "#440000"} strokeWidth="2" strokeDasharray="8,4" />
                <line x1="15%" y1="50%" x2="50%" y2="15%" stroke={unlockedStatus[3] ? "#ff0000" : "#440000"} strokeWidth="2" strokeDasharray="8,4" />
             </svg>
        </div>

        <div className="mb-12 text-center relative z-10">
            <h1 className="text-white text-2xl md:text-3xl font-black italic uppercase tracking-tighter blood-shadow">ตรวจสอบสถานที่เกิดเหตุ</h1>
            <p className="text-primary font-black text-xl uppercase  mt-4 animate-pulse">พบศพผู้เสียชีวิตในลักษณะถูกจัดวาง</p>
        </div>

        <div className="relative w-full max-w-4xl aspect-square glass-panel rounded-full border-primary/10 bg-black/40 shadow-[0_0_100px_rgba(136,0,0,0.1)]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                <div className={`${unlockedStatus.every(s => s) ? 'text-red-500 animate-ping' : 'text-red-900/20'} transition-all duration-1000`}>
                    <MaterialIcon icon="pentagon" className="text-[300px]" />
                </div>
             </div>

             {CORPSES_DATA.map((corpse, index) => {
                const isUnlocked = unlockedStatus[index];
                const canAccess = index === 0 || unlockedStatus[index - 1];
                
                return (
                    <button 
                        key={corpse.id}
                        onClick={() => handleCorpseClick(corpse.id)}
                        style={{ top: corpse.pos.top, left: corpse.pos.left }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-700 z-10 ${canAccess || isUnlocked ? 'opacity-100' : 'opacity-20 grayscale cursor-not-allowed'}`}
                    >
                        <div className={`mb-2 text-[10px] font-bold px-3 py-0.5 rounded-full border transition-colors ${isUnlocked ? 'bg-primary border-white text-white' : 'bg-black border-red-900 text-red-900'}`}>
                            STAGE 0{index + 1}
                        </div>

                        <div className={`size-28 md:size-36 rounded-full flex items-center justify-center border-2 transition-all duration-500 mb-4 
                            ${isUnlocked 
                                ? 'bg-primary border-white text-white shadow-[0_0_50px_rgba(136,0,0,0.8)] scale-110' 
                                : canAccess 
                                    ? 'bg-black border-primary text-primary hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] animate-heartbeat' 
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-800'}`}>
                            <MaterialIcon icon={isUnlocked ? "verified" : corpse.iconName} className="text-5xl md:text-6xl" />
                        </div>
                        
                        <div className={`text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] px-6 py-1.5 rounded-full border shadow-2xl transition-all ${isUnlocked ? 'bg-primary/20 border-primary text-primary font-bold' : canAccess ? 'bg-black border-primary text-white group-hover:bg-primary group-hover:text-black' : 'border-zinc-900 text-zinc-800'}`}>
                            {corpse.direction}
                        </div>
                    </button>
                );
             })}
        </div>

        <div className="mt-12 flex items-center gap-6 font-mono text-[11px] tracking-[0.3em]">
            {unlockedStatus.map((s, i) => (
                <React.Fragment key={i}>
                    <span className={s ? "text-primary font-bold" : "text-zinc-800"}>
                        {CORPSES_DATA[i].element}
                    </span>
                    {i < 3 && <span className="text-zinc-900">/</span>}
                </React.Fragment>
            ))}
        </div>
    </div>
  );

  const renderChallenge = () => {
    const corpse = CORPSES_DATA[selectedCorpseId];
    return (
        <div className="flex flex-col h-full min-h-[85vh] p-10 bg-black animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between border-b border-red-900/50 pb-8 mb-10">
                <div className="flex items-center gap-6">
                    <MaterialIcon icon="terminal" className="text-5xl text-red-700" />
                    <div>
                        <h2 className="text-4xl font-bold text-gray-200 tracking-widest font-mono uppercase">CIPHER_NODE: {corpse.direction}</h2>
                        <p className="text-red-900 text-sm font-mono uppercase tracking-widest">ELEMENT: {corpse.element} | DIFFICULTY: {corpse.difficulty}</p>
                    </div>
                </div>
                <button onClick={() => setView('MAP')} className="text-gray-500 hover:text-white font-mono text-xs border border-gray-800 px-6 py-3 hover:border-gray-500 transition-all uppercase tracking-tighter">
                    [ TERMINATE_LINK ]
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2 flex flex-col gap-10">
                    <div className="bg-zinc-900/30 border border-red-900/30 p-10 rounded-sm relative overflow-hidden glass-panel">
                         <div className="absolute top-0 left-0 w-2 h-full bg-red-700"></div>
                         <h3 className="text-red-600 font-mono text-sm mb-6 flex items-center gap-2 uppercase tracking-widest">
                             <MaterialIcon icon="enhanced_encryption" /> ENCRYPTED_DATA
                         </h3>
                         <div className="font-mono text-gray-400 text-3xl leading-relaxed break-all bg-black/60 p-8 border border-gray-800 shadow-inner italic">
                             {corpse.id === 2 ? corpse.challengeData.ciphertextDisplay : corpse.challengeData.ciphertext}
                         </div>
                    </div>

                    <div className="bg-zinc-900/10 border border-red-900/20 p-10 rounded-sm">
                         <h3 className="text-gray-500 font-mono text-xs mb-4 uppercase tracking-widest italic">INTEL_HINT:</h3>
                         <p className="text-gray-200 font-mono text-2xl italic">"{corpse.challengeData.hint}"</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <div className="flex-1 bg-black border border-gray-800 shadow-2xl overflow-hidden rounded-xl min-h-[300px]">
                        <Terminal title={`REMOTE_ACCESS_NODE_0${corpse.id}`} lines={terminalLogs} />
                    </div>
                    
                    <div className="flex gap-0 shadow-2xl">
                        <div className="bg-red-900 text-black px-8 py-5 font-bold font-mono flex items-center text-2xl">{'>'}</div>
                        <input 
                            type="text"
                            value={challengeInput}
                            onChange={(e) => setChallengeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submitChallenge()}
                            className="flex-1 bg-zinc-950 border-none text-red-500 font-mono px-8 py-5 text-3xl focus:outline-none placeholder-red-950/50 uppercase italic font-black"
                            placeholder="DECRYPT_KEY..."
                            autoFocus
                        />
                        <button 
                            onClick={submitChallenge}
                            className="bg-red-800 hover:bg-red-700 text-black font-black font-mono px-12 py-5 text-2xl transition-all"
                        >
                            DECODE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderReport = () => {
    const corpse = CORPSES_DATA[selectedCorpseId];
    return (
        <div className="flex flex-col h-screen p-8 bg-black text-gray-300 font-mono overflow-hidden">
             <div className="flex items-center justify-between mb-8 border-b-4 border-red-900 pb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-red-900 p-2 text-black">
                        <MaterialIcon icon="clinical_notes" className="text-4xl" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Autopsy Report</h2>
                        <p className="text-red-600 text-sm tracking-widest uppercase">CORPSE_INDEX: 0{corpse.id + 1} | ELEMENT: {corpse.element}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">System Status</p>
                        <p className="text-red-500 font-bold animate-pulse uppercase tracking-widest">Decrypted</p>
                     </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-12 overflow-hidden">
                <div className="w-full md:w-2/3 bg-zinc-900/10 border border-gray-800 p-8 overflow-y-auto relative">
                    <h3 className="text-xl text-red-500 font-bold mb-6 border-b border-gray-800 pb-2 flex items-center gap-2 uppercase tracking-widest">
                        <MaterialIcon icon="visibility" /> Observation Logs
                    </h3>
                    <ul className="space-y-6">
                        {corpse.autopsyFindings.map((finding, idx) => (
                            <li key={idx} className="flex gap-4 items-start">
                                <span className="text-red-900 mt-1">▶</span>
                                <span className="text-lg leading-relaxed text-gray-200">{finding}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-12 p-6 bg-red-950/20 border-l-4 border-red-600">
                        <p className="text-red-400 text-xs font-bold uppercase mb-2 tracking-widest">Final Determination:</p>
                        <p className="text-3xl text-white font-black tracking-wide uppercase">{corpse.challengeData.solution}</p>
                    </div>
                </div>

                <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <div className="bg-zinc-950 border border-gray-700 p-6 flex-1 flex flex-col relative shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
                        <div className="absolute -top-3 left-4 bg-black px-2 text-red-800 text-[10px] border border-red-900 uppercase font-black tracking-widest">Ritual_Evidence</div>
                        <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                            <MaterialIcon icon="history_edu" /> Ritual Inscription
                        </h3>
                        <div className="flex-1 bg-zinc-100 text-black p-6 font-serif text-xl leading-relaxed shadow-2xl rotate-1 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/30 rounded-full blur-3xl pointer-events-none"></div>
                            <p className="whitespace-pre-wrap font-medium text-center italic">
                                {corpse.poem}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={checkAllUnlocked}
                        className="bg-red-800 hover:bg-red-700 text-black font-black py-5 px-6 border-b-4 border-red-950 active:translate-y-1 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(136,0,0,0.3)]"
                    >
                        {unlockedStatus.every(s => s) ? "INITIATE NEXT STAGE" : "CLOSE & RETURN TO MAP"}
                        <MaterialIcon icon={unlockedStatus.every(s => s) ? "login" : "map"} />
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-red-900 selection:text-white overflow-hidden">
        <StageHeader stageName="STAGE 1: THE RITUAL AUTOPSY" stageNumber={1} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />
        {view === 'MAP' && renderMap()}
        {view === 'CHALLENGE' && renderChallenge()}
        {view === 'REPORT' && renderReport()}
    </div>
  );
};

export default CryptoView;