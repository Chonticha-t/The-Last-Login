import { useEffect, useState } from 'react';

const RitualCipherOTP = ({ onUnlock }: { onUnlock: () => void }) => {
  const [rawOTP, setRawOTP] = useState([0, 0, 0, 0]);
  const [inputOTP, setInputOTP] = useState(["", "", "", ""]);
  const [trueOTP, setTrueOTP] = useState("");
  const [status, setStatus] = useState("IDLE");

  useEffect(() => {
    generateNewOTP();
  }, []);

  const generateNewOTP = () => {
    // Fixed answer: 8784
    // Reverse calculate: 8-3=5 (N), 7+2=9 (E), 8÷2=4 (S), 4×2=8 (W)
    const d1 = 5;  // N: 5+3=8
    const d2 = 9;  // E: 9-2=7
    const d3 = 4;  // S: 4×2=8
    const d4 = 8;  // W: 8÷2=4

    setRawOTP([d1, d2, d3, d4]);
    setInputOTP(["", "", "", ""]);
    setStatus("IDLE");

    setTrueOTP("8784");
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
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-sm bg-black border border-gray-700 rounded-xl p-6 mb-8 text-center shadow-2xl relative overflow-hidden">
        <h2 className="text-gray-500 text-xs tracking-[0.3em] mb-4">INCOMING SOUL SIGNAL</h2>
        
        <div className="flex justify-center gap-4 mb-2">
          {rawOTP.map((digit, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-2">{digit}</div>
              
              <div className={`text-[10px] px-2 py-0.5 rounded border 
                ${i===0 ? 'border-amber-700 text-amber-600' : 
                  i===1 ? 'border-blue-700 text-blue-600' : 
                  i===2 ? 'border-gray-600 text-gray-500' : 'border-red-700 text-red-600'}`}>
                {i===0 ? "N (ดิน)" : i===1 ? "E (น้ำ)" : i===2 ? "S (ลม)" : "W (ไฟ)"}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-600 grid grid-cols-2 gap-2 text-left">
          <p>N: "ทับถมเพิ่มพูน (+3)"</p>
          <p>E: "พัดพาหายไป (-2)"</p>
          <p>S: "เงาขยายตัว (x2)"</p>
          <p>W: "ร่างแยกสลาย (÷2)"</p>
        </div>
      </div>

      <div className="w-full max-w-xs">
        <p className="text-center text-xs mb-4 text-green-500">
           {status === "FAIL" ? "CALCULATION ERROR: RITUAL FAILED" : 
            status === "SUCCESS" ? "AUTHENTICATION VERIFIED" : 
            "ENTER PROCESSED RITUAL CODE"}
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
              className={`w-14 h-16 bg-gray-800 text-center text-3xl font-bold rounded-lg border-2 outline-none transition-all
                ${status === "FAIL" ? "border-red-500 text-red-500 animate-pulse" : 
                  status === "SUCCESS" ? "border-green-500 text-green-500" : 
                  "border-gray-600 focus:border-green-500 text-white"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 text-center opacity-30 text-xs">
         SECURE TRANSMISSION PROTOCOL V.4
      </div>

    </div>
  );
};

export default RitualCipherOTP;
