
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl glass-panel rounded-xl flex flex-col h-[70vh] animate-zoom-in shadow-[0_0_100px_rgba(0,0,0,0.5)] border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black px-6 py-4 border-b border-primary/20 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">description</span>
            <div>
              <h3 className="text-white font-mono text-sm font-bold tracking-tight">{file.name}</h3>
              <p className="text-[9px] text-primary/60 font-mono tracking-widest uppercase">{file.type}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 p-8 overflow-y-auto bg-black/40 font-mono text-[12px] leading-relaxed text-gray-400 selection:bg-primary selection:text-black scroll-smooth italic">
          <pre className="whitespace-pre-wrap">{file.content}</pre>
        </div>
        <div className="p-4 bg-black border-t border-primary/20 flex justify-end gap-4 rounded-b-xl">
          <div className="mr-auto flex items-center gap-2 text-[9px] text-gray-600 font-mono uppercase font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            ARTIFACT_AUTHENTICITY_VERIFIED
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-primary/40 hover:border-primary text-primary/60 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 rounded"
          >
            Close Artifact
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default EvidenceModal;
