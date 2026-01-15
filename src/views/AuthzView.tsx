import React, { useState, useEffect, useRef } from 'react';
import StageHeader from '../components/StageHeader';
import EvidenceModal from '../components/EvidenceModal';
import type { CaseStatus } from '../types';

interface AuthzViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

type HackPhase = 'NETWORK' | 'COOKIE' | 'WEBSHELL_INFO' | 'TERMINAL';

const AuthzView: React.FC<AuthzViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [phase, setPhase] = useState<HackPhase>('NETWORK');
  
  // --- LOGIC: NETWORK ---
  const [netLogs, setNetLogs] = useState<string[]>([
    '[SYSTEM] กำลังเริ่มต้นอะแดปเตอร์เชื่อมต่อแบบปลอดภัย...',
    '[INFO] กำลังโหลดโปรไฟล์: NOD-77_INTERNAL_PROFILE',
    '[WARN] ไม่สามารถติดต่อเกตเวย์เริ่มต้นได้',
    '[ERROR] การจับมือ (Handshake) ล้มเหลว เป้าหมายปฏิเสธการเชื่อมต่อที่พอร์ต 80',
    '[DEBUG] GUI ล้มเหลว. เปลี่ยนเป็นโหมดควบคุมด้วยคำสั่ง (Console Override)'
  ]);

  useEffect(() => {
    if (phase === 'NETWORK') {
      // Backdoor Function
      (window as any).inject_packet = (ip: string, port: string) => {
        console.log(`%c[DEBUG] เริ่มต้นการเขียนทับ Packet > ${ip}:${port}`, 'color: yellow');
        
        if (ip === '192.168.1.10' && port === '8080') {
          console.log('%c[SUCCESS] การจับมือสำเร็จ อนุญาตให้เข้าถึง', 'color: green; font-size: 14px; font-weight: bold;');
          setNetLogs(prev => [...prev, `[INFO] Override สำเร็จ: เชื่อมต่อกับ ${ip}:${port}`, '[INFO] กำลังยืนยันตัวตน...']);
          setTimeout(() => setPhase('COOKIE'), 1500);
          return "Connection Established";
        } else {
          console.error('[FAIL] การเชื่อมต่อถูกปฏิเสธ (Connection Refused)');
          setNetLogs(prev => [...prev, `[ERROR] Connection refused: ${ip}:${port}`]);
          return "Connection Refused";
        }
      };
      
      console.clear();
      console.log('%c--- NOD-77 DEBUG CONSOLE ---', 'font-weight: bold; color: #00ff00;');
      console.log('คำเตือน: การเชื่อมต่อผ่าน GUI ถูกบล็อกโดย Firewall');
      console.log('นักพัฒนาได้เปิดใช้งานฟังก์ชัน Global API สำหรับการทดสอบเจาะระบบ');
      console.log('โปรดตรวจสอบเอกสาร API ภายในเพื่อใช้งาน');
    }
  }, [phase]);

  // --- LOGIC: COOKIE ---
  const [cookieStatus, setCookieStatus] = useState<'LOCKED' | 'UNLOCKED'>('LOCKED');

  useEffect(() => {
    if (phase === 'COOKIE') {
      document.cookie = "session_id=xe8-991-zc2; path=/";
      document.cookie = "user_role=guest; path=/";
      document.cookie = "department=external; path=/";

      const interval = setInterval(() => {
        const cookies = document.cookie.split(';').reduce((acc, current) => {
          const [name, value] = current.trim().split('=');
          acc[name] = value;
          return acc;
        }, {} as Record<string, string>);

        if (cookies['user_role'] === 'admin') {
          setCookieStatus('UNLOCKED');
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // --- LOGIC: WEBSHELL ---
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  const startInstallation = () => {
    setIsInstalling(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress > 100) progress = 100;
      setInstallProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase('TERMINAL'), 800);
      }
    }, 30);
  };

  // --- LOGIC: TERMINAL ---
  const [logs, setLogs] = useState<string[]>(['NOD-77 Server (Ubuntu 20.04 LTS)', 'Last login: Yesterday from 192.168.1.5']);
  const [input, setInput] = useState('');
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [filePerms, setFilePerms] = useState('----------');
  const [fileOwner, setFileOwner] = useState('manas');
  const [userName, setUserName] = useState('admin');

  const getRealSystemTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = input.trim();
    if (!rawCmd) return;
    setLogs(prev => [...prev, `${userName}@nod-77:~# ${rawCmd}`]);
    setInput('');

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg1 = parts[1] || '';
    const arg2 = parts[2] || '';

    if (cmd === 'ls') {
        if (arg1 === '-l') {
            addLog(`total 16`);
            addLog(`drwxr-xr-x  2 root   root    4096 ${getRealSystemTime()} .`);
            addLog(`drwxr-xr-x  4 root   root    4096 ${getRealSystemTime()} ..`);
            addLog(`${filePerms}  1 ${fileOwner}  users   1024 Jan 14 03:00 ritual_plan_final.txt`);
        } else {
            addLog('ritual_plan_final.txt');
        }
    } else if (cmd === 'chown') {
      if (userName !== 'root') {
        addLog('chown: Operation not permitted. You must be root to change ownership.');
      } else {
        if (arg1 === 'root' && arg2.startsWith('ritual')) {
          setFileOwner('root');
          addLog('Changed ownership of ritual_plan_final.txt to root');
        } else {
          addLog(`chown: invalid user or file`);
        }
      }
    } else if (cmd === 'chmod') {
      if (userName !== 'root') {
         addLog(`chmod: Operation not permitted. You must be root to change permissions.`);
      } else if (fileOwner !== 'root') {
         addLog(`chmod: changing permissions of '${arg2 || arg1}': Operation not permitted (owner not root)`);
      } else if (arg1 === '777' && arg2.startsWith('ritual')) {
          setFilePerms('-rwxrwxrwx');
          addLog('mode of ritual_plan_final.txt changed to 0777 (rwxrwxrwx)');
      } else {
          addLog('chmod: invalid mode or file');
      }
    } else if (cmd === 'date') {
        addLog(`${new Date().toString()}`);
    } else if (cmd === 'su' || rawCmd === 'su root' || rawCmd === 'sudo su') {
      // switch user to root if authorized
      if (cookieStatus === 'UNLOCKED') {
        setUserName('root');
        addLog('Authentication: Privilege escalated to root');
      } else {
        addLog('Authentication failed: insufficient privileges');
      }
    } else if (cmd === 'cat') {
        if (arg1.startsWith('ritual')) {
            if (filePerms === '----------') {
                addLog('cat: ritual_plan_final.txt: Permission denied');
            } else {
                const currentTime = getRealSystemTime();
                if (currentTime.startsWith('03')) {
                    addLog('Opening file...');
                    setTimeout(() => setEvidenceOpen(true), 1000);
                } else {
                    addLog('Access Denied: Temporal Lock Active (Required: 03:00-03:59)');
                }
            }
        } else {
             addLog('cat: No such file or directory');
        }
    } else if (cmd === 'help') {
        addLog('Shell commands: ls -l, chown root [file], chmod 777 [file], cat [file], date, su root');
    } else {
        addLog(`${cmd}: command not found`);
    }
  };
  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);


  // --- UI RENDERERS ---

  const renderNetworkUI = () => (
    <div className="w-full h-full max-w-[95vw] max-h-[90vh] bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#333] overflow-hidden font-sans flex flex-col">
      <div className="bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-[#333] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ff5f56]"></div>
            <div className="w-4 h-4 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-4 h-4 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-gray-400 text-lg font-medium ml-2">NOD-77 ไคลเอนต์เกตเวย์นิรภัย v3.1</span>
        </div>
        <div className="text-sm text-gray-500">สถานะ: ตัดการเชื่อมต่อ</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Status */}
        <div className="w-1/3 min-w-[350px] bg-[#252526] border-r border-[#333] p-10 flex flex-col gap-10">
           <div className="text-center p-10 bg-[#1e1e1e] rounded-2xl border border-[#333]">
             <div className="w-32 h-32 bg-[#333] rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner">
               <span className="material-symbols-outlined text-7xl text-gray-500">lan</span>
             </div>
             <h2 className="text-gray-200 font-bold text-2xl mb-4">เครือข่ายห้องปฏิบัติการภายใน</h2>
             <p className="text-red-400 text-lg font-medium flex items-center justify-center gap-3">
               <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
               การเชื่อมต่อล้มเหลว
             </p>
           </div>

           <div className="space-y-6 flex-1">
             <div className="text-sm text-gray-500 uppercase tracking-wider font-bold">รายละเอียดการเชื่อมต่อ</div>
             <div className="flex justify-between text-base text-gray-400 border-b border-[#333] pb-4">
               <span>โฮสต์เป้าหมาย</span>
               <span className="font-mono text-red-400">ไม่ทราบค่า</span>
             </div>
             <div className="flex justify-between text-base text-gray-400 border-b border-[#333] pb-4">
               <span>พอร์ต</span>
               <span className="font-mono text-red-400">N/A</span>
             </div>
             <div className="flex justify-between text-base text-gray-400 border-b border-[#333] pb-4">
               <span>โปรโตคอล</span>
               <span>Secure Socket Layer (SSL)</span>
             </div>
           </div>
        </div>

        {/* Right Panel: Logs & Hint */}
        <div className="flex-1 flex flex-col p-10 gap-6 bg-[#1e1e1e]">
          <div className="flex-1 bg-black rounded-xl border border-[#333] p-8 font-mono text-base text-gray-300 overflow-y-auto">
            {netLogs.map((log, i) => (
              <div key={i} className="mb-3">
                <span className="text-gray-600 mr-4">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('INFO') ? 'text-blue-400' : 'text-gray-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#252526] p-8 rounded-xl border-l-8 border-yellow-600 text-lg">
            <div className="flex items-center gap-3 text-yellow-500 font-bold mb-4">
              <span className="material-symbols-outlined text-2xl">bug_report</span>
              <span>บันทึกการแก้ไขปัญหา (Debug Log)</span>
            </div>
            <div className="text-gray-400 mb-4 text-base space-y-2 font-mono bg-black/50 p-4 rounded">
              <p className="text-red-400">Error Code: 0x8004005 (FIREWALL_BLOCK)</p>
              <p>คำแนะนำ: ตรวจพบ API สำหรับนักพัฒนา (Exposed Global Function)</p>
              <p className="text-blue-400">Signature: void inject_packet(string ip, string port)</p>
            </div>
            <p className="text-gray-500 text-sm italic">
              * โปรดใช้ Console (F12) ในการเรียกใช้ฟังก์ชันตาม Signature ด้านบน
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortalUI = () => (
    <div className="w-full h-full max-w-[95vw] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans relative">
       {/* Fake Browser Toolbar */}
       <div className="bg-[#f3f3f3] border-b border-[#dcdcdc] px-6 py-4 flex items-center gap-6 shrink-0">
         <div className="flex gap-4 text-gray-400">
           <span className="material-symbols-outlined text-2xl">arrow_back</span>
           <span className="material-symbols-outlined text-2xl">arrow_forward</span>
           <span className="material-symbols-outlined text-2xl">refresh</span>
         </div>
         <div className="flex-1 bg-white border border-[#dcdcdc] rounded-lg px-6 py-3 flex items-center gap-3 text-base text-gray-600 shadow-sm">
           <span className="material-symbols-outlined text-green-600">lock</span>
           <span className="font-mono text-lg">https://internal-lab.nod77.ac.th/dashboard</span>
         </div>
         <div className="flex items-center gap-4 border-l border-[#dcdcdc] pl-6">
            <span className="material-symbols-outlined text-3xl text-gray-500">account_circle</span>
         </div>
       </div>

       {/* Web Content */}
       <div className="flex-1 bg-[#f8f9fa] flex flex-col overflow-hidden">
          <header className="bg-[#003366] text-white px-10 py-8 shadow-md shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="bg-white/10 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-5xl">science</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">ห้องปฏิบัติการวิจัย NOD-77</h1>
                  <p className="text-base text-blue-200 uppercase tracking-widest mt-1">ระบบจัดการข้อมูลภายใน (Internal Data System)</p>
                </div>
              </div>
              <div className="text-right bg-white/5 px-8 py-4 rounded-xl border border-white/10">
                 <div className="text-sm font-medium opacity-80 uppercase tracking-wider">สถานะเซสชัน (Session Status)</div>
                 <div className={`text-2xl font-bold flex items-center justify-end gap-3 mt-1 ${cookieStatus === 'LOCKED' ? 'text-yellow-400' : 'text-green-400'}`}>
                   {cookieStatus === 'LOCKED' ? 'ผู้เยี่ยมชม (Guest)' : 'ผู้ดูแลระบบ (Admin)'}
                   <span className="material-symbols-outlined text-2xl">{cookieStatus === 'LOCKED' ? 'lock' : 'verified_user'}</span>
                 </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-10 flex gap-10 overflow-hidden">
             {/* Sidebar */}
             <div className="w-80 space-y-6 shrink-0">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                 <div className="text-xs font-bold text-gray-400 uppercase mb-6 tracking-wider">เมนูนำทาง</div>
                 <ul className="space-y-6 text-gray-600 font-medium text-lg">
                   <li className="flex items-center gap-4 text-[#003366] bg-blue-50 p-3 rounded-lg"><span className="material-symbols-outlined">dashboard</span> แดชบอร์ด</li>
                   <li className="flex items-center gap-4 opacity-50"><span className="material-symbols-outlined">folder_shared</span> โครงการ</li>
                   <li className="flex items-center gap-4 opacity-50"><span className="material-symbols-outlined">group</span> ทีมงาน</li>
                   <li className="flex items-center gap-4 opacity-50"><span className="material-symbols-outlined">settings</span> ตั้งค่าระบบ</li>
                 </ul>
               </div>

               <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-base text-yellow-800">
                 <strong>ประกาศจากระบบ:</strong><br/>
                 คุณกำลังเข้าชมในฐานะ <span className="font-bold underline">Guest</span> ฟังก์ชันการจัดการไฟล์ระดับสูงถูกปิดใช้งาน
                 <div className="mt-4 pt-4 border-t border-yellow-200 text-sm text-gray-500 flex flex-col gap-2">
                   <span className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-base">warning</span> คำแนะนำจากฝ่ายไอที:</span>
                   <span>พบความผิดปกติของ Session Token ในฝั่งไคลเอนต์ (Client-Side Storage) กรุณาตรวจสอบค่าตัวแปรสิทธิ์ผู้ใช้</span>
                 </div>
               </div>
             </div>

             {/* Main Content */}
             <div className="flex-1 flex flex-col gap-8 overflow-hidden">
                <div className="grid grid-cols-3 gap-8 shrink-0">
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-sm uppercase font-bold mb-3">สถานะระบบ</div>
                     <div className="text-green-600 font-bold text-xl flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600"></span> ออนไลน์</div>
                   </div>
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-sm uppercase font-bold mb-3">ระดับการเข้าถึง</div>
                     <div className={`${cookieStatus === 'LOCKED' ? 'text-red-500' : 'text-green-500'} font-bold text-xl`}>
                       {cookieStatus === 'LOCKED' ? 'จำกัดสิทธิ์ (อ่านอย่างเดียว)' : 'ควบคุมเต็มรูปแบบ'}
                     </div>
                   </div>
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-sm uppercase font-bold mb-3">ไฟล์นิรภัย</div>
                     <div className="text-gray-800 font-bold text-xl">1 ไฟล์ถูกป้องกัน</div>
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col relative overflow-hidden">
                   <div className="px-10 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold text-gray-700 text-xl">เอกสารล่าสุด</h3>
                     {cookieStatus === 'UNLOCKED' && <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-bold">Admin Mode</span>}
                   </div>
                   
                   <div className="flex-1 overflow-auto">
                     <table className="w-full text-base text-left">
                       <thead className="text-gray-500 bg-gray-50 border-b border-gray-200 sticky top-0">
                         <tr>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">ชื่อไฟล์</th>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">เจ้าของ</th>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">วันที่</th>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">การกระทำ</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                             <td className="px-10 py-6 flex items-center gap-4 text-gray-700"><span className="material-symbols-outlined text-blue-400 text-xl">description</span> safety_protocol_v2.pdf</td>
                             <td className="px-10 py-6 text-gray-500">Staff</td>
                             <td className="px-10 py-6 text-gray-400">10 ม.ค. 2569</td>
                             <td className="px-10 py-6"><button className="text-blue-600 hover:underline">ดาวน์โหลด</button></td>
                          </tr>
                          <tr className="bg-red-50/30 hover:bg-red-50/60">
                             <td className="px-10 py-6 flex items-center gap-4 font-bold text-red-900"><span className="material-symbols-outlined text-red-500 text-xl">lock</span> ritual_plan_final.txt</td>
                             <td className="px-10 py-6 text-gray-600">root</td>
                             <td className="px-10 py-6 text-gray-400">14 ม.ค. 2569</td>
                             <td className="px-10 py-6">
                               {cookieStatus === 'LOCKED' ? (
                                 <span className="text-gray-400 italic cursor-not-allowed flex items-center gap-2"><span className="material-symbols-outlined text-base">block</span> ปฏิเสธการเข้าถึง</span>
                               ) : (
                                 <span className="text-green-600 font-bold flex items-center gap-2 animate-pulse"><span className="material-symbols-outlined text-base">key</span> ปลดล็อกผ่าน Shell</span>
                               )}
                             </td>
                          </tr>
                       </tbody>
                     </table>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderSuccessPopup = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-xl w-full border border-gray-200 transform animate-in zoom-in duration-300">
         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
           <span className="material-symbols-outlined text-6xl">admin_panel_settings</span>
         </div>
         <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">ยืนยันสิทธิ์ Admin เรียบร้อย</h3>
         <div className="w-16 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
         <p className="text-gray-600 mb-10 leading-relaxed text-lg">
           การเข้าถึงไฟล์ระบบระดับ Root ถูกจำกัดบนหน้าเว็บอินเทอร์เฟซนี้<br/>
           คุณต้องสร้างการเชื่อมต่อ <strong>Secure Shell (WebShell)</strong> เพื่อจัดการไฟล์ขั้นสูง
         </p>
         <button 
           onClick={() => setPhase('WEBSHELL_INFO')}
           className="bg-[#003366] text-white px-10 py-5 rounded-xl font-bold text-lg w-full hover:bg-blue-900 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
         >
           เข้าสู่คอนโซลระยะไกล
           <span className="material-symbols-outlined text-2xl">terminal</span>
         </button>
      </div>
    </div>
  );

  const renderWebShellInfo = () => (
    <div className="w-full h-full max-w-[900px] bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-700 p-6 font-mono animate-in zoom-in duration-300 flex flex-col items-center">
       <div className="w-full max-w-3xl space-y-6 px-2">
          <div className="flex justify-center mb-4">
             <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-600 shadow-lg">
                <span className="material-symbols-outlined text-5xl text-white">dns</span>
             </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">ตัวจัดการการเชื่อมต่อเซิร์ฟเวอร์</h2>
            <p className="text-gray-400 text-sm">NOD-77 Secure Shell Protocol (SSH) v2.0</p>
          </div>

          <div className="bg-[#252526] text-left p-4 rounded-2xl border-l-8 border-blue-500 text-sm space-y-3 shadow-inner break-words">
            <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2">ข้อมูลโปรโตคอล</h3>
            <p className="text-gray-300 leading-snug">
              <strong className="text-white">การติดตั้ง Web Shell:</strong> เนื่องจากการเข้าถึงผ่านหน้าเว็บปกติไม่เพียงพอสำหรับการจัดการไฟล์ระดับ Root ระบบจะทำการสร้างสะพานเชื่อม (Bridge) ระหว่างเบราว์เซอร์นี้กับ Kernel ของเซิร์ฟเวอร์โดยตรง
            </p>
            <p className="text-gray-400 italic text-xs border-t border-gray-700 pt-3 mt-2">
              คำเตือน: การเริ่มต้นการเชื่อมต่อนี้จะมอบสิทธิ์การสั่งงานผ่าน Command Line โดยตรง
            </p>
          </div>

          {!isInstalling ? (
            <button 
              onClick={startInstallation}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all w-full uppercase tracking-widest shadow-md"
            >
              เริ่มต้นการเชื่อมต่อ
            </button>
          ) : (
            <div className="w-full space-y-3">
               <div className="flex justify-between text-xs text-gray-400 font-bold tracking-wider">
                 <span>กำลังสร้างอุโมงค์นิรภัย...</span>
                 <span>{installProgress}%</span>
               </div>
               <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                 <div className="h-full bg-blue-500 transition-all duration-75 ease-out" style={{width: `${installProgress}%`}}></div>
               </div>
               <div className="h-28 bg-black p-3 font-mono text-sm text-green-400 overflow-auto border border-gray-800 rounded-xl shadow-inner">
                 <div>&gt; Resolving host... OK</div>
                 {installProgress > 10 && <div>&gt; Handshake... OK</div>}
                 {installProgress > 30 && <div>&gt; Authenticating with admin token... OK</div>}
                 {installProgress > 60 && <div>&gt; Uploading shell payload (shell.php)... DONE</div>}
                 {installProgress > 80 && <div>&gt; Starting interactive session...</div>}
                 {installProgress >= 100 && <div className="text-white blink">&gt; CONNECTED.</div>}
               </div>
            </div>
          )}
       </div>
    </div>
   );

  const renderTerminalUI = () => (
    <div className="w-full h-[650px] max-w-[98vw] max-h-[90vh] bg-[#300a24] rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-lg border border-gray-700">
      <div className="bg-[#3e3e3e] px-6 py-4 flex items-center justify-between border-b border-black shrink-0">
        <div className="text-gray-300 text-base font-bold">{userName}@nod-77: ~</div>
        <div className="flex gap-3">
           <div className="w-4 h-4 rounded-full bg-[#df4b16]"></div>
           <div className="w-4 h-4 rounded-full bg-[#828282]"></div>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto text-white">
         {logs.map((l, i) => (
           <div key={i} className="mb-2 break-words leading-relaxed">{l}</div>
         ))}
         <div ref={terminalRef}></div>
         <form onSubmit={handleCommand} className="flex gap-4 mt-4">
           <span className="text-green-400 font-bold shrink-0">{userName}@nod-77:~#</span>
           <input 
             autoFocus
             value={input}
             onChange={e => setInput(e.target.value)}
             className="flex-1 bg-transparent outline-none text-white border-none p-0 focus:ring-0 w-full"
           />
         </form>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#121212]">
      <div className="w-full mb-4 max-w-[98vw]">
         <StageHeader 
            stageName={phase === 'NETWORK' ? 'SECURE GATEWAY' : phase === 'COOKIE' ? 'INTERNAL PORTAL' : phase === 'WEBSHELL_INFO' ? 'REMOTE ACCESS' : 'ROOT SHELL'} 
            stageNumber={2} 
            timer={status.timer} 
            hintsUsed={status.hintsUsed} 
            onRequestHint={onRequestHint} 
        />
      </div>

      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {phase === 'NETWORK' && renderNetworkUI()}
        {phase === 'COOKIE' && renderPortalUI()}
        {phase === 'WEBSHELL_INFO' && renderWebShellInfo()}
        {phase === 'TERMINAL' && renderTerminalUI()}
      </div>

      {phase === 'COOKIE' && cookieStatus === 'UNLOCKED' && renderSuccessPopup()}

      <EvidenceModal 
        isOpen={evidenceOpen}
        onClose={onComplete}
        file={{
            name: 'ritual_plan_final.txt',
            type: 'CONFIDENTIAL',
            content: `
ไดอารี่ของ ดร. มานัส

ทุกอย่างพังพินาศหมดแล้ว... การทดลองล้มเหลวไม่เป็นท่า เงินทุนที่เหลือก็แทบจะเป็นศูนย์ ฉันมาไกลเกินกว่าจะยอมให้ทุกอย่างจบลงแบบนี้ ไอ้เด็กนักศึกษา 3 คนนั่น มันเริ่มรู้มากเกินไป เรื่องความปลอดภัยที่ฉันละเลย... ถ้าพวกมันปากสว่าง ฉันจบเห่แน่

ฉันไม่มีทางเลือกอื่นแล้ว จำเป็นต้องเริ่ม "แผนปิดปาก"

ฉันจะเปลี่ยนความผิดพลาดให้กลายเป็นเรื่องเหนือธรรมชาติ จัดฉากอุบัติเหตุพวกนี้ให้กลายเป็น "พิธีกรรมสี่ทิศ" ตามตำนานงมงายนั่นตามที่ไอ้แก่คำปันมันเคยเล่ามา

ทิศเหนือ: ศพแรกจะต้องฝังด้วย "ดิน"

ทิศใต้: ศพที่สองจะต้องสังเวยแด่ "น้ำ"

ทิศตะวันออก: ศพสุดท้ายจะแขวนคอผึ่ง "ลม"

ให้พวกชาวบ้านกับตำรวจพุ่งเป้าไปที่ไอ้แก่คำปันกับความเชื่อโง่ๆ ของมัน ส่วนฉันก็จะลอยนวล

            ` 
        }}
      />
    </div>
  );
};

export default AuthzView;