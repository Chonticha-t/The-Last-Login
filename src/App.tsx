
import React, { useState, useEffect } from 'react';
import { GameStage, type CaseStatus } from './types';
import SplashView from './views/SplashView';
import BriefingView from './views/BriefingView';
import MissionMapView from './views/MissionMapView';
import CryptoView from './views/CryptoView';
import AuthView from './views/AuthView';
import AuthzView from './views/AuthzView';
import AccuseView from './views/AccuseView';
import CompleteView from './views/CompleteView';
import HintModal from './components/HintModal';
import { getInvestigatorHint } from './services/genimiService';


const App: React.FC = () => {
  const [status, setStatus] = useState<CaseStatus>({
    stage: GameStage.AUTHZ,
    timer: 0,
    hintsUsed: 0,
    progress: 0,
    flags: {
      crypto: null,
      auth: null,
      authz: null
    }
  });

  const [hintState, setHintState] = useState<{
    isOpen: boolean;
    loading: boolean;
    content: string | null;
  }>({
    isOpen: false,
    loading: false,
    content: null
  });

  // Global game timer
  useEffect(() => {
    let interval: any;
    if (status.stage !== GameStage.SPLASH && status.stage !== GameStage.COMPLETE) {
      interval = setInterval(() => {
        setStatus(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status.stage]);

  // Handle Browser History
  useEffect(() => {
    // Initialize history state if empty
    if (!window.history.state) {
      window.history.replaceState({ stage: GameStage.SPLASH }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      // Only handle stage changes at the App level
      if (state && state.stage && state.stage !== status.stage) {
        setStatus(prev => ({ ...prev, stage: state.stage }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setStage = (stage: GameStage) => {
    // Only push if different from current stage to avoid dupes
    if (status.stage !== stage) {
      window.history.pushState({ stage }, '');
      setStatus(prev => ({ ...prev, stage }));
      window.scrollTo(0, 0);
    }
  };

  const handleCompleteStage = (
    flagKey: 'crypto' | 'auth' | 'authz',
    nextMapStage: GameStage
  ) => {
    setStatus(prev => ({
      ...prev,
      flags: {
        ...prev.flags,
        [flagKey]: 'FLAG{COMPLETED}',
      },
      stage: nextMapStage,
      progress: prev.progress + 33,
    }));
  };

  const handleRequestHint = async () => {
    if (status.hintsUsed >= 3) {
      setHintState({ isOpen: true, loading: false, content: "คุณใช้สิทธิ์ในการขอรับข้อมูลข่าวกรองครบแล้ว จงใช้สติปัญญาของคุณต่อจากนี้เถิด" });
      return;
    }

    setHintState({ isOpen: true, loading: true, content: null });
    
    let context = "";
    switch(status.stage) {
      case GameStage.CRYPTO: context = "กำลังวิเคราะห์ค่าพารามิเตอร์การถอดรหัส AES และ Diffie-Hellman ที่เชื่อมโยงกับทิศทั้งสี่หลัก"; break;
      case GameStage.AUTH: context = "กำลังพยายามเจาะระบบการยืนยันตัวตนหลายชั้นของผู้ต้องสงสัยในมหาวิทยาลัย"; break;
      case GameStage.AUTHZ: context = "กำลังตรวจสอบการยกระดับสิทธิ์และการละเมิดนโยบายในเซิร์ฟเวอร์ห้องแล็บลับ"; break;
      default: context = "กำลังวางแผนบนแผนที่ปฏิบัติการ";
    }

    const result = await getInvestigatorHint(status.stage, context);
    
    setHintState({ isOpen: true, loading: false, content: result });
    setStatus(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const renderCurrentStage = () => {
    switch (status.stage) {
      case GameStage.SPLASH:
        return <SplashView onStart={() => setStage(GameStage.BRIEFING)} />;
      case GameStage.BRIEFING:
        return <BriefingView onInvestigate={() => setStage(GameStage.MAP)} />;
      case GameStage.MAP:
        return <MissionMapView status={status} onEnterStage={setStage} />;
      case GameStage.CRYPTO:
        return <CryptoView status={status} onComplete={() => handleCompleteStage('crypto', GameStage.MAP)} onRequestHint={handleRequestHint} />;
      case GameStage.AUTH:
        return <AuthView status={status} onComplete={() => handleCompleteStage('auth', GameStage.MAP)} onRequestHint={handleRequestHint} />;
      case GameStage.AUTHZ:
        return <AuthzView status={status} onComplete={() => setStage(GameStage.ACCUSE)} onRequestHint={handleRequestHint} />;
      case GameStage.ACCUSE:
        return <AccuseView onCorrect={() => setStage(GameStage.COMPLETE)} onWrong={() => setStage(GameStage.MAP)} />;
      case GameStage.COMPLETE:
        return <CompleteView status={status} onReset={() => window.location.reload()} />;
      default:
        return <SplashView onStart={() => setStage(GameStage.BRIEFING)} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark overflow-x-hidden overflow-y-auto cyber-grid font-body">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <main className="flex-1 relative z-10 flex flex-col">
        {renderCurrentStage()}
      </main>

      <footer className="relative z-20 border-t border-border-dark bg-black/80 py-4 px-6 flex flex-wrap justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] select-none gap-4">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            ระบบ: ออนไลน์
          </span>
          <span>การเข้ารหัส: AES-256-XTS</span>
        </div>
        <div className="flex gap-6">
          <span>เซิร์ฟเวอร์: NOD-77-GLOBAL</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-primary">sensors</span>
            สัญญาณ: 14MS
          </span>
        </div>
      </footer>

      <HintModal 
        isOpen={hintState.isOpen} 
        onClose={() => setHintState(prev => ({ ...prev, isOpen: false }))} 
        hint={hintState.content} 
        isLoading={hintState.loading} 
      />
    </div>
  );
};

export default App;
