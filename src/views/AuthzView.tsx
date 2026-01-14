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
    '[SYSTEM] Initializing secure connection adapter...',
    '[INFO] Loading configuration: NOD-77_INTERNAL_PROFILE',
    '[WARN] Target unreachable at default gateway.',
    '[ERROR] Connection handshake failed. Target refused connection on port 80.',
    '[HINT] Manual override required via Developer Console.'
  ]);

  useEffect(() => {
    if (phase === 'NETWORK') {
      (window as any).inject_packet = (ip: string, port: string) => {
        console.log(`[DEBUG] Override initiated > ${ip}:${port}`);
        
        if (ip === '192.168.1.10' && port === '8080') {
          console.log('[SUCCESS] Handshake accepted.');
          setNetLogs(prev => [...prev, `[INFO] Override success: Connected to ${ip}:${port}`, '[INFO] Authenticating...']);
          setTimeout(() => setPhase('COOKIE'), 1500);
          return "Connection Established";
        } else {
          console.error('[FAIL] Connection refused.');
          setNetLogs(prev => [...prev, `[ERROR] Connection refused: ${ip}:${port}`]);
          return "Connection Refused";
        }
      };
      
      console.clear();
      console.log('--- NOD-77 DEBUG CONSOLE ---');
      console.log('To bypass the firewall, use the manual injection method:');
      console.log('window.inject_packet("TARGET_IP", "TARGET_PORT")');
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
    setLogs(prev => [...prev, `root@nod-77:~# ${rawCmd}`]);
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
    } else if (cmd === 'su' || rawCmd === 'su root' || rawCmd === 'sudo su' || (cmd === 'become' && arg1 === 'root')) {
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
        addLog('Shell commands: ls -l, chown root [file], chmod 777 [file], cat [file], date');
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
          <span className="text-gray-400 text-lg font-medium ml-2">NOD-77 Secure Gateway Client v3.1</span>
        </div>
        <div className="text-sm text-gray-500">Disconnected</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Status */}
        <div className="w-1/3 min-w-[350px] bg-[#252526] border-r border-[#333] p-10 flex flex-col gap-10">
           <div className="text-center p-10 bg-[#1e1e1e] rounded-2xl border border-[#333]">
             <div className="w-32 h-32 bg-[#333] rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner">
               <span className="material-symbols-outlined text-7xl text-gray-500">lan</span>
             </div>
             <h2 className="text-gray-200 font-bold text-2xl mb-4">Internal Lab Network</h2>
             <p className="text-red-400 text-lg font-medium flex items-center justify-center gap-3">
               <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
               Connection Failed
             </p>
           </div>

           <div className="space-y-6 flex-1">
             <div className="text-sm text-gray-500 uppercase tracking-wider font-bold">Connection Details</div>
             <div className="flex justify-between text-base text-gray-400 border-b border-[#333] pb-4">
               <span>Target Host</span>
               <span className="font-mono text-red-400">UNKNOWN</span>
             </div>
             <div className="flex justify-between text-base text-gray-400 border-b border-[#333] pb-4">
               <span>Port</span>
               <span className="font-mono text-red-400">N/A</span>
             </div>
             <div className="flex justify-between text-base text-gray-400 border-b border-[#333] pb-4">
               <span>Protocol</span>
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
              <span className="material-symbols-outlined text-2xl">build</span>
              <span>Developer Troubleshooting</span>
            </div>
            <p className="text-gray-400 mb-4">
              การเชื่อมต่อถูกบล็อกโดยนโยบายfirewall โปรดใช้คอนโซลของเบราว์เซอร์เพื่อกำหนดค่าพารามิเตอร์เป้าหมายด้วยตนเอง
            </p>
            <code className="block bg-black p-5 rounded-lg text-gray-300 font-mono text-base">
              &gt; window.inject_packet("TARGET_IP", "PORT")
            </code>
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
                  <h1 className="text-3xl font-bold tracking-tight">NOD-77 RESEARCH LABORATORY</h1>
                  <p className="text-base text-blue-200 uppercase tracking-widest mt-1">Internal Data Management System</p>
                </div>
              </div>
              <div className="text-right bg-white/5 px-8 py-4 rounded-xl border border-white/10">
                 <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Session Status</div>
                 <div className={`text-2xl font-bold flex items-center justify-end gap-3 mt-1 ${cookieStatus === 'LOCKED' ? 'text-yellow-400' : 'text-green-400'}`}>
                   {cookieStatus === 'LOCKED' ? 'Guest Visitor' : 'System Administrator'}
                   <span className="material-symbols-outlined text-2xl">{cookieStatus === 'LOCKED' ? 'lock' : 'verified_user'}</span>
                 </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 flex gap-10 overflow-hidden">
             {/* Sidebar */}
             <div className="w-80 space-y-6 shrink-0">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                 <div className="text-xs font-bold text-gray-400 uppercase mb-6 tracking-wider">Navigation</div>
                 <ul className="space-y-6 text-gray-600 font-medium text-lg">
                   <li className="flex items-center gap-4 text-[#003366] bg-blue-50 p-3 rounded-lg"><span className="material-symbols-outlined">dashboard</span> Dashboard</li>
                   <li className="flex items-center gap-4 opacity-50"><span className="material-symbols-outlined">folder_shared</span> Projects</li>
                   <li className="flex items-center gap-4 opacity-50"><span className="material-symbols-outlined">group</span> Team</li>
                   <li className="flex items-center gap-4 opacity-50"><span className="material-symbols-outlined">settings</span> Settings</li>
                 </ul>
               </div>

               <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-base text-yellow-800">
                 <strong>System Notification:</strong><br/>
                 Viewing as <span className="font-bold underline">Guest</span>. Features disabled.
                 <div className="mt-4 pt-4 border-t border-yellow-200 text-sm text-gray-500 flex gap-2">
                   <span className="material-symbols-outlined text-base">code</span>
                   Dev Hint: Application &gt; Cookies
                 </div>
               </div>
             </div>

             {/* Main Content */}
             <div className="flex-1 flex flex-col gap-8 overflow-hidden">
                <div className="grid grid-cols-3 gap-8 shrink-0">
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-sm uppercase font-bold mb-3">System Status</div>
                     <div className="text-green-600 font-bold text-xl flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600"></span> Online</div>
                   </div>
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-sm uppercase font-bold mb-3">Access Level</div>
                     <div className={`${cookieStatus === 'LOCKED' ? 'text-red-500' : 'text-green-500'} font-bold text-xl`}>
                       {cookieStatus === 'LOCKED' ? 'Restricted' : 'Full Control'}
                     </div>
                   </div>
                   <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-sm uppercase font-bold mb-3">Secure Files</div>
                     <div className="text-gray-800 font-bold text-xl">1 Protected File</div>
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col relative overflow-hidden">
                   <div className="px-10 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold text-gray-700 text-xl">Recent Documents</h3>
                     {cookieStatus === 'UNLOCKED' && <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-bold">Admin Mode</span>}
                   </div>
                   
                   <div className="flex-1 overflow-auto">
                     <table className="w-full text-base text-left">
                       <thead className="text-gray-500 bg-gray-50 border-b border-gray-200 sticky top-0">
                         <tr>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">Name</th>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">Owner</th>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">Date</th>
                           <th className="px-10 py-5 font-medium uppercase text-xs tracking-wider">Action</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                             <td className="px-10 py-6 flex items-center gap-4 text-gray-700"><span className="material-symbols-outlined text-blue-400 text-2xl">description</span> safety_protocol_v2.pdf</td>
                             <td className="px-10 py-6 text-gray-500">Staff</td>
                             <td className="px-10 py-6 text-gray-400">Jan 10, 2026</td>
                             <td className="px-10 py-6"><button className="text-blue-600 hover:underline">Download</button></td>
                          </tr>
                          <tr className="bg-red-50/30 hover:bg-red-50/60">
                             <td className="px-10 py-6 flex items-center gap-4 font-bold text-red-900"><span className="material-symbols-outlined text-red-500 text-2xl">lock</span> ritual_plan_final.txt</td>
                             <td className="px-10 py-6 text-gray-600">root</td>
                             <td className="px-10 py-6 text-gray-400">Jan 14, 2026</td>
                             <td className="px-10 py-6">
                               {cookieStatus === 'LOCKED' ? (
                                 <span className="text-gray-400 italic cursor-not-allowed flex items-center gap-2"><span className="material-symbols-outlined text-lg">block</span> Access Denied</span>
                               ) : (
                                 <span className="text-green-600 font-bold flex items-center gap-2 animate-pulse"><span className="material-symbols-outlined text-lg">key</span> Unlockable via Shell</span>
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
         <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Admin Session Verified</h3>
         <div className="w-16 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
         <p className="text-gray-600 mb-10 leading-relaxed text-lg">
           Access to the root file system is restricted on this web interface.<br/>
           You must establish a <strong>secure shell connection</strong> to proceed with file operations.
         </p>
         <button 
           onClick={() => setPhase('WEBSHELL_INFO')}
           className="bg-[#003366] text-white px-10 py-5 rounded-xl font-bold text-lg w-full hover:bg-blue-900 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
         >
           Access Remote Console
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
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">Server Connection Manager</h2>
            <p className="text-gray-400 text-sm">NOD-77 Secure Shell Protocol (SSH) v2.0</p>
          </div>

          <div className="bg-[#252526] text-left p-4 rounded-2xl border-l-8 border-blue-500 text-sm space-y-3 shadow-inner break-words">
            <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2">Protocol Information</h3>
            <p className="text-gray-300 leading-snug">
              <strong className="text-white">Web Shell Deployment:</strong> การเข้าถึงเว็บแบบมาตรฐานไม่เพียงพอสำหรับการจัดการไฟล์ระดับราก "webshell" สร้างสะพานเชื่อมโดยตรงระหว่างเบราว์เซอร์นี้กับเคอร์เนลของเซิร์ฟเวอร์
            </p>
            <p className="text-gray-400 italic text-xs border-t border-gray-700 pt-3 mt-2">
              Warning: Initiating this connection grants direct command-line execution privileges.
            </p>
          </div>

          {!isInstalling ? (
            <button 
              onClick={startInstallation}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all w-full uppercase tracking-widest shadow-md"
            >
              Initialize Connection
            </button>
          ) : (
            <div className="w-full space-y-3">
               <div className="flex justify-between text-xs text-gray-400 font-bold tracking-wider">
                 <span>ESTABLISHING SECURE TUNNEL...</span>
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
บันทึกข้อความลับ - ห้ามเผยแพร่
จาก: ดร. มานัส
ถึง: รองอธิการบดี ธวัต

เรื่อง: แผน B - "พิธีกรรม"

เนื่องจากการทดลองล้มเหลวและงบประมาณหมด เราจึงไม่มีทางเลือกอื่น นักศึกษาทั้ง 3 คนรู้เรื่องการละเมิดกฎความปลอดภัยมากเกินไป

ผมได้จัดฉาก "อุบัติเหตุ" ให้ดูเหมือน "พิธีกรรมสี่ทิศ" โบราณ

- เหยื่อที่ 1: อาคารทิศเหนือ (น้ำ)
- เหยื่อที่ 2: ห้องปฏิบัติการทิศใต้ (ไฟ)
- เหยื่อที่ 3: หอพักทิศตะวันออก (ลม)

นี่จะโยนความผิดไปให้ความเชื่อโชคลางและไอ้แก่โง่คำพัน

โปรดตรวจสอบให้แน่ใจว่ากล้องวงจรปิดปิดอยู่เวลา 03:00 น. ในวันเพ็ญ

            ` 
        }}
      />
    </div>
  );
};

export default AuthzView;