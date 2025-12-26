
import React from 'react';
import { GameStage, type CaseStatus } from '../types';

interface MissionMapViewProps {
  status: CaseStatus;
  onEnterStage: (stage: GameStage) => void;
}

const MissionMapView: React.FC<MissionMapViewProps> = ({ status, onEnterStage }) => {
  let activeStage: GameStage;
  if (!status.flags.crypto) activeStage = GameStage.CRYPTO;
  else if (!status.flags.auth) activeStage = GameStage.AUTH;
  else activeStage = GameStage.AUTHZ;

  const stages = [
    { 
      id: GameStage.CRYPTO, 
      label: 'ระยะที่ 01: ถอดรหัส', 
      phase: 'วิเคราะห์ข้อมูลการชันสูตร', 
      icon: 'radar', 
      completed: !!status.flags.crypto 
    },
    { 
      id: GameStage.AUTH, 
      label: 'ระยะที่ 02: เจาะระบบ', 
      phase: 'ตามรอยคนร้ายตัวจริง', 
      icon: 'privacy_tip', 
      completed: !!status.flags.auth 
    },
    { 
      id: GameStage.AUTHZ, 
      label: 'ระยะที่ 03: ความยุติธรรม', 
      phase: 'เปิดโปงผู้บงการ', 
      icon: 'gavel', 
      completed: !!status.flags.authz 
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background-dark p-6 sm:p-10 lg:p-20 relative font-display pb-32">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b-2 border-border-dark pb-12 gap-6 text-left">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase italic leading-none drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
            เส้นทางการสืบสวน
          </h1>
          <p className="text-primary text-sm font-bold tracking-widest uppercase mt-6 flex items-center gap-3 font-body">
             <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,0,0,1)]"></span>
             ความคืบหน้าคดีฆาตกรรมพิธีกรรมสี่ทิศ
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 min-w-[250px] w-full md:w-auto font-mono">
          <span className="text-xs text-primary/80 uppercase font-black tracking-widest">ความสำเร็จ: {status.progress}%</span>
          <div className="w-full h-4 bg-border-dark rounded-full flex gap-1 overflow-hidden p-1 border border-primary/20">
            <div className={`h-full bg-primary transition-all duration-1000 ${status.progress >= 33 ? 'flex-[1]' : 'w-0 opacity-0'}`}></div>
            <div className={`h-full bg-primary transition-all duration-1000 ${status.progress >= 66 ? 'flex-[1]' : 'w-0 opacity-20'}`}></div>
            <div className={`h-full bg-primary transition-all duration-1000 ${status.progress >= 100 ? 'flex-[1]' : 'w-0 opacity-20'}`}></div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-6xl flex items-center justify-center relative py-20">
        <div className="absolute top-1/2 left-20 right-20 h-px bg-border-dark -translate-y-1/2 hidden md:block"></div>
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-16 md:gap-4 relative z-10">
          {stages.map((stage) => {
            const isActive = stage.id === activeStage;
            return (
              <div key={stage.id} className="flex flex-col items-center gap-10 group">
                <div className={`size-48 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-700 border-2 ${stage.completed ? 'bg-primary/5 border-primary shadow-[0_0_50px_rgba(255,0,0,0.4)]' : isActive ? 'bg-black border-white shadow-[0_0_60px_rgba(255,0,0,0.1)]' : 'bg-surface-dark/50 border-border-dark opacity-40'}`}>
                  <span className={`material-symbols-outlined text-8xl ${stage.completed ? 'text-primary' : isActive ? 'text-white' : 'text-gray-800'}`}>
                    {stage.completed ? 'task_alt' : stage.icon}
                  </span>
                </div>
                <div className="text-center space-y-5">
                  <h3 className={`text-2xl font-black tracking-tight uppercase italic ${stage.completed ? 'text-primary' : isActive ? 'text-white' : 'text-gray-800'}`}>
                    {stage.label}
                  </h3>
                  {isActive ? (
                    <button onClick={() => onEnterStage(stage.id)} className="bg-primary hover:bg-white text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-primary/30 transition-all transform hover:scale-110 active:scale-95">
                      เริ่มภารกิจ
                      <span className="material-symbols-outlined text-lg font-black">arrow_forward_ios</span>
                    </button>
                  ) : (
                    <div className={`text-[11px] font-black uppercase tracking-widest px-6 py-2 rounded-xl border ${stage.completed ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-black/40 border-border-dark text-gray-800'}`}>
                      {stage.completed ? 'เสร็จสิ้น' : 'ล็อกอยู่'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionMapView;
