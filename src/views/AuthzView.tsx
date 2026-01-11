import React, { useState, useEffect } from 'react';
import type { CaseStatus } from '../types';
import StageHeader from '../components/StageHeader';

interface AuthzViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

type TabType = 'MATRIX' | 'RBAC' | 'MLS' | 'ABAC';

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
  const [showArchive, setShowArchive] = useState(false);

  // ข้อมูลสืบสวน 4 ขั้นตอน (ปรับแต่ง Logic ให้สอดคล้องกับพล็อต)
  const anomalies = [
    {
      id: 1,
      concept: "Access Control Matrix (DAC)",
      alert: "LOG_ALERT: พบความพยายามเข้าใช้ห้อง Lab ในช่วงเวลาวิกาล",
      question: "ตรวจสอบ Matrix: อ.ศักดิ์ (SAK-91) สามารถเข้าไปใน Lab ในช่วงเวลา '03:00 น.' ได้หรือไม่? (YES/NO)",
      correctTab: 'MATRIX',
      ans: ["NO", "DENY"],
      explanation: "ถูกต้อง! แม้เขาจะมีสิทธิ์เข้าในเวลาปกติ แต่ช่วงเวลาตี 3 สิทธิ์เขาคือ 'DENY' เขาเข้าไม่ได้... ฆาตกรต้องเป็นคนที่มีสิทธิ์แบบ 24 ชม.!"
    },
    {
      id: 2,
      concept: "Role-Based Access Control (RBAC)",
      alert: "LOG_ALERT: ระบบสัญญาณเตือนภัย (Emergency) ไม่ส่งสัญญาณออกสู่ภายนอก",
      question: "ตรวจสอบ Role: Permission ใดของประเสริฐ (INTERN) ที่ถูกแอบ Redirect ไปยังค่าว่าง (Null) ?",
      correctTab: 'RBAC',
      ans: ["EMERGENCY_BROADCAST", "EMERGENCY"],
      explanation: "ถูกต้อง! สิทธิ์ของเขายังอยู่แต่ถูกแอบเบี่ยงเบนสัญญาณ (Redirect) ทำให้เขากดปุ่มไปก็ไร้ความหมาย... มีคนวางแผนตัดการสื่อสารล่วงหน้า"
    },
    {
      id: 3,
      concept: "Multilevel Security (MLS)",
      alert: "LOG_ALERT: ไฟล์ข้อมูลโครงการที่ผิดพลาดถูกยกระดับชั้นความลับ",
      question: "ตรวจสอบ MLS: ไฟล์รายงานความเสี่ยงอาคเนย์ถูกย้ายไปที่ Security Label ระดับใด?",
      correctTab: 'MLS',
      ans: ["TOP-SECRET", "LEVEL 3", "LEVEL3"],
      explanation: "ถูกต้อง! รองฯ ธวัชใช้สิทธิ์ระดับสูงเพื่อซ่อนไฟล์ความผิดพลาดของโครงการ... เขาปกปิดเพื่อตำแหน่ง แต่เขาไม่ใช่คนแก้ Code ระบบอากาศ"
    },
    {
      id: 4,
      concept: "Attribute-Based (ABAC)",
      alert: "FINAL ANALYSIS: ตรวจพบเงื่อนไข Override ในนโยบายควบคุมระบบอาคาร",
      question: "ตรวจสอบ Policy: เงื่อนไข 'ANCIENT_RITUAL' ถูกแอบแทรกโดย UserID ใด?",
      correctTab: 'ABAC',
      ans: ["DRM-01", "DRM01", "MANAS"],
      explanation: "จับได้แล้ว! DRM-01 หรือ ดร.มนัส คือคนเดียวที่มีสิทธิ์เข้าถึง ABAC Policy เขาเขียน Code สังหารนักศึกษาโดยใช้พิธีกรรมบังหน้า!"
    }
  ];

  const handleVerify = () => {
    setIsVerifying(true);
    const stage = anomalies[currentStage];

    if (activeTab !== stage.correctTab) {
      setFeedback({ type: 'error', msg: `⛔ ข้อมูลไม่ได้อยู่ที่แท็บนี้ ลองเช็คที่ ${stage.concept}` });
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
        }, 3500);
      } else {
        setFeedback({ type: 'error', msg: "❌ การวิเคราะห์ผิดพลาด กรุณาตรวจสอบค่าในระบบให้ละเอียด" });
      }
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div className={`min-h-screen font-mono flex flex-col p-4 md:p-8 gap-6 transition-colors duration-1000 ${currentStage === 3 ? 'bg-red-950/20' : 'bg-black'} text-gray-200`}>
      <StageHeader stageName="Security Audit: วิเคราะห์สิทธิ์การเข้าถึง" stageNumber={3} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />

      {/* Narrative Banner */}
      <div className={`border-l-4 p-6 rounded-r-xl shadow-lg transition-all duration-500 ${currentStage === 3 ? 'bg-red-900/10 border-red-500' : 'bg-gray-900 border-primary'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
          <span className={`text-xs font-black px-2 py-1 rounded uppercase ${currentStage === 3 ? 'bg-red-600 text-black animate-pulse' : 'bg-primary text-black'}`}>
            PHASE {currentStage + 1}/4
          </span>
        </div>
        <h2 className={`text-xl md:text-2xl font-bold mb-2 ${currentStage === 3 ? 'text-red-500' : 'text-white'}`}>
          {currentStage === 3 ? <GlitchText text={anomalies[currentStage].alert} /> : anomalies[currentStage].alert}
        </h2>
        <p className="text-primary/90 text-sm md:text-base font-bold border-t border-gray-700 pt-4 mt-2">
          <span className="text-gray-500 mr-2">$ QUEST:</span> {anomalies[currentStage].question}
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* LEFT: EVIDENCE VIEWER */}
        <div className={`flex-1 bg-gray-900 rounded-xl border flex flex-col overflow-hidden transition-all ${currentStage === 3 ? 'border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'border-gray-700'}`}>
          <div className="flex border-b border-gray-700 bg-black overflow-x-auto">
            {(['MATRIX', 'RBAC', 'MLS', 'ABAC'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-4 text-xs font-bold transition-all border-r border-gray-800 relative
                  ${activeTab === tab ? (currentStage === 3 ? 'bg-red-900/30 text-red-500' : 'bg-gray-800 text-primary') : 'text-gray-500'}
                `}
              >
                {activeTab === tab && <div className={`absolute top-0 left-0 w-full h-1 ${currentStage === 3 ? 'bg-red-500' : 'bg-primary'}`}></div>}
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-black/40 text-sm">
            {activeTab === 'MATRIX' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-primary font-bold border-b border-gray-700 pb-2 uppercase text-xs">Access Control Matrix (Time-Sensitive)</h3>
                <table className="w-full text-left border-collapse text-[11px] md:text-sm">
                  <thead className="text-gray-500 bg-white/5 uppercase">
                    <tr>
                        <th className="p-3">User_ID</th>
                        <th className="p-3 text-center">08:00 - 18:00</th>
                        <th className="p-3 text-center">22:00 - 05:00</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                        <td className="p-3 font-bold text-white">SAK-91 (อ.ศักดิ์)</td>
                        <td className="p-3 text-center text-green-400">ALLOW</td>
                        <td className="p-3 text-center font-bold text-red-500 bg-red-950/20">DENY</td>
                    </tr>
                    <tr>
                        <td className="p-3 font-bold text-white">PRASERT (รปภ.)</td>
                        <td className="p-3 text-center text-green-400">ALLOW</td>
                        <td className="p-3 text-center text-green-400">ALLOW</td>
                    </tr>
                    <tr className="bg-white/5">
                        <td className="p-3 font-bold text-white">DRM-01 (ดร.มนัส)</td>
                        <td className="p-3 text-center text-green-400 font-bold">ALLOW</td>
                        <td className="p-3 text-center text-green-400 font-bold">ALLOW</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-500 italic mt-2">* ระบบ DAC กำหนดสิทธิ์รายบุคคลตามช่วงเวลาที่ได้รับอนุมัติภารกิจเท่านั้น</p>
              </div>
            )}

            {activeTab === 'RBAC' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-primary font-bold border-b border-gray-700 pb-2 uppercase text-xs">Role Permissions (RBAC)</h3>
                <div className="p-4 bg-white/5 rounded border border-gray-800">
                  <span className="text-blue-400 font-bold uppercase">Role Assignment: Intern_Guard</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-gray-700 rounded text-[10px]">READ_LOGS</span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-[10px]">PHYSICAL_ACCESS</span>
                    <span className="px-2 py-1 bg-red-900/40 border border-red-500/50 text-red-400 rounded text-[10px] font-bold">
                        EMERGENCY_BROADCAST (⚠️ Redirected to NULL)
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                    * หมายเหตุ: สัญญาณเตือนภัยถูกเบี่ยงเบน (Signal Redirection) โดยสิทธิ์ระดับ Admin เพื่อการซ่อมบำรุงระบบอากาศล่วงหน้า
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'MLS' && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-primary font-bold border-b border-gray-700 pb-2 uppercase text-xs">Security Clearance Levels</h3>
                <div className="bg-gradient-to-r from-red-950/50 to-transparent border-l-4 border-red-600 p-4 rounded">
                  <h4 className="text-red-500 font-black text-xs mb-1 uppercase tracking-tighter">Level 3: Top-Secret (Restricted Access)</h4>
                  <p className="text-[10px] text-gray-400">Authorized: Vice_Tawat, Admin_Manas</p>
                  <div className="mt-3 space-y-2">
                    <div className="text-red-200 text-[11px] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility_off</span> 
                        RISK_ANALYSIS_DRAFT_DRM.DOCX
                    </div>
                    <div className="text-red-200 text-[11px] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility_off</span> 
                        INCIDENT_COVERUP_PROTOCOL.PDF
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic mt-2">"No Read Up, No Write Down" - สิทธิ์ระดับสูงสามารถซ่อนข้อมูลจากระดับล่างได้โดยสมบูรณ์</p>
              </div>
            )}

            {activeTab === 'ABAC' && (
              <div className="animate-in fade-in h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-red-500 font-bold text-xs flex items-center gap-2"><span className="material-symbols-outlined animate-pulse">settings_ethernet</span> SYS_DAEMON_MN.JSON</h3>
                  <span className="text-[9px] bg-red-900 text-white px-2 py-1 rounded font-bold uppercase tracking-widest">Last edited by: DRM-01</span>
                </div>
                <div className="bg-black p-4 rounded border border-red-900/50 font-mono text-[12px] leading-relaxed relative flex-1">
                  <div className="absolute top-2 right-2 opacity-10"><span className="material-symbols-outlined text-4xl text-red-600">security</span></div>
                  <p className="text-purple-400">rule <span className="text-yellow-400">"Ritual_Override"</span> {"{"}</p>
                  <div className="pl-4">
                    <p className="text-gray-500">// Custom logic for Ancient Ritual simulation</p>
                    <p className="text-purple-400">target: <span className="text-green-400">"LAB_VENT_AND_DOORS"</span>;</p>
                    <p className="text-purple-400">condition: <span className="bg-red-950 text-red-400 px-1 border border-red-900">environment.mode == "ANCIENT_RITUAL"</span>;</p>
                    <p className="text-purple-400">effect: <span className="text-red-600 font-black uppercase underline">Deny_All_Exit_Nodes</span>;</p>
                  </div>
                  <p className="text-purple-400">{"}"}</p>
                  <p className="text-gray-600 mt-4 italic">// This policy will bypass all RBAC and DAC settings when active.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: ACTION PANEL */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-bold flex items-center gap-2 border-b border-gray-800 pb-4 mb-4 uppercase text-xs">
              <span className="material-symbols-outlined text-primary">terminal</span> Command Center
            </h3>

            <button 
              onClick={() => setShowArchive(true)}
              className="w-full bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/50 text-blue-400 py-3 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 mb-4 transition-all"
            >
              <span className="material-symbols-outlined text-sm">history_edu</span>
              ตรวจสอบฐานข้อมูล (STAGE 2)
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="INPUT_ANALYSIS_DATA..."
              className={`w-full bg-black border p-4 rounded-lg outline-none font-mono text-xs uppercase tracking-widest mb-4 transition-all ${currentStage === 3 ? 'border-red-500 text-red-500' : 'border-gray-600 text-white focus:border-primary'}`}
              autoFocus
            />

            <button
              onClick={handleVerify}
              disabled={isVerifying || !inputValue}
              className={`w-full font-black py-4 rounded-lg text-xs tracking-widest transition-all shadow-lg ${currentStage === 3 ? 'bg-red-600 text-black hover:bg-white' : 'bg-primary text-black hover:bg-white'}`}
            >
              {isVerifying ? 'ANALYZING...' : 'EXECUTE_COMMAND'}
            </button>

            <div className={`mt-4 p-3 rounded text-[10px] text-center min-h-[50px] flex items-center justify-center border ${feedback.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-500/30' : feedback.type === 'error' ? 'bg-red-900/20 text-red-400 border-red-500/30' : 'bg-black/40 text-gray-600 border-gray-800'}`}>
              {feedback.msg || "READY_FOR_AUDIT"}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex-1">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4 border-b border-gray-800 pb-2 uppercase">
                <span className="material-symbols-outlined text-sm">monitoring</span> Audit Progress
            </div>
            <div className="space-y-4">
                {anomalies.map((a, i) => (
                    <div key={i} className={`flex items-center gap-3 ${currentStage >= i ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${currentStage > i ? 'bg-green-500' : 'bg-primary animate-pulse'}`}></div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Audit Node: {a.concept.split(' ')[0]}</div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 2 ARCHIVE MODAL */}
      {showArchive && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-gray-900 border-2 border-blue-500/50 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="p-4 border-b border-gray-800 bg-gray-800 flex justify-between items-center">
              <h3 className="text-blue-400 font-bold text-xs flex items-center gap-2"><span className="material-symbols-outlined">inventory_2</span> STAGE 2: RECOVERED INVESTIGATION DATA</h3>
              <button onClick={() => setShowArchive(false)} className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 bg-black/40 max-h-[60vh] font-sans">
              {[
                { n: "นายคำปัน", d: "พบจดหมายถึงลูกชายที่ระบุว่าเขารู้ถึงอันตรายของโครงการ ดร.มนัส และบทสวดส่งวิญญาณของเขาไม่ใช่บทสังเวย" },
                { n: "อ.ศักดิ์", d: "มีพิรุธในที่เกิดเหตุ แต่คัมภีร์ที่เขาครอบครองถูก 'ใครบางคน' ยืมไปก่อนเกิดเรื่องเพื่อจัดฉาก" },
                { n: "นายประเสริฐ", d: "รปภ. ที่หวาดกลัว เขาอ้างว่าถูกข่มขู่ให้ปิดปากเรื่องสิ่งที่เห็นในห้องทดลอง" },
                { n: "รองฯ ธวัช", d: "ผู้บริหารที่สั่งปิดข่าวและโอนเงินลับให้คำปัน เพื่อรักษาภาพลักษณ์จากความผิดพลาดของโครงการ" },
                { n: "ดร.มนัส", d: "เจ้าของโครงการวิจัย ผู้เชี่ยวชาญทั้งด้านวิทยาศาสตร์และไสยศาสตร์ เขาสนิทกับนายคำปันจึงรู้พิธีกรรมเป็นอย่างดี" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded border border-gray-800 bg-gray-900/30 group hover:border-blue-500/30 transition-colors">
                  <h4 className="font-black text-blue-400 text-xs mb-1 uppercase italic tracking-widest">{item.n}</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-medium">"{item.d}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthzView;