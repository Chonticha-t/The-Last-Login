import React, { useState } from 'react';

// --- Assets Mapping ---
const IMG_KAMPAN = "/คำปัน.webp";
const IMG_SORN = "/ศร.webp";
const IMG_THAWAT = "/รอง.webp";
const IMG_MANAS = "/มนัส.webp";
const IMG_PRASERT = "/ยาม.webp";

interface SuspectData {
  id: number;
  name: string;
  role: string;
  age: string;
  image: string;
  publicProfile: string;
  suspicion: string;
}

const suspects: SuspectData[] = [
  {
    id: 1,
    name: "นายคำปน",
    role: "อดีตหมอพิธีพื้นบ้าน",
    age: "60+",
    image: IMG_KAMPAN,
    publicProfile: "ชาวบ้านธรรมดาที่เคยประกอบพิธีล้านนา รู้จัก 'บทสวดแห่งสี่ทิศ' เป็นอย่างดี เคยกล่าวตักเตือนว่าดินแถวนั้นยังไม่สะอาด",
    suspicion: "แรงแค้นในฐานะ 'พ่อ' ของตุ๊ และความรู้ด้านพิธีกรรมที่อาจใช้ในการสาปแช่งผู้บุกรุก",
  },
  {
    id: 2,
    name: "อาจารย์ศร",
    role: "อาจารย์อาวุโสสายภาคสนาม",
    age: "55",
    image: IMG_SORN,
    publicProfile: "เคร่งเครียด เชื่อเรื่องบาปกรรม และมักพานักศึกษาลงพื้นที่เพื่อทำกิจกรรม",
    suspicion: "ปรากฏตัวในพื้นที่ศพทั้งสามเสมอ ครอบครองคัมภีร์บทสวด และพร่ำบอกว่าต้องทำพิธีสะกดอาถรรพ์",
  },
  {
    id: 3,
    name: "รองอธิการธวัช",
    role: "รองอธิการบดีฝ่ายกายภาพ",
    age: "58",
    image: IMG_THAWAT,
    publicProfile: "ผู้บริหารระดับสูง ดูแลโครงการภาคสนามทั้งหมด ห่วงชื่อเสียงมหาวิทยาลัยเป็นที่สุด",
    suspicion: "สั่งปิดข่าวทันทีที่เกิดเรื่อง เอกสารรายงานภาคสนามหายไป และรู้ตารางเวลาของนักศึกษาที่ตายล่วงหน้า",
  },
  {
    id: 4,
    name: "ดร.มนัส",
    role: "นักวิชาการอิสระ",
    age: "52",
    image: IMG_MANAS,
    publicProfile: "สุขุม มีเหตุผล พูดเรื่องวิทยาศาสตร์เสมอ ศึกษาพิธีกรรมในเชิงวิชาการเพื่อการวิจัย",
    suspicion: "เป็นคนแรกที่เสนอให้โยงคดีเข้ากับความเชื่อท้องถิ่น ดูเหมือนไม่มีพิษภัย แต่มีความรู้เรื่องพิธีกรรมลึกซึ้งจนน่ากลัว",
  },
  {
    id: 5,
    name: "นายประเสริฐ",
    role: "เจ้าหน้าที่ภาคสนาม",
    age: "47",
    image: IMG_PRASERT,
    publicProfile: "เงียบ สุภาพ ไม่โดดเด่น ดูแลพื้นที่ที่เกิดเหตุมาอย่างยาวนาน",
    suspicion: "อยู่ในคืนที่ 'ตุ๊' เสียชีวิตเมื่อ 5 วันก่อน และเป็นผู้พบศพแรกในคดีปัจจุบัน คำให้การดูวกวนเหมือนปิดบังอะไรบางอย่าง",
  }
];

interface Stage2BriefingViewProps {
  onProceed: () => void;
}

const Stage2BriefingView: React.FC<Stage2BriefingViewProps> = ({ onProceed }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const playSwitchSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2412/2412.wav'); 
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const nextSuspect = () => {
    playSwitchSound();
    setCurrentIdx((prev) => (prev + 1) % suspects.length);
  };

  const prevSuspect = () => {
    playSwitchSound();
    setCurrentIdx((prev) => (prev - 1 + suspects.length) % suspects.length);
  };

  const currentSuspect = suspects[currentIdx];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1a1a1a] font-sans relative overflow-hidden selection:bg-red-900 selection:text-white">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl p-4 md:p-8 flex flex-col md:flex-row gap-8 items-stretch h-[85vh]">
        
        {/* Left: Mugshot & Identity */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Photo Card */}
            <div className="relative bg-[#dcdcdc] p-4 pb-12 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] rotate-[-1deg] border border-neutral-600 group transition-transform hover:rotate-0">
                <div className="absolute -top-2 -left-2 z-20">
                    <span className="bg-neutral-800 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest border border-neutral-600 shadow-sm">
                        Subject No. 0{currentSuspect.id}
                    </span>
                </div>
                
                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4] border border-neutral-400 bg-neutral-200">
                    <img 
                        src={currentSuspect.image} 
                        alt={currentSuspect.name}
                        className="w-full h-full object-cover sepia-[.5] contrast-125 grayscale-[0.3]"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
                </div>

                {/* Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-100/30 backdrop-blur-sm border-l border-r border-white/20 rotate-1 shadow-sm opacity-80"></div>

                <div className="mt-4 text-center">
                   <h2 className="text-3xl font-black text-neutral-800 uppercase tracking-tighter leading-none">{currentSuspect.name}</h2>
                   <p className="text-neutral-500 font-mono text-xs mt-1 uppercase tracking-widest">{currentSuspect.role}</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/50 border border-white/10 p-3 rounded text-center">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider">อายุ</span>
                    <span className="text-white font-mono text-lg">{currentSuspect.age}</span>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded text-center">
                    <span className="block text-[10px] text-red-400 uppercase tracking-wider">สถานะ</span>
                    <span className="text-red-500 font-bold text-sm uppercase animate-pulse">ผู้ต้องสงสัย</span>
                </div>
            </div>
        </div>

        {/* Right: The File */}
        <div className="w-full md:w-2/3 flex flex-col relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex-1 bg-[#f4f1ea] text-neutral-800 rounded-sm shadow-2xl relative overflow-hidden flex flex-col border-l-8 border-neutral-300">
                
                {/* File Header */}
                <div className="bg-[#e5e0d6] px-8 py-4 border-b border-neutral-300 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <span className="text-neutral-400">📁</span>
                         <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500">Case File: The Silent Earth</span>
                    </div>
                    <div className="w-24 h-2 bg-neutral-300 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 h-full overflow-y-auto font-serif relative">
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-red-900 opacity-[0.03] -rotate-12 pointer-events-none select-none whitespace-nowrap">
                        CLASSIFIED
                    </div>

                    <div className="space-y-10 relative z-10">
                        {/* 1. Public Face */}
                        <div className="group">
                            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-4 h-4 bg-neutral-800 rounded-full flex items-center justify-center text-[8px] text-white">1</span>
                                ประวัติและภาพลักษณ์
                            </h3>
                            <p className="text-xl text-neutral-800 leading-relaxed border-l-2 border-neutral-300 pl-4 font-medium">
                                "{currentSuspect.publicProfile}"
                            </p>
                        </div>

                        {/* 2. Suspicion (The Hook) */}
                        <div className="group">
                            <h3 className="text-xs font-black text-red-800/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="w-4 h-4 bg-red-800 rounded-full flex items-center justify-center text-[8px] text-white">2</span>
                                ข้อสังเกต / จุดพิรุธ
                            </h3>
                            <div className="bg-red-50 p-6 border border-red-100 rounded-lg relative overflow-hidden shadow-sm">
                                {/* Decor line */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                                <p className="text-lg font-bold text-neutral-800">
                                    {currentSuspect.suspicion}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="bg-[#e5e0d6] p-4 border-t border-neutral-300 flex justify-between items-center z-20">
                    <div className="flex gap-2">
                        <button onClick={prevSuspect} className="hover:bg-white/50 p-2 rounded-full transition-colors">
                            <span>◀</span>
                        </button>
                        <span className="self-center font-mono text-xs text-neutral-400 mx-2">
                            {currentIdx + 1} / {suspects.length}
                        </span>
                        <button onClick={nextSuspect} className="hover:bg-white/50 p-2 rounded-full transition-colors">
                            <span>▶</span>
                        </button>
                    </div>

                    <button 
                        onClick={onProceed}
                        className="bg-neutral-800 hover:bg-black text-white px-6 py-3 rounded shadow-lg transition-all font-bold uppercase tracking-wider text-sm flex items-center gap-2 group hover:scale-105"
                    >
                        <span>🔍</span>
                        เข้าสู่ด่านที่ 2: Evidence Collection
                    </button>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Stage2BriefingView;
