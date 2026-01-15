import { useState, useEffect } from 'react';

interface TriVariablePuzzleProps {
  onUnlock: () => void;
}

const TriVariablePuzzle = ({ onUnlock }: TriVariablePuzzleProps) => {
  const [activeTab, setActiveTab] = useState(0); // 0=North, 1=East, 2=South, 3=Final
  
  // ตัวแปรที่ผู้เล่นต้องหา (เฉลยจริง)
  // NORTH: Depth(4) * Density(3) = 12
  // EAST: (P(12) - Angle(7)) / 2 = 2.5 ≈ 5 (rounded up)
  // SOUTH: R(5) + Period(4) = 9
  // FINAL CODE: 12-05-09
  const [userVals, setUserVals] = useState({ P: '', R: '', T: '' });
  const [finalInput, setFinalInput] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  // --- TOOL STATE ---
  const [rulerY, setRulerY] = useState(0); // สำหรับวัดความลึก
  const [protractorAngle, setProtractorAngle] = useState(0); // สำหรับวัดมุม
  const [timer, setTimer] = useState(0); // สำหรับจับเวลา
  const [isTiming, setIsTiming] = useState(false);

  // --- GAMEPLAY HANDLERS ---
  
  // Tool 1: Ruler (North)
  const handleRulerDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
    // จำลองการลากไม้บรรทัด (แกน Y)
    // ในโปรเจกต์จริงใช้ Library Drag-n-Drop หรือ Touch Event
    // อันนี้จำลองแบบ Slider ง่ายๆ
    setRulerY(Number(e.target.value)); 
  };

  // Tool 2: Protractor (East)
  const handleRotateProtractor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProtractorAngle(Number(e.target.value));
  };

  // Tool 3: Stopwatch (South)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTiming) {
      interval = setInterval(() => setTimer(t => t + 10), 10); // ms
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  // Toggle timer (Manual START/STOP)
  const toggleTimer = () => {
    if (isTiming) {
      setIsTiming(false);
    } else {
      setTimer(0);
      setIsTiming(true);
    }
  };

  // Check Final Answer
  const handleSubmit = () => {
    // สร้างคำตอบที่ถูกต้องจาก user values (แต่ละตัวต้องเป็น 2 หลัก)
    const p = userVals.P.padStart(2, '0');
    const r = userVals.R.padStart(2, '0');
    const t = userVals.T.padStart(2, '0');
    const correctAnswer = `${p}${r}${t}`;
    
    console.log('User entered:', finalInput, 'Correct answer:', correctAnswer);
    
    if (finalInput === correctAnswer || finalInput === "120509") {
      alert("ACCESS GRANTED: CHAIN COMPLETED");
      onUnlock();
    } else {
      setLogs(prev => [`> ERROR: INVALID HASH "${finalInput}". EXPECTED: ${correctAnswer}`, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-cyan-500 font-mono p-4 flex flex-col items-center select-none">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl border-b border-cyan-800 pb-4 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">FORENSIC ANALYZER <span className="text-xs bg-cyan-900 px-2 rounded">HARDCORE MODE</span></h1>
          <p className="text-xs text-gray-400">DERIVE VARIABLES P -&gt; R -&gt; T</p>
        </div>
        <div className="text-right text-xs">
          <p>VAR P: {userVals.P || "NULL"}</p>
          <p>VAR R: {userVals.R || "NULL"}</p>
          <p>VAR T: {userVals.T || "NULL"}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        {["NORTH (P)", "EAST (R)", "SOUTH (T)", "FINAL"].map((name, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 border rounded text-sm font-bold ${activeTab === i ? 'bg-cyan-900 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-500'}`}>
            {name}
          </button>
        ))}
      </div>

      {/* WORKSPACE */}
      <div className="w-full max-w-4xl h-[500px] bg-black border-2 border-slate-700 relative overflow-hidden flex">
        
        {/* --- SCENE 1: NORTH (EARTH) --- */}
        {activeTab === 0 && (
          <div className="w-full h-full flex flex-col p-6 relative">
            <h3 className="text-white border-b border-gray-700 mb-4">OBJ 1: CALCULATE PRESSURE (P)</h3>
            <div className="flex gap-8 h-full">
              
              {/* Image: Soil Layers */}
              <div className="w-1/2 bg-slate-800 relative h-[300px] border-r-4 border-dashed border-gray-600">
                {/* Visual Soil Layers */}
                <div className="absolute top-0 w-full h-[50px] bg-sky-900/20 text-center text-xs pt-2">AIR</div>
                <div className="absolute top-[50px] w-full h-[50px] bg-stone-500 text-center text-[10px] text-black">Surface</div>
                <div className="absolute top-[100px] w-full h-[100px] bg-stone-700"></div> 
                <div className="absolute top-[200px] w-full h-[100px] bg-red-900/50 flex items-center justify-center text-white font-bold">TARGET (CORPSE)</div>

                {/* The Ruler (Interactive) */}
                <div className="absolute left-0 w-8 bg-yellow-400/80 text-black text-[10px] flex flex-col items-center transition-all"
                     style={{ top: `${rulerY}px`, height: '300px' }}>
                   <span>0m</span>
                   <span className="mt-12">1m</span>
                   <span className="mt-12">2m</span>
                   <span className="mt-12">3m</span>
                   <span className="mt-12">4m</span>
                   <span className="mt-12">5m</span>
                </div>
              </div>

              {/* Tools & Reference */}
              <div className="w-1/2 flex flex-col gap-4">
                <div className="bg-slate-900 p-2 border border-slate-600 text-xs">
                  <p className="font-bold text-white mb-2">DENSITY REFERENCE:</p>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-stone-500"></div> Grey Soil = 1.0</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-stone-700"></div> Dark Soil = 2.0</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-900"></div> Red Clay = 3.0</div>
                </div>
                
                <div className="bg-slate-800 p-4 rounded">
                  <label className="text-xs block mb-2">RULER POSITION (Y-AXIS)</label>
                  <input type="range" min="0" max="250" value={rulerY} onChange={handleRulerDrag} className="w-full"/>
                </div>

                <div className="mt-auto">
                   <p className="text-xs text-gray-400 mb-1">FORMULA: ∇ (DEPTH × DENSITY)</p>
                   <input type="number" placeholder="Enter Value P" 
                     className="w-full bg-slate-900 border border-cyan-800 p-2 text-white"
                     value={userVals.P} onChange={(e) => setUserVals({...userVals, P: e.target.value})}
                   />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SCENE 2: EAST (WATER) - FIXED PHYSICS VISUALS --- */}
        {activeTab === 1 && (
          <div className="w-full h-full flex flex-col p-6 relative animate-in fade-in">
             <h3 className="text-white border-b border-gray-700 mb-4 pb-2">OBJ 2: CALCULATE REFRACTION (R)</h3>
             <div className="flex flex-col md:flex-row gap-8 h-full">
                
                {/* Visual Area */}
                <div className="w-full md:w-1/2 bg-blue-900/10 relative h-[350px] border border-blue-500/30 flex items-center justify-center overflow-hidden rounded">
                   
                   {/* Center Anchor Point */}
                   <div className="relative w-0 h-0 flex items-center justify-center">

                       {/* Normal Line (Vertical - แกนอ้างอิง 0 องศา) */}
                       <div className="absolute w-[1px] h-[400px] bg-transparent border-l border-dashed border-gray-400/50 -top-[200px]"></div>

                       {/* Water Surface (Horizontal) */}
                       <div className="absolute w-[400px] h-[1px] bg-blue-400/50"></div>

                       {/* Incident Ray (แสงขาเข้า - จากอากาศ) */}
                       {/* เข้ามาเอียงๆ 45 องศา */}
                       <div className="absolute h-[200px] w-1 bg-green-600/40 bottom-0 right-0 origin-bottom" 
                            style={{ transform: 'rotate(45deg)' }}>
                            {/* หัวลูกศรบอกทิศทาง */}
                            <div className="absolute top-10 left-[-2px] text-green-400 text-xs transform rotate-180">▼</div>
                       </div>

                       {/* Refracted Ray (แสงหักเห - ในน้ำ) */}
                       {/* ฟิสิกส์จริง: แสงต้องเบนเข้าหาแกนกลาง (มุมน้อยลง) */}
                       {/* ตั้งค่าเป้าหมายไว้ที่ 22 องศา (เห็นชัดเจน) */}
                       <div className="absolute h-[200px] w-[2px] bg-green-400 top-0 left-0 origin-top shadow-[0_0_10px_#4ade80]" 
                            style={{ transform: 'rotate(-158deg)' }}> {/* 180 - 22 = 158 (ทิศลง) */}
                       </div>

                       {/* Protractor Tool (ไม้โปรแทรกเตอร์) */}
                       <div className="absolute w-[280px] h-[140px] rounded-b-[140px] bg-white/10 border-2 border-white/30 backdrop-blur-sm top-0 -left-[140px] flex justify-center items-start overflow-hidden z-10"
                            style={{ 
                                // จุดหมุนอยู่ตรงกลางบน (ผิวน้ำ)
                                transformOrigin: 'top center', 
                                // ผู้เล่นหมุนค่า protractorAngle (0 ถึง 45)
                                transform: `rotate(${protractorAngle}deg)` 
                            }}>
                          
                          {/* Measurement Line (Red) */}
                          <div className="absolute top-0 w-[2px] h-full bg-red-600 origin-top shadow-[0_0_5px_red]"></div>
                          <div className="absolute top-0 w-4 h-4 bg-red-600 rounded-full -mt-2"></div>
                          
                          {/* Scale Marks */}
                          {[...Array(13)].map((_, i) => (
                             <div key={i} className="absolute top-0 w-[1px] h-4 bg-white/70 origin-top" 
                                  style={{ transform: `rotate(${(i-6)*10}deg) translateY(120px)` }}>
                                  {/* ตัวเลขสเกลเล็กๆ */}
                                  <span className="block mt-4 text-[8px] text-center -ml-1 text-gray-400">{Math.abs((i-6)*10)}</span>
                             </div>
                          ))}

                          {/* Digital Angle Readout */}
                          <span className="absolute bottom-4 text-2xl font-bold text-white drop-shadow-md font-mono">{Math.abs(protractorAngle)}°</span>
                       </div>

                   </div>
                   
                   <div className="absolute top-2 left-2 text-[10px] text-gray-400">AIR (n=1.0)</div>
                   <div className="absolute bottom-2 right-2 text-[10px] text-blue-300">WATER (n=1.33)</div>
                </div>

                {/* Controls */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <div className="bg-slate-900 p-3 border border-slate-600 text-xs text-gray-300 rounded">
                     <p className="font-bold text-white mb-1 underline">INSTRUCTION:</p>
                     <ul className="list-disc pl-4 space-y-1">
                        <li>หมุนไม้โปรแทรกเตอร์ วัดมุมของ <span className="text-green-400 font-bold">เส้นแสงในน้ำ</span> เทียบกับแกนกลาง</li>
                        <li>(แสงเบนเข้าหาแกนกลาง ตามกฎการหักเห)</li>
                     </ul>
                     <p className="text-red-400 mt-2 font-bold border-t border-gray-700 pt-2">REQUIREMENT: VARIABLE [P] FROM NORTH.</p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded shadow-inner border border-slate-600">
                     <div className="flex justify-between text-xs mb-2 text-cyan-400 font-bold">
                        <span>0°</span>
                        <span>ANGLE: {protractorAngle}°</span>
                        <span>45°</span>
                     </div>
                     <input 
                        type="range" 
                        min="0" 
                        max="45" 
                        step="1"
                        value={protractorAngle} 
                        onChange={handleRotateProtractor} 
                        className="w-full cursor-pointer accent-cyan-500 h-2 bg-gray-700 rounded-lg appearance-none"
                     />
                  </div>

                  <div className="mt-auto">
                     {/* แก้สูตรใหม่เพื่อให้ Make Sense กับมุม 22 องศา */}
                     <p className="text-xs text-gray-400 mb-1 font-mono">FORMULA: ∇ (ANGLE - P) / 2</p>
                     <input type="number" placeholder="Enter Value R" 
                       className="w-full bg-slate-900 border border-cyan-800 p-3 text-white text-lg font-mono focus:border-cyan-500 outline-none rounded"
                       value={userVals.R} onChange={(e) => setUserVals({...userVals, R: e.target.value.replace(/[^0-9]/g, '')})}
                     />
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* --- SCENE 3: SOUTH (WIND) - PENDULUM --- */}
        {activeTab === 2 && (
          <div className="w-full h-full flex flex-col p-6 relative animate-in fade-in">
             <h3 className="text-white border-b border-gray-700 mb-4 pb-2">OBJ 3: CALCULATE PERIOD (T)</h3>
             <div className="flex flex-col md:flex-row gap-8 h-full">
                {/* Animation: Pendulum */}
                <div className="w-full md:w-1/2 bg-gray-900 relative h-[350px] border border-gray-700 flex justify-center overflow-hidden rounded">
                   {/* เพิ่มเงื่อนไข: ถ้ากำลังวัด (isTiming) ให้โชว์เส้น Grid หรือ Effect การวัด */}
                   {isTiming && (
                      <div className="absolute inset-0 z-0 opacity-20">
                          <div className="w-full h-full border-2 border-red-500 animate-pulse"></div>
                          <div className="absolute top-1/2 w-full h-[1px] bg-red-500"></div>
                          <div className="absolute left-1/2 h-full w-[1px] bg-red-500"></div>
                      </div>
                   )}
                   
                   <div className="origin-top z-10" style={{
                     animation: isTiming ? 'swing 4s infinite ease-in-out' : 'none',
                     transformOrigin: 'top center'
                   }}>
                      <div className="w-1 h-[250px] bg-gray-500 mx-auto"></div>
                      <div className="w-16 h-20 bg-gray-700 rounded border border-gray-500 flex items-center justify-center text-xs shadow-xl relative">
                        CORPSE<br/>30kg
                        {/* จุดเลเซอร์แดงๆ เวลากำลังวัด */}
                        {isTiming && <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red] animate-ping"></div>}
                      </div>
                   </div>
                   <style>{`@keyframes swing { 0%,100% { transform: rotate(25deg); } 50% { transform: rotate(-25deg); } }`}</style>
                   <div className="absolute bottom-2 text-[10px] text-gray-500">PENDULUM SIMULATION</div>
                </div>

                 {/* Controls & Timer */}
                 <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="bg-slate-900 p-3 border border-slate-600 text-xs rounded">
                       <p className="text-gray-300">SYSTEM WILL MEASURE 1 FULL OSCILLATION CYCLE.</p>
                       <p className="text-red-400 mt-2 font-bold border-t border-gray-700 pt-1">REQUIREMENT: VARIABLE [R] FROM EAST.</p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded text-center border border-slate-600">
                       <label className="text-xs text-gray-400 block mb-2">LASER CHRONOMETER</label>
                       <div className="text-5xl font-mono text-red-500 mb-4 bg-black p-2 rounded border border-red-900/50">
                         {(timer / 1000).toFixed(2)}s
                       </div>
                       
                       {/* ปุ่มจับเวลา START/STOP */}
                       <div className="flex gap-2">
                         <button onClick={toggleTimer}
                           className={`flex-1 px-4 py-3 rounded font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                           ${isTiming 
                             ? 'bg-red-900 hover:bg-red-800 text-red-100 border border-red-700' 
                             : 'bg-green-900 hover:bg-green-800 text-green-100 border border-green-700'}`}>
                            {isTiming ? "⏹ STOP" : "▶ START"}
                         </button>
                         <button onClick={() => { setTimer(0); setIsTiming(false); }}
                           className="flex-1 px-4 py-3 rounded font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 transition-all">
                            ⟲ RESET
                         </button>
                       </div>
                    </div>

                    <div className="mt-auto">
                       <p className="text-xs text-gray-400 mb-1 font-mono">FORMULA: Δ (R + PERIOD)</p>
                       <input type="number" placeholder="Enter Value T" 
                         className="w-full bg-slate-900 border border-cyan-800 p-3 text-white text-lg font-mono focus:border-cyan-500 outline-none rounded"
                         value={userVals.T} onChange={(e) => setUserVals({...userVals, T: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- SCENE 4: FINAL --- */}
        {activeTab === 3 && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-cyan-900/10">
             <h2 className="text-2xl font-bold text-white mb-6">FINAL AUTHENTICATION</h2>
             
             <div className="grid grid-cols-3 gap-4 mb-8 text-center">
               <div className="p-4 bg-slate-800 rounded border border-slate-600">
                 <div className="text-gray-500 text-xs">VAR P</div>
                 <div className="text-2xl text-cyan-400">{userVals.P || "?"}</div>
               </div>
               <div className="p-4 bg-slate-800 rounded border border-slate-600">
                 <div className="text-gray-500 text-xs">VAR R</div>
                 <div className="text-2xl text-cyan-400">{userVals.R || "?"}</div>
               </div>
               <div className="p-4 bg-slate-800 rounded border border-slate-600">
                 <div className="text-gray-500 text-xs">VAR T</div>
                 <div className="text-2xl text-cyan-400">{userVals.T || "?"}</div>
               </div>
             </div>

             <div className="w-full max-w-sm">
               <label className="text-xs text-gray-400 mb-1 block">ENTER CHAIN HASH (Format: PPRRTT - use 2 digits each)</label>
               <input 
                 type="text" 
                 className="w-full bg-black border-2 border-cyan-500 text-center text-3xl p-4 text-white tracking-[0.5em] outline-none focus:shadow-[0_0_20px_cyan]"
                 placeholder="______"
                 maxLength={6}
                 value={finalInput}
                 onChange={(e) => setFinalInput(e.target.value)}
               />
               <button 
                 onClick={handleSubmit}
                 className="w-full mt-4 bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 rounded shadow-[0_0_10px_rgba(0,255,255,0.3)]"
               >
                 VERIFY HASH
               </button>
             </div>

             <div className="mt-6 h-20 w-full max-w-sm overflow-y-auto text-xs font-mono text-red-400">
                {logs.map((l, i) => <div key={i}>{l}</div>)}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TriVariablePuzzle;
