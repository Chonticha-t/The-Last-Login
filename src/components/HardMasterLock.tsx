import { useState } from 'react';

// แปลข้อมูลในตารางเป็นภาษาไทยเพื่อให้ผู้เล่นอ่านเข้าใจ
const FORENSIC_TABLE = [
  { cat: 'สาเหตุ', find: 'ขาดอากาศ (ทั่วไป)', code: '8A' },
  { cat: 'สาเหตุ', find: 'ขาดอากาศ (ดินอุดกั้น)', code: '8E' }, // Earth Hint
  { cat: 'สาเหตุ', find: 'จมน้ำ (น้ำ)', code: '8W' },       // Water Hint
  { cat: 'ร่องรอย', find: 'รอยเจาะ (แมลง)', code: '2B' },
  { cat: 'ร่องรอย', find: 'รอยเจาะ (เข็ม)', code: '2N' },
  { cat: 'ร่องรอย', find: 'แผลฉีกขาด (ของมีคม)', code: '2C' },
  { cat: 'วัตถุ', find: 'เชือก (ป่าน)', code: '5H' },
  { cat: 'วัตถุ', find: 'เชือก (ลวด)', code: '5W' },
  { cat: 'วัตถุ', find: 'เชือก (ไนลอน)', code: '5Y' },
];

const HardMasterLock = ({ onUnlock }: { onUnlock: () => void }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const CORRECT_HASH = "E8O25Y";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = input.toUpperCase().replace(/[\s-]/g, '');

    console.log('Input:', cleanInput, 'Expected:', CORRECT_HASH, 'Match:', cleanInput === CORRECT_HASH);

    if (cleanInput === CORRECT_HASH) {
      onUnlock();
    } else {
      // แปลข้อความ Alert และ Hint ต่างๆ
      if (cleanInput === "8E2N5Y") {
        alert("แจ้งเตือนความปลอดภัย: คุณละเลยโปรโตคอลเรื่อง 'เวลา' และ 'ธาตุ'");
      } else if (cleanInput === "E8N2Y5") {
        alert("แจ้งเตือนความปลอดภัย: จำเป็นต้องเปลี่ยนผันตามธาตุ \n(คุณได้เลื่อนตัวอักษรของธาตุน้ำหรือยัง? คุณได้สลับด้านธาตุลมหรือไม่?)");
      } else if (cleanInput.includes("N2")) {
        alert("คำใบ้: ธาตุน้ำจะไหลไปข้างหน้า... (ตัวอักษร +1)");
      }
      
      setError(true);
      setShake(true);
      setInput('');
      setTimeout(() => {
        setError(false);
        setShake(false);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-gray-900/90 border-2 border-green-900 p-8 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.1)] font-sans">
      
      <div className="flex justify-between items-end border-b-2 border-green-800 pb-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-[0.1em] text-green-400">ระบบล็อค 3 ธาตุ (TRI-ELEMENTAL)</h2>
          <p className="text-xs text-green-700 mt-1">การยืนยันตัวตนทางชีวภาพ: สำเร็จ</p>
        </div>
        <div className="text-4xl text-green-500 animate-pulse">🔒</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/50 p-4 rounded border border-green-900 text-sm">
          <h3 className="text-green-400 font-bold mb-2 border-b border-green-900 pb-1">โปรโตคอลการถอดรหัส</h3>
          <ul className="space-y-2 text-gray-400">
            <li>1. <span className="text-white">ค้นหารหัส (CODE)</span> จากตารางโดยใช้ผลชันสูตรของทุกศพ</li>
            <li>2. <span className="text-yellow-400">ตรวจสอบเวลา:</span> หากเวลา 00:00-05:59 น. → <b>สลับตัวเลข</b> (เช่น 8E → E8)</li>
            <li>3. <span className="text-cyan-400">ทำตามกฎ:</span> ตามช่องข้างล่าง</li>
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-orange-900/30 p-1 rounded text-orange-400 border border-orange-900">
              ดิน (EARTH)<br/><span className="text-white">คงที่ (ไม่เปลี่ยน)</span>
            </div>
            <div className="bg-blue-900/30 p-1 rounded text-blue-400 border border-blue-900">
              น้ำ (WATER)<br/><span className="text-white">ตัวอักษร +1</span>
            </div>
            <div className="bg-gray-700/30 p-1 rounded text-gray-400 border border-gray-600">
              ลม (WIND)<br/><span className="text-white">สลับอีกครั้ง</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-green-900/10 p-4 rounded border border-green-500/30">
          <p className="mb-4 text-green-300 text-sm">กรอกรหัสแฮช 6 หลักสุดท้าย</p>
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="______"
              maxLength={6}
              className={`w-full bg-black border-b-4 text-center text-4xl py-2 text-green-400 outline-none tracking-[0.5em] uppercase placeholder-green-900/30 transition-all font-mono
                ${shake ? 'border-red-500 text-red-500 animate-shake' : 'border-green-600 focus:border-green-400'}
              `}
            />
          </form>
          {error && <p className="text-red-500 text-xs mt-2 animate-pulse">การเข้าถึงถูกปฏิเสธ: ลำดับไม่ถูกต้อง</p>}
        </div>
      </div>

      <div className="border-t border-green-900 pt-4">
        <p className="text-xs text-gray-500 mb-2 text-center">- ผลชันสูตร -</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {FORENSIC_TABLE.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center px-3 py-2 bg-gray-900 hover:bg-gray-800 border-l-2 border-transparent hover:border-green-500 transition-colors">
              <span className="text-gray-400">{item.find}</span>
              <span className="font-mono font-bold text-green-600 bg-green-900/10 px-2 rounded">{item.code}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default HardMasterLock;