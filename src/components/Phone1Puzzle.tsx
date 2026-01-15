import { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface Phone1PuzzleProps {
  passcode: string;
  dates: string;
  time: string;
  onUnlock: () => void;
  onClose: () => void;
}

const Phone1Puzzle = ({ passcode, dates, time, onUnlock, onClose }: Phone1PuzzleProps) => {
  const [phone1Input, setPhone1Input] = useState('');
  const [phone1Error, setPhone1Error] = useState(false);
  const [phone1ShowHint, setPhone1ShowHint] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handlePhone1Unlock = (num: string) => {
    if (phone1Input.length < 4) {
      const newVal = phone1Input + num;
      setPhone1Input(newVal);
      if (newVal.length === 4) {
        if (newVal === passcode) {
          setIsUnlocked(true);
          onUnlock();
        } else {
          setPhone1Error(true);
          setTimeout(() => {
            setPhone1Input('');
            setPhone1Error(false);
          }, 500);
        }
      }
    }
  };

  return (
    <div className="h-full flex items-center justify-center gap-8 px-4">
      {/* Phone Device */}
      <div className="bg-black rounded-[3rem] border-8 border-gray-800 overflow-hidden relative shadow-2xl w-full max-w-sm h-[90vh]">
        {!isUnlocked ? (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-[url('/api/placeholder/400/800')] bg-cover">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {/* Back Button */}
            <button 
              onClick={onClose} 
              className="absolute top-12 left-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="z-10 w-full">
              <div className="text-center mb-8">
                <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                <h3 className="text-white text-xl font-light">Enter Passcode</h3>
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < phone1Input.length ? 'bg-white' : 'bg-gray-600'} ${phone1Error ? 'animate-pulse bg-red-500' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                  <button key={n} onClick={() => handlePhone1Unlock(n.toString())} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-light transition-all active:scale-95">
                    {n}
                  </button>
                ))}
                <div />
                <button onClick={() => handlePhone1Unlock('0')} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-light transition-all active:scale-95">0</button>
                <button onClick={() => setPhone1Input('')} className="w-16 h-16 flex items-center justify-center text-white">Del</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gray-900 flex flex-col">
            <div className="bg-green-700 p-4 pt-8 text-white flex items-center shadow-md">
              <button onClick={onClose}><X /></button>
              <span className="ml-4 font-bold">Group Chat (3)</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#1e1e1e]">
              {/* Chat Content */}
              {[
                 { u: 'เพื่อนตุ๊ (ชาย 2)', m: 'มึงรู้ปะ มหาลัยเราแม่งปิดเรื่องมันเงียบเลย', self: false },
                 { u: 'เพื่อนตุ๊ (ชาย 2)', m: 'ไม่มีใครรู้ด้วยซ้ำว่ามันตาย เหมือนมีแค่พวกเรานี่แหละที่รู้', self: false },
                 { u: 'เพื่อนตุ๊ (ชาย 1)', m: 'เออ กูนี่แหละที่ยิ่งคิดยิ่งแปลก การตายของมันมันดูเร็วไปหน่อย', self: true },
                 { u: 'เพื่อนตุ๊ (หญิง)', m: 'งั้นอย่าเพิ่งสรุปกันเองดีกว่า ลองดูข้อมูลก่อนมั้ย', self: false },
                 { u: 'เพื่อนตุ๊ (หญิง)', m: 'ก็ที่เกิดเหตุ เวลาที่เกิดเรื่อง แล้วก็คนที่อยู่ใกล้มันช่วงนั้น', self: false },
                 { u: 'เพื่อนตุ๊ (ชาย 2)', m: 'งั้นเริ่มจากจุดเกิดเหตุก่อน ดูให้รู้ไปเลยว่ามันเกิดอะไรขึ้นกันแน่', self: false },
              ].map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.self ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-400 mb-1 px-1">{msg.u}</span>
                  <div className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.self ? 'bg-green-600 text-white rounded-tr-none' : 'bg-gray-700 text-gray-200 rounded-tl-none'}`}>
                    {msg.m}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hint Panel - Outside Phone */}
      {!isUnlocked && (
        <div className="hidden lg:block w-80 bg-gray-900/80 border border-gray-700 rounded-xl p-6 shadow-2xl">
          <h3 className="text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <span>💡</span> LUNAR CALENDAR HINT
          </h3>
          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p className="text-gray-400">
              <span className="font-semibold">วันจันทรคติ:</span> {dates}<br/>
              <span className="font-semibold">เวลาตาย:</span> {time} (ก่อนรุ่งสาง)
            </p>
            <p className="text-amber-400 text-[11px] italic bg-amber-900/20 p-2 rounded border-l-2 border-amber-600">
              * ก่อน 6 โมงเช้า = ยังนับเป็นคืนวันก่อนหน้า
            </p>
            <p className="text-blue-400 text-[11px] italic bg-amber-900/20 p-2 rounded border-l-2 border-blue-600">
             hint: วันที่รวมต่อด้วยเวลา
            </p>
            <button 
              onClick={() => setPhone1ShowHint(!phone1ShowHint)}
              className="text-[11px] text-blue-400 hover:text-blue-300 underline w-full text-left"
            >
              {phone1ShowHint ? '▼ ซ่อนคำใบ้' : '▶ ดูคำใบ้เพิ่มเติม'}
            </button>
            {phone1ShowHint && (
              <div className="mt-3 p-3 bg-black/40 rounded-lg text-[11px] border border-gray-700">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-2 text-gray-400 font-semibold">วันที่</th>
                      <th className="pb-2 text-gray-400 font-semibold">วันจันทรคติ</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800">
                      <td className="py-2">5 ม.ค.</td>
                      <td className="py-2">ขึ้น 7 ค่ำ</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2">12 ม.ค.</td>
                      <td className="py-2">ขึ้น 14 ค่ำ</td>
                    </tr>
                    <tr>
                      <td className="py-2">20 ม.ค.</td>
                      <td className="py-2">แรม 7 ค่ำ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Phone1Puzzle;
