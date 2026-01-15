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

        {/* --- SCENE 2: EAST (WATER) --- */}
        {activeTab === 1 && (
          <div className="w-full h-full flex flex-col p-6 relative">
             <h3 className="text-white border-b border-gray-700 mb-4">OBJ 2: CALCULATE REFRACTION (R)</h3>
             <div className="flex gap-8 h-full">
                {/* Image: Refraction Angle */}
                <div className="w-1/2 bg-blue-900/10 relative h-[300px] border border-blue-500/30 flex items-center justify-center">
                   {/* Laser Beam */}
                   <div className="absolute w-[200px] h-1 bg-green-500 top-1/2 left-10" style={{ transformOrigin: 'right center', transform: 'rotate(-10deg)' }}></div>
                   <div className="absolute w-[200px] h-1 bg-green-500/50 top-1/2 right-[-90px]" style={{ transformOrigin: 'left center', transform: 'rotate(20deg)' }}></div>
                   
                   {/* Interactive Protractor */}
                   <div className="absolute w-[200px] h-[100px] rounded-t-full bg-white/20 border-b-2 border-white backdrop-blur-sm flex justify-center items-end"
                        style={{ transform: `rotate(${protractorAngle}deg)` }}>
                      <div className="w-1 h-2 bg-red-500 absolute bottom-0"></div>
                      <span className="text-xs absolute top-2">{protractorAngle}°</span>
                   </div>
                </div>

                {/* Tools */}
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="bg-slate-900 p-2 border border-slate-600 text-xs">
                     <p>MEASURE THE DEVIATION ANGLE.</p>
                     <p className="text-red-400 mt-2">REQUIREMENT: VARIABLE [P] IS NEEDED.</p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded">
                     <label className="text-xs block mb-2">ROTATE PROTRACTOR</label>
                     <input type="range" min="-90" max="90" value={protractorAngle} onChange={handleRotateProtractor} className="w-full"/>
                  </div>

                  <div className="mt-auto">
                     <p className="text-xs text-gray-400 mb-1">FORMULA: ∇ (P - ANGLE) / 2</p>
                     <input type="number" placeholder="Enter Value R" 
                       className="w-full bg-slate-900 border border-cyan-800 p-2 text-white"
                       value={userVals.R} onChange={(e) => setUserVals({...userVals, R: e.target.value})}
                     />
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* --- SCENE 3: SOUTH (WIND) --- */}
        {activeTab === 2 && (
           <div className="w-full h-full flex flex-col p-6 relative">
              <h3 className="text-white border-b border-gray-700 mb-4">OBJ 3: CALCULATE PERIOD (T)</h3>
              <div className="flex gap-8 h-full">
                 {/* Animation: Pendulum */}
                 <div className="w-1/2 bg-gray-900 relative h-[300px] border border-gray-700 flex justify-center overflow-hidden">
                    <div className="origin-top animate-[swing_4s_infinite_ease-in-out]">
                       <div className="w-1 h-[200px] bg-gray-500 mx-auto"></div>
                       <div className="w-12 h-16 bg-gray-700 rounded border border-gray-500 flex items-center justify-center text-xs">BODY</div>
                    </div>
                    <style>{`@keyframes swing { 0%,100% { transform: rotate(25deg); } 50% { transform: rotate(-25deg); } }`}</style>
                 </div>

                 {/* Tools */}
                 <div className="w-1/2 flex flex-col gap-4">
                    <div className="bg-slate-900 p-2 border border-slate-600 text-xs">
                       <p>COUNT THE OSCILLATIONS (SWINGS).</p>
                       <p className="text-red-400 mt-2">REQUIREMENT: VARIABLE [R] IS NEEDED.</p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded text-center">
                       <div className="text-4xl font-mono text-red-500 mb-2">
                         {(timer / 1000).toFixed(2)}s
                       </div>
                       <button onClick={toggleTimer} className={`px-4 py-2 w-full rounded font-bold ${isTiming ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100'}`}>
                          {isTiming ? "STOP" : "START / RESET"}
                       </button>
                    </div>

                    <div className="mt-auto">
                       <p className="text-xs text-gray-400 mb-1">FORMULA: Δ (R + PERIOD)</p>
                       <input type="number" placeholder="Enter Value T" 
                         className="w-full bg-slate-900 border border-cyan-800 p-2 text-white"
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
