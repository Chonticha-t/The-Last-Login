import { useEffect, useState } from 'react';
import { 
  Lock, Smartphone, Monitor, Usb, 
  FileText, Image as ImageIcon, 
  Fingerprint, ShieldAlert,
  ChevronUp, ChevronRight, ChevronDown, ChevronLeft,
  X
} from 'lucide-react';

// --- Types ---
type DeviceType = 'NONE' | 'PHONE1' | 'PC' | 'PHONE2' | 'USB';
type FingerprintFile = { id: string; name: string; src: string; isMatch: boolean };

// --- Mock Data & Assets ---
// ในการใช้งานจริง ให้เปลี่ยน path ของรูปภาพให้ตรงกับ assets ของคุณ
const ASSETS = {
  fingerprints: [
    { id: 'fp1', name: 'นิ้วมือ1.webp', src: '/api/placeholder/100/100', isMatch: false }, // รูปสมมติ
    { id: 'fp2', name: 'นิ้วมือ2.webp', src: '/api/placeholder/100/100', isMatch: false },
    { id: 'fp3', name: 'นิ้วมือ3.webp', src: '/api/placeholder/100/100', isMatch: true }, // สมมติให้นิ้วนี้ถูก
    { id: 'fp4', name: 'นิ้วมือ4.webp', src: '/api/placeholder/100/100', isMatch: false },
  ],
  chemical: '/api/placeholder/600/400', // รูปสูตรเคมี
  elements: '/api/placeholder/600/200', // รูปธาตุ 4 ทิศ (Gemini Image)
  video: 'คลิปยาม.mp4'
};

const STAGE_DATA = {
  phone1: {
    dates: "5, 12, 20",
    time: "03:00",
    passcode: "2503"
  },
  ritualPoem: `๏ ถึงวันโกน มืดมิด ปิดดวงแก้ว
ยามตีสาม ครบแล้ว ตามกำหนด เปิดประตูนรก บานที่หก สะกดบท เร่งร่ายมนตร์ สังเวยพจน์ กฎแห่งตาย 

๏ ทิศอุดร ป้อนธรณี พลีธาตุดิน
ฝังกายสิ้น ลงลึก ผนึกหมาย เหลือเพียงเศียร พ้นพื้น ยืนท้าทาย ดูดชีพวาย ใต้หล้า กลับมาเป็น 

๏ บูรพา บูชาชล ดลธาตุน้ำ
ปล่อยศพลอย ทวนลำ ที่เชี่ยวเข็ญ ให้กระแส แทรกซึม ดื่มความเย็น ชะล้างเข็ญ เลือดหมุน อุ่นกายา 

๏ ทิศทักษิณ ถิ่นวาโย โชว์ธาตุลม
แขวนศพสม ยอดไม้ ไว้วเวหา ให้ลมพัด ยัดเยียด เบียดวิญญา คืนลมปราณ สู่ปุระ อุระตน

๏ ปัจจิม ริมอัคคี พลีธาตุไฟ 
เผาร่างให้ เกรียมกรม สมเหตุผล กระตุ้นเนื้อ ที่มอดไหม้ ให้ร้อนรน ปลุกชีพคน ให้ฟื้น ตื่นนิทราฯ`
};

// --- Logic Puzzle (Ritual Keypad) ---
const LogicOtpPuzzle = ({ onUnlock }: { onUnlock: () => void }) => {
  const [phase, setPhase] = useState(0); // 0=Earth,1=Water,2=Wind,3=Fire
  const [feedback, setFeedback] = useState('');
  const [wrongShake, setWrongShake] = useState(false);
  const [litNum, setLitNum] = useState(0);

  const earthChallenge = { show: 2, answer: 8 };
  const waterChallenge = { show: 6, answer: 9 };
  const windChallenge = { shadow: 3, answer: 3 };
  const fireChallenge = { answer: 5 };

  useEffect(() => {
    if (phase === 3) {
      const interval = setInterval(() => {
        setLitNum(prev => (prev % 9) + 1);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handlePress = (num: number) => {
    let isCorrect = false;
    if (phase === 0) isCorrect = num === earthChallenge.answer;
    if (phase === 1) isCorrect = num === waterChallenge.answer;
    if (phase === 2) isCorrect = num === windChallenge.answer;
    if (phase === 3) isCorrect = num === fireChallenge.answer;

    if (isCorrect) {
      setFeedback('CORRECT');
      setTimeout(() => {
        setFeedback('');
        if (phase < 3) {
          setPhase(p => p + 1);
        } else {
          onUnlock();
        }
      }, 500);
    } else {
      setFeedback('WRONG');
      setWrongShake(true);
      setTimeout(() => {
        setFeedback('');
        setWrongShake(false);
      }, 450);
    }
  };

  const renderEarth = () => (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-1 mb-3 p-2 border border-amber-800 rounded opacity-60 pointer-events-none">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <div key={n} className={`w-8 h-8 flex items-center justify-center border border-amber-900 rounded text-xs ${n === earthChallenge.show ? 'bg-amber-600 text-white font-bold' : 'text-gray-600'}`}>
            {n === earthChallenge.show ? n : '•'}
          </div>
        ))}
      </div>
      <p className="text-amber-500 font-bold text-lg">TARGET: {earthChallenge.show}</p>
      <p className="text-[11px] text-amber-600 mt-1">สิ่งที่ฝังอยู่ใต้ดิน</p>
    </div>
  );

  const renderWater = () => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="text-6xl font-bold text-blue-200 opacity-50 blur-[1px]">{waterChallenge.show}</div>
        <div className="absolute top-full left-0 w-full h-full text-6xl font-bold text-blue-500 opacity-80" style={{ transform: 'scaleY(-1) skewX(-10deg)', filter: 'blur(0.5px)' }}>
          {waterChallenge.show}
        </div>
      </div>
      <div className="w-24 h-1 bg-blue-500/50 mt-1 blur-sm" />
      <p className="text-[11px] text-blue-400 mt-3">เงาน้ำกลับด้าน</p>
    </div>
  );

  const renderWind = () => (
    <div className="flex flex-col items-center h-28 justify-end relative w-full">
      <div className="absolute top-0 origin-top animate-[swing_2s_infinite_ease-in-out]">
        <div className="h-16 w-1 bg-gray-600 mx-auto" />
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-500 blur-md select-none">?</div>
      </div>
      <div className="mb-2 text-4xl text-black font-bold tracking-[0.4em] opacity-80 scale-y-50 skew-x-6 blur-[1px]" style={{ textShadow: '0 0 6px rgba(0,0,0,0.8)' }}>
        {windChallenge.shadow}
      </div>
      <p className="text-[11px] text-gray-500">เชื่อเงา ไม่เชื่อวัตถุ</p>
    </div>
  );

  const renderFire = () => (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 gap-2 mb-1 pointer-events-none">
        {[1,2,3,4,5,6,7,8,9].map(n => {
          const isAnswer = n === fireChallenge.answer;
          const isLit = !isAnswer && n === litNum;
          return (
            <div key={n} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-75 ${isAnswer ? 'bg-gray-900 border border-gray-800' : isLit ? 'bg-red-500 shadow-[0_0_10px_red] border-red-400' : 'bg-gray-800 border-gray-700'}`} />
          );
        })}
      </div>
      <p className="text-[11px] text-red-500">ในแสงสว่าง จงหาสิ่งที่ดับสูญ</p>
    </div>
  );

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 shadow-xl relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 text-[10px] font-mono">
          {['EARTH','WATER','WIND','FIRE'].map((t,i) => (
            <span key={t} className={`px-2 py-1 rounded border ${i === phase ? 'border-white bg-white text-black font-bold' : i < phase ? 'border-green-500 text-green-400' : 'border-gray-700 text-gray-500'}`}>{t}</span>
          ))}
        </div>
        <span className="text-[10px] text-gray-500">Ritual Keypad</span>
      </div>

      <div className="w-full h-48 bg-gray-950 border border-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden p-4 relative">
        {phase === 0 && renderEarth()}
        {phase === 1 && renderWater()}
        {phase === 2 && renderWind()}
        {phase === 3 && renderFire()}
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <span className={`text-xl font-bold ${feedback === 'CORRECT' ? 'text-green-500' : 'text-red-500'}`}>{feedback}</span>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-3 gap-3 ${wrongShake ? 'animate-shake' : ''}`}>
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <button
            key={num}
            onClick={() => handlePress(num)}
            className="w-full h-12 bg-gray-800 rounded-full text-lg font-bold border border-gray-600 shadow-[0_4px_0_#374151] active:shadow-none active:translate-y-1 active:bg-gray-700 transition-all text-white"
          >
            {num}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-gray-500 text-center leading-relaxed">
        จงอย่าเชื่อสิ่งที่ตาเห็น — ใช้กลอนนำทางหา PIN เพื่อปลดล็อก
      </p>

      <style>{`
        .animate-shake { animation: shake 0.35s ease-in-out; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px);} 75% { transform: translateX(4px);} }
        @keyframes swing { 0%,100% { transform: rotate(16deg);} 50% { transform: rotate(-16deg);} }
      `}</style>
    </div>
  );
};

const Stage2Investigation = ({ onComplete }: { onComplete: () => void }) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('NONE');
  const [unlockedDevices, setUnlockedDevices] = useState<string[]>([]);
  
  // --- Phone 1 State ---
  const [phone1Input, setPhone1Input] = useState('');
  const [phone1Error, setPhone1Error] = useState(false);
  const [phone1ShowHint, setPhone1ShowHint] = useState(false);

  // --- PC State ---
  const [pcStage, setPcStage] = useState<'LOCKED' | 'SCANNING' | 'DESKTOP'>('LOCKED');
  const [selectedFingerprint, setSelectedFingerprint] = useState<FingerprintFile | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'FAILED'>('IDLE');

  // --- USB State ---
  const [usbStep, setUsbStep] = useState<'INSERT' | 'LOCATION' | 'UNLOCKED'>('INSERT');
  const [directionSequence, setDirectionSequence] = useState<string[]>([]);
  const [videoError, setVideoError] = useState(false);
  const [pcTerminalOpen, setPcTerminalOpen] = useState(false);
  const [pcWindow, setPcWindow] = useState<'NONE' | 'PROJECT'>('NONE');
  const [pcPuzzleCleared, setPcPuzzleCleared] = useState(false);
  const [pcPuzzleReset, setPcPuzzleReset] = useState(0);
  const [pcTerminalLines, setPcTerminalLines] = useState<string[]>([
    'tu-macbook-pro:~$ type "help" เพื่อดูคำสั่งที่ใช้ได้'
  ]);
  const [pcCommand, setPcCommand] = useState('');
  
  // Sequence based on prompt: North(Earth) -> East(Wind) -> South(Wind)
  // แม้ในกลอน East=Water แต่โจทย์ระบุลำดับการตายเป็น เหนือ->ตะวันออก->ใต้
  const CORRECT_SEQUENCE = ['UP', 'RIGHT', 'DOWN']; 

  // --- Handlers ---

  const handlePhone1Unlock = (num: string) => {
    if (phone1Input.length < 4) {
      const newVal = phone1Input + num;
      setPhone1Input(newVal);
      if (newVal.length === 4) {
        if (newVal === STAGE_DATA.phone1.passcode) {
          setUnlockedDevices(prev => [...prev, 'PHONE1']);
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

  const handleFingerprintScan = () => {
    if (!selectedFingerprint || !pcPuzzleCleared) return;
    setScanStatus('SCANNING');
    setScanProgress(0);

    // Simulation of scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (selectedFingerprint.isMatch) {
            setScanStatus('SUCCESS');
            setTimeout(() => {
                setUnlockedDevices(prev => [...prev, 'PC']);
                setPcStage('DESKTOP');
            }, 1500);
          } else {
            setScanStatus('FAILED');
            setTimeout(() => setScanStatus('IDLE'), 2000);
          }
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const handleDirectionInput = (dir: string) => {
    const newSeq = [...directionSequence, dir];
    setDirectionSequence(newSeq);
    
    // Check match dynamically or wait for 3 inputs
    if (newSeq.length === CORRECT_SEQUENCE.length) {
        if (JSON.stringify(newSeq) === JSON.stringify(CORRECT_SEQUENCE)) {
            setTimeout(() => {
                setUnlockedDevices(prev => [...prev, 'USB']);
                setUsbStep('UNLOCKED');
            }, 500);
        } else {
            // Reset on wrong sequence
            setTimeout(() => setDirectionSequence([]), 500);
        }
    }
  };

  const appendTerminal = (lines: string | string[]) => {
    setPcTerminalLines(prev => [...prev, ...(Array.isArray(lines) ? lines : [lines])]);
  };

  const handlePcCommandSubmit = () => {
    const cmd = pcCommand.trim();
    if (!cmd) return;
    const prompt = `tu-macbook-pro:~$ ${cmd}`;
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      appendTerminal([
        prompt,
        'คำสั่งที่ใช้ได้: help, clear, ipconfig, netstat -ano | find "8080"'
      ]);
    } else if (lower === 'clear') {
      setPcTerminalLines(['tu-macbook-pro:~$ type "help" เพื่อดูคำสั่งที่ใช้ได้']);
    } else if (lower === 'ipconfig') {
      appendTerminal([
        prompt,
        'IPv4 Address . . . . . . . . . . . : 192.168.1.10',
        'Subnet Mask  . . . . . . . . . . . : 255.255.255.0',
        'Default Gateway . . . . . . . . . . : 192.168.1.1'
      ]);
    } else if (lower === 'netstat -ano | find "8080"') {
      appendTerminal([
        prompt,
        'TCP    192.168.1.10:8080   0.0.0.0:0   LISTENING   4820'
      ]);
    } else {
      appendTerminal([prompt, `bash: ${cmd}: command not found`]);
    }
    setPcCommand('');
  };

  // --- Render Components ---

  const renderDashboard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 max-w-6xl mx-auto h-full content-center">
      {/* Phone 1 */}
      <button 
        onClick={() => setActiveDevice('PHONE1')}
        className="group relative bg-gray-900 border-2 border-gray-700 hover:border-blue-500 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-105"
      >
        <Smartphone className={`w-16 h-16 ${unlockedDevices.includes('PHONE1') ? 'text-blue-400' : 'text-gray-500'}`} />
        <span className="text-white font-bold tracking-widest">DEVICE: FRIEND_1</span>
        {unlockedDevices.includes('PHONE1') && <span className="absolute top-4 right-4 text-green-500 text-xs">UNLOCKED</span>}
      </button>

      {/* PC */}
      <button 
        onClick={() => {
          setActiveDevice('PC');
          if (unlockedDevices.includes('PC')) {
            setPcStage('DESKTOP');
            setPcWindow('NONE');
            setPcPuzzleCleared(true);
          }
          else {
            setPcStage('LOCKED');
            setPcPuzzleCleared(false);
            setPcPuzzleReset(prev => prev + 1);
            setSelectedFingerprint(null);
            setScanStatus('IDLE');
            setScanProgress(0);
          }
        }}
        className="group relative bg-gray-900 border-2 border-gray-700 hover:border-purple-500 rounded-xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-105"
      >
        <Monitor className={`w-16 h-16 ${unlockedDevices.includes('PC') ? 'text-purple-400' : 'text-gray-500'}`} />
        <span className="text-white font-bold tracking-widest">DEVICE: TU_MAC</span>
        {unlockedDevices.includes('PC') && <span className="absolute top-4 right-4 text-green-500 text-xs">UNLOCKED</span>}
      </button>

      {/* Phone 2 */}
      <button 
        onClick={() => setActiveDevice('PHONE2')}
        className="group relative bg-gray-900 border-2 border-gray-700 hover:border-yellow-500 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-105"
      >
        <Smartphone className={`w-16 h-16 ${unlockedDevices.includes('PHONE2') ? 'text-yellow-400' : 'text-yellow-700'}`} />
        <span className="text-white font-bold tracking-widest">DEVICE: FRIEND_2</span>
        <span className="text-[10px] text-gray-500">(NO PASSCODE)</span>
      </button>

      {/* USB */}
      <button 
        onClick={() => {
          setActiveDevice('USB');
          if (unlockedDevices.includes('USB')) {
            setUsbStep('UNLOCKED');
          }
        }}
        className="group relative bg-gray-900 border-2 border-gray-700 hover:border-red-500 rounded-lg p-6 flex flex-col items-center gap-4 transition-all hover:scale-105"
      >
        <Usb className={`w-16 h-16 ${unlockedDevices.includes('USB') ? 'text-red-500' : 'text-gray-500'}`} />
        <span className="text-white font-bold tracking-widest">DEVICE: SECURITY_KEY</span>
        {unlockedDevices.includes('USB') && <span className="absolute top-4 right-4 text-green-500 text-xs">BREACHED</span>}
      </button>
    </div>
  );

  const renderPhone1 = () => (
    <div className="h-full flex items-center justify-center gap-8 px-4">
      {/* Phone Device */}
      <div className="bg-black rounded-[3rem] border-8 border-gray-800 overflow-hidden relative shadow-2xl w-full max-w-sm h-[90vh]">
        {!unlockedDevices.includes('PHONE1') ? (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-[url('/api/placeholder/400/800')] bg-cover">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {/* Back Button */}
            <button 
              onClick={() => setActiveDevice('NONE')} 
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
              <button onClick={() => setActiveDevice('NONE')}><X /></button>
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
      {!unlockedDevices.includes('PHONE1') && (
        <div className="hidden lg:block w-80 bg-gray-900/80 border border-gray-700 rounded-xl p-6 shadow-2xl">
          <h3 className="text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <span>💡</span> LUNAR CALENDAR HINT
          </h3>
          <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p className="text-gray-400">
              <span className="font-semibold">วันจันทรคติ:</span> {STAGE_DATA.phone1.dates}<br/>
              <span className="font-semibold">เวลาตาย:</span> {STAGE_DATA.phone1.time} (ก่อนรุ่งสาง)
            </p>
            <p className="text-amber-400 text-[11px] italic bg-amber-900/20 p-2 rounded border-l-2 border-amber-600">
              * ก่อน 6 โมงเช้า = ยังนับเป็นคืนวันก่อนหน้า
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

  const renderPC = () => (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden flex flex-col relative border border-gray-700">
        <div className="h-8 bg-gray-800 flex items-center px-4 space-x-2 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400 transition-colors" onClick={() => { setActiveDevice('NONE'); setPcWindow('NONE'); setPcPuzzleCleared(false); }} title="Close" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-400 text-xs ml-4">Tu_MacBook_Pro — System Access</span>
      </div>

      {pcStage === 'LOCKED' || pcStage === 'SCANNING' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900 text-center relative">
            {/* Back Button */}
            <button 
              onClick={() => { setActiveDevice('NONE'); setPcPuzzleCleared(false); }} 
              className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex items-center gap-2 border border-gray-700"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-mono">ESC</span>
            </button>
            <h2 className="text-2xl font-mono text-purple-400 mb-2 tracking-widest uppercase">Biometric Auth Required</h2>
            <p className="text-gray-500 mb-8 text-sm">System Locked. Identify user fingerprint to proceed.</p>
          <div className="w-full flex flex-col xl:flex-row gap-8 items-start">
            <div className="w-full xl:w-[420px]">
            <LogicOtpPuzzle key={pcPuzzleReset} onUnlock={() => setPcPuzzleCleared(true)} />
            <div className="mt-3 text-xs text-center text-gray-400">
              {pcPuzzleCleared ? 'คีย์แพดสำเร็จแล้ว — สแกนลายนิ้วมือได้' : 'ปลดล็อกคีย์แพดพิธีกรรมก่อนจะเปิดสแกนเนอร์'}
            </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-12 items-center flex-1">
              {!pcPuzzleCleared && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm border border-purple-900/40 rounded-lg flex items-center justify-center text-purple-200 text-sm font-semibold z-10">
                Solve Ritual Keypad first
              </div>
              )}
              {/* Fingerprint Scanner UI */}
              <div className="relative w-64 h-64 border-2 border-dashed border-purple-500/30 rounded-lg bg-black/50 flex items-center justify-center overflow-hidden">
                {/* Scanning Beam */}
                {scanStatus === 'SCANNING' && (
                   <div className="absolute w-full h-1 bg-purple-500 top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#a855f7]" />
                )}
                      
                {/* Placeholder for "Latent Print" */}
                <Fingerprint className="w-32 h-32 text-gray-700 absolute opacity-30" />
                      
                {/* Selected Print Overlay */}
                {selectedFingerprint && (
                  <div className={`transition-all duration-500 ${scanStatus === 'SCANNING' ? 'opacity-100' : 'opacity-80'}`}>
                     <Fingerprint className={`w-32 h-32 ${scanStatus === 'SUCCESS' ? 'text-green-500' : scanStatus === 'FAILED' ? 'text-red-500' : 'text-purple-400'}`} />
                     <span className="absolute bottom-2 left-0 right-0 text-xs text-white bg-black/60 px-2 py-1">{selectedFingerprint.name}</span>
                  </div>
                )}
                      
                {/* Status Text */}
                {scanStatus === 'SCANNING' && (
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                     <span className="text-purple-400 font-mono text-xl font-bold">{scanProgress}%</span>
                   </div>
                )}
              </div>

              {/* File Selection */}
              <div className="w-64 space-y-3">
                <p className="text-left text-xs text-gray-400 uppercase font-bold mb-2">Select Source File (Assets)</p>
                {ASSETS.fingerprints.map((fp) => (
                  <button
                    key={fp.id}
                    onClick={() => {
                      setScanStatus('IDLE');
                      setSelectedFingerprint(fp);
                    }}
                    className={`w-full flex items-center p-3 rounded border ${selectedFingerprint?.id === fp.id ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700 hover:border-gray-500'} transition-all`}
                  >
                    <ImageIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-300">{fp.name}</span>
                  </button>
                ))}
                <button 
                  onClick={handleFingerprintScan}
                  disabled={!selectedFingerprint || scanStatus === 'SCANNING' || !pcPuzzleCleared}
                  className={`w-full py-3 mt-4 rounded font-bold uppercase tracking-wider text-sm ${(!selectedFingerprint || !pcPuzzleCleared) ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50'}`}
                >
                  {!pcPuzzleCleared ? 'Solve keypad first' : scanStatus === 'SCANNING' ? 'Analyzing...' : 'Execute Scan'}
                </button>
                {scanStatus === 'FAILED' && <p className="text-red-500 text-xs mt-2 animate-pulse">MISMATCH: Ridge patterns do not align.</p>}
              </div>
            </div>
          </div>
        </div>
        ) : (
        <div className="flex-1 bg-[url('/api/placeholder/1920/1080')] bg-cover relative min-h-[70vh] md:min-h-[78vh]">
          {/* Desktop Icons */}
          <div className="p-8 grid grid-cols-1 gap-8 w-32">
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => setPcWindow('PROJECT')}>
              <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-400/50 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-yellow-500/40">
                <div className="relative">
                  <FileText className="text-yellow-200 w-8 h-8" />
                  <ShieldAlert className="w-4 h-4 text-red-500 absolute -top-1 -right-1" />
                </div>
              </div>
              <span className="text-white text-xs mt-2 font-medium drop-shadow-md bg-black/50 px-2 rounded">Project_X_Research</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => setPcTerminalOpen(true)}>
              <div className="w-16 h-16 bg-green-500/20 border border-green-400/50 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-green-500/40">
                <Monitor className="text-green-200 w-8 h-8" />
              </div>
              <span className="text-white text-xs mt-2 font-medium drop-shadow-md bg-black/50 px-2 rounded">Terminal</span>
            </div>
          </div>

            {/* Open Window (Research) */}
            {pcWindow === 'PROJECT' && (
              <div className="absolute top-10 left-40 right-10 bottom-10 bg-[#1e1e1e] rounded-lg shadow-2xl border border-gray-600 flex flex-col animate-in zoom-in-95 duration-300">
                  <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
                      <span className="text-gray-300 text-xs">Project_X_Research</span>
                      <button onClick={() => setPcWindow('NONE')} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 p-6 overflow-auto">
                      <h1 className="text-2xl text-white font-bold mb-4 border-b border-gray-700 pb-2">สารประกอบเคมี (ลับสุดยอด)</h1>
                      <div className="flex gap-4">
                          <div className="flex-1 space-y-4">
                               <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded border border-gray-600 flex items-center justify-center shadow-inner">
                                  <span className="text-gray-400 text-sm font-semibold">สารหนู (Arsenic) กับอันตรายต่อชีวิตมนุษย์</span>
                               </div>
                               <div className="bg-black/40 border border-gray-700 rounded-lg p-4 text-left text-gray-200 text-sm leading-relaxed space-y-3 overflow-auto max-h-[420px]">
                                  <p className="font-semibold">(เนื้อหาระดับบัณฑิตศึกษา – พิษวิทยาและสาธารณสุข)</p>
                                  <p><span className="font-semibold">1. บทนำ</span> สารหนู (Arsenic; As) เป็นธาตุกึ่งโลหะที่พบในดิน น้ำ แร่ธาตุ และจากกิจกรรมอุตสาหกรรมหลายชนิด ถูกจัดเป็นสารก่อมะเร็งในมนุษย์ (Group 1) และเป็นสารพิษความเสี่ยงสูงต่อสุขภาพและชีวิต</p>
                                  <p><span className="font-semibold">2. รูปแบบของสารหนูและความเป็นพิษ</span> สารหนูอนินทรีย์มีพิษสูง พบบ่อยในน้ำบาดาลและสิ่งแวดล้อม ส่วนสารหนูอินทรีย์มักพบในสิ่งมีชีวิต (เช่น อาหารทะเล) และมีพิษต่ำกว่า โดยสารหนูอนินทรีย์เป็นสาเหตุหลักของพิษรุนแรงและการเสียชีวิต</p>
                                  <div className="space-y-1">
                                    <p className="font-semibold">3. กลไกความเป็นพิษต่อร่างกาย</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-200/90">
                                      <li>ยับยั้งเอนไซม์สร้างพลังงาน (ATP) ทำให้เซลล์ขาดพลังงาน</li>
                                      <li>เหนี่ยวนำภาวะเครียดออกซิเดชัน ทำลาย DNA โปรตีน และเยื่อหุ้มเซลล์</li>
                                      <li>รบกวนเอนไซม์/โปรตีนสำคัญที่มีหมู่ซัลไฟดริล (-SH)</li>
                                      <li>กระทบการแสดงออกของยีน (Epigenetic effects) ที่สัมพันธ์กับโรคเรื้อรังและมะเร็ง</li>
                                    </ul>
                                    <p>การออกฤทธิ์พร้อมกันหลายระบบอาจนำไปสู่ภาวะล้มเหลวของอวัยวะและการเสียชีวิต</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-semibold">4. ผลกระทบต่อระบบอวัยวะ</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-200/90">
                                      <li>ทางเดินอาหาร: อักเสบ ดูดซึมผิดปกติ</li>
                                      <li>หัวใจและหลอดเลือด: เสี่ยงภาวะหัวใจล้มเหลว</li>
                                      <li>ระบบประสาท: ความผิดปกติของเส้นประสาทส่วนปลาย</li>
                                      <li>ตับและไต: การทำงานเสื่อมและการสะสมพิษ</li>
                                      <li>ภูมิคุ้มกัน: ลดลง เพิ่มความเสี่ยงติดเชื้อ</li>
                                    </ul>
                                  </div>
                                  <p><span className="font-semibold">5. สารหนูกับการเสียชีวิต</span> การเสียชีวิตเกิดจากความล้มเหลวพร้อมกันของหลายระบบอวัยวะ ความไม่สมดุลพลังงานระดับเซลล์ การอักเสบอย่างรุนแรง และความผิดปกติของระบบไหลเวียนโลหิต</p>
                                  <div className="space-y-1">
                                    <p className="font-semibold">6. ประเด็นด้านสาธารณสุขและจริยธรรม</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-200/90">
                                      <li>การประเมินความเสี่ยงและเฝ้าระวังสุขภาพประชาชน</li>
                                      <li>การกำหนดมาตรฐานความปลอดภัยและควบคุมการปนเปื้อน</li>
                                      <li>การพัฒนาเทคโนโลยีลดการปนเปื้อนในน้ำดื่ม/สิ่งแวดล้อม</li>
                                      <li>จริยธรรมการวิจัยและผลกระทบต่อสังคมต้องได้รับการคำนึง</li>
                                    </ul>
                                  </div>
                                  <p><span className="font-semibold">7. สรุป</span> สารหนูเป็นสารพิษที่ทำลายเซลล์และหลายระบบอวัยวะ อาจถึงชีวิตเมื่อได้รับระดับเป็นพิษ การเรียนรู้ในระดับบัณฑิตศึกษาควรมุ่งที่กลไกพิษ ผลกระทบต่อสุขภาพ และแนวทางป้องกัน เพื่อสนับสนุนนโยบายและการจัดการความเสี่ยงด้านสาธารณสุขอย่างยั่งยืน</p>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
            )}

            {/* Terminal Window */}
            {pcTerminalOpen && (
              <div className="absolute bottom-8 right-8 w-[640px] bg-black/90 border border-gray-700 rounded-xl shadow-2xl backdrop-blur-lg overflow-hidden flex flex-col">
                <div className="h-10 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-3 text-xs text-gray-300 font-mono">
                  <span>tu-macbook-pro:~$</span>
                  <button onClick={() => setPcTerminalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 p-3 text-left text-sm font-mono text-gray-200 space-y-1 overflow-auto bg-black/60" style={{maxHeight: '420px'}}>
                  {pcTerminalLines.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">{line}</div>
                  ))}
                </div>
                <div className="border-t border-gray-700 bg-black/80 p-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">$</span>
                  <input
                    value={pcCommand}
                    onChange={e => setPcCommand(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePcCommandSubmit();
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-100 font-mono"
                    placeholder={'พิมพ์คำสั่ง เช่น ipconfig, netstat -ano | find "8080"'}
                    autoFocus
                  />
                  <button
                    onClick={handlePcCommandSubmit}
                    className="text-xs px-3 py-1 rounded bg-green-700 hover:bg-green-600 text-white font-bold"
                  >Run</button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );

  const renderPhone2 = () => (
    <div className="h-full bg-black rounded-[3rem] border-8 border-gray-800 overflow-hidden relative shadow-2xl max-w-sm mx-auto flex flex-col">
       <div className="bg-gray-800 p-4 pt-8 text-white flex items-center justify-between shadow-md">
            <button onClick={() => setActiveDevice('NONE')} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
            <span className="font-bold">Chat</span>
            <div className="w-6" />
      </div>
      <div className="flex-1 bg-[#2b2b2b] p-4 overflow-y-auto space-y-6">
           <div className="flex flex-col items-start">
               <span className="text-[10px] text-gray-400 mb-1 px-1">เพื่อนตุ๊ (ชาย 2)</span>
               <div className="bg-gray-700 text-gray-200 p-3 rounded-xl rounded-tl-none max-w-[85%] text-sm">
                   มึง พ่อไอ้ตุ๊ให้หนังสือแปลกๆ มาว่ะ บอกว่าเป็นของดูต่างหน้า
               </div>
           </div>
           <div className="flex flex-col items-start">
               <span className="text-[10px] text-gray-400 mb-1 px-1">เพื่อนตุ๊ (ชาย 2)</span>
               <div className="bg-gray-700 text-gray-200 p-3 rounded-xl rounded-tl-none max-w-[85%] text-sm">
                   มันคือ "คัมภีร์บทสวดสี่ทิศ" กูอ่านละขนลุก
                   <br/><br/>
                   <div className="w-full h-32 bg-black/40 rounded flex items-center justify-center mb-2 overflow-hidden">
                       <img src="/สัญลักษณ์.png" alt="4 Elements Symbols" className="w-full h-full object-contain" />
                   </div>
                   <div className="text-xs font-serif italic text-yellow-100/80 leading-relaxed border-l-2 border-yellow-600 pl-2">
                       {STAGE_DATA.ritualPoem.split('\n').map((l, i) => <div key={i}>{l}</div>)}
                   </div>
               </div>
           </div>
           <div className="flex flex-col items-start">
               <span className="text-[10px] text-gray-400 mb-1 px-1">เพื่อนตุ๊ (ชาย 2)</span>
               <div className="bg-gray-700 text-gray-200 p-3 rounded-xl rounded-tl-none max-w-[85%] text-sm">
                   แม่งเท่ดีว่ะ แต่กูกลัว 
               </div>
           </div>
      </div>
    </div>
  );

  const renderUSB = () => (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 border-2 border-red-900 rounded-lg p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-2xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert /> Security Clearance
                </h2>
                <p className="text-gray-500 text-xs mt-1">TWO-FACTOR AUTHENTICATION REQUIRED</p>
            </div>
            <button onClick={() => setActiveDevice('NONE')} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"><X /></button>
        </div>

        {usbStep === 'INSERT' && (
            <div className="text-center py-12">
                <div className="animate-bounce mb-8">
                    <Usb className="w-24 h-24 text-gray-600 mx-auto" />
                </div>
                <button 
                    onClick={() => setUsbStep('LOCATION')}
                    className="bg-red-900 hover:bg-red-700 text-white font-bold py-4 px-8 rounded shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
                >
                    INSERT PHYSICAL SECURITY KEY (YUBIKEY)
                </button>
                <p className="mt-4 text-gray-500 text-sm">Hardware Token Detected...</p>
            </div>
        )}

        {usbStep === 'LOCATION' && (
            <div className="flex flex-col items-center animate-in fade-in">
                <p className="text-red-400 font-mono mb-2">FACTOR 2: SOMEWHERE YOU ARE</p>
                <p className="text-gray-400 text-xs mb-8 text-center max-w-md">
                    "ระบุตำแหน่งตามลำดับเหตุการณ์การตาย... เริ่มจากศพแรก..."<br/>
                    (North/Earth {'->'} East {'->'} South)
                </p>

                <div className="relative w-64 h-64 bg-gray-800 rounded-full border-4 border-gray-700 flex items-center justify-center shadow-inner">
                    <div className="absolute top-2 text-gray-500 font-bold">N (Earth)</div>
                    <div className="absolute right-4 text-gray-500 font-bold">E (Water/Wind)</div>
                    <div className="absolute bottom-2 text-gray-500 font-bold">S (Wind)</div>
                    <div className="absolute left-4 text-gray-500 font-bold">W (Fire)</div>

                    {/* D-Pad Controls */}
                    <div className="grid grid-cols-3 gap-2 p-4">
                        <div />
                        <button onClick={() => handleDirectionInput('UP')} className="w-12 h-12 bg-gray-700 hover:bg-red-500 rounded flex items-center justify-center transition-colors active:scale-90"><ChevronUp className="text-white" /></button>
                        <div />
                        
                        <button onClick={() => handleDirectionInput('LEFT')} className="w-12 h-12 bg-gray-700 hover:bg-red-500 rounded flex items-center justify-center transition-colors active:scale-90"><ChevronLeft className="text-white" /></button>
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-gray-600">
                            <div className={`w-3 h-3 rounded-full ${directionSequence.length > 0 ? 'bg-red-500 animate-ping' : 'bg-gray-600'}`} />
                        </div>
                        <button onClick={() => handleDirectionInput('RIGHT')} className="w-12 h-12 bg-gray-700 hover:bg-red-500 rounded flex items-center justify-center transition-colors active:scale-90"><ChevronRight className="text-white" /></button>

                        <div />
                        <button onClick={() => handleDirectionInput('DOWN')} className="w-12 h-12 bg-gray-700 hover:bg-red-500 rounded flex items-center justify-center transition-colors active:scale-90"><ChevronDown className="text-white" /></button>
                        <div />
                    </div>
                </div>

                <div className="mt-8 flex gap-2">
                    {directionSequence.map((dir, i) => (
                        <div key={i} className="w-8 h-8 rounded border border-red-500/50 flex items-center justify-center text-red-500 bg-red-900/20">
                            {dir === 'UP' && <ChevronUp size={16}/>}
                            {dir === 'DOWN' && <ChevronDown size={16}/>}
                            {dir === 'LEFT' && <ChevronLeft size={16}/>}
                            {dir === 'RIGHT' && <ChevronRight size={16}/>}
                        </div>
                    ))}
                    {[...Array(3 - directionSequence.length)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded border border-gray-700 bg-gray-800" />
                    ))}
                </div>
            </div>
        )}

        {usbStep === 'UNLOCKED' && (
          <div className="text-center animate-in zoom-in">
            <div className="w-full bg-black aspect-video rounded-lg border-2 border-green-500 relative overflow-hidden">
              <video 
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                playsInline
                onError={() => setVideoError(true)}
                onCanPlay={() => setVideoError(false)}
              >
                <source src={encodeURI('/คลิปยาม.mp4')} type="video/mp4" />
                <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {videoError 
                ? 'ไม่พบไฟล์คลิปยาม.mp4 ในโฟลเดอร์ public/ (ตรวจสอบชื่อไฟล์/ตัวพิมพ์/นามสกุล)' 
                : ''}
            </p>
            <h3 className="text-green-500 font-bold text-xl mt-4">ACCESS GRANTED</h3>
            <p className="text-gray-400 text-sm mt-2">Evidence Retrieved successfully.</p>
            <button onClick={onComplete} className="mt-8 bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-8 rounded-full uppercase">
              Complete Stage 2
            </button>
          </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-red-900 selection:text-white overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur border-b border-red-900/30 p-4 flex justify-between items-center z-50">
            <h1 className="text-2xl font-black italic text-white tracking-tighter">
                <span className="text-red-600">STAGE 2:</span> EVIDENCE_COLLECTION
            </h1>
            <div className="flex gap-4 text-xs font-mono text-gray-400">
                <span>UNLOCKED: {unlockedDevices.length}/4</span>
                <span>STATUS: {unlockedDevices.length === 4 ? 'COMPLETED' : 'ACTIVE'}</span>
            </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Device Rendering Logic */}
            <div className="relative z-10 h-full min-h-[calc(100vh-140px)] p-4 md:p-8 flex items-stretch justify-center">
                {activeDevice === 'NONE' && renderDashboard()}
                {activeDevice === 'PHONE1' && renderPhone1()}
                {activeDevice === 'PC' && renderPC()}
                {activeDevice === 'PHONE2' && renderPhone2()}
                {activeDevice === 'USB' && renderUSB()}
            </div>
        </main>
    </div>
  );
};

export default Stage2Investigation;