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
          // หมายเหตุ: ลบ setTimeout ออก เพื่อให้ผู้เล่นกดปุ่มเองใน renderPortalUI
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
      progress += 2; // ความเร็วในการโหลด
      if (progress > 100) progress = 100;
      setInstallProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase('TERMINAL'), 800);
      }
    }, 50);
  };

  // --- LOGIC: TERMINAL ---
  const [logs, setLogs] = useState<string[]>(['NOD-77 Server (Ubuntu 20.04 LTS)', 'Last login: Yesterday from 192.168.1.5']);
  const [input, setInput] = useState('');
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [filePerms, setFilePerms] = useState('----------');
  const [fileOwner, setFileOwner] = useState('manas');

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

    // Command Logic
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
        if (arg1 === 'root' && arg2.startsWith('ritual')) {
            setFileOwner('root');
            addLog('Changed ownership of ritual_plan_final.txt to root');
        } else {
            addLog(`chown: invalid user or file`);
        }
    } else if (cmd === 'chmod') {
        if (fileOwner !== 'root') {
             addLog(`chmod: changing permissions of '${arg2 || arg1}': Operation not permitted`);
        } else if (arg1 === '777' && arg2.startsWith('ritual')) {
                setFilePerms('-rwxrwxrwx');
                addLog('mode of ritual_plan_final.txt changed to 0777 (rwxrwxrwx)');
        } else {
                addLog('chmod: invalid mode or file');
        }
    } else if (cmd === 'date') {
        addLog(`${new Date().toString()}`);
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

  // UI 1: Network Connection
  const renderNetworkUI = () => (
    <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-lg shadow-2xl border border-[#333] overflow-hidden font-sans flex flex-col h-[600px]">
      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-gray-400 text-xs font-medium ml-2">NOD-77 Secure Gateway Client v3.1</span>
        </div>
        <div className="text-xs text-gray-500">Disconnected</div>
      </div>

      <div className="flex flex-1 p-8 gap-8">
        <div className="w-1/3 space-y-6 border-r border-[#333] pr-6">
           <div className="text-center p-6 bg-[#252526] rounded-lg border border-[#333]">
             <div className="w-20 h-20 bg-[#333] rounded-full mx-auto mb-4 flex items-center justify-center">
               <span className="material-symbols-outlined text-4xl text-gray-500">lan</span>
             </div>
             <h2 className="text-gray-200 font-bold mb-1">Internal Lab Network</h2>
             <p className="text-red-400 text-xs font-medium flex items-center justify-center gap-1">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               Connection Failed
             </p>
           </div>

           <div className="space-y-3">
             <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Connection Details</div>
             <div className="flex justify-between text-sm text-gray-400 border-b border-[#333] pb-2">
               <span>Target Host</span>
               <span className="font-mono text-red-400">UNKNOWN</span>
             </div>
             <div className="flex justify-between text-sm text-gray-400 border-b border-[#333] pb-2">
               <span>Port</span>
               <span className="font-mono text-red-400">N/A</span>
             </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black rounded border border-[#333] p-4 font-mono text-xs text-gray-300 overflow-y-auto mb-4">
            {netLogs.map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-gray-600 mr-2">{new Date().toLocaleTimeString()}</span>
                <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('INFO') ? 'text-blue-400' : 'text-gray-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#252526] p-4 rounded border-l-4 border-yellow-600 text-sm">
            <div className="flex items-center gap-2 text-yellow-500 font-bold mb-1">
              <span className="material-symbols-outlined text-lg">build</span>
              <span>Developer Troubleshooting</span>
            </div>
            <p className="text-gray-400">
              Connection blocked by firewall policy. Use browser console to manually override target parameters.
            </p>
            <code className="block mt-2 bg-black p-2 rounded text-gray-300 font-mono text-xs">
              &gt; window.inject_packet("TARGET_IP", "PORT")
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  // UI 2: Lab Portal
  const renderPortalUI = () => (
    <div className="w-full max-w-5xl h-[700px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans relative">
       {/* Fake Browser Toolbar */}
       <div className="bg-[#f3f3f3] border-b border-[#dcdcdc] px-4 py-2 flex items-center gap-4">
         <div className="flex gap-2 text-gray-400">
           <span className="material-symbols-outlined text-lg">arrow_back</span>
           <span className="material-symbols-outlined text-lg">arrow_forward</span>
           <span className="material-symbols-outlined text-lg">refresh</span>
         </div>
         <div className="flex-1 bg-white border border-[#dcdcdc] rounded-md px-3 py-1.5 flex items-center gap-2 text-sm text-gray-600">
           <span className="material-symbols-outlined text-green-600 text-sm">lock</span>
           <span className="font-mono">https://internal-lab.nod77.ac.th/dashboard</span>
         </div>
       </div>

       {/* Web Content */}
       <div className="flex-1 bg-[#f8f9fa] flex flex-col">
          {/* Header */}
          <header className="bg-[#003366] text-white p-6 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2 rounded">
                  <span className="material-symbols-outlined text-3xl">science</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">NOD-77 RESEARCH LABORATORY</h1>
                  <p className="text-xs text-blue-200 uppercase tracking-widest">Internal Data Management System</p>
                </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-medium opacity-80">Current User</div>
                 <div className={`text-lg font-bold ${cookieStatus === 'LOCKED' ? 'text-yellow-400' : 'text-green-400'}`}>
                   {cookieStatus === 'LOCKED' ? 'Guest Visitor' : 'System Administrator'}
                 </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 flex gap-8">
             {/* Sidebar */}
             <div className="w-64 space-y-2">
               <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                 <div className="text-xs font-bold text-gray-400 uppercase mb-4">Navigation</div>
                 <ul className="space-y-3 text-sm text-gray-600">
                   <li className="flex items-center gap-3 font-bold text-[#003366]"><span className="material-symbols-outlined">dashboard</span> Dashboard</li>
                   <li className="flex items-center gap-3 opacity-50 cursor-not-allowed"><span className="material-symbols-outlined">folder</span> Projects</li>
                 </ul>
               </div>

               {/* Cookie Hint Panel */}
               <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-xs text-yellow-800">
                 <strong>System Notification:</strong><br/>
                 You are viewing this page as a <span className="font-bold underline">Guest</span>. 
                 <div className="mt-2 pt-2 border-t border-yellow-200 text-[10px] text-gray-500">
                   Dev Hint: Check Application &gt; Cookies
                 </div>
               </div>
             </div>

             {/* Main Content */}
             <div className="flex-1 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-xs uppercase font-bold mb-2">Access Level</div>
                     <div className={`${cookieStatus === 'LOCKED' ? 'text-red-500' : 'text-green-500'} font-bold`}>
                       {cookieStatus === 'LOCKED' ? 'Restricted (Read-Only)' : 'Full Control'}
                     </div>
                   </div>
                   <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                     <div className="text-gray-500 text-xs uppercase font-bold mb-2">Secure Files</div>
                     <div className="text-gray-800 font-bold">1 Protected File</div>
                   </div>
                </div>

                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden flex-1 relative">
                   <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold text-gray-700">Recent Documents</h3>
                     {cookieStatus === 'UNLOCKED' && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Admin Mode</span>}
                   </div>
                   
                   <table className="w-full text-sm text-left">
                     <thead className="text-gray-500 bg-gray-50 border-b border-gray-200">
                       <tr>
                         <th className="px-6 py-3 font-medium">Name</th>
                         <th className="px-6 py-3 font-medium">Owner</th>
                         <th className="px-6 py-3 font-medium">Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="bg-red-50/50">
                         <td className="px-6 py-4 flex items-center gap-2 font-medium text-red-900">
                           <span className="material-symbols-outlined text-red-500">lock</span>
                           ritual_plan_final.txt
                         </td>
                         <td className="px-6 py-4 text-gray-500">root</td>
                         <td className="px-6 py-4">
                           {cookieStatus === 'LOCKED' ? (
                             <span className="text-gray-400 italic cursor-not-allowed flex items-center gap-1">
                               <span className="material-symbols-outlined text-xs">block</span> Access Denied
                             </span>
                           ) : (
                             <span className="text-green-600 font-bold flex items-center gap-1 animate-pulse">
                               <span className="material-symbols-outlined text-xs">key</span> Unlockable via Shell
                             </span>
                           )}
                         </td>
                       </tr>
                     </tbody>
                   </table>

                   {/* Overlay: Admin Unlocked (Manual Click Required) */}
                   {cookieStatus === 'UNLOCKED' && (
                     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
                       <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md">
                         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Session Verified</h3>
                         <p className="text-gray-600 text-sm mb-6">
                           Root file system access is not available via web interface. 
                           Please use the remote terminal for file operations.
                         </p>
                         <button 
                           onClick={() => setPhase('WEBSHELL_INFO')}
                           className="bg-[#003366] text-white px-6 py-3 rounded font-bold text-sm w-full hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                         >
                           Access Remote Console
                           <span className="material-symbols-outlined text-sm">terminal</span>
                         </button>
                       </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  // UI 3: Webshell Installer (Clean & Educational)
  const renderWebShellInfo = () => (
    <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl border border-gray-700 p-8 font-mono animate-in zoom-in duration-300">
       <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-6">
             <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                <span className="material-symbols-outlined text-4xl text-white">dns</span>
             </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Server Connection Manager</h2>
            <p className="text-gray-400 text-xs">NOD-77 Secure Shell Protocol (SSH) v2.0</p>
          </div>

          <div className="bg-[#252526] text-left p-4 rounded border-l-4 border-blue-500 text-sm space-y-2">
            <h3 className="text-blue-400 font-bold uppercase text-xs tracking-wider mb-2">Protocol Information</h3>
            <p className="text-gray-300">
              <strong className="text-white">Web Shell Deployment:</strong> Since standard access is restricted, a "Web Shell" script acts as a bridge between this browser and the server's operating system kernel.
            </p>
            <p className="text-gray-400 italic text-xs border-t border-gray-700 pt-2 mt-2">
              Warning: Initiating this connection grants direct command-line execution privileges.
            </p>
          </div>

          {!isInstalling ? (
            <button 
              onClick={startInstallation}
              className="bg-blue-600 text-white px-8 py-3 rounded font-bold text-sm hover:bg-blue-500 transition-colors w-full uppercase tracking-widest shadow-lg"
            >
              Initialize Connection
            </button>
          ) : (
            <div className="w-full mx-auto space-y-3 text-left">
               <div className="flex justify-between text-xs text-gray-400 font-bold">
                 <span>ESTABLISHING SECURE TUNNEL...</span>
                 <span>{installProgress}%</span>
               </div>
               <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 transition-all duration-75" style={{width: `${installProgress}%`}}></div>
               </div>
               <div className="h-20 bg-black p-2 font-mono text-[10px] text-green-400 overflow-hidden border border-gray-800 rounded">
                 <div>&gt; Resolving host... OK</div>
                 {installProgress > 20 && <div>&gt; Authenticating with admin token... OK</div>}
                 {installProgress > 50 && <div>&gt; Uploading shell payload... DONE</div>}
                 {installProgress > 80 && <div>&gt; Starting interactive session...</div>}
               </div>
            </div>
          )}
       </div>
    </div>
  );

  // UI 4: Terminal (Standard Ubuntu Style)
  const renderTerminalUI = () => (
    <div className="w-full max-w-5xl h-[600px] bg-[#300a24] rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono text-sm border border-gray-700">
      <div className="bg-[#3e3e3e] px-4 py-2 flex items-center justify-between border-b border-black">
        <div className="text-gray-300 text-xs">root@nod-77: ~</div>
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full bg-orange-500"></div>
           <div className="w-3 h-3 rounded-full bg-gray-500"></div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto text-white">
         {logs.map((l, i) => (
           <div key={i} className="mb-1 break-words">{l}</div>
         ))}
         <div ref={terminalRef}></div>
         <form onSubmit={handleCommand} className="flex gap-2 mt-2">
           <span className="text-green-400 font-bold">root@nod-77:~#</span>
           <input 
             autoFocus
             value={input}
             onChange={e => setInput(e.target.value)}
             className="flex-1 bg-transparent outline-none text-white border-none p-0 focus:ring-0"
           />
         </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
      <div className="w-full mb-6 max-w-5xl">
         <StageHeader 
            stageName={phase === 'NETWORK' ? 'SECURE GATEWAY' : phase === 'COOKIE' ? 'INTERNAL PORTAL' : 'ROOT SHELL'} 
            stageNumber={2} 
            timer={status.timer} 
            hintsUsed={status.hintsUsed} 
            onRequestHint={onRequestHint} 
        />
      </div>

      {phase === 'NETWORK' && renderNetworkUI()}
      {phase === 'COOKIE' && renderPortalUI()}
      {phase === 'WEBSHELL_INFO' && renderWebShellInfo()}
      {phase === 'TERMINAL' && renderTerminalUI()}

      <EvidenceModal 
        isOpen={evidenceOpen}
        onClose={onComplete}
        file={{
            name: 'ritual_plan_final.txt',
            type: 'CONFIDENTIAL',
            content: `
CONFIDENTIAL MEMO - DO NOT DISTRIBUTE
FROM: Dr. Manas
TO: Vice Rector Thawat

SUBJECT: PLAN B - "THE RITUAL"

As the experiment failed and the budget is gone, we have no choice. The 3 students know too much about the safety violations.

I have arranged the "Accident" to look like the ancient "Four Directions Ritual".
- Victim 1: North Building (Water)
- Victim 2: South Lab (Fire)
- Victim 3: East Dorm (Wind)

This will shift the blame to superstition and that old fool Kham Pan.
Ensure the security cameras are OFF at 03:00 AM on the day of the Full Moon.
            ` 
        }}
      />
    </div>
  );
};

export default AuthzView;