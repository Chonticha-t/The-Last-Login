
import React, { useState } from 'react';

interface AccuseViewProps {
  onCorrect: () => void;
  onWrong: () => void;
}

const suspects = [
  { id: 1, name: "นายคำปัน", role: "พ่อของตุ๊ (ผู้สืบทอดพิธีดั้งเดิม)", desc: "มีแรงจูงใจในการแก้แค้น แต่ทักษะทางเทคโนโลยีน้อยเกินไป" },
  { id: 2, name: "อาจารย์ศักดิ์", role: "นักประวัติศาสตร์ (ผู้เชี่ยวชาญไสยศาสตร์)", desc: "คลั่งไคล้พิธีกรรม แต่ไม่มีสิทธิ์เข้าถึงห้องแล็บส่วนตัว" },
  { id: 3, name: "รองอธิการธวัช", role: "ผู้บริหาร (ผู้กุมความลับองค์กร)", desc: "พยายามปิดข่าว แต่พฤติกรรมในคืนเกิดเหตุไม่มีความเชื่อมโยงทางทิศทาง" },
  { id: 4, name: "นายประเสริฐ", role: "เจ้าหน้าที่ภาคสนาม (ผู้ติดตั้งระบบ)", desc: "รู้พิกัดดี แต่ไม่มีความรู้เรื่องการคำนวณ Shared Secret ขั้นสูง" },
  { id: 5, name: "ดร.มนัส", role: "นักวิชาการ (ผู้ดูแลโครงการ PROJECT-X)", desc: "มีสิทธิ์เขียนข้อมูลในทุกทิศทาง ทักษะไซเบอร์ระดับสูง และรหัสประจำตัวตรงกับลายเซ็นดิจิทัล" }
];

const AccuseView: React.FC<AccuseViewProps> = ({ onCorrect, onWrong }) => {
  const [attempts, setAttempts] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleAccuse = () => {
    if (selectedId === null) return;

    if (selectedId === 5) {
      onCorrect();
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setIsConfirming(false);
      setSelectedId(null);
      
      if (nextAttempts >= 2) {
        setIsGameOver(true);
      }
    }
  };

  if (isGameOver) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black text-center animate-in fade-in duration-1000 font-display">
        <div className="absolute inset-0 bg-danger/10 opacity-20 pointer-events-none animate-pulse"></div>
        <span className="material-symbols-outlined text-[120px] text-danger mb-8">skull</span>
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">GAME OVER</h1>
        <p className="text-danger font-mono text-xl mb-12 max-w-xl">
          คุณล้มเหลวในการระบุตัวคนร้าย ฆาตกรตัวจริงได้หลบหนีไป และพิธีกรรมทิศสุดท้ายได้สำเร็จลงแล้ว...
        </p>
        <button 
          onClick={onWrong}
          className="px-12 py-4 border-2 border-danger text-danger font-black hover:bg-danger hover:text-white transition-all uppercase tracking-[0.3em] rounded"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background-dark font-display pb-32">
      <div className="h-24 border-b border-border-dark flex items-center justify-between px-10 bg-surface-dark/50 shrink-0">
        <div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tight italic">Accusation Phase</h1>
          <p className="text-primary font-mono text-[10px] tracking-widest uppercase opacity-60">ระบุตัวคนร้ายที่แท้จริง</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">Attempts Remaining</p>
          <p className={`text-2xl font-black ${attempts === 1 ? 'text-accent-yellow' : 'text-primary'}`}>
            {2 - attempts} / 2
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 pt-20">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic leading-none">ใครคือฆาตกรตัวจริง?</h2>
            <p className="text-gray-400 text-sm font-body max-w-2xl mx-auto italic font-medium">
              "ร่องรอยดิจิทัลทั้งหมดชี้ไปที่คนเพียงคนเดียว ผู้ที่ครอบครองกุญแจทั้ง 4 ทิศ และมีสิทธิ์เหนือระบบความปลอดภัยทั้งหมด"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {suspects.map(s => (
              <div 
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`glass-panel rounded-xl p-6 border-2 transition-all cursor-pointer group flex flex-col items-center text-center ${selectedId === s.id ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-white/5 hover:border-white/20'}`}
              >
                <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary transition-colors overflow-hidden">
                  <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-primary">person</span>
                </div>
                <h3 className="text-white font-black uppercase text-sm mb-2 italic">{s.name}</h3>
                <p className="text-primary font-bold text-[9px] uppercase tracking-widest mb-4">{s.role}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-3 italic font-medium">"{s.desc}"</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button 
              disabled={selectedId === null}
              onClick={() => setIsConfirming(true)}
              className="px-20 py-5 bg-primary disabled:bg-gray-800 disabled:text-gray-500 hover:bg-white text-black font-black text-xl rounded-xl uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 italic"
            >
              ออกหมายจับ
            </button>
          </div>
        </div>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="max-w-md w-full glass-panel border-primary/30 rounded-3xl p-12 text-center">
            <h3 className="text-white text-2xl font-black uppercase mb-4 italic">ยืนยันการระบุตัวตน</h3>
            <p className="text-gray-400 mb-10 text-sm leading-relaxed font-medium italic">
              คุณมั่นใจหรือไม่ว่า <span className="text-primary font-bold">{suspects.find(s => s.id === selectedId)?.name}</span> คือฆาตกร? <br/>
              หากผิดพลาด โอกาสของคุณจะลดลง
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAccuse}
                className="w-full bg-primary text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all italic"
              >
                ยืนยันและเข้าจับกุม
              </button>
              <button 
                onClick={() => setIsConfirming(false)}
                className="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-white/5 transition-all italic"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccuseView;
