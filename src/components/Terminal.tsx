
import React, { useEffect, useRef } from 'react';
import type { TerminalLine } from '../types';

interface TerminalProps {
  title: string;
  lines: TerminalLine[];
}

const Terminal: React.FC<TerminalProps> = ({ title, lines }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SYSTEM': return 'text-primary';
      case 'LOAD': return 'text-red-400';
      case 'WARN': return 'text-accent-yellow';
      case 'ERR': return 'text-primary font-bold';
      case 'SUCCESS': return 'text-green-500';
      case 'EXEC': return 'text-white font-medium';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden border-2 border-border-dark shadow-2xl font-mono text-left">
      <div className="bg-black/95 px-6 py-3 flex items-center gap-3 border-b-2 border-border-dark">
        <span className="material-symbols-outlined text-primary text-lg font-black italic">terminal</span>
        <span className="text-xs font-black text-primary uppercase tracking-widest">{title}</span>
        <div className="ml-auto flex gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-border-dark border-2 border-border-dark"></div>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-6 text-[12px] leading-relaxed overflow-y-auto bg-black/90 selection:bg-primary selection:text-black"
      >
        <div className="text-primary/40 mb-4 font-bold tracking-tight">RESTRICTED_TERMINAL_V5.0 // ENCRYPTION: ACTIVE</div>
        {lines.map((line, idx) => (
          <div key={idx} className="mb-2 animate-in fade-in duration-300">
            <span className="text-gray-700 mr-3 font-medium">[{line.timestamp}]</span>
            <span className={`font-black mr-3 ${getTypeColor(line.type)}`}>{line.type}:</span>
            <span className="text-gray-300 font-medium">{line.content}</span>
            {line.details && (
              <div className="pl-[85px] text-gray-600 mt-1 break-all text-[11px] italic">
                {line.details}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 mt-6">
          <span className="text-primary font-black">onyx@forensics:~#</span>
          <span className="w-2.5 h-5 bg-primary animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
