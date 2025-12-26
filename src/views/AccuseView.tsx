
import React, { useState } from 'react';

interface AccuseViewProps {
  onCorrect: () => void;
  onWrong: () => void;
}

const suspects = [
  { id: 1, name: "กัมปนาท", role: "พ่อของตู้", desc: "มีแรงจูงใจเรื่องความแค้น แต่ทักษะทางเทคนิคไม่เพียงพอที่จะเข้าถึงระบบแล็บ" },
  { id: 2, name: "ศ. ดร. ศักดิ์", role: "นักประวัติศาสตร์", desc: "หมกมุ่นกับพิธีกรรมอย่างหนัก แต่ไม่มีสิทธิ์เข้าถึงอาคารวิจัยส่วนตัว" },
  { id: 3, name: "รองฯ ธวัช", role: "ผู้บริหาร", desc: "พยายามปิดข่าวเพื่อรักษาชื่อเสียง แต่พฤติกรรมไม่มีความเชื่อมโยงกับทิศทั้งสี่" },
  { id: 4, name: "ประเสริฐ", role: "เจ้าหน้าที่สนาม", desc: "รู้จักพื้นที่เป็นอย่างดี แต่ไม่มีความรู้เรื่องการเข้ารหัสข้อมูลที่ซับซ้อน" },
  { id: 5, name: "ดร. มานัส", role: "อาจารย์ที่ปรึกษา", desc: "มีสิทธิ์เข้าถึงทุกทิศทาง มีทักษะไซเบอร์ขั้นสูง ลายเซ็นดิจิทัลตรงกับหลักฐานที่พบ" }
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black text-center animate-in fade-in duration-1000 font-body">
        <div className="absolute inset-0 bg-danger/10 opacity-20 pointer-events-none animate-pulse"></div>
        <span className="material-symbols-outlined text-[120px] text-danger mb-8">skull</span>
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4 font-display">GAME OVER</h1>
        <p className="text-danger font-mono text-xl mb-12 max-w-xl">
          คุณล้มเหลวในการระบุตัวฆาตกร พิธีกรรมเสร็จสิ้นโดยสมบูรณ์ และผู้อยู่เบื้องหลังได้หายลับไปในโลกดิจิทัลตลอดกาล
        </p>
        <button 
          onClick={onWrong}
          className="px-12 py-4 border-2 border-danger text-danger font-black hover:bg-danger hover:text-white transition-all uppercase tracking-[0.3em] rounded font-display"
        >
          กลับไปที่แผนที่
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background-dark font-display pb-32">
      <div className="h-24 border-b border-border-dark flex items-center justify-between px-10 bg-surface-dark/50 shrink-0 text-left font-body">
        <div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tight italic font-display">ระยะการกล่าวหา</h1>
          <p className="text-primary font-mono text-[10px] tracking-widest uppercase opacity-60">ระบุตัวผู้บงการที่แท้จริง</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">โอกาสที่เหลือ</p>
          <p className={`text-2xl font-black ${attempts === 1 ? 'text-accent-yellow' : 'text-primary'}`}>
            {2 - attempts} / 2
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 pt-20 font-body">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic leading-none font-display">ใครคือฆาตกร?</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto italic font-medium">
              "รอยเท้าดิจิทัลทุกจุดล้วนนำไปสู่คนเพียงคนเดียว คนที่ถือกุญแจทุกดอกและควบคุมพื้นที่พิเศษทั้งหมดได้"
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
              className="px-20 py-5 bg-primary disabled:bg-gray-800 disabled:text-gray-500 hover:bg-white text-black font-black text-xl rounded-xl uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 italic font-display"
            >
              ออกหมายจับ
            </button>
          </div>
        </div>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300 font-body">
          <div className="max-w-md w-full glass-panel border-primary/30 rounded-3xl p-12 text-center">
            <h3 className="text-white text-2xl font-black uppercase mb-4 italic font-display">ยืนยันการจับกุม</h3>
            <p className="text-gray-400 mb-10 text-sm leading-relaxed font-medium italic">
              คุณแน่ใจหรือไม่ว่า <span className="text-primary font-bold">{suspects.find(s => s.id === selectedId)?.name}</span> คือผู้บงการ? <br/>
              ความผิดพลาดจะทำให้คนร้ายไหวตัวทัน
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAccuse}
                className="w-full bg-primary text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all italic font-display"
              >
                ดำเนินการจับกุม
              </button>
              <button 
                onClick={() => setIsConfirming(false)}
                className="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-white/5 transition-all italic font-display"
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
