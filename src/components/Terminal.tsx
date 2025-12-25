
import React, { useEffect, useRef } from 'react';
import { type TerminalLine } from '../types';

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
      case 'LOAD': return 'text-accent-cyan';
      case 'WARN': return 'text-accent-yellow';
      case 'ERR': return 'text-danger';
      case 'SUCCESS': return 'text-primary';
      case 'EXEC': return 'text-white';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      <div className="bg-black/80 px-4 py-2 flex items-center gap-2 border-b border-gray-800">
        <span className="material-symbols-outlined text-gray-500 text-sm">terminal</span>
        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{title}</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-danger/20 border border-danger"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow/20 border border-accent-yellow"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary"></div>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto bg-black/60 selection:bg-primary selection:text-black"
      >
        <div className="text-gray-600 mb-2 italic">Session established via secure TTY. Accessing encrypted buffer...</div>
        {lines.map((line, idx) => (
          <div key={idx} className="mb-1.5 animate-in fade-in duration-300">
            <span className="text-gray-600 mr-2">[{line.timestamp}]</span>
            <span className={`font-bold mr-2 ${getTypeColor(line.type)}`}>{line.type}:</span>
            <span className="text-gray-300">{line.content}</span>
            {line.details && (
              <div className="pl-[75px] text-gray-500 mt-0.5 break-all">
                {line.details}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-primary font-bold">root@forensics:~#</span>
          <span className="w-2 h-4 bg-primary animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
