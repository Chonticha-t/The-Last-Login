
import React from 'react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    content: string;
    type: string;
  } | null;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, file }) => {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 animate-in zoom-in duration-200">
      <div className="w-full max-w-3xl glass-panel rounded-xl flex flex-col h-[70vh]">
        <div className="bg-black px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-cyan">description</span>
            <div>
              <h3 className="text-white font-mono text-sm font-bold">{file.name}</h3>
              <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">{file.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 p-8 overflow-y-auto bg-black/40 font-mono text-[12px] leading-relaxed text-gray-400 selection:bg-accent-cyan selection:text-black">
          <pre className="whitespace-pre-wrap">{file.content}</pre>
        </div>
        <div className="p-4 bg-black border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-700 hover:border-white text-gray-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            Close Artifact
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
