
import React, { useState } from 'react';
import type { CaseStatus, TerminalLine } from '../types';
import StageHeader from '../components/StageHeader';
import Terminal from '../components/Terminal';
import EvidenceModal from '../components/EvidenceModal';

interface CryptoViewProps {
  status: CaseStatus;
  onComplete: () => void;
  onRequestHint: () => void;
}

interface Objective {
  id: number;
  title: string;
  description: string;
  answer: string;
  hint: string;
  isCompleted: boolean;
}

const CryptoView: React.FC<CryptoViewProps> = ({ status, onComplete, onRequestHint }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, type: string, content: string} | null>(null);
  const [, setIsFileLocked] = useState(true);
  
  const [objectives, setObjectives] = useState<Objective[]>([
    { 
      id: 1, 
      title: "Hash Integrity Verification", 
      description: "Identify the hashing algorithm used for the 'payload.bin' integrity check. Look for the OID in the manifest.", 
      answer: "SHA256", 
      hint: "Check the manifest.json file. OIDs starting with 2.16.840.1.101.3.4.2 are SHA series.",
      isCompleted: false 
    },
    { 
      id: 2, 
      title: "Asymmetric: RSA Exponent", 
      description: "Analyze the cert.hex. What is the standard RSA Public Exponent (e) in hex? (Include 0x prefix)", 
      answer: "0x10001", 
      hint: "Most certificates use Fermat Prime F4 as the public exponent. It's 65537 in decimal.",
      isCompleted: false 
    },
    { 
      id: 3, 
      title: "Symmetric: AES-256 Key", 
      description: "Extract the 32-byte hexadecimal key from the 'mem_dump.bin' fragment used for local disk encryption.", 
      answer: "A5B2C3D4E5F67890A1B2C3D4E5F67890", 
      hint: "Search for strings labeled 'SKEY' or patterns of 64 hex characters in the memory dump.",
      isCompleted: false 
    },
    { 
      id: 4, 
      title: "Diffie-Hellman Secret", 
      description: "Calculate the Shared Secret. p=23, g=5, Client Public A=8, Server Secret b=3. Result = (A^b mod p).", 
      answer: "6", 
      hint: "Formula: (8^3) mod 23. 8*8*8 = 512. 512 divided by 23 has a remainder of...?",
      isCompleted: false 
    },
    { 
      id: 5, 
      title: "Digital Signature", 
      description: "The intruder signed the final packet. Submit the final Flag found at the end of the signature block.", 
      answer: "FLAG{CRYPTO_M4STER_091}", 
      hint: "The signature block is in handshake.txt. Look for the ASCII string at the very bottom.",
      isCompleted: false 
    }
  ]);

  const [logs, setLogs] = useState<TerminalLine[]>([
    { timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', content: 'Advanced Cryptographic Analysis Suite v4.0 loaded.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'WARN', content: 'Manifest alert: 5 encrypted blobs detected in target volume.' },
    { timestamp: new Date().toLocaleTimeString(), type: 'INFO', content: 'Initialize analysis by identifying the primary Hashing algorithm.' }
  ]);

  const addLog = (line: TerminalLine) => setLogs(prev => [...prev, line]);

  const handleVerify = () => {
    const currentTask = objectives[currentTaskIndex];
    setIsVerifying(true);
    
    addLog({ timestamp: new Date().toLocaleTimeString(), type: 'EXEC', content: `Computing: ${currentTask.title}...` });

    setTimeout(() => {
      if (inputValue.trim().toUpperCase() === currentTask.answer.toUpperCase()) {
        const updatedObjectives = [...objectives];
        updatedObjectives[currentTaskIndex].isCompleted = true;
        setObjectives(updatedObjectives);
        
        addLog({ timestamp: new Date().toLocaleTimeString(), type: 'SUCCESS', content: `PASSED: ${currentTask.title}` });
        
        if (currentTask.id === 1) setIsFileLocked(false);

        if (currentTaskIndex < objectives.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
          setInputValue('');
          addLog({ timestamp: new Date().toLocaleTimeString(), type: 'TASK', content: `New Objective: ${objectives[currentTaskIndex + 1].title}` });
        } else {
          addLog({ timestamp: new Date().toLocaleTimeString(), type: 'SYSTEM', content: 'Cryptographic perimeter breached. Full session access granted.' });
          setTimeout(onComplete, 1500);
        }
      } else {
        setError(true);
        addLog({ timestamp: new Date().toLocaleTimeString(), type: 'ERR', content: 'Calculation Error: Checksums do not match.' });
        setTimeout(() => setError(false), 2000);
      }
      setIsVerifying(false);
    }, 1200);
  };

  const evidenceFiles = [
    { 
      id: 'manifest', 
      name: 'MANIFEST.JSON', 
      type: 'METADATA_FILE', 
      content: "{\n  \"target\": \"payload.bin\",\n  \"integrity\": {\n    \"algo_oid\": \"2.16.840.1.101.3.4.2.1\",\n    \"friendly_name\": \"SHA256\",\n    \"checksum\": \"e3b0c442...\"\n  }\n}" 
    },
    { 
      id: 'cert', 
      name: 'CERT.HEX', 
      type: 'RSA CERTIFICATE', 
      content: "00000000: 30 82 04 a4 30 82 03 8c  a0 03 02 01 02 02 14 6e  ....0..........n\n00000010: d2 3d 72 d1 a8 d9 04 d8  44 e6 d9 a2 e9 a2 44 e6  .=.r....D.....D.\n...\n[PUBLIC_EXPONENT_BLOCK]\n02 03 01 00 01  <-- RSA_E (65537)\n..." 
    },
    { 
      id: 'handshake', 
      name: 'HANDSHAKE.TXT', 
      type: 'TCP STREAM_LOG', 
      content: "CLIENT_HELLO\nDH_PARAM_P: 23\nDH_PARAM_G: 5\nCLIENT_PUB_A: 8\n...\nSERVER_RESPONSE\nDIGITAL_SIGNATURE: [30 45 02 21 00 a4 b2 ...]\n...\nEOF_MARKER: FLAG{CRYPTO_M4STER_091}" 
    },
    { 
      id: 'mem', 
      name: 'MEM_DUMP.BIN', 
      type: 'MEMORY FRAGMENT', 
      content: "0x7FFF0010: 48 65 6c 6c 6f 20 57 6f 72 6c 64\n0x7FFF0020: 53 4b 45 59 3a 20 41 35 42 32 43 33 44 34 45 35 46 36 37 38 39 30 41 31 42 32 43 33 44 34 45 35 46 36 37 38 39 30\n(Symmetric AES-256 bit key identified above)" 
    }
  ];

  return (
    <div className="h-full flex flex-col bg-background-dark">
      <StageHeader 
        stageName="ADVANCED CRYPTO" 
        stageNumber={1} 
        timer={status.timer} 
        hintsUsed={status.hintsUsed} 
        onRequestHint={onRequestHint}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Objectives */}
        <aside className="w-full lg:w-80 border-r border-border-dark bg-black/40 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Analysis Sequence</h3>
            <span className="text-[10px] font-mono text-primary">{currentTaskIndex + 1}/{objectives.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {objectives.map((obj, idx) => (
              <div 
                key={obj.id} 
                className={`p-4 rounded-lg border transition-all ${obj.isCompleted ? 'bg-primary/5 border-primary/30' : idx === currentTaskIndex ? 'bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-transparent border-transparent opacity-30'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`material-symbols-outlined text-sm ${obj.isCompleted ? 'text-primary' : 'text-gray-500'}`}>
                    {obj.isCompleted ? 'verified' : 'radio_button_unchecked'}
                  </span>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${obj.isCompleted ? 'text-primary' : 'text-white'}`}>{obj.title}</span>
                </div>
                {idx === currentTaskIndex && (
                  <p className="text-[10px] text-gray-400 leading-relaxed italic animate-in fade-in duration-500">{obj.description}</p>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Center Content */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-10 overflow-y-auto min-h-0 bg-cyber-grid bg-[length:30px_30px]">
          {/* Custom File Artifacts Section */}
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {evidenceFiles.map(file => (
              <div 
                key={file.id} 
                onClick={() => setSelectedFile(file)}
                className="relative group cursor-pointer transition-all duration-300 active:scale-95"
              >
                
                {/* Main Content Container */}
                <div className="relative z-10 flex items-center gap-4 pl-16">
                  {/* Square Icon Container */}
                  <div className="size-12 bg-black border border-white/10 rounded flex items-center justify-center relative group-hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-primary text-2xl font-bold">
                      code
                    </span>
                  </div>

                  {/* Labels */}
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                       <h3 className="text-white font-black text-sm tracking-widest uppercase mb-0.5 group-hover:text-primary transition-colors">
                        {file.name}
                      </h3>
                      <p className="text-[9px] font-black tracking-[0.2em] text-gray-500 uppercase leading-none">
                        {file.type}
                      </p>
                    </div>
                    {/* Underline Decorative Element */}
                    <div className="mt-2 h-[2px] w-8 bg-primary/40 group-hover:w-full group-hover:bg-primary transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Analysis Workspace */}
          <div className="glass-panel rounded-2xl flex-1 flex flex-col p-8 md:p-12 relative overflow-hidden bg-black/60 border-white/10 shadow-2xl">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em]">CRYPT_ANALYSIS_ACTIVE</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
                  {objectives[currentTaskIndex].title}
                </h2>
                <p className="text-gray-400 max-w-xl text-sm md:text-base leading-relaxed font-body">
                  {objectives[currentTaskIndex].description}
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors z-20 text-xl">key</span>
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className={`relative z-10 w-full bg-black/90 border-2 ${error ? 'border-danger shadow-[0_0_15px_rgba(255,51,51,0.2)]' : 'border-gray-800 focus:border-primary'} rounded-xl py-6 pl-16 pr-6 text-white font-mono text-lg md:text-xl focus:ring-0 focus:outline-none transition-all placeholder-gray-800 uppercase`}
                    placeholder="ENTER EXTRACTED KEY OR PARAMETER..."
                    disabled={isVerifying}
                  />
                </div>

                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  <button 
                    onClick={handleVerify}
                    disabled={isVerifying || !inputValue}
                    className="flex-1 bg-primary hover:bg-[#1efc7b] disabled:bg-gray-800 disabled:text-gray-500 text-black font-black text-xs uppercase tracking-[0.3em] py-5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 border border-white/20"
                  >
                    {isVerifying ? (
                      <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="material-symbols-outlined font-black">lock_open</span>
                    )}
                    {isVerifying ? 'Verifying...' : 'Validate Cryptographic Token'}
                  </button>
                  <button 
                    onClick={onRequestHint}
                    className="px-6 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    Request Intel
                  </button>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 right-0 p-8 opacity-5 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[300px] text-primary">enhanced_encryption</span>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Terminal */}
        <aside className="w-full lg:w-96 flex flex-col h-[300px] lg:h-full bg-black">
          <Terminal title="CRYPT_TTY_ALPHA" lines={logs} />
        </aside>
      </div>

      <EvidenceModal 
        isOpen={!!selectedFile} 
        onClose={() => setSelectedFile(null)} 
        file={selectedFile} 
      />
    </div>
  );
};

export default CryptoView;
