import { useEffect, useState } from 'react';

const RitualCipherOTP = ({ onUnlock }: { onUnlock: () => void }) => {
  const [rawOTP, setRawOTP] = useState([0, 0, 0, 0]);
  const [inputOTP, setInputOTP] = useState(["", "", "", ""]);
  const [trueOTP, setTrueOTP] = useState("");
  const [status, setStatus] = useState("IDLE");
  const [showHint, setShowHint] = useState(false); // เพิ่มสถานะเปิด/ปิดคำใบ้

  useEffect(() => {
    generateNewOTP();
  }, []);

  // --- MATH HELPER FUNCTIONS ---
  const getFactorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const getFibonacci = (n: number): number => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      let temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  };

  const generateNewOTP = () => {
    // Generate Random Inputs
    const d1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const d2 = Math.floor(Math.random() * 6) + 1; // 1-6 (Factorial เยอะเกินจะล้น)
    const d3 = Math.floor(Math.random() * 12) + 1; // 1-12
    const d4 = Math.floor(Math.random() * 8) + 1; // 1-8

    setRawOTP([d1, d2, d3, d4]);
    setInputOTP(["", "", "", ""]);
    setStatus("IDLE");

    // --- HELL MODE LOGIC ---
    // 1. Earth (N): Sigma (Sum 1..n)
    const ans1 = (d1 * (d1 + 1)) / 2 % 10;

    // 2. Water (E): Factorial (n!)
    // Trap: ตั้งแต่ 5! ขึ้นไป หลักหน่วยคือ 0 เสมอ
    const ans2 = getFactorial(d2) % 10;

    // 3. Wind (S): Fibonacci
    // Seq: 0, 1, 1, 2, 3, 5, 8, 13...
    const ans3 = getFibonacci(d3) % 10;

    // 4. Fire (W): Power of 2 (2^n)
    const ans4 = Math.pow(2, d4) % 10;

    const solution = `${ans1}${ans2}${ans3}${ans4}`;
    console.log("Solution:", solution); // แอบดูเฉลยได้ใน Console
    setTrueOTP(solution);
  };

  const handleInput = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newInputs = [...inputOTP];
    newInputs[index] = val.slice(-1);
    setInputOTP(newInputs);

    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const checkOTP = () => {
    const entered = inputOTP.join("");
    if (entered.length < 4) return;

    if (entered === trueOTP) {
      setStatus("SUCCESS");
      setTimeout(onUnlock, 1500);
    } else {
      setStatus("FAIL");
      if (navigator.vibrate) navigator.vibrate(500);
      setTimeout(() => {
        setStatus("IDLE");
        setInputOTP(["", "", "", ""]);
        const firstInput = document.getElementById(`otp-0`);
        if (firstInput) (firstInput as HTMLInputElement).focus();
      }, 1000);
    }
  };

  useEffect(() => {
    if (inputOTP.every(n => n !== "") && status === "IDLE") {
      checkOTP();
    }
  }, [inputOTP, status]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900 to-black"></div>

      <div className="w-full max-w-sm bg-black border border-green-900/50 rounded-xl p-6 mb-8 text-center shadow-[0_0_30px_rgba(0,255,0,0.1)] relative z-10">
        <h2 className="text-green-500 text-xs tracking-[0.3em] mb-6 font-bold animate-pulse">
          SYSTEM_OVERRIDE :: HELL_MODE
        </h2>
        
        {/* RAW CODE DISPLAY */}
        <div className="flex justify-center gap-4 mb-6">
          {rawOTP.map((digit, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Function Label */}
              <div className="text-lg font-bold text-green-400 mb-1">
                {i===0 ? "Σ" : i===1 ? "n!" : i===2 ? "Φ" : "2ⁿ"}
              </div>

              <div className="w-14 h-16 bg-gray-900 border border-green-800 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                {digit}
              </div>
              
              <div className="mt-2 text-[9px] uppercase tracking-widest text-gray-500">
                {i===0 ? "Earth" : i===1 ? "Water" : i===2 ? "Wind" : "Fire"}
              </div>
            </div>
          ))}
        </div>
        
        {/* HINT TOGGLE */}
        <button 
          onClick={() => setShowHint(!showHint)}
          className="text-[10px] text-green-600 border border-green-900 px-4 py-2 rounded hover:bg-green-900/20 transition-all w-full mb-2"
        >
          {showHint ? "▼ ปิดคัมภีร์ (Hide Manual)" : "▶ เปิดคัมภีร์สูตร (Show Manual)"}
        </button>

        {showHint && (
          <div className="mt-2 pt-4 border-t border-green-900/30 text-[10px] text-gray-400 grid grid-cols-1 gap-2 text-left bg-gray-900/50 p-3 rounded">
            <p><span className="text-amber-500 font-bold">Earth (Σ):</span> ผลรวม 1 ถึง n (เช่น 4 → 1+2+3+4=10 → 0)</p>
            <p><span className="text-blue-500 font-bold">Water (!):</span> ผลคูณ 1 ถึง n (เช่น 3 → 1x2x3=6)</p>
            <p><span className="text-gray-400 font-bold">Wind (Φ):</span> ลำดับฟีโบนัชชี (0, 1, 1, 2, 3, 5...)</p>
            <p><span className="text-red-500 font-bold">Fire (2ⁿ):</span> 2 ยกกำลัง n (เช่น 3 → 8)</p>
            <p className="text-center text-green-500 mt-2">* ใช้เฉพาะเลขหลักหน่วย (Mod 10) *</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs relative z-10">
        <p className="text-center text-xs mb-4 transition-colors duration-300 min-h-[1rem] font-bold tracking-wider"
           style={{color: status === "FAIL" ? "#ef4444" : status === "SUCCESS" ? "#4ade80" : "#6b7280"}}>
           {status === "FAIL" ? ">> CALCULATION ERROR <<" : 
            status === "SUCCESS" ? ">> SEQUENCE VERIFIED <<" : 
            "AWAITING INPUT..."}
        </p>

        <div className="flex justify-between gap-2">
          {inputOTP.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="tel"
              value={digit}
              onChange={(e) => handleInput(e.target.value, i)}
              maxLength={1}
              placeholder="_"
              className={`w-14 h-16 bg-black text-center text-3xl font-mono font-bold rounded-lg border-2 outline-none transition-all
                ${status === "FAIL" ? "border-red-500 text-red-500 shadow-[0_0_15px_red]" : 
                  status === "SUCCESS" ? "border-green-500 text-green-500 shadow-[0_0_15px_#4ade80]" : 
                  "border-green-900 focus:border-green-500 text-white shadow-[0_0_10px_rgba(0,255,0,0.2)]"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 text-center relative z-10">
         <button onClick={generateNewOTP} className="text-[10px] text-green-800 hover:text-green-500 transition-colors">
            [ REGENERATE_PARAMETERS ]
         </button>
      </div>

    </div>
  );
};

export default RitualCipherOTP;