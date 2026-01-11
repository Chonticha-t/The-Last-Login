import React, { useState, useEffect } from 'react';
import type { CaseStatus } from '../types';
import StageHeader from '../components/StageHeader';

interface AuthzViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

type TabType = 'MATRIX' | 'RBAC' | 'MLS' | 'ABAC';

// Helper for Glitch Effect
const GlitchText: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative inline-block group">
    <span className="relative z-10">{text}</span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-70 animate-pulse translate-x-[2px]">{text}</span>
    <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500 opacity-70 animate-pulse -translate-x-[2px] delay-100">{text}</span>
  </span>
);

const AuthzView: React.FC<AuthzViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [activeTab, setActiveTab] = useState<TabType>('MATRIX');
  const [inputValue, setInputValue] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  // เนื้อเรื่องการสืบสวน 4 ขั้นตอน
  const anomalies = [
    {
      id: 1,
      targetChar: "ผู้ต้องสงสัย #1: อ.ศักดิ์",
      concept: "Access Control Matrix (DAC)",
      alert: "LOG_ALERT: พบความพยายามบุกรุกห้อง Lab (LAB_ACCESS) ในช่วงเวลาเกิดเหตุ",
      question: "จากการตรวจสอบ Matrix: อ.ศักดิ์ (SAK-91) สามารถเข้าไปฆ่านักศึกษาใน Lab ได้หรือไม่? (ตอบ: YES/NO)",
      correctTab: 'MATRIX',
      ans: ["NO", "DENY"],
      explanation: "ถูกต้อง! แม้ SAK-91 จะพยายามเข้าห้อง 5 ครั้ง แต่สิทธิ์คือ 'DENY' เขาเข้าไม่ได้... แสดงว่าฆาตกรต้องเป็นคนอื่นที่มีสิทธิ์เข้า!"
    },
    {
      id: 2,
      targetChar: "ผู้ต้องสงสัย #2: นายประเสริฐ",
      concept: "Role-Based Access Control (RBAC)",
      alert: "LOG_ALERT: ยามประเสริฐอยู่ในเหตุการณ์แต่ไม่ยอมกดสัญญาณเตือนภัย (Emergency Broadcast)",
      question: "ตรวจสอบ Role: ทำไมประเสริฐ (INTERN) ถึงไม่กดสัญญาณเตือน? เขาขาด Permission ชื่อว่าอะไร?",
      correctTab: 'RBAC',
      ans: ["EMERGENCY_BROADCAST"],
      explanation: "ถูกต้อง! เขาไม่ได้เพิกเฉย แต่ Role 'INTERN' ถูกถอดสิทธิ์ 'EMERGENCY_BROADCAST' ออกไป... ใครบางคนจงใจตัดการสื่อสารล่วงหน้า"
    },
    {
      id: 3,
      targetChar: "ผู้ต้องสงสัย #3: รองฯ ธวัช",
      concept: "Multilevel Security (MLS)",
      alert: "LOG_ALERT: ไฟล์รายงานชันสูตร (Autopsy) หายไปจากระบบฐานข้อมูลทั่วไป",
      question: "ตรวจสอบ MLS: ไฟล์นี้ถูกซ่อนไว้ในระดับใด? (Security Label) ที่คนทั่วไปมองไม่เห็น",
      correctTab: 'MLS',
      ans: ["TOP-SECRET", "LEVEL 3", "LEVEL3"],
      explanation: "ถูกต้อง! รองฯ ธวัช ใช้สิทธิ์ระดับสูงซ่อนไฟล์ไว้เพื่อปิดข่าว แต่เขาแค่ 'ปกปิด' ไม่ได้หมายความว่าเขาเป็นคน 'ลงมือฆ่า'"
    },
    {
      id: 4,
      targetChar: "ผู้ต้องสงสัย #4: ??? (The Mastermind)",
      concept: "Attribute-Based (ABAC)",
      alert: "FINAL PUZZLE: ถ้าระบบระบายอากาศทำงานปกติ ทำไมนักศึกษาถึงตายด้วยสารพิษ?",
      question: "ตรวจสอบ Policy: ค้นหา 'เงื่อนไขลับ' (Attribute Condition) ที่สั่งล็อกประตูและปิดพัดลมเมื่อเริ่มพิธี?",
      correctTab: 'ABAC',
      ans: ["ANCIENT_RITUAL"],
      explanation: "C A U G H T ... เงื่อนไข 'ANCIENT_RITUAL' ถูกเขียนแทรกไว้โดย Admin (DRM-01) นี่คือการฆาตกรรมโดยใช้ Code!"
    }
  ];

  // Effect เมื่อถึงด่านสุดท้าย (ABAC) ให้เกิด Glitch
  useEffect(() => {
    if (currentStage === 3) {
      const interval = setInterval(() => {
        setGlitchIntensity(prev => (prev === 0 ? 1 : 0));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  const handleVerify = () => {
    setIsVerifying(true);
    const stage = anomalies[currentStage];

    if (activeTab !== stage.correctTab) {
      setFeedback({ type: 'error', msg: `⛔ ACCESS DENIED: ข้อมูลไม่ได้อยู่ที่แท็บนี้ ไปที่ ${stage.concept}` });
      setIsVerifying(false);
      return;
    }

    setTimeout(() => {
      const isCorrect = stage.ans.some(a => inputValue.trim().toUpperCase().includes(a));
      
      if (isCorrect) {
        setFeedback({ type: 'success', msg: stage.explanation });
        setTimeout(() => {
          if (currentStage < anomalies.length - 1) {
            setCurrentStage(prev => prev + 1);
            setInputValue('');
            setFeedback({ type: null, msg: '' });
          } else {
            onComplete();
          }
        }, 4000); // อ่านคำเฉลยนานหน่อย
      } else {
        setFeedback({ type: 'error', msg: "❌ INVALID DATA: วิเคราะห์หลักฐานใหม่อีกครั้ง" });
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen font-mono flex flex-col p-4 md:p-8 gap-6 transition-colors duration-1000 ${currentStage === 3 ? 'bg-red-950/20' : 'bg-black'} text-gray-200`}>
      <StageHeader stageName="Security Audit: ตามรอยคนร้ายผ่านสิทธิ์" stageNumber={3} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />

      {/* Narrative Banner */}
      <div className={`border-l-4 p-6 rounded-r-xl shadow-lg relative overflow-hidden transition-all duration-500 ${currentStage === 3 ? 'bg-red-900/10 border-red-500' : 'bg-gray-900 border-primary'}`}>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <span className={`text-xs font-black px-2 py-1 rounded uppercase tracking-widest ${currentStage === 3 ? 'bg-red-600 text-black animate-pulse' : 'bg-primary text-black'}`}>
              PHASE {currentStage + 1}/4
            </span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
               Focus: {anomalies[currentStage].concept}
            </span>
          </div>
          <h2 className={`text-xl md:text-3xl font-bold tracking-wide mb-2 ${currentStage === 3 ? 'text-red-500' : 'text-white'}`}>
            {currentStage === 3 ? <GlitchText text={anomalies[currentStage].alert} /> : anomalies[currentStage].alert}
          </h2>
          <p className="text-primary/90 text-lg font-bold border-t border-gray-700 pt-4 mt-2 font-mono">
             <span className="text-gray-500 mr-2">$ QUEST:</span> {anomalies[currentStage].question}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT: EVIDENCE VIEWER */}
        <div className={`flex-1 bg-gray-900 rounded-xl border flex flex-col overflow-hidden min-h-[400px] transition-all ${currentStage === 3 ? 'border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'border-gray-700'}`}>
          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-black overflow-x-auto">
            {(['MATRIX', 'RBAC', 'MLS', 'ABAC'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-4 text-xs md:text-sm font-bold transition-colors border-r border-gray-800 whitespace-nowrap relative
                  ${activeTab === tab 
                    ? (currentStage === 3 ? 'bg-red-900/30 text-red-500' : 'bg-gray-800 text-primary') 
                    : 'text-gray-500 hover:text-gray-300'}
                `}
              >
                {activeTab === tab && <div className={`absolute top-0 left-0 w-full h-1 ${currentStage === 3 ? 'bg-red-500' : 'bg-primary'}`}></div>}
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-black/40 font-mono text-sm relative">
            
            {/* 1. MATRIX (DAC) - หลอกว่าศักดิ์ทำ แต่จริงๆ ทำไม่ได้ */}
            {activeTab === 'MATRIX' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-end border-b border-gray-700 pb-2">
                   <h3 className="text-primary font-bold">ACCESS CONTROL MATRIX</h3>
                   <span className="text-gray-500 text-[10px] uppercase">Log_Date: 12-OCT</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className="text-gray-500 bg-white/5 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Subject (User)</th>
                      <th className="p-3 text-center">Object: LAB_ROOM</th>
                      <th className="p-3 text-center">Object: SERVER_ROOM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="bg-red-900/10">
                      <td className="p-3 font-bold text-white">SAK-91 (History Prof)</td>
                      <td className="p-3 text-center font-bold text-red-500 bg-red-900/20 border border-red-500/30 animate-pulse">DENY</td>
                      <td className="p-3 text-center text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">DRM-01 (Head Researcher)</td>
                      <td className="p-3 text-center text-green-400 font-bold">ALLOW</td>
                      <td className="p-3 text-center text-green-400 font-bold">ALLOW</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">STUDENTS (Victims)</td>
                      <td className="p-3 text-center text-green-400">ALLOW (Time restricted)</td>
                      <td className="p-3 text-center text-gray-600">-</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-red-900/20 border border-red-900 p-3 rounded text-xs text-red-300">
                  ⚠️ <strong>ALERT:</strong> SAK-91 attempted to access 'LAB_ROOM' 5 times. Status: <strong>ACCESS DENIED</strong>.
                </div>
              </div>
            )}

            {/* 2. RBAC - ประเสริฐอยากช่วย แต่ระบบไม่ให้ช่วย */}
            {activeTab === 'RBAC' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-end border-b border-gray-700 pb-2">
                   <h3 className="text-primary font-bold">ROLE-BASED PERMISSIONS</h3>
                   <span className="text-gray-500 text-[10px] uppercase">System_Config_v4.2</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-white/5 p-4 rounded border border-gray-700">
                      <h4 className="text-gray-400 text-xs font-bold uppercase mb-2">User Assignments</h4>
                      <ul className="space-y-2">
                         <li className="flex justify-between"><span>PRASERT</span> <span className="bg-blue-900 text-blue-200 px-2 rounded text-[10px]">ROLE: INTERN</span></li>
                         <li className="flex justify-between"><span>DRM-01</span> <span className="bg-purple-900 text-purple-200 px-2 rounded text-[10px]">ROLE: ADMIN</span></li>
                      </ul>
                   </div>
                   <div className="bg-white/5 p-4 rounded border border-gray-700">
                      <h4 className="text-gray-400 text-xs font-bold uppercase mb-2">Role Permissions</h4>
                      <div className="space-y-4">
                         <div>
                            <span className="text-blue-400 font-bold text-xs">ROLE: INTERN</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                               <span className="px-2 py-1 bg-gray-700 rounded text-[10px]">PATROL_CHECKIN</span>
                               {/* จุดสังเกต: สิทธิ์ถูกขีดฆ่า */}
                               <span className="px-2 py-1 bg-red-900/20 border border-red-500/50 text-red-500 rounded text-[10px] line-through decoration-red-500 font-bold relative group cursor-help">
                                  EMERGENCY_BROADCAST
                                  <span className="absolute bottom-full left-0 bg-black text-white text-[9px] p-1 rounded hidden group-hover:block w-32">
                                     Revoked by Admin (2 days ago)
                                  </span>
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                <p className="text-xs text-gray-500 italic text-center">"Users can only perform actions authorized by their Roles."</p>
              </div>
            )}

            {/* 3. MLS - รองฯ ธวัช มีความลับ แต่แค่ซ่อน ไม่ได้ฆ่า */}
            {activeTab === 'MLS' && (
              <div className="space-y-4 animate-in fade-in">
                 <div className="flex justify-between items-end border-b border-gray-700 pb-2">
                   <h3 className="text-primary font-bold">MULTILEVEL SECURITY (Bell-LaPadula)</h3>
                   <span className="text-gray-500 text-[10px] uppercase">Data_Classification</span>
                </div>
                <div className="space-y-2">
                   <div className="bg-gradient-to-r from-red-950/50 to-transparent border-l-4 border-red-600 p-4 rounded relative">
                      <h4 className="text-red-500 font-black text-xs tracking-widest mb-1">LEVEL 3: TOP-SECRET</h4>
                      <p className="text-[10px] text-gray-400 mb-2">Authorized: <span className="text-white font-bold">VP-TWAT</span></p>
                      <div className="bg-black/50 p-2 rounded border border-red-500/20">
                         <span className="text-[10px] text-gray-500 block mb-1">Contained Objects:</span>
                         <div className="flex items-center gap-2 text-red-300 font-bold animate-pulse">
                            <span className="material-symbols-outlined text-sm">folder_off</span>
                            AUTOPSY_REPORT_FINAL.PDF
                         </div>
                      </div>
                      <span className="absolute top-4 right-4 material-symbols-outlined text-4xl text-red-900 opacity-50">lock</span>
                   </div>

                   <div className="flex gap-4 opacity-50">
                      <div className="flex-1 bg-gray-800 p-3 rounded border-l-4 border-yellow-500">
                         <h4 className="text-yellow-500 text-[10px] font-bold">LEVEL 2: SECRET</h4>
                         <p className="text-[10px] text-gray-500">Authorized: DRM-01, SAK-91</p>
                      </div>
                      <div className="flex-1 bg-gray-800 p-3 rounded border-l-4 border-green-500">
                         <h4 className="text-green-500 text-[10px] font-bold">LEVEL 1: UNCLASSIFIED</h4>
                         <p className="text-[10px] text-gray-500">Authorized: PRASERT, STUDENTS</p>
                      </div>
                   </div>
                </div>
                <div className="text-center text-[10px] text-gray-500 mt-2">
                   Rule: "No Read Up" (Level 1 user cannot read Level 3 file)
                </div>
              </div>
            )}

            {/* 4. ABAC - เฉลยปม ดร.มนัส */}
            {activeTab === 'ABAC' && (
              <div className="space-y-4 animate-in fade-in h-full flex flex-col justify-center">
                 <div className="flex justify-between items-center pb-2 border-b border-red-900/50">
                  <h3 className={`font-bold flex items-center gap-2 ${currentStage === 3 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                     <span className="material-symbols-outlined">code</span>
                     IOT_VENTILATION_POLICY.JSON
                  </h3>
                  <span className="text-[10px] text-red-400 font-bold border border-red-500 px-2 py-0.5 rounded">
                     LAST EDITED BY: DRM-01
                  </span>
                </div>
                
                <div className={`bg-black p-6 rounded-lg font-mono text-sm border relative overflow-hidden transition-all duration-500 ${currentStage === 3 ? 'border-red-600 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]' : 'border-gray-700'}`}>
                   {/* Glitch Overlay */}
                   {currentStage === 3 && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>}
                   
                   <div className="space-y-2 relative z-10 leading-relaxed">
                      <p><span className="text-purple-400">rule</span> <span className="text-yellow-400">"Emergency_Ventilation"</span> {`{`}</p>
                      
                      <div className="pl-6 border-l border-gray-800 ml-2 space-y-4">
                         {/* กฎปกติ */}
                         <div className="opacity-50 grayscale">
                            <span className="text-gray-500">// Normal Safety Rule</span><br/>
                            <span className="text-purple-400">target</span>: <span className="text-green-400">"VENT_FAN"</span>;<br/>
                            <span className="text-purple-400">condition</span>: (sensor.toxin &gt; 50);<br/>
                            <span className="text-purple-400">effect</span>: <span className="text-blue-400">PERMIT</span>;<br/>
                         </div>

                         {/* กฎที่ถูกแทรก (Killer Code) */}
                         <div className={`transition-all duration-1000 ${currentStage === 3 ? 'bg-red-900/10 p-2 -mx-2 rounded border border-red-500/30' : ''}`}>
                            <span className={`italic font-bold ${currentStage === 3 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                               // !!! OVERRIDE PROTOCOL DETECTED !!!
                            </span><br/>
                            <span className="text-purple-400">rule</span> <span className="text-yellow-400">"Ritual_Execution"</span> {`{`}<br/>
                            <div className="pl-4">
                               <span className="text-purple-400">target</span>: <span className="text-green-400">"ALL_DOORS_AND_VENTS"</span>;<br/>
                               
                               {/* คำตอบอยู่ที่นี่ */}
                               <span className="text-purple-400">condition</span>: (environment.mode == <span className="text-red-500 font-black bg-black px-1 glitch-text">"ANCIENT_RITUAL"</span>);<br/>
                               
                               <span className="text-purple-400">effect</span>: <span className="text-red-500 font-bold">DENY_EXIT_AND_CLOSE_AIR</span>;<br/>
                            </div>
                            {`}`}
                         </div>
                      </div>
                      <p>{`}`}</p>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT: ACTION PANEL */}
        <div className="w-full lg:w-80 bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 shrink-0 h-fit">
          <h3 className="text-white font-bold flex items-center gap-2 border-b border-gray-800 pb-4">
            <span className="material-symbols-outlined text-primary">terminal</span>
            INPUT TERMINAL
          </h3>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            placeholder={currentStage === 3 ? "> DECRYPT_ATTRIBUTE..." : "> ANALYZE_DATA..."}
            className={`w-full bg-black border p-4 rounded-lg outline-none font-mono text-sm uppercase tracking-wider shadow-inner transition-colors ${currentStage === 3 ? 'border-red-500 text-red-500 placeholder-red-900' : 'border-gray-600 text-white focus:border-primary'}`}
            autoFocus
          />

          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputValue}
            className={`w-full font-black py-4 rounded-lg transition-all uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2 group
              ${isVerifying ? 'bg-gray-800 text-gray-500' : 
                currentStage === 3 ? 'bg-red-600 hover:bg-white hover:text-red-600 text-black shadow-red-900/40' : 
                'bg-primary hover:bg-white text-black shadow-primary/20'}
            `}
          >
            {isVerifying ? 'PROCESSING...' : 'EXECUTE'}
          </button>

          {/* Feedback */}
          <div className={`mt-2 p-3 rounded text-xs text-center font-mono min-h-[60px] flex items-center justify-center border ${
             feedback.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
             feedback.type === 'error' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
             'bg-black/30 text-gray-600 border-gray-800'
          }`}>
             {feedback.msg || "Waiting for command..."}
          </div>

          {/* Progress Tracker */}
          <div className="mt-2 pt-4 border-t border-gray-800">
             <div className="space-y-2">
                {anomalies.map((a, idx) => (
                   <div key={idx} className={`flex items-center gap-2 text-[10px] ${currentStage === idx ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-2 h-2 rounded-full ${currentStage > idx ? 'bg-green-500' : currentStage === idx ? 'bg-primary animate-pulse' : 'bg-gray-700'}`}></div>
                      <span className={currentStage === idx ? 'text-white font-bold' : 'text-gray-500'}>
                         {idx === 3 ? "FINAL ANALYSIS" : `CHECK: ${["MATRIX", "RBAC", "MLS"][idx]}`}
                      </span>
                   </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthzView;