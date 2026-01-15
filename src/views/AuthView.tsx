import { useState } from 'react';
import { 
  Smartphone, Monitor, Usb, 
  FileText, 
  ShieldAlert,
  X
} from 'lucide-react';
import StageHeader from '../components/StageHeader';
import TriVariablePuzzle from '../components/TriVariablePuzzle';
import RitualCipherOTP from '../components/RitualCipherOTP';
import HardMasterLock from '../components/HardMasterLock';
import Phone1Puzzle from '../components/Phone1Puzzle';
import type { CaseStatus } from '../types';

// --- Types ---
type DeviceType = 'NONE' | 'PHONE1' | 'PC' | 'PHONE2' | 'USB';

// --- Mock Data ---
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

const Stage2Investigation = ({ onComplete, status, onRequestHint }: { onComplete: () => void; status: CaseStatus; onRequestHint: () => void }) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('NONE');
  const [unlockedDevices, setUnlockedDevices] = useState<string[]>([]);
  
  // --- Phone 2 State ---
  const [phone2PuzzleCleared, setPhone2PuzzleCleared] = useState(false);

  // --- PC State ---
  const [pcStage, setPcStage] = useState<'LOCKED' | 'SCANNING' | 'DESKTOP'>('LOCKED');

  // --- USB State ---
  const [usbStep, setUsbStep] = useState<'INSERT' | 'PRISM' | 'UNLOCKED'>('INSERT');
  const [usbParallaxCleared, setUsbParallaxCleared] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [pcTerminalOpen, setPcTerminalOpen] = useState(false);
  const [pcWindow, setPcWindow] = useState<'NONE' | 'PROJECT'>('NONE');
  const [pcTerminalLines, setPcTerminalLines] = useState<string[]>([
    'tu-macbook-pro:~$ type "help" เพื่อดูคำสั่งที่ใช้ได้'
  ]);
  const [pcCommand, setPcCommand] = useState(''); 

  // --- Handlers ---

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
      setPcTerminalLines(['tu-macbook-pro:~$ ']);
    } else if (lower === 'ipconfig') {
      appendTerminal([
        prompt,
        'IPv4 Address . . . . . . . . . . . : 192.168.1.10',
        'Subnet Mask  . . . . . . . . . . . : 255.255.255.0',
        'Default Gateway . . . . . . . . . . : 192.168.1.1:8080'
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
          }
          else {
            setPcStage('LOCKED');
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
        <span className="text-[10px] text-gray-500">{phone2PuzzleCleared ? 'UNLOCKED' : 'LOGIC PUZZLE'}</span>
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

  const renderPhone1 = () => {
    return (
      <Phone1Puzzle 
        passcode={STAGE_DATA.phone1.passcode}
        dates={STAGE_DATA.phone1.dates}
        time={STAGE_DATA.phone1.time}
        onUnlock={() => setUnlockedDevices(prev => [...prev, 'PHONE1'])}
        onClose={() => setActiveDevice('NONE')}
      />
    );
  };

  const renderPC = () => {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden flex flex-col relative border border-gray-700">
        <div className="h-8 bg-gray-800 flex items-center px-4 space-x-2 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400 transition-colors" onClick={() => { setActiveDevice('NONE'); setPcWindow('NONE'); }} title="Close" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-gray-400 text-xs ml-4">Tu_MacBook_Pro — System Access</span>
      </div>

      {pcStage === 'LOCKED' || pcStage === 'SCANNING' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900 text-center relative">
            {/* Back Button */}
            <button 
              onClick={() => { setActiveDevice('NONE'); }} 
              className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex items-center gap-2 border border-gray-700"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-mono">ESC</span>
            </button>
            <div className="w-full flex flex-col items-center justify-center">
              <HardMasterLock onUnlock={() => {
                setUnlockedDevices(prev => [...prev, 'PC']);
                setPcStage('DESKTOP');
              }} />
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
  };

  const renderPhone2 = () => (
    <div className="h-full bg-black rounded-[3rem] border-8 border-gray-800 overflow-hidden relative shadow-2xl max-w-sm mx-auto flex flex-col">
       <div className="bg-gray-800 p-4 pt-8 text-white flex items-center justify-between shadow-md">
            <button onClick={() => setActiveDevice('NONE')} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
            <span className="font-bold">{phone2PuzzleCleared ? 'Chat' : 'Locked'}</span>
            <div className="w-6" />
      </div>
      {!phone2PuzzleCleared ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
          <RitualCipherOTP onUnlock={() => setPhone2PuzzleCleared(true)} />
        </div>
      ) : (
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
      )}
    </div>
  );

  const renderUSB = () => (
    <div className="w-full h-full bg-black text-gray-200 font-mono flex flex-col items-center justify-center p-6">
        {usbStep === 'INSERT' && (
            <div className="text-center py-12">
                <div className="animate-bounce mb-8">
                    <Usb className="w-24 h-24 text-gray-600 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-green-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <ShieldAlert /> Security Clearance
                </h2>
                <p className="text-gray-500 text-xs mb-6">PHYSICAL SECURITY TOKEN REQUIRED</p>
                <button 
                    onClick={() => setUsbStep('PRISM')}
                    className="bg-green-900 hover:bg-green-700 text-white font-bold py-4 px-8 rounded shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all"
                >
                    INSERT SECURITY KEY
                </button>
            </div>
        )}

        {usbStep === 'PRISM' && !usbParallaxCleared && (
            <div className="w-full h-full flex items-center justify-center overflow-y-auto">
                <TriVariablePuzzle onUnlock={() => {
                    setUsbParallaxCleared(true);
                    setUsbStep('UNLOCKED');
                    setUnlockedDevices(prev => [...prev, 'USB']);
                }} />
            </div>
        )}

        {usbStep === 'UNLOCKED' && usbParallaxCleared && (
          <div className="text-center animate-in zoom-in flex flex-col items-center gap-8">
            <div className="w-full max-w-2xl bg-gray-900/80 rounded-lg border border-green-500 overflow-hidden">
              <div className="w-full bg-black aspect-video flex items-center justify-center">
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
            </div>
            <div className="text-center">
              <h3 className="text-green-500 font-bold text-xl mb-2">ACCESS GRANTED</h3>
              <p className="text-gray-400 text-sm mb-2">Evidence Retrieved successfully.</p>
              {videoError && <p className="text-gray-500 text-xs mb-4">ไม่พบไฟล์คลิปยาม.mp4 ในโฟลเดอร์ public/</p>}
              <button onClick={onComplete} className="bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-8 rounded-full uppercase">
                Complete Stage 2
              </button>
            </div>
          </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-red-900 selection:text-white overflow-hidden flex flex-col">
        {/* Header */}
        <StageHeader stageName="STAGE 2: EVIDENCE_COLLECTION" stageNumber={2} timer={status.timer} hintsUsed={status.hintsUsed} onRequestHint={onRequestHint} />

        {/* Main Area */}
        <main className="flex-1 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Device Rendering Logic */}
            <div className="relative z-10 h-full min-h-[calc(100vh-120px)] p-4 md:p-8 flex items-stretch justify-center">
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