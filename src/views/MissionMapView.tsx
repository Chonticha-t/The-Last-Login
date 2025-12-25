
import React from 'react';
import { GameStage, type CaseStatus } from '../types';

interface MissionMapViewProps {
  status: CaseStatus;
  onEnterStage: (stage: GameStage) => void;
}

const MissionMapView: React.FC<MissionMapViewProps> = ({ status, onEnterStage }) => {
  // Determine which stage is currently "active" (the first one not completed)
  let activeStage: GameStage;
  if (!status.flags.crypto) activeStage = GameStage.CRYPTO;
  else if (!status.flags.auth) activeStage = GameStage.AUTH;
  else activeStage = GameStage.AUTHZ;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const stages = [
    { 
      id: GameStage.CRYPTO, 
      label: 'CRYPTO', 
      phase: 'PHASE 1: DECRYPTION', 
      icon: 'verified', 
      completed: !!status.flags.crypto 
    },
    { 
      id: GameStage.AUTH, 
      label: 'AUTH', 
      phase: 'PHASE 2: AUTHENTICATION', 
      icon: 'fingerprint', 
      completed: !!status.flags.auth 
    },
    { 
      id: GameStage.AUTHZ, 
      label: 'AUTHZ', 
      phase: 'PHASE 3: AUTHORIZATION', 
      icon: 'lock', 
      completed: !!status.flags.authz 
    },
  ];

  return (
    <div className="min-h-full w-full flex flex-col items-center bg-background-dark p-6 sm:p-10 lg:p-16">
      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex justify-between items-start mb-20 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <span className="bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Difficulty: Medium</span>
            <span className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              Session Active
            </span>
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 rounded text-[10px] font-mono text-gray-400">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              ELAPSED: <span className="text-white font-bold">{formatTime(status.timer)}</span>
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
              Mission Control
            </h1>
            <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-80">Select Target Module</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[200px]">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Overall Progress: {status.progress}%</span>
          <div className="w-full h-2 bg-gray-900 rounded-full flex gap-1 overflow-hidden p-0.5 border border-white/5">
            <div className={`h-full bg-primary transition-all duration-1000 ${status.progress >= 33 ? 'flex-[1]' : 'w-0'}`}></div>
            <div className={`h-full bg-primary transition-all duration-1000 ${status.progress >= 66 ? 'flex-[1]' : 'w-0 opacity-20'}`}></div>
            <div className={`h-full bg-primary transition-all duration-1000 ${status.progress >= 100 ? 'flex-[1]' : 'w-0 opacity-20'}`}></div>
          </div>
        </div>
      </div>

      {/* Main Map Visualization */}
      <div className="flex-1 w-full max-w-6xl flex items-center justify-center relative py-20">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-white/5 -translate-y-1/2 hidden md:block"></div>

        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-12 md:gap-4 relative z-10">
          {stages.map((stage, index) => {
            const isActive = stage.id === activeStage;
            
            return (
              <div key={stage.id} className="flex flex-col items-center gap-8 group">
                <div className="relative">
                  {/* Stage Card */}
                  <div className={`
                    size-40 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                    ${stage.completed ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(19,236,91,0.2)]' : 
                      isActive ? 'bg-black border-white shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 
                      'bg-white/5 border-white/5 opacity-40'}
                  `}>
                    <span className={`material-symbols-outlined text-6xl ${stage.completed ? 'text-primary' : isActive ? 'text-white' : 'text-gray-600'}`}>
                      {stage.completed ? 'check_circle' : stage.icon}
                    </span>

                    {/* Notification Dot for Active Stage */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2 size-6 bg-danger rounded-full border-4 border-background-dark animate-pulse shadow-lg"></div>
                    )}
                  </div>

                  {/* Connecting Arrow */}
                  {index < stages.length - 1 && (
                    <div className={`absolute top-1/2 -right-20 -translate-y-1/2 hidden md:block transition-colors ${stage.completed ? 'text-primary' : 'text-white/10'}`}>
                      <span className="material-symbols-outlined text-4xl">chevron_right</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h3 className={`text-2xl font-black tracking-widest uppercase ${stage.completed ? 'text-primary' : isActive ? 'text-white' : 'text-gray-700'}`}>
                    {stage.label}
                  </h3>
                  
                  {isActive ? (
                    <button 
                      onClick={() => onEnterStage(stage.id)}
                      className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      Enter Stage
                      <span className="material-symbols-outlined text-sm font-black">login</span>
                    </button>
                  ) : (
                    <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border ${stage.completed ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-black/40 border-white/5 text-gray-700'}`}>
                      {stage.completed ? '100% Complete' : 'Locked'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Labels */}
      <div className="w-full max-w-6xl mt-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-8">
        {stages.map(stage => (
          <div key={stage.id} className="text-center">
            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${stage.id === activeStage ? 'text-primary' : 'text-gray-700'}`}>
              {stage.phase}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionMapView;
