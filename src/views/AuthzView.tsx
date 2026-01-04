import React, { useState } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';

interface AuthzViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

type TabType = 'MATRIX' | 'RBAC' | 'MLS' | 'ABAC';

const AuthzView: React.FC<AuthzViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [activeTab, setActiveTab] = useState<TabType>('MATRIX');
  const [inputValue, setInputValue] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  // ลำดับการสืบสวน: ตรวจสอบผู้ต้องสงสัยทีละกลุ่ม
  const anomalies = [
    {
      id: 1,
      targetChar: "อ.ศักดิ์ & คำปัน",
      concept: "Access Control Matrix (DAC)",
      alert: "INVESTIGATION: มีรายงานว่าเห็น 'เงาคนแก่' และ 'อาจารย์' ด้อมๆ มองๆ หน้าแล็บช่วงเกิดเหตุ",
      question: "ตรวจสอบ Matrix: ใครที่มีสิทธิ์เข้าห้อง Lab (LAB_ACCESS) ได้จริง? (ระบุชื่อคนที่เข้าไม่ได้แต่พยายามเข้า)",
      correctTab: 'MATRIX',
      ans: "SAK-91", // ศักดิ์ไม่มีสิทธิ์แต่พยายามเข้า ส่วนคำปัน Retired ไปแล้ว
      explanation: "ถูกต้อง! อ.ศักดิ์ (SAK-91) ไม่มีสิทธิ์เข้า Lab (สิทธิ์เป็น -) เขาจึงทำได้แค่ด้อมๆ มองๆ ส่วนนายคำปัน Account ถูกปิดไปนานแล้ว"
    },
    {
      id: 2,
      targetChar: "ประเสริฐ (พนักงานใหม่)",
      concept: "Role-Based Access Control (RBAC)",
      alert: "INVESTIGATION: ประเสริฐอ้างว่าพบศพและพยายามกด 'ปุ่มฉุกเฉิน' ผ่านระบบแต่ไม่ทำงาน",
      question: "ตรวจสอบ Role: ประเสริฐ (PRASERT) อยู่ Role ไหน? และ Role นั้นขาด Permission อะไรที่จำเป็นสำหรับการแจ้งเหตุ?",
      correctTab: 'RBAC',
      ans: "EMERGENCY_BROADCAST", // Permission ที่ขาดหายไป
      explanation: "ใช่แล้ว! ประเสริฐเป็นแค่ 'INTERN' ซึ่งไม่มีสิทธิ์ 'EMERGENCY_BROADCAST' เขาจึงไม่ได้โกหก เขาพยายามช่วยแล้วแต่ระบบไม่อนุญาต"
    },
    {
      id: 3,
      targetChar: "รองฯ ธวัช",
      concept: "Multilevel Security (MLS)",
      alert: "INVESTIGATION: ตำรวจขอข้อมูล 'ผลชันสูตร (AUTOPSY)' แต่หาไฟล์ในระบบไม่เจอ",
      question: "ตรวจสอบ MLS: ไฟล์ AUTOPSY ถูกจัด Security Label ไว้ที่ระดับใด? และใครเป็นคนเดียวที่มีสิทธิ์อ่าน/เขียนระดับนั้น?",
      correctTab: 'MLS',
      ans: "VP-TWAT",
      explanation: "ถูกต้อง! ไฟล์ถูกระบุเป็น 'TOP-SECRET' (Level 3) และผู้บริหารสูงสุด (VP-TWAT) คือคนเดียวที่เข้าถึงได้ เขาคือคนปิดข่าวเพื่อรักษาชื่อเสียง"
    },
    {
      id: 4,
      targetChar: "ดร.มนัส (ผู้ร้ายตัวจริง)",
      concept: "Attribute-Based (ABAC)",
      alert: "FINAL VERDICT: ระบบระบายอากาศทำงานปกติ แต่ทำไมสารพิษถึงยังค้างในห้อง?",
      question: "ตรวจสอบ Policy: ใน JSON มีเงื่อนไข (Condition) ลับที่ชื่อว่าอะไร? ที่สั่ง Override ระบบความปลอดภัยทั้งหมด?",
      correctTab: 'ABAC',
      ans: "ANCIENT_RITUAL", // หรือชื่อตัวแปรที่ใช้ override
      explanation: "ปิดคดี! มนัสสร้างเงื่อนไข 'ANCIENT_RITUAL' ไว้ในระบบ เมื่อเปิดโหมดนี้ พัดลมจะถูกบังคับปิดไม่ว่าสารพิษจะรั่วแค่ไหนก็ตาม"
    }
  ];

  const handleVerify = () => {
    setIsVerifying(true);
    const stage = anomalies[currentStage];

    if (activeTab !== stage.correctTab) {
      setFeedback({ type: 'error', msg: `ผิดหมวด! กรุณาไปที่แท็บ ${stage.concept} เพื่อตรวจสอบข้อมูลของเป้าหมาย` });
      setIsVerifying(false);
      return;
    }

    setTimeout(() => {
      // Logic การตรวจคำตอบแบบยืดหยุ่นขึ้น
      const isCorrect = inputValue.trim().toUpperCase().includes(stage.ans.toUpperCase()) || 
                        (stage.id === 1 && inputValue.toUpperCase().includes("SAK")); // พิเศษสำหรับข้อ 1

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
        }, 4000); // ดีเลย์นานนิดนึงให้อ่านเนื้อเรื่องทัน
      } else {
        setFeedback({ type: 'error', msg: "ข้อมูลไม่ถูกต้อง วิเคราะห์ตาราง/เงื่อนไขใหม่อีกครั้ง" });
      }
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono flex flex-col p-4 md:p-8 gap-6">
      <StageHeader stageName="Security Audit: ตรวจสอบบัญชีผู้ต้องสงสัย" stageNumber={3} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />

      {/* Mission Banner */}
      <div className="bg-gray-900 border-l-4 border-primary p-6 rounded-r-xl shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <span className="bg-primary text-black text-xs font-black px-2 py-1 rounded uppercase tracking-widest">
              STEP {currentStage + 1}: {anomalies[currentStage].targetChar}
            </span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
               Model: {anomalies[currentStage].concept}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-2">
            {anomalies[currentStage].alert}
          </h2>
          <p className="text-primary/90 text-lg font-bold border-t border-gray-700 pt-2 mt-2">
             คำถาม: {anomalies[currentStage].question}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT: EVIDENCE VIEWER */}
        <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 flex flex-col overflow-hidden min-h-[400px]">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-black overflow-x-auto">
            {(['MATRIX', 'RBAC', 'MLS', 'ABAC'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-4 text-xs md:text-sm font-bold transition-colors border-r border-gray-800 whitespace-nowrap relative
                  ${activeTab === tab ? 'bg-gray-800 text-primary' : 'text-gray-500 hover:text-gray-300'}
                `}
              >
                {activeTab === tab && <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>}
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-900/50">
            
            {/* 1. ACCESS CONTROL MATRIX (Focus: SAK, KAMPAN) */}
            {activeTab === 'MATRIX' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <h3 className="text-primary font-bold">ACCESS MATRIX (Physical & Server)</h3>
                  <span className="text-xs text-gray-500">Subject vs Object</span>
                </div>
                <table className="w-full text-xs md:text-sm text-left border-collapse">
                  <thead className="text-gray-400 bg-black/40">
                    <tr>
                      <th className="p-3 border border-gray-700">USER (Subject)</th>
                      <th className="p-3 border border-gray-700 text-center">LAB_ACCESS</th>
                      <th className="p-3 border border-gray-700 text-center">SERVER_LOGIN</th>
                      <th className="p-3 border border-gray-700 text-center">LIBRARY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Kampan: The Ghost */}
                    <tr className="opacity-50 hover:opacity-100 transition-opacity">
                      <td className="p-3 border border-gray-700 font-bold text-gray-500">
                        KAMPAN-99 <span className="text-[9px] block font-normal">(Inactive/Retired)</span>
                      </td>
                      <td className="p-3 border border-gray-700 text-center">-</td>
                      <td className="p-3 border border-gray-700 text-center">-</td>
                      <td className="p-3 border border-gray-700 text-center">Read</td>
                    </tr>
                    {/* Sak: The Suspicious Professor */}
                    <tr className="bg-red-900/10 hover:bg-red-900/20">
                      <td className="p-3 border border-gray-700 font-bold text-white">
                        SAK-91 <span className="text-[9px] block text-gray-400 font-normal">(History Advisor)</span>
                      </td>
                      <td className="p-3 border border-gray-700 text-center text-red-500 font-bold bg-red-950/30">
                        DENY
                      </td>
                      <td className="p-3 border border-gray-700 text-center">-</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">Read</td>
                    </tr>
                    {/* Manat & Tu */}
                    <tr>
                      <td className="p-3 border border-gray-700 font-bold text-white">DRM-01 (Manat)</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">ALLOW</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">ALLOW</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">Read</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-700 font-bold text-white">TU-STD (Victim)</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">ALLOW</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">ALLOW</td>
                      <td className="p-3 border border-gray-700 text-center text-green-400">Read</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-black/40 p-3 rounded text-xs text-gray-400 border-l-2 border-red-500">
                  <strong className="text-red-400">LOGS DETECTED:</strong> SAK-91 attempted 'LAB_ACCESS' 5 times (Result: Access Denied).
                </div>
              </div>
            )}

            {/* 2. RBAC (Focus: PRASERT) */}
            {activeTab === 'RBAC' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <h3 className="text-primary font-bold">ROLE ASSIGNMENTS</h3>
                  <span className="text-xs text-gray-500">User -&gt; Role -&gt; Permission</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User to Role */}
                  <div className="border border-gray-700 rounded bg-black/20 p-4">
                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase">User Assignments</h4>
                    <ul className="text-sm space-y-3">
                      <li className="flex justify-between">
                        <span>PRASERT</span>
                        <span className="bg-blue-900 text-blue-200 px-2 py-0.5 rounded text-xs font-bold">INTERN</span>
                      </li>
                      <li className="flex justify-between">
                        <span>DRM-01</span>
                        <span className="bg-purple-900 text-purple-200 px-2 py-0.5 rounded text-xs font-bold">PROJECT_LEAD</span>
                      </li>
                    </ul>
                  </div>

                  {/* Role to Permission */}
                  <div className="border border-gray-700 rounded bg-black/20 p-4">
                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase">Role Permissions</h4>
                    <div className="space-y-4">
                      <div>
                        <span className="text-purple-400 font-bold text-xs">ROLE: PROJECT_LEAD</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-2 py-0.5 bg-gray-700 rounded text-[10px]">ALL_ACCESS</span>
                          <span className="px-2 py-0.5 bg-gray-700 rounded text-[10px]">EMERGENCY_BROADCAST</span>
                        </div>
                      </div>
                      <div className="opacity-75">
                        <span className="text-blue-400 font-bold text-xs">ROLE: INTERN</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-2 py-0.5 bg-gray-700 rounded text-[10px]">READ_BASIC_DOCS</span>
                          <span className="px-2 py-0.5 bg-red-900/50 text-red-400 border border-red-500/30 rounded text-[10px] line-through decoration-red-500">EMERGENCY_BROADCAST</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MLS (Focus: THAWAT) */}
            {activeTab === 'MLS' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <h3 className="text-primary font-bold">SECURITY CLEARANCE (MLS)</h3>
                  <span className="text-xs text-gray-500">Bell-LaPadula Model</span>
                </div>

                <div className="space-y-3">
                  {/* Top Secret */}
                  <div className="bg-gradient-to-r from-red-950/40 to-black border-l-4 border-red-500 p-4 rounded relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-red-400 font-black text-sm tracking-widest">TOP-SECRET (Level 3)</h4>
                        <p className="text-xs text-gray-400 mt-1">Users: <span className="text-white font-bold">VP-TWAT (รองฯ ธวัช)</span></p>
                      </div>
                      <span className="material-symbols-outlined text-red-500/20 text-4xl absolute right-4">lock</span>
                    </div>
                    <div className="mt-3 bg-black/50 p-2 rounded border border-red-500/20">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Files in this level:</p>
                      <ul className="text-xs text-red-200 mt-1 list-disc list-inside">
                         <li>FINANCIAL_AUDIT_REAL.XLSX</li>
                         <li className="font-bold text-red-400 animate-pulse">AUTOPSY_REPORT_FINAL.PDF</li>
                      </ul>
                    </div>
                  </div>

                  {/* Secret/Unclassified */}
                  <div className="grid grid-cols-2 gap-3 opacity-60">
                    <div className="bg-gray-800 p-3 rounded border-l-4 border-yellow-500">
                      <h4 className="text-yellow-500 font-bold text-xs">SECRET (Level 2)</h4>
                      <p className="text-[10px] text-gray-400">Users: DRM-01, SAK-91</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded border-l-4 border-green-500">
                      <h4 className="text-green-500 font-bold text-xs">UNCLASSIFIED (Level 1)</h4>
                      <p className="text-[10px] text-gray-400">Users: PRASERT, TU-STD</p>
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 italic mt-2">
                   "Level 1 User cannot read Level 3 File (No Read Up)"
                </div>
              </div>
            )}

            {/* 4. ABAC (Focus: MANAT) */}
            {activeTab === 'ABAC' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <h3 className="text-primary font-bold">POLICY DEFINITION (ABAC)</h3>
                  <span className="text-xs text-gray-500">Lab Ventilation System</span>
                </div>

                <div className="bg-black p-4 rounded-lg font-mono text-xs border border-gray-700 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 bg-red-900/80 text-white text-[10px] font-bold">
                     LAST EDITED BY: DRM-01
                   </div>
                   <div className="space-y-1">
                      <span className="text-purple-400">if</span> (User.Role == <span className="text-green-400">"ADMIN"</span>) <span className="text-yellow-400">{`{`}</span>
                      
                      <div className="pl-4 border-l border-gray-800 ml-1 py-1">
                        <span className="text-gray-500">// Normal Safety Rule</span>
                        <br/>
                        <span className="text-purple-400">if</span> (Sensor.Toxin &gt; 50) <span className="text-blue-400">return</span> <span className="text-green-400">"OPEN_VENT"</span>;
                        
                        <br/><br/>
                        <span className="text-gray-500">// Special Override inserted by Manat</span>
                        <br/>
                        <span className="text-purple-400">if</span> (Environment.Mode == <span className="text-red-500 font-bold">"ANCIENT_RITUAL"</span>) <span className="text-yellow-400">{`{`}</span>
                        <div className="pl-4">
                           <span className="text-blue-400">return</span> <span className="text-red-500 font-bold">"CLOSE_VENT_LOCK_DOOR"</span>;
                           <br/>
                           <span className="text-gray-500">// Reason: "Keep humidity for script preservation"</span>
                        </div>
                        <span className="text-yellow-400">{`}`}</span>
                      </div>
                      
                      <span className="text-yellow-400">{`}`}</span>
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT: ACTION PANEL */}
        <div className="w-full lg:w-80 bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 shrink-0 h-fit">
          <h3 className="text-white font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">keyboard</span>
            ระบุคำตอบ
          </h3>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            placeholder="พิมพ์รหัส/ชื่อ/ตัวแปร..."
            className="w-full bg-black border border-gray-600 focus:border-primary text-white p-3 rounded-lg outline-none font-mono text-sm"
            autoFocus
          />

          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputValue}
            className="w-full bg-primary hover:bg-white text-black font-black py-3 rounded-lg transition-all uppercase tracking-wider text-sm shadow-lg shadow-primary/20"
          >
            {isVerifying ? 'Checking...' : 'ยืนยันข้อมูล'}
          </button>

          {/* Feedback Area */}
          <div className={`mt-2 p-4 rounded-lg text-sm min-h-[100px] flex items-center justify-center text-center transition-all duration-300 ${
            feedback.type === 'success' ? 'bg-green-950/50 border border-green-500/50 text-green-200' : 
            feedback.type === 'error' ? 'bg-red-950/50 border border-red-500/50 text-red-200' :
            'bg-black/30 text-gray-500 border border-gray-800'
          }`}>
             {feedback.msg || "รอการป้อนข้อมูล..."}
          </div>

          {/* Character Status Tracker */}
          <div className="mt-4 border-t border-gray-800 pt-4">
             <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-2">Suspect Status</h4>
             <div className="space-y-2">
                <div className={`flex justify-between text-[10px] ${currentStage > 0 ? 'text-gray-500 line-through' : 'text-white'}`}>
                  <span>Sak & Kampan</span>
                  <span>{currentStage > 0 ? 'CLEARED' : 'PENDING'}</span>
                </div>
                <div className={`flex justify-between text-[10px] ${currentStage > 1 ? 'text-gray-500 line-through' : 'text-white'}`}>
                  <span>Prasert</span>
                  <span>{currentStage > 1 ? 'WITNESS' : 'PENDING'}</span>
                </div>
                <div className={`flex justify-between text-[10px] ${currentStage > 2 ? 'text-red-400 font-bold' : 'text-white'}`}>
                  <span>VP Thawat</span>
                  <span>{currentStage > 2 ? 'IDENTIFIED' : 'PENDING'}</span>
                </div>
                <div className={`flex justify-between text-[10px] ${currentStage > 3 ? 'text-red-500 font-black' : 'text-white'}`}>
                  <span>Manat</span>
                  <span>{currentStage > 3 ? 'GUILTY' : 'PENDING'}</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthzView;